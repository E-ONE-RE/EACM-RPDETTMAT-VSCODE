sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"eacm/rpdettmat/test/integration/pages/CommissionDetailList.gen",
	"eacm/rpdettmat/test/integration/pages/CommissionDetailObjectPage.gen"
], function (JourneyRunner, CommissionDetailListGenerated, CommissionDetailObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('eacm/rpdettmat') + '/test/flp.html#app-preview',
        pages: {
			onTheCommissionDetailListGenerated: CommissionDetailListGenerated,
			onTheCommissionDetailObjectPageGenerated: CommissionDetailObjectPageGenerated
        },
        async: true
    });

    return runner;
});

