var Qafoo = Qafoo || {QA: {}};

(function () {
    "use strict";

    if (!(
        Qafoo.QA.Data &&
        Qafoo.QA.Loader &&
        Qafoo.QA.Overview &&
        Qafoo.QA.Modules.Metrics &&
        ReactRouter.Route &&
        Bootstrap
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
                <nav className="navbar navbar-inverse navbar-fixed-top">
                    <div className="container">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <ReactRouter.Link className="navbar-brand" to="overview">Quality Analyzer</ReactRouter.Link>
                        </div>
                        <div id="navbar" className="collapse navbar-collapse">
                            <ul className="nav navbar-nav">
                                <li><ReactRouter.Link to="metrics">Metrics</ReactRouter.Link></li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <div className="container">
                    <ReactRouter.RouteHandler />
                </div>
            </div>);
        }
    });

    var routes = (
        <ReactRouter.Route name="overview" handler={Qafoo.QA.App} path="/">
            <ReactRouter.DefaultRoute handler={Qafoo.QA.Overview} />
            <ReactRouter.Route name="metrics" handler={Qafoo.QA.Modules.Metrics} />
            <ReactRouter.NotFoundRoute handler={Qafoo.QA.Overview}/>
        </ReactRouter.Route>
    );

    ReactRouter.run(routes, ReactRouter.HistoryLocation, function (Router, state) {
        React.render(
            <Router parameters={state.parameters} />,
            document.getElementById('content')
        )
    });
})();
