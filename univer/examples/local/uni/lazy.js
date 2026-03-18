import {
  AddDocUniFormulaMutation,
  DumbUniFormulaService,
  IUniFormulaService,
  RemoveDocUniFormulaMutation,
  UniverDocUniFormulaPlugin,
  UpdateDocUniFormulaMutation
} from "../chunk-764ESCAG.js";
import {
  CanvasView,
  ISlideEditorBridgeService,
  SLIDE_EDITOR_ID
} from "../chunk-5XOCCV3C.js";
import {
  UniverSheetsFilterUIPlugin
} from "../chunk-LHQ67NL3.js";
import "../chunk-SSBZJR5N.js";
import {
  FORMULA_PROMPT_ACTIVATED
} from "../chunk-ZR7BMKL3.js";
import "../chunk-BGPMR3ZY.js";
import {
  DeleteLeftCommand,
  DocCanvasPopManagerService,
  DocEventManagerService,
  DocSelectionManagerService,
  IEditorService,
  InsertCommand,
  MoveCursorOperation,
  replaceSelectionFactory
} from "../chunk-PAANS7B4.js";
import {
  CheckMarkIcon,
  CloseIcon,
  ComponentManager,
  IShortcutService,
  borderClassName,
  clsx,
  require_jsx_runtime,
  require_react,
  useDependency,
  useObservable
} from "../chunk-CSPB4B6P.js";
import {
  RegisterOtherFormulaService
} from "../chunk-EK3JRTKZ.js";
import {
  DataSyncPrimaryController
} from "../chunk-O5WA5YRR.js";
import {
  IRenderManagerService,
  RichText
} from "../chunk-I5MCYWYL.js";
import "../chunk-OJWCZZ56.js";
import {
  BehaviorSubject,
  BuildTextUtils,
  DEFAULT_EMPTY_DOCUMENT_VALUE,
  DependentOn,
  Disposable,
  FORMULA_EDITOR_ACTIVATED,
  ICommandService,
  IContextService,
  ILogService,
  IResourceManagerService,
  IUniverInstanceService,
  Inject,
  Injector,
  LocaleService,
  O,
  Plugin,
  Quantity,
  RCDisposable,
  Subject,
  createInternalEditorID,
  filter,
  generateRandomId,
  makeCustomRangeStream,
  map,
  sequenceExecute,
  switchMap,
  take,
  toDisposable,
  touchDependencies
} from "../chunk-ZRYQFDHJ.js";
import {
  __decorateClass,
  __decorateParam,
  __publicField,
  __toESM
} from "../chunk-NSSCU2QI.js";

// ../packages-experimental/uni-formula-ui/src/const.ts
var DOC_FORMULA_UI_PLUGIN_NAME = "DOC_FORMULA_UI_PLUGIN";

// ../packages-experimental/uni-formula-ui/src/commands/commands/doc.command.ts
var AddDocUniFormulaCommand = {
  type: 0 /* COMMAND */,
  id: "doc.command.add-uni-formula",
  async handler(accessor, params) {
    const { f, unitId, startIndex } = params;
    const commandService = accessor.get(ICommandService);
    const localeService = accessor.get(LocaleService);
    const rangeId = generateRandomId();
    const placeholder = localeService.t("uni-formula.command.stream-placeholder");
    const dataStream = makeCustomRangeStream(placeholder);
    const body = {
      dataStream,
      customRanges: [{
        startIndex: 0,
        endIndex: dataStream.length - 1,
        rangeId,
        rangeType: 7 /* UNI_FORMULA */,
        wholeEntity: true
      }]
    };
    const insertCustomRangeMutation = replaceSelectionFactory(accessor, {
      unitId,
      body,
      selection: BuildTextUtils.selection.makeSelection(startIndex, startIndex + 1)
    });
    if (insertCustomRangeMutation) {
      const addFormulaResourceMutation = {
        id: AddDocUniFormulaMutation.id,
        params: { unitId, rangeId, f }
      };
      return sequenceExecute([insertCustomRangeMutation, addFormulaResourceMutation], commandService).result;
    }
    return false;
  }
};
var UpdateDocUniFormulaCommand = {
  type: 0 /* COMMAND */,
  id: "doc.command.update-uni-formula",
  handler: (accessor, params) => {
    const commandService = accessor.get(ICommandService);
    return commandService.syncExecuteCommand(UpdateDocUniFormulaMutation.id, params);
  }
};
var RemoveDocUniFormulaCommand = {
  type: 0 /* COMMAND */,
  id: "doc.command.remove-uni-formula",
  handler: (accessor, params) => {
    const commandService = accessor.get(ICommandService);
    return commandService.syncExecuteCommand(RemoveDocUniFormulaMutation.id, params);
  }
};

