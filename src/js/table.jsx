import React from "react";
import _ from 'underscore';

let Table = React.createClass({
    render: function() {
        return (<table className="table table-striped table-bordered table-hover table-condensed">
            <thead>
                <tr>
                    {_.map(this.props.captions, function(caption, id) {
                        return (<th key={id}>{caption}</th>);
                    })}
                </tr>
            </thead>
            <tbody>
                {_.map(this.props.data, function(row, rowId) {
                    return (<tr key={rowId}>{_.map(row, function(cell, columnId) {
                        return (<td key={columnId}>{cell}</td>);
                    })}</tr>);
                })}
            </tbody>
        </table>);
    }
});

export default Table; 
