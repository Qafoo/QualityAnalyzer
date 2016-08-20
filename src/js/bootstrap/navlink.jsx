import React from "react"
import { Link } from 'react-router'

let NavLink = React.createClass({
    propTypes: {
        to: React.PropTypes.string,
        children: React.PropTypes.array,
        active: React.PropTypes.bool,
        enabled: React.PropTypes.bool,
    },

    getInitialProps: function () {
        return {
            active: false,
            enabled: true,
        }
    },
    

    render: function () {
        var classNames = (this.props.active ? "active " : "") +
            (!this.props.enabled ? "disabled " : "")

        return (<li className={classNames}>
            <Link to={this.props.to}>{this.props.children}</Link>
        </li>)
    },
})

export default NavLink
