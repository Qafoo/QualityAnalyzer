var Qafoo = Qafoo || {QA: {}};
Qafoo.QA.Modules = Qafoo.QA.Modules || {};

(function () {
    "use strict";

    Qafoo.QA.Modules.DependenciesChart = {
        svg: null,

        create: function(element, props, state) {
            this.svg = d3.select(element).append('svg')
                .attr('class', 'd3')
                .attr('width', props.width)
                .attr('height', '500px');

            this.svg.append('g')
                .attr('class', 'dependencies');

            this.update(element, state);
        },

        update: function(element, state) {
            this.svg.attr('height', Math.max(500, state.leaves.length * 24 + 10) + "px");

            this._drawRows(element, state.leaves);
        },

        destroy: function(element) {
        },

        _scales: function(element, domain) {
            if (!domain) {
                return null;
            }

            var width = element.offsetWidth;
            var height = element.offsetHeight;

            var x = d3.scale.linear()
                .range([0, width])
                .domain(domain.x);

            var y = d3.scale.linear()
                .range([height, 0])
                .domain(domain.y);

            var z = d3.scale.linear()
                .range([5, 20])
                .domain([1, 10]);

            return {x: x, y: y, z: z};
        },

        _drawRows: function(element, leaves) {
            var g = d3.select(element).selectAll('.dependencies');

            var text = g.selectAll('.row')
                .data(leaves);

            text.enter().append('text').attr('class', 'row');

            text.attr('y', function(leave, count) { return (count + 1) * 24; })
                .attr('x', function(leave) { return leave.depth * 20; })
                .text(function(leave) { console.log(leave); return leave.name; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "14px")
                .attr("color", "black");

            text.exit()
                .remove();
        }
    };
})();
