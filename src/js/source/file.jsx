import React from "react";
import Router from 'react-router';

let SourceFile = React.createClass({
    render: function() {
        var file = this.props.file,
            nodeSelected = file.name === this.props.selected[0];

        return (<li className={nodeSelected ? "selected" : ""}>
            <Router.Link to="source" query={{"file": file.file.name}}>
                <span className={"glyphicon glyphicon-file " + (file.coverage > .8 ? "covered" : (file.coverage > .5 ? "semi-covered" : "uncovered"))} ></span>&nbsp;
                <span className="name">{this.props.file.name}</span>
            </Router.Link>
        </li>);
    }
});

export default SourceFile; 
