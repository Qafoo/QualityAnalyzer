import React from "react";
import Router from "react-router";

let PDepend = React.createClass({
    render: function() {
        return ( <div className="panel panel-blue">
            <div className="panel-heading">
                <div className="row">
                    <div className="col-xs-3 huge">
                        <span className="glyphicon glyphicon-stats"></span>
                    </div>
                    <div className="col-xs-9 text-right">
                        <div className="huge">Metrics</div>
                        <div>Packages, Classes, Methods</div>
                    </div>
                </div>
            </div>
            <Router.Link to="pdepend">
                <div className="panel-footer">
                    <span className="pull-left">Analyze Metrics</span>
                    <span className="pull-right">
                        <span className="glyphicon glyphicon-circle-arrow-right"></span>
                    </span>
                    <div className="clearfix"></div>
                </div>
            </Router.Link>
        </div>);
    }
});

export default PDepend; 
