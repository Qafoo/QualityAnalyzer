import React from "react";
import Router from 'react-router';

import Table from '../table.jsx';

let Metrics = React.createClass({
    metrics: {
        package: {
            cr: "Code Rank",
            rcr: "Reverse Code Rank",
            noc: "Number of Classes",
            nof: "Number of Functions",
            noi: "Number of Interfaces",
            nom: "Number of Methods"
        },
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
        },
        method: {
            loc: "Line of Code",
            cloc: "Comment Lines of Code",
            ncloc: "Non-Comment Line of Code",
            eloc: "Executable Lines of Code",
            lloc: "Logical Lines Of Code",
            ccn: "Cyclomatic Complexity",
            ccn2: "Extended Cyclomatic Complexity",
            npath: "NPath Complexity",
            mi: "Maintainability Index",
            hb: "Halstead Bugs",
            hd: "Halstead Difficulty",
            he: "Halstead Effort",
            hi: "Halstead Content",
            hl: "Halstead Level",
            hnd: "Halstead Vocabulary",
            hnt: "Halstead Length",
            ht: "Halstead Time",
            hv: "Halstead Volumne"
        }
    },

    propTypes: {
        data: React.PropTypes.object.isRequired
    },

    getFileName: function(file) {
        var basedir = this.props.data.baseDir,
            file = file || "";

        return "/" + file.replace(basedir, '');
    },

    getPackageMetrics: function() {
        var metrics = [],
            pdependData = this.props.data.analyzers.pdepend.metrics;

        for (var i = 0; i < pdependData.package.length; ++i) {
            var artifact = pdependData.package[i],
                data = {
                    namespace: "",
                    name: artifact.$["name"],
                    file: null,
                    start: null,
                    end: null,
                    metrics: {}
                };

            console.log(artifact);

            for (var metric in this.metrics.package) {
                data.metrics[metric] = Number(artifact.$[metric]) || 0;
            }

            metrics.push(data);
        }

        return metrics;
    },

    getClassMetrics: function() {
        var metrics = [],
            pdependData = this.props.data.analyzers.pdepend.metrics;

        for (var i = 0; i < pdependData.package.length; ++i) {
            var namespace = pdependData.package[i];

            for (var j = 0; j < namespace.class.length; ++j) {
                var artifact = namespace.class[j],
                    data = {
                        namespace: namespace.$["name"] + "\\",
                        name: artifact.$["name"],
                        file: this.getFileName(artifact.file[0].$["name"]),
                        start: Number(artifact.$["start"]),
                        end: Number(artifact.$["end"]),
                        metrics: {}
                    };

                for (var metric in this.metrics.class) {
                    data.metrics[metric] = Number(artifact.$[metric]) || 0;
                }

                metrics.push(data);
            }
        }

        return metrics;
    },

    getMethodMetrics: function() {
        var metrics = [],
            pdependData = this.props.data.analyzers.pdepend.metrics;

        for (var i = 0; i < pdependData.package.length; ++i) {
            var namespace = pdependData.package[i];

            for (var j = 0; j < namespace.class.length; ++j) {
                var type = namespace.class[j];
                if (!type.method) {
                    continue;
                }

                for (var k = 0; k < type.method.length; ++k) {
                    var artifact = type.method[k],
                        data = {
                            namespace: namespace.$["name"] + "\\" + type.$["name"] + "::",
                            name: artifact.$["name"] + "()",
                            file: this.getFileName(type.file[0].$["name"]),
                            start: Number(artifact.$["start"]),
                            end: Number(artifact.$["end"]),
                            metrics: {}
                        };

                    for (var metric in this.metrics.method) {
                        data.metrics[metric] = Number(artifact.$[metric]) || 0;
                    }

                    metrics.push(data);
                }
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
            selected = this.props.query.metric || "loc";

        switch (type) {
            case "package":
                metrics = this.getPackageMetrics();
                break;

            case "class":
                metrics = this.getClassMetrics();
                break;

            case "method":
                metrics = this.getMethodMetrics();
                break;

            default:
                throw "Unknow metric type " + type;
        }

        metricName = this.metrics[type][selected];

        return (<div className="row">
            <div className="col-md-3">
                <h3>Package</h3>
                <ul>
                {$.map(this.metrics.package, function(name, metric) {
                    return (<li key={metric}>
                        <Router.Link to="pdepend" query={{type: "package", metric: metric}}>
                            {type == "package" && metric == selected ?
                                <strong>{name}</strong> :
                                {name}
                            }
                        </Router.Link>
                    </li>);
                })}
                </ul>
                <h3>Type</h3>
                <ul>
                {$.map(this.metrics.class, function(name, metric) {
                    return (<li key={metric}>
                        <Router.Link to="pdepend" query={{type: "class", metric: metric}}>
                            {type == "class" && metric == selected ?
                                <strong>{name}</strong> :
                                {name}
                            }
                        </Router.Link>
                    </li>);
                })}
                </ul>
                <h3>Method</h3>
                <ul>
                {$.map(this.metrics.method, function(name, metric) {
                    return (<li key={metric}>
                        <Router.Link to="pdepend" query={{type: "method", metric: metric}}>
                            {type == "method" && metric == selected ?
                                <strong>{name}</strong> :
                                {name}
                            }
                        </Router.Link>
                    </li>);
                })}
                </ul>
            </div>
            <div className="col-md-9">
                <Table
                    captions={["Artifact", metricName]}
                    data={$.map(this.sortBySingleMetric(metrics, selected, 25), function(values) {
                        return [[
                            (values.file ?
                                (<Router.Link to={"/source" + values.file} query={{start: values.start, end: values.end}}>{values.namespace} <strong>{values.name}</strong></Router.Link>) :
                                (<span>{values.namespace} <strong>{values.name}</strong></span>)
                            ),
                            values.metric
                        ]];
                    })}
                />
            </div>
        </div>);
    }
});

export default Metrics; 
