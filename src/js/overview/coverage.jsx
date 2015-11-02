import React from "react"
import { Link } from "react-router"

let Coverage = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
    },

    render: function () {
        var metrics = this.props.data.coverage.project[0].metrics[0].$
        var coverage = metrics.coveredstatements / metrics.statements
        var panelType = "red"

        if (coverage > 0.7) {
            panelType = "green"
        } else if (coverage > 0.5) {
            panelType = "yellow"
        }

        return (<div className={"panel panel-" + panelType}>
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
        </div>)
    },
})

export default Coverage
