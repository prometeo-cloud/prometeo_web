"use strict";

angular.module("pamm").controller("adminLoginCtrl", ["$state", "$log", "adminContext",
    function ($state, $log, adminContext) {
        var vm = this;

        (function init() {
            if (adminContext.getUser()) {
                $log.info("adminLoginCtrl - admin had already logged on (back button). Returning admin to last state");
                adminContext.returnToLastState();
            }
            vm.hasAuthenticationError = false;
        })();

        vm.register = function () {
            $state.go("admin.auth.register");
        };

        vm.forgotPassword = function () {
            $state.go("admin.auth.reset-password-request");
        };

        vm.login = function (loginForm) {
            if (loginForm.$valid) {
                var waitingDialog = $$dialog.waiting("Please wait - Logging In");

                vm.hasAuthenticationError = false;

                adminContext.login(this.credentials.username, this.credentials.password).then(
                    function success() {
                        waitingDialog.close();
                        $state.go("admin.home");
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
