import React from "react";
import {Link} from "react-router";
import _ from "underscore";

let PHPMD = React.createClass({
    render: function() {
        var violations = _.reduce(
                _.map(
                    this.props.data.pmd.file || [],
                    function (file) {
                        return file.violation.length;
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
                        <span className="glyphicon glyphicon-trash"></span>
                    </div>
                    <div className="col-xs-9 text-right">
                        <div className="huge">{violations}</div>
                        <div>Mess Detector violations</div>
                    </div>
                </div>
            </div>
            <Link to="phpmd">
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

export default PHPMD; 
