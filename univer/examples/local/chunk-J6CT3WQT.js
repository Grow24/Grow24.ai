import {
  AddCfCommand,
  AddConditionalRuleMutation,
  AddConditionalRuleMutationUndoFactory,
  CONDITIONAL_FORMATTING_VIEWPORT_CACHE_LENGTH,
  ClearRangeCfCommand,
  ClearWorksheetCfCommand,
  ConditionalFormattingRuleModel,
  ConditionalFormattingService,
  ConditionalFormattingViewModel,
  DEFAULT_BG_COLOR,
  DEFAULT_FONT_COLOR,
  DEFAULT_PADDING,
  DEFAULT_WIDTH,
  DeleteCfCommand,
  DeleteConditionalRuleMutation,
  DeleteConditionalRuleMutationUndoFactory,
  EMPTY_ICON_TYPE,
  MoveCfCommand,
  MoveConditionalRuleMutation,
  SHEET_CONDITIONAL_FORMATTING_PLUGIN,
  SetCfCommand,
  SetConditionalRuleMutation,
  UniverSheetsConditionalFormattingPlugin,
  compareWithNumber,
  createDefaultRule,
  createDefaultValue,
  createDefaultValueByValueType,
  defaultDataBarNativeColor,
  defaultDataBarPositiveColor,
  getColorScaleFromValue,
  getOppositeOperator,
  iconGroup,
  iconMap,
  removeUndefinedAttr,
  setConditionalRuleMutationUndoFactory
} from "./chunk-HUZHMH6I.js";
import {
  FormulaEditor,
  RangeSelector
} from "./chunk-ZR7BMKL3.js";
import {
  IAutoFillService,
  IFormatPainterService,
  ISheetClipboardService,
  PREDEFINED_HOOK_NAME,
  SheetSkeletonManagerService,
  getAutoFillRepeatRange,
  getCurrentRangeDisable$,
  getRepeatRange,
  useHighlightRange,
  virtualizeDiscreteRanges
} from "./chunk-BGPMR3ZY.js";
import {
  BoldIcon,
  Button,
  Checkbox,
  ColorPicker,
  ComponentManager,
  DeleteIcon,
  Dropdown,
  FontColorDoubleIcon,
  ILayoutService,
  IMenuManagerService,
  ISidebarService,
  IncreaseIcon,
  Input,
  InputNumber,
  ItalicIcon,
  MoreDownIcon,
  PaintBucketDoubleIcon,
  Radio,
  RadioGroup,
  ReactGridLayout,
  Select,
  SequenceIcon,
  SlashDoubleIcon,
  StrikethroughIcon,
  Tooltip,
  UnderlineIcon,
  borderClassName,
  clsx,
  getMenuHiddenObservable,
  require_jsx_runtime,
  require_react,
  useDependency,
  useObservable,
  useScrollYOverContainer,
  useSidebarClick
} from "./chunk-CSPB4B6P.js";
import {
  AFTER_CELL_EDIT,
  ClearSelectionAllCommand,
  ClearSelectionFormatCommand,
  INTERCEPTOR_POINT,
  RangeMergeUtil,
  RangeProtectionPermissionEditPoint,
  RefRangeService,
  RemoveSheetMutation,
  SetSelectionsOperation,
  SetWorksheetActiveOperation,
  SheetInterceptorService,
  SheetPermissionCheckController,
  SheetsSelectionsService,
  WorkbookEditablePermission,
  WorksheetEditPermission,
  WorksheetSetCellStylePermission,
  checkRangesEditablePermission,
  createTopMatrixFromMatrix,
  deserializeRangeWithSheet,
  findAllRectangle,
  getSheetCommandTarget,
  handleDefaultRangeChangeWithEffectRefCommands,
  rangeToDiscreteRange,
  serializeRange,
  setEndForRange
} from "./chunk-O5WA5YRR.js";
import {
  IRenderManagerService
} from "./chunk-I5MCYWYL.js";
import {
  ColorKit,
  DependentOn,
  Disposable,
  ICommandService,
  IConfigService,
  IUniverInstanceService,
  Inject,
  Injector,
  InterceptorManager,
  LocaleService,
  O,
  ObjectMatrix,
  Observable,
  Plugin,
  Range,
  Rectangle,
  Tools,
  bufferTime,
  createInterceptorKey,
  debounceTime,
  filter,
  generateRandomId,
  get_default,
  isRangesEqual,
  merge,
  merge_default,
  registerDependencies,
  set_default,
  toDisposable,
  touchDependencies
} from "./chunk-ZRYQFDHJ.js";
import {
  __decorateClass,
  __decorateParam,
  __publicField,
  __toESM
} from "./chunk-NSSCU2QI.js";

// ../packages/sheets-conditional-formatting-ui/src/commands/commands/add-average-cf.command.ts
var AddAverageCfCommand = {
  type: 0 /* COMMAND */,
  id: "sheet.command.add-average-conditional-rule",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { ranges, style, stopIfTrue, operator } = params;
    const conditionalFormattingRuleModel = accessor.get(ConditionalFormattingRuleModel);
    const commandService = accessor.get(ICommandService);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const target = getSheetCommandTarget(univerInstanceService);
    if (!target) return false;
    const { unitId, subUnitId } = target;
    const cfId = conditionalFormattingRuleModel.createCfId(unitId, subUnitId);
    const rule = {
      ranges,
      cfId,
      stopIfTrue: !!stopIfTrue,
      rule: {
        type: "highlightCell" /* highlightCell */,
        subType: "average" /* average */,
        operator,
        style
      }
    };
    const result = commandService.executeCommand(AddConditionalRuleMutation.id, { unitId, subUnitId, rule });
    return result;
  }
};

// ../packages/sheets-conditional-formatting-ui/src/commands/commands/add-color-scale-cf.command.ts
var AddColorScaleConditionalRuleCommand = {
  type: 0 /* COMMAND */,
  id: "sheet.command.add-color-scale-conditional-rule",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { ranges, config, stopIfTrue } = params;
    const conditionalFormattingRuleModel = accessor.get(ConditionalFormattingRuleModel);
    const commandService = accessor.get(ICommandService);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const target = getSheetCommandTarget(univerInstanceService);
    if (!target) return false;
    const { unitId, subUnitId } = target;
    const cfId = conditionalFormattingRuleModel.createCfId(unitId, subUnitId);
    const rule = {
      ranges,
      cfId,
      stopIfTrue: !!stopIfTrue,
      rule: {
        type: "colorScale" /* colorScale */,
        config
      }
    };
    return commandService.executeCommand(AddConditionalRuleMutation.id, { unitId, subUnitId, rule });
  }
};

// ../packages/sheets-conditional-formatting-ui/src/commands/commands/add-data-bar-cf.command.ts
var AddDataBarConditionalRuleCommand = {
  type: 0 /* COMMAND */,
  id: "sheet.command.add-data-bar-conditional-rule",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { ranges, min, max, nativeColor, positiveColor, isGradient, stopIfTrue, isShowValue } = params;
    const conditionalFormattingRuleModel = accessor.get(ConditionalFormattingRuleModel);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const target = getSheetCommandTarget(univerInstanceService);
    if (!target) return false;
    const { unitId, subUnitId } = target;
    const commandService = accessor.get(ICommandService);
    const cfId = conditionalFormattingRuleModel.createCfId(unitId, subUnitId);
    const rule = {
      ranges,
      cfId,
      stopIfTrue: !!stopIfTrue,
      rule: {
        type: "dataBar" /* dataBar */,
        isShowValue,
        config: {
          min,
          max,
          nativeColor,
          positiveColor,
          isGradient
        }
      }
    };
    return commandService.executeCommand(AddConditionalRuleMutation.id, { unitId, subUnitId, rule });
  }
};

// ../packages/sheets-conditional-formatting-ui/src/commands/commands/add-duplicate-values-cf.command.ts
var AddDuplicateValuesCfCommand = {
  type: 0 /* COMMAND */,
  id: "sheet.command.add-duplicate-values-conditional-rule",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { ranges, style, stopIfTrue } = params;
    const conditionalFormattingRuleModel = accessor.get(ConditionalFormattingRuleModel);
    const commandService = accessor.get(ICommandService);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const target = getSheetCommandTarget(univerInstanceService);
    if (!target) return false;
    const { unitId, subUnitId } = target;
    const cfId = conditionalFormattingRuleModel.createCfId(unitId, subUnitId);
    const rule = {
      ranges,
      cfId,
      stopIfTrue: !!stopIfTrue,
      rule: {
        type: "highlightCell" /* highlightCell */,
        subType: "duplicateValues" /* duplicateValues */,
        style
      }
    };
    return commandService.executeCommand(AddConditionalRuleMutation.id, { unitId, subUnitId, rule });
  }
};

// ../packages/sheets-conditional-formatting-ui/src/commands/commands/add-number-cf.command.ts
var AddNumberCfCommand = {
  type: 0 /* COMMAND */,
  id: "sheet.command.add-number-conditional-rule",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { ranges, style, stopIfTrue, operator, value } = params;
    const conditionalFormattingRuleModel = accessor.get(ConditionalFormattingRuleModel);
    const commandService = accessor.get(ICommandService);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const target = getSheetCommandTarget(univerInstanceService);
    if (!target) return false;
    const { unitId, subUnitId } = target;
    const cfId = conditionalFormattingRuleModel.createCfId(unitId, subUnitId);
    let rule;
    if (["between" /* between */, "notBetween" /* notBetween */].includes(operator)) {
      const _value = value;
      if (_value.length !== 2 || !Array.isArray(_value)) {
        return false;
      }
      rule = {
        ranges,
        cfId,
        stopIfTrue: !!stopIfTrue,
        rule: {
          type: "highlightCell" /* highlightCell */,
          subType: "number" /* number */,
          operator,
          style,
          value: _value
        }
      };
    } else {
      const _value = value;
      if (typeof _value !== "number") {
        return false;
      }
      rule = {
        ranges,
        cfId,
        stopIfTrue: !!stopIfTrue,
        rule: {
          type: "highlightCell" /* highlightCell */,
          subType: "number" /* number */,
          operator,
          style,
          value: _value
        }
      };
    }
    return commandService.executeCommand(AddConditionalRuleMutation.id, { unitId, subUnitId, rule });
  }
};

// ../packages/sheets-conditional-formatting-ui/src/commands/commands/add-rank-cf.command.ts
var AddRankCfCommand = {
  type: 0 /* COMMAND */,
  id: "sheet.command.add-rank-conditional-rule",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { ranges, style, stopIfTrue, isPercent, isBottom, value } = params;
    const conditionalFormattingRuleModel = accessor.get(ConditionalFormattingRuleModel);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const commandService = accessor.get(ICommandService);
    const target = getSheetCommandTarget(univerInstanceService);
    if (!target) return false;
    const { unitId, subUnitId } = target;
    const cfId = conditionalFormattingRuleModel.createCfId(unitId, subUnitId);
    const rule = {
      ranges,
      cfId,
      stopIfTrue: !!stopIfTrue,
      rule: {
        type: "highlightCell" /* highlightCell */,
        subType: "rank" /* rank */,
        isPercent,
        isBottom,
        style,
        value
      }
    };
    return commandService.executeCommand(AddConditionalRuleMutation.id, { unitId, subUnitId, rule });
  }
};

// ../packages/sheets-conditional-formatting-ui/src/commands/commands/add-text-cf.command.ts
var AddTextCfCommand = {
  type: 0 /* COMMAND */,
  id: "sheet.command.add-text-conditional-rule",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { ranges, style, stopIfTrue, operator, value } = params;
    const conditionalFormattingRuleModel = accessor.get(ConditionalFormattingRuleModel);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const target = getSheetCommandTarget(univerInstanceService);
    if (!target) return false;
    const { unitId, subUnitId } = target;
    const commandService = accessor.get(ICommandService);
    const cfId = conditionalFormattingRuleModel.createCfId(unitId, subUnitId);
    const rule = {
      ranges,
      cfId,
      stopIfTrue: !!stopIfTrue,
      rule: {
        type: "highlightCell" /* highlightCell */,
        subType: "text" /* text */,
        operator,
        style,
        value
      }
    };
    return commandService.executeCommand(AddConditionalRuleMutation.id, { unitId, subUnitId, rule });
  }
};

// ../packages/sheets-conditional-formatting-ui/src/commands/commands/add-time-period-cf.command.ts
var AddTimePeriodCfCommand = {
  type: 0 /* COMMAND */,
  id: "sheet.command.add-time-period-conditional-rule",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { ranges, style, stopIfTrue, operator } = params;
    const conditionalFormattingRuleModel = accessor.get(ConditionalFormattingRuleModel);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const commandService = accessor.get(ICommandService);
    const target = getSheetCommandTarget(univerInstanceService);
    if (!target) return false;
    const { unitId, subUnitId } = target;
    const cfId = conditionalFormattingRuleModel.createCfId(unitId, subUnitId);
    const rule = {
      ranges,
      cfId,
      stopIfTrue: !!stopIfTrue,
      rule: {
        type: "highlightCell" /* highlightCell */,
        subType: "timePeriod" /* timePeriod */,
        operator,
        style
      }
    };
    return commandService.executeCommand(AddConditionalRuleMutation.id, { unitId, subUnitId, rule });
  }
};

// ../packages/sheets-conditional-formatting-ui/src/commands/commands/add-unique-values-cf.command.ts
var AddUniqueValuesCfCommand = {
  type: 0 /* COMMAND */,
  id: "sheet.command.add-uniqueValues-conditional-rule",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { ranges, style, stopIfTrue } = params;
    const conditionalFormattingRuleModel = accessor.get(ConditionalFormattingRuleModel);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const commandService = accessor.get(ICommandService);
    const target = getSheetCommandTarget(univerInstanceService);
    if (!target) return false;
    const { unitId, subUnitId } = target;
    const cfId = conditionalFormattingRuleModel.createCfId(unitId, subUnitId);
    const rule = {
      ranges,
      cfId,
      stopIfTrue: !!stopIfTrue,
      rule: {
        type: "highlightCell" /* highlightCell */,
        subType: "uniqueValues" /* uniqueValues */,
        style
      }
    };
    return commandService.executeCommand(AddConditionalRuleMutation.id, { unitId, subUnitId, rule });
  }
};

// ../packages/sheets-conditional-formatting-ui/src/components/panel/index.tsx
var import_react12 = __toESM(require_react());

// ../packages/sheets-conditional-formatting-ui/src/components/panel/rule-edit/index.tsx
var import_react10 = __toESM(require_react());

// ../packages/sheets-conditional-formatting-ui/src/components/panel/rule-edit/ColorScale.tsx
var import_react3 = __toESM(require_react());

// ../packages/sheets-conditional-formatting-ui/src/components/color-picker/index.tsx
var import_react = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var ColorPicker2 = (props) => {
  const { color, onChange, disable = false, Icon = PaintBucketDoubleIcon, className } = props;
  const colorKit = (0, import_react.useMemo)(() => new ColorKit(color), [color]);
  const renderIcon = () => {
    const iconProps = {
      className: clsx("univer-fill-primary-600", disable && className),
      extend: { colorChannel1: colorKit.isValid ? color : "" }
    };
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { ...iconProps });
  };
  return !disable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    Dropdown,
    {
      overlay: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "univer-rounded-lg univer-p-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorPicker, { value: color, onChange }) }),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "span",
        {
          className: clsx(`univer-flex univer-cursor-pointer univer-items-center univer-rounded univer-p-1 hover:univer-bg-gray-100 dark:hover:!univer-bg-gray-700`, className),
          children: renderIcon()
        }
      )
    }
  ) : renderIcon();
};

// ../packages/sheets-conditional-formatting-ui/src/components/preview/index.tsx
var import_react2 = __toESM(require_react());
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var Preview = (props) => {
  var _a, _b, _c, _d, _e;
  const rule = props.rule;
  if (!rule) return null;
  const colorList = (0, import_react2.useMemo)(() => {
    if (rule.type === "colorScale" /* colorScale */) {
      const config = rule.config.map((c, index) => ({ color: new ColorKit(c.color), value: index }));
      const maxValue = config.length - 1;
      const valueList = new Array(5).fill("").map((_v, index, arr) => index * maxValue / (arr.length - 1));
      return valueList.map((value) => getColorScaleFromValue(config, value));
    }
    return null;
  }, [rule]);
  const iconSet = (0, import_react2.useMemo)(() => {
    if (rule.type === "iconSet" /* iconSet */) {
      return rule.config.map((item) => {
        const iconList = iconMap[item.iconType];
        return iconList && iconList[Number(item.iconId)];
      });
    }
  }, [rule]);
  const previewClassName2 = "univer-pointer-events-none univer-flex univer-h-5 univer-min-w-[72px] univer-items-center univer-justify-center univer-text-xs";
  switch (rule.type) {
    case "dataBar" /* dataBar */: {
      const { isGradient } = rule.config;
      const positiveColor = isGradient ? `linear-gradient(to right, ${rule.config.positiveColor || defaultDataBarPositiveColor}, rgb(255 255 255))` : rule.config.positiveColor;
      const nativeColor = isGradient ? `linear-gradient(to right,  rgb(255 255 255),${rule.config.nativeColor || defaultDataBarNativeColor})` : rule.config.nativeColor;
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: previewClassName2, children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "div",
          {
            className: "univer-h-full univer-w-1/2 univer-border univer-border-solid",
            style: {
              background: nativeColor,
              borderColor: (_a = rule.config.nativeColor) != null ? _a : defaultDataBarNativeColor
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "div",
          {
            className: "univer-h-full univer-w-1/2 univer-border univer-border-solid",
            style: {
              background: positiveColor,
              borderColor: (_b = rule.config.positiveColor) != null ? _b : defaultDataBarPositiveColor
            }
          }
        )
      ] });
    }
    case "colorScale" /* colorScale */: {
      return colorList && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: previewClassName2, children: colorList.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "div",
        {
          className: "univer-h-full",
          style: { width: `${100 / colorList.length}%`, background: item }
        },
        index
      )) });
    }
    case "iconSet" /* iconSet */: {
      return iconSet && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: previewClassName2, children: iconSet.map((base64, index) => base64 ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("img", { className: "univer-h-full", src: base64, draggable: false }, index) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SlashDoubleIcon, {}, index)) });
    }
    case "highlightCell" /* highlightCell */: {
      const { ul, st, it, bl, bg, cl } = rule.style;
      const isUnderline = (ul == null ? void 0 : ul.s) === 1 /* TRUE */;
      const isStrikethrough = (st == null ? void 0 : st.s) === 1 /* TRUE */;
      const isItalic = it === 1 /* TRUE */;
      const isBold = bl === 1 /* TRUE */;
      const bgColor = (_c = bg == null ? void 0 : bg.rgb) != null ? _c : DEFAULT_BG_COLOR;
      const fontColor = (_d = cl == null ? void 0 : cl.rgb) != null ? _d : DEFAULT_FONT_COLOR;
      const style = {
        textDecoration: (_e = `${isUnderline ? "underline" : ""} ${isStrikethrough ? "line-through" : ""}`.replace(/^ /, "")) != null ? _e : void 0,
        backgroundColor: bgColor,
        color: fontColor
      };
      return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "div",
        {
          className: clsx(previewClassName2, {
            "univer-font-bold": isBold,
            "univer-italic": isItalic
          }),
          style,
          children: "123"
        }
      );
    }
  }
};

// ../packages/sheets-conditional-formatting-ui/src/components/panel/rule-edit/styles.ts
var previewClassName = clsx("univer-mt-5 univer-px-1 univer-py-2 univer-rounded", borderClassName);

