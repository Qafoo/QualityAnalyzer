var Qafoo = Qafoo || {QA: {}};
Qafoo.QA.Modules = Qafoo.QA.Modules || {};

(function () {
    "use strict";

    Qafoo.QA.Modules.Dependencies = React.createClass({

        model: new Qafoo.QA.Modules.DependenciesModel(),

        getInitialState: function() {
            return {
                leaves: [],
                initialized: false
            };
        },

        getChartElement: function() {
            return document.getElementById('dependency-chart');
        },

        unfoldLeave: function(leave) {
            this.model.findAndUnfold(leave.id);
            this.setState({
                leaves: this.model.getLeaves(),
            });
        },

        componentDidMount: function() {
            Qafoo.QA.Modules.DependenciesChart.create(this.getChartElement(), this.unfoldLeave, this.getChartState());
        },

        componentDidUpdate: function() {
            Qafoo.QA.Modules.DependenciesChart.update(this.getChartElement(), this.getChartState());
        },

        getChartState: function() {
            if (!this.state.initialized) {
                this.model.calculateDependencyTree(this.props.data.analyzers.dependencies.dependencies);

                this.setState({
                    leaves: this.model.getLeaves(),
                    initialized: true
                });
            }

            return {
                leaves: this.state.leaves,
                links: this.model.calculateDependencies(this.state.leaves)
            };
        },

        componentWillUnmount: function() {
            Qafoo.QA.Modules.DependenciesChart.destroy(this.getChartElement());
        },

        render: function() {
            return (<div className="row">
                <div className="col-md-12">
                    <div id="dependency-chart"></div>
                </div>
            </div>);
        }
    });
})();
