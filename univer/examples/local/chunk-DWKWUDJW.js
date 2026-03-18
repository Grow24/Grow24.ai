import {
  FormulaEditor,
  RangeSelector
} from "./chunk-ZR7BMKL3.js";
import {
  getPatternType
} from "./chunk-GNGDE6PL.js";
import {
  AddSheetDataValidationCommand,
  BASE_FORMULA_INPUT_NAME,
  CHECKBOX_FORMULA_1,
  CHECKBOX_FORMULA_2,
  CHECKBOX_FORMULA_INPUT_NAME,
  CUSTOM_FORMULA_INPUT_NAME,
  DATA_VALIDATION_PLUGIN_NAME,
  DataValidationCacheService,
  DataValidationFormulaController,
  DataValidationFormulaService,
  DataValidationModel,
  DataValidatorRegistryService,
  LIST_FORMULA_INPUT_NAME,
  RemoveSheetAllDataValidationCommand,
  RemoveSheetDataValidationCommand,
  SheetDataValidationModel,
  SheetsDataValidationValidatorService,
  TWO_FORMULA_OPERATOR_COUNT,
  UniverSheetsDataValidationPlugin,
  UpdateSheetDataValidationOptionsCommand,
  UpdateSheetDataValidationRangeCommand,
  UpdateSheetDataValidationSettingCommand,
  createDefaultNewRule,
  deserializeListOptions,
  getCellValueOrigin,
  getDataValidationCellValue,
  getDataValidationDiffMutations,
  getFormulaResult,
  getRuleOptions,
  getRuleSetting,
  isLegalFormulaResult,
  serializeListOptions,
  transformCheckboxValue
} from "./chunk-ZB3FDSA3.js";
import {
  AutoHeightController,
  CellAlertManagerService,
  HoverManagerService,
  IAutoFillService,
  IEditorBridgeService,
  IMarkSelectionService,
  ISheetCellDropdownManagerService,
  ISheetClipboardService,
  PREDEFINED_HOOK_NAME,
  SetCellEditVisibleOperation,
  SheetSkeletonManagerService,
  getAutoFillRepeatRange,
  getCurrentRangeDisable$,
  getRepeatRange,
  virtualizeDiscreteRanges
} from "./chunk-BGPMR3ZY.js";
import {
  Button,
  Checkbox,
  ComponentManager,
  DataValidationIcon,
  DeleteIcon,
  DraggableList,
  Dropdown,
  FormLayout,
  IDialogService,
  IMenuManagerService,
  ISidebarService,
  IZenZoneService,
  IncreaseIcon,
  Input,
  MoreDownIcon,
  MoreUpIcon,
  Radio,
  RadioGroup,
  Select,
  SequenceIcon,
  borderClassName,
  clsx,
  getMenuHiddenObservable,
  require_jsx_runtime,
  require_react,
  useDependency,
  useEvent,
  useObservable,
  useSidebarClick
} from "./chunk-CSPB4B6P.js";
import {
  INTERCEPTOR_POINT,
  RangeProtectionPermissionEditPoint,
  SetRangeValuesCommand,
  SheetInterceptorService,
  SheetPermissionCheckController,
  SheetsSelectionsService,
  VALIDATE_CELL,
  WorkbookEditablePermission,
  WorksheetEditPermission,
  WorksheetSetCellStylePermission,
  checkRangesEditablePermission,
  deserializeRangeWithSheet,
  getSheetCommandTarget,
  rangeToDiscreteRange,
  serializeRange
} from "./chunk-O5WA5YRR.js";
import {
  CheckboxShape,
  DocSimpleSkeleton,
  FontCache,
  IRenderManagerService,
  Rect,
  Shape,
  Text,
  Transform,
  fixLineWidthByScale,
  getCurrentTypeOfRenderer,
  getFontStyleString
} from "./chunk-I5MCYWYL.js";
import {
  BehaviorSubject,
  ColorKit,
  DEFAULT_STYLES,
  DependentOn,
  Disposable,
  DisposableCollection,
  ICommandService,
  IConfigService,
  IUniverInstanceService,
  Inject,
  Injector,
  LocaleService,
  O,
  ObjectMatrix,
  Optional,
  Plugin,
  Range,
  Rectangle,
  RedoCommand,
  RxDisposable,
  Subject,
  ThemeService,
  UndoCommand,
  bufferDebounceTime,
  bufferTime,
  debounceTime,
  debounce_default,
  distinctUntilChanged,
  filter,
  generateRandomId,
  import_dayjs,
  isFormulaString,
  isUnitRangesEqual,
  lib_exports,
  merge_default,
  of,
  queryObjectMatrix,
  sequenceExecute,
  shallowEqual,
  toDisposable
} from "./chunk-ZRYQFDHJ.js";
import {
  __decorateClass,
  __decorateParam,
  __publicField,
  __toESM
} from "./chunk-NSSCU2QI.js";

// ../packages/sheets-data-validation-ui/src/services/data-validation-panel.service.ts
var DataValidationPanelService = class extends Disposable {
  constructor(_univerInstanceService, _sidebarService) {
    super();
    this._univerInstanceService = _univerInstanceService;
    this._sidebarService = _sidebarService;
    __publicField(this, "_open$", new BehaviorSubject(false));
    __publicField(this, "open$", this._open$.pipe(distinctUntilChanged()));
    __publicField(this, "_activeRule");
    __publicField(this, "_activeRule$", new BehaviorSubject(void 0));
    __publicField(this, "activeRule$", this._activeRule$.asObservable());
    __publicField(this, "_closeDisposable", null);
    this.disposeWithMe(
      this._univerInstanceService.getCurrentTypeOfUnit$(O.UNIVER_SHEET).pipe(filter((sheet) => !sheet)).subscribe(() => {
        this.close();
      })
    );
    this.disposeWithMe(this._sidebarService.sidebarOptions$.subscribe((info) => {
      if (info.id === DATA_VALIDATION_PANEL) {
        if (!info.visible) {
          setTimeout(() => {
            this._sidebarService.sidebarOptions$.next({ visible: false });
          });
        }
      }
    }));
  }
  get activeRule() {
    return this._activeRule;
  }
  get isOpen() {
    return this._open$.getValue();
  }
  dispose() {
    var _a;
    super.dispose();
    this._open$.next(false);
    this._open$.complete();
    this._activeRule$.complete();
    (_a = this._closeDisposable) == null ? void 0 : _a.dispose();
  }
  open() {
    this._open$.next(true);
  }
  close() {
    var _a;
    this._open$.next(false);
    (_a = this._closeDisposable) == null ? void 0 : _a.dispose();
  }
  setCloseDisposable(disposable) {
    this._closeDisposable = toDisposable(() => {
      disposable.dispose();
      this._closeDisposable = null;
    });
  }
  setActiveRule(rule) {
    this._activeRule = rule;
    this._activeRule$.next(rule);
  }
};
DataValidationPanelService = __decorateClass([
  __decorateParam(0, IUniverInstanceService),
  __decorateParam(1, ISidebarService)
], DataValidationPanelService);

// ../packages/sheets-data-validation-ui/src/const.ts
var DROP_DOWN_DEFAULT_COLOR = "#ECECEC";

// ../packages/sheets-data-validation-ui/src/controllers/config.schema.ts
var SHEETS_DATA_VALIDATION_UI_PLUGIN_CONFIG_KEY = "sheets-data-validation-ui.config";
var configSymbol = Symbol(SHEETS_DATA_VALIDATION_UI_PLUGIN_CONFIG_KEY);
var defaultPluginConfig = {};

// ../packages/sheets-data-validation-ui/src/controllers/dv-reject-input.controller.ts
var import_react = __toESM(require_react());
var DataValidationRejectInputController = class extends Disposable {
  constructor(_sheetInterceptorService, _dataValidationModel, _dataValidatorRegistryService, _dialogService, _localeService, _sheetsDataValidationValidatorService) {
    super();
    this._sheetInterceptorService = _sheetInterceptorService;
    this._dataValidationModel = _dataValidationModel;
    this._dataValidatorRegistryService = _dataValidatorRegistryService;
    this._dialogService = _dialogService;
    this._localeService = _localeService;
    this._sheetsDataValidationValidatorService = _sheetsDataValidationValidatorService;
    this._initEditorBridgeInterceptor();
  }
  _initEditorBridgeInterceptor() {
    this.disposeWithMe(this._sheetInterceptorService.writeCellInterceptor.intercept(
      VALIDATE_CELL,
      {
        handler: async (lastResult, context, next) => {
          const cell = await lastResult;
          const { row, col, unitId, subUnitId } = context;
          const ruleId = this._dataValidationModel.getRuleIdByLocation(unitId, subUnitId, row, col);
          const rule = ruleId ? this._dataValidationModel.getRuleById(unitId, subUnitId, ruleId) : void 0;
          if (cell === false) {
            return next(Promise.resolve(false));
          }
          if (!rule || rule.errorStyle !== 1 /* STOP */) {
            return next(Promise.resolve(true));
          }
          const validator = this._dataValidatorRegistryService.getValidatorItem(rule.type);
          if (!validator) {
            return next(Promise.resolve(true));
          }
          const res = await this._sheetsDataValidationValidatorService.validatorCell(unitId, subUnitId, row, col);
          if (res === "valid" /* VALID */) {
            return next(Promise.resolve(true));
          }
          this._dialogService.open({
            width: 368,
            title: {
              title: this._localeService.t("dataValidation.alert.title")
            },
            id: "reject-input-dialog",
            children: {
              title: validator.getRuleFinalError(rule, { row, col, unitId, subUnitId })
            },
            footer: {
              title: (0, import_react.createElement)(
                Button,
                {
                  variant: "primary",
                  onClick: () => this._dialogService.close("reject-input-dialog")
                },
                this._localeService.t("dataValidation.alert.ok")
              )
            },
            onClose: () => {
              this._dialogService.close("reject-input-dialog");
            }
          });
          return next(Promise.resolve(false));
        }
      }
    ));
  }
  showReject(title) {
    this._dialogService.open({
      width: 368,
      title: {
        title: this._localeService.t("dataValidation.alert.title")
      },
      id: "reject-input-dialog",
      children: {
        title
      },
      footer: {
        title: (0, import_react.createElement)(
          Button,
          {
            variant: "primary",
            onClick: () => this._dialogService.close("reject-input-dialog")
          },
          this._localeService.t("dataValidation.alert.ok")
        )
      },
      onClose: () => {
        this._dialogService.close("reject-input-dialog");
      }
    });
  }
};
DataValidationRejectInputController = __decorateClass([
  __decorateParam(0, Inject(SheetInterceptorService)),
  __decorateParam(1, Inject(SheetDataValidationModel)),
  __decorateParam(2, Inject(DataValidatorRegistryService)),
  __decorateParam(3, IDialogService),
  __decorateParam(4, Inject(LocaleService)),
  __decorateParam(5, Inject(SheetsDataValidationValidatorService))
], DataValidationRejectInputController);

// ../packages/sheets-data-validation-ui/src/services/dropdown-manager.service.ts
var transformDate = (value) => {
  if (value === void 0 || value === null || typeof value === "boolean") {
    return void 0;
  }
  if (value === "") return (0, import_dayjs.default)();
  if (typeof value === "number" || !Number.isNaN(+value)) {
    return (0, import_dayjs.default)(lib_exports.format("yyyy-MM-dd HH:mm:ss", Number(value)));
  }
  const date = (0, import_dayjs.default)(value);
  if (date.isValid()) {
    return date;
  }
  return void 0;
};
function getDefaultFormat(patternType, format) {
  const originPartternType = getPatternType(format);
  if (patternType === originPartternType) {
    return format;
  }
  switch (patternType) {
    case "datetime":
      return "yyyy-MM-dd hh:mm:ss";
    case "date":
      return "yyyy-MM-dd";
    case "time":
      return "HH:mm:ss";
  }
}
var DataValidationDropdownManagerService = class extends Disposable {
  constructor(_univerInstanceService, _dataValidatorRegistryService, _zenZoneService, _dataValidationModel, _sheetsSelectionsService, _cellDropdownManagerService, _sheetDataValidationModel, _commandService, _editorBridgeService, _injector, _configService) {
    super();
    this._univerInstanceService = _univerInstanceService;
    this._dataValidatorRegistryService = _dataValidatorRegistryService;
    this._zenZoneService = _zenZoneService;
    this._dataValidationModel = _dataValidationModel;
    this._sheetsSelectionsService = _sheetsSelectionsService;
    this._cellDropdownManagerService = _cellDropdownManagerService;
    this._sheetDataValidationModel = _sheetDataValidationModel;
    this._commandService = _commandService;
    this._editorBridgeService = _editorBridgeService;
    this._injector = _injector;
    this._configService = _configService;
    __publicField(this, "_activeDropdown");
    __publicField(this, "_activeDropdown$", new Subject());
    __publicField(this, "_currentPopup", null);
    __publicField(this, "activeDropdown$", this._activeDropdown$.asObservable());
    __publicField(this, "_zenVisible", false);
    this._init();
    this._initSelectionChange();
    this.disposeWithMe(() => {
      this._activeDropdown$.complete();
    });
  }
  get activeDropdown() {
    return this._activeDropdown;
  }
  _init() {
    this.disposeWithMe(this._zenZoneService.visible$.subscribe((visible) => {
      this._zenVisible = visible;
      if (visible) {
        this.hideDropdown();
      }
    }));
  }
  _getDropdownByCell(unitId, subUnitId, row, col) {
    const workbook = unitId ? this._univerInstanceService.getUnit(unitId, O.UNIVER_SHEET) : this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET);
    if (!workbook) {
      return;
    }
    const worksheet = subUnitId ? workbook.getSheetBySheetId(subUnitId) : workbook.getActiveSheet();
    if (!worksheet) {
      return;
    }
    const rule = this._dataValidationModel.getRuleByLocation(workbook.getUnitId(), worksheet.getSheetId(), row, col);
    if (!rule) {
      return;
    }
    const validator = this._dataValidatorRegistryService.getValidatorItem(rule.type);
    return validator == null ? void 0 : validator.dropdownType;
  }
  _initSelectionChange() {
    this.disposeWithMe(this._sheetsSelectionsService.selectionMoveEnd$.subscribe((selections) => {
      if (selections && selections.every((selection) => !(selection.primary && this._getDropdownByCell(selection.primary.unitId, selection.primary.sheetId, selection.primary.actualRow, selection.primary.actualColumn)))) {
        this.hideDropdown();
      }
    }));
  }
  // eslint-disable-next-line max-lines-per-function, complexity
  showDropdown(param) {
    var _a, _b, _c, _d;
    const { location } = param;
    const { row, col, unitId, subUnitId, workbook, worksheet } = location;
    if (this._currentPopup) {
      this._currentPopup.dispose();
    }
    ;
    if (this._zenVisible) {
      return;
    }
    this._activeDropdown = param;
    this._activeDropdown$.next(this._activeDropdown);
    const rule = this._sheetDataValidationModel.getRuleByLocation(unitId, subUnitId, row, col);
    if (!rule) {
      return;
    }
    const validator = this._dataValidatorRegistryService.getValidatorItem(rule.type);
    if (!(validator == null ? void 0 : validator.dropdownType)) {
      return;
    }
    let popupDisposable;
    const handleSave = async (date, targetPatternType) => {
      var _a2, _b2, _c2;
      if (!date) {
        return true;
      }
      const newValue = date;
      const cellData = worksheet.getCell(row, col);
      const dateStr = newValue.format(targetPatternType === "date" ? "YYYY-MM-DD 00:00:00" : "YYYY-MM-DD HH:mm:ss");
      const serialNum = (_a2 = lib_exports.parseDate(dateStr)) == null ? void 0 : _a2.v;
      const serialTime = targetPatternType === "time" ? serialNum % 1 : serialNum;
      const cellStyle = workbook.getStyles().getStyleByCell(cellData);
      const format = (_c2 = (_b2 = cellStyle == null ? void 0 : cellStyle.n) == null ? void 0 : _b2.pattern) != null ? _c2 : "";
      if (rule.errorStyle !== 1 /* STOP */ || await validator.validator({
        value: serialTime,
        unitId,
        subUnitId,
        row,
        column: col,
        worksheet,
        workbook,
        interceptValue: dateStr.replace("Z", "").replace("T", " "),
        t: 2 /* NUMBER */
      }, rule)) {
        await this._commandService.executeCommand(SetRangeValuesCommand.id, {
          unitId,
          subUnitId,
          range: {
            startColumn: col,
            endColumn: col,
            startRow: row,
            endRow: row
          },
          value: {
            v: serialTime,
            t: 2,
            p: null,
            f: null,
            si: null,
            s: {
              n: {
                pattern: getDefaultFormat(targetPatternType, format)
              }
            }
          }
        });
        await this._commandService.executeCommand(SetCellEditVisibleOperation.id, {
          visible: false,
          eventType: 4 /* Keyboard */,
          unitId,
          keycode: 27 /* ESC */
        });
        return true;
      } else {
        if (this._injector.has(DataValidationRejectInputController)) {
          const rejectInputController = this._injector.get(DataValidationRejectInputController);
          rejectInputController.showReject(validator.getRuleFinalError(rule, { row, col, unitId, subUnitId }));
        }
        return false;
      }
    };
    let dropdownParam;
    switch (validator.dropdownType) {
      case "date" /* DATE */: {
        const cellStr = getCellValueOrigin(worksheet.getCellRaw(row, col));
        const originDate = transformDate(cellStr);
        const showTime = Boolean((_a = rule.bizInfo) == null ? void 0 : _a.showTime);
        dropdownParam = {
          location,
          type: "datepicker",
          props: {
            showTime,
            onChange: (newValue) => handleSave(newValue, showTime ? "datetime" : "date"),
            defaultValue: originDate,
            patternType: "date"
          }
        };
        break;
      }
      case "time" /* TIME */: {
        const cellStr = getCellValueOrigin(worksheet.getCellRaw(row, col));
        const originDate = transformDate(cellStr);
        dropdownParam = {
          location,
          type: "datepicker",
          props: {
            onChange: (newValue) => handleSave(newValue, "time"),
            defaultValue: originDate,
            patternType: "time"
          }
        };
        break;
      }
      case "datetime" /* DATETIME */: {
        const cellStr = getCellValueOrigin(worksheet.getCellRaw(row, col));
        const originDate = transformDate(cellStr);
        dropdownParam = {
          location,
          type: "datepicker",
          props: {
            onChange: (newValue) => handleSave(newValue, "datetime"),
            defaultValue: originDate,
            patternType: "datetime"
          }
        };
        break;
      }
      case "list" /* LIST */:
      case "multipleList" /* MULTIPLE_LIST */: {
        const multiple = validator.dropdownType === "multipleList" /* MULTIPLE_LIST */;
        const handleSave2 = async (newValue) => {
          const str = serializeListOptions(newValue);
          const params = {
            unitId,
            subUnitId,
            range: {
              startColumn: col,
              endColumn: col,
              startRow: row,
              endRow: row
            },
            value: {
              v: str,
              p: null,
              f: null,
              si: null
            }
          };
          this._commandService.executeCommand(SetRangeValuesCommand.id, params);
          if (this._editorBridgeService.isVisible().visible) {
            await this._commandService.executeCommand(SetCellEditVisibleOperation.id, {
              visible: false,
              eventType: 4 /* Keyboard */,
              unitId,
              keycode: 27 /* ESC */
            });
          }
          if (multiple) {
            return false;
          }
          return true;
        };
        const showColor = (rule == null ? void 0 : rule.renderMode) === 2 /* CUSTOM */ || (rule == null ? void 0 : rule.renderMode) === void 0;
        const list = validator.getListWithColor(rule, unitId, subUnitId);
        const cellStr = getDataValidationCellValue(worksheet.getCellRaw(row, col));
        const handleEdit = () => {
          this._commandService.executeCommand(OpenValidationPanelOperation.id, {
            ruleId: rule.uid
          });
          popupDisposable == null ? void 0 : popupDisposable.dispose();
        };
        const options = list.map((item) => ({
          label: item.label,
          value: item.label,
          color: showColor || item.color ? item.color || DROP_DOWN_DEFAULT_COLOR : "transparent"
        }));
        dropdownParam = {
          location,
          type: "list",
          props: {
            onChange: (newValue) => handleSave2(newValue),
            options,
            onEdit: handleEdit,
            defaultValue: cellStr,
            multiple,
            showEdit: (_c = (_b = this._configService.getConfig(SHEETS_DATA_VALIDATION_UI_PLUGIN_CONFIG_KEY)) == null ? void 0 : _b.showEditOnDropdown) != null ? _c : true
          }
        };
        break;
      }
      case "cascade" /* CASCADE */: {
        const handleSave2 = (newValue) => {
          const params = {
            unitId,
            subUnitId,
            range: {
              startColumn: col,
              endColumn: col,
              startRow: row,
              endRow: row
            },
            value: {
              v: newValue.join("/"),
              p: null,
              f: null,
              si: null
            }
          };
          this._commandService.syncExecuteCommand(SetRangeValuesCommand.id, params);
          if (this._editorBridgeService.isVisible().visible) {
            this._commandService.syncExecuteCommand(SetCellEditVisibleOperation.id, {
              visible: false,
              eventType: 4 /* Keyboard */,
              unitId,
              keycode: 27 /* ESC */
            });
          }
          return true;
        };
        dropdownParam = {
          type: "cascader",
          props: {
            onChange: handleSave2,
            defaultValue: getDataValidationCellValue(worksheet.getCellRaw(row, col)).split("/"),
            options: JSON.parse((_d = rule.formula1) != null ? _d : "[]")
          },
          location
        };
        break;
      }
      case "color" /* COLOR */: {
        const handleSave2 = (newValue) => {
          const params = {
            unitId,
            subUnitId,
            range: {
              startColumn: col,
              endColumn: col,
              startRow: row,
              endRow: row
            },
            value: {
              v: newValue,
              p: null,
              f: null,
              si: null
            }
          };
          this._commandService.syncExecuteCommand(SetRangeValuesCommand.id, params);
          if (this._editorBridgeService.isVisible().visible) {
            this._commandService.syncExecuteCommand(SetCellEditVisibleOperation.id, {
              visible: false,
              eventType: 4 /* Keyboard */,
              unitId,
              keycode: 27 /* ESC */
            });
          }
          return true;
        };
        dropdownParam = {
          type: "color",
          props: {
            onChange: handleSave2,
            defaultValue: getDataValidationCellValue(worksheet.getCellRaw(row, col))
          },
          location
        };
        break;
      }
      default:
        throw new Error("[DataValidationDropdownManagerService]: unknown type!");
    }
    popupDisposable = this._cellDropdownManagerService.showDropdown({
      ...dropdownParam,
      onHide: () => {
        this._activeDropdown = null;
        this._activeDropdown$.next(null);
      }
    });
    if (!popupDisposable) {
      throw new Error("[DataValidationDropdownManagerService]: cannot show dropdown!");
    }
    const disposableCollection = new DisposableCollection();
    disposableCollection.add(popupDisposable);
    disposableCollection.add({
      dispose: () => {
        var _a2, _b2;
        (_b2 = (_a2 = this._activeDropdown) == null ? void 0 : _a2.onHide) == null ? void 0 : _b2.call(_a2);
      }
    });
    this._currentPopup = disposableCollection;
  }
  hideDropdown() {
    if (!this._activeDropdown) {
      return;
    }
    this._currentPopup && this._currentPopup.dispose();
    this._currentPopup = null;
    this._activeDropdown = null;
    this._activeDropdown$.next(null);
  }
  showDataValidationDropdown(unitId, subUnitId, row, col, onHide) {
    const workbook = this._univerInstanceService.getUnit(unitId, O.UNIVER_SHEET);
    if (!workbook) {
      return;
    }
    const worksheet = workbook.getSheetBySheetId(subUnitId);
    if (!worksheet) {
      return;
    }
    const rule = this._dataValidationModel.getRuleByLocation(workbook.getUnitId(), worksheet.getSheetId(), row, col);
    if (!rule) {
      return;
    }
    const validator = this._dataValidatorRegistryService.getValidatorItem(rule.type);
    if (!validator || !validator.dropdownType) {
      this.hideDropdown();
      return;
    }
    this.showDropdown({
      location: {
        workbook,
        worksheet,
        row,
        col,
        unitId,
        subUnitId
      },
      onHide
    });
  }
};
DataValidationDropdownManagerService = __decorateClass([
  __decorateParam(0, IUniverInstanceService),
  __decorateParam(1, Inject(DataValidatorRegistryService)),
  __decorateParam(2, IZenZoneService),
  __decorateParam(3, Inject(SheetDataValidationModel)),
  __decorateParam(4, Inject(SheetsSelectionsService)),
  __decorateParam(5, Inject(ISheetCellDropdownManagerService)),
  __decorateParam(6, Inject(SheetDataValidationModel)),
  __decorateParam(7, ICommandService),
  __decorateParam(8, IEditorBridgeService),
  __decorateParam(9, Inject(Injector)),
  __decorateParam(10, IConfigService)
], DataValidationDropdownManagerService);

