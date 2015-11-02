import React from "react"
import _ from "underscore"

import File from './checkstyle/file.jsx'

let Checkstyle = React.createClass({
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
                {!this.props.data.analyzers.checkstyle.checkstyle.file ?
                    <h3>No violations</h3> :
                    <ul className="list-unstyled list-hover">
                        {_.map(this.props.data.analyzers.checkstyle.checkstyle.file, (function (file, key) {
                            return (<File key={key} file={this.getFileName(file.$.name)} errors={file.error} />)
                        }).bind(this))}
                    </ul>
                }
            </div>
        </div>)
    },
})

export default Checkstyle
