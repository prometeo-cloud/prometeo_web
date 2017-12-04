"use strict";

angular.module("pamm").controller("adminResetPasswordRequestCtrl", ["$state", "$log", "authService",
    function ($state, $log, authService) {
        var vm = this;

        (function init() {
            vm.details = {role: $$pamm.ROLE.ADMIN};
        })();

        vm.resetPassword = function (form) {
            if (form.$valid) {
                var waitingDialog = $$dialog.waiting("Please wait - Requesting password reset");
                var successfulPasswordReset = function () {
                    waitingDialog.close();
                    $$dialog.success("A password reset link has been sent to your email",
                        function () {
                            $state.go("admin.auth.login");
                        });
                };

                var failedPasswordReset = function (error) {
                    waitingDialog.close();
                    if (error.status == $$httpStatus.BAD_REQUEST) {
                        $$dialog.error("The provided email is not a registered account.");
                    } else {
                        $$dialog.error(error.data.message);
                    }
                };

                authService.resetPasswordRequest(vm.details).then(successfulPasswordReset, failedPasswordReset);
            }
        };

        vm.cancel = function() {
            $state.go("admin.auth.login");
        };
    }]);