// ../packages/sheets-data-validation-ui/src/commands/operations/data-validation.operation.ts
var DATA_VALIDATION_PANEL = "DataValidationPanel";
var OpenValidationPanelOperation = {
  id: "data-validation.operation.open-validation-panel",
  type: 1 /* OPERATION */,
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { ruleId, isAdd } = params;
    const dataValidationPanelService = accessor.get(DataValidationPanelService);
    const dataValidationModel = accessor.get(DataValidationModel);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const sidebarService = accessor.get(ISidebarService);
    const target = getSheetCommandTarget(univerInstanceService);
    if (!target) return false;
    const { unitId, subUnitId } = target;
    const rule = ruleId ? dataValidationModel.getRuleById(unitId, subUnitId, ruleId) : void 0;
    dataValidationPanelService.open();
    dataValidationPanelService.setActiveRule(rule && {
      unitId,
      subUnitId,
      rule
    });
    const disposable = sidebarService.open({
      id: DATA_VALIDATION_PANEL,
      header: { title: isAdd ? "dataValidation.panel.addTitle" : "dataValidation.panel.title" },
      children: { label: DATA_VALIDATION_PANEL },
      width: 312,
      onClose: () => dataValidationPanelService.close()
    });
    dataValidationPanelService.setCloseDisposable(disposable);
    return true;
  }
};
var CloseValidationPanelOperation = {
  id: "data-validation.operation.close-validation-panel",
  type: 1 /* OPERATION */,
  handler(accessor) {
    const dataValidationPanelService = accessor.get(DataValidationPanelService);
    dataValidationPanelService.close();
    return true;
  }
};
var ToggleValidationPanelOperation = {
  id: "data-validation.operation.toggle-validation-panel",
  type: 1 /* OPERATION */,
  handler(accessor) {
    const commandService = accessor.get(ICommandService);
    const dataValidationPanelService = accessor.get(DataValidationPanelService);
    dataValidationPanelService.open();
    const isOpen = dataValidationPanelService.isOpen;
    if (isOpen) {
      commandService.executeCommand(CloseValidationPanelOperation.id);
    } else {
      commandService.executeCommand(OpenValidationPanelOperation.id);
    }
    return true;
  }
};
var ShowDataValidationDropdown = {
  type: 1 /* OPERATION */,
  id: "sheet.operation.show-data-validation-dropdown",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const dataValidationDropdownManagerService = accessor.get(DataValidationDropdownManagerService);
    const { unitId, subUnitId, row, column } = params;
    const activeDropdown = dataValidationDropdownManagerService.activeDropdown;
    const currLoc = activeDropdown == null ? void 0 : activeDropdown.location;
    if (currLoc && currLoc.unitId === unitId && currLoc.subUnitId === subUnitId && currLoc.row === row && currLoc.col === column) {
      return true;
    }
    dataValidationDropdownManagerService.showDataValidationDropdown(
      unitId,
      subUnitId,
      row,
      column
    );
    return true;
  }
};
var HideDataValidationDropdown = {
  type: 1 /* OPERATION */,
  id: "sheet.operation.hide-data-validation-dropdown",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const dataValidationDropdownManagerService = accessor.get(DataValidationDropdownManagerService);
    dataValidationDropdownManagerService.hideDropdown();
    return true;
  }
};

// ../packages/sheets-data-validation-ui/src/commands/commands/data-validation-ui.command.ts
var AddSheetDataValidationAndOpenCommand = {
  type: 0 /* COMMAND */,
  id: "data-validation.command.addRuleAndOpen",
  handler(accessor) {
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const target = getSheetCommandTarget(univerInstanceService);
    if (!target) return false;
    const { workbook, worksheet } = target;
    const rule = createDefaultNewRule(accessor);
    const commandService = accessor.get(ICommandService);
    const unitId = workbook.getUnitId();
    const subUnitId = worksheet.getSheetId();
    const addParams = {
      rule,
      unitId,
      subUnitId
    };
    const res = commandService.syncExecuteCommand(AddSheetDataValidationCommand.id, addParams);
    if (res) {
      commandService.syncExecuteCommand(OpenValidationPanelOperation.id, {
        ruleId: rule.uid,
        isAdd: true
      });
      return true;
    }
    return false;
  }
};

// ../packages/sheets-data-validation-ui/src/controllers/dv-alert.controller.ts
var ALERT_KEY = "SHEET_DATA_VALIDATION_ALERT";
var DataValidationAlertController = class extends Disposable {
  constructor(_hoverManagerService, _cellAlertManagerService, _univerInstanceService, _localeService, _zenZoneService, _dataValidationModel) {
    super();
    this._hoverManagerService = _hoverManagerService;
    this._cellAlertManagerService = _cellAlertManagerService;
    this._univerInstanceService = _univerInstanceService;
    this._localeService = _localeService;
    this._zenZoneService = _zenZoneService;
    this._dataValidationModel = _dataValidationModel;
    this._init();
  }
  _init() {
    this._initCellAlertPopup();
    this._initZenService();
  }
  _initCellAlertPopup() {
    this.disposeWithMe(this._hoverManagerService.currentCell$.pipe(debounceTime(100)).subscribe((cellPos) => {
      var _a;
      if (cellPos) {
        const workbook = this._univerInstanceService.getUnit(cellPos.location.unitId, O.UNIVER_SHEET);
        const worksheet = workbook.getSheetBySheetId(cellPos.location.subUnitId);
        if (!worksheet) return;
        const rule = this._dataValidationModel.getRuleByLocation(cellPos.location.unitId, cellPos.location.subUnitId, cellPos.location.row, cellPos.location.col);
        if (!rule) {
          this._cellAlertManagerService.removeAlert(ALERT_KEY);
          return;
        }
        const validStatus = this._dataValidationModel.validator(rule, { ...cellPos.location, workbook, worksheet });
        if (validStatus === "invalid" /* INVALID */) {
          const currentAlert = this._cellAlertManagerService.currentAlert.get(ALERT_KEY);
          const currentLoc = (_a = currentAlert == null ? void 0 : currentAlert.alert) == null ? void 0 : _a.location;
          if (currentLoc && currentLoc.row === cellPos.location.row && currentLoc.col === cellPos.location.col && currentLoc.subUnitId === cellPos.location.subUnitId && currentLoc.unitId === cellPos.location.unitId) {
            this._cellAlertManagerService.removeAlert(ALERT_KEY);
            return;
          }
          const validator = this._dataValidationModel.getValidator(rule.type);
          if (!validator) {
            this._cellAlertManagerService.removeAlert(ALERT_KEY);
            return;
          }
          this._cellAlertManagerService.showAlert({
            type: 2 /* ERROR */,
            title: this._localeService.t("dataValidation.error.title"),
            message: validator == null ? void 0 : validator.getRuleFinalError(rule, cellPos.location),
            location: cellPos.location,
            width: 200,
            height: 74,
            key: ALERT_KEY
          });
          return;
        }
      }
      this._cellAlertManagerService.removeAlert(ALERT_KEY);
    }));
  }
  _initZenService() {
    this.disposeWithMe(this._zenZoneService.visible$.subscribe((visible) => {
      if (visible) {
        this._cellAlertManagerService.removeAlert(ALERT_KEY);
      }
    }));
  }
};
DataValidationAlertController = __decorateClass([
  __decorateParam(0, Inject(HoverManagerService)),
  __decorateParam(1, Inject(CellAlertManagerService)),
  __decorateParam(2, IUniverInstanceService),
  __decorateParam(3, Inject(LocaleService)),
  __decorateParam(4, IZenZoneService),
  __decorateParam(5, Inject(SheetDataValidationModel))
], DataValidationAlertController);

// ../packages/sheets-data-validation-ui/src/controllers/dv-auto-fill.controller.ts
var DataValidationAutoFillController = class extends Disposable {
  constructor(_autoFillService, _sheetDataValidationModel, _injector) {
    super();
    this._autoFillService = _autoFillService;
    this._sheetDataValidationModel = _sheetDataValidationModel;
    this._injector = _injector;
    this._initAutoFill();
  }
  // eslint-disable-next-line max-lines-per-function
  _initAutoFill() {
    const noopReturnFunc = () => ({ redos: [], undos: [] });
    const generalApplyFunc = (location, applyType) => {
      const { source: sourceRange, target: targetRange, unitId, subUnitId } = location;
      const ruleMatrixCopy = this._sheetDataValidationModel.getRuleObjectMatrix(unitId, subUnitId).clone();
      const virtualRange = virtualizeDiscreteRanges([sourceRange, targetRange]);
      const [vSourceRange, vTargetRange] = virtualRange.ranges;
      const { mapFunc } = virtualRange;
      const sourceStartCell = {
        row: vSourceRange.startRow,
        col: vSourceRange.startColumn
      };
      const repeats = getAutoFillRepeatRange(vSourceRange, vTargetRange);
      const additionMatrix = new ObjectMatrix();
      const additionRules = /* @__PURE__ */ new Set();
      repeats.forEach((repeat) => {
        const targetStartCell = repeat.repeatStartCell;
        const relativeRange = repeat.relativeRange;
        const sourceRange2 = {
          startRow: sourceStartCell.row,
          startColumn: sourceStartCell.col,
          endColumn: sourceStartCell.col,
          endRow: sourceStartCell.row
        };
        const targetRange2 = {
          startRow: targetStartCell.row,
          startColumn: targetStartCell.col,
          endColumn: targetStartCell.col,
          endRow: targetStartCell.row
        };
        Range.foreach(relativeRange, (row, col) => {
          const sourcePositionRange = Rectangle.getPositionRange(
            {
              startRow: row,
              startColumn: col,
              endColumn: col,
              endRow: row
            },
            sourceRange2
          );
          const { row: sourceRow, col: sourceCol } = mapFunc(sourcePositionRange.startRow, sourcePositionRange.startColumn);
          const ruleId = this._sheetDataValidationModel.getRuleIdByLocation(unitId, subUnitId, sourceRow, sourceCol) || "";
          const targetPositionRange = Rectangle.getPositionRange(
            {
              startRow: row,
              startColumn: col,
              endColumn: col,
              endRow: row
            },
            targetRange2
          );
          const { row: targetRow, col: targetCol } = mapFunc(targetPositionRange.startRow, targetPositionRange.startColumn);
          additionMatrix.setValue(targetRow, targetCol, ruleId);
          additionRules.add(ruleId);
        });
      });
      const additions = Array.from(additionRules).map((id) => ({ id, ranges: queryObjectMatrix(additionMatrix, (value) => value === id) }));
      ruleMatrixCopy.addRangeRules(additions);
      const diffs = ruleMatrixCopy.diff(this._sheetDataValidationModel.getRules(unitId, subUnitId));
      const { redoMutations, undoMutations } = getDataValidationDiffMutations(unitId, subUnitId, diffs, this._injector, "patched", applyType === "ONLY_FORMAT" /* ONLY_FORMAT */);
      return {
        undos: undoMutations,
        redos: redoMutations
      };
    };
    const hook = {
      id: DATA_VALIDATION_PLUGIN_NAME,
      onBeforeFillData: (location) => {
        const { source: sourceRange, unitId, subUnitId } = location;
        for (const row of sourceRange.rows) {
          for (const col of sourceRange.cols) {
            const dv = this._sheetDataValidationModel.getRuleByLocation(unitId, subUnitId, row, col);
            if (dv && dv.type === "checkbox" /* CHECKBOX */) {
              this._autoFillService.setDisableApplyType("SERIES" /* SERIES */, true);
              return;
            }
          }
        }
      },
      onFillData: (location, direction, applyType) => {
        if (applyType === "COPY" /* COPY */ || applyType === "ONLY_FORMAT" /* ONLY_FORMAT */ || applyType === "SERIES" /* SERIES */) {
          return generalApplyFunc(location, applyType);
        }
        return noopReturnFunc();
      },
      onAfterFillData: () => {
      }
    };
    this.disposeWithMe(this._autoFillService.addHook(hook));
  }
};
DataValidationAutoFillController = __decorateClass([
  __decorateParam(0, IAutoFillService),
  __decorateParam(1, Inject(SheetDataValidationModel)),
  __decorateParam(2, Inject(Injector))
], DataValidationAutoFillController);

