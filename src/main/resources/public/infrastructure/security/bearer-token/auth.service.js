'use strict';
angular.module("pamm").service("authService", ["$log", "$http", "$q", "dal",
    function ($log, $http, $q, dal) {
        var credentials = {};

        this.getUsername = function () {
            return credentials.username;
        };

        this.getRole = function () {
            return credentials.role;
        };

        this.getToken = function () {
            return credentials.token;
        };

        this.clearContext = function () {
            credentials = {};
        };

        this.hasAuthenticated = function () {
            return !(credentials.token == undefined || credentials != null);
        };

        this.resetPasswordRequest = function (email) {
            return dal.http.POST("reset", email);
        };

        this.resetPassword = function (resetCredentials) {
            credentials = resetCredentials;

            return $http(
                {
                    method: "PUT",
                    url: "reset",
                    headers: {
                        "Accept": "application/json, text/plain, */*",
                        "Content-Type": "application/json;charset=UTF-8"
                    },
                    data: {
                        "verification": credentials.verificationCode.trim(),
                        "password": credentials.password
                    }
                });
        };


        this.login = function (username, password, role) {
            var authData = btoa(username + ':' + password);
            var deferred = $q.defer();

            credentials.username = username;
            credentials.password = password;
            credentials.role = role;


            var loginUrl;
            if (role == $$pamm.ROLE.ADMIN) {
                loginUrl = "login/admin";
            } else if (role == $$pamm.ROLE.USER) {
                loginUrl = "login/user";
            } else {
                var errorMsg = "authService: Unable to login because of " + role + " is not an recognised role";
                $log.error(errorMsg);
                throw errorMsg;
            }

            $http(
            {
                method: "POST",
                url: loginUrl,
                headers: {
                    "Authorization": "Basic " + authData,
                    "Accept": "application/json, text/plain, */*",
                    "Content-Type": "application/json;charset=UTF-8"
                }
            }).then(function (successResponse) {
                    var user = successResponse.data;
                    credentials.token = successResponse.data.authToken;
                    deferred.resolve(user);
                }, function (error) {
                    deferred.reject(error);
                }
            );
            return deferred.promise;
        };

        this.logout = function () {
            credentials = {};
        }
    }]);
