"use strict";

angular.module("pamm").controller("homeCtrl", ["$state", "$log", "userContext",
    function ($state, $log, userContext) {
        var vm = this;


        vm.createProject = function (tenantForm) {
            if (tenantForm.$valid) {
                var waitingDialog = $$dialog.waiting("Please wait - Logging In");

                userContext.createProject(tenantForm.projectName).then(
                    function success() {
                        waitingDialog.close();
                        $$dialog.success("Project created");
                    },
                    function error(errorResponse) {
                        waitingDialog.close();
                        $$dialog.error("There is a problem creating the project");
                    }
                )
            }
        };
    }]);
