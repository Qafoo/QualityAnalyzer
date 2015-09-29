var Qafoo = Qafoo || {QA: {}};

(function () {
    "use strict";

    Qafoo.QA.Source = React.createClass({
        ensureStartingSlash: function(path) {
            while (path[0] === "/") {
                path = path.substring(1);
            }

            return "/" + path;
        },

        getFileName: function(string) {
            string = this.ensureStartingSlash(string);

            return this.ensureStartingSlash(string.replace(this.props.data.baseDir, ""));
        },

        render: function() {
            var file = this.getFileName(this.props.parameters.splat);

            console.log(file);
            return (<div className="row">
                <div className="col-md-12">
                    <h1>Source</h1>
                </div>
            </div>);
        }
    });
})();
