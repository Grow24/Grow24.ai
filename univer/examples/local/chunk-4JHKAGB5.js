import {
  SheetSkeletonManagerService,
  getCoordByCell
} from "./chunk-BGPMR3ZY.js";
import {
  ComponentManager,
  CrossHighlightingIcon,
  IMenuManagerService,
  borderClassName,
  clsx,
  getMenuHiddenObservable,
  require_jsx_runtime,
  require_react,
  useDependency,
  useObservable
} from "./chunk-CSPB4B6P.js";
import {
  IRefSelectionsService,
  REF_SELECTIONS_ENABLED,
  SheetsSelectionsService
} from "./chunk-O5WA5YRR.js";
import {
  IRenderManagerService,
  Rect,
  Shape
} from "./chunk-I5MCYWYL.js";
import {
  BehaviorSubject,
  ColorKit,
  Disposable,
  ICommandService,
  IConfigService,
  IContextService,
  Inject,
  Injector,
  O,
  Plugin,
  Rectangle,
  combineLatest,
  map,
  merge,
  merge_default,
  startWith,
  tap
} from "./chunk-ZRYQFDHJ.js";
import {
  __decorateClass,
  __decorateParam,
  __publicField,
  __toESM
} from "./chunk-NSSCU2QI.js";

// ../packages/sheets-crosshair-highlight/src/controllers/config.schema.ts
var SHEETS_CROSSHAIR_HIGHLIGHT_PLUGIN_CONFIG_KEY = "sheets-crosshair-highlight.config";
var configSymbol = Symbol(SHEETS_CROSSHAIR_HIGHLIGHT_PLUGIN_CONFIG_KEY);
var defaultPluginConfig = {};

// ../packages/sheets-crosshair-highlight/src/services/crosshair.service.ts
var CROSSHAIR_HIGHLIGHT_COLORS = [
  "rgba(158, 109, 227, 0.3)",
  "rgba(254, 75, 75, 0.3)",
  "rgba(255, 140, 81, 0.3)",
  "rgba(164, 220, 22, 0.3)",
  "rgba(45, 174, 255, 0.3)",
  "rgba(58, 96, 247, 0.3)",
  "rgba(242, 72, 166, 0.3)",
  "rgba(153, 153, 153, 0.3)",
  "rgba(158, 109, 227, 0.15)",
  "rgba(254, 75, 75, 0.15)",
  "rgba(255, 140, 81, 0.15)",
  "rgba(164, 220, 22, 0.15)",
  "rgba(45, 174, 255, 0.15)",
  "rgba(58, 96, 247, 0.15)",
  "rgba(242, 72, 166, 0.15)",
  "rgba(153, 153, 153, 0.15)"
];
var SheetsCrosshairHighlightService = class extends Disposable {
  constructor() {
    super(...arguments);
    __publicField(this, "_enabled$", new BehaviorSubject(false));
    __publicField(this, "enabled$", this._enabled$.asObservable());
    __publicField(this, "_color$", new BehaviorSubject(CROSSHAIR_HIGHLIGHT_COLORS[0]));
    __publicField(this, "color$", this._color$.asObservable());
  }
  get enabled() {
    return this._enabled$.getValue();
  }
  get color() {
    return this._color$.getValue();
  }
  dispose() {
    this._enabled$.complete();
  }
  setEnabled(value) {
    this._enabled$.next(value);
  }
  setColor(value) {
    this._color$.next(value);
  }
};

