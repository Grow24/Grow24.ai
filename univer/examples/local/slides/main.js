import {
  UniverSlidesPlugin,
  UniverSlidesUIPlugin
} from "/univer/chunk-BWQLCAPN.js";
import {
  DEFAULT_SLIDE_DATA
} from "/univer/chunk-2PJ3QCNN.js";
import "/univer/chunk-XXJESKVN.js";
import {
  UniverDocsPlugin,
  UniverDocsUIPlugin,
  UniverDrawingPlugin
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
  UniverFormulaEnginePlugin
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

// src/slides/main.ts
var univer = new Univer({
  locale: "zhCN" /* ZH_CN */,
  locales: {
    ["zhCN" /* ZH_CN */]: zh_CN_default
  }
});
univer.registerPlugin(UniverRenderEnginePlugin);
univer.registerPlugin(UniverUIPlugin, { container: "app" });
univer.registerPlugin(UniverDocsPlugin);
univer.registerPlugin(UniverDocsUIPlugin);
univer.registerPlugin(UniverFormulaEnginePlugin);
univer.registerPlugin(UniverDrawingPlugin);
univer.registerPlugin(UniverSlidesPlugin);
univer.registerPlugin(UniverSlidesUIPlugin);
univer.createUnit(O.UNIVER_SLIDE, DEFAULT_SLIDE_DATA);
window.univer = univer;
