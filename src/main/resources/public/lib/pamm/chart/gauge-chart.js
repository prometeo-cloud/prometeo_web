"use strict";
angular.module("pamm").directive("gaugeChart", [function () {
    return {
        restrict: "E",
        controller: "gaugeCtrl",
        scope: {
            chart: "="
        },
        link: function (scope, element, attrs) {
            scope.$watch("chart", function () {
                if (scope.chart) {
                    scope.render(element[0]);
                }
            });
        }
    }
}]).controller("gaugeCtrl", ["$log", "$scope", function ($log, vm) {
    vm.render = function (chartArea) {
        var diameter = vm.chart.size ? vm.chart.size : 200;
        var angleRangeLimit = 130; // determines the position of the Start and End point
        var range = [-angleRangeLimit, angleRangeLimit]; // the Start and Stop angle of the gauage arc
        var minorTicks = vm.chart.minorTicks ? vm.chart.minorTicks : 2;
        var value = vm.chart.value ? vm.chart.value : 0;
        var rag = vm.chart.rag;
        var unit = vm.chart.unit ? vm.chart.unit : "";
        var decimalPlaces = vm.chart.decimalPlaces ? vm.chart.decimalPlaces : 0;
        var domain;

        if (!vm.chart.domain || vm.chart.domain[1] < vm.chart.domain[0]) {
            domain = [0, 1];
            value = 0;
            unit = "INVALID"
        } else {
            domain = vm.chart.domain;
        }

        d3.select(chartArea).select("svg").remove();
        d3.select(chartArea)
            .append("svg:svg")
            .attr("width", diameter).attr("height", diameter)
            .style("font-family", "Helvetica, Arial, sans-serif")
            .append("svg:g")
            .attr("transform", "translate(" + (diameter / 2) + "," + (diameter / 2) + ")")
            .call(function (g) {
                var scale = [0.71, 0.75, 0.76];
                var angle = d3.scale.linear().domain(domain).range(range);
                var radius = diameter / 2 * 0.9;
                (function addSvgDefinitions() {
                    var defs = g.append("svg:defs");
                    var outerGradient = defs.append("svg:linearGradient")
                        .attr("id", "outerGradient")
                        .attr("x1", "0%").attr("y1", "0%")
                        .attr("x2", "0%").attr("y2", "100%")
                        .attr("spreadMethod", "pad");
                    outerGradient.selectAll("stop")
                        .data([{o: "0%", c: "#ffffff"}, {o: "100%", c: "#d0d0d0"}])
                        .enter().append("svg:stop")
                        .attr("offset", function (d) {
                            return d.o;
                        })
                        .attr("stop-color", function (d) {
                            return d.c;
                        })
                        .attr("stop-opacity", "1");

                    var innerGradient = defs.append("svg:linearGradient")
                        .attr("id", "innerGradient")
                        .attr("x1", "0%").attr("y1", "0%")
                        .attr("x2", "0%").attr("y2", "100%")
                        .attr("spreadMethod", "pad");
                    innerGradient.selectAll("stop")
                        .data([{o: "0%", c: "#d0d0d0"}, {o: "100%", c: "#ffffff"}])
                        .enter().append("svg:stop")
                        .attr("offset", function (d) {
                            return d.o;
                        })
                        .attr("stop-color", function (d) {
                            return d.c;
                        })
                        .attr("stop-opacity", "1");

                    var faceGradient = defs.append("svg:linearGradient")
                        .attr("id", "faceGradient")
                        .attr("x1", "0%").attr("y1", "0%")
                        .attr("x2", "0%").attr("y2", "100%")
                        .attr("spreadMethod", "pad");
                    faceGradient.selectAll("stop")
                        .data([{o: "0%", c: "#fafafa"}, {o: "100%", c: "#efefef"}])
                        .enter().append("svg:stop")
                        .attr("offset", function (d) {
                            return d.o;
                        })
                        .attr("stop-color", function (d) {
                            return d.c;
                        })
                        .attr("stop-opacity", "1");

                    var glareGradient = defs.append("svg:linearGradient")
                        .attr("id", "glareGradient")
                        .attr("x1", "0%").attr("y1", "0%")
                        .attr("x2", "0%").attr("y2", "100%")
                        .attr("spreadMethod", "pad");
                    glareGradient.selectAll("stop")
                        .data([{o: "0%", c: "#fafafa", op: 0.60}, {o: "100%", c: "#fafafa", op: 0.00}])
                        .enter().append("svg:stop")
                        .attr("offset", function (d) {
                            return d.o;
                        })
                        .attr("stop-color", function (d) {
                            return d.c;
                        })
                        .attr("stop-opacity", function (d) {
                            return d.op;
                        });

                    var dropShadowFilter = defs.append("svg:filter")
                        .attr("id", "dropShadow")
                        .attr("x", "-20%").attr("y", "-20%")
                        .attr("width", "200%").attr("height", "200%");
                    dropShadowFilter.append("svg:feGaussianBlur")
                        .attr("in", "SourceAlpha")
                        .attr("stdDeviation", 3);
                    dropShadowFilter.append("svg:feOffset")
                        .attr("dx", 2).attr("dy", 2)
                        .attr("result", "offsetblur");

                    var feMerge = dropShadowFilter.append("svg:feMerge");
                    feMerge.append("svg:feMergeNode");
                    feMerge.append("svg:feMergeNode")
                        .attr("in", "SourceGraphic");
                })();

                (function drawClockFace() {
                    var dial = [1.00, 0.95, 0.92, 0.9];

                    g.append("svg:circle")
                        .attr("r", radius * dial[0])
                        .style("fill", "url(#outerGradient)")
                        .attr("filter", "url(#dropShadow)");
                    g.append("svg:circle")
                        .attr("r", radius * dial[1])
                        .style("fill", "url(#innerGradient)");
                    g.append("svg:circle")
                        .attr("r", radius * dial[2])
                        .style("fill", "url(#faceGradient)");
                })();

                (function drawRAG() {
                    var r = radius * scale[1];
                    var strokeWidth = diameter * 0.1;
                    var xStart = Math.cos((range[0] - 90) / 180 * Math.PI) * r;
                    var yStart = Math.sin((range[0] - 90) / 180 * Math.PI) * r;
                    var fullArcRange = domain[1] - domain[0];
                    var fullAngleRange = angleRangeLimit * 2;

                    g.selectAll("g")
                        .data(rag.yellowTo != null && rag.redTo != null ? [
                            {to: domain[1], color: "#2e7d32"},  // Green - always the the full arc
                            {to: rag.yellowTo, color: "#ef6c00"},  // Amber - overlay green
                            {to: rag.redTo, color: "#b21f24"} // Red - overlay amber
                        ] : [{to: domain[1], color: "gray"}])
                        .enter().append("svg:path")
                        .attr("d", function (d) {
                            var xEnd = Math.cos((angle(d.to) - 90) / 180 * Math.PI) * r;
                            var yEnd = Math.sin((angle(d.to) - 90) / 180 * Math.PI) * r;
                            var dataArcRange = d.to - domain[0];
                            var dataAngleRange = dataArcRange / fullArcRange * fullAngleRange;
                            var arcOptions = dataAngleRange < 180 ? " 0 0,1 " : " 0 1,1 ";
                            return "M" + xStart + "," + yStart + " A" + r + "," + r + arcOptions + xEnd + "," + yEnd;
                        })
                        .attr("stroke", function (d) {
                            return d.color;
                        })
                        .attr("stroke-width", strokeWidth)
                        .attr("fill", "none");
                })();

                (function addScaleAndLabel() {
                    g.selectAll("text")
                        .data(domain)
                        .enter().append("svg:text")
                        .style("fill", "black")
                        .style("font-size", diameter * 0.05 + "pt")
                        .attr("x", function (d) {
                            return Math.cos((angle(d) - 90) / 180 * Math.PI) * radius * scale[1];
                        })
                        .attr("y", function (d) {
                            return Math.sin((angle(d) - 90) / 180 * Math.PI) * radius * scale[1];
                        })
                        .attr("text-anchor", function (d) {
                            return d == domain[0] ? "start " : "end"
                        })
                        .attr("dy", "0.7em")
                        .attr("dx", function (d) {
                            return d == domain[0] ? "0.5em " : "-0.5em"
                        })
                        .text(function (d) {
                            return Math.round(d * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)
                        });

                    g.append("svg:text")
                        .style("fill", "#505050")
                        .style("font-size", diameter * 0.07 + "pt")
                        .style("font-weight", "bold")
                        .attr("x", 0).attr("y", radius - (diameter * 0.08))
                        .attr("text-anchor", "middle")
                        .text(Math.round(value * Math.pow(10, 2)) / Math.pow(10, 2));

                    g.append("svg:text")
                        .style("fill", "#505050")
                        .style("font-size", diameter * 0.07 + "pt")
                        .style("font-weight", "bold")
                        .attr("x", 0).attr("y", -(radius - (diameter * 0.32)))
                        .attr("text-anchor", "middle")
                        .text(unit);

                    g.selectAll("line")
                        .data(angle.ticks(10 * minorTicks).filter(function (d) {
                            return domain.indexOf(d) == -1;
                        }))
                        .enter().append("svg:line")
                        .style("stroke", "white")
                        .style("stroke-width", "1px")
                        .attr("x1", function (d) {
                            return Math.cos((angle(d) - 90) / 180 * Math.PI) * (radius * scale[0]);
                        })
                        .attr("y1", function (d) {
                            return Math.sin((angle(d) - 90) / 180 * Math.PI) * (radius * scale[0]);
                        })
                        .attr("x2", function (d) {
                            return Math.cos((angle(d) - 90) / 180 * Math.PI) * (radius * scale[2]);
                        })
                        .attr("y2", function (d) {
                            return Math.sin((angle(d) - 90) / 180 * Math.PI) * (radius * scale[2]);
                        });
                })();

                (function addGlare() {
                    var glare = radius;
                    g.append("svg:path")
                        .attr("d", "M " + (-glare) + ",0 A" + glare + "," + glare + " 0 0,1 " + glare + ",0 A" + (glare * 5) + "," + (glare * 5) + " 0 0,0 " + (-glare) + ",0")
                        .style("fill", "url(#glareGradient)");
                })();

                (function drawNeedle() {
                    var needle = [0.83, 0.05];
                    var pivot = [0.12, 0.1];
                    var n = g.append("svg:g")
                        .style("fill", "steelblue")
                        .attr("filter", "url(#dropShadow)")
                        .attr("transform", "rotate(" + angle(value) + ")");

                    n.append("svg:path")
                        .attr("d", "M " + (-radius * needle[1]) + ",0 L0," + (-radius * needle[0]) + " L" + radius * needle[1] + ",0");
                    n.append("svg:circle")
                        .attr("r", radius * pivot[0])
                        .style("fill", "url(#outerGradient)");
                    n.append("svg:circle")
                        .attr("r", radius * pivot[1])
                        .style("fill", "url(#innerGradient)");
                })();
            });
    };
}]);