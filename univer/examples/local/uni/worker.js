import {
  UniverFormulaEnginePlugin,
  UniverRPCWorkerThreadPlugin,
  UniverSheetsPlugin
} from "../chunk-O5WA5YRR.js";
import {
  Univer
} from "../chunk-ZRYQFDHJ.js";
import "../chunk-NSSCU2QI.js";

// src/uni/worker.ts
var univer = new Univer({
  locale: "zhCN" /* ZH_CN */
});
univer.registerPlugin(UniverSheetsPlugin, { onlyRegisterFormulaRelatedMutations: true });
univer.registerPlugin(UniverFormulaEnginePlugin);
univer.registerPlugin(UniverRPCWorkerThreadPlugin);
self.univer = univer;
//# sourceMappingURL=worker.js.map
