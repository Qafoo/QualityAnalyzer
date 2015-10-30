import React from "react";

import PieChart from "../pie_chart.jsx";

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
                {label: "Comments", value: data.cloc[0]},
                {label: "Lines", value: data.ncloc[0]},
            ]
        });

        this.setState({
            types: [
                {label: "Traits", value: data.traits[0]},
                {label: "Abstract", value: data.abstractClasses[0]},
                {label: "Interface", value: data.interfaces[0]},
                {label: "Concrete", value: data.concreteClasses[0]},
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
            <div className="col-md-2 col-sm-4">
                <ul className="list-unstyled legend">
                    <li className="comment"><span className="glyphicon glyphicon-record"></span> Comment</li>
                    <li className="non-comment"><span className="glyphicon glyphicon-record"></span> Non-Comment</li>
                </ul>
            </div>
            <div className="col-md-4 col-sm-8">
                <PieChart
                    title="Lines of Code"
                    classes={["comment", "non-comment"]}
                    values={this.state.loc} />
            </div>
            <div className="col-md-2 col-sm-4">
                <ul className="list-unstyled legend">
                    <li className="trait"><span className="glyphicon glyphicon-record"></span> Trait</li>
                    <li className="abstract"><span className="glyphicon glyphicon-record"></span> Abstract</li>
                    <li className="interface"><span className="glyphicon glyphicon-record"></span> Interface</li>
                    <li className="class"><span className="glyphicon glyphicon-record"></span> Class</li>
                </ul>
            </div>
            <div className="col-md-4 col-sm-8">
                <PieChart
                    title="Types"
                    classes={["traint", "abstract", "interface", "class"]}
                    values={this.state.types} />
            </div>
        </div>);
    }
});

export default PhpLoc;
