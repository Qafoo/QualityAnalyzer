var Qafoo = Qafoo || {QA: {}};

(function () {
    "use strict";

    Qafoo.QA.Table = React.createClass({
        render: function() {
            return (<table className="table table-striped table-bordered table-hover table-condensed">
                <thead>
                    <tr>
                        {$.map(this.props.captions, function(caption, id) {
                            return (<th key={id}>{caption}</th>);
                        })}
                    </tr>
                </thead>
                <tbody>
                    {$.map(this.props.data, function(row, id) {
                        return (<tr key={id}>{$.map(row, function(cell, id) {
                            return (<td key={id}>{cell}</td>);
                        })}</tr>);
                    })}
                </tbody>
            </table>);
        }
    });
})();
