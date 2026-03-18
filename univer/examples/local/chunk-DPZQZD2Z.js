import {
  FindModel,
  FindReplaceController,
  IFindReplaceService,
  UniverFindReplacePlugin
} from "./chunk-TUYVJHM2.js";
import {
  SheetsSortService,
  SortRangeCommand,
  UniverSheetsSortPlugin
} from "./chunk-4ZNIAQOP.js";
import {
  ScrollToCellCommand,
  SheetSkeletonManagerService,
  SheetsRenderService,
  getCoordByCell,
  getCurrentExclusiveRangeInterest$,
  getCurrentRangeDisable$,
  getSheetObject
} from "./chunk-BGPMR3ZY.js";
import {
  AscendingIcon,
  Button,
  ButtonGroup,
  CheckMarkIcon,
  Checkbox,
  ComponentManager,
  CustomSortIcon,
  DeleteEmptyIcon,
  DescendingIcon,
  DraggableList,
  Dropdown,
  ExpandAscendingIcon,
  ExpandDescendingIcon,
  IConfirmService,
  IDialogService,
  ILayoutService,
  IMenuManagerService,
  IUIPartsService,
  IncreaseIcon,
  MoreDownIcon,
  Radio,
  RadioGroup,
  SequenceIcon,
  clsx,
  connectInjector,
  getMenuHiddenObservable,
  require_jsx_runtime,
  require_react,
  scrollbarClassName,
  useDependency,
  useObservable
} from "./chunk-CSPB4B6P.js";
import {
  RangeProtectionPermissionEditPoint,
  SelectRangeCommand,
  SetRangeValuesCommand,
  SetSelectionsOperation,
  SetWorksheetActivateCommand,
  SetWorksheetActiveOperation,
  SheetsSelectionsService,
  UniverSheetsPlugin,
  WorkbookEditablePermission,
  WorksheetEditPermission,
  WorksheetSortPermission,
  expandToContinuousRange,
  getPrimaryForRange,
  getSheetCommandTarget,
  serializeRange
} from "./chunk-O5WA5YRR.js";
import {
  IRenderManagerService,
  RENDER_RAW_FORMULA_KEY,
  Rect,
  Shape
} from "./chunk-I5MCYWYL.js";
import {
  BehaviorSubject,
  ColorKit,
  DependentOn,
  Disposable,
  EDITOR_ACTIVATED,
  ICommandService,
  IConfigService,
  IContextService,
  IUndoRedoService,
  IUniverInstanceService,
  Inject,
  Injector,
  LocaleService,
  O,
  ObjectMatrix,
  Plugin,
  Rectangle,
  RxDisposable,
  Subject,
  ThemeService,
  Tools,
  debounceTime,
  filter,
  fromCallback,
  groupBy,
  merge,
  merge_default,
  replaceInDocumentBody,
  rotate,
  skip,
  takeUntil,
  throttle,
  throttleTime
} from "./chunk-ZRYQFDHJ.js";
import {
  __decorateClass,
  __decorateParam,
  __publicField,
  __toESM
} from "./chunk-NSSCU2QI.js";

// ../packages/sheets-find-replace/src/controllers/config.schema.ts
var SHEETS_FIND_REPLACE_PLUGIN_CONFIG_KEY = "sheets-find-replace.config";
var configSymbol = Symbol(SHEETS_FIND_REPLACE_PLUGIN_CONFIG_KEY);
var defaultPluginConfig = {};

// ../packages/sheets-find-replace/src/commands/commands/sheet-replace.command.ts
var SheetReplaceCommand = {
  id: "sheet.command.replace",
  type: 0 /* COMMAND */,
  handler: async (accessor, params) => {
    const undoRedoService = accessor.get(IUndoRedoService);
    const commandService = accessor.get(ICommandService);
    const { unitId, replacements } = params;
    const disposeBatchingHandler = undoRedoService.__tempBatchingUndoRedo(unitId);
    const results = await Promise.all(replacements.map((replacement) => commandService.executeCommand(SetRangeValuesCommand.id, {
      unitId,
      subUnitId: replacement.subUnitId,
      value: replacement.value
    })));
    disposeBatchingHandler.dispose();
    return getReplaceAllResult(results, replacements);
  }
};
function getReplaceAllResult(results, replacements) {
  let success = 0;
  let failure = 0;
  results.forEach((r, index) => {
    const count = replacements[index].count;
    if (r) {
      success += count;
    } else {
      failure += count;
    }
  });
  return { success, failure };
}

// ../packages/sheets-find-replace/src/views/shapes/find-replace-highlight.shape.ts
var SheetFindReplaceHighlightShape = class extends Shape {
  constructor(key, props) {
    super(key, props);
    __publicField(this, "_activated", false);
    __publicField(this, "_inHiddenRange", false);
    __publicField(this, "_color");
    if (props) {
      this.setShapeProps(props);
    }
  }
  setShapeProps(props) {
    this._activated = !!props.activated;
    if (typeof props.inHiddenRange !== "undefined") {
      this._inHiddenRange = props.inHiddenRange;
    }
    if (typeof props.color !== "undefined") {
      this._color = props.color;
    }
    this.transformByState({
      width: props.width,
      height: props.height
    });
  }
  _draw(ctx) {
    const activated = this._activated;
    const color = `rgba(${this._color.r}, ${this._color.g}, ${this._color.b}, 0.35)`;
    const borderColor = `rgb(${this._color.r}, ${this._color.g}, ${this._color.b})`;
    Rect.drawWith(ctx, {
      width: this.width,
      height: this.height,
      fill: color,
      stroke: activated ? borderColor : void 0,
      strokeWidth: activated ? 2 : 0,
      evented: false
    });
  }
};

// ../packages/sheets-find-replace/src/controllers/utils.ts
function isSamePosition(range1, range2) {
  return range1.startRow === range2.startRow && range1.startColumn === range2.startColumn;
}
function isBehindPositionWithRowPriority(range1, range2) {
  return range1.startRow < range2.startRow || range1.startRow === range2.startRow && range1.startColumn <= range2.startColumn;
}
function isBehindPositionWithColumnPriority(range1, range2) {
  return range1.startColumn < range2.startColumn || range1.startColumn === range2.startColumn && range1.startRow <= range2.startRow;
}
function isBeforePositionWithRowPriority(range1, range2) {
  return range1.startRow > range2.startRow || range1.startRow === range2.startRow && range1.startColumn >= range2.startColumn;
}
function isBeforePositionWithColumnPriority(range1, range2) {
  return range1.startColumn > range2.startColumn || range1.startColumn === range2.startColumn && range1.startRow >= range2.startRow;
}
function isSelectionSingleCell(selection, worksheet) {
  const { range } = selection;
  const { startRow, startColumn } = range;
  const hasMergedCell = worksheet.getMergedCell(startRow, startColumn);
  if (hasMergedCell) {
    return Rectangle.equals(range, hasMergedCell);
  } else {
    return range.endRow === range.startRow && range.endColumn === range.startColumn;
  }
}

