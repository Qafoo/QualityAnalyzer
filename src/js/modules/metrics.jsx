var Qafoo = Qafoo || {QA: {}};
Qafoo.QA.Modules = Qafoo.QA.Modules || {};

(function () {
    "use strict";

    Qafoo.QA.Modules.Metrics = React.createClass({
        metrics: {
            class: {
                loc: "Line of Code",
                cloc: "Comment Lines of Code",
                ncloc: "Non-Comment Line of Code",
                eloc: "Executable Lines of Code",
                lloc: "Logical Lines Of Code",
                cr: "Code Rank",
                rcr: "Reverse Code Rank",
                ca: "Afferent Coupling",
                ce: "Efferent Coupling",
                cbo: "Coupling Between Objects",
                csz: "Class Size",
                cis: "Class Interface Size",
                impl: "Implemented Interfaces",
                nom: "Number of Methods",
                noom: "Number of Overwritten Methods",
                npm: "Number of Public Methods",
                noam: "Number of Added Methods",
                vars: "Class Properties",
                varsi: "Inherited Properties",
                varsnp: "Non Private Properties",
                wmc: "Weighted Method Count",
                wmci: "Inherited Weighted Method Count",
                wmcnp: "Non Private Weighted Method Count",
                dit: "Depth of Inheritance Tree",
                nocc: "Number of Child Classes"
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
                            start: Number(artifact["@start"]),
                            end: Number(artifact["@end"]),
                            metrics: {}
                        };

                    for (var metric in this.metrics.class) {
                        data.metrics[metric] = Number(artifact["@" + metric]) || 0;
                    }

                    metrics.push(data);
                }
            }

            return metrics;
        },

        sortBySingleMetric: function(metrics, metric, count) {
            return $.map(metrics, function(data) {
                data.metric = data.metrics[metric];
                delete data.metrics;
                return data;
            }).sort(function(a, b) {
                return (a.metric < b.metric ? 1 : (a.metric > b.metric) ? -1 : 0);
            }).slice(0, count);
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
                    <Qafoo.QA.Table
                        captions={["Artifact", metricName]}
                        data={$.map(this.sortBySingleMetric(metrics, metric, 25), function(values) {
                            return [[
                                (<ReactRouter.Link to={"/source" + values.file} query={{start: values.start, end: values.end}}>{values.namespace}\<strong>{values.class}</strong></ReactRouter.Link>),
                                values.metric
                            ]];
                        })}
                    />
                </div>
            </div>);
        }
    });
})();
