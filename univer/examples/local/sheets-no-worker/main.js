import {
  UniverNetworkPlugin
} from "./chunk-IFZPHPE6.js";
import {
  UniverSheetsNotePlugin,
  UniverSheetsTablePlugin
} from "./chunk-RMIXTD3E.js";
import {
  UniverSheetsZenEditorPlugin
} from "./chunk-LYVOWO7V.js";
import "./chunk-5RPKIJKB.js";
import {
  UniverSheetsHyperLinkPlugin
} from "./chunk-354FJ26S.js";
import {
  UniverSheetsThreadCommentPlugin
} from "./chunk-KQMHMMC7.js";
import {
  UniverSheetsSortPlugin
} from "./chunk-LI73LENO.js";
import "./chunk-OD5D7OYC.js";
import {
  UniverSheetsConditionalFormattingPlugin
} from "./chunk-2CQBTLI7.js";
import {
  UniverSheetsFilterPlugin
} from "./chunk-I56OIIV5.js";
import {
  UniverDebuggerPlugin
} from "./chunk-UJI7K6GU.js";
import "./chunk-HFVM6MYW.js";
import "./chunk-6W4YZ3HG.js";
import {
  FUniver
} from "./chunk-JWXRDIU7.js";
import "./chunk-6TVBTQ2X.js";
import {
  DEFAULT_WORKBOOK_DATA_DEMO
} from "./chunk-VMFOP3F4.js";
import {
  UniverSheetsNumfmtPlugin
} from "./chunk-W2QCNNNM.js";
import {
  UniverSheetsDataValidationPlugin
} from "./chunk-ZRJXDTFY.js";
import {
  UniverSheetsUIPlugin
} from "./chunk-WPDJPIZN.js";
import {
  UniverDocsPlugin,
  UniverDocsUIPlugin
} from "./chunk-IJAOVONG.js";
import "./chunk-63AGE64E.js";
import {
  UniverUIPlugin
} from "./chunk-R42OVMY4.js";
import {
  zh_CN_default
} from "./chunk-J4OFPKRX.js";
import {
  UniverSheetsFormulaPlugin
} from "./chunk-TOYW4IMU.js";
import {
  UniverFormulaEnginePlugin,
  UniverRPCMainThreadPlugin,
  UniverSheetsPlugin
} from "./chunk-SV6SUIS4.js";
import {
  UniverRenderEnginePlugin
} from "./chunk-BPIUAXSQ.js";
import "./chunk-G4UBMCOX.js";
import {
  O,
  Univer,
  UserManagerService
} from "./chunk-DN46DLPI.js";
import "./chunk-62WIURJL.js";