// ../packages/sheets-find-replace/src/controllers/sheet-find-replace.controller.ts
var SheetsFindReplaceController = class extends Disposable {
  constructor(_injector, _findReplaceController, _contextService, _findReplaceService, _commandService) {
    super();
    this._injector = _injector;
    this._findReplaceController = _findReplaceController;
    this._contextService = _contextService;
    this._findReplaceService = _findReplaceService;
    this._commandService = _commandService;
    __publicField(this, "_provider");
    this._init();
    this._initCommands();
  }
  dispose() {
    super.dispose();
    this._findReplaceController.closePanel();
    this._provider.dispose();
  }
  _init() {
    const provider = this._injector.createInstance(SheetsFindReplaceProvider);
    this._provider = provider;
    this.disposeWithMe(this._findReplaceService.registerFindReplaceProvider(provider));
    this.disposeWithMe(this._contextService.subscribeContextValue$(EDITOR_ACTIVATED).pipe(filter((v) => !!v)).subscribe(() => this._findReplaceController.closePanel()));
  }
  _initCommands() {
    [SheetReplaceCommand].forEach((command) => this.disposeWithMe(this._commandService.registerCommand(command)));
  }
};
SheetsFindReplaceController = __decorateClass([
  __decorateParam(0, Inject(Injector)),
  __decorateParam(1, Inject(FindReplaceController)),
  __decorateParam(2, IContextService),
  __decorateParam(3, IFindReplaceService),
  __decorateParam(4, ICommandService)
], SheetsFindReplaceController);
var SHEETS_FIND_REPLACE_PROVIDER_NAME = "sheets-find-replace-provider";
var FIND_REPLACE_Z_INDEX = 1e4;
var SheetFindModel = class extends FindModel {
  constructor(_workbook, _sheetSkeletonManagerService, _univerInstanceService, _renderManagerService, _commandService, _contextService, _themeService, _selectionManagerService) {
    super();
    this._workbook = _workbook;
    this._sheetSkeletonManagerService = _sheetSkeletonManagerService;
    this._univerInstanceService = _univerInstanceService;
    this._renderManagerService = _renderManagerService;
    this._commandService = _commandService;
    this._contextService = _contextService;
    this._themeService = _themeService;
    // We can directly inject the `FindReplaceService` here, and call its methods instead of using the observables.
    __publicField(this, "_matchesUpdate$", new Subject());
    __publicField(this, "matchesUpdate$", this._matchesUpdate$.asObservable());
    __publicField(this, "_activelyChangingMatch$", new Subject());
    __publicField(this, "activelyChangingMatch$", this._activelyChangingMatch$.asObservable());
    /** Hold matches by the worksheet they are in. Make it easier to track the next (or previous) match when searching in the whole workbook. */
    __publicField(this, "_matchesByWorksheet", /* @__PURE__ */ new Map());
    /** Hold all matches in the currently searching scope. */
    __publicField(this, "_matches", []);
    /** Position of the current focused ISheetCellMatch, starting from 1. */
    __publicField(this, "_matchesPosition", 0);
    __publicField(this, "_activeHighlightIndex", -1);
    __publicField(this, "_highlightShapes", []);
    __publicField(this, "_currentHighlightShape", null);
    /** This properties holds the query params during this searching session. */
    __publicField(this, "_query", null);
    __publicField(this, "_workbookSelections");
    this._workbookSelections = _selectionManagerService.getWorkbookSelections(this.unitId);
  }
  get _matchesCount() {
    return this._matches.length;
  }
  get unitId() {
    return this._workbook.getUnitId();
  }
  get matchesCount() {
    return this._matchesCount;
  }
  get matchesPosition() {
    return this._matchesPosition;
  }
  get currentMatch() {
    return this._matchesPosition > 0 ? this._matches[this._matchesPosition - 1] : null;
  }
  dispose() {
    super.dispose();
    this._disposeHighlights();
    this._toggleDisplayRawFormula(false);
  }
  getMatches() {
    return this._matches;
  }
  start(query) {
    this._query = query;
    if (query.findBy === "formula" /* FORMULA */) {
      this._toggleDisplayRawFormula(true);
    } else {
      this._toggleDisplayRawFormula(false);
    }
    switch (query.findScope) {
      case "unit" /* UNIT */:
        this.findInWorkbook(query);
        break;
      case "subunit" /* SUBUNIT */:
      default:
        this.findInActiveWorksheet(query);
        break;
    }
  }
  focusSelection() {
    const currentMatch = this.currentMatch;
    if (!currentMatch) return;
    this._commandService.executeCommand(SelectRangeCommand.id, {
      unitId: currentMatch.unitId,
      subUnit: currentMatch.range.subUnitId,
      range: currentMatch.range.range
    });
  }
  _toggleDisplayRawFormula(force) {
    this._contextService.setContextValue(RENDER_RAW_FORMULA_KEY, force);
  }
  /**
   * Find all matches in the current workbook no matter which worksheet is activated.
   * @param query the query object
   * @returns the query complete event
   */
  findInWorkbook(query) {
    const unitId = this._workbook.getUnitId();
    let complete;
    let firstSearch = true;
    const findInWorkbook = () => {
      const allCompletes = this._workbook.getSheets().filter((worksheet) => !worksheet.isSheetHidden()).map((worksheet) => {
        const complete2 = this._findInWorksheet(worksheet, query, unitId);
        const sheetId = worksheet.getSheetId();
        const { results } = complete2;
        if (results.length) {
          this._matchesByWorksheet.set(sheetId, complete2.results);
        } else {
          this._matchesByWorksheet.delete(sheetId);
        }
        return complete2;
      });
      this._matches = allCompletes.map((c) => c.results).flat();
      this._updateFindHighlight();
      if (firstSearch) {
        complete = { results: this._matches };
        firstSearch = false;
      } else {
        this._matchesUpdate$.next(this._matches);
      }
    };
    this.disposeWithMe(this._sheetSkeletonManagerService.currentSkeleton$.subscribe(() => {
      this._updateFindHighlight();
      this._updateCurrentHighlightShape(this._activeHighlightIndex);
    }));
    this.disposeWithMe(
      fromCallback(this._commandService.onCommandExecuted.bind(this._commandService)).pipe(filter(([command, options]) => command.id === SetWorksheetActiveOperation.id && !(options == null ? void 0 : options.fromFindReplace))).subscribe(() => {
        const activeSheet = this._workbook.getActiveSheet();
        if (!activeSheet) {
          return;
        }
        const activeSheetId = activeSheet.getSheetId();
        if (!this._matchesByWorksheet.has(activeSheetId)) {
          return;
        }
        this._findNextMatchOnActiveSheetChange(activeSheet);
      })
    );
    this.disposeWithMe(
      fromCallback(this._commandService.onCommandExecuted.bind(this._commandService)).pipe(
        filter(
          ([command]) => command.type === 2 /* MUTATION */ && command.params.unitId === this._workbook.getUnitId()
        ),
        throttleTime(600, void 0, { leading: false, trailing: true })
      ).subscribe(() => findInWorkbook())
    );
    findInWorkbook();
    return complete;
  }
  /**
   * This method is used in `findInWorkbook`. When the active sheet changes, this method helps to find the next match
   * in the new worksheet.
   */
  _findNextMatchOnActiveSheetChange(activeSheet) {
    let match;
    let index;
    let globalIndex = 0;
    const matchesByWorksheet = this._matchesByWorksheet.get(activeSheet.getSheetId());
    const selections = this._workbookSelections.getCurrentSelections();
    if (!(selections == null ? void 0 : selections.length)) {
      match = matchesByWorksheet[0];
      index = 0;
      globalIndex = this._matches.findIndex((m) => m === match);
    } else {
      [match, globalIndex] = this._findNextMatchByRange(matchesByWorksheet, selections[0].range);
      index = matchesByWorksheet.findIndex((m) => m === match);
    }
    this._matchesPosition = globalIndex + 1;
    this._activelyChangingMatch$.next(match);
    this._activeHighlightIndex = index;
    this._updateFindHighlight();
    this._updateCurrentHighlightShape(index);
  }
  /**
   * Find all matches (only) in the currently activated worksheet.
   * @param query the query object
   * @returns the query complete event
   */
  findInActiveWorksheet(query) {
    const unitId = this._workbook.getUnitId();
    const checkShouldFindInSelections = () => {
      var _a;
      const currentWorksheet = this._workbook.getActiveSheet();
      if (!currentWorksheet) return false;
      const currentSelections = this._workbookSelections.getCurrentSelections();
      const shouldFindInSelections = (_a = currentSelections == null ? void 0 : currentSelections.some((selection) => !isSelectionSingleCell(selection, currentWorksheet))) != null ? _a : false;
      return shouldFindInSelections;
    };
    let complete;
    let firstSearch = true;
    let findBySelections = false;
    const performFindInWorksheet = () => {
      const currentWorksheet = this._workbook.getActiveSheet();
      if (!currentWorksheet) return { results: [] };
      const lastMatch = this.currentMatch;
      findBySelections = checkShouldFindInSelections();
      const currentSelections = this._workbookSelections.getCurrentSelections();
      const newComplete = findBySelections ? this._findInSelections(currentWorksheet, currentSelections, query, unitId) : this._findInWorksheet(currentWorksheet, query, unitId);
      this._matches = newComplete.results;
      this._matchesPosition = this._tryRestoreLastMatchesPosition(lastMatch, this._matches);
      if (firstSearch) {
        complete = newComplete;
        firstSearch = false;
      } else {
        this._matchesUpdate$.next(this._matches);
      }
      this._updateFindHighlight();
      return newComplete;
    };
    this.disposeWithMe(this._sheetSkeletonManagerService.currentSkeleton$.subscribe(() => this._updateFindHighlight()));
    this.disposeWithMe(
      merge(
        fromCallback(this._commandService.onCommandExecuted.bind(this._commandService)).pipe(
          filter(([command]) => {
            if (command.type === 2 /* MUTATION */ && command.params.unitId === this._workbook.getUnitId()) {
              return true;
            }
            ;
            if (command.id === SetSelectionsOperation.id && command.params.unitId === unitId) {
              const shouldFindBySelections = checkShouldFindInSelections();
              if (shouldFindBySelections === false && findBySelections === false) {
                return false;
              }
              findBySelections = shouldFindBySelections;
              return true;
            }
            return false;
          })
        ),
        // activeSheet$ is a BehaviorSubject, so we need to skip the first
        this._workbook.activeSheet$.pipe(skip(1))
      ).pipe(debounceTime(200)).subscribe(() => performFindInWorksheet())
    );
    performFindInWorksheet();
    return complete;
  }
  _findInRange(worksheet, query, range, unitId, dedupeFn) {
    const results = [];
    const subUnitId = worksheet.getSheetId();
    const iter = (query.findDirection === "column" /* COLUMN */ ? worksheet.iterateByColumn : worksheet.iterateByRow).bind(worksheet)(range);
    for (const value of iter) {
      const { row, col, colSpan, rowSpan, value: cellData } = value;
      if ((dedupeFn == null ? void 0 : dedupeFn(row, col)) || !cellData) {
        continue;
      }
      ;
      if (worksheet.getRowFiltered(row)) {
        continue;
      }
      const { hit, replaceable, isFormula } = hitCell(worksheet, row, col, query, cellData);
      if (hit) {
        const result = {
          provider: SHEETS_FIND_REPLACE_PROVIDER_NAME,
          unitId,
          replaceable,
          isFormula,
          range: {
            subUnitId,
            range: {
              startRow: row,
              startColumn: col,
              endColumn: col + (colSpan != null ? colSpan : 1) - 1,
              endRow: row + (rowSpan != null ? rowSpan : 1) - 1
            }
          }
        };
        results.push(result);
      }
    }
    return { results };
  }
  _findInSelections(worksheet, selections, query, unitId) {
    const { findDirection } = query;
    const sortFn = findDirection === "row" /* ROW */ ? isBehindPositionWithRowPriority : isBehindPositionWithColumnPriority;
    const dedupeSet = /* @__PURE__ */ new Set();
    const finds = selections.map((selection) => this._findInRange(worksheet, query, selection.range, unitId, (row, col) => {
      const key = `${row}-${col}`;
      if (dedupeSet.has(key)) return true;
      dedupeSet.add(key);
      return false;
    }).results).flat().sort((a, b) => sortFn(a.range.range, b.range.range) ? -1 : 1);
    return { results: finds };
  }
  /** Find matches in a given worksheet. */
  _findInWorksheet(worksheet, query, unitId) {
    const rowCount = worksheet.getRowCount();
    const colCount = worksheet.getColumnCount();
    const range = { startRow: 0, startColumn: 0, endRow: rowCount - 1, endColumn: colCount - 1 };
    return this._findInRange(worksheet, query, range, unitId);
  }
  _disposeHighlights() {
    var _a;
    this._highlightShapes.forEach((shape) => {
      var _a2;
      (_a2 = shape.getScene()) == null ? void 0 : _a2.makeDirty();
      shape.dispose();
    });
    this._highlightShapes = [];
    (_a = this._currentHighlightShape) == null ? void 0 : _a.dispose();
    this._currentHighlightShape = null;
  }
  _updateFindHighlight() {
    var _a;
    this._disposeHighlights();
    const skeleton = (_a = this._sheetSkeletonManagerService.getCurrent()) == null ? void 0 : _a.skeleton;
    if (!skeleton) {
      return;
    }
    const unitId = this._workbook.getUnitId();
    const currentRender = this._renderManagerService.getRenderById(unitId);
    if (currentRender == null) {
      return;
    }
    const { scene } = currentRender;
    const matches = this._matches;
    const searchBackgroundColor = this._themeService.getColorFromTheme("yellow.400");
    const color = new ColorKit(searchBackgroundColor).toRgb();
    const worksheet = this._workbook.getActiveSheet();
    if (!worksheet) {
      return;
    }
    const activeSheetId = worksheet.getSheetId();
    const highlightShapes = matches.filter((match) => match.range.subUnitId === activeSheetId).map((find, index) => {
      const { startColumn, startRow, endColumn, endRow } = find.range.range;
      const startPosition = getCoordByCell(startRow, startColumn, scene, skeleton);
      const endPosition = getCoordByCell(endRow, endColumn, scene, skeleton);
      const { startX, startY } = startPosition;
      const { endX, endY } = endPosition;
      let isAllRowHidden = true;
      for (let row = startRow; row <= endRow; row++) {
        if (worksheet.getRowRawVisible(row)) {
          isAllRowHidden = false;
          break;
        }
      }
      let isAllColHidden = true;
      for (let col = startColumn; col <= endColumn; col++) {
        if (worksheet.getColVisible(col)) {
          isAllColHidden = false;
          break;
        }
      }
      const inHiddenRange = isAllRowHidden || isAllColHidden;
      const width = isAllColHidden ? 2 : endX - startX;
      const height = isAllRowHidden ? 2 : endY - startY;
      const props = {
        left: startX,
        top: startY,
        color,
        width,
        height,
        evented: false,
        inHiddenRange,
        zIndex: FIND_REPLACE_Z_INDEX
      };
      return new SheetFindReplaceHighlightShape(`find-highlight-${index}`, props);
    });
    scene.addObjects(highlightShapes);
    this._highlightShapes = highlightShapes;
    scene.makeDirty();
  }
  _updateCurrentHighlightShape(matchIndex) {
    var _a;
    (_a = this._currentHighlightShape) == null ? void 0 : _a.setShapeProps({ activated: false });
    this._currentHighlightShape = null;
    if (matchIndex !== void 0) {
      const shape = this._highlightShapes[matchIndex];
      if (!shape) {
        return;
      }
      this._currentHighlightShape = shape;
      shape.setShapeProps({ activated: true });
    }
  }
  _getSheetObject() {
    return getSheetObject(this._univerInstanceService, this._renderManagerService);
  }
  _focusMatch(match) {
    var _a;
    const subUnitId = match.range.subUnitId;
    if (subUnitId !== ((_a = this._workbook.getActiveSheet()) == null ? void 0 : _a.getSheetId())) {
      this._commandService.executeCommand(SetWorksheetActivateCommand.id, { unitId: this._workbook.getUnitId(), subUnitId }, { fromFindReplace: true });
    }
    this._commandService.executeCommand(
      ScrollToCellCommand.id,
      { range: match.range.range },
      { fromFindReplace: true }
    );
  }
  _tryRestoreLastMatchesPosition(lastMatch, newMatches) {
    if (!lastMatch) return 0;
    const { subUnitId: lastSubUnitId } = lastMatch.range;
    const { startColumn: lastStartColumn, startRow: lastStartRow } = lastMatch.range.range;
    const index = newMatches.findIndex((match) => {
      if (lastSubUnitId !== match.range.subUnitId) {
        return false;
      }
      const { startColumn, startRow } = match.range.range;
      return startColumn === lastStartColumn && startRow === lastStartRow;
    });
    return index > -1 ? index + 1 : 0;
  }
  moveToNextMatch(params) {
    var _a, _b, _c, _d, _e;
    if (!this._matches.length) {
      return null;
    }
    const loop = (_a = params == null ? void 0 : params.loop) != null ? _a : false;
    const stayIfOnMatch = (_b = params == null ? void 0 : params.stayIfOnMatch) != null ? _b : false;
    const noFocus = (_c = params == null ? void 0 : params.noFocus) != null ? _c : false;
    const ignoreSelection = (_d = params == null ? void 0 : params.ignoreSelection) != null ? _d : false;
    const matchToMove = this._findNextMatch(loop, stayIfOnMatch, ignoreSelection);
    if (matchToMove) {
      const [match, index] = matchToMove;
      this._matchesPosition = index + 1;
      if (this._query.findScope === "unit" /* UNIT */) {
        this._activeHighlightIndex = this._matchesByWorksheet.get(match.range.subUnitId).findIndex((m) => m === match);
      } else {
        this._activeHighlightIndex = index;
      }
      if (!noFocus) this._focusMatch(match);
      if (((_e = this._workbook.getActiveSheet()) == null ? void 0 : _e.getSheetId()) === match.range.subUnitId) {
        this._updateCurrentHighlightShape(this._activeHighlightIndex);
      }
      return match;
    }
    this._matchesPosition = 0;
    this._updateCurrentHighlightShape();
    return null;
  }
  moveToPreviousMatch(params) {
    var _a, _b, _c, _d, _e;
    if (!this._matches.length) {
      return null;
    }
    const loop = (_a = params == null ? void 0 : params.loop) != null ? _a : false;
    const stayIfOnMatch = (_b = params == null ? void 0 : params.stayIfOnMatch) != null ? _b : false;
    const noFocus = (_c = params == null ? void 0 : params.noFocus) != null ? _c : false;
    const ignoreSelection = (_d = params == null ? void 0 : params.ignoreSelection) != null ? _d : false;
    const matchToMove = this._findPreviousMatch(loop, stayIfOnMatch, ignoreSelection);
    if (matchToMove) {
      const [match, index] = matchToMove;
      this._matchesPosition = index + 1;
      if (this._query.findScope === "unit" /* UNIT */) {
        this._activeHighlightIndex = this._matchesByWorksheet.get(match.range.subUnitId).findIndex((m) => m === match);
      } else {
        this._activeHighlightIndex = index;
      }
      if (!noFocus) this._focusMatch(match);
      if (((_e = this._workbook.getActiveSheet()) == null ? void 0 : _e.getSheetId()) === match.range.subUnitId) {
        this._updateCurrentHighlightShape(this._activeHighlightIndex);
      }
      return match;
    }
    this._matchesPosition = 0;
    this._updateCurrentHighlightShape();
    return null;
  }
  _findPreviousMatch(loop = false, stayIfOnMatch = false, ignoreSelection = false) {
    var _a;
    if (this.currentMatch) {
      const currentMatchIndex = this._matches.findIndex((match) => match === this.currentMatch);
      if (stayIfOnMatch) {
        return [this.currentMatch, currentMatchIndex];
      }
      const nextMatchIndex = currentMatchIndex - 1;
      if (!loop && nextMatchIndex < 0) {
        return null;
      }
      const length = this._matches.length;
      const modded = (nextMatchIndex + length) % length;
      return [this._matches[modded], modded];
    }
    const lastSelection = this._workbookSelections.getCurrentLastSelection();
    if (ignoreSelection || !lastSelection) {
      const lastIndex = this._matches.length - 1;
      return [this._matches[lastIndex], lastIndex];
    }
    if (this._query.findScope !== "unit" /* UNIT */) {
      return this._findPreviousMatchByRange(this._matches, lastSelection.range);
    }
    const currentSheetId = (_a = this._workbook.getActiveSheet()) == null ? void 0 : _a.getSheetId();
    if (!currentSheetId) {
      return null;
    }
    const worksheetThatHasMatch = this._findPreviousWorksheetThatHasAMatch(currentSheetId, loop);
    if (!worksheetThatHasMatch) {
      return null;
    }
    return this._findPreviousMatchByRange(this._matchesByWorksheet.get(worksheetThatHasMatch), lastSelection.range);
  }
  _findNextMatch(loop = false, stayIfOnMatch = false, ignoreSelection = false) {
    var _a;
    if (this.currentMatch) {
      const currentMatchIndex = this._matches.findIndex((match) => match === this.currentMatch);
      if (stayIfOnMatch) {
        return [this.currentMatch, currentMatchIndex];
      }
      const nextMatchIndex = currentMatchIndex + 1;
      const length = this._matches.length;
      if (!loop && nextMatchIndex >= length) {
        return null;
      }
      const modded = nextMatchIndex % length;
      return [this._matches[modded], modded];
    }
    const last = this._workbookSelections.getCurrentLastSelection();
    if (ignoreSelection || !last) {
      return [this._matches[0], 0];
    }
    if (this._query.findScope !== "unit" /* UNIT */) {
      return this._findNextMatchByRange(this._matches, last.range, stayIfOnMatch);
    }
    const currentSheetId = (_a = this._workbook.getActiveSheet()) == null ? void 0 : _a.getSheetId();
    if (!currentSheetId) {
      return null;
    }
    const worksheetThatHasMatch = this._findNextWorksheetThatHasAMatch(currentSheetId, loop);
    if (!worksheetThatHasMatch) {
      return null;
    }
    return this._findNextMatchByRange(this._matchesByWorksheet.get(worksheetThatHasMatch), last.range);
  }
  _findPreviousWorksheetThatHasAMatch(currentWorksheet, loop = false) {
    const rawWorksheetsInOrder = this._workbook.getSheetOrders();
    const currentSheetIndex = rawWorksheetsInOrder.findIndex((sheet) => sheet === currentWorksheet);
    const worksheetsToSearch = loop ? rotate(rawWorksheetsInOrder, currentSheetIndex + 1) : rawWorksheetsInOrder.slice(0, currentSheetIndex + 1);
    const first = worksheetsToSearch.findLast((worksheet) => this._matchesByWorksheet.has(worksheet));
    return first != null ? first : null;
  }
  _findNextWorksheetThatHasAMatch(currentWorksheet, loop = false) {
    const rawWorksheetsInOrder = this._workbook.getSheetOrders();
    const currentSheetIndex = rawWorksheetsInOrder.findIndex((sheet) => sheet === currentWorksheet);
    const worksheetsToSearch = loop ? rotate(rawWorksheetsInOrder, currentSheetIndex) : rawWorksheetsInOrder.slice(currentSheetIndex);
    const first = worksheetsToSearch.find((worksheet) => this._matchesByWorksheet.has(worksheet));
    return first != null ? first : null;
  }
  _findNextMatchByRange(matches, range, stayIfOnMatch = false) {
    const findByRow = this._query.findDirection === "row" /* ROW */;
    let index = matches.findIndex((match2) => {
      const matchRange = match2.range.range;
      const isBehind = findByRow ? isBehindPositionWithRowPriority(range, matchRange) : isBehindPositionWithColumnPriority(range, matchRange);
      if (!isBehind) {
        return false;
      }
      const isSame = isSamePosition(range, matchRange);
      return stayIfOnMatch ? isSame : !isSame;
    });
    if (index === -1) {
      index = matches.length - 1;
    }
    const match = matches[index];
    return [match, this._matches.findIndex((m) => m === match)];
  }
  _findPreviousMatchByRange(matches, range, stayIfOnMatch = false) {
    const findByRow = this._query.findDirection === "row" /* ROW */;
    let index = this._matches.findLastIndex((match2) => {
      const matchRange = match2.range.range;
      const isBefore = findByRow ? isBeforePositionWithRowPriority(range, matchRange) : isBeforePositionWithColumnPriority(range, matchRange);
      if (!isBefore) {
        return false;
      }
      const isSame = isSamePosition(range, matchRange);
      return stayIfOnMatch ? isSame : !isSame;
    });
    if (index === -1) {
      index = 0;
    }
    const match = matches[index];
    return [match, this._matches.findIndex((m) => m === match)];
  }
  async replace(replaceString) {
    if (this._matchesCount === 0 || !this.currentMatch || !this._query || !this.currentMatch.replaceable) {
      return false;
    }
    const range = this.currentMatch.range;
    const targetWorksheet = this._workbook.getSheetBySheetId(this.currentMatch.range.subUnitId);
    const newContent = this._getReplacedCellData(
      this.currentMatch,
      targetWorksheet,
      this._query.findBy === "formula" /* FORMULA */,
      this._query.findString,
      replaceString,
      this._query.caseSensitive ? "g" : "ig"
    );
    const params = {
      unitId: this.currentMatch.unitId,
      subUnitId: range.subUnitId,
      value: {
        [range.range.startRow]: {
          [range.range.startColumn]: newContent
        }
      }
    };
    return this._commandService.executeCommand(SetRangeValuesCommand.id, params);
  }
  async replaceAll(replaceString) {
    if (this._matchesCount === 0 || !this._query) {
      return { success: 0, failure: 0 };
    }
    const unitId = this._workbook.getUnitId();
    const { findString, caseSensitive, findBy } = this._query;
    const shouldReplaceFormula = findBy === "formula" /* FORMULA */;
    const replaceFlag = caseSensitive ? "g" : "ig";
    const replacements = [];
    const matchesByWorksheet = groupBy(this._matches.filter((m) => m.replaceable), (match) => match.range.subUnitId);
    matchesByWorksheet.forEach((matches, subUnitId) => {
      const matrix = new ObjectMatrix();
      const worksheet = this._workbook.getSheetBySheetId(subUnitId);
      matches.forEach((match) => {
        const { startColumn, startRow } = match.range.range;
        const newCellData = this._getReplacedCellData(match, worksheet, shouldReplaceFormula, findString, replaceString, replaceFlag);
        if (newCellData) {
          matrix.setValue(startRow, startColumn, newCellData);
        }
      });
      replacements.push({
        count: matches.length,
        subUnitId,
        value: matrix.getMatrix()
      });
    });
    if (!replacements) {
      return { success: 0, failure: 0 };
    }
    return this._commandService.executeCommand(SheetReplaceCommand.id, {
      unitId,
      replacements
    });
  }
  _getReplacedCellData(match, worksheet, shouldReplaceFormula, findString, replaceString, replaceFlag) {
    var _a;
    const range = match.range.range;
    const { startRow, startColumn } = range;
    const currentContent = worksheet.getCellRaw(startRow, startColumn);
    if (match.isFormula) {
      if (!shouldReplaceFormula) {
        return null;
      }
      const newContent2 = currentContent.f.replace(new RegExp(escapeRegExp(findString), replaceFlag), replaceString);
      return { f: newContent2, v: null };
    }
    const isRichText = !!((_a = currentContent.p) == null ? void 0 : _a.body);
    if (isRichText) {
      const clonedRichText = Tools.deepClone(currentContent.p);
      replaceInDocumentBody(clonedRichText.body, findString, replaceString, this._query.caseSensitive);
      return { p: clonedRichText };
    }
    const newContent = currentContent.v.toString().replace(new RegExp(escapeRegExp(findString), replaceFlag), replaceString);
    return { v: newContent };
  }
};
SheetFindModel = __decorateClass([
  __decorateParam(2, IUniverInstanceService),
  __decorateParam(3, IRenderManagerService),
  __decorateParam(4, ICommandService),
  __decorateParam(5, IContextService),
  __decorateParam(6, Inject(ThemeService)),
  __decorateParam(7, Inject(SheetsSelectionsService))
], SheetFindModel);
function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
var SheetsFindReplaceProvider = class extends Disposable {
  constructor(_univerInstanceService, _renderManagerService, _injector) {
    super();
    this._univerInstanceService = _univerInstanceService;
    this._renderManagerService = _renderManagerService;
    this._injector = _injector;
    /**
     * Hold all find results in this kind of univer business instances (Workbooks).
     */
    __publicField(this, "_findModelsByUnitId", /* @__PURE__ */ new Map());
  }
  async find(query) {
    this._terminate();
    const workbook = this._univerInstanceService.getCurrentUnitOfType(O.UNIVER_SHEET);
    if (!workbook) return [];
    const parsedQuery = this._preprocessQuery(query);
    const skeletonManagerService = this._renderManagerService.getRenderById(workbook.getUnitId()).with(SheetSkeletonManagerService);
    const sheetFind = this._injector.createInstance(SheetFindModel, workbook, skeletonManagerService);
    this._findModelsByUnitId.set(workbook.getUnitId(), sheetFind);
    sheetFind.start(parsedQuery);
    return [sheetFind];
  }
  terminate() {
    this._terminate();
  }
  _terminate() {
    this._findModelsByUnitId.forEach((model) => model.dispose());
    this._findModelsByUnitId.clear();
  }
  /**
   * Parsed the query object before do actual searching in favor of performance.
   * @param query the raw query object
   * @returns the parsed query object
   */
  _preprocessQuery(query) {
    let findString = query.caseSensitive ? query.findString : query.findString.toLowerCase();
    findString = findString.trim();
    return {
      ...query,
      findString
    };
  }
};
SheetsFindReplaceProvider = __decorateClass([
  __decorateParam(0, IUniverInstanceService),
  __decorateParam(1, IRenderManagerService),
  __decorateParam(2, Inject(Injector))
], SheetsFindReplaceProvider);
var VALUE_PASSING_OBJECT = { hit: false, replaceable: false, isFormula: false, rawData: null };
function hitCell(worksheet, row, col, query, cellData) {
  const { findBy } = query;
  const findByFormula = findBy === "formula" /* FORMULA */;
  const rawData = worksheet.getCellRaw(row, col);
  VALUE_PASSING_OBJECT.rawData = rawData;
  const hasFormula = !!(rawData == null ? void 0 : rawData.f);
  if (hasFormula) {
    VALUE_PASSING_OBJECT.isFormula = true;
    if (findByFormula) {
      const formulaMatch = matchCellData({ v: rawData.f }, query);
      if (formulaMatch) {
        VALUE_PASSING_OBJECT.hit = true;
        VALUE_PASSING_OBJECT.replaceable = true;
        return VALUE_PASSING_OBJECT;
      }
      VALUE_PASSING_OBJECT.hit = false;
      VALUE_PASSING_OBJECT.replaceable = false;
      return VALUE_PASSING_OBJECT;
    }
    VALUE_PASSING_OBJECT.replaceable = false;
    if (matchCellData(cellData, query)) {
      VALUE_PASSING_OBJECT.hit = true;
    } else {
      VALUE_PASSING_OBJECT.hit = false;
    }
    return VALUE_PASSING_OBJECT;
  }
  VALUE_PASSING_OBJECT.isFormula = false;
  if (!matchCellData(cellData, query)) {
    VALUE_PASSING_OBJECT.hit = false;
    VALUE_PASSING_OBJECT.replaceable = false;
  } else if (!rawData) {
    VALUE_PASSING_OBJECT.hit = true;
    VALUE_PASSING_OBJECT.replaceable = false;
  } else {
    VALUE_PASSING_OBJECT.hit = true;
    VALUE_PASSING_OBJECT.replaceable = true;
  }
  return VALUE_PASSING_OBJECT;
}
function matchCellData(cellData, query) {
  let value = extractPureValue(cellData);
  if (!value) {
    return false;
  }
  if (query.matchesTheWholeCell) {
    value = trimLeadingTrailingWhitespace(value);
    return query.caseSensitive ? value === query.findString : value.toLowerCase() === query.findString;
  }
  return query.caseSensitive ? value.indexOf(query.findString) > -1 : value.toLowerCase().indexOf(query.findString) > -1;
}
function extractPureValue(cell) {
  var _a, _b, _c;
  const rawValue = (_c = (_b = (_a = cell == null ? void 0 : cell.p) == null ? void 0 : _a.body) == null ? void 0 : _b.dataStream) != null ? _c : cell == null ? void 0 : cell.v;
  if (typeof rawValue === "number") {
    return `${rawValue}`;
  }
  if (typeof rawValue === "boolean") {
    return rawValue ? "1" : "0";
  }
  return rawValue;
}
function trimLeadingTrailingWhitespace(value) {
  return value.replace(/^ +/g, "").replace(/ +$/g, "");
}

