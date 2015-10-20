import React from "react";
import Router from 'react-router';

import _ from 'underscore';

let File = React.createClass({
    getInitialState: function() {
        return {
            folded: true
        };
    },

    fold: function() {
        this.setState({folded: !this.state.folded});
    },

    render: function() {
        var file = this.props.file,
            priorityMap = {
                1: "info",
                2: "warning",
                3: "danger"
            }

        return (<div className="well well-sm">
            <div onClick={this.fold} style={{cursor: "pointer"}}>
                <span className={"glyphicon glyphicon-" + (this.state.folded ? "plus" : "minus")}></span> <span className="name">{file}</span>
                {_.map(_.countBy(_.pluck(_.pluck(this.props.violations, "$"), "priority"), function(priority) {
                    return priorityMap[priority];
                }), function(count, type) {
                    return <span key={type} className={"label pull-right label-" + type}>{count}</span>;
                })}
            </div>
            {this.state.folded ? '' : 
                <ul className="violations">
                    {_.map(this.props.violations, function(violation, key) {
                        return (<li key={key} className={"text-" + priorityMap[violation.$.priority]}>
                            <h4>
                                <span className={"label label-" + priorityMap[violation.$.priority]}>
                                    <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                                </span> {violation.$.rule} ({violation.$.ruleset})
                            </h4>
                            <Router.Link to={"/source" + file} query={{start: violation.$.beginline, end: violation.$.endline}}>
                                <p>{violation._}</p>
                            </Router.Link>
                        </li>);
                    })}
                </ul>
            }
        </div>);
    }
});

export default File; 
