import React from "react"
import { Link } from 'react-router'

let SourceFile = React.createClass({
    propTypes: {
        file: React.PropTypes.object,
        selected: React.PropTypes.array,
    },

    render: function () {
        var file = this.props.file
        var nodeSelected = file.name === this.props.selected[0]
        var coverage = file.coverage.covered / file.coverage.count
        var coverageClass = ""

        if (file.coverage !== null) {
            if (coverage > 0.8) {
                coverageClass = "covered"
            } else if (coverage > 0.5) {
                coverageClass = "semi-covered"
            } else {
                coverageClass = "uncovered"
            }
        }

        return (<li className={nodeSelected ? "selected" : ""}>
            <Link to="/source" query={{ file: file.path }}>
                <span className={"glyphicon glyphicon-file " + coverageClass} ></span>&nbsp;
                <span className="name">{this.props.file.name}</span>
            </Link>
        </li>)
    },
})

export default SourceFile