// ../packages/sheets-find-replace/src/plugin.ts
var NAME = "SHEET_FIND_REPLACE_PLUGIN";
var UniverSheetsFindReplacePlugin = class extends Plugin {
  constructor(_config = defaultPluginConfig, _injector, _configService) {
    super();
    this._config = _config;
    this._injector = _injector;
    this._configService = _configService;
    const { ...rest } = merge_default(
      {},
      defaultPluginConfig,
      this._config
    );
    this._configService.setConfig(SHEETS_FIND_REPLACE_PLUGIN_CONFIG_KEY, rest);
  }
  onStarting() {
    [[SheetsFindReplaceController]].forEach((d) => this._injector.add(d));
  }
  onSteady() {
    this._injector.get(SheetsFindReplaceController);
  }
};
__publicField(UniverSheetsFindReplacePlugin, "pluginName", NAME);
__publicField(UniverSheetsFindReplacePlugin, "type", O.UNIVER_SHEET);
UniverSheetsFindReplacePlugin = __decorateClass([
  DependentOn(UniverSheetsPlugin, UniverSheetsPlugin, UniverFindReplacePlugin),
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, IConfigService)
], UniverSheetsFindReplacePlugin);

// ../packages/sheets-sort-ui/src/controllers/config.schema.ts
var SHEETS_SORT_UI_PLUGIN_CONFIG_KEY = "sheets-sort-ui.config";
var configSymbol2 = Symbol(SHEETS_SORT_UI_PLUGIN_CONFIG_KEY);
var defaultPluginConfig2 = {};