// ../packages/sheets-crosshair-highlight/src/commands/operations/operation.ts
var ToggleCrosshairHighlightOperation = {
  id: "sheet.operation.toggle-crosshair-highlight",
  type: 1 /* OPERATION */,
  handler(accessor) {
    const service = accessor.get(SheetsCrosshairHighlightService);
    const turnedOn = service.enabled;
    service.setEnabled(!turnedOn);
    return true;
  }
};
var SetCrosshairHighlightColorOperation = {
  id: "sheet.operation.set-crosshair-highlight-color",
  type: 1 /* OPERATION */,
  handler(accessor, { value }) {
    const service = accessor.get(SheetsCrosshairHighlightService);
    if (!service.enabled) service.setEnabled(true);
    service.setColor(value);
    return true;
  }
};
var EnableCrosshairHighlightOperation = {
  id: "sheet.operation.enable-crosshair-highlight",
  type: 1 /* OPERATION */,
  handler(accessor) {
    const service = accessor.get(SheetsCrosshairHighlightService);
    if (service.enabled) {
      return false;
    }
    service.setEnabled(true);
    return true;
  }
};
var DisableCrosshairHighlightOperation = {
  id: "sheet.operation.disable-crosshair-highlight",
  type: 1 /* OPERATION */,
  handler(accessor) {
    const service = accessor.get(SheetsCrosshairHighlightService);
    if (!service.enabled) {
      return false;
    }
    service.setEnabled(false);
    return true;
  }
};

// ../packages/sheets-crosshair-highlight/src/views/components/CrosshairHighlight.tsx
var import_react = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());
function CrosshairOverlay(props) {
  const { onChange } = props;
  const crosshairSrv = useDependency(SheetsCrosshairHighlightService);
  const currentColor = useObservable(crosshairSrv.color$);
  const handleColorPicked = (0, import_react.useCallback)((color) => {
    onChange == null ? void 0 : onChange(color);
  }, [onChange]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "univer-grid univer-grid-cols-8 univer-gap-x-2 univer-gap-y-3", children: CROSSHAIR_HIGHLIGHT_COLORS.map((color) => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: clsx(`hover:univer-ring-primary-600/40 hover:univer-ring-[1.5px] univer-box-border univer-size-5 univer-cursor-pointer univer-rounded univer-ring-offset-1 univer-transition-shadow`, borderClassName, {
          "univer-ring-[1.5px] univer-ring-primary-600 hover:univer-ring-primary-600": color === currentColor
        }),
        style: { backgroundColor: color },
        onClick: () => handleColorPicked(color)
      },
      color
    );
  }) });
}

// ../packages/sheets-crosshair-highlight/src/controllers/crosshair.menu.ts
var CROSSHAIR_HIGHLIGHT_OVERLAY_COMPONENT = "CROSSHAIR_HIGHLIGHT_OVERLAY_COMPONENT";
function CrosshairHighlightMenuItemFactory(accessor) {
  const crosshairHighlightService = accessor.get(SheetsCrosshairHighlightService);
  return {
    id: ToggleCrosshairHighlightOperation.id,
    tooltip: "crosshair.button.tooltip",
    type: 2 /* BUTTON_SELECTOR */,
    icon: "CrossHighlightingIcon",
    selections: [
      {
        label: {
          name: CROSSHAIR_HIGHLIGHT_OVERLAY_COMPONENT,
          hoverable: false,
          selectable: false
        }
      }
    ],
    selectionsCommandId: SetCrosshairHighlightColorOperation.id,
    activated$: crosshairHighlightService.enabled$,
    hidden$: getMenuHiddenObservable(accessor, O.UNIVER_SHEET)
  };
}

// ../packages/sheets-crosshair-highlight/src/controllers/menu.schema.ts
var menuSchema = {
  ["contextMenu.footerMenu" /* FOOTER_MENU */]: {
    ["contextMenu.others" /* OTHERS */]: {
      [ToggleCrosshairHighlightOperation.id]: {
        order: 0,
        menuItemFactory: CrosshairHighlightMenuItemFactory
      }
    }
  }
};

