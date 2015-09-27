var app = app || {};

(function () {
    "use strict";

    app.Data = {
    };

    app.Loader = React.createClass({
        render: function() {
            return (<div className="row">
                <div className="col-md-6 col-md-offset-3">
                    <div className="well">
                        <p>
                            <span className="glyphicon glyphicon-ok"></span>
                            Initializing application
                        </p>
                        <p>
                            <span className="glyphicon glyphicon-hourglass"></span>
                            Loading data
                        </p>
                    </div>
                </div>
            </div>);
        }
    });
})();