// ../packages-experimental/uni-formula-ui/src/services/slide-ui-formula-cache.service.ts
var SlideUIFormulaCacheService = class extends Disposable {
  constructor(_editorBridgeService, _uniFormulaService) {
    super();
    this._editorBridgeService = _editorBridgeService;
    this._uniFormulaService = _uniFormulaService;
    __publicField(this, "_caches", /* @__PURE__ */ new Map());
    this._editorBridgeService.endEditing$.subscribe((richText) => this._checkApplyCache(richText));
  }
  writeCache(rangeId, params) {
    var _a;
    if (this._caches.size && ((_a = this._caches.values().next().value) == null ? void 0 : _a.unitId) !== params.unitId) {
      this.clearCache();
    }
    this._caches.set(rangeId, params);
  }
  _checkApplyCache(richText) {
    var _a;
    const document2 = richText.documentData;
    const customRanges = (_a = document2.body) == null ? void 0 : _a.customRanges;
    if (!customRanges || customRanges.length === 0) {
      this.clearCache();
      return;
    }
    ;
    customRanges.forEach((range) => {
      if (range.rangeType === 7 /* UNI_FORMULA */) {
        const cache = this._caches.get(range.rangeId);
        if (cache) {
          this._applyCache(range.rangeId, cache);
        } else {
          throw new Error("[SlideUIFormulaCacheService]: cache not found!");
        }
      }
    });
    this.clearCache();
  }
  _applyCache(rangeId, cache) {
    const { unitId, pageId, elementId, f } = cache;
    this._uniFormulaService.registerSlideFormula(unitId, pageId, elementId, rangeId, f);
  }
  clearCache() {
    this._caches.clear();
  }
};
SlideUIFormulaCacheService = __decorateClass([
  __decorateParam(0, ISlideEditorBridgeService),
  __decorateParam(1, IUniFormulaService)
], SlideUIFormulaCacheService);

// ../packages-experimental/uni-formula-ui/src/commands/commands/slide.command.ts
var AddSlideUniFormulaCommand = {
  type: 0 /* COMMAND */,
  id: "slide.command.add-slide-uni-formula",
  async handler(accessor, params) {
    const { startIndex } = params;
    const commandService = accessor.get(ICommandService);
    const slideUiFormulaCacheService = accessor.get(SlideUIFormulaCacheService);
    const localeService = accessor.get(LocaleService);
    const placeholder = localeService.t("uni-formula.command.stream-placeholder");
    const rangeId = generateRandomId();
    const dataStream = makeCustomRangeStream(placeholder);
    const body = {
      dataStream,
      customRanges: [{
        startIndex: 0,
        endIndex: dataStream.length - 1,
        rangeId,
        rangeType: 7 /* UNI_FORMULA */,
        wholeEntity: true
      }]
    };
    const insertCustomRangeMutation = replaceSelectionFactory(accessor, {
      unitId: SLIDE_EDITOR_ID,
      body,
      selection: BuildTextUtils.selection.makeSelection(startIndex, startIndex + 1)
    });
    if (insertCustomRangeMutation) {
      slideUiFormulaCacheService.writeCache(rangeId, params);
      return commandService.executeCommand(insertCustomRangeMutation.id, insertCustomRangeMutation.params, { onlyLocal: true });
    }
    return false;
  }
};

// ../packages-experimental/uni-formula-ui/src/services/formula-popup.service.ts
var DOC_FORMULA_POPUP_KEY = "DOC_FORMULA_POPUP";
var UniFormulaPopupService = class extends Disposable {
  constructor(_docCanvasPopupManagerService, _uniFormulaService, _contextService, _logService, _commandService, _shortcutService) {
    super();
    this._docCanvasPopupManagerService = _docCanvasPopupManagerService;
    this._uniFormulaService = _uniFormulaService;
    this._contextService = _contextService;
    this._logService = _logService;
    this._commandService = _commandService;
    this._shortcutService = _shortcutService;
    __publicField(this, "_popupInfo$", new BehaviorSubject(null));
    __publicField(this, "popupInfo$", this._popupInfo$.asObservable());
    __publicField(this, "_popupLocked", false);
    __publicField(this, "_popupHovered$", new Subject());
    __publicField(this, "popupHovered$", this._popupHovered$.asObservable());
    __publicField(this, "_cachedFormulaString", "");
    const UniFormulaConfirmShortcut = {
      id: ConfirmFormulaPopupCommand.id,
      binding: 13 /* ENTER */,
      description: "shortcut.doc.confirm-formula-popup",
      preconditions: (contextService) => !contextService.getContextValue(FORMULA_PROMPT_ACTIVATED) && this.canConfirmPopup(),
      priority: 1e4
    };
    this.disposeWithMe(this._shortcutService.registerShortcut(UniFormulaConfirmShortcut));
  }
  get popupInfo() {
    return this._popupInfo$.getValue();
  }
  get popupLocked() {
    return this._popupLocked;
  }
  dispose() {
    super.dispose();
    this._popupInfo$.next(null);
    this._popupInfo$.complete();
    this._popupHovered$.complete();
  }
  cacheFormulaString(f) {
    this._cachedFormulaString = f;
  }
  hoverPopup(hovered) {
    this._popupHovered$.next(hovered);
  }
  showDocPopup(unitId, startIndex, type, position) {
    var _a, _b;
    this.closePopup();
    const f = position && position.rangeId && type === "existing" ? (_b = (_a = this._uniFormulaService.getDocFormula(unitId, position.rangeId)) == null ? void 0 : _a.f) != null ? _b : "=" : "=";
    const disposable = this._docCanvasPopupManagerService.attachPopupToRange(
      BuildTextUtils.selection.makeSelection(startIndex),
      {
        componentKey: DOC_FORMULA_POPUP_KEY,
        onClickOutside: () => this.closePopup(),
        // user may update ref range selections
        direction: "top"
      },
      unitId
    );
    this._popupInfo$.next({ unitId, disposable, type, f, startIndex, position });
    return true;
  }
  lockPopup() {
    this._popupLocked = true;
    this._contextService.setContextValue(FORMULA_EDITOR_ACTIVATED, true);
  }
  canConfirmPopup() {
    return this._cachedFormulaString !== "";
  }
  async confirmPopup() {
    const info = this.popupInfo;
    if (!info) return true;
    const f = this._cachedFormulaString;
    if (!f) {
      this._logService.warn("[FormulaPopupService]: cannot write empty formula into the field.");
      return false;
    }
    this.unlockPopup();
    this.closePopup();
    if (isSlidePosition(info.position)) {
      return this._commandService.executeCommand(AddSlideUniFormulaCommand.id, {
        unitId: info.unitId,
        f,
        startIndex: info.startIndex,
        pageId: info.position.pageId,
        elementId: info.position.elementId
      });
    }
    return this._commandService.executeCommand(AddDocUniFormulaCommand.id, {
      unitId: info.unitId,
      f,
      startIndex: info.startIndex
    });
  }
  unlockPopup() {
    this._popupLocked = false;
  }
  closePopup(force = false) {
    var _a;
    if (this._popupLocked && !force) return false;
    this._popupLocked = false;
    this._cachedFormulaString = "";
    (_a = this.popupInfo) == null ? void 0 : _a.disposable.dispose();
    this._popupInfo$.next(null);
    this._popupHovered$.next(false);
    this._contextService.setContextValue(FORMULA_EDITOR_ACTIVATED, false);
    return true;
  }
};
UniFormulaPopupService = __decorateClass([
  __decorateParam(0, Inject(DocCanvasPopManagerService)),
  __decorateParam(1, IUniFormulaService),
  __decorateParam(2, IContextService),
  __decorateParam(3, ILogService),
  __decorateParam(4, ICommandService),
  __decorateParam(5, IShortcutService)
], UniFormulaPopupService);

