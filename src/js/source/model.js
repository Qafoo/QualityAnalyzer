import _ from "underscore";

let Tree = function() {
    var sourceTree = {
        name: "/",
        path: "/",
        type: "folder",
        children: {}
    };

    var baseDir = '';

    var hasFiles = false;

    var ensureStartingSlash = function(path) {
        while (path[0] === "/") {
            path = path.substring(1);
        }

        return "/" + path;
    };

    this.getFileName = function(string) {
        string = ensureStartingSlash(string);

        return ensureStartingSlash(string.replace(baseDir, "")).substring(1);
    };

    var addFile = function(file) {
        var components = file.name.split("/"),
            treeReference = sourceTree,
            path = [];

        for (var i = 0; i < components.length; ++i) {
            var component = components[i];
            path.push(component);

            if (!treeReference.children[component]) {
                treeReference.children[component] = {
                    name: component,
                    type: "folder",
                    path: path.join("/"),
                    children: {}
                };
            }

            treeReference = treeReference.children[component];
        }

        treeReference.type = "file";
        treeReference.file = file;
        treeReference.lines = [];
        treeReference.coverage = {
            count: 0,
            covered: 0,
        };
        treeReference.file = file;
        hasFiles = true;
    };

    this.addFiles = function(files) {
        for (var file in files) {
            addFile(files[file]);
        }
    };

    this.addCoverage = function(coverage) {
        var tree = this,
            files = [];

        _.each(
            _.pluck(coverage.coverage.project, "package"),
            function(namespace) {
                files = files.concat(_.pluck(namespace, "file"));
            }
        );
        files = _.flatten(files, true);

        _.map(files, function(file) {
            var node = tree.getSelectedFile(tree.getFileName(file.$.name).split("/"));

            if (!node) {
                return;
            }

            node.coverage.count = file.metrics[0].$.statements * 1;
            node.coverage.covered = file.metrics[0].$.coveredstatements * 1;
            _.map(file.line, function(line) {
                node.lines[line.$.num] = (line.$.count > 0);
            });
        });
    };

    this.calculateNodeStatistics = function(node) {
        var statistics = {
                files: 0,
                coverage: {
                    files: {
                        count: 0,
                        covered: 0,
                    },
                    lines: {
                        count: 0,
                        covered: 0,
                    },
                },
            };

        if (node.type === "file") {
            statistics.files = 1;
            statistics.coverage.files.count = 1;
            statistics.coverage.files.covered = (node.coverage.covered >= node.coverage.count ? 1 : 0);
            statistics.coverage.lines = node.coverage;
            return statistics;
        }

        for (var child in node.children) {
            var childStatistics = this.calculateNodeStatistics(node.children[child]);

            statistics.files += childStatistics.files;
            statistics.coverage.files.count += childStatistics.coverage.files.count;
            statistics.coverage.files.covered += childStatistics.coverage.files.covered;
            statistics.coverage.lines.count += childStatistics.coverage.lines.count;
            statistics.coverage.lines.covered += childStatistics.coverage.lines.covered;
        }

        return statistics;
    };

    this.setBaseDir = function(newBaseDir) {
        baseDir = newBaseDir;
    };

    this.getSelectedFile = function(selected) {
        var treeReference = sourceTree;

        for (var i = 0; i < selected.length; ++i) {
            var name = selected[i];

            if (!treeReference.children[name]) {
                return undefined;
            }

            treeReference = treeReference.children[name];
        }

        return treeReference;
    };

    this.hasFiles = function() {
        return hasFiles;
    };

    this.getTree = function() {
        return sourceTree;
    };
};

export default Tree;
