import _ from "underscore"

let Tree = function () {
    var sourceTree = {
        name: "/",
        path: "/",
        type: "folder",
        children: {},
    }
    var baseDir = ''
    var hasFiles = false
    var reducer = {}

    var ensureStartingSlash = function (path) {
        while (path[0] === "/") {
            path = path.substring(1)
        }

        return "/" + path
    }

    this.getFileName = function (string) {
        string = ensureStartingSlash(string)

        return ensureStartingSlash(string.replace(baseDir, "")).substring(1)
    }

    var addFile = function (file) {
        var components = file.name.split("/")
        var treeReference = sourceTree
        var path = []

        for (var i = 0; i < components.length; ++i) {
            var component = components[i]
            path.push(component)

            if (!treeReference.children[component]) {
                treeReference.children[component] = {
                    name: component,
                    type: "folder",
                    path: path.join("/"),
                    quality: {},
                    qualityIndex: 1,
                    children: {},
                }
            }

            treeReference = treeReference.children[component]
        }

        treeReference.type = "file"
        treeReference.file = file
        treeReference.quality = {}
        treeReference.qualityIndex = 1
        hasFiles = true
    }

    this.addFiles = function (files) {
        for (var file in files) {
            addFile(files[file])
        }
    }

    this.addQualityInformation = function (type, file, quality, data, reduceFunction) {
        reducer[type] = reduceFunction

        var node = this.getSelectedFile(this.getFileName(file).split("/"))

        if (!node) {
            return
        }

        node.quality[type] = {
            index: quality,
            data: data,
        }
    }

    this.aggregateQualityInformation = function (node) {
        node = node || sourceTree

        if (node.type === 'file') {
            node.qualityIndex = _.reduce(
                _.pluck(node.quality, 'index'),
                function (a, b) {
                    return a + b
                }
            ) / _.toArray(node.quality).length

            return node
        }

        for (let child in node.children) {
            this.aggregateQualityInformation(node.children[child])
        }

        node.qualityIndex = _.reduce(
            _.pluck(node.children, 'qualityIndex'),
            function (a, b) {
                return a + b
            }
        ) / _.toArray(node.children).length
    }

    this.setBaseDir = function (newBaseDir) {
        baseDir = newBaseDir
    }

    this.getSelectedFile = function (selected) {
        var treeReference = sourceTree

        for (var i = 0; i < selected.length; ++i) {
            var name = selected[i]

            if (!treeReference.children[name]) {
                return undefined
            }

            treeReference = treeReference.children[name]
        }

        return treeReference
    }

    this.hasFiles = function () {
        return hasFiles
    }

    this.getTree = function () {
        return sourceTree
    }
}

export default Tree
