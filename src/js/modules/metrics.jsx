/* eslint max-depth: [2, 5] */
import React from "react"
import { Link } from 'react-router'
import jQuery from 'jquery'
import _ from 'underscore'

import Table from '../table.jsx'
import Listing from './metrics/listing.jsx'

let FloatFormatter = function (value) {
    return parseFloat(value).toFixed(2)
}

let IntFormatter = function (value) {
    return parseInt(value, 10)
}

let CodeRankFormatter = function (value, values) {
    var max = _.max(values)
    return (value / max * 10).toFixed(0)
}

let Metrics = React.createClass({
    propTypes: {
        data: React.PropTypes.object,
        query: React.PropTypes.object,
    },

    getFileName: function (file) {
        var basedir = this.props.data.baseDir

        file = file || ""
        return "/" + file.replace(basedir, '')
    },

    getPackageMetrics: function () {
        var metrics = []
        var pdependData = this.props.data.analyzers.pdepend.metrics

        for (var i = 0; i < pdependData.package.length; ++i) {
            var artifact = pdependData.package[i]
            var data = {
                namespace: "",
                name: artifact.$["name"],
                file: null,
                start: null,
                end: null,
                metrics: {},
            }

            for (var metric in this.metrics.package) {
                data.metrics[metric] = Number(artifact.$[metric])
            }

            metrics.push(data)
        }

        return metrics
    },

    getClassMetrics: function () {
        var metrics = []
        var pdependData = this.props.data.analyzers.pdepend.metrics

        for (var i = 0; i < pdependData.package.length; ++i) {
            var namespace = pdependData.package[i]

            if (!namespace.class) {
                continue
            }

            for (var j = 0; j < namespace.class.length; ++j) {
                var artifact = namespace.class[j]
                var data = {
                    namespace: namespace.$["name"] + "\\",
                    name: artifact.$["name"],
                    file: this.getFileName(artifact.file[0].$["name"]),
                    start: Number(artifact.$["start"]),
                    end: Number(artifact.$["end"]),
                    metrics: {},
                }

                for (var metric in this.metrics.class) {
                    data.metrics[metric] = Number(artifact.$[metric]) || 0
                }

                metrics.push(data)
            }
        }

        return metrics
    },

    getMethodMetrics: function () {
        var metrics = []
        var pdependData = this.props.data.analyzers.pdepend.metrics

        for (var i = 0; i < pdependData.package.length; ++i) {
            var namespace = pdependData.package[i]

            if (!namespace.class) {
                continue
            }

            for (var j = 0; j < namespace.class.length; ++j) {
                var type = namespace.class[j]
                if (!type.method) {
                    continue
                }

                for (var k = 0; k < type.method.length; ++k) {
                    var artifact = type.method[k]
                    var data = {
                        namespace: namespace.$["name"] + "\\" + type.$["name"] + "::",
                        name: artifact.$["name"] + "()",
                        file: this.getFileName(type.file[0].$["name"]),
                        start: Number(artifact.$["start"]),
                        end: Number(artifact.$["end"]),
                        metrics: {},
                    }

                    for (var metric in this.metrics.method) {
                        data.metrics[metric] = Number(artifact.$[metric]) || 0
                    }

                    metrics.push(data)
                }
            }
        }

        return metrics
    },

    sortBySingleMetric: function (metrics, metric, asc) {
        return _.map(metrics, function (data) {
            data.metric = data.metrics[metric]
            delete data.metrics
            return data
        }).sort(function (a, b) {
            var factor = asc ? 1 : -1

            if (a.metric < b.metric) {
                return factor * -1
            } else if (a.metric > b.metric) {
                return factor
            } else {
                return 0
            }
        })
    },

    metrics: {
        package: {
            cr: { name: "Code Rank", asc: false, formatter: CodeRankFormatter },
            rcr: { name: "Reverse Code Rank", asc: false, formatter: CodeRankFormatter },
            noc: { name: "Number of Classes", asc: false, formatter: IntFormatter },
            nof: { name: "Number of Functions", asc: false, formatter: IntFormatter },
            noi: { name: "Number of Interfaces", asc: false, formatter: IntFormatter },
            nom: { name: "Number of Methods", asc: false, formatter: IntFormatter },
            commits: { name: "GIT Commits", asc: false, formatter: IntFormatter },
        },
        class: {
            loc: { name: "Lines of Code", asc: false, formatter: IntFormatter },
            commits: { name: "GIT Commits", asc: false, formatter: IntFormatter },
            cloc: { name: "Comment Lines of Code", asc: false, formatter: IntFormatter },
            ncloc: { name: "Non-Comment Line of Code", asc: false, formatter: IntFormatter },
            eloc: { name: "Executable Lines of Code", asc: false, formatter: IntFormatter },
            lloc: { name: "Logical Lines Of Code", asc: false, formatter: IntFormatter },
            cr: { name: "Code Rank", asc: false, formatter: CodeRankFormatter },
            rcr: { name: "Reverse Code Rank", asc: false, formatter: CodeRankFormatter },
            ca: { name: "Afferent Coupling", asc: false, formatter: IntFormatter },
            ce: { name: "Efferent Coupling", asc: false, formatter: IntFormatter },
            cbo: { name: "Coupling Between Objects", asc: false, formatter: IntFormatter },
            csz: { name: "Class Size", asc: false, formatter: IntFormatter },
            cis: { name: "Class Interface Size", asc: false, formatter: IntFormatter },
            impl: { name: "Implemented Interfaces", asc: false, formatter: IntFormatter },
            nom: { name: "Number of Methods", asc: false, formatter: IntFormatter },
            noom: { name: "Number of Overwritten Methods", asc: false, formatter: IntFormatter },
            npm: { name: "Number of Public Methods", asc: false, formatter: IntFormatter },
            noam: { name: "Number of Added Methods", asc: false, formatter: IntFormatter },
            vars: { name: "Class Properties", asc: false, formatter: IntFormatter },
            varsi: { name: "Inherited Properties", asc: false, formatter: IntFormatter },
            varsnp: { name: "Non Private Properties", asc: false, formatter: IntFormatter },
            wmc: { name: "Weighted Method Count", asc: false, formatter: IntFormatter },
            wmci: { name: "Inherited Weighted Method Count", asc: false, formatter: IntFormatter },
            wmcnp: { name: "Non Private Weighted Method Count", asc: false, formatter: IntFormatter },
            dit: { name: "Depth of Inheritance Tree", asc: false, formatter: IntFormatter },
            nocc: { name: "Number of Child Classes", asc: false, formatter: IntFormatter },
        },
        method: {
            loc: { name: "Lines of Code", asc: false, formatter: IntFormatter },
            commits: { name: "GIT Commits", asc: false, formatter: IntFormatter },
            cloc: { name: "Comment Lines of Code", asc: false, formatter: IntFormatter },
            ncloc: { name: "Non-Comment Line of Code", asc: false, formatter: IntFormatter },
            eloc: { name: "Executable Lines of Code", asc: false, formatter: IntFormatter },
            lloc: { name: "Logical Lines Of Code", asc: false, formatter: IntFormatter },
            crap: { name: "CRAP Index", asc: false, formatter: IntFormatter },
            ccn: { name: "Cyclomatic Complexity", asc: false, formatter: IntFormatter },
            ccn2: { name: "Extended Cyclomatic Complexity", asc: false, formatter: IntFormatter },
            npath: { name: "NPath Complexity", asc: false, formatter: IntFormatter },
            mi: { name: "Maintainability Index", asc: true, formatter: FloatFormatter },
            hb: { name: "Halstead Bugs", asc: false, formatter: FloatFormatter },
            hd: { name: "Halstead Difficulty", asc: false, formatter: FloatFormatter },
            he: { name: "Halstead Effort", asc: false, formatter: FloatFormatter },
            hi: { name: "Halstead Content", asc: false, formatter: FloatFormatter },
            hl: { name: "Halstead Level", asc: false, formatter: FloatFormatter },
            hnd: { name: "Halstead Vocabulary", asc: false, formatter: FloatFormatter },
            hnt: { name: "Halstead Length", asc: false, formatter: FloatFormatter },
            ht: { name: "Halstead Time", asc: false, formatter: FloatFormatter },
            hv: { name: "Halstead Volumne", asc: false, formatter: FloatFormatter },
        },
    },

    render: function () {
        var metrics = {}
        var metric = { name: "Undefined", asc: false, formatter: IntFormatter }
        var page = this.props.query.page || 1
        var perPage = 25
        var selection = { type: this.props.query.type || "class", metric: this.props.query.metric || "loc" }

        switch (selection.type) {
        case "package":
            metrics = this.getPackageMetrics()
            break

        case "class":
            metrics = this.getClassMetrics()
            break

        case "method":
            metrics = this.getMethodMetrics()
            break

        default:
            throw new Error("Unknow metric type " + selection.type)
        }

        metric = this.metrics[selection.type][selection.metric]
        metrics = this.sortBySingleMetric(metrics, selection.metric, metric.asc)

        jQuery("html, body").animate({ scrollTop: 0 }, 500)
        return (<div className="row">
            <div className="col-md-3">
                <Listing title="Package" metrics={this.metrics} type="package" selection={selection} />
                <Listing title="Class" metrics={this.metrics} type="class" selection={selection} />
                <Listing title="Method" metrics={this.metrics} type="method" selection={selection} />
            </div>
            <div className="col-md-9">
                <Table
                    captions={["Artifact", metric.name]}
                    data={_.map(metrics.slice((page - 1) * perPage, page * perPage), function (value) {
                        return [
                            (value.file ?
                                (<Link to={{ pathname: "/source", query: { file: value.file, start: value.start, end: value.end } }}>
                                    {value.namespace} <strong>{value.name}</strong>
                                </Link>) :
                                (<span>{value.namespace} <strong>{value.name}</strong></span>)
                            ),
                            (<div className="text-right">
                                {metric.formatter(value.metric, _.pluck(metrics, "metric"))}
                            </div>),
                        ]
                    })}
                />
                <nav>
                    <ul className="pager">
                        <li className={"previous" + (page <= 1 ? " disabled" : "")}>
                            <Link to={{ pathname: "/pdepend", query: { type: selection.type, metric: selection.metric, page: 1 * page - 1 } }}>
                                <span aria-hidden="true">&larr;</span> Previous
                            </Link>
                        </li>
                        <li className={"next" + ((page * perPage) > metrics.length ? " disabled" : "")}>
                            <Link to={{ pathname: "/pdepend", query: { type: selection.type, metric: selection.metric, page: 1 * page + 1 } }}>
                                <span aria-hidden="true">&rarr;</span> Next
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>)
    },
})

export default Metrics
