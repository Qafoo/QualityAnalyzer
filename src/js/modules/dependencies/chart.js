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

            var defs = this.svg.append("defs")
            defs.append("marker")
                .attr({
                    "id": "arrow",
                    "viewBox": "0 -5 10 10",
                    "refX": 5,
                    "refY": 0,
                    "markerWidth": 4,
                    "markerHeight": 4,
                    "orient": "auto"
                })
                .append("path")
                    .attr("d", "M0,-5L10,0L0,5")
                    .attr("class","arrowHead");

            this.svg.append('g')
                .attr('class', 'rows');
            this.svg.append('g')
                .attr('class', 'paths');
            this.svg.append('g')
                .attr('class', 'legend');
            this._drawLegend(element);

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

                    d3.select(element).selectAll(".hover").style("display", "block");

                    if (leave.type === "package") {
                        d3.select(this).select(".caption").attr("text-decoration", "underline");
                    }
                })
                .on("mouseout", function(leave, count) {
                    d3.select(this).select(".bg").attr("fill", (count % 2) ? "#fff" : "#f4f4f4");
                    d3.select(this).select(".node").style("display", leave.hidden ? "none" : "block");

                    d3.select(element).selectAll(".link").style("stroke", "#00dd00");

                    d3.select(element).selectAll(".hover").style("display", "none");

                    if (leave.type === "package") {
                        d3.select(this).select(".caption").attr("text-decoration", "none");
                    }
                })
                .on("click", function(leave) {
                    if (leave.type === "package") {
                        callback(leave);
                    }
                });

            bg  .attr("x", 1)
                .attr("y", function(leave, count) { return count * 24 + 1; })
                .attr("height", 22)
                .attr("width", width - 2)
                .attr("cursor", function(leave) { return leave.type === "package" ? "pointer" : "default"; })
                .attr("fill", function(leave, count) { return (count % 2) ? "#fff" : "#f4f4f4"; });

            text.attr("x", function(leave) { return leave.depth * 20 + 5; })
                .attr("y", function(leave, count) { return (count + 1) * 24 - 7; })
                .text(function(leave) { return leave.name; })
                .attr("cursor", function(leave) { return leave.type === "package" ? "pointer" : "default"; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")
                .attr("fill", function(leave) { return leave.hidden ? "gray" : "black"; });

            node.attr("cx", width * 2 / 3)
                .attr("cy", function(leave, count) { return count * 24 + 12; })
                .attr("r", function(leave) { return scales.size(leave.size); })
                .attr("fill", "black")
                .style("display", function(leave) { return leave.hidden ? "none" : "block"; });

            row.exit().remove();
        },

        _drawLinks: function(element, scales, links, leaves) {
            var g = d3.select(element).selectAll(".paths"),
                width = element.offsetWidth,
                leaveIndex = _.object(_.pluck(leaves, 'id'), _.range(leaves.length)),
                chart = this;

            var link = g.selectAll(".link").data(links);

            link.enter().append("path");

            link.attr("d", function(link) {
                    var from = leaveIndex[link.source],
                        to = leaveIndex[link.target],
                        maxWidth = (width / 3 - 20),
                        distance = Math.abs(from - to) * 24;

                    return chart._getLinkPath(
                        (width * 2 / 3),
                        ((from * 24) + 12),
                        ((to * 24) + 12),
                        maxWidth
                    );
                })
                .attr("fill", "none")
                .attr("class", function(link) { return "link source-" + link.source + " target-" + link.target; })
                .attr("stroke-width", function(link) { return scales.link(link.count); })
                .attr("stroke-linecap", "round")
                .attr("stroke", "#00dd00");

            link.exit().remove();
        },

        _getLinkPath: function(x, yFrom, yTo, maxWidth) {
            var distance = Math.abs(yFrom - yTo);

            if (yFrom < yTo) {
                return "M" + (x - 14) + "," + yFrom +
                    "A" + Math.min(maxWidth, distance / 2) + "," + (distance / 2) +
                    " 0 0,0" +
                    " " + (x - 14) + "," + yTo
            } else {
                return "M" + (x + 14) + "," + yFrom +
                    "A" + Math.min(maxWidth, distance / 2) + "," + (distance / 2) +
                    " 0 0,0" +
                    " " + (x + 14) + "," + yTo
            }
        },

        _drawLegend: function(element) {
            var g = d3.select(element).selectAll(".legend"),
                width = element.offsetWidth,
                margin = 5.5,
                legendWidth = 150,
                legendCenter = width - margin - (legendWidth / 2);

            var background = g.append("rect").attr("class", "main");

            background
                .attr("x", width - legendWidth - 1 - margin)
                .attr("y", margin)
                .attr("width", legendWidth + 1)
                .attr("height", 24 * 2 + 1)
                .attr("stroke-width", 1)
                .attr("stroke", "#ddd")
                .attr("fill", "#f4f4f4");

            var node1 = g.append("circle"),
                node2 = g.append("circle");

            node1
                .attr("cx", legendCenter)
                .attr("cy", 12 + 1 + margin)
                .attr("r", 8)
                .attr("fill", "black");

            node2
                .attr("cx", legendCenter)
                .attr("cy", 24 + 12 + 1 + margin)
                .attr("r", 6)
                .attr("fill", "black");

            var up = g.append("path"),
                down = g.append("path");

            down.attr("d", this._getLinkPath(legendCenter, 12 + 1 + margin, 24 + 12 + 1 + margin, 60))
                .attr("fill", "none")
                .attr("marker-end", "url(#arrow)")
                .attr("stroke-width", 2)
                .attr("stroke-linecap", "round")
                .attr("stroke", "#00dd00");

            up  .attr("d", this._getLinkPath(legendCenter, 24 + 12 + 1 + margin, 12 + 1 + margin, 60))
                .attr("fill", "none")
                .attr("marker-end", "url(#arrow)")
                .attr("stroke-width", 2)
                .attr("stroke-linecap", "round")
                .attr("stroke", "#00dd00");

            var upText = g.append("text"),
                downText = g.append("text");

            downText
                .attr("x", legendCenter - 32)
                .attr("y", 24 + 4 + 1 + margin)
                .attr("text-anchor", "end")
                .text("Down")
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "black");

            upText
                .attr("x", legendCenter + 32)
                .attr("y", 24 + 4 + 1 + margin)
                .attr("text-anchor", "start")
                .text("Up")
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "black");

            var hoverLegend = g.append("g").attr("class", "legend hover");
            hoverLegend.style("display", "none");

            background = hoverLegend.append("rect").attr("class", "main");
            background
                .attr("x", width - legendWidth - 1 - margin)
                .attr("y", margin)
                .attr("width", legendWidth + 1)
                .attr("height", 24 * 3 + 1)
                .attr("stroke-width", 1)
                .attr("stroke", "#ddd")
                .attr("fill", "#f4f4f4");

            var node1 = hoverLegend.append("circle"),
                node2 = hoverLegend.append("circle"),
                node3 = hoverLegend.append("circle");

            node1
                .attr("cx", legendCenter)
                .attr("cy", 12 + 1 + margin)
                .attr("r", 6)
                .attr("fill", "black");

            node2
                .attr("cx", legendCenter)
                .attr("cy", 24 + 12 + 1 + margin)
                .attr("r", 8)
                .attr("fill", "black");

            node3
                .attr("cx", legendCenter)
                .attr("cy", 48 + 12 + 1 + margin)
                .attr("r", 4)
                .attr("fill", "black");

            var upIn = hoverLegend.append("path"),
                downIn = hoverLegend.append("path"),
                upOut = hoverLegend.append("path"),
                downOut = hoverLegend.append("path");

            downIn
                .attr("d", this._getLinkPath(legendCenter, 12 + 1 + margin, 24 + 12 + 1 + margin, 60))
                .attr("fill", "none")
                .attr("marker-end", "url(#arrow)")
                .attr("stroke-width", 2)
                .attr("stroke-linecap", "round")
                .attr("stroke", "#dd0000");

            downOut
                .attr("d", this._getLinkPath(legendCenter, 24 + 12 + 1 + margin, 48 + 12 + 1 + margin, 60))
                .attr("fill", "none")
                .attr("marker-end", "url(#arrow)")
                .attr("stroke-width", 2)
                .attr("stroke-linecap", "round")
                .attr("stroke", "#0000dd");

            upOut
                .attr("d", this._getLinkPath(legendCenter, 24 + 12 + 1 + margin, 12 + 1 + margin, 60))
                .attr("fill", "none")
                .attr("marker-end", "url(#arrow)")
                .attr("stroke-width", 2)
                .attr("stroke-linecap", "round")
                .attr("stroke", "#0000dd");

            upIn
                .attr("d", this._getLinkPath(legendCenter, 48 + 12 + 1 + margin, 24 + 12 + 1 + margin, 60))
                .attr("fill", "none")
                .attr("marker-end", "url(#arrow)")
                .attr("stroke-width", 2)
                .attr("stroke-linecap", "round")
                .attr("stroke", "#dd0000");

            var upText1 = hoverLegend.append("text"),
                downText1 = hoverLegend.append("text"),
                upText2 = hoverLegend.append("text"),
                downText2 = hoverLegend.append("text");

            downText1
                .attr("x", legendCenter - 32)
                .attr("y", 24 + 4 + 1 + margin)
                .attr("text-anchor", "end")
                .text("In")
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "black");

            downText2
                .attr("x", legendCenter - 32)
                .attr("y", 48 + 4 + 1 + margin)
                .attr("text-anchor", "end")
                .text("Out")
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "black");

            upText1
                .attr("x", legendCenter + 32)
                .attr("y", 24 + 4 + 1 + margin)
                .attr("text-anchor", "start")
                .text("Out")
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "black");

            upText2
                .attr("x", legendCenter + 32)
                .attr("y", 48 + 4 + 1 + margin)
                .attr("text-anchor", "start")
                .text("In")
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "black");
        }
    };
})();
