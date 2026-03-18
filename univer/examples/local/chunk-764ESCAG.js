import {
  Disposable,
  ICommandService,
  IResourceManagerService,
  IUniverInstanceService,
  Inject,
  Injector,
  O,
  Plugin,
  createIdentifier,
  registerDependencies,
  toDisposable,
  touchDependencies
} from "./chunk-ZRYQFDHJ.js";
import {
  __decorateClass,
  __decorateParam,
  __publicField
} from "./chunk-NSSCU2QI.js";

// ../packages-experimental/uni-formula/src/const.ts
var UNI_FORMULA_PLUGIN_NAME = "UI_FORMULA_PLUGIN";
var DOC_UNI_FORMULA_RESOURCE_NAME = "DOC_FORMULA_PLUGIN";

// ../packages-experimental/uni-formula/src/models/doc-formula.ts
function toJson(formulas) {
  return JSON.stringify(formulas.map((f) => ({ rangeId: f.rangeId, f: f.f, v: f.v, t: f.t })));
}

// ../packages-experimental/uni-formula/src/services/uni-formula.service.ts
var IUniFormulaService = createIdentifier("uni-formula.uni-formula.service");
var DumbUniFormulaService = class extends Disposable {
  constructor(resourceManagerSrv, _commandSrv, _instanceSrv) {
    super();
    this._commandSrv = _commandSrv;
    this._instanceSrv = _instanceSrv;
    __publicField(this, "_docFormulas", /* @__PURE__ */ new Map());
    __publicField(this, "_slideFormulas", /* @__PURE__ */ new Map());
    this._initDocFormulaResources(resourceManagerSrv);
    this._instanceSrv.getTypeOfUnitDisposed$(O.UNIVER_DOC).subscribe((doc) => {
      this._unregisterDoc(doc.getUnitId());
    });
  }
  // #region docs
  hasDocFormula(unitId, formulaId) {
    return this._docFormulas.has(getDocFormulaKey(unitId, formulaId));
  }
  getDocFormula(unitId, rangeId) {
    var _a;
    return (_a = this._docFormulas.get(getDocFormulaKey(unitId, rangeId))) != null ? _a : null;
  }
  updateDocFormulaResults(unitId, formulaIds, v) {
    formulaIds.forEach((id, index) => {
      const formulaData = this._docFormulas.get(getDocFormulaKey(unitId, id));
      if (!formulaData) return true;
      formulaData.v = v[index].v;
      formulaData.t = v[index].t;
      return true;
    });
    return true;
  }
  /**
   * Register a doc formula into the formula system.
   */
  registerDocFormula(unitId, rangeId, f, v, t) {
    const key = getDocFormulaKey(unitId, rangeId);
    if (this._docFormulas.has(key)) {
      throw new Error(`[UniFormulaService]: cannot register formula ${key} when it is already registered!`);
    }
    this._docFormulas.set(key, { unitId, rangeId, f, formulaId: "", v, t });
    return toDisposable(() => this.unregisterDocFormula(unitId, rangeId));
  }
  unregisterDocFormula(unitId, rangeId) {
    const key = getDocFormulaKey(unitId, rangeId);
    const item = this._docFormulas.get(key);
    if (item) {
      this._docFormulas.delete(key);
    }
  }
  updateSlideFormulaResults(unitId, pageId, elementId, formulaId, v) {
    const formulaData = this._slideFormulas.get(getSlideFormulaKey(unitId, pageId, elementId, formulaId));
    if (!formulaData) return true;
    formulaData.v = v.v;
    formulaData.t = v.t;
    return true;
  }
  _initDocFormulaResources(resourceManagerService) {
    resourceManagerService.registerPluginResource({
      pluginName: DOC_UNI_FORMULA_RESOURCE_NAME,
      businesses: [O.UNIVER_DOC],
      toJson: (unitId) => {
        const formulas = this._getAllFormulasOfUnit(unitId);
        return toJson(formulas.map((f) => f[1]));
      },
      parseJson: (json) => {
        const formulas = JSON.parse(json);
        return formulas;
      },
      onLoad: (unitId, formulas) => {
        formulas.forEach((f) => this.registerDocFormula(unitId, f.rangeId, f.f, f.v, f.t));
      },
      onUnLoad: (unitId) => {
        this._unregisterDoc(unitId);
      }
    });
  }
  /**
   * Remove all formulas under a doc.
   */
  _unregisterDoc(unitId) {
    const existingFormulas = Array.from(this._docFormulas.entries());
    existingFormulas.forEach(([_, value]) => {
      if (value.unitId === unitId) this.unregisterDocFormula(unitId, value.rangeId);
    });
  }
  // #endregion
  // #region slides
  registerSlideFormula(unitId, pageId, elementId, rangeId, f, v, t) {
    const key = getSlideFormulaKey(unitId, pageId, elementId, f);
    if (this._slideFormulas.has(key)) {
      throw new Error(`[UniFormulaService]: cannot register formula ${key} when it is already registered!`);
    }
    this._slideFormulas.set(key, { unitId, pageId, elementId, rangeId, formulaId: "", f, v, t });
    return toDisposable(() => this.unregisterDocFormula(unitId, rangeId));
  }
  hasSlideFormula(unitId, pageId, elementId, formulaId) {
    return this._slideFormulas.has(getSlideFormulaKey(unitId, pageId, elementId, formulaId));
  }
  getSlideFormula(unitId, pageId, elementId, formulaId) {
    var _a;
    return (_a = this._slideFormulas.get(getSlideFormulaKey(unitId, pageId, elementId, formulaId))) != null ? _a : null;
  }
  unregisterSlideFormula(unitId, pageId, elementId, formulaId) {
    const key = getSlideFormulaKey(unitId, pageId, elementId, formulaId);
    const item = this._slideFormulas.get(key);
    if (item) {
      this._slideFormulas.delete(key);
    }
  }
  // #endregion
  _getAllFormulasOfUnit(unitId) {
    const formulas = Array.from(this._docFormulas.entries()).filter((v) => v[1].unitId === unitId);
    return formulas;
  }
};
DumbUniFormulaService = __decorateClass([
  __decorateParam(0, IResourceManagerService),
  __decorateParam(1, ICommandService),
  __decorateParam(2, IUniverInstanceService)
], DumbUniFormulaService);
function getDocFormulaKey(unitId, formulaId) {
  return `pseudo-${unitId}-${formulaId}`;
}
function getSlideFormulaKey(unitId, pageId, elementId, formulaId) {
  return `pseudo-${unitId}-${pageId}-${elementId}-${formulaId}`;
}

