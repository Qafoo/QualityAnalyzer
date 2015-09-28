var Qafoo = Qafoo || {QA: {}};

(function () {
    "use strict";

    if (!(
        Qafoo.QA.Data &&
        Qafoo.QA.Loader &&
        Qafoo.QA.Overview &&
        Qafoo.QA.Modules.Metrics &&
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

            return (<div className="loaded">
                <Bootstrap.Navigation brand="Quality Analyzer" brandLink="overview" items={{
                    metrics: "Metrics"
                }} />

                <div className="container">
                    <ReactRouter.RouteHandler />
                </div>
            </div>);
        }
    });

    var routes = (
        <ReactRouter.Route name="overview" handler={Qafoo.QA.App} path="/">
            <ReactRouter.DefaultRoute handler={Qafoo.QA.Overview} />
            <ReactRouter.NotFoundRoute handler={Qafoo.QA.Overview}/>

            <ReactRouter.Route name="metrics" handler={Qafoo.QA.Modules.Metrics} />
        </ReactRouter.Route>
    );

    ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Router, state) {
        React.render(
            <Router parameters={state.parameters} />,
            document.getElementById('content')
        )
    });
})();