// ../packages-experimental/uni-formula-ui/src/commands/operations/operation.ts
function isSlidePosition(position) {
  return !!position && "pageId" in position;
}
var ShowFormulaPopupOperation = {
  id: "uni-formula.operation.show-formula-popup",
  type: 1 /* OPERATION */,
  handler(accessor, params) {
    const { type = "new", startIndex, unitId, position } = params;
    const { rangeId } = position;
    const formulaPopupService = accessor.get(UniFormulaPopupService);
    if (type === "existing" && !rangeId) return false;
    return formulaPopupService.showDocPopup(unitId, startIndex, type, position);
  }
};
var CloseFormulaPopupOperation = {
  id: "uni-formula.operation.close-formula-popup",
  type: 1 /* OPERATION */,
  handler(accessor) {
    const docFormulaPopupService = accessor.get(UniFormulaPopupService);
    return docFormulaPopupService.closePopup(true);
  }
};
var ConfirmFormulaPopupCommand = {
  id: "uni-formula.operation.confirm-formula-popup",
  type: 0 /* COMMAND */,
  handler(accessor) {
    const docFormulaPopupService = accessor.get(UniFormulaPopupService);
    return docFormulaPopupService.confirmPopup();
  }
};

// ../packages-experimental/uni-formula-ui/src/views/components/DocFormulaPopup.tsx
var import_react = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());
var UNI_FORMULA_EDITOR_ID = createInternalEditorID("UNI_FORMULA");
function makeSnapshot(f) {
  return {
    id: UNI_FORMULA_EDITOR_ID,
    body: {
      dataStream: `${f}${DEFAULT_EMPTY_DOCUMENT_VALUE}`,
      textRuns: [],
      paragraphs: [
        {
          startIndex: 0
        }
      ]
    },
    documentStyle: {
      documentFlavor: 0 /* UNSPECIFIED */,
      marginTop: 5,
      marginBottom: 5,
      marginRight: 0,
      marginLeft: 0,
      paragraphLineGapDefault: 0,
      pageSize: {
        width: Number.POSITIVE_INFINITY,
        height: Number.POSITIVE_INFINITY
      },
      renderConfig: {
        horizontalAlign: 0 /* UNSPECIFIED */,
        verticalAlign: 1 /* TOP */,
        centerAngle: 0,
        vertexAngle: 0,
        wrapStrategy: 1 /* OVERFLOW */,
        isRenderStyle: 0 /* FALSE */
      }
    }
  };
}
function UniFormulaPopup() {
  const docFormulaPopupService = useDependency(UniFormulaPopupService);
  const popupInfo = useObservable(docFormulaPopupService.popupInfo$);
  if (!popupInfo) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocFormula, { popupInfo });
}
UniFormulaPopup.componentKey = DOC_FORMULA_POPUP_KEY;
function DocFormula(props) {
  const { popupInfo } = props;
  const { f } = popupInfo;
  const localeService = useDependency(LocaleService);
  const formulaPopupService = useDependency(UniFormulaPopupService);
  const commandService = useDependency(ICommandService);
  const [formulaString, setFormulaString] = (0, import_react.useState)(f);
  const snapshotRef = (0, import_react.useRef)(makeSnapshot(f != null ? f : ""));
  const [focused, setFocused] = (0, import_react.useState)(false);
  const onFormulaStringChange = (0, import_react.useCallback)((formulaString2) => {
    setFormulaString(formulaString2);
    formulaPopupService.cacheFormulaString(formulaString2);
  }, [formulaPopupService]);
  const onConfirm = (0, import_react.useCallback)(() => {
    commandService.executeCommand(ConfirmFormulaPopupCommand.id);
  }, [commandService]);
  const onHovered = (0, import_react.useCallback)((hovered) => {
    formulaPopupService.hoverPopup(hovered);
  }, [formulaPopupService]);
  const onCancel = (0, import_react.useCallback)(() => {
    commandService.executeCommand(CloseFormulaPopupOperation.id);
  }, [commandService]);
  const handleEscKey = (0, import_react.useCallback)((event) => {
    if (event.key === "Escape") {
      onCancel();
    }
  }, [onCancel]);
  (0, import_react.useEffect)(() => {
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [handleEscKey]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "div",
    {
      className: clsx(`u univer-box-border univer-flex univer-h-12 univer-w-[482px] univer-items-center univer-gap-x-2 univer-overflow-hidden univer-rounded-lg univer-border-gray-200 univer-bg-white univer-p-2 univer-shadow-lg dark:!univer-bg-gray-900`, borderClassName),
      onMouseEnter: () => onHovered(true),
      onMouseLeave: () => onHovered(false),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "univer-flex", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "span",
          {
            className: "univer-flex univer-items-center univer-gap-2 univer-rounded-lg univer-p-1",
            onClick: onCancel,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloseIcon, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "span",
          {
            className: "univer-flex univer-items-center univer-gap-2 univer-rounded-lg univer-p-1",
            onClick: onConfirm,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckMarkIcon, {})
          }
        )
      ] })
    }
  );
}

