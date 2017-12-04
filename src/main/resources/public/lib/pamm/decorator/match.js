"use strict";

/**
 * Directive that checks one input field with another input field. Returns valid if they match. Directive is run when either field is changed
 */
angular.module("pamm").directive("match", function () {
    return {
        require: "ngModel",
        scope: { otherModelValue: "=match" },
        link: function (scope, element, attributes, ngModel) {

            // set the match validator for the given model that we annotated with match
            ngModel.$validators.match = function (modelValue) {
                return modelValue == scope.otherModelValue;
            };

            //Watch the main ngModel to be matched against so that validate is called when it is changed too
            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
});
