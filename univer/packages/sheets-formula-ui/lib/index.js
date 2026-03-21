var Zr = Object.defineProperty;
var zr = (e, t, n) => t in e ? Zr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var j = (e, t, n) => zr(e, typeof t != "symbol" ? t + "" : t, n);
import { CommandType as Oe, ICommandService as pe, createIdentifier as Xr, IContextService as un, IUniverInstanceService as ee, Rectangle as rr, DOCS_NORMAL_EDITOR_UNIT_ID_KEY as dn, DOCS_FORMULA_BAR_EDITOR_UNIT_ID_KEY as or, DEFAULT_EMPTY_DOCUMENT_VALUE as sr, isRealNum as Qr, CellValueType as kn, getCellValueType as Jr, Inject as q, Disposable as je, ObjectMatrix as Fe, Range as eo, Tools as hn, LocaleService as ut, isICellData as to, isFormulaString as Ae, isFormulaId as at, generateRandomId as Kt, Direction as de, Injector as Rt, UniverInstanceType as H, ThemeService as It, ILogService as no, toDisposable as ir, ColorKit as fn, RxDisposable as ro, InterceptorEffectEnum as oo, FOCUSING_DOC as so, FOCUSING_UNIVER_EDITOR as io, DisposableCollection as Be, RANGE_TYPE as Re, getBodySlice as An, EDITOR_ACTIVATED as Fn, createInternalEditorID as co, BuildTextUtils as ao, IConfigService as cr, RichTextBuilder as lo, DependentOn as uo, Plugin as ho, merge as fo, registerDependencies as go, touchDependencies as mo } from "@univerjs/core";
import { SheetPasteCommand as po, PREDEFINED_HOOK_NAME as it, IEditorBridgeService as gn, SetCellEditVisibleOperation as ar, HoverManagerService as So, CellAlertManagerService as vo, CellAlertType as Co, IAutoFillService as _o, APPLY_TYPE as Ro, DATA_TYPE as Dn, ISheetClipboardService as Io, COPY_TYPE as lr, SheetSkeletonManagerService as Et, attachSelectionWithCoord as on, SelectionControl as ur, SELECTION_SHAPE_DEPTH as Eo, useActiveWorkbook as bo, getCurrentRangeDisable$ as Ke, PASTE_SPECIAL_MENU_ID as yo, whenFormulaEditorActivated as bt, whenSheetEditorFocused as To, SheetsUIPart as No, BaseSelectionRenderService as Oo, getCoordByOffset as $n, checkInHeaderRanges as Ln, getAllSelection as xo, genNormalSelectionStyle as dr, getSheetObject as Mo, MoveSelectionCommand as Pn, JumpOver as Un, ExpandSelectionCommand as Vn, EMBEDDING_FORMULA_EDITOR as wo, IMarkSelectionService as ko, RANGE_SELECTOR_COMPONENT_KEY as Ao, EMBEDDING_FORMULA_EDITOR_COMPONENT_KEY as Fo } from "@univerjs/sheets-ui";
import { sequenceNodeType as X, serializeRange as Ie, FormulaDataModel as yt, LexerTreeBuilder as Ee, ErrorType as ue, extractFormulaError as hr, SetFormulaCalculationResultMutation as Do, SetArrayFormulaDataMutation as $o, SetFormulaCalculationStopMutation as Lo, FunctionType as fr, matchToken as qe, deserializeRangeWithSheetWithCache as Po, matchRefDrawToken as Uo, isFormulaLexerToken as Vo, deserializeRangeWithSheet as dt, serializeRangeToRefString as Wo, serializeRangeWithSheet as Ct, serializeRangeWithSpreadsheet as Ho, generateStringWithSequence as Bo, operatorToken as gr, UniverFormulaEnginePlugin as qo } from "@univerjs/engine-formula";
import { Subject as mt, debounceTime as mn, combineLatestWith as jo, map as mr, switchMap as Ko, of as Wn, Observable as Yo, BehaviorSubject as pr, throttleTime as Go, filter as Sr, distinctUntilChanged as Zo, merge as zo } from "rxjs";
import { IEditorService as Ye, DocSelectionRenderService as vr, ReplaceTextRunsCommand as Hn, MoveSelectionOperation as Xo, MoveCursorOperation as Qo, useKeyboardEvent as Jo, useResize as es, DocBackScrollRenderController as ts, RichTextEditor as ns } from "@univerjs/docs-ui";
import { DeviceInputEventType as xe, IRenderManagerService as be, ScrollTimerType as Jt, SHEET_VIEWPORT_KEY as Bn, Vector2 as qn } from "@univerjs/engine-render";
import { SheetsSelectionsService as pn, getSheetCommandTarget as Cr, getCellAtRowCol as rs, SetSelectionsOperation as Sn, SheetInterceptorService as vn, ReorderRangeCommand as os, SetRangeValuesMutation as Dt, SetRangeValuesUndoMutationFactory as ss, BEFORE_CELL_EDIT as is, SetWorksheetRowAutoHeightMutation as cs, INTERCEPTOR_POINT as as, WorksheetSetCellValuePermission as Ge, WorksheetEditPermission as Ze, RangeProtectionPermissionEditPoint as ze, WorkbookEditablePermission as Xe, IRefSelectionsService as Yt, SelectionMoveType as en, convertSelectionDataToRange as ls, setEndForRange as us, REF_SELECTIONS_ENABLED as jn, SetWorksheetActiveOperation as Kn } from "@univerjs/sheets";
import { InsertFunctionCommand as ds, TriggerCalculationController as hs, IDescriptionService as Gt, QuickSumCommand as fs, ImageFormulaCellInterceptorController as gs, UniverSheetsFormulaPlugin as ms } from "@univerjs/sheets-formula";
import { ISidebarService as Cn, IZenZoneService as ps, useDependency as N, useObservable as Ce, ProgressBar as Ss, MenuItemType as Qe, getMenuHiddenObservable as ht, IClipboardInterfaceService as Yn, RibbonFormulasGroup as Gn, KeyCode as D, MetaKeys as U, IMenuManagerService as vs, IShortcutService as Zt, IUIPartsService as _r, ComponentManager as Rr, connectInjector as Ir, useEvent as J, RectPopup as sn, IContextMenuService as Cs, useUpdateEffect as _s, BuiltInUIPart as Rs } from "@univerjs/ui";
import { jsx as M, jsxs as B, Fragment as Is } from "react/jsx-runtime";
import { useCallback as $t, useState as W, useRef as z, createElement as Je, forwardRef as $e, useEffect as P, useMemo as ie, useLayoutEffect as Lt, useImperativeHandle as Es } from "react";
import { clsx as re, scrollbarClassName as lt, borderLeftClassName as bs, Select as ys, Input as Er, borderClassName as _n, Button as ct, borderTopClassName as Ts, Tooltip as Ns, Dialog as Os } from "@univerjs/design";
import { DocSelectionManagerService as br } from "@univerjs/docs";
import { debounceTime as xs } from "rxjs/operators";
const Rn = {
  id: "sheet.command.paste-formula",
  type: Oe.COMMAND,
  handler: async (e) => e.get(pe).executeCommand(po.id, {
    value: it.SPECIAL_PASTE_FORMULA
  })
}, ft = {
  id: "formula-ui.operation.select-editor-formula",
  type: Oe.OPERATION,
  handler: (e, t) => !0
};
var Ms = Object.getOwnPropertyDescriptor, ws = (e, t, n, o) => {
  for (var r = o > 1 ? void 0 : o ? Ms(t, n) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (r = i(r) || r);
  return r;
}, ks = (e, t) => (n, o) => t(n, o, e);
const As = "FORMULA_PROMPT_ACTIVATED", zt = Xr("formula-ui.prompt-service");
let cn = class {
  constructor(e) {
    j(this, "_search$", new mt());
    j(this, "_help$", new mt());
    j(this, "_navigate$", new mt());
    j(this, "_accept$", new mt());
    j(this, "_acceptFormulaName$", new mt());
    j(this, "search$", this._search$.asObservable());
    j(this, "help$", this._help$.asObservable());
    j(this, "navigate$", this._navigate$.asObservable());
    j(this, "accept$", this._accept$.asObservable());
    j(this, "acceptFormulaName$", this._acceptFormulaName$.asObservable());
    j(this, "_searching", !1);
    j(this, "_helping", !1);
    j(this, "_sequenceNodes", []);
    j(this, "_isLockedOnSelectionChangeRefString", !1);
    j(this, "_isLockedOnSelectionInsertRefString", !1);
    this._contextService = e;
  }
  dispose() {
    this._search$.complete(), this._help$.complete(), this._navigate$.complete(), this._accept$.complete(), this._acceptFormulaName$.complete(), this._sequenceNodes = [];
  }
  search(e) {
    this._contextService.setContextValue(As, e.visible), this._searching = e.visible, this._search$.next(e);
  }
  isSearching() {
    return this._searching;
  }
  help(e) {
    this._helping = e.visible, this._help$.next(e);
  }
  isHelping() {
    return this._helping;
  }
  navigate(e) {
    this._navigate$.next(e);
  }
  accept(e) {
    this._accept$.next(e);
  }
  acceptFormulaName(e) {
    this._acceptFormulaName$.next(e);
  }
  getSequenceNodes() {
    return [...this._sequenceNodes];
  }
  setSequenceNodes(e) {
    this._sequenceNodes = e;
  }
  clearSequenceNodes() {
    this._sequenceNodes = [];
  }
  getCurrentSequenceNode(e) {
    return this._sequenceNodes[this.getCurrentSequenceNodeIndex(e)];
  }
  getCurrentSequenceNodeByIndex(e) {
    return this._sequenceNodes[e];
  }
  /**
   * Query the text coordinates in the sequenceNodes and determine the actual insertion index.
   * @param strIndex
   */
  getCurrentSequenceNodeIndex(e) {
    let t = 0;
    const n = this._sequenceNodes[0];
    for (let o = 0, r = this._sequenceNodes.length; o < r; o++) {
      const s = this._sequenceNodes[o];
      if (typeof s == "string")
        t++;
      else {
        const { endIndex: i } = s;
        t = i;
      }
      if (e <= t)
        return typeof n == "string" && e !== 0 ? o + 1 : o;
    }
    return this._sequenceNodes.length;
  }
  /**
   * Synchronize the reference text based on the changes of the selection.
   * @param nodeIndex
   * @param refString
   */
  updateSequenceRef(e, t) {
    const n = this._sequenceNodes[e];
    if (typeof n == "string" || n.nodeType !== X.REFERENCE)
      return;
    const o = t.length - n.token.length, r = { ...n };
    r.token = t, r.endIndex += o, this._sequenceNodes[e] = r;
    for (let s = e + 1, i = this._sequenceNodes.length; s < i; s++) {
      const c = this._sequenceNodes[s];
      if (typeof c == "string")
        continue;
      const l = { ...c };
      l.startIndex += o, l.endIndex += o, this._sequenceNodes[s] = l;
    }
  }
  /**
   * When the cursor is on the right side of a formula token,
   * you can add reference text to the formula by drawing a selection.
   * @param index
   * @param refString
   */
  insertSequenceRef(e, t) {
    const n = t.length, o = this.getCurrentSequenceNodeIndex(e);
    this._sequenceNodes.splice(o, 0, {
      token: t,
      startIndex: e,
      endIndex: e + n - 1,
      nodeType: X.REFERENCE
    });
    for (let r = o + 1, s = this._sequenceNodes.length; r < s; r++) {
      const i = this._sequenceNodes[r];
      if (typeof i == "string")
        continue;
      const c = { ...i };
      c.startIndex += n, c.endIndex += n, this._sequenceNodes[r] = c;
    }
  }
  /**
   * Insert a string at the cursor position in the text corresponding to the sequenceNodes.
   * @param index
   * @param content
   */
  insertSequenceString(e, t) {
    const n = this.getCurrentSequenceNodeIndex(e), o = t.split("");
    this._sequenceNodes.splice(n, 0, ...o);
    const r = o.length;
    for (let s = n + r, i = this._sequenceNodes.length; s < i; s++) {
      const c = this._sequenceNodes[s];
      if (typeof c == "string")
        continue;
      const l = { ...c };
      l.startIndex += r, l.endIndex += r, this._sequenceNodes[s] = l;
    }
  }
  enableLockedSelectionChange() {
    this._isLockedOnSelectionChangeRefString = !0;
  }
  disableLockedSelectionChange() {
    this._isLockedOnSelectionChangeRefString = !1;
  }
  isLockedSelectionChange() {
    return this._isLockedOnSelectionChangeRefString;
  }
  enableLockedSelectionInsert() {
    this._isLockedOnSelectionInsertRefString = !0;
  }
  disableLockedSelectionInsert() {
    this._isLockedOnSelectionInsertRefString = !1;
  }
  isLockedSelectionInsert() {
    return this._isLockedOnSelectionInsertRefString;
  }
};
cn = ws([
  ks(0, un)
], cn);
const Fs = {
  id: "formula-ui.operation.help-function",
  type: Oe.OPERATION,
  handler: async (e, t) => (e.get(zt).help(t), !0)
}, ve = {
  id: "formula-ui.operation.insert-function",
  type: Oe.OPERATION,
  // eslint-disable-next-line
  handler: async (e, t) => {
    var C, _;
    const n = e.get(pn), o = e.get(Ye), r = n.getCurrentSelections();
    if (!r || !r.length)
      return !1;
    const s = Cr(e.get(ee));
    if (!s) return !1;
    const { worksheet: i, unitId: c, subUnitId: l } = s, p = i.getCellMatrix(), { value: f } = t, g = e.get(pe);
    e.get(gn);
    const d = [], u = [];
    let a = null, v = 0, S = 0, h = "";
    if (r.length === 1 && (Ls(r[0].range) || Ps(r[0].range) && zn(p, r[0].range))) {
      const { range: E, primary: m } = r[0], b = (C = m == null ? void 0 : m.actualRow) != null ? C : E.startRow, y = (_ = m == null ? void 0 : m.actualColumn) != null ? _ : E.startColumn;
      a = E, v = b, S = y;
      const A = Zn(p, b, y);
      A && (h = Ie(A));
    } else
      r.some((E) => {
        var y, A;
        const { range: m, primary: b } = E;
        if (zn(p, m)) {
          const F = (y = b == null ? void 0 : b.actualRow) != null ? y : m.startRow, O = (A = b == null ? void 0 : b.actualColumn) != null ? A : m.startColumn, x = Zn(p, F, O);
          if (!x)
            return a = m, v = F, S = O, !0;
          const k = Ie(x), I = `=${f}(${k})`;
          d.push({
            range: m,
            primary: {
              row: F,
              column: O
            },
            formula: I
          });
        } else {
          const { startRow: F, startColumn: O, endRow: x, endColumn: k } = m;
          if (F === x) {
            const I = Us(p, F, k, i.getColumnCount() - 1), w = I === k ? k - 1 : k, R = Ie({
              startRow: F,
              endRow: x,
              startColumn: O,
              endColumn: w
            }), T = `=${f}(${R})`;
            u.push({
              range: m,
              primary: {
                row: F,
                column: I
              },
              formula: T
            });
          } else {
            let I = -1;
            for (let R = O; R <= k; R++) {
              const T = Vs(p, R, x, i.getRowCount() - 1);
              I = Math.max(I, T);
            }
            const w = I === x ? x - 1 : x;
            for (let R = O; R <= k; R++) {
              const T = Ie({
                startRow: F,
                endRow: w,
                startColumn: R,
                endColumn: R
              }), $ = `=${f}(${T})`;
              u.push({
                range: m,
                primary: {
                  row: I,
                  column: R
                },
                formula: $
              });
            }
          }
        }
        return !1;
      });
    if (a) {
      const E = rs(v, S, i), m = {
        range: rr.clone(a),
        primary: {
          startRow: E.startRow,
          startColumn: E.startColumn,
          endRow: E.endRow,
          endColumn: E.endColumn,
          actualRow: v,
          actualColumn: S,
          isMerged: E.isMerged,
          isMergedMainCell: E.startRow === v && E.startColumn === S
        }
      }, b = {
        unitId: c,
        subUnitId: l,
        selections: [m]
      };
      await g.executeCommand(Sn.id, b);
      const y = o.getEditor(dn), A = o.getEditor(or);
      g.syncExecuteCommand(ar.id, {
        visible: !0,
        unitId: c,
        eventType: xe.Dblclick
      });
      const F = `=${f}(${h}`;
      y == null || y.replaceText(F), A == null || A.replaceText(F, !1);
    }
    return d.length === 0 && u.length === 0 ? !1 : g.executeCommand(ds.id, {
      list: d,
      listOfRangeHasNumber: u
    });
  }
};
function Zn(e, t, n) {
  const o = Ds(e, t, n);
  if (o !== t)
    return {
      startRow: o,
      endRow: t - 1,
      startColumn: n,
      endColumn: n
    };
  const r = $s(e, t, n);
  return r !== n ? {
    startRow: t,
    endRow: t,
    startColumn: r,
    endColumn: n - 1
  } : null;
}
function Ds(e, t, n) {
  let o = !1;
  if (t === 0) return t;
  for (let r = t - 1; r >= 0; r--) {
    const s = e.getValue(r, n);
    if (_t(s) && !o) {
      if (r === 0) return 0;
      o = !0;
    } else {
      if (o && !_t(s))
        return r + 1;
      if (o && r === 0)
        return 0;
    }
  }
  return t;
}
function $s(e, t, n) {
  let o = !1;
  if (n === 0) return n;
  for (let r = n - 1; r >= 0; r--) {
    const s = e.getValue(t, r);
    if (_t(s) && !o) {
      if (r === 0) return 0;
      o = !0;
    } else {
      if (o && !_t(s))
        return r + 1;
      if (o && r === 0)
        return 0;
    }
  }
  return n;
}
function _t(e) {
  if (e != null && e.p) {
    const t = e == null ? void 0 : e.p.body;
    if (t == null)
      return !1;
    const n = t.dataStream, r = n.substring(n.length - 2, n.length) === sr ? n.substring(0, n.length - 2) : n;
    return Qr(r);
  }
  return e && (e.t === kn.NUMBER || Jr(e) === kn.NUMBER);
}
function Ls(e) {
  return e.startRow === e.endRow && e.startColumn === e.endColumn;
}
function Ps(e) {
  return e.startRow !== e.endRow && e.startColumn !== e.endColumn;
}
function zn(e, t) {
  for (let n = t.startRow; n <= t.endRow; n++)
    for (let o = t.startColumn; o <= t.endColumn; o++)
      if (_t(e.getValue(n, o)))
        return !1;
  return !0;
}
function Us(e, t, n, o) {
  for (let r = n; r <= o; r++)
    if (!e.getValue(t, r))
      return r;
  return o;
}
function Vs(e, t, n, o) {
  for (let r = n; r <= o; r++)
    if (!e.getValue(r, t))
      return r;
  return o;
}
const yr = "SHEET_FORMULA_UI_PLUGIN", Tr = `${yr}_MORE_FUNCTIONS_COMPONENT`, In = {
  id: "formula-ui.operation.more-functions",
  type: Oe.OPERATION,
  handler: async (e) => (e.get(Cn).open({
    header: { title: "formula.insert.tooltip" },
    children: { label: Tr }
  }), !0)
}, Nr = {
  id: "formula-ui.operation.change-ref-to-absolute",
  type: Oe.OPERATION,
  handler: async (e) => !0
}, Ws = {
  id: "formula-ui.operation.search-function",
  type: Oe.OPERATION,
  handler: async (e, t) => (e.get(zt).search(t), !0)
};
var Hs = Object.getOwnPropertyDescriptor, Bs = (e, t, n, o) => {
  for (var r = o > 1 ? void 0 : o ? Hs(t, n) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (r = i(r) || r);
  return r;
}, kt = (e, t) => (n, o) => t(n, o, e);
let Pt = class extends je {
  constructor(e, t, n, o) {
    super(), this._sheetInterceptorService = e, this._univerInstanceService = t, this._formulaDataModel = n, this._lexerTreeBuilder = o, this._initialize();
  }
  _initialize() {
    this.disposeWithMe(this._sheetInterceptorService.interceptCommand({
      getMutations: (e) => e.id === os.id ? this._reorderFormula(e.params) : {
        redos: [],
        undos: []
      }
    }));
  }
  _reorderFormula(e) {
    const t = [], n = [], { unitId: o, subUnitId: r, range: s, order: i } = e, c = this._univerInstanceService.getUniverSheetInstance(o), l = c == null ? void 0 : c.getSheetBySheetId(r);
    if (!l)
      return {
        redos: t,
        undos: n
      };
    const p = l.getCellMatrix(), f = new Fe(), g = new Fe();
    let d = !1;
    return eo.foreach(s, (u, a) => {
      let v = u;
      i.hasOwnProperty(u) && (v = i[u]);
      const S = p.getValue(v, a);
      if (S != null && S.f || S != null && S.si) {
        d = !0;
        const h = this._formulaDataModel.getFormulaStringByCell(v, a, r, o), C = this._lexerTreeBuilder.moveFormulaRefOffset(
          h,
          0,
          u - v
        ), _ = hn.deepClone(S);
        _.f = C, _.si = null, f.setValue(u, a, _);
      } else
        f.setValue(u, a, S);
      g.setValue(u, a, p.getValue(u, a));
    }), d ? (t.push({
      id: Dt.id,
      params: {
        unitId: o,
        subUnitId: r,
        cellValue: f.getMatrix()
      }
    }), n.push({
      id: Dt.id,
      params: {
        unitId: o,
        subUnitId: r,
        cellValue: g.getMatrix()
      }
    }), {
      redos: t,
      undos: n
    }) : {
      redos: t,
      undos: n
    };
  }
};
Pt = Bs([
  kt(0, q(vn)),
  kt(1, q(ee)),
  kt(2, q(yt)),
  kt(3, q(Ee))
], Pt);
const Or = "sheets-formula-ui.base.config", Xn = {};
var qs = Object.getOwnPropertyDescriptor, js = (e, t, n, o) => {
  for (var r = o > 1 ? void 0 : o ? qs(t, n) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (r = i(r) || r);
  return r;
}, pt = (e, t) => (n, o) => t(n, o, e);
const tn = "SHEET_FORMULA_ALERT", Ks = {
  [ue.DIV_BY_ZERO]: "divByZero",
  [ue.NAME]: "name",
  [ue.VALUE]: "value",
  [ue.NUM]: "num",
  [ue.NA]: "na",
  [ue.CYCLE]: "cycle",
  [ue.REF]: "ref",
  [ue.SPILL]: "spill",
  [ue.CALC]: "calc",
  [ue.ERROR]: "error",
  [ue.CONNECT]: "connect",
  [ue.NULL]: "null"
};
let an = class extends je {
  constructor(e, t, n, o, r, s) {
    super(), this._context = e, this._hoverManagerService = t, this._cellAlertManagerService = n, this._localeService = o, this._formulaDataModel = r, this._zenZoneService = s, this._init();
  }
  _init() {
    this._initCellAlertPopup(), this._initZenService();
  }
  _initCellAlertPopup() {
    this.disposeWithMe(this._hoverManagerService.currentCell$.pipe(mn(100)).subscribe((e) => {
      var t, n, o, r, s;
      if (e) {
        const c = this._context.unit.getActiveSheet();
        if (!c) return this._hideAlert();
        const l = c.getCell(e.location.row, e.location.col), p = (r = (o = (n = (t = this._formulaDataModel.getArrayFormulaCellData()) == null ? void 0 : t[e.location.unitId]) == null ? void 0 : n[e.location.subUnitId]) == null ? void 0 : o[e.location.row]) == null ? void 0 : r[e.location.col];
        if (to(l)) {
          const f = hr(l, !!p);
          if (!f) {
            this._hideAlert();
            return;
          }
          const g = this._cellAlertManagerService.currentAlert.get(tn), d = (s = g == null ? void 0 : g.alert) == null ? void 0 : s.location;
          if (d && d.row === e.location.row && d.col === e.location.col && d.subUnitId === e.location.subUnitId && d.unitId === e.location.unitId) {
            this._hideAlert();
            return;
          }
          this._cellAlertManagerService.showAlert({
            type: Co.ERROR,
            title: this._localeService.t("formula.error.title"),
            message: this._localeService.t(`formula.error.${Ks[f]}`),
            location: e.location,
            width: 200,
            height: 74,
            key: tn
          });
          return;
        }
      }
      this._hideAlert();
    }));
  }
  _initZenService() {
    this.disposeWithMe(this._zenZoneService.visible$.subscribe((e) => {
      e && this._hideAlert();
    }));
  }
  _hideAlert() {
    this._cellAlertManagerService.removeAlert(tn);
  }
};
an = js([
  pt(1, q(So)),
  pt(2, q(vo)),
  pt(3, q(ut)),
  pt(4, q(yt)),
  pt(5, ps)
], an);
var Ys = Object.getOwnPropertyDescriptor, Gs = (e, t, n, o) => {
  for (var r = o > 1 ? void 0 : o ? Ys(t, n) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (r = i(r) || r);
  return r;
}, Qn = (e, t) => (n, o) => t(n, o, e);
let Ut = class extends je {
  constructor(e, t) {
    super(), this._autoFillService = e, this._lexerTreeBuilder = t, this._registerAutoFill();
  }
  _registerAutoFill() {
    const e = {
      type: Dn.FORMULA,
      priority: 1001,
      match: (t) => Ae(t == null ? void 0 : t.f) || at(t == null ? void 0 : t.si),
      isContinue: (t, n) => t.type === Dn.FORMULA,
      applyFunctions: {
        [Ro.COPY]: (t, n, o, r, s) => {
          const { data: i, index: c } = t;
          return this._fillCopyFormula(i, n, o, c, r, s);
        }
      }
    };
    this._autoFillService.registerRule(e);
  }
  _fillCopyFormula(e, t, n, o, r, s) {
    var p, f;
    const i = zs(r), c = [], l = /* @__PURE__ */ new Map();
    for (let g = 1; g <= t; g++) {
      const d = (g - 1) % e.length, u = o[d], a = hn.deepClone(e[d]);
      if (a) {
        const v = ((p = e[d]) == null ? void 0 : p.f) || "", S = ((f = e[d]) == null ? void 0 : f.si) || "", h = Ae(v);
        if (at(S))
          a.si = S, a.f = null, a.v = null, a.p = null, a.t = null, c.push(a);
        else if (h) {
          let _ = l.get(d);
          if (_)
            a.si = _, a.f = null, a.v = null, a.p = null, a.t = null;
          else {
            _ = Kt(6), l.set(d, _);
            const { offsetX: E, offsetY: m } = Zs(i, t, n, s, u), b = this._lexerTreeBuilder.moveFormulaRefOffset(
              v,
              E,
              m
            );
            a.si = _, a.f = b, a.v = null, a.p = null, a.t = null;
          }
          c.push(a);
        }
      }
    }
    return c;
  }
};
Ut = Gs([
  Qn(0, _o),
  Qn(1, q(Ee))
], Ut);
function Zs(e, t, n, o, r) {
  const { source: s, target: i } = o, { rows: c } = i, { rows: l } = s;
  let p = 0, f = 0;
  switch (n) {
    case de.UP:
      f = c[r] - l[r];
      break;
    case de.RIGHT:
      p = e;
      break;
    case de.DOWN:
      f = c[r] - l[r];
      break;
    case de.LEFT:
      p = -e * t;
      break;
  }
  return { offsetX: p, offsetY: f };
}
function zs(e) {
  let t = 0;
  for (const n in e)
    e[n].forEach((o) => {
      t += o.data.length;
    });
  return t;
}
var Xs = Object.getOwnPropertyDescriptor, Qs = (e, t, n, o) => {
  for (var r = o > 1 ? void 0 : o ? Xs(t, n) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (r = i(r) || r);
  return r;
}, St = (e, t) => (n, o) => t(n, o, e);
const Js = "default-paste-formula";
let Vt = class extends je {
  constructor(e, t, n, o, r) {
    super(), this._currentUniverSheet = e, this._lexerTreeBuilder = t, this._sheetClipboardService = n, this._injector = o, this._formulaDataModel = r, this._initialize();
  }
  _initialize() {
    this._registerClipboardHook();
  }
  _registerClipboardHook() {
    this.disposeWithMe(this._sheetClipboardService.addClipboardHook(this._pasteFormulaHook())), this.disposeWithMe(this._sheetClipboardService.addClipboardHook(this._pasteWithFormulaHook()));
  }
  _pasteFormulaHook() {
    return {
      id: it.SPECIAL_PASTE_FORMULA,
      priority: 10,
      specialPasteInfo: { label: "specialPaste.formula" },
      onPasteCells: (e, t, n, o) => this._onPasteCells(e, t, n, o, !0)
    };
  }
  _pasteWithFormulaHook() {
    return {
      id: Js,
      priority: 10,
      onPasteCells: (e, t, n, o) => this._onPasteCells(e, t, n, o, !1)
    };
  }
  _onPasteCells(e, t, n, o, r) {
    var d;
    if ([
      it.SPECIAL_PASTE_FORMAT,
      it.SPECIAL_PASTE_COL_WIDTH
    ].includes(o.pasteType))
      return {
        undos: [],
        redos: []
      };
    const i = this._currentUniverSheet.getCurrentUnitForType(H.UNIVER_SHEET), c = t.unitId || i.getUnitId(), l = t.subUnitId || ((d = i.getActiveSheet()) == null ? void 0 : d.getSheetId());
    if (!c || !l)
      return {
        undos: [],
        redos: []
      };
    const p = t.range, f = n, g = {
      copyType: o.copyType || lr.COPY,
      copyRange: e == null ? void 0 : e.range,
      pasteType: o.pasteType
    };
    return this._injector.invoke((u) => ei(
      c,
      l,
      p,
      f,
      u,
      g,
      this._lexerTreeBuilder,
      this._formulaDataModel,
      r,
      e
    ));
  }
};
Vt = Qs([
  St(0, ee),
  St(1, q(Ee)),
  St(2, Io),
  St(3, q(Rt)),
  St(4, q(yt))
], Vt);
function ei(e, t, n, o, r, s, i, c, l = !1, p) {
  const f = [], g = [], d = ti(e, t, n, o, s, i, c, p);
  if (!d.hasValue())
    return {
      undos: [],
      redos: []
    };
  const u = {
    unitId: e,
    subUnitId: t,
    cellValue: d.getData()
  };
  f.push({
    id: Dt.id,
    params: u
  });
  const a = ss(
    r,
    u
  );
  return g.push({
    id: Dt.id,
    params: a
  }), {
    undos: g,
    redos: f
  };
}
function ti(e, t, n, o, r, s, i, c) {
  return c ? r.pasteType === it.SPECIAL_PASTE_VALUE ? ri(e, t, n, o, i, c) : r.pasteType === it.SPECIAL_PASTE_FORMULA ? oi(e, t, n, o, s, i, c) : si(e, t, n, o, r.copyType, s, i, c) : ni(e, t, n, o, i);
}
function ni(e, t, n, o, r) {
  const s = new Fe(), i = r.getSheetFormulaData(e, t);
  return o.forValue((c, l, p) => {
    var u;
    const f = n.rows[c], g = n.cols[l], d = {};
    Ae(p.v) ? (d.v = null, d.f = `${p.v}`, d.si = null, d.p = null, s.setValue(f, g, d)) : (u = i == null ? void 0 : i[f]) != null && u[g] && (d.v = p.v, d.f = null, d.si = null, d.p = null, s.setValue(f, g, d));
  }), s;
}
function ri(e, t, n, o, r, s) {
  var p, f;
  const i = new Fe(), c = (f = (p = r.getArrayFormulaCellData()) == null ? void 0 : p[s.unitId]) == null ? void 0 : f[s.subUnitId], l = r.getSheetFormulaData(e, t);
  return o.forValue((g, d, u) => {
    var _, E;
    const a = s.range.rows[g % s.range.rows.length], v = s.range.cols[d % s.range.cols.length], S = n.rows[g], h = n.cols[d], C = {};
    if (Ae(u.f) || at(u.si))
      C.v = u.v, C.f = null, C.si = null, C.p = null, i.setValue(S, h, C);
    else if ((_ = c == null ? void 0 : c[a]) != null && _[v]) {
      const m = c[a][v];
      C.v = m.v, C.f = null, C.si = null, C.p = null, i.setValue(S, h, C);
    } else if ((E = l == null ? void 0 : l[S]) != null && E[h]) {
      if (C.v = u.v, C.f = null, C.si = null, C.p = null, u.p) {
        const m = xr(u);
        m && (C.v = m);
      }
      i.setValue(S, h, C);
    }
  }), i;
}
function oi(e, t, n, o, r, s, i) {
  const c = new Fe(), l = /* @__PURE__ */ new Map();
  return o.forValue((p, f, g) => {
    const d = n.rows[p], u = n.cols[f], a = {};
    if (at(g.si)) {
      if (i.unitId !== e || i.subUnitId !== t) {
        const v = s.getFormulaStringByCell(
          i.range.rows[p % i.range.rows.length],
          i.range.cols[f % i.range.cols.length],
          i.subUnitId,
          i.unitId
        ), S = n.cols[f] - i.range.cols[f % i.range.cols.length], h = n.rows[p] - i.range.rows[p % i.range.rows.length], C = r.moveFormulaRefOffset(v || "", S, h);
        a.si = null, a.f = C;
      } else
        a.si = g.si, a.f = null;
      a.v = null, a.p = null, c.setValue(d, u, a);
    } else if (Ae(g.f)) {
      const v = `${p % i.range.rows.length}_${f % i.range.cols.length}`;
      let S = l.get(v);
      if (S)
        a.si = S, a.f = null;
      else {
        S = Kt(6), l.set(v, S);
        const h = n.cols[f] - i.range.cols[f % i.range.cols.length], C = n.rows[p] - i.range.rows[p % i.range.rows.length], _ = r.moveFormulaRefOffset(g.f || "", h, C);
        a.si = S, a.f = _;
      }
      a.v = null, a.p = null, c.setValue(d, u, a);
    } else {
      if (a.v = g.v, a.f = null, a.si = null, a.p = null, g.p) {
        const v = xr(g);
        v && (a.v = v);
      }
      c.setValue(d, u, a);
    }
  }), c;
}
function si(e, t, n, o, r, s, i, c) {
  const l = new Fe(), p = /* @__PURE__ */ new Map(), f = i.getSheetFormulaData(e, t), g = [];
  return r === lr.CUT ? o.forValue((d, u, a) => {
    const v = n.rows[d], S = n.cols[u], h = {};
    if (at(a.si)) {
      if (Ae(a.f))
        g.push(a.si), h.f = a.f, h.si = a.si;
      else if (g.includes(a.si))
        h.f = null, h.si = a.si;
      else {
        const C = i.getFormulaStringByCell(
          c.range.rows[d % c.range.rows.length],
          c.range.cols[u % c.range.cols.length],
          c.subUnitId,
          c.unitId
        );
        h.f = C, h.si = null;
      }
      h.v = null, h.p = null, l.setValue(v, S, h);
    } else Ae(a.f) && (h.f = a.f, h.si = null, h.v = null, h.p = null, l.setValue(v, S, h));
  }) : o.forValue((d, u, a) => {
    var C;
    const v = n.rows[d], S = n.cols[u], h = {};
    if (at(a.si)) {
      if (c.unitId !== e || c.subUnitId !== t) {
        const _ = i.getFormulaStringByCell(
          c.range.rows[d % c.range.rows.length],
          c.range.cols[u % c.range.cols.length],
          c.subUnitId,
          c.unitId
        ), E = n.cols[u] - c.range.cols[u % c.range.cols.length], m = n.rows[d] - c.range.rows[d % c.range.rows.length], b = s.moveFormulaRefOffset(_ || "", E, m);
        h.si = null, h.f = b;
      } else
        h.si = a.si, h.f = null;
      h.v = null, h.p = null, l.setValue(v, S, h);
    } else if (Ae(a.f)) {
      const _ = `${d % c.range.rows.length}_${u % c.range.cols.length}`;
      let E = p.get(_);
      if (E)
        h.si = E, h.f = null;
      else {
        E = Kt(6), p.set(_, E);
        const m = n.cols[u] - c.range.cols[u % c.range.cols.length], b = n.rows[d] - c.range.rows[d % c.range.rows.length], y = s.moveFormulaRefOffset(a.f || "", m, b);
        h.si = E, h.f = y;
      }
      h.v = null, h.p = null, l.setValue(v, S, h);
    } else (C = f == null ? void 0 : f[v]) != null && C[S] && (h.v = a.v, h.f = null, h.si = null, h.p = a.p, l.setValue(v, S, h));
  }), g.length > 0 && new Fe(f).forValue((d, u, a) => {
    if (!(c.range.rows.includes(d) && c.range.cols.includes(u)) && !(n.rows.includes(d) && n.cols.includes(u)) && g.includes(a == null ? void 0 : a.si)) {
      const v = i.getFormulaStringByCell(
        d,
        u,
        c.subUnitId,
        c.unitId
      );
      l.setValue(d, u, {
        f: v,
        si: null,
        v: null,
        p: null
      });
    }
  }), l;
}
function xr(e) {
  if (e != null && e.p) {
    const t = e == null ? void 0 : e.p.body;
    if (t == null)
      return;
    const n = t.dataStream;
    return n.substring(n.length - 2, n.length) === sr ? n.substring(0, n.length - 2) : n;
  }
}
var ii = Object.getOwnPropertyDescriptor, ci = (e, t, n, o) => {
  for (var r = o > 1 ? void 0 : o ? ii(t, n) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (r = i(r) || r);
  return r;
}, We = (e, t) => (n, o) => t(n, o, e);
let Wt = class extends je {
  constructor(t, n, o, r, s, i, c, l) {
    super();
    j(this, "_previousShape");
    j(this, "_skeleton");
    this._context = t, this._sheetInterceptorService = n, this._formulaDataModel = o, this._themeService = r, this._renderManagerService = s, this._sheetSkeletonManagerService = i, this._commandService = c, this._logService = l, this._initSkeletonChangeListener(), this._initInterceptorEditorStart(), this._commandExecutedListener();
  }
  _initSkeletonChangeListener() {
    this.disposeWithMe(
      this._sheetSkeletonManagerService.currentSkeleton$.subscribe((t) => {
        var n, o;
        if (t == null)
          this._logService.debug("[FormulaEditorShowController]: should not receive currentSkeleton$ as null!");
        else {
          const { skeleton: r } = t, s = (o = (n = this._skeleton) == null ? void 0 : n.worksheet) == null ? void 0 : o.getSheetId();
          if (this._changeRuntime(r), s !== r.worksheet.getSheetId())
            this._removeArrayFormulaRangeShape();
          else {
            const { unitId: i, sheetId: c } = t;
            this._updateArrayFormulaRangeShape(i, c);
          }
        }
      })
    );
  }
  _changeRuntime(t) {
    this._skeleton = t;
  }
  _initInterceptorEditorStart() {
    this.disposeWithMe(
      ir(
        this._sheetInterceptorService.writeCellInterceptor.intercept(is, {
          handler: (t, n, o) => {
            var a, v, S, h;
            const { row: r, col: s, unitId: i, subUnitId: c, worksheet: l } = n, p = this._formulaDataModel.getArrayFormulaRange(), f = this._formulaDataModel.getArrayFormulaCellData();
            if (this._removeArrayFormulaRangeShape(), t == null)
              return o(t);
            let g = null;
            const d = this._formulaDataModel.getFormulaStringByCell(r, s, c, i);
            if (d !== null && (g = { f: d }), t.v != null && t.v !== "" && ((S = (v = (a = f[i]) == null ? void 0 : a[c]) == null ? void 0 : v[r]) == null ? void 0 : S[s]) == null)
              return g ? { ...t, ...g } : o(t);
            const u = (h = p == null ? void 0 : p[i]) == null ? void 0 : h[c];
            return u != null && (g = this._displayArrayFormulaRangeShape(u, r, s, i, c, l, g)), g ? { ...t, ...g } : o(t);
          }
        })
      )
    );
  }
  _commandExecutedListener() {
    this.disposeWithMe(this._commandService.onCommandExecuted((t, n) => {
      (t.id === Do.id || t.id === $o.id && n && n.remove) && this._removeArrayFormulaRangeShape();
    })), this.disposeWithMe(
      this._commandService.beforeCommandExecuted((t) => {
        cs.id === t.id && requestIdleCallback(() => {
          const n = t.params, { unitId: o, subUnitId: r, rowsAutoHeightInfo: s } = n;
          this._refreshArrayFormulaRangeShapeByRow(o, r, s);
        });
      })
    );
  }
  _displayArrayFormulaRangeShape(t, n, o, r, s, i, c) {
    return new Fe(t).forValue((l, p, f) => {
      if (f == null)
        return !0;
      const { startRow: g, startColumn: d, endRow: u, endColumn: a } = f;
      if (l === n && p === o)
        return this._createArrayFormulaRangeShape(f, r), !1;
      if (n >= g && n <= u && o >= d && o <= a) {
        const v = i.getCell(g, d);
        return (v == null ? void 0 : v.v) === ue.SPILL || (v == null ? void 0 : v.f) == null ? void 0 : (c == null && (c = {
          f: v.f,
          isInArrayFormulaRange: !0
        }), this._createArrayFormulaRangeShape(f, r), !1);
      }
    }), c;
  }
  _createArrayFormulaRangeShape(t, n) {
    const o = this._renderManagerService.getRenderById(n), r = this._sheetSkeletonManagerService.getCurrentSkeleton();
    if (!o || !r) return;
    const { scene: s } = o;
    if (!s) return;
    const i = {
      range: t,
      primary: null,
      style: {
        strokeWidth: 1,
        stroke: this._themeService.getColorFromTheme("primary.600"),
        fill: new fn(this._themeService.getColorFromTheme("white")).setAlpha(0).toString(),
        widgets: {}
      }
    }, c = on(i, r), { rowHeaderWidth: l, columnHeaderHeight: p } = r, f = new ur(s, Eo.FORMULA_EDITOR_SHOW, this._themeService, {
      highlightHeader: !1,
      rowHeaderWidth: l,
      columnHeaderHeight: p
    });
    f.updateRangeBySelectionWithCoord(c), f.setEvent(!1), this._previousShape = f;
  }
  _removeArrayFormulaRangeShape() {
    this._previousShape != null && (this._previousShape.dispose(), this._previousShape = null);
  }
  _refreshArrayFormulaRangeShape(t, n) {
    if (this._previousShape) {
      const { startRow: o, endRow: r, startColumn: s, endColumn: i } = this._previousShape.getRange(), c = { startRow: o, endRow: r, startColumn: s, endColumn: i };
      this._removeArrayFormulaRangeShape(), this._createArrayFormulaRangeShape(c, t);
    }
  }
  _checkCurrentSheet(t, n) {
    const o = this._sheetSkeletonManagerService.getCurrentSkeleton();
    if (!o) return !1;
    const r = o.worksheet;
    return r ? r.unitId === t && r.getSheetId() === n : !1;
  }
  _updateArrayFormulaRangeShape(t, n) {
    this._checkCurrentSheet(t, n) && this._previousShape && this._refreshArrayFormulaRangeShape(t);
  }
  _refreshArrayFormulaRangeShapeByRow(t, n, o) {
    if (!this._checkCurrentSheet(t, n) || !this._previousShape) return;
    const { startRow: r, endRow: s, startColumn: i, endColumn: c } = this._previousShape.getRange();
    for (let l = 0; l < o.length; l++) {
      const { row: p } = o[l];
      if (r >= p) {
        const f = {
          startRow: r,
          endRow: s,
          startColumn: i,
          endColumn: c
        };
        this._refreshArrayFormulaRangeShape(t, f);
        break;
      }
    }
  }
};
Wt = ci([
  We(1, q(vn)),
  We(2, q(yt)),
  We(3, q(It)),
  We(4, be),
  We(5, q(Et)),
  We(6, pe),
  We(7, no)
], Wt);
var ai = Object.getOwnPropertyDescriptor, li = (e, t, n, o) => {
  for (var r = o > 1 ? void 0 : o ? ai(t, n) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (r = i(r) || r);
  return r;
}, Jn = (e, t) => (n, o) => t(n, o, e);
const ui = {
  tl: {
    size: 6,
    color: "#409f11"
  }
};
let Ht = class extends ro {
  constructor(e, t) {
    super(), this._sheetInterceptorService = e, this._formulaDataModel = t, this.disposeWithMe(this._sheetInterceptorService.intercept(
      as.CELL_CONTENT,
      {
        effect: oo.Style,
        handler: (n, o, r) => {
          var c, l, p, f;
          const s = (f = (p = (l = (c = this._formulaDataModel.getArrayFormulaCellData()) == null ? void 0 : c[o.unitId]) == null ? void 0 : l[o.subUnitId]) == null ? void 0 : p[o.row]) == null ? void 0 : f[o.col];
          return !hr(n, !!s) || !n || (n === o.rawData && (n = { ...o.rawData }), n.markers = {
            ...n == null ? void 0 : n.markers,
            ...ui
          }), r(n);
        },
        priority: 10
      }
    ));
  }
};
Ht = li([
  Jn(0, q(vn)),
  Jn(1, q(yt))
], Ht);
function di() {
  const e = N(hs), t = N(pe), n = Ce(e.progress$), o = $t(() => {
    t.executeCommand(Lo.id);
  }, [t]), r = $t(() => {
    e.clearProgress();
  }, [e]);
  return /* @__PURE__ */ M(Ss, { progress: n, onTerminate: o, onClearProgress: r });
}
function hi(e, t) {
  return Object.keys(e).filter((n) => isNaN(Number(n)) && n !== "DefinedName" && n !== "Table").map((n) => ({
    label: t.t(`formula.functionType.${n.toLocaleLowerCase()}`),
    value: `${e[n]}`
  }));
}
function Mr(e) {
  if (!e.require && !e.repeat)
    return `[${e.name}]`;
  if (e.require && !e.repeat)
    return e.name;
  if (!e.require && e.repeat)
    return `[${e.name},...]`;
  if (e.require && e.repeat)
    return `${e.name},...`;
}
function wr(e) {
  const { prefix: t, value: n } = e;
  return /* @__PURE__ */ B("div", { children: [
    /* @__PURE__ */ B("span", { children: [
      t,
      "("
    ] }),
    n && n.map((o, r) => /* @__PURE__ */ B("span", { children: [
      /* @__PURE__ */ M("span", { children: Mr(o) }),
      r === n.length - 1 ? "" : ","
    ] }, r)),
    ")"
  ] });
}
function vt(e) {
  const { className: t, value: n, title: o } = e;
  return /* @__PURE__ */ B("div", { className: "univer-mb-2 univer-text-xs", children: [
    /* @__PURE__ */ M(
      "div",
      {
        className: re("univer-mb-2 univer-font-medium univer-text-gray-500 dark:!univer-text-gray-300", t),
        children: o
      }
    ),
    /* @__PURE__ */ M(
      "div",
      {
        className: "univer-break-all univer-text-gray-900 dark:!univer-text-white",
        children: n
      }
    )
  ] });
}
function fi(e) {
  const { functionInfo: t, onChange: n } = e;
  if (!t) return null;
  const [o, r] = W([]), [s, i] = W(t.functionParameter), [c, l] = W(-1);
  return /* @__PURE__ */ B("div", { children: [
    /* @__PURE__ */ M("div", { className: re("univer-h-[364px] univer-overflow-y-auto", lt), children: s.map((p, f) => /* @__PURE__ */ B("div", { children: [
      /* @__PURE__ */ M("div", { className: "univer-text-sm", children: p.name }),
      /* @__PURE__ */ M("div", { className: "univer-mb-2 univer-mt-1" })
    ] }, f)) }),
    /* @__PURE__ */ M("div", { className: re("univer-flex-1 univer-p-3", bs), children: /* @__PURE__ */ M(
      vt,
      {
        title: c === -1 ? /* @__PURE__ */ M(wr, { prefix: t.functionName, value: s }) : s[c].name,
        value: c === -1 ? t.description : s[c].detail
      }
    ) })
  ] });
}
function et({ ref: e, ...t }) {
  const { icon: n, id: o, className: r, extend: s, ...i } = t, c = `univerjs-icon univerjs-icon-${o} ${r || ""}`.trim(), l = z(`_${pi()}`);
  return kr(n, `${o}`, {
    defIds: n.defIds,
    idSuffix: l.current
  }, {
    ref: e,
    className: c,
    ...i
  }, s);
}
function kr(e, t, n, o, r) {
  return Je(e.tag, {
    key: t,
    ...gi(e, n, r),
    ...o
  }, (mi(e, n).children || []).map((s, i) => kr(s, `${t}-${e.tag}-${i}`, n, void 0, r)));
}
function gi(e, t, n) {
  const o = { ...e.attrs };
  n != null && n.colorChannel1 && o.fill === "colorChannel1" && (o.fill = n.colorChannel1), e.tag === "mask" && o.id && (o.id = o.id + t.idSuffix), Object.entries(o).forEach(([s, i]) => {
    s === "mask" && typeof i == "string" && (o[s] = i.replace(/url\(#(.*)\)/, `url(#$1${t.idSuffix})`));
  });
  const { defIds: r } = t;
  return !r || r.length === 0 || (e.tag === "use" && o["xlink:href"] && (o["xlink:href"] = o["xlink:href"] + t.idSuffix), Object.entries(o).forEach(([s, i]) => {
    typeof i == "string" && (o[s] = i.replace(/url\(#(.*)\)/, `url(#$1${t.idSuffix})`));
  })), o;
}
function mi(e, t) {
  var o;
  const { defIds: n } = t;
  return !n || n.length === 0 ? e : e.tag === "defs" && ((o = e.children) != null && o.length) ? {
    ...e,
    children: e.children.map((r) => typeof r.attrs.id == "string" && n && n.includes(r.attrs.id) ? {
      ...r,
      attrs: {
        ...r.attrs,
        id: r.attrs.id + t.idSuffix
      }
    } : r)
  } : e;
}
function pi() {
  return Math.random().toString(36).substring(2, 8);
}
et.displayName = "UniverIcon";
const Si = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M14.1544 3.75557C14.3887 3.98988 14.3887 4.36978 14.1544 4.6041L6.51409 12.2444C6.40157 12.3569 6.24896 12.4201 6.08983 12.4201C5.9307 12.4201 5.77808 12.3569 5.66556 12.2444L1.84541 8.42425C1.6111 8.18993 1.6111 7.81003 1.84541 7.57572C2.07973 7.34141 2.45963 7.34141 2.69394 7.57572L6.08983 10.9716L13.3059 3.75557C13.5402 3.52126 13.9201 3.52126 14.1544 3.75557Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, Ar = $e(function(t, n) {
  return Je(et, Object.assign({}, t, {
    id: "check-mark-icon",
    ref: n,
    icon: Si
  }));
});
Ar.displayName = "CheckMarkIcon";
const vi = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M3.71274 2.86421C3.47843 2.6299 3.09853 2.6299 2.86421 2.86421C2.6299 3.09853 2.6299 3.47843 2.86421 3.71274L7.15154 8.00007L2.86421 12.2874C2.6299 12.5217 2.6299 12.9016 2.86421 13.1359C3.09853 13.3702 3.47843 13.3702 3.71274 13.1359L8.00007 8.84859L12.2874 13.1359C12.5217 13.3702 12.9016 13.3702 13.1359 13.1359C13.3702 12.9016 13.3702 12.5217 13.1359 12.2874L8.84859 8.00007L13.1359 3.71274C13.3702 3.47843 13.3702 3.09853 13.1359 2.86421C12.9016 2.6299 12.5217 2.6299 12.2874 2.86421L8.00007 7.15154L3.71274 2.86421Z"
    }
  }]
}, Fr = $e(function(t, n) {
  return Je(et, Object.assign({}, t, {
    id: "close-icon",
    ref: n,
    icon: vi
  }));
});
Fr.displayName = "CloseIcon";
const Ci = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M5.3313 1.4667C5.3313 1.13533 5.59993 0.866699 5.9313 0.866699H10.069C10.4004 0.866699 10.669 1.13533 10.669 1.4667C10.669 1.79807 10.4004 2.0667 10.069 2.0667H5.9313C5.59993 2.0667 5.3313 1.79807 5.3313 1.4667Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M1.09985 3.64443C1.09985 3.31306 1.36848 3.04443 1.69985 3.04443H14.2999C14.6312 3.04443 14.8999 3.31306 14.8999 3.64443C14.8999 3.9758 14.6312 4.24443 14.2999 4.24443H1.69985C1.36848 4.24443 1.09985 3.9758 1.09985 3.64443Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M6.12398 8.30171C6.35829 8.0674 6.73819 8.0674 6.97251 8.30171L8.00007 9.32928L9.02764 8.30171C9.26195 8.0674 9.64185 8.0674 9.87617 8.30171C10.1105 8.53603 10.1105 8.91593 9.87617 9.15024L8.8486 10.1778L9.87617 11.2054C10.1105 11.4397 10.1105 11.8196 9.87617 12.0539C9.64185 12.2882 9.26195 12.2882 9.02764 12.0539L8.00007 11.0263L6.97251 12.0539C6.73819 12.2882 6.35829 12.2882 6.12398 12.0539C5.88966 11.8196 5.88966 11.4397 6.12398 11.2054L7.15154 10.1778L6.12398 9.15024C5.88966 8.91593 5.88966 8.53603 6.12398 8.30171Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M4.75332 5.22217C3.86966 5.22217 3.15332 5.93851 3.15332 6.82217V12.5331C3.15332 13.9691 4.31738 15.1332 5.75332 15.1332H10.2465C11.6825 15.1332 12.8465 13.9691 12.8465 12.5331V6.82217C12.8465 5.93851 12.1302 5.22217 11.2465 5.22217H4.75332ZM4.35332 6.82217C4.35332 6.60125 4.53241 6.42217 4.75332 6.42217H11.2465C11.4674 6.42217 11.6465 6.60125 11.6465 6.82217V12.5331C11.6465 13.3063 11.0197 13.9332 10.2465 13.9332H5.75332C4.98012 13.9332 4.35332 13.3063 4.35332 12.5331V6.82217Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    }
  ]
}, Dr = $e(function(t, n) {
  return Je(et, Object.assign({}, t, {
    id: "delete-icon",
    ref: n,
    icon: Ci
  }));
});
Dr.displayName = "DeleteIcon";
const _i = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M8.6 1.99991C8.60001 1.66854 8.33138 1.39991 8.00001 1.3999C7.66864 1.3999 7.40001 1.66853 7.4 1.9999L7.39996 7.3999H1.9999C1.66853 7.3999 1.3999 7.66853 1.3999 7.9999C1.3999 8.33127 1.66853 8.5999 1.9999 8.5999H7.39995L7.3999 13.9999C7.3999 14.3313 7.66853 14.5999 7.9999 14.5999C8.33127 14.5999 8.5999 14.3313 8.5999 13.9999L8.59995 8.5999H13.9999C14.3313 8.5999 14.5999 8.33127 14.5999 7.9999C14.5999 7.66853 14.3313 7.3999 13.9999 7.3999H8.59996L8.6 1.99991Z"
    }
  }]
}, $r = $e(function(t, n) {
  return Je(et, Object.assign({}, t, {
    id: "increase-icon",
    ref: n,
    icon: _i
  }));
});
$r.displayName = "IncreaseIcon";
const Ri = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M5.90913 3.57564C6.14345 3.34132 6.52335 3.34132 6.75766 3.57564L10.7577 7.57564C10.992 7.80995 10.992 8.18985 10.7577 8.42417L6.75766 12.4242C6.52335 12.6585 6.14345 12.6585 5.90913 12.4242C5.67482 12.1899 5.67482 11.81 5.90913 11.5756L9.48487 7.9999L5.90913 4.42417C5.67482 4.18985 5.67482 3.80995 5.90913 3.57564Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, Lr = $e(function(t, n) {
  return Je(et, Object.assign({}, t, {
    id: "more-icon",
    ref: n,
    icon: Ri
  }));
});
Lr.displayName = "MoreIcon";
const Ii = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M12.6185 12.4423C12.5907 12.2749 12.7773 12.15 12.9343 12.2308L15.4242 13.5126C15.6102 13.6084 15.5544 13.8745 15.3439 13.8955L14.2456 14.184L13.4521 15.1286C13.3495 15.2939 13.085 15.2463 13.0534 15.0568L12.6185 12.4423Z"
    }
  }, {
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M1 3.6C1 2.16406 2.16406 1 3.6 1H12.3C13.7359 1 14.9 2.16406 14.9 3.6V5.81156C14.9003 5.81881 14.9004 5.82609 14.9004 5.8334C14.9004 5.84071 14.9003 5.84799 14.9 5.85524V10.045C14.9003 10.0522 14.9004 10.0595 14.9004 10.0668C14.9004 10.3982 14.6318 10.6668 14.3004 10.6668H11.1668C10.8907 10.6668 10.6668 10.8907 10.6668 11.1668V14.3C10.6668 14.6314 10.3982 14.9 10.0668 14.9L10.05 14.8998L3.6 14.9C2.16406 14.9 1 13.7359 1 12.3V3.6ZM13.2 5.2334C13.4761 5.2334 13.7 5.00954 13.7 4.7334V3.6C13.7 2.8268 13.0732 2.2 12.3 2.2H11.1668C10.8907 2.2 10.6668 2.42386 10.6668 2.7V4.7334C10.6668 5.00954 10.8907 5.2334 11.1668 5.2334H13.2ZM10.6668 6.9334C10.6668 6.65726 10.8907 6.4334 11.1668 6.4334H13.2C13.4761 6.4334 13.7 6.65726 13.7 6.9334V8.9668C13.7 9.24294 13.4761 9.4668 13.2 9.4668H11.1668C10.8907 9.4668 10.6668 9.24294 10.6668 8.9668V6.9334ZM8.9668 5.2334C9.24294 5.2334 9.4668 5.00954 9.4668 4.7334V2.7C9.4668 2.42386 9.24294 2.2 8.9668 2.2H6.9334C6.65726 2.2 6.4334 2.42386 6.4334 2.7V4.7334C6.4334 5.00954 6.65726 5.2334 6.9334 5.2334L8.9668 5.2334ZM6.4334 6.9334C6.4334 6.65726 6.65726 6.4334 6.9334 6.4334L8.9668 6.4334C9.24294 6.4334 9.4668 6.65726 9.4668 6.9334V8.9668C9.4668 9.24294 9.24294 9.4668 8.9668 9.4668L6.9334 9.4668C6.65726 9.4668 6.4334 9.24294 6.4334 8.9668V6.9334ZM4.7334 5.2334C5.00954 5.2334 5.2334 5.00954 5.2334 4.7334V2.7C5.2334 2.42386 5.00954 2.2 4.7334 2.2H3.6C2.8268 2.2 2.2 2.8268 2.2 3.6V4.7334C2.2 5.00954 2.42386 5.2334 2.7 5.2334H4.7334ZM2.2 6.9334C2.2 6.65726 2.42386 6.4334 2.7 6.4334H4.7334C5.00954 6.4334 5.2334 6.65725 5.2334 6.9334V8.9668C5.2334 9.24294 5.00954 9.4668 4.7334 9.4668H2.7C2.42386 9.4668 2.2 9.24294 2.2 8.9668V6.9334ZM5.2334 11.1668C5.2334 10.8907 5.00954 10.6668 4.7334 10.6668H2.7C2.42386 10.6668 2.2 10.8907 2.2 11.1668V12.3C2.2 13.0732 2.8268 13.7 3.6 13.7H4.7334C5.00954 13.7 5.2334 13.4761 5.2334 13.2V11.1668ZM9.4668 11.1668C9.4668 10.8907 9.24294 10.6668 8.9668 10.6668H6.9334C6.65726 10.6668 6.4334 10.8907 6.4334 11.1668V13.2C6.4334 13.4761 6.65726 13.7 6.9334 13.7H8.9668C9.24294 13.7 9.4668 13.4761 9.4668 13.2V11.1668Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, Pr = $e(function(t, n) {
  return Je(et, Object.assign({}, t, {
    id: "select-range-icon",
    ref: n,
    icon: Ii
  }));
});
Pr.displayName = "SelectRangeIcon";
function Ei(e) {
  const { onChange: t } = e, n = "-1", [o, r] = W(""), [s, i] = W([]), [c, l] = W(0), [p, f] = W(n), [g, d] = W(0), [u, a] = W(null), v = N(Gt), S = N(ut), h = N(Cn), C = Ce(h.sidebarOptions$), _ = hi(fr, S);
  _.unshift({
    label: S.t("formula.moreFunctions.allFunctions"),
    value: n
  });
  const E = S.t("formula.prompt.required"), m = S.t("formula.prompt.optional");
  P(() => {
    A(n);
  }, []), P(() => {
    y(0);
  }, [s]), P(() => {
    C != null && C.visible && (r(""), i([]), l(0), f(n), d(0), a(null), A(n));
  }, [C]);
  const b = (I) => {
    if (o.trim() === "") return I;
    const w = new RegExp(`(${o.toLocaleUpperCase()})`);
    return I.split(w).filter(Boolean).map((T, $) => T.match(w) ? /* @__PURE__ */ M("span", { className: "univer-text-red-500", children: T }, $) : T);
  }, y = (I) => {
    if (s.length === 0) {
      a(null);
      return;
    }
    d(I);
    const w = v.getFunctionInfo(s[I].name);
    if (!w) {
      a(null);
      return;
    }
    a(w), t(w);
  };
  function A(I) {
    f(I);
    const w = v.getSearchListByType(+I);
    i(w);
  }
  function F(I) {
    r(I);
    const w = v.getSearchListByName(I);
    i(w);
  }
  function O(I) {
    if (I.stopPropagation(), I.key === "ArrowDown") {
      const w = c + 1;
      l(w === s.length ? 0 : w);
    } else if (I.key === "ArrowUp") {
      const w = c - 1;
      l(w === -1 ? s.length - 1 : w);
    } else I.key === "Enter" && y(c);
  }
  const x = (I) => {
    l(I);
  }, k = () => {
    l(-1);
  };
  return /* @__PURE__ */ B("div", { children: [
    /* @__PURE__ */ B("div", { className: "univer-flex univer-items-center univer-justify-between univer-gap-2", children: [
      /* @__PURE__ */ M(ys, { value: p, options: _, onChange: A }),
      /* @__PURE__ */ M(
        Er,
        {
          placeholder: S.t("formula.moreFunctions.searchFunctionPlaceholder"),
          onKeyDown: O,
          value: o,
          onChange: F,
          size: "small",
          allowClear: !0
        }
      )
    ] }),
    s.length > 0 && /* @__PURE__ */ M(
      "ul",
      {
        className: re("univer-mb-0 univer-mt-2 univer-box-border univer-max-h-72 univer-w-full univer-select-none univer-list-none univer-overflow-y-auto univer-rounded univer-p-3 univer-outline-none", _n, lt),
        onKeyDown: O,
        tabIndex: -1,
        children: s.map(({ name: I }, w) => /* @__PURE__ */ B(
          "li",
          {
            className: re("univer-relative univer-box-border univer-cursor-pointer univer-rounded univer-px-7 univer-py-1 univer-text-sm univer-text-gray-900 univer-transition-colors dark:!univer-text-white", {
              "univer-bg-gray-200 dark:!univer-bg-gray-600": c === w
            }),
            onMouseEnter: () => x(w),
            onMouseLeave: k,
            onClick: () => y(w),
            children: [
              g === w && /* @__PURE__ */ M(
                Ar,
                {
                  className: "univer-absolute univer-left-1.5 univer-top-1/2 univer-inline-flex -univer-translate-y-1/2 univer-text-base univer-text-primary-600"
                }
              ),
              /* @__PURE__ */ M("span", { className: "univer-block", children: b(I) })
            ]
          },
          w
        ))
      }
    ),
    u && /* @__PURE__ */ B("div", { className: re("univer-mx-0 univer-my-2 univer-overflow-y-auto", lt), children: [
      /* @__PURE__ */ M(vt, { title: u.functionName, value: u.description }),
      /* @__PURE__ */ M(
        vt,
        {
          title: S.t("formula.moreFunctions.syntax"),
          value: /* @__PURE__ */ M(wr, { prefix: u.functionName, value: u.functionParameter })
        }
      ),
      /* @__PURE__ */ M(
        vt,
        {
          title: S.t("formula.prompt.helpExample"),
          value: `${u.functionName}(${u.functionParameter.map((I) => I.example).join(",")})`
        }
      ),
      u.functionParameter && u.functionParameter.map((I) => /* @__PURE__ */ M(
        vt,
        {
          title: I.name,
          value: `${I.require ? E : m} ${I.detail}`
        },
        I.name
      ))
    ] })
  ] });
}
function bi() {
  const e = bo(), [t, n] = W(!0), [o, r] = W(!1), [s, i] = W(null);
  N(gn);
  const c = N(ut), l = N(Ye), p = N(ee), f = N(pe);
  function g() {
    n(!t), r(!o);
  }
  function d() {
    const u = Cr(p);
    if (!u) return;
    f.executeCommand(ar.id, {
      visible: !0,
      unitId: u.unitId,
      eventType: xe.Dblclick
    });
    const a = l.getEditor(dn), v = l.getEditor(or), S = `=${s == null ? void 0 : s.functionName}(`;
    a == null || a.replaceText(S), v == null || v.replaceText(S, !1);
  }
  return /* @__PURE__ */ B(
    "div",
    {
      "data-u-comp": "sheets-formula-functions-panel",
      className: "univer-box-border univer-flex univer-h-full univer-flex-col univer-justify-between univer-py-2",
      children: [
        t && /* @__PURE__ */ M(Ei, { onChange: i }),
        o && /* @__PURE__ */ M(fi, { functionInfo: s, onChange: () => {
        } }),
        /* @__PURE__ */ B("div", { className: "univer-flex univer-justify-end", children: [
          o && /* @__PURE__ */ M(
            ct,
            {
              variant: "primary",
              onClick: g,
              className: "univer-mb-5 univer-ml-4 univer-mr-0 univer-mt-0",
              children: c.t("formula.moreFunctions.next")
            }
          ),
          o && /* @__PURE__ */ M(ct, { onClick: g, className: "univer-mb-5 univer-ml-4 univer-mr-0 univer-mt-0", children: c.t("formula.moreFunctions.prev") }),
          t && !!e && /* @__PURE__ */ M(
            ct,
            {
              variant: "primary",
              onClick: d,
              className: "univer-mb-5 univer-ml-4 univer-mr-0 univer-mt-0",
              children: c.t("formula.moreFunctions.confirm")
            }
          )
        ] })
      ]
    }
  );
}
function yi(e) {
  return {
    id: ve.id,
    title: "SUM",
    icon: "SumIcon",
    type: Qe.BUTTON,
    params: {
      value: "SUM"
    },
    hidden$: ht(e, H.UNIVER_SHEET),
    disabled$: Ke(e, {
      workbookTypes: [Xe],
      worksheetTypes: [Ze, Ge],
      rangeTypes: [ze]
    })
  };
}
function Ti(e) {
  return {
    id: ve.id,
    title: "COUNT",
    icon: "CntIcon",
    type: Qe.BUTTON,
    params: {
      value: "COUNT"
    },
    hidden$: ht(e, H.UNIVER_SHEET),
    disabled$: Ke(e, {
      workbookTypes: [Xe],
      worksheetTypes: [Ze, Ge],
      rangeTypes: [ze]
    })
  };
}
function Ni(e) {
  return {
    id: ve.id,
    title: "AVERAGE",
    icon: "AvgIcon",
    type: Qe.BUTTON,
    params: {
      value: "AVERAGE"
    },
    hidden$: ht(e, H.UNIVER_SHEET),
    disabled$: Ke(e, {
      workbookTypes: [Xe],
      worksheetTypes: [Ze, Ge],
      rangeTypes: [ze]
    })
  };
}
function Oi(e) {
  return {
    id: ve.id,
    title: "MAX",
    icon: "MaxIcon",
    type: Qe.BUTTON,
    params: {
      value: "MAX"
    },
    hidden$: ht(e, H.UNIVER_SHEET),
    disabled$: Ke(e, {
      workbookTypes: [Xe],
      worksheetTypes: [Ze, Ge],
      rangeTypes: [ze]
    })
  };
}
function xi(e) {
  return {
    id: ve.id,
    title: "MIN",
    icon: "MinIcon",
    type: Qe.BUTTON,
    params: {
      value: "MIN"
    },
    hidden$: ht(e, H.UNIVER_SHEET),
    disabled$: Ke(e, {
      workbookTypes: [Xe],
      worksheetTypes: [Ze, Ge],
      rangeTypes: [ze]
    })
  };
}
function Mi(e) {
  return {
    id: In.id,
    title: "formula.insert.more",
    tooltip: "formula.insert.tooltip",
    type: Qe.BUTTON,
    hidden$: ht(e, H.UNIVER_SHEET),
    disabled$: Ke(e, {
      workbookTypes: [Xe],
      worksheetTypes: [Ze, Ge],
      rangeTypes: [ze]
    })
  };
}
function wi(e) {
  return e.get(ee).getCurrentTypeOfUnit$(H.UNIVER_SHEET).pipe(
    Ko((o) => o ? e.get(Yn) ? new Yo((s) => s.next(!e.get(Yn).supportClipboard)) : Wn(!0) : Wn(!0))
  );
}
function ki(e) {
  return {
    id: Rn.id,
    type: Qe.BUTTON,
    title: "formula.operation.pasteFormula",
    disabled$: wi(e).pipe(
      jo(Ke(e, {
        workbookTypes: [Xe],
        rangeTypes: [ze],
        worksheetTypes: [Ge, Ze]
      })),
      mr(([t, n]) => t || n)
    )
  };
}
const Ai = {
  [Gn.BASIC]: {
    [`${ve.id}.sum`]: {
      order: 0,
      menuItemFactory: yi
    },
    [`${ve.id}.count`]: {
      order: 1,
      menuItemFactory: Ti
    },
    [`${ve.id}.average`]: {
      order: 2,
      menuItemFactory: Ni
    },
    [`${ve.id}.max`]: {
      order: 3,
      menuItemFactory: Oi
    },
    [`${ve.id}.min`]: {
      order: 4,
      menuItemFactory: xi
    }
  },
  [Gn.OTHERS]: {
    [In.id]: {
      order: 0,
      menuItemFactory: Mi
    }
  },
  [yo]: {
    [Rn.id]: {
      order: 4,
      menuItemFactory: ki
    }
  }
}, Fi = "meta_key_ctrl_And_Shift";
function Di(e) {
  return e.getContextValue(so) && e.getContextValue(io);
}
const Xt = [
  D.ARROW_DOWN,
  D.ARROW_UP,
  D.ARROW_LEFT,
  D.ARROW_RIGHT
], $i = [...Xt, D.ENTER, D.TAB, D.ESC];
function Li() {
  const e = [];
  for (const t of $i)
    e.push({
      id: ft.id,
      binding: t,
      preconditions: (n) => bt(n),
      staticParameters: {
        eventType: xe.Keyboard,
        keycode: t
      }
    });
  return e;
}
function Pi() {
  const e = [];
  for (const t of Xt)
    e.push({
      id: ft.id,
      binding: t | U.SHIFT,
      preconditions: (n) => bt(n),
      staticParameters: {
        eventType: xe.Keyboard,
        keycode: t,
        metaKey: U.SHIFT
      }
    });
  return e;
}
function Ui() {
  const e = [];
  for (const t of Xt)
    e.push({
      id: ft.id,
      binding: t | U.CTRL_COMMAND,
      preconditions: (n) => bt(n),
      staticParameters: {
        eventType: xe.Keyboard,
        keycode: t,
        metaKey: U.CTRL_COMMAND
      }
    });
  return e;
}
function Vi() {
  const e = [];
  for (const t of Xt)
    e.push({
      id: ft.id,
      binding: t | U.SHIFT | U.CTRL_COMMAND,
      preconditions: (n) => bt(n),
      staticParameters: {
        eventType: xe.Keyboard,
        keycode: t,
        metaKey: Fi
      }
    });
  return e;
}
const Wi = {
  id: Nr.id,
  binding: D.F4,
  preconditions: (e) => bt(e)
};
function Hi() {
  const e = [];
  for (const t of [D.ENTER, D.TAB, D.ARROW_DOWN, D.ARROW_UP])
    e.push({
      id: ft.id,
      binding: t,
      preconditions: (n) => Di(n),
      staticParameters: {
        eventType: xe.Keyboard,
        keycode: t,
        isSingleEditor: !0
      }
    });
  return e;
}
const Bi = {
  id: fs.id,
  binding: U.ALT | D.EQUAL,
  preconditions: To,
  mac: U.CTRL_COMMAND | U.ALT | D.EQUAL,
  description: "shortcut.sheets-formula-ui.quick-sum",
  group: "4_sheet-edit"
};
var qi = Object.getOwnPropertyDescriptor, ji = (e, t, n, o) => {
  for (var r = o > 1 ? void 0 : o ? qi(t, n) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (r = i(r) || r);
  return r;
}, He = (e, t) => (n, o) => t(n, o, e);
let Bt = class extends je {
  constructor(e, t, n, o, r, s, i) {
    super(), this._injector = e, this._menuManagerService = t, this._commandService = n, this._shortcutService = o, this._uiPartsService = r, this._renderManagerService = s, this._componentManager = i, this._initialize();
  }
  _initialize() {
    this._registerCommands(), this._registerMenus(), this._registerShortcuts(), this._registerComponents(), this._registerRenderModules();
  }
  _registerMenus() {
    this._menuManagerService.mergeMenu(Ai);
  }
  _registerCommands() {
    [
      Rn,
      ve,
      In,
      Ws,
      Fs,
      ft,
      Nr
    ].forEach((e) => this.disposeWithMe(this._commandService.registerCommand(e)));
  }
  _registerShortcuts() {
    [
      ...Li(),
      ...Pi(),
      ...Ui(),
      ...Vi(),
      ...Hi(),
      Bi,
      Wi
    ].forEach((e) => {
      this.disposeWithMe(this._shortcutService.registerShortcut(e));
    });
  }
  _registerComponents() {
    this.disposeWithMe(this._uiPartsService.registerComponent(No.FORMULA_AUX, () => Ir(di, this._injector))), this._componentManager.register(Tr, bi);
  }
  _registerRenderModules() {
    this.disposeWithMe(this._renderManagerService.registerRenderModule(H.UNIVER_SHEET, [Wt]));
  }
};
Bt = ji([
  He(0, q(Rt)),
  He(1, vs),
  He(2, pe),
  He(3, Zt),
  He(4, _r),
  He(5, be),
  He(6, q(Rr))
], Bt);
var Ki = Object.getOwnPropertyDescriptor, Yi = (e, t, n, o) => {
  for (var r = o > 1 ? void 0 : o ? Ki(t, n) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (r = i(r) || r);
  return r;
}, nn = (e, t) => (n, o) => t(n, o, e);
let qt = class extends je {
  constructor(e, t, n) {
    super(), this._imageFormulaCellInterceptorController = e, this._renderManagerService = t, this._univerInstanceService = n, this._imageFormulaCellInterceptorController.registerRefreshRenderFunction(() => {
      const o = this._univerInstanceService.getCurrentUnitOfType(H.UNIVER_SHEET);
      if (!o) return;
      const r = this._renderManagerService.getRenderById(o.getUnitId());
      if (!r) return;
      r.with(Et).reCalculate();
      const s = r.mainComponent;
      s && s.makeDirty();
    });
  }
};
qt = Yi([
  nn(0, q(gs)),
  nn(1, be),
  nn(2, ee)
], qt);
class Ur {
  constructor() {
    j(this, "_currentSelector$", new pr(null));
    j(this, "currentSelector$", this._currentSelector$.asObservable());
  }
  showRangeSelectorDialog(t) {
    const n = t.callback, o = new Promise((r) => {
      t.callback = (s) => {
        r(s), n(s);
      };
    });
    return this._currentSelector$.next(t), o;
  }
}
var Gi = Object.getOwnPropertyDescriptor, Zi = (e, t, n, o) => {
  for (var r = o > 1 ? void 0 : o ? Gi(t, n) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (r = i(r) || r);
  return r;
}, st = (e, t) => (n, o) => t(n, o, e);
let De = class extends Oo {
  constructor(t, n, o, r, s, i, c) {
    super(
      n,
      o,
      r,
      s,
      i
    );
    j(this, "_workbookSelections");
    j(this, "_eventDisposables");
    this._context = t, this._contextService = i, this._refSelectionsService = c, this._workbookSelections = this._refSelectionsService.getWorkbookSelections(this._context.unitId), this._initSelectionChangeListener(), this._initSkeletonChangeListener(), this._initUserActionSyncListener(), this._setSelectionStyle(zi(this._themeService)), this._remainLastEnabled = !0, this._highlightHeader = !1;
  }
  getLocation() {
    return this._skeleton.getLocation();
  }
  setRemainLastEnabled(t) {
    this._remainLastEnabled = t;
  }
  /**
   * This is set to true when you need to add a new selection.
   * @param {boolean} enabled
   * @memberof RefSelectionsRenderService
   */
  setSkipLastEnabled(t) {
    this._skipLastEnabled = t;
  }
  clearLastSelection() {
    const t = this._selectionControls[this._selectionControls.length - 1];
    t && (t.dispose(), this._selectionControls.pop());
  }
  /**
   * Call this method and user will be able to select on the canvas to update selections.
   */
  enableSelectionChanging() {
    return this._disableSelectionChanging(), this._eventDisposables = this._initCanvasEventListeners(), ir(() => this._disableSelectionChanging());
  }
  _disableSelectionChanging() {
    var t;
    (t = this._eventDisposables) == null || t.dispose(), this._eventDisposables = null;
  }
  disableSelectionChanging() {
    this._disableSelectionChanging();
  }
  _initCanvasEventListeners() {
    const t = this._getSheetObject(), { spreadsheetRowHeader: n, spreadsheetColumnHeader: o, spreadsheet: r, spreadsheetLeftTopPlaceholder: s } = t, { scene: i } = this._context, c = new Be();
    return c.add(r == null ? void 0 : r.onPointerDown$.subscribeEvent((l, p) => {
      this.inRefSelectionMode() && (this._onPointerDown(l, r.zIndex + 1, Re.NORMAL, this._getActiveViewport(l)), l.button !== 2 && p.stopPropagation());
    })), c.add(
      n == null ? void 0 : n.onPointerDown$.subscribeEvent((l, p) => {
        if (!this.inRefSelectionMode()) return;
        const f = this._sheetSkeletonManagerService.getCurrent().skeleton, { row: g } = $n(l.offsetX, l.offsetY, i, f);
        Ln(this._workbookSelections.getCurrentSelections(), g, Re.ROW) || (this._onPointerDown(l, (r.zIndex || 1) + 1, Re.ROW, this._getActiveViewport(l), Jt.Y), l.button !== 2 && p.stopPropagation());
      })
    ), c.add(o == null ? void 0 : o.onPointerDown$.subscribeEvent((l, p) => {
      if (!this.inRefSelectionMode()) return;
      const f = this._sheetSkeletonManagerService.getCurrent().skeleton, { column: g } = $n(l.offsetX, l.offsetY, i, f);
      Ln(this._workbookSelections.getCurrentSelections(), g, Re.COLUMN) || (this._onPointerDown(l, (r.zIndex || 1) + 1, Re.COLUMN, this._getActiveViewport(l), Jt.X), l.button !== 2 && p.stopPropagation());
    })), c.add(s == null ? void 0 : s.onPointerDown$.subscribeEvent((l, p) => {
      if (this._reset(), !this.inRefSelectionMode()) return;
      const f = this._sheetSkeletonManagerService.getCurrent().skeleton, g = xo(f);
      this._addSelectionControlByModelData(g), this._selectionMoveStart$.next(this.getSelectionDataWithStyle());
      const d = i.onPointerUp$.subscribeEvent(() => {
        d.unsubscribe(), this._selectionMoveEnd$.next(this.getSelectionDataWithStyle());
      });
      l.button !== 2 && p.stopPropagation();
    })), c;
  }
  /**
   * Add a selection in spreadsheet, create a new SelectionControl and then update this control by range derives from selection.
   * For ref selection, create selectionShapeExtension to handle user action.
   * @param {ISelectionWithCoord} selectionWithStyle
   */
  _addSelectionControlByModelData(t) {
    var i;
    const n = this._skeleton, o = (i = t.style) != null ? i : dr(this._themeService), r = this._scene;
    return t.style = o, this.newSelectionControl(r, n, t);
  }
  _initSelectionChangeListener() {
    this.disposeWithMe(this._refSelectionsService.selectionSet$.subscribe((t) => {
      this._reset(), this._skeleton && this.resetSelectionsByModelData(t || []);
    }));
  }
  /**
   * Update selectionModel in this._workbookSelections by user action in spreadsheet area.
   */
  _initUserActionSyncListener() {
    this.disposeWithMe(this.selectionMoveStart$.subscribe((t) => {
      this._updateSelections(t, en.MOVE_START);
    })), this.disposeWithMe(this.selectionMoving$.subscribe((t) => {
      this._updateSelections(t, en.MOVING);
    })), this.disposeWithMe(this.selectionMoveEnd$.subscribe((t) => {
      this._updateSelections(t, en.MOVE_END);
    }));
  }
  _updateSelections(t, n) {
    const r = this._context.unit.getActiveSheet().getSheetId();
    t.length !== 0 && this._workbookSelections.setSelections(
      r,
      t.map((s) => ls(s)),
      n
    );
  }
  _initSkeletonChangeListener() {
    this.disposeWithMe(this._sheetSkeletonManagerService.currentSkeleton$.subscribe((t) => {
      var i;
      if (!t)
        return;
      const { skeleton: n } = t, { scene: o } = this._context, r = o.getViewport(Bn.VIEW_MAIN);
      this._skeleton && ((i = this._skeleton.worksheet) == null ? void 0 : i.getSheetId()) !== n.worksheet.getSheetId() && this._reset(), this._changeRuntime(n, o, r);
      const s = this._workbookSelections.getCurrentSelections();
      this.resetSelectionsByModelData(s);
    }));
  }
  _getActiveViewport(t) {
    const n = this._getSheetObject();
    return n == null ? void 0 : n.scene.getActiveViewportByCoord(qn.FromArray([t.offsetX, t.offsetY]));
  }
  _getSheetObject() {
    return Mo(this._context.unit, this._context);
  }
  /**
   * Handle pointer down event, bind pointermove & pointerup handler.
   * then trigger selectionMoveStart$.
   *
   * @param evt
   * @param _zIndex
   * @param rangeType
   * @param viewport
   * @param scrollTimerType
   */
  // eslint-disable-next-line complexity, max-lines-per-function
  _onPointerDown(t, n = 0, o = Re.NORMAL, r, s = Jt.ALL) {
    var O;
    this._rangeType = o;
    const i = this._skeleton, c = this._scene;
    if (!c || !i)
      return;
    r && (this._activeViewport = r);
    const { offsetX: l, offsetY: p } = t, f = c.getViewport(Bn.VIEW_MAIN);
    if (!f) return;
    const g = c.getCoordRelativeToViewport(qn.FromArray([l, p])), { x: d, y: u } = g;
    this._startViewportPosX = d, this._startViewportPosY = u;
    const a = c.getScrollXYInfoByViewport(g), { scaleX: v, scaleY: S } = c.getAncestorScale(), h = this._skeleton.getCellByOffset(d, u, v, S, a);
    if (!h) return;
    switch (o) {
      case Re.NORMAL:
        break;
      case Re.ROW:
        h.startColumn = 0, h.endColumn = this._skeleton.getColumnCount() - 1;
        break;
      case Re.COLUMN:
        h.startRow = 0, h.endRow = this._skeleton.getRowCount() - 1;
        break;
      case Re.ALL:
        h.startRow = 0, h.startColumn = 0, h.endRow = this._skeleton.getRowCount() - 1, h.endColumn = this._skeleton.getColumnCount() - 1;
    }
    let C = { range: h, primary: h, style: null };
    (h.isMerged || h.isMergedMainCell) && (C = {
      range: {
        ...h,
        startRow: h.startRow,
        endRow: h.startRow,
        startColumn: h.startColumn,
        endColumn: h.startColumn
      },
      primary: {
        ...h,
        actualRow: h.startRow,
        actualColumn: h.startColumn,
        startRow: h.startRow,
        endRow: h.startRow,
        startColumn: h.startColumn,
        endColumn: h.startColumn
      },
      style: null
    }), C.range.rangeType = o;
    const _ = on(C, this._skeleton);
    this._startRangeWhenPointerDown = { ..._.rangeWithCoord };
    const E = { ..._.rangeWithCoord, rangeType: o };
    let m = this.getActiveSelectionControl();
    const b = this.getSelectionControls();
    for (const x of b) {
      if (t.button === 2 && rr.contains(x.model, E)) {
        m = x;
        return;
      }
      if (x.model.isEqual(E)) {
        m = x;
        break;
      }
    }
    this._checkClearPreviousControls(t);
    const y = m == null ? void 0 : m.model.currentCell, A = t.shiftKey && y, F = this._remainLastEnabled && !t.ctrlKey && !t.shiftKey && !this._skipLastEnabled && !this._singleSelectionEnabled;
    A && y ? this._makeSelectionByTwoCells(
      y,
      E,
      i,
      o,
      m
      // Get updated in this method
    ) : F && m ? m.updateRangeBySelectionWithCoord(_) : m = this.newSelectionControl(c, i, C);
    for (let x = 0; x < this.getSelectionControls().length - 1; x++)
      this.getSelectionControls()[x].clearHighlight();
    this._selectionMoveStart$.next(this.getSelectionDataWithStyle()), c.disableObjectsEvent(), this._clearUpdatingListeners(), this._addEndingListeners(), (O = c.getTransformer()) == null || O.clearSelectedObjects(), this._setupPointerMoveListener(f, m, o, s, d, u), this._escapeShortcutDisposable = this._shortcutService.forceEscape(), this._scenePointerUpSub = c.onPointerUp$.subscribeEvent(() => {
      var x;
      this._clearUpdatingListeners(), this._selectionMoveEnd$.next(this.getSelectionDataWithStyle()), (x = this._escapeShortcutDisposable) == null || x.dispose(), this._escapeShortcutDisposable = null;
    });
  }
  /**
   * Diff between normal selection, no highlightHeader for ref selections.
   * @param scene
   * @param skeleton
   * @param selectionWithCoord
   * @returns {SelectionControl} selectionControl just created
   */
  newSelectionControl(t, n, o) {
    const r = this.getSelectionControls().length, { rowHeaderWidth: s, columnHeaderHeight: i } = n, c = new ur(t, r, this._themeService, {
      highlightHeader: this._highlightHeader,
      enableAutoFill: !1,
      rowHeaderWidth: s,
      columnHeaderHeight: i
    }), l = on(o, n);
    return c.updateRangeBySelectionWithCoord(l), this._selectionControls.push(c), c.setControlExtension({
      skeleton: n,
      scene: t,
      themeService: this._themeService,
      injector: this._injector,
      selectionHooks: {
        selectionMoveEnd: () => {
          this._selectionMoveEnd$.next(this.getSelectionDataWithStyle());
        }
      }
    }), c;
  }
};
De = Zi([
  st(1, q(Rt)),
  st(2, q(It)),
  st(3, Zt),
  st(4, q(Et)),
  st(5, un),
  st(6, Yt)
], De);
function zi(e) {
  const t = dr(e);
  return t.widgets = { tl: !0, tc: !0, tr: !0, ml: !0, mr: !0, bl: !0, bc: !0, br: !0 }, t;
}
const En = (e, t, n = !0) => {
  let o = -1;
  return e.reduce((r, s, i) => {
    if (r.isFinish)
      return r;
    const c = r.currentIndex;
    if (typeof s != "string")
      r.currentIndex += s.token.length;
    else {
      const l = s.length;
      r.currentIndex += l;
    }
    return (n ? r.currentIndex === t : t > c && t <= r.currentIndex) && (o = i, r.isFinish = !0), r;
  }, { currentIndex: 0, isFinish: !1 }), o;
}, Vr = (e, t) => {
  const n = e[t];
  let o = -1;
  if (!n || typeof n == "string" || n.nodeType !== X.REFERENCE) return -1;
  for (let r = 0; r <= t; r++) {
    const s = e[r];
    typeof s != "string" && s.nodeType === X.REFERENCE && o++;
  }
  return o;
}, Xi = (e, t = 100) => {
  P(() => {
    let n = null;
    const o = () => {
      n === null && (n = window.setTimeout(() => {
        e(), n = null;
      }, t));
    };
    return window.addEventListener("scroll", o), window.addEventListener("resize", o), () => {
      n !== null && clearTimeout(n), window.removeEventListener("scroll", o), window.removeEventListener("resize", o);
    };
  }, [e, t]);
};
function Wr(e, t, n) {
  const o = N(Ye), r = ie(() => new pr({ left: -999, top: -999, right: -999, bottom: -999 }), []), s = N(Cn), i = N(ee), c = J(() => {
    var _;
    const l = o.getEditor(e);
    if (!l)
      return;
    const p = l.getBoundingClientRect(), { marginTop: f = 0, marginBottom: g = 0 } = l.getDocumentData().documentStyle, d = l.getSkeleton();
    if (!d) return;
    const u = (_ = d.getSkeletonData()) == null ? void 0 : _.pages[0].height;
    let { left: a, top: v, right: S, bottom: h } = p;
    v = v + f, h = u ? v + u : h - g;
    const C = r.getValue();
    if (!(C.left === a && C.top === v && C.right === S && C.bottom === h))
      return r.next({ left: a - 1, right: S + 1, top: v - 1, bottom: h + 1 }), p;
  });
  return P(() => {
    t && c();
  }, [e, o, i.unitAdded$, c, t, ...n != null ? n : []]), Xi(c), P(() => {
    const l = s.scrollEvent$.pipe(Go(100)).subscribe(c);
    return () => {
      l.unsubscribe();
    };
  }, []), [r, c];
}
const tt = (e) => {
  const t = z(e);
  return t.current = e, t;
}, Qi = (e, t, n) => {
  const o = N(zt), r = N(Gt), s = N(Ee), [i, c] = W(), [l, p] = W(-1), [f, g] = W(!0), d = tt(f), u = z(t);
  u.current = t;
  const a = () => {
    c(void 0), p(-1), g(!1);
  };
  return P(() => {
    const v = s.sequenceNodesBuilder(t.slice(1));
    o.setSequenceNodes(v != null ? v : []);
  }, [t]), P(() => {
    if (n && e) {
      const v = n.selectionChange$.pipe(mn(50)).subscribe((h) => {
        if (h.textRanges.length === 1) {
          const [C] = h.textRanges;
          if (C.collapsed && d.current) {
            const { startOffset: _ } = C, E = o.getCurrentSequenceNodeIndex(_ - 2), m = o.getCurrentSequenceNodeByIndex(E), b = o.getCurrentSequenceNodeByIndex(E + 1);
            if (m)
              if (typeof m != "string" && m.nodeType === 3 && !r.hasDefinedNameDescription(m.token.trim()) && b === qe.OPEN_BRACKET) {
                const y = r.getFunctionInfo(m.token);
                c(y), p(-1);
                return;
              } else {
                const y = s.getFunctionAndParameter(`${u.current}A`, _ - 1);
                if (y) {
                  const { functionName: A, paramIndex: F } = y, O = r.getFunctionInfo(A);
                  c(O), p(F);
                  return;
                }
              }
          }
        }
        c(void 0), p(-1);
      }), S = n.selectionChange$.pipe(
        Sr((h) => h.textRanges.length === 1),
        mr((h) => h.textRanges[0].startOffset),
        Zo()
      ).subscribe(() => {
        g(!0);
      });
      return () => {
        v.unsubscribe(), S.unsubscribe();
      };
    }
  }, [n, e]), P(() => {
    e || a();
  }, [e]), {
    functionInfo: i,
    paramIndex: l,
    reset: a
  };
}, Ji = ({ onClick: e }) => /* @__PURE__ */ M(
  "div",
  {
    className: "univer-z-[15] univer-box-border univer-h-[18px] univer-cursor-pointer univer-overflow-visible univer-whitespace-nowrap univer-rounded-l univer-border univer-border-r-0 univer-border-gray-600 univer-bg-primary-600 univer-p-0.5 univer-text-xs univer-font-bold univer-leading-[13px] univer-text-white",
    onClick: e,
    children: "?"
  }
), rn = ({ className: e, title: t, value: n }) => /* @__PURE__ */ B("div", { className: "univer-my-2", children: [
  /* @__PURE__ */ M(
    "div",
    {
      className: re("univer-mb-2 univer-text-sm univer-font-medium univer-text-gray-900 dark:!univer-text-white", e),
      children: t
    }
  ),
  /* @__PURE__ */ M(
    "div",
    {
      className: "univer-whitespace-pre-wrap univer-break-words univer-text-xs univer-text-gray-500",
      children: n
    }
  )
] }), ec = (e) => {
  const { prefix: t, value: n, active: o, onClick: r } = e;
  return /* @__PURE__ */ B("div", { children: [
    /* @__PURE__ */ B("span", { children: [
      t,
      "("
    ] }),
    n && n.map((s, i) => /* @__PURE__ */ B("span", { children: [
      /* @__PURE__ */ M(
        "span",
        {
          className: o === i ? "univer-text-primary-500" : "",
          onClick: () => r(i),
          children: Mr(s)
        }
      ),
      i === n.length - 1 ? "" : ","
    ] }, s.name)),
    ")"
  ] });
}, er = () => {
};
function tc(e) {
  const { onParamsSwitch: t = er, onClose: n = er, isFocus: o, editor: r, formulaText: s } = e, { functionInfo: i, paramIndex: c, reset: l } = Qi(o, s, r), p = N(gn), f = !Ce(p.helpFunctionVisible$), [g, d] = W(!0), u = N(ut), a = u.t("formula.prompt.required"), v = u.t("formula.prompt.optional"), S = r.getEditorId(), [h] = Wr(S, !!i, [i, c]);
  function C(m) {
    t && t(m);
  }
  const _ = J((m) => {
    p.helpFunctionVisible$.next(!m);
  }), E = () => {
    _(!0), n();
  };
  return i ? f ? /* @__PURE__ */ M(sn, { portal: !0, anchorRect$: h, direction: "left-center", children: /* @__PURE__ */ M(Ji, { onClick: () => _(!1) }) }, "hidden") : /* @__PURE__ */ M(sn, { portal: !0, onClickOutside: () => l(), anchorRect$: h, direction: "vertical", children: /* @__PURE__ */ B(
    "div",
    {
      className: re("univer-m-0 univer-box-border univer-w-[250px] univer-select-none univer-list-none univer-rounded-lg univer-bg-white univer-leading-5 univer-shadow-md univer-outline-none dark:!univer-bg-gray-900", _n),
      children: [
        /* @__PURE__ */ B(
          "div",
          {
            className: re("univer-wrap-anywhere univer-box-border univer-flex univer-items-center univer-justify-between univer-px-4 univer-py-3 univer-text-xs univer-font-medium univer-text-gray-900 dark:!univer-text-white", Ts),
            children: [
              /* @__PURE__ */ M(
                ec,
                {
                  prefix: i.functionName,
                  value: i.functionParameter,
                  active: c,
                  onClick: C
                }
              ),
              /* @__PURE__ */ B("div", { className: "univer-flex", children: [
                /* @__PURE__ */ M(
                  "div",
                  {
                    className: "univer-ml-2 univer-flex univer-h-6 univer-w-6 univer-cursor-pointer univer-items-center univer-justify-center univer-rounded univer-bg-transparent univer-p-0 univer-text-xs univer-text-gray-500 univer-outline-none univer-transition-colors hover:univer-bg-gray-200 dark:hover:!univer-bg-gray-600",
                    style: { transform: g ? "rotateZ(-90deg)" : "rotateZ(90deg)" },
                    onClick: () => d(!g),
                    children: /* @__PURE__ */ M(Lr, {})
                  }
                ),
                /* @__PURE__ */ M(
                  "div",
                  {
                    className: "univer-ml-2 univer-flex univer-h-6 univer-w-6 univer-cursor-pointer univer-items-center univer-justify-center univer-rounded univer-bg-transparent univer-p-0 univer-text-xs univer-text-gray-600 univer-outline-none univer-transition-colors hover:univer-bg-gray-300 dark:!univer-text-gray-200 dark:hover:!univer-bg-gray-600",
                    onClick: E,
                    children: /* @__PURE__ */ M(Fr, {})
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ M(
          "div",
          {
            className: re("univer-box-border univer-max-h-[350px] univer-overflow-y-auto univer-px-4 univer-pb-3 univer-pt-0", lt),
            style: {
              height: g ? "unset" : 0,
              padding: g ? "revert-layer" : 0
            },
            children: /* @__PURE__ */ B("div", { className: "univer-mt-3", children: [
              /* @__PURE__ */ M(
                rn,
                {
                  title: u.t("formula.prompt.helpExample"),
                  value: `${i.functionName}(${i.functionParameter.map((m) => m.example).join(",")})`
                }
              ),
              /* @__PURE__ */ M(
                rn,
                {
                  title: u.t("formula.prompt.helpAbstract"),
                  value: i.description
                }
              ),
              i && i.functionParameter && i.functionParameter.map((m, b) => /* @__PURE__ */ M(
                rn,
                {
                  className: c === b ? "univer-text-primary-500" : "",
                  title: m.name,
                  value: `${m.require ? a : v} ${m.detail}`
                },
                b
              ))
            ] })
          }
        )
      ]
    }
  ) }, "show") : null;
}
const nc = (e) => {
  const t = N(Ye);
  return J((o) => {
    var r, s;
    if (e) {
      t.focus(e.getEditorId());
      const i = [...e.getSelectionRanges()];
      if (hn.isDefine(o))
        e.setSelectionRanges([{ startOffset: o, endOffset: o }]);
      else if (!i.length && !e.docSelectionRenderService.isOnPointerEvent) {
        const c = (s = (r = e.getDocumentData().body) == null ? void 0 : r.dataStream) != null ? s : `\r
`, l = Math.max(c.length - 2, 0);
        e.setSelectionRanges([{ startOffset: l, endOffset: l }]);
      } else
        e.setSelectionRanges(i);
    }
  });
};
function rc(e) {
  var r, s;
  const n = e.get(ee).getCurrentUniverDocInstance();
  return n != null && n.getBody() ? { dataStream: (s = (r = n.getBody()) == null ? void 0 : r.dataStream) != null ? s : "", offset: 0 } : void 0;
}
var Ne = /* @__PURE__ */ ((e) => (e[e.NOT_SELECT = 0] = "NOT_SELECT", e[e.NEED_ADD = 1] = "NEED_ADD", e[e.CAN_EDIT = 2] = "CAN_EDIT", e[e.EDIT_OTHER_SHEET_REFERENCE = 3] = "EDIT_OTHER_SHEET_REFERENCE", e[e.EDIT_OTHER_WORKBOOK_REFERENCE = 4] = "EDIT_OTHER_WORKBOOK_REFERENCE", e))(Ne || {});
function oc(e) {
  var y;
  const { editorId: t, isFocus: n, disableOnClick: o, unitId: r, subUnitId: s } = e, i = N(be), c = N(ee), l = i.getRenderById(r), p = i.getRenderById(t), f = p == null ? void 0 : p.with(vr), g = N(br), d = N(Rt), [u, a] = W(
    0
    /* NOT_SELECT */
  ), v = N(Ee), S = z(!0), h = l == null ? void 0 : l.with(De), C = tt(u), _ = c.getUnit(r, H.UNIVER_SHEET), E = _ == null ? void 0 : _.getSheetBySheetId(s), m = J((A) => {
    h && h.setSkipLastEnabled(
      A === 1 || A === 3 || A === 4
      /* EDIT_OTHER_WORKBOOK_REFERENCE */
    ), C.current = A, a(A);
  }), b = J(() => {
    var ce, ae, he;
    const A = c.getCurrentUnitOfType(H.UNIVER_SHEET);
    if (!A) return;
    const F = A.getActiveSheet(), O = f == null ? void 0 : f.getActiveTextRange(), x = O != null && O.collapsed ? O.startOffset : -1, k = rc(d);
    if (!k) return;
    const I = (ce = k == null ? void 0 : k.dataStream) == null ? void 0 : ce.slice(0, -2), w = ((ae = v.sequenceNodesBuilder(I)) != null ? ae : []).map((Y) => typeof Y == "object" ? Y.nodeType === X.REFERENCE ? {
      ...Y,
      range: Po(Y.token)
    } : {
      ...Y,
      range: void 0
    } : Y), R = I[x - 1], T = I[x], $ = w.find((Y) => typeof Y == "object" && Y.nodeType === X.REFERENCE && x === Y.endIndex + 2), L = R && Uo(R) && (!T || Vo(T) && T !== qe.OPEN_BRACKET), V = !!$;
    if ((I == null ? void 0 : I.substring(0, 1)) === "=" && (L || V))
      if (V) {
        if (S.current)
          return;
        const { sheetName: Y, unitId: Q } = $.range, nt = (he = c.getCurrentUnitOfType(H.UNIVER_SHEET)) == null ? void 0 : he.getUnitId();
        Q && Q !== nt ? m(
          4
          /* EDIT_OTHER_WORKBOOK_REFERENCE */
        ) : !Y && F.getSheetId() === (E == null ? void 0 : E.getSheetId()) || Y === F.getName() ? m(
          2
          /* CAN_EDIT */
        ) : m(
          3
          /* EDIT_OTHER_SHEET_REFERENCE */
        );
      } else
        S.current = !1, m(
          1
          /* NEED_ADD */
        );
    else
      m(
        0
        /* NOT_SELECT */
      );
  });
  return P(() => {
    const A = g.textSelection$.pipe(Sr((F) => F.unitId === t)).subscribe(() => {
      b();
    });
    return () => A.unsubscribe();
  }, [b, g.textSelection$, t]), P(() => {
    n || (m(
      0
      /* NOT_SELECT */
    ), S.current = !0);
  }, [n, m]), P(() => {
    var F;
    if (!o) return;
    const A = (F = p == null ? void 0 : p.mainComponent) == null ? void 0 : F.onPointerDown$.subscribeEvent(() => {
      m(
        0
        /* NOT_SELECT */
      ), S.current = !0;
    });
    return () => A == null ? void 0 : A.unsubscribe();
  }, [o, (y = p == null ? void 0 : p.mainComponent) == null ? void 0 : y.onPointerDown$, m]), P(() => {
    if (!n) return;
    const A = _ == null ? void 0 : _.activeSheet$.subscribe(() => {
      b();
    }), F = c.getCurrentTypeOfUnit$(H.UNIVER_SHEET).subscribe(() => {
      b();
    });
    return () => {
      A == null || A.unsubscribe(), F == null || F.unsubscribe();
    };
  }, [b, n, _ == null ? void 0 : _.activeSheet$, c.getCurrentTypeOfUnit$]), { isSelecting: u, isSelectingRef: C };
}
const sc = () => {
  const e = N(Ee);
  return $t((n) => e.sequenceNodesBuilder(n) || [], [e]);
};
function ic(e, t, n) {
  const o = new fn(t).setAlpha(0.05).toRgbString();
  return {
    id: n,
    strokeWidth: 1,
    stroke: t,
    fill: o,
    widgets: { tl: !0, tc: !0, tr: !0, ml: !0, mr: !0, bl: !0, bc: !0, br: !0 },
    widgetSize: 6,
    widgetStrokeWidth: 1,
    widgetStroke: e.getColorFromTheme("white")
  };
}
function Hr(e) {
  var _, E, m;
  const {
    unitId: t,
    subUnitId: n,
    currentWorkbook: o,
    refSelections: r,
    editor: s,
    refSelectionsService: i,
    refSelectionsRenderService: c,
    sheetSkeletonManagerService: l,
    themeService: p,
    univerInstanceService: f
  } = e, g = o.getUnitId(), d = f.getUnit(t, H.UNIVER_SHEET), u = d == null ? void 0 : d.getActiveSheet(), a = [];
  if (!d || !u) {
    i.setSelections(a);
    return;
  }
  const v = u.getSheetId(), S = (b) => {
    var y;
    return (y = d == null ? void 0 : d.getSheetBySheetName(b)) == null ? void 0 : y.getSheetId();
  };
  if (!((_ = l == null ? void 0 : l.getWorksheetSkeleton(v)) == null ? void 0 : _.skeleton)) return;
  const C = [];
  for (let b = 0, y = r.length; b < y; b++) {
    const A = r[b], { themeColor: F, token: O, refIndex: x, endIndex: k } = A, I = dt(O), { unitId: w, sheetName: R, range: T } = I, $ = S(R);
    if (!$ && R || g !== t && w !== g || w && w !== g || $ && $ !== v || !$ && v !== n)
      continue;
    const L = us(T, u.getRowCount(), u.getColumnCount());
    L.unitId = t, L.sheetId = v, a.push({
      range: L,
      primary: null,
      style: ic(p, F, x.toString())
    }), C.push(k);
  }
  if (s) {
    const b = (m = (E = s.getSelectionRanges()) == null ? void 0 : E[0]) == null ? void 0 : m.startOffset, y = C.findIndex((A) => A + 2 === b);
    y !== -1 ? c == null || c.setActiveSelectionIndex(y) : c == null || c.resetActiveSelectionIndex();
  }
  return a;
}
function cc(e, t) {
  const n = N(ee), o = N(It), r = N(Yt), s = N(be), i = Ce(ie(() => n.getCurrentTypeOfUnit$(H.UNIVER_SHEET), [n])), c = i ? s.getRenderById(i.getUnitId()) : null, l = c == null ? void 0 : c.with(De), p = c == null ? void 0 : c.with(Et), f = J((g, d) => {
    const u = n.getCurrentUnitOfType(H.UNIVER_SHEET);
    if (!u || l != null && l.selectionMoving) return;
    const a = Hr({
      unitId: e,
      subUnitId: t,
      currentWorkbook: u,
      refSelections: g,
      editor: d,
      refSelectionsService: r,
      refSelectionsRenderService: l,
      sheetSkeletonManagerService: p,
      themeService: o,
      univerInstanceService: n
    });
    if (!a) return;
    ((l == null ? void 0 : l.getSelectionControls()) || []).length === a.length ? l == null || l.resetSelectionsByModelData(a) : r.setSelections(a);
  });
  return P(() => () => {
    l == null || l.resetActiveSelectionIndex();
  }, [l]), f;
}
function Br(e = "") {
  const t = N(Gt), n = ac(), o = N(pe), r = ie(() => e.length, [e]);
  return J((i, c, l = !0, p) => {
    const f = i.getDocumentData(), g = i.getEditorId();
    if (!f)
      return [];
    const d = f.body;
    if (!d)
      return [];
    const u = d.dataStream.slice(0, d.dataStream.length - 2), a = { dataStream: "", ...f.body };
    if (!u.startsWith(e)) return [];
    if (c == null || c.length === 0)
      return a.textRuns = [], o.syncExecuteCommand(Hn.id, {
        unitId: g,
        body: An(a, 0, a.dataStream.length - 2)
      }), [];
    {
      const { textRuns: v, refSelections: S } = lc(t, n, c);
      r && v.forEach((_) => {
        _.ed = _.ed + r, _.st = _.st + r;
      }), a.textRuns = [{ st: 0, ed: 1, ts: { fs: 11 } }, ...v];
      const h = c.reduce((_, E) => typeof E == "string" ? `${_}${E}` : `${_}${E.token}`, "");
      a.dataStream = `${e}${h}\r
`;
      let C;
      if (l) {
        C = i.getSelectionRanges();
        const _ = a.dataStream.length - 2 + r;
        C.forEach((E) => {
          E.startOffset = Math.max(0, Math.min(E.startOffset, _)), E.endOffset = Math.max(0, Math.min(E.endOffset, _));
        });
      }
      return o.syncExecuteCommand(Hn.id, {
        unitId: g,
        body: An(a, 0, a.dataStream.length - 2),
        textRanges: p != null ? p : C
      }), S;
    }
  });
}
function ac() {
  const e = N(It), t = e.getCurrentTheme();
  return ie(() => {
    const o = [
      e.getColorFromTheme("loop-color.1"),
      e.getColorFromTheme("loop-color.2"),
      e.getColorFromTheme("loop-color.3"),
      e.getColorFromTheme("loop-color.4"),
      e.getColorFromTheme("loop-color.5"),
      e.getColorFromTheme("loop-color.6"),
      e.getColorFromTheme("loop-color.7"),
      e.getColorFromTheme("loop-color.8"),
      e.getColorFromTheme("loop-color.9"),
      e.getColorFromTheme("loop-color.10"),
      e.getColorFromTheme("loop-color.11"),
      e.getColorFromTheme("loop-color.12")
    ].map((c) => e.isValidThemeColor(c) ? e.getColorFromTheme(c) : c), r = e.getColorFromTheme("blue.700"), s = e.getColorFromTheme("jiqing.800"), i = e.getColorFromTheme("black");
    return { formulaRefColors: o, numberColor: r, stringColor: s, plainTextColor: i };
  }, [t]);
}
function lc(e, t, n) {
  const { formulaRefColors: o, numberColor: r, stringColor: s, plainTextColor: i } = t, c = [], l = [], p = /* @__PURE__ */ new Map();
  let f = 0;
  for (let g = 0, d = n.length; g < d; g++) {
    const u = n[g];
    if (typeof u == "string") {
      const _ = c[c.length - 1], E = _ ? _.ed : 0, m = E + u.length;
      c.push({
        st: E,
        ed: m,
        ts: {
          cl: {
            rgb: i
          },
          fs: 11
        }
      });
      continue;
    }
    if (e.hasDefinedNameDescription(u.token.trim())) {
      c.push({
        st: u.startIndex,
        ed: u.endIndex + 1,
        ts: {
          cl: {
            rgb: i
          },
          fs: 11
        }
      });
      continue;
    }
    const { startIndex: a, endIndex: v, nodeType: S, token: h } = u;
    let C = "";
    if (S === X.REFERENCE) {
      if (p.has(h))
        C = p.get(h);
      else {
        const _ = f % o.length;
        C = o[_], p.set(h, C), f++;
      }
      l.push({
        refIndex: g,
        themeColor: C,
        token: h,
        startIndex: u.startIndex,
        endIndex: u.endIndex,
        index: l.length
      });
    } else S === X.NUMBER ? C = r : (S === X.STRING || S === X.ARRAY) && (C = s);
    C && C.length > 0 ? c.push({
      st: a,
      ed: v + 1,
      ts: {
        cl: {
          rgb: C
        },
        fs: 11
      }
    }) : c.push({
      st: a,
      ed: v + 1,
      ts: {
        cl: {
          rgb: i
        },
        fs: 11
      }
    });
  }
  return { textRuns: c, refSelections: l };
}
const uc = (e, t, n, o) => {
  const r = N(pe), s = N(Zt), i = z(t);
  i.current = t;
  const c = z(o);
  c.current = o, P(() => {
    if (!n || !e)
      return;
    const p = `sheet.formula-embedding-editor.${n.getEditorId()}`, f = new Be(), g = (a, v) => {
      if (c.current) {
        c.current(a, v);
        return;
      }
      let S = de.LEFT;
      a === D.ARROW_DOWN ? S = de.DOWN : a === D.ARROW_UP ? S = de.UP : a === D.ARROW_RIGHT && (S = de.RIGHT), v === U.SHIFT ? r.executeCommand(Xo.id, {
        direction: S
      }) : r.executeCommand(Qo.id, {
        direction: S
      });
    }, d = (a, v) => {
      let S = de.DOWN;
      a === D.ARROW_DOWN ? S = de.DOWN : a === D.ARROW_UP ? S = de.UP : a === D.ARROW_LEFT ? S = de.LEFT : a === D.ARROW_RIGHT && (S = de.RIGHT), i.current ? v === U.CTRL_COMMAND ? r.executeCommand(Pn.id, {
        direction: S,
        jumpOver: Un.moveGap,
        extra: "formula-editor",
        fromCurrentSelection: i.current === Ne.NEED_ADD || i.current === Ne.EDIT_OTHER_SHEET_REFERENCE
      }) : v === U.SHIFT ? r.executeCommand(Vn.id, {
        direction: S,
        extra: "formula-editor"
      }) : v === (U.CTRL_COMMAND | U.SHIFT) ? r.executeCommand(Vn.id, {
        direction: S,
        jumpOver: Un.moveGap,
        extra: "formula-editor"
      }) : r.executeCommand(Pn.id, {
        direction: S,
        extra: "formula-editor",
        fromCurrentSelection: i.current === Ne.NEED_ADD || i.current === Ne.EDIT_OTHER_SHEET_REFERENCE
      }) : g(a, v);
    };
    return f.add(r.registerCommand({
      id: p,
      type: Oe.OPERATION,
      handler(a, v) {
        const { keyCode: S, metaKey: h } = v;
        d(S, h);
      }
    })), [
      { keyCode: D.ARROW_DOWN },
      { keyCode: D.ARROW_LEFT },
      { keyCode: D.ARROW_RIGHT },
      { keyCode: D.ARROW_UP },
      { keyCode: D.ARROW_DOWN, metaKey: U.SHIFT },
      { keyCode: D.ARROW_LEFT, metaKey: U.SHIFT },
      { keyCode: D.ARROW_RIGHT, metaKey: U.SHIFT },
      { keyCode: D.ARROW_UP, metaKey: U.SHIFT },
      { keyCode: D.ARROW_DOWN, metaKey: U.CTRL_COMMAND },
      { keyCode: D.ARROW_LEFT, metaKey: U.CTRL_COMMAND },
      { keyCode: D.ARROW_RIGHT, metaKey: U.CTRL_COMMAND },
      { keyCode: D.ARROW_UP, metaKey: U.CTRL_COMMAND },
      { keyCode: D.ARROW_DOWN, metaKey: U.CTRL_COMMAND | U.SHIFT },
      { keyCode: D.ARROW_LEFT, metaKey: U.CTRL_COMMAND | U.SHIFT },
      { keyCode: D.ARROW_RIGHT, metaKey: U.CTRL_COMMAND | U.SHIFT },
      { keyCode: D.ARROW_UP, metaKey: U.CTRL_COMMAND | U.SHIFT }
    ].map(({ keyCode: a, metaKey: v }) => ({
      id: p,
      binding: v ? a | v : a,
      preconditions: () => !0,
      priority: 900,
      staticParameters: {
        eventType: xe.Keyboard,
        keyCode: a,
        metaKey: v
      }
    })).forEach((a) => {
      f.add(s.registerShortcut(a));
    }), () => {
      f.dispose();
    };
  }, [r, n, e, s]);
}, dc = (e, t, n, o, r = !0) => {
  var u;
  const s = N(be), i = N(un), c = N(Cs), l = N(Yt), p = N(ee), f = Ce(ie(() => p.getCurrentTypeOfUnit$(H.UNIVER_SHEET), [p])), g = s.getRenderById((u = f == null ? void 0 : f.getUnitId()) != null ? u : ""), d = g == null ? void 0 : g.with(De);
  Lt(() => {
    if (e)
      return i.setContextValue(Fn, !0), r && c.disable(), () => {
        const a = p.getCurrentUnitOfType(H.UNIVER_DOC);
        (a == null ? void 0 : a.getUnitId()) === o && i.setContextValue(Fn, !1), r && c.enable(), l.clear();
      };
  }, [i, e, l, r, o]), Lt(() => {
    if (e && t) {
      const a = d == null ? void 0 : d.enableSelectionChanging();
      return i.setContextValue(jn, !0), () => {
        i.setContextValue(jn, !1), a == null || a.dispose();
      };
    }
  }, [i, e, d, t]), P(() => {
    e && (d == null || d.setSkipLastEnabled(!1));
  }, [e, d]);
}, hc = (e, t, n) => {
  const o = N(ee), r = N(pn);
  return $t(() => {
    if (e) {
      const i = [...r.getWorkbookSelections(t).getSelectionsOfWorksheet(n)], c = o.getCurrentUnitForType(H.UNIVER_SHEET), l = c == null ? void 0 : c.getActiveSheet();
      (c == null ? void 0 : c.getUnitId()) !== t && o.setCurrentUnitForType(t), l && l.getSheetId() === n && r.setSelections(i);
    }
  }, [e, r, n, t, o]);
}, fc = (e) => e.reduce((t, n) => typeof n == "string" ? t + n.length : t + n.token.length, 0), ln = (e) => e.map((t) => typeof t == "string" ? t : t.token).join(""), At = (e, t = !1, n = "", o = !1) => !t && !o ? e.map((r) => Ie(r.range)) : e.map((r) => o ? Wo(r) : r.sheetName !== "" && r.sheetName !== n ? Ct(r.sheetName, r.range) : Ie(r.range)), gc = (e) => {
  var f, g, d;
  const { editor: t, lexerTreeBuilder: n } = e, o = t == null ? void 0 : t.getSelectionRanges();
  if ((o == null ? void 0 : o.length) !== 1)
    return;
  const s = o[0].startOffset - 1, i = ((g = (f = t == null ? void 0 : t.getDocumentData().body) == null ? void 0 : f.dataStream) != null ? g : `\r
`).slice(0, -2), c = (d = n.sequenceNodesBuilder(i.slice(1))) != null ? d : [], l = En(c, s, !1), p = Vr(c, l);
  return {
    nodeIndex: l,
    updatingRefIndex: p,
    sequenceNodes: c,
    offset: s
  };
}, mc = (() => {
}), pc = (e, t, n, o, r, s, i, c, l, p = mc) => {
  var x;
  const f = N(be), g = N(ee), d = N(pe), u = N(br), a = N(It), v = N(Ee), S = g.getUnit(o), h = J((k, I) => {
    var w, R, T;
    return (T = (R = (w = g.getUnit(k)) == null ? void 0 : w.getSheetBySheetId(I)) == null ? void 0 : R.getName()) != null ? T : "";
  }), C = ie(() => h(o, r), [h, r, o]), _ = Ce(S == null ? void 0 : S.activeSheet$), E = tt({ activeSheet: _, sheetName: C }), m = Ce(ie(() => g.getCurrentTypeOfUnit$(H.UNIVER_SHEET), [g])), b = f.getRenderById((x = m == null ? void 0 : m.getUnitId()) != null ? x : ""), y = b == null ? void 0 : b.with(De), A = b == null ? void 0 : b.with(Et), F = N(Yt), O = J((k, I, w) => {
    var ce, ae, he, Y, Q, nt, rt, Tt, ye, Nt;
    const R = gc({ editor: l, lexerTreeBuilder: v });
    if (!R) return;
    const { nodeIndex: T, updatingRefIndex: $, sequenceNodes: L, offset: V } = R;
    if (n.current === Ne.NEED_ADD)
      if (V !== 0) {
        if (T === -1 && L.length)
          return;
        const K = k[k.length - 1], te = L.splice(T + 1), fe = (ce = K.sheetId) != null ? ce : r, ne = {
          range: K,
          unitId: (ae = K.unitId) != null ? ae : m.getUnitId(),
          sheetName: h((he = K.unitId) != null ? he : m.getUnitId(), fe)
        }, le = fe !== r, ge = (m == null ? void 0 : m.getUnitId()) !== o, Se = At([ne], i && (le || ge), C, ge);
        L.push({ token: Se[0], nodeType: X.REFERENCE });
        const Le = [...L, ...te], Pe = ln(Le);
        p(Pe, fc(L), I);
      } else {
        const K = k[k.length - 1], te = (Y = K.sheetId) != null ? Y : r, fe = {
          range: K,
          unitId: (Q = K.unitId) != null ? Q : m.getUnitId(),
          sheetName: h((nt = K.unitId) != null ? nt : m.getUnitId(), te)
        }, ne = te !== r, le = (m == null ? void 0 : m.getUnitId()) !== o, ge = At([fe], i && (ne || le), C, le);
        L.unshift({ token: ge[0], nodeType: X.REFERENCE });
        const Se = ln(L);
        p(Se, ge[0].length, I);
      }
    else if (n.current === Ne.EDIT_OTHER_SHEET_REFERENCE || n.current === Ne.EDIT_OTHER_WORKBOOK_REFERENCE) {
      const K = k.pop();
      if (!K) return;
      const te = L[T];
      if (typeof te == "object" && te.nodeType === X.REFERENCE) {
        const fe = te.token;
        (m == null ? void 0 : m.getUnitId()) !== o ? te.token = Ho((rt = m == null ? void 0 : m.getUnitId()) != null ? rt : "", C, K) : te.token = C === (_ == null ? void 0 : _.getName()) ? Ie(K) : Ct(_.getName(), K);
        const le = V + (te.token.length - fe.length);
        p(Bo(L), le, I);
      }
    } else {
      const K = [...k];
      if (!w && $ !== -1) {
        const G = K.pop();
        G && K.splice($, 0, G);
      }
      let te = 0;
      const fe = L.map((G) => {
        var _e, Me, ot, Ue;
        if (typeof G == "string")
          return G;
        if (G.nodeType === X.REFERENCE) {
          const me = dt(G.token);
          if (me.sheetName || (me.sheetName = C), (me.unitId || o) !== (m == null ? void 0 : m.getUnitId()) || i && ((_e = E.current.activeSheet) == null ? void 0 : _e.getName()) !== me.sheetName)
            return G.token;
          const oe = K[te];
          if (te++, !oe)
            return "";
          const gt = (Me = oe.sheetId) != null ? Me : r, Qt = {
            range: oe,
            unitId: (ot = oe.unitId) != null ? ot : m.getUnitId(),
            sheetName: h((Ue = oe.unitId) != null ? Ue : m.getUnitId(), gt)
          }, Ot = (m == null ? void 0 : m.getUnitId()) !== o;
          return At([Qt], i && (gt !== r || Ot), C, Ot)[0];
        }
        return G.token;
      });
      let ne = "", le;
      fe.forEach((G, _e) => {
        ne += G, _e === T && (le = ne.length);
      });
      const ge = [];
      for (let G = te; G <= k.length - 1; G++) {
        const _e = k[G], Me = (Tt = _e.sheetId) != null ? Tt : r, ot = {
          range: _e,
          unitId: (ye = _e.unitId) != null ? ye : m.getUnitId(),
          sheetName: h((Nt = _e.unitId) != null ? Nt : m.getUnitId(), Me)
        }, Ue = (m == null ? void 0 : m.getUnitId()) !== o, oe = At([ot], i && (Me !== r || Ue), C, Ue);
        ge.push(oe[0]);
      }
      const Se = L[L.length - 1], Le = Se && (typeof Se == "string" ? !1 : Se.nodeType === X.REFERENCE), Pe = `${ne}${ge.length && Le ? "," : ""}${ge.join(",")}`;
      p(Pe, !ge.length && le ? le : Pe.length, I);
    }
  });
  P(() => {
    if (y && e) {
      let k = !0, I = 0;
      const w = (T, $) => {
        if (k) {
          k = !1, I = T.length;
          return;
        }
        const L = T.length > I;
        $ && (I = T.length), O(T.map((V) => V.rangeWithCoord), $, L);
      }, R = new Be();
      return R.add(y.selectionMoving$.subscribe((T) => {
        w(T, !1);
      })), R.add(y.selectionMoveEnd$.subscribe((T) => {
        w(T, !0);
      })), () => {
        R.dispose();
      };
    }
  }, [e, O, y]), P(() => {
    if (t && y && l) {
      const k = new Be(), I = () => {
        k.dispose(), y.getSelectionControls().forEach((T, $) => {
          k.add(
            T.selectionScaling$.subscribe((L) => {
              const V = y.getSelectionDataWithStyle().map((ae) => ae.rangeWithCoord), ce = V[$];
              L.sheetId = ce.sheetId, L.unitId = ce.unitId, V[$] = L, O(V, !1);
            })
          ), k.add(
            T.selectionMoving$.subscribe((L) => {
              const V = y.getSelectionDataWithStyle().map((ae) => ae.rangeWithCoord), ce = V[$];
              L.sheetId = ce.sheetId, L.unitId = ce.unitId, V[$] = L, O(V, !0);
            })
          );
        });
      }, w = zo(
        l.input$,
        F.selectionSet$,
        y.selectionMoveEnd$
      ).pipe(
        xs(50)
      ).subscribe(() => {
        I();
      });
      return () => {
        w.unsubscribe(), k.dispose();
      };
    }
  }, [l, t, O, y, F.selectionSet$]), y == null || y.getSelectionDataWithStyle(), P(() => {
    if (c) {
      const k = d.onCommandExecuted((I) => {
        var R;
        if (I.id !== Sn.id)
          return;
        const w = I.params;
        if (w.extra === "formula-editor" && w.selections.length) {
          const T = w.selections[w.selections.length - 1];
          if (T) {
            const $ = n.current === Ne.NEED_ADD, L = ((R = y == null ? void 0 : y.getSelectionDataWithStyle()) != null ? R : []).map((V) => V.rangeWithCoord);
            $ ? L.push(T.range) : L[L.length - 1] = T.range, O(L, !0);
          }
        }
      });
      return () => {
        k.dispose();
      };
    }
  }, [d, l, n, v, c, O, y]), P(() => {
    if (!l)
      return;
    const k = u.textSelection$.subscribe((I) => {
      I.unitId === l.getEditorId() && Hr({
        unitId: o,
        subUnitId: r,
        refSelections: s.current,
        editor: l,
        refSelectionsService: F,
        refSelectionsRenderService: y,
        sheetSkeletonManagerService: A,
        themeService: a,
        univerInstanceService: g,
        currentWorkbook: m
      });
    });
    return () => k.unsubscribe();
  }, [u.textSelection$, l, s, y, F, A, r, a, o, g]);
}, Sc = (e, t, n, o, r, s) => {
  const i = N(pe), c = N(Ye), p = N(be).getRenderById(t), f = N(ee), g = p == null ? void 0 : p.with(De);
  P(() => {
    if (e && g)
      if (n) {
        const d = () => {
          const v = g.getSelectionControls().length;
          for (let S = 1; S <= v; S++)
            g.clearLastSelection();
          return setTimeout(() => {
            s();
          }, 30);
        }, u = i.onCommandExecuted((v) => {
          v.id === Kn.id && d();
        }), a = f.getCurrentTypeOfUnit$(H.UNIVER_SHEET).subscribe((v) => {
          d();
        });
        return () => {
          u.dispose(), a.unsubscribe();
        };
      } else {
        const d = i.beforeCommandExecuted((u) => {
          if (u.id === Kn.id) {
            o(!1), r(), s();
            const a = c.getEditor(dn);
            a == null || a.focus();
          }
        });
        return () => {
          d.dispose();
        };
      }
  }, [e, g]);
}, vc = (e, t, n) => {
  const o = N(Ee), r = z(!0);
  P(() => {
    if (e) {
      const s = setTimeout(() => {
        r.current = !1;
      }, 500);
      return () => {
        clearTimeout(s);
      };
    }
  }, [e]), P(() => {
    if (!r.current && t) {
      const s = o.checkIfAddBracket(n);
      t(s === 0 && n.startsWith(gr.EQUALS), `${n}`);
    }
  }, [n, t]);
}, Cc = (e, t = [], n) => {
  const o = N(Gt), [r, s] = W([]), [i, c] = W(""), l = z(-1), p = tt({ nodes: t }), f = () => {
    s([]), c(""), l.current = -1;
  };
  return P(() => {
    if (n && e) {
      const d = n.input$.pipe(mn(300)).subscribe(() => {
        const u = n.getSelectionRanges();
        if (u.length === 1) {
          const a = p.current.nodes, v = u[0];
          if (v.collapsed) {
            const S = En(a, v.startOffset - 1, !1);
            l.current = S;
            const h = a[S];
            if (h && typeof h != "string" && h.nodeType === X.FUNCTION) {
              l.current = S;
              const C = h.token, _ = o.getSearchListByNameFirstLetter(C);
              s(_), c(C);
              return;
            }
          }
        }
        l.current = -1, c(""), s((a) => a != null && a.length ? [] : a);
      });
      return () => {
        d.unsubscribe();
      };
    }
  }, [n, e]), P(() => {
    e || f();
  }, [e]), {
    searchList: r,
    searchText: i,
    handlerFormulaReplace: (d, u) => {
      const a = [...p.current.nodes];
      if (l.current !== -1) {
        const v = a.splice(l.current + 1), S = a.pop() || "";
        let h = (typeof S == "string" ? S.length : S.token.length) - d.length;
        return a.push(d), v[0] !== qe.OPEN_BRACKET && u !== fr.DefinedName && (a.push(qe.OPEN_BRACKET), h--), { text: ln([...a, ...v]), offset: h };
      }
    },
    reset: f
  };
}, _c = () => {
}, Rc = $e(Ic);
function Ic(e, t) {
  const { isFocus: n, sequenceNodes: o, onSelect: r, editor: s, onClose: i = _c } = e, c = s.getEditorId(), l = N(Zt), p = N(pe), { searchList: f, searchText: g, handlerFormulaReplace: d, reset: u } = Cc(n, o, s), a = ie(() => !!f.length, [f]), v = z(void 0), [S, h] = W(0), C = z(!1), [_] = Wr(c, a, [g, f]), E = tt({ searchList: f, active: S }), m = (O, x) => {
    const k = d(O, x);
    k && (u(), r(k));
  };
  function b(O) {
    C.current && h(O);
  }
  function y() {
    C.current && h(-1);
  }
  P(() => {
    if (!f.length)
      return;
    const O = `sheet.formula-embedding-editor.search_function.${c}`, x = new Be(), k = (I) => {
      const { searchList: w, active: R } = E.current;
      switch (I) {
        case D.ARROW_UP: {
          h((T) => {
            const $ = Math.max(0, T - 1);
            return A($), $;
          });
          break;
        }
        case D.ARROW_DOWN: {
          h((T) => {
            const $ = Math.min(w.length - 1, T + 1);
            return A($), $;
          });
          break;
        }
        case D.TAB:
        case D.ENTER: {
          const T = w[R];
          m(T.name, T.functionType);
          break;
        }
        case D.ESC: {
          u(), i();
          break;
        }
      }
    };
    return x.add(p.registerCommand({
      id: O,
      type: Oe.OPERATION,
      handler(I, w) {
        const { keyCode: R } = w;
        k(R);
      }
    })), [D.ARROW_UP, D.ARROW_DOWN, D.ENTER, D.ESC, D.TAB].map((I) => ({
      id: O,
      binding: I,
      preconditions: () => !0,
      priority: 1e3,
      staticParameters: {
        eventType: xe.Keyboard,
        keyCode: I
      }
    })).forEach((I) => {
      x.add(l.registerShortcut(I));
    }), () => {
      x.dispose();
    };
  }, [f]);
  function A(O) {
    const x = v.current;
    if (!x) return;
    const k = x.children[O];
    if (!k) return;
    const w = x.getBoundingClientRect().top, R = x.offsetHeight, T = k.getBoundingClientRect(), $ = T.top, L = T.height;
    if ($ >= 0 && $ > w && $ - w + L <= R)
      return;
    const V = k.offsetTop - (R - L) / 2;
    x.scrollTo({
      top: V,
      behavior: "smooth"
    });
  }
  const F = ie(() => {
    let O = "";
    return () => {
      clearTimeout(O), C.current = !0, O = setTimeout(() => {
        C.current = !1;
      }, 300);
    };
  }, []);
  return f.length > 0 && a && /* @__PURE__ */ M(sn, { portal: !0, anchorRect$: _, direction: "vertical", children: /* @__PURE__ */ M(
    "ul",
    {
      ref: (O) => {
        v.current = O, t && (t.current = O);
      },
      "data-u-comp": "sheets-formula-editor",
      className: re("univer-m-0 univer-box-border univer-max-h-[400px] univer-w-[250px] univer-list-none univer-overflow-y-auto univer-rounded-lg univer-bg-white univer-p-2 univer-leading-5 univer-shadow-md univer-outline-none dark:!univer-bg-gray-900", _n, lt),
      children: f.map((O, x) => /* @__PURE__ */ B(
        "li",
        {
          className: re("univer-box-border univer-cursor-pointer univer-rounded univer-px-2 univer-py-1 univer-text-gray-900 univer-transition-colors dark:!univer-text-white", {
            "univer-bg-gray-200 dark:!univer-bg-gray-600": S === x
          }),
          onMouseEnter: () => b(x),
          onMouseLeave: y,
          onMouseMove: F,
          onClick: () => {
            m(O.name, O.functionType), s && s.focus();
          },
          children: [
            /* @__PURE__ */ B("span", { className: "univer-block univer-truncate univer-text-xs", children: [
              /* @__PURE__ */ M("span", { className: "univer-text-red-500", children: O.name.substring(0, g.length) }),
              /* @__PURE__ */ M("span", { children: O.name.slice(g.length) })
            ] }),
            /* @__PURE__ */ M(
              "span",
              {
                className: "univer-block univer-text-xs univer-text-gray-400",
                children: O.desc
              }
            )
          ]
        },
        O.name
      ))
    }
  ) });
}
const Ec = (e) => e.startsWith(gr.EQUALS) ? e.slice(1) : "", tr = () => {
}, bc = $e((e, t) => {
  var Tn, Nn, On, xn;
  const {
    errorText: n,
    initValue: o,
    unitId: r,
    subUnitId: s,
    isFocus: i = !0,
    isSupportAcrossSheet: c = !1,
    onFocus: l = tr,
    onBlur: p = tr,
    onChange: f,
    onVerify: g,
    className: d,
    editorId: u,
    moveCursor: a = !0,
    onFormulaSelectingChange: v,
    keyboardEventConfig: S,
    onMoveInEditor: h,
    resetSelectionOnBlur: C = !0,
    autoScrollbar: _ = !0,
    isSingle: E = !0,
    disableSelectionOnClick: m = !1,
    autofocus: b = !0,
    disableContextMenu: y,
    style: A
  } = e, F = N(Ye), O = z(null), x = J(f);
  Es(t, () => ({
    isClickOutSide: (Z) => O.current ? !O.current.contains(Z.target) : !1
  }));
  const k = J(v), I = z(null), w = z(void 0), R = w.current, [T, $] = W(i), L = z(null), V = ie(() => u != null ? u : co(`${wo}-${Kt(4)}`), []), ce = ie(() => n !== void 0, [n]), ae = N(ee), he = ae.getUnit(V);
  Ce(he == null ? void 0 : he.change$);
  const Y = sc(), Q = ao.transform.getPlainText((Nn = (Tn = he == null ? void 0 : he.getBody()) == null ? void 0 : Tn.dataStream) != null ? Nn : ""), nt = tt(Q), rt = ie(() => Ec(Q), [Q]), Tt = ie(() => Y(rt), [rt, Y]), { isSelecting: ye, isSelectingRef: Nt } = oc({ unitId: r, subUnitId: s, editorId: V, isFocus: T, disableOnClick: m }), K = z(""), fe = N(be).getRenderById(V), ne = fe == null ? void 0 : fe.with(vr), le = ne == null ? void 0 : ne.isFocusing, ge = ie(() => ae.getCurrentTypeOfUnit$(H.UNIVER_DOC), [ae]), Se = Ce(ge), Le = (Se == null ? void 0 : Se.getUnitId()) === V, Pe = z([]), G = ye, Me = (xn = (On = N(cr).getConfig(Or)) == null ? void 0 : On.functionScreenTips) != null ? xn : !0;
  _s(() => {
    x(Q);
  }, [Q, x]);
  const ot = Br("="), Ue = cc(r, s), me = J((Z, se = !0, we, Te) => {
    if (!w.current) return;
    K.current = Z;
    const xt = Z[0] === "=" ? Z.slice(1) : "", ke = Y(xt), Kr = ke.reduce((Ve, wt) => typeof wt == "object" ? `${Ve}${wt.token}` : `${Ve}${wt}`, ""), Mt = ot(
      w.current,
      Kr === xt ? ke : [],
      se,
      Te
    );
    if (Pe.current = Mt, we) {
      const Ve = Te != null ? Te : R == null ? void 0 : R.getSelectionRanges();
      if ((Ve == null ? void 0 : Ve.length) !== 1)
        return;
      const Yr = Ve[0].startOffset - 1, Gr = En(ke, Yr, !1), Mn = Vr(ke, Gr);
      if (Mn >= 0) {
        const wn = Mt.splice(Mn, 1)[0];
        wn && Mt.push(wn);
      }
      Ue(T ? Mt : [], w.current);
    }
  });
  P(() => {
    T && me(Q, !1, !0);
  }, [T]), P(() => {
    if (T) {
      if (K.current === Q) return;
      me(Q, !1, !0);
    }
  }, [Q]), vc(T, g, Q);
  const oe = nc(R), gt = hc(T, r, s);
  P(() => {
    var Z;
    k(ye, (Z = ne == null ? void 0 : ne.isFocusing) != null ? Z : !0);
  }, [k, ye]), Jo(T, S, R), Lt(() => {
    let Z;
    if (L.current) {
      Z = F.register({
        autofocus: b,
        editorUnitId: V,
        initialSnapshot: {
          id: V,
          body: {
            dataStream: `${o}\r
`,
            textRuns: [],
            customBlocks: [],
            customDecorations: [],
            customRanges: []
          },
          documentStyle: {}
        }
      }, L.current);
      const se = F.getEditor(V);
      w.current = se, me(o, !1, !0);
    }
    return () => {
      Z == null || Z.dispose();
    };
  }, []), Lt(() => {
    i ? ($(i), oe()) : (C && (R == null || R.blur(), gt()), $(i));
  }, [i, R, oe, gt, C]);
  const { checkScrollBar: Qt } = es(R, E, _);
  dc(T, !!(ye && Le), r, V, y), uc(!!(T && le && a), G, R, h);
  const Ot = J((Z, se, we) => {
    if (!le)
      return;
    const Te = se !== -1 ? [{ startOffset: se + 1, endOffset: se + 1, collapsed: !0 }] : void 0;
    me(`=${Z}`, !0, we, Te), we && (oe(), se !== -1 && setTimeout(() => {
      const xt = { startOffset: se + 1, endOffset: se + 1 }, ke = R == null ? void 0 : R.render.with(ts);
      ke == null || ke.scrollToRange({ ...xt, collapsed: !0 });
    }, 50), Qt());
  });
  pc(
    T && !!(ye && Le),
    T,
    Nt,
    r,
    s,
    Pe,
    c,
    !!G,
    R,
    Ot
  ), Sc(T && !!(ye && Le), r, c, $, p, () => {
    me(nt.current, !1, !0);
  });
  const bn = (Z) => {
    if (Z) {
      const se = R == null ? void 0 : R.getSelectionRanges();
      if (se && se.length === 1) {
        const we = se[0];
        if (we.collapsed) {
          const Te = Z.offset;
          setTimeout(() => {
            R == null || R.setSelectionRanges([{ startOffset: we.startOffset - Te, endOffset: we.endOffset - Te }]);
          }, 30);
        }
      }
      oe(), me(`=${Z.text}`);
    }
  }, yn = () => {
    $(!0), l(), oe();
  };
  return /* @__PURE__ */ B("div", { className: d, children: [
    /* @__PURE__ */ M(
      "div",
      {
        ref: O,
        className: re("univer-relative univer-box-border univer-flex univer-h-full univer-w-full univer-items-center univer-justify-around univer-gap-2 univer-rounded-none univer-p-0 univer-ring-1", {
          "univer-ring-primary-500": T,
          "univer-ring-red-500": ce
        }),
        children: /* @__PURE__ */ M(
          "div",
          {
            ref: L,
            className: "univer-relative univer-h-full univer-w-full",
            onMouseUp: yn
          }
        )
      }
    ),
    n !== void 0 && /* @__PURE__ */ M("div", { className: "univer-my-1 univer-text-xs univer-text-red-500", children: n }),
    Me && R && rt !== "" && /* @__PURE__ */ M(
      tc,
      {
        editor: R,
        isFocus: T,
        formulaText: Q,
        onClose: () => oe()
      }
    ),
    Me && !!R && /* @__PURE__ */ M(
      Rc,
      {
        isFocus: T,
        sequenceNodes: Tt,
        onSelect: bn,
        ref: I,
        editor: R
      }
    )
  ] });
});
function yc(e, t, n, o) {
  const r = N(Ee), s = Br(""), i = Ce(e == null ? void 0 : e.getDocumentDataModel().change$), [c, l] = W([]), p = N(ko), f = z(""), g = N(ee);
  return P(() => {
    if (!e) return;
    const d = e.getDocumentDataModel().getPlainText();
    if (f.current === d)
      return;
    f.current = d;
    const u = r.sequenceNodesBuilder(d);
    l(u != null ? u : []);
  }, [i, e, r]), P(() => {
    var a, v;
    if (!e) return;
    if (!t) {
      const S = e.getDocumentData();
      e.setDocumentData({
        ...S,
        body: {
          ...S.body,
          dataStream: (v = (a = S.body) == null ? void 0 : a.dataStream) != null ? v : "",
          textRuns: []
        }
      });
      return;
    }
    const d = s(e, c, !1), u = new Be();
    return d.forEach((S) => {
      const h = dt(S.token), C = g.getCurrentUnitForType(H.UNIVER_SHEET), _ = C == null ? void 0 : C.getActiveSheet();
      if (!h.sheetName && o !== (_ == null ? void 0 : _.getSheetId()) || h.sheetName && (_ == null ? void 0 : _.getName()) !== h.sheetName)
        return;
      const E = new fn(S.themeColor).toRgb(), m = p.addShape({
        range: h.range,
        style: {
          stroke: S.themeColor,
          fill: `rgba(${E.r}, ${E.g}, ${E.b}, 0.1)`,
          strokeDash: 12
        },
        primary: null
      });
      m && u.add(() => p.removeShape(m));
    }), () => {
      u.dispose();
    };
  }, [e, t, s, p, c]), { sequenceNodes: c };
}
function Tc(e) {
  const t = N(pn), { supportAcrossSheet: n = !1, keepSheetReference: o = !1, unitId: r, subUnitId: s, onChange: i } = e, l = N(ee).getUnit(r, H.UNIVER_SHEET), p = J(i), f = J((g, d) => {
    const u = l == null ? void 0 : l.getActiveSheet();
    if (!u || !n && u.getSheetId() !== s || !(g != null && g.length)) return;
    const a = o ? u.getName() : u.getSheetId() === s ? "" : u.getName(), v = g.map((S) => ({
      range: S.range,
      unitId: r,
      sheetName: a
    }));
    p(v, d);
  });
  P(() => {
    const g = new Be();
    return g.add(t.selectionMoveStart$.subscribe((d) => {
      f(d, !0);
    })), g.add(t.selectionMoving$.subscribe((d) => {
      f(d, !1);
    })), g.add(t.selectionMoveEnd$.subscribe((d) => {
      f(d, !1);
    })), () => {
      g.dispose();
    };
  }, [f, t.selectionMoveEnd$, t.selectionMoveStart$, t.selectionMoving$]);
}
const nr = (e) => !e.some((n) => {
  if (typeof n == "string") {
    if (n !== qe.COMMA)
      return !0;
  } else if (n.nodeType !== X.REFERENCE)
    return !0;
  return !1;
}), Nc = (e) => {
  if (e.endColumn < e.startColumn) {
    const t = e.endColumn;
    e.endColumn = e.startColumn, e.startColumn = t;
  }
  if (e.endRow < e.startRow) {
    const t = e.endRow;
    e.endRow = e.startRow, e.startRow = t;
  }
  return e;
};
function Oc(e) {
  const {
    visible: t,
    initialValue: n,
    unitId: o,
    subUnitId: r,
    maxRangeCount: s = 1 / 0,
    supportAcrossSheet: i,
    keepSheetReference: c,
    onConfirm: l,
    onClose: p,
    onShowBySelection: f
  } = e, g = N(ut), d = N(Ee), [u, a] = W([]), [v, S] = W(0), h = z(null);
  P(() => {
    if (t && n.length) {
      const m = n.map((b) => b.sheetName ? Ct(b.sheetName, b.range) : Ie(b.range));
      a(m), S(m.length - 1);
    } else
      a([""]), S(0);
  }, [t]);
  const C = (m, b) => {
    const y = [...u];
    y[m] = b, a(y);
  }, _ = () => {
    a([...u, ""]), S(u.length);
  }, E = (m) => {
    u.splice(m, 1), a([...u]);
  };
  return Tc({
    unitId: o,
    subUnitId: r,
    supportAcrossSheet: i,
    keepSheetReference: c,
    onChange: (m, b) => {
      if (!t && f != null && f(m))
        return;
      const y = new Set(u), A = m.map((x) => x.sheetName ? Ct(x.sheetName, x.range) : Ie(x.range)), F = A.filter((x) => !y.has(x));
      if (!F.length) return;
      const O = [...u];
      if (A.length > 1) {
        b || O.splice(v, 1), O.push(...F);
        const x = O.slice(0, s);
        a(x), S(x.length - 1), requestAnimationFrame(() => {
          var k;
          (k = h.current) == null || k.scrollTo({ top: h.current.scrollHeight });
        });
      } else {
        O.splice(v, 1, ...F);
        const x = O.slice(0, s);
        a(x), S(v + F.length - 1);
      }
    }
  }), /* @__PURE__ */ M(
    Os,
    {
      width: "328px",
      open: t,
      title: g.t("rangeSelector.title"),
      draggable: !0,
      mask: !1,
      maskClosable: !1,
      footer: /* @__PURE__ */ B("footer", { className: "univer-flex univer-gap-2", children: [
        /* @__PURE__ */ M(ct, { onClick: p, children: g.t("rangeSelector.cancel") }),
        /* @__PURE__ */ M(
          ct,
          {
            variant: "primary",
            onClick: () => {
              l(
                u.filter((m) => {
                  const b = d.sequenceNodesBuilder(m);
                  return b && b.length === 1 && typeof b[0] != "string" && b[0].nodeType === X.REFERENCE;
                }).map((m) => dt(m)).map((m) => ({ ...m, range: Nc(m.range) }))
              );
            },
            children: g.t("rangeSelector.confirm")
          }
        )
      ] }),
      onClose: p,
      children: /* @__PURE__ */ B(
        "div",
        {
          ref: h,
          className: re("-univer-mx-6 univer-max-h-60 univer-overflow-y-auto univer-px-6", lt),
          children: [
            u.map((m, b) => /* @__PURE__ */ B(
              "div",
              {
                className: "univer-mb-2 univer-flex univer-items-center univer-gap-4",
                children: [
                  /* @__PURE__ */ M(
                    Er,
                    {
                      className: re("univer-w-full", {
                        "univer-border-primary-600": v === b
                      }),
                      placeholder: g.t("rangeSelector.placeHolder"),
                      onFocus: () => S(b),
                      value: m,
                      onChange: (y) => C(b, y)
                    }
                  ),
                  u.length > 1 && /* @__PURE__ */ M(
                    Dr,
                    {
                      className: "univer-cursor-pointer",
                      onClick: () => E(b)
                    }
                  )
                ]
              },
              b
            )),
            u.length < s && /* @__PURE__ */ M("div", { children: /* @__PURE__ */ B(ct, { variant: "link", onClick: _, children: [
              /* @__PURE__ */ M($r, {}),
              /* @__PURE__ */ M("span", { children: g.t("rangeSelector.addAnotherRange") })
            ] }) })
          ]
        }
      )
    }
  );
}
function xc(e) {
  return e.split(qe.COMMA).filter((t) => !!t).map((t) => dt(t));
}
function Mc(e) {
  return e.map((t) => t.sheetName ? Ct(t.sheetName, t.range) : Ie(t.range)).join(qe.COMMA);
}
function qr(e) {
  const [t, n] = W(null), {
    onVerify: o,
    selectorRef: r,
    unitId: s,
    subUnitId: i,
    maxRangeCount: c,
    supportAcrossSheet: l,
    keepSheetReference: p,
    autoFocus: f,
    onChange: g,
    onRangeSelectorDialogVisibleChange: d,
    onClickOutside: u,
    onFocusChange: a,
    forceShowDialogWhenSelectionChanged: v,
    hideEditor: S,
    resetRange: h
  } = e, [C, _] = W(f != null ? f : !1), [E, m] = W(!1), [b, y] = W([]), A = N(ut), F = N(Ye), { sequenceNodes: O } = yc(t, C, s, i), x = tt(O), k = N(pe), I = J(() => {
    t == null || t.setSelectionRanges([]), t == null || t.blur(), F.blur();
  }), w = J(() => {
    var R;
    I(), y(xc((R = t == null ? void 0 : t.getDocumentDataModel().getPlainText()) != null ? R : "")), m(!0);
  });
  return P(() => {
    r && (r.current = {
      get editor() {
        return t;
      },
      focus() {
        F.focus(t.getEditorId());
      },
      blur: I,
      verify: () => nr(x.current),
      showDialog: (R) => {
        I(), y(R), m(!0);
      },
      hideDialog: () => {
        y([]), m(!1);
      },
      getValue: () => {
        var R;
        return (R = t == null ? void 0 : t.getDocumentDataModel().getPlainText()) != null ? R : "";
      }
    });
  }, [I, t, F, r, x]), P(() => {
    var R;
    o == null || o(nr(O), (R = t == null ? void 0 : t.getDocumentDataModel().getPlainText()) != null ? R : "");
  }, [O]), P(() => {
    d == null || d(E);
  }, [E]), P(() => {
    if (E && h)
      return () => {
        const R = {
          unitId: s,
          subUnitId: i,
          selections: h
        };
        k.executeCommand(Sn.id, R);
      };
  }, [E]), /* @__PURE__ */ B(Is, { children: [
    S ? null : /* @__PURE__ */ M(
      ns,
      {
        isSingle: !0,
        ...e,
        onFocusChange: (R, T) => {
          _(R), a == null || a(R, T);
        },
        editorRef: n,
        onClickOutside: () => {
          _(!1), I(), u == null || u();
        },
        icon: /* @__PURE__ */ M(Ns, { title: A.t("rangeSelector.buttonTooltip"), placement: "bottom", children: /* @__PURE__ */ M(
          Pr,
          {
            className: "univer-cursor-pointer dark:!univer-text-gray-300",
            onClick: w
          }
        ) })
      }
    ),
    /* @__PURE__ */ M(
      Oc,
      {
        initialValue: b,
        unitId: s,
        subUnitId: i,
        visible: E,
        maxRangeCount: c,
        onConfirm: (R) => {
          const T = Mc(R), $ = lo.newEmptyData();
          $.body.dataStream = T, t == null || t.replaceText(T, !1), g == null || g($, T), m(!1), y([]), requestAnimationFrame(() => {
            I();
          });
        },
        onClose: () => {
          m(!1), y([]);
        },
        supportAcrossSheet: l,
        keepSheetReference: p,
        onShowBySelection: (R) => C || v ? (y(R), m(!0), !1) : !0
      }
    )
  ] });
}
const wc = () => {
  var o, r;
  const e = N(Ur), t = Ce(e.currentSelector$), n = z(null);
  return P(() => {
    var s, i;
    if (t)
      return (i = n.current) == null || i.showDialog((s = t.initialValue) != null ? s : []), () => {
        var c;
        (c = n.current) == null || c.hideDialog();
      };
  }, [t]), /* @__PURE__ */ M(
    qr,
    {
      unitId: (o = t == null ? void 0 : t.unitId) != null ? o : "",
      subUnitId: (r = t == null ? void 0 : t.subUnitId) != null ? r : "",
      hideEditor: !0,
      selectorRef: n,
      onChange: (s, i) => {
        var c;
        t == null || t.callback((c = i == null ? void 0 : i.split(",").map((l) => dt(l))) != null ? c : []);
      }
    }
  );
};
var kc = Object.defineProperty, Ac = Object.getOwnPropertyDescriptor, Fc = (e, t, n) => t in e ? kc(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Dc = (e, t, n, o) => {
  for (var r = o > 1 ? void 0 : o ? Ac(t, n) : t, s = e.length - 1, i; s >= 0; s--)
    (i = e[s]) && (r = i(r) || r);
  return r;
}, Ft = (e, t) => (n, o) => t(n, o, e), jr = (e, t, n) => Fc(e, typeof t != "symbol" ? t + "" : t, n);
let jt = class extends ho {
  constructor(e = Xn, t, n, o, r) {
    super(), this._config = e, this._injector = t, this._renderManagerService = n, this._configService = o, this._uiPartsService = r;
    const { menu: s, ...i } = fo(
      Xn,
      this._config
    );
    s && this._configService.setConfig("menu", s, { merge: !0 }), this._configService.setConfig(Or, i, { merge: !0 });
  }
  onStarting() {
    go(this._injector, [
      [zt, { useClass: cn }],
      [Ur],
      [Bt],
      [Ut],
      [Vt],
      [Wt],
      [Ht],
      [Pt],
      [qt]
    ]), this._initUIPart();
  }
  onReady() {
    [
      [De]
    ].forEach((e) => {
      this.disposeWithMe(this._renderManagerService.registerRenderModule(H.UNIVER_SHEET, e));
    });
  }
  onRendered() {
    [
      [an]
    ].forEach((e) => {
      this.disposeWithMe(this._renderManagerService.registerRenderModule(H.UNIVER_SHEET, e));
    }), mo(this._injector, [
      [Bt],
      // FormulaProgressBar relies on TriggerCalculationController, but it is necessary to ensure that the formula calculation is done after rendered.
      [Vt],
      [Ht],
      [qt]
    ]);
  }
  onSteady() {
    this._injector.get(Ut), this._injector.get(Pt);
  }
  _initUIPart() {
    const e = this._injector.get(Rr);
    this.disposeWithMe(e.register(Ao, qr)), this.disposeWithMe(e.register(Fo, bc)), this.disposeWithMe(this._uiPartsService.registerComponent(Rs.GLOBAL, () => Ir(wc, this._injector)));
  }
};
jr(jt, "pluginName", yr);
jr(jt, "type", H.UNIVER_SHEET);
jt = Dc([
  uo(qo, ms),
  Ft(1, q(Rt)),
  Ft(2, be),
  Ft(3, cr),
  Ft(4, _r)
], jt);
export {
  As as FORMULA_PROMPT_ACTIVATED,
  bc as FormulaEditor,
  Pt as FormulaReorderController,
  Ur as GlobalRangeSelectorService,
  Fs as HelpFunctionOperation,
  ve as InsertFunctionOperation,
  In as MoreFunctionsOperation,
  qr as RangeSelector,
  De as RefSelectionsRenderService,
  Nr as ReferenceAbsoluteOperation,
  Ws as SearchFunctionOperation,
  ft as SelectEditorFormulaOperation,
  Rn as SheetOnlyPasteFormulaCommand,
  jt as UniverSheetsFormulaUIPlugin
};
