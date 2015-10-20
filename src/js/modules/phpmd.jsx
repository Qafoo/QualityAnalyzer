import React from "react";
import Router from 'react-router';

import File from './phpmd/file.jsx';

let PHPMD = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },

    getFileName: function(file) {
        var basedir = this.props.data.baseDir,
            file = file || "";

        return file.replace(basedir, '');
    },

    render: function() {
        var component = this;

        return (<div className="row">
            <div className="col-md-12">
                <h3>Violations</h3>
                {$.map(this.props.data.analyzers.phpmd.pmd.file, function(file, key) {
                    return (<File key={key} file={component.getFileName(file.$.name)} violations={file.violation} />);
                })}
            </div>
        </div>);
    }
});

export default PHPMD; 
