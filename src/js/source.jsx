import React from "react"

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
                this.sourceTree.addCoverage(this.props.data.analyzers.coverage)
            }
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
