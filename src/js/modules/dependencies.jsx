var Qafoo = Qafoo || {QA: {}};
Qafoo.QA.Modules = Qafoo.QA.Modules || {};

(function () {
    "use strict";

    Qafoo.QA.Modules.Dependencies = React.createClass({
        dependencyTree: {
            name: "/",
            type: "package",
            children: {}
        },

        getInitialState: function() {
            return {
                displayTree: {}
            };
        },

        addTypeWithDependencies: function(type, dependencies) {
            var components = type.split("\\"),
                treeReference = this.dependencyTree;

            for (var i = 0; i < components.length; ++i) {
                var component = components[i];

                if (!treeReference.children[component]) {
                    treeReference.children[component] = {
                        name: component,
                        type: "package",
                        children: {}
                    }
                }

                treeReference = treeReference.children[component];
            }

            treeReference.type = "type";
            treeReference.efferent = $.map(dependencies, function(type) {
                if (type[0] === "\\") {
                    type = type.substring(1);
                }

                return [type.split("\\")];
            });
        },

        calculateDependencyTree: function(dependencies) {
            for (var i = 0; i < dependencies.package.length; ++i) {
                var namespace = dependencies.package[i];

                for (var j = 0; j < namespace.class.length; ++j) {
                    var type = namespace.class[j];

                    if (!type.efferent) {
                        this.addTypeWithDependencies(namespace["@name"] + "\\" + type["@name"], []);
                    } else if (type.efferent.type instanceof Array) {
                        this.addTypeWithDependencies(
                            namespace["@name"] + "\\" + type["@name"],
                            $.map(type.efferent.type, function(target) {
                                return target["@namespace"] + "\\" + target["@name"];
                            })
                        );
                    } else {
                        this.addTypeWithDependencies(
                            namespace["@name"] + "\\" + type["@name"],
                            [type.efferent.type["@namespace"] + "\\" + type.efferent.type["@name"]]
                        );
                    }
                }
            }
        },

        getChartElement: function() {
            return document.getElementById('dependency-chart');
        },

        componentDidMount: function() {
            Qafoo.QA.Modules.DependenciesChart.create(this.getChartElement(), {
                width: '100%',
                height: '300px'
            }, this.getChartState());
        },

        componentDidUpdate: function() {
            Qafoo.QA.Modules.DependenciesChart.update(this.getChartElement(), this.getChartState());
        },

        getChartState: function() {
            return {
                data: [
                    {id: '1', x: 2, y: 98, z: 2},
                    {id: '2', x: 28, y: 98, z: 3},
                    {id: '3', x: 2, y: 2, z: 4},
                    {id: '4', x: 28, y: 2, z: 5},
                ],
                domain: {x: [0, 30], y: [0, 100]}
            };
        },

        componentWillUnmount: function() {
            Qafoo.QA.Modules.DependenciesChart.destroy(this.getChartElement());
        },

        render: function() {
            if (!this.dependencyTree.children) {
                this.calculateDependencyTree(this.props.data.analyzers.dependencies.dependencies);
            }

            console.log(this.dependencyTree);
            return (<div className="row">
                <div className="col-md-12">
                    <h1>Dependencies</h1>
                    <div id="dependency-chart"></div>
                </div>
            </div>);
        }
    });
})();