// ../packages/sheets-conditional-formatting-ui/src/components/panel/rule-edit/ColorScale.tsx
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
var createOptionItem = (text, localeService) => ({ label: localeService.t(`sheet.cf.valueType.${text}`), value: text });
var TextInput = (props) => {
  var _a;
  const { type, className, onChange, id, value } = props;
  const univerInstanceService = useDependency(IUniverInstanceService);
  const unitId = univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET).getUnitId();
  const subUnitId = (_a = univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET).getActiveSheet()) == null ? void 0 : _a.getSheetId();
  const formulaInitValue = (0, import_react3.useMemo)(() => {
    return String(value).startsWith("=") ? String(value) : "=";
  }, [value]);
  const config = (0, import_react3.useMemo)(() => {
    if (["max" /* max */, "min" /* min */, "none"].includes(type)) {
      return { disabled: true };
    }
    if (["percent" /* percent */, "percentile" /* percentile */].includes(type)) {
      return {
        min: 0,
        max: 100
      };
    }
    return {
      min: Number.MIN_SAFE_INTEGER,
      max: Number.MAX_SAFE_INTEGER
    };
  }, [type]);
  const formulaEditorRef = (0, import_react3.useRef)(null);
  const [isFocusFormulaEditor, setIsFocusFormulaEditor] = (0, import_react3.useState)(false);
  useSidebarClick((e) => {
    var _a2;
    const isOutSide = (_a2 = formulaEditorRef.current) == null ? void 0 : _a2.isClickOutSide(e);
    isOutSide && setIsFocusFormulaEditor(false);
  });
  if (type === "formula" /* formula */) {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "univer-ml-1 univer-w-full", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      FormulaEditor,
      {
        ref: formulaEditorRef,
        className: clsx(`univer-box-border univer-h-8 univer-w-full univer-cursor-pointer univer-items-center univer-rounded-lg univer-bg-white univer-pt-2 univer-transition-colors hover:univer-border-primary-600 dark:!univer-bg-gray-700 dark:!univer-text-white [&>div:first-child]:univer-px-2.5 [&>div]:univer-h-5 [&>div]:univer-ring-transparent`, borderClassName),
        initValue: formulaInitValue,
        unitId,
        subUnitId,
        isFocus: isFocusFormulaEditor,
        onChange: (v = "") => {
          const formula = v || "";
          onChange(formula);
        },
        onFocus: () => setIsFocusFormulaEditor(true)
      }
    ) });
  } else {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(InputNumber, { className, value: Number(props.value) || 0, onChange: (v) => props.onChange(v || 0), ...config });
  }
};
var ColorScaleStyleEditor = (props) => {
  var _a;
  const { interceptorManager } = props;
  const localeService = useDependency(LocaleService);
  const rule = ((_a = props.rule) == null ? void 0 : _a.type) === "colorScale" /* colorScale */ ? props.rule : void 0;
  const commonOptions = [createOptionItem("num" /* num */, localeService), createOptionItem("percent" /* percent */, localeService), createOptionItem("percentile" /* percentile */, localeService), createOptionItem("formula" /* formula */, localeService)];
  const minOptions = [createOptionItem("min" /* min */, localeService), ...commonOptions];
  const medianOptions = [createOptionItem("none", localeService), ...commonOptions];
  const maxOptions = [createOptionItem("max" /* max */, localeService), ...commonOptions];
  const [minType, setMinType] = (0, import_react3.useState)(() => {
    var _a2;
    const defaultV = "min" /* min */;
    if (!rule) {
      return defaultV;
    }
    return ((_a2 = rule.config[0]) == null ? void 0 : _a2.value.type) || defaultV;
  });
  const [medianType, setMedianType] = (0, import_react3.useState)(() => {
    var _a2;
    const defaultV = "none";
    if (!rule) {
      return defaultV;
    }
    if (rule.config.length !== 3) {
      return defaultV;
    }
    return ((_a2 = rule.config[1]) == null ? void 0 : _a2.value.type) || defaultV;
  });
  const [maxType, setMaxType] = (0, import_react3.useState)(() => {
    var _a2;
    const defaultV = "max" /* max */;
    if (!rule) {
      return defaultV;
    }
    return ((_a2 = rule.config[rule.config.length - 1]) == null ? void 0 : _a2.value.type) || defaultV;
  });
  const [minValue, setMinValue] = (0, import_react3.useState)(() => {
    const defaultV = 10;
    if (!rule) {
      return defaultV;
    }
    const valueConfig = rule.config[0];
    return (valueConfig == null ? void 0 : valueConfig.value.value) === void 0 ? defaultV : valueConfig == null ? void 0 : valueConfig.value.value;
  });
  const [medianValue, setMedianValue] = (0, import_react3.useState)(() => {
    var _a2;
    const defaultV = 50;
    if (!rule) {
      return defaultV;
    }
    if (rule.config.length !== 3) {
      return defaultV;
    }
    const v = (_a2 = rule.config[1]) == null ? void 0 : _a2.value.value;
    return v === void 0 ? defaultV : v;
  });
  const [maxValue, setMaxValue] = (0, import_react3.useState)(() => {
    var _a2;
    const defaultV = 90;
    if (!rule) {
      return defaultV;
    }
    const v = (_a2 = rule.config[rule.config.length - 1]) == null ? void 0 : _a2.value.value;
    return v === void 0 ? defaultV : v;
  });
  const [minColor, setMinColor] = (0, import_react3.useState)(() => {
    var _a2;
    const defaultV = "#d0d9fb";
    if (!rule) {
      return defaultV;
    }
    return ((_a2 = rule.config[0]) == null ? void 0 : _a2.color) || defaultV;
  });
  const [medianColor, setMedianColor] = (0, import_react3.useState)(() => {
    var _a2;
    const defaultV = "#7790f3";
    if (!rule) {
      return defaultV;
    }
    if (rule.config.length !== 3) {
      return defaultV;
    }
    return ((_a2 = rule.config[1]) == null ? void 0 : _a2.color) || defaultV;
  });
  const [maxColor, setMaxColor] = (0, import_react3.useState)(() => {
    var _a2;
    const defaultV = "#2e55ef";
    if (!rule) {
      return defaultV;
    }
    return ((_a2 = rule.config[rule.config.length - 1]) == null ? void 0 : _a2.color) || defaultV;
  });
  const getResult = (0, import_react3.useMemo)(() => (option) => {
    const { minType: minType2, medianType: medianType2, maxType: maxType2, minValue: minValue2, medianValue: medianValue2, maxValue: maxValue2, minColor: minColor2, medianColor: medianColor2, maxColor: maxColor2 } = option;
    const list = [];
    list.push({ color: minColor2, value: { type: minType2, value: minValue2 } });
    medianType2 !== "none" && list.push({ color: medianColor2, value: { type: medianType2, value: medianValue2 } });
    list.push({ color: maxColor2, value: { type: maxType2, value: maxValue2 } });
    const config = list.map((item, index) => ({ ...item, index }));
    return { config, type: "colorScale" /* colorScale */ };
  }, []);
  (0, import_react3.useEffect)(() => {
    const dispose = interceptorManager.intercept(interceptorManager.getInterceptPoints().submit, {
      handler() {
        return getResult({ minType, medianType, maxType, minValue, medianValue, maxValue, minColor, medianColor, maxColor });
      }
    });
    return dispose;
  }, [getResult, minType, medianType, maxType, minValue, medianValue, maxValue, minColor, medianColor, maxColor, interceptorManager]);
  const handleChange = (option) => {
    props.onChange(getResult(option));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "div",
      {
        className: `univer-mt-4 univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200`,
        children: localeService.t("sheet.cf.panel.styleRule")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: previewClassName, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Preview, { rule: getResult({ minType, medianType, maxType, minValue, medianValue, maxValue, minColor, medianColor, maxColor }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "div",
      {
        className: `univer-mt-3 univer-text-xs univer-text-gray-600 dark:!univer-text-gray-200`,
        children: localeService.t("sheet.cf.valueType.min")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "univer-mt-3 univer-flex univer-h-8 univer-items-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Select,
        {
          className: "univer-flex-shrink-0",
          options: minOptions,
          value: minType,
          onChange: (v) => {
            setMinType(v);
            const value = createDefaultValueByValueType(v, 10);
            setMinValue(value);
            handleChange({
              minType: v,
              medianType,
              maxType,
              minValue: value,
              medianValue,
              maxValue,
              minColor,
              medianColor,
              maxColor
            });
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        TextInput,
        {
          id: "min",
          className: "univer-ml-1",
          value: minValue,
          type: minType,
          onChange: (v) => {
            setMinValue(v);
            handleChange({
              minType,
              medianType,
              maxType,
              minValue: v,
              medianValue,
              maxValue,
              minColor,
              medianColor,
              maxColor
            });
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        ColorPicker2,
        {
          className: "univer-ml-1",
          color: minColor,
          onChange: (v) => {
            setMinColor(v);
            handleChange({
              minType,
              medianType,
              maxType,
              minValue,
              medianValue,
              maxValue,
              minColor: v,
              medianColor,
              maxColor
            });
          }
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "div",
      {
        className: `univer-text-gray-600dark:!univer-text-gray-200 univer-mt-3 univer-text-xs`,
        children: localeService.t("sheet.cf.panel.medianValue")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "univer-mt-3 univer-flex univer-h-8 univer-items-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Select,
        {
          className: "univer-flex-shrink-0",
          options: medianOptions,
          value: medianType,
          onChange: (v) => {
            setMedianType(v);
            const value = createDefaultValueByValueType(v, 50);
            setMedianValue(value);
            handleChange({
              minType,
              medianType: v,
              maxType,
              minValue,
              medianValue: value,
              maxValue,
              minColor,
              medianColor,
              maxColor
            });
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        TextInput,
        {
          id: "median",
          className: "univer-ml-1",
          value: medianValue,
          type: medianType,
          onChange: (v) => {
            setMedianValue(v);
            handleChange({
              minType,
              medianType,
              maxType,
              minValue,
              medianValue: v,
              maxValue,
              minColor,
              medianColor,
              maxColor
            });
          }
        }
      ),
      medianType !== "none" && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        ColorPicker2,
        {
          className: "univer-ml-1",
          color: medianColor,
          onChange: (v) => {
            setMedianColor(v);
            handleChange({
              minType,
              medianType,
              maxType,
              minValue,
              medianValue,
              maxValue,
              minColor,
              medianColor: v,
              maxColor
            });
          }
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      "div",
      {
        className: `univer-mt-3 univer-text-xs univer-text-gray-600 dark:!univer-text-gray-200`,
        children: localeService.t("sheet.cf.valueType.max")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "univer-mt-3 univer-flex univer-h-8 univer-items-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Select,
        {
          className: "univer-flex-shrink-0",
          options: maxOptions,
          value: maxType,
          onChange: (v) => {
            setMaxType(v);
            const value = createDefaultValueByValueType(v, 90);
            setMaxValue(value);
            handleChange({
              minType,
              medianType,
              maxType: v,
              minValue,
              medianValue,
              maxValue: value,
              minColor,
              medianColor,
              maxColor
            });
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        TextInput,
        {
          id: "max",
          className: "univer-ml-1",
          value: maxValue,
          type: maxType,
          onChange: (v) => {
            setMaxValue(v);
            handleChange({
              minType,
              medianType,
              maxType,
              minValue,
              medianValue,
              maxValue: v,
              minColor,
              medianColor,
              maxColor
            });
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        ColorPicker2,
        {
          className: "univer-ml-1",
          color: maxColor,
          onChange: (v) => {
            setMaxColor(v);
            handleChange({
              minType,
              medianType,
              maxType,
              minValue,
              medianValue,
              maxValue,
              minColor,
              medianColor,
              maxColor: v
            });
          }
        }
      )
    ] })
  ] });
};

// ../packages/sheets-conditional-formatting-ui/src/components/panel/rule-edit/DataBar.tsx
var import_react4 = __toESM(require_react());
var import_jsx_runtime4 = __toESM(require_jsx_runtime());
var createOptionItem2 = (text, localeService) => ({ label: localeService.t(`sheet.cf.valueType.${text}`), value: text });
var InputText = (props) => {
  var _a;
  const { onChange, className, value, type, id, disabled = false } = props;
  const univerInstanceService = useDependency(IUniverInstanceService);
  const unitId = univerInstanceService.getCurrentUnitOfType(O.UNIVER_SHEET).getUnitId();
  const subUnitId = (_a = univerInstanceService.getCurrentUnitOfType(O.UNIVER_SHEET).getActiveSheet()) == null ? void 0 : _a.getSheetId();
  const formulaEditorRef = (0, import_react4.useRef)(null);
  const [isFocusFormulaEditor, setIsFocusFormulaEditor] = (0, import_react4.useState)(false);
  useSidebarClick((e) => {
    var _a2;
    const isOutSide = (_a2 = formulaEditorRef.current) == null ? void 0 : _a2.isClickOutSide(e);
    isOutSide && setIsFocusFormulaEditor(false);
  });
  const _value = (0, import_react4.useRef)(value);
  const config = (0, import_react4.useMemo)(() => {
    if (["percentile" /* percentile */, "percent" /* percent */].includes(type)) {
      return {
        max: 100,
        min: 0
      };
    }
    return {
      min: Number.MIN_SAFE_INTEGER,
      max: Number.MAX_SAFE_INTEGER
    };
  }, [type]);
  if (type === "formula" /* formula */) {
    const v = String(_value.current).startsWith("=") ? String(_value.current) || "" : "=";
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "univer-ml-3 univer-w-full", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      FormulaEditor,
      {
        ref: formulaEditorRef,
        className: clsx(`univer-box-border univer-h-8 univer-w-full univer-cursor-pointer univer-items-center univer-rounded-lg univer-bg-white univer-pt-2 univer-transition-colors hover:univer-border-primary-600 dark:!univer-bg-gray-700 dark:!univer-text-white [&>div:first-child]:univer-px-2.5 [&>div]:univer-h-5 [&>div]:univer-ring-transparent`, borderClassName),
        initValue: v,
        unitId,
        subUnitId,
        isFocus: isFocusFormulaEditor,
        onChange: (v2 = "") => {
          const formula = v2 || "";
          onChange(formula);
        },
        onFocus: () => setIsFocusFormulaEditor(true)
      }
    ) });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    InputNumber,
    {
      className,
      value: Number(value) || 0,
      disabled,
      onChange: (v) => {
        onChange(v || 0);
      },
      ...config
    }
  );
};
var DataBarStyleEditor = (props) => {
  var _a;
  const { interceptorManager } = props;
  const localeService = useDependency(LocaleService);
  const rule = ((_a = props.rule) == null ? void 0 : _a.type) === "dataBar" /* dataBar */ ? props.rule : void 0;
  const [isGradient, setIsGradient] = (0, import_react4.useState)(() => {
    var _a2;
    const defaultV = "0";
    if (!rule) {
      return defaultV;
    }
    return ((_a2 = rule.config) == null ? void 0 : _a2.isGradient) ? "1" : "0";
  });
  const [positiveColor, setPositiveColor] = (0, import_react4.useState)(() => {
    var _a2;
    if (!rule) {
      return defaultDataBarPositiveColor;
    }
    return ((_a2 = rule.config) == null ? void 0 : _a2.positiveColor) || defaultDataBarPositiveColor;
  });
  const [nativeColor, setNativeColor] = (0, import_react4.useState)(() => {
    var _a2;
    if (!rule) {
      return defaultDataBarNativeColor;
    }
    return ((_a2 = rule.config) == null ? void 0 : _a2.nativeColor) || defaultDataBarNativeColor;
  });
  const commonOptions = [
    createOptionItem2("num" /* num */, localeService),
    createOptionItem2("percent" /* percent */, localeService),
    createOptionItem2("percentile" /* percentile */, localeService),
    createOptionItem2("formula" /* formula */, localeService)
  ];
  const minOptions = [createOptionItem2("min" /* min */, localeService), ...commonOptions];
  const maxOptions = [createOptionItem2("max" /* max */, localeService), ...commonOptions];
  const [minValueType, setMinValueType] = (0, import_react4.useState)(() => {
    var _a2;
    const defaultV = minOptions[0].value;
    if (!rule) {
      return defaultV;
    }
    return ((_a2 = rule.config) == null ? void 0 : _a2.min.type) || defaultV;
  });
  const [maxValueType, setMaxValueType] = (0, import_react4.useState)(() => {
    var _a2;
    const defaultV = maxOptions[0].value;
    if (!rule) {
      return defaultV;
    }
    return ((_a2 = rule.config) == null ? void 0 : _a2.max.type) || defaultV;
  });
  const [minValue, setMinValue] = (0, import_react4.useState)(() => {
    var _a2;
    const defaultV = 0;
    if (!rule) {
      return defaultV;
    }
    const value = ((_a2 = rule.config) == null ? void 0 : _a2.min) || {};
    if (value.type === "formula" /* formula */) {
      return value.value || "=";
    }
    return value.value || defaultV;
  });
  const [maxValue, setMaxValue] = (0, import_react4.useState)(() => {
    var _a2;
    const defaultV = 100;
    if (!rule) {
      return defaultV;
    }
    const value = ((_a2 = rule.config) == null ? void 0 : _a2.max) || {};
    if (value.type === "formula" /* formula */) {
      return value.value || "=";
    }
    return value.value === void 0 ? defaultV : value.value;
  });
  const [isShowValue, setIsShowValue] = (0, import_react4.useState)(() => {
    const defaultV = true;
    if (!rule) {
      return defaultV;
    }
    return rule.isShowValue === void 0 ? defaultV : !!rule.isShowValue;
  });
  const getResult = (option) => {
    const config = {
      min: { type: option.minValueType, value: option.minValue },
      max: { type: option.maxValueType, value: option.maxValue },
      isGradient: option.isGradient === "1",
      positiveColor: option.positiveColor || defaultDataBarPositiveColor,
      nativeColor: option.nativeColor || defaultDataBarNativeColor
    };
    return { config, type: "dataBar" /* dataBar */, isShowValue: option.isShowValue };
  };
  (0, import_react4.useEffect)(() => {
    const dispose = interceptorManager.intercept(interceptorManager.getInterceptPoints().submit, {
      handler() {
        return getResult({ isGradient, minValue, minValueType, maxValue, maxValueType, positiveColor, nativeColor, isShowValue });
      }
    });
    return dispose;
  }, [isGradient, minValue, minValueType, maxValue, maxValueType, positiveColor, nativeColor, interceptorManager, isShowValue]);
  const handleChange = (option) => {
    props.onChange(getResult(option));
  };
  const handlePositiveColorChange = (color) => {
    setPositiveColor(color);
    handleChange({
      isGradient,
      minValue,
      minValueType,
      maxValue,
      maxValueType,
      positiveColor: color,
      nativeColor,
      isShowValue
    });
  };
  const handleNativeColorChange = (color) => {
    setNativeColor(color);
    handleChange({
      isGradient,
      minValue,
      minValueType,
      maxValue,
      maxValueType,
      positiveColor,
      nativeColor: color,
      isShowValue
    });
  };
  const isShowInput = (type) => {
    return commonOptions.map((item) => item.value).includes(type);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "div",
      {
        className: `univer-mt-4 univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200`,
        children: localeService.t("sheet.cf.panel.styleRule")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: previewClassName, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      Preview,
      {
        rule: getResult({
          isGradient,
          minValue,
          minValueType,
          maxValue,
          maxValueType,
          positiveColor,
          nativeColor,
          isShowValue
        })
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "div",
        {
          className: `univer-mt-3 univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200`,
          children: localeService.t("sheet.cf.panel.fillType")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "univer-ml-1 univer-mt-3 univer-flex univer-items-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          RadioGroup,
          {
            value: isGradient,
            onChange: (v) => {
              setIsGradient(v);
              handleChange({
                isGradient: v,
                minValue,
                minValueType,
                maxValue,
                maxValueType,
                positiveColor,
                nativeColor,
                isShowValue
              });
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Radio, { value: "0", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "univer-text-xs", children: localeService.t("sheet.cf.panel.pureColor") }) }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Radio, { value: "1", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "univer-text-xs", children: localeService.t("sheet.cf.panel.gradient") }) })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "univer-ml-6 univer-flex univer-items-center univer-text-xs", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            Checkbox,
            {
              checked: !isShowValue,
              onChange: (v) => {
                setIsShowValue(!v);
                handleChange({
                  isGradient: v,
                  minValue,
                  minValueType,
                  maxValue,
                  maxValueType,
                  positiveColor,
                  nativeColor,
                  isShowValue: !v
                });
              }
            }
          ),
          localeService.t("sheet.cf.panel.onlyShowDataBar")
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "div",
        {
          className: `univer-mt-3 univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200`,
          children: localeService.t("sheet.cf.panel.colorSet")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "univer-ml-1 univer-mt-3 univer-flex univer-items-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "univer-flex univer-items-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "univer-text-xs", children: localeService.t("sheet.cf.panel.native") }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            ColorPicker2,
            {
              color: nativeColor,
              onChange: handleNativeColorChange
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "univer-ml-3 univer-flex univer-items-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "univer-text-xs", children: localeService.t("sheet.cf.panel.positive") }),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            ColorPicker2,
            {
              color: positiveColor,
              onChange: handlePositiveColorChange
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "div",
        {
          className: `univer-mt-3 univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200`,
          children: localeService.t("sheet.cf.valueType.min")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "univer-mt-3 univer-flex univer-items-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          Select,
          {
            className: "univer-w-1/2 univer-flex-shrink-0",
            options: minOptions,
            value: minValueType,
            onChange: (v) => {
              setMinValueType(v);
              const value = createDefaultValueByValueType(v, 10);
              setMinValue(value);
              handleChange({
                isGradient,
                minValue: value,
                minValueType: v,
                maxValue,
                maxValueType,
                positiveColor,
                nativeColor,
                isShowValue
              });
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          InputText,
          {
            id: "min",
            className: "univer-ml-3",
            disabled: !isShowInput(minValueType),
            type: minValueType,
            value: minValue,
            onChange: (v) => {
              setMinValue(v || 0);
              handleChange({
                isGradient,
                minValue: v || 0,
                minValueType,
                maxValue,
                maxValueType,
                positiveColor,
                nativeColor,
                isShowValue
              });
            }
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "div",
        {
          className: `univer-mt-3 univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200`,
          children: localeService.t("sheet.cf.valueType.max")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "univer-mt-3 univer-flex univer-items-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          Select,
          {
            className: "univer-w-1/2 univer-flex-shrink-0",
            options: maxOptions,
            value: maxValueType,
            onChange: (v) => {
              setMaxValueType(v);
              const value = createDefaultValueByValueType(v, 90);
              setMaxValue(value);
              handleChange({
                isGradient,
                minValue,
                minValueType,
                maxValue: value,
                maxValueType: v,
                positiveColor,
                nativeColor,
                isShowValue
              });
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          InputText,
          {
            className: "univer-ml-3",
            disabled: !isShowInput(maxValueType),
            id: "max",
            type: maxValueType,
            value: maxValue,
            onChange: (v) => {
              setMaxValue(v || 0);
              handleChange({
                isGradient,
                minValue,
                minValueType,
                maxValue: v || 0,
                maxValueType,
                positiveColor,
                nativeColor,
                isShowValue
              });
            }
          }
        )
      ] })
    ] })
  ] });
};

// ../packages/sheets-conditional-formatting-ui/src/components/panel/rule-edit/Formula.tsx
var import_react6 = __toESM(require_react());

// ../packages/sheets-conditional-formatting-ui/src/components/conditional-style-editor/index.tsx
var import_react5 = __toESM(require_react());
var import_jsx_runtime5 = __toESM(require_jsx_runtime());
var getAnotherBooleanNumber = (v) => {
  return [0 /* FALSE */, void 0].includes(v) ? 1 /* TRUE */ : 0 /* FALSE */;
};
var getBooleanFromNumber = (v) => v !== 0 /* FALSE */;
var ConditionalStyleEditor = (props) => {
  const { style, onChange, className } = props;
  const [isBold, setIsBold] = (0, import_react5.useState)(() => {
    const defaultV = void 0;
    if (!(style == null ? void 0 : style.bl)) {
      return defaultV;
    }
    return style.bl;
  });
  const [isItalic, setIsItalic] = (0, import_react5.useState)(() => {
    const defaultV = void 0;
    if (!(style == null ? void 0 : style.it)) {
      return defaultV;
    }
    return style.it;
  });
  const [isUnderline, setIsUnderline] = (0, import_react5.useState)(() => {
    const defaultV = void 0;
    if (!(style == null ? void 0 : style.ul)) {
      return defaultV;
    }
    return style.ul.s;
  });
  const [isStrikethrough, setIsStrikethrough] = (0, import_react5.useState)(() => {
    const defaultV = void 0;
    if (!(style == null ? void 0 : style.st)) {
      return defaultV;
    }
    return style.st.s;
  });
  const [fontColor, setFontColor] = (0, import_react5.useState)(() => {
    var _a;
    const defaultV = "#2f56ef";
    if (!((_a = style == null ? void 0 : style.cl) == null ? void 0 : _a.rgb)) {
      return defaultV;
    }
    return style.cl.rgb;
  });
  const [bgColor, setBgColor] = (0, import_react5.useState)(() => {
    var _a;
    const defaultV = "#e8ecfc";
    if (!((_a = style == null ? void 0 : style.bg) == null ? void 0 : _a.rgb)) {
      return defaultV;
    }
    return style.bg.rgb;
  });
  (0, import_react5.useEffect)(() => {
    const resultStyle = {
      bl: isBold,
      it: isItalic
    };
    if (fontColor !== void 0) {
      resultStyle.cl = { rgb: fontColor };
    }
    if (bgColor !== void 0) {
      resultStyle.bg = { rgb: bgColor };
    }
    if (isStrikethrough !== void 0) {
      resultStyle.st = { s: isStrikethrough };
    }
    if (isUnderline !== void 0) {
      resultStyle.ul = { s: isUnderline };
    }
    onChange(removeUndefinedAttr(resultStyle));
  }, [isBold, isItalic, isUnderline, isStrikethrough, fontColor, bgColor]);
  const buttonItemClassName = "univer-flex univer-cursor-pointer univer-items-center univer-rounded univer-px-1";
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: clsx("univer-my-2.5 univer-flex univer-justify-between", className), children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "div",
      {
        className: clsx(buttonItemClassName, {
          "univer-bg-gray-100 dark:!univer-bg-gray-700": getBooleanFromNumber(isBold || 0 /* FALSE */)
        }),
        onClick: () => setIsBold(getAnotherBooleanNumber(isBold)),
        children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(BoldIcon, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "div",
      {
        className: clsx(buttonItemClassName, {
          "univer-bg-gray-100 dark:!univer-bg-gray-700": getBooleanFromNumber(isItalic || 0 /* FALSE */)
        }),
        onClick: () => setIsItalic(getAnotherBooleanNumber(isItalic)),
        children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ItalicIcon, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "div",
      {
        className: clsx(buttonItemClassName, {
          "univer-bg-gray-100 dark:!univer-bg-gray-700": getBooleanFromNumber(isUnderline || 0 /* FALSE */)
        }),
        onClick: () => setIsUnderline(getAnotherBooleanNumber(isUnderline)),
        children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(UnderlineIcon, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "div",
      {
        className: clsx(buttonItemClassName, {
          "univer-bg-gray-100 dark:!univer-bg-gray-700": getBooleanFromNumber(isStrikethrough || 0 /* FALSE */)
        }),
        onClick: () => setIsStrikethrough(getAnotherBooleanNumber(isStrikethrough)),
        children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(StrikethroughIcon, {})
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ColorPicker2, { color: fontColor, onChange: setFontColor, Icon: FontColorDoubleIcon }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ColorPicker2, { color: bgColor, onChange: setBgColor })
  ] });
};

// ../packages/sheets-conditional-formatting-ui/src/components/panel/rule-edit/Formula.tsx
var import_jsx_runtime6 = __toESM(require_jsx_runtime());
var FormulaStyleEditor = (props) => {
  var _a;
  const { onChange, interceptorManager } = props;
  const localeService = useDependency(LocaleService);
  const univerInstanceService = useDependency(IUniverInstanceService);
  const workbook = univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET);
  const worksheet = workbook.getActiveSheet();
  const rule = ((_a = props.rule) == null ? void 0 : _a.type) === "highlightCell" /* highlightCell */ ? props.rule : void 0;
  const divEleRef = (0, import_react6.useRef)(null);
  const [isFocusFormulaEditor, setIsFocusFormulaEditor] = (0, import_react6.useState)(false);
  const formulaEditorRef = (0, import_react6.useRef)(null);
  const [style, setStyle] = (0, import_react6.useState)({});
  const [formula, setFormula] = (0, import_react6.useState)(() => {
    if ((rule == null ? void 0 : rule.subType) === "formula" /* formula */) {
      return rule.value;
    }
    return "=";
  });
  const [formulaError, setFormulaError] = (0, import_react6.useState)(void 0);
  const getResult = (config) => {
    return {
      style: config.style,
      value: formula,
      type: "highlightCell" /* highlightCell */,
      subType: "formula" /* formula */
    };
  };
  (0, import_react6.useEffect)(() => {
    const dispose = interceptorManager.intercept(interceptorManager.getInterceptPoints().submit, {
      handler() {
        return getResult({ style, formula });
      }
    });
    return dispose;
  }, [style, formula, interceptorManager]);
  (0, import_react6.useEffect)(() => {
    const dispose = interceptorManager.intercept(interceptorManager.getInterceptPoints().beforeSubmit, {
      handler: (v, _c, next) => {
        if (formulaError || formula.length === 1 || !formula.startsWith("=")) {
          setFormulaError(localeService.t("sheet.cf.errorMessage.formulaError"));
          return false;
        }
        return next(v);
      }
    });
    return dispose;
  }, [formulaError, formula]);
  const _onChange = (config) => {
    onChange(getResult(config));
  };
  useSidebarClick((e) => {
    var _a2;
    const isOutSide = (_a2 = formulaEditorRef.current) == null ? void 0 : _a2.isClickOutSide(e);
    isOutSide && setIsFocusFormulaEditor(false);
  });
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { ref: divEleRef, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      "div",
      {
        className: `univer-mt-4 univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200`,
        children: localeService.t("sheet.cf.panel.styleRule")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "univer-mt-3", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      FormulaEditor,
      {
        ref: formulaEditorRef,
        className: clsx(`univer-box-border univer-h-8 univer-w-full univer-cursor-pointer univer-items-center univer-rounded-lg univer-bg-white univer-pt-2 univer-transition-colors hover:univer-border-primary-600 dark:!univer-bg-gray-700 dark:!univer-text-white [&>div:first-child]:univer-px-2.5 [&>div]:univer-h-5 [&>div]:univer-ring-transparent`, borderClassName),
        errorText: formulaError,
        isFocus: isFocusFormulaEditor,
        initValue: formula,
        unitId: workbook.getUnitId(),
        subUnitId: worksheet == null ? void 0 : worksheet.getSheetId(),
        onFocus: () => {
          setIsFocusFormulaEditor(true);
        },
        onChange: (formula2) => {
          setFormula(formula2);
          _onChange({ style, formula: formula2 });
        },
        onVerify: (result, formula2) => {
          if (!result || formula2.length === 1) {
            setFormulaError(localeService.t("sheet.cf.errorMessage.formulaError"));
          } else {
            setFormulaError(void 0);
          }
        }
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: previewClassName, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Preview, { rule: getResult({ style, formula }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      ConditionalStyleEditor,
      {
        style: rule == null ? void 0 : rule.style,
        className: "univer-mt-3",
        onChange: (v) => {
          setStyle(v);
          _onChange({ style: v, formula });
        }
      }
    )
  ] });
};

// ../packages/sheets-conditional-formatting-ui/src/components/panel/rule-edit/HighlightCell.tsx
var import_react7 = __toESM(require_react());

// ../packages/sheets-conditional-formatting-ui/src/components/wrapper-error/WrapperError.tsx
var import_jsx_runtime7 = __toESM(require_jsx_runtime());
var WrapperError = (props) => {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "univer-relative", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "div",
      {
        className: "univer-absolute univer-bottom-[-13px] univer-z-[999] univer-text-[10px] univer-text-red-500",
        children: props.errorText
      }
    ),
    props.children
  ] });
};

// ../packages/sheets-conditional-formatting-ui/src/components/panel/rule-edit/HighlightCell.tsx
var import_jsx_runtime8 = __toESM(require_jsx_runtime());
var createOptionItem3 = (text, localeService) => ({ label: localeService.t(`sheet.cf.operator.${text}`), value: text });
var HighlightCellInput = (props) => {
  const { type, operator, onChange, value, interceptorManager } = props;
  const localeService = useDependency(LocaleService);
  const [inputNumberValue, setInputNumberValue] = (0, import_react7.useState)(() => typeof value === "number" ? value : 0);
  const [numberError, setNumberError] = (0, import_react7.useState)("");
  const [inputTextValue, setInputTextValue] = (0, import_react7.useState)(() => typeof value === "string" ? value : "");
  const [textError, setTextError] = (0, import_react7.useState)("");
  const [inputNumberMin, setInputNumberMin] = (0, import_react7.useState)(() => Array.isArray(value) ? value[0] === void 0 ? 0 : value[0] : 0);
  const [numberMinError, setNumberMinError] = (0, import_react7.useState)("");
  const [inputNumberMax, setInputNumberMax] = (0, import_react7.useState)(() => Array.isArray(value) ? value[1] === void 0 ? 100 : value[1] : 100);
  const [numberMaxError, setNumberMaxError] = (0, import_react7.useState)("");
  (0, import_react7.useEffect)(() => {
    switch (type) {
      case "text" /* text */: {
        if (["beginsWith" /* beginsWith */, "endsWith" /* endsWith */, "containsText" /* containsText */, "notContainsText" /* notContainsText */, "equal" /* equal */, "notEqual" /* notEqual */].includes(operator)) {
          onChange(inputTextValue);
        }
        break;
      }
      case "number" /* number */: {
        if (["equal" /* equal */, "notEqual" /* notEqual */, "greaterThan" /* greaterThan */, "greaterThanOrEqual" /* greaterThanOrEqual */, "lessThan" /* lessThan */, "lessThanOrEqual" /* lessThanOrEqual */].includes(operator)) {
          onChange(inputNumberValue);
        }
        if (["between" /* between */, "notBetween" /* notBetween */].includes(operator)) {
          onChange([inputNumberMin, inputNumberMax]);
        }
        break;
      }
    }
  }, [type]);
  (0, import_react7.useEffect)(() => {
    const dispose = interceptorManager.intercept(interceptorManager.getInterceptPoints().beforeSubmit, {
      handler: (v, _c, next) => {
        switch (type) {
          case "text" /* text */: {
            if (["beginsWith" /* beginsWith */, "containsText" /* containsText */, "endsWith" /* endsWith */, "notEqual" /* notEqual */, "notContainsText" /* notContainsText */, "equal" /* equal */].includes(operator)) {
              if (!inputTextValue) {
                setTextError(localeService.t("sheet.cf.errorMessage.notBlank"));
                return false;
              }
              return next(v);
            }
          }
        }
        return next(v);
      }
    });
    return () => {
      dispose();
    };
  }, [type, inputNumberValue, inputTextValue, operator]);
  switch (type) {
    case "text" /* text */: {
      if (["beginsWith" /* beginsWith */, "endsWith" /* endsWith */, "containsText" /* containsText */, "notContainsText" /* notContainsText */, "equal" /* equal */, "notEqual" /* notEqual */].includes(operator)) {
        const _onChange = (value2) => {
          setInputTextValue(value2);
          onChange(value2);
        };
        return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "univer-mt-3", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(WrapperError, { errorText: textError, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          Input,
          {
            value: inputTextValue,
            onChange: (v) => {
              setTextError("");
              _onChange(v);
            }
          }
        ) }) });
      }
      break;
    }
    case "number" /* number */: {
      if (["equal" /* equal */, "notEqual" /* notEqual */, "greaterThan" /* greaterThan */, "greaterThanOrEqual" /* greaterThanOrEqual */, "lessThan" /* lessThan */, "lessThanOrEqual" /* lessThanOrEqual */].includes(operator)) {
        const _onChange = (value2) => {
          setInputNumberValue(value2 || 0);
          onChange(value2 || 0);
          setNumberError("");
        };
        return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "univer-mt-3", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(WrapperError, { errorText: numberError, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
          InputNumber,
          {
            className: "univer-w-full",
            min: Number.MIN_SAFE_INTEGER,
            max: Number.MAX_SAFE_INTEGER,
            value: inputNumberValue,
            onChange: _onChange
          }
        ) }) });
      }
      if (["between" /* between */, "notBetween" /* notBetween */].includes(operator)) {
        const onChangeMin = (_value) => {
          setInputNumberMin(_value || 0);
          const value2 = [_value || 0, inputNumberMax];
          onChange(value2);
          setNumberMinError("");
        };
        const onChangeMax = (_value) => {
          setInputNumberMax(_value || 0);
          const value2 = [inputNumberMin, _value || 0];
          onChange(value2);
          setNumberMaxError("");
        };
        return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "univer-mt-3 univer-flex univer-items-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(WrapperError, { errorText: numberMinError, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(InputNumber, { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER, value: inputNumberMin, onChange: onChangeMin }) }),
          /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(WrapperError, { errorText: numberMaxError, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
            InputNumber,
            {
              className: "univer-ml-3",
              min: Number.MIN_SAFE_INTEGER,
              max: Number.MAX_SAFE_INTEGER,
              value: inputNumberMax,
              onChange: onChangeMax
            }
          ) })
        ] });
      }
    }
  }
  return null;
};
var getOperatorOptions = (type, localeService) => {
  switch (type) {
    case "text" /* text */: {
      return [
        createOptionItem3("containsText" /* containsText */, localeService),
        createOptionItem3("notContainsText" /* notContainsText */, localeService),
        createOptionItem3("beginsWith" /* beginsWith */, localeService),
        createOptionItem3("endsWith" /* endsWith */, localeService),
        createOptionItem3("equal" /* equal */, localeService),
        createOptionItem3("notEqual" /* notEqual */, localeService),
        createOptionItem3("containsBlanks" /* containsBlanks */, localeService),
        createOptionItem3("notContainsBlanks" /* notContainsBlanks */, localeService),
        createOptionItem3("containsErrors" /* containsErrors */, localeService),
        createOptionItem3("notContainsErrors" /* notContainsErrors */, localeService)
      ];
    }
    case "number" /* number */: {
      return [
        createOptionItem3("between" /* between */, localeService),
        createOptionItem3("notBetween" /* notBetween */, localeService),
        createOptionItem3("equal" /* equal */, localeService),
        createOptionItem3("notEqual" /* notEqual */, localeService),
        createOptionItem3("greaterThan" /* greaterThan */, localeService),
        createOptionItem3("greaterThanOrEqual" /* greaterThanOrEqual */, localeService),
        createOptionItem3("lessThan" /* lessThan */, localeService),
        createOptionItem3("lessThanOrEqual" /* lessThanOrEqual */, localeService)
      ];
    }
    case "timePeriod" /* timePeriod */: {
      return [
        createOptionItem3("yesterday" /* yesterday */, localeService),
        createOptionItem3("today" /* today */, localeService),
        createOptionItem3("tomorrow" /* tomorrow */, localeService),
        createOptionItem3("last7Days" /* last7Days */, localeService),
        createOptionItem3("lastWeek" /* lastWeek */, localeService),
        createOptionItem3("thisWeek" /* thisWeek */, localeService),
        createOptionItem3("nextWeek" /* nextWeek */, localeService),
        createOptionItem3("lastMonth" /* lastMonth */, localeService),
        createOptionItem3("thisMonth" /* thisMonth */, localeService),
        createOptionItem3("nextMonth" /* nextMonth */, localeService)
      ];
    }
  }
};
var HighlightCellStyleEditor = (props) => {
  var _a;
  const { interceptorManager, onChange } = props;
  const localeService = useDependency(LocaleService);
  const rule = ((_a = props.rule) == null ? void 0 : _a.type) === "highlightCell" /* highlightCell */ ? props.rule : void 0;
  const [subType, setSubType] = (0, import_react7.useState)(() => {
    const defaultV = "text" /* text */;
    if (!rule) {
      return defaultV;
    }
    return rule.subType || defaultV;
  });
  const typeOptions = [{
    value: "text" /* text */,
    label: localeService.t("sheet.cf.subRuleType.text")
  }, {
    value: "number" /* number */,
    label: localeService.t("sheet.cf.subRuleType.number")
  }, {
    value: "timePeriod" /* timePeriod */,
    label: localeService.t("sheet.cf.subRuleType.timePeriod")
  }, {
    value: "duplicateValues" /* duplicateValues */,
    label: localeService.t("sheet.cf.subRuleType.duplicateValues")
  }, {
    value: "uniqueValues" /* uniqueValues */,
    label: localeService.t("sheet.cf.subRuleType.uniqueValues")
  }];
  const operatorOptions = (0, import_react7.useMemo)(() => getOperatorOptions(subType, localeService), [subType]);
  const [operator, setOperator] = (0, import_react7.useState)(() => {
    const defaultV = operatorOptions ? operatorOptions[0].value : void 0;
    if (!rule) {
      return defaultV;
    }
    return rule.operator || defaultV;
  });
  const [value, setValue] = (0, import_react7.useState)(() => {
    var _a2;
    const defaultV = "";
    if (!rule) {
      return defaultV;
    }
    const v = (_a2 = rule.value) != null ? _a2 : createDefaultValue(rule.subType, rule.operator);
    return v;
  });
  const [style, setStyle] = (0, import_react7.useState)({});
  const getResult = (0, import_react7.useMemo)(() => (option) => {
    var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
    switch (option.subType || subType) {
      case "text" /* text */: {
        if (["beginsWith" /* beginsWith */, "endsWith" /* endsWith */, "containsText" /* containsText */, "notContainsText" /* notContainsText */, "equal" /* equal */, "notEqual" /* notEqual */].includes(operator)) {
          return {
            type: "highlightCell" /* highlightCell */,
            subType: (_a2 = option.subType) != null ? _a2 : subType,
            operator: (_b = option.operator) != null ? _b : operator,
            style: (_c = option.style) != null ? _c : style,
            value: (_d = option.value) != null ? _d : value
          };
        }
        break;
      }
      case "number" /* number */: {
        if (["equal" /* equal */, "notEqual" /* notEqual */, "greaterThan" /* greaterThan */, "greaterThanOrEqual" /* greaterThanOrEqual */, "lessThan" /* lessThan */, "lessThanOrEqual" /* lessThanOrEqual */].includes(operator)) {
          return {
            type: "highlightCell" /* highlightCell */,
            subType: (_e = option.subType) != null ? _e : subType,
            operator: (_f = option.operator) != null ? _f : operator,
            style: (_g = option.style) != null ? _g : style,
            value: (_h = option.value) != null ? _h : value
          };
        }
        if (["between" /* between */, "notBetween" /* notBetween */].includes(operator)) {
          return {
            type: "highlightCell" /* highlightCell */,
            subType: (_i = option.subType) != null ? _i : subType,
            operator: (_j = option.operator) != null ? _j : operator,
            style: (_k = option.style) != null ? _k : style,
            value: (_l = option.value) != null ? _l : value
          };
        }
        break;
      }
    }
    return {
      type: "highlightCell" /* highlightCell */,
      subType: (_m = option.subType) != null ? _m : subType,
      operator: (_n = option.operator) != null ? _n : operator,
      style: (_o = option.style) != null ? _o : style
    };
  }, [subType, operator, value, style]);
  (0, import_react7.useEffect)(() => {
    const dispose = interceptorManager.intercept(interceptorManager.getInterceptPoints().submit, {
      handler() {
        return getResult({});
      }
    });
    return dispose;
  }, [getResult, interceptorManager]);
  (0, import_react7.useEffect)(() => {
    if (!typeOptions.some((item) => item.value === subType)) {
      setSubType(typeOptions[0].value);
    }
  }, [typeOptions]);
  const onTypeChange = (v) => {
    const _subType = v;
    const operatorList = getOperatorOptions(_subType, localeService);
    const _operator = operatorList && operatorList[0].value;
    setSubType(_subType);
    setOperator(_operator);
    _operator && setValue(createDefaultValue(_subType, _operator));
    onChange(getResult({ subType: _subType, operator: _operator }));
  };
  const onOperatorChange = (v) => {
    const _operator = v;
    setOperator(_operator);
    onChange(getResult({ operator: _operator }));
  };
  const onInputChange = (value2) => {
    setValue(value2);
    onChange(getResult({ value: value2 }));
  };
  const inputRenderKey = (0, import_react7.useMemo)(() => {
    return `${subType}_${operator}_${Math.random()}`;
  }, [subType, operator]);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      "div",
      {
        className: `univer-mt-4 univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200`,
        children: localeService.t("sheet.cf.panel.styleRule")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { className: "univer-flex univer-justify-between univer-gap-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        Select,
        {
          className: "univer-mt-3 univer-w-full",
          onChange: onTypeChange,
          value: subType,
          options: typeOptions
        }
      ),
      (operatorOptions == null ? void 0 : operatorOptions.length) && /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
        Select,
        {
          className: "univer-mt-3 univer-w-full",
          onChange: onOperatorChange,
          value: operator || "",
          options: operatorOptions
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      HighlightCellInput,
      {
        value,
        interceptorManager,
        type: subType,
        operator,
        rule,
        onChange: onInputChange
      },
      inputRenderKey
    ),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: previewClassName, children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Preview, { rule: getResult({}) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
      ConditionalStyleEditor,
      {
        style: rule == null ? void 0 : rule.style,
        className: "univer-ml-1",
        onChange: (v) => {
          setStyle(v);
          onChange(getResult({ style: v }));
        }
      }
    )
  ] });
};