// ../packages/sheets-data-validation-ui/src/controllers/dv-copy-paste.controller.ts
var DataValidationCopyPasteController = class extends Disposable {
  constructor(_sheetClipboardService, _sheetDataValidationModel, _injector) {
    super();
    this._sheetClipboardService = _sheetClipboardService;
    this._sheetDataValidationModel = _sheetDataValidationModel;
    this._injector = _injector;
    __publicField(this, "_copyInfo");
    this._initCopyPaste();
  }
  _initCopyPaste() {
    this._sheetClipboardService.addClipboardHook({
      id: DATA_VALIDATION_PLUGIN_NAME,
      onBeforeCopy: (unitId, subUnitId, range) => this._collect(unitId, subUnitId, range),
      onPasteCells: (pasteFrom, pasteTo, data, payload) => {
        const { copyType = "COPY" /* COPY */, pasteType } = payload;
        const { range: copyRange } = pasteFrom || {};
        const { range: pastedRange, unitId, subUnitId } = pasteTo;
        return this._generateMutations(pastedRange, { copyType, pasteType, copyRange, unitId, subUnitId });
      }
    });
  }
  _collect(unitId, subUnitId, range) {
    const matrix = new ObjectMatrix();
    this._copyInfo = {
      unitId,
      subUnitId,
      matrix
    };
    const discreteRange = this._injector.invoke((accessor) => {
      return rangeToDiscreteRange(range, accessor, unitId, subUnitId);
    });
    if (!discreteRange) {
      return;
    }
    const { rows, cols } = discreteRange;
    rows.forEach((row, rowIndex) => {
      cols.forEach((col, colIndex) => {
        const ruleId = this._sheetDataValidationModel.getRuleIdByLocation(unitId, subUnitId, row, col);
        matrix.setValue(rowIndex, colIndex, ruleId != null ? ruleId : "");
      });
    });
  }
  // eslint-disable-next-line max-lines-per-function
  _generateMutations(pastedRange, copyInfo) {
    if (!this._copyInfo) {
      return { redos: [], undos: [] };
    }
    if (copyInfo.copyType === "CUT" /* CUT */) {
      this._copyInfo = null;
      return { redos: [], undos: [] };
    }
    if (!this._copyInfo || !this._copyInfo.matrix.getSizeOf() || !copyInfo.copyRange) {
      return { redos: [], undos: [] };
    }
    const specialPastes = [
      PREDEFINED_HOOK_NAME.SPECIAL_PASTE_COL_WIDTH,
      PREDEFINED_HOOK_NAME.SPECIAL_PASTE_VALUE,
      PREDEFINED_HOOK_NAME.SPECIAL_PASTE_FORMAT,
      PREDEFINED_HOOK_NAME.SPECIAL_PASTE_FORMULA
    ];
    if (specialPastes.includes(copyInfo.pasteType)) {
      return { redos: [], undos: [] };
    }
    const { unitId, subUnitId } = this._copyInfo;
    if (copyInfo.unitId !== unitId || subUnitId !== copyInfo.subUnitId) {
      const ruleMatrix = this._sheetDataValidationModel.getRuleObjectMatrix(copyInfo.unitId, copyInfo.subUnitId).clone();
      const additionMatrix = new ObjectMatrix();
      const addRules = /* @__PURE__ */ new Set();
      const { ranges: [vCopyRange, vPastedRange], mapFunc } = virtualizeDiscreteRanges([copyInfo.copyRange, pastedRange]);
      const repeatRange = getRepeatRange(vCopyRange, vPastedRange, true);
      const additionRules = /* @__PURE__ */ new Map();
      repeatRange.forEach(({ startRange }) => {
        var _a;
        (_a = this._copyInfo) == null ? void 0 : _a.matrix.forValue((row, col, ruleId) => {
          const range = Rectangle.getPositionRange(
            {
              startRow: row,
              endRow: row,
              startColumn: col,
              endColumn: col
            },
            startRange
          );
          const transformedRuleId = `${subUnitId}-${ruleId}`;
          const oldRule = this._sheetDataValidationModel.getRuleById(unitId, subUnitId, ruleId);
          if (!this._sheetDataValidationModel.getRuleById(copyInfo.unitId, copyInfo.subUnitId, transformedRuleId) && oldRule) {
            additionRules.set(transformedRuleId, { ...oldRule, uid: transformedRuleId });
          }
          const { row: startRow, col: startColumn } = mapFunc(range.startRow, range.startColumn);
          addRules.add(transformedRuleId);
          additionMatrix.setValue(startRow, startColumn, transformedRuleId);
        });
      });
      const additions = Array.from(addRules).map((id) => ({ id, ranges: queryObjectMatrix(additionMatrix, (value) => value === id) }));
      ruleMatrix.addRangeRules(additions);
      const { redoMutations, undoMutations } = getDataValidationDiffMutations(
        copyInfo.unitId,
        copyInfo.subUnitId,
        ruleMatrix.diffWithAddition(this._sheetDataValidationModel.getRules(copyInfo.unitId, copyInfo.subUnitId), additionRules.values()),
        this._injector,
        "patched",
        false
      );
      return {
        redos: redoMutations,
        undos: undoMutations
      };
    } else {
      const ruleMatrix = this._sheetDataValidationModel.getRuleObjectMatrix(unitId, subUnitId).clone();
      const additionMatrix = new ObjectMatrix();
      const additionRules = /* @__PURE__ */ new Set();
      const { ranges: [vCopyRange, vPastedRange], mapFunc } = virtualizeDiscreteRanges([copyInfo.copyRange, pastedRange]);
      const repeatRange = getRepeatRange(vCopyRange, vPastedRange, true);
      repeatRange.forEach(({ startRange }) => {
        var _a;
        (_a = this._copyInfo) == null ? void 0 : _a.matrix.forValue((row, col, ruleId) => {
          const range = Rectangle.getPositionRange(
            {
              startRow: row,
              endRow: row,
              startColumn: col,
              endColumn: col
            },
            startRange
          );
          const { row: startRow, col: startColumn } = mapFunc(range.startRow, range.startColumn);
          additionMatrix.setValue(startRow, startColumn, ruleId);
          additionRules.add(ruleId);
        });
      });
      const additions = Array.from(additionRules).map((id) => ({ id, ranges: queryObjectMatrix(additionMatrix, (value) => value === id) }));
      ruleMatrix.addRangeRules(additions);
      const { redoMutations, undoMutations } = getDataValidationDiffMutations(
        unitId,
        subUnitId,
        ruleMatrix.diff(this._sheetDataValidationModel.getRules(unitId, subUnitId)),
        this._injector,
        "patched",
        false
      );
      return {
        redos: redoMutations,
        undos: undoMutations
      };
    }
  }
};
DataValidationCopyPasteController = __decorateClass([
  __decorateParam(0, ISheetClipboardService),
  __decorateParam(1, Inject(SheetDataValidationModel)),
  __decorateParam(2, Inject(Injector))
], DataValidationCopyPasteController);

// ../packages/sheets-data-validation-ui/src/controllers/dv-permission.controller.ts
var DataValidationPermissionController = class extends Disposable {
  constructor(_localeService, _commandService, _sheetPermissionCheckController) {
    super();
    this._localeService = _localeService;
    this._commandService = _commandService;
    this._sheetPermissionCheckController = _sheetPermissionCheckController;
    this._commandExecutedListener();
  }
  _commandExecutedListener() {
    this.disposeWithMe(
      this._commandService.beforeCommandExecuted((command) => {
        if (command.id === AddSheetDataValidationCommand.id) {
          const { unitId, subUnitId, rule: { ranges } } = command.params;
          const permission = this._sheetPermissionCheckController.permissionCheckWithRanges({
            workbookTypes: [WorkbookEditablePermission],
            rangeTypes: [RangeProtectionPermissionEditPoint],
            worksheetTypes: [WorksheetEditPermission, WorksheetSetCellStylePermission]
          }, ranges, unitId, subUnitId);
          if (!permission) {
            this._sheetPermissionCheckController.blockExecuteWithoutPermission(this._localeService.t("permission.dialog.setStyleErr"));
          }
        }
        if (command.id === UpdateSheetDataValidationRangeCommand.id) {
          const { unitId, subUnitId, ranges } = command.params;
          const permission = this._sheetPermissionCheckController.permissionCheckWithRanges({
            workbookTypes: [WorkbookEditablePermission],
            rangeTypes: [RangeProtectionPermissionEditPoint],
            worksheetTypes: [WorksheetEditPermission, WorksheetSetCellStylePermission]
          }, ranges, unitId, subUnitId);
          if (!permission) {
            this._sheetPermissionCheckController.blockExecuteWithoutPermission(this._localeService.t("permission.dialog.setStyleErr"));
          }
        }
      })
    );
  }
};
DataValidationPermissionController = __decorateClass([
  __decorateParam(0, Inject(LocaleService)),
  __decorateParam(1, ICommandService),
  __decorateParam(2, Inject(SheetPermissionCheckController))
], DataValidationPermissionController);

// ../packages/sheets-data-validation-ui/src/controllers/dv.menu.ts
var DATA_VALIDATION_MENU_ID = "sheet.menu.data-validation";
function dataValidationMenuFactory(accessor) {
  return {
    id: DATA_VALIDATION_MENU_ID,
    type: 3 /* SUBITEMS */,
    icon: "DataValidationIcon",
    tooltip: "dataValidation.title",
    hidden$: getMenuHiddenObservable(accessor, O.UNIVER_SHEET),
    disabled$: getCurrentRangeDisable$(accessor, { workbookTypes: [WorkbookEditablePermission], worksheetTypes: [WorksheetSetCellStylePermission, WorksheetEditPermission], rangeTypes: [RangeProtectionPermissionEditPoint] })
  };
}
function openDataValidationMenuFactory(_accessor) {
  return {
    id: OpenValidationPanelOperation.id,
    title: "dataValidation.panel.title",
    type: 0 /* BUTTON */
  };
}
function addDataValidationMenuFactory(_accessor) {
  return {
    id: AddSheetDataValidationAndOpenCommand.id,
    title: "dataValidation.panel.add",
    type: 0 /* BUTTON */
  };
}

// ../packages/sheets-data-validation-ui/src/controllers/menu.schema.ts
var menuSchema = {
  ["ribbon.data.rules" /* RULES */]: {
    [DATA_VALIDATION_MENU_ID]: {
      order: 0,
      menuItemFactory: dataValidationMenuFactory,
      [OpenValidationPanelOperation.id]: {
        order: 0,
        menuItemFactory: openDataValidationMenuFactory
      },
      [AddSheetDataValidationAndOpenCommand.id]: {
        order: 1,
        menuItemFactory: addDataValidationMenuFactory
      }
    }
  }
};

// ../packages/sheets-data-validation-ui/src/controllers/dv-render.controller.ts
var INVALID_MARK = {
  tr: {
    size: 6,
    color: "#fe4b4b"
  }
};
var SheetsDataValidationRenderController = class extends RxDisposable {
  constructor(_commandService, _menuManagerService, _renderManagerService, _univerInstanceService, _autoHeightController, _dropdownManagerService, _sheetDataValidationModel, _dataValidatorRegistryService, _sheetInterceptorService, _dataValidationCacheService, _editorBridgeService) {
    super();
    this._commandService = _commandService;
    this._menuManagerService = _menuManagerService;
    this._renderManagerService = _renderManagerService;
    this._univerInstanceService = _univerInstanceService;
    this._autoHeightController = _autoHeightController;
    this._dropdownManagerService = _dropdownManagerService;
    this._sheetDataValidationModel = _sheetDataValidationModel;
    this._dataValidatorRegistryService = _dataValidatorRegistryService;
    this._sheetInterceptorService = _sheetInterceptorService;
    this._dataValidationCacheService = _dataValidationCacheService;
    this._editorBridgeService = _editorBridgeService;
    this._initMenu();
    this._initDropdown();
    this._initViewModelIntercept();
    this._initAutoHeight();
  }
  _initMenu() {
    this._menuManagerService.mergeMenu(menuSchema);
  }
  _initDropdown() {
    if (!this._editorBridgeService) {
      return;
    }
    this.disposeWithMe(this._editorBridgeService.visible$.subscribe((visible) => {
      var _a;
      if (!visible.visible) {
        if (((_a = this._dropdownManagerService.activeDropdown) == null ? void 0 : _a.trigger) === "editor-bridge") {
          this._dropdownManagerService.hideDropdown();
        }
        return;
      }
      const state = this._editorBridgeService.getEditCellState();
      if (state) {
        const { unitId, sheetId, row, column } = state;
        const workbook = this._univerInstanceService.getUniverSheetInstance(unitId);
        if (!workbook) {
          return;
        }
        const rule = this._sheetDataValidationModel.getRuleByLocation(unitId, sheetId, row, column);
        if (!rule) {
          return;
        }
        const validator = this._dataValidatorRegistryService.getValidatorItem(rule.type);
        if (!(validator == null ? void 0 : validator.dropdownType)) {
          return;
        }
        const worksheet = workbook.getActiveSheet();
        if (!worksheet) return;
        const activeDropdown = this._dropdownManagerService.activeDropdown;
        const currLoc = activeDropdown == null ? void 0 : activeDropdown.location;
        if (currLoc && currLoc.unitId === unitId && currLoc.subUnitId === sheetId && currLoc.row === row && currLoc.col === column) {
          return;
        }
        this._dropdownManagerService.showDropdown(
          {
            location: {
              unitId,
              subUnitId: sheetId,
              row,
              col: column,
              workbook,
              worksheet
            },
            trigger: "editor-bridge",
            closeOnOutSide: false
          }
        );
      }
    }));
  }
  // eslint-disable-next-line max-lines-per-function
  _initViewModelIntercept() {
    this.disposeWithMe(
      this._sheetInterceptorService.intercept(
        INTERCEPTOR_POINT.CELL_CONTENT,
        {
          effect: 1 /* Style */,
          // must be after numfmt
          priority: 9 /* DATA_VALIDATION */,
          // eslint-disable-next-line max-lines-per-function, complexity
          handler: (cell, pos, next) => {
            var _a, _b, _c, _d, _e;
            const { row, col, unitId, subUnitId, workbook, worksheet } = pos;
            const ruleId = this._sheetDataValidationModel.getRuleIdByLocation(unitId, subUnitId, row, col);
            if (!ruleId) {
              return next(cell);
            }
            const rule = this._sheetDataValidationModel.getRuleById(unitId, subUnitId, ruleId);
            if (!rule) {
              return next(cell);
            }
            const validStatus = (_a = this._dataValidationCacheService.getValue(unitId, subUnitId, row, col)) != null ? _a : "valid" /* VALID */;
            const validator = this._dataValidatorRegistryService.getValidatorItem(rule.type);
            const cellOrigin = pos.rawData;
            let cache;
            const cellValue = {
              get value() {
                var _a2;
                if (cache !== void 0) {
                  return cache;
                }
                cache = (_a2 = getCellValueOrigin(cellOrigin)) != null ? _a2 : null;
                return cache;
              }
            };
            const valueStr = {
              get value() {
                var _a2;
                return `${(_a2 = cellValue.value) != null ? _a2 : ""}`;
              }
            };
            if (!cell || cell === pos.rawData) {
              cell = { ...pos.rawData };
            }
            cell.markers = {
              ...cell == null ? void 0 : cell.markers,
              ...validStatus === "invalid" /* INVALID */ ? INVALID_MARK : null
            };
            cell.customRender = [
              ...(_b = cell == null ? void 0 : cell.customRender) != null ? _b : [],
              ...(validator == null ? void 0 : validator.canvasRender) ? [validator.canvasRender] : []
            ];
            cell.fontRenderExtension = {
              ...cell == null ? void 0 : cell.fontRenderExtension,
              isSkip: ((_c = cell == null ? void 0 : cell.fontRenderExtension) == null ? void 0 : _c.isSkip) || ((_d = validator == null ? void 0 : validator.skipDefaultFontRender) == null ? void 0 : _d.call(validator, rule, cellValue.value, pos))
            };
            cell.interceptorStyle = {
              ...cell == null ? void 0 : cell.interceptorStyle,
              ...validator == null ? void 0 : validator.getExtraStyle(rule, valueStr.value, {
                get style() {
                  const styleMap = workbook.getStyles();
                  return (typeof (cell == null ? void 0 : cell.s) === "string" ? styleMap.get(cell == null ? void 0 : cell.s) : cell == null ? void 0 : cell.s) || {};
                }
              }, row, col)
            };
            cell.interceptorAutoHeight = () => {
              var _a2, _b2, _c2, _d2, _e2, _f;
              const skeleton = (_b2 = (_a2 = this._renderManagerService.getRenderById(unitId)) == null ? void 0 : _a2.with(SheetSkeletonManagerService).getSkeletonParam(subUnitId)) == null ? void 0 : _b2.skeleton;
              if (!skeleton) {
                return void 0;
              }
              const mergeCell = skeleton.worksheet.getMergedCell(row, col);
              const info = {
                data: cell,
                style: skeleton.getStyles().getStyleByCell(cell),
                primaryWithCoord: skeleton.getCellWithCoordByIndex((_c2 = mergeCell == null ? void 0 : mergeCell.startRow) != null ? _c2 : row, (_d2 = mergeCell == null ? void 0 : mergeCell.startColumn) != null ? _d2 : col),
                unitId,
                subUnitId,
                row,
                col,
                workbook,
                worksheet
              };
              return (_f = (_e2 = validator == null ? void 0 : validator.canvasRender) == null ? void 0 : _e2.calcCellAutoHeight) == null ? void 0 : _f.call(_e2, info);
            };
            cell.interceptorAutoWidth = () => {
              var _a2, _b2, _c2, _d2, _e2, _f;
              const skeleton = (_b2 = (_a2 = this._renderManagerService.getRenderById(unitId)) == null ? void 0 : _a2.with(SheetSkeletonManagerService).getSkeletonParam(subUnitId)) == null ? void 0 : _b2.skeleton;
              if (!skeleton) {
                return void 0;
              }
              const mergeCell = skeleton.worksheet.getMergedCell(row, col);
              const info = {
                data: cell,
                style: skeleton.getStyles().getStyleByCell(cell),
                primaryWithCoord: skeleton.getCellWithCoordByIndex((_c2 = mergeCell == null ? void 0 : mergeCell.startRow) != null ? _c2 : row, (_d2 = mergeCell == null ? void 0 : mergeCell.startColumn) != null ? _d2 : col),
                unitId,
                subUnitId,
                row,
                col,
                workbook,
                worksheet
              };
              return (_f = (_e2 = validator == null ? void 0 : validator.canvasRender) == null ? void 0 : _e2.calcCellAutoWidth) == null ? void 0 : _f.call(_e2, info);
            };
            cell.coverable = ((_e = cell == null ? void 0 : cell.coverable) != null ? _e : true) && !(rule.type === "list" /* LIST */ || rule.type === "listMultiple" /* LIST_MULTIPLE */);
            return next(cell);
          }
        }
      )
    );
  }
  _initAutoHeight() {
    this._sheetDataValidationModel.ruleChange$.pipe(
      // patched data-validation change don't need to re-calc row height
      // re-calc of row height will be triggered precisely by the origin command
      filter((change) => change.source === "command"),
      bufferTime(100)
    ).subscribe((infos) => {
      if (infos.length === 0) {
        return;
      }
      const ranges = [];
      infos.forEach((info) => {
        var _a;
        if (info.rule.type === "listMultiple" /* LIST_MULTIPLE */ || info.rule.type === "list" /* LIST */) {
          if ((_a = info.rule) == null ? void 0 : _a.ranges) {
            ranges.push(...info.rule.ranges);
          }
        }
      });
      if (ranges.length) {
        const mutations = this._autoHeightController.getUndoRedoParamsOfAutoHeight(ranges);
        sequenceExecute(mutations.redos, this._commandService);
      }
    });
  }
};
SheetsDataValidationRenderController = __decorateClass([
  __decorateParam(0, ICommandService),
  __decorateParam(1, IMenuManagerService),
  __decorateParam(2, IRenderManagerService),
  __decorateParam(3, IUniverInstanceService),
  __decorateParam(4, Inject(AutoHeightController)),
  __decorateParam(5, Inject(DataValidationDropdownManagerService)),
  __decorateParam(6, Inject(SheetDataValidationModel)),
  __decorateParam(7, Inject(DataValidatorRegistryService)),
  __decorateParam(8, Inject(SheetInterceptorService)),
  __decorateParam(9, Inject(DataValidationCacheService)),
  __decorateParam(10, Optional(IEditorBridgeService))
], SheetsDataValidationRenderController);
var SheetsDataValidationMobileRenderController = class extends RxDisposable {
  constructor(_commandService, _renderManagerService, _autoHeightController, _dataValidatorRegistryService, _sheetInterceptorService, _sheetDataValidationModel, _dataValidationCacheService) {
    super();
    this._commandService = _commandService;
    this._renderManagerService = _renderManagerService;
    this._autoHeightController = _autoHeightController;
    this._dataValidatorRegistryService = _dataValidatorRegistryService;
    this._sheetInterceptorService = _sheetInterceptorService;
    this._sheetDataValidationModel = _sheetDataValidationModel;
    this._dataValidationCacheService = _dataValidationCacheService;
    this._initViewModelIntercept();
    this._initAutoHeight();
  }
  // eslint-disable-next-line max-lines-per-function
  _initViewModelIntercept() {
    this.disposeWithMe(
      this._sheetInterceptorService.intercept(
        INTERCEPTOR_POINT.CELL_CONTENT,
        {
          effect: 1 /* Style */,
          // must be after numfmt
          priority: 9 /* DATA_VALIDATION */,
          // eslint-disable-next-line complexity, max-lines-per-function
          handler: (cell, pos, next) => {
            var _a, _b, _c, _d, _e;
            const { row, col, unitId, subUnitId, workbook, worksheet } = pos;
            const ruleId = this._sheetDataValidationModel.getRuleIdByLocation(unitId, subUnitId, row, col);
            if (!ruleId) {
              return next(cell);
            }
            const rule = this._sheetDataValidationModel.getRuleById(unitId, subUnitId, ruleId);
            if (!rule) {
              return next(cell);
            }
            const validStatus = (_a = this._dataValidationCacheService.getValue(unitId, subUnitId, row, col)) != null ? _a : "valid" /* VALID */;
            const validator = this._dataValidatorRegistryService.getValidatorItem(rule.type);
            const cellOrigin = worksheet.getCellRaw(row, col);
            const cellValue = getCellValueOrigin(cellOrigin);
            const valueStr = `${cellValue != null ? cellValue : ""}`;
            if (!cell || cell === pos.rawData) {
              cell = { ...pos.rawData };
            }
            cell.markers = {
              ...cell == null ? void 0 : cell.markers,
              ...validStatus === "invalid" /* INVALID */ ? INVALID_MARK : null
            };
            cell.customRender = [
              ...(_b = cell == null ? void 0 : cell.customRender) != null ? _b : [],
              ...(validator == null ? void 0 : validator.canvasRender) ? [validator.canvasRender] : []
            ];
            cell.fontRenderExtension = {
              ...cell == null ? void 0 : cell.fontRenderExtension,
              isSkip: ((_c = cell == null ? void 0 : cell.fontRenderExtension) == null ? void 0 : _c.isSkip) || ((_d = validator == null ? void 0 : validator.skipDefaultFontRender) == null ? void 0 : _d.call(validator, rule, cellValue, pos))
            };
            cell.interceptorStyle = {
              ...cell == null ? void 0 : cell.interceptorStyle,
              ...validator == null ? void 0 : validator.getExtraStyle(rule, valueStr, {
                get style() {
                  const styleMap = workbook.getStyles();
                  return (typeof (cell == null ? void 0 : cell.s) === "string" ? styleMap.get(cell == null ? void 0 : cell.s) : cell == null ? void 0 : cell.s) || {};
                }
              }, row, col)
            };
            cell.interceptorAutoHeight = () => {
              var _a2, _b2, _c2, _d2, _e2, _f;
              const skeleton = (_b2 = (_a2 = this._renderManagerService.getRenderById(unitId)) == null ? void 0 : _a2.with(SheetSkeletonManagerService).getSkeletonParam(subUnitId)) == null ? void 0 : _b2.skeleton;
              if (!skeleton) {
                return void 0;
              }
              const mergeCell = skeleton.worksheet.getMergedCell(row, col);
              const info = {
                data: cell,
                style: skeleton.getStyles().getStyleByCell(cell),
                primaryWithCoord: skeleton.getCellWithCoordByIndex((_c2 = mergeCell == null ? void 0 : mergeCell.startRow) != null ? _c2 : row, (_d2 = mergeCell == null ? void 0 : mergeCell.startColumn) != null ? _d2 : col),
                unitId,
                subUnitId,
                row,
                col,
                workbook,
                worksheet
              };
              return (_f = (_e2 = validator == null ? void 0 : validator.canvasRender) == null ? void 0 : _e2.calcCellAutoHeight) == null ? void 0 : _f.call(_e2, info);
            };
            cell.interceptorAutoWidth = () => {
              var _a2, _b2, _c2, _d2, _e2, _f;
              const skeleton = (_b2 = (_a2 = this._renderManagerService.getRenderById(unitId)) == null ? void 0 : _a2.with(SheetSkeletonManagerService).getSkeletonParam(subUnitId)) == null ? void 0 : _b2.skeleton;
              if (!skeleton) {
                return void 0;
              }
              const mergeCell = skeleton.worksheet.getMergedCell(row, col);
              const info = {
                data: cell,
                style: skeleton.getStyles().getStyleByCell(cell),
                primaryWithCoord: skeleton.getCellWithCoordByIndex((_c2 = mergeCell == null ? void 0 : mergeCell.startRow) != null ? _c2 : row, (_d2 = mergeCell == null ? void 0 : mergeCell.startColumn) != null ? _d2 : col),
                unitId,
                subUnitId,
                row,
                col,
                workbook,
                worksheet
              };
              return (_f = (_e2 = validator == null ? void 0 : validator.canvasRender) == null ? void 0 : _e2.calcCellAutoWidth) == null ? void 0 : _f.call(_e2, info);
            };
            cell.coverable = ((_e = cell == null ? void 0 : cell.coverable) != null ? _e : true) && !(rule.type === "list" /* LIST */ || rule.type === "listMultiple" /* LIST_MULTIPLE */);
            return next(cell);
          }
        }
      )
    );
  }
  _initAutoHeight() {
    this._sheetDataValidationModel.ruleChange$.pipe(
      filter((change) => change.source === "command"),
      bufferTime(16)
    ).subscribe((infos) => {
      const ranges = [];
      infos.forEach((info) => {
        var _a;
        if (info.rule.type === "listMultiple" /* LIST_MULTIPLE */ || info.rule.type === "list" /* LIST */) {
          if ((_a = info.rule) == null ? void 0 : _a.ranges) {
            ranges.push(...info.rule.ranges);
          }
        }
      });
      if (ranges.length) {
        const mutations = this._autoHeightController.getUndoRedoParamsOfAutoHeight(ranges);
        sequenceExecute(mutations.redos, this._commandService);
      }
    });
  }
};
SheetsDataValidationMobileRenderController = __decorateClass([
  __decorateParam(0, ICommandService),
  __decorateParam(1, IRenderManagerService),
  __decorateParam(2, Inject(AutoHeightController)),
  __decorateParam(3, Inject(DataValidatorRegistryService)),
  __decorateParam(4, Inject(SheetInterceptorService)),
  __decorateParam(5, Inject(SheetDataValidationModel)),
  __decorateParam(6, Inject(DataValidationCacheService))
], SheetsDataValidationMobileRenderController);

