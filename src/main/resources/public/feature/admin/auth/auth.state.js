"use strict";

angular.module("pamm").config(function ($stateProvider) {
    var $log = angular.injector(["ng"]).get("$log");
    $stateProvider.state("admin.auth", {
        abstract: true,
        views: {
            "root-content@": {
                templateUrl: "feature/admin/auth/auth.html"
            }
        }
    }).state("admin.auth.login", {
        url: "/login",
        views: {
            "content@admin.auth": {templateUrl: "feature/admin/auth/login.html"}
        }
    }).state("admin.auth.activated", {
        url: "/activated",
        views: {
            "content@admin.auth": {templateUrl: "feature/admin/auth/activated.html"}
        }
    }).state("admin.auth.register", {
        url: "/register",
        views: {
            "content@admin.auth": {templateUrl: "feature/admin/auth/register.html"}
        }
    }).state("admin.auth.termsofuse", {
        url: "/termsofuse",
        views: {
            "content@admin.auth": {templateUrl: "feature/admin/auth/terms-of-use.html"}
        }
    }).state("admin.auth.reset-password-request", {
        url: "/reset-password",
        views: {
            "content@admin.auth": {templateUrl: "feature/admin/auth/reset-password-request.html"}
        }
    }).state("admin.auth.reset-password", {
        url: "/reset-password/:key",
        views: {
            "content@admin.auth": {templateUrl: "feature/admin/auth/reset-password.html"}
        }
    });

    $log.info("Auth states configured");
});