// ../packages/sheets-conditional-formatting-ui/src/components/panel/rule-edit/IconSet.tsx
var import_react8 = __toESM(require_react());
var import_jsx_runtime9 = __toESM(require_jsx_runtime());
var getIcon = (iconType, iconId) => {
  const arr = iconMap[iconType] || [];
  return arr[Number(iconId)] || "";
};
var TextInput2 = (props) => {
  var _a;
  const { error, type, onChange } = props;
  const univerInstanceService = useDependency(IUniverInstanceService);
  const unitId = univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET).getUnitId();
  const subUnitId = (_a = univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET).getActiveSheet()) == null ? void 0 : _a.getSheetId();
  const formulaEditorRef = (0, import_react8.useRef)(null);
  const [isFocusFormulaEditor, setIsFocusFormulaEditor] = (0, import_react8.useState)(false);
  useSidebarClick((e) => {
    var _a2;
    const isOutSide = (_a2 = formulaEditorRef.current) == null ? void 0 : _a2.isClickOutSide(e);
    isOutSide && setIsFocusFormulaEditor(false);
  });
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "univer-relative", children: type !== "formula" /* formula */ ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      InputNumber,
      {
        className: clsx({
          "univer-border-red-500": error
        }),
        value: Number(props.value) || 0,
        onChange: (v) => onChange(v != null ? v : 0)
      }
    ),
    error && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "univer-absolute univer-text-xs univer-text-red-500", children: error })
  ] }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "univer-w-full", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
    FormulaEditor,
    {
      ref: formulaEditorRef,
      className: clsx(`univer-box-border univer-h-8 univer-w-full univer-cursor-pointer univer-items-center univer-rounded-lg univer-bg-white univer-pt-2 univer-transition-colors hover:univer-border-primary-600 dark:!univer-bg-gray-700 dark:!univer-text-white [&>div:first-child]:univer-px-2.5 [&>div]:univer-h-5 [&>div]:univer-ring-transparent`, borderClassName),
      initValue: String(props.value),
      unitId,
      subUnitId,
      isFocus: isFocusFormulaEditor,
      onChange: (v = "") => {
        const formula = v || "";
        onChange(formula);
      },
      onFocus: () => setIsFocusFormulaEditor(true)
    }
  ) }) });
};
var createDefaultConfigItem = (iconType, index, list) => ({
  operator: "greaterThan" /* greaterThan */,
  value: { type: "num" /* num */, value: (list.length - 1 - index) * 10 },
  iconType,
  iconId: String(index)
});
var IconGroupList = (0, import_react8.forwardRef)((props, ref) => {
  const { onClick } = props;
  const localeService = useDependency(LocaleService);
  const handleClick = (iconType) => {
    onClick(iconType);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { ref, className: "univer-w-80", children: iconGroup.map((group, index) => {
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "univer-mb-3", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "univer-mb-1 univer-text-sm", children: localeService.t(group.title) }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "univer-flex univer-flex-wrap", children: group.group.map((groupItem) => {
        return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "div",
          {
            className: "univer-mb-1 univer-flex univer-w-1/2 univer-items-center",
            onClick: () => {
              handleClick(groupItem.name);
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "a",
              {
                className: `univer-cursor-pointer univer-rounded hover:univer-bg-gray-100 dark:hover:!univer-bg-gray-700`,
                children: groupItem.list.map((base64, index2) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                  "img",
                  {
                    className: "univer-size-5",
                    src: base64,
                    draggable: false
                  },
                  index2
                ))
              }
            )
          },
          groupItem.name
        );
      }) })
    ] }, index);
  }) });
});
var IconItemList = (props) => {
  const { onClick } = props;
  const list = (0, import_react8.useMemo)(() => {
    const result = [];
    for (const key in iconMap) {
      const list2 = iconMap[key];
      const iconType = key;
      list2.forEach((base64, index) => {
        result.push({
          iconType,
          base64,
          iconId: String(index)
        });
      });
    }
    return result;
  }, []);
  const handleClick = (item) => {
    onClick(item.iconType, item.iconId);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
      "div",
      {
        className: "univer-mb-2.5 univer-flex univer-cursor-pointer univer-items-center univer-pl-1",
        onClick: () => handleClick({ iconType: EMPTY_ICON_TYPE, iconId: "", base64: "" }),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(SlashDoubleIcon, { className: "univer-size-5" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "univer-ml-2", children: "\u65E0\u5355\u5143\u683C\u56FE\u6807" })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "univer-flex univer-w-64 univer-flex-wrap", children: list.map((item) => /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      "div",
      {
        className: `univer-mb-2 univer-mr-2 univer-flex univer-cursor-pointer univer-items-center univer-justify-center univer-rounded hover:univer-bg-gray-100 dark:hover:!univer-bg-gray-700`,
        children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "img",
          {
            className: "univer-size-5",
            src: item.base64,
            draggable: false,
            onClick: () => handleClick(item)
          }
        )
      },
      `${item.iconType}_${item.iconId}`
    )) })
  ] });
};
var IconSetRuleEdit = (props) => {
  const { onChange, configList, errorMap = {} } = props;
  const localeService = useDependency(LocaleService);
  const options = [{ label: localeService.t(`sheet.cf.symbol.${"greaterThan" /* greaterThan */}`), value: "greaterThan" /* greaterThan */ }, { label: localeService.t(`sheet.cf.symbol.${"greaterThanOrEqual" /* greaterThanOrEqual */}`), value: "greaterThanOrEqual" /* greaterThanOrEqual */ }];
  const valueTypeOptions = [
    { label: localeService.t(`sheet.cf.valueType.${"num" /* num */}`), value: "num" /* num */ },
    { label: localeService.t(`sheet.cf.valueType.${"percent" /* percent */}`), value: "percent" /* percent */ },
    { label: localeService.t(`sheet.cf.valueType.${"percentile" /* percentile */}`), value: "percentile" /* percentile */ },
    { label: localeService.t(`sheet.cf.valueType.${"formula" /* formula */}`), value: "formula" /* formula */ }
  ];
  const handleValueValueChange = (v, index) => {
    onChange([String(index), "value", "value"], v);
  };
  const handleOperatorChange = (operator, index) => {
    onChange([String(index), "operator"], operator);
    const defaultValue = createDefaultValue("number" /* number */, operator);
    handleValueValueChange(defaultValue, index);
  };
  const handleValueTypeChange = (v, index) => {
    onChange([String(index), "value", "type"], v);
    const item = configList[index];
    const defaultValue = createDefaultValue("number" /* number */, item.operator);
    handleValueValueChange(defaultValue, index);
  };
  const render = (0, import_react8.useMemo)(() => {
    return configList.map((item, index) => {
      const error = errorMap[index];
      const icon = getIcon(item.iconType, item.iconId);
      const isEnd = index === configList.length - 1;
      const isFirst = index === 0;
      const preItem = configList[index - 1];
      const lessThanText = (preItem == null ? void 0 : preItem.value.type) === "formula" /* formula */ ? localeService.t("sheet.cf.valueType.formula") : preItem == null ? void 0 : preItem.value.value;
      const handleIconClick = (iconType, iconId) => {
        const value = { ...item, iconId, iconType };
        onChange([String(index)], value);
      };
      return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
        "div",
        {
          className: index ? "univer-mt-6" : "univer-mt-3",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
              "div",
              {
                className: `univer-mt-3 univer-flex univer-items-center univer-justify-between univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200`,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
                    "div",
                    {
                      className: "univer-w-[45%]",
                      children: [
                        localeService.t("sheet.cf.iconSet.icon"),
                        index + 1
                      ]
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "univer-w-[45%]", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
                    !isFirst && !isEnd && localeService.t("sheet.cf.iconSet.rule"),
                    !isFirst && !isEnd && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
                      "span",
                      {
                        className: `univer-font-medium univer-text-gray-600 dark:!univer-text-gray-200`,
                        children: [
                          localeService.t("sheet.cf.iconSet.when"),
                          localeService.t(`sheet.cf.symbol.${getOppositeOperator(preItem.operator)}`),
                          lessThanText,
                          isEnd ? "" : ` ${localeService.t("sheet.cf.iconSet.and")} `
                        ]
                      }
                    )
                  ] }) })
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "univer-mt-3 univer-grid univer-grid-cols-2 univer-gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "univer-flex univer-items-center", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                Dropdown,
                {
                  overlay: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "univer-rounded-lg univer-p-4", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(IconItemList, { onClick: handleIconClick, iconId: item.iconId, iconType: item.iconType }) }),
                  children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
                    "div",
                    {
                      className: clsx(`univer-box-border univer-flex univer-h-8 univer-w-full univer-items-center univer-justify-between univer-rounded-md univer-bg-white univer-px-4 univer-py-2 univer-text-xs univer-text-gray-600 univer-transition-all hover:univer-border-primary-600 dark:!univer-text-gray-200`, borderClassName),
                      children: [
                        icon ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("img", { src: icon, className: "univer-size-4", draggable: false }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(SlashDoubleIcon, { className: "univer-size-4" }),
                        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(MoreDownIcon, {})
                      ]
                    }
                  )
                }
              ) }),
              !isEnd ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                Select,
                {
                  options,
                  value: item.operator,
                  onChange: (v) => {
                    handleOperatorChange(v, index);
                  }
                }
              ) : /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
                "div",
                {
                  className: `univer-mt-0 univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200`,
                  children: [
                    localeService.t("sheet.cf.iconSet.rule"),
                    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("span", { className: "univer-font-medium", children: [
                      localeService.t("sheet.cf.iconSet.when"),
                      localeService.t(`sheet.cf.symbol.${getOppositeOperator(preItem.operator)}`),
                      lessThanText,
                      isEnd ? "" : ` ${localeService.t("sheet.cf.iconSet.and")} `
                    ] })
                  ]
                }
              )
            ] }),
            !isEnd ? /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(import_jsx_runtime9.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
                "div",
                {
                  className: `univer-mt-3 univer-grid univer-grid-cols-2 univer-gap-4 univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200`,
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { children: localeService.t("sheet.cf.iconSet.type") }),
                    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { children: localeService.t("sheet.cf.iconSet.value") })
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
                "div",
                {
                  className: "univer-mt-3 univer-grid univer-grid-cols-2 univer-gap-4",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                      Select,
                      {
                        options: valueTypeOptions,
                        value: item.value.type,
                        onChange: (v) => {
                          handleValueTypeChange(v, index);
                        }
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
                      TextInput2,
                      {
                        id: index,
                        type: item.value.type,
                        error,
                        value: item.value.value || "",
                        onChange: (v) => {
                          handleValueValueChange(v, index);
                        }
                      }
                    )
                  ]
                }
              )
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", {})
          ]
        },
        index
      );
    });
  }, [configList, errorMap]);
  return render;
};
var IconSet = (props) => {
  var _a;
  const { interceptorManager } = props;
  const rule = ((_a = props.rule) == null ? void 0 : _a.type) === "iconSet" /* iconSet */ ? props.rule : void 0;
  const localeService = useDependency(LocaleService);
  const [errorMap, setErrorMap] = (0, import_react8.useState)({});
  const [currentIconType, setCurrentIconType] = (0, import_react8.useState)(() => {
    const defaultV = Object.keys(iconMap)[0];
    if (rule && rule.config.length) {
      const type = rule.config[0].iconType;
      const isNotSame = rule.config.some((item) => item.iconType !== type);
      if (!isNotSame) {
        return type;
      }
    }
    return defaultV;
  });
  const [configList, setConfigList] = (0, import_react8.useState)(() => {
    if (rule && rule.config.length) {
      return Tools.deepClone(rule == null ? void 0 : rule.config);
    }
    const list = iconMap[currentIconType] || [];
    return new Array(list.length).fill("").map((_e, index, list2) => {
      if (index === list2.length - 1) {
        return {
          operator: "lessThanOrEqual" /* lessThanOrEqual */,
          value: { type: "num" /* num */, value: Number.MAX_SAFE_INTEGER },
          iconType: currentIconType,
          iconId: String(index)
        };
      }
      return createDefaultConfigItem(currentIconType, index, list2);
    });
  });
  const [isShowValue, setIsShowValue] = (0, import_react8.useState)(() => {
    if (!rule) {
      return true;
    }
    return !!rule.isShowValue;
  });
  const previewIcon = (0, import_react8.useMemo)(() => {
    const list = configList.map((item) => {
      return getIcon(item.iconType, item.iconId);
    });
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "univer-flex univer-items-center", children: list.map((icon, index) => icon ? /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      "img",
      {
        className: "univer-size-5",
        src: icon
      },
      index
    ) : /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(SlashDoubleIcon, { className: "univer-size-5" }, index)) });
  }, [configList]);
  const checkResult = (_configList) => {
    const isTypeSame = _configList.reduce((pre, cur, index) => {
      if (pre.preType && !pre.result || _configList.length - 1 === index) {
        return pre;
      }
      if (cur.value.type === "formula" /* formula */) {
        return {
          preType: "formula" /* formula */,
          result: false
        };
      }
      if (pre.preType) {
        return {
          result: pre.preType === cur.value.type,
          preType: cur.value.type
        };
      } else {
        return {
          result: true,
          preType: cur.value.type
        };
      }
    }, { result: true, preType: "" }).result;
    if (isTypeSame && ["num" /* num */, "percent" /* percent */, "percentile" /* percentile */].includes(_configList[0].value.type)) {
      const result = {};
      _configList.forEach((item, index, arr) => {
        const preIndex = index - 1;
        if (preIndex < 0 || index === arr.length - 1) {
          return;
        }
        const preItem = _configList[index - 1];
        const preOperator = getOppositeOperator(preItem.operator);
        if (!compareWithNumber({ operator: preOperator, value: preItem.value.value }, item.value.value)) {
          result[index] = `${localeService.t(`sheet.cf.form.${preOperator}`, String(preItem.value.value))} `;
        }
      });
      return result;
    }
    return {};
  };
  const handleChange = (keys, v) => {
    const oldV = get_default(configList, keys);
    if (oldV !== v) {
      set_default(configList, keys, v);
      setConfigList([...configList]);
      setErrorMap(checkResult(configList));
    }
  };
  const handleClickIconList = (iconType) => {
    setCurrentIconType(iconType);
    const list = iconMap[iconType] || [];
    const config = new Array(list.length).fill("").map((_e, index, list2) => createDefaultConfigItem(iconType, index, list2));
    setConfigList(config);
    setErrorMap(checkResult(config));
  };
  (0, import_react8.useEffect)(() => {
    const dispose = interceptorManager.intercept(interceptorManager.getInterceptPoints().submit, {
      handler() {
        const result = { type: "iconSet" /* iconSet */, isShowValue, config: configList };
        return result;
      }
    });
    return () => {
      dispose();
    };
  }, [isShowValue, configList, interceptorManager]);
  (0, import_react8.useEffect)(() => {
    const dispose = interceptorManager.intercept(interceptorManager.getInterceptPoints().beforeSubmit, {
      handler() {
        const keys = Object.keys(errorMap);
        return keys.length === 0;
      }
    });
    return () => {
      dispose();
    };
  }, [isShowValue, configList, interceptorManager, errorMap]);
  const reverseIcon = () => {
    const iconList = configList.map((item) => ({ ...item }));
    configList.forEach((item, index) => {
      const mirrorIndex = configList.length - 1 - index;
      const newIcon = iconList[mirrorIndex];
      item.iconId = newIcon.iconId;
      item.iconType = newIcon.iconType;
    });
    setConfigList([...configList]);
  };
  const layoutService = useDependency(ILayoutService);
  const [iconGroupListEl, setIconGroupListEl] = (0, import_react8.useState)();
  useScrollYOverContainer(iconGroupListEl, layoutService.rootContainerElement);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "univer-mt-4 univer-text-sm univer-text-gray-600", children: localeService.t("sheet.cf.panel.styleRule") }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "univer-mt-3", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      Dropdown,
      {
        overlay: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "univer-rounded-lg univer-p-4", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          IconGroupList,
          {
            ref: (el) => {
              !iconGroupListEl && el && setIconGroupListEl(el);
            },
            iconType: currentIconType,
            onClick: handleClickIconList
          }
        ) }),
        children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
          "div",
          {
            className: clsx(`univer-box-border univer-flex univer-h-8 univer-w-full univer-items-center univer-justify-between univer-rounded-md univer-bg-white univer-px-4 univer-py-2 univer-text-xs univer-text-gray-600 univer-transition-all hover:univer-border-primary-600`, borderClassName),
            children: [
              previewIcon,
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(MoreDownIcon, {})
            ]
          }
        )
      }
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "univer-mt-3 univer-flex univer-items-center univer-text-xs", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "univer-flex univer-items-center univer-text-xs", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Checkbox, { onChange: reverseIcon }),
        localeService.t("sheet.cf.iconSet.reverseIconOrder")
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "univer-ml-6 univer-flex univer-items-center univer-text-xs", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Checkbox, { checked: !isShowValue, onChange: (v) => {
          setIsShowValue(!v);
        } }),
        localeService.t("sheet.cf.iconSet.onlyShowIcon")
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(IconSetRuleEdit, { errorMap, onChange: handleChange, configList })
  ] });
};

