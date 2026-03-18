import {
  UniverUniscriptPlugin
} from "../chunk-7MGMVNE2.js";
import "../chunk-KWR4RQXX.js";
import "../chunk-FQB5FGHR.js";
import "../chunk-CH3J6FPQ.js";
import {
  UniverDebuggerPlugin
} from "../chunk-EBHXHYVD.js";
import "../chunk-JTSBSRTH.js";
import "../chunk-6GIX2Z6C.js";
import "../chunk-JWBVGNBO.js";
import {
  UNISCRIT_WORKBOOK_DATA_DEMO
} from "../chunk-HR7RQ36T.js";
import {
  UniverSheetsNumfmtUIPlugin
} from "../chunk-MYZLY44N.js";
import {
  UniverSheetsNumfmtPlugin
} from "../chunk-GNGDE6PL.js";
import "../chunk-ZB3FDSA3.js";
import {
  UniverSheetsUIPlugin
} from "../chunk-BGPMR3ZY.js";
import {
  UniverDocsPlugin,
  UniverDocsUIPlugin
} from "../chunk-PAANS7B4.js";
import "../chunk-222VPS6G.js";
import {
  UniverUIPlugin
} from "../chunk-CSPB4B6P.js";
import {
  zh_CN_default
} from "../chunk-UBR24CGB.js";
import {
  UniverSheetsFormulaPlugin
} from "../chunk-EK3JRTKZ.js";
import {
  UniverFormulaEnginePlugin,
  UniverSheetsPlugin
} from "../chunk-O5WA5YRR.js";
import {
  UniverRenderEnginePlugin
} from "../chunk-I5MCYWYL.js";
import "../chunk-OJWCZZ56.js";
import {
  O,
  Univer
} from "../chunk-ZRYQFDHJ.js";
import "../chunk-NSSCU2QI.js";

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
//# sourceMappingURL=main.js.map