// ../packages/sheets-sort-ui/src/views/ExtendConfirm.tsx
var import_react = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var ExtendConfirm = (props) => {
  const [extend, setExtend] = (0, import_react.useState)("0");
  const localeService = useDependency(LocaleService);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "univer-text-sm", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "extend-confirm-desc", children: localeService.t("sheets-sort.dialog.sort-reminder-desc") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      RadioGroup,
      {
        className: "univer-mt-4",
        value: extend,
        direction: "vertical",
        onChange: (value) => {
          setExtend(value);
          props.onChange(value);
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { value: "0", children: localeService.t("sheets-sort.dialog.sort-reminder-no") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { value: "1", children: localeService.t("sheets-sort.dialog.sort-reminder-ext") })
        ]
      }
    )
  ] });
};

// ../packages/sheets-sort-ui/src/services/sheets-sort-ui.service.tsx
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var SORT_ERROR_MESSAGE = {
  MERGE_ERROR: "sheets-sort.error.merge-size",
  EMPTY_ERROR: "sheets-sort.error.empty",
  SINGLE_ERROR: "sheets-sort.error.single",
  FORMULA_ARRAY: "sheets-sort.error.formula-array"
};
var SheetsSortUIService = class extends Disposable {
  constructor(_univerInstanceService, _confirmService, _selectionManagerService, _sheetsSortService, _localeService, _commandService) {
    super();
    this._univerInstanceService = _univerInstanceService;
    this._confirmService = _confirmService;
    this._selectionManagerService = _selectionManagerService;
    this._sheetsSortService = _sheetsSortService;
    this._localeService = _localeService;
    this._commandService = _commandService;
    __publicField(this, "_customSortState$", new BehaviorSubject(null));
    __publicField(this, "customSortState$", this._customSortState$.asObservable());
  }
  async triggerSortDirectly(asc, extend, sheetRangeLocation) {
    const location = sheetRangeLocation || await this._detectSortLocation(extend);
    if (!location) {
      return false;
    }
    const check = this._check(location);
    if (!check) {
      return false;
    }
    const sortOption = {
      orderRules: [{
        type: asc ? "asc" /* ASC */ : "desc" /* DESC */,
        colIndex: location.colIndex
      }],
      range: location.range
    };
    this._sheetsSortService.applySort(sortOption, location.unitId, location.subUnitId);
    return true;
  }
  async triggerSortCustomize() {
    const location = await this._detectSortLocation();
    if (!location) {
      return false;
    }
    const check = this._check(location);
    if (!check) {
      return false;
    }
    this.showCustomSortPanel(location);
    return true;
  }
  customSortState() {
    return this._customSortState$.getValue();
  }
  getTitles(hasTitle) {
    var _a, _b;
    const location = (_a = this.customSortState()) == null ? void 0 : _a.location;
    if (!location) {
      return [];
    }
    const { unitId, subUnitId, range } = location;
    const worksheet = (_b = this._univerInstanceService.getUnit(unitId)) == null ? void 0 : _b.getSheetBySheetId(subUnitId);
    if (!worksheet) {
      return [];
    }
    const colTranslator = colIndexTranslator(this._localeService);
    return Array.from({ length: range.endColumn - range.startColumn + 1 }, (_, i) => {
      var _a2;
      const cellValue = (_a2 = worksheet.getCell(range.startRow, i + range.startColumn)) == null ? void 0 : _a2.v;
      return {
        index: i + range.startColumn,
        label: hasTitle ? `${cellValue != null ? cellValue : colTranslator(i + range.startColumn)}` : colTranslator(i + range.startColumn)
      };
    });
  }
  setSelection(unitId, subUnitId, range) {
    var _a;
    const worksheet = (_a = this._univerInstanceService.getUnit(unitId)) == null ? void 0 : _a.getSheetBySheetId(subUnitId);
    if (!worksheet) {
      return;
    }
    const setSelectionsOperationParams = {
      unitId,
      subUnitId,
      selections: [{ range, primary: getPrimaryForRange(range, worksheet), style: null }]
    };
    this._commandService.executeCommand(SetSelectionsOperation.id, setSelectionsOperationParams);
  }
  async showCheckError(content) {
    return await this._confirmService.confirm({
      id: "sort-range-check-error",
      title: {
        title: this._localeService.t("info.tooltip")
      },
      children: {
        title: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { children: this._localeService.t(content) })
      },
      cancelText: this._localeService.t("sheets-sort.dialog.cancel"),
      confirmText: this._localeService.t("sheets-sort.dialog.confirm")
    });
  }
  async showExtendConfirm() {
    let shouldExtend = false;
    const confirm = await this._confirmService.confirm({
      id: "extend-sort-range-dialog",
      title: {
        title: this._localeService.t("sheets-sort.dialog.sort-reminder")
      },
      children: {
        title: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          ExtendConfirm,
          {
            onChange: (value) => {
              shouldExtend = value === "1";
            }
          }
        )
      },
      width: 400,
      cancelText: this._localeService.t("sheets-sort.dialog.cancel"),
      confirmText: this._localeService.t("sheets-sort.dialog.confirm")
    });
    if (confirm) {
      return shouldExtend ? "extend" /* EXTEND */ : "keep" /* KEEP */;
    }
    return "cancel" /* CANCEL */;
  }
  showCustomSortPanel(location) {
    this._customSortState$.next({ location, show: true });
  }
  closeCustomSortPanel() {
    this._customSortState$.next({ show: false });
  }
  _check(location) {
    const singleCheck = this._sheetsSortService.singleCheck(location);
    if (!singleCheck) {
      this.showCheckError(SORT_ERROR_MESSAGE.SINGLE_ERROR);
      return false;
    }
    const mergeCheck = this._sheetsSortService.mergeCheck(location);
    if (!mergeCheck) {
      this.showCheckError(SORT_ERROR_MESSAGE.MERGE_ERROR);
      return false;
    }
    const formulaCheck = this._sheetsSortService.formulaCheck(location);
    if (!formulaCheck) {
      this.showCheckError(SORT_ERROR_MESSAGE.FORMULA_ARRAY);
      return false;
    }
    const emptyCheck = this._sheetsSortService.emptyCheck(location);
    if (!emptyCheck) {
      this.showCheckError(SORT_ERROR_MESSAGE.EMPTY_ERROR);
      return false;
    }
    return true;
  }
  async _detectSortLocation(extend) {
    const workbook = this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET);
    const worksheet = workbook.getActiveSheet();
    const unitId = workbook.getUnitId();
    const subUnitId = worksheet.getSheetId();
    const selection = this._selectionManagerService.getCurrentLastSelection();
    if (!selection) {
      return null;
    }
    let range;
    if (extend === true) {
      range = expandToContinuousRange(selection.range, { up: true, down: true, left: true, right: true }, worksheet);
      this.setSelection(unitId, subUnitId, range);
    } else if (extend === false) {
      range = selection.range;
    } else {
      const confirmRes = await this.showExtendConfirm();
      if (confirmRes === "cancel" /* CANCEL */) {
        return null;
      }
      if (confirmRes === "keep" /* KEEP */) {
        range = selection.range;
      } else {
        range = expandToContinuousRange(selection.range, { up: true, down: true, left: true, right: true }, worksheet);
        this.setSelection(unitId, subUnitId, range);
      }
    }
    return {
      range,
      unitId,
      subUnitId,
      colIndex: selection.primary.actualColumn
    };
  }
};
SheetsSortUIService = __decorateClass([
  __decorateParam(0, IUniverInstanceService),
  __decorateParam(1, IConfirmService),
  __decorateParam(2, Inject(SheetsSelectionsService)),
  __decorateParam(3, Inject(SheetsSortService)),
  __decorateParam(4, Inject(LocaleService)),
  __decorateParam(5, ICommandService)
], SheetsSortUIService);
function colIndexTranslator(localeService) {
  return (colIndex) => {
    const colName = Tools.chatAtABC(colIndex);
    const currentLocale = localeService.getCurrentLocale();
    switch (currentLocale) {
      case "zhCN" /* ZH_CN */:
        return `"${colName}"\u5217`;
      case "enUS" /* EN_US */:
        return `Column "${colName}"`;
      default:
        return `Column "${colName}"`;
    }
  };
}

