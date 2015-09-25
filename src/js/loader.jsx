var app = app || {};

(function () {
    "use strict";

    app.Loader = React.createClass({
        render: function() {
            return (<div className="row">
                <div className="col-md-6 col-md-offset-3">
                    <div className="well">
                        <p>Loading data…</p>
                    </div>
                </div>
            </div>);
        }
    });
})();
