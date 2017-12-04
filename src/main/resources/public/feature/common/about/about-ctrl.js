"use strict";

angular.module("pamm").controller("aboutCtrl", ["$scope", "$uibModalInstance", "$log",
    function ($scope, $uibModalInstance, $log) {
        var vm = $scope;


        vm.ok = function () {
            $uibModalInstance.dismiss("OK");
        };
    }]);