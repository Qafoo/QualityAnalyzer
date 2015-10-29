import React from "react";
import {Link} from 'react-router';
import _ from 'underscore';

let Listing = React.createClass({
    render: function() {
        var selection = this.props.selection,
            type = this.props.type;

        return (<div>
            <h3>{this.props.title}</h3>
            <ul>
            {_.map(
                _.map(this.props.metrics[type], function(data, id) {return {key: id, name: data.name};}),
                function (item, index) {
                    return (<li key={index}>
                        <Link to="/pdepend" query={{type: type, metric: item.key}}>
                            {selection.type == type && selection.metric == item.key ?
                                <strong>{item.name}</strong> :
                                item.name
                            }
                        </Link>
                    </li>);
                }
            )}
            </ul>
        </div>);
    }
});

export default Listing; 
