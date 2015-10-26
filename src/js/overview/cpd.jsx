import React from "react";
import {Link} from "react-router";
import _ from "underscore";

let CPD = React.createClass({
    render: function() {
        var duplications = this.props.data["pmd-cpd"].duplication || [],
            violations = duplications.length;

        return ( <div className={"panel panel-" + (violations ? "red" : "green")}>
            <div className="panel-heading">
                <div className="row">
                    <div className="col-xs-3 huge">
                        <span className="glyphicon glyphicon-duplicate"></span>
                    </div>
                    <div className="col-xs-9 text-right">
                        <div className="huge">{violations}</div>
                        <div>Code duplications</div>
                    </div>
                </div>
            </div>
            <Link to="cpd">
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

export default CPD; 
