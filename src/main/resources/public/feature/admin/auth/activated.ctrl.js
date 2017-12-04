"use strict";

angular.module("pamm").controller("adminActivatedCtrl", ["$state", "$log",
    function ($state, $log) {
        var vm = this;

        vm.login = function () {
            $state.go("admin.auth.login");
        };
    }]);
