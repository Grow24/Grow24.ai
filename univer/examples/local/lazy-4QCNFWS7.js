import {
  UniverSheetsDataValidationUIPlugin
} from "/univer/chunk-V5IBWILB.js";
import {
  UniverSheetsConditionalFormattingUIPlugin
} from "/univer/chunk-7Y223JCO.js";
import {
  UniverSheetsFilterUIPlugin
} from "/univer/chunk-G47N2NM6.js";
import "/univer/chunk-6EP3P65R.js";
import "/univer/chunk-NFRKHRYD.js";
import {
  UniverSheetsDrawingUIPlugin
} from "/univer/chunk-CGMM54DM.js";
import "/univer/chunk-HTZYHXGN.js";
import "/univer/chunk-DSZZQHBJ.js";
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

// src/sheets-multi-units/lazy.ts
function getLazyPlugins() {
  return [
    [UniverSheetsDataValidationUIPlugin],
    [UniverSheetsConditionalFormattingUIPlugin],
    [UniverSheetsFilterUIPlugin, { useRemoteFilterValuesGenerator: false }],
    [UniverSheetsDrawingUIPlugin]
  ];
}
export {
  getLazyPlugins as default
};
