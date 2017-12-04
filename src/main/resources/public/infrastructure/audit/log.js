angular.module("pamm").decorator("$log", ["$delegate", "$injector", function ($delegate, $injector) {
    var log = $delegate.log;
    var info = $delegate.info;
    var debug = $delegate.debug;
    var warn = $delegate.warn;
    var error = $delegate.error;
    var level = {
        SEVERE: "SEVERE",
        ERROR: "ERROR",
        WARN: "WARNING"
    };
    var auditEnabled = true;
    var logToServer = function (level, message) {
        if (auditEnabled && $injector.get("authService").getToken()) {
            $injector.get("dal").http.POST("/audit", {
                level: level,
                message: message.toString()
            });
        }
    };

    $delegate.enableAudit = function () {
        auditEnabled = true;
    };

    $delegate.disableAudit = function () {
        auditEnabled = false;
    };

    $delegate.log = function (message) {
        log("[LOG] " + message);
    };

    $delegate.info = function (message) {
        info("[INFO] " + message);
    };

    $delegate.warn = function (message) {
        var errorMsg = "[" + $injector.get('$state').current.name + "]::" + message;
        warn("[WARN] " + errorMsg);
        logToServer(level.WARN, errorMsg);
    };

    $delegate.error = function (message) {
        var errorMsg = "[" + $injector.get('$state').current.name + "]::" + message;
        error("[ERROR] " +  errorMsg);
        logToServer(level.ERROR, errorMsg);
    };

    $delegate.severe = function (message) {
        var errorMsg = "[" + $injector.get('$state').current.name + "]::" + message;
        error("[SEVERE] " + errorMsg);
        logToServer(level.SEVERE, errorMsg);
    };

    $delegate.debug = function (message) {
        var errorMsg = "[" + $injector.get('$state').current.name + "]::" + message;
        debug("[DEBUG] " + errorMsg);
    };

    $delegate.info("Audit: Enabled Logging=" + auditEnabled);
    return $delegate;
}]);