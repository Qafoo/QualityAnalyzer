var Qafoo = Qafoo || {QA: {}};
Qafoo.QA.Modules = Qafoo.QA.Modules || {};

(function () {
    "use strict";

    Qafoo.QA.Modules.DependenciesModel = function() {
        var dependencyTree = {
            id: "0",
            name: "/",
            type: "package",
            children: {},
            size: 0,
            folded: false
        };

        var addTypeWithDependencies = function(type, dependencies) {
            var components = type.split("\\"),
                treeReference = dependencyTree;

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
        };

        this.calculateDependencyTree = function(dependencies) {
            for (var i = 0; i < dependencies.package.length; ++i) {
                var namespace = dependencies.package[i];

                for (var j = 0; j < namespace.class.length; ++j) {
                    var type = namespace.class[j];

                    if (!type.efferent) {
                        addTypeWithDependencies(namespace["@name"] + "\\" + type["@name"], []);
                    } else if (type.efferent.type instanceof Array) {
                        addTypeWithDependencies(
                            namespace["@name"] + "\\" + type["@name"],
                            $.map(type.efferent.type, function(target) {
                                return target["@namespace"] + "\\" + target["@name"];
                            })
                        );
                    } else {
                        addTypeWithDependencies(
                            namespace["@name"] + "\\" + type["@name"],
                            [type.efferent.type["@namespace"] + "\\" + type.efferent.type["@name"]]
                        );
                    }
                }
            }

            addTypeWithDependencies('$external', []);
        };

        this.getLeaves =  function(tree, depth) {
            tree = tree || dependencyTree;
            depth = depth || 0;

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
        };

        this.findAndUnfold = function(leaveId, tree) {
            tree = tree || dependencyTree;

            if (tree.id === leaveId) {
                tree.folded = !tree.folded;
                return true;
            }

            for (var child in tree.children) {
                if (this.findAndUnfold(leaveId, tree.children[child])) {
                    return true;
                }
            }

            return false;
        };

        this.calculateDependencies = function(leaves) {
            return [];

            var fallbackLeaveId = null,
                activeLeaves = leaves.filter(function(leave) {
                    return !leave.hidden;
                });

            for (var i = 0; i < activeLeaves.length; ++i) {
                leave.nodes = this.collectChildrenIds(activeLeaves[i], this.dependencyTree, false);
            }
            fallbackLeaveId = activeLeaves[i].id;

            return [];
        };

        var collectChildrenIds = function(leave, tree, found) {
            if (tree.type === "type") {
                if (!found) {
                    return [];
                } else {
                    return [tree.id];
                }
            }

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
        };
    };
})();
