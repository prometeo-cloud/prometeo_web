"use strict";

angular.module("pamm").directive("lowercase", function () {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            var lowercase = function (inputValue) {
                var converted;
                if (inputValue != undefined) {
                    converted = inputValue.toLowerCase();
                    if (converted !== inputValue) {
                        ngModel.$setViewValue(converted);
                        ngModel.$render();
                    }
                }
                return converted;
            };
            ngModel.$parsers.push(lowercase);
            lowercase(scope[attrs.ngModel]);
        }
    };
});