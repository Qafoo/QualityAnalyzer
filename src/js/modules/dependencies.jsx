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

        componentOnMount: function() {
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

        render: function() {
            this.calculateDependencyTree(this.props.data.analyzers.dependencies.dependencies);
            console.log(this.dependencyTree);
            return (<div className="row">
                <div className="col-md-12">
                    <h1>Dependencies</h1>
                </div>
            </div>);
        }
    });
})();
