import {
  UniverSheetsThreadCommentUIPlugin
} from "/univer/chunk-2XAB7K3S.js";
import {
  UniverDocsMentionUIPlugin
} from "/univer/chunk-UJ67HL2T.js";
import {
  UniverThreadCommentUIPlugin
} from "/univer/chunk-HTDH6JZQ.js";
import {
  UniverSheetsZenEditorPlugin
} from "/univer/chunk-BU5XQJUX.js";
import "/univer/chunk-KBRG7VYH.js";
import {
  UniverSheetsHyperLinkPlugin
} from "/univer/chunk-AZZJ2Q3T.js";
import {
  UniverSheetsThreadCommentPlugin
} from "/univer/chunk-WQN4YX5H.js";
import {
  UniverSheetsSortPlugin
} from "/univer/chunk-DKCX73BQ.js";
import "/univer/chunk-SKYS6W5P.js";
import {
  UniverSheetsConditionalFormattingPlugin
} from "/univer/chunk-6EP3P65R.js";
import {
  UniverSheetsFilterPlugin
} from "/univer/chunk-NFRKHRYD.js";
import {
  UniverDocsDrawingUIPlugin
} from "/univer/chunk-4EAWMATX.js";
import "/univer/chunk-CGMM54DM.js";
import {
  FUniver
} from "/univer/chunk-3RXJ4LZI.js";
import {
  UniverSheetsFormulaUIPlugin
} from "/univer/chunk-HTZYHXGN.js";
import {
  UniverSheetsNumfmtUIPlugin
} from "/univer/chunk-RPHCUFXW.js";
import {
  UniverSheetsNumfmtPlugin
} from "/univer/chunk-DSZZQHBJ.js";
import {
  UniverSheetsDataValidationPlugin
} from "/univer/chunk-XXJESKVN.js";
import {
  UniverSheetsUIPlugin
} from "/univer/chunk-LXKHVO4Y.js";
import {
  UniverDocsPlugin,
  UniverDocsUIPlugin
} from "/univer/chunk-4MI62PCK.js";
import "/univer/chunk-YXIT6Q6A.js";
import {
  UniverUIPlugin,
  clsx,
  require_jsx_runtime,
  require_react,
  useDependency,
  useObservable
} from "/univer/chunk-XUI25LTE.js";
import {
  zh_CN_default
} from "/univer/chunk-Q3VLDO2L.js";
import {
  UniverSheetsFormulaPlugin
} from "/univer/chunk-H5NJEYZ5.js";
import {
  UniverFormulaEnginePlugin,
  UniverSheetsPlugin
} from "/univer/chunk-CDHET2WN.js";
import {
  UniverRenderEnginePlugin
} from "/univer/chunk-7ZBW2CWY.js";
import "/univer/chunk-SSSDKVVD.js";
import {
  IUniverInstanceService,
  O,
  Univer,
  UserManagerService
} from "/univer/chunk-YLGQP2EX.js";
import {
  __toESM
} from "/univer/chunk-AROCCXDN.js";

// src/sheets-multi-units/switch-units.tsx
var import_react = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var SwitchUnits = () => {
  const univerInstanceService = useDependency(IUniverInstanceService);
  const activeSheet = useObservable((0, import_react.useMemo)(() => univerInstanceService.getCurrentTypeOfUnit$(O.UNIVER_SHEET), [univerInstanceService]));
  if (!activeSheet) {
    return null;
  }
  const switchSheet = (sheet) => {
    univerInstanceService.focusUnit(sheet.getUnitId());
  };
  const allSheets = univerInstanceService.getAllUnitsForType(O.UNIVER_SHEET);
  const activeSheetId = activeSheet == null ? void 0 : activeSheet.getUnitId();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "univer-w-full univer-border-b univer-border-gray-200 univer-bg-white univer-shadow-sm", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "univer-px-4 univer-py-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      className: `univer-scrollbar-hide univer-flex univer-items-center univer-gap-1 univer-overflow-x-auto univer-overflow-y-hidden`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "span",
          {
            className: `univer-mr-3 univer-whitespace-nowrap univer-text-sm univer-font-medium univer-text-gray-600`,
            children: "\u5DE5\u4F5C\u8868:"
          }
        ),
        allSheets.map((sheet) => {
          const isActive = sheet.getUnitId() === activeSheetId;
          return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "div",
            {
              onClick: () => switchSheet(sheet),
              className: clsx(`univer-relative univer-min-w-0 univer-flex-shrink-0 univer-transform univer-cursor-pointer univer-whitespace-nowrap univer-rounded-lg univer-px-4 univer-py-2 univer-text-sm univer-font-medium univer-transition-all univer-duration-200 focus:univer-outline-none focus:univer-ring-2 focus:univer-ring-blue-500 focus:univer-ring-offset-2 active:univer-scale-95`, {
                [`univer-border-2 univer-border-blue-300 univer-bg-blue-100 univer-text-blue-700 univer-shadow-sm`]: isActive,
                [`univer-border-2 univer-border-transparent univer-bg-gray-50 univer-text-gray-700 hover:univer-border-gray-300 hover:univer-bg-gray-100 hover:univer-text-gray-900`]: !isActive
              }),
              title: sheet.getUnitId(),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "univer-max-w-32 univer-truncate", children: sheet.getUnitId() }),
                isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "div",
                  {
                    className: `univer-absolute -univer-bottom-1 univer-left-1/2 univer-h-1 univer-w-1 -univer-translate-x-1/2 univer-transform univer-rounded-full univer-bg-blue-500`
                  }
                )
              ]
            },
            sheet.getUnitId()
          );
        })
      ]
    }
  ) }) });
};

