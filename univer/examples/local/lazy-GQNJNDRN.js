import {
  UniverSheetsNoteUIPlugin,
  UniverSheetsTableUIPlugin
} from "/univer/chunk-6PUXVPOU.js";
import {
  UniverSheetsDataValidationUIPlugin
} from "/univer/chunk-V5IBWILB.js";
import {
  UniverSheetsConditionalFormattingUIPlugin
} from "/univer/chunk-7Y223JCO.js";
import {
  UniverSheetsFilterUIPlugin
} from "/univer/chunk-G47N2NM6.js";
import "/univer/chunk-KPUOBSSK.js";
import {
  UniverSheetsThreadCommentUIPlugin
} from "/univer/chunk-2XAB7K3S.js";
import {
  UniverDocsMentionUIPlugin
} from "/univer/chunk-UJ67HL2T.js";
import {
  UniverThreadCommentUIPlugin
} from "/univer/chunk-HTDH6JZQ.js";
import "/univer/chunk-WQN4YX5H.js";
import "/univer/chunk-DKCX73BQ.js";
import "/univer/chunk-SKYS6W5P.js";
import "/univer/chunk-6EP3P65R.js";
import "/univer/chunk-NFRKHRYD.js";
import {
  UniverDocsDrawingUIPlugin
} from "/univer/chunk-4EAWMATX.js";
import {
  UniverSheetsDrawingUIPlugin
} from "/univer/chunk-CGMM54DM.js";
import {
  UniverSheetsFormulaUIPlugin
} from "/univer/chunk-HTZYHXGN.js";
import {
  UniverSheetsNumfmtUIPlugin
} from "/univer/chunk-RPHCUFXW.js";
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

// src/sheets/lazy.ts
function getLazyPlugins() {
  return [
    [UniverDocsDrawingUIPlugin],
    [UniverDocsMentionUIPlugin],
    [UniverSheetsNumfmtUIPlugin],
    [UniverThreadCommentUIPlugin],
    [UniverSheetsThreadCommentUIPlugin],
    [UniverSheetsNoteUIPlugin],
    [UniverSheetsTableUIPlugin],
    [UniverSheetsFormulaUIPlugin],
    [UniverSheetsDataValidationUIPlugin],
    [UniverSheetsConditionalFormattingUIPlugin],
    [UniverSheetsFilterUIPlugin, { useRemoteFilterValuesGenerator: false }],
    [UniverSheetsDrawingUIPlugin]
  ];
}
export {
  getLazyPlugins as default
};