// ../packages/sheets-conditional-formatting-ui/src/components/panel/rule-edit/Rank.tsx
var import_react9 = __toESM(require_react());
var import_jsx_runtime10 = __toESM(require_jsx_runtime());
var RankStyleEditor = (props) => {
  var _a;
  const { onChange, interceptorManager } = props;
  const localeService = useDependency(LocaleService);
  const rule = ((_a = props.rule) == null ? void 0 : _a.type) === "highlightCell" /* highlightCell */ ? props.rule : void 0;
  const options = [{ label: localeService.t("sheet.cf.panel.isNotBottom"), value: "isNotBottom" }, { label: localeService.t("sheet.cf.panel.isBottom"), value: "isBottom" }, { label: localeService.t("sheet.cf.panel.greaterThanAverage"), value: "greaterThanAverage" }, { label: localeService.t("sheet.cf.panel.lessThanAverage"), value: "lessThanAverage" }];
  const [type, setType] = (0, import_react9.useState)(() => {
    const defaultV = options[0].value;
    const type2 = rule == null ? void 0 : rule.type;
    if (!rule) {
      return defaultV;
    }
    switch (type2) {
      case "highlightCell" /* highlightCell */: {
        const subType = rule.subType;
        switch (subType) {
          case "average" /* average */: {
            if (["greaterThan" /* greaterThan */, "greaterThanOrEqual" /* greaterThanOrEqual */].includes(rule.operator)) {
              return "greaterThanAverage";
            }
            if (["lessThan" /* lessThan */, "lessThanOrEqual" /* lessThanOrEqual */].includes(rule.operator)) {
              return "lessThanAverage";
            }
            return defaultV;
          }
          case "rank" /* rank */: {
            if (rule.isBottom) {
              return "isBottom";
            } else {
              return "isNotBottom";
            }
          }
        }
      }
    }
    return defaultV;
  });
  const [value, setValue] = (0, import_react9.useState)(() => {
    const defaultV = 10;
    const type2 = rule == null ? void 0 : rule.type;
    if (!rule) {
      return defaultV;
    }
    switch (type2) {
      case "highlightCell" /* highlightCell */: {
        const subType = rule.subType;
        switch (subType) {
          case "rank" /* rank */: {
            return rule.value || defaultV;
          }
        }
      }
    }
    return defaultV;
  });
  const [isPercent, setIsPercent] = (0, import_react9.useState)(() => {
    const defaultV = false;
    const type2 = rule == null ? void 0 : rule.type;
    if (!rule) {
      return defaultV;
    }
    switch (type2) {
      case "highlightCell" /* highlightCell */: {
        const subType = rule.subType;
        switch (subType) {
          case "rank" /* rank */: {
            return rule.isPercent || defaultV;
          }
        }
      }
    }
    return defaultV;
  });
  const [style, setStyle] = (0, import_react9.useState)({});
  const getResult = (config) => {
    const { type: type2, isPercent: isPercent2, value: value2, style: style2 } = config;
    if (type2 === "isNotBottom") {
      return { type: "highlightCell" /* highlightCell */, subType: "rank" /* rank */, isPercent: isPercent2, isBottom: false, value: value2, style: style2 };
    }
    if (type2 === "isBottom") {
      return { type: "highlightCell" /* highlightCell */, subType: "rank" /* rank */, isPercent: isPercent2, isBottom: true, value: value2, style: style2 };
    }
    if (type2 === "greaterThanAverage") {
      return { type: "highlightCell" /* highlightCell */, subType: "average" /* average */, operator: "greaterThan" /* greaterThan */, style: style2 };
    }
    if (type2 === "lessThanAverage") {
      return { type: "highlightCell" /* highlightCell */, subType: "average" /* average */, operator: "lessThan" /* lessThan */, style: style2 };
    }
  };
  (0, import_react9.useEffect)(() => {
    const dispose = interceptorManager.intercept(interceptorManager.getInterceptPoints().submit, {
      handler() {
        return getResult({ type, isPercent, value, style });
      }
    });
    return dispose;
  }, [type, isPercent, value, style, interceptorManager]);
  const _onChange = (config) => {
    onChange(getResult(config));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      "div",
      {
        className: `univer-mt-4 univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200`,
        children: localeService.t("sheet.cf.panel.styleRule")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      Select,
      {
        className: "univer-mt-3 univer-w-full",
        value: type,
        options,
        onChange: (v) => {
          setType(v);
          _onChange({ type: v, isPercent, value, style });
        }
      }
    ),
    ["isNotBottom", "isBottom"].includes(type) && /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "univer-mt-3 univer-flex univer-items-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
        InputNumber,
        {
          min: 1,
          max: 1e3,
          value,
          onChange: (v) => {
            const value2 = v || 0;
            setValue(value2);
            _onChange({ type, isPercent, value: value2, style });
          }
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
        "div",
        {
          className: "univer-ml-3 univer-flex univer-items-center univer-text-xs",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
              Checkbox,
              {
                checked: isPercent,
                onChange: (v) => {
                  setIsPercent(!!v);
                  _onChange({ type, isPercent: !!v, value, style });
                }
              }
            ),
            localeService.t("sheet.cf.valueType.percent")
          ]
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { className: previewClassName, children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(Preview, { rule: getResult({ type, isPercent, value, style }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      ConditionalStyleEditor,
      {
        style: rule == null ? void 0 : rule.style,
        className: "univer-mt-3",
        onChange: (v) => {
          setStyle(v);
          _onChange({ type, isPercent, value, style: v });
        }
      }
    )
  ] });
};

// ../packages/sheets-conditional-formatting-ui/src/components/panel/rule-edit/type.ts
var beforeSubmit = createInterceptorKey("beforeSubmit");
var submit = createInterceptorKey("submit");

// ../packages/sheets-conditional-formatting-ui/src/components/panel/rule-edit/index.tsx
var import_jsx_runtime11 = __toESM(require_jsx_runtime());
var getUnitId = (univerInstanceService) => univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET).getUnitId();
var getSubUnitId = (univerInstanceService) => {
  var _a;
  return (_a = univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET).getActiveSheet()) == null ? void 0 : _a.getSheetId();
};
var RuleEdit = (props) => {
  var _a, _b, _c;
  const localeService = useDependency(LocaleService);
  const commandService = useDependency(ICommandService);
  const univerInstanceService = useDependency(IUniverInstanceService);
  const conditionalFormattingRuleModel = useDependency(ConditionalFormattingRuleModel);
  const selectionManagerService = useDependency(SheetsSelectionsService);
  const unitId = getUnitId(univerInstanceService);
  const subUnitId = getSubUnitId(univerInstanceService);
  const [errorText, setErrorText] = (0, import_react10.useState)(void 0);
  const rangeResult = (0, import_react10.useRef)((_b = (_a = props.rule) == null ? void 0 : _a.ranges) != null ? _b : []);
  const rangeString = (0, import_react10.useMemo)(() => {
    var _a2, _b2, _c2;
    let ranges = (_a2 = props.rule) == null ? void 0 : _a2.ranges;
    if (!(ranges == null ? void 0 : ranges.length)) {
      ranges = (_c2 = (_b2 = selectionManagerService.getCurrentSelections()) == null ? void 0 : _b2.map((s) => s.range)) != null ? _c2 : [];
    }
    rangeResult.current = ranges;
    if (!(ranges == null ? void 0 : ranges.length)) {
      return "";
    }
    return ranges.map((range) => {
      const v = serializeRange(range);
      return v === "NaN" ? "" : v;
    }).filter((r) => !!r).join(",");
  }, [props.rule]);
  const options = [
    { label: localeService.t("sheet.cf.ruleType.highlightCell"), value: "1" },
    { label: localeService.t("sheet.cf.panel.rankAndAverage"), value: "2" },
    { label: localeService.t("sheet.cf.ruleType.dataBar"), value: "3" },
    { label: localeService.t("sheet.cf.ruleType.colorScale"), value: "4" },
    { label: localeService.t("sheet.cf.ruleType.formula"), value: "5" },
    { label: localeService.t("sheet.cf.ruleType.iconSet"), value: "6" }
  ];
  const [ruleType, setRuleType] = (0, import_react10.useState)(() => {
    var _a2, _b2;
    const type = (_a2 = props.rule) == null ? void 0 : _a2.rule.type;
    const defaultType = options[0].value;
    if (!type) {
      return defaultType;
    }
    switch (type) {
      case "highlightCell" /* highlightCell */: {
        const subType = (_b2 = props.rule) == null ? void 0 : _b2.rule.subType;
        switch (subType) {
          case "number" /* number */:
          case "text" /* text */:
          case "duplicateValues" /* duplicateValues */:
          case "uniqueValues" /* uniqueValues */:
          case "timePeriod" /* timePeriod */: {
            return "1";
          }
          case "average" /* average */:
          case "rank" /* rank */: {
            return "2";
          }
          case "formula" /* formula */: {
            return "5";
          }
        }
        break;
      }
      case "dataBar" /* dataBar */: {
        return "3";
      }
      case "colorScale" /* colorScale */: {
        return "4";
      }
      case "iconSet" /* iconSet */: {
        return "6";
      }
    }
    return defaultType;
  });
  const result = (0, import_react10.useRef)(void 0);
  const interceptorManager = (0, import_react10.useMemo)(() => {
    const _interceptorManager = new InterceptorManager({ beforeSubmit, submit });
    return _interceptorManager;
  }, []);
  const StyleEditor = (0, import_react10.useMemo)(() => {
    switch (ruleType) {
      case "1": {
        return HighlightCellStyleEditor;
      }
      case "2": {
        return RankStyleEditor;
      }
      case "3": {
        return DataBarStyleEditor;
      }
      case "4": {
        return ColorScaleStyleEditor;
      }
      case "5": {
        return FormulaStyleEditor;
      }
      case "6": {
        return IconSet;
      }
      default: {
        return HighlightCellStyleEditor;
      }
    }
  }, [ruleType]);
  (0, import_react10.useEffect)(() => {
    const disposable = commandService.onCommandExecuted((commandInfo) => {
      if (commandInfo.id === RemoveSheetMutation.id) {
        const params = commandInfo.params;
        if (params.subUnitId === subUnitId && params.unitId === unitId) {
          props.onCancel();
        }
      }
      if (commandInfo.id === SetWorksheetActiveOperation.id) {
        props.onCancel();
      }
    });
    return () => disposable.dispose();
  }, []);
  const onStyleChange = (config) => {
    result.current = config;
  };
  const onRangeSelectorChange = (rangeString2) => {
    const result2 = rangeString2.split(",").filter((e) => !!e).map(deserializeRangeWithSheet).map((item) => item.range);
    rangeResult.current = result2;
  };
  const handleSubmit = () => {
    if (errorText) {
      return;
    }
    const getRanges = () => {
      const worksheet = univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET).getActiveSheet();
      if (!worksheet) {
        throw new Error("No active sheet found");
      }
      const ranges2 = rangeResult.current.map((range) => setEndForRange(range, worksheet.getRowCount(), worksheet.getColumnCount()));
      const result2 = ranges2.filter((range) => !(Number.isNaN(range.startRow) || Number.isNaN(range.startColumn)));
      return result2;
    };
    const ranges = getRanges();
    const beforeSubmitResult = interceptorManager.fetchThroughInterceptors(interceptorManager.getInterceptPoints().beforeSubmit)(true, null);
    if (beforeSubmitResult) {
      const result2 = interceptorManager.fetchThroughInterceptors(interceptorManager.getInterceptPoints().submit)(null, null);
      if (result2) {
        const unitId2 = getUnitId(univerInstanceService);
        const subUnitId2 = getSubUnitId(univerInstanceService);
        if (!unitId2 || !subUnitId2) {
          throw new Error("No active sheet found");
        }
        let rule = {};
        if (props.rule && props.rule.cfId) {
          rule = { ...props.rule, ranges, rule: result2 };
          commandService.executeCommand(SetCfCommand.id, { unitId: unitId2, subUnitId: subUnitId2, rule });
          props.onCancel();
        } else {
          const cfId = conditionalFormattingRuleModel.createCfId(unitId2, subUnitId2);
          rule = { cfId, ranges, rule: result2, stopIfTrue: false };
          commandService.executeCommand(AddCfCommand.id, { unitId: unitId2, subUnitId: subUnitId2, rule });
          props.onCancel();
        }
      }
    }
  };
  const handleCancel = () => {
    props.onCancel();
  };
  const handleVerify = (v, rangeText) => {
    if (v) {
      if (rangeText.length < 1) {
        setErrorText(localeService.t("sheet.cf.errorMessage.rangeError"));
      } else {
        setErrorText(void 0);
      }
    } else {
      setErrorText(localeService.t("sheet.cf.errorMessage.rangeError"));
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "div",
      {
        className: `univer-mt-4 univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200`,
        children: localeService.t("sheet.cf.panel.range")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "univer-mt-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        RangeSelector,
        {
          unitId,
          subUnitId,
          initialValue: rangeString,
          onChange: (_, text) => onRangeSelectorChange(text),
          onVerify: handleVerify
        }
      ),
      errorText && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "univer-mt-1 univer-text-xs univer-text-red-500", children: errorText })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "div",
      {
        className: `univer-mt-4 univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200`,
        children: localeService.t("sheet.cf.panel.styleType")
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      Select,
      {
        className: "univer-mt-4 univer-w-full",
        value: ruleType,
        options,
        onChange: (e) => setRuleType(e)
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      StyleEditor,
      {
        interceptorManager,
        rule: (_c = props.rule) == null ? void 0 : _c.rule,
        onChange: onStyleChange
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "univer-mt-4 univer-flex univer-justify-end", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Button, { onClick: handleCancel, children: localeService.t("sheet.cf.panel.cancel") }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Button, { className: "univer-ml-3", variant: "primary", onClick: handleSubmit, children: localeService.t("sheet.cf.panel.submit") })
    ] })
  ] });
};