// ../packages/sheets-sort-ui/src/commands/commands/sheets-sort.command.ts
var SortRangeAscCommand = {
  id: "sheet.command.sort-range-asc",
  type: 0 /* COMMAND */,
  handler: async (accessor) => {
    const sortService = accessor.get(SheetsSortUIService);
    return await sortService.triggerSortDirectly(true, false);
  }
};
var SortRangeAscExtCommand = {
  id: "sheet.command.sort-range-asc-ext",
  type: 0 /* COMMAND */,
  handler: async (accessor) => {
    const sortService = accessor.get(SheetsSortUIService);
    return await sortService.triggerSortDirectly(true, true);
  }
};
var SortRangeDescCommand = {
  id: "sheet.command.sort-range-desc",
  type: 0 /* COMMAND */,
  handler: async (accessor) => {
    const sortService = accessor.get(SheetsSortUIService);
    return await sortService.triggerSortDirectly(false, false);
  }
};
var SortRangeDescExtCommand = {
  id: "sheet.command.sort-range-desc-ext",
  type: 0 /* COMMAND */,
  handler: async (accessor) => {
    const sortService = accessor.get(SheetsSortUIService);
    return await sortService.triggerSortDirectly(false, true);
  }
};
var SortRangeCustomCommand = {
  id: "sheet.command.sort-range-custom",
  type: 0 /* COMMAND */,
  handler: async (accessor) => {
    const sortService = accessor.get(SheetsSortUIService);
    return await sortService.triggerSortCustomize();
  }
};
var SortRangeAscInCtxMenuCommand = {
  id: "sheet.command.sort-range-asc-ctx",
  type: 0 /* COMMAND */,
  handler: async (accessor) => {
    const sortService = accessor.get(SheetsSortUIService);
    return await sortService.triggerSortDirectly(true, false);
  }
};
var SortRangeAscExtInCtxMenuCommand = {
  id: "sheet.command.sort-range-asc-ext-ctx",
  type: 0 /* COMMAND */,
  handler: async (accessor) => {
    const sortService = accessor.get(SheetsSortUIService);
    return await sortService.triggerSortDirectly(true, true);
  }
};
var SortRangeDescInCtxMenuCommand = {
  id: "sheet.command.sort-range-desc-ctx",
  type: 0 /* COMMAND */,
  handler: async (accessor) => {
    const sortService = accessor.get(SheetsSortUIService);
    return await sortService.triggerSortDirectly(false, false);
  }
};
var SortRangeDescExtInCtxMenuCommand = {
  id: "sheet.command.sort-range-desc-ext-ctx",
  type: 0 /* COMMAND */,
  handler: async (accessor) => {
    const sortService = accessor.get(SheetsSortUIService);
    return await sortService.triggerSortDirectly(false, true);
  }
};
var SortRangeCustomInCtxMenuCommand = {
  id: "sheet.command.sort-range-custom-ctx",
  type: 0 /* COMMAND */,
  handler: async (accessor) => {
    const sortService = accessor.get(SheetsSortUIService);
    return await sortService.triggerSortCustomize();
  }
};

