"use strict";

angular.module("pamm").controller("userRegisterCtrl", ["$state", "$log", "userRepository", "cacheManager",
    function ($state, $log, userRepository, cacheManager) {
        var vm = this;
        var REG_CACHE = "userRegisterCtrl";
        var REG_DETAILS = "vm.details";
        var REG_CONFIRM = "vm.confirm";

        (function init() {
            vm.$$dataType = $$dataType;
            vm.details = cacheManager.get(REG_CACHE).get(REG_DETAILS);
            vm.confirm = cacheManager.get(REG_CACHE).get(REG_CONFIRM);

            cacheManager.get(REG_CACHE).removeAll();
        })();

        vm.register = function (form) {
            if (form.$valid) {
                var waitingDialog = $$dialog.waiting("Please wait - Registration in progress");
                var successfulRegistration = function () {
                    waitingDialog.close();
                    $$dialog.success("Registration is successful. A validation link has been sent to your email",
                        function () {
                            $state.go("user.auth.login");
                        })
                };

                var failedRegistration = function (error) {
                    waitingDialog.close();
                    if (error.status == $$httpStatus.FORBIDDEN) {
                        $$dialog.error("Sorry - you are not authorised to use this application");
                    } else {
                        $log.error("User registration failed because " + error.data.message);
                        $$dialog.error("We are unable to process your registration at this time.  Please try again later");
                    }
                };

                userRepository.register(vm.details).then(successfulRegistration, failedRegistration);
            }
        };

        vm.cancel = function () {
            $state.go("user.auth.login");
        };

        vm.showTermsOfUse = function () {
            cacheManager.get(REG_CACHE).put(REG_DETAILS, vm.details);
            cacheManager.get(REG_CACHE).put(REG_CONFIRM, vm.confirm);
            $state.go("user.auth.termsofuse");
        };

        $log.info("userRegisterCtrl: instantiated");
    }]);
