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

    function _buildOptionsModel() {
        return new JSONModel({
            DetailPrint: false,
            IncludeBlocked: false,
            IncludeAntMinReceived: false
        });
    }

    function _openSendOptionsDialog(oExtensionAPI) {
        return new Promise(function (resolve) {
            var oModel = _buildOptionsModel();
            var oDialog = new Dialog({
                title: "{i18n>dialogTitle2}",
                contentWidth: "26rem",
                content: new VBox({
                    items: [
                        new CheckBox({
                            text: "{i18n>printDetailText}",
                            selected: "{/DetailPrint}"
                        }),
                        new CheckBox({
                            text: "{i18n>includeBlockedText}",
                            selected: "{/IncludeBlocked}"
                        }),
                        new CheckBox({
                            text: "{i18n>antMinReceivedText}",
                            selected: "{/IncludeAntMinReceived}"
                        })
                    ]
                }),
                beginButton: new Button({
                    text: "{i18n>confirmButtonText}",
                    type: "Emphasized",
                    press: function () {
                        resolve(oModel.getData());
                        oDialog.close();
                    }
                }),
                endButton: new Button({
                    text: "{i18n>cancelButtonText}",
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
        });
    }

    function _normalizeActiveFilters(oFilterInfo) {
        if (!oFilterInfo) {
            return [];
        }

        if (Array.isArray(oFilterInfo)) {
            return oFilterInfo.filter(Boolean);
        }

        if (Array.isArray(oFilterInfo.filters)) {
            return oFilterInfo.filters.filter(Boolean);
        }

        if (oFilterInfo.filters) {
            return [oFilterInfo.filters];
        }

        if (oFilterInfo.filter) {
            return [oFilterInfo.filter];
        }

        return [];
    }

    function _buildMailSenderFilters(oExtensionAPI, mOptions) {
        var aFilters = _normalizeActiveFilters(
            typeof oExtensionAPI.getFilters === "function"
                ? oExtensionAPI.getFilters()
                : null
        );

        if (!aFilters.length) {
            throw new Error("Non è possibile eseguire l''invio mail senza aver indicato alcun filtro.");
        }

        aFilters.push(new Filter("DetailPrint", FilterOperator.EQ, !!mOptions.DetailPrint));
        aFilters.push(new Filter("IncludeBlocked", FilterOperator.EQ, !!mOptions.IncludeBlocked));
        aFilters.push(new Filter("IncludeAntMinReceived", FilterOperator.EQ, !!mOptions.IncludeAntMinReceived));

        return aFilters;
    }

    async function _sendMailFromListReport(oExtensionAPI, mOptions) {
        var oModel = oExtensionAPI.getModel();
        var aFilters = _buildMailSenderFilters(oExtensionAPI, mOptions);
        // Non si leggono le righe HTML gia caricate in tabella:
        // si rimandano al backend i filtri attivi, cosi il dataset e completo anche con paging server-side.
        var oListBinding = oModel.bindList("/MailSender", undefined, undefined, aFilters, {
            $select: "AgentCode,AgentName,StatusCode,LogMessage,ProcessedObj"
        });
        var aContexts = await oListBinding.requestContexts(0, 1);
        var oContext;
        var oResult;
        var oBlob;

        if (!aContexts.length) {
            throw new Error("Nessun dato trovato per i filtri selezionati.");
        } else {
//            throw new Error("Errore durante la generazione del PDF.");
        }

        oContext = aContexts[0];
        oResult = oContext.getObject();

//        if (oResult && oResult.Attachment) {
//            oBlob = _base64ToBlob(oResult.Attachment, oResult && oResult.MimeType);
//        } else {
//            oBlob = await _downloadAttachmentStream(oContext, oResult);
//        }

        return {
            log: oResult
        };
    }

    return {
        // Nuovo flusso list report:
        // usa i filtri gia applicati sopra e chiede solo i 3 booleani di stampa.
        runReportMailSending: async function (oExtensionAPI) {
//          var userLang = sap.ui.getCore().getConfiguration().getLanguage();
//                         'it-IT'  'en-US'  'de-DE'  'fr-FR'  'es-ES'
            var mOptions = await _openSendOptionsDialog(oExtensionAPI);
            var oPdf;
            if (!mOptions) {
                return;
            }
            oPdf = await _sendMailFromListReport(oExtensionAPI, mOptions);
/*  Da verificare --------------------------------------------------
            await _sendingdBlob(oPdf.blob, oPdf.fileName);
---  Da verificare -------------------------------------------------- */            
        }
    };
});
