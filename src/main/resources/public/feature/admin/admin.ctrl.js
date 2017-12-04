angular.module("pamm").controller("adminCtrl", ["$rootScope", "$scope", "$state", "$log", "$uibModal", "adminContext",
    function ($rootScope, $scope, $state, $log, $uibModal, adminContext) {
        var vm = this;

        (function init() {
            vm.admin = adminContext.getUser();

            if (!vm.admin) {
                $log.info("User has not logged on or has pressed refreshed");
                $state.go("admin.auth.login");
            }
        })();

        vm.logout = function () {
            $$dialog.confirm("Are you sure that you want to logout?", "Logout", function () {
                adminContext.logout();
                $state.go("admin.auth.login");
            });
        };

        vm.showAbout = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: "feature/common/info/info.html",
                controller: "infoCtrl",
                size: "lg",
                backdrop: 'static'
            });
        };

        vm.showHelp = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: "feature/common/help/help.html",
                controller: "helpCtrl",
                size: "lg",
                backdrop: 'static'
            });
        };

        vm.navigateToHome = function () {
            $state.go("admin.home");
        };

        vm.isAtHome = function () {
            return $state.is("admin.home");
        };

        vm.navigateToCourses = function () {
            $state.go("admin.courses");
        };

        vm.isAtCourses = function () {
            return $state.includes("admin.course") || $state.includes("admin.courses");
        };
    }]);
