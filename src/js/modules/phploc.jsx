import React from "react";

import d3 from "d3";
import PieChart from "react-d3-components/lib/PieChart.js";

let PhpLoc = React.createClass({
    getInitialState: function() {
        return {
            loc: [],
            types: [],
        };
    },

    componentDidMount: function() {
        var data = this.props.data.analyzers.phploc.phploc;

        this.setState({
            loc: [
                {x: "Comments", y: data.cloc[0]},
                {x: "Lines", y: data.ncloc[0]},
            ]
        });

        this.setState({
            types: [
                {x: "Traits", y: data.traits[0]},
                {x: "Abstract", y: data.abstractClasses[0]},
                {x: "Interface", y: data.interfaces[0]},
                {x: "Concrete", y: data.concreteClasses[0]},
            ]
        });
    },

    render: function() {
        var files = (this.statistics ? this.statistics.files : "calculating…"),
            lineCoverage = (this.statistics ? this.statistics.coverage.lines : null),
            fileCoverage = (this.statistics ? this.statistics.coverage.files : null),
            colors = d3.scale.ordinal().range(["#A6403D", "#333E71", "#A6883D", "#308336"]);

        return (<div className="row">
            <h2>Project Size</h2>
            <div className="col-md-6">
                <h3>Lines of Code</h3>
                <PieChart height={300} width={300} colorScale={colors}
                    data={{values: this.state.loc}}
                    tooltipHtml={function(x, y) {
                        return x + ": " + y;
                    }} />
            </div>
            <div className="col-md-6">
                <h3>Types</h3>
                <PieChart height={300} width={300} colorScale={colors}
                    data={{values: this.state.types}}
                    tooltipHtml={function(x, y) {
                        return x + ": " + y;
                    }} />
            </div>
        </div>);
    }
});

export default PhpLoc; 
