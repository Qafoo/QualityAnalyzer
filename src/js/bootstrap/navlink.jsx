import React from "react";
import Router from 'react-router';

let NavLink = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },

    render: function () {
        var activeClass = this.context.router.isActive(this.props.to) ? "active" : "";

        return (<li className={activeClass}>
            <Router.Link {...this.props}>{this.props.children}</Router.Link>
        </li>);
    }
});

export default NavLink; 
