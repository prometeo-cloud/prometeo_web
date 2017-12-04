"use strict";

/**
 * Check if a date field is before another.  Note that the directive does not check the type
 */
angular.module("pamm").directive("before", function () {
    return {
        require: "ngModel",
        scope: {otherModelValue: "=before"},
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.before = function (modelValue) {
                return modelValue <= scope.otherModelValue;
            };

            //Watch the date that we are comparing against
            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
});
