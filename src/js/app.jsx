var Qafoo = Qafoo || {QA: {}};

(function () {
    "use strict";

    if (!(
        Qafoo.QA.Data &&
        Qafoo.QA.Loader &&
        Qafoo.QA.Overview &&
        Qafoo.QA.Modules.Metrics &&
        Qafoo.QA.Modules.Dummy &&
        ReactRouter.Route &&
        Bootstrap.ProgressBar &&
        Bootstrap.Navigation &&
        Bootstrap.NavLink
    )) {
        throw "Some application components were not correctly loaded.";
    }

    Qafoo.QA.App = React.createClass({
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

            var modules = {};
            if (Qafoo.QA.Data.analyzers.pdepend) modules.pdepend = "Metrics";
            if (Qafoo.QA.Data.analyzers.dependencies) modules.dependencies = "Dependencies";
            if (Qafoo.QA.Data.analyzers.phpmd) modules.phpmd = "Mess Detector";
            if (Qafoo.QA.Data.analyzers.tests) modules.tests = "Tests";
            if (Qafoo.QA.Data.analyzers.cpd) modules.cpd = "Copy & Paste";

            return (<div className="loaded">
                <Bootstrap.Navigation brand="Quality Analyzer" brandLink="overview" items={modules} />

                <div className="container">
                    <ReactRouter.RouteHandler parameters={this.props.parameters} data={Qafoo.QA.Data.analyzers} />
                </div>
            </div>);
        }
    });

    var routes = (
        <ReactRouter.Route name="overview" handler={Qafoo.QA.App} path="/">
            <ReactRouter.DefaultRoute handler={Qafoo.QA.Overview} />
            <ReactRouter.NotFoundRoute handler={Qafoo.QA.Overview}/>

            <ReactRouter.Route name="pdepend" handler={Qafoo.QA.Modules.Metrics} />
            <ReactRouter.Route name="dependencies" handler={Qafoo.QA.Modules.Dummy} />
            <ReactRouter.Route name="phpmd" handler={Qafoo.QA.Modules.Dummy} />
            <ReactRouter.Route name="tests" handler={Qafoo.QA.Modules.Dummy} />
            <ReactRouter.Route name="cpd" handler={Qafoo.QA.Modules.Dummy} />
        </ReactRouter.Route>
    );

    ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Router, state) {
        React.render(
            <Router parameters={state.parameters} />,
            document.getElementById('content')
        )
    });
})();
