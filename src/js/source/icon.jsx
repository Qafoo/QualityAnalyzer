import React from "react"
import d3 from "d3"
import { Link } from 'react-router'

let SourceIcon = React.createClass({
    propTypes: {
        quality: React.PropTypes.number,
        icon: React.PropTypes.string,
    },

    getDefaultProps: function () {
        return {
            quality: 1,
            icon: "glyphicon glyphicon-file",
        }
    },
    

    render: function () {
        let color = d3.scale.linear()
            .domain([0, .7, 1])
            .range(["#A6403D", "#A6883D", "#308336"])

        return (<span className={this.props.icon} style={{ color: color(this.props.quality) }}></span>)
    },
})

export default SourceIcon
