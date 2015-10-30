import React from "react";
import {Link} from "react-router";
import _ from "underscore";

let Checkstyle = React.createClass({
    render: function() {
        var violations = _.reduce(
                _.map(
                    this.props.data.checkstyle.file || [],
                    function (file) {
                        return file.error.length;
                    }
                ),
                function (memo, num) {
                    return memo + num;
                }
            ) || 0;

        return ( <div className={"panel panel-" + (violations ? "red" : "green")}>
            <div className="panel-heading">
                <div className="row">
                    <div className="col-xs-3 huge">
                        <span className="glyphicon glyphicon-erase"></span>
                    </div>
                    <div className="col-xs-9 text-right">
                        <div className="huge">{violations}</div>
                        <div>Checkstyle violations</div>
                    </div>
                </div>
            </div>
            <Link to="/checkstyle">
                <div className="panel-footer">
                    <span className="pull-left">See more</span>
                    <span className="pull-right">
                        <span className="glyphicon glyphicon-circle-arrow-right"></span>
                    </span>
                    <div className="clearfix"></div>
                </div>
            </Link>
        </div>);
    }
});

export default Checkstyle;