// ../packages-experimental/uni-formula-ui/src/controllers/doc-formula-input.controller.ts
var FORMULA_INPUT_TRIGGER_CHAR = "=";
var DocUniFormulaInputController = class extends Disposable {
  constructor(_commandService, _instanceSrv, _editorService, _logService, _formulaPopupSrv, _renderManagerService, _textSelectionManagerService) {
    super();
    this._commandService = _commandService;
    this._instanceSrv = _instanceSrv;
    this._editorService = _editorService;
    this._logService = _logService;
    this._formulaPopupSrv = _formulaPopupSrv;
    this._renderManagerService = _renderManagerService;
    this._textSelectionManagerService = _textSelectionManagerService;
    __publicField(this, "_hovered", false);
    __publicField(this, "_closePopupTimer", null);
    this._initKeyboardListeners();
    this._initCommands();
    this._initHoverListener();
  }
  _initCommands() {
    [
      AddDocUniFormulaCommand,
      RemoveDocUniFormulaCommand,
      UpdateDocUniFormulaCommand
    ].forEach((command) => this._commandService.registerCommand(command));
  }
  _initKeyboardListeners() {
    this.disposeWithMe(this._commandService.onCommandExecuted((commandInfo) => {
      const currentEditor = this._editorService.getFocusEditor();
      const focusedUnit = this._instanceSrv.getFocusedUnit();
      const { id } = commandInfo;
      if ((currentEditor == null ? void 0 : currentEditor.getEditorId()) === UNI_FORMULA_EDITOR_ID || (focusedUnit == null ? void 0 : focusedUnit.type) !== O.UNIVER_DOC) {
        return;
      }
      if (id === InsertCommand.id) {
        const params = commandInfo.params;
        const activeRange = this._textSelectionManagerService.getActiveTextRange();
        if (params.body.dataStream === FORMULA_INPUT_TRIGGER_CHAR && activeRange) {
          this._showPopup({
            startIndex: activeRange.startOffset - 1,
            unitId: focusedUnit.getUnitId(),
            position: {}
          });
        } else if (this._formulaPopupSrv.popupInfo) {
          this._closePopup();
        }
      }
      if (id === MoveCursorOperation.id || id === DeleteLeftCommand.id) {
        this._closePopup();
      }
    }));
  }
  _initHoverListener() {
    const rangesWithDoc$ = this._instanceSrv.focused$.pipe(
      map((focused) => focused ? this._instanceSrv.getUnit(focused, O.UNIVER_DOC) : null),
      map((doc) => {
        var _a;
        return doc && { doc, docEventManagerService: (_a = this._renderManagerService.getRenderById(doc.getUnitId())) == null ? void 0 : _a.with(DocEventManagerService) };
      }),
      filter((info) => !!info),
      switchMap((info) => info.docEventManagerService.hoverCustomRanges$.pipe(map((ranges) => ({ doc: info.doc, ranges }))))
    );
    this.disposeWithMe(rangesWithDoc$.subscribe(({ doc, ranges: customRanges }) => {
      var _a, _b;
      if (!doc || ((_a = this._formulaPopupSrv.popupInfo) == null ? void 0 : _a.type) === "new" || this._formulaPopupSrv.popupLocked) {
        return;
      }
      const formulaCustomRange = (_b = customRanges.find((range) => range.range.rangeType === 7 /* UNI_FORMULA */)) == null ? void 0 : _b.range;
      if (formulaCustomRange) {
        const { startIndex, rangeId } = formulaCustomRange;
        this._logService.debug("[DocUniFormulaController]: activeCustomRanges", customRanges);
        this._showPopup({
          startIndex,
          unitId: doc.getUnitId(),
          position: { rangeId },
          type: "existing"
        });
      } else {
        if (!this._hovered) {
          this._closePopup(500);
        }
      }
    }));
    this.disposeWithMe(rangesWithDoc$.subscribe(({ doc, ranges: customRanges }) => {
      var _a, _b;
      if (!doc || ((_a = this._formulaPopupSrv.popupInfo) == null ? void 0 : _a.type) === "new" || this._formulaPopupSrv.popupLocked) {
        return;
      }
      const formulaCustomRange = (_b = customRanges.find((range) => range.range.rangeType === 7 /* UNI_FORMULA */)) == null ? void 0 : _b.range;
      if (formulaCustomRange) {
        const { startIndex, rangeId } = formulaCustomRange;
        this._logService.debug("[DocUniFormulaController]: activeCustomRanges", customRanges);
        this._showPopup({
          startIndex,
          unitId: doc.getUnitId(),
          position: { rangeId },
          type: "existing"
        });
      } else {
        if (!this._hovered) {
          this._closePopup(500);
        }
      }
    }));
    this.disposeWithMe(this._formulaPopupSrv.popupHovered$.subscribe((hovered) => {
      if (hovered) {
        this._removeTimer();
      }
      this._hovered = hovered;
    }));
  }
  _removeTimer() {
    if (this._closePopupTimer !== null) {
      window.clearTimeout(this._closePopupTimer);
      this._closePopupTimer = null;
    }
  }
  _showPopup(params) {
    this._removeTimer();
    this._commandService.executeCommand(ShowFormulaPopupOperation.id, params);
  }
  _closePopup(timeout = 0) {
    if (!this._formulaPopupSrv.popupInfo) {
      return;
    }
    if (timeout === 0) {
      this._commandService.executeCommand(CloseFormulaPopupOperation.id);
    } else {
      this._closePopupTimer = window.setTimeout(() => this._closePopup(0), timeout);
    }
  }
};
DocUniFormulaInputController = __decorateClass([
  __decorateParam(0, ICommandService),
  __decorateParam(1, IUniverInstanceService),
  __decorateParam(2, IEditorService),
  __decorateParam(3, ILogService),
  __decorateParam(4, Inject(UniFormulaPopupService)),
  __decorateParam(5, IRenderManagerService),
  __decorateParam(6, Inject(DocSelectionManagerService))
], DocUniFormulaInputController);