// ../packages/sheets-data-validation-ui/src/controllers/dv-rerender.controller.ts
var SheetsDataValidationReRenderController = class extends Disposable {
  constructor(_context, _sheetDataValidationModel, _sheetSkeletonManagerService) {
    super();
    this._context = _context;
    this._sheetDataValidationModel = _sheetDataValidationModel;
    this._sheetSkeletonManagerService = _sheetSkeletonManagerService;
    this._initSkeletonChange();
  }
  _initSkeletonChange() {
    const reRender = (values) => {
      var _a;
      if (!values.length) {
        return;
      }
      const sheetIds = /* @__PURE__ */ new Set();
      values.forEach((value) => {
        sheetIds.add(value.subUnitId);
      });
      sheetIds.forEach((sheetId) => {
        var _a2;
        (_a2 = this._sheetSkeletonManagerService.getSkeletonParam(sheetId)) == null ? void 0 : _a2.skeleton.makeDirty(true);
      });
      (_a = this._context.mainComponent) == null ? void 0 : _a.makeForceDirty();
    };
    this.disposeWithMe(this._sheetDataValidationModel.validStatusChange$.pipe(bufferDebounceTime(16)).subscribe(reRender));
  }
};
SheetsDataValidationReRenderController = __decorateClass([
  __decorateParam(1, Inject(SheetDataValidationModel)),
  __decorateParam(2, Inject(SheetSkeletonManagerService))
], SheetsDataValidationReRenderController);

// ../packages/sheets-data-validation-ui/src/views/components/detail/index.tsx
var import_react3 = __toESM(require_react());

// ../packages/sheets-data-validation-ui/src/views/components/options/index.tsx
var import_react2 = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());
function DataValidationOptions(props) {
  var _a;
  const localeService = useDependency(LocaleService);
  const componentManager = useDependency(ComponentManager);
  const { value, onChange, extraComponent } = props;
  const [show, setShow] = (0, import_react2.useState)(false);
  const ExtraOptions = extraComponent ? componentManager.get(extraComponent) : null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      "div",
      {
        className: `univer-mb-3 univer-flex univer-cursor-pointer univer-items-center univer-text-sm univer-text-gray-900 dark:!univer-text-white`,
        onClick: () => setShow(!show),
        children: [
          localeService.t("dataValidation.panel.options"),
          show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreUpIcon, { className: "univer-ml-1" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoreDownIcon, { className: "univer-ml-1" })
        ]
      }
    ),
    show && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
      ExtraOptions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExtraOptions, { value, onChange }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        FormLayout,
        {
          label: localeService.t("dataValidation.panel.invalid"),
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            RadioGroup,
            {
              value: `${(_a = value.errorStyle) != null ? _a : 2 /* WARNING */}`,
              onChange: (errorStyle) => onChange({ ...value, errorStyle: +errorStyle }),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { value: `${2 /* WARNING */}`, children: localeService.t("dataValidation.panel.showWarning") }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { value: `${1 /* STOP */}`, children: localeService.t("dataValidation.panel.rejectInput") })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        FormLayout,
        {
          label: localeService.t("dataValidation.panel.messageInfo"),
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Checkbox,
            {
              checked: value.showErrorMessage,
              onChange: () => onChange({
                ...value,
                showErrorMessage: !value.showErrorMessage
              }),
              children: localeService.t("dataValidation.panel.showInfo")
            }
          )
        }
      ),
      value.showErrorMessage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { value: value.error, onChange: (error) => onChange({ ...value, error }) }) }) : null
    ] })
  ] });
}

// ../packages/sheets-data-validation-ui/src/views/components/detail/index.tsx
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var debounceExecuteFactory = (commandService) => debounce_default(
  async (id, params, options, callback) => {
    const res = await commandService.executeCommand(id, params, options);
    callback == null ? void 0 : callback(res);
  },
  1e3
);
function getSheetIdByName(univerInstanceService, unitId, name) {
  var _a, _b, _c, _d;
  if (unitId) {
    return ((_b = (_a = univerInstanceService.getUnit(unitId)) == null ? void 0 : _a.getSheetBySheetName(name)) == null ? void 0 : _b.getSheetId()) || "";
  }
  return ((_d = (_c = univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET)) == null ? void 0 : _c.getSheetBySheetName(name)) == null ? void 0 : _d.getSheetId()) || "";
}
function DataValidationDetail() {
  var _a, _b;
  const [key, setKey] = (0, import_react3.useState)(0);
  const dataValidationPanelService = useDependency(DataValidationPanelService);
  const activeRuleInfo = useObservable(dataValidationPanelService.activeRule$, dataValidationPanelService.activeRule);
  const { unitId, subUnitId, rule } = activeRuleInfo || {};
  const ruleId = rule.uid;
  const validatorService = useDependency(DataValidatorRegistryService);
  const univerInstanceService = useDependency(IUniverInstanceService);
  const componentManager = useDependency(ComponentManager);
  const commandService = useDependency(ICommandService);
  const dataValidationModel = useDependency(DataValidationModel);
  const localeService = useDependency(LocaleService);
  const [localRule, setLocalRule] = (0, import_react3.useState)(rule);
  const validator = validatorService.getValidatorItem(localRule.type);
  const [showError, setShowError] = (0, import_react3.useState)(false);
  const validators = validatorService.getValidatorsByScope("sheet" /* SHEET */);
  const [localRanges, setLocalRanges] = (0, import_react3.useState)(() => localRule.ranges.map((i) => ({ unitId: "", sheetId: "", range: i })));
  const debounceExecute = (0, import_react3.useMemo)(() => debounceExecuteFactory(commandService), [commandService]);
  const [isRangeError, setIsRangeError] = (0, import_react3.useState)(false);
  const [isFocusRangeSelector, setIsFocusRangeSelector] = (0, import_react3.useState)(false);
  const rangeSelectorInstance = (0, import_react3.useRef)(null);
  const sheetSelectionService = useDependency(SheetsSelectionsService);
  (0, import_react3.useEffect)(() => {
    return () => {
      const currentSelection = sheetSelectionService.getCurrentLastSelection();
      if (currentSelection) {
        sheetSelectionService.setSelections([currentSelection]);
      }
    };
  }, [sheetSelectionService]);
  (0, import_react3.useEffect)(() => {
    commandService.onCommandExecuted((commandInfo) => {
      if (commandInfo.id === UndoCommand.id || commandInfo.id === RedoCommand.id) {
        setTimeout(() => {
          const activeRule = dataValidationModel.getRuleById(unitId, subUnitId, ruleId);
          setKey((k) => k + 1);
          if (activeRule) {
            setLocalRule(activeRule);
            setLocalRanges(activeRule.ranges.map((i) => ({ unitId: "", sheetId: "", range: i })));
          }
        }, 20);
      }
    });
  }, [commandService, dataValidationModel, ruleId, subUnitId, unitId]);
  if (!validator) {
    return null;
  }
  const operators = validator.operators;
  const operatorNames = validator.operatorNames;
  const isTwoFormula = localRule.operator ? TWO_FORMULA_OPERATOR_COUNT.includes(localRule.operator) : false;
  const handleOk = () => {
    var _a2, _b2, _c;
    if ((_b2 = (_a2 = rangeSelectorInstance.current) == null ? void 0 : _a2.editor) == null ? void 0 : _b2.isFocus()) {
      handleUpdateRuleRanges((_c = rangeSelectorInstance.current) == null ? void 0 : _c.getValue());
    }
    if (!localRule.ranges.length || isRangeError) {
      return;
    }
    if (validator.validatorFormula(localRule, unitId, subUnitId).success) {
      dataValidationPanelService.setActiveRule(null);
    } else {
      setShowError(true);
    }
  };
  const handleUpdateRuleRanges = useEvent((rangeText) => {
    const unitRanges = rangeText.split(",").filter(Boolean).map(deserializeRangeWithSheet).map((unitRange) => {
      const sheetName = unitRange.sheetName;
      if (sheetName) {
        const sheetId = getSheetIdByName(univerInstanceService, unitRange.unitId, sheetName);
        return { ...unitRange, sheetId };
      }
      return {
        ...unitRange,
        sheetId: ""
      };
    });
    if (isUnitRangesEqual(unitRanges, localRanges)) {
      return;
    }
    setLocalRanges(unitRanges);
    const ranges = unitRanges.filter((i) => (!i.unitId || i.unitId === unitId) && (!i.sheetId || i.sheetId === subUnitId)).map((i) => i.range);
    setLocalRule({
      ...localRule,
      ranges
    });
    if (ranges.length === 0) {
      return;
    }
    const params = {
      unitId,
      subUnitId,
      ruleId,
      ranges
    };
    debounceExecute(UpdateSheetDataValidationRangeCommand.id, params);
  });
  const handleUpdateRuleSetting = (setting) => {
    if (shallowEqual(setting, getRuleSetting(localRule))) {
      return;
    }
    setLocalRule({
      ...localRule,
      ...setting
    });
    const params = {
      unitId,
      subUnitId,
      ruleId,
      setting
    };
    debounceExecute(
      UpdateSheetDataValidationSettingCommand.id,
      params,
      void 0
    );
  };
  const handleDelete = async () => {
    await commandService.executeCommand(RemoveSheetDataValidationCommand.id, {
      ruleId,
      unitId,
      subUnitId
    });
    dataValidationPanelService.setActiveRule(null);
  };
  const baseRule = {
    type: localRule.type,
    operator: localRule.operator,
    formula1: localRule.formula1,
    formula2: localRule.formula2,
    allowBlank: localRule.allowBlank
  };
  const handleChangeType = (newType) => {
    const validator2 = validatorService.getValidatorItem(newType);
    if (!validator2) {
      return;
    }
    const operators2 = validator2.operators;
    const rule2 = dataValidationModel.getRuleById(unitId, subUnitId, ruleId);
    const newRule = newType === (rule2 == null ? void 0 : rule2.type) || newType.includes("list") && (rule2 == null ? void 0 : rule2.type.includes("list")) ? {
      ...rule2,
      type: newType
    } : {
      ...localRule,
      type: newType,
      operator: operators2[0],
      formula1: void 0,
      formula2: void 0
    };
    setLocalRule(newRule);
    commandService.executeCommand(UpdateSheetDataValidationSettingCommand.id, {
      unitId,
      subUnitId,
      ruleId: localRule.uid,
      setting: getRuleSetting(newRule)
    });
  };
  const FormulaInput = componentManager.get(validator.formulaInput);
  const rangeStr = (0, import_react3.useMemo)(() => localRanges.map((i) => serializeRange(i.range)).join(","), []);
  const options = getRuleOptions(localRule);
  const handleUpdateRuleOptions = (newOptions) => {
    if (shallowEqual(newOptions, getRuleOptions(localRule))) {
      return;
    }
    setLocalRule({
      ...localRule,
      ...newOptions
    });
    debounceExecute(
      UpdateSheetDataValidationOptionsCommand.id,
      {
        unitId,
        subUnitId,
        ruleId,
        options: newOptions
      }
    );
  };
  const shouldHideFormula = operators.length && !localRule.operator;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { "data-u-comp": "data-validation-detail", className: "univer-py-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      FormLayout,
      {
        label: localeService.t("dataValidation.panel.range"),
        error: !localRule.ranges.length || isRangeError ? localeService.t("dataValidation.panel.rangeError") : "",
        children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          RangeSelector,
          {
            selectorRef: rangeSelectorInstance,
            unitId,
            subUnitId,
            initialValue: rangeStr,
            onChange: (doc, str) => {
              var _a2;
              if (!isFocusRangeSelector && ((_a2 = rangeSelectorInstance.current) == null ? void 0 : _a2.verify())) {
                handleUpdateRuleRanges(str);
              }
            },
            onFocusChange: (focusing, str) => {
              var _a2;
              setIsFocusRangeSelector(focusing);
              if (!focusing && str && ((_a2 = rangeSelectorInstance.current) == null ? void 0 : _a2.verify())) {
                handleUpdateRuleRanges(str);
              }
            },
            onVerify: (isValid) => setIsRangeError(!isValid)
          }
        )
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(FormLayout, { label: localeService.t("dataValidation.panel.type"), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      Select,
      {
        className: "univer-w-full",
        value: localRule.type,
        options: (_a = validators == null ? void 0 : validators.sort((a, b) => a.order - b.order)) == null ? void 0 : _a.map((validator2) => ({
          label: localeService.t(validator2.title),
          value: validator2.id
        })),
        onChange: handleChangeType
      }
    ) }),
    (operators == null ? void 0 : operators.length) ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(FormLayout, { label: localeService.t("dataValidation.panel.operator"), children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      Select,
      {
        className: "univer-w-full",
        value: `${localRule.operator}`,
        options: [
          {
            value: "",
            label: localeService.t("dataValidation.operators.legal")
          },
          ...operators.map((op, i) => ({
            value: `${op}`,
            label: operatorNames[i]
          }))
        ],
        onChange: (operator) => {
          handleUpdateRuleSetting({
            ...baseRule,
            operator
          });
        }
      }
    ) }) : null,
    FormulaInput && !shouldHideFormula ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      FormulaInput,
      {
        isTwoFormula,
        value: {
          formula1: localRule.formula1,
          formula2: localRule.formula2
        },
        onChange: (value) => {
          handleUpdateRuleSetting({
            ...baseRule,
            ...value
          });
        },
        showError,
        validResult: validator.validatorFormula(localRule, unitId, subUnitId),
        unitId,
        subUnitId,
        ruleId
      },
      key + localRule.type
    ) : null,
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(FormLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      Checkbox,
      {
        checked: (_b = localRule.allowBlank) != null ? _b : true,
        onChange: () => {
          var _a2;
          return handleUpdateRuleSetting({
            ...baseRule,
            allowBlank: !((_a2 = localRule.allowBlank) != null ? _a2 : true)
          });
        },
        children: localeService.t("dataValidation.panel.allowBlank")
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DataValidationOptions, { value: options, onChange: handleUpdateRuleOptions, extraComponent: validator.optionsInput }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "univer-mt-5 univer-flex univer-flex-row univer-justify-end", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Button, { className: "univer-ml-3", onClick: handleDelete, children: localeService.t("dataValidation.panel.removeRule") }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Button, { className: "univer-ml-3", variant: "primary", onClick: handleOk, children: localeService.t("dataValidation.panel.done") })
    ] })
  ] });
}

