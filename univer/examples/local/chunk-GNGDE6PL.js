import {
  INTERCEPTOR_POINT,
  INumfmtService,
  RemoveNumfmtMutation,
  SetNumfmtMutation,
  SetRangeValuesMutation,
  SheetInterceptorService,
  SheetsSelectionsService,
  UniverSheetsPlugin,
  checkCellValueType,
  factoryRemoveNumfmtUndoMutation,
  factorySetNumfmtUndoMutation,
  getSheetCommandTarget,
  rangeMerge,
  stripErrorMargin,
  transformCellsToRange
} from "./chunk-O5WA5YRR.js";
import {
  BehaviorSubject,
  DEFAULT_NUMBER_FORMAT,
  DependentOn,
  Disposable,
  ICommandService,
  IConfigService,
  IUndoRedoService,
  IUniverInstanceService,
  Inject,
  Injector,
  LocaleService,
  O,
  ObjectMatrix,
  Plugin,
  Range,
  ThemeService,
  isDefaultFormat,
  isTextFormat,
  lib_exports,
  merge,
  merge_default,
  of,
  registerDependencies,
  sequenceExecute,
  skip,
  switchMap,
  touchDependencies
} from "./chunk-ZRYQFDHJ.js";
import {
  __decorateClass,
  __decorateParam,
  __publicField
} from "./chunk-NSSCU2QI.js";

// ../packages/sheets-numfmt/src/base/const/plugin-name.ts
var SHEET_NUMFMT_PLUGIN = "SHEET_NUMFMT_PLUGIN";

// ../packages/sheets-numfmt/src/utils/decimal.ts
var getDecimalFromPattern = (pattern, defaultValue = 0) => {
  var _a;
  if (!pattern) {
    return defaultValue;
  }
  const info = lib_exports.getFormatInfo(pattern);
  return (_a = info.maxDecimals) != null ? _a : defaultValue;
};
var getDecimalString = (length) => new Array(Math.min(Math.max(0, Number(length)), 30)).fill(0).join("");
var setPatternDecimal = (patterns, decimalLength) => {
  const tokens = patterns.split(";").map((pattern) => {
    if (/\.0?/.test(pattern)) {
      return pattern.replace(
        /\.0*/g,
        `${decimalLength > 0 ? "." : ""}${getDecimalString(Number(decimalLength || 0))}`
      );
    }
    if (/0([^0]?)|0$/.test(pattern)) {
      return pattern.replace(
        /0([^0]+)|0$/,
        `0${decimalLength > 0 ? "." : ""}${getDecimalString(Number(decimalLength || 0))}$1`
      );
    }
    return pattern;
  });
  return tokens.join(";");
};
var isPatternHasDecimal = (pattern) => /\.0?/.test(pattern) || /0([^0]?)|0$/.test(pattern);

