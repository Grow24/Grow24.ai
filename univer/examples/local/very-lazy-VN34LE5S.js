import {
  UniverActionRecorderPlugin
} from "./chunk-KHOFGP7W.js";
import {
  UniverSheetsFindReplacePlugin,
  UniverSheetsSortUIPlugin
} from "./chunk-2INEARRN.js";
import {
  UniverSheetsCrosshairHighlightPlugin
} from "./chunk-5RPKIJKB.js";
import {
  UniverSheetsHyperLinkUIPlugin
} from "./chunk-354FJ26S.js";
import "./chunk-LI73LENO.js";
import "./chunk-I56OIIV5.js";
import {
  UniverUniscriptPlugin
} from "./chunk-OR3E4XC3.js";
import "./chunk-NYIU2LNW.js";
import "./chunk-T4VQCJ7G.js";
import "./chunk-UR3YKDTU.js";
import {
  UniverDebuggerPlugin,
  UniverWatermarkPlugin
} from "./chunk-UJI7K6GU.js";
import "./chunk-HFVM6MYW.js";
import "./chunk-6W4YZ3HG.js";
import "./chunk-JWXRDIU7.js";
import "./chunk-6TVBTQ2X.js";
import "./chunk-VMFOP3F4.js";
import "./chunk-ZRJXDTFY.js";
import "./chunk-WPDJPIZN.js";
import "./chunk-IJAOVONG.js";
import "./chunk-R42OVMY4.js";
import "./chunk-TOYW4IMU.js";
import "./chunk-SV6SUIS4.js";
import "./chunk-BPIUAXSQ.js";
import "./chunk-G4UBMCOX.js";
import "./chunk-DN46DLPI.js";
import "./chunk-62WIURJL.js";

// src/sheets-multi-units/very-lazy.ts
var IS_E2E = false;
function getVeryLazyPlugins() {
  const plugins = [
    [UniverActionRecorderPlugin],
    [UniverSheetsHyperLinkUIPlugin],
    [UniverSheetsSortUIPlugin],
    [UniverSheetsCrosshairHighlightPlugin],
    [UniverSheetsFindReplacePlugin],
    [UniverWatermarkPlugin]
  ];
  if (!IS_E2E) {
    plugins.push([UniverDebuggerPlugin]);
    plugins.push([UniverUniscriptPlugin, {
      getWorkerUrl(_, label) {
        if (label === "json") {
          return "/vs/language/json/json.worker.js";
        }
        if (label === "css" || label === "scss" || label === "less") {
          return "/vs/language/css/css.worker.js";
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
          return "/vs/language/html/html.worker.js";
        }
        if (label === "typescript" || label === "javascript") {
          return "/vs/language/typescript/ts.worker.js";
        }
        return "/vs/editor/editor.worker.js";
      }
    }]);
  }
  return plugins;
}
export {
  getVeryLazyPlugins as default
};
//# sourceMappingURL=very-lazy-VN34LE5S.js.map
