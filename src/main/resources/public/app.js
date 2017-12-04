angular.module("pamm", ["ui.router", "nvd3", "ui.bootstrap", "ngAnimate", "ngMessages"]).run(
    function ($window, $rootScope, $log) {
        $log.info("App Instantiated");
    }).config(
    function ($urlRouterProvider, $locationProvider) {
        var $log = angular.injector(["ng"]).get("$log");
        $urlRouterProvider.otherwise("user/login");
        // $locationProvider.html5Mode(true);

        $log.info("Configured routing");
    }).provider("runtimeStates",
    function runtimeStates($stateProvider) {
        var $log = angular.injector(["ng"]).get("$log");
        this.$get = function () {
            return {
                addState: function (name, state) {
                    $stateProvider.state(name, state);
                }
            }
        };
        $log.info("Configured RuntimeStates Provider");
    });

