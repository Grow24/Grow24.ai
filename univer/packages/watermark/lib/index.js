var y = Object.defineProperty;
var R = (t, e, r) => e in t ? y(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var c = (t, e, r) => R(t, typeof e != "symbol" ? e + "" : e, r);
import { Inject as g, ILocalStorageService as v, Disposable as W, UserManagerService as w, RxDisposable as E, Injector as x, IConfigService as A, Plugin as M, merge as m, UniverInstanceType as S } from "@univerjs/core";
import { UNIVER_WATERMARK_STORAGE_KEY as s, WatermarkLayer as U, UNIVER_WATERMARK_LAYER_INDEX as $, IWatermarkTypeEnum as _, IRenderManagerService as b } from "@univerjs/engine-render";
import { Subject as u } from "rxjs";
const H = ["image/png", "image/jpeg", "image/jpg", "image/bmp"], D = {
  content: "",
  fontSize: 16,
  color: "rgb(0,0,0)",
  bold: !1,
  italic: !1,
  direction: "ltr",
  x: 60,
  y: 36,
  repeat: !0,
  spacingX: 200,
  spacingY: 100,
  rotate: 0,
  opacity: 0.15
}, L = {
  url: "",
  width: 100,
  height: 100,
  maintainAspectRatio: !0,
  originRatio: 1,
  x: 60,
  y: 36,
  repeat: !0,
  spacingX: 200,
  spacingY: 100,
  rotate: 0,
  opacity: 0.15
}, O = {
  name: !0,
  email: !1,
  phone: !1,
  uid: !1,
  fontSize: 16,
  color: "rgb(0,0,0)",
  bold: !1,
  italic: !1,
  direction: "ltr",
  x: 60,
  y: 60,
  repeat: !0,
  spacingX: 200,
  spacingY: 100,
  rotate: -30,
  opacity: 0.15
}, I = "watermark.config", C = {};
var P = Object.getOwnPropertyDescriptor, j = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? P(e, r) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (i = o(i) || i);
  return i;
}, N = (t, e) => (r, a) => e(r, a, t);
let l = class extends W {
  constructor(e) {
    super();
    c(this, "_updateConfig$", new u());
    c(this, "updateConfig$", this._updateConfig$.asObservable());
    c(this, "_refresh$", new u());
    c(this, "refresh$", this._refresh$.asObservable());
    this._localStorageService = e;
  }
  async getWatermarkConfig() {
    return await this._localStorageService.getItem(s);
  }
  updateWatermarkConfig(e) {
    this._localStorageService.setItem(s, e), this._updateConfig$.next(e);
  }
  deleteWatermarkConfig() {
    this._localStorageService.removeItem(s), this._updateConfig$.next(null);
  }
  refresh() {
    this._refresh$.next(Math.random());
  }
  dispose() {
    this._refresh$.complete(), this._updateConfig$.complete();
  }
};
l = j([
  N(0, g(v))
], l);
var T = Object.getOwnPropertyDescriptor, G = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? T(e, r) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (i = o(i) || i);
  return i;
}, h = (t, e) => (r, a) => e(r, a, t);
let d = class extends E {
  constructor(e, r, a, i) {
    super();
    c(this, "_watermarkLayer");
    this._context = e, this._watermarkService = r, this._localStorageService = a, this._userManagerService = i, this._watermarkLayer = new U(e.scene, [], $), this._initAddRender(), this._initWatermarkUpdate(), this._initWatermarkConfig();
  }
  _initAddRender() {
    const { scene: e } = this._context;
    e.addLayer(this._watermarkLayer);
  }
  async _initWatermarkConfig() {
    var r;
    const e = await this._localStorageService.getItem(s);
    e && (this._watermarkService.updateWatermarkConfig(e), (r = this._context.mainComponent) == null || r.makeDirty());
  }
  _initWatermarkUpdate() {
    this.disposeWithMe(
      this._watermarkService.updateConfig$.subscribe((e) => {
        var r, a;
        if (!e) {
          this._watermarkLayer.updateConfig(), (r = this._context.mainComponent) == null || r.makeDirty();
          return;
        }
        e.type === _.UserInfo ? this._watermarkLayer.updateConfig(e, this._userManagerService.getCurrentUser()) : this._watermarkLayer.updateConfig(e), (a = this._context.mainComponent) == null || a.makeDirty();
      })
    );
  }
};
d = G([
  h(1, g(l)),
  h(2, g(v)),
  h(3, g(w))
], d);
var K = Object.getOwnPropertyDescriptor, Y = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? K(e, r) : e, n = t.length - 1, o; n >= 0; n--)
    (o = t[n]) && (i = o(i) || i);
  return i;
}, f = (t, e) => (r, a) => e(r, a, t);
const V = "UNIVER_WATERMARK_PLUGIN";
var p;
let k = (p = class extends M {
  constructor(t = C, e, r, a, i) {
    super(), this._config = t, this._injector = e, this._configService = r, this._renderManagerSrv = a, this._localStorageService = i;
    const { ...n } = m(
      {},
      C,
      this._config
    );
    this._configService.setConfig(I, n), this._initWatermarkStorage(), this._initDependencies();
  }
  async _initWatermarkStorage() {
    const t = this._configService.getConfig(I);
    if (!t)
      return;
    const { userWatermarkSettings: e, textWatermarkSettings: r, imageWatermarkSettings: a } = t;
    if (e)
      this._localStorageService.setItem(s, {
        type: _.UserInfo,
        config: {
          userInfo: m({}, O, e)
        }
      });
    else if (r)
      this._localStorageService.setItem(s, {
        type: _.Text,
        config: {
          text: m({}, D, r)
        }
      });
    else if (a)
      this._localStorageService.setItem(s, {
        type: _.Image,
        config: {
          image: m({}, L, a)
        }
      });
    else {
      const i = await this._localStorageService.getItem(s);
      (i == null ? void 0 : i.type) === _.UserInfo && this._localStorageService.removeItem(s);
    }
  }
  _initDependencies() {
    [[l]].forEach((t) => {
      this._injector.add(t);
    });
  }
  onRendered() {
    this._injector.get(l), this._initRenderDependencies();
  }
  _initRenderDependencies() {
    [
      [d]
    ].forEach((t) => {
      this._renderManagerSrv.registerRenderModule(S.UNIVER_SHEET, t), this._renderManagerSrv.registerRenderModule(S.UNIVER_DOC, t);
    });
  }
}, c(p, "pluginName", V), p);
k = Y([
  f(1, g(x)),
  f(2, A),
  f(3, b),
  f(4, g(v))
], k);
export {
  k as UniverWatermarkPlugin,
  H as WATERMARK_IMAGE_ALLOW_IMAGE_LIST,
  L as WatermarkImageBaseConfig,
  l as WatermarkService,
  D as WatermarkTextBaseConfig,
  O as WatermarkUserInfoBaseConfig
};
