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

        this.getCompletedCoursesForUser = function (type) {
            var deferred = $q.defer();
            userRepository.getCompletedCoursesForUser(user.id, type).then(function (courses) {
                for (var i = 0; i < courses.length; i++) {
                    if (courses[i].feedbackRating > 0) {
                        courses[i].rating = new Array(courses[i].feedbackRating);
                    }
                }
                deferred.resolve(courses);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        this.saveCourseFeedback = function (feedback) {
            return userRepository.saveCourseFeedback(user.id, feedback);
        };

        this.saveCompletedCourse = function(course, result) {
            return userRepository.saveCompletedCourse(user.id,
                {
                    courseId : course.id,
                    courseName : course.name,
                    courseType: course.courseType,
                    result : result
                }
            );
        };
    }]);
