import React from "react";
import {Link} from "react-router";

let PhpLoc = React.createClass({
    render: function() {
        var data = this.props.data.phploc;

        return ( <div className="panel panel-blue">
            <div className="panel-heading">
                <div className="row">
                    <div className="col-xs-3 huge">
                        <span className="glyphicon glyphicon-scale"></span>
                    </div>
                    <div className="col-xs-9 text-right">
                        <div className="huge">{data.loc[0]}</div>
                        <div>Lines of Code</div>
                    </div>
                </div>
            </div>
            <Link to="/phploc">
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

export default PhpLoc;