// ../packages/sheets-conditional-formatting-ui/src/components/panel/rule-list/index.tsx
var import_react11 = __toESM(require_react());

// ../packages/sheets-conditional-formatting-ui/src/controllers/cf.i18n.controller.ts
var ConditionalFormattingI18nController = class extends Disposable {
  constructor(_localeService) {
    super();
    this._localeService = _localeService;
    __publicField(this, "_initLocal", () => {
    });
    __publicField(this, "_findReplaceIndex", (text) => {
      const reg = /\{([^}]+)?\}/g;
      const result = [];
      let currentValue = reg.exec(text);
      while (currentValue) {
        result.push({
          startIndex: currentValue.index,
          key: Number(currentValue[1]),
          endIndex: currentValue.index + currentValue[0].length - 1
        });
        currentValue = reg.exec(text);
      }
      return result;
    });
    this._initLocal();
  }
  tWithReactNode(key, ...args) {
    const locale = this._localeService.getLocales();
    const keys = key.split(".");
    const resolvedValue = locale && this._localeService.resolveKeyPath(locale, keys);
    if (typeof resolvedValue === "string") {
      const result = [];
      this._findReplaceIndex(resolvedValue).forEach((item, index, list) => {
        const preItem = list[index - 1] || { startIndex: 0, endIndex: -1 };
        if (preItem.endIndex + 1 < item.startIndex) {
          const text = resolvedValue.slice(preItem.endIndex + 1, item.startIndex);
          text && result.push(text);
        }
        args[item.key] && result.push(args[item.key]);
        if (index === list.length - 1) {
          const text = resolvedValue.slice(item.endIndex + 1);
          text && result.push(text);
        }
      });
      return result;
    }
    return [];
  }
};
ConditionalFormattingI18nController = __decorateClass([
  __decorateParam(0, Inject(LocaleService))
], ConditionalFormattingI18nController);

// ../packages/sheets-conditional-formatting-ui/src/components/panel/rule-list/index.tsx
var import_jsx_runtime12 = __toESM(require_jsx_runtime());
var getRuleDescribe = (rule, localeService) => {
  const ruleConfig = rule.rule;
  switch (ruleConfig.type) {
    case "colorScale" /* colorScale */: {
      return localeService.t("sheet.cf.ruleType.colorScale");
    }
    case "dataBar" /* dataBar */: {
      return localeService.t("sheet.cf.ruleType.dataBar");
    }
    case "iconSet" /* iconSet */: {
      return localeService.t("sheet.cf.ruleType.iconSet");
    }
    case "highlightCell" /* highlightCell */: {
      switch (ruleConfig.subType) {
        case "average" /* average */: {
          const operator = ruleConfig.operator;
          return localeService.t(`sheet.cf.preview.describe.${operator}`, localeService.t("sheet.cf.subRuleType.average"));
        }
        case "duplicateValues" /* duplicateValues */: {
          return localeService.t("sheet.cf.subRuleType.duplicateValues");
        }
        case "uniqueValues" /* uniqueValues */: {
          return localeService.t("sheet.cf.subRuleType.uniqueValues");
        }
        case "number" /* number */: {
          const operator = ruleConfig.operator;
          return localeService.t(`sheet.cf.preview.describe.${operator}`, ...Array.isArray(ruleConfig.value) ? ruleConfig.value.map((e) => String(e)) : [String(ruleConfig.value || "")]);
        }
        case "text" /* text */: {
          const operator = ruleConfig.operator;
          return localeService.t(`sheet.cf.preview.describe.${operator}`, ruleConfig.value || "");
        }
        case "timePeriod" /* timePeriod */: {
          const operator = ruleConfig.operator;
          return localeService.t(`sheet.cf.preview.describe.${operator}`);
        }
        case "rank" /* rank */: {
          if (ruleConfig.isPercent) {
            if (ruleConfig.isBottom) {
              return localeService.t("sheet.cf.preview.describe.bottomNPercent", String(ruleConfig.value));
            } else {
              return localeService.t("sheet.cf.preview.describe.topNPercent", String(ruleConfig.value));
            }
          } else {
            if (ruleConfig.isBottom) {
              return localeService.t("sheet.cf.preview.describe.bottomN", String(ruleConfig.value));
            } else {
              return localeService.t("sheet.cf.preview.describe.topN", String(ruleConfig.value));
            }
          }
        }
        case "formula" /* formula */: {
          return localeService.t("sheet.cf.ruleType.formula");
        }
      }
    }
  }
};
var defaultWidth = 0;
var RuleList = (props) => {
  const { onClick } = props;
  const conditionalFormattingRuleModel = useDependency(ConditionalFormattingRuleModel);
  const univerInstanceService = useDependency(IUniverInstanceService);
  const selectionManagerService = useDependency(SheetsSelectionsService);
  const commandService = useDependency(ICommandService);
  const localeService = useDependency(LocaleService);
  const injector = useDependency(Injector);
  const sidebarService = useDependency(ISidebarService);
  const conditionalFormattingI18nController = useDependency(ConditionalFormattingI18nController);
  const workbook = useObservable(() => univerInstanceService.getCurrentTypeOfUnit$(O.UNIVER_SHEET), void 0, void 0, []);
  const unitId = workbook.getUnitId();
  const worksheet = workbook.getActiveSheet();
  if (!worksheet) {
    throw new Error("No active sheet found");
  }
  const subUnitId = worksheet.getSheetId();
  const [currentRuleRanges, setCurrentRuleRanges] = (0, import_react11.useState)([]);
  const [selectValue, setSelectValue] = (0, import_react11.useState)("2");
  const [fetchRuleListId, setFetchRuleListId] = (0, import_react11.useState)(0);
  const [draggingId, setDraggingId] = (0, import_react11.useState)(-1);
  const [layoutWidth, setLayoutWidth] = (0, import_react11.useState)(defaultWidth);
  const layoutContainerRef = (0, import_react11.useRef)(null);
  const selectOption = [
    { label: localeService.t("sheet.cf.panel.workSheet"), value: "2" },
    { label: localeService.t("sheet.cf.panel.selectedRange"), value: "1" }
  ];
  const getRuleList = () => {
    const ruleList2 = conditionalFormattingRuleModel.getSubunitRules(unitId, subUnitId);
    if (!ruleList2 || !ruleList2.length) {
      return [];
    }
    if (selectValue === "1") {
      const selection = selectionManagerService.getCurrentLastSelection();
      if (!selection) {
        return [];
      }
      const range = selection.range;
      const _ruleList = ruleList2.filter((rule) => {
        return rule.ranges.some((ruleRange) => Rectangle.intersects(ruleRange, range));
      });
      return _ruleList;
    } else if (selectValue === "2") {
      return [...ruleList2];
    }
    return [];
  };
  const [ruleList, setRuleList] = (0, import_react11.useState)(getRuleList);
  useHighlightRange(currentRuleRanges);
  (0, import_react11.useEffect)(() => {
    const disposable = commandService.onCommandExecuted((commandInfo) => {
      if (commandInfo.id === SetWorksheetActiveOperation.id) {
        setFetchRuleListId(Math.random());
      }
    });
    return () => disposable.dispose();
  });
  (0, import_react11.useEffect)(() => {
    setRuleList(getRuleList);
  }, [selectValue, fetchRuleListId, unitId, subUnitId]);
  (0, import_react11.useEffect)(() => {
    if (selectValue === "2") {
      return;
    }
    const subscription = new Observable((commandSubscribe) => {
      const commandList2 = [SetSelectionsOperation.id, AddConditionalRuleMutation.id, SetConditionalRuleMutation.id, DeleteConditionalRuleMutation.id, MoveConditionalRuleMutation.id];
      const disposable = commandService.onCommandExecuted((commandInfo) => {
        const { id, params } = commandInfo;
        const unitId2 = univerInstanceService.getCurrentUnitOfType(O.UNIVER_SHEET).getUnitId();
        if (commandList2.includes(id) && params.unitId === unitId2) {
          commandSubscribe.next(null);
        }
      });
      return () => disposable.dispose();
    }).pipe(debounceTime(16)).subscribe(() => {
      setRuleList(getRuleList);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [univerInstanceService, selectValue, unitId, subUnitId]);
  (0, import_react11.useEffect)(() => {
    const dispose = conditionalFormattingRuleModel.$ruleChange.subscribe(() => {
      setFetchRuleListId(Math.random());
    });
    return () => dispose.unsubscribe();
  }, [conditionalFormattingRuleModel]);
  (0, import_react11.useEffect)(() => {
    const getWidth = () => {
      var _a, _b;
      const width = Math.max(0, ((_b = (_a = layoutContainerRef.current) == null ? void 0 : _a.getBoundingClientRect().width) != null ? _b : 0) - 8);
      defaultWidth = width;
      return width;
    };
    const observer = new Observable((subscribe) => {
      const targetElement = sidebarService.getContainer();
      if (targetElement) {
        let time = setTimeout(() => {
          subscribe.next(void 0);
        }, 150);
        const clearTime = () => {
          time && clearTimeout(time);
          time = null;
        };
        const handle = (e) => {
          if (e.propertyName === "width") {
            clearTime();
            subscribe.next(void 0);
          }
        };
        targetElement.addEventListener("transitionend", handle);
        return () => {
          clearTime();
          targetElement.removeEventListener("transitionend", handle);
        };
      }
    });
    const subscription = observer.pipe(debounceTime(16)).subscribe(() => {
      setLayoutWidth(getWidth());
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const handleDelete = (rule) => {
    var _a;
    const unitId2 = univerInstanceService.getCurrentUnitOfType(O.UNIVER_SHEET).getUnitId();
    const subUnitId2 = (_a = univerInstanceService.getCurrentUnitOfType(O.UNIVER_SHEET).getActiveSheet()) == null ? void 0 : _a.getSheetId();
    if (!unitId2 || !subUnitId2) {
      throw new Error("No active sheet found");
    }
    commandService.executeCommand(DeleteCfCommand.id, { unitId: unitId2, subUnitId: subUnitId2, cfId: rule.cfId });
  };
  const handleDragStart = (_layout, from) => {
    setDraggingId(from.y);
  };
  const handleDragStop = (_layout, from, to) => {
    var _a;
    setDraggingId(-1);
    const unitId2 = univerInstanceService.getCurrentUnitOfType(O.UNIVER_SHEET).getUnitId();
    const subUnitId2 = (_a = univerInstanceService.getCurrentUnitOfType(O.UNIVER_SHEET).getActiveSheet()) == null ? void 0 : _a.getSheetId();
    if (!unitId2 || !subUnitId2) {
      throw new Error("No active sheet found");
    }
    const getSaveIndex = (index) => {
      const length = ruleList.length;
      return Math.min(length - 1, Math.max(0, index));
    };
    const cfId = ruleList[getSaveIndex(from.y)].cfId;
    const targetCfId = ruleList[getSaveIndex(to.y)].cfId;
    if (cfId !== targetCfId) {
      commandService.executeCommand(MoveCfCommand.id, { unitId: unitId2, subUnitId: subUnitId2, start: { id: cfId, type: "self" }, end: { id: targetCfId, type: to.y > from.y ? "after" : "before" } });
    }
  };
  const handleCreate = () => {
    props.onCreate();
  };
  const handleClear = () => {
    if (selectValue === "2") {
      commandService.executeCommand(ClearWorksheetCfCommand.id);
    } else if (selectValue === "1") {
      const list = ruleList.map((rule) => ({ unitId, subUnitId, cfId: rule.cfId }));
      list.forEach((config) => {
        commandService.executeCommand(DeleteCfCommand.id, config);
      });
    }
  };
  const ruleListByPermissionCheck = (0, import_react11.useMemo)(() => {
    const workbook2 = univerInstanceService.getCurrentUnitOfType(O.UNIVER_SHEET);
    const worksheet2 = workbook2.getActiveSheet();
    return ruleList.filter((rule) => {
      const ranges = rule.ranges;
      const hasPermission = checkRangesEditablePermission(injector, workbook2.getUnitId(), worksheet2.getSheetId(), ranges);
      return hasPermission;
    });
  }, [ruleList]);
  const layout = ruleListByPermissionCheck.map((rule, index) => ({ i: rule.cfId, x: 0, w: 12, y: index, h: 1, isResizable: false }));
  const isHasAllRuleEditPermission = (0, import_react11.useMemo)(() => {
    const workbook2 = univerInstanceService.getCurrentUnitOfType(O.UNIVER_SHEET);
    const worksheet2 = workbook2.getActiveSheet();
    return ruleList.every((rule) => {
      const ranges = rule.ranges;
      const hasPermission = checkRangesEditablePermission(injector, workbook2.getUnitId(), worksheet2.getSheetId(), ranges);
      return hasPermission;
    });
  }, [ruleList]);
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "univer-flex univer-items-center univer-justify-between univer-gap-2 univer-text-sm", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "univer-flex univer-items-center univer-gap-2", children: conditionalFormattingI18nController.tWithReactNode(
        "sheet.cf.panel.managerRuleSelect",
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          Select,
          {
            className: "univer-w-36",
            options: selectOption,
            value: selectValue,
            onChange: (v) => {
              setSelectValue(v);
            }
          }
        )
      ).map((ele, index) => /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("span", { children: ele }, index)) }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "univer-flex univer-justify-end", children: [
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Tooltip, { title: localeService.t("sheet.cf.panel.createRule"), placement: "bottom", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          "a",
          {
            className: "univer-size-5 univer-cursor-pointer",
            onClick: handleCreate,
            children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(IncreaseIcon, {})
          }
        ) }),
        ruleList.length && isHasAllRuleEditPermission ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Tooltip, { title: localeService.t("sheet.cf.panel.clear"), placement: "bottom", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          "a",
          {
            className: "univer-size-5 univer-cursor-pointer",
            onClick: handleClear,
            children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DeleteIcon, { className: "univer-text-red-500" })
          }
        ) }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DeleteIcon, { className: "univer-text-gray-300" }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { ref: layoutContainerRef, children: layoutWidth > 0 && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
      ReactGridLayout,
      {
        className: `[&_.react-grid-item]:univer-transition-none [&_.react-grid-placeholder]:univer-rounded [&_.react-grid-placeholder]:!univer-bg-gray-200`,
        draggableHandle: ".draggableHandle",
        layout,
        cols: 12,
        rowHeight: 60,
        width: layoutWidth,
        margin: [0, 10],
        onDragStop: handleDragStop,
        onDragStart: handleDragStart,
        children: ruleListByPermissionCheck == null ? void 0 : ruleListByPermissionCheck.map((rule, index) => {
          return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
            "div",
            {
              className: clsx(`univer-group univer-relative univer-flex univer-items-center univer-justify-between univer-rounded univer-py-2 univer-pl-5 univer-pr-8 hover:univer-bg-gray-100 dark:hover:!univer-bg-gray-700`, {
                "univer-bg-gray-100 dark:!univer-bg-gray-700": draggingId === index
              }),
              onMouseMove: () => {
                rule.ranges !== currentRuleRanges && setCurrentRuleRanges(rule.ranges);
              },
              onMouseLeave: () => setCurrentRuleRanges([]),
              onClick: () => {
                onClick(rule);
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                  "div",
                  {
                    className: clsx(`univer-absolute univer-left-0 univer-hidden univer-size-5 univer-cursor-grab univer-items-center univer-justify-center univer-rounded group-hover:univer-flex`, "draggableHandle"),
                    onClick: (e) => e.stopPropagation(),
                    children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(SequenceIcon, {})
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
                  "div",
                  {
                    className: `univer-min-w-0 univer-max-w-full univer-flex-shrink univer-overflow-hidden`,
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                        "div",
                        {
                          className: `univer-text-sm univer-text-gray-900 dark:!univer-text-white`,
                          children: getRuleDescribe(rule, localeService)
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "univer-text-xs univer-text-gray-400", children: rule.ranges.map((range) => serializeRange(range)).join(",") })
                    ]
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Preview, { rule: rule.rule }) }),
                /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
                  "div",
                  {
                    className: clsx(`univer-absolute univer-right-1 univer-hidden univer-size-6 univer-cursor-pointer univer-items-center univer-justify-center univer-rounded group-hover:univer-flex hover:univer-bg-gray-200`, {
                      "univer-flex univer-items-center univer-justify-center": draggingId === index
                    }),
                    onClick: (e) => {
                      e.stopPropagation();
                      handleDelete(rule);
                      setCurrentRuleRanges([]);
                    },
                    children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(DeleteIcon, {})
                  }
                )
              ]
            }
          ) }, `${rule.cfId}`);
        })
      }
    ) })
  ] });
};