// ../packages/sheets-data-validation-ui/src/views/components/list/index.tsx
var import_react5 = __toESM(require_react());

// ../packages/sheets-data-validation-ui/src/views/components/item/index.tsx
var import_react4 = __toESM(require_react());
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
var DataValidationItem = (props) => {
  const { rule, onClick, unitId, subUnitId, disable } = props;
  const validatorRegistry = useDependency(DataValidatorRegistryService);
  const commandService = useDependency(ICommandService);
  const markSelectionService = useDependency(IMarkSelectionService);
  const validator = validatorRegistry.getValidatorItem(rule.type);
  const ids = (0, import_react4.useRef)(void 0);
  const [isHover, setIsHover] = (0, import_react4.useState)(false);
  const themeService = useDependency(ThemeService);
  const theme = useObservable(themeService.currentTheme$);
  const style = (0, import_react4.useMemo)(() => {
    var _a;
    const defaultColor = themeService.getColorFromTheme("primary.600");
    const key = themeService.getColorFromTheme("loop-color.2");
    const color = (_a = themeService.getColorFromTheme(key)) != null ? _a : defaultColor;
    const rgb = new ColorKit(color).toRgb();
    return {
      fill: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
      stroke: color
    };
  }, [theme]);
  const handleDelete = (e) => {
    commandService.executeCommand(RemoveSheetDataValidationCommand.id, {
      ruleId: rule.uid,
      unitId,
      subUnitId
    });
    e.stopPropagation();
  };
  (0, import_react4.useEffect)(() => {
    return () => {
      var _a;
      if (ids.current) {
        (_a = ids.current) == null ? void 0 : _a.forEach((id) => {
          id && markSelectionService.removeShape(id);
        });
      }
    };
  }, [markSelectionService]);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
    "div",
    {
      className: clsx(
        `univer-bg-secondary univer-relative univer--ml-2 univer--mr-2 univer-box-border univer-flex univer-w-[287px] univer-cursor-pointer univer-flex-col univer-justify-between univer-overflow-hidden univer-rounded-md univer-p-2 univer-pr-9`,
        {
          "hover:univer-bg-gray-50 dark:hover:!univer-bg-gray-700": !disable,
          "univer-opacity-50": disable
        }
      ),
      onClick,
      onMouseEnter: () => {
        if (disable) return;
        setIsHover(true);
        ids.current = rule.ranges.map((range) => markSelectionService.addShape({
          range,
          style,
          primary: null
        }));
      },
      onMouseLeave: () => {
        var _a;
        setIsHover(false);
        (_a = ids.current) == null ? void 0 : _a.forEach((id) => {
          id && markSelectionService.removeShape(id);
        });
        ids.current = void 0;
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: `univer-truncate univer-text-sm univer-font-medium univer-leading-[22px] univer-text-gray-900 dark:!univer-text-white`,
            children: validator == null ? void 0 : validator.generateRuleName(rule)
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: `univer-text-secondary univer-truncate univer-text-xs univer-leading-[18px] dark:!univer-text-gray-300`,
            children: rule.ranges.map((range) => serializeRange(range)).join(",")
          }
        ),
        isHover ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          "div",
          {
            className: `univer-absolute univer-right-2 univer-top-[19px] univer-flex univer-h-5 univer-w-5 univer-items-center univer-justify-center univer-rounded hover:univer-bg-gray-200 dark:!univer-text-gray-300 dark:hover:!univer-bg-gray-700`,
            onClick: handleDelete,
            children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(DeleteIcon, {})
          }
        ) : null
      ]
    }
  );
};

// ../packages/sheets-data-validation-ui/src/views/components/list/index.tsx
var import_jsx_runtime4 = __toESM(require_jsx_runtime());
function DataValidationList(props) {
  const sheetDataValidationModel = useDependency(SheetDataValidationModel);
  const univerInstanceService = useDependency(IUniverInstanceService);
  const commandService = useDependency(ICommandService);
  const injector = useDependency(Injector);
  const dataValidationPanelService = useDependency(DataValidationPanelService);
  const localeService = useDependency(LocaleService);
  const [rules, setRules] = (0, import_react5.useState)([]);
  const { workbook } = props;
  const worksheet = useObservable(workbook.activeSheet$, void 0, true);
  const unitId = workbook.getUnitId();
  const subUnitId = worksheet == null ? void 0 : worksheet.getSheetId();
  (0, import_react5.useEffect)(() => {
    setRules(sheetDataValidationModel.getRules(unitId, subUnitId));
    const subscription = sheetDataValidationModel.ruleChange$.subscribe((change) => {
      if (change.unitId === unitId && change.subUnitId === subUnitId) {
        setRules(sheetDataValidationModel.getRules(unitId, subUnitId));
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [unitId, subUnitId, sheetDataValidationModel]);
  const handleAddRule = async () => {
    const rule = createDefaultNewRule(injector);
    const params = {
      unitId,
      subUnitId,
      rule
    };
    await commandService.executeCommand(AddSheetDataValidationCommand.id, params);
    dataValidationPanelService.setActiveRule({
      unitId,
      subUnitId,
      rule
    });
  };
  const handleRemoveAll = () => {
    commandService.executeCommand(RemoveSheetAllDataValidationCommand.id, {
      unitId,
      subUnitId
    });
  };
  const getDvRulesByPermissionCorrect = (rules2) => {
    const workbook2 = univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET);
    const worksheet2 = workbook2.getActiveSheet();
    const unitId2 = workbook2.getUnitId();
    const subUnitId2 = worksheet2.getSheetId();
    const rulesByPermissionCheck2 = rules2.map((rule) => {
      const hasPermission = checkRangesEditablePermission(injector, unitId2, subUnitId2, rule.ranges);
      if (hasPermission) {
        return { ...rule };
      } else {
        return { ...rule, disable: true };
      }
    });
    return rulesByPermissionCheck2;
  };
  const rulesByPermissionCheck = getDvRulesByPermissionCorrect(rules);
  const hasDisableRule = rulesByPermissionCheck == null ? void 0 : rulesByPermissionCheck.some((rule) => rule.disable);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "univer-pb-4", children: [
    rulesByPermissionCheck == null ? void 0 : rulesByPermissionCheck.map((rule) => {
      var _a;
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        DataValidationItem,
        {
          unitId,
          subUnitId,
          onClick: () => {
            if (rule.disable) return;
            dataValidationPanelService.setActiveRule({
              unitId,
              subUnitId,
              rule
            });
          },
          rule,
          disable: (_a = rule.disable) != null ? _a : false
        },
        rule.uid
      );
    }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "univer-mt-4 univer-flex univer-flex-row univer-justify-end univer-gap-2", children: [
      rules.length && !hasDisableRule ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Button, { onClick: handleRemoveAll, children: localeService.t("dataValidation.panel.removeAll") }) : null,
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Button, { variant: "primary", onClick: handleAddRule, children: localeService.t("dataValidation.panel.add") })
    ] })
  ] });
}

// ../packages/sheets-data-validation-ui/src/views/components/panel/index.tsx
var import_jsx_runtime5 = __toESM(require_jsx_runtime());
var DataValidationPanel = () => {
  const dataValidationPanelService = useDependency(DataValidationPanelService);
  const activeRule = useObservable(dataValidationPanelService.activeRule$, dataValidationPanelService.activeRule);
  const univerInstanceService = useDependency(IUniverInstanceService);
  const workbook = useObservable(
    () => univerInstanceService.getCurrentTypeOfUnit$(O.UNIVER_SHEET),
    void 0,
    void 0,
    []
  );
  const worksheet = useObservable(() => {
    var _a;
    return (_a = workbook == null ? void 0 : workbook.activeSheet$) != null ? _a : of(null);
  }, void 0, void 0, []);
  if (!workbook || !worksheet) return null;
  return activeRule && activeRule.subUnitId === worksheet.getSheetId() ? /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(DataValidationDetail, {}, activeRule.rule.uid) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(DataValidationList, { workbook });
};

// ../packages/sheets-data-validation-ui/src/views/components/formula-input/BaseFormulaInput.tsx
var import_jsx_runtime6 = __toESM(require_jsx_runtime());
var BaseFormulaInput = (props) => {
  const { isTwoFormula = false, value, onChange, showError, validResult } = props;
  const localeService = useDependency(LocaleService);
  const formula1Res = showError ? validResult == null ? void 0 : validResult.formula1 : "";
  const formula2Res = showError ? validResult == null ? void 0 : validResult.formula2 : "";
  if (isTwoFormula) {
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(FormLayout, { error: formula1Res, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        Input,
        {
          className: "univer-w-full",
          placeholder: localeService.t("dataValidation.panel.formulaPlaceholder"),
          value: value == null ? void 0 : value.formula1,
          onChange: (newValue) => {
            onChange == null ? void 0 : onChange({
              ...value,
              formula1: newValue
            });
          }
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "-univer-mt-2 univer-mb-1 univer-text-sm univer-text-gray-400", children: localeService.t("dataValidation.panel.formulaAnd") }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(FormLayout, { error: formula2Res, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        Input,
        {
          className: "univer-w-full",
          placeholder: localeService.t("dataValidation.panel.formulaPlaceholder"),
          value: value == null ? void 0 : value.formula2,
          onChange: (newValue) => {
            onChange == null ? void 0 : onChange({
              ...value,
              formula2: newValue
            });
          }
        }
      ) })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(FormLayout, { error: formula1Res, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    Input,
    {
      className: "univer-w-full",
      placeholder: localeService.t("dataValidation.panel.formulaPlaceholder"),
      value: value == null ? void 0 : value.formula1,
      onChange: (newValue) => {
        onChange == null ? void 0 : onChange({ formula1: newValue });
      }
    }
  ) });
};

// ../packages/sheets-data-validation-ui/src/views/components/formula-input/CheckboxFormulaInput.tsx
var import_react6 = __toESM(require_react());
var import_jsx_runtime7 = __toESM(require_jsx_runtime());
function CheckboxFormulaInput(props) {
  const { value, onChange, showError, validResult } = props;
  const localeService = useDependency(LocaleService);
  const formula1Res = showError ? validResult == null ? void 0 : validResult.formula1 : "";
  const formula2Res = showError ? validResult == null ? void 0 : validResult.formula2 : "";
  const [checked, setChecked] = (0, import_react6.useState)(!((value == null ? void 0 : value.formula1) === void 0 && (value == null ? void 0 : value.formula2) === void 0));
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(FormLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      Checkbox,
      {
        checked,
        onChange: (newValue) => {
          if (newValue) {
            setChecked(true);
          } else {
            setChecked(false);
            onChange == null ? void 0 : onChange({
              ...value,
              formula1: void 0,
              formula2: void 0
            });
          }
        },
        children: localeService.t("dataValidation.checkbox.tips")
      }
    ) }),
    checked ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(FormLayout, { label: localeService.t("dataValidation.checkbox.checked"), error: formula1Res, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      Input,
      {
        className: "univer-w-full",
        placeholder: localeService.t("dataValidation.panel.valuePlaceholder"),
        value: value == null ? void 0 : value.formula1,
        onChange: (newValue) => {
          onChange == null ? void 0 : onChange({
            ...value,
            formula1: newValue || void 0
          });
        }
      }
    ) }) : null,
    checked ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(FormLayout, { label: localeService.t("dataValidation.checkbox.unchecked"), error: formula2Res, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      Input,
      {
        className: "univer-w-full",
        placeholder: localeService.t("dataValidation.panel.valuePlaceholder"),
        value: value == null ? void 0 : value.formula2,
        onChange: (newValue) => {
          onChange == null ? void 0 : onChange({
            ...value,
            formula2: newValue || void 0
          });
        }
      }
    ) }) : null
  ] });
}

// ../packages/sheets-data-validation-ui/src/views/components/formula-input/CustomFormulaInput.tsx
var import_react7 = __toESM(require_react());
var import_jsx_runtime8 = __toESM(require_jsx_runtime());
function CustomFormulaInput(props) {
  var _a;
  const { unitId, subUnitId, value, onChange, showError, validResult } = props;
  const formula1Res = showError ? validResult == null ? void 0 : validResult.formula1 : void 0;
  const formulaEditorRef = (0, import_react7.useRef)(null);
  const [isFocusFormulaEditor, setIsFocusFormulaEditor] = (0, import_react7.useState)(false);
  useSidebarClick((e) => {
    var _a2;
    const isOutSide = (_a2 = formulaEditorRef.current) == null ? void 0 : _a2.isClickOutSide(e);
    isOutSide && setIsFocusFormulaEditor(false);
  });
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(FormLayout, { error: formula1Res, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    FormulaEditor,
    {
      ref: formulaEditorRef,
      className: clsx(`univer-box-border univer-h-8 univer-w-full univer-cursor-pointer univer-items-center univer-rounded-lg univer-bg-white univer-pt-2 univer-transition-colors hover:univer-border-primary-600 dark:!univer-bg-gray-700 dark:!univer-text-white [&>div:first-child]:univer-px-2.5 [&>div]:univer-h-5 [&>div]:univer-ring-transparent`, borderClassName),
      initValue: (_a = value == null ? void 0 : value.formula1) != null ? _a : "=",
      unitId,
      subUnitId,
      isFocus: isFocusFormulaEditor,
      isSupportAcrossSheet: true,
      onChange: (newValue) => {
        const newFormula = (newValue != null ? newValue : "").trim();
        if (newFormula === (value == null ? void 0 : value.formula1)) {
          return;
        }
        onChange == null ? void 0 : onChange({
          ...value,
          formula1: newFormula
        });
      },
      onFocus: () => setIsFocusFormulaEditor(true)
    }
  ) });
}

