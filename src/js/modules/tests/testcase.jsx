import React from "react"

let TestCase = React.createClass({
    propTypes: {
        testCase: React.PropTypes.object,
    },

    getInitialState: function () {
        return { folded: true }
    },

    fold: function () {
        this.setState({ folded: !this.state.folded })
    },

    render: function () {
        var testCase = this.props.testCase
        var failure = testCase.failure || testCase.error || null

        return (<li>
            <div className="name" onClick={this.fold} style={{ cursor: (failure ? "pointer" : "default") }}>
                <span className={"label pull-right label-" + (testCase.$.time > 0.05 ? "warning" : "info")}>
                    {parseFloat(testCase.$.time).toFixed(2)}s
                </span>
                <span className={"text-" + (failure ? "danger" : "success")}>
                    <span className={"glyphicon glyphicon-thumbs-" + (failure ? "down" : "up")}></span>&nbsp;
                    {testCase.$.name}&nbsp;
                </span>
                {!failure || this.state.folded ? '' : <pre><code>{failure[0]._}</code></pre>}
            </div>
        </li>)
    },
})

export default TestCase
