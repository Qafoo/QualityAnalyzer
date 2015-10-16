import React from "react";

import ProgressBar from "./bootstrap/progressbar.jsx";
import jQuery from "jquery";

import xml2js from 'xml2js';

let Loader = React.createClass({
    getInitialState: function() {
        return {
            error: null,
            done: false,
            progress: 0
        };
    },

    advanceProgress: function(step) {
        this.setState({
            progress: this.state.progress + step
        });
    },
    
    loadProjectData: function(projectData) {
        var data = projectData,
            component = this,
            defaults = {
                type: "GET",
                cache: false,
                dataType: "text"
            },
            step = 100 / Object.keys(data.analyzers).length,
            deferreds = jQuery.map(data.analyzers, function(file, analyzer) {
                return jQuery.ajax(
                    jQuery.extend({
                            url: "/data/" + file,
                        },
                        defaults
                    )
                ).pipe(function(analyzerData) {
                    var deferred = jQuery.Deferred(),
                        parser = new xml2js.Parser();

                    parser.parseString(analyzerData, function(error, result) {
                        if (error) {
                            deferred.reject(error);
                        }
                        deferred.resolve(result);
                    });

                    return deferred.promise();
                }).pipe(function(result) {
                    data.analyzers[analyzer] = result;
                    component.advanceProgress(step);
                    return data;
                });
            });

        jQuery.when.apply(jQuery, deferreds)
            .done(function() {
                component.setState({done: true, progress: 100});
                if (component.props.onComplete) {
                    component.props.onComplete(data);
                }
            }).fail(function(error) {
                component.setState({
                    error: "Failed loading file: " + error
                });
            });
    },

    componentDidMount: function() {
        var component = this;

        jQuery.ajax({
            dataType: "json",
            url: "/data/project.json",
            success: this.loadProjectData,
            error: function(jqXHR, textStatus, errorThrown) {
                component.setState({
                    error: "Could not find project.json. Run `bin/analyze analyze path/t/source` and reload."
                });
            }
        });
    },

    render: function() {
        var stateIcon = this.state.done ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-hourglass';

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
                    { !this.state.error ? '' :
                    <div className="alert alert-danger">
                        {this.state.error}
                    </div>}
                </div>
            </div>
        </div>);
    }
});

export default Loader; 
