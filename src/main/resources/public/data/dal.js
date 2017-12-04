"use strict";

angular.module("pamm").service("dal", ["$http", "$q", "$log", function ($http, $q, $log) {
    this.http = (function serviceCaller() {
        return {
            /**
             * @returns {promise}
             */
            GET: function (apiPath) {
                var deferred = $q.defer();
                $http.get(apiPath).then(function (result) {
                    deferred.resolve(result.data);
                }, function (e) {
                    deferred.reject(e);
                });
                return deferred.promise;
            },

            /**
             * @returns {promise}
             */
            POST: function (apiPath, itemToSave) {
                var deferred = $q.defer();
                $http(
                    {
                        method: "post",
                        url: apiPath,
                        headers: {
                            "Accept": "application/json, text/plain, */*",
                            "Content-Type": "application/json;charset=UTF-8"
                        },
                        data: angular.toJson(itemToSave)
                    }
                ).then(function (results) {
                    deferred.resolve(results.data);
                }, function (e) {
                    deferred.reject(e);
                });
                return deferred.promise;
            },
            /**
             * @returns {promise}
             */
            PUT: function (apiPath, itemToSave) {
                var deferred = $q.defer();
                $http(
                    {
                        method: "put",
                        url: apiPath,
                        headers: {
                            "Accept": "application/json, text/plain, */*",
                            "Content-Type": "application/json;charset=UTF-8"
                        },
                        data: angular.toJson(itemToSave)
                    }
                ).then(function (results) {
                    deferred.resolve(results.data);
                }, function (e) {
                    deferred.reject(e);
                });
                return deferred.promise;
            },
            /**
             * @returns {promise}
             */
            DELETE: function (apiPath, itemToDelete) {
                var deferred = $q.defer();
                $http.delete(apiPath + itemToDelete.id).then(function (results) {
                    deferred.resolve(results.data);
                }, function (e) {
                    deferred.reject(e);
                });
                return deferred.promise;
            }
        }
    })();
    $log.info("dal:serviceCaller Instantiated");
}]);