// ../packages/sheets-conditional-formatting-ui/src/components/panel/index.tsx
var import_jsx_runtime13 = __toESM(require_jsx_runtime());
var ConditionFormattingPanel = (props) => {
  const [currentEditRule, setCurrentEditRule] = (0, import_react12.useState)(props.rule);
  const [isShowRuleEditor, setIsShowRuleEditor] = (0, import_react12.useState)(!!props.rule);
  const createCfRule = () => {
    setIsShowRuleEditor(true);
  };
  const handleCancel = () => {
    setIsShowRuleEditor(false);
    setCurrentEditRule(void 0);
  };
  const handleRuleClick = (rule) => {
    setCurrentEditRule(rule);
    setIsShowRuleEditor(true);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "univer-flex univer-h-full univer-flex-col univer-justify-between univer-py-4", children: isShowRuleEditor ? /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(RuleEdit, { onCancel: handleCancel, rule: currentEditRule }) : /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(RuleList, { onClick: handleRuleClick, onCreate: createCfRule }) });
};

// ../packages/sheets-conditional-formatting-ui/src/controllers/cf.panel.controller.ts
var CF_PANEL_KEY = "sheet.conditional.formatting.panel";
var ConditionalFormattingPanelController = class extends Disposable {
  constructor(_univerInstanceService, _injector, _componentManager, _sidebarService, _localeService) {
    super();
    this._univerInstanceService = _univerInstanceService;
    this._injector = _injector;
    this._componentManager = _componentManager;
    this._sidebarService = _sidebarService;
    this._localeService = _localeService;
    __publicField(this, "_sidebarDisposable", null);
    this._initPanel();
    this.disposeWithMe(
      this._univerInstanceService.getCurrentTypeOfUnit$(O.UNIVER_SHEET).subscribe((sheet) => {
        var _a;
        if (!sheet) (_a = this._sidebarDisposable) == null ? void 0 : _a.dispose();
      })
    );
    this.disposeWithMe(this._sidebarService.sidebarOptions$.subscribe((info) => {
      if (info.id === CF_PANEL_KEY) {
        if (!info.visible) {
          setTimeout(() => {
            this._sidebarService.sidebarOptions$.next({ visible: false });
          });
        }
      }
    }));
  }
  openPanel(rule) {
    const props = {
      id: CF_PANEL_KEY,
      header: { title: this._localeService.t("sheet.cf.title") },
      children: {
        label: CF_PANEL_KEY,
        rule,
        key: generateRandomId(4)
      },
      onClose: () => this._sidebarDisposable = null
    };
    this._sidebarDisposable = this._sidebarService.open(props);
  }
  _initPanel() {
    this.disposeWithMe(
      this._componentManager.register(CF_PANEL_KEY, ConditionFormattingPanel)
    );
  }
};
ConditionalFormattingPanelController = __decorateClass([
  __decorateParam(0, IUniverInstanceService),
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, Inject(ComponentManager)),
  __decorateParam(3, Inject(ISidebarService)),
  __decorateParam(4, Inject(LocaleService))
], ConditionalFormattingPanelController);

// ../packages/sheets-conditional-formatting-ui/src/commands/operations/open-conditional-formatting-panel.ts
var OpenConditionalFormattingOperator = {
  id: "sheet.operation.open.conditional.formatting.panel",
  type: 1 /* OPERATION */,
  handler: (accessor, params) => {
    var _a;
    const conditionalFormattingMenuController = accessor.get(ConditionalFormattingPanelController);
    const selectionManagerService = accessor.get(SheetsSelectionsService);
    const commandService = accessor.get(ICommandService);
    const ranges = ((_a = selectionManagerService.getCurrentSelections()) == null ? void 0 : _a.map((s) => s.range)) || [];
    const type = params.value;
    switch (type) {
      case 3 /* highlightCell */: {
        conditionalFormattingMenuController.openPanel({ ...createDefaultRule(), ranges });
        break;
      }
      case 4 /* rank */: {
        const rule = {
          ...createDefaultRule,
          ranges,
          rule: {
            type: "highlightCell" /* highlightCell */,
            subType: "rank" /* rank */
          }
        };
        conditionalFormattingMenuController.openPanel(rule);
        break;
      }
      case 5 /* formula */: {
        const rule = {
          ...createDefaultRule,
          ranges,
          rule: {
            type: "highlightCell" /* highlightCell */,
            subType: "formula" /* formula */,
            value: "="
          }
        };
        conditionalFormattingMenuController.openPanel(rule);
        break;
      }
      case 6 /* colorScale */: {
        const rule = {
          ...createDefaultRule,
          ranges,
          rule: {
            type: "colorScale" /* colorScale */,
            config: []
          }
        };
        conditionalFormattingMenuController.openPanel(rule);
        break;
      }
      case 7 /* dataBar */: {
        const rule = {
          ...createDefaultRule,
          ranges,
          rule: {
            type: "dataBar" /* dataBar */,
            isShowValue: true
          }
        };
        conditionalFormattingMenuController.openPanel(rule);
        break;
      }
      case 8 /* icon */: {
        const rule = {
          ...createDefaultRule,
          ranges,
          rule: {
            type: "iconSet" /* iconSet */,
            config: [],
            isShowValue: true
          }
        };
        conditionalFormattingMenuController.openPanel(rule);
        break;
      }
      case 2 /* viewRule */: {
        conditionalFormattingMenuController.openPanel();
        break;
      }
      case 1 /* createRule */: {
        conditionalFormattingMenuController.openPanel({ ...createDefaultRule(), ranges });
        break;
      }
      case 9 /* clearRangeRules */: {
        commandService.executeCommand(ClearRangeCfCommand.id, { ranges });
        break;
      }
      case 10 /* clearWorkSheetRules */: {
        commandService.executeCommand(ClearWorksheetCfCommand.id);
        break;
      }
    }
    return true;
  }
};

// ../packages/sheets-conditional-formatting-ui/src/controllers/cf.copy-paste.controller.ts
var ConditionalFormattingCopyPasteController = class extends Disposable {
  constructor(_sheetClipboardService, _conditionalFormattingRuleModel, _injector, _conditionalFormattingViewModel, _univerInstanceService) {
    super();
    this._sheetClipboardService = _sheetClipboardService;
    this._conditionalFormattingRuleModel = _conditionalFormattingRuleModel;
    this._injector = _injector;
    this._conditionalFormattingViewModel = _conditionalFormattingViewModel;
    this._univerInstanceService = _univerInstanceService;
    __publicField(this, "_copyInfo");
    this._initClipboardHook();
  }
  _initClipboardHook() {
    this.disposeWithMe(
      this._sheetClipboardService.addClipboardHook({
        id: SHEET_CONDITIONAL_FORMATTING_PLUGIN,
        onBeforeCopy: (unitId, subUnitId, range) => this._collectConditionalRule(unitId, subUnitId, range),
        onPasteCells: (pasteFrom, pasteTo, data, payload) => {
          const { copyType = "COPY" /* COPY */, pasteType } = payload;
          const { range: copyRange } = pasteFrom || {};
          const { range: pastedRange } = pasteTo;
          return this._generateConditionalFormattingMutations(pastedRange, { copyType, pasteType, copyRange });
        }
      })
    );
  }
  _collectConditionalRule(unitId, subUnitId, range) {
    const matrix = new ObjectMatrix();
    const cfMap = {};
    this._copyInfo = {
      matrix,
      info: {
        unitId,
        subUnitId,
        cfMap
      }
    };
    const discreteRange = this._injector.invoke((accessor) => {
      return rangeToDiscreteRange(range, accessor, unitId, subUnitId);
    });
    if (!discreteRange) {
      return;
    }
    const { rows, cols } = discreteRange;
    const cfIdSet = /* @__PURE__ */ new Set();
    rows.forEach((row, rowIndex) => {
      cols.forEach((col, colIndex) => {
        const cellCfList = this._conditionalFormattingViewModel.getCellCfs(unitId, subUnitId, row, col);
        if (!cellCfList) {
          return;
        }
        cellCfList.forEach((item) => cfIdSet.add(item.cfId));
        matrix.setValue(rowIndex, colIndex, cellCfList.map((item) => item.cfId));
      });
    });
    cfIdSet.forEach((cfId) => {
      const rule = this._conditionalFormattingRuleModel.getRule(unitId, subUnitId, cfId);
      if (rule) {
        cfMap[cfId] = rule.rule;
      }
    });
  }
  // eslint-disable-next-line max-lines-per-function
  _generateConditionalFormattingMutations(pastedRange, copyInfo) {
    const workbook = this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET);
    const sheet = workbook.getActiveSheet();
    const unitId = workbook.getUnitId();
    if (!sheet) return { redos: [], undos: [] };
    const subUnitId = sheet.getSheetId();
    if (copyInfo.copyType === "CUT" /* CUT */) {
      this._copyInfo = null;
      return { redos: [], undos: [] };
    }
    if (!this._copyInfo || !copyInfo.copyRange) {
      return { redos: [], undos: [] };
    }
    const specialPastes = [
      PREDEFINED_HOOK_NAME.SPECIAL_PASTE_FORMAT,
      PREDEFINED_HOOK_NAME.DEFAULT_PASTE,
      PREDEFINED_HOOK_NAME.SPECIAL_PASTE_BESIDES_BORDER
    ];
    if (!specialPastes.includes(
      copyInfo.pasteType
    )) {
      return { redos: [], undos: [] };
    }
    const { ranges: [vCopyRange, vPastedRange], mapFunc } = virtualizeDiscreteRanges([copyInfo.copyRange, pastedRange]);
    const repeatRange = getRepeatRange(vCopyRange, vPastedRange, true);
    const effectedConditionalFormattingRuleMatrix = {};
    Range.foreach(vPastedRange, (row, col) => {
      const { row: realRow, col: realCol } = mapFunc(row, col);
      const cellCfList = this._conditionalFormattingViewModel.getCellCfs(unitId, subUnitId, realRow, realCol);
      if (cellCfList) {
        cellCfList.forEach((item) => {
          if (!effectedConditionalFormattingRuleMatrix[item.cfId]) {
            const ruleMatrix = new ObjectMatrix();
            effectedConditionalFormattingRuleMatrix[item.cfId] = ruleMatrix;
            const rule = this._conditionalFormattingRuleModel.getRule(unitId, subUnitId, item.cfId);
            rule == null ? void 0 : rule.ranges.forEach((range) => {
              Range.foreach(range, (row2, col2) => {
                ruleMatrix.setValue(row2, col2, 1);
              });
            });
          }
          effectedConditionalFormattingRuleMatrix[item.cfId].realDeleteValue(realRow, realCol);
        });
      }
    });
    const { matrix, info } = this._copyInfo;
    const waitAddRule = [];
    let nextCfId = this._conditionalFormattingRuleModel.createCfId(unitId, subUnitId);
    const cacheCfIdMap = {};
    const getCurrentSheetCfRule = (copyRangeCfId) => {
      if (cacheCfIdMap[copyRangeCfId]) {
        return cacheCfIdMap[copyRangeCfId];
      }
      const oldRule = info == null ? void 0 : info.cfMap[copyRangeCfId];
      const targetRule = [...this._conditionalFormattingRuleModel.getSubunitRules(unitId, subUnitId) || [], ...waitAddRule].find((rule) => {
        return Tools.diffValue(rule.rule, oldRule);
      });
      if (targetRule) {
        cacheCfIdMap[copyRangeCfId] = targetRule;
        return targetRule;
      } else {
        const rule = {
          rule: oldRule,
          cfId: nextCfId,
          ranges: [],
          stopIfTrue: false
        };
        cacheCfIdMap[copyRangeCfId] = rule;
        waitAddRule.push(rule);
        nextCfId = `${Number(nextCfId) + 1}`;
        return rule;
      }
    };
    repeatRange.forEach((item) => {
      matrix && matrix.forValue((row, col, copyRangeCfIdList) => {
        const range = Rectangle.getPositionRange(
          {
            startRow: row,
            endRow: row,
            startColumn: col,
            endColumn: col
          },
          item.startRange
        );
        const { row: _row, col: _col } = mapFunc(range.startRow, range.startColumn);
        copyRangeCfIdList.forEach((cfId) => {
          if (!effectedConditionalFormattingRuleMatrix[cfId]) {
            const rule = getCurrentSheetCfRule(cfId);
            const ruleMatrix = new ObjectMatrix();
            effectedConditionalFormattingRuleMatrix[cfId] = ruleMatrix;
            rule.ranges.forEach((range2) => {
              Range.foreach(range2, (row2, col2) => {
                ruleMatrix.setValue(row2, col2, 1);
              });
            });
          }
          effectedConditionalFormattingRuleMatrix[cfId].setValue(_row, _col, 1);
        });
      });
    });
    const redos = [];
    const undos = [];
    for (const cfId in effectedConditionalFormattingRuleMatrix) {
      const matrix2 = effectedConditionalFormattingRuleMatrix[cfId];
      const ranges = findAllRectangle(createTopMatrixFromMatrix(matrix2));
      if (!ranges.length) {
        const deleteParams = {
          unitId,
          subUnitId,
          cfId
        };
        redos.push({ id: DeleteConditionalRuleMutation.id, params: deleteParams });
        undos.push(...DeleteConditionalRuleMutationUndoFactory(this._injector, deleteParams));
      }
      if (waitAddRule.some((rule) => rule.cfId === cfId)) {
        const rule = getCurrentSheetCfRule(cfId);
        const addParams = {
          unitId,
          subUnitId,
          rule: { ...rule, ranges }
        };
        redos.push({ id: AddConditionalRuleMutation.id, params: addParams });
        undos.push(AddConditionalRuleMutationUndoFactory(this._injector, addParams));
      } else {
        const rule = this._conditionalFormattingRuleModel.getRule(unitId, subUnitId, cfId);
        if (!rule) {
          continue;
        }
        const setParams = {
          unitId,
          subUnitId,
          rule: { ...rule, ranges }
        };
        redos.push({ id: SetConditionalRuleMutation.id, params: setParams });
        undos.push(...setConditionalRuleMutationUndoFactory(this._injector, setParams));
      }
    }
    return {
      redos,
      undos
    };
  }
};
ConditionalFormattingCopyPasteController = __decorateClass([
  __decorateParam(0, Inject(ISheetClipboardService)),
  __decorateParam(1, Inject(ConditionalFormattingRuleModel)),
  __decorateParam(2, Inject(Injector)),
  __decorateParam(3, Inject(ConditionalFormattingViewModel)),
  __decorateParam(4, Inject(IUniverInstanceService))
], ConditionalFormattingCopyPasteController);

// ../packages/sheets-conditional-formatting-ui/src/controllers/cf.permission.controller.ts
var ConditionalFormattingPermissionController = class extends Disposable {
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
        if (command.id === AddCfCommand.id) {
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
      })
    );
  }
};
ConditionalFormattingPermissionController = __decorateClass([
  __decorateParam(0, Inject(LocaleService)),
  __decorateParam(1, ICommandService),
  __decorateParam(2, Inject(SheetPermissionCheckController))
], ConditionalFormattingPermissionController);

