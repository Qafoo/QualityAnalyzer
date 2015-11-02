import React from "react"

let ProgressBar = React.createClass({
    propTypes: {
        progress: React.PropTypes.number,
        type: React.PropTypes.string,
        text: React.PropTypes.string,
    },

    getDefaultProps: function () {
        return {
            progress: 0,
            type: "default",
            text: null,
        }
    },

    render: function () {
        var className = "progress-bar progress-bar-" + this.props.type

        return (<div className="progress">
            <div className={className} role="progressbar" style={{ width: this.props.progress + '%' }}>
            </div>
        </div>)
    },
})

export default ProgressBar
