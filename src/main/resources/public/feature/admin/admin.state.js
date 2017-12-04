angular.module("pamm").config(function ($stateProvider) {
    $stateProvider
        .state("admin", {
            abstract: true,
            url: "/admin",
            views: {
                "root-content@": {
                    templateUrl: "feature/admin/admin.html"
                }
            }
        })
});
