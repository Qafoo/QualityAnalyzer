var Qafoo = Qafoo || {QA: {}};
Qafoo.QA.Modules = Qafoo.QA.Modules || {};

(function () {
    "use strict";

    Qafoo.QA.Modules.Dependencies = React.createClass({
        dependencyTree: {
            id: "0",
            name: "/",
            type: "package",
            children: {},
            size: 0,
            folded: false
        },

        addTypeWithDependencies: function(type, dependencies) {
            var components = type.split("\\"),
                treeReference = this.dependencyTree;

            for (var i = 0; i < components.length; ++i) {
                var component = components[i];

                if (!treeReference.children[component]) {
                    treeReference.children[component] = {
                        id: Math.random().toString(36).substring(2, 8),
                        name: component,
                        type: "package",
                        children: {},
                        size: 0,
                        folded: true
                    }
                }

                treeReference.size++;
                treeReference = treeReference.children[component];
            }

            treeReference.type = "type";
            treeReference.folded = true;
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

            this.setState({
                leaves: this.getLeaves(this.dependencyTree, 0),
                initialized: true
            });
        },

        getLeaves: function(tree, depth) {
            var leave = $.extend({}, tree);
            var leaves = [leave];

            leave.depth = depth;
            leave.hidden = !leave.folded;

            delete leave.children;
            delete leave.folded;

            if (tree.folded) {
                return leaves;
            }
            
            for (var child in tree.children) {
                leaves = leaves.concat(this.getLeaves(tree.children[child], depth + 1));
            }

            return leaves;
        },

        findAndUnfold: function(tree, leaveId) {
            if (tree.id === leaveId) {
                tree.folded = !tree.folded;
                return true;
            }

            for (var child in tree.children) {
                if (this.findAndUnfold(tree.children[child], leaveId)) {
                    return true;
                }
            }

            return false;
        },

        calculateDependencies: function(leaves) {
            return [];
        },

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
            this.findAndUnfold(this.dependencyTree, leave.id);
            this.setState({
                leaves: this.getLeaves(this.dependencyTree, 0),
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
                this.calculateDependencyTree(this.props.data.analyzers.dependencies.dependencies);
            }

            return {
                leaves: this.state.leaves,
                links: this.calculateDependencies(this.state.leaves)
            };
        },

        componentWillUnmount: function() {
            Qafoo.QA.Modules.DependenciesChart.destroy(this.getChartElement());
        },

        render: function() {
            return (<div className="row">
                <div className="col-md-12">
                    <h1>Dependencies</h1>
                    <div id="dependency-chart"></div>
                </div>
            </div>);
        }
    });
})();
