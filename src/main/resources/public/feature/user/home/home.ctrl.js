"use strict";

angular.module("pamm").controller("homeCtrl", ["$state", "$log",
    function ($state, $log) {
        var vm = this;

        vm.navigateToFeedback = function () {
            $state.go("user.feedback");
        };

        vm.navigateToCompletedCourseList = function () {
            $state.go("user.profile.completed");
        };

        vm.navigateToTopic = function () {
            $state.go("user.topic");
        };

        vm.navigateToPrerequisite = function () {
            $state.go("user.prerequisite");
        };

    }]);
