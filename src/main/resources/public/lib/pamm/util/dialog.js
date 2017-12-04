"use strict";

/**
 * Facade for BootStrapDialog
 */
var $$dialog = {
    waiting: function (waitMessage) {

        if (waitMessage == undefined || waitMessage == null) {
            waitMessage = "Please Wait";
        }
        return BootstrapDialog.show({
            message: $("<div><i class='fa fa-spinner fa-spin fa-3x'></i>" + waitMessage + "</div>"),
            closable: false
        });
    },

    success: function (successMessage, closeAction) {
        return BootstrapDialog.show({
            message: $("<div><i class='fa fa-check fa-3x'></i>" + successMessage + "</div>"),
            closable: false,
            type: BootstrapDialog.TYPE_SUCCESS,
            buttons: [{
                id: 'button-close',
                label: 'OK',
                action: function (dialogWindow) {
                    dialogWindow.close();
                    if (closeAction) {
                        closeAction();
                    }
                }
            }]
        });
    },

    error: function (errorMessage) {
        if (errorMessage == undefined || errorMessage == null) {
            errorMessage = "An error has occurred - please try again later";
        }
        return BootstrapDialog.alert({
            title: "Error",
            message: $("<div><i class='fa fa-exclamation-circle fa-3x'></i>" + errorMessage + "</div>"),
            closable: false,
            type: BootstrapDialog.TYPE_DANGER
        });
    },

    confirm: function (confirmMessage, buttonLabel, confirmedCallback) {
        return BootstrapDialog.confirm({
            message: $("<div><i class='fa fa-warning fa-3x'></i>" + confirmMessage + "</div>"),
            type: BootstrapDialog.TYPE_WARNING,
            closable: false,
            btnOKLabel: buttonLabel,
            btnOKClass: 'btn-warning',
            callback: function (confirmed) {
                if (confirmed) {
                    confirmedCallback();
                }
            }
        })
    },

    question: function (confirmMessage, okButtonLabel, cancelButtonLabel, callback) {
        return BootstrapDialog.confirm({
            message: $("<div><i class='fa fa-info fa-3x'></i>" + confirmMessage + "</div>"),
            type: BootstrapDialog.TYPE_INFO,
            closable: false,
            btnCancelLabel: cancelButtonLabel,
            btnOKLabel: okButtonLabel,
            btnOKClass: 'btn-info',
            callback: function (ok) {
                if (ok) {
                    callback();
                }
            }
        })
    }
};
