angular.module("pamm").controller("userCtrl", ["$rootScope", "$scope", "$state", "$log", "$uibModal", "userContext",
    function ($rootScope, $scope, $state, $log, $uibModal, userContext) {
        var vm = this;

        (function init() {
            vm.user = userContext.getUser();

            if (!vm.user) {
                $log.info("User has not logged on or has pressed refreshed");
                $state.go("user.auth.login");
            }
        })();

        vm.logout = function () {
            $$dialog.confirm("Are you sure that you want to logout?", "Logout", function () {
                userContext.logout();
                $state.go("user.auth.login");
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
            $state.go("user.home");
        };

        vm.isAtHome = function () {
            return $state.is("user.home");
        };
    }]);
