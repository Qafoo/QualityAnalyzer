import React from "react"
import { Link } from 'react-router'

import Icon from "./icon.jsx"

let SourceFile = React.createClass({
    propTypes: {
        file: React.PropTypes.object,
        selected: React.PropTypes.array,
    },

    render: function () {
        var file = this.props.file
        var nodeSelected = file.name === this.props.selected[0]

        return (<li className={nodeSelected ? "selected" : ""}>
            <Link to={{ pathname: "/source", query: { file: file.path } }}>
                <Icon quality={file.qualityIndex} /> <span className="name">{file.name}</span>
            </Link>
        </li>)
    },
})

export default SourceFile
