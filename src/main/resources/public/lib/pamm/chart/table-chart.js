"use strict";
angular.module("pamm").directive("tableChart", [function () {
    return {
        restrict: "E",
        replace: true,
        template: "<table class='pamm-table-chart table table-bordered table-striped'>" +
        "<thead>" +
        "<tr>" +
        "<th ng-repeat='label in ::chart.columns track by $index' title='Click to sort' data-ng-click='sort($index)'>{{::label}}" +
        "<i data-ng-show='sortColumn == $index && !sortReverse' class='fa fa-caret-down'></i>" +
        "<i data-ng-show='sortColumn == $index && sortReverse' class='fa fa-caret-up'></i>" +
        "</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody></tbody>" +
        "<tfoot>" +
        "<tr data-ng-show='chart.total'>" +
        "<td ng-repeat='data in chart.total track by $index' data-type='{{valueType(data.value)}}'>{{data.format}}</td>" +
        "</tr>" +
        "</tfoot>" +
        "</table>",
        controller: "tableChartCtrl",
        link: function (scope, element, attrs) {
            scope.tbody = $(element).find("tbody");
        },
        scope: {
            chart: "="
        }
    }
}]).controller("tableChartCtrl", ["$log", "$scope",
    function ($log, $scope) {
        var vm = $scope;

        var sort = function (items, index, reverse) {
            if (items && index) {
                var filtered = items.map(function (item) {
                    return item;
                });

                filtered.sort(function (a, b) {
                    return (a[index].value > b[index].value ? 1 : -1);
                });

                if (reverse) {
                    filtered.reverse();
                }

                return filtered;
            } else {
                return items;
            }
        };

        /**
         * Build the html manually to avoid ng-repeat performance problems with large data set
         */
        var render = function () {
            var html = "";
            _.forEach(sort(vm.chart.rows, vm.sortColumn, vm.sortReverse),
                function (row) {
                    html += "<tr>";
                    _.forEach(row, function (data) {
                        html += "<td data-type='" + vm.valueType(data.value) + "'>" + data.format + "</td>";
                    });
                    html += "</tr>";
                });
            $(vm.tbody).html(html);
        };

        vm.valueType = function (value) {
            if (_.isNumber(value)) {
                return value < 0 ? "negative" : "number";
            } else {
                return "text"
            }
        };

        vm.sort = function (index) {
            if (vm.sortColumn == index) {
                vm.sortReverse = !vm.sortReverse;
            } else {
                vm.sortColumn = index;
                vm.sortReverse = false;
            }
            render();
        };

        (function init() {
            vm.sortColumn = _.isUndefined(vm.chart.sortColumn) ? null : vm.chart.sortColumn;
            vm.sortReverse = _.isUndefined(vm.chart.sortReverse) ? false : vm.chart.sortReverse;
            vm.$watch('chart.rows', render);
        })();
    }]);
