import {
  UniverFormulaEnginePlugin,
  UniverRPCWorkerThreadPlugin,
  UniverSheetsPlugin
} from "/univer/chunk-CDHET2WN.js";
import {
  Univer
} from "/univer/chunk-YLGQP2EX.js";
import "/univer/chunk-AROCCXDN.js";

// src/uni/worker.ts
var univer = new Univer({
  locale: "zhCN" /* ZH_CN */
});
univer.registerPlugin(UniverSheetsPlugin, { onlyRegisterFormulaRelatedMutations: true });
univer.registerPlugin(UniverFormulaEnginePlugin);
univer.registerPlugin(UniverRPCWorkerThreadPlugin);
self.univer = univer;
