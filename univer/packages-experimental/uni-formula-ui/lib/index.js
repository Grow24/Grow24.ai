var we = Object.defineProperty;
var Ee = (o, e, t) => e in o ? we(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t;
var h = (o, e, t) => Ee(o, typeof e != "symbol" ? e + "" : e, t);
import { CommandType as S, ICommandService as _, LocaleService as J, generateRandomId as _e, makeCustomRangeStream as W, CustomRangeType as y, BuildTextUtils as T, sequenceExecute as Te, Disposable as $, Inject as v, IContextService as $e, ILogService as fe, FORMULA_EDITOR_ACTIVATED as se, createInternalEditorID as Le, BooleanNumber as Ne, WrapStrategy as Ae, VerticalAlign as ke, HorizontalAlign as je, DocumentFlavor as Ke, DEFAULT_EMPTY_DOCUMENT_VALUE as Be, IUniverInstanceService as L, UniverInstanceType as I, Injector as X, IResourceManagerService as Ve, Quantity as He, toDisposable as N, RCDisposable as We, DependentOn as Ge, Plugin as ze, touchDependencies as ae } from "@univerjs/core";
import { RemoveDocUniFormulaMutation as Ye, UpdateDocUniFormulaMutation as Ze, AddDocUniFormulaMutation as qe, IUniFormulaService as D, DumbUniFormulaService as Qe, UniverDocUniFormulaPlugin as Je } from "@univerjs/uni-formula";
import { replaceSelectionFactory as G, DocSelectionManagerService as ge } from "@univerjs/docs";
import { DocCanvasPopManagerService as Xe, IEditorService as ve, InsertCommand as Se, MoveCursorOperation as et, DeleteLeftCommand as tt, DocEventManagerService as rt } from "@univerjs/docs-ui";
import { IRenderManagerService as ot, RichText as it } from "@univerjs/engine-render";
import { BehaviorSubject as nt, Subject as st, map as Z, filter as at, switchMap as ct, take as ut } from "rxjs";
import { FORMULA_PROMPT_ACTIVATED as lt } from "@univerjs/sheets-formula-ui";
import { IShortcutService as dt, KeyCode as pt, useDependency as k, useObservable as mt, ComponentManager as ht } from "@univerjs/ui";
import { ISlideEditorBridgeService as Ie, SLIDE_EDITOR_ID as _t, CanvasView as ft } from "@univerjs/slides-ui";
import { jsx as R, jsxs as gt } from "react/jsx-runtime";
import { clsx as vt, borderClassName as St } from "@univerjs/design";
import { useRef as Ce, createElement as ee, forwardRef as ye, useState as ce, useCallback as w, useEffect as It } from "react";
import { DataSyncPrimaryController as Ct } from "@univerjs/rpc";
import { RegisterOtherFormulaService as yt } from "@univerjs/sheets-formula";
const Ft = "DOC_FORMULA_UI_PLUGIN", Fe = {
  type: S.COMMAND,
  id: "doc.command.add-uni-formula",
  async handler(o, e) {
    const { f: t, unitId: r, startIndex: i } = e, n = o.get(_), s = o.get(J), a = _e(), c = s.t("uni-formula.command.stream-placeholder"), u = W(c), d = {
      dataStream: u,
      customRanges: [{
        startIndex: 0,
        endIndex: u.length - 1,
        rangeId: a,
        rangeType: y.UNI_FORMULA,
        wholeEntity: !0
      }]
    }, p = G(o, {
      unitId: r,
      body: d,
      selection: T.selection.makeSelection(i, i + 1)
    });
    if (p) {
      const l = {
        id: qe.id,
        params: { unitId: r, rangeId: a, f: t }
      };
      return Te([p, l], n).result;
    }
    return !1;
  }
}, Pt = {
  type: S.COMMAND,
  id: "doc.command.update-uni-formula",
  handler: (o, e) => o.get(_).syncExecuteCommand(Ze.id, e)
}, Ut = {
  type: S.COMMAND,
  id: "doc.command.remove-uni-formula",
  handler: (o, e) => o.get(_).syncExecuteCommand(Ye.id, e)
};
var Ot = Object.getOwnPropertyDescriptor, Rt = (o, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? Ot(e, t) : e, n = o.length - 1, s; n >= 0; n--)
    (s = o[n]) && (i = s(i) || i);
  return i;
}, ue = (o, e) => (t, r) => e(t, r, o);
let j = class extends $ {
  constructor(e, t) {
    super();
    h(this, "_caches", /* @__PURE__ */ new Map());
    this._editorBridgeService = e, this._uniFormulaService = t, this._editorBridgeService.endEditing$.subscribe((r) => this._checkApplyCache(r));
  }
  writeCache(e, t) {
    var r;
    this._caches.size && ((r = this._caches.values().next().value) == null ? void 0 : r.unitId) !== t.unitId && this.clearCache(), this._caches.set(e, t);
  }
  _checkApplyCache(e) {
    var i;
    const r = (i = e.documentData.body) == null ? void 0 : i.customRanges;
    if (!r || r.length === 0) {
      this.clearCache();
      return;
    }
    r.forEach((n) => {
      if (n.rangeType === y.UNI_FORMULA) {
        const s = this._caches.get(n.rangeId);
        if (s)
          this._applyCache(n.rangeId, s);
        else
          throw new Error("[SlideUIFormulaCacheService]: cache not found!");
      }
    }), this.clearCache();
  }
  _applyCache(e, t) {
    const { unitId: r, pageId: i, elementId: n, f: s } = t;
    this._uniFormulaService.registerSlideFormula(r, i, n, e, s);
  }
  clearCache() {
    this._caches.clear();
  }
};
j = Rt([
  ue(0, Ie),
  ue(1, D)
], j);
const Pe = {
  type: S.COMMAND,
  id: "slide.command.add-slide-uni-formula",
  async handler(o, e) {
    const { startIndex: t } = e, r = o.get(_), i = o.get(j), s = o.get(J).t("uni-formula.command.stream-placeholder"), a = _e(), c = W(s), u = {
      dataStream: c,
      customRanges: [{
        startIndex: 0,
        endIndex: c.length - 1,
        rangeId: a,
        rangeType: y.UNI_FORMULA,
        wholeEntity: !0
      }]
    }, d = G(o, {
      unitId: _t,
      body: u,
      selection: T.selection.makeSelection(t, t + 1)
    });
    return d ? (i.writeCache(a, e), r.executeCommand(d.id, d.params, { onlyLocal: !0 })) : !1;
  }
};
var Dt = Object.getOwnPropertyDescriptor, xt = (o, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? Dt(e, t) : e, n = o.length - 1, s; n >= 0; n--)
    (s = o[n]) && (i = s(i) || i);
  return i;
}, P = (o, e) => (t, r) => e(t, r, o);
const Ue = "DOC_FORMULA_POPUP";
let f = class extends $ {
  constructor(e, t, r, i, n, s) {
    super();
    h(this, "_popupInfo$", new nt(null));
    h(this, "popupInfo$", this._popupInfo$.asObservable());
    h(this, "_popupLocked", !1);
    h(this, "_popupHovered$", new st());
    h(this, "popupHovered$", this._popupHovered$.asObservable());
    h(this, "_cachedFormulaString", "");
    this._docCanvasPopupManagerService = e, this._uniFormulaService = t, this._contextService = r, this._logService = i, this._commandService = n, this._shortcutService = s;
    const a = {
      id: re.id,
      binding: pt.ENTER,
      description: "shortcut.doc.confirm-formula-popup",
      preconditions: (c) => !c.getContextValue(lt) && this.canConfirmPopup(),
      priority: 1e4
    };
    this.disposeWithMe(this._shortcutService.registerShortcut(a));
  }
  get popupInfo() {
    return this._popupInfo$.getValue();
  }
  get popupLocked() {
    return this._popupLocked;
  }
  dispose() {
    super.dispose(), this._popupInfo$.next(null), this._popupInfo$.complete(), this._popupHovered$.complete();
  }
  cacheFormulaString(e) {
    this._cachedFormulaString = e;
  }
  hoverPopup(e) {
    this._popupHovered$.next(e);
  }
  showDocPopup(e, t, r, i) {
    var a, c;
    this.closePopup();
    const n = i && i.rangeId && r === "existing" && (c = (a = this._uniFormulaService.getDocFormula(e, i.rangeId)) == null ? void 0 : a.f) != null ? c : "=", s = this._docCanvasPopupManagerService.attachPopupToRange(
      T.selection.makeSelection(t),
      {
        componentKey: Ue,
        onClickOutside: () => this.closePopup(),
        // user may update ref range selections
        direction: "top"
      },
      e
    );
    return this._popupInfo$.next({ unitId: e, disposable: s, type: r, f: n, startIndex: t, position: i }), !0;
  }
  lockPopup() {
    this._popupLocked = !0, this._contextService.setContextValue(se, !0);
  }
  canConfirmPopup() {
    return this._cachedFormulaString !== "";
  }
  async confirmPopup() {
    const e = this.popupInfo;
    if (!e) return !0;
    const t = this._cachedFormulaString;
    return t ? (this.unlockPopup(), this.closePopup(), Oe(e.position) ? this._commandService.executeCommand(Pe.id, {
      unitId: e.unitId,
      f: t,
      startIndex: e.startIndex,
      pageId: e.position.pageId,
      elementId: e.position.elementId
    }) : this._commandService.executeCommand(Fe.id, {
      unitId: e.unitId,
      f: t,
      startIndex: e.startIndex
    })) : (this._logService.warn("[FormulaPopupService]: cannot write empty formula into the field."), !1);
  }
  unlockPopup() {
    this._popupLocked = !1;
  }
  closePopup(e = !1) {
    var t;
    return this._popupLocked && !e ? !1 : (this._popupLocked = !1, this._cachedFormulaString = "", (t = this.popupInfo) == null || t.disposable.dispose(), this._popupInfo$.next(null), this._popupHovered$.next(!1), this._contextService.setContextValue(se, !1), !0);
  }
};
f = xt([
  P(0, v(Xe)),
  P(1, D),
  P(2, $e),
  P(3, fe),
  P(4, _),
  P(5, dt)
], f);
function Oe(o) {
  return !!o && "pageId" in o;
}
const te = {
  id: "uni-formula.operation.show-formula-popup",
  type: S.OPERATION,
  handler(o, e) {
    const { type: t = "new", startIndex: r, unitId: i, position: n } = e, { rangeId: s } = n, a = o.get(f);
    return t === "existing" && !s ? !1 : a.showDocPopup(i, r, t, n);
  }
}, z = {
  id: "uni-formula.operation.close-formula-popup",
  type: S.OPERATION,
  handler(o) {
    return o.get(f).closePopup(!0);
  }
}, re = {
  id: "uni-formula.operation.confirm-formula-popup",
  type: S.COMMAND,
  handler(o) {
    return o.get(f).confirmPopup();
  }
};
function oe({ ref: o, ...e }) {
  const { icon: t, id: r, className: i, extend: n, ...s } = e, a = `univerjs-icon univerjs-icon-${r} ${i || ""}`.trim(), c = Ce(`_${wt()}`);
  return Re(t, `${r}`, {
    defIds: t.defIds,
    idSuffix: c.current
  }, {
    ref: o,
    className: a,
    ...s
  }, n);
}
function Re(o, e, t, r, i) {
  return ee(o.tag, {
    key: e,
    ...bt(o, t, i),
    ...r
  }, (Mt(o, t).children || []).map((n, s) => Re(n, `${e}-${o.tag}-${s}`, t, void 0, i)));
}
function bt(o, e, t) {
  const r = { ...o.attrs };
  t != null && t.colorChannel1 && r.fill === "colorChannel1" && (r.fill = t.colorChannel1), o.tag === "mask" && r.id && (r.id = r.id + e.idSuffix), Object.entries(r).forEach(([n, s]) => {
    n === "mask" && typeof s == "string" && (r[n] = s.replace(/url\(#(.*)\)/, `url(#$1${e.idSuffix})`));
  });
  const { defIds: i } = e;
  return !i || i.length === 0 || (o.tag === "use" && r["xlink:href"] && (r["xlink:href"] = r["xlink:href"] + e.idSuffix), Object.entries(r).forEach(([n, s]) => {
    typeof s == "string" && (r[n] = s.replace(/url\(#(.*)\)/, `url(#$1${e.idSuffix})`));
  })), r;
}
function Mt(o, e) {
  var r;
  const { defIds: t } = e;
  return !t || t.length === 0 ? o : o.tag === "defs" && ((r = o.children) != null && r.length) ? {
    ...o,
    children: o.children.map((i) => typeof i.attrs.id == "string" && t && t.includes(i.attrs.id) ? {
      ...i,
      attrs: {
        ...i.attrs,
        id: i.attrs.id + e.idSuffix
      }
    } : i)
  } : o;
}
function wt() {
  return Math.random().toString(36).substring(2, 8);
}
oe.displayName = "UniverIcon";
const Et = {
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
}, De = ye(function(e, t) {
  return ee(oe, Object.assign({}, e, {
    id: "check-mark-icon",
    ref: t,
    icon: Et
  }));
});
De.displayName = "CheckMarkIcon";
const Tt = {
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
}, xe = ye(function(e, t) {
  return ee(oe, Object.assign({}, e, {
    id: "close-icon",
    ref: t,
    icon: Tt
  }));
});
xe.displayName = "CloseIcon";
const ie = Le("UNI_FORMULA");
function $t(o) {
  return {
    id: ie,
    body: {
      dataStream: `${o}${Be}`,
      textRuns: [],
      paragraphs: [
        {
          startIndex: 0
        }
      ]
    },
    documentStyle: {
      documentFlavor: Ke.UNSPECIFIED,
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
        horizontalAlign: je.UNSPECIFIED,
        verticalAlign: ke.TOP,
        centerAngle: 0,
        vertexAngle: 0,
        wrapStrategy: Ae.OVERFLOW,
        isRenderStyle: Ne.FALSE
      }
    }
  };
}
function q() {
  const o = k(f), e = mt(o.popupInfo$);
  return e ? /* @__PURE__ */ R(Lt, { popupInfo: e }) : null;
}
q.componentKey = Ue;
function Lt(o) {
  const { popupInfo: e } = o, { f: t } = e;
  k(J);
  const r = k(f), i = k(_), [n, s] = ce(t);
  Ce($t(t != null ? t : ""));
  const [a, c] = ce(!1);
  w((m) => {
    s(m), r.cacheFormulaString(m);
  }, [r]);
  const u = w(() => {
    i.executeCommand(re.id);
  }, [i]), d = w((m) => {
    r.hoverPopup(m);
  }, [r]), p = w(() => {
    i.executeCommand(z.id);
  }, [i]), l = w((m) => {
    m.key === "Escape" && p();
  }, [p]);
  return It(() => (document.addEventListener("keydown", l), () => {
    document.removeEventListener("keydown", l);
  }), [l]), /* @__PURE__ */ R(
    "div",
    {
      className: vt("u univer-box-border univer-flex univer-h-12 univer-w-[482px] univer-items-center univer-gap-x-2 univer-overflow-hidden univer-rounded-lg univer-border-gray-200 univer-bg-white univer-p-2 univer-shadow-lg dark:!univer-bg-gray-900", St),
      onMouseEnter: () => d(!0),
      onMouseLeave: () => d(!1),
      children: /* @__PURE__ */ gt("div", { className: "univer-flex", children: [
        /* @__PURE__ */ R(
          "span",
          {
            className: "univer-flex univer-items-center univer-gap-2 univer-rounded-lg univer-p-1",
            onClick: p,
            children: /* @__PURE__ */ R(xe, {})
          }
        ),
        /* @__PURE__ */ R(
          "span",
          {
            className: "univer-flex univer-items-center univer-gap-2 univer-rounded-lg univer-p-1",
            onClick: u,
            children: /* @__PURE__ */ R(De, {})
          }
        )
      ] })
    }
  );
}
var Nt = Object.getOwnPropertyDescriptor, At = (o, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? Nt(e, t) : e, n = o.length - 1, s; n >= 0; n--)
    (s = o[n]) && (i = s(i) || i);
  return i;
}, C = (o, e) => (t, r) => e(t, r, o);
const kt = "=";
let K = class extends $ {
  constructor(e, t, r, i, n, s, a) {
    super();
    h(this, "_hovered", !1);
    h(this, "_closePopupTimer", null);
    this._commandService = e, this._instanceSrv = t, this._editorService = r, this._logService = i, this._formulaPopupSrv = n, this._renderManagerService = s, this._textSelectionManagerService = a, this._initKeyboardListeners(), this._initCommands(), this._initHoverListener();
  }
  _initCommands() {
    [
      Fe,
      Ut,
      Pt
    ].forEach((e) => this._commandService.registerCommand(e));
  }
  _initKeyboardListeners() {
    this.disposeWithMe(this._commandService.onCommandExecuted((e) => {
      const t = this._editorService.getFocusEditor(), r = this._instanceSrv.getFocusedUnit(), { id: i } = e;
      if (!((t == null ? void 0 : t.getEditorId()) === ie || (r == null ? void 0 : r.type) !== I.UNIVER_DOC)) {
        if (i === Se.id) {
          const n = e.params, s = this._textSelectionManagerService.getActiveTextRange();
          n.body.dataStream === kt && s ? this._showPopup({
            startIndex: s.startOffset - 1,
            unitId: r.getUnitId(),
            position: {}
          }) : this._formulaPopupSrv.popupInfo && this._closePopup();
        }
        (i === et.id || i === tt.id) && this._closePopup();
      }
    }));
  }
  _initHoverListener() {
    const e = this._instanceSrv.focused$.pipe(
      Z((t) => t ? this._instanceSrv.getUnit(t, I.UNIVER_DOC) : null),
      Z((t) => {
        var r;
        return t && { doc: t, docEventManagerService: (r = this._renderManagerService.getRenderById(t.getUnitId())) == null ? void 0 : r.with(rt) };
      }),
      at((t) => !!t),
      ct((t) => t.docEventManagerService.hoverCustomRanges$.pipe(Z((r) => ({ doc: t.doc, ranges: r }))))
    );
    this.disposeWithMe(e.subscribe(({ doc: t, ranges: r }) => {
      var n, s;
      if (!t || ((n = this._formulaPopupSrv.popupInfo) == null ? void 0 : n.type) === "new" || this._formulaPopupSrv.popupLocked)
        return;
      const i = (s = r.find((a) => a.range.rangeType === y.UNI_FORMULA)) == null ? void 0 : s.range;
      if (i) {
        const { startIndex: a, rangeId: c } = i;
        this._logService.debug("[DocUniFormulaController]: activeCustomRanges", r), this._showPopup({
          startIndex: a,
          unitId: t.getUnitId(),
          position: { rangeId: c },
          type: "existing"
        });
      } else
        this._hovered || this._closePopup(500);
    })), this.disposeWithMe(e.subscribe(({ doc: t, ranges: r }) => {
      var n, s;
      if (!t || ((n = this._formulaPopupSrv.popupInfo) == null ? void 0 : n.type) === "new" || this._formulaPopupSrv.popupLocked)
        return;
      const i = (s = r.find((a) => a.range.rangeType === y.UNI_FORMULA)) == null ? void 0 : s.range;
      if (i) {
        const { startIndex: a, rangeId: c } = i;
        this._logService.debug("[DocUniFormulaController]: activeCustomRanges", r), this._showPopup({
          startIndex: a,
          unitId: t.getUnitId(),
          position: { rangeId: c },
          type: "existing"
        });
      } else
        this._hovered || this._closePopup(500);
    })), this.disposeWithMe(this._formulaPopupSrv.popupHovered$.subscribe((t) => {
      t && this._removeTimer(), this._hovered = t;
    }));
  }
  _removeTimer() {
    this._closePopupTimer !== null && (window.clearTimeout(this._closePopupTimer), this._closePopupTimer = null);
  }
  _showPopup(e) {
    this._removeTimer(), this._commandService.executeCommand(te.id, e);
  }
  _closePopup(e = 0) {
    this._formulaPopupSrv.popupInfo && (e === 0 ? this._commandService.executeCommand(z.id) : this._closePopupTimer = window.setTimeout(() => this._closePopup(0), e));
  }
};
K = At([
  C(0, _),
  C(1, L),
  C(2, ve),
  C(3, fe),
  C(4, v(f)),
  C(5, ot),
  C(6, v(ge))
], K);
var jt = Object.getOwnPropertyDescriptor, Kt = (o, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? jt(e, t) : e, n = o.length - 1, s; n >= 0; n--)
    (s = o[n]) && (i = s(i) || i);
  return i;
}, U = (o, e) => (t, r) => e(t, r, o);
const Bt = "=";
let B = class extends $ {
  constructor(e, t, r, i, n, s) {
    super();
    h(this, "_closePopupTimer", null);
    this._injector = e, this._instanceSrv = t, this._commandSrv = r, this._editorSrv = i, this._textSelectionManagerService = n, this._formulaPopupSrv = s, this._initCommands(), this._initKeyboardListeners();
  }
  _initCommands() {
    [
      Pe
    ].forEach((e) => this._commandSrv.registerCommand(e));
  }
  _initKeyboardListeners() {
    this.disposeWithMe(this._commandSrv.onCommandExecuted((e) => {
      const t = this._editorSrv.getFocusEditor(), r = this._instanceSrv.getFocusedUnit(), { id: i } = e;
      if (!((t == null ? void 0 : t.getEditorId()) === ie || (r == null ? void 0 : r.type) !== I.UNIVER_SLIDE) && i === Se.id) {
        const n = e.params, s = this._textSelectionManagerService.getActiveTextRange();
        if (n.body.dataStream === Bt && s) {
          const c = this._injector.get(Ie).getEditorRect(), { pageId: u, richTextObj: d } = c, { oKey: p } = d;
          this._showPopup({
            startIndex: s.startOffset - 1,
            unitId: r.getUnitId(),
            position: {
              pageId: u,
              elementId: p
            }
          });
        } else this._formulaPopupSrv.popupInfo && this._closePopup();
      }
    }));
  }
  _removeTimer() {
    this._closePopupTimer !== null && (window.clearTimeout(this._closePopupTimer), this._closePopupTimer = null);
  }
  _showPopup(e) {
    this._removeTimer(), this._commandSrv.executeCommand(te.id, e);
  }
  _closePopup(e = 0) {
    this._formulaPopupSrv.popupInfo && (e === 0 ? this._commandSrv.executeCommand(z.id) : this._closePopupTimer = window.setTimeout(() => this._closePopup(0), e));
  }
};
B = Kt([
  U(0, v(X)),
  U(1, L),
  U(2, _),
  U(3, ve),
  U(4, v(ge)),
  U(5, v(f))
], B);
var Vt = Object.getOwnPropertyDescriptor, Ht = (o, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? Vt(e, t) : e, n = o.length - 1, s; n >= 0; n--)
    (s = o[n]) && (i = s(i) || i);
  return i;
}, le = (o, e) => (t, r) => e(t, r, o);
let V = class extends $ {
  constructor(o, e) {
    super(), this._commandSrv = o, this._componentManager = e, [
      te,
      z,
      re
    ].forEach((t) => this._commandSrv.registerCommand(t)), this.disposeWithMe(this._componentManager.register(q.componentKey, q));
  }
};
V = Ht([
  le(0, _),
  le(1, v(ht))
], V);
var Wt = Object.getOwnPropertyDescriptor, Gt = (o, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? Wt(e, t) : e, n = o.length - 1, s; n >= 0; n--)
    (s = o[n]) && (i = s(i) || i);
  return i;
}, A = (o, e) => (t, r) => e(t, r, o);
const O = "PSEUDO_SUBUNIT", de = {
  type: S.COMMAND,
  id: "uni-formula.mutation.update-slide-uni-formula-cache",
  handler(o, e) {
    const { unitId: t, positions: r, cache: i } = e, n = o.get(D), s = o.get(L), a = o.get(ft);
    return s.getUnit(t, I.UNIVER_SLIDE) ? r.every((u, d) => {
      var M, ne;
      const p = a.getRenderUnitByPageId(u.pageId, t).scene;
      if (!p) return !1;
      const l = p.getObject(u.elementId);
      if (!l || !(l instanceof it)) return !1;
      const m = l.documentModel, g = (M = m.getBody().customRanges) == null ? void 0 : M.find((Me) => Me.rangeId === u.rangeId);
      if (!g) return !1;
      const b = W(`${(ne = i[d].v) != null ? ne : ""}`), Y = {
        dataStream: b,
        customRanges: [{
          startIndex: 0,
          endIndex: b.length - 1,
          rangeId: u.rangeId,
          rangeType: y.UNI_FORMULA,
          wholeEntity: !0
        }]
      }, F = G(o, {
        unitId: t,
        body: Y,
        selection: T.selection.makeSelection(g.startIndex, g.endIndex),
        doc: m
      });
      return F ? (l.documentModel.apply(F.params.actions), l.refreshDocumentByDocData(), n.updateSlideFormulaResults(t, u.pageId, u.elementId, u.rangeId, i[d]), !0) : !1;
    }) : !0;
  }
}, pe = {
  type: S.COMMAND,
  id: "uni-formula.mutation.update-doc-uni-formula-cache",
  handler(o, e) {
    const { unitId: t, positions: r, cache: i } = e, n = o.get(D), s = o.get(L), a = o.get(_), c = s.getUnit(t, I.UNIVER_DOC);
    if (!c) return !0;
    const u = c.getBody();
    function d(m) {
      var x;
      return (x = u == null ? void 0 : u.customRanges) == null ? void 0 : x.find((g) => g.rangeId === m);
    }
    const p = r.map((m) => m.rangeId);
    return n.updateDocFormulaResults(t, p, i) ? p.every((m, x) => {
      var M;
      const g = d(m);
      if (!g) return !0;
      const b = W(`${(M = i[x].v) != null ? M : ""}`), Y = {
        dataStream: b,
        customRanges: [{
          startIndex: 0,
          endIndex: b.length - 1,
          rangeId: m,
          rangeType: y.UNI_FORMULA,
          wholeEntity: !0
        }]
      }, F = G(o, {
        unitId: t,
        body: Y,
        selection: T.selection.makeSelection(g.startIndex, g.endIndex)
      });
      return F ? a.syncExecuteCommand(F.id, F.params) : !1;
    }) : !1;
  }
};
let Q = class extends Qe {
  constructor(e, t, r, i) {
    super(t, r, i);
    h(this, "_formulaIdToKey", /* @__PURE__ */ new Map());
    h(this, "_canPerformFormulaCalculation", !1);
    h(this, "_dataSyncDisposables", /* @__PURE__ */ new Map());
    h(this, "_resultSubscription");
    this._injector = e, [
      de,
      pe
    ].forEach((n) => r.registerCommand(n)), i.getAllUnitsForType(I.UNIVER_SHEET).length ? this._canPerformFormulaCalculation = !0 : this.disposeWithMe(this._instanceSrv.getTypeOfUnitAdded$(I.UNIVER_SHEET).pipe(ut(1)).subscribe(() => {
      this._canPerformFormulaCalculation = !0, this._initFormulaRegistration();
    }));
  }
  get _registerOtherFormulaSrv() {
    return this._injector.get(yt);
  }
  get _dataSyncPrimaryController() {
    return this._injector.get(Ct, He.OPTIONAL);
  }
  /**
   * Register a doc formula into the formula system.
   */
  registerDocFormula(e, t, r, i, n) {
    const s = me(e, t);
    if (this._docFormulas.has(s))
      throw new Error(`[UniFormulaService]: cannot register formula ${s} when it is already registered!`);
    if (this._canPerformFormulaCalculation) {
      const a = E(e);
      this._checkSyncingUnit(a);
      const c = this._registerOtherFormulaSrv.registerFormulaWithRange(a, O, r);
      this._docFormulas.set(s, { unitId: e, rangeId: t, f: r, formulaId: c, v: i, t: n }), this._formulaIdToKey.set(c, s), this._checkResultSubscription();
    } else
      this._docFormulas.set(s, { unitId: e, rangeId: t, f: r, formulaId: "", v: i, t: n });
    return N(() => this.unregisterDocFormula(e, t));
  }
  registerSlideFormula(e, t, r, i, n, s, a) {
    const c = he(e, t, r, i);
    if (this._slideFormulas.has(c))
      throw new Error(`[UniFormulaService]: cannot register formula ${c} when it is already registered!`);
    if (this._canPerformFormulaCalculation) {
      const u = E(e);
      this._checkSyncingUnit(u);
      const d = this._registerOtherFormulaSrv.registerFormulaWithRange(u, O, n);
      this._slideFormulas.set(c, { unitId: e, pageId: t, elementId: r, rangeId: i, f: n, formulaId: d, v: s, t: a }), this._formulaIdToKey.set(d, c), this._checkResultSubscription();
    } else
      this._slideFormulas.set(c, { unitId: e, pageId: t, elementId: r, rangeId: i, f: n, formulaId: "", v: s, t: a });
    return N(() => this.unregisterSlideFormula(e, t, r, i));
  }
  unregisterDocFormula(e, t) {
    var s;
    const r = me(e, t), i = this._docFormulas.get(r);
    if (!i) return;
    const n = E(e);
    this._checkDisposingResultSubscription(), (s = this._dataSyncDisposables.get(n)) == null || s.dec(), this._canPerformFormulaCalculation && (this._registerOtherFormulaSrv.deleteFormula(n, O, [i.formulaId]), this._formulaIdToKey.delete(i.formulaId)), this._docFormulas.delete(r);
  }
  unregisterSlideFormula(e, t, r, i) {
    var c;
    const n = he(e, t, r, i), s = this._slideFormulas.get(n);
    if (!s) return;
    const a = E(e);
    this._checkDisposingResultSubscription(), (c = this._dataSyncDisposables.get(a)) == null || c.dec(), this._canPerformFormulaCalculation && (this._registerOtherFormulaSrv.deleteFormula(a, O, [s.formulaId]), this._formulaIdToKey.delete(s.formulaId)), this._slideFormulas.delete(n);
  }
  _initFormulaRegistration() {
    this._docFormulas.forEach((e, t) => {
      if (!e.formulaId) {
        const { unitId: r, f: i } = e, n = E(r);
        this._checkSyncingUnit(n);
        const s = this._registerOtherFormulaSrv.registerFormulaWithRange(n, O, i);
        e.formulaId = s, this._formulaIdToKey.set(s, t);
      }
    });
  }
  _checkSyncingUnit(e) {
    this._dataSyncPrimaryController && (this._dataSyncDisposables.has(e) || (this._dataSyncPrimaryController.syncUnit(e), this._dataSyncDisposables.set(e, new We(N(() => this._dataSyncDisposables.delete(e))))), this._dataSyncDisposables.get(e).inc());
  }
  _checkResultSubscription() {
    this._resultSubscription || !this._registerOtherFormulaSrv || (this._resultSubscription = N(this._registerOtherFormulaSrv.formulaResult$.subscribe((e) => {
      for (const t in e) {
        const r = e[t][O];
        if (r) {
          const i = r.map((n) => {
            var d, p;
            const s = n.formulaId, a = this._formulaIdToKey.get(s);
            if (!a) return null;
            const c = this._docFormulas.get(a);
            if (c) {
              const l = (d = n.result) == null ? void 0 : d[0][0][0][0];
              return c.v === (l == null ? void 0 : l.v) && c.t === (l == null ? void 0 : l.t) ? null : { position: { rangeId: c.rangeId }, unitId: c.unitId, cache: l };
            }
            const u = this._slideFormulas.get(a);
            if (u) {
              const l = (p = n.result) == null ? void 0 : p[0][0][0][0];
              return u.v === (l == null ? void 0 : l.v) && u.t === (l == null ? void 0 : l.t) ? null : {
                unitId: u.unitId,
                position: {
                  elementId: u.elementId,
                  rangeId: u.rangeId,
                  pageId: u.pageId
                },
                cache: l
              };
            }
            return null;
          }).reduce((n, s) => (!s || !s.cache || (n.unitId || (n.unitId = s.unitId), n.positions.push(s.position), n.cache.push(s.cache)), n), {
            unitId: "",
            positions: [],
            cache: []
          });
          if (i.positions.length === 0) return;
          Oe(i.positions[0]) ? this._commandSrv.executeCommand(de.id, i) : this._commandSrv.executeCommand(pe.id, i);
        }
      }
    })));
  }
  _checkDisposingResultSubscription() {
    this._docFormulas.size === 0 && this._disposeResultSubscription();
  }
  _disposeResultSubscription() {
    this._resultSubscription && (this._resultSubscription.dispose(), this._resultSubscription = null);
  }
};
Q = Gt([
  A(0, v(X)),
  A(1, Ve),
  A(2, _),
  A(3, L)
], Q);
function E(o) {
  return `pseudo-${o}`;
}
function me(o, e) {
  return `pseudo-${o}-${e}`;
}
function he(o, e, t, r) {
  return `pseudo-${o}-${e}-${t}-${r}`;
}
var zt = Object.defineProperty, Yt = Object.getOwnPropertyDescriptor, Zt = (o, e, t) => e in o ? zt(o, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : o[e] = t, qt = (o, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? Yt(e, t) : e, n = o.length - 1, s; n >= 0; n--)
    (s = o[n]) && (i = s(i) || i);
  return i;
}, Qt = (o, e) => (t, r) => e(t, r, o), be = (o, e, t) => Zt(o, typeof e != "symbol" ? e + "" : e, t);
let H = class extends ze {
  constructor(o, e) {
    super(), this._injector = e;
  }
  onStarting() {
    [
      [V],
      [K],
      [B],
      [j],
      [f],
      [D, { useClass: Q }]
    ].forEach((o) => this._injector.add(o));
  }
  onReady() {
    ae(this._injector, [
      [D]
    ]);
  }
  onSteady() {
    ae(this._injector, [
      [V],
      [K],
      [B]
    ]);
  }
};
be(H, "pluginName", Ft);
be(H, "type", I.UNIVER_UNKNOWN);
H = qt([
  Ge(Je),
  Qt(1, v(X))
], H);
export {
  Q as UniFormulaService,
  H as UniverDocUniFormulaUIPlugin
};