// ../packages/sheets-data-validation-ui/src/views/components/formula-input/ListFormulaInput.tsx
var import_react8 = __toESM(require_react());
var import_jsx_runtime9 = __toESM(require_jsx_runtime());
var DEFAULT_COLOR_PRESET = [
  "#FFFFFF",
  "#FEE7E7",
  "#FEF0E6",
  "#EFFBD0",
  "#E4F4FE",
  "#E8ECFD",
  "#F1EAFA",
  "#FDE8F3",
  "#E5E5E5",
  "#FDCECE",
  "#FDC49B",
  "#DEF6A2",
  "#9FDAFF",
  "#D0D9FB",
  "#E3D5F6",
  "#FBD0E8",
  "#656565",
  "#FE4B4B",
  "#FF8C51",
  "#8BBB11",
  "#0B9EFB",
  "#3A60F7",
  "#9E6DE3",
  "#F248A6"
];
var ColorSelect = (props) => {
  const { value, onChange, disabled } = props;
  const [open, setOpen] = (0, import_react8.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
    Dropdown,
    {
      align: "start",
      disabled,
      open,
      onOpenChange: setOpen,
      overlay: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        "div",
        {
          className: `univer-box-border univer-grid univer-w-fit univer-grid-cols-6 univer-flex-wrap univer-gap-2 univer-p-1.5`,
          children: DEFAULT_COLOR_PRESET.map(
            (color) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "div",
              {
                className: clsx("univer-box-border univer-size-4 univer-cursor-pointer univer-rounded", borderClassName),
                style: { background: color },
                onClick: () => {
                  onChange(color);
                  setOpen(false);
                }
              },
              color
            )
          )
        }
      ),
      children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
        "div",
        {
          className: clsx(`univer-box-border univer-inline-flex univer-h-8 univer-w-16 univer-cursor-pointer univer-items-center univer-justify-between univer-gap-2 univer-rounded-lg univer-bg-white univer-px-2.5 univer-transition-colors univer-duration-200 hover:univer-border-primary-600 dark:!univer-bg-gray-700 dark:!univer-text-white`, borderClassName),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "div",
              {
                className: "univer-box-border univer-h-4 univer-w-4 univer-rounded univer-text-base",
                style: { background: value }
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(MoreDownIcon, {})
          ]
        }
      )
    }
  );
};
var Template = (props) => {
  const { item, commonProps, className } = props;
  const { onItemChange, onItemDelete } = commonProps;
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: clsx("univer-flex univer-items-center univer-gap-2", className), children: [
    !item.isRef && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: clsx("univer-cursor-move", "draggableHandle"), children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(SequenceIcon, {}) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      ColorSelect,
      {
        value: item.color,
        onChange: (color) => {
          onItemChange(item.id, item.label, color);
        }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      Input,
      {
        disabled: item.isRef,
        value: item.label,
        onChange: (label) => {
          onItemChange(item.id, label, item.color);
        }
      }
    ),
    item.isRef ? null : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      "div",
      {
        className: `univer-ml-1 univer-cursor-pointer univer-rounded univer-text-base hover:univer-bg-gray-200`,
        children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DeleteIcon, { onClick: () => onItemDelete(item.id) })
      }
    )
  ] });
};
function ListFormulaInput(props) {
  const { value, onChange: _onChange = () => {
  }, unitId, subUnitId, validResult, showError, ruleId } = props;
  const { formula1 = "", formula2 = "" } = value || {};
  const [isFormulaStr, setIsFormulaStr] = (0, import_react8.useState)(() => isFormulaString(formula1) ? "1" : "0");
  const [formulaStr, setFormulaStr] = (0, import_react8.useState)(isFormulaStr === "1" ? formula1 : "=");
  const [formulaStrCopy, setFormulaStrCopy] = (0, import_react8.useState)(isFormulaStr === "1" ? formula1 : "=");
  const localeService = useDependency(LocaleService);
  const dataValidatorRegistryService = useDependency(DataValidatorRegistryService);
  const dataValidationModel = useDependency(DataValidationModel);
  const dataValidationFormulaController = useDependency(DataValidationFormulaController);
  const [refColors, setRefColors] = (0, import_react8.useState)(() => formula2.split(","));
  const listValidator = dataValidatorRegistryService.getValidatorItem("list" /* LIST */);
  const [refOptions, setRefOptions] = (0, import_react8.useState)([]);
  const [localError, setLocalError] = (0, import_react8.useState)("");
  const formula1Res = showError ? validResult == null ? void 0 : validResult.formula1 : "";
  const ruleChange$ = (0, import_react8.useMemo)(() => dataValidationModel.ruleChange$.pipe(debounceTime(16)), []);
  const ruleChange = useObservable(ruleChange$);
  const onChange = useEvent(_onChange);
  (0, import_react8.useEffect)(() => {
    (async () => {
      await new Promise((resolve) => {
        setTimeout(() => resolve(true), 100);
      });
      const rule = dataValidationModel.getRuleById(unitId, subUnitId, ruleId);
      const formula12 = rule == null ? void 0 : rule.formula1;
      if (isFormulaString(formula12) && listValidator && rule) {
        const res = await listValidator.getListAsync(rule, unitId, subUnitId);
        setRefOptions(res);
      }
    })();
  }, [dataValidationModel, ruleChange, listValidator, ruleId, subUnitId, unitId]);
  (0, import_react8.useEffect)(() => {
    if (isFormulaString(formula1) && formula1 !== formulaStrCopy) {
      setFormulaStr(formula1);
      setFormulaStrCopy(formulaStrCopy);
    }
  }, [formulaStrCopy, formula1]);
  const [strList, setStrList] = (0, import_react8.useState)(() => {
    const strOptions = isFormulaStr !== "1" ? deserializeListOptions(formula1) : [];
    const strColors = formula2.split(",");
    return strOptions.map((label, i) => ({
      label,
      color: strColors[i] || DROP_DOWN_DEFAULT_COLOR,
      isRef: false,
      id: generateRandomId(4)
    }));
  });
  const handleStrItemChange = (id, value2, color) => {
    const item = strList.find((i) => i.id === id);
    if (!item) {
      return;
    }
    item.label = value2;
    item.color = color;
    setStrList([...strList]);
  };
  const handleStrItemDelete = (id) => {
    const index = strList.findIndex((i) => i.id === id);
    if (index !== -1) {
      strList.splice(index, 1);
      setStrList([...strList]);
    }
  };
  const colorList = formula2.split(",");
  const refFinalList = (0, import_react8.useMemo)(() => refOptions.map((label, i) => ({
    label,
    color: colorList[i] || DROP_DOWN_DEFAULT_COLOR,
    id: `${i}`,
    isRef: true
  })), [colorList, refOptions]);
  const handleRefItemChange = (id, value2, color) => {
    const newColors = [...refColors];
    newColors[+id] = color;
    setRefColors(newColors);
    onChange({
      formula1,
      formula2: newColors.join(",")
    });
  };
  const handleAdd = () => {
    setStrList([
      ...strList,
      {
        label: "",
        color: DROP_DOWN_DEFAULT_COLOR,
        isRef: false,
        id: generateRandomId(4)
      }
    ]);
  };
  (0, import_react8.useEffect)(() => {
    if (isFormulaStr === "1") {
      return;
    }
    const labelSet = /* @__PURE__ */ new Set();
    const finalList = [];
    strList.map((item) => {
      const labelList = item.label.split(",");
      return {
        labelList,
        item
      };
    }).forEach(({ item, labelList }) => {
      labelList.forEach((labelItem) => {
        if (!labelSet.has(labelItem)) {
          labelSet.add(labelItem);
          finalList.push({
            label: labelItem,
            color: item.color
          });
        }
      });
    });
    onChange({
      formula1: serializeListOptions(finalList.map((item) => item.label)),
      formula2: finalList.map((item) => item.color === DROP_DOWN_DEFAULT_COLOR ? "" : item.color).join(",")
    });
  }, [strList, onChange, isFormulaStr, formulaStrCopy, refColors]);
  const updateFormula = useEvent(async (str) => {
    if (!isFormulaString(str)) {
      onChange == null ? void 0 : onChange({
        formula1: "",
        formula2
      });
      return;
    }
    if (dataValidationFormulaController.getFormulaRefCheck(str)) {
      onChange == null ? void 0 : onChange({
        formula1: isFormulaString(str) ? str : "",
        formula2
      });
      setLocalError("");
    } else {
      onChange == null ? void 0 : onChange({
        formula1: "",
        formula2
      });
      setFormulaStr("=");
      setLocalError(localeService.t("dataValidation.validFail.formulaError"));
    }
  });
  const formulaEditorRef = (0, import_react8.useRef)(null);
  const [isFocusFormulaEditor, setIsFocusFormulaEditor] = (0, import_react8.useState)(false);
  useSidebarClick((e) => {
    var _a;
    const isOutSide = (_a = formulaEditorRef.current) == null ? void 0 : _a.isClickOutSide(e);
    isOutSide && setIsFocusFormulaEditor(false);
  });
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(FormLayout, { label: localeService.t("dataValidation.list.options"), children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
      RadioGroup,
      {
        value: isFormulaStr,
        onChange: (v) => {
          setIsFormulaStr(v);
          setFormulaStr(formulaStrCopy);
          if (v === "1") {
            onChange({
              formula1: formulaStrCopy === "=" ? "" : formulaStrCopy,
              formula2: refColors.join(",")
            });
          }
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Radio, { value: "0", children: localeService.t("dataValidation.list.customOptions") }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Radio, { value: "1", children: localeService.t("dataValidation.list.refOptions") })
        ]
      }
    ) }),
    isFormulaStr === "1" ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(FormLayout, { error: formula1Res || localError || void 0, children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        FormulaEditor,
        {
          ref: formulaEditorRef,
          className: clsx(`univer-box-border univer-h-8 univer-w-full univer-cursor-pointer univer-items-center univer-rounded-lg univer-bg-white univer-pt-2 univer-transition-colors hover:univer-border-primary-600 dark:!univer-bg-gray-700 dark:!univer-text-white [&>div:first-child]:univer-px-2.5 [&>div]:univer-h-5 [&>div]:univer-ring-transparent`, borderClassName),
          initValue: formulaStr,
          unitId,
          subUnitId,
          isFocus: isFocusFormulaEditor,
          isSupportAcrossSheet: true,
          onFocus: () => setIsFocusFormulaEditor(true),
          onChange: (v = "") => {
            const str = (v != null ? v : "").trim();
            setFormulaStrCopy(str);
            updateFormula(str);
          }
        }
      ),
      refFinalList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "univer-mt-3", children: refFinalList.map((item) => {
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          Template,
          {
            className: "univer-mb-3",
            item,
            commonProps: { onItemChange: handleRefItemChange }
          },
          item.id
        );
      }) })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(FormLayout, { error: formula1Res, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "-univer-mt-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        DraggableList,
        {
          list: strList,
          onListChange: setStrList,
          rowHeight: 28,
          margin: [0, 12],
          draggableHandle: ".draggableHandle",
          itemRender: (item) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            Template,
            {
              item,
              commonProps: {
                onItemChange: handleStrItemChange,
                onItemDelete: handleStrItemDelete
              }
            },
            item.id
          ),
          idKey: "id"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
        "a",
        {
          className: `univer-text-primary univer-flex univer-w-fit univer-cursor-pointer univer-flex-row univer-items-center univer-rounded univer-p-1 univer-px-2 univer-text-sm hover:univer-bg-primary-50 dark:hover:!univer-bg-gray-800`,
          onClick: handleAdd,
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(IncreaseIcon, { className: "univer-mr-1" }),
            localeService.t("dataValidation.list.add")
          ]
        }
      )
    ] }) })
  ] });
}

// ../packages/sheets-data-validation-ui/src/views/components/formula-input/index.ts
var FORMULA_INPUTS = [
  [
    CUSTOM_FORMULA_INPUT_NAME,
    CustomFormulaInput
  ],
  [
    BASE_FORMULA_INPUT_NAME,
    BaseFormulaInput
  ],
  [
    LIST_FORMULA_INPUT_NAME,
    ListFormulaInput
  ],
  [
    CHECKBOX_FORMULA_INPUT_NAME,
    CheckboxFormulaInput
  ]
];

// ../packages/sheets-data-validation-ui/src/views/components/render-mode/index.tsx
var import_jsx_runtime10 = __toESM(require_jsx_runtime());
var LIST_RENDER_MODE_OPTION_INPUT = "LIST_RENDER_MODE_OPTION_INPUT";
function ListRenderModeInput(props) {
  var _a;
  const { value, onChange } = props;
  const localeService = useDependency(LocaleService);
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(FormLayout, { label: localeService.t("dataValidation.renderMode.label"), children: /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(RadioGroup, { value: `${(_a = value.renderMode) != null ? _a : 2 /* CUSTOM */}`, onChange: (renderMode) => onChange({ ...value, renderMode: +renderMode }), children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Radio, { value: `${2 /* CUSTOM */}`, children: localeService.t("dataValidation.renderMode.chip") }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Radio, { value: `${1 /* ARROW */}`, children: localeService.t("dataValidation.renderMode.arrow") }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Radio, { value: `${0 /* TEXT */}`, children: localeService.t("dataValidation.renderMode.text") })
  ] }) });
}
ListRenderModeInput.componentKey = LIST_RENDER_MODE_OPTION_INPUT;

// ../packages/sheets-data-validation-ui/src/views/components/show-time/index.tsx
var import_jsx_runtime11 = __toESM(require_jsx_runtime());
var DATE_SHOW_TIME_OPTION = "DATE_SHOW_TIME_OPTION";
function DateShowTimeOption(props) {
  var _a;
  const { value, onChange } = props;
  const localeService = useDependency(LocaleService);
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(FormLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    Checkbox,
    {
      checked: (_a = value.bizInfo) == null ? void 0 : _a.showTime,
      onChange: (showTime) => {
        onChange({
          ...value,
          bizInfo: {
            ...value.bizInfo,
            showTime
          }
        });
      },
      children: localeService.t("dataValidation.showTime.label")
    }
  ) });
}
DateShowTimeOption.componentKey = DATE_SHOW_TIME_OPTION;

// ../packages/sheets-data-validation-ui/src/views/widgets/checkbox-widget.ts
var MARGIN_H = 6;
var CheckboxRender = class {
  constructor(_commandService, _univerInstanceService, _formulaService, _themeService, _renderManagerService, _dataValidationModel) {
    this._commandService = _commandService;
    this._univerInstanceService = _univerInstanceService;
    this._formulaService = _formulaService;
    this._themeService = _themeService;
    this._renderManagerService = _renderManagerService;
    this._dataValidationModel = _dataValidationModel;
  }
  _calc(cellInfo, style) {
    var _a, _b, _c;
    const { vt, ht } = style || {};
    const width = cellInfo.endX - cellInfo.startX - MARGIN_H * 2;
    const height = cellInfo.endY - cellInfo.startY;
    const size = ((_a = style == null ? void 0 : style.fs) != null ? _a : 10) * 1.6;
    let widgetLeft = 0;
    let widgetTop = 0;
    switch (vt) {
      case 1 /* TOP */:
        widgetTop = 0;
        break;
      case 3 /* BOTTOM */:
        widgetTop = 0 + (height - size);
        break;
      default:
        widgetTop = 0 + (height - size) / 2;
        break;
    }
    switch (ht) {
      case 1 /* LEFT */:
        widgetLeft = MARGIN_H;
        break;
      case 3 /* RIGHT */:
        widgetLeft = MARGIN_H + (width - size);
        break;
      default:
        widgetLeft = MARGIN_H + (width - size) / 2;
        break;
    }
    return {
      left: cellInfo.startX + widgetLeft,
      top: cellInfo.startY + widgetTop,
      width: ((_b = style == null ? void 0 : style.fs) != null ? _b : 10) * 1.6,
      height: ((_c = style == null ? void 0 : style.fs) != null ? _c : 10) * 1.6
    };
  }
  calcCellAutoHeight(info) {
    var _a;
    const { style } = info;
    return ((_a = style == null ? void 0 : style.fs) != null ? _a : 10) * 1.6;
  }
  calcCellAutoWidth(info) {
    var _a;
    const { style } = info;
    return ((_a = style == null ? void 0 : style.fs) != null ? _a : 10) * 1.6;
  }
  async _parseFormula(rule, unitId, subUnitId) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    const { formula1 = CHECKBOX_FORMULA_1, formula2 = CHECKBOX_FORMULA_2 } = rule;
    const results = await this._formulaService.getRuleFormulaResult(unitId, subUnitId, rule.uid);
    const formulaResult1 = getFormulaResult((_c = (_b = (_a = results == null ? void 0 : results[0]) == null ? void 0 : _a.result) == null ? void 0 : _b[0]) == null ? void 0 : _c[0]);
    const formulaResult2 = getFormulaResult((_f = (_e = (_d = results == null ? void 0 : results[1]) == null ? void 0 : _d.result) == null ? void 0 : _e[0]) == null ? void 0 : _f[0]);
    const isFormulaValid = isLegalFormulaResult(String(formulaResult1)) && isLegalFormulaResult(String(formulaResult2));
    return {
      formula1: isFormulaString(formula1) ? getFormulaResult((_i = (_h = (_g = results == null ? void 0 : results[0]) == null ? void 0 : _g.result) == null ? void 0 : _h[0]) == null ? void 0 : _i[0]) : formula1,
      formula2: isFormulaString(formula2) ? formulaResult2 : formula2,
      isFormulaValid
    };
  }
  drawWith(ctx, info) {
    var _a, _b, _c, _d;
    const { style, primaryWithCoord, unitId, subUnitId, worksheet, row, col } = info;
    const cellBounding = primaryWithCoord.isMergedMainCell ? primaryWithCoord.mergeInfo : primaryWithCoord;
    const value = getCellValueOrigin(worksheet.getCellRaw(row, col));
    const rule = this._dataValidationModel.getRuleByLocation(unitId, subUnitId, row, col);
    if (!rule) {
      return;
    }
    const validator = this._dataValidationModel.getValidator(rule.type);
    if (!validator) {
      return;
    }
    if (!((_a = validator.skipDefaultFontRender) == null ? void 0 : _a.call(validator, rule, value, { unitId, subUnitId, row, column: col }))) {
      return;
    }
    const result = validator.parseFormulaSync(rule, unitId, subUnitId);
    const { formula1 } = result;
    const layout = this._calc(cellBounding, style);
    const { a: scaleX, d: scaleY } = ctx.getTransform();
    const left = fixLineWidthByScale(layout.left, scaleX);
    const top = fixLineWidthByScale(layout.top, scaleY);
    const transform = Transform.create().composeMatrix({
      left,
      top,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      skewX: 0,
      skewY: 0,
      flipX: false,
      flipY: false
    });
    const cellWidth = cellBounding.endX - cellBounding.startX;
    const cellHeight = cellBounding.endY - cellBounding.startY;
    ctx.save();
    ctx.beginPath();
    ctx.rect(cellBounding.startX, cellBounding.startY, cellWidth, cellHeight);
    ctx.clip();
    const m = transform.getMatrix();
    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
    const size = ((_b = style == null ? void 0 : style.fs) != null ? _b : 10) * 1.6;
    const checked = String(value) === String(formula1);
    const defaultColor = this._themeService.getColorFromTheme("primary.600");
    CheckboxShape.drawWith(ctx, {
      checked,
      width: size,
      height: size,
      fill: (_d = (_c = style == null ? void 0 : style.cl) == null ? void 0 : _c.rgb) != null ? _d : defaultColor
    });
    ctx.restore();
  }
  isHit(evt, info) {
    const cellBounding = info.primaryWithCoord.isMergedMainCell ? info.primaryWithCoord.mergeInfo : info.primaryWithCoord;
    const layout = this._calc(cellBounding, info.style);
    const startY = layout.top;
    const endY = layout.top + layout.height;
    const startX = layout.left;
    const endX = layout.left + layout.width;
    const { x: offsetX, y: offsetY } = evt;
    if (offsetX <= endX && offsetX >= startX && offsetY <= endY && offsetY >= startY) {
      return true;
    }
    return false;
  }
  async onPointerDown(info, evt) {
    var _a;
    if (evt.button === 2) {
      return;
    }
    const { primaryWithCoord, unitId, subUnitId, worksheet, row, col } = info;
    const value = getCellValueOrigin(worksheet.getCellRaw(row, col));
    const rule = this._dataValidationModel.getRuleByLocation(unitId, subUnitId, row, col);
    if (!rule) {
      return;
    }
    const validator = this._dataValidationModel.getValidator(rule.type);
    if (!validator) {
      return;
    }
    if (!((_a = validator.skipDefaultFontRender) == null ? void 0 : _a.call(validator, rule, value, { unitId, subUnitId, row, column: col }))) {
      return;
    }
    const { formula1, formula2 } = await this._parseFormula(rule, unitId, subUnitId);
    const params = {
      range: {
        startColumn: primaryWithCoord.actualColumn,
        endColumn: primaryWithCoord.actualColumn,
        startRow: primaryWithCoord.actualRow,
        endRow: primaryWithCoord.actualRow
      },
      value: {
        v: String(value) === transformCheckboxValue(String(formula1)) ? formula2 : formula1,
        p: null
      }
    };
    this._commandService.executeCommand(
      SetRangeValuesCommand.id,
      params
    );
  }
  onPointerEnter(info, evt) {
    var _a, _b;
    (_b = (_a = getCurrentTypeOfRenderer(O.UNIVER_SHEET, this._univerInstanceService, this._renderManagerService)) == null ? void 0 : _a.mainComponent) == null ? void 0 : _b.setCursor("pointer" /* POINTER */);
  }
  onPointerLeave(info, evt) {
    var _a, _b;
    (_b = (_a = getCurrentTypeOfRenderer(O.UNIVER_SHEET, this._univerInstanceService, this._renderManagerService)) == null ? void 0 : _a.mainComponent) == null ? void 0 : _b.setCursor("default" /* DEFAULT */);
  }
};
CheckboxRender = __decorateClass([
  __decorateParam(0, ICommandService),
  __decorateParam(1, IUniverInstanceService),
  __decorateParam(2, Inject(DataValidationFormulaService)),
  __decorateParam(3, Inject(ThemeService)),
  __decorateParam(4, Inject(IRenderManagerService)),
  __decorateParam(5, Inject(SheetDataValidationModel))
], CheckboxRender);

// ../packages/sheets-data-validation-ui/src/views/validator-views/sheet-validator-view.ts
var BaseSheetDataValidatorView = class {
  constructor(injector) {
    this.injector = injector;
    __publicField(this, "canvasRender", null);
    __publicField(this, "dropdownType");
    __publicField(this, "optionsInput");
    __publicField(this, "formulaInput", LIST_FORMULA_INPUT_NAME);
  }
};
BaseSheetDataValidatorView = __decorateClass([
  __decorateParam(0, Inject(Injector))
], BaseSheetDataValidatorView);

// ../packages/sheets-data-validation-ui/src/views/validator-views/checkbox-validator-view.ts
var CheckboxValidatorView = class extends BaseSheetDataValidatorView {
  constructor() {
    super(...arguments);
    __publicField(this, "id", "checkbox" /* CHECKBOX */);
    __publicField(this, "canvasRender", this.injector.createInstance(CheckboxRender));
    __publicField(this, "formulaInput", CHECKBOX_FORMULA_INPUT_NAME);
  }
};

// ../packages/sheets-data-validation-ui/src/views/validator-views/custom-validator-view.ts
var CustomFormulaValidatorView = class extends BaseSheetDataValidatorView {
  constructor() {
    super(...arguments);
    __publicField(this, "id", "custom" /* CUSTOM */);
    __publicField(this, "formulaInput", CUSTOM_FORMULA_INPUT_NAME);
  }
};

// ../packages/sheets-data-validation-ui/src/views/components/formula-input/formula-input.ts
var BASE_FORMULA_INPUT_NAME2 = "data-validation.formula-input";

// ../packages/sheets-data-validation-ui/src/views/validator-views/date-validator-view.ts
var DateValidatorView = class extends BaseSheetDataValidatorView {
  constructor() {
    super(...arguments);
    __publicField(this, "id", "date" /* DATE */);
    __publicField(this, "formulaInput", BASE_FORMULA_INPUT_NAME2);
    __publicField(this, "optionsInput", DateShowTimeOption.componentKey);
    __publicField(this, "dropdownType", "date" /* DATE */);
  }
};

