var Et = Object.defineProperty;
var Mt = (s, a, e) => a in s ? Et(s, a, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[a] = e;
var m = (s, a, e) => Mt(s, typeof a != "symbol" ? a + "" : a, e);
import { Inject as v, ICommandService as U, IUniverInstanceService as D, Disposable as B, ObjectMatrix as Me, getIntersectRange as ot, UniverInstanceType as N, Range as H, Rectangle as O, isFormulaString as S, getOriginCellValue as Vt, Injector as be, numfmt as L, DataValidationType as C, RBush as yt, debounce as Ct, Tools as M, DataValidationStatus as A, WrapStrategy as Se, DataValidationOperator as h, dayjs as nt, DataValidationRenderMode as We, CommandType as z, IUndoRedoService as Z, sequenceExecute as Le, isRangesEqual as lt, IPermissionService as Tt, generateRandomId as Xe, toDisposable as Ke, CellValueType as Ft, RxDisposable as Nt, LifecycleService as wt, LifecycleStages as et, bufferDebounceTime as Ot, DependentOn as At, IConfigService as It, Plugin as Dt, merge as bt } from "@univerjs/core";
import { DataValidationModel as de, DataValidatorRegistryService as q, UpdateRuleType as V, BaseDataValidator as Y, TextLengthErrorTitleMap as Lt, AddDataValidationMutation as b, RemoveDataValidationMutation as I, UpdateDataValidationMutation as y, getRuleSetting as Ut, getRuleOptions as Bt, UniverDataValidationPlugin as xt } from "@univerjs/data-validation";
import { ERROR_TYPE_SET as Pt, LexerTreeBuilder as X, isReferenceString as ut, sequenceNodeType as Ht, deserializeRangeWithSheet as Wt, deserializeRangeWithSheetWithCache as $t, operatorToken as kt } from "@univerjs/engine-formula";
import { SetRangeValuesMutation as ne, RemoveSheetMutation as ct, getSheetCommandTarget as ze, SetRangeValuesUndoMutationFactory as dt, WorksheetViewPermission as jt, RefRangeService as Qt, handleCommonDefaultRangeChangeWithEffectRefCommands as Gt, SheetInterceptorService as ht, RemoveSheetCommand as qt, CopySheetCommand as Yt, SheetsSelectionsService as mt, ClearSelectionAllCommand as Xt } from "@univerjs/sheets";
import { Subject as Ye, bufferWhen as Kt, filter as tt } from "rxjs";
import { RegisterOtherFormulaService as gt, FormulaRefRangeService as pt } from "@univerjs/sheets-formula";
var zt = Object.getOwnPropertyDescriptor, Zt = (s, a, e, t) => {
  for (var r = t > 1 ? void 0 : t ? zt(a, e) : a, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(r) || r);
  return r;
}, $e = (s, a) => (e, t) => a(e, t, s);
let Q = class extends B {
  constructor(a, e, t) {
    super();
    m(this, "_cacheMatrix", /* @__PURE__ */ new Map());
    m(this, "_dirtyRanges$", new Ye());
    m(this, "dirtyRanges$", this._dirtyRanges$.asObservable());
    this._commandService = a, this._univerInstanceService = e, this._sheetDataValidationModel = t, this._initDirtyRanges(), this._initSheetRemove();
  }
  _initDirtyRanges() {
    this.disposeWithMe(this._commandService.onCommandExecuted((a, e) => {
      if (a.id === ne.id && !(e != null && e.onlyLocal)) {
        const { cellValue: t, unitId: r, subUnitId: i } = a.params;
        if (t) {
          const o = new Me(t).getDataRange();
          if (o.endRow === -1) return;
          const u = this._sheetDataValidationModel.getRules(r, i).map((c) => c.ranges).flat().map((c) => ot(c, o)).filter(Boolean);
          u.length && this.markRangeDirty(r, i, u, !0);
        }
      }
    }));
  }
  _initSheetRemove() {
    this.disposeWithMe(this._commandService.onCommandExecuted((a) => {
      var e;
      if (a.id === ct.id) {
        const { unitId: t, subUnitId: r } = a.params;
        (e = this._cacheMatrix.get(t)) == null || e.delete(r);
      }
    })), this.disposeWithMe(this._univerInstanceService.unitDisposed$.subscribe((a) => {
      a.type === N.UNIVER_SHEET && this._cacheMatrix.delete(a.getUnitId());
    }));
  }
  _ensureCache(a, e) {
    let t = this._cacheMatrix.get(a);
    t || (t = /* @__PURE__ */ new Map(), this._cacheMatrix.set(a, t));
    let r = t.get(e);
    return r || (r = new Me(), t.set(e, r)), r;
  }
  ensureCache(a, e) {
    return this._ensureCache(a, e);
  }
  addRule(a, e, t) {
    this.markRangeDirty(a, e, t.ranges);
  }
  removeRule(a, e, t) {
    this._deleteRange(a, e, t.ranges);
  }
  markRangeDirty(a, e, t, r) {
    const i = this._ensureCache(a, e);
    t.forEach((o) => {
      H.foreach(o, (n, l) => {
        i.getValue(n, l) !== void 0 && i.setValue(n, l, void 0);
      });
    }), this._dirtyRanges$.next({ unitId: a, subUnitId: e, ranges: t, isSetRange: r });
  }
  _deleteRange(a, e, t) {
    const r = this._ensureCache(a, e);
    t.forEach((i) => {
      H.foreach(i, (o, n) => {
        r.realDeleteValue(o, n);
      });
    }), this._dirtyRanges$.next({ unitId: a, subUnitId: e, ranges: t });
  }
  getValue(a, e, t, r) {
    return this._ensureCache(a, e).getValue(t, r);
  }
};
Q = Zt([
  $e(0, v(U)),
  $e(1, v(D)),
  $e(2, v(de))
], Q);
function oe(s) {
  var a, e;
  return (e = (a = s == null ? void 0 : s[0]) == null ? void 0 : a[0]) == null ? void 0 : e.v;
}
function _e(s) {
  var a;
  return (a = s == null ? void 0 : s[0]) == null ? void 0 : a[0];
}
function T(s) {
  return !Pt.has(s);
}
function he(s, a) {
  var t;
  const e = a.getValidatorItem(s);
  return (t = e == null ? void 0 : e.offsetFormulaByRange) != null ? t : !1;
}
var Jt = Object.getOwnPropertyDescriptor, ea = (s, a, e, t) => {
  for (var r = t > 1 ? void 0 : t ? Jt(a, e) : a, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(r) || r);
  return r;
}, se = (s, a) => (e, t) => a(e, t, s);
let W = class extends B {
  constructor(a, e, t, r, i) {
    super();
    /**
     * Map of origin formula of rule
     */
    m(this, "_ruleFormulaMap", /* @__PURE__ */ new Map());
    m(this, "_ruleFormulaMap2", /* @__PURE__ */ new Map());
    this._instanceSrv = a, this._registerOtherFormulaService = e, this._dataValidationModel = t, this._dataValidationCacheService = r, this._validatorRegistryService = i, this._initFormulaResultHandler(), this._initDirtyRanges();
  }
  dispose() {
    super.dispose(), this._ruleFormulaMap.clear(), this._ruleFormulaMap2.clear();
  }
  _initFormulaResultHandler() {
    this.disposeWithMe(this._registerOtherFormulaService.formulaResult$.subscribe((a) => {
      for (const e in a) {
        const t = a[e];
        if (this._instanceSrv.getUnitType(e) === N.UNIVER_SHEET)
          for (const i in t) {
            const o = t[i], { ruleFormulaMap: n } = this._ensureMaps(e, i);
            o.forEach((l) => {
              var d, g;
              const u = n.get((d = l.extra) == null ? void 0 : d.ruleId), c = this._dataValidationModel.getRuleById(e, i, (g = l.extra) == null ? void 0 : g.ruleId);
              c && u && this._dataValidationCacheService.markRangeDirty(e, i, c.ranges);
            });
          }
      }
    }));
  }
  _ensureMaps(a, e) {
    let t = this._ruleFormulaMap.get(a), r = this._ruleFormulaMap2.get(a);
    t || (t = /* @__PURE__ */ new Map(), this._ruleFormulaMap.set(a, t)), r || (r = /* @__PURE__ */ new Map(), this._ruleFormulaMap2.set(a, r));
    let i = t.get(e);
    i || (i = /* @__PURE__ */ new Map(), t.set(e, i));
    let o = r.get(e);
    return o || (o = /* @__PURE__ */ new Map(), r.set(e, o)), { ruleFormulaMap: i, ruleFormulaMap2: o };
  }
  _registerFormula(a, e, t, r, i) {
    return this._registerOtherFormulaService.registerFormulaWithRange(a, e, r, i, { ruleId: t });
  }
  _handleDirtyRanges(a, e, t) {
    this._dataValidationModel.getRules(a, e).forEach((i) => {
      const o = i.ranges;
      O.doAnyRangesIntersect(o, t) && this.makeRuleDirty(a, e, i.uid);
    });
  }
  _initDirtyRanges() {
    this.disposeWithMe(this._dataValidationCacheService.dirtyRanges$.subscribe((a) => {
      a.isSetRange && this._handleDirtyRanges(a.unitId, a.subUnitId, a.ranges);
    }));
  }
  deleteByRuleId(a, e, t) {
    const { ruleFormulaMap: r, ruleFormulaMap2: i } = this._ensureMaps(a, e), o = this._dataValidationModel.getRuleById(a, e, t), n = r.get(t);
    if (!o || !n)
      return;
    const l = r.get(t);
    l && (r.delete(t), this._registerOtherFormulaService.deleteFormula(a, e, [l.formulaId]));
    const u = i.get(t);
    u && (i.delete(t), this._registerOtherFormulaService.deleteFormula(a, e, [u.formulaId]));
  }
  _addFormulaByRange(a, e, t, r, i, o) {
    const { ruleFormulaMap: n, ruleFormulaMap2: l } = this._ensureMaps(a, e), u = o[0].startRow, c = o[0].startColumn;
    if (r && S(r)) {
      const d = this._registerFormula(a, e, t, r, o);
      n.set(t, {
        formula: r,
        originCol: c,
        originRow: u,
        formulaId: d
      });
    }
    if (i && S(i)) {
      const d = this._registerFormula(a, e, t, i, o);
      l.set(t, {
        formula: i,
        originCol: c,
        originRow: u,
        formulaId: d
      });
    }
  }
  addRule(a, e, t) {
    if (he(t.type, this._validatorRegistryService)) {
      const { ranges: r, formula1: i, formula2: o, uid: n } = t;
      this._addFormulaByRange(a, e, n, i, o, r);
    }
  }
  async getCellFormulaValue(a, e, t, r, i) {
    var f, p;
    const { ruleFormulaMap: o } = this._ensureMaps(a, e), n = o.get(t);
    if (!n)
      return Promise.resolve(void 0);
    const l = await this._registerOtherFormulaService.getFormulaValue(a, e, n.formulaId), { originRow: u, originCol: c } = n, d = r - u, g = i - c;
    return _e((p = (f = l == null ? void 0 : l.result) == null ? void 0 : f[d]) == null ? void 0 : p[g]);
  }
  async getCellFormula2Value(a, e, t, r, i) {
    var f, p;
    const { ruleFormulaMap2: o } = this._ensureMaps(a, e), n = o.get(t);
    if (!n)
      return Promise.resolve(void 0);
    const l = await this._registerOtherFormulaService.getFormulaValue(a, e, n.formulaId), { originRow: u, originCol: c } = n, d = r - u, g = i - c;
    return _e((p = (f = l == null ? void 0 : l.result) == null ? void 0 : f[d]) == null ? void 0 : p[g]);
  }
  getCellFormulaValueSync(a, e, t, r, i) {
    var f, p;
    const { ruleFormulaMap: o } = this._ensureMaps(a, e), n = o.get(t);
    if (!n)
      return;
    const l = this._registerOtherFormulaService.getFormulaValueSync(a, e, n.formulaId), { originRow: u, originCol: c } = n, d = r - u, g = i - c;
    return _e((p = (f = l == null ? void 0 : l.result) == null ? void 0 : f[d]) == null ? void 0 : p[g]);
  }
  getCellFormula2ValueSync(a, e, t, r, i) {
    var f, p;
    const { ruleFormulaMap2: o } = this._ensureMaps(a, e), n = o.get(t);
    if (!n)
      return;
    const l = this._registerOtherFormulaService.getFormulaValueSync(a, e, n.formulaId), { originRow: u, originCol: c } = n, d = r - u, g = i - c;
    return _e((p = (f = l == null ? void 0 : l.result) == null ? void 0 : f[d]) == null ? void 0 : p[g]);
  }
  getRuleFormulaInfo(a, e, t) {
    const { ruleFormulaMap: r } = this._ensureMaps(a, e);
    return r.get(t);
  }
  makeRuleDirty(a, e, t) {
    var o, n, l, u;
    const r = (n = (o = this._ruleFormulaMap.get(a)) == null ? void 0 : o.get(e)) == null ? void 0 : n.get(t), i = (u = (l = this._ruleFormulaMap2.get(a)) == null ? void 0 : l.get(e)) == null ? void 0 : u.get(t);
    r && this._registerOtherFormulaService.markFormulaDirty(a, e, r.formulaId), i && this._registerOtherFormulaService.markFormulaDirty(a, e, i.formulaId);
  }
};
W = ea([
  se(0, D),
  se(1, v(gt)),
  se(2, v(de)),
  se(3, v(Q)),
  se(4, v(q))
], W);
function re(s) {
  return Vt(s);
}
function ft(s) {
  var a;
  return String((a = re(s)) != null ? a : "");
}
function er(s) {
  return s.filter(Boolean).join(",");
}
function Ee(s) {
  return s.split(",").filter(Boolean);
}
function tr(s) {
  const a = re(s);
  return a == null ? "" : a.toString();
}
function Ue(s, a, e) {
  const { formula1: t, formula2: r } = a, i = a.ranges[0].startRow, o = a.ranges[0].startColumn, n = e.row - i, l = e.col - o, u = S(t) ? s.moveFormulaRefOffset(t, l, n, !0) : t, c = S(r) ? s.moveFormulaRefOffset(r, l, n, !0) : r;
  return {
    transformedFormula1: u,
    transformedFormula2: c
  };
}
var ta = Object.getOwnPropertyDescriptor, aa = (s, a, e, t) => {
  for (var r = t > 1 ? void 0 : t ? ta(a, e) : a, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(r) || r);
  return r;
}, at = (s, a) => (e, t) => a(e, t, s);
let le = class extends B {
  constructor(a, e) {
    super();
    // Cache structure: unitId -> subUnitId -> ruleId -> cache item
    m(this, "_cache", /* @__PURE__ */ new Map());
    this._injector = a, this._dataValidationModel = e, this._initRuleChangeListener();
  }
  _initRuleChangeListener() {
    this.disposeWithMe(
      this._dataValidationModel.ruleChange$.subscribe((a) => {
        (a.type === "remove" || a.type === "update") && this.markRuleDirty(a.unitId, a.subUnitId, a.rule.uid);
      })
    );
  }
  /**
   * Get cached list data or compute and cache it if not exists.
   */
  getOrCompute(a, e, t) {
    const r = this.getCache(a, e, t.uid);
    if (r)
      return r;
    const o = this._injector.get(G).getRuleFormulaResultSync(a, e, t.uid);
    return this.computeAndCache(a, e, t, o);
  }
  _ensureCache(a, e) {
    let t = this._cache.get(a);
    t || (t = /* @__PURE__ */ new Map(), this._cache.set(a, t));
    let r = t.get(e);
    return r || (r = /* @__PURE__ */ new Map(), t.set(e, r)), r;
  }
  /**
   * Get cached list data for a rule. Returns undefined if not cached.
   */
  getCache(a, e, t) {
    var r, i;
    return (i = (r = this._cache.get(a)) == null ? void 0 : r.get(e)) == null ? void 0 : i.get(t);
  }
  /**
   * Set cache for a rule.
   */
  setCache(a, e, t, r) {
    this._ensureCache(a, e).set(t, r);
  }
  /**
   * Mark a rule's cache as dirty (invalidate it).
   * Called when formula results change.
   */
  markRuleDirty(a, e, t) {
    var r, i;
    (i = (r = this._cache.get(a)) == null ? void 0 : r.get(e)) == null || i.delete(t);
  }
  /**
   * Clear all caches.
   */
  clear() {
    this._cache.clear();
  }
  /**
   * Compute list data from formula result and cache it.
   */
  computeAndCache(a, e, t, r) {
    var f, p, R;
    const { formula1: i = "", formula2: o = "" } = t, n = S(i) ? this._getRuleFormulaResultSet((R = (p = (f = r == null ? void 0 : r[0]) == null ? void 0 : f.result) == null ? void 0 : p[0]) == null ? void 0 : R[0]) : Ee(i), l = o.split(","), u = n.map((E, _) => ({ label: E, color: l[_] || "" })), c = {};
    for (const E of u)
      E.color && (c[E.label] = E.color);
    const d = new Set(n), g = { list: n, listWithColor: u, colorMap: c, set: d };
    return this.setCache(a, e, t.uid, g), g;
  }
  /**
   * Extract string list from formula result cells.
   */
  _getRuleFormulaResultSet(a) {
    var t, r;
    if (!a)
      return [];
    const e = /* @__PURE__ */ new Set();
    for (let i = 0, o = a.length; i < o; i++) {
      const n = a[i];
      if (n)
        for (let l = 0, u = n.length; l < u; l++) {
          const c = n[l], d = re(c);
          if (d != null) {
            if (typeof d != "string" && typeof (c == null ? void 0 : c.s) == "object" && ((r = (t = c.s) == null ? void 0 : t.n) != null && r.pattern)) {
              e.add(L.format(c.s.n.pattern, d, { throws: !1 }));
              continue;
            }
            const g = typeof d == "string" ? d : String(d);
            T(g) && e.add(g);
          }
        }
    }
    return [...e];
  }
};
le = aa([
  at(0, v(be)),
  at(1, v(de))
], le);
var ra = Object.getOwnPropertyDescriptor, ia = (s, a, e, t) => {
  for (var r = t > 1 ? void 0 : t ? ra(a, e) : a, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(r) || r);
  return r;
}, ee = (s, a) => (e, t) => a(e, t, s);
let G = class extends B {
  constructor(a, e, t, r, i, o) {
    super();
    m(this, "_formulaRuleMap", /* @__PURE__ */ new Map());
    this._instanceService = a, this._registerOtherFormulaService = e, this._dataValidationCacheService = t, this._dataValidationModel = r, this._validatorRegistryService = i, this._listCacheService = o, this._initFormulaResultHandler();
  }
  _initFormulaResultHandler() {
    this.disposeWithMe(this._registerOtherFormulaService.formulaResult$.subscribe((a) => {
      for (const e in a) {
        const t = a[e];
        if (this._instanceService.getUnitType(e) === N.UNIVER_SHEET)
          for (const i in t) {
            const o = t[i], n = this._ensureRuleFormulaMap(e, i);
            o.forEach((l) => {
              var c;
              const u = (c = l.extra) == null ? void 0 : c.ruleId;
              if (u && n.get(u)) {
                const d = this._dataValidationModel.getRuleById(e, i, u);
                d && (this._listCacheService.markRuleDirty(e, i, u), this._dataValidationCacheService.markRangeDirty(e, i, d.ranges));
              }
            });
          }
      }
    }));
  }
  _ensureRuleFormulaMap(a, e) {
    let t = this._formulaRuleMap.get(a);
    t || (t = /* @__PURE__ */ new Map(), this._formulaRuleMap.set(a, t));
    let r = t.get(e);
    return r || (r = /* @__PURE__ */ new Map(), t.set(e, r)), r;
  }
  _registerSingleFormula(a, e, t, r) {
    const i = [{ startColumn: 0, endColumn: 0, startRow: 0, endRow: 0 }];
    return this._registerOtherFormulaService.registerFormulaWithRange(a, e, t, i, { ruleId: r });
  }
  addRule(a, e, t) {
    if (!he(t.type, this._validatorRegistryService) && t.type !== C.CHECKBOX) {
      const { formula1: r, formula2: i, uid: o } = t, n = S(r), l = S(i);
      if (!n && !l)
        return;
      const u = this._ensureRuleFormulaMap(a, e), c = [void 0, void 0];
      if (n) {
        const d = this._registerSingleFormula(a, e, r, o);
        c[0] = { id: d, text: r };
      }
      if (l) {
        const d = this._registerSingleFormula(a, e, i, o);
        c[1] = { id: d, text: i };
      }
      u.set(o, c);
    }
  }
  removeRule(a, e, t) {
    const i = this._ensureRuleFormulaMap(a, e).get(t);
    if (!i)
      return;
    const [o, n] = i, l = [o == null ? void 0 : o.id, n == null ? void 0 : n.id].filter(Boolean);
    l.length && this._registerOtherFormulaService.deleteFormula(a, e, l);
  }
  getRuleFormulaResult(a, e, t) {
    const i = this._ensureRuleFormulaMap(a, e).get(t);
    if (!i)
      return Promise.resolve(null);
    const o = async (n) => n && this._registerOtherFormulaService.getFormulaValue(a, e, n.id);
    return Promise.all([
      o(i[0]),
      o(i[1])
    ]);
  }
  getRuleFormulaResultSync(a, e, t) {
    const i = this._ensureRuleFormulaMap(a, e).get(t);
    if (i)
      return i.map((o) => {
        if (o)
          return this._registerOtherFormulaService.getFormulaValueSync(a, e, o.id);
      });
  }
  getRuleFormulaInfo(a, e, t) {
    return this._ensureRuleFormulaMap(a, e).get(t);
  }
};
G = ia([
  ee(0, D),
  ee(1, v(gt)),
  ee(2, v(Q)),
  ee(3, v(de)),
  ee(4, v(q)),
  ee(5, v(le))
], G);
class Ze {
  constructor(a, e, t, r, i = !1) {
    m(this, "_map");
    m(this, "_tree", new yt());
    m(this, "_dirty", !0);
    m(this, "_buildTree", () => {
      if (!this._dirty || this._disableTree)
        return;
      this._tree.clear();
      const a = [];
      this._map.forEach((e, t) => {
        e.forEach((r) => {
          a.push({
            minX: r.startRow,
            maxX: r.endRow,
            minY: r.startColumn,
            maxY: r.endColumn,
            ruleId: t
          });
        });
      }), this._tree.load(a), this._dirty = !1;
    });
    m(this, "_debonceBuildTree", Ct(this._buildTree, 0));
    this._unitId = e, this._subUnitId = t, this._univerInstanceService = r, this._disableTree = i, this._map = a, this._buildTree();
  }
  get _worksheet() {
    var a;
    return (a = this._univerInstanceService.getUnit(this._unitId, N.UNIVER_SHEET)) == null ? void 0 : a.getSheetBySheetId(this._subUnitId);
  }
  _addRule(a, e) {
    if (!this._worksheet)
      return;
    const t = O.mergeRanges(e.map((r) => H.transformRange(r, this._worksheet)));
    this._map.forEach((r, i) => {
      const o = O.subtractMulti(r, t);
      o.length === 0 ? this._map.delete(i) : this._map.set(i, o);
    }), this._dirty = !0, this._map.set(a, t), this._debonceBuildTree();
  }
  addRule(a) {
    this._addRule(a.uid, a.ranges);
  }
  removeRange(a) {
    if (!this._worksheet)
      return;
    const e = a.map((t) => H.transformRange(t, this._worksheet));
    this._map.forEach((t, r) => {
      const i = O.subtractMulti(t, e);
      i.length === 0 ? this._map.delete(r) : this._map.set(r, i);
    }), this._dirty = !0, this._debonceBuildTree();
  }
  _removeRule(a) {
    this._map.delete(a), this._dirty = !0, this._debonceBuildTree();
  }
  removeRule(a) {
    this._removeRule(a.uid);
  }
  updateRange(a, e) {
    this._removeRule(a), this._addRule(a, e);
  }
  addRangeRules(a) {
    a.forEach(({ id: e, ranges: t }) => {
      if (!t.length)
        return;
      let r = this._map.get(e);
      r ? (this._map.set(e, O.mergeRanges([...r, ...t])), r = this._map.get(e)) : (r = t, this._map.set(e, r)), this._map.forEach((i, o) => {
        if (o === e)
          return;
        const n = O.subtractMulti(i, t);
        n.length === 0 ? this._map.delete(o) : this._map.set(o, n);
      });
    }), this._dirty = !0, this._debonceBuildTree();
  }
  diff(a) {
    const e = [];
    let t = 0;
    return a.forEach((r, i) => {
      var l;
      const o = (l = this._map.get(r.uid)) != null ? l : [], n = r.ranges;
      o.length !== 0 && (o.length !== n.length || o.some((u, c) => !O.equals(u, n[c]))) && e.push({
        type: "update",
        ruleId: r.uid,
        oldRanges: n,
        newRanges: O.sort(o),
        rule: r
      }), o.length === 0 && (e.push({
        type: "delete",
        rule: r,
        index: i - t
      }), t++);
    }), e;
  }
  diffWithAddition(a, e) {
    const t = [];
    let r = 0;
    return a.forEach((i, o) => {
      var u;
      const n = (u = this._map.get(i.uid)) != null ? u : [], l = i.ranges;
      n.length !== 0 && (n.length !== l.length || n.some((c, d) => !O.equals(c, l[d]))) && t.push({
        type: "update",
        ruleId: i.uid,
        oldRanges: l,
        newRanges: O.sort(n),
        rule: i
      }), n.length === 0 && (t.push({
        type: "delete",
        rule: i,
        index: o - r
      }), r++);
    }), Array.from(e).forEach((i) => {
      var n;
      const o = (n = this._map.get(i.uid)) != null ? n : [];
      t.push({
        type: "add",
        rule: {
          ...i,
          ranges: O.sort(o)
        }
      });
    }), t;
  }
  clone() {
    return new Ze(
      new Map(M.deepClone(Array.from(this._map.entries()))),
      this._unitId,
      this._subUnitId,
      this._univerInstanceService,
      // disable tree on cloned matrix, cause there is no need to search
      !0
    );
  }
  getValue(a, e) {
    this._dirty && this._buildTree();
    const t = this._tree.search({
      minX: a,
      maxX: a,
      minY: e,
      maxY: e
    });
    return t.length > 0 ? t[0].ruleId : void 0;
  }
}
var sa = Object.getOwnPropertyDescriptor, oa = (s, a, e, t) => {
  for (var r = t > 1 ? void 0 : t ? sa(a, e) : a, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(r) || r);
  return r;
}, K = (s, a) => (e, t) => a(e, t, s);
let F = class extends B {
  constructor(a, e, t, r, i, o, n) {
    super();
    m(this, "_ruleMatrixMap", /* @__PURE__ */ new Map());
    m(this, "_validStatusChange$", new Ye());
    m(this, "_ruleChange$", new Ye());
    m(this, "ruleChange$", this._ruleChange$.asObservable());
    m(this, "validStatusChange$", this._validStatusChange$.asObservable());
    this._dataValidationModel = a, this._univerInstanceService = e, this._dataValidatorRegistryService = t, this._dataValidationCacheService = r, this._dataValidationFormulaService = i, this._dataValidationCustomFormulaService = o, this._commandService = n, this._initRuleUpdateListener(), this.disposeWithMe(() => {
      this._ruleChange$.complete(), this._validStatusChange$.complete();
    }), this._initUniverInstanceListener();
  }
  _initUniverInstanceListener() {
    this.disposeWithMe(
      this._univerInstanceService.unitDisposed$.subscribe((a) => {
        this._ruleMatrixMap.delete(a.getUnitId());
      })
    ), this.disposeWithMe(
      this._commandService.onCommandExecuted((a) => {
        if (a.id === ct.id) {
          const { unitId: e, subUnitId: t } = a.params, r = this._ruleMatrixMap.get(e);
          r && r.delete(t);
        }
      })
    );
  }
  _initRuleUpdateListener() {
    const a = this._dataValidationModel.getAll();
    for (const [e, t] of a)
      for (const [r, i] of t)
        for (const o of i)
          this._addRule(e, r, o), this._ruleChange$.next({
            type: "add",
            unitId: e,
            subUnitId: r,
            rule: o,
            source: "patched"
          });
    this.disposeWithMe(
      this._dataValidationModel.ruleChange$.subscribe((e) => {
        switch (e.type) {
          case "add":
            this._addRule(e.unitId, e.subUnitId, e.rule);
            break;
          case "update":
            this._updateRule(e.unitId, e.subUnitId, e.rule.uid, e.oldRule, e.updatePayload);
            break;
          case "remove":
            this._removeRule(e.unitId, e.subUnitId, e.rule);
            break;
        }
        this._ruleChange$.next(e);
      })
    );
  }
  _ensureRuleMatrix(a, e) {
    let t = this._ruleMatrixMap.get(a);
    t || (t = /* @__PURE__ */ new Map(), this._ruleMatrixMap.set(a, t));
    let r = t.get(e);
    return r || (r = new Ze(/* @__PURE__ */ new Map(), a, e, this._univerInstanceService), t.set(e, r)), r;
  }
  _addRuleSideEffect(a, e, t) {
    this._ensureRuleMatrix(a, e).addRule(t), this._dataValidationCacheService.addRule(a, e, t), this._dataValidationFormulaService.addRule(a, e, t), this._dataValidationCustomFormulaService.addRule(a, e, t);
  }
  _addRule(a, e, t) {
    (Array.isArray(t) ? t : [t]).forEach((i) => {
      this._addRuleSideEffect(a, e, i);
    });
  }
  _updateRule(a, e, t, r, i) {
    const o = this._ensureRuleMatrix(a, e), n = {
      ...r,
      ...i.payload
    };
    i.type === V.RANGE ? o.updateRange(t, i.payload) : i.type === V.ALL && o.updateRange(t, i.payload.ranges), this._dataValidationCacheService.removeRule(a, e, r), this._dataValidationCacheService.addRule(a, e, n), this._dataValidationFormulaService.removeRule(a, e, r.uid), this._dataValidationFormulaService.addRule(a, e, n), this._dataValidationCustomFormulaService.deleteByRuleId(a, e, t), this._dataValidationCustomFormulaService.addRule(a, e, n);
  }
  _removeRule(a, e, t) {
    this._ensureRuleMatrix(a, e).removeRule(t), this._dataValidationCacheService.removeRule(a, e, t), this._dataValidationCustomFormulaService.deleteByRuleId(a, e, t.uid);
  }
  getValidator(a) {
    return this._dataValidatorRegistryService.getValidatorItem(a);
  }
  getRuleIdByLocation(a, e, t, r) {
    return this._ensureRuleMatrix(a, e).getValue(t, r);
  }
  getRuleByLocation(a, e, t, r) {
    const i = this.getRuleIdByLocation(a, e, t, r);
    if (i)
      return this._dataValidationModel.getRuleById(a, e, i);
  }
  validator(a, e, t) {
    const { col: r, row: i, unitId: o, subUnitId: n, worksheet: l } = e, u = (p, R) => {
      t && t(p, R), R && this._validStatusChange$.next({
        unitId: o,
        subUnitId: n,
        ruleId: a.uid,
        status: p,
        row: i,
        col: r
      });
    }, c = l.getCellValueOnly(i, r), d = this.getValidator(a.type), g = l.getCellRaw(i, r), f = re(g);
    if (d) {
      const p = this._dataValidationCacheService.ensureCache(o, n), R = p.getValue(i, r);
      return R == null ? (p.setValue(i, r, A.VALIDATING), d.validator(
        {
          value: f,
          unitId: o,
          subUnitId: n,
          row: i,
          column: r,
          worksheet: e.worksheet,
          workbook: e.workbook,
          interceptValue: re(c),
          t: g == null ? void 0 : g.t
        },
        a
      ).then((E) => {
        const _ = E ? A.VALID : A.INVALID, w = p.getValue(i, r);
        _ === A.VALID ? p.realDeleteValue(i, r) : p.setValue(i, r, _), u(_, R !== w);
      }), A.VALIDATING) : (u(R != null ? R : A.VALID, !1), R != null ? R : A.VALID);
    } else
      return u(A.VALID, !1), A.VALID;
  }
  getRuleObjectMatrix(a, e) {
    return this._ensureRuleMatrix(a, e);
  }
  getRuleById(a, e, t) {
    return this._dataValidationModel.getRuleById(a, e, t);
  }
  getRuleIndex(a, e, t) {
    return this._dataValidationModel.getRuleIndex(a, e, t);
  }
  getRules(a, e) {
    return [...this._dataValidationModel.getRules(a, e)];
  }
  getUnitRules(a) {
    return this._dataValidationModel.getUnitRules(a);
  }
  deleteUnitRules(a) {
    return this._dataValidationModel.deleteUnitRules(a);
  }
  getSubUnitIds(a) {
    return this._dataValidationModel.getSubUnitIds(a);
  }
  getAll() {
    return this._dataValidationModel.getAll();
  }
};
F = oa([
  K(0, v(de)),
  K(1, D),
  K(2, v(q)),
  K(3, v(Q)),
  K(4, v(G)),
  K(5, v(W)),
  K(6, U)
], F);
const Ve = 1, ye = 0;
function rt(s, a) {
  return M.isBlank(s) ? a.t("dataValidation.validFail.value") : S(s) ? a.t("dataValidation.validFail.primitive") : "";
}
const ve = (s) => M.isDefine(s) && String(s).toLowerCase() === "true" ? "1" : String(s).toLowerCase() === "false" ? "0" : s;
class na extends Y {
  constructor() {
    super(...arguments);
    m(this, "id", C.CHECKBOX);
    m(this, "title", "dataValidation.checkbox.title");
    m(this, "operators", []);
    m(this, "scopes", ["sheet"]);
    m(this, "order", 41);
    m(this, "offsetFormulaByRange", !1);
    m(this, "_formulaService", this.injector.get(G));
    m(this, "skipDefaultFontRender", (e, t, r) => {
      const { unitId: i, subUnitId: o } = r, { formula1: n, formula2: l } = this.parseFormulaSync(e, i, o), u = `${t != null ? t : ""}`;
      return !u || u === `${n}` || u === `${l}`;
    });
  }
  validatorFormula(e, t, r) {
    const { formula1: i, formula2: o } = e, n = i === o;
    if (M.isBlank(i) && M.isBlank(o))
      return {
        success: !0
      };
    if (n)
      return {
        success: !1,
        formula1: this.localeService.t("dataValidation.validFail.checkboxEqual"),
        formula2: this.localeService.t("dataValidation.validFail.checkboxEqual")
      };
    const l = rt(i, this.localeService), u = rt(o, this.localeService);
    return {
      success: !l && !u,
      formula1: l,
      formula2: u
    };
  }
  async parseFormula(e, t, r) {
    var d, g, f, p;
    const { formula1: i = Ve, formula2: o = ye } = e, n = await this._formulaService.getRuleFormulaResult(t, r, e.uid), l = S(i) ? oe((g = (d = n == null ? void 0 : n[0]) == null ? void 0 : d.result) == null ? void 0 : g[0][0]) : i, u = S(o) ? oe((p = (f = n == null ? void 0 : n[1]) == null ? void 0 : f.result) == null ? void 0 : p[0][0]) : o, c = T(String(l)) && T(String(u));
    return {
      formula1: ve(l),
      formula2: ve(u),
      originFormula1: l,
      originFormula2: u,
      isFormulaValid: c
    };
  }
  getExtraStyle(e, t) {
    return {
      tb: Se.CLIP
    };
  }
  parseFormulaSync(e, t, r) {
    var d, g, f, p;
    const { formula1: i = Ve, formula2: o = ye } = e, n = this._formulaService.getRuleFormulaResultSync(t, r, e.uid), l = S(i) ? oe((g = (d = n == null ? void 0 : n[0]) == null ? void 0 : d.result) == null ? void 0 : g[0][0]) : i, u = S(o) ? oe((p = (f = n == null ? void 0 : n[1]) == null ? void 0 : f.result) == null ? void 0 : p[0][0]) : o, c = T(String(l)) && T(String(u));
    return {
      formula1: ve(l),
      formula2: ve(u),
      originFormula1: l,
      originFormula2: u,
      isFormulaValid: c
    };
  }
  async isValidType(e, t, r) {
    const { value: i, unitId: o, subUnitId: n } = e, { formula1: l, formula2: u, originFormula1: c, originFormula2: d } = await this.parseFormula(r, o, n);
    return !M.isDefine(l) || !M.isDefine(u) ? !0 : M.isDefine(i) && (String(i) === String(l) || String(i) === String(u) || String(i) === String(c != null ? c : "") || String(i) === String(d != null ? d : ""));
  }
  generateRuleErrorMessage(e) {
    return this.localeService.t("dataValidation.checkbox.error");
  }
  generateRuleName(e) {
    return this.titleStr;
  }
}
const la = {
  [h.BETWEEN]: "dataValidation.date.operators.between",
  [h.EQUAL]: "dataValidation.date.operators.equal",
  [h.GREATER_THAN]: "dataValidation.date.operators.greaterThan",
  [h.GREATER_THAN_OR_EQUAL]: "dataValidation.date.operators.greaterThanOrEqual",
  [h.LESS_THAN]: "dataValidation.date.operators.lessThan",
  [h.LESS_THAN_OR_EQUAL]: "dataValidation.date.operators.lessThanOrEqual",
  [h.NOT_BETWEEN]: "dataValidation.date.operators.notBetween",
  [h.NOT_EQUAL]: "dataValidation.date.operators.notEqual"
};
h.BETWEEN + "", h.EQUAL + "", h.GREATER_THAN + "", h.GREATER_THAN_OR_EQUAL + "", h.LESS_THAN + "", h.LESS_THAN_OR_EQUAL + "", h.NOT_BETWEEN + "", h.NOT_EQUAL + "";
const it = {
  [h.BETWEEN]: "dataValidation.date.ruleName.between",
  [h.EQUAL]: "dataValidation.date.ruleName.equal",
  [h.GREATER_THAN]: "dataValidation.date.ruleName.greaterThan",
  [h.GREATER_THAN_OR_EQUAL]: "dataValidation.date.ruleName.greaterThanOrEqual",
  [h.LESS_THAN]: "dataValidation.date.ruleName.lessThan",
  [h.LESS_THAN_OR_EQUAL]: "dataValidation.date.ruleName.lessThanOrEqual",
  [h.NOT_BETWEEN]: "dataValidation.date.ruleName.notBetween",
  [h.NOT_EQUAL]: "dataValidation.date.ruleName.notEqual",
  NONE: "dataValidation.date.ruleName.legal"
}, ua = {
  [h.BETWEEN]: "dataValidation.date.errorMsg.between",
  [h.EQUAL]: "dataValidation.date.errorMsg.equal",
  [h.GREATER_THAN]: "dataValidation.date.errorMsg.greaterThan",
  [h.GREATER_THAN_OR_EQUAL]: "dataValidation.date.errorMsg.greaterThanOrEqual",
  [h.LESS_THAN]: "dataValidation.date.errorMsg.lessThan",
  [h.LESS_THAN_OR_EQUAL]: "dataValidation.date.errorMsg.lessThanOrEqual",
  [h.NOT_BETWEEN]: "dataValidation.date.errorMsg.notBetween",
  [h.NOT_EQUAL]: "dataValidation.date.errorMsg.notEqual",
  NONE: "dataValidation.date.errorMsg.legal"
}, Be = [
  h.BETWEEN,
  h.NOT_BETWEEN
], ue = "{FORMULA1}", ce = "{FORMULA2}", ke = (s) => {
  var e, t;
  if (s == null || typeof s == "boolean")
    return;
  if (typeof s == "number" || !Number.isNaN(+s))
    return +s;
  const a = (e = L.parseDate(s)) == null ? void 0 : e.v;
  return M.isDefine(a) ? a : (t = L.parseDate(nt(s).format("YYYY-MM-DD HH:mm:ss"))) == null ? void 0 : t.v;
};
class ca extends Y {
  constructor() {
    super(...arguments);
    m(this, "id", C.DATE);
    m(this, "title", "dataValidation.date.title");
    m(this, "order", 40);
    m(this, "operators", [
      h.BETWEEN,
      h.EQUAL,
      h.GREATER_THAN,
      h.GREATER_THAN_OR_EQUAL,
      h.LESS_THAN,
      h.LESS_THAN_OR_EQUAL,
      h.NOT_BETWEEN,
      h.NOT_EQUAL
    ]);
    m(this, "scopes", ["sheet"]);
    m(this, "_customFormulaService", this.injector.get(W));
    m(this, "_lexerTreeBuilder", this.injector.get(X));
  }
  async parseFormula(e, t, r, i, o) {
    const n = await this._customFormulaService.getCellFormulaValue(t, r, e.uid, i, o), l = await this._customFormulaService.getCellFormula2Value(t, r, e.uid, i, o), { formula1: u, formula2: c } = e, d = T(String(n == null ? void 0 : n.v)) && T(String(l == null ? void 0 : l.v));
    return {
      formula1: ke(S(u) ? n == null ? void 0 : n.v : u),
      formula2: ke(S(c) ? l == null ? void 0 : l.v : c),
      isFormulaValid: d
    };
  }
  async isValidType(e) {
    const { interceptValue: t, value: r } = e;
    return typeof r == "number" && typeof t == "string" ? !!L.parseDate(t) : typeof t == "string" ? !!L.parseDate(t) : !1;
  }
  _validatorSingleFormula(e) {
    return !M.isBlank(e) && (S(e) || !Number.isNaN(+e) || !!(e && L.parseDate(e)));
  }
  validatorFormula(e, t, r) {
    const i = e.operator;
    if (!i)
      return {
        success: !0
      };
    const o = this._validatorSingleFormula(e.formula1), n = this.localeService.t("dataValidation.validFail.date");
    if (Be.includes(i)) {
      const u = this._validatorSingleFormula(e.formula2);
      return {
        success: o && u,
        formula1: o ? void 0 : n,
        formula2: u ? void 0 : n
      };
    }
    return {
      success: o,
      formula1: o ? void 0 : n
    };
  }
  normalizeFormula(e, t, r) {
    const { formula1: i, formula2: o, bizInfo: n } = e, l = (u) => {
      var d;
      if (!u)
        return u;
      let c;
      if (!Number.isNaN(+u))
        c = L.dateFromSerial(+u);
      else {
        const g = (d = L.parseDate(u)) == null ? void 0 : d.v;
        if (g == null)
          return "";
        c = L.dateFromSerial(g);
      }
      return nt(`${c[0]}/${c[1]}/${c[2]} ${c[3]}:${c[4]}:${c[5]}`).format(n != null && n.showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD");
    };
    return {
      formula1: S(i) ? i : l(`${i}`),
      formula2: S(o) ? o : l(`${o}`)
    };
  }
  transform(e, t, r) {
    const { value: i } = e;
    return {
      ...e,
      value: ke(i)
    };
  }
  get operatorNames() {
    return this.operators.map((e) => this.localeService.t(la[e]));
  }
  generateRuleName(e) {
    var r, i;
    if (!e.operator)
      return this.localeService.t(it.NONE);
    const t = this.localeService.t(it[e.operator]).replace(ue, (r = e.formula1) != null ? r : "").replace(ce, (i = e.formula2) != null ? i : "");
    return `${this.titleStr} ${t}`;
  }
  generateRuleErrorMessage(e, t) {
    if (!e.operator)
      return this.titleStr;
    const { transformedFormula1: r, transformedFormula2: i } = Ue(this._lexerTreeBuilder, e, t);
    return `${this.localeService.t(ua[e.operator]).replace(ue, r != null ? r : "").replace(ce, i != null ? i : "")}`;
  }
}
h.BETWEEN + "", h.EQUAL + "", h.GREATER_THAN + "", h.GREATER_THAN_OR_EQUAL + "", h.LESS_THAN + "", h.LESS_THAN_OR_EQUAL + "", h.NOT_BETWEEN + "", h.NOT_EQUAL + "";
h.BETWEEN + "", h.EQUAL + "", h.GREATER_THAN + "", h.GREATER_THAN_OR_EQUAL + "", h.LESS_THAN + "", h.LESS_THAN_OR_EQUAL + "", h.NOT_BETWEEN + "", h.NOT_EQUAL + "";
const Ce = {
  [h.BETWEEN]: "dataValidation.errorMsg.between",
  [h.EQUAL]: "dataValidation.errorMsg.equal",
  [h.GREATER_THAN]: "dataValidation.errorMsg.greaterThan",
  [h.GREATER_THAN_OR_EQUAL]: "dataValidation.errorMsg.greaterThanOrEqual",
  [h.LESS_THAN]: "dataValidation.errorMsg.lessThan",
  [h.LESS_THAN_OR_EQUAL]: "dataValidation.errorMsg.lessThanOrEqual",
  [h.NOT_BETWEEN]: "dataValidation.errorMsg.notBetween",
  [h.NOT_EQUAL]: "dataValidation.errorMsg.notEqual",
  NONE: "dataValidation.errorMsg.legal"
};
function Te(s) {
  return +s;
}
class da extends Y {
  constructor() {
    super(...arguments);
    m(this, "_customFormulaService", this.injector.get(W));
    m(this, "id", C.DECIMAL);
    m(this, "_lexerTreeBuilder", this.injector.get(X));
    m(this, "title", "dataValidation.decimal.title");
    m(this, "order", 20);
    m(this, "operators", [
      h.BETWEEN,
      h.EQUAL,
      h.GREATER_THAN,
      h.GREATER_THAN_OR_EQUAL,
      h.LESS_THAN,
      h.LESS_THAN_OR_EQUAL,
      h.NOT_BETWEEN,
      h.NOT_EQUAL
    ]);
    m(this, "scopes", ["sheet"]);
  }
  _isFormulaOrNumber(e) {
    return !M.isBlank(e) && (S(e) || !Number.isNaN(+e));
  }
  async isValidType(e, t, r) {
    const { value: i } = e;
    return !Number.isNaN(Te(i));
  }
  transform(e, t, r) {
    const { value: i } = e;
    return {
      ...e,
      value: Te(i)
    };
  }
  _parseNumber(e) {
    return e == null ? Number.NaN : +e;
  }
  async parseFormula(e, t, r, i, o) {
    const n = await this._customFormulaService.getCellFormulaValue(t, r, e.uid, i, o), l = await this._customFormulaService.getCellFormula2Value(t, r, e.uid, i, o), { formula1: u, formula2: c } = e, d = T(String(n == null ? void 0 : n.v)) && T(String(l == null ? void 0 : l.v));
    return {
      formula1: this._parseNumber(S(u) ? n == null ? void 0 : n.v : u),
      formula2: this._parseNumber(S(c) ? l == null ? void 0 : l.v : c),
      isFormulaValid: d
    };
  }
  validatorFormula(e, t, r) {
    const i = e.operator;
    if (!i)
      return {
        success: !0
      };
    const o = M.isDefine(e.formula1) && this._isFormulaOrNumber(e.formula1), n = M.isDefine(e.formula2) && this._isFormulaOrNumber(e.formula2), l = Be.includes(i), u = this.localeService.t("dataValidation.validFail.number");
    return l ? {
      success: o && n,
      formula1: o ? void 0 : u,
      formula2: n ? void 0 : u
    } : {
      success: o,
      formula1: o ? "" : u
    };
  }
  generateRuleErrorMessage(e, t) {
    if (!e.operator)
      return this.localeService.t(Ce.NONE).replace("{TYPE}", this.titleStr);
    const { transformedFormula1: r, transformedFormula2: i } = Ue(this._lexerTreeBuilder, e, t);
    return `${this.localeService.t(Ce[e.operator]).replace(ue, r != null ? r : "").replace(ce, i != null ? i : "")}`;
  }
}
function ha(s) {
  var e, t;
  if (!s)
    return [];
  const a = /* @__PURE__ */ new Set();
  for (let r = 0, i = s.length; r < i; r++) {
    const o = s[r];
    if (o)
      for (let n = 0, l = o.length; n < l; n++) {
        const u = o[n], c = re(u);
        if (c != null) {
          if (typeof c != "string" && typeof (u == null ? void 0 : u.s) == "object" && ((t = (e = u.s) == null ? void 0 : e.n) != null && t.pattern)) {
            a.add(L.format(u.s.n.pattern, c, { throws: !1 }));
            continue;
          }
          const d = typeof c == "string" ? c : String(c);
          T(d) && a.add(d);
        }
      }
  }
  return [...a];
}
const ma = [
  "if",
  "indirect",
  "choose",
  "offset"
];
function ga(s, a) {
  if (!S(s) || ut(s.slice(1)))
    return !0;
  const t = a.sequenceNodesBuilder(s);
  return t && t.some((r) => typeof r == "object" && r.nodeType === Ht.FUNCTION && ma.indexOf(r.token.toLowerCase()) > -1);
}
function pa(s, a) {
  const { formula1: e = "", ranges: t } = s;
  if (ut(e.slice(1))) {
    const i = Wt(e.slice(1));
    if ((!i.sheetName || i.sheetName === a) && t.some((o) => O.intersects(o, i.range)))
      return !0;
  }
  return !1;
}
class _t extends Y {
  constructor() {
    super(...arguments);
    m(this, "formulaService", this.injector.get(G));
    m(this, "_lexer", this.injector.get(X));
    m(this, "_univerInstanceService", this.injector.get(D));
    m(this, "_listCacheService", this.injector.get(le));
    m(this, "order", 50);
    m(this, "offsetFormulaByRange", !1);
    m(this, "id", C.LIST);
    m(this, "title", "dataValidation.list.title");
    m(this, "operators", []);
    m(this, "scopes", ["sheet"]);
    m(this, "skipDefaultFontRender", (e) => e.renderMode !== We.TEXT);
  }
  validatorFormula(e, t, r) {
    var u, c, d;
    const i = !M.isBlank(e.formula1), o = ga((u = e.formula1) != null ? u : "", this._lexer), n = (d = (c = this._univerInstanceService.getUnit(t, N.UNIVER_SHEET)) == null ? void 0 : c.getSheetBySheetId(r)) == null ? void 0 : d.getName(), l = pa(e, n != null ? n : "");
    return {
      success: !!(i && o && !l),
      formula1: i ? o ? l ? this.localeService.t("dataValidation.validFail.listIntersects") : void 0 : this.localeService.t("dataValidation.validFail.listInvalid") : this.localeService.t("dataValidation.validFail.list")
    };
  }
  getExtraStyle(e, t, { style: r }) {
    var o;
    const i = (o = r.tb !== Se.OVERFLOW ? r.tb : Se.CLIP) != null ? o : Se.WRAP;
    if (e.type === C.LIST && (e.renderMode === We.ARROW || e.renderMode === We.TEXT)) {
      const n = this.getListWithColorMap(e), l = `${t != null ? t : ""}`, u = n[l];
      if (u)
        return {
          bg: {
            rgb: u
          },
          tb: i
        };
    }
    return {
      tb: i
    };
  }
  parseCellValue(e) {
    const t = e.toString();
    return Ee(t);
  }
  async parseFormula(e, t, r) {
    var l, u;
    const i = await this.formulaService.getRuleFormulaResult(t, r, e.uid), o = oe((u = (l = i == null ? void 0 : i[0]) == null ? void 0 : l.result) == null ? void 0 : u[0][0]);
    return {
      formula1: void 0,
      formula2: void 0,
      isFormulaValid: T(String(o))
    };
  }
  async isValidType(e, t, r) {
    const { value: i, unitId: o, subUnitId: n } = e, { formula1: l = "" } = r, u = S(l) ? this._listCacheService.getOrCompute(
      o,
      n,
      r
    ).list : Ee(l);
    return this.parseCellValue(i).every((d) => u.includes(d));
  }
  generateRuleName() {
    return this.localeService.t("dataValidation.list.name");
  }
  generateRuleErrorMessage() {
    return this.localeService.t("dataValidation.list.error");
  }
  _getUnitAndSubUnit(e, t) {
    var o, n;
    const r = (o = e ? this._univerInstanceService.getUniverSheetInstance(e) : void 0) != null ? o : this._univerInstanceService.getCurrentUnitForType(N.UNIVER_SHEET);
    if (!r) return null;
    const i = (n = t ? r.getSheetBySheetId(t) : void 0) != null ? n : r.getActiveSheet();
    return i ? {
      unitId: r.getUnitId(),
      subUnitId: i.getSheetId()
    } : null;
  }
  getList(e, t, r) {
    const i = this._getUnitAndSubUnit(t, r);
    if (!i) return [];
    const { unitId: o, subUnitId: n } = i;
    return this._listCacheService.getOrCompute(
      o,
      n,
      e
    ).list;
  }
  async getListAsync(e, t, r) {
    var c, d;
    const { formula1: i = "" } = e, o = this._getUnitAndSubUnit(t, r);
    if (!o) return [];
    const { unitId: n, subUnitId: l } = o, u = await this.formulaService.getRuleFormulaResult(n, l, e.uid);
    return S(i) ? ha((d = (c = u == null ? void 0 : u[0]) == null ? void 0 : c.result) == null ? void 0 : d[0][0]) : Ee(i);
  }
  getListWithColor(e, t, r) {
    const i = this._getUnitAndSubUnit(t, r);
    if (!i) return [];
    const { unitId: o, subUnitId: n } = i;
    return this._listCacheService.getOrCompute(
      o,
      n,
      e
    ).listWithColor;
  }
  getListWithColorMap(e, t, r) {
    const i = this._getUnitAndSubUnit(t, r);
    if (!i) return {};
    const { unitId: o, subUnitId: n } = i;
    return this._listCacheService.getOrCompute(
      o,
      n,
      e
    ).colorMap;
  }
}
class fa extends Y {
  constructor() {
    super(...arguments);
    m(this, "id", C.TEXT_LENGTH);
    m(this, "title", "dataValidation.textLength.title");
    m(this, "_lexerTreeBuilder", this.injector.get(X));
    m(this, "order", 30);
    m(this, "operators", [
      h.BETWEEN,
      h.EQUAL,
      h.GREATER_THAN,
      h.GREATER_THAN_OR_EQUAL,
      h.LESS_THAN,
      h.LESS_THAN_OR_EQUAL,
      h.NOT_BETWEEN,
      h.NOT_EQUAL
    ]);
    m(this, "scopes", ["sheet"]);
    m(this, "_customFormulaService", this.injector.get(W));
  }
  _isFormulaOrInt(e) {
    return !M.isBlank(e) && (S(e) || !Number.isNaN(+e) && Number.isInteger(+e));
  }
  validatorFormula(e, t, r) {
    const i = e.operator;
    if (!i)
      return {
        success: !1
      };
    const o = M.isDefine(e.formula1) && this._isFormulaOrInt(e.formula1), n = M.isDefine(e.formula2) && this._isFormulaOrInt(e.formula2), l = Be.includes(i), u = this.localeService.t("dataValidation.validFail.number");
    return l ? {
      success: o && n,
      formula1: o ? void 0 : u,
      formula2: n ? void 0 : u
    } : {
      success: o,
      formula1: u
    };
  }
  _parseNumber(e) {
    return e == null ? Number.NaN : +e;
  }
  async parseFormula(e, t, r, i, o) {
    const n = await this._customFormulaService.getCellFormulaValue(t, r, e.uid, i, o), l = await this._customFormulaService.getCellFormula2Value(t, r, e.uid, i, o), { formula1: u, formula2: c } = e, d = T(String(n == null ? void 0 : n.v)) && T(String(l == null ? void 0 : l.v));
    return {
      formula1: this._parseNumber(S(u) ? n == null ? void 0 : n.v : u),
      formula2: this._parseNumber(S(c) ? l == null ? void 0 : l.v : c),
      isFormulaValid: d
    };
  }
  transform(e, t, r) {
    return {
      ...e,
      value: e.value.toString().length
    };
  }
  async isValidType(e, t, r) {
    const { value: i } = e;
    return typeof i == "string" || typeof i == "number";
  }
  generateRuleErrorMessage(e, t) {
    if (!e.operator)
      return this.titleStr;
    const { transformedFormula1: r, transformedFormula2: i } = Ue(this._lexerTreeBuilder, e, t);
    return `${this.localeService.t(Lt[e.operator]).replace(ue, r != null ? r : "").replace(ce, i != null ? i : "")}`;
  }
}
function vt(s) {
  var e, t;
  return s ? s.p ? !((t = (e = s.p.body) == null ? void 0 : e.dataStream) != null ? t : "").slice(0, -2).trim() : M.isBlank(s.v) : !0;
}
function xe(s, a, e, t, r = "command", i = !0) {
  const o = t.get(X), n = t.get(q), l = [], u = [], c = t.get(F), d = t.get(D), g = ze(d, { unitId: s, subUnitId: a });
  if (!g)
    return {
      redoMutations: l,
      undoMutations: u
    };
  const { worksheet: f } = g, p = new Me();
  let R = !1;
  function E(_, w) {
    i && _.forEach(($) => {
      H.foreach($, (x, k) => {
        const P = f.getCellRaw(x, k), J = ft(P);
        (vt(P) || J === w) && !(P != null && P.p) && (R = !0, p.setValue(x, k, {
          v: w,
          p: null
        }));
      });
    });
  }
  if (e.forEach((_) => {
    switch (_.type) {
      case "delete":
        l.push({
          id: I.id,
          params: {
            unitId: s,
            subUnitId: a,
            ruleId: _.rule.uid,
            source: r
          }
        }), u.unshift({
          id: b.id,
          params: {
            unitId: s,
            subUnitId: a,
            rule: _.rule,
            index: _.index,
            source: r
          }
        });
        break;
      case "update": {
        if (he(_.rule.type, n)) {
          const $ = _.oldRanges[0].startRow, x = _.oldRanges[0].startColumn, k = _.newRanges[0].startRow, P = _.newRanges[0].startColumn, J = k - $, me = P - x, ge = S(_.rule.formula1) ? o.moveFormulaRefOffset(_.rule.formula1, me, J) : _.rule.formula1, pe = S(_.rule.formula2) ? o.moveFormulaRefOffset(_.rule.formula2, me, J) : _.rule.formula2;
          ge !== _.rule.formula1 || pe !== _.rule.formula2 || !lt(_.newRanges, _.oldRanges) ? (l.push({
            id: y.id,
            params: {
              unitId: s,
              subUnitId: a,
              ruleId: _.ruleId,
              payload: {
                type: V.ALL,
                payload: {
                  formula1: ge,
                  formula2: pe,
                  ranges: _.newRanges
                }
              }
            }
          }), u.unshift({
            id: y.id,
            params: {
              unitId: s,
              subUnitId: a,
              ruleId: _.ruleId,
              payload: {
                type: V.ALL,
                payload: {
                  formula1: _.rule.formula1,
                  formula2: _.rule.formula2,
                  ranges: _.oldRanges
                }
              }
            }
          })) : (l.push({
            id: y.id,
            params: {
              unitId: s,
              subUnitId: a,
              ruleId: _.ruleId,
              payload: {
                type: V.RANGE,
                payload: _.newRanges
              },
              source: r
            }
          }), u.unshift({
            id: y.id,
            params: {
              unitId: s,
              subUnitId: a,
              ruleId: _.ruleId,
              payload: {
                type: V.RANGE,
                payload: _.oldRanges
              },
              source: r
            }
          }));
        } else
          l.push({
            id: y.id,
            params: {
              unitId: s,
              subUnitId: a,
              ruleId: _.ruleId,
              payload: {
                type: V.RANGE,
                payload: _.newRanges
              },
              source: r
            }
          }), u.unshift({
            id: y.id,
            params: {
              unitId: s,
              subUnitId: a,
              ruleId: _.ruleId,
              payload: {
                type: V.RANGE,
                payload: _.oldRanges
              },
              source: r
            }
          });
        const w = c.getRuleById(s, a, _.ruleId);
        if (w && w.type === C.CHECKBOX) {
          const x = c.getValidator(C.CHECKBOX).parseFormulaSync(w, s, a);
          E(_.newRanges, x.formula2);
        }
        break;
      }
      case "add": {
        if (l.push({
          id: b.id,
          params: {
            unitId: s,
            subUnitId: a,
            rule: _.rule,
            source: r
          }
        }), u.unshift({
          id: I.id,
          params: {
            unitId: s,
            subUnitId: a,
            ruleId: _.rule.uid,
            source: r
          }
        }), _.rule.type === C.CHECKBOX) {
          const $ = c.getValidator(C.CHECKBOX).parseFormulaSync(_.rule, s, a);
          E(_.rule.ranges, $.originFormula2);
        }
        break;
      }
    }
  }), R) {
    const _ = {
      id: ne.id,
      params: {
        unitId: s,
        subUnitId: a,
        cellValue: p.getData()
      }
    }, w = {
      id: ne.id,
      params: dt(t, _.params)
    };
    l.push(_), u.push(w);
  }
  return {
    redoMutations: l,
    undoMutations: u
  };
}
const _a = {
  type: z.COMMAND,
  id: "sheet.command.updateDataValidationRuleRange",
  handler(s, a) {
    if (!a)
      return !1;
    const { unitId: e, subUnitId: t, ranges: r, ruleId: i } = a, o = s.get(F), n = s.get(U), l = s.get(Z);
    if (!o.getRuleById(e, t, i))
      return !1;
    const c = o.getRuleObjectMatrix(e, t).clone();
    c.updateRange(i, r);
    const d = c.diff(o.getRules(e, t)), { redoMutations: g, undoMutations: f } = xe(e, t, d, s);
    return l.pushUndoRedo({
      undoMutations: f,
      redoMutations: g,
      unitID: e
    }), Le(g, n), !0;
  }
}, va = {
  type: z.COMMAND,
  id: "sheet.command.addDataValidation",
  handler(s, a) {
    if (!a)
      return !1;
    const { unitId: e, subUnitId: t, rule: r } = a, i = s.get(F), o = s.get(U), n = s.get(Z), l = i.getRuleObjectMatrix(e, t).clone();
    l.addRule(r);
    const u = l.diff(i.getRules(e, t)), c = i.getValidator(r.type), d = {
      unitId: e,
      subUnitId: t,
      rule: {
        ...r,
        ...c == null ? void 0 : c.normalizeFormula(r, e, t)
      }
    }, { redoMutations: g, undoMutations: f } = xe(e, t, u, s);
    return g.push({
      id: b.id,
      params: d
    }), f.unshift({
      id: I.id,
      params: {
        unitId: e,
        subUnitId: t,
        ruleId: r.uid
      }
    }), n.pushUndoRedo({
      unitID: e,
      redoMutations: g,
      undoMutations: f
    }), Le(g, o), !0;
  }
}, Ra = {
  type: z.COMMAND,
  id: "sheets.command.update-data-validation-setting",
  // eslint-disable-next-line max-lines-per-function
  handler(s, a) {
    if (!a)
      return !1;
    const e = s.get(U), t = s.get(Z), r = s.get(F), i = s.get(q), { unitId: o, subUnitId: n, ruleId: l, setting: u } = a, c = i.getValidatorItem(u.type);
    if (!c)
      return !1;
    const d = r.getRuleById(o, n, l);
    if (!d)
      return !1;
    const g = { ...d, ...u };
    if (!c.validatorFormula(g, o, n).success)
      return !1;
    const f = {
      unitId: o,
      subUnitId: n,
      ruleId: l,
      payload: {
        type: V.SETTING,
        payload: {
          ...u,
          ...c.normalizeFormula(g, o, n)
        }
      }
    }, p = [{
      id: y.id,
      params: f
    }], R = {
      unitId: o,
      subUnitId: n,
      ruleId: l,
      payload: {
        type: V.SETTING,
        payload: Ut(d)
      }
    }, E = [{
      id: y.id,
      params: R
    }];
    if (u.type === C.CHECKBOX) {
      const w = d.ranges, $ = s.get(D), x = ze($, { unitId: o, subUnitId: n });
      if (x) {
        const k = new Me(), { worksheet: P } = x, { formula2: J = ye, formula1: me = Ve } = d, { formula2: ge = ye, formula1: pe = Ve } = u;
        let Pe = !1;
        if (w.forEach((fe) => {
          H.foreach(fe, (ie, He) => {
            const j = P.getCellRaw(ie, He), Je = ft(j);
            (vt(j) || Je === String(J)) && !(j != null && j.p) ? (k.setValue(ie, He, {
              v: ge,
              p: null
            }), Pe = !0) : Je === String(me) && !(j != null && j.p) && (k.setValue(ie, He, {
              v: pe,
              p: null
            }), Pe = !0);
          });
        }), Pe) {
          const fe = {
            id: ne.id,
            params: {
              unitId: o,
              subUnitId: n,
              cellValue: k.getData()
            }
          }, ie = {
            id: ne.id,
            params: dt(s, fe.params)
          };
          p.push(fe), E.push(ie);
        }
      }
    }
    return Le(p, e).result ? (t.pushUndoRedo({
      unitID: o,
      redoMutations: p,
      undoMutations: E
    }), !0) : !1;
  }
}, Sa = {
  type: z.COMMAND,
  id: "sheets.command.update-data-validation-options",
  handler(s, a) {
    if (!a)
      return !1;
    const e = s.get(U), t = s.get(Z), r = s.get(F), { unitId: i, subUnitId: o, ruleId: n, options: l } = a, u = r.getRuleById(i, o, n);
    if (!u)
      return !1;
    const c = {
      unitId: i,
      subUnitId: o,
      ruleId: n,
      payload: {
        type: V.OPTIONS,
        payload: l
      }
    }, d = [{
      id: y.id,
      params: c
    }], g = {
      unitId: i,
      subUnitId: o,
      ruleId: n,
      payload: {
        type: V.OPTIONS,
        payload: Bt(u)
      }
    }, f = [{
      id: y.id,
      params: g
    }];
    return t.pushUndoRedo({
      unitID: i,
      redoMutations: d,
      undoMutations: f
    }), e.executeCommand(y.id, c), !0;
  }
}, Ea = {
  type: z.COMMAND,
  id: "sheets.command.clear-range-data-validation",
  handler(s, a) {
    if (!a)
      return !1;
    const { unitId: e, subUnitId: t, ranges: r } = a, i = s.get(U), o = s.get(D), n = ze(o, { unitId: e, subUnitId: t }), l = s.get(F);
    if (!n) return !1;
    const u = s.get(Z), c = l.getRuleObjectMatrix(e, t).clone();
    c.removeRange(r);
    const d = c.diff(l.getRules(e, t)), { redoMutations: g, undoMutations: f } = xe(e, t, d, s);
    return u.pushUndoRedo({
      unitID: e,
      redoMutations: g,
      undoMutations: f
    }), Le(g, i).result;
  }
}, Ma = {
  type: z.COMMAND,
  id: "sheet.command.remove-all-data-validation",
  handler(s, a) {
    if (!a)
      return !1;
    const { unitId: e, subUnitId: t } = a, r = s.get(U), i = s.get(F), o = s.get(Z), n = [...i.getRules(e, t)], l = {
      unitId: e,
      subUnitId: t,
      ruleId: n.map((d) => d.uid)
    }, u = [{
      id: I.id,
      params: l
    }], c = [{
      id: b.id,
      params: {
        unitId: e,
        subUnitId: t,
        rule: n
      }
    }];
    return o.pushUndoRedo({
      redoMutations: u,
      undoMutations: c,
      unitID: e
    }), r.executeCommand(I.id, l), !0;
  }
}, Va = (s, a) => {
  const e = s.get(F), { unitId: t, subUnitId: r, ruleId: i, source: o } = a;
  if (Array.isArray(i)) {
    const l = i.map((u) => e.getRuleById(t, r, u)).filter(Boolean);
    return [{
      id: b.id,
      params: {
        unitId: t,
        subUnitId: r,
        rule: l,
        source: o
      }
    }];
  }
  return [{
    id: b.id,
    params: {
      unitId: t,
      subUnitId: r,
      rule: {
        ...e.getRuleById(t, r, i)
      },
      index: e.getRuleIndex(t, r, i)
    }
  }];
}, ya = {
  type: z.COMMAND,
  id: "sheet.command.remove-data-validation-rule",
  handler(s, a) {
    if (!a)
      return !1;
    const { unitId: e, subUnitId: t, ruleId: r } = a, i = s.get(U), o = s.get(Z), n = s.get(F), l = [{
      id: I.id,
      params: a
    }], u = [{
      id: b.id,
      params: {
        unitId: e,
        subUnitId: t,
        rule: {
          ...n.getRuleById(e, t, r)
        },
        index: n.getRuleIndex(e, t, r)
      }
    }];
    return o.pushUndoRedo({
      undoMutations: u,
      redoMutations: l,
      unitID: a.unitId
    }), i.executeCommand(I.id, a), !0;
  }
}, Ca = "SHEET_DATA_VALIDATION_PLUGIN";
var Rt = /* @__PURE__ */ ((s) => (s[s.View = 0] = "View", s[s.Edit = 1] = "Edit", s[s.ManageCollaborator = 2] = "ManageCollaborator", s[s.Print = 3] = "Print", s[s.Duplicate = 4] = "Duplicate", s[s.Comment = 5] = "Comment", s[s.Copy = 6] = "Copy", s[s.Share = 7] = "Share", s[s.Export = 8] = "Export", s[s.MoveWorksheet = 9] = "MoveWorksheet", s[s.DeleteWorksheet = 10] = "DeleteWorksheet", s[s.HideWorksheet = 11] = "HideWorksheet", s[s.RenameWorksheet = 12] = "RenameWorksheet", s[s.CreateWorksheet = 13] = "CreateWorksheet", s[s.SetWorksheetStyle = 14] = "SetWorksheetStyle", s[s.EditWorksheetCell = 15] = "EditWorksheetCell", s[s.InsertHyperlink = 16] = "InsertHyperlink", s[s.Sort = 17] = "Sort", s[s.Filter = 18] = "Filter", s[s.PivotTable = 19] = "PivotTable", s[s.FloatImg = 20] = "FloatImg", s[s.History = 21] = "History", s[s.RwHgtClWdt = 22] = "RwHgtClWdt", s[s.ViemRwHgtClWdt = 23] = "ViemRwHgtClWdt", s[s.ViewFilter = 24] = "ViewFilter", s[s.MoveSheet = 25] = "MoveSheet", s[s.DeleteSheet = 26] = "DeleteSheet", s[s.HideSheet = 27] = "HideSheet", s[s.CopySheet = 28] = "CopySheet", s[s.RenameSheet = 29] = "RenameSheet", s[s.CreateSheet = 30] = "CreateSheet", s[s.SelectProtectedCells = 31] = "SelectProtectedCells", s[s.SelectUnProtectedCells = 32] = "SelectUnProtectedCells", s[s.SetCellStyle = 33] = "SetCellStyle", s[s.SetCellValue = 34] = "SetCellValue", s[s.SetRowStyle = 35] = "SetRowStyle", s[s.SetColumnStyle = 36] = "SetColumnStyle", s[s.InsertRow = 37] = "InsertRow", s[s.InsertColumn = 38] = "InsertColumn", s[s.DeleteRow = 39] = "DeleteRow", s[s.DeleteColumn = 40] = "DeleteColumn", s[s.EditExtraObject = 41] = "EditExtraObject", s[s.Delete = 42] = "Delete", s[s.RecoverHistory = 43] = "RecoverHistory", s[s.ViewHistory = 44] = "ViewHistory", s[s.CreatePermissionObject = 45] = "CreatePermissionObject", s[s.UNRECOGNIZED = -1] = "UNRECOGNIZED", s))(Rt || {}), Ta = Object.getOwnPropertyDescriptor, Fa = (s, a, e, t) => {
  for (var r = t > 1 ? void 0 : t ? Ta(a, e) : a, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(r) || r);
  return r;
}, je = (s, a) => (e, t) => a(e, t, s);
let Fe = class extends B {
  constructor(s, a, e) {
    super(), this._univerInstanceService = s, this._permissionService = a, this._lexerTreeBuilder = e;
  }
  getFormulaRefCheck(s) {
    var e, t;
    const a = this._lexerTreeBuilder.sequenceNodesBuilder(s);
    if (!a)
      return !0;
    for (let r = 0; r < a.length; r++) {
      const i = a[r];
      if (typeof i == "string")
        continue;
      const { token: o } = i, n = $t(o), l = this._univerInstanceService.getCurrentUnitForType(N.UNIVER_SHEET);
      let u = l.getActiveSheet();
      const c = l.getUnitId();
      if (n.sheetName) {
        if (u = l.getSheetBySheetName(n.sheetName), !u)
          return !1;
        const R = u == null ? void 0 : u.getSheetId();
        if (!this._permissionService.getPermissionPoint(new jt(c, R).id)) return !1;
      }
      if (!u)
        return !1;
      const { startRow: d, endRow: g, startColumn: f, endColumn: p } = n.range;
      for (let R = d; R <= g; R++)
        for (let E = f; E <= p; E++) {
          const _ = (t = (e = u.getCell(R, E)) == null ? void 0 : e.selectionProtection) == null ? void 0 : t[0];
          if ((_ == null ? void 0 : _[Rt.View]) === !1)
            return !1;
        }
    }
    return !0;
  }
};
Fe = Fa([
  je(0, D),
  je(1, Tt),
  je(2, v(X))
], Fe);
const Na = "sheets-data-validation.config", st = {};
var wa = Object.getOwnPropertyDescriptor, Oa = (s, a, e, t) => {
  for (var r = t > 1 ? void 0 : t ? wa(a, e) : a, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(r) || r);
  return r;
}, Qe = (s, a) => (e, t) => a(e, t, s);
let Ne = class extends B {
  constructor(a, e, t) {
    super();
    m(this, "_disposableMap", /* @__PURE__ */ new Map());
    m(this, "registerRule", (a, e, t) => {
      he(t.type, this._validatorRegistryService) && this.register(a, e, t);
    });
    this._dataValidationModel = a, this._formulaRefRangeService = e, this._validatorRegistryService = t, this._initRefRange();
  }
  _getIdWithUnitId(a, e, t) {
    return `${a}_${e}_${t}`;
  }
  // eslint-disable-next-line max-lines-per-function
  register(a, e, t) {
    const r = t.ranges, i = t.formula1, o = t.formula2, n = this._formulaRefRangeService.registerRangeFormula(a, e, r, [i != null ? i : "", o != null ? o : ""], (u) => {
      if (u.length === 0)
        return {
          undos: [{
            id: b.id,
            params: {
              unitId: a,
              subUnitId: e,
              rule: t,
              source: "patched"
            }
          }],
          redos: [{
            id: I.id,
            params: {
              unitId: a,
              subUnitId: e,
              ruleId: t.uid,
              source: "patched"
            }
          }]
        };
      const c = [], d = [], g = u[0];
      c.push({
        id: y.id,
        params: {
          unitId: a,
          subUnitId: e,
          ruleId: t.uid,
          payload: {
            type: V.ALL,
            payload: {
              ranges: g.ranges,
              formula1: g.formulas[0],
              formula2: g.formulas[1]
            }
          },
          source: "patched"
        }
      }), d.push({
        id: y.id,
        params: {
          unitId: a,
          subUnitId: e,
          ruleId: t.uid,
          payload: {
            type: V.ALL,
            payload: {
              ranges: r,
              formula1: i,
              formula2: o
            }
          },
          source: "patched"
        }
      });
      for (let f = 1; f < u.length; f++) {
        const p = u[f], R = Xe();
        c.push({
          id: b.id,
          params: {
            unitId: a,
            subUnitId: e,
            rule: {
              ...t,
              uid: R,
              formula1: p.formulas[0],
              formula2: p.formulas[1],
              ranges: p.ranges
            },
            source: "patched"
          }
        }), d.push({
          id: I.id,
          params: {
            unitId: a,
            subUnitId: e,
            ruleId: R,
            source: "patched"
          }
        });
      }
      return {
        undos: d,
        redos: c
      };
    }), l = this._getIdWithUnitId(a, e, t.uid);
    this._disposableMap.set(l, n);
  }
  _initRefRange() {
    const a = this._dataValidationModel.getAll();
    for (const [e, t] of a)
      for (const [r, i] of t)
        for (const o of i)
          this.registerRule(e, r, o);
    this.disposeWithMe(
      this._dataValidationModel.ruleChange$.subscribe((e) => {
        const { unitId: t, subUnitId: r, rule: i } = e;
        switch (e.type) {
          case "add": {
            const o = e.rule;
            this.registerRule(e.unitId, e.subUnitId, o);
            break;
          }
          case "remove": {
            const o = this._disposableMap.get(this._getIdWithUnitId(t, r, i.uid));
            o && o.dispose();
            break;
          }
          case "update": {
            const o = e.rule, n = this._disposableMap.get(this._getIdWithUnitId(t, r, o.uid));
            n && n.dispose(), this.registerRule(e.unitId, e.subUnitId, o);
            break;
          }
        }
      })
    ), this.disposeWithMe(Ke(() => {
      this._disposableMap.forEach((e) => {
        e.dispose();
      }), this._disposableMap.clear();
    }));
  }
};
Ne = Oa([
  Qe(0, v(F)),
  Qe(1, v(pt)),
  Qe(2, v(q))
], Ne);
var Aa = Object.getOwnPropertyDescriptor, Ia = (s, a, e, t) => {
  for (var r = t > 1 ? void 0 : t ? Aa(a, e) : a, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(r) || r);
  return r;
}, te = (s, a) => (e, t) => a(e, t, s);
let we = class extends B {
  constructor(a, e, t, r, i, o) {
    super();
    m(this, "_disposableMap", /* @__PURE__ */ new Map());
    m(this, "registerRule", (a, e, t) => {
      he(t.type, this._validatorRegistryService) || (this.register(a, e, t), this.registerFormula(a, e, t));
    });
    this._dataValidationModel = a, this._injector = e, this._refRangeService = t, this._dataValidationFormulaService = r, this._formulaRefRangeService = i, this._validatorRegistryService = o, this._initRefRange();
  }
  _getIdWithUnitId(a, e, t) {
    return `${a}_${e}_${t}`;
  }
  // eslint-disable-next-line max-lines-per-function
  registerFormula(a, e, t) {
    var u;
    const r = t.uid, i = this._getIdWithUnitId(a, e, r), o = (u = this._disposableMap.get(i)) != null ? u : /* @__PURE__ */ new Set(), n = (c, d) => {
      const g = this._dataValidationModel.getRuleById(a, e, r);
      if (!g)
        return { redos: [], undos: [] };
      const f = g[c];
      if (!f || f === d)
        return { redos: [], undos: [] };
      const p = {
        unitId: a,
        subUnitId: e,
        ruleId: t.uid,
        payload: {
          type: V.SETTING,
          payload: {
            type: g.type,
            formula1: g.formula1,
            formula2: g.formula2,
            [c]: d
          }
        },
        source: "patched"
      }, R = {
        unitId: a,
        subUnitId: e,
        ruleId: t.uid,
        payload: {
          type: V.SETTING,
          payload: {
            type: g.type,
            formula1: g.formula1,
            formula2: g.formula2
          }
        },
        source: "patched"
      }, E = [
        {
          id: y.id,
          params: p
        }
      ], _ = [
        {
          id: y.id,
          params: R
        }
      ];
      return { redos: E, undos: _ };
    }, l = this._dataValidationFormulaService.getRuleFormulaInfo(a, e, r);
    if (l) {
      const [c, d] = l;
      if (c) {
        const g = this._formulaRefRangeService.registerFormula(
          a,
          e,
          c.text,
          (f) => n("formula1", f)
        );
        o.add(() => g.dispose());
      }
      if (d) {
        const g = this._formulaRefRangeService.registerFormula(
          a,
          e,
          d.text,
          (f) => n("formula2", f)
        );
        o.add(() => g.dispose());
      }
    }
  }
  register(a, e, t) {
    var l;
    const r = (u) => {
      const c = [...t.ranges], g = c.map((p) => Gt(p, u)).filter((p) => !!p).flat();
      if (lt(g, c))
        return { redos: [], undos: [] };
      if (g.length) {
        const p = {
          unitId: a,
          subUnitId: e,
          ruleId: t.uid,
          payload: {
            type: V.RANGE,
            payload: g
          },
          source: "patched"
        }, R = [{ id: y.id, params: p }], E = [{
          id: y.id,
          params: {
            unitId: a,
            subUnitId: e,
            ruleId: t.uid,
            payload: {
              type: V.RANGE,
              payload: c
            },
            source: "patched"
          }
        }];
        return { redos: R, undos: E };
      } else {
        const p = { unitId: a, subUnitId: e, ruleId: t.uid }, R = [{ id: I.id, params: p }], E = Va(this._injector, p);
        return { redos: R, undos: E };
      }
    }, i = [];
    t.ranges.forEach((u) => {
      const c = this._refRangeService.registerRefRange(u, r, a, e);
      i.push(() => c.dispose());
    });
    const o = this._getIdWithUnitId(a, e, t.uid), n = (l = this._disposableMap.get(o)) != null ? l : /* @__PURE__ */ new Set();
    n.add(() => i.forEach((u) => u())), this._disposableMap.set(o, n);
  }
  _initRefRange() {
    const a = this._dataValidationModel.getAll();
    for (const [e, t] of a)
      for (const [r, i] of t)
        for (const o of i)
          this.registerRule(e, r, o);
    this.disposeWithMe(
      this._dataValidationModel.ruleChange$.subscribe((e) => {
        const { unitId: t, subUnitId: r, rule: i } = e;
        switch (e.type) {
          case "add": {
            const o = e.rule;
            this.registerRule(e.unitId, e.subUnitId, o);
            break;
          }
          case "remove": {
            const o = this._disposableMap.get(this._getIdWithUnitId(t, r, i.uid));
            o && o.forEach((n) => n());
            break;
          }
          case "update": {
            const o = e.rule, n = this._disposableMap.get(this._getIdWithUnitId(t, r, o.uid));
            n && n.forEach((l) => l()), this.registerRule(e.unitId, e.subUnitId, o);
            break;
          }
        }
      })
    ), this.disposeWithMe(Ke(() => {
      this._disposableMap.forEach((e) => {
        e.forEach((t) => t());
      }), this._disposableMap.clear();
    }));
  }
};
we = Ia([
  te(0, v(F)),
  te(1, v(be)),
  te(2, v(Qt)),
  te(3, v(G)),
  te(4, v(pt)),
  te(5, v(q))
], we);
var Da = Object.getOwnPropertyDescriptor, ba = (s, a, e, t) => {
  for (var r = t > 1 ? void 0 : t ? Da(a, e) : a, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(r) || r);
  return r;
}, Ge = (s, a) => (e, t) => a(e, t, s);
let Oe = class extends B {
  constructor(s, a, e) {
    super(), this._sheetInterceptorService = s, this._univerInstanceService = a, this._sheetDataValidationModel = e, this._initSheetChange();
  }
  // eslint-disable-next-line max-lines-per-function
  _initSheetChange() {
    this.disposeWithMe(
      this._sheetInterceptorService.interceptCommand({
        // eslint-disable-next-line max-lines-per-function
        getMutations: (s) => {
          var a;
          if (s.id === qt.id) {
            const e = s.params, t = e.unitId || this._univerInstanceService.getCurrentUnitForType(N.UNIVER_SHEET).getUnitId(), r = this._univerInstanceService.getUniverSheetInstance(t);
            if (!r)
              return { redos: [], undos: [] };
            const i = e.subUnitId || ((a = r.getActiveSheet()) == null ? void 0 : a.getSheetId());
            if (!i)
              return { redos: [], undos: [] };
            const o = this._sheetDataValidationModel.getRules(t, i);
            if (o.length === 0)
              return { redos: [], undos: [] };
            const n = o.map((c) => c.uid), l = {
              unitId: t,
              subUnitId: i,
              ruleId: n,
              source: "patched"
            }, u = {
              unitId: t,
              subUnitId: i,
              rule: [...o],
              source: "patched"
            };
            return {
              redos: [{
                id: I.id,
                params: l
              }],
              undos: [{
                id: b.id,
                params: u
              }]
            };
          } else if (s.id === Yt.id) {
            const e = s.params, { unitId: t, subUnitId: r, targetSubUnitId: i } = e;
            if (!t || !r || !i)
              return { redos: [], undos: [] };
            const o = this._sheetDataValidationModel.getRules(t, r);
            if (o.length === 0)
              return { redos: [], undos: [] };
            const n = o.map((l) => ({ ...l, uid: Xe(6) }));
            return {
              redos: [
                {
                  id: b.id,
                  params: {
                    unitId: t,
                    subUnitId: i,
                    rule: n,
                    source: "patched"
                  }
                }
              ],
              undos: [
                {
                  id: I.id,
                  params: {
                    unitId: t,
                    subUnitId: i,
                    ruleId: n.map((l) => l.uid),
                    source: "patched"
                  }
                }
              ]
            };
          }
          return { redos: [], undos: [] };
        }
      })
    );
  }
};
Oe = ba([
  Ge(0, v(ht)),
  Ge(1, v(D)),
  Ge(2, v(F))
], Oe);
class La extends Y {
  constructor() {
    super(...arguments);
    m(this, "id", C.ANY);
    m(this, "title", "dataValidation.any.title");
    m(this, "operators", []);
    m(this, "scopes", ["sheet"]);
    m(this, "order", 0);
    m(this, "offsetFormulaByRange", !1);
  }
  async parseFormula(e, t, r) {
    return {
      formula1: e.formula1,
      formula2: e.formula2,
      isFormulaValid: !0
    };
  }
  validatorFormula(e, t, r) {
    return {
      success: !0
    };
  }
  async isValidType(e, t, r) {
    return !0;
  }
  generateRuleErrorMessage(e) {
    return this.localeService.t("dataValidation.any.error");
  }
}
class Ua extends Y {
  constructor() {
    super(...arguments);
    m(this, "id", C.CUSTOM);
    m(this, "title", "dataValidation.custom.title");
    m(this, "operators", []);
    m(this, "scopes", ["sheet"]);
    m(this, "order", 60);
    m(this, "_customFormulaService", this.injector.get(W));
    m(this, "_lexerTreeBuilder", this.injector.get(X));
  }
  validatorFormula(e, t, r) {
    var u;
    const i = S(e.formula1), o = (u = e.formula1) != null ? u : "", l = this._lexerTreeBuilder.checkIfAddBracket(o) === 0 && o.startsWith(kt.EQUALS);
    return {
      success: i && l,
      formula1: i && l ? "" : this.localeService.t("dataValidation.validFail.formula")
    };
  }
  async parseFormula(e, t, r) {
    return {
      formula1: void 0,
      formula2: void 0,
      isFormulaValid: !0
    };
  }
  async isValidType(e, t, r) {
    const { column: i, row: o, unitId: n, subUnitId: l } = e, u = await this._customFormulaService.getCellFormulaValue(n, l, r.uid, o, i), c = u == null ? void 0 : u.v;
    return T(String(c)) && M.isDefine(c) && c !== "" ? u.t === Ft.BOOLEAN ? !!c : typeof c == "boolean" ? c : typeof c == "number" ? !!c : typeof c == "string" ? T(c) : !!c : !1;
  }
  generateRuleErrorMessage(e) {
    return this.localeService.t("dataValidation.custom.error");
  }
  generateRuleName(e) {
    var t;
    return this.localeService.t("dataValidation.custom.ruleName").replace("{FORMULA1}", (t = e.formula1) != null ? t : "");
  }
}
class Ba extends _t {
  constructor() {
    super(...arguments);
    m(this, "id", C.LIST_MULTIPLE);
    m(this, "title", "dataValidation.listMultiple.title");
    m(this, "offsetFormulaByRange", !1);
    m(this, "skipDefaultFontRender", () => !0);
  }
}
class xa extends Y {
  constructor() {
    super(...arguments);
    m(this, "_customFormulaService", this.injector.get(W));
    m(this, "_lexerTreeBuilder", this.injector.get(X));
    m(this, "id", C.WHOLE);
    m(this, "title", "dataValidation.whole.title");
    m(this, "order", 10);
    m(this, "operators", [
      h.BETWEEN,
      h.EQUAL,
      h.GREATER_THAN,
      h.GREATER_THAN_OR_EQUAL,
      h.LESS_THAN,
      h.LESS_THAN_OR_EQUAL,
      h.NOT_BETWEEN,
      h.NOT_EQUAL
    ]);
    m(this, "scopes", ["sheet"]);
  }
  _isFormulaOrInt(e) {
    return !M.isBlank(e) && (S(e) || !Number.isNaN(+e) && Number.isInteger(+e));
  }
  async isValidType(e, t, r) {
    const { value: i } = e, o = Te(i);
    return !Number.isNaN(o) && Number.isInteger(o);
  }
  transform(e, t, r) {
    const { value: i } = e;
    return {
      ...e,
      value: Te(i)
    };
  }
  _parseNumber(e) {
    return e == null ? Number.NaN : +e;
  }
  async parseFormula(e, t, r, i, o) {
    const n = await this._customFormulaService.getCellFormulaValue(t, r, e.uid, i, o), l = await this._customFormulaService.getCellFormula2Value(t, r, e.uid, i, o), { formula1: u, formula2: c } = e, d = S(u) ? n == null ? void 0 : n.v : u, g = S(c) ? l == null ? void 0 : l.v : c, f = T(`${d}`) && T(`${g}`);
    return {
      formula1: this._parseNumber(d),
      formula2: this._parseNumber(g),
      isFormulaValid: f
    };
  }
  validatorFormula(e, t, r) {
    const i = e.operator;
    if (!i)
      return {
        success: !0
      };
    const o = M.isDefine(e.formula1) && this._isFormulaOrInt(e.formula1), n = M.isDefine(e.formula2) && this._isFormulaOrInt(e.formula2), l = Be.includes(i), u = this.localeService.t("dataValidation.validFail.number");
    return l ? {
      success: o && n,
      formula1: o ? void 0 : u,
      formula2: n ? void 0 : u
    } : {
      success: o,
      formula1: u
    };
  }
  generateRuleErrorMessage(e, t) {
    if (!e.operator)
      return this.localeService.t(Ce.NONE).replace("{TYPE}", this.titleStr);
    const { transformedFormula1: r, transformedFormula2: i } = Ue(this._lexerTreeBuilder, e, t);
    return `${this.localeService.t(Ce[e.operator]).replace(ue, r != null ? r : "").replace(ce, i != null ? i : "")}`;
  }
}
var Pa = Object.getOwnPropertyDescriptor, Ha = (s, a, e, t) => {
  for (var r = t > 1 ? void 0 : t ? Pa(a, e) : a, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(r) || r);
  return r;
}, ae = (s, a) => (e, t) => a(e, t, s);
let Ae = class extends Nt {
  constructor(s, a, e, t, r, i) {
    super(), this._univerInstanceService = s, this._dataValidatorRegistryService = a, this._injector = e, this._selectionManagerService = t, this._sheetInterceptorService = r, this._sheetDataValidationModel = i, this._init();
  }
  _init() {
    this._registerValidators(), this._initCommandInterceptor();
  }
  _registerValidators() {
    [
      La,
      da,
      xa,
      fa,
      ca,
      na,
      _t,
      Ba,
      Ua
    ].forEach((s) => {
      const a = this._injector.createInstance(s);
      this.disposeWithMe(this._dataValidatorRegistryService.register(a)), this.disposeWithMe(Ke(() => this._injector.delete(s)));
    });
  }
  _initCommandInterceptor() {
    this._sheetInterceptorService.interceptCommand({
      getMutations: (s) => {
        var a;
        if (s.id === Xt.id) {
          const e = this._univerInstanceService.getCurrentUnitForType(N.UNIVER_SHEET), t = e.getUnitId(), r = e.getActiveSheet();
          if (!r)
            throw new Error("No active sheet found");
          const i = r.getSheetId(), o = (a = this._selectionManagerService.getCurrentSelections()) == null ? void 0 : a.map((d) => d.range), n = this._sheetDataValidationModel.getRuleObjectMatrix(t, i).clone();
          o && n.removeRange(o);
          const l = n.diff(this._sheetDataValidationModel.getRules(t, i)), { redoMutations: u, undoMutations: c } = xe(t, i, l, this._injector, "patched");
          return {
            undos: c,
            redos: u
          };
        }
        return {
          undos: [],
          redos: []
        };
      }
    });
  }
};
Ae = Ha([
  ae(0, D),
  ae(1, v(q)),
  ae(2, v(be)),
  ae(3, v(mt)),
  ae(4, v(ht)),
  ae(5, v(F))
], Ae);
var Wa = Object.getOwnPropertyDescriptor, $a = (s, a, e, t) => {
  for (var r = t > 1 ? void 0 : t ? Wa(a, e) : a, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(r) || r);
  return r;
}, Re = (s, a) => (e, t) => a(e, t, s);
let Ie = class extends B {
  constructor(s, a, e, t) {
    super(), this._univerInstanceService = s, this._sheetDataValidationModel = a, this._dataValidationCacheService = e, this._lifecycleService = t, this._initRecalculate();
  }
  _initRecalculate() {
    const s = (a) => {
      if (a.length === 0)
        return;
      const e = this._univerInstanceService.getCurrentUnitForType(N.UNIVER_SHEET), t = e == null ? void 0 : e.getActiveSheet(), r = {};
      a.flat().forEach((i) => {
        r[i.unitId] || (r[i.unitId] = {}), r[i.unitId][i.subUnitId] || (r[i.unitId][i.subUnitId] = []);
        const o = this._univerInstanceService.getUnit(i.unitId, N.UNIVER_SHEET), n = o == null ? void 0 : o.getSheetBySheetId(i.subUnitId);
        n && r[i.unitId][i.subUnitId].push(...i.ranges.map((l) => H.transformRange(l, n)));
      }), Object.entries(r).forEach(([i, o]) => {
        Object.entries(o).forEach(([n, l]) => {
          (e == null ? void 0 : e.getUnitId()) === i && (t == null ? void 0 : t.getSheetId()) === n ? this.validatorRanges(i, n, l) : requestIdleCallback(() => {
            this.validatorRanges(i, n, l);
          });
        });
      });
    };
    this.disposeWithMe(this._dataValidationCacheService.dirtyRanges$.pipe(Kt(() => this._lifecycleService.lifecycle$.pipe(tt((a) => a === et.Rendered)))).subscribe(s)), this.disposeWithMe(this._dataValidationCacheService.dirtyRanges$.pipe(tt(() => this._lifecycleService.stage >= et.Rendered), Ot(20)).subscribe(s));
  }
  async _validatorByCell(s, a, e, t) {
    const r = s.getUnitId(), i = a.getSheetId();
    if (!M.isDefine(e) || !M.isDefine(t))
      throw new Error(`row or col is not defined, row: ${e}, col: ${t}`);
    let o = e, n = t;
    const l = a.getMergedCell(e, t);
    l && (o = l.startRow, n = l.startColumn);
    const u = this._sheetDataValidationModel.getRuleByLocation(r, i, o, n);
    return u ? new Promise((c) => {
      this._sheetDataValidationModel.validator(u, { unitId: r, subUnitId: i, row: o, col: n, worksheet: a, workbook: s }, (d) => {
        c(d);
      });
    }) : A.VALID;
  }
  async validatorCell(s, a, e, t) {
    const r = this._univerInstanceService.getUnit(s, N.UNIVER_SHEET);
    if (!r)
      throw new Error(`cannot find current workbook, unitId: ${s}`);
    const i = r.getSheetBySheetId(a);
    if (!i)
      throw new Error(`cannot find current worksheet, sheetId: ${a}`);
    return this._validatorByCell(r, i, e, t);
  }
  async validatorRanges(s, a, e) {
    if (!e.length)
      return Promise.resolve([]);
    const t = this._univerInstanceService.getUnit(s, N.UNIVER_SHEET);
    if (!t)
      throw new Error(`cannot find current workbook, unitId: ${s}`);
    const r = t.getSheetBySheetId(a);
    if (!r)
      throw new Error(`cannot find current worksheet, sheetId: ${a}`);
    const o = this._sheetDataValidationModel.getRules(s, a).map((c) => c.ranges).flat(), n = e.map((c) => o.map((d) => ot(c, d))).flat().filter(Boolean), l = [], u = await Promise.all(
      n.map((c, d) => {
        const g = [];
        for (let f = c.startRow; f <= c.endRow; f++)
          for (let p = c.startColumn; p <= c.endColumn; p++) {
            g.push(this._validatorByCell(t, r, f, p));
            const R = r.getMergedCell(f, p);
            R && l.push({
              resultRowIndex: d,
              resultColIndex: g.length - 1,
              row: R.startRow,
              col: R.startColumn
            });
          }
        return Promise.all(g);
      })
    );
    return l.length && l.forEach(({ resultRowIndex: c, resultColIndex: d, row: g, col: f }) => {
      var p;
      u[c][d] === A.VALIDATING && (u[c][d] = (p = this._dataValidationCacheService.getValue(s, a, g, f)) != null ? p : A.VALID);
    }), u;
  }
  async validatorWorksheet(s, a) {
    const e = this._univerInstanceService.getUnit(s, N.UNIVER_SHEET);
    if (!e)
      throw new Error(`cannot find current workbook, unitId: ${s}`);
    const t = e.getSheetBySheetId(a);
    if (!t)
      throw new Error(`cannot find current worksheet, sheetId: ${a}`);
    const r = this._sheetDataValidationModel.getRules(s, a);
    return await Promise.all(
      r.map((i) => Promise.all(
        i.ranges.map((o) => {
          const n = [];
          return H.foreach(o, (l, u) => {
            n.push(this._validatorByCell(e, t, l, u));
          }), Promise.all(n);
        })
      ))
    ), this._dataValidationCacheService.ensureCache(s, a);
  }
  async validatorWorkbook(s) {
    const a = this._sheetDataValidationModel.getSubUnitIds(s), e = await Promise.all(a.map((r) => this.validatorWorksheet(s, r))), t = {};
    return e.forEach((r, i) => {
      t[a[i]] = r;
    }), t;
  }
  getDataValidations(s, a, e) {
    const t = this._sheetDataValidationModel.getRuleObjectMatrix(s, a), r = /* @__PURE__ */ new Set();
    return e.forEach((o) => {
      H.foreach(o, (n, l) => {
        const u = t.getValue(n, l);
        u && r.add(u);
      });
    }), Array.from(r).map((o) => this._sheetDataValidationModel.getRuleById(s, a, o)).filter(Boolean);
  }
  getDataValidation(s, a, e) {
    return this.getDataValidations(s, a, e)[0];
  }
};
Ie = $a([
  Re(0, D),
  Re(1, v(F)),
  Re(2, v(Q)),
  Re(3, v(wt))
], Ie);
var ka = Object.defineProperty, ja = Object.getOwnPropertyDescriptor, Qa = (s, a, e) => a in s ? ka(s, a, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[a] = e, Ga = (s, a, e, t) => {
  for (var r = t > 1 ? void 0 : t ? ja(a, e) : a, i = s.length - 1, o; i >= 0; i--)
    (o = s[i]) && (r = o(r) || r);
  return r;
}, qe = (s, a) => (e, t) => a(e, t, s), St = (s, a, e) => Qa(s, typeof a != "symbol" ? a + "" : a, e);
let De = class extends Dt {
  constructor(s = st, a, e, t) {
    super(), this._config = s, this._injector = a, this._commandService = e, this._configService = t;
    const { ...r } = bt(
      {},
      st,
      this._config
    );
    this._configService.setConfig(Na, r);
  }
  onStarting() {
    [
      [Q],
      [le],
      [G],
      [W],
      [Ie],
      [F],
      [Ae],
      [Fe],
      [Oe],
      [we],
      [Ne]
    ].forEach((s) => {
      this._injector.add(s);
    }), [
      va,
      _a,
      Ra,
      Sa,
      ya,
      Ma,
      Ea
    ].forEach((s) => {
      this._commandService.registerCommand(s);
    }), this._injector.get(Q), this._injector.get(Ie), this._injector.get(Ae), this._injector.get(Ne), this._injector.get(we);
  }
  onReady() {
    this._injector.get(Oe);
  }
  onRendered() {
    this._injector.get(Fe);
  }
};
St(De, "pluginName", Ca);
St(De, "type", N.UNIVER_SHEET);
De = Ga([
  At(xt),
  qe(1, v(be)),
  qe(2, U),
  qe(3, It)
], De);
function ar(s) {
  const e = s.get(mt).getCurrentSelections().map((i) => i.range);
  return {
    uid: Xe(6),
    type: C.DECIMAL,
    operator: h.EQUAL,
    formula1: "100",
    ranges: e != null ? e : [{ startColumn: 0, endColumn: 0, startRow: 0, endRow: 0 }]
  };
}
const rr = "data-validation.custom-formula-input", ir = "data-validation.formula-input", sr = "data-validation.list-formula-input", or = "data-validation.checkbox-formula-input";
export {
  va as AddSheetDataValidationCommand,
  ir as BASE_FORMULA_INPUT_NAME,
  Ve as CHECKBOX_FORMULA_1,
  ye as CHECKBOX_FORMULA_2,
  or as CHECKBOX_FORMULA_INPUT_NAME,
  rr as CUSTOM_FORMULA_INPUT_NAME,
  na as CheckboxValidator,
  Ea as ClearRangeDataValidationCommand,
  Ca as DATA_VALIDATION_PLUGIN_NAME,
  Q as DataValidationCacheService,
  W as DataValidationCustomFormulaService,
  Fe as DataValidationFormulaController,
  G as DataValidationFormulaService,
  le as DataValidationListCacheService,
  ca as DateValidator,
  sr as LIST_FORMULA_INPUT_NAME,
  Ba as ListMultipleValidator,
  _t as ListValidator,
  Ma as RemoveSheetAllDataValidationCommand,
  ya as RemoveSheetDataValidationCommand,
  F as SheetDataValidationModel,
  Ie as SheetsDataValidationValidatorService,
  De as UniverSheetsDataValidationPlugin,
  Sa as UpdateSheetDataValidationOptionsCommand,
  _a as UpdateSheetDataValidationRangeCommand,
  Ra as UpdateSheetDataValidationSettingCommand,
  ar as createDefaultNewRule,
  Ee as deserializeListOptions,
  Te as getCellValueNumber,
  re as getCellValueOrigin,
  tr as getDataValidationCellValue,
  xe as getDataValidationDiffMutations,
  _e as getFormulaCellData,
  oe as getFormulaResult,
  Ue as getTransformedFormula,
  T as isLegalFormulaResult,
  er as serializeListOptions,
  ve as transformCheckboxValue
};
