import React from "react";

import Model from "./model.js";
import d3 from "d3";
import PieChart from "react-d3-components/lib/PieChart.js";

let Coverage = React.createClass({
    chartLines: null,
    chartFiles: null,
    statistics: null,

    getInitialState: function() {
        return {
            hasData: false,
        };
    },

    recalculate: function() {
    },

    componentWillMount: function(props) {
        var model = new Model();

        this.statistics = model.calculateNodeStatistics(this.props.node);
        this.setState({hasData: true});
    },

    componentWillReceiveProps: function(props) {
        var model = new Model();

        this.statistics = model.calculateNodeStatistics(props.node);
    },

    render: function() {
        var files = (this.statistics ? this.statistics.files : "calculating…"),
            lineCoverage = (this.statistics ? this.statistics.coverage.lines : null),
            fileCoverage = (this.statistics ? this.statistics.coverage.files : null),
            colors = d3.scale.ordinal().range(["#A6403D", "#308336"]);

        return <div className="row">
            <dl className="dl-horizontal">
                <dt>Files</dt>
                <dd>{files}</dd>
                {!lineCoverage ? '' : <dt>Executable Lines</dt>}
                {!lineCoverage ? '' : <dd>{lineCoverage.count}</dd>}
            </dl>
            {!lineCoverage ? '' :
            <div className="col-md-6">
                <h4>Lines of Code</h4>
                <PieChart height={300} width={300} colorScale={colors}
                    data={{
                        // label: (lineCoverage.covered / lineCoverage.count * 100).toFixed(2) + "%",
                        label: "covered",
                        values: [
                            {x: "uncovered", y: lineCoverage.count - lineCoverage.covered},
                            {x: "covered", y: lineCoverage.covered},
                        ]
                    }}
                    tooltipHtml={function(x, y) {
                        return y + " lines (" + (y / lineCoverage.count * 100).toFixed(2) + "%)";
                    }} />
            </div>}
            {!fileCoverage ? '' :
            <div className="col-md-6">
                <h4>Files</h4>
                <PieChart height={300} width={300} colorScale={colors}
                    data={{
                        // label: (fileCoverage.covered / fileCoverage.count * 100).toFixed(2) + "%",
                        label: "uncovered",
                        values: [
                            {x: "uncovered", y: fileCoverage.count - fileCoverage.covered},
                            {x: "covered", y: fileCoverage.covered},
                        ]
                    }}
                    tooltipHtml={function(x, y) {
                        return y + " files (" + (y / fileCoverage.count * 100).toFixed(2) + "%)";
                    }} />
            </div>}
        </div>;
    }
});

export default Coverage;
