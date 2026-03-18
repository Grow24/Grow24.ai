import {
  UniverActionRecorderPlugin
} from "./chunk-4V4YCSJG.js";
import {
  UniverSheetsFindReplacePlugin,
  UniverSheetsSortUIPlugin
} from "./chunk-DPZQZD2Z.js";
import {
  UniverSheetsCrosshairHighlightPlugin
} from "./chunk-4JHKAGB5.js";
import {
  UniverSheetsHyperLinkUIPlugin
} from "./chunk-TUYVJHM2.js";
import "./chunk-4ZNIAQOP.js";
import "./chunk-SSBZJR5N.js";
import {
  UniverUniscriptPlugin
} from "./chunk-7MGMVNE2.js";
import "./chunk-KWR4RQXX.js";
import "./chunk-FQB5FGHR.js";
import "./chunk-CH3J6FPQ.js";
import {
  UniverDebuggerPlugin,
  UniverWatermarkPlugin
} from "./chunk-EBHXHYVD.js";
import "./chunk-JTSBSRTH.js";
import "./chunk-6GIX2Z6C.js";
import "./chunk-JWBVGNBO.js";
import "./chunk-ZR7BMKL3.js";
import "./chunk-HR7RQ36T.js";
import "./chunk-ZB3FDSA3.js";
import "./chunk-BGPMR3ZY.js";
import "./chunk-PAANS7B4.js";
import "./chunk-CSPB4B6P.js";
import "./chunk-EK3JRTKZ.js";
import "./chunk-O5WA5YRR.js";
import "./chunk-I5MCYWYL.js";
import "./chunk-OJWCZZ56.js";
import "./chunk-ZRYQFDHJ.js";
import "./chunk-NSSCU2QI.js";

// src/sheets/very-lazy.ts
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
//# sourceMappingURL=very-lazy-6XZ7FZBQ.js.map