// ../packages-experimental/uni-formula/src/commands/mutations/doc-formula.mutation.ts
var AddDocUniFormulaMutation = {
  type: 2 /* MUTATION */,
  id: "doc.mutation.add-doc-uni-formula",
  handler(accessor, params) {
    const { unitId, f, rangeId: id } = params;
    const uniFormulaService = accessor.get(IUniFormulaService);
    uniFormulaService.registerDocFormula(unitId, id, f);
    return true;
  }
};
var UpdateDocUniFormulaMutation = {
  type: 2 /* MUTATION */,
  id: "doc.mutation.update-doc-uni-formula",
  handler(accessor, params) {
    const { unitId, f, rangeId: id } = params;
    const uniFormulaService = accessor.get(IUniFormulaService);
    if (!uniFormulaService.hasDocFormula(unitId, id)) return false;
    uniFormulaService.unregisterDocFormula(unitId, id);
    uniFormulaService.registerDocFormula(unitId, id, f);
    return true;
  }
};
var RemoveDocUniFormulaMutation = {
  type: 2 /* MUTATION */,
  id: "doc.mutation.remove-doc-uni-formula",
  handler(accessor, params) {
    const { unitId, rangeId: id } = params;
    const uniFormulaService = accessor.get(IUniFormulaService);
    if (!uniFormulaService.hasDocFormula(unitId, id)) {
      return false;
    }
    uniFormulaService.unregisterDocFormula(unitId, id);
    return true;
  }
};

// ../packages-experimental/uni-formula/src/controller/uni-formula.controller.ts
var UniFormulaController = class {
  constructor(_commandSrv) {
    this._commandSrv = _commandSrv;
    this._initCommands();
  }
  _initCommands() {
    [
      AddDocUniFormulaMutation,
      UpdateDocUniFormulaMutation,
      RemoveDocUniFormulaMutation
    ].forEach((command) => this._commandSrv.registerCommand(command));
  }
};
UniFormulaController = __decorateClass([
  __decorateParam(0, ICommandService)
], UniFormulaController);

// ../packages-experimental/uni-formula/src/plugin.ts
var UniverDocUniFormulaPlugin = class extends Plugin {
  constructor(_config, _injector) {
    super();
    this._config = _config;
    this._injector = _injector;
  }
  onStarting() {
    var _a;
    const dependencies = [[UniFormulaController]];
    if ((_a = this._config) == null ? void 0 : _a.playDumb) {
      dependencies.push([IUniFormulaService, { useClass: DumbUniFormulaService }]);
    }
    registerDependencies(this._injector, dependencies);
    touchDependencies(this._injector, dependencies.map((d) => [d[0]]));
  }
};
__publicField(UniverDocUniFormulaPlugin, "pluginName", UNI_FORMULA_PLUGIN_NAME);
// This plugin should load only when sheet related modules are loaded.
__publicField(UniverDocUniFormulaPlugin, "type", O.UNIVER_UNKNOWN);
UniverDocUniFormulaPlugin = __decorateClass([
  __decorateParam(1, Inject(Injector))
], UniverDocUniFormulaPlugin);

export {
  IUniFormulaService,
  DumbUniFormulaService,
  AddDocUniFormulaMutation,
  UpdateDocUniFormulaMutation,
  RemoveDocUniFormulaMutation,
  UniverDocUniFormulaPlugin
};
//# sourceMappingURL=chunk-764ESCAG.js.map
