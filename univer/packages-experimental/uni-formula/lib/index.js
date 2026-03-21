var O = Object.defineProperty;
var I = (s, r, e) => r in s ? O(s, r, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[r] = e;
var a = (s, r, e) => I(s, typeof r != "symbol" ? r + "" : r, e);
import { createIdentifier as S, Disposable as y, UniverInstanceType as F, toDisposable as D, IResourceManagerService as N, ICommandService as p, IUniverInstanceService as M, CommandType as f, Plugin as R, registerDependencies as A, touchDependencies as C, Inject as P, Injector as $ } from "@univerjs/core";
const w = "UI_FORMULA_PLUGIN", E = "DOC_FORMULA_PLUGIN";
function L(s) {
  return JSON.stringify(s.map((r) => ({ rangeId: r.rangeId, f: r.f, v: r.v, t: r.t })));
}
var b = Object.getOwnPropertyDescriptor, T = (s, r, e, t) => {
  for (var o = t > 1 ? void 0 : t ? b(r, e) : r, i = s.length - 1, n; i >= 0; i--)
    (n = s[i]) && (o = n(o) || o);
  return o;
}, _ = (s, r) => (e, t) => r(e, t, s);
const m = S("uni-formula.uni-formula.service");
let g = class extends y {
  constructor(r, e, t) {
    super();
    a(this, "_docFormulas", /* @__PURE__ */ new Map());
    a(this, "_slideFormulas", /* @__PURE__ */ new Map());
    this._commandSrv = e, this._instanceSrv = t, this._initDocFormulaResources(r), this._instanceSrv.getTypeOfUnitDisposed$(F.UNIVER_DOC).subscribe((o) => {
      this._unregisterDoc(o.getUnitId());
    });
  }
  // #region docs
  hasDocFormula(r, e) {
    return this._docFormulas.has(u(r, e));
  }
  getDocFormula(r, e) {
    var t;
    return (t = this._docFormulas.get(u(r, e))) != null ? t : null;
  }
  updateDocFormulaResults(r, e, t) {
    return e.forEach((o, i) => {
      const n = this._docFormulas.get(u(r, o));
      return n && (n.v = t[i].v, n.t = t[i].t), !0;
    }), !0;
  }
  /**
   * Register a doc formula into the formula system.
   */
  registerDocFormula(r, e, t, o, i) {
    const n = u(r, e);
    if (this._docFormulas.has(n))
      throw new Error(`[UniFormulaService]: cannot register formula ${n} when it is already registered!`);
    return this._docFormulas.set(n, { unitId: r, rangeId: e, f: t, formulaId: "", v: o, t: i }), D(() => this.unregisterDocFormula(r, e));
  }
  unregisterDocFormula(r, e) {
    const t = u(r, e);
    this._docFormulas.get(t) && this._docFormulas.delete(t);
  }
  updateSlideFormulaResults(r, e, t, o, i) {
    const n = this._slideFormulas.get(l(r, e, t, o));
    return n && (n.v = i.v, n.t = i.t), !0;
  }
  _initDocFormulaResources(r) {
    r.registerPluginResource({
      pluginName: E,
      businesses: [F.UNIVER_DOC],
      toJson: (e) => {
        const t = this._getAllFormulasOfUnit(e);
        return L(t.map((o) => o[1]));
      },
      parseJson: (e) => JSON.parse(e),
      onLoad: (e, t) => {
        t.forEach((o) => this.registerDocFormula(e, o.rangeId, o.f, o.v, o.t));
      },
      onUnLoad: (e) => {
        this._unregisterDoc(e);
      }
    });
  }
  /**
   * Remove all formulas under a doc.
   */
  _unregisterDoc(r) {
    Array.from(this._docFormulas.entries()).forEach(([t, o]) => {
      o.unitId === r && this.unregisterDocFormula(r, o.rangeId);
    });
  }
  // #endregion
  // #region slides
  registerSlideFormula(r, e, t, o, i, n, U) {
    const d = l(r, e, t, i);
    if (this._slideFormulas.has(d))
      throw new Error(`[UniFormulaService]: cannot register formula ${d} when it is already registered!`);
    return this._slideFormulas.set(d, { unitId: r, pageId: e, elementId: t, rangeId: o, formulaId: "", f: i, v: n, t: U }), D(() => this.unregisterDocFormula(r, o));
  }
  hasSlideFormula(r, e, t, o) {
    return this._slideFormulas.has(l(r, e, t, o));
  }
  getSlideFormula(r, e, t, o) {
    var i;
    return (i = this._slideFormulas.get(l(r, e, t, o))) != null ? i : null;
  }
  unregisterSlideFormula(r, e, t, o) {
    const i = l(r, e, t, o);
    this._slideFormulas.get(i) && this._slideFormulas.delete(i);
  }
  // #endregion
  _getAllFormulasOfUnit(r) {
    return Array.from(this._docFormulas.entries()).filter((t) => t[1].unitId === r);
  }
};
g = T([
  _(0, N),
  _(1, p),
  _(2, M)
], g);
function u(s, r) {
  return `pseudo-${s}-${r}`;
}
function l(s, r, e, t) {
  return `pseudo-${s}-${r}-${e}-${t}`;
}
const j = {
  type: f.MUTATION,
  id: "doc.mutation.add-doc-uni-formula",
  handler(s, r) {
    const { unitId: e, f: t, rangeId: o } = r;
    return s.get(m).registerDocFormula(e, o, t), !0;
  }
}, J = {
  type: f.MUTATION,
  id: "doc.mutation.update-doc-uni-formula",
  handler(s, r) {
    const { unitId: e, f: t, rangeId: o } = r, i = s.get(m);
    return i.hasDocFormula(e, o) ? (i.unregisterDocFormula(e, o), i.registerDocFormula(e, o, t), !0) : !1;
  }
}, x = {
  type: f.MUTATION,
  id: "doc.mutation.remove-doc-uni-formula",
  handler(s, r) {
    const { unitId: e, rangeId: t } = r, o = s.get(m);
    return o.hasDocFormula(e, t) ? (o.unregisterDocFormula(e, t), !0) : !1;
  }
};
var G = Object.getOwnPropertyDescriptor, K = (s, r, e, t) => {
  for (var o = t > 1 ? void 0 : t ? G(r, e) : r, i = s.length - 1, n; i >= 0; i--)
    (n = s[i]) && (o = n(o) || o);
  return o;
}, V = (s, r) => (e, t) => r(e, t, s);
let h = class {
  constructor(s) {
    this._commandSrv = s, this._initCommands();
  }
  _initCommands() {
    [
      j,
      J,
      x
    ].forEach((s) => this._commandSrv.registerCommand(s));
  }
};
h = K([
  V(0, p)
], h);
var k = Object.getOwnPropertyDescriptor, W = (s, r, e, t) => {
  for (var o = t > 1 ? void 0 : t ? k(r, e) : r, i = s.length - 1, n; i >= 0; i--)
    (n = s[i]) && (o = n(o) || o);
  return o;
}, q = (s, r) => (e, t) => r(e, t, s), c;
let v = (c = class extends R {
  constructor(s, r) {
    super(), this._config = s, this._injector = r;
  }
  onStarting() {
    var r;
    const s = [[h]];
    (r = this._config) != null && r.playDumb && s.push([m, { useClass: g }]), A(this._injector, s), C(this._injector, s.map((e) => [e[0]]));
  }
}, a(c, "pluginName", w), // This plugin should load only when sheet related modules are loaded.
a(c, "type", F.UNIVER_UNKNOWN), c);
v = W([
  q(1, P($))
], v);
export {
  j as AddDocUniFormulaMutation,
  w as DOC_FORMULA_PLUGIN_NAME,
  g as DumbUniFormulaService,
  m as IUniFormulaService,
  x as RemoveDocUniFormulaMutation,
  v as UniverDocUniFormulaPlugin,
  J as UpdateDocUniFormulaMutation
};
