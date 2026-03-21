var oe = Object.defineProperty;
var se = (e, t, n) => t in e ? oe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var p = (e, t, n) => se(e, typeof t != "symbol" ? t + "" : t, n);
import { CommandType as D, IUniverInstanceService as w, delayAnimationFrame as R, DOCS_ZEN_EDITOR_UNIT_ID_KEY as u, Tools as Y, UniverInstanceType as x, DocumentFlavor as G, DocumentDataModel as ce, createIdentifier as ae, ICommandService as K, DEFAULT_EMPTY_DOCUMENT_VALUE as le, FOCUSING_DOC as de, FOCUSING_UNIVER_EDITOR as ue, EDITOR_ACTIVATED as ge, FOCUSING_EDITOR_STANDALONE as he, Disposable as fe, RxDisposable as me, Plugin as ve, merge as pe, Inject as _e, Injector as Se, IConfigService as Ie } from "@univerjs/core";
import { IEditorService as P, VIEWPORT_KEY as Ce, DocBackScrollRenderController as Ee } from "@univerjs/docs-ui";
import { IRenderManagerService as X } from "@univerjs/engine-render";
import { IEditorBridgeService as T, EditingRenderController as Ne, getCurrentExclusiveRangeInterest$ as Oe, getCurrentRangeDisable$ as Te, getEditorObject as be } from "@univerjs/sheets-ui";
import { IZenZoneService as b, ISidebarService as z, useDependency as y, MenuItemType as Me, ContextMenuPosition as ye, ContextMenuGroup as De, KeyCode as q, MetaKeys as we, IMenuManagerService as Re, IShortcutService as xe } from "@univerjs/ui";
import { jsxs as j, jsx as _ } from "react/jsx-runtime";
import { clsx as A } from "@univerjs/design";
import { useRef as J, createElement as $, forwardRef as Q, useEffect as Pe } from "react";
import { BehaviorSubject as ze, switchMap as $e, map as ke, takeUntil as Ue } from "rxjs";
import { RangeProtectionPermissionEditPoint as Ze, WorksheetEditPermission as Be, WorksheetSetCellValuePermission as Le, WorksheetSetCellStylePermission as je, WorkbookEditablePermission as Ae } from "@univerjs/sheets";
const k = {
  id: "zen-editor.command.open-zen-editor",
  type: D.COMMAND,
  handler: async (e) => {
    var I;
    const t = e.get(b), n = e.get(P), i = e.get(T), r = e.get(w), o = e.get(z);
    o.visible && (o.close(), await R()), t.open();
    const s = n.getEditor(u);
    if (s == null)
      return !1;
    const c = i.getLatestEditCellState();
    if (c == null)
      return !1;
    const a = (I = c.documentLayoutObject.documentModel) == null ? void 0 : I.getSnapshot();
    if (a == null)
      return !1;
    r.focusUnit(u);
    const { body: l, drawings: f, drawingsOrder: d, tableSource: g, settings: m } = Y.deepClone(a), v = {
      ...s.getDocumentData(),
      body: l,
      drawings: f,
      drawingsOrder: d,
      tableSource: g,
      settings: m
    }, h = [
      {
        startOffset: 0,
        endOffset: 0,
        collapsed: !0
      }
    ];
    return s.focus(), s.setDocumentData(v, h), s.clearUndoRedoHistory(), !0;
  }
}, U = {
  id: "zen-editor.command.cancel-zen-edit",
  type: D.COMMAND,
  handler: async (e) => {
    const t = e.get(b), n = e.get(T), i = e.get(w), r = e.get(z);
    r.visible && (r.close(), await R()), t.close();
    const o = i.getCurrentUnitForType(x.UNIVER_SHEET);
    return o ? (i.focusUnit(o.getUnitId()), n.refreshEditCellState(), !0) : !1;
  }
}, Z = {
  id: "zen-editor.command.confirm-zen-edit",
  type: D.COMMAND,
  handler: async (e) => {
    var l;
    const t = e.get(b), n = e.get(T), i = e.get(w), r = e.get(P), o = e.get(z);
    o.visible && (o.close(), await R()), t.close();
    const s = r.getEditor(u);
    if (s == null)
      return !1;
    const c = e.get(X), a = i.getCurrentUnitForType(x.UNIVER_SHEET);
    if (a) {
      const f = a.getUnitId(), d = (l = c.getRenderById(f)) == null ? void 0 : l.with(Ne);
      if (d) {
        const g = Y.deepClone(s.getDocumentData());
        g.documentStyle.documentFlavor = G.UNSPECIFIED, d.submitCellData(new ce(g));
      }
      return i.focusUnit(a.getUnitId()), n.refreshEditCellState(), !0;
    }
    return !1;
  }
}, Ve = "sheets-zen-editor.config", V = {};
function B({ ref: e, ...t }) {
  const { icon: n, id: i, className: r, extend: o, ...s } = t, c = `univerjs-icon univerjs-icon-${i} ${r || ""}`.trim(), a = J(`_${He()}`);
  return ee(n, `${i}`, {
    defIds: n.defIds,
    idSuffix: a.current
  }, {
    ref: e,
    className: c,
    ...s
  }, o);
}
function ee(e, t, n, i, r) {
  return $(e.tag, {
    key: t,
    ...Fe(e, n, r),
    ...i
  }, (We(e, n).children || []).map((o, s) => ee(o, `${t}-${e.tag}-${s}`, n, void 0, r)));
}
function Fe(e, t, n) {
  const i = { ...e.attrs };
  n != null && n.colorChannel1 && i.fill === "colorChannel1" && (i.fill = n.colorChannel1), e.tag === "mask" && i.id && (i.id = i.id + t.idSuffix), Object.entries(i).forEach(([o, s]) => {
    o === "mask" && typeof s == "string" && (i[o] = s.replace(/url\(#(.*)\)/, `url(#$1${t.idSuffix})`));
  });
  const { defIds: r } = t;
  return !r || r.length === 0 || (e.tag === "use" && i["xlink:href"] && (i["xlink:href"] = i["xlink:href"] + t.idSuffix), Object.entries(i).forEach(([o, s]) => {
    typeof s == "string" && (i[o] = s.replace(/url\(#(.*)\)/, `url(#$1${t.idSuffix})`));
  })), i;
}
function We(e, t) {
  var i;
  const { defIds: n } = t;
  return !n || n.length === 0 ? e : e.tag === "defs" && ((i = e.children) != null && i.length) ? {
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
function He() {
  return Math.random().toString(36).substring(2, 8);
}
B.displayName = "UniverIcon";
const Ye = {
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
}, te = Q(function(t, n) {
  return $(B, Object.assign({}, t, {
    id: "check-mark-icon",
    ref: n,
    icon: Ye
  }));
});
te.displayName = "CheckMarkIcon";
const Ge = {
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
}, ne = Q(function(t, n) {
  return $(B, Object.assign({}, t, {
    id: "close-icon",
    ref: n,
    icon: Ge
  }));
});
ne.displayName = "CloseIcon";
class Ke {
  constructor() {
    p(this, "_position", null);
    p(this, "_position$", new ze(null));
    p(this, "position$", this._position$.asObservable());
  }
  dispose() {
    this._position$.complete(), this._position = null;
  }
  setPosition(t) {
    this._position = t, this._refresh(t);
  }
  getPosition() {
    return this._position;
  }
  _refresh(t) {
    this._position$.next(t);
  }
}
const L = ae(
  "univer.sheet-zen-editor-manager.service"
), Xe = "ZEN_EDITOR_PLUGIN_", qe = `${Xe}ZEN_EDITOR_COMPONENT`, Je = {
  id: u,
  body: {
    dataStream: `${le}`,
    textRuns: [],
    tables: [],
    customBlocks: [],
    paragraphs: [
      {
        startIndex: 0
      }
    ],
    sectionBreaks: [{
      startIndex: 1
    }]
  },
  tableSource: {},
  documentStyle: {
    pageSize: {
      width: 595,
      height: Number.POSITIVE_INFINITY
    },
    documentFlavor: G.MODERN,
    marginTop: 0,
    marginBottom: 0,
    marginRight: 0,
    marginLeft: 0,
    renderConfig: {
      vertexAngle: 0,
      centerAngle: 0
    }
  },
  drawings: {},
  drawingsOrder: []
};
function Qe() {
  const e = J(null), t = y(L), n = y(P), i = y(K);
  Pe(() => {
    const c = e.current;
    if (!c)
      return;
    const a = n.register({
      editorUnitId: u,
      initialSnapshot: Je,
      scrollBar: !0,
      backScrollOffset: 100
    }, c), l = new ResizeObserver(() => {
      t.setPosition(c.getBoundingClientRect());
    });
    return l.observe(c), () => {
      a.dispose(), l.unobserve(c);
    };
  }, []);
  function r() {
    const c = n.getEditor(u);
    c == null || c.blur(), i.executeCommand(U.id);
  }
  function o() {
    const c = n.getEditor(u);
    c == null || c.blur(), i.executeCommand(Z.id);
  }
  const s = "univer-flex univer-w-7 univer-cursor-pointer univer-items-center univer-justify-center univer-transition-colors";
  return /* @__PURE__ */ j(
    "div",
    {
      className: "univer-absolute univer-inset-0 univer-size-full univer-bg-white dark:!univer-bg-gray-800",
      children: [
        /* @__PURE__ */ j(
          "div",
          {
            className: "univer-absolute univer-right-6 univer-top-2 univer-z-10 univer-flex univer-items-center univer-justify-center",
            children: [
              /* @__PURE__ */ _(
                "span",
                {
                  className: A(s, `
                      univer-text-red-500
                      hover:univer-text-red-600
                    `),
                  onClick: r,
                  children: /* @__PURE__ */ _(ne, { className: "univer-size-5" })
                }
              ),
              /* @__PURE__ */ _(
                "span",
                {
                  className: A(s, `
                      univer-text-green-500
                      hover:univer-text-green-600
                    `),
                  onClick: o,
                  children: /* @__PURE__ */ _(te, { className: "univer-size-5" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ _("div", { ref: e, className: "univer-absolute univer-inset-0 univer-size-full" })
      ]
    }
  );
}
function et(e) {
  const t = e.get(T);
  return {
    id: k.id,
    type: Me.BUTTON,
    title: "rightClick.zenEditor",
    icon: "AmplifyIcon",
    hidden$: Oe(e),
    disabled$: t.currentEditCell$.pipe(
      $e((n) => Te(e, { workbookTypes: [Ae], worksheetTypes: [Be, Le, je], rangeTypes: [Ze] }).pipe(ke((i) => {
        var r, o, s, c;
        return i || ((c = (s = (o = (r = n == null ? void 0 : n.documentLayoutObject.documentModel) == null ? void 0 : r.getBody()) == null ? void 0 : o.customBlocks) == null ? void 0 : s.length) != null ? c : 0) > 0;
      })))
    )
  };
}
const tt = {
  [ye.MAIN_AREA]: {
    [De.OTHERS]: {
      [k.id]: {
        order: 2,
        menuItemFactory: et
      }
    }
  }
}, nt = {
  id: Z.id,
  description: "shortcut.sheet.zen-edit-confirm",
  group: "4_sheet-edit",
  preconditions: (e) => ie(e),
  binding: q.ENTER | we.ALT
}, it = {
  id: U.id,
  description: "shortcut.sheet.zen-edit-cancel",
  group: "4_sheet-edit",
  preconditions: (e) => ie(e),
  binding: q.ESC
};
function ie(e) {
  return e.getContextValue(de) && e.getContextValue(ue) && e.getContextValue(ge) && !e.getContextValue(he);
}
var rt = Object.getOwnPropertyDescriptor, ot = (e, t, n, i) => {
  for (var r = i > 1 ? void 0 : i ? rt(t, n) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (r = s(r) || r);
  return r;
}, C = (e, t) => (n, i) => t(n, i, e);
let N = class extends fe {
  constructor(e, t, n, i) {
    super(), this._zenZoneService = e, this._commandService = t, this._menuManagerService = n, this._shortcutService = i, this._initialize();
  }
  _initialize() {
    this._initCustomComponents(), this._initCommands(), this._initMenus(), this._initShortcuts();
  }
  _initCustomComponents() {
    this.disposeWithMe(this._zenZoneService.set(qe, Qe));
  }
  _initCommands() {
    [k, U, Z].forEach((e) => {
      this.disposeWithMe(this._commandService.registerCommand(e));
    });
  }
  _initMenus() {
    this._menuManagerService.mergeMenu(tt);
  }
  _initShortcuts() {
    [nt, it].forEach((e) => {
      this.disposeWithMe(this._shortcutService.registerShortcut(e));
    });
  }
};
N = ot([
  C(0, b),
  C(1, K),
  C(2, Re),
  C(3, xe)
], N);
var st = Object.getOwnPropertyDescriptor, ct = (e, t, n, i) => {
  for (var r = i > 1 ? void 0 : i ? st(t, n) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (r = s(r) || r);
  return r;
}, F = (e, t) => (n, i) => t(n, i, e);
let O = class extends me {
  constructor(e, t) {
    super(), this._zenEditorManagerService = e, this._renderManagerService = t, this._initialize();
  }
  _initialize() {
    this._syncZenEditorSize();
  }
  // Listen to changes in the size of the zen editor container to set the size of the editor.
  _syncZenEditorSize() {
    this._zenEditorManagerService.position$.pipe(Ue(this.dispose$)).subscribe((e) => {
      if (e == null)
        return;
      const { width: t, height: n } = e, i = be(u, this._renderManagerService);
      i != null && requestIdleCallback(() => {
        i.engine.resizeBySize(t, n), this._calculatePagePosition(i), this._scrollToTop();
      });
    });
  }
  _calculatePagePosition(e) {
    const { document: t, scene: n, docBackground: i } = e, r = n == null ? void 0 : n.getParent(), { width: o, height: s, pageMarginLeft: c, pageMarginTop: a } = t;
    if (r == null || o === Number.POSITIVE_INFINITY || s === Number.POSITIVE_INFINITY)
      return;
    const { width: l, height: f } = r;
    let d = 0;
    const g = a;
    let m = 0, S = 0, v = Number.POSITIVE_INFINITY;
    const { scaleX: h, scaleY: I } = n.getAncestorScale();
    l > (o + c * 2) * h ? (d = l / 2 - o * h / 2, d /= h, m = (l - c * 2) / h, v = 0) : (d = c, m = o + c * 2, v = (m - l / h) / 2), f > s ? S = (f - a * 2) / I : S = s + a * 2, n.resize(m, S), t.translate(d, g), i.translate(d, g);
    const M = n.getViewport(Ce.VIEW_MAIN);
    if (v !== Number.POSITIVE_INFINITY && M != null) {
      const re = M.transScroll2ViewportScrollValue(v, 0).x;
      M.scrollToBarPos({
        x: re
      });
    }
    return this;
  }
  _scrollToTop() {
    var n;
    const e = (n = this._renderManagerService.getRenderById(u)) == null ? void 0 : n.with(Ee), t = {
      startOffset: 0,
      endOffset: 0
    };
    e && e.scrollToRange(t);
  }
};
O = ct([
  F(0, L),
  F(1, X)
], O);
var at = Object.getOwnPropertyDescriptor, lt = (e, t, n, i) => {
  for (var r = i > 1 ? void 0 : i ? at(t, n) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (r = s(r) || r);
  return r;
}, W = (e, t) => (n, i) => t(n, i, e), E;
let H = (E = class extends ve {
  constructor(e = V, t, n) {
    super(), this._config = e, this._injector = t, this._configService = n;
    const { menu: i, ...r } = pe(
      {},
      V,
      this._config
    );
    i && this._configService.setConfig("menu", i, { merge: !0 }), this._configService.setConfig(Ve, r), this._initializeDependencies(this._injector);
  }
  _initializeDependencies(e) {
    [
      [N],
      [O],
      [L, { useClass: Ke }]
    ].forEach((n) => e.add(n));
  }
  onReady() {
    this._injector.get(N);
  }
  onSteady() {
    this._injector.get(O);
  }
}, p(E, "pluginName", "SHEET_ZEN_EDITOR_PLUGIN"), p(E, "type", x.UNIVER_SHEET), E);
H = lt([
  W(1, _e(Se)),
  W(2, Ie)
], H);
export {
  U as CancelZenEditCommand,
  Z as ConfirmZenEditCommand,
  k as OpenZenEditorCommand,
  H as UniverSheetsZenEditorPlugin
};
