"use strict";
angular.module("pamm").config(function ($stateProvider) {
    var $log = angular.injector(["ng"]).get("$log");
    $stateProvider.state("user.auth", {
        abstract: true,
        views: {
            "root-content@": {
                templateUrl: "feature/user/auth/auth.html"
            }
        }
    }).state("user.auth.login", {
        url: "/login",
        views: {
            "content@user.auth": {templateUrl: "feature/user/auth/login.html"}
        }
    }).state("user.auth.termsofuse", {
        url: "/termsofuse",
        views: {
            "content@user.auth": {templateUrl: "feature/user/auth/terms-of-use.html"}
        }
    });

    $log.info("User Auth States configured");
});
