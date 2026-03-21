var Pe = Object.defineProperty;
var be = (r, e, i) => e in r ? Pe(r, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : r[e] = i;
var g = (r, e, i) => be(r, typeof e != "symbol" ? e + "" : e, i);
import { Plugin as me, merge as De, UniverInstanceType as Oe, Inject as H, Injector as G, IConfigService as we, Registry as Ee, LocaleService as oe, PageElementType as Y, DocumentDataModel as Me, getColorStyle as re, BasicShapes as ee, sortRules as ke, SlideDataModel as Ve, IContextService as Xe, Styles as je, Worksheet as Re } from "@univerjs/core";
import { IRenderingEngine as ze, IRenderManagerService as Ae, Liquid as Le, DocumentViewModel as Ne, DocumentSkeleton as He, Documents as We, SceneViewer as _e, Scene as le, Viewport as C, ScrollBar as ve, Image as Se, PageLayoutType as ge, RichText as Ce, Rect as U, Circle as Ye, Slide as $e, SpreadsheetSkeleton as Fe, Spreadsheet as Ke, SpreadsheetRowHeader as Be, SpreadsheetColumnHeader as qe, getColor as pe } from "@univerjs/engine-render";
const Ue = "slides.config", ue = {};
var Ge = Object.getOwnPropertyDescriptor, Ze = (r, e, i, n) => {
  for (var t = n > 1 ? void 0 : n ? Ge(e, i) : e, a = r.length - 1, s; a >= 0; a--)
    (s = r[a]) && (t = s(t) || t);
  return t;
}, te = (r, e) => (i, n) => e(i, n, r);
const Je = "slides";
var q;
let fe = (q = class extends me {
  // private _canvasView: CanvasView | null = null;
  constructor(e = ue, i, n, t) {
    super();
    g(this, "_canvasEngine", null);
    this._config = e, this._injector = i, this._renderManagerService = n, this._configService = t;
    const { ...a } = De(
      {},
      ue,
      this._config
    );
    this._configService.setConfig(Ue, a), this._initializeDependencies(this._injector);
  }
  initialize() {
    this.initCanvasEngine();
  }
  onReady() {
  }
  getConfig() {
    return this._config;
  }
  initCanvasEngine() {
    this._canvasEngine = this._injector.get(ze);
  }
  onRendered() {
    this.initialize();
  }
  getCanvasEngine() {
    return this._canvasEngine;
  }
  _initializeDependencies(e) {
    [
      // [CanvasView],
      // [DocSelectionManagerService],
    ].forEach((n) => {
      e.add(n);
    });
  }
}, g(q, "pluginName", Je), g(q, "type", Oe.UNIVER_SLIDE), q);
fe = Ze([
  te(1, H(G)),
  te(2, Ae),
  te(3, we)
], fe);
class $ {
  constructor() {
    g(this, "zIndex", 0);
    g(this, "viewKey", null);
  }
  check(e) {
    if (e === this.viewKey)
      return this;
  }
  create(e) {
  }
}
const W = Ee.create();
var Qe = Object.getOwnPropertyDescriptor, et = (r, e, i, n) => {
  for (var t = n > 1 ? void 0 : n ? Qe(e, i) : e, a = r.length - 1, s; a >= 0; a--)
    (s = r[a]) && (t = s(t) || t);
  return t;
}, tt = (r, e) => (i, n) => e(i, n, r);
let ie = class extends $ {
  constructor(e) {
    super();
    g(this, "zIndex", 5);
    g(this, "viewKey", Y.DOCUMENT);
    g(this, "_liquid", new Le());
    this._localeService = e;
  }
  check(e) {
    if (e === this.viewKey)
      return this;
  }
  // eslint-disable-next-line max-lines-per-function
  convert(e, i) {
    var de, he;
    const {
      id: n,
      zIndex: t,
      left: a = 0,
      top: s = 0,
      width: l,
      height: c,
      angle: _,
      scaleX: v,
      scaleY: p,
      skewX: d,
      skewY: h,
      flipX: f,
      flipY: u,
      title: D,
      description: V,
      document: P
    } = e;
    if (P == null)
      return;
    const x = new Me(P), o = new Ne(x), S = He.create(o, this._localeService), I = new We("__DocsRender__", S);
    S.calculate();
    const b = new _e("__DocsViewer__" + n, {
      top: s,
      left: a,
      width: l,
      height: c,
      zIndex: t,
      angle: _,
      scaleX: v,
      scaleY: p,
      skewX: d,
      skewY: h,
      flipX: f,
      flipY: u
    }), w = new le("__DocsScene__" + n, b), T = new C("__DocsViewPort_" + n, w, {
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      explicitViewportWidthSet: !1,
      explicitViewportHeightSet: !1,
      isWheelPreventDefaultX: !0
    });
    w.attachControl(), w.onMouseWheel$.subscribeEvent((E, N) => {
      const m = E;
      if (m.ctrlKey) {
        const j = Math.abs(m.deltaX);
        let M = j < 40 ? 0.2 : j < 80 ? 0.4 : 0.2;
        M *= m.deltaY > 0 ? -1 : 1, w.scaleX < 1 && (M /= 2), w.scaleX + M > 4 ? w.scale(4, 4) : w.scaleX + M < 0.1 ? w.scale(0.1, 0.1) : (m.deltaY > 0, m.preventDefault());
      } else
        T.onMouseWheel(m, N);
    }), new ve(T, {
      mainScene: i
    }), w.addObject(I);
    const y = S.getActualSize();
    I.resize(y.actualWidth, y.actualHeight), w.resize(y.actualWidth, y.actualHeight + 200), (de = I.getSkeleton()) == null || de.getPageSize(), I.pageRender$.subscribe((E) => {
      const { page: N, pageLeft: m, pageTop: j, ctx: M } = E, { width: Z, height: J, marginBottom: Q, marginLeft: k, marginRight: F, marginTop: K } = N;
      M.save(), M.translate(m - 0.5, j - 0.5), M.restore();
    });
    const { left: X, top: R } = I, A = S.getSkeletonData();
    if (A == null)
      return;
    const { pages: L } = A, O = [], z = /* @__PURE__ */ new Map();
    this._recalculateSizeBySkeleton(I, w, S);
    for (let E = 0, N = L.length; E < N; E++) {
      const m = L[E], { skeDrawings: j, marginLeft: M, marginTop: Z, pageWidth: J, pageHeight: Q } = m;
      this._liquid.translatePagePadding(m), j.forEach((k) => {
        const { aLeft: F, aTop: K, height: Ie, width: xe, drawingOrigin: Te } = k, { docTransform: yt } = Te, ye = new Se(k.drawingId, {
          // url: docTransform.imageProperties?.contentUrl || '',
          left: F + X + this._liquid.x,
          top: K + R + this._liquid.y,
          width: xe,
          height: Ie,
          zIndex: 11
        });
        z.set(k.drawingId, {
          marginLeft: this._liquid.x,
          marginTop: this._liquid.y
        }), O.push(ye);
      }), this._liquid.translatePage(
        m,
        I.pageLayoutType,
        I.pageMarginLeft,
        I.pageMarginTop
      );
    }
    return w.addObjects(O), O.forEach((E) => {
      w.attachTransformerTo(E);
    }), (he = w.getTransformer()) == null || he.changing$.subscribe((E) => {
      const { objects: N } = E;
      N.forEach((m) => {
        const { oKey: j, left: M, top: Z, height: J, width: Q } = m, k = z.get(j), F = (k == null ? void 0 : k.marginLeft) || 0, K = (k == null ? void 0 : k.marginTop) || 0;
        S == null || S.getViewModel().getDataModel().updateDrawing(j, {
          left: M - X - F,
          top: Z - R - K,
          height: J,
          width: Q
        });
      }), S == null || S.calculate();
    }), this._calculatePagePosition(I, w, T), b;
  }
  _recalculateSizeBySkeleton(e, i, n) {
    var l;
    const t = (l = n.getSkeletonData()) == null ? void 0 : l.pages;
    if (t == null)
      return;
    let a = 0, s = 0;
    for (let c = 0, _ = t.length; c < _; c++) {
      const v = t[c], { pageWidth: p, pageHeight: d } = v;
      e.pageLayoutType === ge.VERTICAL ? (s += d, s += e.pageMarginTop, c === _ - 1 && (s += e.pageMarginTop), a = Math.max(a, p)) : e.pageLayoutType === ge.HORIZONTAL && (a += p, c !== _ - 1 && (a += e.pageMarginLeft), s = Math.max(s, d));
    }
    e.resize(a, s), i.resize(a, s);
  }
  _calculatePagePosition(e, i, n, t = 1) {
    const a = i == null ? void 0 : i.getParent(), { width: s, height: l, pageMarginLeft: c, pageMarginTop: _ } = e;
    if (a == null || s === Number.POSITIVE_INFINITY || l === Number.POSITIVE_INFINITY)
      return;
    const { width: v, height: p } = a;
    let d = 0, h = 0, f = 0, u = 0, D = Number.POSITIVE_INFINITY;
    if (v > (s + c * 2) * t ? (d = v / 2 - s * t / 2, d /= t, f = (v - c * 2) / t, D = 0) : (d = c, f = s + c * 2, D = (f - v / t) / 2), p > l ? (h = p / 2 - l / 2, u = (p - _ * 2) / t) : (h = _, u = l + _ * 2), i.resize(f, u + 200), e.translate(d, h), D !== Number.POSITIVE_INFINITY && n != null) {
      const V = n.transScroll2ViewportScrollValue(D, 0).x;
      n.scrollToBarPos({
        x: V
      });
    }
    return this;
  }
};
ie = et([
  tt(0, H(oe))
], ie);
class rt {
  constructor() {
    g(this, "zIndex", 5);
  }
  create(e) {
    return e.createInstance(ie);
  }
}
W.add(new rt());
class it extends $ {
  constructor() {
    super(...arguments);
    g(this, "zIndex", 1);
    g(this, "viewKey", Y.IMAGE);
  }
  check(i) {
    if (i === this.viewKey)
      return this;
  }
  convert(i) {
    const {
      id: n,
      zIndex: t,
      left: a = 0,
      top: s = 0,
      width: l,
      height: c,
      angle: _,
      scaleX: v,
      scaleY: p,
      skewX: d,
      skewY: h,
      flipX: f,
      flipY: u,
      title: D,
      description: V,
      image: P = {}
    } = i, { imageProperties: x, placeholder: o, link: S } = P, I = (x == null ? void 0 : x.contentUrl) || "";
    return new Se(n, {
      url: I,
      top: s,
      left: a,
      width: l,
      height: c,
      zIndex: t,
      angle: _,
      scaleX: v,
      scaleY: p,
      skewX: d,
      skewY: h,
      flipX: f,
      flipY: u,
      forceRender: !0
    });
  }
}
class nt {
  constructor() {
    g(this, "zIndex", 4);
  }
  create(e) {
    return e.createInstance(it);
  }
}
W.add(new nt());
var at = Object.getOwnPropertyDescriptor, st = (r, e, i, n) => {
  for (var t = n > 1 ? void 0 : n ? at(e, i) : e, a = r.length - 1, s; a >= 0; a--)
    (s = r[a]) && (t = s(t) || t);
  return t;
}, ct = (r, e) => (i, n) => e(i, n, r);
let ne = class extends $ {
  constructor(e) {
    super();
    g(this, "zIndex", 2);
    g(this, "viewKey", Y.TEXT);
    this._localeService = e;
  }
  check(e) {
    if (e === this.viewKey)
      return this;
  }
  convert(e, i) {
    const {
      id: n,
      zIndex: t,
      left: a = 0,
      top: s = 0,
      width: l,
      height: c,
      angle: _,
      scaleX: v,
      scaleY: p,
      skewX: d,
      skewY: h,
      flipX: f,
      flipY: u,
      title: D,
      description: V,
      richText: P = {}
    } = e, { text: x, ff: o, fs: S, it: I, bl: b, ul: w, st: T, ol: y, bg: X, bd: R, cl: A, rich: L } = P;
    let O = {
      top: s,
      left: a,
      width: l,
      height: c,
      zIndex: t,
      angle: _,
      scaleX: v,
      scaleY: p,
      skewX: d,
      skewY: h,
      flipX: f,
      flipY: u,
      forceRender: !0
    }, z = !1;
    if (x != null ? (O = { ...O, text: x, ff: o, fs: S, it: I, bl: b, ul: w, st: T, ol: y, bg: X, bd: R, cl: A }, z = !0) : L != null && (O = { ...O, richText: L }, z = !0), z !== !1)
      return new Ce(this._localeService, n, O);
  }
};
ne = st([
  ct(0, H(oe))
], ne);
class ot {
  constructor() {
    g(this, "zIndex", 0);
  }
  create(e) {
    return e.createInstance(ne);
  }
}
W.add(new ot());
class lt extends $ {
  constructor() {
    super(...arguments);
    g(this, "zIndex", 2);
    g(this, "viewKey", Y.SHAPE);
  }
  check(i) {
    if (i === this.viewKey)
      return this;
  }
  convert(i) {
    const {
      id: n,
      zIndex: t,
      left: a = 0,
      top: s = 0,
      width: l,
      height: c,
      angle: _,
      scaleX: v,
      scaleY: p,
      skewX: d,
      skewY: h,
      flipX: f,
      flipY: u,
      title: D,
      description: V
    } = i, { shapeType: P, text: x, shapeProperties: o, placeholder: S, link: I } = i.shape || {}, b = o == null ? "" : re(o.shapeBackgroundFill) || "rgba(255,255,255,1)", w = o == null ? void 0 : o.outline, T = {};
    if (w) {
      const { outlineFill: y, weight: X } = w;
      T.strokeWidth = X, T.stroke = re(y) || "rgba(0,0,0,1)";
    }
    if (P === ee.Rect)
      return new U(n, {
        fill: b,
        top: s,
        left: a,
        width: l,
        height: c,
        zIndex: t,
        angle: _,
        scaleX: v,
        scaleY: p,
        skewX: d,
        skewY: h,
        flipX: f,
        flipY: u,
        forceRender: !0,
        ...T
      });
    if (P === ee.RoundRect) {
      const y = (o == null ? void 0 : o.radius) || 0;
      return new U(n, {
        fill: b,
        top: s,
        left: a,
        width: l,
        height: c,
        zIndex: t,
        angle: _,
        scaleX: v,
        scaleY: p,
        skewX: d,
        skewY: h,
        flipX: f,
        flipY: u,
        forceRender: !0,
        radius: y,
        ...T
      });
    }
    if (P === ee.Ellipse) {
      console.warn(o == null ? void 0 : o.radius);
      const y = (o == null ? void 0 : o.radius) || 0;
      return new Ye(n, {
        fill: b,
        top: s,
        left: a,
        width: l,
        height: c,
        zIndex: t,
        angle: _,
        scaleX: v,
        scaleY: p,
        skewX: d,
        skewY: h,
        flipX: f,
        flipY: u,
        forceRender: !0,
        radius: y,
        ...T
      });
    }
  }
}
class dt {
  constructor() {
    g(this, "zIndex", 2);
  }
  create(e) {
    return e.createInstance(lt);
  }
}
W.add(new dt());
var ht = Object.getOwnPropertyDescriptor, gt = (r, e, i, n) => {
  for (var t = n > 1 ? void 0 : n ? ht(e, i) : e, a = r.length - 1, s; a >= 0; a--)
    (s = r[a]) && (t = s(t) || t);
  return t;
}, pt = (r, e) => (i, n) => e(i, n, r);
let ae = class {
  constructor(r) {
    g(this, "_adaptors", []);
    this._injector = r, this._adaptorLoader();
  }
  convertToRenderObjects(r, e) {
    const i = Object.keys(r), n = [];
    return i.forEach((t) => {
      const a = r[t], s = this._executor(a, e);
      s != null && n.push(s);
    }), n;
  }
  convertToRenderObject(r, e) {
    return this._executor(r, e);
  }
  _executor(r, e) {
    var t;
    const { id: i, type: n } = r;
    for (const a of this._adaptors) {
      const s = (t = a.check(n)) == null ? void 0 : t.convert(r, e);
      if (s != null)
        return s;
    }
  }
  _adaptorLoader() {
    W.getData().sort(ke).forEach((r) => {
      this._adaptors.push(r.create(this._injector));
    });
  }
};
ae = gt([
  pt(0, H(G))
], ae);
var ut = Object.getOwnPropertyDescriptor, ft = (r, e, i, n) => {
  for (var t = n > 1 ? void 0 : n ? ut(e, i) : e, a = r.length - 1, s; a >= 0; a--)
    (s = r[a]) && (t = s(t) || t);
  return t;
}, wt = (r, e) => (i, n) => e(i, n, r), _t = /* @__PURE__ */ ((r) => (r.MAIN = "__SLIDERender__", r.SCENE_VIEWER = "__SLIDEViewer__", r.SCENE = "__SLIDEScene__", r.VIEWPORT = "__SLIDEViewPort_", r))(_t || {});
let se = class extends $ {
  constructor(e) {
    super();
    g(this, "zIndex", 6);
    g(this, "viewKey", Y.SLIDE);
    g(this, "_ObjectProvider", null);
    this._injector = e;
  }
  check(e) {
    if (e === this.viewKey)
      return this;
  }
  convert(e, i) {
    const {
      id: n,
      zIndex: t,
      left: a = 0,
      top: s = 0,
      width: l,
      height: c,
      angle: _,
      scaleX: v,
      scaleY: p,
      skewX: d,
      skewY: h,
      flipX: f,
      flipY: u,
      title: D,
      description: V,
      slide: P
    } = e;
    if (P == null)
      return;
    const x = new Ve(P), o = new $e("__SLIDERender__" + n, {
      top: s,
      left: a,
      width: l,
      height: c,
      zIndex: t,
      angle: _,
      scaleX: v,
      scaleY: p,
      skewX: d,
      skewY: h,
      flipX: f,
      flipY: u,
      forceRender: !0
    });
    o.enableNav(), o.enableSelectedClipElement();
    const S = x.getPageOrder(), I = x.getPages();
    if (!S || !I)
      return o;
    this._ObjectProvider = new ae(this._injector);
    for (let b = 0, w = S.length; b < w; b++) {
      const T = I[S[b]], { id: y } = T;
      o.addPageScene(this._createScene(y, o, T, i, x));
    }
    return o.activeFirstPage(), o;
  }
  _createScene(e, i, n, t, a) {
    var h;
    const { width: s, height: l } = i, c = new le(e, i, {
      width: s,
      height: l
    });
    new C(`PageViewer_${e}`, c, {
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      explicitViewportWidthSet: !1,
      explicitViewportHeightSet: !1
    }).closeClip();
    const { pageElements: v, pageBackgroundFill: p } = n, d = (h = this._ObjectProvider) == null ? void 0 : h.convertToRenderObjects(v, t);
    return this._addBackgroundRect(c, p, a), c.addObjects(d), d == null || d.forEach((f) => {
      c.attachTransformerTo(f);
    }), c;
  }
  _addBackgroundRect(e, i, n) {
    const t = n.getPageSize(), { width: a = 0, height: s = 0 } = t, l = new U("canvas", {
      left: 0,
      top: 0,
      width: a,
      height: s,
      strokeWidth: 1,
      stroke: "rgba(198,198,198, 1)",
      fill: re(i) || "rgba(255,255,255, 1)",
      zIndex: 0,
      evented: !1
    });
    e.addObject(l, 0);
  }
};
se = ft([
  wt(0, H(G))
], se);
class vt {
  constructor() {
    g(this, "zIndex", 6);
  }
  create(e) {
    return e.createInstance(se);
  }
}
W.add(new vt());
var St = Object.getOwnPropertyDescriptor, It = (r, e, i, n) => {
  for (var t = n > 1 ? void 0 : n ? St(e, i) : e, a = r.length - 1, s; a >= 0; a--)
    (s = r[a]) && (t = s(t) || t);
  return t;
}, B = (r, e) => (i, n) => e(i, n, r);
let ce = class extends $ {
  constructor(e, i, n, t) {
    super();
    g(this, "zIndex", 4);
    g(this, "viewKey", Y.SPREADSHEET);
    this._localeService = e, this._contextService = i, this._configService = n, this._injector = t;
  }
  check(e) {
    if (e === this.viewKey)
      return this;
  }
  convert(e, i) {
    const {
      id: n,
      zIndex: t,
      left: a = 0,
      top: s = 0,
      width: l,
      height: c,
      angle: _,
      scaleX: v,
      scaleY: p,
      skewX: d,
      skewY: h,
      flipX: f,
      flipY: u,
      spreadsheet: D
    } = e;
    if (D == null)
      return;
    const { worksheet: V, styles: P } = D, x = new je(P), o = new Fe(
      new Re(n, V, x),
      // FIXME: worksheet in slide doesn't has a Worksheet object
      x,
      this._localeService,
      this._contextService,
      this._configService,
      this._injector
    ), { rowTotalHeight: S, columnTotalWidth: I, rowHeaderWidth: b, columnHeaderHeight: w } = o, T = I + V.rowHeader.width || 0, y = S + V.columnHeader.height || 0, X = new _e("spreadInSlideSceneViewer" + n, {
      top: s,
      left: a,
      width: l,
      height: c,
      zIndex: t,
      angle: _,
      scaleX: v,
      scaleY: p,
      skewX: d,
      skewY: h,
      flipX: f,
      flipY: u,
      forceRender: !0
    }), R = new le("spreadInSlideScene" + n, X, {
      width: T,
      height: y
    });
    this._updateViewport(n, b, w, R, i);
    const A = new Ke("testSheetViewer", o, !1), L = new Be("spreadInSlideRow", o), O = new qe("spreadInSlideColumn", o), z = new U("spreadInSlideLeftTop", {
      zIndex: 2,
      left: -1,
      top: -1,
      width: b,
      height: w,
      fill: pe([248, 249, 250]),
      stroke: pe([217, 217, 217]),
      strokeWidth: 1
    });
    return A.zIndex = 10, R.addObjects([A], 1), R.addObjects([L, O, z], 2), X;
  }
  // eslint-disable-next-line max-lines-per-function
  _updateViewport(e, i, n, t, a) {
    if (a == null)
      return;
    const s = i * t.scaleX, l = n * t.scaleY, c = new C("spreadInSlideViewMain" + e, t, {
      left: s,
      top: l,
      bottom: 0,
      right: 0,
      explicitViewportWidthSet: !1,
      explicitViewportHeightSet: !1,
      isWheelPreventDefaultX: !0
    }), _ = new C("spreadInSlideViewTop" + e, t, {
      left: s,
      height: l,
      top: 0,
      right: 0,
      explicitViewportWidthSet: !1,
      isWheelPreventDefaultX: !0
    }), v = new C("spreadInSlideViewLeft" + e, t, {
      left: 0,
      bottom: 0,
      top: l,
      width: s,
      explicitViewportHeightSet: !1,
      isWheelPreventDefaultX: !0
    });
    new C("spreadInSlideViewLeftTop" + e, t, {
      left: 0,
      top: 0,
      width: s,
      height: l,
      isWheelPreventDefaultX: !0
    }), c.onScrollAfter$.subscribeEvent((p) => {
      const { scrollX: d, scrollY: h, viewportScrollX: f, viewportScrollY: u } = p;
      _.updateScrollVal({
        scrollX: d,
        viewportScrollX: f
      }), v.updateScrollVal({
        scrollY: h,
        viewportScrollY: u
      });
    }), t.attachControl(), new ve(c, {
      mainScene: a
    }), t.onMouseWheel$.subscribeEvent((p, d) => {
      const h = p;
      if (h.ctrlKey) {
        const f = Math.abs(h.deltaX);
        let u = f < 40 ? 0.05 : f < 80 ? 0.02 : 0.01;
        u *= h.deltaY > 0 ? -1 : 1, t.scaleX < 1 && (u /= 2), t.scaleX + u > 4 ? t.scale(4, 4) : t.scaleX + u < 0.1 ? t.scale(0.1, 0.1) : (t.scaleBy(u, u), h.preventDefault());
      } else
        c.onMouseWheel(h, d);
    });
  }
};
ce = It([
  B(0, H(oe)),
  B(1, Xe),
  B(2, we),
  B(3, H(G))
], ce);
class xt {
  constructor() {
    g(this, "zIndex", 4);
  }
  create(e) {
    return e.createInstance(ce);
  }
}
W.add(new xt());
var Tt = /* @__PURE__ */ ((r) => (r.COMPONENT = "__slideRender__", r.SCENE = "__mainScene__", r.VIEW = "__mainView__", r))(Tt || {});
export {
  W as CanvasObjectProviderRegistry,
  $ as ObjectAdaptor,
  ae as ObjectProvider,
  Tt as SLIDE_KEY,
  _t as SLIDE_VIEW_KEY,
  fe as UniverSlidesPlugin
};
