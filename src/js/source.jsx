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
                            // Everything >= 1100 lines yields 0 qulity, everything
                            // <= 100 lines is 100% quality
                            1000 / (1000 - Math.min(Math.max(lines - 100, 0), 1000)),
                            {lines: lines}
                        )
                    }

                    if ('line' in file) {
                        let coveredLines = _.filter(_.map(file.line, function (line) {
                            return (line.$.count > 0)
                        })).length
                        
                        this.sourceTree.addQualityInformation(
                            'coverage',
                            fileName,
                            coveredLines / file.line.length,
                            {lines: file.line.length, covered: coveredLines}
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
                    console.log(
                        fileName,
                        Math.max(0, 1 - Math.max(0, this.props.data.analyzers.git.all[fileName] - averageCommits) / (averageCommits * 5)),
                        {commits: this.props.data.analyzers.git.all[fileName], average: averageCommits}
                    )
                    this.sourceTree.addQualityInformation(
                        'commits',
                        fileName,
                        Math.max(0, 1 - Math.max(0, this.props.data.analyzers.git.all[fileName] - averageCommits) / (averageCommits * 5)),
                        {commits: this.props.data.analyzers.git.all[fileName], average: averageCommits}
                    )
                }
            }

            this.sourceTree.aggregateQualityInformation()

            console.log(this.sourceTree.getTree())

            this.setState({ loaded: true })
        }).bind(this))
    },

    sourceTree: new Tree(),

    render: function () {
        var file = this.sourceTree.getFileName(this.props.query.file || "/")
        var selected = file.split("/")
        var current = this.sourceTree.getSelectedFile(selected)

        selected.unshift("/")
        return (<div className="row">
            <div className="col-md-4">
                {!this.state.loaded ? (<h2>Loading source…</h2>) :
                <ul className="source-tree">
                    <Folder folder={this.sourceTree.getTree()} selected={selected} />
                </ul>}
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