// ../packages/sheets-sort-ui/src/views/CustomSortPanel.tsx
var import_react2 = __toESM(require_react());
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
function CustomSortPanel() {
  const sheetsSortUIService = useDependency(SheetsSortUIService);
  const state = useObservable(sheetsSortUIService.customSortState$);
  if (!state || !state.location) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CustomSortPanelImpl, { state });
}
function CustomSortPanelImpl({ state }) {
  const sheetsSortService = useDependency(SheetsSortService);
  const localeService = useDependency(LocaleService);
  const sheetsSortUIService = useDependency(SheetsSortUIService);
  const [hasTitle, setHasTitle] = (0, import_react2.useState)(false);
  const [scrollPosition, setScrollPosition] = (0, import_react2.useState)(0);
  const listEndRef = (0, import_react2.useRef)(null);
  const { range, unitId, subUnitId } = state.location;
  const titles = sheetsSortUIService.getTitles(hasTitle);
  const [list, setList] = (0, import_react2.useState)([
    { type: "asc" /* ASC */, colIndex: range.startColumn }
  ]);
  const onItemChange = (0, import_react2.useCallback)((index, value) => {
    const newList = [...list];
    if (value === null) {
      newList.splice(index, 1);
    } else {
      newList[index] = value;
    }
    setList(newList);
  }, [list]);
  const newItem = (0, import_react2.useCallback)(
    throttle(() => {
      const newList = [...list];
      const nextColIndex = findNextColIndex(range, list);
      if (nextColIndex !== null) {
        newList.push({ type: "asc" /* ASC */, colIndex: nextColIndex });
        setList(newList);
      }
    }, 200),
    [list, range]
  );
  const apply = (0, import_react2.useCallback)((orderRules, hasTitle2) => {
    sheetsSortService.applySort({ range, orderRules, hasTitle: hasTitle2 });
    sheetsSortUIService.closeCustomSortPanel();
  }, [sheetsSortService, sheetsSortUIService, range]);
  const cancel = (0, import_react2.useCallback)(() => {
    sheetsSortUIService.closeCustomSortPanel();
  }, [sheetsSortUIService]);
  const setTitle = (0, import_react2.useCallback)((value) => {
    setHasTitle(value);
    if (value) {
      sheetsSortUIService.setSelection(unitId, subUnitId, { ...range, startRow: range.startRow + 1 });
    } else {
      sheetsSortUIService.setSelection(unitId, subUnitId, range);
    }
  }, [sheetsSortUIService, range, subUnitId, unitId]);
  (0, import_react2.useEffect)(() => {
    if (listEndRef.current && list.length > 5) {
      listEndRef.current.scrollTop = listEndRef.current.scrollHeight;
    }
  }, [list]);
  const canNew = list.length < titles.length;
  const dragList = list.map((item) => ({ ...item, id: `${item.colIndex}` }));
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { onMouseDown: (e) => {
      e.stopPropagation();
    }, children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "univer-flex univer-items-center univer-justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Checkbox, { checked: hasTitle, onChange: (value) => setTitle(!!value), children: localeService.t("sheets-sort.dialog.first-row-check") }),
        canNew ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "div",
          {
            className: `univer-flex univer-cursor-pointer univer-select-none univer-items-center univer-text-base`,
            onClick: newItem,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(IncreaseIcon, {}),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "univer-ml-1.5", children: localeService.t("sheets-sort.dialog.add-condition") })
            ]
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "div",
          {
            className: `univer-flex univer-cursor-pointer univer-select-none univer-items-center univer-text-base univer-text-primary-500 disabled:univer-cursor-not-allowed disabled:univer-divide-opacity-30 disabled:univer-text-gray-800`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(IncreaseIcon, {}),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "univer-ml-1.5 univer-text-xs", children: localeService.t("sheets-sort.dialog.add-condition") })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "div",
        {
          ref: listEndRef,
          className: clsx("univer-max-h-[310px] univer-overflow-y-auto univer-overflow-x-hidden", scrollbarClassName),
          onScroll: (e) => {
            const position = e.currentTarget.scrollTop;
            setScrollPosition(position);
          },
          children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            DraggableList,
            {
              className: `[&_.react-grid-item]:univer-transition-none [&_.react-grid-placeholder]:univer-rounded [&_.react-grid-placeholder]:!univer-bg-gray-200`,
              list: dragList,
              onListChange: setList,
              idKey: "id",
              draggableHandle: "[data-u-comp=sort-panel-item-handler]",
              itemRender: (item) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                SortOptionItem,
                {
                  titles,
                  list: dragList,
                  item,
                  onChange: (value, index) => onItemChange(index, value),
                  scrollPosition
                }
              ),
              rowHeight: 32,
              margin: [0, 12]
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "univer-mt-5 univer-flex univer-justify-end", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Button,
        {
          className: "univer-ml-3",
          onClick: () => cancel(),
          children: localeService.t("sheets-sort.dialog.cancel")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Button,
        {
          className: "univer-ml-3",
          variant: "primary",
          onClick: () => apply(list, hasTitle),
          children: localeService.t("sheets-sort.dialog.confirm")
        }
      )
    ] })
  ] });
}
function SortOptionItem(props) {
  var _a;
  const { list, item, titles, onChange, scrollPosition } = props;
  const localeService = useDependency(LocaleService);
  const availableMenu = titles.filter((title) => !list.some((item2) => item2.colIndex === title.index) || title.index === item.colIndex);
  const currentIndex = list.findIndex((listItem) => listItem.colIndex === item.colIndex);
  const handleChangeColIndex = (0, import_react2.useCallback)((menuItem) => {
    onChange({ ...item, colIndex: menuItem.index }, currentIndex);
    setVisible(false);
  }, [currentIndex, item, onChange]);
  const [visible, setVisible] = (0, import_react2.useState)(false);
  const onVisibleChange = (visible2) => {
    setVisible(visible2);
  };
  (0, import_react2.useEffect)(() => {
    setVisible(false);
  }, [scrollPosition]);
  const showDelete = list.length > 1;
  const itemLabel = (_a = titles.find((title) => title.index === item.colIndex)) == null ? void 0 : _a.label;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "univer-grid univer-grid-flow-col univer-grid-cols-2 univer-items-center univer-gap-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "univer-flex univer-items-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "div",
        {
          "data-u-comp": "sort-panel-item-handler",
          className: `univer-flex univer-cursor-pointer univer-items-center univer-justify-center univer-text-base univer-text-gray-700`,
          children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(SequenceIcon, {})
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Dropdown,
        {
          overlay: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "ul",
            {
              className: clsx(`univer-my-0 univer-box-border univer-grid univer-max-h-[310px] univer-w-[var(--radix-popper-anchor-width)] univer-items-center univer-gap-1 univer-overflow-y-auto univer-overflow-x-hidden univer-rounded-lg univer-border univer-bg-white univer-p-1 univer-text-base univer-shadow-lg`, scrollbarClassName),
              children: availableMenu.map((menuItem) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
                "li",
                {
                  onClick: () => handleChangeColIndex(menuItem),
                  className: `univer-relative univer-box-border univer-flex univer-h-7 univer-cursor-pointer univer-list-none univer-items-center univer-justify-between univer-rounded univer-px-2 univer-text-sm univer-transition-all hover:univer-bg-gray-100 dark:hover:!univer-bg-gray-700`,
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "univer-max-w-[220px] univer-truncate", children: menuItem.label }),
                    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { children: menuItem.index === item.colIndex && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(CheckMarkIcon, {}) })
                  ]
                },
                menuItem.index
              ))
            }
          ),
          open: visible,
          onOpenChange: onVisibleChange,
          children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            "div",
            {
              className: clsx(`univer-ml-2 univer-flex univer-w-full univer-items-center univer-justify-between univer-overflow-hidden univer-rounded-md univer-py-1.5 univer-text-sm univer-text-gray-900 dark:!univer-text-white`),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                  "span",
                  {
                    className: "univer-max-w-[220px] univer-truncate",
                    children: itemLabel
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(MoreDownIcon, {})
              ]
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "univer-flex univer-items-center univer-justify-end univer-gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
        RadioGroup,
        {
          value: item.type,
          onChange: (value) => {
            onChange({ ...item, type: value }, currentIndex);
          },
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Radio, { value: "asc" /* ASC */, children: localeService.t("sheets-sort.general.sort-asc") }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Radio, { value: "desc" /* DESC */, children: localeService.t("sheets-sort.general.sort-desc") })
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        "a",
        {
          className: `univer-flex univer-cursor-pointer univer-items-center univer-text-sm univer-transition-colors hover:univer-text-red-500`,
          onClick: () => onChange(null, currentIndex),
          children: !showDelete && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(DeleteEmptyIcon, {})
        }
      )
    ] })
  ] });
}
function findNextColIndex(range, list) {
  const { startColumn, endColumn } = range;
  const used = new Set(list.map((item) => item == null ? void 0 : item.colIndex));
  for (let i = startColumn; i <= endColumn; i++) {
    if (!used.has(i)) {
      return i;
    }
  }
  return null;
}