// ../packages/sheets-crosshair-highlight/src/controllers/crosshair.controller.tsx
var SheetsCrosshairHighlightController = class extends Disposable {
  constructor(_componentMgr, _menuManagerService, _cmdSrv) {
    super();
    this._componentMgr = _componentMgr;
    this._menuManagerService = _menuManagerService;
    this._cmdSrv = _cmdSrv;
    this._initCommands();
    this._initMenus();
    this._initComponents();
  }
  _initCommands() {
    [
      ToggleCrosshairHighlightOperation,
      SetCrosshairHighlightColorOperation,
      EnableCrosshairHighlightOperation,
      DisableCrosshairHighlightOperation
    ].forEach((c) => this._cmdSrv.registerCommand(c));
  }
  _initMenus() {
    this._menuManagerService.mergeMenu(menuSchema);
  }
  _initComponents() {
    this._componentMgr.register(CROSSHAIR_HIGHLIGHT_OVERLAY_COMPONENT, CrosshairOverlay);
    this._componentMgr.register("CrossHighlightingIcon", CrossHighlightingIcon);
  }
};
SheetsCrosshairHighlightController = __decorateClass([
  __decorateParam(0, Inject(ComponentManager)),
  __decorateParam(1, IMenuManagerService),
  __decorateParam(2, ICommandService)
], SheetsCrosshairHighlightController);

// ../packages/sheets-crosshair-highlight/src/const.ts
var SHEETS_CROSSHAIR_HIGHLIGHT_Z_INDEX = 1;

// ../packages/sheets-crosshair-highlight/src/util.ts
var CrossHairRangeCollection = class {
  constructor() {
    __publicField(this, "_selectedRanges", []);
    __publicField(this, "_ranges", []);
  }
  addRange(range) {
    if (range.rangeType === 2 /* COLUMN */ || range.rangeType === 1 /* ROW */ || range.rangeType === 3 /* ALL */) {
      return;
    }
    const intersects = this._getIntersects(range);
    const splitRanges = this._getSplitRanges(range, intersects);
    if (splitRanges.length > 0) {
      this._ranges.push(...splitRanges);
    }
  }
  setSelectedRanges(selectedRange) {
    this._selectedRanges = selectedRange;
  }
  _getSplitRanges(range, intersects) {
    let splitRanges = [range];
    for (const intersect of intersects.concat(this._selectedRanges)) {
      const newRanges = [];
      for (const splitRange of splitRanges) {
        const split = Rectangle.subtract(splitRange, intersect);
        if (split && split.length > 0) {
          newRanges.push(...split);
        }
      }
      splitRanges = newRanges;
    }
    return splitRanges.filter((range2) => range2.startRow <= range2.endRow && range2.startColumn <= range2.endColumn);
  }
  _getIntersects(addRange) {
    const intersects = [];
    for (const range of this._ranges) {
      const intersect = Rectangle.getIntersects(range, addRange);
      if (intersect) {
        intersects.push(intersect);
      }
    }
    return intersects;
  }
  getRanges() {
    return this._ranges;
  }
  reset() {
    this._ranges = [];
    this._selectedRanges = [];
  }
};

// ../packages/sheets-crosshair-highlight/src/views/widgets/crosshair-highlight-shape.ts
var SheetCrossHairHighlightShape = class extends Shape {
  constructor(key, props) {
    super(key, props);
    // protected _showHighLight = false;
    __publicField(this, "_color");
    if (props) {
      this.setShapeProps(props);
    }
  }
  setShapeProps(props) {
    if (typeof props.color !== "undefined") {
      this._color = props.color;
    }
    this.transformByState({
      width: props.width,
      height: props.height
    });
  }
  _draw(ctx) {
    var _a, _b;
    const color = `rgba(${this._color.r}, ${this._color.g}, ${this._color.b}, ${(_b = (_a = this._color) == null ? void 0 : _a.a) != null ? _b : 0.5})`;
    Rect.drawWith(ctx, {
      width: this.width,
      height: this.height,
      fill: color,
      stroke: void 0,
      strokeWidth: 0,
      evented: false
    });
  }
};

