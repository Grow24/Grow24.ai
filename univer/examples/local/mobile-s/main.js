import {
  UniverSheetsDataValidationMobileUIPlugin
} from "/univer/chunk-V5IBWILB.js";
import {
  UniverSheetsConditionalFormattingMobileUIPlugin
} from "/univer/chunk-7Y223JCO.js";
import {
  UniverSheetsFilterMobileUIPlugin
} from "/univer/chunk-G47N2NM6.js";
import "/univer/chunk-6EP3P65R.js";
import {
  UniverSheetsFilterPlugin
} from "/univer/chunk-NFRKHRYD.js";
import {
  UniverSheetsFormulaUIPlugin
} from "/univer/chunk-HTZYHXGN.js";
import {
  DEFAULT_WORKBOOK_DATA_DEMO
} from "/univer/chunk-2PJ3QCNN.js";
import {
  UniverSheetsNumfmtUIPlugin
} from "/univer/chunk-RPHCUFXW.js";
import {
  UniverSheetsNumfmtPlugin
} from "/univer/chunk-DSZZQHBJ.js";
import {
  UniverSheetsDataValidationPlugin
} from "/univer/chunk-XXJESKVN.js";
import {
  UniverSheetsMobileUIPlugin
} from "/univer/chunk-LXKHVO4Y.js";
import {
  UniverDocsPlugin,
  UniverDocsUIPlugin
} from "/univer/chunk-4MI62PCK.js";
import "/univer/chunk-YXIT6Q6A.js";
import {
  UniverMobileUIPlugin
} from "/univer/chunk-XUI25LTE.js";
import {
  zh_CN_default
} from "/univer/chunk-Q3VLDO2L.js";
import {
  UniverSheetsFormulaPlugin
} from "/univer/chunk-H5NJEYZ5.js";
import {
  UniverFormulaEnginePlugin,
  UniverRPCMainThreadPlugin,
  UniverSheetsPlugin
} from "/univer/chunk-CDHET2WN.js";
import {
  UniverRenderEnginePlugin
} from "/univer/chunk-7ZBW2CWY.js";
import "/univer/chunk-SSSDKVVD.js";
import {
  O,
  Univer,
  UserManagerService
} from "/univer/chunk-YLGQP2EX.js";
import "/univer/chunk-AROCCXDN.js";

// src/mobile-s/main.ts
var univer = new Univer({
  locale: "zhCN" /* ZH_CN */,
  locales: {
    ["zhCN" /* ZH_CN */]: zh_CN_default
  },
  logLevel: 4 /* VERBOSE */
});
univer.registerPlugin(UniverFormulaEnginePlugin);
univer.registerPlugin(UniverDocsPlugin);
univer.registerPlugin(UniverRenderEnginePlugin);
univer.registerPlugin(UniverMobileUIPlugin, {
  container: "app"
});
var worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
univer.registerPlugin(UniverRPCMainThreadPlugin, { workerURL: worker });
univer.onDispose(() => worker.terminate());
univer.registerPlugin(UniverDocsUIPlugin);
univer.registerPlugin(UniverSheetsPlugin);
univer.registerPlugin(UniverSheetsMobileUIPlugin);
univer.registerPlugin(UniverSheetsFilterPlugin);
univer.registerPlugin(UniverSheetsFilterMobileUIPlugin);
univer.registerPlugin(UniverSheetsNumfmtPlugin);
univer.registerPlugin(UniverSheetsNumfmtUIPlugin);
univer.registerPlugin(UniverSheetsFormulaPlugin);
univer.registerPlugin(UniverSheetsFormulaUIPlugin);
univer.registerPlugin(UniverSheetsConditionalFormattingMobileUIPlugin);
univer.registerPlugin(UniverSheetsDataValidationPlugin);
univer.registerPlugin(UniverSheetsDataValidationMobileUIPlugin);
var mockUser = {
  userID: "Owner_qxVnhPbQ",
  name: "Owner",
  avatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAInSURBVHgBtZU9TxtBEIbfWRzFSIdkikhBSqRQkJqkCKTCFkqVInSUSaT0wC8w/gXxD4gU2nRJkXQWhAZowDUUWKIwEgWWbEEB3mVmx3dn4DA2nB/ppNuPeWd29mMIPXDr+RxwtgRHeW6+guNPRxogqnL7Dwz9psJ27S4NShaeZTH3kwXy6I81dlRKcmRui88swdq9AcSFL7Buz1Vmlns64MiLsCjzwnIYHLH57tbfFbs7KRaXyEU8FVZofqccOfA5l7Q8LPIkGrwnb2RPNEXWFVMUF3L+kDCk0btDDAMzOm5YfAHDwp4tG74wnzAsiOYMnJ3GoDybA7IT98/jm5+JNnfiIzAS6LlqHQBN/i6b2t/cV1Hh6BfwYlHnHP4AXi5q/8kmMMpOs8+BixZw/Fd6xUEHEbnkgclvQP2fGp7uShRKnQ3G32rkjV1th8JhIGG7tR/JyjGteSOZELwGMmNqIIigRCLRh2OZIE6BjItdd7pCW6Uhm1zzkUtungSxwEUzNpQ+GQumtH1ej1MqgmNT6vwmhCq5yuwq56EYTbgeQUz3yvrpV1b4ok3nYJ+eYhgYmjRUqErx2EDq0Fr8FhG++iqVGqxlUJI/70Ar0UgJaWHj6hYVHJrfKssAHot1JfqwE9WVWzXZVd5z2Ws/4PnmtEjkXeKJDvxUecLbWOXH/DP6QQ4J72NS0adedp1aseBfXP8odlZFfPvBF7SN/8hky1TYuPOAXAEipMx15u5ToAAAAABJRU5ErkJggg==",
  anonymous: false,
  canBindAnonymous: false
};
var injector = univer.__getInjector();
var userManagerService = injector.get(UserManagerService);
userManagerService.setCurrentUser(mockUser);
univer.createUnit(O.UNIVER_SHEET, DEFAULT_WORKBOOK_DATA_DEMO);
