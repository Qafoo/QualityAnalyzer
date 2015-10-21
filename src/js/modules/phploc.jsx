import React from "react";

import PieChart from '../pie-chart.jsx';

let PhpLoc = React.createClass({
    componentDidMount: function() {
        var data = this.props.data.analyzers.phploc.phploc;

        PieChart.create(
            document.getElementById('chart-loc'),
            [
                {color: "#808080", label: "Comments", value: data.cloc[0]},
                {color: "#308336", label: "Lines", value: data.ncloc[0]},
            ],
            data.loc[0] * 1 + data.ncloc[0] * 1
        );
        PieChart.create(
            document.getElementById('chart-types'),
            [
                {color: "#A6403D", label: "Traits", value: data.traits[0]},
                {color: "#333E71", label: "Abstract", value: data.abstractClasses[0]},
                {color: "#A6883D", label: "Interface", value: data.interfaces[0]},
                {color: "#308336", label: "Concrete", value: data.concreteClasses[0]},
            ],
            data.classes[0] * 1 + data.traits[0] * 1 + data.interfaces[0] * 1
        );
    },

    render: function() {
        return (<div className="row">
            <h2>Project Size</h2>
            <div className="col-md-6">
                <h3>Lines of Code</h3>
                <div className="pie-chart" id="chart-loc"></div>
            </div>
            <div className="col-md-6">
                <h3>Types</h3>
                <div className="pie-chart" id="chart-types"></div>
            </div>
        </div>);
    }
});

export default PhpLoc; 
