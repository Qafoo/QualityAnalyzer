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
                "error": "danger",
                "warning": "warning",
                "notice": "info"
            };
            
        return (<li>
            <div onClick={this.fold} style={{cursor: "pointer"}}>
                <span className={"glyphicon glyphicon-" + (this.state.folded ? "plus" : "minus")}></span> <span className="name">{file}</span>
                {_.map(_.countBy(_.pluck(_.pluck(this.props.errors, "$"), "severity"), function(priority) {
                    return priorityMap[priority];
                }), function(count, type) {
                    return <span key={type} className={"label pull-right label-" + type}>{count}</span>;
                })}
            </div>
            {this.state.folded ? '' : 
                <ul className="errors">
                    {_.map(this.props.errors, function(error, key) {
                        return (<li key={key} className={"text-" + priorityMap[error.$.severity]}>
                            <h4>
                                <span className={"label label-" + priorityMap[error.$.severity]}>
                                    <span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span>
                                </span> {error.$.source}
                            </h4>
                            <Router.Link to="source" query={{file: file, start: error.$.line, end: error.$.line}}>
                                <p>{error.$.message}</p>
                            </Router.Link>
                        </li>);
                    })}
                </ul>
            }
        </li>);
    }
});

export default File; 
