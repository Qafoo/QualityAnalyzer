import React from "react";
import Router from 'react-router';

import _ from 'underscore';

let Duplication = React.createClass({
    getInitialState: function() {
        return {
            folded: true
        };
    },

    getFileName: function(file) {
        var basedir = this.props.baseDir,
            file = file || "";

        return file.replace(basedir, '');
    },

    fold: function() {
        this.setState({folded: !this.state.folded});
    },

    render: function() {
        var fileFrom = this.getFileName(this.props.duplication.file[0].$.path),
            fileFromStart = this.props.duplication.file[0].$.line * 1,
            fileTo = this.getFileName(this.props.duplication.file[1].$.path),
            fileToStart = this.props.duplication.file[1].$.line * 1,
            lines = this.props.duplication.$.lines * 1;

        return (<div className="well well-sm">
            <div onClick={this.fold} style={{cursor: "pointer"}}>
                <span className="label pull-right label-warning">{this.props.duplication.$.lines} lines</span>
                <span className="label pull-right label-info">{this.props.duplication.$.tokens} tokens</span>
                <p>
                    <span className={"glyphicon glyphicon-" + (this.state.folded ? "plus" : "minus")}></span>
                    <Router.Link to={"/source" + fileFrom} query={{start: fileFromStart, end: (fileFromStart + lines)}}>
                        {fileFrom}
                    </Router.Link>
                    &nbsp;<span className="glyphicon glyphicon-resize-horizontal"></span>&nbsp;
                    <Router.Link to={"/source" + fileTo} query={{start: fileToStart, end: (fileToStart + lines)}}>
                        {fileTo}
                    </Router.Link>
                </p>
            </div>
            {this.state.folded ? '' : 
                <pre><code>{this.props.duplication.codefragment[0]}</code></pre>
            }
        </div>);
    }
});

export default Duplication; 
