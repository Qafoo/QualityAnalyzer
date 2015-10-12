import _ from 'underscore';

let Model = function() {
    var dependencyTree = {
        id: "0",
        name: "/",
        fullName: "/",
        type: "package",
        children: {},
        size: -1, // Cope for external
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
                    fullName: components.slice(0, i + 1).join("\\"),
                    type: "package",
                    children: {},
                    size: 0,
                    folded: true
                };
            }

            treeReference.size++;
            treeReference = treeReference.children[component];
        }

        treeReference.type = "type";
        treeReference.folded = true;
        treeReference.efferent = _.map(dependencies, function(type) {
            if (type[0] === "\\") {
                type = type.substring(1);
            }

            return type;
        });
    };

    this.calculateDependencyTree = function(dependencies) {
        for (var i = 0; i < dependencies.package.length; ++i) {
            var namespace = dependencies.package[i];

            for (var j = 0; j < namespace.class.length; ++j) {
                var type = namespace.class[j];

                if (!type.efferent) {
                    addTypeWithDependencies(namespace.$["name"] + "\\" + type.$["name"], []);
                } else {
                    addTypeWithDependencies(
                        namespace.$["name"] + "\\" + type.$["name"],
                        _.map(type.efferent[0].type, function(target) {
                            return target.$["namespace"] + "\\" + target.$["name"];
                        })
                    );
                }
            }
        }

        addTypeWithDependencies('$external', []);
    };

    this.getLeaves =  function(tree, depth) {
        tree = tree || dependencyTree;
        depth = depth || 0;

        var leave = _.clone(tree);
        var leaves = [leave];

        leave.depth = depth;
        leave.hidden = !leave.folded;

        delete leave.children;
        delete leave.folded;
        delete leave.efferent;

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
        var fallbackLeaveId = null,
            activeLeaves = _.filter(leaves, function(leave) {
                return !leave.hidden;
            }),
            links = [];

        if (activeLeaves.length <= 1) {
            return [];
        }

        // This is always supposed to be the "externals" node
        fallbackLeaveId = activeLeaves[activeLeaves.length - 1].id;

        for (var i = 0; i < (activeLeaves.length - 1); ++i) {
            var leaveDependencies = {
                    source: activeLeaves[i].id,
                    dependencies: []
                },
                nodes = collectChildrenIds(activeLeaves[i], dependencyTree, false);

            for (var j = 0; j < nodes.length; ++j) {
                var found = false;

                for (var k = 0; k < (activeLeaves.length - 1); ++k) {
                    if (nodes[j].indexOf(activeLeaves[k].fullName) === 0) {
                        leaveDependencies.dependencies.push(activeLeaves[k].id);
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    leaveDependencies.dependencies.push(fallbackLeaveId);
                }
            }

            leaveDependencies.dependencies = leaveDependencies.dependencies.reduce(
                function(countMap, word) {
                    countMap[word] = ++countMap[word] || 1;
                    return countMap;
                },
                {}
            );

            for (var target in leaveDependencies.dependencies) {
                if (leaveDependencies.source === target) {
                    continue;
                }

                links.push({
                    source: leaveDependencies.source,
                    target: target,
                    count: leaveDependencies.dependencies[target]
                });
            }
        }

        return links;
    };

    var collectChildrenIds = function(leave, tree, found) {
        var efferent = [];

        if (tree.type === "type") {
            if (!found) {
                return [];
            } else {
                return tree.efferent;
            }
        }

        if (tree.id === leave.id) {
            found = true;
        }

        for (var child in tree.children) {
            efferent = efferent.concat(collectChildrenIds(leave, tree.children[child], found));
        }

        return efferent;
    };
};

export default Model; 