// ../packages/sheets-numfmt/src/commands/commands/set-numfmt.command.ts
var SetNumfmtCommand = {
  id: "sheet.command.numfmt.set.numfmt",
  type: 0 /* COMMAND */,
  // eslint-disable-next-line max-lines-per-function
  handler: (accessor, params) => {
    if (!params) {
      return false;
    }
    const commandService = accessor.get(ICommandService);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const undoRedoService = accessor.get(IUndoRedoService);
    const target = getSheetCommandTarget(univerInstanceService, params);
    if (!target) return false;
    const { unitId, subUnitId, worksheet } = target;
    const setCells = params.values.filter((value) => !!value.pattern);
    const removeCells = params.values.filter((value) => !value.pattern);
    const setRedos = transformCellsToRange(unitId, subUnitId, setCells);
    const removeRedos = {
      unitId,
      subUnitId,
      ranges: removeCells.map((cell) => ({
        startColumn: cell.col,
        startRow: cell.row,
        endColumn: cell.col,
        endRow: cell.row
      }))
    };
    const redos = [];
    const undos = [];
    if (setCells.length) {
      const setCellTypeObj = setCells.reduce((pre, cur) => {
        if (isTextFormat(cur.pattern)) {
          pre.setValue(cur.row, cur.col, { t: 1 /* STRING */ });
        }
        const cell = worksheet.getCellRaw(cur.row, cur.col);
        if (cell) {
          const type = checkCellValueType(cell.v);
          if (type !== cell.t) {
            pre.setValue(cur.row, cur.col, { t: type });
          }
        }
        return pre;
      }, new ObjectMatrix()).getMatrix();
      const undoSetCellTypeObj = new ObjectMatrix();
      new ObjectMatrix(setCellTypeObj).forValue((row, col) => {
        const cell = worksheet.getCellRaw(row, col);
        if (cell) {
          undoSetCellTypeObj.setValue(row, col, { t: cell.t });
        } else {
          undoSetCellTypeObj.setValue(row, col, { t: void 0 });
        }
      });
      Object.keys(setRedos.values).forEach((key) => {
        const v = setRedos.values[key];
        v.ranges = rangeMerge(v.ranges);
      });
      redos.push({
        id: SetNumfmtMutation.id,
        params: setRedos
      });
      const undo = factorySetNumfmtUndoMutation(accessor, setRedos);
      undos.push(...undo);
    }
    if (removeCells.length) {
      removeRedos.ranges = rangeMerge(removeRedos.ranges);
      const setCellTypeObj = removeCells.reduce((pre, cur) => {
        const cell = worksheet.getCellRaw(cur.row, cur.col);
        if (cell) {
          const type = checkCellValueType(cell.v);
          if (type !== cell.t) {
            pre.setValue(cur.row, cur.col, { t: type });
          }
        }
        return pre;
      }, new ObjectMatrix()).getMatrix();
      const undoSetCellTypeObj = new ObjectMatrix();
      new ObjectMatrix(setCellTypeObj).forValue((row, col) => {
        const cell = worksheet.getCellRaw(row, col);
        if (cell) {
          undoSetCellTypeObj.setValue(row, col, { t: cell.t });
        } else {
          undoSetCellTypeObj.setValue(row, col, { t: void 0 });
        }
      });
      redos.push({
        id: RemoveNumfmtMutation.id,
        params: removeRedos
      }, {
        id: SetRangeValuesMutation.id,
        params: {
          unitId,
          subUnitId,
          cellValue: setCellTypeObj
        }
      });
      const undo = factoryRemoveNumfmtUndoMutation(accessor, removeRedos);
      undos.push({
        id: SetRangeValuesMutation.id,
        params: {
          unitId,
          subUnitId,
          cellValue: undoSetCellTypeObj.getMatrix()
        }
      }, ...undo);
    }
    const result = sequenceExecute(redos, commandService).result;
    if (result) {
      undoRedoService.pushUndoRedo({
        unitID: unitId,
        undoMutations: undos,
        redoMutations: redos
      });
    }
    return result;
  }
};

// ../packages/sheets-numfmt/src/commands/commands/add-decimal.command.ts
var AddDecimalCommand = {
  id: "sheet.command.numfmt.add.decimal.command",
  type: 0 /* COMMAND */,
  handler: async (accessor) => {
    const commandService = accessor.get(ICommandService);
    const selectionManagerService = accessor.get(SheetsSelectionsService);
    const numfmtService = accessor.get(INumfmtService);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const selections = selectionManagerService.getCurrentSelections();
    if (!selections || !selections.length) {
      return false;
    }
    const target = getSheetCommandTarget(univerInstanceService);
    if (!target) return false;
    const { unitId, subUnitId } = target;
    let maxDecimals = 0;
    selections.forEach((selection) => {
      Range.foreach(selection.range, (row, col) => {
        const numfmtValue = numfmtService.getValue(unitId, subUnitId, row, col);
        if (!numfmtValue) {
          const cell = target.worksheet.getCellRaw(row, col);
          if (!maxDecimals && cell && cell.t === 2 /* NUMBER */ && cell.v) {
            const regResult = /\.(\d*)$/.exec(String(cell.v));
            if (regResult) {
              const length = regResult[1].length;
              if (!length) {
                return;
              }
              maxDecimals = Math.max(maxDecimals, length);
            }
          }
          return;
        }
        const decimals2 = getDecimalFromPattern(numfmtValue.pattern);
        maxDecimals = decimals2 > maxDecimals ? decimals2 : maxDecimals;
      });
    });
    const decimals = maxDecimals + 1;
    const defaultPattern = setPatternDecimal(`0${decimals > 0 ? ".0" : ""}`, decimals);
    const values = [];
    selections.forEach((selection) => {
      Range.foreach(selection.range, (row, col) => {
        const numfmtValue = numfmtService.getValue(unitId, subUnitId, row, col);
        if (isDefaultFormat(numfmtValue == null ? void 0 : numfmtValue.pattern)) {
          values.push({
            row,
            col,
            pattern: defaultPattern
          });
        } else {
          const decimals2 = getDecimalFromPattern(numfmtValue.pattern);
          const pattern = setPatternDecimal(numfmtValue.pattern, decimals2 + 1);
          pattern !== numfmtValue.pattern && values.push({
            row,
            col,
            pattern
          });
        }
      });
    });
    if (values.length) {
      const result = await commandService.executeCommand(SetNumfmtCommand.id, { values });
      return result;
    }
    return false;
  }
};

