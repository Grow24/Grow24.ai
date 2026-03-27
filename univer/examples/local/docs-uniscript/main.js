import {
  UniverUniscriptPlugin
} from "/univer/chunk-J2NZQGAY.js";
import "/univer/chunk-72MI2KVK.js";
import "/univer/chunk-7JWTWIUL.js";
import "/univer/chunk-3K36HQZG.js";
import "/univer/chunk-3RXJ4LZI.js";
import {
  DEFAULT_DOCUMENT_DATA_CN
} from "/univer/chunk-2PJ3QCNN.js";
import "/univer/chunk-XXJESKVN.js";
import {
  UniverSheetsUIPlugin
} from "/univer/chunk-LXKHVO4Y.js";
import {
  UniverDocsPlugin,
  UniverDocsUIPlugin
} from "/univer/chunk-4MI62PCK.js";
import "/univer/chunk-YXIT6Q6A.js";
import {
  UniverUIPlugin
} from "/univer/chunk-XUI25LTE.js";
import {
  zh_CN_default
} from "/univer/chunk-Q3VLDO2L.js";
import "/univer/chunk-H5NJEYZ5.js";
import {
  UniverFormulaEnginePlugin,
  UniverSheetsPlugin
} from "/univer/chunk-CDHET2WN.js";
import {
  UniverRenderEnginePlugin
} from "/univer/chunk-7ZBW2CWY.js";
import "/univer/chunk-SSSDKVVD.js";
import {
  O,
  Univer
} from "/univer/chunk-YLGQP2EX.js";
import "/univer/chunk-AROCCXDN.js";

// src/docs-uniscript/main.ts
var univer = new Univer({
  locale: "zhCN" /* ZH_CN */,
  locales: {
    ["zhCN" /* ZH_CN */]: zh_CN_default
  },
  logLevel: 4 /* VERBOSE */
});
univer.registerPlugin(UniverRenderEnginePlugin);
univer.registerPlugin(UniverFormulaEnginePlugin);
univer.registerPlugin(UniverUIPlugin, {
  container: "app",
  footer: false
});
univer.registerPlugin(UniverDocsPlugin);
univer.registerPlugin(UniverDocsUIPlugin);
univer.registerPlugin(UniverSheetsPlugin);
univer.registerPlugin(UniverSheetsUIPlugin);
univer.registerPlugin(UniverUniscriptPlugin, {
  getWorkerUrl(moduleID, label) {
    if (label === "typescript" || label === "javascript") {
      return "/vs/language/typescript/ts.worker.js";
    }
    return "/vs/editor/editor.worker.js";
  }
});
univer.createUnit(O.UNIVER_DOC, DEFAULT_DOCUMENT_DATA_CN);
window.univer = univer;
