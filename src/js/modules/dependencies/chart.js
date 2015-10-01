var Qafoo = Qafoo || {QA: {}};
Qafoo.QA.Modules = Qafoo.QA.Modules || {};

(function () {
    "use strict";

    Qafoo.QA.Modules.DependenciesChart = {
        svg: null,
        callback: function(leave) {
            console.log(leave);
        },

        create: function(element, callback, state) {
            this.callback = callback;
            this.svg = d3.select(element).append('svg')
                .attr('class', 'd3')
                .attr('width', '100%')
                .attr('height', '500px');

            this.svg.append('g')
                .attr('class', 'dependencies');

            this.update(element, state);
        },

        update: function(element, state) {
            this.svg.attr('height', (state.leaves.length * 24 + 10) + "px");

            
            this._drawRows(
                element,
                this._scales(element, state.leaves),
                state.leaves
            );
        },

        destroy: function(element) {
        },

        _scales: function(element, leaves) {
            return {
                size: d3.scale.sqrt()
                    .range([2, 12])
                    .domain([0, leaves[0] ? leaves[0].size : 1])
            }
        },

        _drawRows: function(element, scales, leaves) {
            var g = d3.select(element).selectAll(".dependencies"),
                width = element.offsetWidth,
                callback = this.callback;

            var row = g.selectAll(".row").data(leaves);

            row.enter().append("g").attr("class", "row");

            var bg   = row.append("rect").attr("class", "bg"),
                text = row.append("text").attr("class", "caption"),
                node = row.append("circle").attr("class", "node");

            row .on("mouseover", function(leave) {
                    d3.select(this).select(".bg").attr("fill", "#eee");
                    d3.select(this).select(".node").style("display", "block");

                    if (leave.type === "package") {
                        d3.select(this).select(".caption").attr("text-decoration", "underline");
                    }
                })
                .on("mouseout", function(leave, count) {
                    d3.select(this).select(".bg").attr("fill", (count % 2) ? "#fff" : "#f4f4f4");
                    d3.select(this).select(".node").style("display", leave.hidden ? "none" : "block");

                    if (leave.type === "package") {
                        d3.select(this).select(".caption").attr("text-decoration", "none");
                    }
                })
                .on("click", function(leave) {
                    if (leave.type === "package") {
                        callback(leave);
                    }
                });

            bg  .attr("y", function(leave, count) { return count * 24 + 1; })
                .attr("x", 1)
                .attr("height", 22)
                .attr("width", width - 2)
                .attr("cursor", function(leave) { return leave.type === "package" ? "pointer" : "default"; })
                .attr("fill", function(leave, count) { return (count % 2) ? "#fff" : "#f4f4f4"; });

            text.attr("y", function(leave, count) { return (count + 1) * 24 - 7; })
                .attr("x", function(leave) { return leave.depth * 20 + 5; })
                .text(function(leave) { return leave.name; })
                .attr("cursor", function(leave) { return leave.type === "package" ? "pointer" : "default"; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")
                .attr("fill", function(leave) { return leave.hidden ? "gray" : "black"; });

            node.attr("cy", function(leave, count) { return count * 24 + 12; })
                .attr("cx", width * 2 / 3)
                .attr("r", function(leave) { return scales.size(leave.size); })
                .attr("fill", "black")
                .style("display", function(leave) { return leave.hidden ? "none" : "block"; });

            row.exit().remove();
        }
    };
})();