// ../packages/sheets-numfmt/src/base/const/currency-symbols.ts
var currencySymbols = [
  "$",
  "\xA3",
  "\xA5",
  "\xA4",
  "\u058F",
  "\u060B",
  "\u09F3",
  "\u0E3F",
  "\u17DB",
  "\u20A1",
  "\u20A6",
  "\u20A9",
  "\u20AA",
  "\u20AB",
  "\u20AC",
  "\u20AD",
  "\u20AE",
  "\u20B1",
  "\u20B2",
  "\u20B4",
  "\u20B8",
  "\u20B9",
  "\u20BA",
  "\u20BC",
  "\u20BD",
  "\u20BE",
  "\u20BF",
  "\uFDFC"
];
var localeCurrencySymbolMap = /* @__PURE__ */ new Map([
  ["enUS" /* EN_US */, "$"],
  ["ruRU" /* RU_RU */, "\u20BD"],
  ["viVN" /* VI_VN */, "\u20AB"],
  ["zhCN" /* ZH_CN */, "\xA5"],
  ["zhTW" /* ZH_TW */, "NT$"],
  ["frFR" /* FR_FR */, "\u20AC"],
  ["faIR" /* FA_IR */, "\uFDFC"],
  ["koKR" /* KO_KR */, "\u20A9"],
  ["esES" /* ES_ES */, "\u20AC"],
  ["caES" /* CA_ES */, "\u20AC"]
]);
function getCurrencySymbolIconByLocale(locale) {
  switch (locale) {
    case "caES" /* CA_ES */:
    case "esES" /* ES_ES */:
    case "frFR" /* FR_FR */:
      return {
        icon: "EuroIcon",
        symbol: localeCurrencySymbolMap.get(locale) || "\u20AC",
        locale
      };
    case "ruRU" /* RU_RU */:
      return {
        icon: "RoubleIcon",
        symbol: localeCurrencySymbolMap.get(locale) || "\u20BD",
        locale
      };
    case "zhCN" /* ZH_CN */:
      return {
        icon: "RmbIcon",
        symbol: localeCurrencySymbolMap.get(locale) || "\xA5",
        locale
      };
    case "enUS" /* EN_US */:
    default:
      return {
        icon: "DollarIcon",
        symbol: "$",
        locale: "enUS" /* EN_US */
      };
  }
}
function getCurrencySymbolByLocale(locale) {
  return localeCurrencySymbolMap.get(locale) || "$";
}
function getCurrencyFormat(locale, numberDigits = 2) {
  let _numberDigits = numberDigits;
  if (numberDigits > 127) {
    _numberDigits = 127;
  }
  let decimal = "";
  if (_numberDigits > 0) {
    decimal = `.${"0".repeat(_numberDigits)}`;
  }
  return `"${getCurrencySymbolByLocale(locale)}"#,##0${decimal}_);[Red]("${getCurrencySymbolByLocale(locale)}"#,##0${decimal})`;
}

// ../packages/sheets-numfmt/src/commands/commands/set-currency.command.ts
var SetCurrencyCommand = {
  id: "sheet.command.numfmt.set.currency",
  type: 0 /* COMMAND */,
  handler: async (accessor) => {
    const commandService = accessor.get(ICommandService);
    const selectionManagerService = accessor.get(SheetsSelectionsService);
    const localeService = accessor.get(LocaleService);
    const selections = selectionManagerService.getCurrentSelections();
    if (!selections || !selections.length) {
      return false;
    }
    const values = [];
    const currencySymbolIcon = getCurrencySymbolIconByLocale(localeService.getCurrentLocale());
    const currencyFormat = getCurrencyFormat(currencySymbolIcon.locale);
    selections.forEach((selection) => {
      Range.foreach(selection.range, (row, col) => {
        values.push({ row, col, pattern: currencyFormat, type: "currency" });
      });
    });
    const result = await commandService.executeCommand(SetNumfmtCommand.id, { values });
    return result;
  }
};

