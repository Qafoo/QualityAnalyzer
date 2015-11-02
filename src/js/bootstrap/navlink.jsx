import React from "react"
import { Link } from 'react-router'

let NavLink = React.createClass({
    propTypes: {
        children: React.PropTypes.array,
        active: React.PropTypes.bool,
    },

    render: function () {
        var activeClass = this.props.active ? "active" : ""

        return (<li className={activeClass}>
            <Link {...this.props}>{this.props.children}</Link>
        </li>)
    },
})

export default NavLink
