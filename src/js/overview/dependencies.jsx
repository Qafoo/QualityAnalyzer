import React from "react"
import { Link } from "react-router"

let Dependencies = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
    },

    render: function () {
        return (<div className="panel panel-blue">
            <div className="panel-heading">
                <div className="row">
                    <div className="col-xs-3 huge">
                        <span className="glyphicon glyphicon-retweet"></span>
                    </div>
                    <div className="col-xs-9 text-right">
                        <div className="huge">Dependencies</div>
                        <div>Between components &amp types</div>
                    </div>
                </div>
            </div>
            <Link to="/dependencies">
                <div className="panel-footer">
                    <span className="pull-left">Analyze Dependencies</span>
                    <span className="pull-right">
                        <span className="glyphicon glyphicon-circle-arrow-right"></span>
                    </span>
                    <div className="clearfix"></div>
                </div>
            </Link>
        </div>)
    },
})

export default Dependencies