// ../packages/sheets-numfmt/src/commands/commands/set-percent.command.ts
var SetPercentCommand = {
  id: "sheet.command.numfmt.set.percent",
  type: 0 /* COMMAND */,
  handler: async (accessor) => {
    const commandService = accessor.get(ICommandService);
    const selectionManagerService = accessor.get(SheetsSelectionsService);
    const selections = selectionManagerService.getCurrentSelections();
    if (!selections || !selections.length) {
      return false;
    }
    const values = [];
    const suffix = "0%";
    selections.forEach((selection) => {
      Range.foreach(selection.range, (row, col) => {
        values.push({ row, col, pattern: suffix, type: "percent" });
      });
    });
    const result = await commandService.executeCommand(SetNumfmtCommand.id, { values });
    return result;
  }
};

// ../packages/sheets-numfmt/src/commands/commands/subtract-decimal.command.ts
var SubtractDecimalCommand = {
  id: "sheet.command.numfmt.subtract.decimal.command",
  type: 0 /* COMMAND */,
  handler: async (accessor) => {
    const commandService = accessor.get(ICommandService);
    const selectionManagerService = accessor.get(SheetsSelectionsService);
    const numfmtService = accessor.get(INumfmtService);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const selections = selectionManagerService.getCurrentSelections();
    if (!selections || !selections.length) {
      return false;
    }
    const target = getSheetCommandTarget(univerInstanceService);
    if (!target) return false;
    const { unitId, subUnitId } = target;
    let maxDecimals = 0;
    selections.forEach((selection) => {
      Range.foreach(selection.range, (row, col) => {
        const numfmtValue = numfmtService.getValue(unitId, subUnitId, row, col);
        if (!numfmtValue) {
          const cell = target.worksheet.getCellRaw(row, col);
          if (!maxDecimals && cell && cell.t === 2 /* NUMBER */ && cell.v) {
            const regResult = /\.(\d*)$/.exec(String(cell.v));
            if (regResult) {
              const length = regResult[1].length;
              if (!length) {
                return;
              }
              maxDecimals = Math.max(maxDecimals, length);
            }
          }
          return;
        }
        const decimals2 = getDecimalFromPattern(numfmtValue.pattern);
        maxDecimals = decimals2 > maxDecimals ? decimals2 : maxDecimals;
      });
    });
    const decimals = maxDecimals - 1;
    const defaultPattern = setPatternDecimal(`0${decimals > 0 ? ".0" : "."}`, decimals);
    const values = [];
    selections.forEach((selection) => {
      Range.foreach(selection.range, (row, col) => {
        const numfmtValue = numfmtService.getValue(unitId, subUnitId, row, col);
        if (isDefaultFormat(numfmtValue == null ? void 0 : numfmtValue.pattern)) {
          values.push({
            row,
            col,
            pattern: defaultPattern
          });
        } else {
          const decimals2 = getDecimalFromPattern(numfmtValue.pattern);
          values.push({
            row,
            col,
            pattern: setPatternDecimal(numfmtValue.pattern, decimals2 - 1)
          });
        }
      });
    });
    const result = await commandService.executeCommand(SetNumfmtCommand.id, { values });
    return result;
  }
};

// ../packages/sheets-numfmt/src/controllers/config.schema.ts
var SHEETS_NUMFMT_PLUGIN_CONFIG_KEY = "sheets-numfmt.config";
var configSymbol = Symbol(SHEETS_NUMFMT_PLUGIN_CONFIG_KEY);
var defaultPluginConfig = {};

// ../packages/sheets-numfmt/src/utils/pattern.ts
var getPatternType = (pattern) => lib_exports.getFormatInfo(pattern).type || "unknown";
var getPatternPreview = (pattern, value, locale = "en") => {
  try {
    const formatColor = lib_exports.formatColor(pattern, value);
    const color = formatColor ? String(formatColor) : void 0;
    const result = lib_exports.format(pattern, value, { locale, throws: false });
    if (value < 0) {
      return {
        result,
        color
      };
    }
    return {
      result
    };
  } catch (e) {
    console.warn("getPatternPreview error:", pattern, e);
  }
  return {
    result: String(value)
  };
};
var getPatternPreviewIgnoreGeneral = (pattern, value, locale) => {
  if (pattern === DEFAULT_NUMBER_FORMAT) {
    return {
      result: String(stripErrorMargin(value))
      // In Excel, the default General format also needs to handle numeric precision.
    };
  }
  return getPatternPreview(pattern, value, locale);
};

