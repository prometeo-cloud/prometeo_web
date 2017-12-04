"use strict";

angular.module("pamm").service("adminRepository", ["dal", "$log", "$q",
    function (dal, $log, $q) {

        (function init() {
            $log.info("dal:adminRepository Instantiated");
        }());

        this.register = function (newUser) {
            return dal.http.POST("register/admin", newUser);
        };
    }]);
