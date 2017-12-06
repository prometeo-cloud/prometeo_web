"use strict";

angular.module("pamm").service("userRepository", ["dal", "$log", "$q",
    function (dal, $log, $q) {

        this.createProject = function (yaml) {
            return dal.http.POST("/project", yaml);
        };

        $log.info("dal:userRepository Instantiated");
    }]);
