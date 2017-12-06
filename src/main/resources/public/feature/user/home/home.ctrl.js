"use strict";

angular.module("pamm").controller("homeCtrl", ["$state", "$log", "userContext",
    function ($state, $log, userContext) {
        var vm = this;
        vm.command = {"inventory": "local"};

        vm.createProject = function (tenantForm) {
            if (tenantForm.$valid) {
                var waitingDialog = $$dialog.waiting("Please wait - Sending request to Prometeo");
                var yaml = vm.createYaml();

                userContext.createProject(yaml).then(
                    function success(successResponse) {
                        waitingDialog.close();
                           $$dialog.success("Project created.  Process ID is " + successResponse["ProcessId"]);
                    },
                    function error(errorResponse) {
                        waitingDialog.close();
                        $$dialog.error("There is a problem creating the project");
                    }
                )
            }
        };

        vm.createYaml = function () {
            var jsonData = {
                "command": {
                    "tag": "",
                    "runAs": "prometeo"
                }
            };

            if (vm.command.role) {
                jsonData["command"]["roleRepoUri"] = vm.command.uri;
            } else {
                jsonData["command"]["cfgRepoUri"] = vm.command.uri;
            }

            if (vm.command.verbose) {
                jsonData["command"]["verbosity"] = "vvv";
            }

            jsonData["command"]["inventory"] = vm.command.inventory === "local" ? "local-file" : "host";
            jsonData["command"]["check"] = vm.command.check ? "yes" : "no";
            jsonData["command"]["project"] = vm.command.projectRef;

            var yaml = json2yaml(jsonData);
            yaml = yaml.replace("command:", "- command:");

            if (vm.vars) {
                // vars is already a yamal - add indentation
                yaml = "---\n" + yaml + "\n- vars:\n" + vm.vars.replace(/^/gm, "    ") + "\n...\n";
            } else {
                yaml = "---\n" + yaml + "\n...\n";
            }

            console.log("+++++++++++++++++++++");
            console.log(yaml);

            return yaml;
        }
    }])
;

