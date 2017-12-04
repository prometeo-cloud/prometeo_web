"use strict";
var $$include = (function required() {
    var getRelativeURL = function(script) {
        var path= script.src.split('?')[0]; // remove any query parameters
        return path.split('/').slice(0, -1).join('/')+'/';
    };

    return {
        less: function (resoure) {
            var currentScript = document.currentScript || (function () {
                    var scripts = $("script[src*='_package.js']");
                    return scripts[scripts.length - 1];
                })();

            $("<link/>", {
                rel: "stylesheet/less",
                href: getRelativeURL(currentScript) + resoure
            }).appendTo("head");
        },
        script: function (resoure) {
            var currentScript = document.currentScript || (function () {
                    var scripts = $("script[src*='_package.js']");
                    return scripts[scripts.length - 1];
                })();

            $("<script>", {
                src: getRelativeURL(currentScript) + resoure
            }).appendTo("head");
        }
    }
})();