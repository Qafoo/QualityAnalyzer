import _ from "underscore";

let Tree = function() {
    var sourceTree = {
        name: "/",
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
            treeReference = sourceTree;

        for (var i = 0; i < components.length; ++i) {
            var component = components[i];

            if (!treeReference.children[component]) {
                treeReference.children[component] = {
                    name: component,
                    type: "folder",
                    children: {}
                };
            }

            treeReference = treeReference.children[component];
        }

        treeReference.type = "file";
        treeReference.file = file;
        treeReference.lines = [];
        treeReference.coverage = null;
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

            node.coverage = file.metrics[0].$.coveredstatements / file.metrics[0].$.statements;
            _.map(file.line, function(line) {
                node.lines[line.$.num] = (line.$.count > 0);
            });
        });
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
