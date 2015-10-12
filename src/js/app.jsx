import React from 'react';
import Router from 'react-router';

import Loader from "./loader.jsx";
import Overview from "./overview.jsx";

import Navigation from "./bootstrap/navigation.jsx";

let App = React.createClass({

    navigation: [
        {   path: "source",
            name: "Source",
            icon: "glyphicon glyphicon-folder-open"
        },
        {   path: "pdepend",
            name: "Metrics",
            icon: "glyphicon glyphicon-stats",
            analyzer: true
        },
        {   path: "dependencies",
            name: "Dependencies",
            icon: "glyphicon glyphicon-retweet",
            analyzer: true
        },
        {   path: "phpmd",
            name: "Mess Detector",
            icon: "glyphicon glyphicon-trash",
            analyzer: true
        },
        {   path: "tests",
            name: "Tests",
            icon: "glyphicon glyphicon-thumbs-up",
            analyzer: true
        },
        {   path: "cpd",
            name: "Copy & Paste",
            icon: "glyphicon glyphicon-paste",
            analyzer: true
        }
    ],

    getInitialState: function() {
        return {
            initialized: false,
            data: {
                analyzers: {}
            }
        };
    },

    setInitialized: function(data) {
        this.setState({
            initialized: true,
            data: data
        });
    },

    render: function() {
        if (!this.state.initialized) {
            return (<div className="container">
                <Loader onComplete={this.setInitialized} />
            </div>);
        }

        var modules = [],
            data = this.state.data;

        for (var i = 0; i < this.navigation.length; ++i) {
            if (!this.navigation[i].analyzer ||
                data.analyzers[this.navigation[i].path]) {
                modules.push(this.navigation[i]);
            }
        }

        return (<div className="loaded">
            <Navigation brand="Quality Analyzer" brandLink="overview" items={modules} />

            <div className="container">
                <Router.RouteHandler parameters={this.props.parameters} query={this.props.query} data={data} />
            </div>
        </div>);
    }
});

var routes = (
    <Router.Route name="overview" handler={App} path="/">
        <Router.DefaultRoute handler={Overview} />
        <Router.NotFoundRoute handler={Overview}/>

    {/*
        <Router.Route name="source" path="/source" handler={Source} />
        <Router.Route name="source_with_path" path="/source/*" handler={Source} />
        <Router.Route name="pdepend" handler={Modules.Metrics} />
        <Router.Route name="dependencies" handler={Modules.Dependencies} />
        <Router.Route name="phpmd" handler={Modules.Dummy} />
        <Router.Route name="tests" handler={Modules.Dummy} />
        <Router.Route name="cpd" handler={Modules.Dummy} />
    */}
    </Router.Route>
);

Router.run(routes, Router.HistoryLocation, function (Router, state) {
    React.render(
        <Router parameters={state.params} query={state.query} />,
        document.getElementById('content')
    )
});