// ../packages/sheets-crosshair-highlight/src/views/widgets/crosshair-highlight.render-controller.ts
var SheetCrosshairHighlightRenderController = class extends Disposable {
  constructor(_context, _sheetSkeletonManagerService, _sheetsSelectionsService, _sheetsCrosshairHighlightService, _contextService, _refSelectionsService) {
    super();
    this._context = _context;
    this._sheetSkeletonManagerService = _sheetSkeletonManagerService;
    this._sheetsSelectionsService = _sheetsSelectionsService;
    this._sheetsCrosshairHighlightService = _sheetsCrosshairHighlightService;
    this._contextService = _contextService;
    this._refSelectionsService = _refSelectionsService;
    __publicField(this, "_shapes", []);
    __publicField(this, "_rangeCollection", new CrossHairRangeCollection());
    __publicField(this, "_color", "rgba(255,0,0,0.5)");
    this._initRenderListener();
  }
  _transformSelection(selectionData, sheet) {
    if (!selectionData) {
      return;
    }
    const rowCount = sheet.getRowCount();
    const columnCount = sheet.getColumnCount();
    const ranges = [];
    for (const selection of selectionData) {
      const { startRow, endRow, startColumn, endColumn } = selection.range;
      if (endRow - startRow + 1 === rowCount || endColumn - startColumn + 1 === columnCount) {
        continue;
      }
      ranges.push(selection.range);
    }
    this._rangeCollection.setSelectedRanges(ranges);
    for (const range of ranges) {
      this.addSelection(range, sheet);
    }
  }
  _initRenderListener() {
    const workbook = this._context.unit;
    this.disposeWithMe(combineLatest([
      this._contextService.subscribeContextValue$(REF_SELECTIONS_ENABLED).pipe(startWith(false)),
      this._sheetSkeletonManagerService.currentSkeleton$,
      this._sheetsCrosshairHighlightService.enabled$,
      this._sheetsCrosshairHighlightService.color$.pipe(tap((color) => this._color = color)),
      merge(
        this._sheetsSelectionsService.selectionMoveStart$,
        this._sheetsSelectionsService.selectionMoving$,
        this._sheetsSelectionsService.selectionMoveEnd$,
        this._sheetsSelectionsService.selectionSet$,
        workbook.activeSheet$.pipe(map(() => this._sheetsSelectionsService.getCurrentSelections()))
      ),
      merge(
        this._refSelectionsService.selectionMoveStart$,
        this._refSelectionsService.selectionMoving$,
        this._refSelectionsService.selectionMoveEnd$,
        this._sheetsSelectionsService.selectionSet$,
        workbook.activeSheet$.pipe(map(() => this._refSelectionsService.getCurrentSelections()))
      )
    ]).subscribe(([refSelectionEnabled, _, enabled, _color, normalSelections, refSelection]) => {
      this._clear();
      if (!enabled) return;
      const selections = refSelectionEnabled ? refSelection : normalSelections;
      this._rangeCollection.reset();
      this._transformSelection(selections, workbook.getActiveSheet());
      this.render(this._rangeCollection.getRanges());
    }));
  }
  addSelection(range, sheet) {
    if (range.rangeType === 2 /* COLUMN */ || range.rangeType === 1 /* ROW */ || range.rangeType === 3 /* ALL */) {
      return;
    }
    const maxRow = sheet.getRowCount();
    const maxColumn = sheet.getColumnCount();
    const { startRow, endRow, startColumn, endColumn } = range;
    const left = {
      startRow,
      endRow,
      startColumn: 0,
      endColumn: startColumn - 1
    };
    const right = {
      startRow,
      endRow,
      startColumn: endColumn + 1,
      endColumn: maxColumn
    };
    const top = {
      startRow: 0,
      endRow: startRow - 1,
      startColumn,
      endColumn
    };
    const bottom = {
      startRow: endRow + 1,
      endRow: maxRow,
      startColumn,
      endColumn
    };
    for (const range2 of [left, right, top, bottom]) {
      if (range2.startRow <= range2.endRow && range2.startColumn <= range2.endColumn) {
        this._rangeCollection.addRange(range2);
      }
    }
  }
  _clear() {
    this._shapes.forEach((shape) => {
      shape.dispose();
    });
    this._shapes = [];
  }
  _addShapes(range, index, scene, skeleton) {
    const { startRow, endRow, startColumn, endColumn } = range;
    const startPosition = getCoordByCell(startRow, startColumn, scene, skeleton);
    const endPosition = getCoordByCell(endRow, endColumn, scene, skeleton);
    const { startX, startY } = startPosition;
    const { endX, endY } = endPosition;
    const width = endX - startX;
    const height = endY - startY;
    const shapeProps = {
      left: startX,
      top: startY,
      color: new ColorKit(this._color).toRgb(),
      width,
      height,
      zIndex: SHEETS_CROSSHAIR_HIGHLIGHT_Z_INDEX,
      evented: false
    };
    const currentShapes = new SheetCrossHairHighlightShape(`crosshair-${index}`, shapeProps);
    this._shapes.push(currentShapes);
    scene.addObject(currentShapes);
  }
  render(ranges) {
    const skeleton = this._sheetSkeletonManagerService.getCurrentSkeleton();
    if (!skeleton) {
      return;
    }
    const { scene } = this._context;
    this._clear();
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      this._addShapes(range, i, scene, skeleton);
    }
    scene.makeDirty(true);
  }
  async dispose() {
    super.dispose();
  }
};
SheetCrosshairHighlightRenderController = __decorateClass([
  __decorateParam(1, Inject(SheetSkeletonManagerService)),
  __decorateParam(2, Inject(SheetsSelectionsService)),
  __decorateParam(3, Inject(SheetsCrosshairHighlightService)),
  __decorateParam(4, Inject(IContextService)),
  __decorateParam(5, IRefSelectionsService)
], SheetCrosshairHighlightRenderController);

