"use strict";

angular.module("pamm").controller("userLoginCtrl", ["$state", "$log", "userContext",
    function ($state, $log, userContext) {
        var vm = this;

        (function init() {
            if (userContext.getUser()) {
                $log.info("userLoginCtrl - user had already logged on (back button). Returning user to last state");
                userContext.returnToLastState();
            }
            vm.hasAuthenticationError = false;
        })();

        vm.register = function () {
            $state.go("user.auth.register");
        };

        vm.forgotPassword = function () {
            $state.go("user.auth.reset-password-request");
        };

        vm.login = function (loginForm) {
            if (loginForm.$valid) {
                var waitingDialog = $$dialog.waiting("Please wait - Logging In");

                vm.hasAuthenticationError = false;

                userContext.login(this.credentials.username, this.credentials.password).then(
                    function success() {
                        waitingDialog.close();
                        $state.go("user.home");
                    },
                    function error(errorResponse) {
                        waitingDialog.close();
                        if (errorResponse.status == $$httpStatus.UNAUTHORIZED) {
                            vm.hasAuthenticationError = true;
                        } else {
                            $$dialog.error("Service temporarily unavailable. Please try again later");
                        }
                    }
                )
            }
        };
    }]);
