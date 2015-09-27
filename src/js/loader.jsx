var app = app || {};

(function () {
    "use strict";

    app.Data = {
    };

    app.Loader = React.createClass({
        componentDidMount: function() {
            $.getJSON("data/project.json", null, function(data) {
                app.Data = data;

                var defaults = {
                        type: "GET",
                        cache: false
                    },
                    deferreds = $.map(app.Data.analyzers, function(file, analyzer) {
                        return $.ajax(
                            $.extend({
                                    url: "data/" + file,
                                    success: function(data) {
                                        app.Data.analyzers[analyzer] = xml.xmlToJSON(data);
                                    }
                                },
                                defaults
                            )
                        );
                    });

                $.when.apply($, deferreds).then(function() {
                    console.log("All done");
                    console.log(app.Data);
                });
            });
        },
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
