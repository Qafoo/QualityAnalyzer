import React from 'react';
import {render} from 'react-dom';
import {Router, Route, RouteHandler, IndexRoute} from 'react-router';
import createHistory from 'history/lib/createBrowserHistory';
import useQueries from 'history/lib/useQueries';

import Loader from "./loader.jsx";
import Overview from "./overview.jsx";
import Source from "./source.jsx";

import Metrics from "./modules/metrics.jsx";
import Dependencies from "./modules/dependencies.jsx";
import PHPMD from "./modules/phpmd.jsx";
import Tests from "./modules/tests.jsx";
import Checkstyle from "./modules/checkstyle.jsx";
import CPD from "./modules/cpd.jsx";
import PhpLoc from "./modules/phploc.jsx";

import Navigation from "./bootstrap/navigation.jsx";

let App = React.createClass({

    navigation: [
        {   path: "source",
            name: "Source",
            icon: "glyphicon glyphicon-folder-open"
        },
        {   path: "phploc",
            name: "Size",
            icon: "glyphicon glyphicon-scale",
            analyzer: true
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
        {   path: "checkstyle",
            name: "Checkstyle",
            icon: "glyphicon glyphicon-erase",
            analyzer: true
        },
        {   path: "cpd",
            name: "Copy & Paste",
            icon: "glyphicon glyphicon-duplicate",
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
            <Navigation brand="Quality Analyzer" brandLink="/" items={modules} />

            {!this.props.children ? '' :
            <div className="container">
                {React.cloneElement(this.props.children, {data: data, query: this.props.location.query, params: this.props.params})}
            </div>}
        </div>);
    }
});

let history = useQueries(createHistory)();

render(
    (<Router history={history}>
        <Route path="/" component={App}>
            <IndexRoute component={Overview} />

            <Route name="source" path="source" component={Source} />
            <Route name="phploc" path="phploc" component={PhpLoc} />
            <Route name="pdepend" path="pdepend" component={Metrics} />
            <Route name="dependencies" path="dependencies" component={Dependencies} />
            <Route name="phpmd" path="phpmd" component={PHPMD} />
            <Route name="tests" path="tests" component={Tests} />
            <Route name="checkstyle" path="checkstyle" component={Checkstyle} />
            <Route name="cpd" path="cpd" component={CPD} />

            <Route path="*" component={Overview} />
        </Route>
    </Router>),
    document.getElementById('content')
);
