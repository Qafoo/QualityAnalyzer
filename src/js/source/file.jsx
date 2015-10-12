import React from "react";

let SourceFile = React.createClass({
    render: function() {
        var file = this.props.file,
            nodeSelected = file.name === this.props.selected[0];

        return (<li className={nodeSelected ? "selected" : ""}>
            <ReactRouter.Link to={"/source/" + file.file.name}>
                <span className="glyphicon glyphicon-file"></span> <span className="name">{this.props.file.name}</span>
            </ReactRouter.Link>
        </li>);
    }
});

export default SourceFile; 
