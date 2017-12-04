"use strict";

angular.module("pamm").service("userRepository", ["dal", "$log", "$q",
    function (dal, $log, $q) {
        this.register = function (newUser) {
            return dal.http.POST("register/user", newUser);
        };

        this.getCompletedCoursesForUser = function (userId, type) {
            var deferred = $q.defer();
            dal.http.GET("user/" + userId + "/course?completed&type=" + type).then(function (courses) {
                // TODO cache
                deferred.resolve(courses);
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        };

        this.saveCompletedCourse = function(userId, completedCourse) {
            return dal.http.POST("/user/" + userId + "/course/feedback", completedCourse);
        };

        this.saveCourseFeedback = function (userId, feedback) {
            return dal.http.PUT("/user/" + userId + "/course/feedback", feedback);
        };

        $log.info("dal:userRepository Instantiated");
    }]);
