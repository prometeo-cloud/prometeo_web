angular.module("pamm").config(function ($stateProvider) {
    $stateProvider
        .state("user.home", {
            url: "/home",
            views: {
                "content": {
                    templateUrl: "feature/user/home/home.html"
                }
            }
        })
});
