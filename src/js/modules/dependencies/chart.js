/* globals _, d3 */

var Qafoo = Qafoo || {QA: {}};
Qafoo.QA.Modules = Qafoo.QA.Modules || {};

(function () {
    "use strict";

    Qafoo.QA.Modules.DependenciesChart = {
        svg: null,
        callback: null,

        create: function(element, callback, state) {
            this.callback = callback;
            this.svg = d3.select(element).append('svg')
                .attr('class', 'd3')
                .attr('width', '100%')
                .attr('height', '500px');

            this.svg.append('g')
                .attr('class', 'rows');
            this.svg.append('g')
                .attr('class', 'paths');

            this.update(element, state);
        },

        update: function(element, state) {
            this.svg.attr('height', (state.leaves.length * 24 + 10) + "px");

            var scales = this._scales(element, state.leaves, state.links);

            this._drawRows(element, scales, state.leaves);
            this._drawLinks(element, scales, state.links, state.leaves);
        },

        destroy: function(element) {
        },

        _scales: function(element, leaves, links) {
            var maxLinks = _.max(_.pluck(links, "count"));

            return {
                size: d3.scale.sqrt()
                    .range([2, 12])
                    .domain([0, leaves[0] ? leaves[0].size : 1]),
                link: d3.scale.sqrt()
                    .range([1, 5])
                    .domain([0, maxLinks])
            };
        },

        _drawRows: function(element, scales, leaves) {
            var g = d3.select(element).selectAll(".rows"),
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

                    d3.select(element).selectAll(".link").style("stroke", "#dddddd");
                    d3.select(element).selectAll(".source-" + leave.id).style("stroke", "#0000dd");
                    d3.select(element).selectAll(".target-" + leave.id).style("stroke", "#dd0000");

                    if (leave.type === "package") {
                        d3.select(this).select(".caption").attr("text-decoration", "underline");
                    }
                })
                .on("mouseout", function(leave, count) {
                    d3.select(this).select(".bg").attr("fill", (count % 2) ? "#fff" : "#f4f4f4");
                    d3.select(this).select(".node").style("display", leave.hidden ? "none" : "block");

                    d3.select(element).selectAll(".link").style("stroke", "#00dd00");

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
        },

        _drawLinks: function(element, scales, links, leaves) {
            var g = d3.select(element).selectAll(".paths"),
                width = element.offsetWidth,
                leaveIndex = _.object(_.pluck(leaves, 'id'), _.range(leaves.length));

            var link = g.selectAll(".link").data(links);

            link.enter().append("path");

            link.attr("d", function(link) {
                    var from = leaveIndex[link.source],
                        to = leaveIndex[link.target],
                        maxWidth = (width / 3 - 20),
                        distance = Math.abs(from - to) * 24;

                    if (from < to) {
                        return "M" + ((width * 2 / 3) - 14) + "," + ((from * 24) + 12) +
                            "A" + Math.min(maxWidth, distance / 2) + "," + (distance / 2) +
                            " 0 0,0" +
                            " " + ((width * 2 / 3) - 14) + "," + ((to * 24) + 12);
                    } else {
                        return "M" + ((width * 2 / 3) + 14) + "," + ((to * 24) + 12) +
                            "A" + Math.min(maxWidth, distance / 2) + "," + (distance / 2) +
                            " 0 0,1" +
                            " " + ((width * 2 / 3) + 14) + "," + ((from * 24) + 12);
                    }
                })
                .attr("class", function(link) { return "link source-" + link.source + " target-" + link.target; })
                .attr("fill", "none")
                .attr("stroke-width", function(link) { return scales.link(link.count); })
                .attr("stroke-linecap", "round")
                .attr("stroke", "#00dd00");

            link.exit().remove();
        }
    };
})();
