var Qafoo = Qafoo || {QA: {}};
Qafoo.QA.Modules = Qafoo.QA.Modules || {};

(function () {
    "use strict";

    Qafoo.QA.Modules.DependenciesChart = {
        create: function(element, props, state) {
            var svg = d3.select(element).append('svg')
                .attr('class', 'd3')
                .attr('width', props.width)
                .attr('height', props.height);

            svg.append('g')
                .attr('class', 'd3-points');

            this.update(element, state);
        },

        update: function(element, state) {
            var scales = this._scales(element, state.domain);
            this._drawPoints(element, scales, state.data);
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

        _drawPoints: function(element, scales, data) {
            var g = d3.select(element).selectAll('.d3-points');

            var point = g.selectAll('.d3-point')
                .data(data, function(d) { return d.id; });

            point.enter().append('circle')
                .attr('class', 'd3-point');

            point.attr('cx', function(d) { return scales.x(d.x); })
                .attr('cy', function(d) { return scales.y(d.y); })
                .attr('r', function(d) { return scales.z(d.z); });

            point.exit()
                .remove();
        }
    };
})();
