var Qafoo = Qafoo || {QA: {}};
Qafoo.QA.Modules = Qafoo.QA.Modules || {};

(function () {
    "use strict";

    Qafoo.QA.Modules.Metrics = React.createClass({
        metrics: {
            class: {
                loc: "Line of Code",
                eloc: "Executable Lines of Code",
                ncloc: "Non-Comment Line of Code",
                cloc: "Comment Lines of Code",
                cr: "Code Rank",
                rcr: "Reverse Code Rank",
                ca: "Afferent Coupling",
                ce: "Efferent Coupling",
                cbo: "?",
                cis: "Interface Size",
                nom: "Number of Methods",
                noom: "Number of Own Methods",
                npm: "Number of Public Methods",
                noam: "Number of Abstract Methods",
                vars: "Class Variables",
                varsi: "Inherited Class Variables",
                varsnp: "Own Class Variables",
                wmc: "Weighted Methods per Class",
                wmci: "Inherited Weighted Methods per Class",
                wmcnp: "Own Weighted Methods per Class",
                dit: "Depth of Inheritance Tree",
                csz: "?",
                impl: "?",
                lloc: "?",
                nocc: "?"
            }
        },

        propTypes: {
            data: React.PropTypes.object.isRequired
        },

        getClassMetrics: function() {
            var metrics = [];

            for (var i = 0; i < this.props.data.pdepend.metrics.package.length; ++i) {
                var namespace = this.props.data.pdepend.metrics.package[i];

                for (var j = 0; j < namespace.class.length; ++j) {
                    var artifact = namespace.class[j],
                        data = {
                            namespace: namespace["@name"],
                            class: artifact["@name"],
                            file: artifact.file["@name"],
                            start: artifact["@start"],
                            end: artifact["@end"],
                            metrics: {}
                        };

                    for (var metric in this.metrics.class) {
                        data.metrics[metric] = artifact["@" + metric];
                    }

                    metrics.push(data);
                }
            }

            return metrics;
        },

        render: function() {
            var metrics = {},
                metricName = "Undefined",
                type = this.props.query.type || "class",
                metric = this.props.query.metric || "loc";

            switch (type) {
                case "method":
                    metrics = this.getMethodMetrics();
                    break;

                case "class":
                    metrics = this.getClassMetrics();
                    break;

                case "package":
                    metrics = this.getPackageMetrics();
                    break;

                default:
                    throw "Unknow metric type " + type;
            }

            metricName = this.metrics[type][metric];

            return (<div className="row">
                <div className="col-md-3">
                    <h2>Metrics</h2>
                    <h3>Package</h3>
                    <h3>Type</h3>
                    <ul>
                    {$.map(this.metrics.class, function(name, metric) {
                        return (<li key={metric}><ReactRouter.Link to="pdepend" query={{type: "class", metric: metric}}>{name}</ReactRouter.Link></li>);
                    })}
                    </ul>
                    <h3>Method</h3>
                </div>
                <div className="col-md-9">
                    <h2>Tag Cloud</h2>
                    <Qafoo.QA.TagCloud caption={metricName} data={metrics} />
                    <h2>Table</h2>
                    <Qafoo.QA.Table captions={["Artifact", metricName]} data={metrics} />
                </div>
            </div>);
        }
    });
})();
