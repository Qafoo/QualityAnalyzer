import React from "react"
import _ from "underscore"

import Folder from "./source/folder.jsx"
import View from "./source/view.jsx"
import Tree from "./source/model.js"

import Zip from "jszip"
import util from "jszip-utils"

let Source = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
        query: React.PropTypes.object,
    },

    getInitialState: function () {
        return {
            loaded: false,
            active: {
                size: false,
                commits: false,
                coverage: false,
            }
        }
    },

    componentWillMount: function () {
        if (this.sourceTree.hasFiles()) {
            this.setState({ loaded: true })
            return
        }

        this.sourceTree.setBaseDir(this.props.data.baseDir)
        util.getBinaryContent("data/source.zip", (function (error, data) {
            if (error) {
                console.log("Error", error)
                return
            }

            var source = new Zip(data)

            this.sourceTree.addFiles(source.files)

            if (this.props.data.analyzers.coverage) {
                let coverage = this.props.data.analyzers.coverage
                let files = []

                _.each(
                    _.pluck(coverage.coverage.project, "package"),
                    function (namespace) {
                        files = files.concat(_.pluck(namespace, "file"))
                    }
                )
                files = _.flatten(files, true)

                _.map(files, (function (file) {
                    let fileName = file.$.name

                    if (('metrics' in file) &&
                        ('loc' in file.metrics[0].$)) {
                        let lines = file.metrics[0].$.loc

                        this.sourceTree.addQualityInformation(
                            'size',
                            fileName,
                            // Everything >= 1100 lines yields 0 quality,
                            // everything <= 100 lines is 100% quality
                            (1000 - Math.min(Math.max(lines - 100, 0), 1000)) / 1000,
                            {lines: 1 * lines, files: 1, classes: 1 * file.metrics[0].$.classes, methods: 1 * file.metrics[0].$.methods}
                        )
                    }

                    if (file.metrics[0].$.elements === '0') {
                        this.sourceTree.addQualityInformation('coverage', fileName, 1, {count: 0, covered: 0, lines: {} })
                    } else if ('line' in file) {
                        let lines = {}
                        _.map(file.line, function (line) {
                            lines[line.$.num] = (line.$.count > 0)
                        })
                        
                        this.sourceTree.addQualityInformation(
                            'coverage',
                            fileName,
                            _.toArray(_.filter(lines)).length / _.toArray(lines).length,
                            {
                                count: _.toArray(lines).length,
                                covered: _.toArray(_.filter(lines)).length,
                                lines: lines,
                            }
                        )
                    }
                }).bind(this))
            }

            if (this.props.data.analyzers.git) {
                let averageCommits = _.reduce(
                    this.props.data.analyzers.git.all,
                    function (a, b) {
                        return a + b
                    }
                ) / _.toArray(this.props.data.analyzers.git.all).length

                for (let fileName in this.props.data.analyzers.git.all) {
                    this.sourceTree.addQualityInformation(
                        'commits',
                        fileName,
                        Math.max(0, 1 - Math.max(0, this.props.data.analyzers.git.all[fileName] - averageCommits) / (averageCommits * 2)),
                        {commits: 1 * this.props.data.analyzers.git.all[fileName], average: 1 * averageCommits, count: 1}
                    )
                }
            }

            this.sourceTree.aggregateQualityInformation(null, this.getActiveFields(this.state.active))

            this.setState({ loaded: true })
        }).bind(this))
    },

    getActiveFields: function (active) {
        let fields = []
        for (let field in active) {
            if (active[field]) {
                fields.push(field)
            }
        }

        return fields
    },
    

    changeActiveQualityIndex: function (field) {
        let active = this.state.active
        active[field] = !active[field]
        this.sourceTree.aggregateQualityInformation(null, this.getActiveFields(active))

        this.setState({ active: active })
    },
    

    sourceTree: new Tree(),

    render: function () {
        var file = this.sourceTree.getFileName(this.props.query.file || "/")
        var selected = file.split("/")
        var current = this.sourceTree.getSelectedFile(selected)
        var tree = this.sourceTree.getTree()

        selected.unshift("/")
        return (<div className="row">
            <div className="col-md-4">
                {!this.state.loaded ? (<h2>Loading source…</h2>) :
                <ul className="source-tree">
                    <Folder folder={tree} selected={selected} />
                </ul>}
                <h4>Quality Indicators</h4>
                <form>
                {'size' in tree.quality ?
                    <div className="checkbox">
                        <label>
                            <input checked={this.state.active.size} onChange={(function() { this.changeActiveQualityIndex('size') }).bind(this)} type="checkbox" /> Size
                        </label>
                    </div> : null}
                {'coverage' in tree.quality ?
                    <div className="checkbox">
                        <label>
                            <input checked={this.state.active.coverage} onChange={(function() { this.changeActiveQualityIndex('coverage') }).bind(this)} type="checkbox" /> Code Coverage
                        </label>
                    </div> : null}
                {'commits' in tree.quality ?
                    <div className="checkbox">
                        <label>
                            <input checked={this.state.active.commits} onChange={(function() { this.changeActiveQualityIndex('commits') }).bind(this)} type="checkbox" /> GIT Commits
                        </label>
                    </div> : null}
                </form> 
            </div>
            <div className="col-md-8">
                {current ?
                    <View
                        node={current}
                        data={this.props.data}
                        start={+this.props.query.start}
                        end={+this.props.query.end} /> :
                    <h4>Select a file in the source tree on the left.</h4>
                }
            </div>
        </div>)
    },
})

export default Source
