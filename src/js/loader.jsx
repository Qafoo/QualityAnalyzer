import React from "react";

import ProgressBar from "./bootstrap/progressbar.jsx";
import jQuery from "jquery";

import xml2js from 'xml2js';

let Loader = React.createClass({
    getInitialState: function() {
        return {
            done: false,
            progress: 0
        };
    },

    advanceProgress: function(step) {
        this.setState({
            progress: this.state.progress + step
        });
    },

    componentDidMount: function() {
        var component = this,
            parser = new xml2js.Parser(),
            data = {};

        jQuery.getJSON("/data/project.json", null, function(projectData) {
            data = projectData;

            var defaults = {
                    type: "GET",
                    cache: false
                },
                step = 100 / Object.keys(data.analyzers).length,
                deferreds = jQuery.map(data.analyzers, function(file, analyzer) {
                    return jQuery.ajax(
                        jQuery.extend({
                                url: "/data/" + file,
                                success: function(analyzerData) {
                                    data.analyzers[analyzer] = parser.parseString(analyzerData, {attrkey: "@"});
                                    component.advanceProgress(step);
                                }
                            },
                            defaults
                        )
                    );
                });

            jQuery.when.apply(jQuery, deferreds).then(function() {
                component.setState({done: true, progress: 100});
                if (component.props.onComplete) {
                    component.props.onComplete(data);
                }
            });
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
                </div>
            </div>
        </div>);
    }
});

export default Loader; 
