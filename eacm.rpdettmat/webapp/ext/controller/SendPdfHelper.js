sap.ui.define([
    "sap/m/Button",
    "sap/m/CheckBox",
    "sap/m/Dialog",
    "sap/m/VBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
], function (Button, CheckBox, Dialog, VBox, Filter, FilterOperator, JSONModel) {
    "use strict";

    // Helper unico della stampa del List Report.
    // Il dataset non viene letto dalla tabella a video: si rimandano al backend i filtri attivi.
    var SERVICE_ROOT = "/sap/opu/odata4/eacm/ui_rpdettmat_b/srvd/eacm/ui_rpdettmat/0001";


    function _openPrintOptionsDialog(oExtensionAPI) {
        return new Promise(function (resolve) {
/*  Da verificare --------------------------------------------------
            var oModel = _buildOptionsModel();
            var oDialog = new Dialog({
                title: "Opzioni di stampa",
                contentWidth: "26rem",
                content: new VBox({
                    items: [
                        new CheckBox({
                            text: "Stampa dettaglio",
                            selected: "{/DetailPrint}"
                        }),
                        new CheckBox({
                            text: "Includi bloccati",
                            selected: "{/IncludeBlocked}"
                        }),
                        new CheckBox({
                            text: "Ant./Min. ricevuti",
                            selected: "{/IncludeAntMinReceived}"
                        })
                    ]
                }),
                beginButton: new Button({
                    text: "Conferma",
                    type: "Emphasized",
                    press: function () {
                        resolve(oModel.getData());
                        oDialog.close();
                    }
                }),
                endButton: new Button({
                    text: "Annulla",
                    press: function () {
                        resolve(null);
                        oDialog.close();
                    }
                }),
                afterClose: function () {
                    oDialog.destroy();
                }
            });

            oDialog.setModel(oModel);
            oExtensionAPI.addDependent(oDialog);
            oDialog.open();
---  Da verificare -------------------------------------------------- */            
        });
    }

    async function _sendPdfFromListReport(oExtensionAPI, mOptions) {
/*  Da verificare --------------------------------------------------       
        var oModel = oExtensionAPI.getModel();
        var aFilters = _buildPdfDownloadFilters(oExtensionAPI, mOptions);
        // Non si leggono le righe HTML gia caricate in tabella:
        // si rimandano al backend i filtri attivi, cosi il dataset e completo anche con paging server-side.
        var oListBinding = oModel.bindList("/PdfDownload", undefined, undefined, aFilters, {
            $select: "Attachment,FileName,MimeType"
        });
        var aContexts = await oListBinding.requestContexts(0, 1);
        var oContext;
        var oResult;
        var oBlob;

        if (!aContexts.length) {
            throw new Error("Nessun dato trovato per i filtri selezionati.");
        } else if (aContexts.length < 0) {
            throw new Error("Errore durante la generazione del PDF.");
        }

        oContext = aContexts[0];
        oResult = oContext.getObject();

        if (oResult && oResult.Attachment) {
            oBlob = _base64ToBlob(oResult.Attachment, oResult && oResult.MimeType);
        } else {
            oBlob = await _downloadAttachmentStream(oContext, oResult);
        }

        return {
            blob: oBlob,
            fileName: (oResult && oResult.FileName) || "CommissionsAccrued.pdf"
        };
--- Da verificare -------------------------------------------------- */      
    }

    return {
        // Nuovo flusso list report:
        // usa i filtri gia applicati sopra e chiede solo i 3 booleani di stampa.
        runReportPdfSending: async function (oExtensionAPI) {
//          var userLang = sap.ui.getCore().getConfiguration().getLanguage();
//                         'it-IT'  'en-US'  'de-DE'  'fr-FR'  'es-ES'
            var mOptions = await _openPrintOptionsDialog(oExtensionAPI);
            var oPdf;
/*  Da verificare --------------------------------------------------
            if (!mOptions) {
                return;
            }
---  Da verificare -------------------------------------------------- */
            oPdf = await _sendPdfFromListReport(oExtensionAPI, mOptions);
/*  Da verificare --------------------------------------------------
            await _sendingdBlob(oPdf.blob, oPdf.fileName);
---  Da verificare -------------------------------------------------- */            
        }
    };
});