// ../packages/sheets-numfmt/src/controllers/numfmt-cell-content.controller.ts
var TEXT_FORMAT_MARK = {
  tl: {
    size: 6,
    color: "#409f11"
  }
};
var SheetsNumfmtCellContentController = class extends Disposable {
  constructor(_instanceService, _sheetInterceptorService, _themeService, _commandService, _numfmtService, _localeService, _configService) {
    super();
    this._instanceService = _instanceService;
    this._sheetInterceptorService = _sheetInterceptorService;
    this._themeService = _themeService;
    this._commandService = _commandService;
    this._numfmtService = _numfmtService;
    this._localeService = _localeService;
    this._configService = _configService;
    __publicField(this, "_locale$", new BehaviorSubject("en"));
    __publicField(this, "locale$", this._locale$.asObservable());
    this._initInterceptorCellContent();
  }
  get locale() {
    const _locale = this._locale$.getValue();
    if (_locale) {
      return _locale;
    }
    const currentLocale = this._localeService.getCurrentLocale();
    switch (currentLocale) {
      case "frFR" /* FR_FR */:
        return "fr";
      case "ruRU" /* RU_RU */:
        return "ru";
      case "viVN" /* VI_VN */:
        return "vi";
      case "zhCN" /* ZH_CN */:
        return "zh-CN";
      case "koKR" /* KO_KR */:
        return "ko";
      case "zhTW" /* ZH_TW */:
        return "zh-TW";
      case "esES" /* ES_ES */:
      case "caES" /* CA_ES */:
        return "es";
      case "enUS" /* EN_US */:
      case "faIR" /* FA_IR */:
      default: {
        return "en";
      }
    }
  }
  // eslint-disable-next-line max-lines-per-function
  _initInterceptorCellContent() {
    const renderCache = new ObjectMatrix();
    this.disposeWithMe(merge(this._locale$, this._localeService.currentLocale$).subscribe(() => {
      renderCache.reset();
    }));
    this.disposeWithMe(this._sheetInterceptorService.intercept(INTERCEPTOR_POINT.CELL_CONTENT, {
      effect: 2 /* Value */ | 1 /* Style */,
      // eslint-disable-next-line max-lines-per-function, complexity
      handler: (cell, location, next) => {
        var _a, _b;
        if (!cell || cell.v === void 0 || cell.v === null || cell.t === 3 /* BOOLEAN */ || cell.t === 4 /* FORCE_STRING */) {
          return next(cell);
        }
        const unitId = location.unitId;
        const sheetId = location.subUnitId;
        let numfmtValue;
        if (cell == null ? void 0 : cell.s) {
          const style = location.workbook.getStyles().get(cell.s);
          if (style == null ? void 0 : style.n) {
            numfmtValue = style.n;
          }
        }
        if (!numfmtValue) {
          numfmtValue = this._numfmtService.getValue(unitId, sheetId, location.row, location.col);
        }
        if (isDefaultFormat(numfmtValue == null ? void 0 : numfmtValue.pattern)) {
          return next(cell);
        }
        if (cell.t !== 2 /* NUMBER */) {
          const type = checkCellValueType(cell.v, cell.t);
          if (type !== 2 /* NUMBER */) {
            return next(cell);
          }
        }
        const originCellValue = cell;
        if (!cell || cell === location.rawData) {
          cell = { ...location.rawData };
        }
        if (isTextFormat(numfmtValue == null ? void 0 : numfmtValue.pattern)) {
          if ((_a = this._configService.getConfig(SHEETS_NUMFMT_PLUGIN_CONFIG_KEY)) == null ? void 0 : _a.disableTextFormatMark) {
            cell.t = 1 /* STRING */;
            return next(cell);
          }
          cell.t = 1 /* STRING */;
          cell.markers = { ...cell == null ? void 0 : cell.markers, ...TEXT_FORMAT_MARK };
          return next(cell);
        }
        let numfmtRes = "";
        const cache = renderCache.getValue(location.row, location.col);
        if (cache && cache.parameters === `${originCellValue.v}_${numfmtValue == null ? void 0 : numfmtValue.pattern}`) {
          return next({ ...cell, ...cache.result });
        }
        const info = getPatternPreviewIgnoreGeneral(numfmtValue == null ? void 0 : numfmtValue.pattern, Number(originCellValue.v), this.locale);
        numfmtRes = info.result;
        if (!numfmtRes) {
          return next(cell);
        }
        const res = { v: numfmtRes, t: 2 /* NUMBER */ };
        if (info.color) {
          const color = (_b = this._themeService.getColorFromTheme(`${info.color}.500`)) != null ? _b : info.color;
          if (color) {
            res.interceptorStyle = { cl: { rgb: color } };
          }
        }
        renderCache.setValue(location.row, location.col, {
          result: res,
          parameters: `${originCellValue.v}_${numfmtValue == null ? void 0 : numfmtValue.pattern}`
        });
        Object.assign(cell, res);
        return next(cell);
      },
      priority: 10 /* NUMFMT */
    }));
    this.disposeWithMe(this._commandService.onCommandExecuted((commandInfo) => {
      if (commandInfo.id === SetNumfmtMutation.id) {
        const params = commandInfo.params;
        Object.keys(params.values).forEach((key) => {
          const v = params.values[key];
          v.ranges.forEach((range) => {
            Range.foreach(range, (row, col) => {
              renderCache.realDeleteValue(row, col);
            });
          });
        });
      } else if (commandInfo.id === SetRangeValuesMutation.id) {
        const params = commandInfo.params;
        new ObjectMatrix(params.cellValue).forValue((row, col) => {
          renderCache.realDeleteValue(row, col);
        });
      }
    }));
    this.disposeWithMe(
      this._instanceService.getCurrentTypeOfUnit$(O.UNIVER_SHEET).pipe(
        switchMap((workbook) => {
          var _a;
          return (_a = workbook == null ? void 0 : workbook.activeSheet$) != null ? _a : of(null);
        }),
        skip(1)
      ).subscribe(() => renderCache.reset())
    );
  }
  setNumfmtLocal(locale) {
    this._locale$.next(locale);
  }
};
SheetsNumfmtCellContentController = __decorateClass([
  __decorateParam(0, IUniverInstanceService),
  __decorateParam(1, Inject(SheetInterceptorService)),
  __decorateParam(2, Inject(ThemeService)),
  __decorateParam(3, Inject(ICommandService)),
  __decorateParam(4, Inject(INumfmtService)),
  __decorateParam(5, Inject(LocaleService)),
  __decorateParam(6, IConfigService)
], SheetsNumfmtCellContentController);

