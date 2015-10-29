import React from "react";
import {Link} from 'react-router';
import jQuery from 'jquery';
import _ from 'underscore';

import Table from '../table.jsx';
import Listing from './metrics/listing.jsx';

let FloatFormatter = function(value) {
    return parseFloat(value).toFixed(2);
};

let IntFormatter = function(value) {
    return parseInt(value);
};

let CodeRankFormatter = function(value, values) {
    var max = _.max(values);
    return (value / max * 10).toFixed(0);
};

let Metrics = React.createClass({
    metrics: {
        package: {
            cr: {name: "Code Rank", asc: false, formatter: CodeRankFormatter},
            rcr: {name: "Reverse Code Rank", asc: false, formatter: CodeRankFormatter},
            noc: {name: "Number of Classes", asc: false, formatter: IntFormatter},
            nof: {name: "Number of Functions", asc: false, formatter: IntFormatter},
            noi: {name: "Number of Interfaces", asc: false, formatter: IntFormatter},
            nom: {name: "Number of Methods", asc: false, formatter: IntFormatter},
        },
        class: {
            loc: {name: "Lines of Code", asc: false, formatter: IntFormatter},
            cloc: {name: "Comment Lines of Code", asc: false, formatter: IntFormatter},
            ncloc: {name: "Non-Comment Line of Code", asc: false, formatter: IntFormatter},
            eloc: {name: "Executable Lines of Code", asc: false, formatter: IntFormatter},
            lloc: {name: "Logical Lines Of Code", asc: false, formatter: IntFormatter},
            cr: {name: "Code Rank", asc: false, formatter: CodeRankFormatter},
            rcr: {name: "Reverse Code Rank", asc: false, formatter: CodeRankFormatter},
            ca: {name: "Afferent Coupling", asc: false, formatter: IntFormatter},
            ce: {name: "Efferent Coupling", asc: false, formatter: IntFormatter},
            cbo: {name: "Coupling Between Objects", asc: false, formatter: IntFormatter},
            csz: {name: "Class Size", asc: false, formatter: IntFormatter},
            cis: {name: "Class Interface Size", asc: false, formatter: IntFormatter},
            impl: {name: "Implemented Interfaces", asc: false, formatter: IntFormatter},
            nom: {name: "Number of Methods", asc: false, formatter: IntFormatter},
            noom: {name: "Number of Overwritten Methods", asc: false, formatter: IntFormatter},
            npm: {name: "Number of Public Methods", asc: false, formatter: IntFormatter},
            noam: {name: "Number of Added Methods", asc: false, formatter: IntFormatter},
            vars: {name: "Class Properties", asc: false, formatter: IntFormatter},
            varsi: {name: "Inherited Properties", asc: false, formatter: IntFormatter},
            varsnp: {name: "Non Private Properties", asc: false, formatter: IntFormatter},
            wmc: {name: "Weighted Method Count", asc: false, formatter: IntFormatter},
            wmci: {name: "Inherited Weighted Method Count", asc: false, formatter: IntFormatter},
            wmcnp: {name: "Non Private Weighted Method Count", asc: false, formatter: IntFormatter},
            dit: {name: "Depth of Inheritance Tree", asc: false, formatter: IntFormatter},
            nocc: {name: "Number of Child Classes", asc: false, formatter: IntFormatter},
        },
        method: {
            loc: {name: "Lines of Code", asc: false, formatter: IntFormatter},
            cloc: {name: "Comment Lines of Code", asc: false, formatter: IntFormatter},
            ncloc: {name: "Non-Comment Line of Code", asc: false, formatter: IntFormatter},
            eloc: {name: "Executable Lines of Code", asc: false, formatter: IntFormatter},
            lloc: {name: "Logical Lines Of Code", asc: false, formatter: IntFormatter},
            crap: {name: "CRAP Index", asc: false, formatter: IntFormatter},
            ccn: {name: "Cyclomatic Complexity", asc: false, formatter: IntFormatter},
            ccn2: {name: "Extended Cyclomatic Complexity", asc: false, formatter: IntFormatter},
            npath: {name: "NPath Complexity", asc: false, formatter: IntFormatter},
            mi: {name: "Maintainability Index", asc: true, formatter: FloatFormatter},
            hb: {name: "Halstead Bugs", asc: false, formatter: FloatFormatter},
            hd: {name: "Halstead Difficulty", asc: false, formatter: FloatFormatter},
            he: {name: "Halstead Effort", asc: false, formatter: FloatFormatter},
            hi: {name: "Halstead Content", asc: false, formatter: FloatFormatter},
            hl: {name: "Halstead Level", asc: false, formatter: FloatFormatter},
            hnd: {name: "Halstead Vocabulary", asc: false, formatter: FloatFormatter},
            hnt: {name: "Halstead Length", asc: false, formatter: FloatFormatter},
            ht: {name: "Halstead Time", asc: false, formatter: FloatFormatter},
            hv: {name: "Halstead Volumne", asc: false, formatter: FloatFormatter},
        }
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

            for (var metric in this.metrics.package) {
                data.metrics[metric] = Number(artifact.$[metric]);
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

            if (!namespace.class) {
                continue;
            }

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

            if (!namespace.class) {
                continue;
            }

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

    sortBySingleMetric: function(metrics, metric, asc, count) {
        return $.map(metrics, function(data) {
            data.metric = data.metrics[metric];
            delete data.metrics;
            return data;
        }).sort(function(a, b) {
            return (asc ? 1 : -1) * (a.metric < b.metric ? -1 : (a.metric > b.metric) ? 1 : 0);
        }).slice(0, count);
    },

    render: function() {
        var metrics = {},
            metric = {name: "Undefined", asc: false, formatter: IntFormatter},
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

        metric = this.metrics[type][selected];
        metrics = this.sortBySingleMetric(metrics, selected, metric.asc, 25);

        jQuery("html, body").animate({scrollTop: 0}, 500);
        return (<div className="row">
            <div className="col-md-3">
                <Listing title="Package" metrics={this.metrics.package} selected={type == "package" ? selected : null} />
                <Listing title="Class" metrics={this.metrics.class} selected={type == "class" ? selected : null} />
                <Listing title="Method" metrics={this.metrics.method} selected={type == "method" ? selected : null} />
            </div>
            <div className="col-md-9">
                <Table
                    captions={["Artifact", metric.name]}
                    data={_.map(metrics, function(value) {
                        return [
                            (value.file ?
                                (<Link to="source" query={{file: value.file, start: value.start, end: value.end}}>{value.namespace} <strong>{value.name}</strong></Link>) :
                                (<span>{value.namespace} <strong>{value.name}</strong></span>)
                            ),
                            <div className="text-right">{metric.formatter(value.metric, _.pluck(metrics, "metric"))}</div>
                        ];
                    })}
                />
            </div>
        </div>);
    }
});

export default Metrics; 
