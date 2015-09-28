var Qafoo = Qafoo || {QA: {}};

(function () {
    "use strict";

    Qafoo.QA.Data = {
    };

    Qafoo.QA.Loader = React.createClass({
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
                Qafoo.QA.Data = data;

                var defaults = {
                        type: "GET",
                        cache: false
                    },
                    step = 100 / Object.keys(Qafoo.QA.Data.analyzers).length,
                    deferreds = $.map(Qafoo.QA.Data.analyzers, function(file, analyzer) {
                        return $.ajax(
                            $.extend({
                                    url: "data/" + file,
                                    success: function(data) {
                                        Qafoo.QA.Data.analyzers[analyzer] = xml.xmlToJSON(data);
                                        component.advanceProgress(step);
                                    }
                                },
                                defaults
                            )
                        );
                    });

                $.when.apply($, deferreds).then(function() {
                    component.setState({done: true, progress: 100});
                    if (component.props.onComplete) {
                        component.props.onComplete(true);
                    }
                    console.log(Qafoo.QA.Data);
                });
            });
        },

        render: function() {
            var stateIcon = this.state.done ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-hourglass';

            return (<div className="row">
                <div className="col-md-6 col-md-offset-3">
                    <h1>Qafoo Quality Analyzer</h1>
                    <div className="well">
                        <p>
                            <span className="glyphicon glyphicon-ok"></span>
                            Initializing application
                        </p>
                        <p>
                            <span className={stateIcon}></span>
                            Loading data
                        </p>
                        <Bootstrap.ProgressBar progress={this.state.progress} />
                    </div>
                </div>
            </div>);
        }
    });
})();
