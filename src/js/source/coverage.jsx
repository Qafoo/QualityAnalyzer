import React from "react"

import Model from "./model.js"
import PieChart from "../pie_chart.jsx"

let Coverage = React.createClass({
    propTypes: {
        node: React.PropTypes.object,
    },

    getInitialState: function () {
        return {
            hasData: false,
        }
    },

    componentWillMount: function (props) {
        var model = new Model()

        this.statistics = model.calculateNodeStatistics(this.props.node)
        this.setState({ hasData: true })
    },

    componentWillReceiveProps: function (props) {
        var model = new Model()

        this.statistics = model.calculateNodeStatistics(props.node)
    },

    chartLines: null,
    chartFiles: null,
    statistics: null,

    render: function () {
        var files = (this.statistics ? this.statistics.files : "calculating…")
        var lineCoverage = (this.statistics ? this.statistics.coverage.lines : null)
        var fileCoverage = (this.statistics ? this.statistics.coverage.files : null)

        return (<div className="row">
            <dl className="dl-horizontal">
                <dt>Files</dt>
                <dd>{files}</dd>
                {!lineCoverage ? '' : <dt>Executable Lines</dt>}
                {!lineCoverage ? '' : <dd>{lineCoverage.count}</dd>}
            </dl>
            {!lineCoverage && !fileCoverage ? '' :
            <div>
                <div className="col-md-12">
                    <h3>Code Coverage</h3>
                </div>
                {!lineCoverage ? '' :
                <div className="col-md-6">
                    <h4>Lines of Code</h4>
                    <PieChart
                        id="chart-loc"
                        title={(lineCoverage.covered / lineCoverage.count * 100).toFixed(2) + "%"}
                        classes={["uncovered", "covered"]}
                        values={[
                            { label: "uncovered", value: lineCoverage.count - lineCoverage.covered },
                            { label: "covered", value: lineCoverage.covered },
                        ]} />
                </div>}
                {!fileCoverage ? '' :
                <div className="col-md-6">
                    <h4>Files</h4>
                    <PieChart
                        id="chart-file"
                        title={(fileCoverage.covered / fileCoverage.count * 100).toFixed(2) + "%"}
                        classes={["uncovered", "covered"]}
                        values={[
                            { label: "uncovered", value: fileCoverage.count - fileCoverage.covered },
                            { label: "covered", value: fileCoverage.covered },
                        ]} />
                </div>}
            </div>}
        </div>)
    },
})

export default Coverage
