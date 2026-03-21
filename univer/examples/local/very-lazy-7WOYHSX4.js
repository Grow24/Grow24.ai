import {
  UniverActionRecorderPlugin
} from "/univer/chunk-26VDTOSR.js";
import {
  UniverSheetsFindReplacePlugin,
  UniverSheetsSortUIPlugin
} from "/univer/chunk-LCS2JLUC.js";
import {
  UniverSheetsCrosshairHighlightPlugin
} from "/univer/chunk-KBRG7VYH.js";
import {
  UniverSheetsHyperLinkUIPlugin
} from "/univer/chunk-AZZJ2Q3T.js";
import "/univer/chunk-DKCX73BQ.js";
import "/univer/chunk-NFRKHRYD.js";
import {
  UniverUniscriptPlugin
} from "/univer/chunk-J2NZQGAY.js";
import "/univer/chunk-72MI2KVK.js";
import "/univer/chunk-7JWTWIUL.js";
import "/univer/chunk-3K36HQZG.js";
import {
  UniverDebuggerPlugin,
  UniverWatermarkPlugin
} from "/univer/chunk-LVMGEEMJ.js";
import "/univer/chunk-4EAWMATX.js";
import "/univer/chunk-CGMM54DM.js";
import "/univer/chunk-3RXJ4LZI.js";
import "/univer/chunk-HTZYHXGN.js";
import "/univer/chunk-2PJ3QCNN.js";
import "/univer/chunk-XXJESKVN.js";
import "/univer/chunk-LXKHVO4Y.js";
import "/univer/chunk-4MI62PCK.js";
import "/univer/chunk-XUI25LTE.js";
import "/univer/chunk-H5NJEYZ5.js";
import "/univer/chunk-CDHET2WN.js";
import "/univer/chunk-7ZBW2CWY.js";
import "/univer/chunk-SSSDKVVD.js";
import "/univer/chunk-YLGQP2EX.js";
import "/univer/chunk-AROCCXDN.js";

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