// src/sheets-multi-units/main.ts
var LOAD_LAZY_PLUGINS_TIMEOUT = 100;
var LOAD_VERY_LAZY_PLUGINS_TIMEOUT = 1e3;
var mockUser = {
  userID: "Owner_qxVnhPbQ",
  name: "Owner",
  avatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAInSURBVHgBtZU9TxtBEIbfWRzFSIdkikhBSqRQkJqkCKTCFkqVInSUSaT0wC8w/gXxD4gU2nRJkXQWhAZowDUUWKIwEgWWbEEB3mVmx3dn4DA2nB/ppNuPeWd29mMIPXDr+RxwtgRHeW6+guNPRxogqnL7Dwz9psJ27S4NShaeZTH3kwXy6I81dlRKcmRui88swdq9AcSFL7Buz1Vmlns64MiLsCjzwnIYHLH57tbfFbs7KRaXyEU8FVZofqccOfA5l7Q8LPIkGrwnb2RPNEXWFVMUF3L+kDCk0btDDAMzOm5YfAHDwp4tG74wnzAsiOYMnJ3GoDybA7IT98/jm5+JNnfiIzAS6LlqHQBN/i6b2t/cV1Hh6BfwYlHnHP4AXi5q/8kmMMpOs8+BixZw/Fd6xUEHEbnkgclvQP2fGp7uShRKnQ3G32rkjV1th8JhIGG7tR/JyjGteSOZELwGMmNqIIigRCLRh2OZIE6BjItdd7pCW6Uhm1zzkUtungSxwEUzNpQ+GQumtH1ej1MqgmNT6vwmhCq5yuwq56EYTbgeQUz3yvrpV1b4ok3nYJ+eYhgYmjRUqErx2EDq0Fr8FhG++iqVGqxlUJI/70Ar0UgJaWHj6hYVHJrfKssAHot1JfqwE9WVWzXZVd5z2Ws/4PnmtEjkXeKJDvxUecLbWOXH/DP6QQ4J72NS0adedp1aseBfXP8odlZFfPvBF7SN/8hky1TYuPOAXAEipMx15u5ToAAAAABJRU5ErkJggg==",
  anonymous: false,
  canBindAnonymous: false
};
var univer = new Univer({
  locale: "zhCN" /* ZH_CN */,
  locales: {
    ["zhCN" /* ZH_CN */]: zh_CN_default
  },
  logLevel: 4 /* VERBOSE */
});
univer.registerPlugin(UniverDocsPlugin);
univer.registerPlugin(UniverRenderEnginePlugin);
univer.registerPlugin(UniverUIPlugin, { container: "app" });
univer.registerPlugin(UniverDocsUIPlugin);
univer.registerPlugin(UniverDocsDrawingUIPlugin);
univer.registerPlugin(UniverDocsMentionUIPlugin);
univer.registerPlugin(UniverSheetsPlugin);
univer.registerPlugin(UniverSheetsUIPlugin);
univer.registerPlugin(UniverSheetsNumfmtPlugin);
univer.registerPlugin(UniverSheetsZenEditorPlugin);
univer.registerPlugin(UniverFormulaEnginePlugin);
univer.registerPlugin(UniverSheetsNumfmtUIPlugin);
univer.registerPlugin(UniverSheetsFormulaPlugin);
univer.registerPlugin(UniverSheetsFormulaUIPlugin);
univer.registerPlugin(UniverSheetsDataValidationPlugin);
univer.registerPlugin(UniverSheetsConditionalFormattingPlugin);
univer.registerPlugin(UniverSheetsFilterPlugin);
univer.registerPlugin(UniverSheetsSortPlugin);
univer.registerPlugin(UniverSheetsHyperLinkPlugin);
univer.registerPlugin(UniverThreadCommentUIPlugin);
univer.registerPlugin(UniverSheetsThreadCommentPlugin);
univer.registerPlugin(UniverSheetsThreadCommentUIPlugin);
var injector = univer.__getInjector();
var userManagerService = injector.get(UserManagerService);
userManagerService.setCurrentUser(mockUser);
setTimeout(() => {
  import("/univer/lazy-4QCNFWS7.js").then((lazy) => {
    const plugins = lazy.default();
    plugins.forEach((p) => univer.registerPlugin(p[0], p[1]));
  });
}, LOAD_LAZY_PLUGINS_TIMEOUT);
setTimeout(() => {
  import("/univer/very-lazy-NYOOAA6T.js").then((lazy) => {
    const plugins = lazy.default();
    plugins.forEach((p) => univer.registerPlugin(p[0], p[1]));
  });
}, LOAD_VERY_LAZY_PLUGINS_TIMEOUT);
univer.onDispose(() => {
  window.univer = void 0;
  window.univerAPI = void 0;
});
window.univer = univer;
window.univerAPI = FUniver.newAPI(univer);
var univerAPI = window.univerAPI;
univerAPI.createWorkbook({
  id: "workbook1",
  sheetOrder: ["sheet-01"],
  resources: [],
  sheets: {
    "sheet-01": {
      id: "sheet-01",
      name: "Sheet 01",
      rowCount: 20,
      columnCount: 40,
      cellData: {
        0: {
          1: { t: 2 /* NUMBER */, v: 10 }
        },
        5: {
          0: {}
        }
      }
    },
    "sheet-02": {
      id: "sheet-02",
      name: "foobar",
      rowCount: 20,
      columnCount: 40,
      cellData: {
        5: {
          0: {}
        }
      }
    }
  }
});
univerAPI.createWorkbook(
  {
    id: "workbook2",
    sheetOrder: ["sheet-01"],
    sheets: {
      "sheet-01": {
        id: "sheet-01",
        name: "Sheet 01",
        rowCount: 20,
        columnCount: 40,
        cellData: {
          0: {
            0: { v: 1 },
            1: { v: 2 }
          },
          1: {
            0: { v: 3 },
            1: { v: 4 }
          },
          5: {
            0: {}
          }
        }
      },
      "sheet-02": {
        id: "sheet-02",
        name: "foobar",
        rowCount: 20,
        columnCount: 40,
        cellData: {
          5: {
            0: {}
          }
        }
      }
    }
  },
  {
    makeCurrent: false
  }
);
univerAPI.createWorkbook({
  id: "workbook3",
  sheetOrder: ["sheet-01"],
  sheets: {
    "sheet-01": {
      id: "sheet-01",
      name: "Sheet 01",
      rowCount: 20,
      columnCount: 40,
      cellData: {
        0: {
          0: { v: 1 },
          1: { v: 2 }
        },
        1: {
          0: { v: 3 },
          1: { v: 4 }
        },
        5: {
          0: {
            f: "='[workbook1]Sheet 01'!A5 * '[workbook2]Sheet 01'!A5 * '[workbook3]Sheet 01'!A5* '[workbook4]Sheet 01'!A5"
          }
        }
      }
    },
    "sheet-02": {
      id: "sheet-02",
      name: "foobar",
      rowCount: 20,
      columnCount: 40,
      cellData: {
        5: {
          0: {}
        }
      }
    }
  }
});
univerAPI.createWorkbook({
  id: "workbook4",
  sheetOrder: ["sheet-01"],
  sheets: {
    "sheet-01": {
      id: "sheet-01",
      name: "Sheet 01",
      rowCount: 20,
      columnCount: 40,
      cellData: {
        0: {
          0: { v: 1 },
          1: { v: 2 }
        },
        1: {
          0: { v: 3 },
          1: { v: 4 }
        },
        5: {
          0: {
            f: "='[workbook1]Sheet 01'!A5 * '[workbook2]Sheet 01'!A5 * '[workbook3]Sheet 01'!A5* '[workbook4]Sheet 01'!A5"
          }
        }
      }
    },
    "sheet-02": {
      id: "sheet-02",
      name: "foobar",
      rowCount: 20,
      columnCount: 40,
      cellData: {
        5: {
          0: {}
        }
      }
    }
  }
});
univerAPI.registerUIPart(
  univerAPI.Enum.BuiltInUIPart.CUSTOM_HEADER,
  SwitchUnits
);
export {
  mockUser
};
