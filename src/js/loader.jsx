import React from "react"

import ProgressBar from "./bootstrap/progressbar.jsx"
import jQuery from "jquery"

import xml2js from 'xml2js'

let Loader = React.createClass({
    propTypes: {
        onComplete: React.PropTypes.func.isRequired,
    },

    getInitialState: function () {
        return {
            error: null,
            done: false,
            progress: 0,
        }
    },

    componentDidMount: function () {
        jQuery.ajax({
            dataType: "json",
            url: "data/project.json",
            success: this.loadProjectData,
            error: (function (jqXHR, textStatus, errorThrown) {
                this.setState({
                    error: "Could not find project.json. Run `bin/analyze analyze path/t/source` and reload.",
                })
            }).bind(this),
        })
    },

    advanceProgress: function (step) {
        this.setState({ progress: this.state.progress + step })
    },

    loadProjectData: function (projectData) {
        var data = projectData
        var defaults = {
            type: "GET",
            cache: false,
            dataType: "text",
        }
        var step = 100 / Object.keys(data.analyzers).length
        var deferreds = jQuery.map(data.analyzers, (function (file, analyzer) {
            return jQuery.ajax(
                jQuery.extend({ url: "data/" + file }, defaults)
            ).pipe((function (analyzerData, status, request) {
                var contentType = request.getResponseHeader('Content-Type')
                var deferred = jQuery.Deferred()

                switch (contentType) {
                case 'text/xml':
                case 'application/xml':
                    var parser = new xml2js.Parser()

                    this.advanceProgress(step / 2)
                    parser.parseString(analyzerData, function (error, result) {
                        if (error) {
                            deferred.reject(error)
                        }
                        deferred.resolve(result)
                    })
                    break

                case 'application/json':
                    let result = JSON.parse(analyzerData)
                    if (!result) {
                        deferred.reject("Error parsing JSON")
                    } else {
                        deferred.resolve(result)
                    }
                    break

                default:
                    console.error("Cannot handle data of type " + contentType + " while loading " + file)
                }

                return deferred.promise()
            }).bind(this)).pipe((function (result) {
                data.analyzers[analyzer] = result
                this.advanceProgress(step / 2)
                return data
            }).bind(this))
        }).bind(this))

        jQuery.when(...deferreds)
            .done((function () {
                this.setState({ done: true, progress: 100 })
                if (this.props.onComplete) {
                    this.props.onComplete(data)
                }
            }).bind(this)).fail((function (error) {
                this.setState({ error: "Failed loading file: " + error })
            }).bind(this))
    },

    render: function () {
        var stateIcon = this.state.done ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-hourglass'

        return (<div className="row">
            <div className="col-md-6 col-md-offset-3">
                <h1>Qafoo Quality Analyzer</h1>
                <div className="well">
                    <p>
                        <span className="glyphicon glyphicon-ok"></span>
                        Initializing application
                    </p>
                    <p>
                        <span className={stateIcon}></span>
                        Loading data
                    </p>
                    <ProgressBar progress={this.state.progress} />
                    {!this.state.error ? '' :
                    <div className="alert alert-danger">
                        {this.state.error}
                    </div>}
                </div>
            </div>
        </div>)
    },
})

export default Loader
