import React from "react";

import File from './phpmd/file.jsx';

let PHPMD = React.createClass({
    getFileName: function(file) {
        var basedir = this.props.data.baseDir,
            file = file || "";

        return file.replace(basedir, '');
    },

    render: function() {
        var component = this;

        return (<div className="row">
            <div className="col-md-12">
                <h2>Violations</h2>
                {!this.props.data.analyzers.phpmd.pmd.file ?
                    <h3>No violations</h3> :
                    <ul className="list-unstyled list-hover">
                        {$.map(this.props.data.analyzers.phpmd.pmd.file, function(file, key) {
                            return (<File key={key} file={component.getFileName(file.$.name)} violations={file.violation} />);
                        })}
                    </ul>
                }
            </div>
        </div>);
    }
});

export default PHPMD; 
