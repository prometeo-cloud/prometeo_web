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
    }).state("user.auth.activated", {
        url: "/activated",
        views: {
            "content@user.auth": {templateUrl: "feature/user/auth/activated.html"}
        }
    }).state("user.auth.register", {
        url: "/register",
        views: {
            "content@user.auth": {templateUrl: "feature/user/auth/register.html"}
        }
    }).state("user.auth.termsofuse", {
        url: "/termsofuse",
        views: {
            "content@user.auth": {templateUrl: "feature/user/auth/terms-of-use.html"}
        }
    }).state("user.auth.reset-password-request", {
        url: "/reset-password",
        views: {
            "content@user.auth": {templateUrl: "feature/user/auth/reset-password-request.html"}
        }
    }).state("user.auth.reset-password", {
        url: "/reset-password/:key",
        views: {
            "content@user.auth": {templateUrl: "feature/user/auth/reset-password.html"}
        }
    });

    $log.info("User Auth States configured");
});