// ../packages/sheets-numfmt/src/plugin.ts
var UniverSheetsNumfmtPlugin = class extends Plugin {
  constructor(_config = defaultPluginConfig, _injector, _configService, _commandService) {
    super();
    this._config = _config;
    this._injector = _injector;
    this._configService = _configService;
    this._commandService = _commandService;
    const { ...rest } = merge_default(
      {},
      defaultPluginConfig,
      this._config
    );
    this._configService.setConfig(SHEETS_NUMFMT_PLUGIN_CONFIG_KEY, rest);
  }
  onStarting() {
    registerDependencies(this._injector, [
      [SheetsNumfmtCellContentController]
    ]);
    touchDependencies(this._injector, [
      [SheetsNumfmtCellContentController]
    ]);
  }
  onRendered() {
    [
      AddDecimalCommand,
      SubtractDecimalCommand,
      SetCurrencyCommand,
      SetPercentCommand,
      SetNumfmtCommand
    ].forEach((config) => {
      this.disposeWithMe(this._commandService.registerCommand(config));
    });
  }
};
__publicField(UniverSheetsNumfmtPlugin, "pluginName", SHEET_NUMFMT_PLUGIN);
__publicField(UniverSheetsNumfmtPlugin, "type", O.UNIVER_SHEET);
UniverSheetsNumfmtPlugin = __decorateClass([
  DependentOn(UniverSheetsPlugin),
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, IConfigService),
  __decorateParam(3, ICommandService)
], UniverSheetsNumfmtPlugin);

