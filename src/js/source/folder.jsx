import React from "react";

import Folder from "./folder.jsx";
import File from "./file.jsx";

let SourceFolder = React.createClass({
    getInitialState: function() {
        return {
            opened: false
        };
    },

    unfold: function() {
        this.setState({
            opened: !this.state.opened
        });
    },

    render: function() {
        var folder = this.props.folder,
            selected = this.props.selected,
            nodeSelected = folder.name === selected[0],
            opened = nodeSelected || this.state.opened,
            icon = opened ? "glyphicon glyphicon-folder-open" : "glyphicon glyphicon-folder-close";

        if (!nodeSelected) {
            selected = [];
        }

        return (<li className={nodeSelected ? "selected" : ""}>
            <a onClick={this.unfold}>
                <span className={icon}></span> <span className="name">{this.props.folder.name}</span>
            </a>
            {!(folder.children && opened) ? "" :
            (<ul>
                {$.map(folder.children, function(child) {
                    return child.type === 'folder' ?
                        <Folder key={child.name} folder={child} selected={selected.slice(1)} /> :
                        <File key={child.name} file={child} selected={selected.slice(1)} />
                })}
            </ul>)
            }
        </li>);
    }
});

export default SourceFolder; 
