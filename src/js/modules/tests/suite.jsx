import React from "react";
import _ from 'underscore';

import TestCase from './testcase.jsx';

let Suite = React.createClass({
    getInitialState: function() {
        return {
            folded: true
        };
    },

    hasFailed: function() {
        return (this.props.suite.$.failures > 0 || this.props.suite.$.errors > 0);
    },

    componentDidMount: function() {
        this.setState({
            folded: !this.hasFailed(),
        });
    },

    fold: function() {
        this.setState({folded: !this.state.folded});
    },

    render: function() {
        var suite = this.props.suite,
            failures = suite.$.errors * 1 + suite.$.failures * 1;

        return (<li>
            <div className="name" onClick={this.fold} style={{cursor: "pointer"}}>
                <span className={"label pull-right label-" + (suite.$.time > .05 ? "warning" : "info")}>
                    {parseFloat(suite.$.time).toFixed(2)}s
                </span>
                <span className={"label pull-right label-" + (this.hasFailed() ? "danger" : "success")}>
                    {this.hasFailed() ? failures + " / " + suite.$.tests : suite.$.tests}
                </span>
                <span className={"glyphicon glyphicon-" + (this.state.folded ? "plus" : "minus")}></span>&nbsp;
                {suite.$.name}
            </div>
            {this.state.folded ? '' : (<div className="children">
                {!suite.testsuite ? '' :
                <ul className="suite">
                    {_.map(suite.testsuite, function(suite, key) {
                        return <Suite key={key} suite={suite} />
                    })}
                </ul>}
                {!suite.testcase ? '' :
                <ul className="testcase">
                    {_.map(suite.testcase, function(testCase, key) {
                        return <TestCase key={key} testCase={testCase} />
                    })}
                </ul>}
            </div>)}
        </li>);
    }
});

export default Suite;
