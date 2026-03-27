import {
  UniverUniscriptPlugin
} from "./chunk-OR3E4XC3.js";
import "./chunk-NYIU2LNW.js";
import "./chunk-T4VQCJ7G.js";
import "./chunk-UR3YKDTU.js";
import {
  UniverDebuggerPlugin
} from "./chunk-UJI7K6GU.js";
import "./chunk-HFVM6MYW.js";
import "./chunk-6W4YZ3HG.js";
import "./chunk-JWXRDIU7.js";
import {
  UNISCRIT_WORKBOOK_DATA_DEMO
} from "./chunk-VMFOP3F4.js";
import {
  UniverSheetsNumfmtUIPlugin
} from "./chunk-GGUDRFK6.js";
import {
  UniverSheetsNumfmtPlugin
} from "./chunk-W2QCNNNM.js";
import "./chunk-ZRJXDTFY.js";
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
  UniverSheetsPlugin
} from "./chunk-SV6SUIS4.js";
import {
  UniverRenderEnginePlugin
} from "./chunk-BPIUAXSQ.js";
import "./chunk-G4UBMCOX.js";
import {
  O,
  Univer
} from "./chunk-DN46DLPI.js";
import "./chunk-62WIURJL.js";

// src/sheets-uniscript/main.ts
var univer = new Univer({
  locale: "zhCN" /* ZH_CN */,
  locales: {
    ["zhCN" /* ZH_CN */]: zh_CN_default
  },
  logLevel: 4 /* VERBOSE */
});
univer.registerPlugin(UniverRenderEnginePlugin);
univer.registerPlugin(UniverUIPlugin, {
  container: "app"
});
univer.registerPlugin(UniverDocsPlugin);
univer.registerPlugin(UniverDocsUIPlugin);
univer.registerPlugin(UniverSheetsPlugin);
univer.registerPlugin(UniverSheetsUIPlugin);
univer.registerPlugin(UniverSheetsNumfmtPlugin);
univer.registerPlugin(UniverSheetsNumfmtUIPlugin);
univer.registerPlugin(UniverDebuggerPlugin);
univer.registerPlugin(UniverFormulaEnginePlugin);
univer.registerPlugin(UniverSheetsFormulaPlugin);
univer.registerPlugin(UniverUniscriptPlugin, {
  getWorkerUrl(_, label) {
    if (label === "typescript" || label === "javascript") {
      return "/vs/language/typescript/ts.worker.js";
    }
    return "/vs/editor/editor.worker.js";
  }
});
univer.createUnit(O.UNIVER_SHEET, UNISCRIT_WORKBOOK_DATA_DEMO);
window.univer = univer;
//# sourceMappingURL=sheets-uniscript/main.js.map
