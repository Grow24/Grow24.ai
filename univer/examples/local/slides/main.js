import {
  UniverSlidesPlugin,
  UniverSlidesUIPlugin
} from "../chunk-5XOCCV3C.js";
import {
  DEFAULT_SLIDE_DATA
} from "../chunk-HR7RQ36T.js";
import "../chunk-ZB3FDSA3.js";
import {
  UniverDocsPlugin,
  UniverDocsUIPlugin,
  UniverDrawingPlugin
} from "../chunk-PAANS7B4.js";
import "../chunk-222VPS6G.js";
import {
  UniverUIPlugin
} from "../chunk-CSPB4B6P.js";
import {
  zh_CN_default
} from "../chunk-UBR24CGB.js";
import "../chunk-EK3JRTKZ.js";
import {
  UniverFormulaEnginePlugin
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
//# sourceMappingURL=main.js.map