// ../packages-experimental/uni-formula-ui/src/controllers/slide-formula-input.controller.ts
var FORMULA_INPUT_TRIGGER_CHAR2 = "=";
var SlideUniFormulaInputController = class extends Disposable {
  constructor(_injector, _instanceSrv, _commandSrv, _editorSrv, _textSelectionManagerService, _formulaPopupSrv) {
    super();
    this._injector = _injector;
    this._instanceSrv = _instanceSrv;
    this._commandSrv = _commandSrv;
    this._editorSrv = _editorSrv;
    this._textSelectionManagerService = _textSelectionManagerService;
    this._formulaPopupSrv = _formulaPopupSrv;
    __publicField(this, "_closePopupTimer", null);
    this._initCommands();
    this._initKeyboardListeners();
  }
  _initCommands() {
    [
      AddSlideUniFormulaCommand
    ].forEach((cmd) => this._commandSrv.registerCommand(cmd));
  }
  _initKeyboardListeners() {
    this.disposeWithMe(this._commandSrv.onCommandExecuted((commandInfo) => {
      const currentEditor = this._editorSrv.getFocusEditor();
      const focusedUnit = this._instanceSrv.getFocusedUnit();
      const { id } = commandInfo;
      if ((currentEditor == null ? void 0 : currentEditor.getEditorId()) === UNI_FORMULA_EDITOR_ID || (focusedUnit == null ? void 0 : focusedUnit.type) !== O.UNIVER_SLIDE) {
        return;
      }
      if (id === InsertCommand.id) {
        const params = commandInfo.params;
        const activeRange = this._textSelectionManagerService.getActiveTextRange();
        if (params.body.dataStream === FORMULA_INPUT_TRIGGER_CHAR2 && activeRange) {
          const editorBridgeService = this._injector.get(ISlideEditorBridgeService);
          const editorRect = editorBridgeService.getEditorRect();
          const { pageId, richTextObj } = editorRect;
          const { oKey } = richTextObj;
          this._showPopup({
            startIndex: activeRange.startOffset - 1,
            unitId: focusedUnit.getUnitId(),
            position: {
              pageId,
              elementId: oKey
            }
          });
        } else if (this._formulaPopupSrv.popupInfo) {
          this._closePopup();
        }
      }
    }));
  }
  _removeTimer() {
    if (this._closePopupTimer !== null) {
      window.clearTimeout(this._closePopupTimer);
      this._closePopupTimer = null;
    }
  }
  _showPopup(params) {
    this._removeTimer();
    this._commandSrv.executeCommand(ShowFormulaPopupOperation.id, params);
  }
  _closePopup(timeout = 0) {
    if (!this._formulaPopupSrv.popupInfo) {
      return;
    }
    if (timeout === 0) {
      this._commandSrv.executeCommand(CloseFormulaPopupOperation.id);
    } else {
      this._closePopupTimer = window.setTimeout(() => this._closePopup(0), timeout);
    }
  }
};
SlideUniFormulaInputController = __decorateClass([
  __decorateParam(0, Inject(Injector)),
  __decorateParam(1, IUniverInstanceService),
  __decorateParam(2, ICommandService),
  __decorateParam(3, IEditorService),
  __decorateParam(4, Inject(DocSelectionManagerService)),
  __decorateParam(5, Inject(UniFormulaPopupService))
], SlideUniFormulaInputController);

