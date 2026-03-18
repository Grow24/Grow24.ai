import {
  UniverSheetsFilterPlugin
} from "../chunk-SSBZJR5N.js";
import {
  zh_CN_default
} from "../chunk-UBR24CGB.js";
import {
  UniverRemoteSheetsFormulaPlugin
} from "../chunk-EK3JRTKZ.js";
import {
  UniverFormulaEnginePlugin,
  UniverRPCWorkerThreadPlugin,
  UniverSheetsPlugin
} from "../chunk-O5WA5YRR.js";
import "../chunk-I5MCYWYL.js";
import "../chunk-OJWCZZ56.js";
import {
  Univer
} from "../chunk-ZRYQFDHJ.js";
import "../chunk-NSSCU2QI.js";

// src/sheets/worker.ts
var univer = new Univer({
  locale: "zhCN" /* ZH_CN */,
  logLevel: 4 /* VERBOSE */,
  locales: {
    ["zhCN" /* ZH_CN */]: zh_CN_default
  }
});
univer.registerPlugins([
  [UniverSheetsPlugin, { onlyRegisterFormulaRelatedMutations: true }],
  [UniverFormulaEnginePlugin],
  [UniverRPCWorkerThreadPlugin],
  [UniverRemoteSheetsFormulaPlugin],
  [UniverSheetsFilterPlugin]
]);
self.univer = univer;
//# sourceMappingURL=worker.js.map
