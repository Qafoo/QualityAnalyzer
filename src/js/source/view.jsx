import React from "react";

import SourceCode from "./code.jsx";

let SourceView = React.createClass({

    scrollIntoView: function() {
        var element = null;

        if (element = document.getElementById('l' + (this.props.start - 5))) {
            element.scrollIntoView();
        }
    },

    componentDidMount: function() {
        this.scrollIntoView();
    },

    componentDidUpdate: function() {
        this.scrollIntoView();
    },

    render: function() {
        var file = this.props.file,
            start = this.props.start || 0,
            end = this.props.end || 0;

        return (<div>
            <h2>{file.name}</h2>
            <h3>{file.file.name}</h3>
            <SourceCode code={file.file.asText()} coverage={file.lines} start={start} end={end} />
        </div>);
    }
});

export default SourceView;