// ../packages-experimental/uni-formula-ui/src/controllers/uni-formula-ui.controller.ts
var UniFormulaUniController = class extends Disposable {
  constructor(_commandSrv, _componentManager) {
    super();
    this._commandSrv = _commandSrv;
    this._componentManager = _componentManager;
    [
      ShowFormulaPopupOperation,
      CloseFormulaPopupOperation,
      ConfirmFormulaPopupCommand
    ].forEach((command) => this._commandSrv.registerCommand(command));
    this.disposeWithMe(this._componentManager.register(UniFormulaPopup.componentKey, UniFormulaPopup));
  }
};
UniFormulaUniController = __decorateClass([
  __decorateParam(0, ICommandService),
  __decorateParam(1, Inject(ComponentManager))
], UniFormulaUniController);

// ../packages-experimental/uni-formula-ui/src/services/uni-formula.service.ts
var PSEUDO_SUBUNIT = "PSEUDO_SUBUNIT";
var UpdateSlideUniFormulaCacheCommand = {
  type: 0 /* COMMAND */,
  id: "uni-formula.mutation.update-slide-uni-formula-cache",
  handler(accessor, params) {
    const { unitId, positions, cache } = params;
    const uniFormulaService = accessor.get(IUniFormulaService);
    const instanceService = accessor.get(IUniverInstanceService);
    const slideCanvasView = accessor.get(CanvasView);
    const slide = instanceService.getUnit(unitId, O.UNIVER_SLIDE);
    if (!slide) return true;
    return positions.every((position, index) => {
      var _a, _b;
      const scene = slideCanvasView.getRenderUnitByPageId(position.pageId, unitId).scene;
      if (!scene) return false;
      const element = scene.getObject(position.elementId);
      if (!element || !(element instanceof RichText)) return false;
      const documentModel = element.documentModel;
      const originBody = documentModel.getBody();
      const range = (_a = originBody.customRanges) == null ? void 0 : _a.find((r) => r.rangeId === position.rangeId);
      if (!range) return false;
      const dataStream = makeCustomRangeStream(`${(_b = cache[index].v) != null ? _b : ""}`);
      const body = {
        dataStream,
        customRanges: [{
          startIndex: 0,
          endIndex: dataStream.length - 1,
          rangeId: position.rangeId,
          rangeType: 7 /* UNI_FORMULA */,
          wholeEntity: true
        }]
      };
      const redoMutation = replaceSelectionFactory(accessor, {
        unitId,
        body,
        selection: BuildTextUtils.selection.makeSelection(range.startIndex, range.endIndex),
        doc: documentModel
      });
      if (!redoMutation) return false;
      element.documentModel.apply(redoMutation.params.actions);
      element.refreshDocumentByDocData();
      uniFormulaService.updateSlideFormulaResults(unitId, position.pageId, position.elementId, position.rangeId, cache[index]);
      return true;
    });
  }
};
var UpdateDocUniFormulaCacheCommand = {
  type: 0 /* COMMAND */,
  id: "uni-formula.mutation.update-doc-uni-formula-cache",
  handler(accessor, params) {
    const { unitId, positions, cache } = params;
    const uniFormulaService = accessor.get(IUniFormulaService);
    const instanceService = accessor.get(IUniverInstanceService);
    const commandService = accessor.get(ICommandService);
    const doc = instanceService.getUnit(unitId, O.UNIVER_DOC);
    if (!doc) return true;
    const body = doc.getBody();
    function getRange(rangeId) {
      var _a;
      return (_a = body == null ? void 0 : body.customRanges) == null ? void 0 : _a.find((r) => r.rangeId === rangeId);
    }
    const ids = positions.map((position) => position.rangeId);
    const saveCacheResult = uniFormulaService.updateDocFormulaResults(unitId, ids, cache);
    if (!saveCacheResult) return false;
    return ids.every((id, index) => {
      var _a;
      const range = getRange(id);
      if (!range) return true;
      const dataStream = makeCustomRangeStream(`${(_a = cache[index].v) != null ? _a : ""}`);
      const body2 = {
        dataStream,
        customRanges: [{
          startIndex: 0,
          endIndex: dataStream.length - 1,
          rangeId: id,
          rangeType: 7 /* UNI_FORMULA */,
          wholeEntity: true
        }]
      };
      const redoMutation = replaceSelectionFactory(accessor, {
        unitId,
        body: body2,
        selection: BuildTextUtils.selection.makeSelection(range.startIndex, range.endIndex)
      });
      if (redoMutation) {
        return commandService.syncExecuteCommand(redoMutation.id, redoMutation.params);
      }
      return false;
    });
  }
};
var UniFormulaService = class extends DumbUniFormulaService {
  constructor(_injector, resourceManagerService, commandSrv, instanceSrv) {
    super(resourceManagerService, commandSrv, instanceSrv);
    this._injector = _injector;
    __publicField(this, "_formulaIdToKey", /* @__PURE__ */ new Map());
    __publicField(this, "_canPerformFormulaCalculation", false);
    __publicField(this, "_dataSyncDisposables", /* @__PURE__ */ new Map());
    __publicField(this, "_resultSubscription");
    [
      UpdateSlideUniFormulaCacheCommand,
      UpdateDocUniFormulaCacheCommand
    ].forEach((command) => commandSrv.registerCommand(command));
    if (instanceSrv.getAllUnitsForType(O.UNIVER_SHEET).length) {
      this._canPerformFormulaCalculation = true;
    } else {
      this.disposeWithMe(this._instanceSrv.getTypeOfUnitAdded$(O.UNIVER_SHEET).pipe(take(1)).subscribe(() => {
        this._canPerformFormulaCalculation = true;
        this._initFormulaRegistration();
      }));
    }
  }
  get _registerOtherFormulaSrv() {
    return this._injector.get(RegisterOtherFormulaService);
  }
  get _dataSyncPrimaryController() {
    return this._injector.get(DataSyncPrimaryController, Quantity.OPTIONAL);
  }
  /**
   * Register a doc formula into the formula system.
   */
  registerDocFormula(unitId, rangeId, f, v, t) {
    const key = getDocFormulaKey(unitId, rangeId);
    if (this._docFormulas.has(key)) {
      throw new Error(`[UniFormulaService]: cannot register formula ${key} when it is already registered!`);
    }
    if (this._canPerformFormulaCalculation) {
      const pseudoId = getPseudoUnitKey(unitId);
      this._checkSyncingUnit(pseudoId);
      const id = this._registerOtherFormulaSrv.registerFormulaWithRange(pseudoId, PSEUDO_SUBUNIT, f);
      this._docFormulas.set(key, { unitId, rangeId, f, formulaId: id, v, t });
      this._formulaIdToKey.set(id, key);
      this._checkResultSubscription();
    } else {
      this._docFormulas.set(key, { unitId, rangeId, f, formulaId: "", v, t });
    }
    return toDisposable(() => this.unregisterDocFormula(unitId, rangeId));
  }
  registerSlideFormula(unitId, pageId, elementId, rangeId, f, v, t) {
    const key = getSlideFormulaKey(unitId, pageId, elementId, rangeId);
    if (this._slideFormulas.has(key)) {
      throw new Error(`[UniFormulaService]: cannot register formula ${key} when it is already registered!`);
    }
    if (this._canPerformFormulaCalculation) {
      const pseudoId = getPseudoUnitKey(unitId);
      this._checkSyncingUnit(pseudoId);
      const id = this._registerOtherFormulaSrv.registerFormulaWithRange(pseudoId, PSEUDO_SUBUNIT, f);
      this._slideFormulas.set(key, { unitId, pageId, elementId, rangeId, f, formulaId: id, v, t });
      this._formulaIdToKey.set(id, key);
      this._checkResultSubscription();
    } else {
      this._slideFormulas.set(key, { unitId, pageId, elementId, rangeId, f, formulaId: "", v, t });
    }
    return toDisposable(() => this.unregisterSlideFormula(unitId, pageId, elementId, rangeId));
  }
  unregisterDocFormula(unitId, rangeId) {
    var _a;
    const key = getDocFormulaKey(unitId, rangeId);
    const item = this._docFormulas.get(key);
    if (!item) return;
    const pseudoId = getPseudoUnitKey(unitId);
    this._checkDisposingResultSubscription();
    (_a = this._dataSyncDisposables.get(pseudoId)) == null ? void 0 : _a.dec();
    if (this._canPerformFormulaCalculation) {
      this._registerOtherFormulaSrv.deleteFormula(pseudoId, PSEUDO_SUBUNIT, [item.formulaId]);
      this._formulaIdToKey.delete(item.formulaId);
    }
    this._docFormulas.delete(key);
  }
  unregisterSlideFormula(unitId, pageId, elementId, formulaId) {
    var _a;
    const key = getSlideFormulaKey(unitId, pageId, elementId, formulaId);
    const item = this._slideFormulas.get(key);
    if (!item) return;
    const pseudoId = getPseudoUnitKey(unitId);
    this._checkDisposingResultSubscription();
    (_a = this._dataSyncDisposables.get(pseudoId)) == null ? void 0 : _a.dec();
    if (this._canPerformFormulaCalculation) {
      this._registerOtherFormulaSrv.deleteFormula(pseudoId, PSEUDO_SUBUNIT, [item.formulaId]);
      this._formulaIdToKey.delete(item.formulaId);
    }
    this._slideFormulas.delete(key);
  }
  _initFormulaRegistration() {
    this._docFormulas.forEach((value, key) => {
      if (!value.formulaId) {
        const { unitId, f } = value;
        const pseudoId = getPseudoUnitKey(unitId);
        this._checkSyncingUnit(pseudoId);
        const id = this._registerOtherFormulaSrv.registerFormulaWithRange(pseudoId, PSEUDO_SUBUNIT, f);
        value.formulaId = id;
        this._formulaIdToKey.set(id, key);
      }
    });
  }
  _checkSyncingUnit(unitId) {
    if (!this._dataSyncPrimaryController) return;
    if (!this._dataSyncDisposables.has(unitId)) {
      this._dataSyncPrimaryController.syncUnit(unitId);
      this._dataSyncDisposables.set(unitId, new RCDisposable(toDisposable(() => this._dataSyncDisposables.delete(unitId))));
    }
    this._dataSyncDisposables.get(unitId).inc();
  }
  _checkResultSubscription() {
    if (this._resultSubscription || !this._registerOtherFormulaSrv) return;
    this._resultSubscription = toDisposable(this._registerOtherFormulaSrv.formulaResult$.subscribe((resultMap) => {
      for (const resultOfUnit in resultMap) {
        const results = resultMap[resultOfUnit][PSEUDO_SUBUNIT];
        if (results) {
          const mutationParam = results.map((result) => {
            var _a, _b;
            const formulaId = result.formulaId;
            const key = this._formulaIdToKey.get(formulaId);
            if (!key) return null;
            const docItem = this._docFormulas.get(key);
            if (docItem) {
              const r = (_a = result.result) == null ? void 0 : _a[0][0][0][0];
              if (docItem.v === (r == null ? void 0 : r.v) && docItem.t === (r == null ? void 0 : r.t)) return null;
              return { position: { rangeId: docItem.rangeId }, unitId: docItem.unitId, cache: r };
            }
            ;
            const slideItem = this._slideFormulas.get(key);
            if (slideItem) {
              const r = (_b = result.result) == null ? void 0 : _b[0][0][0][0];
              if (slideItem.v === (r == null ? void 0 : r.v) && slideItem.t === (r == null ? void 0 : r.t)) return null;
              return {
                unitId: slideItem.unitId,
                position: {
                  elementId: slideItem.elementId,
                  rangeId: slideItem.rangeId,
                  pageId: slideItem.pageId
                },
                cache: r
              };
            }
            return null;
          }).reduce((previous, curr) => {
            if (!curr || !curr.cache) return previous;
            if (!previous.unitId) previous.unitId = curr.unitId;
            previous.positions.push(curr.position);
            previous.cache.push(curr.cache);
            return previous;
          }, {
            unitId: "",
            positions: [],
            cache: []
          });
          if (mutationParam.positions.length === 0) return;
          if (isSlidePosition(mutationParam.positions[0])) {
            this._commandSrv.executeCommand(UpdateSlideUniFormulaCacheCommand.id, mutationParam);
          } else {
            this._commandSrv.executeCommand(UpdateDocUniFormulaCacheCommand.id, mutationParam);
          }
        }
      }
    }));
  }
  _checkDisposingResultSubscription() {
    if (this._docFormulas.size === 0) this._disposeResultSubscription();
  }
  _disposeResultSubscription() {
    if (this._resultSubscription) {
      this._resultSubscription.dispose();
      this._resultSubscription = null;
    }
  }
};
UniFormulaService = __decorateClass([
  __decorateParam(0, Inject(Injector)),
  __decorateParam(1, IResourceManagerService),
  __decorateParam(2, ICommandService),
  __decorateParam(3, IUniverInstanceService)
], UniFormulaService);
function getPseudoUnitKey(unitId) {
  return `pseudo-${unitId}`;
}
function getDocFormulaKey(unitId, formulaId) {
  return `pseudo-${unitId}-${formulaId}`;
}
function getSlideFormulaKey(unitId, pageId, elementId, rangeId) {
  return `pseudo-${unitId}-${pageId}-${elementId}-${rangeId}`;
}

