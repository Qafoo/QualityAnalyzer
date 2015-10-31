import React from "react";
import {Link} from "react-router";

let Coverage = React.createClass({
    render: function() {
        var metrics = this.props.data.coverage.project[0].metrics[0].$,
            coverage = metrics.coveredstatements / metrics.statements;

        return ( <div className={"panel panel-" + (coverage > .7 ? "green" : (coverage > .5 ? "yellow" : "red"))}>
            <div className="panel-heading">
                <div className="row">
                    <div className="col-xs-3 huge">
                        <span className="glyphicon glyphicon-tasks"></span>
                    </div>
                    <div className="col-xs-9 text-right">
                        <div className="huge">{(coverage * 100).toFixed(2)}%</div>
                        <div>Test coverage</div>
                    </div>
                </div>
            </div>
            <Link to="/source">
                <div className="panel-footer">
                    <span className="pull-left">Check out</span>
                    <span className="pull-right">
                        <span className="glyphicon glyphicon-circle-arrow-right"></span>
                    </span>
                    <div className="clearfix"></div>
                </div>
            </Link>
        </div>);
    }
});

export default Coverage;