// ../packages/sheets-data-validation-ui/src/views/validator-views/decimal-validator-view.ts
var DecimalValidatorView = class extends BaseSheetDataValidatorView {
  constructor() {
    super(...arguments);
    __publicField(this, "id", "decimal" /* DECIMAL */);
    __publicField(this, "formulaInput", BASE_FORMULA_INPUT_NAME);
  }
};

// ../packages/sheets-data-validation-ui/src/views/widgets/shape/layout.ts
var PADDING_H = 4;
var PADDING_V = 0;
var MARGIN_H2 = 4;
var MARGIN_V = 4;
var CELL_PADDING_H = 6;
var CELL_PADDING_V = 6;
var ICON_PLACE = 14;
function getDropdownItemSize(text, fontStyle) {
  const bBox = FontCache.getTextSize(text, fontStyle);
  const rectWidth = bBox.width + PADDING_H * 2;
  const { ba, bd } = bBox;
  const height = ba + bd;
  return {
    width: rectWidth,
    height: height + PADDING_V * 2,
    ba
  };
}
function layoutDropdowns(items, fontStyle, cellWidth, cellHeight) {
  const cellPaddingH = ICON_PLACE + CELL_PADDING_H * 2;
  const widthAvailableForContent = cellWidth - cellPaddingH;
  const heightAvailableForContent = cellHeight - CELL_PADDING_V * 2;
  const textLayout = items.map((item) => ({
    layout: getDropdownItemSize(item, fontStyle),
    text: item
  }));
  let currentLine;
  const lines = [];
  textLayout.forEach((item) => {
    const { layout } = item;
    const { width, height } = layout;
    if (!currentLine || currentLine.width + width + MARGIN_H2 > widthAvailableForContent) {
      currentLine = {
        width,
        height,
        items: [{
          ...item,
          left: 0
        }]
      };
      lines.push(currentLine);
    } else {
      currentLine.items.push({
        ...item,
        left: currentLine.width + MARGIN_H2
      });
      currentLine.width = currentLine.width + width + MARGIN_H2;
    }
  });
  let totalHeight = 0;
  let maxLineWidth = 0;
  lines.forEach((line, index) => {
    maxLineWidth = Math.max(maxLineWidth, line.width);
    if (index === lines.length - 1) {
      totalHeight += line.height;
    } else {
      totalHeight += line.height + MARGIN_V;
    }
  });
  return {
    lines,
    totalHeight,
    contentWidth: widthAvailableForContent,
    contentHeight: heightAvailableForContent,
    cellAutoHeight: totalHeight + CELL_PADDING_V * 2,
    calcAutoWidth: maxLineWidth + cellPaddingH
  };
}

// ../packages/sheets-data-validation-ui/src/views/widgets/shape/dropdown.ts
var RADIUS = 8;
var Dropdown2 = class extends Shape {
  static drawWith(ctx, props) {
    const { fontString, info, fill, color } = props;
    const { layout, text } = info;
    ctx.save();
    Rect.drawWith(ctx, {
      width: layout.width,
      height: layout.height,
      radius: RADIUS,
      fill: fill || DROP_DOWN_DEFAULT_COLOR
    });
    ctx.translateWithPrecision(PADDING_H, layout.ba);
    ctx.font = fontString;
    ctx.fillStyle = color;
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }
};

// ../packages/sheets-data-validation-ui/src/views/widgets/dropdown-multiple-widget.ts
var downPath = new Path2D("M3.32201 4.84556C3.14417 5.05148 2.85583 5.05148 2.67799 4.84556L0.134292 1.90016C-0.152586 1.56798 0.0505937 1 0.456301 1L5.5437 1C5.94941 1 6.15259 1.56798 5.86571 1.90016L3.32201 4.84556Z");
var DropdownMultipleWidget = class {
  constructor(_commandService, _univerInstanceService, _renderManagerService, _dataValidationModel) {
    this._commandService = _commandService;
    this._univerInstanceService = _univerInstanceService;
    this._renderManagerService = _renderManagerService;
    this._dataValidationModel = _dataValidationModel;
    __publicField(this, "zIndex");
    __publicField(this, "_dropdownInfoMap", /* @__PURE__ */ new Map());
  }
  _ensureMap(subUnitId) {
    let map = this._dropdownInfoMap.get(subUnitId);
    if (!map) {
      map = /* @__PURE__ */ new Map();
      this._dropdownInfoMap.set(subUnitId, map);
    }
    return map;
  }
  _generateKey(row, col) {
    return `${row}.${col}`;
  }
  _drawDownIcon(ctx, cellBounding, cellWidth, cellHeight, vt) {
    const left = cellWidth - ICON_PLACE + 4;
    let top = 4;
    switch (vt) {
      case 2 /* MIDDLE */:
        top = (cellHeight - ICON_PLACE) / 2 + 4;
        break;
      case 3 /* BOTTOM */:
        top = cellHeight - ICON_PLACE + 4;
        break;
      default:
        break;
    }
    ctx.save();
    ctx.translateWithPrecision(cellBounding.startX + left, cellBounding.startY + top);
    ctx.fillStyle = "#565656";
    ctx.fill(downPath);
    ctx.restore();
  }
  // eslint-disable-next-line max-lines-per-function
  drawWith(ctx, info, skeleton, spreadsheets) {
    var _a, _b;
    const { primaryWithCoord, row, col, style, data, subUnitId } = info;
    const _cellBounding = primaryWithCoord.isMergedMainCell ? primaryWithCoord.mergeInfo : primaryWithCoord;
    const fontRenderExtension = data == null ? void 0 : data.fontRenderExtension;
    const { leftOffset = 0, rightOffset = 0, topOffset = 0, downOffset = 0 } = fontRenderExtension || {};
    const map = this._ensureMap(subUnitId);
    const key = this._generateKey(row, col);
    const _row = primaryWithCoord.isMergedMainCell ? primaryWithCoord.mergeInfo.startRow : row;
    const _col = primaryWithCoord.isMergedMainCell ? primaryWithCoord.mergeInfo.startColumn : col;
    const rule = this._dataValidationModel.getRuleByLocation(info.unitId, info.subUnitId, _row, _col);
    if (!rule) {
      return;
    }
    const validator = this._dataValidationModel.getValidator(rule.type);
    if (!validator) {
      return;
    }
    const cellBounding = {
      startX: _cellBounding.startX + leftOffset,
      endX: _cellBounding.endX - rightOffset,
      startY: _cellBounding.startY + topOffset,
      endY: _cellBounding.endY - downOffset
    };
    const cellWidth = cellBounding.endX - cellBounding.startX;
    const cellHeight = cellBounding.endY - cellBounding.startY;
    const { cl } = style || {};
    const color = (_a = typeof cl === "object" ? cl == null ? void 0 : cl.rgb : cl) != null ? _a : "#000";
    const fontStyle = getFontStyleString(style != null ? style : void 0);
    const { vt: _vt, ht } = style || {};
    const vt = _vt != null ? _vt : 2 /* MIDDLE */;
    const cellValue = (_b = getCellValueOrigin(data)) != null ? _b : "";
    const items = validator.parseCellValue(cellValue);
    const labelColorMap = validator.getListWithColorMap(rule);
    const layout = layoutDropdowns(items, fontStyle, cellWidth, cellHeight);
    this._drawDownIcon(ctx, cellBounding, cellWidth, cellHeight, vt);
    ctx.save();
    ctx.translateWithPrecision(cellBounding.startX, cellBounding.startY);
    ctx.beginPath();
    ctx.rect(0, 0, cellWidth - ICON_PLACE, cellHeight);
    ctx.clip();
    ctx.translateWithPrecision(CELL_PADDING_H, CELL_PADDING_V);
    let top = 0;
    switch (vt) {
      case 2 /* MIDDLE */:
        top = (layout.contentHeight - layout.totalHeight) / 2;
        break;
      case 3 /* BOTTOM */:
        top = layout.contentHeight - layout.totalHeight;
        break;
      default:
        break;
    }
    ctx.translateWithPrecision(0, top);
    layout.lines.forEach((line, index) => {
      ctx.save();
      const { width, height, items: items2 } = line;
      let left = 0;
      switch (ht) {
        case 3 /* RIGHT */:
          left = layout.contentWidth - width;
          break;
        case 2 /* CENTER */:
          left = (layout.contentWidth - width) / 2;
          break;
        default:
          break;
      }
      ctx.translate(left, index * (height + MARGIN_V));
      items2.forEach((item) => {
        ctx.save();
        ctx.translateWithPrecision(item.left, 0);
        Dropdown2.drawWith(ctx, {
          ...fontStyle,
          info: item,
          color,
          fill: labelColorMap[item.text]
        });
        ctx.restore();
      });
      ctx.restore();
    });
    ctx.restore();
    map.set(key, {
      left: cellBounding.startX,
      top: cellBounding.startY,
      width: layout.contentWidth + CELL_PADDING_H + ICON_PLACE,
      height: layout.contentHeight + CELL_PADDING_V * 2
    });
  }
  calcCellAutoHeight(info) {
    var _a;
    const { primaryWithCoord, style, data, row, col } = info;
    const fontRenderExtension = data == null ? void 0 : data.fontRenderExtension;
    const { leftOffset = 0, rightOffset = 0, topOffset = 0, downOffset = 0 } = fontRenderExtension || {};
    const _cellBounding = primaryWithCoord.isMergedMainCell ? primaryWithCoord.mergeInfo : primaryWithCoord;
    const cellBounding = {
      startX: _cellBounding.startX + leftOffset,
      endX: _cellBounding.endX - rightOffset,
      startY: _cellBounding.startY + topOffset,
      endY: _cellBounding.endY - downOffset
    };
    const rule = this._dataValidationModel.getRuleByLocation(info.unitId, info.subUnitId, row, col);
    if (!rule) {
      return;
    }
    const validator = this._dataValidationModel.getValidator(rule.type);
    if (!validator) {
      return;
    }
    const cellWidth = cellBounding.endX - cellBounding.startX;
    const cellHeight = cellBounding.endY - cellBounding.startY;
    const cellValue = (_a = getCellValueOrigin(data)) != null ? _a : "";
    const items = validator.parseCellValue(cellValue);
    const fontStyle = getFontStyleString(style != null ? style : void 0);
    const layout = layoutDropdowns(items, fontStyle, cellWidth, cellHeight);
    return layout.cellAutoHeight;
  }
  calcCellAutoWidth(info) {
    var _a;
    const { primaryWithCoord, style, data, row, col } = info;
    const fontRenderExtension = data == null ? void 0 : data.fontRenderExtension;
    const { leftOffset = 0, rightOffset = 0, topOffset = 0, downOffset = 0 } = fontRenderExtension || {};
    const _cellBounding = primaryWithCoord.isMergedMainCell ? primaryWithCoord.mergeInfo : primaryWithCoord;
    const cellBounding = {
      startX: _cellBounding.startX + leftOffset,
      endX: _cellBounding.endX - rightOffset,
      startY: _cellBounding.startY + topOffset,
      endY: _cellBounding.endY - downOffset
    };
    const rule = this._dataValidationModel.getRuleByLocation(info.unitId, info.subUnitId, row, col);
    if (!rule) {
      return;
    }
    const validator = this._dataValidationModel.getValidator(rule.type);
    if (!validator) {
      return;
    }
    const cellWidth = cellBounding.endX - cellBounding.startX;
    const cellHeight = cellBounding.endY - cellBounding.startY;
    const cellValue = (_a = getCellValueOrigin(data)) != null ? _a : "";
    const items = validator.parseCellValue(cellValue);
    const fontStyle = getFontStyleString(style != null ? style : void 0);
    const layout = layoutDropdowns(items, fontStyle, cellWidth, cellHeight);
    return layout.calcAutoWidth;
  }
  isHit(position, info) {
    const { primaryWithCoord } = info;
    const cellBounding = primaryWithCoord.isMergedMainCell ? primaryWithCoord.mergeInfo : primaryWithCoord;
    const { endX } = cellBounding;
    const { x } = position;
    if (x >= endX - ICON_PLACE && x <= endX) {
      return true;
    }
    return false;
  }
  onPointerDown(info, evt) {
    if (evt.button === 2) {
      return;
    }
    const { unitId, subUnitId, row, col } = info;
    const params = {
      unitId,
      subUnitId,
      row,
      column: col
    };
    this._commandService.executeCommand(ShowDataValidationDropdown.id, params);
  }
  onPointerEnter(info, evt) {
    var _a, _b;
    return (_b = (_a = getCurrentTypeOfRenderer(O.UNIVER_SHEET, this._univerInstanceService, this._renderManagerService)) == null ? void 0 : _a.mainComponent) == null ? void 0 : _b.setCursor("pointer" /* POINTER */);
  }
  onPointerLeave(info, evt) {
    var _a, _b;
    return (_b = (_a = getCurrentTypeOfRenderer(O.UNIVER_SHEET, this._univerInstanceService, this._renderManagerService)) == null ? void 0 : _a.mainComponent) == null ? void 0 : _b.setCursor("default" /* DEFAULT */);
  }
};
DropdownMultipleWidget = __decorateClass([
  __decorateParam(0, ICommandService),
  __decorateParam(1, IUniverInstanceService),
  __decorateParam(2, Inject(IRenderManagerService)),
  __decorateParam(3, Inject(SheetDataValidationModel))
], DropdownMultipleWidget);

// ../packages/sheets-data-validation-ui/src/views/validator-views/list-multiple-view.ts
var ListMultipleValidatorView = class extends BaseSheetDataValidatorView {
  constructor() {
    super(...arguments);
    __publicField(this, "id", "listMultiple" /* LIST_MULTIPLE */);
    __publicField(this, "canvasRender", this.injector.createInstance(DropdownMultipleWidget));
    __publicField(this, "dropdownType", "multipleList" /* MULTIPLE_LIST */);
  }
};

