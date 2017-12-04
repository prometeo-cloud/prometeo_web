angular.module("pamm").config(function ($stateProvider) {
    $stateProvider
        .state("admin.home", {
            url: "/home",
            views: {
                "content": {
                    templateUrl: "feature/admin/home/admin-home.html"
                }
            }
        })
});