// ../packages/sheets-sort-ui/src/views/EmbedSortBtn.tsx
var import_react3 = __toESM(require_react());
var import_jsx_runtime4 = __toESM(require_jsx_runtime());
function EmbedSortBtn(props) {
  const { range, colIndex, onClose } = props;
  const sheetsSortUIService = useDependency(SheetsSortUIService);
  const univerInstanceService = useDependency(IUniverInstanceService);
  const localeService = useDependency(LocaleService);
  const apply = (0, import_react3.useCallback)((asc) => {
    const { unitId, subUnitId } = getSheetCommandTarget(univerInstanceService) || {};
    if (range && unitId && subUnitId) {
      const noTitleRange = { ...range, startRow: range.startRow + 1 };
      sheetsSortUIService.triggerSortDirectly(asc, false, { unitId, subUnitId, range: noTitleRange, colIndex });
    } else {
      throw new Error(`Cannot find the target to sort. unitId: ${unitId}, subUnitId: ${subUnitId}, range: ${range}, colIndex: ${colIndex}`);
    }
    onClose();
  }, [range, colIndex, sheetsSortUIService, univerInstanceService, onClose]);
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(ButtonGroup, { className: "univer-mb-3 univer-w-full univer-grid-cols-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(Button, { onClick: () => apply(true), children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(AscendingIcon, {}),
      localeService.t("sheets-sort.general.sort-asc")
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(Button, { onClick: () => apply(false), children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(DescendingIcon, {}),
      localeService.t("sheets-sort.general.sort-desc")
    ] })
  ] });
}

// ../packages/sheets-sort-ui/src/controllers/sheets-sort.menu.ts
var SHEETS_SORT_MENU_ID = "sheet.menu.sheets-sort";
var SHEETS_SORT_CTX_MENU_ID = "sheet.menu.sheets-sort-ctx";
var SHEETS_SORT_ASC_ICON = "AscendingIcon";
var SHEETS_SORT_ASC_EXT_ICON = "ExpandAscendingIcon";
var SHEETS_SORT_DESC_ICON = "DescendingIcon";
var SHEETS_SORT_DESC_EXT_ICON = "ExpandDescendingIcon";
var SHEETS_SORT_CUSTOM_ICON = "CustomSortIcon";
function sortRangeMenuFactory(accessor) {
  return {
    id: SHEETS_SORT_MENU_ID,
    type: 3 /* SUBITEMS */,
    icon: SHEETS_SORT_ASC_ICON,
    tooltip: "sheets-sort.general.sort",
    hidden$: getMenuHiddenObservable(accessor, O.UNIVER_SHEET),
    disabled$: getCurrentRangeDisable$(accessor, { workbookTypes: [WorkbookEditablePermission], worksheetTypes: [WorksheetSortPermission, WorksheetEditPermission], rangeTypes: [RangeProtectionPermissionEditPoint] })
  };
}
function sortRangeAscMenuFactory(_accessor) {
  return {
    id: SortRangeAscCommand.id,
    icon: SHEETS_SORT_ASC_ICON,
    title: "sheets-sort.general.sort-asc-cur",
    type: 0 /* BUTTON */,
    hidden$: getCurrentExclusiveRangeInterest$(_accessor)
  };
}
function sortRangeAscExtMenuFactory(_accessor) {
  return {
    id: SortRangeAscExtCommand.id,
    title: "sheets-sort.general.sort-asc-ext",
    icon: SHEETS_SORT_ASC_EXT_ICON,
    type: 0 /* BUTTON */
  };
}
function sortRangeDescMenuFactory(_accessor) {
  return {
    id: SortRangeDescCommand.id,
    title: "sheets-sort.general.sort-desc-cur",
    icon: SHEETS_SORT_DESC_ICON,
    type: 0 /* BUTTON */
  };
}
function sortRangeDescExtMenuFactory(_accessor) {
  return {
    id: SortRangeDescExtCommand.id,
    title: "sheets-sort.general.sort-desc-ext",
    icon: SHEETS_SORT_DESC_EXT_ICON,
    type: 0 /* BUTTON */
  };
}
function sortRangeCustomMenuFactory(_accessor) {
  return {
    id: SortRangeCustomCommand.id,
    title: "sheets-sort.general.sort-custom",
    type: 0 /* BUTTON */,
    icon: SHEETS_SORT_CUSTOM_ICON
  };
}
function sortRangeCtxMenuFactory(accessor) {
  return {
    id: SHEETS_SORT_CTX_MENU_ID,
    title: "sheets-sort.general.sort",
    type: 3 /* SUBITEMS */,
    icon: SHEETS_SORT_ASC_ICON,
    hidden$: getMenuHiddenObservable(accessor, O.UNIVER_SHEET),
    disabled$: getCurrentRangeDisable$(accessor, {
      workbookTypes: [WorkbookEditablePermission],
      worksheetTypes: [WorksheetSortPermission, WorksheetEditPermission],
      rangeTypes: [RangeProtectionPermissionEditPoint]
    })
  };
}
function sortRangeAscCtxMenuFactory(_accessor) {
  return {
    id: SortRangeAscInCtxMenuCommand.id,
    title: "sheets-sort.general.sort-asc-cur",
    type: 0 /* BUTTON */,
    icon: SHEETS_SORT_ASC_ICON,
    disabled$: getCurrentRangeDisable$(_accessor, { workbookTypes: [WorkbookEditablePermission], worksheetTypes: [WorksheetSortPermission, WorksheetEditPermission], rangeTypes: [RangeProtectionPermissionEditPoint] })
  };
}
function sortRangeAscExtCtxMenuFactory(_accessor) {
  return {
    id: SortRangeAscExtInCtxMenuCommand.id,
    title: "sheets-sort.general.sort-asc-ext",
    type: 0 /* BUTTON */,
    icon: SHEETS_SORT_ASC_EXT_ICON,
    disabled$: getCurrentRangeDisable$(_accessor, { workbookTypes: [WorkbookEditablePermission], worksheetTypes: [WorksheetSortPermission, WorksheetEditPermission], rangeTypes: [RangeProtectionPermissionEditPoint] })
  };
}
function sortRangeDescCtxMenuFactory(_accessor) {
  return {
    id: SortRangeDescInCtxMenuCommand.id,
    title: "sheets-sort.general.sort-desc-cur",
    type: 0 /* BUTTON */,
    icon: SHEETS_SORT_DESC_ICON,
    disabled$: getCurrentRangeDisable$(_accessor, { workbookTypes: [WorkbookEditablePermission], worksheetTypes: [WorksheetSortPermission, WorksheetEditPermission], rangeTypes: [RangeProtectionPermissionEditPoint] })
  };
}
function sortRangeDescExtCtxMenuFactory(_accessor) {
  return {
    id: SortRangeDescExtInCtxMenuCommand.id,
    title: "sheets-sort.general.sort-desc-ext",
    type: 0 /* BUTTON */,
    icon: SHEETS_SORT_DESC_EXT_ICON,
    disabled$: getCurrentRangeDisable$(_accessor, { workbookTypes: [WorkbookEditablePermission], worksheetTypes: [WorksheetSortPermission, WorksheetEditPermission], rangeTypes: [RangeProtectionPermissionEditPoint] })
  };
}
function sortRangeCustomCtxMenuFactory(_accessor) {
  return {
    id: SortRangeCustomInCtxMenuCommand.id,
    title: "sheets-sort.general.sort-custom",
    type: 0 /* BUTTON */,
    icon: SHEETS_SORT_CUSTOM_ICON,
    disabled$: getCurrentRangeDisable$(_accessor, { workbookTypes: [WorkbookEditablePermission], worksheetTypes: [WorksheetSortPermission, WorksheetEditPermission], rangeTypes: [RangeProtectionPermissionEditPoint] })
  };
}

