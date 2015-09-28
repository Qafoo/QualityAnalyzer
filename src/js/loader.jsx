var app = app || {};

(function () {
    "use strict";

    var ProgressBar = bootstrap.ProgressBar;

    app.Data = {
    };

    app.Loader = React.createClass({
        getInitialState: function() {
            return {
                done: false,
                progress: 0
            };
        },

        advanceProgress: function(step) {
            this.setState({
                progress: this.state.progress + step
            });
        },

        componentDidMount: function() {
            var component = this;

            $.getJSON("data/project.json", null, function(data) {
                app.Data = data;

                var defaults = {
                        type: "GET",
                        cache: false
                    },
                    step = 100 / Object.keys(app.Data.analyzers).length,
                    deferreds = $.map(app.Data.analyzers, function(file, analyzer) {
                        return $.ajax(
                            $.extend({
                                    url: "data/" + file,
                                    success: function(data) {
                                        app.Data.analyzers[analyzer] = xml.xmlToJSON(data);
                                        component.advanceProgress(step);
                                    }
                                },
                                defaults
                            )
                        );
                    });

                $.when.apply($, deferreds).then(function() {
                    component.setState({done: true, progress: 100});
                    console.log(app.Data);
                });
            });
        },

        render: function() {
            var stateIcon = this.state.done ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-hourglass';

            return (<div className="row">
                <div className="col-md-6 col-md-offset-3">
                    <div className="well">
                        <p>
                            <span className="glyphicon glyphicon-ok"></span>
                            Initializing application
                        </p>
                        <p>
                            <span className={stateIcon}></span>
                            Loading data
                        </p>
                        <ProgressBar progress={this.state.progress} />
                    </div>
                </div>
            </div>);
        }
    });
})();
