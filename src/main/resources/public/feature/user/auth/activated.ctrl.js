"use strict";

angular.module("pamm").controller("activatedCtrl", ["$state", "$log",
    function ($state, $log) {
        var vm = this;

        vm.login = function () {
            $state.go("user.auth.login");
        };
    }]);
