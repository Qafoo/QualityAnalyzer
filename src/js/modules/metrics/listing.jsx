import React from "react";
import {Link} from 'react-router';
import _ from 'underscore';

let Listing = React.createClass({
    render: function() {
        var selected = this.props.selected;

        return (<div>
            <h3>{this.props.title}</h3>
            <ul>
            {_.map(
                _.map(this.props.metrics, function(data, id) {return {key: id, name: data.name};}),
                function (item, index) {
                    return (<li key={index}>
                        <Link to="/pdepend" query={{type: "package", metric: item.key}}>
                            {selected == item.key ?
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
