sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/m/MessageBox",
    "eacm/rpdettmat/ext/controller/PrintPdfHelper",
    "eacm/rpdettmat/ext/controller/SendMailHelper"
], function (ControllerExtension, MessageBox, PrintPdfHelper, SendMailHelper) {
    "use strict";

    return ControllerExtension.extend("eacm.rpdettmat.ext.controller.ListReportExt", {
        // In lista il bottone usa i filtri gia applicati con GO
        // e chiede solo le opzioni booleane di stampa.
        downloadPdf: async function () {
            try {
                await PrintPdfHelper.runListReportDownload(this.base.getExtensionAPI());
            } catch (oError) {
                MessageBox.error(
                    oError && oError.message
                        ? oError.message
                        : "Errore durante la stampa PDF."
                );
            }
        },
        sendMail: async function() {
            try {
                await SendMailHelper.runReportMailSending(this.base.getExtensionAPI());
            } catch (oError) {
                MessageBox.error(
                    oError && oError.message
                        ? oError.message
                        : "Errore durante l''invio mail."
                );
            }
        }
    }); 
});