// ../packages-experimental/uni-formula-ui/src/plugin.ts
var UniverDocUniFormulaUIPlugin = class extends Plugin {
  constructor(_config, _injector) {
    super();
    this._injector = _injector;
  }
  onStarting() {
    [
      [UniFormulaUniController],
      [DocUniFormulaInputController],
      [SlideUniFormulaInputController],
      [SlideUIFormulaCacheService],
      [UniFormulaPopupService],
      [IUniFormulaService, { useClass: UniFormulaService }]
    ].forEach((d) => this._injector.add(d));
  }
  onReady() {
    touchDependencies(this._injector, [
      [IUniFormulaService]
    ]);
  }
  onSteady() {
    touchDependencies(this._injector, [
      [UniFormulaUniController],
      [DocUniFormulaInputController],
      [SlideUniFormulaInputController]
    ]);
  }
};
__publicField(UniverDocUniFormulaUIPlugin, "pluginName", DOC_FORMULA_UI_PLUGIN_NAME);
__publicField(UniverDocUniFormulaUIPlugin, "type", O.UNIVER_UNKNOWN);
UniverDocUniFormulaUIPlugin = __decorateClass([
  DependentOn(UniverDocUniFormulaPlugin),
  __decorateParam(1, Inject(Injector))
], UniverDocUniFormulaUIPlugin);

// src/uni/lazy.ts
function getLazyPlugins() {
  return [
    // [
    //     UniverUniscriptPlugin,
    //     {
    //         getWorkerUrl(moduleID: string, label: string) {
    //             if (label === 'typescript' || label === 'javascript') {
    //                 return './vs/language/typescript/ts.worker.js';
    //             }
    //             return './vs/editor/editor.worker.js';
    //         },
    //     },
    // ],
    [UniverSheetsFilterUIPlugin],
    [UniverDocUniFormulaUIPlugin]
  ];
}
export {
  getLazyPlugins as default
};
//# sourceMappingURL=lazy.js.map