// ../packages/sheets-data-validation-ui/src/views/widgets/dropdown-widget.ts
var PADDING_H2 = 4;
var ICON_SIZE = 4;
var ICON_PLACE2 = 14;
var PADDING_V2 = 1;
var MARGIN_H3 = 6;
var MARGIN_V2 = 3;
var RADIUS_BG = 8;
var DROP_DOWN_ICON_COLOR = "#565656";
var downPath2 = new Path2D("M3.32201 4.84556C3.14417 5.05148 2.85583 5.05148 2.67799 4.84556L0.134292 1.90016C-0.152586 1.56798 0.0505937 1 0.456301 1L5.5437 1C5.94941 1 6.15259 1.56798 5.86571 1.90016L3.32201 4.84556Z");
function calcPadding(cellWidth, cellHeight, fontWidth, fontHeight, vt, ht, margin = true) {
  let paddingTop = 0;
  const realMargin = margin ? MARGIN_V2 : 0;
  switch (vt) {
    case 3 /* BOTTOM */:
      paddingTop = cellHeight - fontHeight - realMargin;
      break;
    case 2 /* MIDDLE */:
      paddingTop = (cellHeight - fontHeight) / 2;
      break;
    default:
      paddingTop = realMargin;
      break;
  }
  paddingTop = Math.max(MARGIN_V2, paddingTop);
  let paddingLeft = 0;
  switch (ht) {
    case 2 /* CENTER */:
      paddingLeft = (cellWidth - fontWidth) / 2;
      break;
    case 3 /* RIGHT */:
      paddingLeft = cellWidth - fontWidth;
      break;
    default:
      break;
  }
  paddingLeft = Math.max(MARGIN_H3, paddingLeft);
  return {
    paddingLeft,
    paddingTop
  };
}
var DropdownWidget = class {
  constructor(_univerInstanceService, _localeService, _commandService, _renderManagerService, _dataValidationModel) {
    this._univerInstanceService = _univerInstanceService;
    this._localeService = _localeService;
    this._commandService = _commandService;
    this._renderManagerService = _renderManagerService;
    this._dataValidationModel = _dataValidationModel;
    __publicField(this, "_dropdownInfoMap", /* @__PURE__ */ new Map());
    __publicField(this, "zIndex");
  }
  _ensureMap(subUnitId) {
    let map = this._dropdownInfoMap.get(subUnitId);
    if (!map) {
      map = /* @__PURE__ */ new Map();
      this._dropdownInfoMap.set(subUnitId, map);
    }
    return map;
  }
  _generateKey(row, col) {
    return `${row}.${col}`;
  }
  _drawDownIcon(ctx, cellBounding, cellWidth, cellHeight, fontHeight, vt, pd) {
    const { t = DEFAULT_STYLES.pd.t, b = DEFAULT_STYLES.pd.b } = pd;
    const left = cellWidth - ICON_PLACE2;
    let top;
    switch (vt) {
      case 2 /* MIDDLE */:
        top = (cellHeight - ICON_SIZE) / 2;
        break;
      case 3 /* BOTTOM */:
        top = cellHeight - b - fontHeight - MARGIN_V2 + (fontHeight / 2 - ICON_SIZE / 2);
        break;
      default:
        top = t + MARGIN_V2 + (fontHeight / 2 - ICON_SIZE / 2);
        break;
    }
    ctx.save();
    ctx.translateWithPrecision(cellBounding.startX + left, cellBounding.startY + top);
    ctx.fillStyle = "#565656";
    ctx.fill(downPath2);
    ctx.restore();
  }
  // eslint-disable-next-line max-lines-per-function, complexity
  drawWith(ctx, info, skeleton) {
    var _a, _b, _c, _d, _e, _f;
    const { primaryWithCoord, row, col, style, data, subUnitId } = info;
    const _cellBounding = primaryWithCoord.isMergedMainCell ? primaryWithCoord.mergeInfo : primaryWithCoord;
    const _row = primaryWithCoord.isMergedMainCell ? primaryWithCoord.mergeInfo.startRow : row;
    const _col = primaryWithCoord.isMergedMainCell ? primaryWithCoord.mergeInfo.startColumn : col;
    const rule = this._dataValidationModel.getRuleByLocation(info.unitId, info.subUnitId, _row, _col);
    if (!rule) {
      return;
    }
    const validator = this._dataValidationModel.getValidator(rule.type);
    if (!validator) {
      return;
    }
    const fontRenderExtension = data == null ? void 0 : data.fontRenderExtension;
    const { leftOffset = 0, rightOffset = 0, topOffset = 0, downOffset = 0 } = fontRenderExtension || {};
    if (!rule || !validator || !validator || validator.id.indexOf("list" /* LIST */) !== 0) {
      return;
    }
    if (!validator.skipDefaultFontRender(rule)) {
      return;
    }
    const cellBounding = {
      startX: _cellBounding.startX + leftOffset,
      endX: _cellBounding.endX - rightOffset,
      startY: _cellBounding.startY + topOffset,
      endY: _cellBounding.endY - downOffset
    };
    const cellWidth = cellBounding.endX - cellBounding.startX;
    const cellHeight = cellBounding.endY - cellBounding.startY;
    const map = this._ensureMap(subUnitId);
    const key = this._generateKey(row, col);
    const colorMap = validator.getListWithColorMap(rule);
    const value = getCellValueOrigin(data);
    const valueStr = `${value != null ? value : ""}`;
    const activeColor = colorMap[valueStr];
    let { tb, vt, ht, pd } = style || {};
    tb = tb != null ? tb : 3 /* WRAP */;
    vt = vt != null ? vt : 3 /* BOTTOM */;
    ht = ht != null ? ht : DEFAULT_STYLES.ht;
    pd = pd != null ? pd : DEFAULT_STYLES.pd;
    const fontStyle = getFontStyleString(style).fontCache;
    if (rule.renderMode === 1 /* ARROW */) {
      const { l = DEFAULT_STYLES.pd.l, t = DEFAULT_STYLES.pd.t, r = DEFAULT_STYLES.pd.r, b = DEFAULT_STYLES.pd.b } = pd;
      const realWidth = cellWidth - l - r - ICON_PLACE2 - 4;
      const textSkeleton = new DocSimpleSkeleton(
        valueStr,
        fontStyle,
        Boolean(tb === 3 /* WRAP */),
        realWidth,
        Infinity
      );
      textSkeleton.calculate();
      const fontWidth = textSkeleton.getTotalWidth();
      const fontHeight = textSkeleton.getTotalHeight();
      const { paddingTop, paddingLeft } = calcPadding(realWidth, cellHeight - t - b, fontWidth, fontHeight, vt, ht, true);
      this._drawDownIcon(ctx, cellBounding, cellWidth, cellHeight, fontHeight, vt, pd);
      ctx.save();
      ctx.translateWithPrecision(cellBounding.startX + l, cellBounding.startY + t);
      ctx.beginPath();
      ctx.rect(0, 0, cellWidth - l - r, cellHeight - t - b);
      ctx.clip();
      ctx.translateWithPrecision(0, paddingTop);
      ctx.save();
      ctx.translateWithPrecision(paddingLeft, 0);
      ctx.beginPath();
      ctx.rect(0, 0, realWidth, fontHeight);
      ctx.clip();
      Text.drawWith(ctx, {
        text: valueStr,
        fontStyle,
        width: realWidth,
        height: fontHeight,
        color: (_a = style == null ? void 0 : style.cl) == null ? void 0 : _a.rgb,
        strokeLine: Boolean((_b = style == null ? void 0 : style.st) == null ? void 0 : _b.s),
        underline: Boolean((_c = style == null ? void 0 : style.ul) == null ? void 0 : _c.s),
        warp: tb === 3 /* WRAP */,
        hAlign: 1 /* LEFT */
      }, textSkeleton);
      ctx.restore();
      ctx.restore();
      map.set(key, {
        left: cellBounding.endX - ICON_PLACE2 + skeleton.rowHeaderWidth,
        top: cellBounding.startY + t + skeleton.columnHeaderHeight,
        width: ICON_PLACE2,
        height: cellHeight - t - b
      });
    } else {
      ctx.save();
      ctx.translateWithPrecision(cellBounding.startX, cellBounding.startY);
      ctx.beginPath();
      ctx.rect(0, 0, cellWidth, cellHeight);
      ctx.clip();
      const realWidth = cellWidth - MARGIN_H3 * 2 - PADDING_H2 - ICON_PLACE2 - 4;
      const textSkeleton = new DocSimpleSkeleton(
        valueStr,
        fontStyle,
        Boolean(tb === 3 /* WRAP */),
        realWidth,
        Infinity
      );
      textSkeleton.calculate();
      const fontWidth = textSkeleton.getTotalWidth();
      const fontHeight = textSkeleton.getTotalHeight();
      const rectHeight = fontHeight + PADDING_V2 * 2;
      const rectWidth = Math.max(cellWidth - MARGIN_H3 * 2, 1);
      const { paddingTop } = calcPadding(rectWidth, cellHeight, fontWidth, rectHeight, vt, ht);
      ctx.translateWithPrecision(MARGIN_H3, paddingTop);
      Rect.drawWith(ctx, {
        width: rectWidth,
        height: rectHeight,
        fill: activeColor || DROP_DOWN_DEFAULT_COLOR,
        radius: RADIUS_BG
      });
      ctx.save();
      ctx.translateWithPrecision(PADDING_H2, PADDING_V2);
      ctx.beginPath();
      ctx.rect(0, 0, realWidth, fontHeight);
      ctx.clip();
      Text.drawWith(ctx, {
        text: valueStr,
        fontStyle,
        width: realWidth,
        height: fontHeight,
        color: (_d = style == null ? void 0 : style.cl) == null ? void 0 : _d.rgb,
        strokeLine: Boolean((_e = style == null ? void 0 : style.st) == null ? void 0 : _e.s),
        underline: Boolean((_f = style == null ? void 0 : style.ul) == null ? void 0 : _f.s),
        warp: tb === 3 /* WRAP */,
        hAlign: 1 /* LEFT */
      }, textSkeleton);
      ctx.restore();
      ctx.translateWithPrecision(realWidth + PADDING_H2 + 4, (fontHeight - ICON_SIZE) / 2);
      ctx.fillStyle = DROP_DOWN_ICON_COLOR;
      ctx.fill(downPath2);
      ctx.restore();
      map.set(key, {
        left: cellBounding.startX + MARGIN_H3 + skeleton.rowHeaderWidth,
        top: cellBounding.startY + paddingTop + skeleton.columnHeaderHeight,
        width: rectWidth,
        height: rectHeight
      });
    }
  }
  calcCellAutoHeight(info) {
    const { primaryWithCoord, style, data, row, col } = info;
    const _cellBounding = primaryWithCoord.isMergedMainCell ? primaryWithCoord.mergeInfo : primaryWithCoord;
    const fontRenderExtension = data == null ? void 0 : data.fontRenderExtension;
    const { leftOffset = 0, rightOffset = 0, topOffset = 0, downOffset = 0 } = fontRenderExtension || {};
    const rule = this._dataValidationModel.getRuleByLocation(info.unitId, info.subUnitId, row, col);
    if (!rule) {
      return;
    }
    if (rule.renderMode === 0 /* TEXT */) {
      return void 0;
    }
    const cellBounding = {
      startX: _cellBounding.startX + leftOffset,
      endX: _cellBounding.endX - rightOffset,
      startY: _cellBounding.startY + topOffset,
      endY: _cellBounding.endY - downOffset
    };
    const cellWidth = cellBounding.endX - cellBounding.startX;
    const value = getCellValueOrigin(data);
    const valueStr = `${value != null ? value : ""}`;
    let { tb, pd } = style || {};
    const { t = DEFAULT_STYLES.pd.t, b = DEFAULT_STYLES.pd.b } = pd != null ? pd : {};
    tb = tb != null ? tb : 3 /* WRAP */;
    if (rule.renderMode === 1 /* ARROW */) {
      const { l = DEFAULT_STYLES.pd.l, r = DEFAULT_STYLES.pd.r } = pd != null ? pd : {};
      const realWidth = cellWidth - l - r - ICON_PLACE2 - 4;
      const skeleton = new DocSimpleSkeleton(
        valueStr,
        getFontStyleString(style).fontCache,
        Boolean(tb === 3 /* WRAP */),
        realWidth,
        Infinity
      );
      skeleton.calculate();
      return skeleton.getTotalHeight() + t + b + MARGIN_V2 * 2;
    } else {
      const realWidth = Math.max(cellWidth - MARGIN_H3 * 2 - PADDING_H2 - ICON_PLACE2 - 4, 10);
      const skeleton = new DocSimpleSkeleton(
        valueStr,
        getFontStyleString(style).fontCache,
        Boolean(tb === 3 /* WRAP */),
        realWidth,
        Infinity
      );
      skeleton.calculate();
      return skeleton.getTotalHeight() + MARGIN_V2 * 2 + PADDING_V2 * 2;
    }
  }
  calcCellAutoWidth(info) {
    const { primaryWithCoord, style, data, row, col } = info;
    const cellRange = primaryWithCoord.isMergedMainCell ? primaryWithCoord.mergeInfo : primaryWithCoord;
    const fontRenderExtension = data == null ? void 0 : data.fontRenderExtension;
    const { leftOffset = 0, rightOffset = 0, topOffset = 0, downOffset = 0 } = fontRenderExtension || {};
    const rule = this._dataValidationModel.getRuleByLocation(info.unitId, info.subUnitId, row, col);
    if (!rule) {
      return;
    }
    if (rule.renderMode === 0 /* TEXT */) {
      return;
    }
    const cellBounding = {
      startX: cellRange.startX + leftOffset,
      endX: cellRange.endX - rightOffset,
      startY: cellRange.startY + topOffset,
      endY: cellRange.endY - downOffset
    };
    const cellWidth = cellBounding.endX - cellBounding.startX;
    const value = getCellValueOrigin(data);
    const valueStr = `${value != null ? value : ""}`;
    let { tb, pd } = style || {};
    const { l = DEFAULT_STYLES.pd.l, r = DEFAULT_STYLES.pd.r } = pd != null ? pd : {};
    tb = tb != null ? tb : 3 /* WRAP */;
    let paddingAll = MARGIN_H3 * 2 + ICON_PLACE2;
    switch (rule.renderMode) {
      case 1 /* ARROW */:
        paddingAll = ICON_PLACE2 + 4 + r + l;
        break;
      case 2 /* CUSTOM */:
        paddingAll = ICON_PLACE2 + MARGIN_H3 * 2 + PADDING_H2 * 2 + r + l + RADIUS_BG / 2 + 1;
        break;
      // default is CUSTOM
      default:
        paddingAll = ICON_PLACE2 + MARGIN_H3 * 2 + PADDING_H2 * 2 + r + l + RADIUS_BG / 2 + 1;
    }
    const widthForTextLayout = cellWidth - paddingAll;
    const skeleton = new DocSimpleSkeleton(
      valueStr,
      getFontStyleString(style).fontCache,
      Boolean(tb === 3 /* WRAP */),
      widthForTextLayout,
      Infinity
    );
    skeleton.calculate();
    return skeleton.getTotalWidth() + paddingAll;
  }
  isHit(position, info) {
    const { subUnitId, row, col } = info;
    const map = this._ensureMap(subUnitId);
    const dropdownInfo = map.get(this._generateKey(row, col));
    const rule = this._dataValidationModel.getRuleByLocation(info.unitId, info.subUnitId, row, col);
    if (!rule) {
      return false;
    }
    if (!dropdownInfo) {
      return false;
    }
    if (rule.renderMode === 0 /* TEXT */) {
      return false;
    }
    const { top, left, width, height } = dropdownInfo;
    const { x, y } = position;
    if (x >= left && x <= left + width && y >= top && y <= top + height) {
      return true;
    }
    return false;
  }
  onPointerDown(info, evt) {
    if (evt.button === 2) {
      return;
    }
    const { unitId, subUnitId, row, col } = info;
    const params = {
      unitId,
      subUnitId,
      row,
      column: col
    };
    this._commandService.executeCommand(ShowDataValidationDropdown.id, params);
  }
  onPointerEnter(_info, _evt) {
    var _a, _b;
    (_b = (_a = getCurrentTypeOfRenderer(O.UNIVER_SHEET, this._univerInstanceService, this._renderManagerService)) == null ? void 0 : _a.mainComponent) == null ? void 0 : _b.setCursor("pointer" /* POINTER */);
  }
  onPointerLeave(_info, _evt) {
    var _a, _b;
    (_b = (_a = getCurrentTypeOfRenderer(O.UNIVER_SHEET, this._univerInstanceService, this._renderManagerService)) == null ? void 0 : _a.mainComponent) == null ? void 0 : _b.setCursor("default" /* DEFAULT */);
  }
};
DropdownWidget = __decorateClass([
  __decorateParam(0, IUniverInstanceService),
  __decorateParam(1, Inject(LocaleService)),
  __decorateParam(2, ICommandService),
  __decorateParam(3, Inject(IRenderManagerService)),
  __decorateParam(4, Inject(SheetDataValidationModel))
], DropdownWidget);

// ../packages/sheets-data-validation-ui/src/views/validator-views/list-validator-view.ts
var ListValidatorView = class extends BaseSheetDataValidatorView {
  constructor() {
    super(...arguments);
    __publicField(this, "id", "list" /* LIST */);
    __publicField(this, "canvasRender", this.injector.createInstance(DropdownWidget));
    __publicField(this, "dropdownType", "list" /* LIST */);
    __publicField(this, "optionsInput", ListRenderModeInput.componentKey);
    __publicField(this, "formulaInput", LIST_FORMULA_INPUT_NAME);
  }
};

// ../packages/sheets-data-validation-ui/src/views/validator-views/text-length-validator.view.ts
var TextLengthValidatorView = class extends BaseSheetDataValidatorView {
  constructor() {
    super(...arguments);
    __publicField(this, "id", "textLength" /* TEXT_LENGTH */);
    __publicField(this, "formulaInput", BASE_FORMULA_INPUT_NAME);
  }
};

// ../packages/sheets-data-validation-ui/src/views/validator-views/whole-validator-view.ts
var WholeValidatorView = class extends BaseSheetDataValidatorView {
  constructor() {
    super(...arguments);
    __publicField(this, "id", "whole" /* WHOLE */);
    __publicField(this, "formulaInput", BASE_FORMULA_INPUT_NAME);
  }
};

// ../packages/sheets-data-validation-ui/src/controllers/dv-ui.controller.ts
var SheetsDataValidationUIController = class extends RxDisposable {
  constructor(_injector, _componentManger, _dataValidatorRegistryService) {
    super();
    this._injector = _injector;
    this._componentManger = _componentManger;
    this._dataValidatorRegistryService = _dataValidatorRegistryService;
    this._initComponents();
    this._registerValidatorViews();
  }
  _initComponents() {
    [
      ["DataValidationIcon", DataValidationIcon],
      [DATA_VALIDATION_PANEL, DataValidationPanel],
      [ListRenderModeInput.componentKey, ListRenderModeInput],
      [DateShowTimeOption.componentKey, DateShowTimeOption],
      ...FORMULA_INPUTS
    ].forEach(([key, comp]) => {
      this.disposeWithMe(this._componentManger.register(
        key,
        comp
      ));
    });
  }
  _registerValidatorViews() {
    [
      DecimalValidatorView,
      WholeValidatorView,
      TextLengthValidatorView,
      DateValidatorView,
      CheckboxValidatorView,
      ListValidatorView,
      ListMultipleValidatorView,
      CustomFormulaValidatorView
    ].forEach((v) => {
      const view = this._injector.createInstance(v);
      const validator = this._dataValidatorRegistryService.getValidatorItem(view.id);
      if (validator) {
        validator.formulaInput = view.formulaInput;
        validator.canvasRender = view.canvasRender;
        validator.dropdownType = view.dropdownType;
        validator.optionsInput = view.optionsInput;
      }
    });
  }
};
SheetsDataValidationUIController = __decorateClass([
  __decorateParam(0, Inject(Injector)),
  __decorateParam(1, Inject(ComponentManager)),
  __decorateParam(2, Inject(DataValidatorRegistryService))
], SheetsDataValidationUIController);

// ../packages/sheets-data-validation-ui/src/mobile-plugin.ts
var PLUGIN_NAME = "SHEET_DATA_VALIDATION_UI_PLUGIN";
var UniverSheetsDataValidationMobileUIPlugin = class extends Plugin {
  constructor(_config = defaultPluginConfig, _injector, _commandService, _configService) {
    super();
    this._config = _config;
    this._injector = _injector;
    this._commandService = _commandService;
    this._configService = _configService;
    const { menu, ...rest } = merge_default(
      {},
      defaultPluginConfig,
      this._config
    );
    if (menu) {
      this._configService.setConfig("menu", menu, { merge: true });
    }
    this._configService.setConfig(SHEETS_DATA_VALIDATION_UI_PLUGIN_CONFIG_KEY, rest);
  }
  onStarting() {
    [
      [DataValidationPanelService],
      [DataValidationDropdownManagerService],
      [DataValidationAlertController],
      [DataValidationAutoFillController],
      [SheetsDataValidationRenderController],
      [DataValidationPermissionController],
      [DataValidationCopyPasteController],
      [SheetsDataValidationUIController]
    ].forEach((dep) => {
      this._injector.add(dep);
    });
    [
      AddSheetDataValidationAndOpenCommand,
      ShowDataValidationDropdown,
      HideDataValidationDropdown,
      CloseValidationPanelOperation,
      OpenValidationPanelOperation,
      ToggleValidationPanelOperation
    ].forEach((command) => {
      this._commandService.registerCommand(command);
    });
  }
  onReady() {
    this._injector.get(DataValidationCopyPasteController);
    this._injector.get(DataValidationPermissionController);
    const renderManager = this._injector.get(IRenderManagerService);
    renderManager.registerRenderModule(
      O.UNIVER_SHEET,
      [SheetsDataValidationReRenderController]
    );
  }
  onRendered() {
    this._injector.get(SheetsDataValidationUIController);
    this._injector.get(SheetsDataValidationRenderController);
  }
  onSteady() {
    this._injector.get(DataValidationAutoFillController);
  }
};
__publicField(UniverSheetsDataValidationMobileUIPlugin, "pluginName", PLUGIN_NAME);
__publicField(UniverSheetsDataValidationMobileUIPlugin, "type", O.UNIVER_SHEET);
UniverSheetsDataValidationMobileUIPlugin = __decorateClass([
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, ICommandService),
  __decorateParam(3, IConfigService)
], UniverSheetsDataValidationMobileUIPlugin);

// ../packages/sheets-data-validation-ui/src/plugin.ts
var PLUGIN_NAME2 = "SHEET_DATA_VALIDATION_UI_PLUGIN";
var UniverSheetsDataValidationUIPlugin = class extends Plugin {
  constructor(_config = defaultPluginConfig, _injector, _commandService, _configService) {
    super();
    this._config = _config;
    this._injector = _injector;
    this._commandService = _commandService;
    this._configService = _configService;
    const { menu, ...rest } = merge_default(
      {},
      defaultPluginConfig,
      this._config
    );
    if (menu) {
      this._configService.setConfig("menu", menu, { merge: true });
    }
    this._configService.setConfig(SHEETS_DATA_VALIDATION_UI_PLUGIN_CONFIG_KEY, rest);
  }
  onStarting() {
    [
      [DataValidationPanelService],
      [DataValidationDropdownManagerService],
      [DataValidationAlertController],
      [DataValidationAutoFillController],
      [SheetsDataValidationRenderController],
      [DataValidationPermissionController],
      [DataValidationCopyPasteController],
      [DataValidationRejectInputController],
      [SheetsDataValidationUIController]
    ].forEach((dep) => {
      this._injector.add(dep);
    });
    [
      AddSheetDataValidationAndOpenCommand,
      ShowDataValidationDropdown,
      HideDataValidationDropdown,
      CloseValidationPanelOperation,
      OpenValidationPanelOperation,
      ToggleValidationPanelOperation
    ].forEach((command) => {
      this._commandService.registerCommand(command);
    });
  }
  onReady() {
    this._injector.get(DataValidationCopyPasteController);
    this._injector.get(DataValidationPermissionController);
    this._injector.get(DataValidationRejectInputController);
    this._injector.get(DataValidationAlertController);
    const renderManager = this._injector.get(IRenderManagerService);
    renderManager.registerRenderModule(
      O.UNIVER_SHEET,
      [SheetsDataValidationReRenderController]
    );
  }
  onRendered() {
    this._injector.get(SheetsDataValidationUIController);
    this._injector.get(SheetsDataValidationRenderController);
  }
  onSteady() {
    this._injector.get(DataValidationAutoFillController);
  }
};
__publicField(UniverSheetsDataValidationUIPlugin, "pluginName", PLUGIN_NAME2);
__publicField(UniverSheetsDataValidationUIPlugin, "type", O.UNIVER_SHEET);
UniverSheetsDataValidationUIPlugin = __decorateClass([
  DependentOn(UniverSheetsDataValidationPlugin),
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, ICommandService),
  __decorateParam(3, IConfigService)
], UniverSheetsDataValidationUIPlugin);

export {
  UniverSheetsDataValidationMobileUIPlugin,
  UniverSheetsDataValidationUIPlugin
};
//# sourceMappingURL=chunk-DWKWUDJW.js.map
