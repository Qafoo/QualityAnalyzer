import d3 from "d3";
import _ from 'underscore';

let Chart = {
    svg: null,
    callback: null,

    create: function(element, callback, state) {
        this.callback = callback;
        this.svg = d3.select(element).append('svg')
            .attr('class', 'd3')
            .attr('width', '100%')
            .attr('height', '500px');

        var defs = this.svg.append("defs");
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
            .attr('class', 'legends');
        this._drawLegends(element);

        this.update(element, state);
    },

    update: function(element, state) {
        this.svg.attr('height', Math.max((state.leaves.length * 24 + 10), element.offsetHeight) + "px");

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

    _addClass: function(nodes, className) {
        nodes.each(function() {
            var node = d3.select(this);

            if (node.attr("class").indexOf(className) < 0) {
                node.attr("class", node.attr("class") + " " + className);
            }
        });
    },

    _removeClass: function(nodes, className) {
        nodes.each(function() {
            var node = d3.select(this);

            if (node.attr("class").indexOf(className) >= 0) {
                node.attr("class", node.attr("class").replace(className, ""));
            }
        });
    },

    _drawRows: function(element, scales, leaves) {
        var g = d3.select(element).selectAll(".rows"),
            width = element.offsetWidth,
            callback = this.callback,
            chart = this;

        var row = g.selectAll(".row").data(leaves, function(leave, count) {return "l_" + leave.id;}),
            newRow = row.enter(),
            group = newRow.append("g");

        // New row
        group
            .attr("class", function(leave, count) {
                return "row " +
                    leave.type + " " +
                    ((count % 2) ? "uneven " : "") +
                    (leave.hidden ? "unfolded " : "");
            })
            .on("mouseover", function(leave) {
                chart._addClass(d3.select(this), "hover");

                chart._addClass(d3.select(element).selectAll(".paths"), "hover");
                chart._addClass(d3.select(element).selectAll(".legends"), "hover");
                chart._addClass(d3.select(element).selectAll(".source-" + leave.id), "outgoing");
                chart._addClass(d3.select(element).selectAll(".target-" + leave.id), "incoming");
            })
            .on("mouseout", function(leave) {
                chart._removeClass(d3.select(this), "hover");

                chart._removeClass(d3.select(element).selectAll(".paths"), "hover");
                chart._removeClass(d3.select(element).selectAll(".legends"), "hover");
                chart._removeClass(d3.select(element).selectAll(".source-" + leave.id), "outgoing");
                chart._removeClass(d3.select(element).selectAll(".target-" + leave.id), "incoming");
            })
            .on("click", function(leave) {
                if (leave.type === "package") {
                    callback(leave);
                }
            });

        group
            .append("rect").attr("class", "bg")
            .attr("x", 1)
            .attr("y", function(leave, count) { return count * 24; })
            .attr("height", 24)
            .attr("width", width - 2);

        group
            .append("text").attr("class", "caption")
            .attr("x", function(leave) { return leave.depth * 20 + 5; })
            .attr("y", function(leave, count) { return (count + 1) * 24 - 7; })
            .text(function(leave) { return leave.name; });

        group
            .append("circle").attr("class", "node")
            .attr("cx", width * 2 / 3)
            .attr("cy", function(leave, count) { return count * 24 + 12; })
            .attr("r", function(leave) { return scales.size(leave.size); });

        // Update existing row
        row
            .attr("class", function(leave, count) {
                return "row " +
                    leave.type + " " +
                    ((count % 2) ? "uneven " : "") +
                    (leave.hidden ? "unfolded " : "");
            });

        row.select("rect.bg").transition()
            .attr("y", function(leave, count) { return count * 24; });

        row.select("text.caption").transition()
            .attr("y", function(leave, count) { return (count + 1) * 24 - 7; });

        row.select("circle.node").transition()
            .attr("cy", function(leave, count) { return count * 24 + 12; });

        // Exiting row
        row.exit().remove();
    },

    _drawLinks: function(element, scales, links, leaves) {
        var g = d3.select(element).selectAll(".paths"),
            width = element.offsetWidth,
            leaveIndex = _.object(_.pluck(leaves, 'id'), _.range(leaves.length)),
            chart = this,
            link = g.selectAll(".link").data(links, function(link, count) {
                return "l_" + link.source + "_" + link.target;
            }),
            linkPath = function(link, count) {
                    var from = leaveIndex[link.source],
                        to = leaveIndex[link.target],
                        maxWidth = (width / 3 - 20);

                    return chart._getLinkPath(
                        (width * 2 / 3),
                        ((from * 24) + 12),
                        ((to * 24) + 12),
                        maxWidth
                    );
                };

        // New links
        link.enter().append("path")
            .attr("d", linkPath)
            .attr("class", function(link) { return "link source-" + link.source + " target-" + link.target; })
            .attr("stroke-width", function(link) { return scales.link(link.count); })
            .attr("opacity", 0);

        // Update existing links
        link.transition()
            .attr("d", linkPath)
            .attr("opacity", 1);

        // Exiting links
        link.exit().transition()
            .attr("opacity", 0)
            .remove();
    },

    _getLinkPath: function(x, yFrom, yTo, maxWidth) {
        var distance = Math.abs(yFrom - yTo);

        if (yFrom < yTo) {
            return "M" + (x - 14) + "," + yFrom +
                "A" + Math.min(maxWidth, distance / 2) + "," + (distance / 2) +
                " 0 0,0" +
                " " + (x - 14) + "," + yTo;
        } else {
            return "M" + (x + 14) + "," + yFrom +
                "A" + Math.min(maxWidth, distance / 2) + "," + (distance / 2) +
                " 0 0,0" +
                " " + (x + 14) + "," + yTo;
        }
    },

    _drawLegends: function(element) {
        var legends = d3.select(element).selectAll(".legends"),
            legend = legends.append("g").attr("class", "legend"),
            hoverLegend = legends.append("g").attr("class", "legend hover"),
            width = element.offsetWidth,
            margin = 5.5,
            legendWidth = 150,
            legendCenter = width - margin - (legendWidth / 2);

        // Common legend
        legend.append("rect").attr("class", "background")
            .attr("x", width - legendWidth - 1 - margin)
            .attr("y", margin)
            .attr("width", legendWidth + 1)
            .attr("height", 24 * 2 + 1);

        legend.append("circle").attr("class", "node")
            .attr("cx", legendCenter)
            .attr("cy", 12 + 1 + margin)
            .attr("r", 8);

        legend.append("circle").attr("class", "node")
            .attr("cx", legendCenter)
            .attr("cy", 24 + 12 + 1 + margin)
            .attr("r", 6);

        legend.append("path").attr("class", "link")
            .attr("marker-end", "url(#arrow)")
            .attr("d", this._getLinkPath(legendCenter, 12 + 1 + margin, 24 + 12 + 1 + margin, 60));

        legend.append("path").attr("class", "link")
            .attr("marker-end", "url(#arrow)")
            .attr("d", this._getLinkPath(legendCenter, 24 + 12 + 1 + margin, 12 + 1 + margin, 60));

        legend.append("text").attr("class", "caption")
            .attr("x", legendCenter - 32)
            .attr("y", 24 + 4 + 1 + margin)
            .attr("text-anchor", "end")
            .text("Down");

        legend.append("text").attr("class", "caption")
            .attr("x", legendCenter + 32)
            .attr("y", 24 + 4 + 1 + margin)
            .attr("text-anchor", "start")
            .text("Up");

        // Hover legend
        hoverLegend.append("rect").attr("class", "background")
            .attr("x", width - legendWidth - 1 - margin)
            .attr("y", margin)
            .attr("width", legendWidth + 1)
            .attr("height", 24 * 3 + 1);

        hoverLegend.append("circle").attr("class", "node")
            .attr("cx", legendCenter)
            .attr("cy", 12 + 1 + margin)
            .attr("r", 6);

        hoverLegend.append("circle").attr("class", "node active")
            .attr("cx", legendCenter)
            .attr("cy", 24 + 12 + 1 + margin)
            .attr("r", 8);

        hoverLegend.append("circle").attr("class", "node")
            .attr("cx", legendCenter)
            .attr("cy", 48 + 12 + 1 + margin)
            .attr("r", 4);

        hoverLegend.append("path").attr("class", "link incoming")
            .attr("marker-end", "url(#arrow)")
            .attr("d", this._getLinkPath(legendCenter, 12 + 1 + margin, 24 + 12 + 1 + margin, 60));

        hoverLegend.append("path").attr("class", "link outgoing")
            .attr("marker-end", "url(#arrow)")
            .attr("d", this._getLinkPath(legendCenter, 24 + 12 + 1 + margin, 48 + 12 + 1 + margin, 60));

        hoverLegend.append("path").attr("class", "link outgoing")
            .attr("marker-end", "url(#arrow)")
            .attr("d", this._getLinkPath(legendCenter, 24 + 12 + 1 + margin, 12 + 1 + margin, 60));

        hoverLegend.append("path").attr("class", "link incoming")
            .attr("marker-end", "url(#arrow)")
            .attr("d", this._getLinkPath(legendCenter, 48 + 12 + 1 + margin, 24 + 12 + 1 + margin, 60));

        hoverLegend.append("text").attr("class", "caption")
            .attr("x", legendCenter - 32)
            .attr("y", 24 + 4 + 1 + margin)
            .attr("text-anchor", "end")
            .text("In");

        hoverLegend.append("text").attr("class", "caption")
            .attr("x", legendCenter - 32)
            .attr("y", 48 + 4 + 1 + margin)
            .attr("text-anchor", "end")
            .text("Out");

        hoverLegend.append("text").attr("class", "caption")
            .attr("x", legendCenter + 32)
            .attr("y", 24 + 4 + 1 + margin)
            .attr("text-anchor", "start")
            .text("Out");

        hoverLegend.append("text").attr("class", "caption")
            .attr("x", legendCenter + 32)
            .attr("y", 48 + 4 + 1 + margin)
            .attr("text-anchor", "start")
            .text("In");
    }
};

export default Chart;
