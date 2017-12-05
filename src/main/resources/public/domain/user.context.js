"use strict";

angular.module("pamm").service("userContext", ["$log", "$rootScope", "$q", "$state", "authService", "contextEvent", "userRepository",
    function ($log, $rootScope, $q, $state, authService, contextEvent,  userRepository) {
        var user = null;
        var lastFromState;
        var lastFromParams;

        (function init() {
            authService.logout();
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                lastFromState = fromState;
                lastFromParams = fromParams;
            });
            $log.info("userContext: Instantiated");
        })();

        this.login = function (username, password) {
            var deferred = $q.defer();
            authService.login(username, password, $$pamm.ROLE.USER).then(
                function (successResponse) {
                    user = successResponse.user;
                    deferred.resolve(user);
                },
                function (errorResponse) {
                    deferred.reject(errorResponse);
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

        this.createProject = function (projectName) {
            return userRepository.createProject(projectName);
        };
    }]);
