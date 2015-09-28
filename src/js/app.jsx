var Qafoo = Qafoo || {QA: {}};

(function () {
    "use strict";

    if (!(Qafoo.QA.Data && Qafoo.QA.Loader)) {
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
            return (<div className="container">
                { !this.state.initialized ?
                    (<Qafoo.QA.Loader onComplete={this.setInitialized} />) :
                    <h1>Hello!</h1>
                }
            </div>);
        }
    });

    React.render(
        <Qafoo.QA.App />,
        document.getElementById('content')
    );
})();
