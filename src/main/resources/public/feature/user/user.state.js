angular.module("pamm").config(function ($stateProvider) {
    $stateProvider
        .state("user", {
            abstract: true,
            url: "/user",
            views: {
                "root-content@": {
                    templateUrl: "feature/user/user.html"
                }
            }
        })
});
