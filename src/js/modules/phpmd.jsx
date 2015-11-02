import React from "react"
import _ from "underscore"

import File from './phpmd/file.jsx'

let PHPMD = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
    },

    getFileName: function (file) {
        var basedir = this.props.data.baseDir

        file = file || ""
        return file.replace(basedir, '')
    },

    render: function () {
        return (<div className="row">
            <div className="col-md-12">
                <h2>Violations</h2>
                {!this.props.data.analyzers.phpmd.pmd.file ?
                    <h3>No violations</h3> :
                    <ul className="list-unstyled list-hover">
                        {_.map(this.props.data.analyzers.phpmd.pmd.file, (function (file, key) {
                            return (<File key={key} file={this.getFileName(file.$.name)} violations={file.violation} />)
                        }).bind(this))}
                    </ul>
                }
            </div>
        </div>)
    },
})

export default PHPMD
