import React from "react";
import {Link} from 'react-router';

import File from './checkstyle/file.jsx';

let Checkstyle = React.createClass({
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
                <h2>Violations</h2>
                {!this.props.data.analyzers.checkstyle.checkstyle.file ?
                    <h3>No violations</h3> :
                    <ul className="list-unstyled list-hover">
                        {$.map(this.props.data.analyzers.checkstyle.checkstyle.file, function(file, key) {
                            return (<File key={key} file={component.getFileName(file.$.name)} errors={file.error} />);
                        })}
                    </ul>
                }
            </div>
        </div>);
    }
});

export default Checkstyle; 