// ../packages/sheets-conditional-formatting-ui/src/controllers/cf.ref-range.controller.ts
var SheetsCfRefRangeController = class extends Disposable {
  constructor(_conditionalFormattingRuleModel, _univerInstanceService, _injector, _refRangeService) {
    super();
    this._conditionalFormattingRuleModel = _conditionalFormattingRuleModel;
    this._univerInstanceService = _univerInstanceService;
    this._injector = _injector;
    this._refRangeService = _refRangeService;
    this._initRefRange();
  }
  _initRefRange() {
    const disposableMap = /* @__PURE__ */ new Map();
    const getCfIdWithUnitId = (unitID, subUnitId, cfId) => `${unitID}_${subUnitId}_${cfId}`;
    const register = (unitId, subUnitId, rule) => {
      const handleRangeChange = (commandInfo) => {
        const oldRanges = [...rule.ranges];
        const resultRanges = oldRanges.map((range) => {
          return handleDefaultRangeChangeWithEffectRefCommands(range, commandInfo);
        }).filter((range) => !!range);
        const isEqual = isRangesEqual(resultRanges, oldRanges);
        if (isEqual) {
          return { redos: [], undos: [] };
        }
        if (resultRanges.length) {
          const redoParams = { unitId, subUnitId, rule: { ...rule, ranges: resultRanges } };
          const redos = [{ id: SetConditionalRuleMutation.id, params: redoParams }];
          const undos = setConditionalRuleMutationUndoFactory(this._injector, redoParams);
          return { redos, undos };
        } else {
          const redoParams = { unitId, subUnitId, cfId: rule.cfId };
          const redos = [{ id: DeleteConditionalRuleMutation.id, params: redoParams }];
          const undos = DeleteConditionalRuleMutationUndoFactory(this._injector, redoParams);
          return { redos, undos };
        }
      };
      const disposeList = [];
      rule.ranges.forEach((range) => {
        const disposable = this._refRangeService.registerRefRange(range, handleRangeChange);
        disposeList.push(() => disposable.dispose());
      });
      disposableMap.set(getCfIdWithUnitId(unitId, subUnitId, rule.cfId), () => disposeList.forEach((dispose) => dispose()));
    };
    this.disposeWithMe(this._conditionalFormattingRuleModel.$ruleChange.subscribe((option) => {
      const { unitId, subUnitId, rule } = option;
      const workbook = this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET);
      const worksheet = workbook.getActiveSheet();
      if (option.unitId !== workbook.getUnitId() || option.subUnitId !== (worksheet == null ? void 0 : worksheet.getSheetId())) {
        return;
      }
      switch (option.type) {
        case "add": {
          register(option.unitId, option.subUnitId, option.rule);
          break;
        }
        case "delete": {
          const dispose = disposableMap.get(getCfIdWithUnitId(unitId, subUnitId, rule.cfId));
          dispose && dispose();
          break;
        }
        case "set": {
          const dispose = disposableMap.get(getCfIdWithUnitId(unitId, subUnitId, rule.cfId));
          dispose && dispose();
          register(option.unitId, option.subUnitId, option.rule);
        }
      }
    }));
    this.disposeWithMe(toDisposable(() => {
      disposableMap.forEach((item) => {
        item();
      });
      disposableMap.clear();
    }));
  }
};
SheetsCfRefRangeController = __decorateClass([
  __decorateParam(0, Inject(ConditionalFormattingRuleModel)),
  __decorateParam(1, Inject(IUniverInstanceService)),
  __decorateParam(2, Inject(Injector)),
  __decorateParam(3, Inject(RefRangeService))
], SheetsCfRefRangeController);

// ../packages/sheets-conditional-formatting-ui/src/controllers/cf.render.controller.ts
var SheetsCfRenderController = class extends Disposable {
  constructor(_sheetInterceptorService, _conditionalFormattingService, _univerInstanceService, _renderManagerService, _conditionalFormattingViewModel, _conditionalFormattingRuleModel) {
    super();
    this._sheetInterceptorService = _sheetInterceptorService;
    this._conditionalFormattingService = _conditionalFormattingService;
    this._univerInstanceService = _univerInstanceService;
    this._renderManagerService = _renderManagerService;
    this._conditionalFormattingViewModel = _conditionalFormattingViewModel;
    this._conditionalFormattingRuleModel = _conditionalFormattingRuleModel;
    /**
     * When a set operation is triggered multiple times over a short period of time, it may result in some callbacks not being disposed,and caused a render cache exception.
     * The solution here is to store all the asynchronous tasks and focus on processing after the last callback
     */
    __publicField(this, "_ruleChangeCacheMap", /* @__PURE__ */ new Map());
    this._initViewModelInterceptor();
    this._initSkeleton();
    this.disposeWithMe(() => {
      this._ruleChangeCacheMap.clear();
    });
  }
  _markDirtySkeleton() {
    var _a, _b, _c;
    const unitId = this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET).getUnitId();
    (_a = this._renderManagerService.getRenderById(unitId)) == null ? void 0 : _a.with(SheetSkeletonManagerService).reCalculate();
    (_c = (_b = this._renderManagerService.getRenderById(unitId)) == null ? void 0 : _b.mainComponent) == null ? void 0 : _c.makeDirty();
  }
  _initSkeleton() {
    this.disposeWithMe(merge(this._conditionalFormattingRuleModel.$ruleChange, this._conditionalFormattingViewModel.markDirty$).pipe(
      bufferTime(16),
      filter((v) => !!v.length),
      filter((v) => {
        const workbook = this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET);
        if (!workbook) return false;
        const worksheet = workbook.getActiveSheet();
        if (!worksheet) return false;
        return v.filter((item) => item.unitId === workbook.getUnitId() && item.subUnitId === worksheet.getSheetId()).length > 0;
      })
    ).subscribe(() => this._markDirtySkeleton()));
  }
  _initViewModelInterceptor() {
    this.disposeWithMe(this._sheetInterceptorService.intercept(INTERCEPTOR_POINT.CELL_CONTENT, {
      effect: 1 /* Style */,
      handler: (cell, context, next) => {
        const result = this._conditionalFormattingService.composeStyle(context.unitId, context.subUnitId, context.row, context.col);
        if (!result) {
          return next(cell);
        }
        const styleMap = context.workbook.getStyles();
        const defaultStyle = (typeof (cell == null ? void 0 : cell.s) === "string" ? styleMap.get(cell == null ? void 0 : cell.s) : cell == null ? void 0 : cell.s) || {};
        const cloneCell = cell === context.rawData ? { ...context.rawData } : cell;
        if (result.style) {
          const activeStyle = {
            ...defaultStyle,
            ...result.style
          };
          Object.assign(cloneCell, { s: activeStyle });
        }
        if (!cloneCell.fontRenderExtension) {
          cloneCell.fontRenderExtension = {};
          if (result.isShowValue !== void 0) {
            cloneCell.fontRenderExtension.isSkip = !result.isShowValue;
          }
        }
        if (result.dataBar) {
          cloneCell.dataBar = result.dataBar;
        }
        if (result.iconSet) {
          cloneCell.iconSet = result.iconSet;
          cloneCell.fontRenderExtension.leftOffset = DEFAULT_PADDING + DEFAULT_WIDTH;
        }
        return next(cloneCell);
      },
      priority: 10
    }));
  }
};
SheetsCfRenderController = __decorateClass([
  __decorateParam(0, Inject(SheetInterceptorService)),
  __decorateParam(1, Inject(ConditionalFormattingService)),
  __decorateParam(2, Inject(IUniverInstanceService)),
  __decorateParam(3, Inject(IRenderManagerService)),
  __decorateParam(4, Inject(ConditionalFormattingViewModel)),
  __decorateParam(5, Inject(ConditionalFormattingRuleModel))
], SheetsCfRenderController);

// ../packages/sheets-conditional-formatting-ui/src/controllers/config.schema.ts
var SHEETS_CONDITIONAL_FORMATTING_UI_PLUGIN_CONFIG_KEY = "sheets-conditional-formatting-ui.config";
var configSymbol = Symbol(SHEETS_CONDITIONAL_FORMATTING_UI_PLUGIN_CONFIG_KEY);
var defaultPluginConfig = {};

// ../packages/sheets-conditional-formatting-ui/src/mobile-plugin.ts
var UniverSheetsConditionalFormattingMobileUIPlugin = class extends Plugin {
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
    this._configService.setConfig(SHEETS_CONDITIONAL_FORMATTING_UI_PLUGIN_CONFIG_KEY, rest);
    this._initCommand();
    this._injector.add([SheetsCfRenderController]);
    this._injector.add([SheetsCfRefRangeController]);
    this._injector.add([ConditionalFormattingCopyPasteController]);
    this._injector.add([ConditionalFormattingPermissionController]);
    this._injector.add([ConditionalFormattingI18nController]);
  }
  _initCommand() {
    [
      AddAverageCfCommand,
      AddColorScaleConditionalRuleCommand,
      AddDataBarConditionalRuleCommand,
      AddDuplicateValuesCfCommand,
      AddNumberCfCommand,
      AddRankCfCommand,
      AddTextCfCommand,
      AddTimePeriodCfCommand,
      AddUniqueValuesCfCommand,
      OpenConditionalFormattingOperator
    ].forEach((m) => {
      this._commandService.registerCommand(m);
    });
  }
};
__publicField(UniverSheetsConditionalFormattingMobileUIPlugin, "pluginName", `${SHEET_CONDITIONAL_FORMATTING_PLUGIN}_MOBILE_UI_PLUGIN`);
__publicField(UniverSheetsConditionalFormattingMobileUIPlugin, "type", O.UNIVER_SHEET);
UniverSheetsConditionalFormattingMobileUIPlugin = __decorateClass([
  DependentOn(UniverSheetsConditionalFormattingPlugin),
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, Inject(ICommandService)),
  __decorateParam(3, IConfigService)
], UniverSheetsConditionalFormattingMobileUIPlugin);

// ../packages/sheets-conditional-formatting-ui/src/controllers/cf.auto-fill.controller.ts
var ConditionalFormattingAutoFillController = class extends Disposable {
  constructor(_injector, _univerInstanceService, _autoFillService, _conditionalFormattingRuleModel, _conditionalFormattingViewModel) {
    super();
    this._injector = _injector;
    this._univerInstanceService = _univerInstanceService;
    this._autoFillService = _autoFillService;
    this._conditionalFormattingRuleModel = _conditionalFormattingRuleModel;
    this._conditionalFormattingViewModel = _conditionalFormattingViewModel;
    this._initAutoFill();
  }
  // eslint-disable-next-line max-lines-per-function
  _initAutoFill() {
    const noopReturnFunc = () => ({ redos: [], undos: [] });
    const loopFunc = (sourceStartCell, targetStartCell, relativeRange, matrixMap, mapFunc) => {
      var _a;
      const unitId = this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET).getUnitId();
      const subUnitId = (_a = this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET).getActiveSheet()) == null ? void 0 : _a.getSheetId();
      if (!unitId || !subUnitId) {
        return;
      }
      const sourceRange = {
        startRow: sourceStartCell.row,
        startColumn: sourceStartCell.col,
        endColumn: sourceStartCell.col,
        endRow: sourceStartCell.row
      };
      const targetRange = {
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
          sourceRange
        );
        const targetPositionRange = Rectangle.getPositionRange(
          {
            startRow: row,
            startColumn: col,
            endColumn: col,
            endRow: row
          },
          targetRange
        );
        const { row: sourceRow, col: sourceCol } = mapFunc(sourcePositionRange.startRow, sourcePositionRange.startColumn);
        const sourceCellCf = this._conditionalFormattingViewModel.getCellCfs(
          unitId,
          subUnitId,
          sourceRow,
          sourceCol
        );
        const { row: targetRow, col: targetCol } = mapFunc(targetPositionRange.startRow, targetPositionRange.startColumn);
        const targetCellCf = this._conditionalFormattingViewModel.getCellCfs(
          unitId,
          subUnitId,
          targetRow,
          targetCol
        );
        if (targetCellCf) {
          targetCellCf.forEach((cf) => {
            let matrix = matrixMap.get(cf.cfId);
            if (!matrixMap.get(cf.cfId)) {
              const rule = this._conditionalFormattingRuleModel.getRule(unitId, subUnitId, cf.cfId);
              if (!rule) {
                return;
              }
              matrix = new ObjectMatrix();
              rule.ranges.forEach((range) => {
                Range.foreach(range, (row2, col2) => {
                  matrix.setValue(row2, col2, 1);
                });
              });
              matrixMap.set(cf.cfId, matrix);
            }
            matrix.realDeleteValue(targetRow, targetCol);
          });
        }
        if (sourceCellCf) {
          sourceCellCf.forEach((cf) => {
            let matrix = matrixMap.get(cf.cfId);
            if (!matrixMap.get(cf.cfId)) {
              const rule = this._conditionalFormattingRuleModel.getRule(unitId, subUnitId, cf.cfId);
              if (!rule) {
                return;
              }
              matrix = new ObjectMatrix();
              rule.ranges.forEach((range) => {
                Range.foreach(range, (row2, col2) => {
                  matrix.setValue(row2, col2, 1);
                });
              });
              matrixMap.set(cf.cfId, matrix);
            }
            matrix.setValue(targetRow, targetCol, 1);
          });
        }
      });
    };
    const generalApplyFunc = (sourceRange, targetRange) => {
      var _a, _b, _c;
      const unitId = (_a = this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET)) == null ? void 0 : _a.getUnitId();
      const subUnitId = (_c = (_b = this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET)) == null ? void 0 : _b.getActiveSheet()) == null ? void 0 : _c.getSheetId();
      const matrixMap = /* @__PURE__ */ new Map();
      const redos = [];
      const undos = [];
      if (!unitId || !subUnitId) {
        return noopReturnFunc();
      }
      const virtualRange = virtualizeDiscreteRanges([sourceRange, targetRange]);
      const [vSourceRange, vTargetRange] = virtualRange.ranges;
      const { mapFunc } = virtualRange;
      const sourceStartCell = {
        row: vSourceRange.startRow,
        col: vSourceRange.startColumn
      };
      const repeats = getAutoFillRepeatRange(vSourceRange, vTargetRange);
      repeats.forEach((repeat) => {
        loopFunc(sourceStartCell, repeat.repeatStartCell, repeat.relativeRange, matrixMap, mapFunc);
      });
      matrixMap.forEach((item, cfId) => {
        const rule = this._conditionalFormattingRuleModel.getRule(unitId, subUnitId, cfId);
        if (!rule) {
          return;
        }
        const ranges = findAllRectangle(createTopMatrixFromMatrix(item));
        if (ranges.length) {
          const params = {
            unitId,
            subUnitId,
            rule: { ...rule, ranges }
          };
          redos.push({ id: SetConditionalRuleMutation.id, params });
          undos.push(...setConditionalRuleMutationUndoFactory(this._injector, params));
        } else {
          const params = {
            unitId,
            subUnitId,
            cfId: rule.cfId
          };
          redos.push({ id: DeleteConditionalRuleMutation.id, params });
          undos.push(...DeleteConditionalRuleMutationUndoFactory(this._injector, params));
        }
      });
      return {
        undos,
        redos
      };
    };
    const hook = {
      id: SHEET_CONDITIONAL_FORMATTING_PLUGIN,
      onFillData: (location, direction, applyType) => {
        if (applyType === "COPY" /* COPY */ || applyType === "ONLY_FORMAT" /* ONLY_FORMAT */ || applyType === "SERIES" /* SERIES */) {
          const { source, target } = location;
          return generalApplyFunc(source, target);
        }
        return noopReturnFunc();
      }
    };
    this.disposeWithMe(this._autoFillService.addHook(hook));
  }
};
ConditionalFormattingAutoFillController = __decorateClass([
  __decorateParam(0, Inject(Injector)),
  __decorateParam(1, Inject(IUniverInstanceService)),
  __decorateParam(2, Inject(IAutoFillService)),
  __decorateParam(3, Inject(ConditionalFormattingRuleModel)),
  __decorateParam(4, Inject(ConditionalFormattingViewModel))
], ConditionalFormattingAutoFillController);

// ../packages/sheets-conditional-formatting-ui/src/controllers/cf.clear.controller.ts
var ConditionalFormattingClearController = class extends Disposable {
  constructor(_injector, _univerInstanceService, _sheetInterceptorService, _selectionManagerService, _conditionalFormattingRuleModel) {
    super();
    this._injector = _injector;
    this._univerInstanceService = _univerInstanceService;
    this._sheetInterceptorService = _sheetInterceptorService;
    this._selectionManagerService = _selectionManagerService;
    this._conditionalFormattingRuleModel = _conditionalFormattingRuleModel;
    this._init();
  }
  _init() {
    this.disposeWithMe(this._sheetInterceptorService.interceptCommand({
      getMutations: (commandInfo) => {
        var _a;
        const redos = [];
        const undos = [];
        const defaultV = { redos, undos };
        if ([ClearSelectionFormatCommand.id, ClearSelectionAllCommand.id].includes(commandInfo.id)) {
          const ranges = (_a = this._selectionManagerService.getCurrentSelections()) == null ? void 0 : _a.map((s) => s.range);
          if (!ranges) {
            return defaultV;
          }
          const workbook = this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET);
          const worksheet = workbook.getActiveSheet();
          if (!worksheet) {
            return defaultV;
          }
          const unitId = workbook.getUnitId();
          const subUnitId = worksheet.getSheetId();
          const allRules = this._conditionalFormattingRuleModel.getSubunitRules(unitId, subUnitId);
          if (!allRules || !allRules.length) {
            return defaultV;
          }
          const { redos: interceptRedos, undos: interceptUndos } = generateClearCfMutations(this._injector, allRules, ranges, unitId, subUnitId);
          redos.push(...interceptRedos);
          undos.push(...interceptUndos);
        }
        return defaultV;
      }
    }));
    this.disposeWithMe(this._sheetInterceptorService.interceptRanges({
      getMutations: ({ unitId, subUnitId, ranges }) => {
        const redos = [];
        const undos = [];
        const emptyInterceptorArr = { redos, undos };
        if (!ranges || !ranges.length) {
          return emptyInterceptorArr;
        }
        const allRules = this._conditionalFormattingRuleModel.getSubunitRules(unitId, subUnitId);
        if (!allRules || !allRules.length) {
          return emptyInterceptorArr;
        }
        const { redos: interceptRedos, undos: interceptUndos } = generateClearCfMutations(this._injector, allRules, ranges, unitId, subUnitId);
        redos.push(...interceptRedos);
        undos.push(...interceptUndos);
        return emptyInterceptorArr;
      }
    }));
  }
};
ConditionalFormattingClearController = __decorateClass([
  __decorateParam(0, Inject(Injector)),
  __decorateParam(1, Inject(IUniverInstanceService)),
  __decorateParam(2, Inject(SheetInterceptorService)),
  __decorateParam(3, Inject(SheetsSelectionsService)),
  __decorateParam(4, Inject(ConditionalFormattingRuleModel))
], ConditionalFormattingClearController);
function generateClearCfMutations(injector, allRules, ranges, unitId, subUnitId) {
  const redos = [];
  const undos = [];
  allRules.filter((rule) => {
    return ranges.some((range) => rule.ranges.some((ruleRange) => Rectangle.getIntersects(ruleRange, range)));
  }).forEach((rule) => {
    const mergeUtil = new RangeMergeUtil();
    const mergeRanges = mergeUtil.add(...rule.ranges).subtract(...ranges).merge();
    if (mergeRanges.length) {
      const redo = {
        id: SetConditionalRuleMutation.id,
        params: {
          unitId,
          subUnitId,
          rule: { ...rule, ranges: mergeRanges }
        }
      };
      const undo = setConditionalRuleMutationUndoFactory(injector, redo.params);
      redos.push(redo);
      undos.push(...undo);
    } else {
      const redo = {
        id: DeleteConditionalRuleMutation.id,
        params: {
          unitId,
          subUnitId,
          cfId: rule.cfId
        }
      };
      const undo = DeleteConditionalRuleMutationUndoFactory(injector, redo.params);
      redos.push(redo);
      undos.push(...undo);
    }
  });
  return { redos, undos };
}

// ../packages/sheets-conditional-formatting-ui/src/controllers/cf.editor.controller.ts
var ConditionalFormattingEditorController = class extends Disposable {
  constructor(_sheetInterceptorService, _conditionalFormattingService) {
    super();
    this._sheetInterceptorService = _sheetInterceptorService;
    this._conditionalFormattingService = _conditionalFormattingService;
    this._initInterceptorEditorEnd();
  }
  /**
   * Process the  values after  edit
   * @private
   * @memberof NumfmtService
   */
  _initInterceptorEditorEnd() {
    this.disposeWithMe(
      toDisposable(
        this._sheetInterceptorService.writeCellInterceptor.intercept(
          AFTER_CELL_EDIT,
          {
            handler: (value, context, next) => {
              var _a, _b, _c;
              if (!value) {
                next(value);
              }
              const result = this._conditionalFormattingService.composeStyle(context.unitId, context.subUnitId, context.row, context.col);
              const cfStyle = (_a = result == null ? void 0 : result.style) != null ? _a : {};
              const keys = Object.keys(cfStyle);
              if (value == null ? void 0 : value.p) {
                (_c = (_b = value.p.body) == null ? void 0 : _b.textRuns) == null ? void 0 : _c.forEach((item) => {
                  if (item.ts) {
                    keys.forEach((key) => {
                      var _a2;
                      (_a2 = item.ts) == null ? true : delete _a2[key];
                    });
                  }
                });
                return next(value);
              } else {
                const s = { ...(typeof (value == null ? void 0 : value.s) === "string" ? context.workbook.getStyles().get(value.s) : value == null ? void 0 : value.s) || {} };
                keys.forEach((key) => {
                  delete s[key];
                });
                const cellData = { ...value, s: { ...s } };
                return next(cellData);
              }
            }
          }
        )
      )
    );
  }
};
ConditionalFormattingEditorController = __decorateClass([
  __decorateParam(0, Inject(SheetInterceptorService)),
  __decorateParam(1, Inject(ConditionalFormattingService))
], ConditionalFormattingEditorController);