// ../packages/sheets-crosshair-highlight/src/plugin.ts
var UniverSheetsCrosshairHighlightPlugin = class extends Plugin {
  constructor(_config = defaultPluginConfig, _injector, _renderManagerService, _configService) {
    super();
    this._config = _config;
    this._injector = _injector;
    this._renderManagerService = _renderManagerService;
    this._configService = _configService;
    const { ...rest } = merge_default(
      {},
      defaultPluginConfig,
      this._config
    );
    this._configService.setConfig(SHEETS_CROSSHAIR_HIGHLIGHT_PLUGIN_CONFIG_KEY, rest);
  }
  onStarting() {
    [
      [SheetsCrosshairHighlightService],
      [SheetsCrosshairHighlightController]
    ].forEach((d) => this._injector.add(d));
  }
  onReady() {
    [
      [SheetCrosshairHighlightRenderController]
    ].forEach((d) => this._injector.add(d));
    this._injector.get(SheetsCrosshairHighlightController);
    this._renderManagerService.registerRenderModule(O.UNIVER_SHEET, [SheetCrosshairHighlightRenderController]);
  }
};
__publicField(UniverSheetsCrosshairHighlightPlugin, "pluginName", "SHEET_CROSSHAIR_HIGHLIGHT_PLUGIN");
__publicField(UniverSheetsCrosshairHighlightPlugin, "type", O.UNIVER_SHEET);
UniverSheetsCrosshairHighlightPlugin = __decorateClass([
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, IRenderManagerService),
  __decorateParam(3, IConfigService)
], UniverSheetsCrosshairHighlightPlugin);

export {
  CROSSHAIR_HIGHLIGHT_COLORS,
  SheetsCrosshairHighlightService,
  ToggleCrosshairHighlightOperation,
  SetCrosshairHighlightColorOperation,
  EnableCrosshairHighlightOperation,
  DisableCrosshairHighlightOperation,
  UniverSheetsCrosshairHighlightPlugin
};
//# sourceMappingURL=chunk-4JHKAGB5.js.map
