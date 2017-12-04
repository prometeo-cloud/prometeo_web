"use strict";

angular.module("pamm").controller("adminRegisterCtrl", ["$state", "$log", "adminRepository", "cacheManager",
    function ($state, $log, adminRepository, cacheManager) {
        var vm = this;
        var REG_CACHE = "adminRegisterCtrl";
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
                            $state.go("admin.auth.login");
                        })
                };

                var failedRegistration = function (error) {
                    waitingDialog.close();
                    if (error.status == $$httpStatus.FORBIDDEN) {
                        $$dialog.error("We are unable to process your registration because that you're not authorised to use this portal");
                    } else {
                        $log.error("Admin registration failed because " + JSON.stringify(error));
                        $$dialog.error("We are unable to process your registration at this time.  Please try again later");
                    }
                };

                adminRepository.register(vm.details).then(successfulRegistration, failedRegistration);
            }
        };

        vm.cancel = function () {
            $state.go("admin.auth.login");
        };

        vm.showTermsOfUse = function () {
            cacheManager.get(REG_CACHE).put(REG_DETAILS, vm.details);
            cacheManager.get(REG_CACHE).put(REG_CONFIRM, vm.confirm);
            $state.go("admin.auth.termsofuse");
        };

        $log.info("adminRegisterCtrl: instantiated");
    }]);