// src/sheets-no-worker/main.ts
var IS_E2E = false;
var LOAD_LAZY_PLUGINS_TIMEOUT = 100;
var LOAD_VERY_LAZY_PLUGINS_TIMEOUT = 1e3;
var mockUser = {
  userID: "Owner_qxVnhPbQ",
  name: "Owner",
  avatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAInSURBVHgBtZU9TxtBEIbfWRzFSIdkikhBSqRQkJqkCKTCFkqVInSUSaT0wC8w/gXxD4gU2nRJkXQWhAZowDUUWKIwEgWWbEEB3mVmx3dn4DA2nB/ppNuPeWd29mMIPXDr+RxwtgRHeW6+guNPRxogqnL7Dwz9psJ27S4NShaeZTH3kwXy6I81dlRKcmRui88swdq9AcSFL7Buz1Vmlns64MiLsCjzwnIYHLH57tbfFbs7KRaXyEU8FVZofqccOfA5l7Q8LPIkGrwnb2RPNEXWFVMUF3L+kDCk0btDDAMzOm5YfAHDwp4tG74wnzAsiOYMnJ3GoDybA7IT98/jm5+JNnfiIzAS6LlqHQBN/i6b2t/cV1Hh6BfwYlHnHP4AXi5q/8kmMMpOs8+BixZw/Fd6xUEHEbnkgclvQP2fGp7uShRKnQ3G32rkjV1th8JhIGG7tR/JyjGteSOZELwGMmNqIIigRCLRh2OZIE6BjItdd7pCW6Uhm1zzkUtungSxwEUzNpQ+GQumtH1ej1MqgmNT6vwmhCq5yuwq56EYTbgeQUz3yvrpV1b4ok3nYJ+eYhgYmjRUqErx2EDq0Fr8FhG++iqVGqxlUJI/70Ar0UgJaWHj6hYVHJrfKssAHot1JfqwE9WVWzXZVd5z2Ws/4PnmtEjkXeKJDvxUecLbWOXH/DP6QQ4J72NS0adedp1aseBfXP8odlZFfPvBF7SN/8hky1TYuPOAXAEipMx15u5ToAAAAABJRU5ErkJggg==",
  anonymous: false,
  canBindAnonymous: false
};
function createNewInstance() {
  const univer = new Univer({
    // theme: greenTheme,
    darkMode: localStorage.getItem("local.darkMode") === "dark",
    locale: "zhCN" /* ZH_CN */,
    locales: {
      ["zhCN" /* ZH_CN */]: zh_CN_default
    },
    logLevel: 4 /* VERBOSE */
  });
  const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
  univer.registerPlugin(UniverRPCMainThreadPlugin, { workerURL: worker });
  univer.registerPlugin(UniverDocsPlugin);
  univer.registerPlugin(UniverRenderEnginePlugin);
  univer.registerPlugin(UniverUIPlugin, {
    container: "app"
    // ribbonType: 'simple',
  });
  univer.registerPlugin(UniverDocsUIPlugin);
  univer.registerPlugin(UniverSheetsPlugin, {
    autoHeightForMergedCells: true
  });
  univer.registerPlugin(UniverSheetsUIPlugin);
  univer.registerPlugin(UniverSheetsNumfmtPlugin);
  univer.registerPlugin(UniverSheetsZenEditorPlugin);
  univer.registerPlugin(UniverFormulaEnginePlugin);
  univer.registerPlugin(UniverSheetsFormulaPlugin, { writeArrayFormulaToSnapshot: true });
  univer.registerPlugin(UniverSheetsDataValidationPlugin);
  univer.registerPlugin(UniverSheetsConditionalFormattingPlugin);
  univer.registerPlugin(UniverSheetsFilterPlugin);
  univer.registerPlugin(UniverSheetsSortPlugin);
  univer.registerPlugin(UniverSheetsHyperLinkPlugin);
  univer.registerPlugin(UniverSheetsThreadCommentPlugin);
  univer.registerPlugin(UniverSheetsTablePlugin);
  univer.registerPlugin(UniverNetworkPlugin);
  univer.registerPlugin(UniverSheetsNotePlugin);
  if (IS_E2E) {
    univer.registerPlugin(UniverDebuggerPlugin, {
      fab: false,
      performanceMonitor: {
        enabled: false
      }
    });
  }
  const injector = univer.__getInjector();
  const userManagerService = injector.get(UserManagerService);
  userManagerService.setCurrentUser(mockUser);
  if (!IS_E2E) {
    univer.createUnit(O.UNIVER_SHEET, DEFAULT_WORKBOOK_DATA_DEMO);
  }
  setTimeout(() => {
    import("./lazy-NHHZAM7S.js").then((lazy) => {
      const plugins = lazy.default();
      plugins.forEach((p) => univer.registerPlugin(p[0], p[1]));
    });
  }, LOAD_LAZY_PLUGINS_TIMEOUT);
  setTimeout(() => {
    import("./very-lazy-V5TFST5H.js").then((lazy) => {
      const plugins = lazy.default();
      plugins.forEach((p) => univer.registerPlugin(p[0], p[1]));
    });
  }, LOAD_VERY_LAZY_PLUGINS_TIMEOUT);
  univer.onDispose(() => {
    worker.terminate();
    window.univer = void 0;
    window.univerAPI = void 0;
  });
  window.univer = univer;
  window.univerAPI = FUniver.newAPI(univer);
}
createNewInstance();
window.createNewInstance = createNewInstance;
export {
  mockUser
};
//# sourceMappingURL=sheets-no-worker/main.js.map
