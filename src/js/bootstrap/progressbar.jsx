var Bootstrap = Bootstrap || {};

(function () {
    "use strict";

    Bootstrap.ProgressBar = React.createClass({
        getDefaultProps: function() {
            return {
                progress: 0,
                type: "default",
                text: null
            };
        },

        render: function() {
            var className = "progress-bar progress-bar-" + this.props.type;

            return (<div className="progress">
                <div className={className} role="progressbar" style={{width: this.props.progress + '%'}}>
                </div>
            </div>);
        }
    });
})();
