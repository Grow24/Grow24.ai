import {
  UniverFormulaEnginePlugin,
  UniverRPCWorkerThreadPlugin,
  UniverSheetsPlugin
} from "./chunk-SV6SUIS4.js";
import {
  Univer
} from "./chunk-DN46DLPI.js";
import "./chunk-62WIURJL.js";

// src/uni/worker.ts
var univer = new Univer({
  locale: "zhCN" /* ZH_CN */
});
univer.registerPlugin(UniverSheetsPlugin, { onlyRegisterFormulaRelatedMutations: true });
univer.registerPlugin(UniverFormulaEnginePlugin);
univer.registerPlugin(UniverRPCWorkerThreadPlugin);
self.univer = univer;
//# sourceMappingURL=uni/worker.js.map
