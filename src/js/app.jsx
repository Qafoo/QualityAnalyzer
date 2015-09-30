var Qafoo = Qafoo || {QA: {}};

(function () {
    "use strict";

    Qafoo.QA.App = React.createClass({

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
                initialized: false
            };
        },

        setInitialized: function(initialized) {
            this.setState({
                initialized: !!initialized
            });
        },

        render: function() {
            if (!this.state.initialized) {
                return (<div className="container">
                    <Qafoo.QA.Loader onComplete={this.setInitialized} />
                </div>);
            }

            var modules = [];
            for (var i = 0; i < this.navigation.length; ++i) {
                if (!this.navigation[i].analyzer ||
                    Qafoo.QA.Data.analyzers[this.navigation[i].path]) {
                    modules.push(this.navigation[i]);
                }
            }

            return (<div className="loaded">
                <Bootstrap.Navigation brand="Quality Analyzer" brandLink="overview" items={modules} />

                <div className="container">
                    <ReactRouter.RouteHandler parameters={this.props.parameters} query={this.props.query} data={Qafoo.QA.Data} />
                </div>
            </div>);
        }
    });

    var routes = (
        <ReactRouter.Route name="overview" handler={Qafoo.QA.App} path="/">
            <ReactRouter.DefaultRoute handler={Qafoo.QA.Overview} />
            <ReactRouter.NotFoundRoute handler={Qafoo.QA.Overview}/>

            <ReactRouter.Route name="source" path="/source" handler={Qafoo.QA.Source} />
            <ReactRouter.Route name="source_with_path" path="/source/*" handler={Qafoo.QA.Source} />
            <ReactRouter.Route name="pdepend" handler={Qafoo.QA.Modules.Metrics} />
            <ReactRouter.Route name="dependencies" handler={Qafoo.QA.Modules.Dependencies} />
            <ReactRouter.Route name="phpmd" handler={Qafoo.QA.Modules.Dummy} />
            <ReactRouter.Route name="tests" handler={Qafoo.QA.Modules.Dummy} />
            <ReactRouter.Route name="cpd" handler={Qafoo.QA.Modules.Dummy} />
        </ReactRouter.Route>
    );

    ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Router, state) {
        React.render(
            <Router parameters={state.params} query={state.query} />,
            document.getElementById('content')
        )
    });
})();
