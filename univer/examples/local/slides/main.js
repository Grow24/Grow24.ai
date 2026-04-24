import {
  UniverSlidesPlugin,
  UniverSlidesUIPlugin
} from "./chunk-HAJU43KU.js";
import {
  DEFAULT_SLIDE_DATA
} from "./chunk-VMFOP3F4.js";
import "./chunk-ZRJXDTFY.js";
import {
  UniverDocsPlugin,
  UniverDocsUIPlugin,
  UniverDrawingPlugin
} from "./chunk-IJAOVONG.js";
import "./chunk-63AGE64E.js";
import {
  UniverUIPlugin
} from "./chunk-R42OVMY4.js";
import {
  zh_CN_default
} from "./chunk-J4OFPKRX.js";
import "./chunk-TOYW4IMU.js";
import {
  UniverFormulaEnginePlugin
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
//# sourceMappingURL=slides/main.js.map
