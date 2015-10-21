import nv from "nvd3";
import d3 from "d3";

let PieChart = {
    svg: null,
        
    create: function(element, state, title) {
        this.svg = d3.select(element).append('svg')
            .attr('class', "d3")
            .attr('width', element.offsetWidth + "px")
            .attr('height', element.offsetHeight + "px");

        var chart = nv.models.pieChart()
            .x(function(datum) { return datum.label })
            .y(function(datum) { return datum.value })
            .color(function(datum) { return datum.color })
            .showLegend(false)
            .donut(true)
            .width(element.offsetWidth)
            .height(element.offsetHeight);

        chart.title(title);
        chart.pie.labelsOutside(true).donut(true);

        this.svg
            .datum(state)
            .transition().duration(0)
            .call(chart);

        nv.addGraph(chart);
    },

    update: function(element, state) {
    },

    destroy: function(element) {
    },
};

export default PieChart; 
