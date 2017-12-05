"use strict";

angular.module("pamm").service("userRepository", ["dal", "$log", "$q",
    function (dal, $log, $q) {

        this.createProject = function (projectName) {
            return dal.http.POST("/project", projectName);
        };

        $log.info("dal:userRepository Instantiated");
    }]);
