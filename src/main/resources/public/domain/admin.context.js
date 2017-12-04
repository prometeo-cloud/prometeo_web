"use strict";

angular.module("pamm").service("adminContext", ["$log", "$rootScope", "$q", "$state", "authService", "contextEvent",
    function ($log, $rootScope, $q, $state, authService, contextEvent) {
        var user = null;
        var lastFromState;
        var lastFromParams;

        (function init() {
            authService.logout();
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                lastFromState = fromState;
                lastFromParams = fromParams;
            });
            $log.info("adminContext: Instantiated");
        })();

        this.login = function (username, password) {
            var deferred = $q.defer();
            authService.login(username, password, $$pamm.ROLE.ADMIN).then(
                function (successResponse) {
                    user = successResponse.user;
                    deferred.resolve(user);
                },
                function (error) {
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        };

        this.logout = function () {
            user = null;
            lastFromState = null;
            lastFromParams = null;

            authService.logout();
            $rootScope.$emit(contextEvent.CLEAR_CONTEXT);
            $log.info("Logged out");
        };

        this.getUser = function () {
            return user;
        };

        this.returnToLastState = function () {
            $state.go(lastFromState, lastFromParams);
        };
    }]);
