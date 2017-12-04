"use strict";

angular.module("pamm").controller("adminResetPasswordCtrl", ["$state", "$log", "authService", "$stateParams",
    function ($state, $log, authService, $stateParams) {
        var vm = this;

        (function init() {
            vm.credentials = {"token": $stateParams.key};
            vm.$$dataType = $$dataType;
        })();

        vm.resetPassword = function (form) {
            if (form.$valid) {

                var waitingDialog = $$dialog.waiting("Please wait - Resetting password");
                var successfulPasswordReset = function () {
                    waitingDialog.close();
                    $$dialog.success("Your password has successfully been reset",
                        function () {
                            $state.go("admin.auth.login");
                        });
                };

                var failedPasswordReset = function (error) {
                    waitingDialog.close();
                    $$dialog.error(error.data.message);
                };

                authService.resetPassword(vm.credentials).then(successfulPasswordReset, failedPasswordReset);
            }
        };
    }]);
