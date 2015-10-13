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

    _addClass: function(node, className) {
        if (node.attr("class").indexOf(className) < 0) {
            node.attr("class", node.attr("class") + " " + className);
        }
    },

    _removeClass: function(node, className) {
        if (node.attr("class").indexOf(className) >= 0) {
            node.attr("class", node.attr("class").replace(className, ""));
        }
    },

    _drawRows: function(element, scales, leaves) {
        var g = d3.select(element).selectAll(".rows"),
            width = element.offsetWidth,
            callback = this.callback,
            chart = this;

        var row = g.selectAll(".row").data(leaves, function(leave, count) {return leave.id + count + leave.hidden + leave.type;}),
            rowEnter = row.enter(),
            group = rowEnter.append("g");

        group
            .attr("class", function(leave, count) {
                return "row " +
                    leave.type + " " +
                    ((count % 2) ? "uneven " : "") +
                    (leave.hidden ? "unfolded " : "");
            })
            .on("mouseover", function(leave) {
                chart._addClass(d3.select(this), "hover");
            })
            .on("mouseout", function(leave, count) {
                chart._removeClass(d3.select(this), "hover");
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
                    maxWidth = (width / 3 - 20);

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
                " " + (x - 14) + "," + yTo;
        } else {
            return "M" + (x + 14) + "," + yFrom +
                "A" + Math.min(maxWidth, distance / 2) + "," + (distance / 2) +
                " 0 0,0" +
                " " + (x + 14) + "," + yTo;
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

        var node2_1 = hoverLegend.append("circle"),
            node2_2 = hoverLegend.append("circle"),
            node2_3 = hoverLegend.append("circle");

        node2_1
            .attr("cx", legendCenter)
            .attr("cy", 12 + 1 + margin)
            .attr("r", 6)
            .attr("fill", "black");

        node2_2
            .attr("cx", legendCenter)
            .attr("cy", 24 + 12 + 1 + margin)
            .attr("r", 8)
            .attr("fill", "black");

        node2_3
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

export default Chart; 
