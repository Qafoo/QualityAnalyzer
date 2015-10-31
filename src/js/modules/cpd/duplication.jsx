import React from "react";
import {Link} from 'react-router';

import _ from 'underscore';

import SourceCode from '../../source/code.jsx';

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

        return (<li>
            <div onClick={this.fold} style={{cursor: "pointer"}}>
                <span className="label pull-right label-warning">{this.props.duplication.$.lines} lines</span>
                <span className="label pull-right label-info">{this.props.duplication.$.tokens} tokens</span>
                <p>
                    <span className={"glyphicon glyphicon-" + (this.state.folded ? "plus" : "minus")}></span>&nbsp;
                    <Link to="/source" query={{file: fileFrom, start: fileFromStart, end: (fileFromStart + lines)}}>
                        {fileFrom}
                    </Link>
                    &nbsp;<span className="glyphicon glyphicon-resize-horizontal"></span>&nbsp;
                    <Link to="/source" query={{file: fileTo, start: fileToStart, end: (fileToStart + lines)}}>
                        {fileTo}
                    </Link>
                </p>
            </div>
            {this.state.folded ? '' :
                <SourceCode code={this.props.duplication.codefragment[0]} />
            }
        </li>);
    }
});

export default Duplication;
