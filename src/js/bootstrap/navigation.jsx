import React from "react"
import { Link } from 'react-router'
import _ from "underscore"

import NavLink from "./navlink.jsx"

let Navigation = React.createClass({
    propTypes: {
        matched: React.PropTypes.object,
        brandLink: React.PropTypes.string,
        brand: React.PropTypes.string,
        items: React.PropTypes.array,
    },

    getDefaultProps: function () {
        return {
            brand: "Your Brand",
            brandLink: null,
            items: {},
            matched: null,
        }
    },

    render: function () {
        var matched = this.props.matched

        return (<nav className="navbar navbar-default navbar-fixed-top">
            <div className="container">
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle collapsed"
                        data-toggle="collapse" data-target="#navbar"
                        aria-expanded="false" aria-controls="navbar">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                    <Link className="navbar-brand" to={this.props.brandLink}>
                        <img src="assets/logo.png" height="32" width="32" />
                        {this.props.brand}
                    </Link>
                </div>
                <div id="navbar" className="collapse navbar-collapse">
                    <ul className="nav navbar-nav">
                        {_.map(this.props.items, function (item, i) {
                            return (<NavLink key={i} to={"/" + item.path} active={item.path === matched.path}>
                                {!item.icon ? '' :
                                    <span className={item.icon}></span>
                                } {item.name}
                            </NavLink>)
                        })}
                    </ul>
                </div>
            </div>
        </nav>)
    },
})

export default Navigation