// ../packages/sheets-sort-ui/src/controllers/menu.schema.ts
var menuSchema = {
  ["ribbon.data.organization" /* ORGANIZATION */]: {
    [SHEETS_SORT_MENU_ID]: {
      order: 3,
      menuItemFactory: sortRangeMenuFactory,
      [SortRangeAscCommand.id]: {
        order: 0,
        menuItemFactory: sortRangeAscMenuFactory
      },
      [SortRangeAscExtCommand.id]: {
        order: 1,
        menuItemFactory: sortRangeAscExtMenuFactory
      },
      [SortRangeDescCommand.id]: {
        order: 2,
        menuItemFactory: sortRangeDescMenuFactory
      },
      [SortRangeDescExtCommand.id]: {
        order: 3,
        menuItemFactory: sortRangeDescExtMenuFactory
      },
      [SortRangeCustomCommand.id]: {
        order: 4,
        menuItemFactory: sortRangeCustomMenuFactory
      }
    }
  },
  ["contextMenu.mainArea" /* MAIN_AREA */]: {
    ["contextMenu.data" /* DATA */]: {
      [SHEETS_SORT_CTX_MENU_ID]: {
        order: 0,
        menuItemFactory: sortRangeCtxMenuFactory,
        [SortRangeAscInCtxMenuCommand.id]: {
          order: 0,
          menuItemFactory: sortRangeAscCtxMenuFactory
        },
        [SortRangeAscExtInCtxMenuCommand.id]: {
          order: 1,
          menuItemFactory: sortRangeAscExtCtxMenuFactory
        },
        [SortRangeDescInCtxMenuCommand.id]: {
          order: 2,
          menuItemFactory: sortRangeDescCtxMenuFactory
        },
        [SortRangeDescExtInCtxMenuCommand.id]: {
          order: 3,
          menuItemFactory: sortRangeDescExtCtxMenuFactory
        },
        [SortRangeCustomInCtxMenuCommand.id]: {
          order: 4,
          menuItemFactory: sortRangeCustomCtxMenuFactory
        }
      }
    }
  }
};

// ../packages/sheets-sort-ui/src/controllers/sheets-sort-ui.controller.ts
var CUSTOM_SORT_DIALOG_ID = "custom-sort-dialog";
var CUSTOM_SORT_PANEL_WIDTH = 560;
var CUSTOM_SORT_PANEL_TOP = 128;
var SheetsSortUIController = class extends RxDisposable {
  constructor(_commandService, _menuManagerService, _dialogService, _layoutService, _uiPartsService, _sheetRenderService, _localeService, _sheetsSortUIService, _injector, _componentManager) {
    super();
    this._commandService = _commandService;
    this._menuManagerService = _menuManagerService;
    this._dialogService = _dialogService;
    this._layoutService = _layoutService;
    this._uiPartsService = _uiPartsService;
    this._sheetRenderService = _sheetRenderService;
    this._localeService = _localeService;
    this._sheetsSortUIService = _sheetsSortUIService;
    this._injector = _injector;
    this._componentManager = _componentManager;
    this._initCommands();
    this._initMenu();
    this._initUI();
  }
  _initMenu() {
    this._menuManagerService.mergeMenu(menuSchema);
  }
  _initCommands() {
    [
      SortRangeAscCommand,
      SortRangeAscExtCommand,
      SortRangeDescCommand,
      SortRangeDescExtCommand,
      SortRangeCustomCommand,
      SortRangeAscInCtxMenuCommand,
      SortRangeAscExtInCtxMenuCommand,
      SortRangeDescInCtxMenuCommand,
      SortRangeDescExtInCtxMenuCommand,
      SortRangeCustomInCtxMenuCommand
    ].forEach((command) => this.disposeWithMe(this._commandService.registerCommand(command)));
    this.disposeWithMe(this._sheetRenderService.registerSkeletonChangingMutations(SortRangeCommand.id));
  }
  _initUI() {
    this.disposeWithMe(
      this._uiPartsService.registerComponent("filter-panel-embed-point" /* FILTER_PANEL_EMBED_POINT */, () => connectInjector(EmbedSortBtn, this._injector))
    );
    [
      ["CustomSortPanel", CustomSortPanel],
      [SHEETS_SORT_ASC_ICON, AscendingIcon],
      [SHEETS_SORT_ASC_EXT_ICON, ExpandAscendingIcon],
      [SHEETS_SORT_DESC_ICON, DescendingIcon],
      [SHEETS_SORT_DESC_EXT_ICON, ExpandDescendingIcon],
      [SHEETS_SORT_CUSTOM_ICON, CustomSortIcon]
    ].forEach(([key, comp]) => {
      this.disposeWithMe(
        this._componentManager.register(key, comp)
      );
    });
    this._sheetsSortUIService.customSortState$.pipe(takeUntil(this.dispose$)).subscribe((newState) => {
      if (newState && newState.show && newState.location) {
        this._openCustomSortPanel(newState.location);
      } else if (newState && !(newState == null ? void 0 : newState.show)) {
        this._closePanel();
      }
    });
  }
  _openCustomSortPanel(location) {
    this._dialogService.open({
      id: CUSTOM_SORT_DIALOG_ID,
      draggable: true,
      width: CUSTOM_SORT_PANEL_WIDTH,
      title: { title: `${this._localeService.t("sheets-sort.general.sort-custom")}: ${serializeRange(location.range)}` },
      children: { label: "CustomSortPanel" },
      destroyOnClose: true,
      defaultPosition: getCustomSortDialogDefaultPosition(),
      preservePositionOnDestroy: false,
      onClose: () => this._closePanel(),
      mask: true
    });
  }
  _closePanel() {
    this._dialogService.close(CUSTOM_SORT_DIALOG_ID);
    queueMicrotask(() => this._layoutService.focus());
  }
};
SheetsSortUIController = __decorateClass([
  __decorateParam(0, ICommandService),
  __decorateParam(1, IMenuManagerService),
  __decorateParam(2, IDialogService),
  __decorateParam(3, ILayoutService),
  __decorateParam(4, IUIPartsService),
  __decorateParam(5, Inject(SheetsRenderService)),
  __decorateParam(6, Inject(LocaleService)),
  __decorateParam(7, Inject(SheetsSortUIService)),
  __decorateParam(8, Inject(Injector)),
  __decorateParam(9, Inject(ComponentManager))
], SheetsSortUIController);
function getCustomSortDialogDefaultPosition() {
  const x = (window.innerWidth - CUSTOM_SORT_PANEL_WIDTH) / 2;
  const y = CUSTOM_SORT_PANEL_TOP;
  return { x, y };
}

// ../packages/sheets-sort-ui/src/plugin.ts
var NAME2 = "SHEET_SORT_UI_PLUGIN";
var UniverSheetsSortUIPlugin = class extends Plugin {
  constructor(_config = defaultPluginConfig2, _injector, _configService) {
    super();
    this._config = _config;
    this._injector = _injector;
    this._configService = _configService;
    const { ...rest } = merge_default(
      {},
      defaultPluginConfig2,
      this._config
    );
    this._configService.setConfig(SHEETS_SORT_UI_PLUGIN_CONFIG_KEY, rest);
  }
  onStarting() {
    [
      [SheetsSortUIService],
      [SheetsSortUIController]
    ].forEach((d) => this._injector.add(d));
  }
  onRendered() {
    this._injector.get(SheetsSortUIController);
  }
};
__publicField(UniverSheetsSortUIPlugin, "type", O.UNIVER_SHEET);
__publicField(UniverSheetsSortUIPlugin, "pluginName", NAME2);
UniverSheetsSortUIPlugin = __decorateClass([
  DependentOn(UniverSheetsSortPlugin),
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, IConfigService)
], UniverSheetsSortUIPlugin);

export {
  UniverSheetsFindReplacePlugin,
  UniverSheetsSortUIPlugin
};
//# sourceMappingURL=chunk-DPZQZD2Z.js.map
