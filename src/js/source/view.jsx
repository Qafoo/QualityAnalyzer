import React from "react"
import jQuery from "jquery"

import SourceCode from "./code.jsx"
import Coverage from "./coverage.jsx"

let SourceView = React.createClass({
    propTypes: {
        node: React.PropTypes.object,
        start: React.PropTypes.integer,
        end: React.PropTypes.integer,
    },

    componentDidMount: function () {
        this.scrollIntoView()
    },

    componentDidUpdate: function () {
        this.scrollIntoView()
    },

    scrollIntoView: function () {
        var element = document.getElementById('l' + (this.props.start - 5))

        if (element) {
            jQuery("html, body").animate({
                scrollTop: jQuery(element).offset().top,
            }, 500)
        }
    },

    render: function () {
        var node = this.props.node
        var file = node.file || null
        var start = this.props.start || 0
        var end = this.props.end || 0

        return (<div>
            <h2>{node.name}</h2>
            <h3>{node.path}</h3>
            {file ?
                <SourceCode code={node.file.asText()} coverage={node.lines} start={start} end={end} /> :
                <Coverage node={node} />
            }
        </div>)
    },
})

export default SourceView
