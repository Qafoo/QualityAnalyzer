import React from "react";
import jQuery from "jquery";

import SourceCode from "./code.jsx";
import Coverage from "./coverage.jsx";

let SourceView = React.createClass({

    scrollIntoView: function() {
        var element = null;

        if (element = document.getElementById('l' + (this.props.start - 5))) {
            jQuery("html, body").animate({
                scrollTop: jQuery(element).offset().top
            }, 500);
        }
    },

    componentDidMount: function() {
        this.scrollIntoView();
    },

    componentDidUpdate: function() {
        this.scrollIntoView();
    },

    render: function() {
        var node = this.props.node,
            file = node.file || null,
            start = this.props.start || 0,
            end = this.props.end || 0;

        return (<div>
            <h2>{node.name}</h2>
            <h3>{node.path}</h3>
            {file ?
                <SourceCode code={node.file.asText()} coverage={node.lines} start={start} end={end} /> :
                <Coverage node={node} />
            }
        </div>);
    }
});

export default SourceView;
