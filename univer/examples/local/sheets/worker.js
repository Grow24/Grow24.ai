import {
  UniverSheetsFilterPlugin
} from "./chunk-I56OIIV5.js";
import {
  zh_CN_default
} from "./chunk-J4OFPKRX.js";
import {
  UniverRemoteSheetsFormulaPlugin
} from "./chunk-TOYW4IMU.js";
import {
  UniverFormulaEnginePlugin,
  UniverRPCWorkerThreadPlugin,
  UniverSheetsPlugin
} from "./chunk-SV6SUIS4.js";
import "./chunk-BPIUAXSQ.js";
import "./chunk-G4UBMCOX.js";
import {
  Univer
} from "./chunk-DN46DLPI.js";
import "./chunk-62WIURJL.js";

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
//# sourceMappingURL=sheets/worker.js.map
