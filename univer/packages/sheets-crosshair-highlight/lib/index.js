var X = Object.defineProperty;
var z = (s, e, t) => e in s ? X(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var c = (s, e, t) => z(s, typeof e != "symbol" ? e + "" : e, t);
import { Disposable as E, CommandType as b, UniverInstanceType as O, Inject as d, ICommandService as K, RANGE_TYPE as u, Rectangle as M, IContextService as q, ColorKit as J, Plugin as Q, merge as ee, Injector as te, IConfigService as re } from "@univerjs/core";
import { BehaviorSubject as y, combineLatest as se, merge as T, startWith as ie, tap as ne, map as x } from "rxjs";
import { Shape as oe, Rect as ae, IRenderManagerService as ce } from "@univerjs/engine-render";
import { useRef as le, createElement as A, forwardRef as he, useCallback as ge } from "react";
import { useDependency as de, useObservable as ue, getMenuHiddenObservable as _e, MenuItemType as fe, ContextMenuPosition as Se, ContextMenuGroup as pe, ComponentManager as ve, IMenuManagerService as Ce } from "@univerjs/ui";
import { jsx as N } from "react/jsx-runtime";
import { clsx as me, borderClassName as Re } from "@univerjs/design";
import { SheetsSelectionsService as be, IRefSelectionsService as He, REF_SELECTIONS_ENABLED as Ie } from "@univerjs/sheets";
import { SheetSkeletonManagerService as Oe, getCoordByCell as V } from "@univerjs/sheets-ui";
const j = [
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
class h extends E {
  constructor() {
    super(...arguments);
    c(this, "_enabled$", new y(!1));
    c(this, "enabled$", this._enabled$.asObservable());
    c(this, "_color$", new y(j[0]));
    c(this, "color$", this._color$.asObservable());
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
  setEnabled(t) {
    this._enabled$.next(t);
  }
  setColor(t) {
    this._color$.next(t);
  }
}
const $ = {
  id: "sheet.operation.toggle-crosshair-highlight",
  type: b.OPERATION,
  handler(s) {
    const e = s.get(h), t = e.enabled;
    return e.setEnabled(!t), !0;
  }
}, k = {
  id: "sheet.operation.set-crosshair-highlight-color",
  type: b.OPERATION,
  handler(s, { value: e }) {
    const t = s.get(h);
    return t.enabled || t.setEnabled(!0), t.setColor(e), !0;
  }
}, Ee = {
  id: "sheet.operation.enable-crosshair-highlight",
  type: b.OPERATION,
  handler(s) {
    const e = s.get(h);
    return e.enabled ? !1 : (e.setEnabled(!0), !0);
  }
}, $e = {
  id: "sheet.operation.disable-crosshair-highlight",
  type: b.OPERATION,
  handler(s) {
    const e = s.get(h);
    return e.enabled ? (e.setEnabled(!1), !0) : !1;
  }
}, we = "sheets-crosshair-highlight.config", L = {};
function G({ ref: s, ...e }) {
  const { icon: t, id: r, className: i, extend: n, ...o } = e, a = `univerjs-icon univerjs-icon-${r} ${i || ""}`.trim(), l = le(`_${Te()}`);
  return U(t, `${r}`, {
    defIds: t.defIds,
    idSuffix: l.current
  }, {
    ref: s,
    className: a,
    ...o
  }, n);
}
function U(s, e, t, r, i) {
  return A(s.tag, {
    key: e,
    ...Me(s, t, i),
    ...r
  }, (ye(s, t).children || []).map((n, o) => U(n, `${e}-${s.tag}-${o}`, t, void 0, i)));
}
function Me(s, e, t) {
  const r = { ...s.attrs };
  t != null && t.colorChannel1 && r.fill === "colorChannel1" && (r.fill = t.colorChannel1), s.tag === "mask" && r.id && (r.id = r.id + e.idSuffix), Object.entries(r).forEach(([n, o]) => {
    n === "mask" && typeof o == "string" && (r[n] = o.replace(/url\(#(.*)\)/, `url(#$1${e.idSuffix})`));
  });
  const { defIds: i } = e;
  return !i || i.length === 0 || (s.tag === "use" && r["xlink:href"] && (r["xlink:href"] = r["xlink:href"] + e.idSuffix), Object.entries(r).forEach(([n, o]) => {
    typeof o == "string" && (r[n] = o.replace(/url\(#(.*)\)/, `url(#$1${e.idSuffix})`));
  })), r;
}
function ye(s, e) {
  var r;
  const { defIds: t } = e;
  return !t || t.length === 0 ? s : s.tag === "defs" && ((r = s.children) != null && r.length) ? {
    ...s,
    children: s.children.map((i) => typeof i.attrs.id == "string" && t && t.includes(i.attrs.id) ? {
      ...i,
      attrs: {
        ...i.attrs,
        id: i.attrs.id + e.idSuffix
      }
    } : i)
  } : s;
}
function Te() {
  return Math.random().toString(36).substring(2, 8);
}
G.displayName = "UniverIcon";
const xe = {
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
      d: "M3.6498 1.05005C2.21386 1.05005 1.0498 2.21411 1.0498 3.65005V12.35C1.0498 13.786 2.21386 14.95 3.6498 14.95H12.3498C13.7857 14.95 14.9498 13.786 14.9498 12.3501V3.65005C14.9498 2.21411 13.7857 1.05005 12.3498 1.05005H3.6498ZM5.4002 2.25005H3.6498C2.87661 2.25005 2.2498 2.87685 2.2498 3.65005V5.40002H5.4002V2.25005ZM2.2498 10.6V12.35C2.2498 13.1232 2.87661 13.75 3.6498 13.75H5.4002V10.6H2.2498ZM6.60019 13.75H9.4002V9.40002H13.7498V6.60002H9.4002V2.25005H6.60019V6.60002H2.25029V9.40002H6.60019V13.75ZM10.6002 2.25005V5.40002H13.7498V3.65005C13.7498 2.87685 13.123 2.25005 12.3498 2.25005H10.6002ZM13.7498 10.6H10.6002V13.75H12.3498C13.123 13.75 13.7498 13.1232 13.7498 12.3501V10.6Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, D = he(function(e, t) {
  return A(G, Object.assign({}, e, {
    id: "cross-highlighting-icon",
    ref: t,
    icon: xe
  }));
});
D.displayName = "CrossHighlightingIcon";
function Ne(s) {
  const { onChange: e } = s, t = de(h), r = ue(t.color$), i = ge((n) => {
    e == null || e(n);
  }, [e]);
  return /* @__PURE__ */ N("div", { className: "univer-grid univer-grid-cols-8 univer-gap-x-2 univer-gap-y-3", children: j.map((n) => /* @__PURE__ */ N(
    "div",
    {
      className: me("hover:univer-ring-primary-600/40 hover:univer-ring-[1.5px] univer-box-border univer-size-5 univer-cursor-pointer univer-rounded univer-ring-offset-1 univer-transition-shadow", Re, {
        "univer-ring-[1.5px] univer-ring-primary-600 hover:univer-ring-primary-600": n === r
      }),
      style: { backgroundColor: n },
      onClick: () => i(n)
    },
    n
  )) });
}
const B = "CROSSHAIR_HIGHLIGHT_OVERLAY_COMPONENT";
function Ve(s) {
  const e = s.get(h);
  return {
    id: $.id,
    tooltip: "crosshair.button.tooltip",
    type: fe.BUTTON_SELECTOR,
    icon: "CrossHighlightingIcon",
    selections: [
      {
        label: {
          name: B,
          hoverable: !1,
          selectable: !1
        }
      }
    ],
    selectionsCommandId: k.id,
    activated$: e.enabled$,
    hidden$: _e(s, O.UNIVER_SHEET)
  };
}
const Le = {
  [Se.FOOTER_MENU]: {
    [pe.OTHERS]: {
      [$.id]: {
        order: 0,
        menuItemFactory: Ve
      }
    }
  }
};
var Pe = Object.getOwnPropertyDescriptor, Ae = (s, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? Pe(e, t) : e, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (i = o(i) || i);
  return i;
}, H = (s, e) => (t, r) => e(t, r, s);
let m = class extends E {
  constructor(s, e, t) {
    super(), this._componentMgr = s, this._menuManagerService = e, this._cmdSrv = t, this._initCommands(), this._initMenus(), this._initComponents();
  }
  _initCommands() {
    [
      $,
      k,
      Ee,
      $e
    ].forEach((s) => this._cmdSrv.registerCommand(s));
  }
  _initMenus() {
    this._menuManagerService.mergeMenu(Le);
  }
  _initComponents() {
    this._componentMgr.register(B, Ne), this._componentMgr.register("CrossHighlightingIcon", D);
  }
};
m = Ae([
  H(0, d(ve)),
  H(1, Ce),
  H(2, K)
], m);
const je = 1;
class ke {
  constructor() {
    c(this, "_selectedRanges", []);
    c(this, "_ranges", []);
  }
  addRange(e) {
    if (e.rangeType === u.COLUMN || e.rangeType === u.ROW || e.rangeType === u.ALL)
      return;
    const t = this._getIntersects(e), r = this._getSplitRanges(e, t);
    r.length > 0 && this._ranges.push(...r);
  }
  setSelectedRanges(e) {
    this._selectedRanges = e;
  }
  _getSplitRanges(e, t) {
    let r = [e];
    for (const i of t.concat(this._selectedRanges)) {
      const n = [];
      for (const o of r) {
        const a = M.subtract(o, i);
        a && a.length > 0 && n.push(...a);
      }
      r = n;
    }
    return r.filter((i) => i.startRow <= i.endRow && i.startColumn <= i.endColumn);
  }
  _getIntersects(e) {
    const t = [];
    for (const r of this._ranges) {
      const i = M.getIntersects(r, e);
      i && t.push(i);
    }
    return t;
  }
  getRanges() {
    return this._ranges;
  }
  reset() {
    this._ranges = [], this._selectedRanges = [];
  }
}
class Ge extends oe {
  constructor(t, r) {
    super(t, r);
    // protected _showHighLight = false;
    c(this, "_color");
    r && this.setShapeProps(r);
  }
  setShapeProps(t) {
    typeof t.color < "u" && (this._color = t.color), this.transformByState({
      width: t.width,
      height: t.height
    });
  }
  _draw(t) {
    var i, n;
    const r = `rgba(${this._color.r}, ${this._color.g}, ${this._color.b}, ${(n = (i = this._color) == null ? void 0 : i.a) != null ? n : 0.5})`;
    ae.drawWith(t, {
      width: this.width,
      height: this.height,
      fill: r,
      stroke: void 0,
      strokeWidth: 0,
      evented: !1
    });
  }
}
var Ue = Object.getOwnPropertyDescriptor, De = (s, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? Ue(e, t) : e, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (i = o(i) || i);
  return i;
}, S = (s, e) => (t, r) => e(t, r, s);
let R = class extends E {
  constructor(e, t, r, i, n, o) {
    super();
    c(this, "_shapes", []);
    c(this, "_rangeCollection", new ke());
    c(this, "_color", "rgba(255,0,0,0.5)");
    this._context = e, this._sheetSkeletonManagerService = t, this._sheetsSelectionsService = r, this._sheetsCrosshairHighlightService = i, this._contextService = n, this._refSelectionsService = o, this._initRenderListener();
  }
  _transformSelection(e, t) {
    if (!e)
      return;
    const r = t.getRowCount(), i = t.getColumnCount(), n = [];
    for (const o of e) {
      const { startRow: a, endRow: l, startColumn: _, endColumn: f } = o.range;
      l - a + 1 === r || f - _ + 1 === i || n.push(o.range);
    }
    this._rangeCollection.setSelectedRanges(n);
    for (const o of n)
      this.addSelection(o, t);
  }
  _initRenderListener() {
    const e = this._context.unit;
    this.disposeWithMe(se([
      this._contextService.subscribeContextValue$(Ie).pipe(ie(!1)),
      this._sheetSkeletonManagerService.currentSkeleton$,
      this._sheetsCrosshairHighlightService.enabled$,
      this._sheetsCrosshairHighlightService.color$.pipe(ne((t) => this._color = t)),
      T(
        this._sheetsSelectionsService.selectionMoveStart$,
        this._sheetsSelectionsService.selectionMoving$,
        this._sheetsSelectionsService.selectionMoveEnd$,
        this._sheetsSelectionsService.selectionSet$,
        e.activeSheet$.pipe(x(() => this._sheetsSelectionsService.getCurrentSelections()))
      ),
      T(
        this._refSelectionsService.selectionMoveStart$,
        this._refSelectionsService.selectionMoving$,
        this._refSelectionsService.selectionMoveEnd$,
        this._sheetsSelectionsService.selectionSet$,
        e.activeSheet$.pipe(x(() => this._refSelectionsService.getCurrentSelections()))
      )
    ]).subscribe(([t, r, i, n, o, a]) => {
      if (this._clear(), !i) return;
      const l = t ? a : o;
      this._rangeCollection.reset(), this._transformSelection(l, e.getActiveSheet()), this.render(this._rangeCollection.getRanges());
    }));
  }
  addSelection(e, t) {
    if (e.rangeType === u.COLUMN || e.rangeType === u.ROW || e.rangeType === u.ALL)
      return;
    const r = t.getRowCount(), i = t.getColumnCount(), { startRow: n, endRow: o, startColumn: a, endColumn: l } = e, _ = {
      startRow: n,
      endRow: o,
      startColumn: 0,
      endColumn: a - 1
    }, f = {
      startRow: n,
      endRow: o,
      startColumn: l + 1,
      endColumn: i
    }, p = {
      startRow: 0,
      endRow: n - 1,
      startColumn: a,
      endColumn: l
    }, v = {
      startRow: o + 1,
      endRow: r,
      startColumn: a,
      endColumn: l
    };
    for (const g of [_, f, p, v])
      g.startRow <= g.endRow && g.startColumn <= g.endColumn && this._rangeCollection.addRange(g);
  }
  _clear() {
    this._shapes.forEach((e) => {
      e.dispose();
    }), this._shapes = [];
  }
  _addShapes(e, t, r, i) {
    const { startRow: n, endRow: o, startColumn: a, endColumn: l } = e, _ = V(n, a, r, i), f = V(o, l, r, i), { startX: p, startY: v } = _, { endX: g, endY: Z } = f, W = g - p, Y = Z - v, F = {
      left: p,
      top: v,
      color: new J(this._color).toRgb(),
      width: W,
      height: Y,
      zIndex: je,
      evented: !1
    }, w = new Ge(`crosshair-${t}`, F);
    this._shapes.push(w), r.addObject(w);
  }
  render(e) {
    const t = this._sheetSkeletonManagerService.getCurrentSkeleton();
    if (!t)
      return;
    const { scene: r } = this._context;
    this._clear();
    for (let i = 0; i < e.length; i++) {
      const n = e[i];
      this._addShapes(n, i, r, t);
    }
    r.makeDirty(!0);
  }
  async dispose() {
    super.dispose();
  }
};
R = De([
  S(1, d(Oe)),
  S(2, d(be)),
  S(3, d(h)),
  S(4, d(q)),
  S(5, He)
], R);
var Be = Object.getOwnPropertyDescriptor, Ze = (s, e, t, r) => {
  for (var i = r > 1 ? void 0 : r ? Be(e, t) : e, n = s.length - 1, o; n >= 0; n--)
    (o = s[n]) && (i = o(i) || i);
  return i;
}, I = (s, e) => (t, r) => e(t, r, s), C;
let P = (C = class extends Q {
  constructor(s = L, e, t, r) {
    super(), this._config = s, this._injector = e, this._renderManagerService = t, this._configService = r;
    const { ...i } = ee(
      {},
      L,
      this._config
    );
    this._configService.setConfig(we, i);
  }
  onStarting() {
    [
      [h],
      [m]
    ].forEach((s) => this._injector.add(s));
  }
  onReady() {
    [
      [R]
    ].forEach((s) => this._injector.add(s)), this._injector.get(m), this._renderManagerService.registerRenderModule(O.UNIVER_SHEET, [R]);
  }
}, c(C, "pluginName", "SHEET_CROSSHAIR_HIGHLIGHT_PLUGIN"), c(C, "type", O.UNIVER_SHEET), C);
P = Ze([
  I(1, d(te)),
  I(2, ce),
  I(3, re)
], P);
export {
  j as CROSSHAIR_HIGHLIGHT_COLORS,
  $e as DisableCrosshairHighlightOperation,
  Ee as EnableCrosshairHighlightOperation,
  k as SetCrosshairHighlightColorOperation,
  h as SheetsCrosshairHighlightService,
  $ as ToggleCrosshairHighlightOperation,
  P as UniverSheetsCrosshairHighlightPlugin
};
