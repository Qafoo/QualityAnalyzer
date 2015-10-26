import React from "react";
import Router from 'react-router';

let SourceFile = React.createClass({
    render: function() {
        var file = this.props.file,
            nodeSelected = file.name === this.props.selected[0],
            coverage = file.coverage.covered / file.coverage.count,
            coverageClass = "";

        if (file.coverage !== null) {
            coverageClass = coverage > .8 ? "covered" : (coverage > .5 ? "semi-covered" : "uncovered");
        }

        return (<li className={nodeSelected ? "selected" : ""}>
            <Router.Link to="source" query={{"file": file.path}}>
                <span className={"glyphicon glyphicon-file " + coverageClass} ></span>&nbsp;
                <span className="name">{this.props.file.name}</span>
            </Router.Link>
        </li>);
    }
});

export default SourceFile; 
