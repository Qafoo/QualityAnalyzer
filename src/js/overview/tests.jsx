import React from "react"
import { Link } from "react-router"

let Tests = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
    },

    render: function () {
        var testinfo = this.props.data.testsuites.testsuite[0].$
        var failures = testinfo.failures * 1 + testinfo.errors * 1
        var failed = failures > 0

        return (<div className={"panel panel-" + (failed ? "red" : "green")}>
            <div className="panel-heading">
                <div className="row">
                    <div className="col-xs-3 huge">
                        <span className={"glyphicon glyphicon-thumbs-" + (failed ? "down" : "up")}></span>
                    </div>
                    <div className="col-xs-9 text-right">
                        <div className="huge">{failures} / {testinfo.tests}</div>
                        <div>Failed tests</div>
                    </div>
                </div>
            </div>
            <Link to="/tests">
                <div className="panel-footer">
                    <span className="pull-left">Check out</span>
                    <span className="pull-right">
                        <span className="glyphicon glyphicon-circle-arrow-right"></span>
                    </span>
                    <div className="clearfix"></div>
                </div>
            </Link>
        </div>)
    },
})

export default Tests
