import React from "react";
import {Link} from 'react-router';

import Suite from './tests/suite.jsx';

let Tests = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },

    render: function() {
        return (<div className="row">
            <div className="col-md-12">
                <h2>Tests</h2>
                <ul className="suite list-unstyled">
                    <Suite suite={this.props.data.analyzers.tests.testsuites.testsuite[0]} />
                </ul>
            </div>
        </div>);
    }
});

export default Tests; 
