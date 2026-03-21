var oi = Object.defineProperty;
var ci = (n, e, t) => e in n ? oi(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var S = (n, e, t) => ci(n, typeof e != "symbol" ? e + "" : e, t);
import { Inject as z, Injector as ke, IUniverInstanceService as w, RxDisposable as fe, UniverInstanceType as E, debounce as ai, getColorStyle as li, CommandType as N, PageElementType as Ne, merge as St, LocaleService as J, ICommandService as D, generateRandomId as ze, BasicShapes as It, createInternalEditorID as di, createIdentifier as bt, IContextService as pe, DocumentFlavor as ui, FOCUSING_UNIVER_EDITOR as Et, EDITOR_ACTIVATED as xe, FORMULA_EDITOR_ACTIVATED as hi, Disposable as De, DisposableCollection as Ke, toDisposable as xt, FOCUSING_COMMON_DRAWINGS as gi, FOCUSING_EDITOR_STANDALONE as Rt, FOCUSING_UNIVER_EDITOR_STANDALONE_SINGLE_MODE as Ot, DocumentDataModel as vi, HorizontalAlign as wt, VerticalAlign as Re, IUndoRedoService as fi, WrapStrategy as tt, FOCUSING_EDITOR_BUT_HIDDEN as pi, DEFAULT_EMPTY_DOCUMENT_VALUE as mi, Direction as V, Plugin as _i, mergeOverrideWithDependencies as it, IConfigService as Ci } from "@univerjs/core";
import { IRenderManagerService as K, Viewport as nt, ScrollBar as Pt, getCurrentTypeOfRenderer as Le, Slide as Si, Rect as yt, Scene as Ii, ObjectType as de, FIX_ONE_PIXEL_BLUR_OFFSET as ie, DeviceInputEventType as Y, pxToNum as bi, convertTextRotation as rt, fixLineWidthByScale as st } from "@univerjs/engine-render";
import { ObjectProvider as Ei, SLIDE_KEY as ne } from "@univerjs/slides";
import { DRAWING_IMAGE_ALLOW_IMAGE_LIST as xi, IImageIoService as Ri, getImageSize as Oi } from "@univerjs/drawing";
import { ILocalFileService as wi, useDependency as O, ISidebarService as Tt, getMenuHiddenObservable as re, MenuItemType as se, RibbonStartGroup as Pi, useObservable as yi, DISABLE_AUTO_FOCUS_KEY as ot, KeyCode as P, MetaKeys as Ti, IMenuManagerService as Mi, ComponentManager as Ni, IUIPartsService as Di, IShortcutService as Ui, BuiltInUIPart as ct, connectInjector as at, ICanvasPopupService as Vi, ILayoutService as ji } from "@univerjs/ui";
import { jsxs as x, jsx as u } from "react/jsx-runtime";
import { Button as Ce, clsx as k, Dropdown as Mt, ColorPicker as Ai, borderTopClassName as Nt, InputNumber as le, borderClassName as he, scrollbarClassName as Li } from "@univerjs/design";
import { useRef as Dt, createElement as H, forwardRef as Z, useState as $, useEffect as ge, useMemo as $i, createRef as Bi, useCallback as lt } from "react";
import { IEditorService as Ze, DeleteLeftCommand as Hi, DocSelectionRenderService as dt, VIEWPORT_KEY as ut, DOCS_COMPONENT_MAIN_LAYER_INDEX as Fi, MoveSelectionOperation as Wi, MoveCursorOperation as ki, DOCS_VIEW_KEY as zi } from "@univerjs/docs-ui";
import { BehaviorSubject as q, Subject as Ut, filter as Ki, takeUntil as ht } from "rxjs";
import { DocSelectionManagerService as Zi, DocSkeletonManagerService as gt, RichTextEditingMutation as Gi } from "@univerjs/docs";
var Xi = Object.getOwnPropertyDescriptor, Yi = (n, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Xi(e, t) : e, s = n.length - 1, o; s >= 0; s--)
    (o = n[s]) && (r = o(r) || r);
  return r;
}, Ue = (n, e) => (t, i) => e(t, i, n);
let ve = class extends fe {
  constructor(e, t, i, r) {
    super();
    S(this, "_objectProvider", null);
    S(this, "_refreshThumb", ai(() => {
      this.createThumbs();
    }, 300));
    this._renderContext = e, this._injector = t, this._univerInstanceService = i, this._renderManagerService = r, this._objectProvider = this._injector.createInstance(Ei), this._addNewRender();
  }
  _addNewRender() {
    const { unitId: e, engine: t, scene: i } = this._renderContext, r = this._getCurrUnitModel();
    if (!r) return;
    const s = t.onTransformChange$.subscribeEvent(() => {
      this._scrollToCenter(), s == null || s.unsubscribe();
    });
    t.onTransformChange$.subscribeEvent(() => {
      setTimeout(() => {
        this.createThumbs();
      }, 300);
    });
    const o = new nt(ne.VIEW, i, {
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      explicitViewportWidthSet: !1,
      explicitViewportHeightSet: !1,
      isWheelPreventDefaultX: !0
    });
    i.attachControl(), i.onMouseWheel$.subscribeEvent((a, h) => {
      const l = a;
      if (l.ctrlKey) {
        const d = Math.abs(l.deltaX);
        let v = d < 40 ? 0.2 : d < 80 ? 0.4 : 0.2;
        v *= l.deltaY > 0 ? -1 : 1, i.scaleX < 1 && (v /= 2), i.scaleX + v > 4 ? i.scale(4, 4) : i.scaleX + v < 0.1 ? i.scale(0.1, 0.1) : (l.deltaY > 0, l.preventDefault());
      } else
        o.onMouseWheel(l, h);
    }), i.onFileLoaded$.subscribeEvent(() => {
      this._refreshThumb();
    }), Pt.attachTo(o);
    const c = this._createSlide(i);
    this._renderContext.mainComponent = c, this._createSlidePages(r, c), this.createThumbs(), t.runRenderLoop(() => {
      i.render();
    });
  }
  _scrollToCenter() {
    var a;
    const e = (a = this._currentRender()) == null ? void 0 : a.scene, t = e == null ? void 0 : e.getViewport(ne.VIEW), i = this._getCenterPositionViewPort(e);
    if (!t || !i) return;
    const { left: r, top: s } = i, { x: o, y: c } = t.transViewportScroll2ScrollValue(r, s);
    t.scrollToBarPos({
      x: o,
      y: c
    });
  }
  _currentRender() {
    return Le(E.UNIVER_SLIDE, this._univerInstanceService, this._renderManagerService);
  }
  /**
   * @param mainScene
   */
  _createSlide(e) {
    const t = this._univerInstanceService.getCurrentUnitForType(E.UNIVER_SLIDE), { width: i, height: r } = e, s = t.getPageSize(), { width: o = 100, height: c = 100 } = s, a = new Si(ne.COMPONENT, {
      left: (i - o) / 2,
      top: (r - c) / 2,
      width: o,
      height: c,
      zIndex: 10
    });
    return a.enableSelectedClipElement(), e.addObject(a), a;
  }
  _addBackgroundRect(e, t) {
    const r = this._univerInstanceService.getCurrentUnitForType(E.UNIVER_SLIDE).getPageSize(), { width: s = 0, height: o = 0 } = r, c = new yt("canvas", {
      left: 0,
      top: 0,
      width: s,
      height: o,
      strokeWidth: 1,
      stroke: "rgba(198,198,198,1)",
      fill: li(t) || "rgba(255,255,255,1)",
      zIndex: 0,
      evented: !1
    });
    e.addObject(c, 0);
  }
  _getCenterPositionViewPort(e) {
    if (!e) return { left: 0, top: 0 };
    const { width: t, height: i } = e, r = e.getEngine(), s = (r == null ? void 0 : r.width) || 0, o = (r == null ? void 0 : r.height) || 0;
    return {
      left: (t - s) / 2,
      top: (i - o) / 2
    };
  }
  _thumbSceneRender(e, t) {
    const i = this._renderManagerService.getRenderById(e);
    if (i == null)
      return;
    const { engine: r } = i;
    if (r == null)
      return;
    const { width: s, height: o } = t, { width: c = s, height: a = o } = r, h = r.getCanvas().getContext();
    t.renderToThumb(h, e, c / s, a / o);
  }
  /**
   * CreateScene by pages, and activate first one.
   * @param slideDataModel
   * @param slide
   */
  _createSlidePages(e, t) {
    const i = e.getPages(), r = e.getPageOrder();
    if (!(!i || !r) && r.length !== 0) {
      for (let s = 0, o = r.length; s < o; s++) {
        const c = r[s];
        this.createPageScene(c, i[c]), this._createThumb(c);
      }
      t.activeFirstPage();
    }
  }
  _createThumb(e) {
    this._renderManagerService.createRender(e);
  }
  /**
   * SlideDataModel is UnitModel
   */
  _getCurrUnitModel() {
    return this._renderContext.unit;
  }
  activePage(e) {
    let t = e;
    const i = this._getCurrUnitModel();
    let r;
    if (t)
      r = i.getPage(t);
    else {
      const a = i.getPages(), h = i.getPageOrder();
      if (h == null || a == null)
        return;
      r = a[h[0]], t = r.id;
    }
    const s = this._currentRender();
    if (r == null || s == null || s.mainComponent == null)
      return;
    const { id: o } = r, c = s.mainComponent;
    if (i.setActivePage(r), c != null && c.hasPage(o)) {
      c.changePage(o);
      return;
    }
    this.createPageScene(o, r);
  }
  createThumbs() {
    const t = this._getCurrUnitModel().getPageOrder(), i = this._currentRender();
    if (!(!t || !i) && t.length !== 0)
      for (let r = 0, s = t.length; r < s; r++) {
        const o = t[r];
        this._thumbSceneRender(o, i.mainComponent);
      }
  }
  /**
   * Create scene by page and set to _sceneMap.
   * @param pageId
   * @param page
   */
  createPageScene(e, t) {
    const i = this._renderContext;
    if (!i || !this._objectProvider)
      return;
    const { scene: r, mainComponent: s } = i, o = s, { width: c, height: a } = o, h = new Ii(e, o, {
      width: c,
      height: a
    });
    new nt(`PageViewer_${e}`, h, {
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
      explicitViewportWidthSet: !1,
      explicitViewportHeightSet: !1
    }).closeClip();
    const { pageElements: d, pageBackgroundFill: v } = t, m = this._objectProvider.convertToRenderObjects(d, r);
    if (!m || !o) return;
    this._addBackgroundRect(h, v), h.addObjects(m), h.initTransformer(), m.forEach((f) => {
      h.attachTransformerTo(f);
    });
    const p = h.getTransformer();
    return p == null || p.changeEnd$.subscribe(() => {
      this._thumbSceneRender(e, o);
    }), p == null || p.clearControl$.subscribe(() => {
      this._thumbSceneRender(e, o);
    }), o.addPageScene(h), h;
  }
  /**
   * Get pageScene from Slide.
   * @param pageId
   * @returns {Scene, Engine, UnitModel} scene & engine & unit from renderContext
   */
  getPageRenderUnit(e) {
    const i = this._renderContext.mainComponent.getSubScenes().get(e), { engine: r, unit: s } = this._renderContext;
    return {
      scene: i,
      engine: r,
      unit: s
    };
  }
  createObjectToPage(e, t) {
    const { scene: i } = this.getPageRenderUnit(t);
    if (!i || !this._objectProvider)
      return;
    const r = this._objectProvider.convertToRenderObject(e, i);
    if (r)
      return i.addObject(r), i.attachTransformerTo(r), i.getLayer().makeDirty(), r;
  }
  setObjectActiveByPage(e, t) {
    const { scene: i } = this.getPageRenderUnit(t);
    if (!i) return;
    const r = i.getTransformer();
    r == null || r.activeAnObject(e);
  }
  removeObjectById(e, t) {
    const { scene: i } = this.getPageRenderUnit(t);
    if (!i) return;
    i.removeObject(e);
    const r = i.getTransformer();
    r == null || r.clearControls();
  }
  appendPage() {
    const e = this._getCurrUnitModel(), t = e.getBlankPage(), i = this._currentRender();
    if (t == null || i == null || i.mainComponent == null)
      return;
    const { id: r } = t, s = i.mainComponent, o = this.createPageScene(r, t);
    s && o && s.addPageScene(o), e.appendPage(t), e.setActivePage(t);
  }
};
ve = Yi([
  Ue(1, z(ke)),
  Ue(2, w),
  Ue(3, K)
], ve);
var qi = Object.getOwnPropertyDescriptor, Ji = (n, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? qi(e, t) : e, s = n.length - 1, o; s >= 0; s--)
    (o = n[s]) && (r = o(r) || r);
  return r;
}, Qi = (n, e) => (t, i) => e(t, i, n);
let y = class extends fe {
  constructor(n) {
    super(), this._renderManagerService = n;
  }
  _getSlideRenderControllerFromRenderUnit(n) {
    return this._renderManagerService.getRenderById(n).with(ve);
  }
  createThumbs(n) {
    this._getSlideRenderControllerFromRenderUnit(n).createThumbs();
  }
  activePage(n, e) {
    this._getSlideRenderControllerFromRenderUnit(e).activePage(n);
  }
  getRenderUnitByPageId(n, e) {
    return this._getSlideRenderControllerFromRenderUnit(e).getPageRenderUnit(n);
  }
  createObjectToPage(n, e, t) {
    return this._getSlideRenderControllerFromRenderUnit(t).createObjectToPage(n, e);
  }
  setObjectActiveByPage(n, e, t) {
    return this._getSlideRenderControllerFromRenderUnit(t).setObjectActiveByPage(n, e);
  }
  removeObjectById(n, e, t) {
    this._getSlideRenderControllerFromRenderUnit(t).removeObjectById(n, e);
  }
  /**
   * append blank page
   */
  appendPage(n) {
    this._getSlideRenderControllerFromRenderUnit(n).appendPage();
  }
};
y = Ji([
  Qi(0, K)
], y);
const Vt = {
  id: "slide.operation.activate-slide",
  type: N.OPERATION,
  handler: (n, e) => {
    var h, l;
    const t = e.unitId, i = n.get(y), s = n.get(w).getUnit(t), o = (h = s == null ? void 0 : s.getActivePage()) == null ? void 0 : h.id;
    if (!o) return !1;
    const c = i.getRenderUnitByPageId(o, t);
    if (!c) return !1;
    const a = (l = c.scene) == null ? void 0 : l.getTransformer();
    return a && a.clearControls(), i.activePage(e.id, t), !0;
  }
}, jt = {
  id: "slide.operation.append-slide",
  type: N.OPERATION,
  handler: (n, e) => {
    const t = e.unitId;
    return n.get(w).getUnit(t) ? (n.get(y).appendPage(t), !0) : !1;
  }
}, At = {
  id: "slide.operation.delete-element",
  type: N.OPERATION,
  handler: (n, e) => {
    if (!(e != null && e.id)) return !1;
    const t = e.unitId, r = n.get(w).getUnit(t);
    if (!r) return !1;
    const s = r.getActivePage();
    return delete s.pageElements[e.id], r.updatePage(s.id, s), n.get(y).removeObjectById(e.id, s.id, t), !0;
  }
}, Ge = {
  id: "slide.command.insert-float-image",
  type: N.COMMAND,
  handler: async (n, e) => {
    var U;
    const t = n.get(w), i = (U = t.getCurrentUnitForType(E.UNIVER_SLIDE)) == null ? void 0 : U.getUnitId();
    if (!i) return !1;
    const s = await n.get(wi).openFile({
      multiple: !0,
      accept: xi.map((R) => `.${R.replace("image/", "")}`).join(",")
    });
    if (s.length !== 1) return !1;
    const c = await n.get(Ri).saveImage(s[0]);
    if (!c) return !1;
    const { imageId: a, imageSourceType: h, source: l, base64Cache: d } = c, { width: v, height: m, image: p } = await Oi(d || ""), f = t.getUnit(i);
    if (!f) return !1;
    const g = f.getActivePage(), _ = Object.values(g.pageElements), I = _ != null && _.length ? Math.max(..._.map((R) => R.zIndex)) : 20, b = {
      id: a,
      zIndex: I + 1,
      left: 0,
      top: 0,
      width: v,
      height: m,
      title: "",
      description: "",
      type: Ne.IMAGE,
      image: {
        imageProperties: {
          contentUrl: d,
          imageSourceType: h,
          source: l,
          base64Cache: d,
          image: p
        }
      }
    };
    g.pageElements[a] = b, f.updatePage(g.id, g);
    const T = n.get(y), M = T.createObjectToPage(b, g.id, i);
    return M && T.setObjectActiveByPage(M, g.id, i), !0;
  }
};
function F({ ref: n, ...e }) {
  const { icon: t, id: i, className: r, extend: s, ...o } = e, c = `univerjs-icon univerjs-icon-${i} ${r || ""}`.trim(), a = Dt(`_${nn()}`);
  return Lt(t, `${i}`, {
    defIds: t.defIds,
    idSuffix: a.current
  }, {
    ref: n,
    className: c,
    ...o
  }, s);
}
function Lt(n, e, t, i, r) {
  return H(n.tag, {
    key: e,
    ...en(n, t, r),
    ...i
  }, (tn(n, t).children || []).map((s, o) => Lt(s, `${e}-${n.tag}-${o}`, t, void 0, r)));
}
function en(n, e, t) {
  const i = { ...n.attrs };
  t != null && t.colorChannel1 && i.fill === "colorChannel1" && (i.fill = t.colorChannel1), n.tag === "mask" && i.id && (i.id = i.id + e.idSuffix), Object.entries(i).forEach(([s, o]) => {
    s === "mask" && typeof o == "string" && (i[s] = o.replace(/url\(#(.*)\)/, `url(#$1${e.idSuffix})`));
  });
  const { defIds: r } = e;
  return !r || r.length === 0 || (n.tag === "use" && i["xlink:href"] && (i["xlink:href"] = i["xlink:href"] + e.idSuffix), Object.entries(i).forEach(([s, o]) => {
    typeof o == "string" && (i[s] = o.replace(/url\(#(.*)\)/, `url(#$1${e.idSuffix})`));
  })), i;
}
function tn(n, e) {
  var i;
  const { defIds: t } = e;
  return !t || t.length === 0 ? n : n.tag === "defs" && ((i = n.children) != null && i.length) ? {
    ...n,
    children: n.children.map((r) => typeof r.attrs.id == "string" && t && t.includes(r.attrs.id) ? {
      ...r,
      attrs: {
        ...r.attrs,
        id: r.attrs.id + e.idSuffix
      }
    } : r)
  } : n;
}
function nn() {
  return Math.random().toString(36).substring(2, 8);
}
F.displayName = "UniverIcon";
const rn = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 17 16",
    width: "1em",
    height: "1em"
  },
  children: [
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M14.0045 4.4334C14.8881 4.4334 15.6045 3.71705 15.6045 2.8334C15.6045 1.94974 14.8881 1.2334 14.0045 1.2334H3.70449C2.82084 1.2334 2.10449 1.94974 2.10449 2.8334C2.10449 3.71705 2.82084 4.4334 3.70449 4.4334H14.0045ZM14.4045 2.8334C14.4045 3.05431 14.2254 3.2334 14.0045 3.2334H3.70449C3.48358 3.2334 3.30449 3.05431 3.30449 2.8334C3.30449 2.61248 3.48358 2.4334 3.70449 2.4334H14.0045C14.2254 2.4334 14.4045 2.61249 14.4045 2.8334Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M14.1544 8.5999C15.038 8.5999 15.7544 7.88356 15.7544 6.9999C15.7544 6.11625 15.038 5.3999 14.1544 5.3999H3.85439C2.97074 5.3999 2.25439 6.11625 2.25439 6.9999C2.25439 7.88356 2.97074 8.5999 3.85439 8.5999H14.1544ZM14.5544 6.9999C14.5544 7.22082 14.3753 7.3999 14.1544 7.3999H3.85439C3.63348 7.3999 3.45439 7.22082 3.45439 6.9999C3.45439 6.77899 3.63348 6.5999 3.85439 6.5999H14.1544C14.3753 6.5999 14.5544 6.77899 14.5544 6.9999Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M8.57975 14.5902L6.58023 12.5907C6.34591 12.3564 6.34591 11.9765 6.58023 11.7421C6.81454 11.5078 7.19444 11.5078 7.42876 11.7421L8.40449 12.7179V10.1664C8.40449 9.83504 8.67312 9.56641 9.00449 9.56641C9.33586 9.56641 9.60449 9.83504 9.60449 10.1664V12.7179L10.5802 11.7421C10.8145 11.5078 11.1944 11.5078 11.4288 11.7421C11.6631 11.9765 11.6631 12.3564 11.4288 12.5907L9.42923 14.5902"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M8.57975 14.5902C8.58121 14.5917 8.58268 14.5931 8.58416 14.5946C8.64077 14.6502 8.70566 14.6923 8.77482 14.7209C8.84557 14.7502 8.92314 14.7664 9.00449 14.7664C9.08585 14.7664 9.16342 14.7502 9.23416 14.7209C9.30332 14.6923 9.36821 14.6502 9.42482 14.5946"
      }
    }
  ]
}, $t = Z(function(e, t) {
  return H(F, Object.assign({}, e, {
    id: "bottom-icon",
    ref: t,
    icon: rn
  }));
});
$t.displayName = "BottomIcon";
const sn = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 17 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "g",
    attrs: { clipPath: "url(#graph-icon_clip0_1293_28)" },
    children: [{
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M6.29541 11.1896C3.83208 10.7489 1.9624 8.59552 1.9624 6.00544C1.9624 3.09673 4.32036 0.73877 7.22907 0.73877C9.93483 0.73877 12.164 2.77918 12.4619 5.40527H13.5621C14.998 5.40527 16.1621 6.56933 16.1621 8.00527V12.6719C16.1621 14.1079 14.998 15.2719 13.5621 15.2719H8.89541C7.45947 15.2719 6.29541 14.1079 6.29541 12.6719V11.1896ZM3.1624 6.00544C3.1624 3.75947 4.98311 1.93877 7.22907 1.93877C9.27112 1.93877 10.9616 3.44388 11.2518 5.40527H8.89541C7.45947 5.40527 6.29541 6.56933 6.29541 8.00527V9.96442C4.49946 9.5425 3.1624 7.93012 3.1624 6.00544ZM7.49541 8.00527C7.49541 7.23207 8.12221 6.60527 8.89541 6.60527H13.5621C14.3353 6.60527 14.9621 7.23207 14.9621 8.00527V12.6719C14.9621 13.4451 14.3353 14.0719 13.5621 14.0719H8.89541C8.12221 14.0719 7.49541 13.4451 7.49541 12.6719V8.00527Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    }]
  }, {
    tag: "defs",
    attrs: {},
    children: [{
      tag: "clipPath",
      attrs: { id: "graph-icon_clip0_1293_28" },
      children: [{
        tag: "path",
        attrs: {
          fill: "white",
          d: "M0 0H16V16H0z",
          transform: "translate(.9)"
        }
      }]
    }]
  }],
  defIds: ["graph-icon_clip0_1293_28"]
}, Bt = Z(function(e, t) {
  return H(F, Object.assign({}, e, {
    id: "graph-icon",
    ref: t,
    icon: sn
  }));
});
Bt.displayName = "GraphIcon";
const on = {
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
      d: "M11.3536 6.14645C11.5488 6.34171 11.5488 6.65829 11.3536 6.85355L8.35355 9.85355C8.15829 10.0488 7.84171 10.0488 7.64645 9.85355L4.64645 6.85355C4.45118 6.65829 4.45118 6.34171 4.64645 6.14645C4.84171 5.95118 5.15829 5.95118 5.35355 6.14645L8 8.79289L10.6464 6.14645C10.8417 5.95118 11.1583 5.95118 11.3536 6.14645Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, Xe = Z(function(e, t) {
  return H(F, Object.assign({}, e, {
    id: "more-down-icon",
    ref: t,
    icon: on
  }));
});
Xe.displayName = "MoreDownIcon";
const cn = {
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
      d: "M1.25 2.96401C1.25 3.84767 1.96634 4.56401 2.85 4.56401H13.15C14.0337 4.56401 14.75 3.84767 14.75 2.96401C14.75 2.08036 14.0337 1.36401 13.15 1.36401H2.85C1.96635 1.36401 1.25 2.08036 1.25 2.96401ZM2.85 3.36401C2.62909 3.36401 2.45 3.18493 2.45 2.96401C2.45 2.7431 2.62909 2.56401 2.85 2.56401H13.15C13.3709 2.56401 13.55 2.7431 13.55 2.96401C13.55 3.18493 13.3709 3.36401 13.15 3.36401H2.85Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }, {
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M5.57564 11.6118C5.80995 11.3774 6.18985 11.3774 6.42417 11.6118L7.3999 12.5875V6.36951C7.3999 6.03814 7.66853 5.76951 7.9999 5.76951C8.33127 5.76951 8.5999 6.03814 8.5999 6.36951V12.5875L9.57564 11.6118C9.80995 11.3774 10.1899 11.3774 10.4242 11.6118C10.6585 11.8461 10.6585 12.226 10.4242 12.4603L8.4324 14.452C8.32324 14.5655 8.16982 14.6362 7.9999 14.6362C7.82998 14.6362 7.67655 14.5655 7.56739 14.452L5.57564 12.4603C5.34132 12.226 5.34132 11.8461 5.57564 11.6118Z"
    }
  }]
}, Ht = Z(function(e, t) {
  return H(F, Object.assign({}, e, {
    id: "move-down-icon",
    ref: t,
    icon: cn
  }));
});
Ht.displayName = "MoveDownIcon";
const an = {
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
      d: "M1.25 13.036C1.25 12.1523 1.96634 11.436 2.85 11.436H13.15C14.0337 11.436 14.75 12.1523 14.75 13.036C14.75 13.9196 14.0337 14.636 13.15 14.636H2.85C1.96635 14.636 1.25 13.9196 1.25 13.036ZM2.85 12.636C2.62909 12.636 2.45 12.8151 2.45 13.036C2.45 13.2569 2.62909 13.436 2.85 13.436H13.15C13.3709 13.436 13.55 13.2569 13.55 13.036C13.55 12.8151 13.3709 12.636 13.15 12.636H2.85Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }, {
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M5.57564 4.38825C5.80995 4.62256 6.18985 4.62256 6.42417 4.38825L7.3999 3.41251V9.63049C7.3999 9.96186 7.66853 10.2305 7.9999 10.2305C8.33127 10.2305 8.5999 9.96186 8.5999 9.63049V3.41251L9.57564 4.38825C9.80995 4.62256 10.1899 4.62256 10.4242 4.38825C10.6585 4.15393 10.6585 3.77403 10.4242 3.53972L8.4324 1.54796C8.32324 1.43445 8.16982 1.36382 7.9999 1.36382C7.82998 1.36382 7.67655 1.43446 7.56739 1.54797L5.57564 3.53972C5.34132 3.77403 5.34132 4.15393 5.57564 4.38825Z"
    }
  }]
}, Ft = Z(function(e, t) {
  return H(F, Object.assign({}, e, {
    id: "move-up-icon",
    ref: t,
    icon: an
  }));
});
Ft.displayName = "MoveUpIcon";
const ln = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 17 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "g",
    attrs: {
      fill: "currentColor",
      clipPath: "url(#text-icon_clip0_1293_26)"
    },
    children: [{
      tag: "path",
      attrs: { d: "M2.22891 2.07227C1.89754 2.07227 1.62891 2.34089 1.62891 2.67227C1.62891 3.00364 1.89754 3.27227 2.22891 3.27227H6.29541V14.0056C6.29541 14.337 6.56404 14.6056 6.89541 14.6056C7.22678 14.6056 7.49541 14.337 7.49541 14.0056V3.27227H11.5622C11.8936 3.27227 12.1622 3.00364 12.1622 2.67227C12.1622 2.34089 11.8936 2.07227 11.5622 2.07227H2.22891Z" }
    }, {
      tag: "path",
      attrs: { d: "M10.2289 6.40552C9.89754 6.40552 9.62891 6.67415 9.62891 7.00552C9.62891 7.33689 9.89754 7.60552 10.2289 7.60552H12.2954V14.0055C12.2954 14.3369 12.564 14.6055 12.8954 14.6055C13.2268 14.6055 13.4954 14.3369 13.4954 14.0055V7.60552H15.5622C15.8936 7.60552 16.1622 7.33689 16.1622 7.00552C16.1622 6.67415 15.8936 6.40552 15.5622 6.40552H10.2289Z" }
    }]
  }, {
    tag: "defs",
    attrs: {},
    children: [{
      tag: "clipPath",
      attrs: { id: "text-icon_clip0_1293_26" },
      children: [{
        tag: "path",
        attrs: {
          fill: "white",
          d: "M0 0H16V16H0z",
          transform: "translate(.9)"
        }
      }]
    }]
  }],
  defIds: ["text-icon_clip0_1293_26"]
}, Wt = Z(function(e, t) {
  return H(F, Object.assign({}, e, {
    id: "text-icon",
    ref: t,
    icon: ln
  }));
});
Wt.displayName = "TextIcon";
const dn = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 17 16",
    width: "1em",
    height: "1em"
  },
  children: [
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M7.82994 1.40913C7.88746 1.35161 7.95376 1.30821 8.02453 1.27893C8.09527 1.24959 8.17285 1.2334 8.2542 1.2334C8.33555 1.2334 8.41313 1.24959 8.48387 1.27893C8.55464 1.30821 8.62094 1.35161 8.67846 1.40913L10.6785 3.40913C10.9128 3.64345 10.9128 4.02335 10.6785 4.25766C10.4441 4.49198 10.0642 4.49198 9.82994 4.25766L8.8542 3.28193V5.8334C8.8542 6.16477 8.58557 6.4334 8.2542 6.4334C7.92283 6.4334 7.6542 6.16477 7.6542 5.8334V3.28193L6.67846 4.25766C6.44415 4.49198 6.06425 4.49198 5.82994 4.25766C5.59562 4.02335 5.59562 3.64345 5.82994 3.40913L7.82994 1.40913Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M1.50439 9C1.50439 8.11634 2.22074 7.4 3.10439 7.4H13.4044C14.288 7.4 15.0044 8.11634 15.0044 9C15.0044 9.88366 14.2881 10.6 13.4044 10.6H3.1044C2.22074 10.6 1.50439 9.88366 1.50439 9ZM3.10439 8.6C2.88348 8.6 2.70439 8.77909 2.70439 9C2.70439 9.22091 2.88348 9.4 3.1044 9.4H13.4044C13.6253 9.4 13.8044 9.22091 13.8044 9C13.8044 8.77909 13.6253 8.6 13.4044 8.6H3.10439Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M1.6543 13.1665C1.6543 12.2828 2.37064 11.5665 3.2543 11.5665H13.5543C14.438 11.5665 15.1543 12.2828 15.1543 13.1665C15.1543 14.0502 14.438 14.7665 13.5543 14.7665H3.2543C2.37064 14.7665 1.6543 14.0502 1.6543 13.1665ZM3.2543 12.7665C3.03338 12.7665 2.8543 12.9456 2.8543 13.1665C2.8543 13.3874 3.03338 13.5665 3.2543 13.5665H13.5543C13.7752 13.5665 13.9543 13.3874 13.9543 13.1665C13.9543 12.9456 13.7752 12.7665 13.5543 12.7665H3.2543Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    }
  ]
}, kt = Z(function(e, t) {
  return H(F, Object.assign({}, e, {
    id: "topmost-icon",
    ref: t,
    icon: dn
  }));
});
kt.displayName = "TopmostIcon";
const un = {
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
        fill: "colorChannel1",
        d: "M11.0363 12.2367V14.0367C11.0363 14.3681 11.3049 14.6367 11.6363 14.6367C11.9676 14.6367 12.2363 14.3681 12.2363 14.0367V12.2367H14.0364C14.3677 12.2367 14.6364 11.9681 14.6364 11.6367C14.6364 11.3054 14.3677 11.0367 14.0364 11.0367H12.2363V9.23672C12.2363 8.90535 11.9676 8.63672 11.6363 8.63672C11.3049 8.63672 11.0363 8.90535 11.0363 9.23672V11.0367H9.23635C8.90498 11.0367 8.63635 11.3054 8.63635 11.6367C8.63635 11.9681 8.90498 12.2367 9.23635 12.2367H11.0363Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M2.56365 1.36377C1.90091 1.36377 1.36365 1.90103 1.36365 2.56377V6.16377C1.36365 6.82651 1.90091 7.36377 2.56365 7.36377H6.16365C6.82639 7.36377 7.36365 6.82651 7.36365 6.16377V2.56377C7.36365 1.90103 6.82639 1.36377 6.16365 1.36377H2.56365ZM6.16365 2.56377H2.56365L2.56365 6.16377H6.16365V2.56377Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M2.56365 8.63647C1.90091 8.63647 1.36365 9.17373 1.36365 9.83647V13.4365C1.36365 14.0992 1.90091 14.6365 2.56365 14.6365H6.16365C6.82639 14.6365 7.36365 14.0992 7.36365 13.4365V9.83647C7.36365 9.17373 6.82639 8.63647 6.16365 8.63647H2.56365ZM6.16365 9.83647H2.56365L2.56365 13.4365H6.16365V9.83647Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M9.83635 7.36377C9.17361 7.36377 8.63635 6.82651 8.63635 6.16377V2.56377C8.63635 1.90103 9.17361 1.36377 9.83635 1.36377H13.4364C14.0991 1.36377 14.6364 1.90103 14.6364 2.56377V6.16377C14.6364 6.82651 14.0991 7.36377 13.4364 7.36377H9.83635ZM9.83635 6.16377V2.56377L13.4364 2.56377V6.16377H9.83635Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    }
  ]
}, zt = Z(function(e, t) {
  return H(F, Object.assign({}, e, {
    id: "autofill-double-icon",
    ref: t,
    icon: un
  }));
});
zt.displayName = "AutofillDoubleIcon";
const hn = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 17 16",
    width: "1em",
    height: "1em"
  },
  children: [
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M8.01281 1.36643C8.79386 0.585377 10.0602 0.585378 10.8412 1.36643L12.9223 3.44752C13.7034 4.22857 13.7034 5.4949 12.9223 6.27595L9.36445 9.83383C8.5834 10.6149 7.31707 10.6149 6.53602 9.83383L4.45493 7.75273C3.67388 6.97168 3.67388 5.70535 4.45493 4.9243L8.01281 1.36643ZM9.9927 2.21495C9.68028 1.90253 9.17375 1.90253 8.86133 2.21495L5.30346 5.77283L5.29671 5.77966L10.839 6.66224L12.0738 5.42742C12.3862 5.115 12.3862 4.60847 12.0738 4.29605L9.9927 2.21495Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M14.5179 9.48875C14.5179 9.99175 14.1101 10.3995 13.607 10.3995C13.1041 10.3995 12.6963 9.99175 12.6963 9.48875C12.6963 9.1773 13.0455 8.59966 13.3114 8.20487C13.4549 7.99177 13.7591 7.99177 13.9027 8.20486C14.1687 8.59965 14.5179 9.1773 14.5179 9.48875Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "colorChannel1",
        d: "M1.98682 13.4992C1.98682 12.5603 2.74793 11.7992 3.68682 11.7992H14.2868C15.2257 11.7992 15.9868 12.5603 15.9868 13.4992V13.4992C15.9868 14.4381 15.2257 15.1992 14.2868 15.1992H3.68682C2.74793 15.1992 1.98682 14.4381 1.98682 13.4992V13.4992Z"
      }
    }
  ]
}, Kt = Z(function(e, t) {
  return H(F, Object.assign({}, e, {
    id: "paint-bucket-double-icon",
    ref: t,
    icon: hn
  }));
});
Kt.displayName = "PaintBucketDoubleIcon";
const B = {
  id: "slide.operation.update-element",
  type: N.OPERATION,
  handler: (n, e) => {
    const { oKey: t, props: i } = e, r = n.get(w), s = e == null ? void 0 : e.unitId, o = r.getUnit(s);
    if (!o) return !1;
    const c = o.getActivePage();
    return c.pageElements[t] = St(c.pageElements[t], i), o.updatePage(c.id, c), !0;
  }
};
function gn(n) {
  const { pageId: e, unitId: t } = n, i = O(J), r = O(y), s = O(D), o = r.getRenderUnitByPageId(e, t), c = o == null ? void 0 : o.scene;
  if (!c) return null;
  const a = c.getTransformer();
  if (!a) return null;
  const l = a.getSelectedObjectMap().values().next().value;
  if (!l) return null;
  const d = (v) => {
    const m = c.getAllObjects(), [p, f] = m.reduce(([_, I], b) => {
      const T = b.zIndex, M = T < _ ? T : _, U = T > I ? T : I;
      return [M, U];
    }, [0, 0]);
    let g = l.zIndex;
    v === 3 ? g = p - 1 : v === 2 ? g = f + 1 : v === 0 ? g = l.zIndex + 1 : v === 1 && (g = l.zIndex - 1), l.setProps({
      zIndex: g
    }), s.executeCommand(B.id, {
      unitId: t,
      oKey: l == null ? void 0 : l.oKey,
      props: {
        zIndex: g
      }
    });
  };
  return /* @__PURE__ */ x("div", { className: "univer-relative univer-w-full", children: [
    /* @__PURE__ */ u("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: /* @__PURE__ */ u(
      "div",
      {
        className: "univer-w-full univer-text-left univer-text-gray-600 dark:!univer-text-gray-200",
        children: /* @__PURE__ */ u("div", { children: i.t("image-panel.arrange.title") })
      }
    ) }),
    /* @__PURE__ */ x("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: [
      /* @__PURE__ */ u("div", { className: "univer-w-1/2", children: /* @__PURE__ */ u(Ce, { onClick: () => {
        d(
          0
          /* forward */
        );
      }, children: /* @__PURE__ */ x("span", { className: "univer-flex univer-items-center univer-gap-1", children: [
        /* @__PURE__ */ u(Ft, {}),
        i.t("image-panel.arrange.forward")
      ] }) }) }),
      /* @__PURE__ */ u("div", { className: "univer-w-1/2", children: /* @__PURE__ */ u(Ce, { onClick: () => {
        d(
          1
          /* backward */
        );
      }, children: /* @__PURE__ */ x("span", { className: "univer-flex univer-items-center univer-gap-1", children: [
        /* @__PURE__ */ u(Ht, {}),
        i.t("image-panel.arrange.backward")
      ] }) }) })
    ] }),
    /* @__PURE__ */ x("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: [
      /* @__PURE__ */ u("div", { className: "univer-w-1/2", children: /* @__PURE__ */ u(Ce, { onClick: () => {
        d(
          2
          /* front */
        );
      }, children: /* @__PURE__ */ x("span", { className: "univer-flex univer-items-center univer-gap-1", children: [
        /* @__PURE__ */ u(kt, {}),
        i.t("image-panel.arrange.front")
      ] }) }) }),
      /* @__PURE__ */ u("div", { className: "univer-w-1/2", children: /* @__PURE__ */ u(Ce, { onClick: () => {
        d(
          3
          /* back */
        );
      }, children: /* @__PURE__ */ x("span", { className: "univer-flex univer-items-center univer-gap-1", children: [
        /* @__PURE__ */ u($t, {}),
        i.t("image-panel.arrange.back")
      ] }) }) })
    ] })
  ] });
}
function vn(n) {
  var p, f;
  const { pageId: e, unitId: t } = n, i = O(J), r = O(y), s = O(D), o = r.getRenderUnitByPageId(e, t), c = o == null ? void 0 : o.scene;
  if (!c) return null;
  const a = c.getTransformer();
  if (!a) return null;
  const l = a.getSelectedObjectMap().values().next().value;
  if (!l) return null;
  const [d, v] = $((f = (p = l.fill) == null ? void 0 : p.toString()) != null ? f : "");
  function m(g) {
    l == null || l.setProps({
      fill: g
    }), s.executeCommand(B.id, {
      unitId: t,
      oKey: l == null ? void 0 : l.oKey,
      props: {
        shape: {
          shapeProperties: {
            shapeBackgroundFill: {
              rgb: g
            }
          }
        }
      }
    }), v(g);
  }
  return /* @__PURE__ */ u(
    "div",
    {
      className: k("univer-relative univer-bottom-0 univer-mt-5 univer-w-full", Nt),
      children: /* @__PURE__ */ x("div", { className: "univer-relative univer-w-full", children: [
        /* @__PURE__ */ u("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: /* @__PURE__ */ u(
          "div",
          {
            className: "univer-w-full univer-text-left univer-text-gray-600 dark:!univer-text-gray-200",
            children: /* @__PURE__ */ u("div", { children: i.t("slide.panel.fill.title") })
          }
        ) }),
        /* @__PURE__ */ u("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: /* @__PURE__ */ u("div", { className: "univer-w-1/2", children: /* @__PURE__ */ u(
          Mt,
          {
            overlay: /* @__PURE__ */ u("div", { className: "univer-rounded-lg univer-p-4", children: /* @__PURE__ */ u(
              Ai,
              {
                value: "#fff",
                onChange: m
              }
            ) }),
            children: /* @__PURE__ */ x("a", { className: "univer-flex univer-cursor-pointer univer-items-center univer-gap-1", children: [
              /* @__PURE__ */ u(Kt, { className: "univer-fill-primary-600" }),
              /* @__PURE__ */ u(Xe, {})
            ] })
          }
        ) }) })
      ] })
    }
  );
}
function fn(n) {
  const { pageId: e, unitId: t } = n, i = O(J), r = O(y), s = O(D), o = r.getRenderUnitByPageId(e, t), c = o == null ? void 0 : o.scene;
  if (!c) return null;
  const a = c.getTransformer();
  if (!a) return null;
  const l = a.getSelectedObjectMap().values().next().value;
  if (!l) return null;
  const {
    width: d = 0,
    height: v = 0,
    left: m = 0,
    top: p = 0,
    angle: f = 0
  } = l, [g, _] = $(d), [I, b] = $(v), [T, M] = $(m), [U, R] = $(p), [W, oe] = $(f), A = (C) => {
    const { objects: ce } = C, ae = ce.values().next().value, {
      width: ti = 0,
      height: ii = 0,
      left: ni = 0,
      top: ri = 0,
      angle: si = 0
    } = ae;
    _(ti), b(ii), M(ni), R(ri), oe(si);
  };
  ge(() => {
    const C = a.changeStart$.subscribe((ae) => {
      A(ae);
    }), ce = a.changing$.subscribe((ae) => {
      A(ae);
    });
    return () => {
      ce.unsubscribe(), C.unsubscribe();
    };
  }, []);
  function L(C) {
    !C || !l || (s.executeCommand(B.id, {
      pageId: e,
      oKey: l.oKey,
      props: {
        width: C
      }
    }), l == null || l.resize(C, l.height), _(C), a == null || a.refreshControls());
  }
  function Q(C) {
    !C || !l || (s.executeCommand(B.id, {
      pageId: e,
      oKey: l.oKey,
      props: {
        height: C
      }
    }), l == null || l.resize(l.width, C), b(C), a == null || a.refreshControls());
  }
  function ee(C) {
    !C || !l || (s.executeCommand(B.id, {
      pageId: e,
      oKey: l.oKey,
      props: {
        left: C
      }
    }), l == null || l.translate(C, l.top), M(C), a == null || a.refreshControls());
  }
  function me(C) {
    !C || !l || (s.executeCommand(B.id, {
      pageId: e,
      oKey: l.oKey,
      props: {
        right: C
      }
    }), l == null || l.translate(l.left, C), R(C), a == null || a.refreshControls());
  }
  function _e(C) {
    !C || !l || (s.executeCommand(B.id, {
      pageId: e,
      oKey: l.oKey,
      props: {
        angle: C
      }
    }), l == null || l.transformByState({
      angle: C
    }), oe(C), a == null || a.refreshControls());
  }
  return /* @__PURE__ */ x(
    "div",
    {
      className: k("univer-relative univer-bottom-0 univer-mt-5 univer-w-full", Nt),
      children: [
        /* @__PURE__ */ u("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: /* @__PURE__ */ u(
          "div",
          {
            className: "univer-w-full univer-text-left univer-text-gray-600 dark:!univer-text-gray-200",
            children: /* @__PURE__ */ u("div", { children: i.t("image-panel.transform.title") })
          }
        ) }),
        /* @__PURE__ */ x("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: [
          /* @__PURE__ */ u("div", { className: "univer-w-1/3", children: /* @__PURE__ */ x("label", { children: [
            /* @__PURE__ */ u("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: /* @__PURE__ */ u("div", { className: "univer-w-full", children: i.t("image-panel.transform.width") }) }),
            /* @__PURE__ */ u("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: /* @__PURE__ */ u("div", { className: "univer-w-full", children: /* @__PURE__ */ u(
              le,
              {
                className: "univer-w-11/12",
                min: 1,
                value: g,
                onChange: (C) => {
                  L(C);
                }
              }
            ) }) })
          ] }) }),
          /* @__PURE__ */ u("div", { className: "univer-w-1/3", children: /* @__PURE__ */ x("label", { children: [
            /* @__PURE__ */ u("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: /* @__PURE__ */ u("div", { className: "univer-w-full", children: i.t("image-panel.transform.height") }) }),
            /* @__PURE__ */ u("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: /* @__PURE__ */ u("div", { className: "univer-w-full", children: /* @__PURE__ */ u(
              le,
              {
                className: "univer-w-11/12",
                min: 1,
                value: I,
                onChange: (C) => {
                  Q(C);
                }
              }
            ) }) })
          ] }) })
        ] }),
        /* @__PURE__ */ x("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: [
          /* @__PURE__ */ u("div", { className: "univer-w-1/3", children: /* @__PURE__ */ x("label", { children: [
            /* @__PURE__ */ u("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: /* @__PURE__ */ u("div", { className: "univer-w-full", children: i.t("image-panel.transform.x") }) }),
            /* @__PURE__ */ u("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: /* @__PURE__ */ u("div", { className: "univer-w-full", children: /* @__PURE__ */ u(
              le,
              {
                className: "univer-w-11/12",
                precision: 1,
                min: 0,
                value: T,
                onChange: (C) => {
                  ee(C);
                }
              }
            ) }) })
          ] }) }),
          /* @__PURE__ */ u("div", { className: "univer-w-1/3", children: /* @__PURE__ */ x("label", { children: [
            /* @__PURE__ */ u("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: /* @__PURE__ */ u("div", { className: "univer-w-full", children: i.t("image-panel.transform.y") }) }),
            /* @__PURE__ */ u("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: /* @__PURE__ */ u("div", { className: "univer-w-full", children: /* @__PURE__ */ u(
              le,
              {
                className: "univer-w-11/12",
                precision: 1,
                min: 0,
                value: U,
                onChange: (C) => {
                  me(C);
                }
              }
            ) }) })
          ] }) }),
          /* @__PURE__ */ u("div", { className: "univer-w-1/3", children: /* @__PURE__ */ x("label", { children: [
            /* @__PURE__ */ u("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: /* @__PURE__ */ u("div", { className: "univer-w-full", children: i.t("image-panel.transform.rotate") }) }),
            /* @__PURE__ */ u("div", { className: "univer-relative univer-mt-2.5 univer-flex univer-h-full", children: /* @__PURE__ */ u("div", { className: "univer-w-full", children: /* @__PURE__ */ u(
              le,
              {
                className: "univer-w-11/12",
                precision: 1,
                value: W,
                onChange: _e
              }
            ) }) })
          ] }) })
        ] })
      ]
    }
  );
}
const Ee = "COMPONENT_SLIDE_SIDEBAR";
function pn() {
  var h, l, d;
  const n = O(w), e = O(y), t = n.getCurrentUnitForType(E.UNIVER_SLIDE), i = (h = t == null ? void 0 : t.getActivePage()) == null ? void 0 : h.id, r = ((l = n.getFocusedUnit()) == null ? void 0 : l.getUnitId()) || "";
  if (!i || !r) return null;
  const o = (d = e.getRenderUnitByPageId(i, r).scene) == null ? void 0 : d.getTransformer();
  if (!o) return null;
  const a = o.getSelectedObjectMap().values().next().value;
  return a ? /* @__PURE__ */ x("section", { className: "univer-p-2 univer-text-center univer-text-sm", children: [
    /* @__PURE__ */ u(gn, { pageId: i, unitId: r }),
    /* @__PURE__ */ u(fn, { pageId: i, unitId: r }),
    a.objectType === de.RECT && /* @__PURE__ */ u(vn, { pageId: i, unitId: r })
  ] }) : null;
}
const Ye = {
  id: "slide.command.insert-float-shape.rectangle",
  type: N.COMMAND,
  handler: async (n) => {
    var r;
    const e = n.get(D), i = (r = n.get(w).getFocusedUnit()) == null ? void 0 : r.getUnitId();
    return e.executeCommand(Zt.id, { unitId: i });
  }
}, Zt = {
  id: "slide.operation.insert-float-shape.rectangle",
  type: N.OPERATION,
  handler: async (n, e) => {
    const t = ze(6), i = n.get(w), r = e.unitId, s = i.getUnit(r);
    if (!s) return !1;
    const o = s.getActivePage(), c = Object.values(o.pageElements), a = c != null && c.length ? Math.max(...c.map((v) => v.zIndex)) : 20, h = {
      id: t,
      zIndex: a + 1,
      left: 378,
      top: 142,
      width: 250,
      height: 250,
      title: t,
      description: "",
      type: Ne.SHAPE,
      shape: {
        shapeType: It.Rect,
        text: "",
        shapeProperties: {
          shapeBackgroundFill: {
            rgb: "rgb(0,0,255)"
          }
        }
      }
    };
    o.pageElements[t] = h, s.updatePage(o.id, o);
    const l = n.get(y), d = l.createObjectToPage(h, o.id, r);
    return d && l.setObjectActiveByPage(d, o.id, r), !0;
  }
}, $e = {
  id: "sidebar.operation.slide-shape",
  type: N.COMMAND,
  handler: async (n, e) => {
    const { visible: t, objectType: i } = e, r = n.get(Tt), s = n.get(J);
    let o = "", c = "";
    return i === de.RECT ? (o = "slide.sidebar.shape", c = Ee) : i === de.IMAGE ? (o = "slide.sidebar.image", c = Ee) : i === de.RICH_TEXT && (o = "slide.sidebar.text", c = Ee), t ? r.open({
      header: { title: s.t(o) },
      children: { label: c },
      onClose: () => {
      },
      width: 360
    }) : r.close(), !0;
  }
}, qe = {
  id: "slide.command.insert-float-shape.ellipse",
  type: N.COMMAND,
  handler: async (n) => {
    var r;
    const e = n.get(D), i = (r = n.get(w).getFocusedUnit()) == null ? void 0 : r.getUnitId();
    return e.executeCommand(Gt.id, { unitId: i });
  }
}, Gt = {
  id: "slide.operation.insert-float-shape.ellipse",
  type: N.OPERATION,
  handler: async (n, e) => {
    const t = ze(6), i = n.get(w), r = e.unitId, s = i.getUnit(r);
    if (!s) return !1;
    const o = s.getActivePage(), c = Object.values(o.pageElements), a = c != null && c.length ? Math.max(...c.map((v) => v.zIndex)) : 20, h = {
      id: t,
      zIndex: a + 1,
      left: 378,
      top: 142,
      width: 250,
      height: 250,
      title: t,
      description: "",
      type: Ne.SHAPE,
      shape: {
        shapeType: It.Ellipse,
        text: "",
        shapeProperties: {
          radius: 100,
          shapeBackgroundFill: {
            rgb: "rgb(0,0,255)"
          }
        }
      }
    };
    o.pageElements[t] = h, s.updatePage(o.id, o);
    const l = n.get(y), d = l.createObjectToPage(h, o.id, r);
    return d && l.setObjectActiveByPage(d, o.id, r), !0;
  }
}, Je = {
  id: "slide.command.add-text",
  type: N.COMMAND,
  handler: async (n) => {
    var r;
    const e = n.get(D), i = (r = n.get(w).getFocusedUnit()) == null ? void 0 : r.getUnitId();
    return await e.executeCommand(Xt.id, { unitId: i });
  }
}, Xt = {
  id: "slide.operation.add-text",
  type: N.OPERATION,
  handler: async (n, e) => {
    const t = e.unitId, i = ze(6), r = 220, s = 40, o = 230, c = 142, a = (e == null ? void 0 : e.text) || "A New Text", l = n.get(w).getUnit(t);
    if (!l) return !1;
    const d = l.getActivePage(), v = Object.values(d.pageElements), m = v != null && v.length ? Math.max(...v.map((_) => _.zIndex)) : 21, p = {
      id: i,
      zIndex: m + 1,
      left: o,
      top: c,
      width: r,
      height: s,
      title: "text",
      description: "",
      type: Ne.TEXT,
      richText: {
        text: a,
        fs: 30,
        cl: {
          rgb: "rgb(51, 51, 51)"
        },
        bl: 1
      }
    };
    d.pageElements[i] = p, l.updatePage(d.id, d);
    const f = n.get(y), g = f.createObjectToPage(p, d.id, t);
    return g && f.setObjectActiveByPage(g, d.id, t), !0;
  }
}, Yt = {
  id: "slide.operation.set-slide-page-thumb",
  type: N.OPERATION,
  handler: (n, e) => (n.get(y).createThumbs(e.unitId), !0)
};
function mn() {
  var p, f;
  const n = O(w), e = O(D), t = O(K), i = O(J), r = Dt(null), s = n.getCurrentUnitForType(E.UNIVER_SLIDE), o = s == null ? void 0 : s.getPages(), c = s == null ? void 0 : s.getPageOrder();
  if (!o || !c)
    return null;
  const a = c.map((g) => o[g]), [h, l] = $((f = (p = s == null ? void 0 : s.getActivePage()) == null ? void 0 : p.id) != null ? f : null), d = $i(() => a.map(() => Bi()), [a]);
  ge(() => {
    const g = s == null ? void 0 : s.activePage$.subscribe((_) => {
      var b;
      const I = (b = _ == null ? void 0 : _.id) != null ? b : null;
      I && l(I);
    });
    return () => {
      g == null || g.unsubscribe();
    };
  }, []), ge(() => {
    d.forEach((g, _) => {
      var I;
      if (g.current) {
        const b = a[_];
        (I = t.getRenderById(b.id)) == null || I.engine.setContainer(g.current);
      }
    }), d.length > 0 && e.syncExecuteCommand(Yt.id, { unitId: s == null ? void 0 : s.getUnitId() });
  }, [d, a, t, e, s]);
  const v = lt((g) => {
    e.syncExecuteCommand(Vt.id, { id: g, unitId: s == null ? void 0 : s.getUnitId() });
  }, [e, s]), m = lt(() => {
    e.syncExecuteCommand(jt.id, { unitId: s == null ? void 0 : s.getUnitId() });
  }, [e, s]);
  return /* @__PURE__ */ u(
    "aside",
    {
      ref: r,
      className: k("univer-flex univer-h-full univer-w-64 univer-flex-col univer-overflow-y-auto univer-overflow-x-hidden", Li),
      children: /* @__PURE__ */ x("div", { className: "univer-px-4", children: [
        /* @__PURE__ */ u("header", { className: "univer-flex univer-justify-center univer-pt-4", children: /* @__PURE__ */ u(
          "a",
          {
            className: k("univer-box-border univer-block univer-h-8 univer-w-full univer-cursor-pointer univer-rounded-md univer-bg-white univer-text-center univer-text-sm univer-leading-8 univer-transition-colors", he),
            onClick: m,
            children: i.t("slide.append")
          }
        ) }),
        a.map((g, _) => /* @__PURE__ */ x(
          "div",
          {
            className: k("univer-my-4 univer-flex univer-gap-2", {
              "[&>div]:univer-border-primary-600 [&>span]:univer-text-primary-600": g.id === h
            }),
            onClick: () => v(g.id),
            children: [
              /* @__PURE__ */ u("span", { children: _ + 1 }),
              /* @__PURE__ */ u(
                "div",
                {
                  ref: d[_],
                  className: k("univer-relative univer-box-border univer-h-32 univer-w-52 univer-bg-white hover:univer-border-primary-600", he)
                }
              )
            ]
          },
          g.id
        ))
      ] })
    }
  );
}
const ue = di("SLIDE_EDITOR"), qt = "slide.menu.image";
function _n(n) {
  return {
    id: qt,
    type: se.SUBITEMS,
    icon: "AddImageIcon",
    tooltip: "slide.image.insert.title",
    hidden$: re(n, E.UNIVER_SLIDE)
  };
}
function Cn(n) {
  return {
    id: Ge.id,
    title: "slide.image.insert.float",
    type: se.BUTTON,
    hidden$: re(n, E.UNIVER_SLIDE)
  };
}
const Jt = "slide.menu.shape";
function Sn(n) {
  return {
    id: Jt,
    type: se.SUBITEMS,
    icon: "GraphIcon",
    tooltip: "slide.shape.insert.title",
    hidden$: re(n, E.UNIVER_SLIDE)
    // disabled$: getCurrentRangeDisable$(accessor, { workbookTypes: [WorkbookEditablePermission], worksheetTypes: [WorksheetEditPermission], rangeTypes: [RangeProtectionPermissionEditPoint] }),
  };
}
function In(n) {
  return {
    id: Ye.id,
    title: "slide.shape.insert.rectangle",
    type: se.BUTTON,
    hidden$: re(n, E.UNIVER_SLIDE)
  };
}
function bn(n) {
  return {
    id: qe.id,
    title: "slide.shape.insert.ellipse",
    type: se.BUTTON,
    hidden$: re(n, E.UNIVER_SLIDE)
  };
}
function En(n) {
  return {
    id: Je.id,
    type: se.BUTTON,
    icon: "TextIcon",
    tooltip: "slide.text.insert.title",
    hidden$: re(n, E.UNIVER_SLIDE)
  };
}
const xn = {
  [Pi.FORMAT]: {
    [Je.id]: {
      order: 0,
      menuItemFactory: En
    },
    [qt]: {
      order: 0,
      menuItemFactory: _n,
      [Ge.id]: {
        order: 0,
        menuItemFactory: Cn
      }
    },
    [Jt]: {
      order: 0,
      menuItemFactory: Sn,
      [Ye.id]: {
        order: 0,
        menuItemFactory: In
      },
      [qe.id]: {
        order: 0,
        menuItemFactory: bn
      }
    }
  }
}, Oe = {
  id: "slide.operation.edit-arrow",
  type: N.OPERATION,
  handler: () => !0
}, Qt = "COMPONENT_SLIDE_IMAGE_POPUP_MENU";
function Rn(n) {
  var p, f;
  const e = (f = (p = n.popup) == null ? void 0 : p.extraProps) == null ? void 0 : f.menuItems;
  if (!e)
    return null;
  const t = O(D), i = O(J), [r, s] = $(!1), [o, c] = $(!1), a = () => {
    c(!0);
  }, h = () => {
    c(!1);
  }, l = (g) => {
    s(g);
  }, d = (g) => {
    t.executeCommand(g.commandId, g.commandParams), s(!1);
  }, v = r || o, m = e.filter((g) => !g.disable);
  return /* @__PURE__ */ u(
    "div",
    {
      onMouseEnter: a,
      onMouseLeave: h,
      children: /* @__PURE__ */ u(
        Mt,
        {
          align: "start",
          overlay: /* @__PURE__ */ u(
            "ul",
            {
              className: k("univer-m-0 univer-box-border univer-grid univer-list-none univer-items-center univer-gap-1 univer-rounded-lg univer-bg-white univer-p-1.5 univer-text-sm univer-shadow-lg", he),
              children: m.map((g) => /* @__PURE__ */ u(
                "li",
                {
                  className: "univer-relative univer-box-border univer-flex univer-h-8 univer-cursor-pointer univer-items-center univer-rounded univer-text-sm univer-transition-colors hover:univer-bg-gray-100",
                  onClick: () => d(g),
                  children: /* @__PURE__ */ u("span", { className: "univer-px-2 univer-py-1.5 univer-align-middle", children: i.t(g.label) })
                },
                g.index
              ))
            }
          ),
          open: r,
          onOpenChange: l,
          children: /* @__PURE__ */ x(
            "div",
            {
              className: k("univer-flex univer-items-center univer-gap-2 univer-rounded univer-p-1 hover:univer-bg-gray-100 dark:hover:!univer-bg-gray-800", he, {
                "univer-bg-gray-100 dark:!univer-bg-gray-800": r,
                "univer-bg-white dark:!univer-bg-gray-900": !r
              }),
              children: [
                /* @__PURE__ */ u(
                  zt,
                  {
                    className: "univer-fill-primary-600 univer-text-gray-900 dark:!univer-text-white"
                  }
                ),
                v && /* @__PURE__ */ u(Xe, { className: "dark:!univer-text-white" })
              ]
            }
          )
        }
      )
    }
  );
}
class On {
  constructor() {
    S(this, "_state", null);
    S(this, "_rect", null);
    S(this, "_state$", new q(null));
    S(this, "state$", this._state$.asObservable());
    S(this, "_rect$", new q(null));
    S(this, "rect$", this._rect$.asObservable());
    S(this, "_focus", !1);
    S(this, "_focus$", new q(this._focus));
    S(this, "focus$", this._focus$.asObservable());
  }
  dispose() {
    this._state$.complete(), this._state = null, this._rect$.complete(), this._rect = null;
  }
  setState(e) {
    this._state = e, this._refresh(e);
  }
  getRect() {
    return this._rect;
  }
  setRect(e) {
    this._rect = e, this._rect$.next(e);
  }
  getState() {
    return this._state;
  }
  setFocus(e = !1) {
    this._focus = e, this._focus$.next(e);
  }
  _refresh(e) {
    this._state$.next(e);
  }
}
const Qe = bt(
  "univer.slide-editor-manager.service"
), we = -1e3, vt = {
  width: 0,
  height: 0,
  top: we,
  left: we
};
function wn() {
  const [n, e] = $({
    ...vt
  }), t = O(Qe), i = O(Ze), r = O(pe), s = yi(
    () => r.subscribeContextValue$(ot),
    !1,
    void 0,
    [r, ot]
  );
  return ui.UNSPECIFIED, ge(() => {
    t.state$.subscribe((o) => {
      if (o == null)
        return;
      const {
        startX: c = we,
        startY: a = we,
        endX: h = 0,
        endY: l = 0,
        show: d = !1
      } = o;
      if (!d)
        e({
          ...vt
        });
      else {
        e({
          width: h - c - ie + 2,
          height: l - a - ie + 2,
          left: c + ie,
          top: a + ie
        });
        const v = i.getEditor(ue);
        if (v == null)
          return;
        const { left: m, top: p, width: f, height: g } = v.getBoundingClientRect();
        t.setRect({ left: m, top: p, width: f, height: g });
      }
    });
  }, []), ge(() => {
    s || t.setFocus(!0);
  }, [s, n]), /* @__PURE__ */ u(
    "div",
    {
      className: k("univer-absolute univer-z-10 univer-box-border univer-flex", he),
      style: {
        left: n.left,
        top: n.top,
        width: n.width,
        height: n.height
      }
    }
  );
}
function Be(n) {
  return n.getContextValue(Et) && n.getContextValue(xe);
}
function Pn(n) {
  return n.getContextValue(hi) && n.getContextValue(Et);
}
const ei = [
  P.ARROW_DOWN,
  P.ARROW_UP,
  P.ARROW_LEFT,
  P.ARROW_RIGHT
];
[P.ENTER, P.TAB, ...ei];
function yn() {
  const n = [];
  for (const e of ei)
    n.push({
      id: Oe.id,
      binding: e,
      preconditions: (t) => Be(t),
      staticParameters: {
        visible: !1,
        eventType: Y.Keyboard,
        keycode: e,
        isShift: !1
      }
    }), n.push({
      id: Oe.id,
      binding: e | Ti.SHIFT,
      preconditions: (t) => Be(t),
      staticParameters: {
        visible: !1,
        eventType: Y.Keyboard,
        keycode: e,
        isShift: !0
      }
    });
  return n;
}
const Tn = {
  id: Hi.id,
  preconditions: (n) => Be(n) || Pn(n),
  binding: P.BACKSPACE
};
var Mn = Object.getOwnPropertyDescriptor, Nn = (n, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Mn(e, t) : e, s = n.length - 1, o; s >= 0; s--)
    (o = n[s]) && (r = o(r) || r);
  return r;
}, te = (n, e) => (t, i) => e(t, i, n);
let Pe = class extends De {
  constructor(n, e, t, i, r, s) {
    super(), this._injector = n, this._menuManagerService = e, this._componentManager = t, this._uiPartsService = i, this._commandService = r, this._shortcutService = s, this._initCommands(), this._initCustomComponents(), this._initUIComponents(), this._initMenus(), this._initShortcuts();
  }
  _initMenus() {
    this._menuManagerService.mergeMenu(xn);
  }
  _initCustomComponents() {
    const n = this._componentManager;
    this.disposeWithMe(n.register("TextIcon", Wt)), this.disposeWithMe(n.register("GraphIcon", Bt)), this.disposeWithMe(n.register(Qt, Rn)), this.disposeWithMe(n.register(Ee, pn));
  }
  _initCommands() {
    [
      jt,
      Vt,
      Yt,
      Ge,
      Xt,
      Je,
      qe,
      Gt,
      Zt,
      Ye,
      $e,
      At,
      B,
      // commands for editor
      Oe
    ].forEach((n) => this.disposeWithMe(this._commandService.registerCommand(n)));
  }
  _initUIComponents() {
    this.disposeWithMe(
      this._uiPartsService.registerComponent(ct.LEFT_SIDEBAR, () => at(mn, this._injector))
    ), this.disposeWithMe(
      this._uiPartsService.registerComponent(ct.CONTENT, () => at(wn, this._injector))
    );
  }
  _initShortcuts() {
    [
      Tn,
      ...yn()
    ].forEach((n) => {
      this.disposeWithMe(this._shortcutService.registerShortcut(n));
    });
  }
};
Pe = Nn([
  te(0, z(ke)),
  te(1, Mi),
  te(2, z(Ni)),
  te(3, Di),
  te(4, D),
  te(5, Ui)
], Pe);
const Dn = "slides-ui.config", ft = {};
var Un = Object.getOwnPropertyDescriptor, Vn = (n, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Un(e, t) : e, s = n.length - 1, o; s >= 0; s--)
    (o = n[s]) && (r = o(r) || r);
  return r;
}, Se = (n, e) => (t, i) => e(t, i, n);
function jn(n, e) {
  const t = pt(n.left, n.top, e), i = pt(n.right, n.bottom, e);
  return {
    left: t.x,
    top: t.y,
    right: i.x,
    bottom: i.y
  };
}
function pt(n, e, t) {
  const { scaleX: i, scaleY: r } = t.getAncestorScale(), s = t.getViewport(ne.VIEW);
  if (!s)
    return {
      x: n,
      y: e
    };
  const { viewportScrollX: o, viewportScrollY: c } = s, a = (n - o) * i, h = (e - c) * r;
  return {
    x: a,
    y: h
  };
}
let ye = class extends De {
  constructor(n, e, t, i) {
    super(), this._globalPopupManagerService = n, this._renderManagerService = e, this._univerInstanceService = t, this._commandService = i;
  }
  _createObjectPositionObserver(n, e) {
    const i = (() => {
      var A, L, Q, ee;
      const { scene: o, engine: c } = e, { left: a, top: h, width: l, height: d } = n, v = (o.width - ((L = (A = e.mainComponent) == null ? void 0 : A.width) != null ? L : 0)) / 2, m = (o.height - ((ee = (Q = e.mainComponent) == null ? void 0 : Q.height) != null ? ee : 0)) / 2, p = {
        left: a,
        right: a + l,
        top: h,
        bottom: h + d
      }, f = c.getCanvasElement(), g = f.getBoundingClientRect(), _ = bi(f.style.width), { scaleX: I, scaleY: b } = o.getAncestorScale(), T = jn(p, o), { top: M, left: U, width: R } = g, W = R / _;
      return {
        left: T.left * W * I + U + v,
        right: T.right * W * I + U + v,
        top: T.top * W * b + M + m,
        bottom: T.bottom * W * b + M + m
      };
    })(), r = new q(i), s = new Ke();
    return {
      position: i,
      position$: r,
      disposable: s
    };
  }
  attachPopupToObject(n, e) {
    const i = this._univerInstanceService.getCurrentUnitForType(E.UNIVER_SLIDE).getUnitId(), r = this._renderManagerService.getRenderById(i);
    if (!r)
      return {
        dispose: () => {
        }
      };
    const { position: s, position$: o, disposable: c } = this._createObjectPositionObserver(n, r), a = this._globalPopupManagerService.addPopup({
      ...e,
      unitId: i,
      subUnitId: "default",
      anchorRect: s,
      anchorRect$: o,
      canvasElement: r.engine.getCanvasElement()
    });
    return {
      dispose: () => {
        this._globalPopupManagerService.removePopup(a), o.complete(), c.dispose();
      }
    };
  }
};
ye = Vn([
  Se(0, z(Vi)),
  Se(1, K),
  Se(2, w),
  Se(3, D)
], ye);
var An = Object.getOwnPropertyDescriptor, Ln = (n, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? An(e, t) : e, s = n.length - 1, o; s >= 0; s--)
    (o = n[s]) && (r = o(r) || r);
  return r;
}, X = (n, e) => (t, i) => e(t, i, n);
let Te = class extends fe {
  constructor(e, t, i, r, s, o, c) {
    super();
    S(this, "_initImagePopupMenu", /* @__PURE__ */ new Set());
    this._canvasPopManagerService = e, this._renderManagerService = t, this._univerInstanceService = i, this._contextService = r, this._canvasView = s, this._sidebarService = o, this._commandService = c, this._init();
  }
  _init() {
    this._univerInstanceService.getAllUnitsForType(E.UNIVER_SLIDE).forEach((e) => this._create(e));
  }
  _create(e) {
    if (!e)
      return;
    const t = e.getUnitId();
    this._renderManagerService.has(t) && !this._initImagePopupMenu.has(t) && (this._popupMenuListener(t), this._initImagePopupMenu.add(t));
  }
  _hasCropObject(e) {
  }
  // eslint-disable-next-line max-lines-per-function
  _popupMenuListener(e) {
    var r;
    const t = this._univerInstanceService.getCurrentUnitForType(E.UNIVER_SLIDE), i = (r = t == null ? void 0 : t.getPages()) != null ? r : {};
    Object.keys(i).forEach((s) => {
      var h;
      const c = (h = this._canvasView.getRenderUnitByPageId(s, e).scene) == null ? void 0 : h.getTransformer();
      if (!c) return;
      let a;
      this.disposeWithMe(
        xt(
          c.createControl$.subscribe(() => {
            const l = c.getSelectedObjectMap();
            if (l.size > 1) {
              a == null || a.dispose();
              return;
            }
            const d = l.values().next().value;
            if (!d)
              return;
            const v = d.oKey;
            a == null || a.dispose(), a = this.disposeWithMe(this._canvasPopManagerService.attachPopupToObject(d, {
              componentKey: Qt,
              direction: "horizontal",
              offset: [2, 0],
              extraProps: {
                menuItems: this._getMenuItemsByObjectType(d.objectType, v, e)
              }
            })), this._sidebarService.visible && this._commandService.executeCommand($e.id, {
              visible: !0,
              objectType: d.objectType
            });
          })
        )
      ), this.disposeWithMe(
        c.clearControl$.subscribe(() => {
          a == null || a.dispose(), this._contextService.setContextValue(gi, !1);
        })
      ), this.disposeWithMe(
        c.changing$.subscribe(() => {
          a == null || a.dispose();
          const l = c.getSelectedObjectMap();
          if (l.size > 1) {
            a == null || a.dispose();
            return;
          }
          const d = l.values().next().value;
          d && this._commandService.executeCommand(B.id, {
            unitId: e,
            oKey: d.oKey,
            props: {
              width: d.width,
              height: d.height,
              left: d.left,
              top: d.top
            }
          });
        })
      );
    });
  }
  _getMenuItemsByObjectType(e, t, i) {
    return [{
      label: "slide.popup.edit",
      index: 0,
      commandId: $e.id,
      commandParams: {
        visible: !0,
        objectType: e
      },
      disable: !1
    }, {
      label: "slide.popup.delete",
      index: 5,
      commandId: At.id,
      commandParams: {
        id: t,
        unitId: i
      },
      disable: !1
    }];
  }
};
Te = Ln([
  X(0, z(ye)),
  X(1, K),
  X(2, w),
  X(3, pe),
  X(4, z(y)),
  X(5, Tt),
  X(6, D)
], Te);
var $n = Object.getOwnPropertyDescriptor, Bn = (n, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? $n(e, t) : e, s = n.length - 1, o; s >= 0; s--)
    (o = n[s]) && (r = o(r) || r);
  return r;
}, Ve = (n, e) => (t, i) => e(t, i, n);
const et = bt("univer.slide-editor-bridge.service");
let He = class extends De {
  constructor(e, t, i) {
    super();
    S(this, "_editorUnitId", ue);
    S(this, "_isForceKeepVisible", !1);
    S(this, "_editorIsDirty", !1);
    S(this, "_currentEditRectState", null);
    S(this, "_currentEditRectState$", new q(null));
    S(this, "currentEditRectState$", this._currentEditRectState$.asObservable());
    S(this, "_visibleParam", {
      visible: !1,
      eventType: Y.Dblclick,
      unitId: ""
    });
    S(this, "_visible$", new q(this._visibleParam));
    S(this, "visible$", this._visible$.asObservable());
    S(this, "_afterVisible$", new q(this._visibleParam));
    S(this, "afterVisible$", this._afterVisible$.asObservable());
    S(this, "endEditing$", new Ut());
    S(this, "_currentEditRectInfo");
    this._editorService = e, this._contextService = t, this._renderManagerService = i;
  }
  dispose() {
    super.dispose();
  }
  getEditorRect() {
    return this._currentEditRectInfo;
  }
  /**
   * 1st part of startEditing.
   * @editorInfo editorInfo
   */
  setEditorRect(e) {
    this._currentEditRectInfo = e, this._editorService.getFocusEditor() || (this._editorService.focus(ue), this._contextService.setContextValue(xe, !1), this._contextService.setContextValue(Rt, !1), this._contextService.setContextValue(Ot, !1));
    const t = this.getEditRectState();
    this._currentEditRectState = t, this._currentEditRectState$.next(t);
  }
  changeVisible(e) {
    this._visibleParam = e, e.visible && (this._editorIsDirty = !1), this._visible$.next(this._visibleParam), this._afterVisible$.next(this._visibleParam);
  }
  /**
   * get info from _currentEditRectInfo
   *
   * invoked by slide-editing.render-controller.ts@_handleEditorVisible
   * && this@setEditorRect
   */
  getEditRectState() {
    const e = ue, t = this._currentEditRectInfo, i = t.unitId, r = t.richTextObj.documentData;
    r.id = e, r.documentStyle = {
      ...r.documentStyle,
      pageSize: { width: t.richTextObj.width, height: 1 / 0 }
    };
    const o = {
      documentModel: new vi(r),
      fontString: "document",
      textRotation: { a: 0, v: 0 },
      wrapStrategy: 0,
      verticalAlign: Re.TOP,
      horizontalAlign: wt.LEFT,
      paddingData: { t: 0, b: 1, l: 2, r: 2 }
    }, c = t.richTextObj.width, a = t.richTextObj.height, h = t.richTextObj.left, l = t.richTextObj.top, d = {
      left: 0,
      top: 0
    }, v = this._renderManagerService.getRenderById(i), m = v == null ? void 0 : v.scene, p = m == null ? void 0 : m.getViewport(ne.VIEW), f = m == null ? void 0 : m.getObject(ne.COMPONENT), g = {
      x: (f == null ? void 0 : f.left) || 0,
      y: (f == null ? void 0 : f.top) || 0
    }, _ = (p == null ? void 0 : p.viewportScrollX) || 0, I = (p == null ? void 0 : p.viewportScrollY) || 0;
    return d.left = g.x - _, d.top = g.y - I, {
      position: {
        startX: h,
        startY: l,
        endX: h + c,
        endY: l + a
      },
      scaleX: 1,
      scaleY: 1,
      slideCardOffset: d,
      unitId: i,
      editorUnitId: e,
      documentLayoutObject: o
    };
  }
  changeEditorDirty(e) {
    this._editorIsDirty = e;
  }
  isVisible() {
    return this._visibleParam.visible;
  }
  getEditorDirty() {
    return this._editorIsDirty;
  }
  getCurrentEditorId() {
    return this._editorUnitId;
  }
  /**
   * @deprecated
   */
  genDocData(e) {
    const t = this.getCurrentEditorId(), i = e.text, r = e.fs;
    return {
      id: t,
      body: {
        dataStream: `${i}\r
`,
        textRuns: [{ st: 0, ed: i.length }],
        paragraphs: [{
          paragraphStyle: {
            // no use
            // textStyle: { fs: 30 },
            // horizontalAlign: HorizontalAlign.CENTER,
            // verticalAlign: VerticalAlign.MIDDLE,
          },
          startIndex: i.length + 1
        }],
        sectionBreaks: [{ startIndex: i.length + 2 }]
      },
      documentStyle: {
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        pageSize: { width: 1 / 0, height: 1 / 0 },
        textStyle: { fs: r },
        renderConfig: {
          // horizontalAlign: HorizontalAlign.CENTER,
          verticalAlign: Re.MIDDLE,
          centerAngle: 0,
          vertexAngle: 0,
          wrapStrategy: 0
        }
      },
      drawings: {},
      drawingsOrder: [],
      settings: { zoomRatio: 1 }
    };
  }
};
He = Bn([
  Ve(0, Ze),
  Ve(1, pe),
  Ve(2, K)
], He);
var G = /* @__PURE__ */ ((n) => (n[n.InitialState = 0] = "InitialState", n[n.StartEditor = 1] = "StartEditor", n[n.CursorChange = 2] = "CursorChange", n))(G || {}), Hn = Object.getOwnPropertyDescriptor, Fn = (n, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Hn(e, t) : e, s = n.length - 1, o; s >= 0; s--)
    (o = n[s]) && (r = o(r) || r);
  return r;
}, j = (n, e) => (t, i) => e(t, i, n);
const mt = -1e3, _t = 5, Wn = 2;
let Fe = class extends De {
  constructor(e, t, i, r, s, o, c, a, h, l, d, v) {
    super();
    /**
     * It is used to distinguish whether the user has actively moved the cursor in the editor, mainly through mouse clicks.
     */
    S(this, "_cursorChange", G.InitialState);
    /** If the corresponding unit is active and prepared for editing. */
    S(this, "_isUnitEditing", !1);
    S(this, "_d");
    this._renderContext = e, this._layoutService = t, this._undoRedoService = i, this._contextService = r, this._instanceSrv = s, this._renderManagerService = o, this._editorBridgeService = c, this._cellEditorManagerService = a, this._textSelectionManagerService = h, this._commandService = l, this._localService = d, this._editorService = v, this.disposeWithMe(this._instanceSrv.getCurrentTypeOfUnit$(E.UNIVER_SLIDE).subscribe((m) => {
      m && m.getUnitId() === this._renderContext.unitId ? this._d = this._init() : (this._disposeCurrent(), this._isUnitEditing && (this._handleEditorInvisible({
        visible: !1,
        eventType: Y.Keyboard,
        keycode: P.ESC,
        unitId: this._renderContext.unitId
      }), this._isUnitEditing = !1));
    })), this._initEditorVisibilityListener();
  }
  dispose() {
    super.dispose(), this._disposeCurrent();
  }
  _disposeCurrent() {
    var e;
    (e = this._d) == null || e.dispose(), this._d = null;
  }
  _init() {
    const e = new Ke();
    return this._subscribeToCurrentCell(e), this._initialKeyboardListener(e), this._initialCursorSync(e), this._listenEditorFocus(e), this._commandExecutedListener(e), setTimeout(() => {
      this._cursorStateListener(e);
    }, 1e3), e;
  }
  _initEditorVisibilityListener() {
    this.disposeWithMe(this._editorBridgeService.visible$.subscribe((e) => {
      e.visible ? (this._isUnitEditing = !0, this._handleEditorVisible(e)) : this._isUnitEditing && (this._handleEditorInvisible(e), this._isUnitEditing = !1);
    }));
  }
  _listenEditorFocus(e) {
    const t = this._getEditorObject();
    t && e.add(t.document.onPointerDown$.subscribeEvent(() => {
    }));
  }
  _getEditorSkeleton(e) {
    var t;
    return (t = this._renderManagerService.getRenderById(e)) == null ? void 0 : t.with(gt).getSkeleton();
  }
  _getEditorViewModel(e) {
    var t;
    return (t = this._renderManagerService.getRenderById(e)) == null ? void 0 : t.with(gt).getViewModel();
  }
  _initialCursorSync(e) {
    e.add(this._cellEditorManagerService.focus$.pipe(Ki((t) => !!t)).subscribe(() => {
      var t;
      (t = Le(E.UNIVER_DOC, this._instanceSrv, this._renderManagerService)) == null || t.with(dt).sync();
    }));
  }
  /**
   * Set editorUnitId to curr doc.
   * @param d DisposableCollection
   */
  _subscribeToCurrentCell(e) {
    e.add(this._editorBridgeService.currentEditRectState$.subscribe((t) => {
      var d;
      if (t == null || this._contextService.getContextValue(Rt) || this._contextService.getContextValue(Ot))
        return;
      const {
        position: { startX: i, endX: r },
        documentLayoutObject: { textRotation: s, wrapStrategy: o, documentModel: c },
        scaleX: a,
        editorUnitId: h
      } = t, { vertexAngle: l } = rt(s);
      c.updateDocumentId(h), o === tt.WRAP && l === 0 && c.updateDocumentDataPageSize((r - i) / a), this._instanceSrv.changeDoc(h, c), this._contextService.setContextValue(pi, !0), this._textSelectionManagerService.replaceTextRanges([{
        startOffset: 0,
        endOffset: 0
      }]), (d = Le(E.UNIVER_DOC, this._instanceSrv, this._renderManagerService)) == null || d.with(dt).activate(mt, mt);
    }));
  }
  /**
   * Set size and pos of editing area.
   * @param positionFromEditRectState
   * @param canvasOffset
   * @param documentSkeleton
   * @param documentLayoutObject
   * @param scaleX
   * @param scaleY
   */
  _fitTextSize(e, t, i, r, s = 1, o = 1) {
    const { startX: c, startY: a, endX: h, endY: l } = e, d = r.documentModel;
    if (d == null)
      return;
    const { actualWidth: v, actualHeight: m } = this._predictingSize(
      e,
      t,
      i,
      r,
      s,
      o
    ), { verticalAlign: p, paddingData: f, fill: g } = r;
    let _ = h - c, I = l - a;
    if (_ < v && (_ = v), I < m)
      I = m, d.updateDocumentDataMargin(f);
    else {
      let b = 0;
      p === Re.MIDDLE ? b = (I - m) / 2 / o : p === Re.TOP ? b = f.t || 0 : b = (I - m) / o - (f.b || 0), b = b < (f.t || 0) ? f.t || 0 : b, d.updateDocumentDataMargin({
        t: b
      });
    }
    i.calculate(), this._editAreaProcessing(_, I, e, t, g, s, o);
  }
  /**
   * Mainly used to pre-calculate the width of the editor,
   * to determine whether it needs to be automatically widened.
   */
  _predictingSize(e, t, i, r, s = 1, o = 1) {
    const { startX: c, endX: a } = e, { textRotation: h, wrapStrategy: l } = r, d = r.documentModel, { vertexAngle: v } = rt(h), m = document.body.clientWidth;
    if (l === tt.WRAP && v === 0) {
      const { actualWidth: g, actualHeight: _ } = i.getActualSize();
      return {
        actualWidth: g * s,
        actualHeight: _ * o
      };
    }
    d == null || d.updateDocumentDataPageSize((m - c - t.left) / s), i.calculate();
    const p = i.getActualSize();
    let f = a - c;
    return f < p.actualWidth * s + _t * s && (f = p.actualWidth * s + _t * s), d == null || d.updateDocumentDataPageSize(f / s), d == null || d.updateDocumentRenderConfig({
      horizontalAlign: wt.UNSPECIFIED,
      cellValueType: void 0
    }), {
      actualWidth: f,
      actualHeight: p.actualHeight * o
    };
  }
  /**
   * control the size of editing area
   */
  // eslint-disable-next-line max-lines-per-function
  _editAreaProcessing(e, t, i, r, s, o = 1, c = 1) {
    var C;
    const a = this._getEditorObject();
    if (a == null)
      return;
    function h(ce) {
      return Number.parseInt(ce.replace("px", ""));
    }
    const d = this._renderContext.engine.getCanvasElement(), v = d.getBoundingClientRect(), m = h(d.style.width), { top: p, left: f, width: g } = v, _ = g / m;
    let { startX: I, startY: b } = i;
    I += r.left, b += r.top;
    const { document: T, scene: M, engine: U } = a, R = M.getViewport(ut.VIEW_MAIN), W = document.body.clientHeight - b - r.top - Wn * 2, oe = document.body.clientWidth - I - r.left;
    let A = t, L = R == null ? void 0 : R.getScrollBar();
    A > W ? (A = W, L == null ? R && new Pt(R, { enableHorizontal: !1, barSize: 8 }) : R == null || R.resetCanvasSizeAndUpdateScroll()) : (L = null, (C = R == null ? void 0 : R.getScrollBar()) == null || C.dispose()), e += (L == null ? void 0 : L.barSize) || 0, e = Math.min(e, oe), I -= ie, b -= ie, this._addBackground(M, e / o, t / c, s);
    const { scaleX: Q, scaleY: ee } = M.getPrecisionScale();
    M.transformByState({
      width: e * _ / o,
      height: t * _ / c,
      scaleX: o * _,
      scaleY: c * _
    }), T.resize(e / o, t / c), setTimeout(() => {
      U.resizeBySize(
        st(e, Q),
        st(A, ee)
      );
    }, 0);
    const me = this._layoutService.getContentElement().getBoundingClientRect(), _e = d.getBoundingClientRect();
    I = I * _ + (_e.left - me.left), b = b * _ + (_e.top - me.top), this._cellEditorManagerService.setState({
      startX: I,
      startY: b,
      endX: e * _ + I,
      endY: A * _ + b,
      show: !0
    });
  }
  /**
   * Since the document does not support cell background color, an additional rect needs to be added.
   */
  _addBackground(e, t, i, r) {
    const s = "_backgroundRectHelperColor_", o = e.getObject(s);
    o == null && r == null || (o == null ? e.addObjects(
      [
        new yt(s, {
          width: t,
          height: i,
          fill: r,
          evented: !1
        })
      ],
      Fi
    ) : r == null ? o.dispose() : (o.setProps({
      fill: r
    }), o.transformByState({
      width: t,
      height: i
    })));
  }
  /**
   * Show input area, resize input area and then place input to right place.
   * @TODO why do resize in show input area?
   * @param param
   */
  // handleVisible is the 2nd part of editing.
  // first part: startEditing --> _updateEditor
  // 2nd part: startEditing --> changeVisible --> slide-editor-bridge.render-controller.ts@changeVisible --> _editorBridgeService.changeVisible
  _handleEditorVisible(e) {
    var g, _;
    const { eventType: t } = e;
    this._cursorChange = [Y.PointerDown, Y.Dblclick].includes(t) ? G.CursorChange : G.StartEditor;
    const i = this._editorBridgeService.getEditRectState();
    if (i == null)
      return;
    const {
      position: r,
      documentLayoutObject: s,
      slideCardOffset: o,
      scaleX: c,
      scaleY: a,
      editorUnitId: h,
      unitId: l
    } = i, d = this._getEditorObject();
    if (d == null)
      return;
    const { scene: v } = d;
    this._contextService.setContextValue(xe, !0);
    const { documentModel: m } = s, p = this._getEditorSkeleton(h);
    if (!p || !m)
      return;
    this._fitTextSize(r, o, p, s, c, a);
    const f = m.getBody().dataStream.length - 2 || 0;
    (g = v.getViewport(ut.VIEW_MAIN)) == null || g.scrollToViewportPos({
      viewportScrollX: Number.POSITIVE_INFINITY
    }), this._textSelectionManagerService.replaceTextRanges([
      {
        startOffset: f,
        endOffset: f
      }
    ]), (_ = this._renderManagerService.getRenderById(l)) == null || _.scene.resetCursor();
  }
  _resetBodyStyle(e, t = !1) {
    e.dataStream = mi, e.textRuns != null && (e.textRuns.length === 1 && !t ? (e.textRuns[0].st = 0, e.textRuns[0].ed = 1) : e.textRuns = void 0), e.paragraphs != null && (e.paragraphs.length === 1 ? e.paragraphs[0].startIndex = 0 : e.paragraphs = [
      {
        startIndex: 0
      }
    ]), e.sectionBreaks != null && (e.sectionBreaks = void 0), e.tables != null && (e.tables = void 0), e.customRanges != null && (e.customRanges = void 0), e.customBlocks != null && (e.customBlocks = void 0);
  }
  /**
   * Should activate the editor when the user inputs text.
   * @param d DisposableCollection
   */
  _initialKeyboardListener(e) {
  }
  _showEditorByKeyboard(e) {
  }
  _commandExecutedListener(e) {
    const t = [Oe.id], i = [Gi.id];
    e.add(this._commandService.onCommandExecuted((r) => {
      this._editorService.getFocusId() === ue && (t.includes(r.id) && this._moveCursorCmdHandler(r), i.includes(r.id) && this._editorBridgeService.isVisible() && this._editingChangedHandler());
    }));
  }
  _moveCursorCmdHandler(e) {
    const t = e.params, { keycode: i, isShift: r } = t;
    i != null && this._cursorChange === G.CursorChange ? this._moveInEditor(i, r) : this._editorBridgeService.changeVisible(t);
  }
  _editingChangedHandler() {
    const e = this._editorBridgeService.getEditorRect();
    if (!e)
      return;
    const t = e.richTextObj;
    t.refreshDocumentByDocData(), t.resizeToContentSize();
    const { unitId: i } = this._renderContext;
    this._handleEditorVisible({ visible: !0, eventType: 3, unitId: i });
  }
  _getEditorObject() {
    return kn(this._editorBridgeService.getCurrentEditorId(), this._renderManagerService);
  }
  async _handleEditorInvisible(e) {
    const { keycode: t } = e;
    if (this._cursorChange = G.InitialState, this._exitInput(e), this._editorBridgeService.getEditRectState() == null)
      return;
    if (this._editorBridgeService.getEditorDirty() === !1) {
      this._moveCursor(t);
      return;
    }
    this._moveCursor(t);
  }
  _exitInput(e) {
    this._contextService.setContextValue(xe, !1), this._cellEditorManagerService.setState({
      show: e.visible
    });
    const t = this._editorBridgeService.getCurrentEditorId();
    t != null && this._undoRedoService.clearUndoRedo(t);
  }
  _moveCursor(e) {
    if (e != null)
      switch (V.LEFT, e) {
        case P.ENTER:
          V.DOWN;
          break;
        case P.TAB:
          V.RIGHT;
          break;
        case P.ARROW_DOWN:
          V.DOWN;
          break;
        case P.ARROW_UP:
          V.UP;
          break;
        case P.ARROW_LEFT:
          V.LEFT;
          break;
        case P.ARROW_RIGHT:
          V.RIGHT;
          break;
      }
  }
  /**
   * The user's operations follow the sequence of opening the editor and then moving the cursor.
   * The logic here predicts the user's first cursor movement behavior based on this rule
   */
  _cursorStateListener(e) {
    const t = this._getEditorObject();
    if (!t)
      return;
    const { document: i } = t;
    e.add(xt(i.onPointerDown$.subscribeEvent(() => {
      this._cursorChange === G.StartEditor && (this._cursorChange = G.CursorChange);
    })));
  }
  // TODO: @JOCS, is it necessary to move these commands MoveSelectionOperation\MoveCursorOperation to shortcut? and use multi-commands?
  _moveInEditor(e, t) {
    let i = V.LEFT;
    e === P.ARROW_DOWN ? i = V.DOWN : e === P.ARROW_UP ? i = V.UP : e === P.ARROW_RIGHT && (i = V.RIGHT), t ? this._commandService.executeCommand(Wi.id, {
      direction: i
    }) : this._commandService.executeCommand(ki.id, {
      direction: i
    });
  }
};
Fe = Fn([
  j(1, ji),
  j(2, fi),
  j(3, pe),
  j(4, w),
  j(5, K),
  j(6, et),
  j(7, Qe),
  j(8, z(Zi)),
  j(9, D),
  j(10, z(J)),
  j(11, Ze)
], Fe);
function kn(n, e) {
  if (n == null)
    return;
  const t = e.getRenderById(n);
  if (t == null)
    return;
  const { mainComponent: i, scene: r, engine: s, components: o } = t, c = i, a = o.get(zi.BACKGROUND);
  return {
    document: c,
    docBackground: a,
    scene: r,
    engine: s
  };
}
var zn = Object.getOwnPropertyDescriptor, Kn = (n, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? zn(e, t) : e, s = n.length - 1, o; s >= 0; s--)
    (o = n[s]) && (r = o(r) || r);
  return r;
}, je = (n, e) => (t, i) => e(t, i, n);
let We = class extends fe {
  constructor(e, t, i, r) {
    super();
    /**
     * It is used to distinguish whether the user has actively moved the cursor in the editor, mainly through mouse clicks.
     */
    // private _cursorChange: CursorChange = CursorChange.InitialState;
    /** If the corresponding unit is active and prepared for editing. */
    // private _isUnitEditing = false;
    S(this, "setSlideTextEditor$", new Ut());
    S(this, "_curRichText", null);
    S(this, "_d");
    this._renderContext = e, this._instanceSrv = t, this._commandService = i, this._editorBridgeService = r, this.disposeWithMe(this._instanceSrv.getCurrentTypeOfUnit$(E.UNIVER_SLIDE).subscribe((s) => {
      s && s.getUnitId() === this._renderContext.unitId ? this._d = this._init() : this._disposeCurrent();
    }));
  }
  _init() {
    const e = new Ke();
    return this._initEventListener(e), e;
  }
  _disposeCurrent() {
    var e;
    (e = this._d) == null || e.dispose(), this._d = null;
  }
  _setEditorRect(e, t) {
    this._curRichText = t;
    const { scene: i, engine: r } = this._renderContext, s = this._renderContext.unitId, o = {
      scene: i,
      engine: r,
      unitId: s,
      pageId: e,
      richTextObj: t
    };
    this._editorBridgeService.setEditorRect(o);
  }
  _initEventListener(e) {
    const t = (o) => {
      const c = o.getTransformer();
      c && (e.add(c.clearControl$.subscribe(() => {
        this.setEditorVisible(!1), this.pickOtherObjects();
      })), e.add(c.createControl$.subscribe(() => {
        this.setEditorVisible(!1);
      })), e.add(o.onDblclick$.subscribeEvent(() => {
        c.clearControls();
        const h = c.getSelectedObjectMap().values().next().value;
        h && (h.objectType !== de.RICH_TEXT ? this.pickOtherObjects() : this.startEditing(o.sceneKey, h));
      })), e.add(this._instanceSrv.focused$.subscribe((a) => {
        this.endEditing();
      })));
    }, { mainComponent: i } = this._renderContext;
    i.subSceneChanged$.subscribeEvent((o) => {
      t(o);
    });
    const s = Array.from(i.getSubScenes().values());
    for (let o = 0; o < s.length; o++) {
      const c = s[o];
      t(c);
    }
  }
  pickOtherObjects() {
    this.endEditing();
  }
  /**
   * invoked when picking other object.
   *
   * save editing state to curr richText.
   */
  endEditing() {
    var s;
    if (!this._curRichText) return;
    this.setEditorVisible(!1);
    const e = this._curRichText;
    if (!this._instanceSrv.getCurrentUnitForType(E.UNIVER_SLIDE)) return !1;
    e.refreshDocumentByDocData(), e.resizeToContentSize(), this._editorBridgeService.endEditing$.next(e);
    const i = {
      bl: 1,
      fs: e.fs,
      text: e.text
    }, r = (s = e.documentData.body) == null ? void 0 : s.textRuns;
    if (r && r.length) {
      const c = r[0].ts;
      i.cl = c == null ? void 0 : c.cl;
    }
    this._commandService.executeCommand(B.id, {
      unitId: this._renderContext.unitId,
      oKey: e == null ? void 0 : e.oKey,
      props: {
        richText: i
      }
    }), this._curRichText = null;
  }
  /**
   * TODO calling twice ？？？？
   * editingParam derives from RichText object.
   *
   * TODO @lumixraku need scale param
   * @param target
   */
  startEditing(e, t) {
    this._setEditorRect(e, t), this.setEditorVisible(!0);
  }
  setEditorVisible(e) {
    var i, r;
    e ? (i = this._curRichText) == null || i.hide() : (r = this._curRichText) == null || r.show();
    const { unitId: t } = this._renderContext;
    this._editorBridgeService.changeVisible({ visible: e, eventType: Y.PointerDown, unitId: t });
  }
};
We = Kn([
  je(1, w),
  je(2, D),
  je(3, et)
], We);
var Zn = Object.getOwnPropertyDescriptor, Gn = (n, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Zn(e, t) : e, s = n.length - 1, o; s >= 0; s--)
    (o = n[s]) && (r = o(r) || r);
  return r;
}, Ae = (n, e) => (t, i) => e(t, i, n);
let Me = class extends fe {
  // private _skeletonChangeMutations = new Set<string>();
  constructor(n, e, t) {
    super(), this._contextService = n, this._instanceSrv = e, this._renderManagerService = t, Promise.resolve().then(() => this._init());
  }
  _init() {
    this._initSlideDataListener(), this._initContextListener();
  }
  _initSlideDataListener() {
    this._instanceSrv.getTypeOfUnitAdded$(E.UNIVER_SLIDE).pipe(ht(this.dispose$)).subscribe((n) => {
      this._createRenderer(n == null ? void 0 : n.getUnitId());
    }), this._instanceSrv.getAllUnitsForType(E.UNIVER_SLIDE).forEach((n) => {
      this._createRenderer(n.getUnitId());
    }), this._instanceSrv.getTypeOfUnitDisposed$(E.UNIVER_SLIDE).pipe(ht(this.dispose$)).subscribe((n) => this._disposeRenderer(n));
  }
  _createRenderer(n) {
    n == null || this._instanceSrv.getUnit(n, E.UNIVER_SLIDE) == null || this._renderManagerService.createRender(n);
  }
  _disposeRenderer(n) {
    const e = n.getUnitId();
    this._renderManagerService.removeRender(e);
  }
  _initContextListener() {
  }
};
Me = Gn([
  Ae(0, pe),
  Ae(1, w),
  Ae(2, K)
], Me);
var Xn = Object.getOwnPropertyDescriptor, Yn = (n, e, t, i) => {
  for (var r = i > 1 ? void 0 : i ? Xn(e, t) : e, s = n.length - 1, o; s >= 0; s--)
    (o = n[s]) && (r = o(r) || r);
  return r;
}, Ie = (n, e) => (t, i) => e(t, i, n);
const qn = "SLIDE_UI";
var be;
let Ct = (be = class extends _i {
  constructor(n = ft, e, t, i, r) {
    super(), this._config = n, this._injector = e, this._renderManagerService = t, this._univerInstanceService = i, this._configService = r;
    const { menu: s, ...o } = St(
      {},
      ft,
      this._config
    );
    s && this._configService.setConfig("menu", s, { merge: !0 }), this._configService.setConfig(Dn, o);
  }
  onStarting() {
    it([
      [Me],
      [et, { useClass: He }],
      // used by SlideUIController --> EditorContainer
      [Qe, { useClass: On }],
      [ye]
    ], this._config.override).forEach((n) => this._injector.add(n));
  }
  onReady() {
    [
      // SlideRenderService will be init in ready stage, and then calling RenderManagerService@createRender --> init all deps in this rendering register block.
      [ve]
    ].forEach((n) => {
      this.disposeWithMe(this._renderManagerService.registerRenderModule(E.UNIVER_SLIDE, n));
    }), it([
      [y],
      // cannot register in _renderManagerService now.
      // [ISlideEditorBridgeService, { useClass: SlideEditorBridgeService }],
      // // used by SlideUIController --> EditorContainer
      // [ISlideEditorManagerService, { useClass: SlideEditorManagerService }],
      // SlidesUIController controller should be registered in Ready stage.
      // SlidesUIController controller would add a new RenderUnit (__INTERNAL_EDITOR__DOCS_NORMAL)
      [Pe],
      // editor service was create in renderManagerService
      [ve],
      [Te]
    ], this._config.override).forEach((n) => {
      this._injector.add(n);
    }), this._injector.get(y), this._injector.get(Me);
  }
  onRendered() {
    [
      // need slideEditorBridgeService
      // need TextSelectionRenderService which init by EditorContainer
      [We],
      [Fe]
    ].forEach((n) => {
      this.disposeWithMe(this._renderManagerService.registerRenderModule(E.UNIVER_SLIDE, n));
    }), this._markSlideAsFocused(), this._injector.get(Pe);
  }
  onSteady() {
    this._injector.get(Te);
  }
  _markSlideAsFocused() {
    const n = this._univerInstanceService;
    try {
      const e = n.getCurrentUnitForType(E.UNIVER_SLIDE);
      n.focusUnit(e.getUnitId());
    } catch {
    }
  }
}, S(be, "pluginName", qn), S(be, "type", E.UNIVER_SLIDE), be);
Ct = Yn([
  Ie(1, z(ke)),
  Ie(2, K),
  Ie(3, w),
  Ie(4, Ci)
], Ct);
export {
  Vt as ActivateSlidePageOperation,
  jt as AppendSlideOperation,
  y as CanvasView,
  At as DeleteSlideElementOperation,
  et as ISlideEditorBridgeService,
  Ge as InsertSlideFloatImageCommand,
  qe as InsertSlideShapeEllipseCommand,
  Gt as InsertSlideShapeEllipseOperation,
  Ye as InsertSlideShapeRectangleCommand,
  Zt as InsertSlideShapeRectangleOperation,
  Jt as SHAPE_MENU_ID,
  qt as SLIDES_IMAGE_MENU_ID,
  ue as SLIDE_EDITOR_ID,
  Yt as SetSlidePageThumbOperation,
  Je as SlideAddTextCommand,
  Xt as SlideAddTextOperation,
  ye as SlideCanvasPopMangerService,
  wn as SlideEditorContainer,
  mn as SlideSideBar,
  Pe as SlidesUIController,
  xn as SlidesUIMenuSchema,
  Ct as UniverSlidesUIPlugin,
  B as UpdateSlideElementOperation
};
