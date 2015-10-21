import React from "react";
import Router from "react-router";
import _ from "underscore";

let Tests = React.createClass({
    render: function() {
        var testinfo = this.props.data.testsuites.testsuite[0].$,
            failed = testinfo.failures > 0;

        return ( <div className={"panel panel-" + (failed ? "red" : "green")}>
            <div className="panel-heading">
                <div className="row">
                    <div className="col-xs-3 huge">
                        <span className={"glyphicon glyphicon-thumbs-" + (failed ? "down" : "up")}></span>
                    </div>
                    <div className="col-xs-9 text-right">
                        <div className="huge">{testinfo.failures} / {testinfo.tests}</div>
                        <div>Failed tests</div>
                    </div>
                </div>
            </div>
            <Router.Link to="tests">
                <div className="panel-footer">
                    <span className="pull-left">Check out</span>
                    <span className="pull-right">
                        <span className="glyphicon glyphicon-circle-arrow-right"></span>
                    </span>
                    <div className="clearfix"></div>
                </div>
            </Router.Link>
        </div>);
    }
});

export default Tests; 