// ../packages/sheets-conditional-formatting-ui/src/menu/manage-rule.ts
var commandList = [
  SetWorksheetActiveOperation.id,
  AddConditionalRuleMutation.id,
  SetConditionalRuleMutation.id,
  DeleteConditionalRuleMutation.id,
  MoveConditionalRuleMutation.id
];
var commonSelections = [
  {
    label: {
      name: "sheet.cf.ruleType.highlightCell",
      selectable: false
    },
    value: 3 /* highlightCell */
  },
  {
    label: {
      name: "sheet.cf.panel.rankAndAverage",
      selectable: false
    },
    value: 4 /* rank */
  },
  {
    label: {
      name: "sheet.cf.ruleType.formula",
      selectable: false
    },
    value: 5 /* formula */
  },
  {
    label: {
      name: "sheet.cf.ruleType.colorScale",
      selectable: false
    },
    value: 6 /* colorScale */
  },
  {
    label: {
      name: "sheet.cf.ruleType.dataBar",
      selectable: false
    },
    value: 7 /* dataBar */
  },
  {
    label: {
      name: "sheet.cf.ruleType.iconSet",
      selectable: false
    },
    value: 8 /* icon */
  },
  {
    label: {
      name: "sheet.cf.menu.manageConditionalFormatting",
      selectable: false
    },
    value: 2 /* viewRule */
  },
  {
    label: {
      name: "sheet.cf.menu.createConditionalFormatting",
      selectable: false
    },
    value: 1 /* createRule */
  },
  {
    label: {
      name: "sheet.cf.menu.clearRangeRules",
      selectable: false
    },
    value: 9 /* clearRangeRules */,
    disabled: false
  },
  {
    label: {
      name: "sheet.cf.menu.clearWorkSheetRules",
      selectable: false
    },
    value: 10 /* clearWorkSheetRules */
  }
];
var FactoryManageConditionalFormattingRule = (accessor) => {
  const selectionManagerService = accessor.get(SheetsSelectionsService);
  const commandService = accessor.get(ICommandService);
  const univerInstanceService = accessor.get(IUniverInstanceService);
  const conditionalFormattingRuleModel = accessor.get(ConditionalFormattingRuleModel);
  const clearRangeEnable$ = new Observable((subscriber) => merge(
    selectionManagerService.selectionMoveEnd$,
    selectionManagerService.selectionSet$,
    new Observable((commandSubscribe) => {
      const disposable = commandService.onCommandExecuted((commandInfo) => {
        var _a;
        const { id, params } = commandInfo;
        const unitId = (_a = univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET)) == null ? void 0 : _a.getUnitId();
        if (commandList.includes(id) && params.unitId === unitId) {
          commandSubscribe.next(null);
        }
      });
      return () => disposable.dispose();
    })
  ).pipe(debounceTime(16)).subscribe(() => {
    var _a;
    const ranges = ((_a = selectionManagerService.getCurrentSelections()) == null ? void 0 : _a.map((selection) => selection.range)) || [];
    const workbook = univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET);
    if (!workbook) return;
    const worksheet = workbook.getActiveSheet();
    if (!worksheet) return;
    const allRule = conditionalFormattingRuleModel.getSubunitRules(workbook.getUnitId(), worksheet.getSheetId()) || [];
    const ruleList = allRule.filter((rule) => rule.ranges.some((ruleRange) => ranges.some((range) => Rectangle.intersects(range, ruleRange))));
    const hasPermission = ruleList.map((rule) => rule.ranges).every((ranges2) => {
      return checkRangesEditablePermission(accessor, workbook.getUnitId(), worksheet.getSheetId(), ranges2);
    });
    subscriber.next(hasPermission);
  }));
  const clearSheetEnable$ = new Observable(
    (subscriber) => new Observable((commandSubscribe) => {
      const disposable = commandService.onCommandExecuted((commandInfo) => {
        var _a;
        const { id, params } = commandInfo;
        const unitId = (_a = univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET)) == null ? void 0 : _a.getUnitId();
        if (commandList.includes(id) && params.unitId === unitId) {
          commandSubscribe.next(null);
        }
      });
      return () => disposable.dispose();
    }).pipe(debounceTime(16)).subscribe(() => {
      const workbook = univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET);
      if (!workbook) return;
      const worksheet = workbook.getActiveSheet();
      if (!worksheet) return;
      const allRule = conditionalFormattingRuleModel.getSubunitRules(workbook.getUnitId(), worksheet.getSheetId()) || [];
      if (!allRule.length) {
        subscriber.next(false);
        return false;
      }
      const hasPermission = allRule.map((rule) => rule.ranges).every((ranges) => {
        return checkRangesEditablePermission(accessor, workbook.getUnitId(), worksheet.getSheetId(), ranges);
      });
      subscriber.next(hasPermission);
    })
  );
  const selections$ = new Observable((subscriber) => {
    clearRangeEnable$.subscribe((v) => {
      const item = commonSelections.find((item2) => item2.value === 9 /* clearRangeRules */);
      if (item) {
        item.disabled = !v;
        subscriber.next(commonSelections);
      }
    });
    clearSheetEnable$.subscribe((v) => {
      const item = commonSelections.find((item2) => item2.value === 10 /* clearWorkSheetRules */);
      if (item) {
        item.disabled = !v;
        subscriber.next(commonSelections);
      }
    });
    subscriber.next(commonSelections);
  });
  return {
    id: OpenConditionalFormattingOperator.id,
    type: 1 /* SELECTOR */,
    icon: "ConditionsDoubleIcon",
    tooltip: "sheet.cf.title",
    selections: selections$,
    hidden$: getMenuHiddenObservable(accessor, O.UNIVER_SHEET),
    disabled$: getCurrentRangeDisable$(accessor, { workbookTypes: [WorkbookEditablePermission], worksheetTypes: [WorksheetSetCellStylePermission, WorksheetEditPermission], rangeTypes: [RangeProtectionPermissionEditPoint] })
  };
};

// ../packages/sheets-conditional-formatting-ui/src/controllers/menu.schema.ts
var menuSchema = {
  ["ribbon.data.rules" /* RULES */]: {
    [OpenConditionalFormattingOperator.id]: {
      order: 1,
      menuItemFactory: FactoryManageConditionalFormattingRule
    }
  }
};

// ../packages/sheets-conditional-formatting-ui/src/controllers/cf.menu.controller.ts
var ConditionalFormattingMenuController = class extends Disposable {
  constructor(_injector, _menuManagerService) {
    super();
    this._injector = _injector;
    this._menuManagerService = _menuManagerService;
    __publicField(this, "_sidebarDisposable", null);
    this._menuManagerService.mergeMenu(menuSchema);
  }
};
ConditionalFormattingMenuController = __decorateClass([
  __decorateParam(0, Inject(Injector)),
  __decorateParam(1, IMenuManagerService)
], ConditionalFormattingMenuController);

// ../packages/sheets-conditional-formatting-ui/src/controllers/cf.painter.controller.ts
var repeatByRange = (sourceRange, targetRange) => {
  const getRowLength = (range) => range.endRow - range.startRow + 1;
  const getColLength = (range) => range.endColumn - range.startColumn + 1;
  const rowMod = getRowLength(targetRange) % getRowLength(sourceRange);
  const colMod = getColLength(targetRange) % getColLength(sourceRange);
  const repeatRow = Math.floor(getRowLength(targetRange) / getRowLength(sourceRange));
  const repeatCol = Math.floor(getColLength(targetRange) / getColLength(sourceRange));
  const repeatList = [];
  const repeatRelativeRange = {
    startRow: 0,
    endRow: getRowLength(sourceRange) - 1,
    startColumn: 0,
    endColumn: getColLength(sourceRange) - 1
  };
  if (getRowLength(targetRange) === 1 && getColLength(targetRange) === 1) {
    const startRange = {
      startRow: targetRange.startRow,
      endRow: targetRange.startRow,
      startColumn: targetRange.startColumn,
      endColumn: targetRange.startColumn
    };
    repeatList.push({ repeatRelativeRange, startRange });
    return repeatList;
  }
  for (let countRow = 0; countRow < repeatRow + (rowMod ? 0.1 : 0); countRow++) {
    for (let countCol = 0; countCol < repeatCol + (colMod ? 0.1 : 0); countCol++) {
      const row = getRowLength(sourceRange) * countRow;
      const col = getColLength(sourceRange) * countCol;
      const startRange = {
        startRow: row + targetRange.startRow,
        endRow: row + targetRange.startRow,
        startColumn: col + targetRange.startColumn,
        endColumn: col + targetRange.startColumn
      };
      let _repeatRelativeRange = repeatRelativeRange;
      if (countRow === repeatRow && rowMod) {
        _repeatRelativeRange = { ..._repeatRelativeRange };
        _repeatRelativeRange.endRow = _repeatRelativeRange.endRow - (getRowLength(sourceRange) - rowMod);
      }
      if (countCol === repeatCol && colMod) {
        _repeatRelativeRange = { ..._repeatRelativeRange };
        _repeatRelativeRange.endColumn = _repeatRelativeRange.endColumn - (getColLength(sourceRange) - colMod);
      }
      repeatList.push({ repeatRelativeRange: _repeatRelativeRange, startRange });
    }
  }
  return repeatList;
};
var ConditionalFormattingPainterController = class extends Disposable {
  constructor(_injector, _univerInstanceService, _formatPainterService, _sheetsSelectionsService, _conditionalFormattingRuleModel, _conditionalFormattingViewModel) {
    super();
    this._injector = _injector;
    this._univerInstanceService = _univerInstanceService;
    this._formatPainterService = _formatPainterService;
    this._sheetsSelectionsService = _sheetsSelectionsService;
    this._conditionalFormattingRuleModel = _conditionalFormattingRuleModel;
    this._conditionalFormattingViewModel = _conditionalFormattingViewModel;
    __publicField(this, "_painterConfig", null);
    this._initFormattingPainter();
  }
  // eslint-disable-next-line max-lines-per-function
  _initFormattingPainter() {
    const noopReturnFunc = () => ({ redos: [], undos: [] });
    const loopFunc = (sourceStartCell, targetStartCell, relativeRange, matrixMap, config) => {
      const { unitId: sourceUnitId, subUnitId: sourceSubUnitId } = this._painterConfig;
      const { targetUnitId, targetSubUnitId } = config;
      const sourceRange = {
        startRow: sourceStartCell.row,
        startColumn: sourceStartCell.col,
        endColumn: sourceStartCell.col,
        endRow: sourceStartCell.row
      };
      const targetRange = {
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
          sourceRange
        );
        const targetPositionRange = Rectangle.getPositionRange(
          {
            startRow: row,
            startColumn: col,
            endColumn: col,
            endRow: row
          },
          targetRange
        );
        const sourceCellCf = this._conditionalFormattingViewModel.getCellCfs(
          sourceUnitId,
          sourceSubUnitId,
          sourcePositionRange.startRow,
          sourcePositionRange.startColumn
        );
        const targetCellCf = this._conditionalFormattingViewModel.getCellCfs(
          targetUnitId,
          targetSubUnitId,
          targetPositionRange.startRow,
          targetPositionRange.startColumn
        );
        if (targetCellCf) {
          targetCellCf.forEach((cf) => {
            let matrix = matrixMap.get(cf.cfId);
            if (!matrixMap.get(cf.cfId)) {
              const rule = this._conditionalFormattingRuleModel.getRule(targetUnitId, targetSubUnitId, cf.cfId);
              if (!rule) {
                return;
              }
              matrix = new ObjectMatrix();
              rule.ranges.forEach((range) => {
                Range.foreach(range, (row2, col2) => {
                  matrix.setValue(row2, col2, 1);
                });
              });
              matrixMap.set(cf.cfId, matrix);
            }
            matrix.realDeleteValue(targetPositionRange.startRow, targetPositionRange.startColumn);
          });
        }
        if (sourceCellCf) {
          sourceCellCf.forEach((cf) => {
            const matrix = matrixMap.get(cf.cfId);
            matrix && matrix.setValue(targetPositionRange.startRow, targetPositionRange.startColumn, 1);
          });
        }
      });
    };
    const generalApplyFunc = (targetUnitId, targetSubUnitId, targetRange) => {
      var _a;
      const { range: sourceRange, unitId: sourceUnitId, subUnitId: sourceSubUnitId } = this._painterConfig;
      const isSkipSheet = targetUnitId !== sourceUnitId || sourceSubUnitId !== targetSubUnitId;
      const matrixMap = /* @__PURE__ */ new Map();
      const redos = [];
      const undos = [];
      if (!targetUnitId || !targetSubUnitId || !sourceUnitId || !sourceSubUnitId) {
        return noopReturnFunc();
      }
      const ruleList = (_a = this._conditionalFormattingRuleModel.getSubunitRules(sourceUnitId, sourceSubUnitId)) != null ? _a : [];
      ruleList == null ? void 0 : ruleList.forEach((rule) => {
        const { ranges, cfId } = rule;
        if (ranges.some((range) => Rectangle.intersects(sourceRange, range))) {
          const matrix = new ObjectMatrix();
          if (!isSkipSheet) {
            ranges.forEach((range) => {
              Range.foreach(range, (row, col) => {
                matrix.setValue(row, col, 1);
              });
            });
          }
          matrixMap.set(cfId, matrix);
        }
      });
      const sourceStartCell = {
        row: sourceRange.startRow,
        col: sourceRange.startColumn
      };
      const repeats = repeatByRange(sourceRange, targetRange);
      repeats.forEach((repeat) => {
        loopFunc(sourceStartCell, { row: repeat.startRange.startRow, col: repeat.startRange.startColumn }, repeat.repeatRelativeRange, matrixMap, { targetUnitId, targetSubUnitId });
      });
      matrixMap.forEach((item, cfId) => {
        if (!isSkipSheet) {
          const rule = this._conditionalFormattingRuleModel.getRule(sourceUnitId, sourceSubUnitId, cfId);
          if (!rule) {
            return;
          }
          const ranges = findAllRectangle(createTopMatrixFromMatrix(item));
          if (ranges.length) {
            const params = {
              unitId: sourceUnitId,
              subUnitId: sourceSubUnitId,
              rule: { ...rule, ranges }
            };
            redos.push({ id: SetConditionalRuleMutation.id, params });
            undos.push(...setConditionalRuleMutationUndoFactory(this._injector, params));
          } else {
            const params = {
              unitId: sourceUnitId,
              subUnitId: sourceSubUnitId,
              cfId: rule.cfId
            };
            redos.push({ id: DeleteConditionalRuleMutation.id, params });
            undos.push(...DeleteConditionalRuleMutationUndoFactory(this._injector, params));
          }
        } else {
          const rule = this._conditionalFormattingRuleModel.getRule(targetUnitId, targetSubUnitId, cfId);
          const ranges = findAllRectangle(createTopMatrixFromMatrix(item));
          if (!rule) {
            if (ranges.length) {
              const sourceRule = this._conditionalFormattingRuleModel.getRule(sourceUnitId, sourceSubUnitId, cfId);
              if (sourceRule) {
                const params = {
                  unitId: targetUnitId,
                  subUnitId: targetSubUnitId,
                  rule: {
                    ...Tools.deepClone(sourceRule),
                    cfId: this._conditionalFormattingRuleModel.createCfId(targetUnitId, targetSubUnitId),
                    ranges
                  }
                };
                redos.push({ id: AddConditionalRuleMutation.id, params });
                undos.push(AddConditionalRuleMutationUndoFactory(this._injector, params));
              }
            }
          } else {
            if (ranges.length) {
              const params = {
                unitId: targetUnitId,
                subUnitId: targetSubUnitId,
                rule: { ...rule, ranges }
              };
              redos.push({ id: SetConditionalRuleMutation.id, params });
              undos.push(...setConditionalRuleMutationUndoFactory(this._injector, params));
            } else {
              const params = {
                unitId: targetUnitId,
                subUnitId: targetSubUnitId,
                cfId: rule.cfId
              };
              redos.push({ id: DeleteConditionalRuleMutation.id, params });
              undos.push(...DeleteConditionalRuleMutationUndoFactory(this._injector, params));
            }
          }
        }
      });
      return {
        undos,
        redos
      };
    };
    const hook = {
      id: SHEET_CONDITIONAL_FORMATTING_PLUGIN,
      onStatusChange: (status) => {
        var _a, _b, _c;
        switch (status) {
          case 2 /* INFINITE */:
          case 1 /* ONCE */: {
            const unitId = (_a = this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET)) == null ? void 0 : _a.getUnitId();
            const subUnitId = (_c = (_b = this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET)) == null ? void 0 : _b.getActiveSheet()) == null ? void 0 : _c.getSheetId();
            const selection = this._sheetsSelectionsService.getCurrentLastSelection();
            const range = selection == null ? void 0 : selection.range;
            if (unitId && subUnitId && range) {
              this._painterConfig = { unitId, subUnitId, range };
            }
            break;
          }
          case 0 /* OFF */: {
            this._painterConfig = null;
            break;
          }
        }
      },
      onApply: (unitId, subUnitId, targetRange) => {
        if (this._painterConfig) {
          return generalApplyFunc(unitId, subUnitId, targetRange);
        }
        return {
          redos: [],
          undos: []
        };
      }
    };
    this._formatPainterService.addHook(hook);
  }
};
ConditionalFormattingPainterController = __decorateClass([
  __decorateParam(0, Inject(Injector)),
  __decorateParam(1, Inject(IUniverInstanceService)),
  __decorateParam(2, Inject(IFormatPainterService)),
  __decorateParam(3, Inject(SheetsSelectionsService)),
  __decorateParam(4, Inject(ConditionalFormattingRuleModel)),
  __decorateParam(5, Inject(ConditionalFormattingViewModel))
], ConditionalFormattingPainterController);

// ../packages/sheets-conditional-formatting-ui/src/controllers/cf.viewport.controller.ts
var ConditionalFormattingViewportController = class extends Disposable {
  constructor(_conditionalFormattingViewModel, _univerInstanceService, _renderManagerService) {
    super();
    this._conditionalFormattingViewModel = _conditionalFormattingViewModel;
    this._univerInstanceService = _univerInstanceService;
    this._renderManagerService = _renderManagerService;
    this._init();
  }
  _init() {
    const unit = this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET);
    const bindUnit = (unit2) => {
      const unitId = unit2.getUnitId();
      const render = this._renderManagerService.getRenderById(unitId);
      if (!render) {
        return;
      }
      const sheetSkeletonManagerService = render.with(SheetSkeletonManagerService);
      this.disposeWithMe(sheetSkeletonManagerService.currentSkeleton$.subscribe((s) => {
        if (s) {
          const range = s.skeleton.rowColumnSegment;
          const col = range.endColumn - range.startColumn + 1;
          const row = range.endRow - range.startRow + 1;
          const length = row * col * 9;
          const result = Math.max(CONDITIONAL_FORMATTING_VIEWPORT_CACHE_LENGTH, length);
          this._conditionalFormattingViewModel.setCacheLength(result);
        }
      }));
    };
    if (unit) {
      bindUnit(unit);
    }
    this._univerInstanceService.getCurrentTypeOfUnit$(O.UNIVER_SHEET).subscribe((unit2) => {
      if (!unit2) {
        return;
      }
      bindUnit(unit2);
    });
  }
};
ConditionalFormattingViewportController = __decorateClass([
  __decorateParam(0, Inject(ConditionalFormattingViewModel)),
  __decorateParam(1, IUniverInstanceService),
  __decorateParam(2, IRenderManagerService)
], ConditionalFormattingViewportController);

// ../packages/sheets-conditional-formatting-ui/src/plugin.ts
var UniverSheetsConditionalFormattingUIPlugin = class extends Plugin {
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
    this._configService.setConfig(SHEETS_CONDITIONAL_FORMATTING_UI_PLUGIN_CONFIG_KEY, rest);
    this._initCommand();
  }
  onStarting() {
    registerDependencies(this._injector, [
      [SheetsCfRenderController],
      [SheetsCfRefRangeController],
      [ConditionalFormattingCopyPasteController],
      [ConditionalFormattingAutoFillController],
      [ConditionalFormattingPermissionController],
      [ConditionalFormattingPanelController],
      [ConditionalFormattingMenuController],
      [ConditionalFormattingI18nController],
      [ConditionalFormattingEditorController],
      [ConditionalFormattingClearController],
      [ConditionalFormattingPainterController],
      [ConditionalFormattingViewportController]
    ]);
    touchDependencies(this._injector, [
      [SheetsCfRenderController]
    ]);
  }
  onReady() {
    touchDependencies(this._injector, [
      [ConditionalFormattingMenuController],
      [ConditionalFormattingPanelController]
    ]);
  }
  onRendered() {
    touchDependencies(this._injector, [
      [ConditionalFormattingAutoFillController],
      [ConditionalFormattingClearController],
      [ConditionalFormattingCopyPasteController],
      [ConditionalFormattingEditorController],
      [ConditionalFormattingI18nController],
      [ConditionalFormattingPainterController],
      [ConditionalFormattingPermissionController],
      [SheetsCfRefRangeController],
      [ConditionalFormattingViewportController]
    ]);
  }
  _initCommand() {
    [
      AddAverageCfCommand,
      AddColorScaleConditionalRuleCommand,
      AddDataBarConditionalRuleCommand,
      AddDuplicateValuesCfCommand,
      AddNumberCfCommand,
      AddRankCfCommand,
      AddTextCfCommand,
      AddTimePeriodCfCommand,
      AddUniqueValuesCfCommand,
      OpenConditionalFormattingOperator
    ].forEach((m) => {
      this._commandService.registerCommand(m);
    });
  }
};
__publicField(UniverSheetsConditionalFormattingUIPlugin, "pluginName", `${SHEET_CONDITIONAL_FORMATTING_PLUGIN}_UI_PLUGIN`);
__publicField(UniverSheetsConditionalFormattingUIPlugin, "type", O.UNIVER_SHEET);
UniverSheetsConditionalFormattingUIPlugin = __decorateClass([
  DependentOn(UniverSheetsConditionalFormattingPlugin),
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, Inject(ICommandService)),
  __decorateParam(3, IConfigService)
], UniverSheetsConditionalFormattingUIPlugin);

export {
  UniverSheetsConditionalFormattingMobileUIPlugin,
  UniverSheetsConditionalFormattingUIPlugin
};
//# sourceMappingURL=chunk-J6CT3WQT.js.map