// ../packages/sheets-numfmt/src/base/const/formatdetail.ts
var DATEFMTLISG = [
  {
    label: "1930-08-05",
    suffix: "yyyy-MM-dd"
  },
  {
    label: "1930/08/05",
    suffix: "yyyy/MM/dd"
  },
  {
    label: "1930\u5E7408\u670805\u65E5",
    suffix: 'yyyy"\u5E74"MM"\u6708"dd"\u65E5"'
  },
  {
    label: "08-05",
    suffix: "MM-dd"
  },
  {
    label: "8\u67085\u65E5",
    suffix: 'M"\u6708"d"\u65E5"'
  },
  {
    label: "13:30:30",
    suffix: "h:mm:ss"
  },
  {
    label: "13:30",
    suffix: "h:mm"
  },
  {
    label: "\u4E0B\u534801:30",
    suffix: "A/P hh:mm"
  },
  {
    label: "\u4E0B\u53481:30",
    suffix: "A/P h:mm"
  },
  {
    label: "\u4E0B\u53481:30:30",
    suffix: "A/P h:mm:ss"
  },
  {
    label: "08-05 \u4E0B\u5348 01:30",
    suffix: "MM-dd A/P hh:mm"
  }
];
var NUMBERFORMAT = [
  {
    label: "(1,235)",
    suffix: "#,##0_);(#,##0)"
  },
  {
    label: "(1,235) ",
    suffix: "#,##0_);[Red](#,##0)",
    color: "red"
  },
  {
    label: "1,234.56",
    suffix: "#,##0.00_);#,##0.00"
  },
  {
    label: "1,234.56",
    suffix: "#,##0.00_);[Red]#,##0.00",
    color: "red"
  },
  {
    label: "-1,234.56",
    suffix: "#,##0.00_);-#,##0.00"
  },
  {
    label: "-1,234.56",
    suffix: "#,##0.00_);[Red]-#,##0.00",
    color: "red"
  }
];
var CURRENCYFORMAT = [
  {
    label: (suffix) => `${suffix}1,235`,
    suffix: (suffix) => `"${suffix}"#,##0.00_);"${suffix}"#,##0.00`
  },
  {
    label: (suffix) => `${suffix}1,235`,
    suffix: (suffix) => `"${suffix}"#,##0.00_);[Red]"${suffix}"#,##0.00`,
    color: "red"
  },
  {
    label: (suffix) => `(${suffix}1,235)`,
    suffix: (suffix) => `"${suffix}"#,##0.00_);("${suffix}"#,##0.00)`
  },
  {
    label: (suffix) => `(${suffix}1,235)`,
    suffix: (suffix) => `"${suffix}"#,##0.00_);[Red]("${suffix}"#,##0.00)`,
    color: "red"
  },
  {
    label: (suffix) => `-${suffix}1,235`,
    suffix: (suffix) => `"${suffix}"#,##0.00_);-"${suffix}"#,##0.00`
  },
  {
    label: (suffix) => `-${suffix}1,235`,
    suffix: (suffix) => `"${suffix}"#,##0.00_);[Red]-"${suffix}"#,##0.00`,
    color: "red"
  }
];

// ../packages/sheets-numfmt/src/utils/currency.ts
var getCurrencyType = (pattern) => {
  const item = currencySymbols.find((code) => pattern.includes(code));
  return item;
};

// ../packages/sheets-numfmt/src/utils/options.ts
var getCurrencyFormatOptions = (suffix) => CURRENCYFORMAT.map((item) => ({
  label: item.label(suffix),
  value: item.suffix(suffix),
  color: item.color
}));
var getDateFormatOptions = () => DATEFMTLISG.map((item) => ({ label: item.label, value: item.suffix }));
var getNumberFormatOptions = () => NUMBERFORMAT.map((item) => ({ label: item.label, value: item.suffix, color: item.color }));

export {
  currencySymbols,
  localeCurrencySymbolMap,
  getCurrencySymbolIconByLocale,
  getCurrencySymbolByLocale,
  DATEFMTLISG,
  NUMBERFORMAT,
  CURRENCYFORMAT,
  getDecimalFromPattern,
  setPatternDecimal,
  isPatternHasDecimal,
  SetNumfmtCommand,
  AddDecimalCommand,
  SetCurrencyCommand,
  SetPercentCommand,
  SubtractDecimalCommand,
  SHEETS_NUMFMT_PLUGIN_CONFIG_KEY,
  getPatternType,
  getPatternPreview,
  getPatternPreviewIgnoreGeneral,
  SheetsNumfmtCellContentController,
  UniverSheetsNumfmtPlugin,
  getCurrencyType,
  getCurrencyFormatOptions,
  getDateFormatOptions,
  getNumberFormatOptions
};
//# sourceMappingURL=chunk-GNGDE6PL.js.map
