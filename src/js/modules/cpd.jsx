import React from "react";
import Router from 'react-router';

import Duplication from './cpd/duplication.jsx';

let CPD = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },

    render: function() {
        var component = this,
            baseDir = this.props.data.baseDir;

        return (<div className="row">
            <div className="col-md-12">
                <h2>Code Duplications</h2>
                {$.map(this.props.data.analyzers.cpd["pmd-cpd"].duplication, function(duplication, key) {
                    return (<Duplication key={key} baseDir={baseDir} duplication={duplication} />);
                })}
            </div>
        </div>);
    }
});

export default CPD; 
