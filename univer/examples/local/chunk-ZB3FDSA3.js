import {
  FormulaRefRangeService,
  RegisterOtherFormulaService
} from "./chunk-EK3JRTKZ.js";
import {
  ClearSelectionAllCommand,
  CopySheetCommand,
  ERROR_TYPE_SET,
  LexerTreeBuilder,
  RefRangeService,
  RemoveSheetCommand,
  RemoveSheetMutation,
  SetRangeValuesMutation,
  SetRangeValuesUndoMutationFactory,
  SheetInterceptorService,
  SheetsSelectionsService,
  WorksheetViewPermission,
  deserializeRangeWithSheet,
  deserializeRangeWithSheetWithCache,
  getSheetCommandTarget,
  handleCommonDefaultRangeChangeWithEffectRefCommands,
  isReferenceString
} from "./chunk-O5WA5YRR.js";
import {
  BehaviorSubject,
  DependentOn,
  Disposable,
  ICommandService,
  IConfigService,
  ILogService,
  IPermissionService,
  IResourceManagerService,
  IUndoRedoService,
  IUniverInstanceService,
  Inject,
  Injector,
  LifecycleService,
  LocaleService,
  O,
  ObjectMatrix,
  Plugin,
  R,
  RBush,
  Range,
  Rectangle,
  RxDisposable,
  Subject,
  Tools,
  bufferDebounceTime,
  bufferWhen,
  debounceTime,
  debounce_default,
  filter,
  generateRandomId,
  getIntersectRange,
  getOriginCellValue,
  import_dayjs,
  isFormulaString,
  isRangesEqual,
  lib_exports,
  merge_default,
  sequenceExecute,
  toDisposable
} from "./chunk-ZRYQFDHJ.js";
import {
  __decorateClass,
  __decorateParam,
  __publicField
} from "./chunk-NSSCU2QI.js";

// ../packages/data-validation/src/common/util.ts
function getRuleSetting(rule) {
  return {
    type: rule.type,
    operator: rule.operator,
    formula1: rule.formula1,
    formula2: rule.formula2,
    allowBlank: rule.allowBlank
  };
}
function getRuleOptions(rule) {
  return {
    error: rule.error,
    errorStyle: rule.errorStyle,
    errorTitle: rule.errorTitle,
    imeMode: rule.imeMode,
    prompt: rule.prompt,
    promptTitle: rule.promptTitle,
    showDropDown: rule.showDropDown,
    showErrorMessage: rule.showErrorMessage,
    showInputMessage: rule.showInputMessage,
    renderMode: rule.renderMode,
    bizInfo: rule.bizInfo
  };
}

// ../packages/data-validation/src/models/data-validation-model.ts
var DataValidationModel = class extends Disposable {
  constructor(_logService) {
    super();
    this._logService = _logService;
    __publicField(this, "_model", /* @__PURE__ */ new Map());
    __publicField(this, "_ruleChange$", new Subject());
    __publicField(this, "ruleChange$", this._ruleChange$.asObservable());
    __publicField(this, "ruleChangeDebounce$", this.ruleChange$.pipe(debounceTime(20)));
    this.disposeWithMe({
      dispose: () => {
        this._ruleChange$.complete();
      }
    });
  }
  _ensureMap(unitId, subUnitId) {
    if (!this._model.has(unitId)) {
      this._model.set(unitId, /* @__PURE__ */ new Map());
    }
    const unitMap = this._model.get(unitId);
    if (unitMap.has(subUnitId)) {
      return unitMap.get(subUnitId);
    }
    const map = { map: /* @__PURE__ */ new Map(), list: [] };
    unitMap.set(subUnitId, map);
    return map;
  }
  _addSubUnitRule(subUnit, rule, index) {
    const { map: dataValidationMap, list: dataValidations } = subUnit;
    const _rules = Array.isArray(rule) ? rule : [rule];
    const rules = _rules.filter((item) => !dataValidationMap.has(item.uid));
    if (typeof index === "number" && index < dataValidations.length) {
      dataValidations.splice(index, 0, ...rules);
    } else {
      dataValidations.push(...rules);
    }
    rules.forEach((item) => {
      dataValidationMap.set(item.uid, item);
    });
  }
  _removeSubUnitRule(subUnit, ruleId) {
    const { map: dataValidationMap, list: dataValidations } = subUnit;
    const index = dataValidations.findIndex((item) => item.uid === ruleId);
    if (index > -1) {
      dataValidations.splice(index, 1);
      dataValidationMap.delete(ruleId);
    }
  }
  _updateSubUnitRule(subUnit, ruleId, payload) {
    const { map: dataValidationMap, list: dataValidations } = subUnit;
    const oldRule = dataValidationMap.get(ruleId);
    const index = dataValidations.findIndex((rule2) => ruleId === rule2.uid);
    if (!oldRule) {
      throw new Error(`Data validation rule is not found, ruleId: ${ruleId}.`);
    }
    const rule = { ...oldRule };
    switch (payload.type) {
      case 1 /* RANGE */: {
        rule.ranges = payload.payload;
        break;
      }
      case 0 /* SETTING */: {
        Object.assign(rule, getRuleSetting(payload.payload));
        break;
      }
      case 2 /* OPTIONS */: {
        Object.assign(rule, getRuleOptions(payload.payload));
        break;
      }
      case 3 /* ALL */: {
        Object.assign(rule, payload.payload);
        break;
      }
      default:
        break;
    }
    dataValidations[index] = rule;
    dataValidationMap.set(ruleId, rule);
    return rule;
  }
  _addRuleSideEffect(unitId, subUnitId, rule, source) {
    const subUnitMap = this._ensureMap(unitId, subUnitId);
    const oldRule = subUnitMap.map.get(rule.uid);
    if (oldRule) {
      return;
    }
    return {
      rule,
      type: "add",
      unitId,
      subUnitId,
      source
    };
  }
  addRule(unitId, subUnitId, rule, source, index) {
    try {
      const subUnitMap = this._ensureMap(unitId, subUnitId);
      const rules = Array.isArray(rule) ? rule : [rule];
      const effects = rules.map((item) => this._addRuleSideEffect(unitId, subUnitId, item, source));
      this._addSubUnitRule(subUnitMap, rule, index);
      effects.forEach((effect) => {
        if (effect) {
          this._ruleChange$.next(effect);
        }
      });
    } catch (error) {
      this._logService.error(error);
    }
  }
  updateRule(unitId, subUnitId, ruleId, payload, source) {
    try {
      const subUnitMap = this._ensureMap(unitId, subUnitId);
      const oldRule = Tools.deepClone(subUnitMap.map.get(ruleId));
      if (!oldRule) {
        throw new Error(`Data validation rule is not found, ruleId: ${ruleId}.`);
      }
      const rule = this._updateSubUnitRule(subUnitMap, ruleId, payload);
      this._ruleChange$.next({
        rule,
        type: "update",
        unitId,
        subUnitId,
        source,
        updatePayload: payload,
        oldRule
      });
    } catch (error) {
      this._logService.error(error);
    }
  }
  removeRule(unitId, subUnitId, ruleId, source) {
    try {
      const map = this._ensureMap(unitId, subUnitId);
      const oldRule = map.map.get(ruleId);
      if (oldRule) {
        this._removeSubUnitRule(map, ruleId);
        this._ruleChange$.next({
          rule: oldRule,
          type: "remove",
          unitId,
          subUnitId,
          source
        });
      }
    } catch (error) {
      this._logService.error(error);
    }
  }
  getRuleById(unitId, subUnitId, ruleId) {
    const map = this._ensureMap(unitId, subUnitId);
    return map.map.get(ruleId);
  }
  getRuleIndex(unitId, subUnitId, ruleId) {
    const map = this._ensureMap(unitId, subUnitId);
    return map.list.findIndex((rule) => rule.uid === ruleId);
  }
  getRules(unitId, subUnitId) {
    const manager = this._ensureMap(unitId, subUnitId);
    return [...manager.list];
  }
  getUnitRules(unitId) {
    const unitMap = this._model.get(unitId);
    if (!unitMap) {
      return [];
    }
    const res = [];
    unitMap.forEach((manager, subUnitId) => {
      res.push([subUnitId, manager.list]);
    });
    return res;
  }
  deleteUnitRules(unitId) {
    this._model.delete(unitId);
  }
  getSubUnitIds(unitId) {
    var _a, _b;
    return Array.from((_b = (_a = this._model.get(unitId)) == null ? void 0 : _a.keys()) != null ? _b : []);
  }
  getAll() {
    return Array.from(this._model.keys()).map((unitId) => [unitId, this.getUnitRules(unitId)]);
  }
};
DataValidationModel = __decorateClass([
  __decorateParam(0, ILogService)
], DataValidationModel);

// ../packages/data-validation/src/commands/mutations/data-validation.mutation.ts
var AddDataValidationMutation = {
  type: 2 /* MUTATION */,
  id: "data-validation.mutation.addRule",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { unitId, subUnitId, rule, index, source = "command" } = params;
    const dataValidationModel = accessor.get(DataValidationModel);
    dataValidationModel.addRule(unitId, subUnitId, rule, source, index);
    return true;
  }
};
var RemoveDataValidationMutation = {
  type: 2 /* MUTATION */,
  id: "data-validation.mutation.removeRule",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { unitId, subUnitId, ruleId, source = "command" } = params;
    const dataValidationModel = accessor.get(DataValidationModel);
    if (Array.isArray(ruleId)) {
      ruleId.forEach((item) => {
        dataValidationModel.removeRule(unitId, subUnitId, item, source);
      });
    } else {
      dataValidationModel.removeRule(unitId, subUnitId, ruleId, source);
    }
    return true;
  }
};
var UpdateDataValidationMutation = {
  type: 2 /* MUTATION */,
  id: "data-validation.mutation.updateRule",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { unitId, subUnitId, ruleId, payload, source = "command" } = params;
    const dataValidationModel = accessor.get(DataValidationModel);
    dataValidationModel.updateRule(unitId, subUnitId, ruleId, payload, source);
    return true;
  }
};

// ../packages/data-validation/src/controllers/dv-resource.controller.ts
var DATA_VALIDATION_PLUGIN_NAME = "SHEET_DATA_VALIDATION_PLUGIN";
var DataValidationResourceController = class extends Disposable {
  constructor(_resourceManagerService, _univerInstanceService, _dataValidationModel) {
    super();
    this._resourceManagerService = _resourceManagerService;
    this._univerInstanceService = _univerInstanceService;
    this._dataValidationModel = _dataValidationModel;
    this._initSnapshot();
  }
  _initSnapshot() {
    const toJson = (unitID) => {
      const map = this._dataValidationModel.getUnitRules(unitID);
      const resultMap = {};
      if (map) {
        map.forEach(([key, v]) => {
          resultMap[key] = v;
        });
        return JSON.stringify(resultMap);
      }
      return "";
    };
    const parseJson = (json) => {
      if (!json) {
        return {};
      }
      try {
        return JSON.parse(json);
      } catch (err) {
        return {};
      }
    };
    this.disposeWithMe(
      this._resourceManagerService.registerPluginResource({
        pluginName: DATA_VALIDATION_PLUGIN_NAME,
        businesses: [O.UNIVER_SHEET],
        toJson: (unitID) => toJson(unitID),
        parseJson: (json) => parseJson(json),
        onUnLoad: (unitID) => {
          this._dataValidationModel.deleteUnitRules(unitID);
        },
        onLoad: (unitID, value) => {
          Object.keys(value).forEach((subunitId) => {
            const ruleList = value[subunitId];
            ruleList.forEach((rule) => {
              this._dataValidationModel.addRule(unitID, subunitId, rule, "patched");
            });
          });
        }
      })
    );
  }
};
DataValidationResourceController = __decorateClass([
  __decorateParam(0, IResourceManagerService),
  __decorateParam(1, IUniverInstanceService),
  __decorateParam(2, Inject(DataValidationModel))
], DataValidationResourceController);

// ../packages/data-validation/src/services/data-validator-registry.service.ts
var DataValidatorRegistryService = class {
  constructor() {
    __publicField(this, "_validatorByScopes", /* @__PURE__ */ new Map());
    __publicField(this, "_validatorMap", /* @__PURE__ */ new Map());
    __publicField(this, "_validatorsChange$", new BehaviorSubject(void 0));
    __publicField(this, "validatorsChange$", this._validatorsChange$.asObservable());
  }
  _addValidatorToScope(validator, scope) {
    if (!this._validatorByScopes.has(scope)) {
      this._validatorByScopes.set(scope, []);
    }
    const validators = this._validatorByScopes.get(scope);
    if (validators.findIndex((m) => m.id === validator.id) > -1) {
      throw new Error(`Validator item with the same id ${validator.id} has already been added!`);
    }
    validators.push(validator);
  }
  _removeValidatorFromScope(validator, scope) {
    const validators = this._validatorByScopes.get(scope);
    if (!validators) {
      return;
    }
    const index = validators.findIndex((v) => v.id === validator.id);
    if (index > -1) {
      validators.splice(index, 1);
    }
  }
  register(validator) {
    this._validatorMap.set(validator.id, validator);
    if (Array.isArray(validator.scopes)) {
      validator.scopes.forEach((scope) => {
        this._addValidatorToScope(validator, scope);
      });
    } else {
      this._addValidatorToScope(validator, validator.scopes);
    }
    this._validatorsChange$.next();
    return toDisposable(() => {
      this._validatorMap.delete(validator.id);
      if (Array.isArray(validator.scopes)) {
        validator.scopes.forEach((scope) => {
          this._removeValidatorFromScope(validator, scope);
        });
      } else {
        this._removeValidatorFromScope(validator, validator.scopes);
      }
      this._validatorsChange$.next();
    });
  }
  getValidatorItem(id) {
    return this._validatorMap.get(id);
  }
  getValidatorsByScope(scope) {
    return this._validatorByScopes.get(scope);
  }
};

// ../packages/data-validation/src/commands/commands/data-validation.command.ts
var AddDataValidationCommand = {
  type: 0 /* COMMAND */,
  id: "data-validation.command.addRule",
  async handler(accessor, params) {
    const logService = accessor.get(ILogService);
    logService.error("[Deprecated]: `AddDataValidationCommand` is deprecated, please use `AddSheetDataValidationCommand` in `@univerjs/sheets-data-validation` instead!");
    if (!params) {
      return false;
    }
    const { rule, unitId, subUnitId } = params;
    const commandService = accessor.get(ICommandService);
    const undoRedoService = accessor.get(IUndoRedoService);
    const mutationParams = {
      ...params,
      rule: {
        ...params.rule,
        ranges: [params.rule.range]
      }
    };
    const redoMutations = [{
      id: AddDataValidationMutation.id,
      params: mutationParams
    }];
    const undoMutations = [{
      id: RemoveDataValidationMutation.id,
      params: {
        unitId,
        subUnitId,
        ruleId: rule.uid
      }
    }];
    undoRedoService.pushUndoRedo({
      unitID: unitId,
      redoMutations,
      undoMutations
    });
    await commandService.executeCommand(AddDataValidationMutation.id, mutationParams);
    return true;
  }
};
var RemoveDataValidationCommand = {
  type: 0 /* COMMAND */,
  id: "data-validation.command.removeRule",
  handler(accessor, params) {
    const logService = accessor.get(ILogService);
    logService.error("[Deprecated]: `RemoveDataValidationCommand` is deprecated, please use `RemoveSheetDataValidationCommand` in `@univerjs/sheets-data-validation` instead!");
    if (!params) {
      return false;
    }
    const { unitId, subUnitId, ruleId } = params;
    const commandService = accessor.get(ICommandService);
    const undoRedoService = accessor.get(IUndoRedoService);
    const dataValidationModel = accessor.get(DataValidationModel);
    const redoMutations = [{
      id: RemoveDataValidationMutation.id,
      params
    }];
    const undoMutations = [{
      id: AddDataValidationMutation.id,
      params: {
        unitId,
        subUnitId,
        rule: {
          ...dataValidationModel.getRuleById(unitId, subUnitId, ruleId)
        },
        index: dataValidationModel.getRuleIndex(unitId, subUnitId, ruleId)
      }
    }];
    undoRedoService.pushUndoRedo({
      undoMutations,
      redoMutations,
      unitID: params.unitId
    });
    commandService.executeCommand(RemoveDataValidationMutation.id, params);
    return true;
  }
};
var UpdateDataValidationOptionsCommand = {
  type: 0 /* COMMAND */,
  id: "data-validation.command.updateDataValidationSetting",
  handler(accessor, params) {
    const logService = accessor.get(ILogService);
    logService.warn("[Deprecated]: `UpdateDataValidationOptionsCommand` is deprecated, please use `UpdateSheetDataValidationOptionsCommand` in `@univerjs/sheets-data-validation` instead!");
    if (!params) {
      return false;
    }
    const commandService = accessor.get(ICommandService);
    const redoUndoService = accessor.get(IUndoRedoService);
    const dataValidationModel = accessor.get(DataValidationModel);
    const { unitId, subUnitId, ruleId, options } = params;
    const rule = dataValidationModel.getRuleById(unitId, subUnitId, ruleId);
    if (!rule) {
      return false;
    }
    const mutationParams = {
      unitId,
      subUnitId,
      ruleId,
      payload: {
        type: 2 /* OPTIONS */,
        payload: options
      }
    };
    const redoMutations = [{
      id: UpdateDataValidationMutation.id,
      params: mutationParams
    }];
    const undoMutationParams = {
      unitId,
      subUnitId,
      ruleId,
      payload: {
        type: 2 /* OPTIONS */,
        payload: getRuleOptions(rule)
      }
    };
    const undoMutations = [{
      id: UpdateDataValidationMutation.id,
      params: undoMutationParams
    }];
    redoUndoService.pushUndoRedo({
      unitID: unitId,
      redoMutations,
      undoMutations
    });
    commandService.executeCommand(UpdateDataValidationMutation.id, mutationParams);
    return true;
  }
};
var UpdateDataValidationSettingCommand = {
  type: 0 /* COMMAND */,
  id: "data-validation.command.updateDataValidationOptions",
  handler(accessor, params) {
    const logService = accessor.get(ILogService);
    logService.error("[Deprecated]: `UpdateDataValidationSettingCommand` is deprecated, please use `UpdateSheetDataValidationSettingCommand` in `@univerjs/sheets-data-validation` instead!");
    if (!params) {
      return false;
    }
    const commandService = accessor.get(ICommandService);
    const redoUndoService = accessor.get(IUndoRedoService);
    const dataValidationModel = accessor.get(DataValidationModel);
    const dataValidatorRegistryService = accessor.get(DataValidatorRegistryService);
    const { unitId, subUnitId, ruleId, setting } = params;
    const validator = dataValidatorRegistryService.getValidatorItem(setting.type);
    if (!validator) {
      return false;
    }
    const rule = dataValidationModel.getRuleById(unitId, subUnitId, ruleId);
    if (!rule) {
      return false;
    }
    const newRule = { ...rule, ...setting };
    if (!validator.validatorFormula(newRule, unitId, subUnitId).success) {
      return false;
    }
    const mutationParams = {
      unitId,
      subUnitId,
      ruleId,
      payload: {
        type: 0 /* SETTING */,
        payload: {
          ...setting,
          ...validator.normalizeFormula(newRule, unitId, subUnitId)
        }
      }
    };
    const redoMutations = [{
      id: UpdateDataValidationMutation.id,
      params: mutationParams
    }];
    const undoMutationParams = {
      unitId,
      subUnitId,
      ruleId,
      payload: {
        type: 0 /* SETTING */,
        payload: getRuleSetting(rule)
      }
    };
    const undoMutations = [{
      id: UpdateDataValidationMutation.id,
      params: undoMutationParams
    }];
    redoUndoService.pushUndoRedo({
      unitID: unitId,
      redoMutations,
      undoMutations
    });
    commandService.executeCommand(UpdateDataValidationMutation.id, mutationParams);
    return true;
  }
};
var RemoveAllDataValidationCommand = {
  type: 0 /* COMMAND */,
  id: "data-validation.command.removeAll",
  handler(accessor, params) {
    const logService = accessor.get(ILogService);
    logService.error("[Deprecated]: `RemoveAllDataValidationCommand` is deprecated, please use `RemoveSheetAllDataValidationCommand` in `@univerjs/sheets-data-validation` instead!");
    if (!params) {
      return false;
    }
    const { unitId, subUnitId } = params;
    const commandService = accessor.get(ICommandService);
    const dataValidationModel = accessor.get(DataValidationModel);
    const undoRedoService = accessor.get(IUndoRedoService);
    const currentRules = [...dataValidationModel.getRules(unitId, subUnitId)];
    const redoParams = {
      unitId,
      subUnitId,
      ruleId: currentRules.map((rule) => rule.uid)
    };
    const redoMutations = [{
      id: RemoveDataValidationMutation.id,
      params: redoParams
    }];
    const undoMutations = [{
      id: AddDataValidationMutation.id,
      params: {
        unitId,
        subUnitId,
        rule: currentRules
      }
    }];
    undoRedoService.pushUndoRedo({
      redoMutations,
      undoMutations,
      unitID: unitId
    });
    commandService.executeCommand(RemoveDataValidationMutation.id, redoParams);
    return true;
  }
};

// ../packages/data-validation/src/controllers/config.schema.ts
var DATA_VALIDATION_PLUGIN_CONFIG_KEY = "data-validation.config";
var configSymbol = Symbol(DATA_VALIDATION_PLUGIN_CONFIG_KEY);
var defaultPluginConfig = {};

// ../packages/data-validation/src/plugin.ts
var PLUGIN_NAME = "UNIVER_DATA_VALIDATION_PLUGIN";
var UniverDataValidationPlugin = class extends Plugin {
  constructor(_config = defaultPluginConfig, _injector, _commandService, _configService) {
    super();
    this._config = _config;
    this._injector = _injector;
    this._commandService = _commandService;
    this._configService = _configService;
    const { ...rest } = merge_default(
      {},
      defaultPluginConfig,
      this._config
    );
    this._configService.setConfig(DATA_VALIDATION_PLUGIN_CONFIG_KEY, rest);
  }
  onStarting() {
    [
      [DataValidationModel],
      [DataValidatorRegistryService],
      [DataValidationResourceController]
    ].forEach((d) => this._injector.add(d));
    [
      // command
      AddDataValidationCommand,
      RemoveAllDataValidationCommand,
      UpdateDataValidationOptionsCommand,
      UpdateDataValidationSettingCommand,
      RemoveDataValidationCommand,
      // mutation
      AddDataValidationMutation,
      UpdateDataValidationMutation,
      RemoveDataValidationMutation
    ].forEach((command) => {
      this._commandService.registerCommand(command);
    });
  }
  onReady() {
    this._injector.get(DataValidationResourceController);
  }
};
__publicField(UniverDataValidationPlugin, "pluginName", PLUGIN_NAME);
__publicField(UniverDataValidationPlugin, "type", O.UNIVER_SHEET);
UniverDataValidationPlugin = __decorateClass([
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, ICommandService),
  __decorateParam(3, IConfigService)
], UniverDataValidationPlugin);

// ../packages/data-validation/src/types/const/operator-text-map.ts
var OperatorTextMap = {
  ["between" /* BETWEEN */]: "dataValidation.operators.between",
  ["equal" /* EQUAL */]: "dataValidation.operators.equal",
  ["greaterThan" /* GREATER_THAN */]: "dataValidation.operators.greaterThan",
  ["greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */]: "dataValidation.operators.greaterThanOrEqual",
  ["lessThan" /* LESS_THAN */]: "dataValidation.operators.lessThan",
  ["lessThanOrEqual" /* LESS_THAN_OR_EQUAL */]: "dataValidation.operators.lessThanOrEqual",
  ["notBetween" /* NOT_BETWEEN */]: "dataValidation.operators.notBetween",
  ["notEqual" /* NOT_EQUAL */]: "dataValidation.operators.notEqual"
};
var OperatorTitleMap = {
  ["between" /* BETWEEN */]: "dataValidation.ruleName.between",
  ["equal" /* EQUAL */]: "dataValidation.ruleName.equal",
  ["greaterThan" /* GREATER_THAN */]: "dataValidation.ruleName.greaterThan",
  ["greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */]: "dataValidation.ruleName.greaterThanOrEqual",
  ["lessThan" /* LESS_THAN */]: "dataValidation.ruleName.lessThan",
  ["lessThanOrEqual" /* LESS_THAN_OR_EQUAL */]: "dataValidation.ruleName.lessThanOrEqual",
  ["notBetween" /* NOT_BETWEEN */]: "dataValidation.ruleName.notBetween",
  ["notEqual" /* NOT_EQUAL */]: "dataValidation.ruleName.notEqual",
  NONE: "dataValidation.ruleName.legal"
};
var OperatorErrorTitleMap = {
  ["between" /* BETWEEN */]: "dataValidation.errorMsg.between",
  ["equal" /* EQUAL */]: "dataValidation.errorMsg.equal",
  ["greaterThan" /* GREATER_THAN */]: "dataValidation.errorMsg.greaterThan",
  ["greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */]: "dataValidation.errorMsg.greaterThanOrEqual",
  ["lessThan" /* LESS_THAN */]: "dataValidation.errorMsg.lessThan",
  ["lessThanOrEqual" /* LESS_THAN_OR_EQUAL */]: "dataValidation.errorMsg.lessThanOrEqual",
  ["notBetween" /* NOT_BETWEEN */]: "dataValidation.errorMsg.notBetween",
  ["notEqual" /* NOT_EQUAL */]: "dataValidation.errorMsg.notEqual",
  NONE: "dataValidation.errorMsg.legal"
};
var TextLengthErrorTitleMap = {
  ["between" /* BETWEEN */]: "dataValidation.textLength.errorMsg.between",
  ["equal" /* EQUAL */]: "dataValidation.textLength.errorMsg.equal",
  ["greaterThan" /* GREATER_THAN */]: "dataValidation.textLength.errorMsg.greaterThan",
  ["greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */]: "dataValidation.textLength.errorMsg.greaterThanOrEqual",
  ["lessThan" /* LESS_THAN */]: "dataValidation.textLength.errorMsg.lessThan",
  ["lessThanOrEqual" /* LESS_THAN_OR_EQUAL */]: "dataValidation.textLength.errorMsg.lessThanOrEqual",
  ["notBetween" /* NOT_BETWEEN */]: "dataValidation.textLength.errorMsg.notBetween",
  ["notEqual" /* NOT_EQUAL */]: "dataValidation.textLength.errorMsg.notEqual"
};

// ../packages/data-validation/src/types/const/two-formula-operators.ts
var TWO_FORMULA_OPERATOR_COUNT = [
  "between" /* BETWEEN */,
  "notBetween" /* NOT_BETWEEN */
];

// ../packages/data-validation/src/validators/base-data-validator.ts
var FORMULA1 = "{FORMULA1}";
var FORMULA2 = "{FORMULA2}";
var TYPE = "{TYPE}";
var operatorNameMap = {
  ["between" /* BETWEEN */]: "dataValidation.operators.between",
  ["equal" /* EQUAL */]: "dataValidation.operators.equal",
  ["greaterThan" /* GREATER_THAN */]: "dataValidation.operators.greaterThan",
  ["greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */]: "dataValidation.operators.greaterThanOrEqual",
  ["lessThan" /* LESS_THAN */]: "dataValidation.operators.lessThan",
  ["lessThanOrEqual" /* LESS_THAN_OR_EQUAL */]: "dataValidation.operators.lessThanOrEqual",
  ["notBetween" /* NOT_BETWEEN */]: "dataValidation.operators.notBetween",
  ["notEqual" /* NOT_EQUAL */]: "dataValidation.operators.notEqual"
};
var BaseDataValidator = class {
  // #endregion
  constructor(localeService, injector) {
    this.localeService = localeService;
    this.injector = injector;
    __publicField(this, "offsetFormulaByRange", true);
    // #region UI related
    __publicField(this, "formulaInput");
    __publicField(this, "canvasRender", null);
    __publicField(this, "dropdownType");
    __publicField(this, "optionsInput");
    __publicField(this, "skipDefaultFontRender");
  }
  get operatorNames() {
    return this.operators.map((operator) => this.localeService.t(operatorNameMap[operator]));
  }
  get titleStr() {
    return this.localeService.t(this.title);
  }
  generateRuleName(rule) {
    var _a, _b;
    if (!rule.operator) {
      return this.localeService.t(OperatorTitleMap.NONE).replace(TYPE, this.titleStr);
    }
    const ruleName = this.localeService.t(OperatorTitleMap[rule.operator]).replace(FORMULA1, (_a = rule.formula1) != null ? _a : "").replace(FORMULA2, (_b = rule.formula2) != null ? _b : "");
    return `${this.titleStr} ${ruleName}`;
  }
  generateRuleErrorMessage(rule, position) {
    var _a, _b;
    if (!rule.operator) {
      return this.localeService.t(OperatorErrorTitleMap.NONE).replace(TYPE, this.titleStr);
      ;
    }
    const errorMsg = this.localeService.t(OperatorErrorTitleMap[rule.operator]).replace(FORMULA1, (_a = rule.formula1) != null ? _a : "").replace(FORMULA2, (_b = rule.formula2) != null ? _b : "");
    return `${errorMsg}`;
  }
  getExtraStyle(rule, value, ctx, row, column) {
  }
  getRuleFinalError(rule, position) {
    if (rule.showErrorMessage && rule.error) {
      return rule.error;
    }
    return this.generateRuleErrorMessage(rule, position);
  }
  isEmptyCellValue(cellValue) {
    if (cellValue === "" || cellValue === void 0 || cellValue === null) {
      return true;
    }
    return false;
  }
  normalizeFormula(rule, unitId, subUnitId) {
    return {
      formula1: rule.formula1,
      formula2: rule.formula2
    };
  }
  async isValidType(cellInfo, formula, rule) {
    return true;
  }
  transform(cellInfo, formula, rule) {
    return cellInfo;
  }
  async validatorIsEqual(cellInfo, formula, rule) {
    const { formula1 } = formula;
    const { value: cellValue } = cellInfo;
    if (Number.isNaN(formula1)) {
      return true;
    }
    return cellValue === formula1;
  }
  async validatorIsNotEqual(cellInfo, formula, _rule) {
    const { formula1 } = formula;
    if (Number.isNaN(formula1)) {
      return true;
    }
    return cellInfo.value !== formula1;
  }
  async validatorIsBetween(cellInfo, formula, _rule) {
    const { formula1, formula2 } = formula;
    if (Number.isNaN(formula1) || Number.isNaN(formula2)) {
      return true;
    }
    const start = Math.min(formula1, formula2);
    const end = Math.max(formula1, formula2);
    return cellInfo.value >= start && cellInfo.value <= end;
  }
  async validatorIsNotBetween(cellInfo, formula, _rule) {
    const { formula1, formula2 } = formula;
    if (Number.isNaN(formula1) || Number.isNaN(formula2)) {
      return true;
    }
    const start = Math.min(formula1, formula2);
    const end = Math.max(formula1, formula2);
    return cellInfo.value < start || cellInfo.value > end;
  }
  async validatorIsGreaterThan(cellInfo, formula, _rule) {
    const { formula1 } = formula;
    if (Number.isNaN(formula1)) {
      return true;
    }
    return cellInfo.value > formula1;
  }
  async validatorIsGreaterThanOrEqual(cellInfo, formula, _rule) {
    const { formula1 } = formula;
    if (Number.isNaN(formula1)) {
      return true;
    }
    return cellInfo.value >= formula1;
  }
  async validatorIsLessThan(cellInfo, formula, _rule) {
    const { formula1 } = formula;
    if (Number.isNaN(formula1)) {
      return true;
    }
    return cellInfo.value < formula1;
  }
  async validatorIsLessThanOrEqual(cellInfo, formula, _rule) {
    const { formula1 } = formula;
    if (Number.isNaN(formula1)) {
      return true;
    }
    return cellInfo.value <= formula1;
  }
  async validator(cellInfo, rule) {
    const { value: cellValue, unitId, subUnitId } = cellInfo;
    const isEmpty = this.isEmptyCellValue(cellValue);
    const { allowBlank = true, operator } = rule;
    if (isEmpty) {
      return allowBlank;
    }
    const formulaInfo = await this.parseFormula(rule, unitId, subUnitId, cellInfo.row, cellInfo.column);
    if (!formulaInfo.isFormulaValid) {
      return false;
    }
    if (!await this.isValidType(cellInfo, formulaInfo, rule)) {
      return false;
    }
    if (!operator) {
      return true;
    }
    const transformedCell = this.transform(cellInfo, formulaInfo, rule);
    switch (operator) {
      case "between" /* BETWEEN */:
        return this.validatorIsBetween(transformedCell, formulaInfo, rule);
      case "equal" /* EQUAL */:
        return this.validatorIsEqual(transformedCell, formulaInfo, rule);
      case "greaterThan" /* GREATER_THAN */:
        return this.validatorIsGreaterThan(transformedCell, formulaInfo, rule);
      case "greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */:
        return this.validatorIsGreaterThanOrEqual(transformedCell, formulaInfo, rule);
      case "lessThan" /* LESS_THAN */:
        return this.validatorIsLessThan(transformedCell, formulaInfo, rule);
      case "lessThanOrEqual" /* LESS_THAN_OR_EQUAL */:
        return this.validatorIsLessThanOrEqual(transformedCell, formulaInfo, rule);
      case "notBetween" /* NOT_BETWEEN */:
        return this.validatorIsNotBetween(transformedCell, formulaInfo, rule);
      case "notEqual" /* NOT_EQUAL */:
        return this.validatorIsNotEqual(transformedCell, formulaInfo, rule);
      default:
        throw new Error("Unknown operator.");
    }
  }
};
BaseDataValidator = __decorateClass([
  __decorateParam(0, Inject(LocaleService)),
  __decorateParam(1, Inject(Injector))
], BaseDataValidator);

// ../packages/sheets-data-validation/src/services/dv-cache.service.ts
var DataValidationCacheService = class extends Disposable {
  constructor(_commandService, _univerInstanceService, _sheetDataValidationModel) {
    super();
    this._commandService = _commandService;
    this._univerInstanceService = _univerInstanceService;
    this._sheetDataValidationModel = _sheetDataValidationModel;
    __publicField(this, "_cacheMatrix", /* @__PURE__ */ new Map());
    __publicField(this, "_dirtyRanges$", new Subject());
    __publicField(this, "dirtyRanges$", this._dirtyRanges$.asObservable());
    this._initDirtyRanges();
    this._initSheetRemove();
  }
  _initDirtyRanges() {
    this.disposeWithMe(this._commandService.onCommandExecuted((commandInfo, options) => {
      if (commandInfo.id === SetRangeValuesMutation.id && !(options == null ? void 0 : options.onlyLocal)) {
        const { cellValue, unitId, subUnitId } = commandInfo.params;
        if (cellValue) {
          const range = new ObjectMatrix(cellValue).getDataRange();
          if (range.endRow === -1) return;
          const rules = this._sheetDataValidationModel.getRules(unitId, subUnitId);
          const ranges = rules.map((rule) => rule.ranges).flat();
          const intersectsRanges = ranges.map((ruleRange) => getIntersectRange(ruleRange, range)).filter(Boolean);
          if (intersectsRanges.length) {
            this.markRangeDirty(unitId, subUnitId, intersectsRanges, true);
          }
        }
      }
    }));
  }
  _initSheetRemove() {
    this.disposeWithMe(this._commandService.onCommandExecuted((commandInfo) => {
      var _a;
      if (commandInfo.id === RemoveSheetMutation.id) {
        const { unitId, subUnitId } = commandInfo.params;
        (_a = this._cacheMatrix.get(unitId)) == null ? void 0 : _a.delete(subUnitId);
      }
    }));
    this.disposeWithMe(this._univerInstanceService.unitDisposed$.subscribe((univerInstance) => {
      if (univerInstance.type === O.UNIVER_SHEET) {
        this._cacheMatrix.delete(univerInstance.getUnitId());
      }
    }));
  }
  _ensureCache(unitId, subUnitId) {
    let unitMap = this._cacheMatrix.get(unitId);
    if (!unitMap) {
      unitMap = /* @__PURE__ */ new Map();
      this._cacheMatrix.set(unitId, unitMap);
    }
    let cacheMatrix = unitMap.get(subUnitId);
    if (!cacheMatrix) {
      cacheMatrix = new ObjectMatrix();
      unitMap.set(subUnitId, cacheMatrix);
    }
    return cacheMatrix;
  }
  ensureCache(unitId, subUnitId) {
    return this._ensureCache(unitId, subUnitId);
  }
  addRule(unitId, subUnitId, rule) {
    this.markRangeDirty(unitId, subUnitId, rule.ranges);
  }
  removeRule(unitId, subUnitId, rule) {
    this._deleteRange(unitId, subUnitId, rule.ranges);
  }
  markRangeDirty(unitId, subUnitId, ranges, isSetRange) {
    const cache = this._ensureCache(unitId, subUnitId);
    ranges.forEach((range) => {
      Range.foreach(range, (row, col) => {
        if (cache.getValue(row, col) !== void 0) {
          cache.setValue(row, col, void 0);
        }
      });
    });
    this._dirtyRanges$.next({ unitId, subUnitId, ranges, isSetRange });
  }
  _deleteRange(unitId, subUnitId, ranges) {
    const cache = this._ensureCache(unitId, subUnitId);
    ranges.forEach((range) => {
      Range.foreach(range, (row, col) => {
        cache.realDeleteValue(row, col);
      });
    });
    this._dirtyRanges$.next({ unitId, subUnitId, ranges });
  }
  getValue(unitId, subUnitId, row, col) {
    const cache = this._ensureCache(unitId, subUnitId);
    return cache.getValue(row, col);
  }
};
DataValidationCacheService = __decorateClass([
  __decorateParam(0, Inject(ICommandService)),
  __decorateParam(1, Inject(IUniverInstanceService)),
  __decorateParam(2, Inject(DataValidationModel))
], DataValidationCacheService);

// ../packages/sheets-data-validation/src/utils/formula.ts
function getFormulaResult(result) {
  var _a, _b;
  return (_b = (_a = result == null ? void 0 : result[0]) == null ? void 0 : _a[0]) == null ? void 0 : _b.v;
}
function getFormulaCellData(result) {
  var _a;
  return (_a = result == null ? void 0 : result[0]) == null ? void 0 : _a[0];
}
function isLegalFormulaResult(res) {
  return !ERROR_TYPE_SET.has(res);
}
function shouldOffsetFormulaByRange(type, validatorRegistryService) {
  var _a;
  const validator = validatorRegistryService.getValidatorItem(type);
  return (_a = validator == null ? void 0 : validator.offsetFormulaByRange) != null ? _a : false;
}

// ../packages/sheets-data-validation/src/services/dv-custom-formula.service.ts
var DataValidationCustomFormulaService = class extends Disposable {
  constructor(_instanceSrv, _registerOtherFormulaService, _dataValidationModel, _dataValidationCacheService, _validatorRegistryService) {
    super();
    this._instanceSrv = _instanceSrv;
    this._registerOtherFormulaService = _registerOtherFormulaService;
    this._dataValidationModel = _dataValidationModel;
    this._dataValidationCacheService = _dataValidationCacheService;
    this._validatorRegistryService = _validatorRegistryService;
    /**
     * Map of origin formula of rule
     */
    __publicField(this, "_ruleFormulaMap", /* @__PURE__ */ new Map());
    __publicField(this, "_ruleFormulaMap2", /* @__PURE__ */ new Map());
    this._initFormulaResultHandler();
    this._initDirtyRanges();
  }
  dispose() {
    super.dispose();
    this._ruleFormulaMap.clear();
    this._ruleFormulaMap2.clear();
  }
  _initFormulaResultHandler() {
    this.disposeWithMe(this._registerOtherFormulaService.formulaResult$.subscribe((resultMap) => {
      for (const unitId in resultMap) {
        const unitMap = resultMap[unitId];
        const type = this._instanceSrv.getUnitType(unitId);
        if (type !== O.UNIVER_SHEET) continue;
        for (const subUnitId in unitMap) {
          const results = unitMap[subUnitId];
          const { ruleFormulaMap } = this._ensureMaps(unitId, subUnitId);
          results.forEach((result) => {
            var _a, _b;
            const ruleInfo = ruleFormulaMap.get((_a = result.extra) == null ? void 0 : _a.ruleId);
            const rule = this._dataValidationModel.getRuleById(unitId, subUnitId, (_b = result.extra) == null ? void 0 : _b.ruleId);
            if (rule && ruleInfo) {
              this._dataValidationCacheService.markRangeDirty(unitId, subUnitId, rule.ranges);
            }
          });
        }
      }
    }));
  }
  _ensureMaps(unitId, subUnitId) {
    let ruleFormulaUnitMap = this._ruleFormulaMap.get(unitId);
    let ruleFormulaUnitMap2 = this._ruleFormulaMap2.get(unitId);
    if (!ruleFormulaUnitMap) {
      ruleFormulaUnitMap = /* @__PURE__ */ new Map();
      this._ruleFormulaMap.set(unitId, ruleFormulaUnitMap);
    }
    if (!ruleFormulaUnitMap2) {
      ruleFormulaUnitMap2 = /* @__PURE__ */ new Map();
      this._ruleFormulaMap2.set(unitId, ruleFormulaUnitMap2);
    }
    let ruleFormulaMap = ruleFormulaUnitMap.get(subUnitId);
    if (!ruleFormulaMap) {
      ruleFormulaMap = /* @__PURE__ */ new Map();
      ruleFormulaUnitMap.set(subUnitId, ruleFormulaMap);
    }
    let ruleFormulaMap2 = ruleFormulaUnitMap2.get(subUnitId);
    if (!ruleFormulaMap2) {
      ruleFormulaMap2 = /* @__PURE__ */ new Map();
      ruleFormulaUnitMap2.set(subUnitId, ruleFormulaMap2);
    }
    return { ruleFormulaMap, ruleFormulaMap2 };
  }
  _registerFormula(unitId, subUnitId, ruleId, formulaString, ranges) {
    return this._registerOtherFormulaService.registerFormulaWithRange(unitId, subUnitId, formulaString, ranges, { ruleId });
  }
  _handleDirtyRanges(unitId, subUnitId, ranges) {
    const rules = this._dataValidationModel.getRules(unitId, subUnitId);
    rules.forEach((rule) => {
      const ruleRanges = rule.ranges;
      const hasOverLap = Rectangle.doAnyRangesIntersect(ruleRanges, ranges);
      if (hasOverLap) {
        this.makeRuleDirty(unitId, subUnitId, rule.uid);
      }
    });
  }
  _initDirtyRanges() {
    this.disposeWithMe(this._dataValidationCacheService.dirtyRanges$.subscribe((data) => {
      if (data.isSetRange) {
        this._handleDirtyRanges(data.unitId, data.subUnitId, data.ranges);
      }
    }));
  }
  deleteByRuleId(unitId, subUnitId, ruleId) {
    const { ruleFormulaMap, ruleFormulaMap2 } = this._ensureMaps(unitId, subUnitId);
    const rule = this._dataValidationModel.getRuleById(unitId, subUnitId, ruleId);
    const formulaInfo = ruleFormulaMap.get(ruleId);
    if (!rule || !formulaInfo) {
      return;
    }
    const current = ruleFormulaMap.get(ruleId);
    if (current) {
      ruleFormulaMap.delete(ruleId);
      this._registerOtherFormulaService.deleteFormula(unitId, subUnitId, [current.formulaId]);
    }
    const current2 = ruleFormulaMap2.get(ruleId);
    if (current2) {
      ruleFormulaMap2.delete(ruleId);
      this._registerOtherFormulaService.deleteFormula(unitId, subUnitId, [current2.formulaId]);
    }
  }
  _addFormulaByRange(unitId, subUnitId, ruleId, formula, formula2, ranges) {
    const { ruleFormulaMap, ruleFormulaMap2 } = this._ensureMaps(unitId, subUnitId);
    const originRow = ranges[0].startRow;
    const originCol = ranges[0].startColumn;
    if (formula && isFormulaString(formula)) {
      const formulaId = this._registerFormula(unitId, subUnitId, ruleId, formula, ranges);
      ruleFormulaMap.set(ruleId, {
        formula,
        originCol,
        originRow,
        formulaId
      });
    }
    if (formula2 && isFormulaString(formula2)) {
      const formulaId2 = this._registerFormula(unitId, subUnitId, ruleId, formula2, ranges);
      ruleFormulaMap2.set(ruleId, {
        formula: formula2,
        originCol,
        originRow,
        formulaId: formulaId2
      });
    }
  }
  addRule(unitId, subUnitId, rule) {
    if (shouldOffsetFormulaByRange(rule.type, this._validatorRegistryService)) {
      const { ranges, formula1, formula2, uid: ruleId } = rule;
      this._addFormulaByRange(unitId, subUnitId, ruleId, formula1, formula2, ranges);
    }
  }
  async getCellFormulaValue(unitId, subUnitId, ruleId, row, column) {
    var _a, _b;
    const { ruleFormulaMap } = this._ensureMaps(unitId, subUnitId);
    const current = ruleFormulaMap.get(ruleId);
    if (!current) {
      return Promise.resolve(void 0);
    }
    const result = await this._registerOtherFormulaService.getFormulaValue(unitId, subUnitId, current.formulaId);
    const { originRow, originCol } = current;
    const offsetRow = row - originRow;
    const offsetCol = column - originCol;
    return getFormulaCellData((_b = (_a = result == null ? void 0 : result.result) == null ? void 0 : _a[offsetRow]) == null ? void 0 : _b[offsetCol]);
  }
  async getCellFormula2Value(unitId, subUnitId, ruleId, row, column) {
    var _a, _b;
    const { ruleFormulaMap2 } = this._ensureMaps(unitId, subUnitId);
    const current = ruleFormulaMap2.get(ruleId);
    if (!current) {
      return Promise.resolve(void 0);
    }
    const result = await this._registerOtherFormulaService.getFormulaValue(unitId, subUnitId, current.formulaId);
    const { originRow, originCol } = current;
    const offsetRow = row - originRow;
    const offsetCol = column - originCol;
    return getFormulaCellData((_b = (_a = result == null ? void 0 : result.result) == null ? void 0 : _a[offsetRow]) == null ? void 0 : _b[offsetCol]);
  }
  getCellFormulaValueSync(unitId, subUnitId, ruleId, row, column) {
    var _a, _b;
    const { ruleFormulaMap } = this._ensureMaps(unitId, subUnitId);
    const current = ruleFormulaMap.get(ruleId);
    if (!current) {
      return void 0;
    }
    const result = this._registerOtherFormulaService.getFormulaValueSync(unitId, subUnitId, current.formulaId);
    const { originRow, originCol } = current;
    const offsetRow = row - originRow;
    const offsetCol = column - originCol;
    return getFormulaCellData((_b = (_a = result == null ? void 0 : result.result) == null ? void 0 : _a[offsetRow]) == null ? void 0 : _b[offsetCol]);
  }
  getCellFormula2ValueSync(unitId, subUnitId, ruleId, row, column) {
    var _a, _b;
    const { ruleFormulaMap2 } = this._ensureMaps(unitId, subUnitId);
    const current = ruleFormulaMap2.get(ruleId);
    if (!current) {
      return void 0;
    }
    const result = this._registerOtherFormulaService.getFormulaValueSync(unitId, subUnitId, current.formulaId);
    const { originRow, originCol } = current;
    const offsetRow = row - originRow;
    const offsetCol = column - originCol;
    return getFormulaCellData((_b = (_a = result == null ? void 0 : result.result) == null ? void 0 : _a[offsetRow]) == null ? void 0 : _b[offsetCol]);
  }
  getRuleFormulaInfo(unitId, subUnitId, ruleId) {
    const { ruleFormulaMap } = this._ensureMaps(unitId, subUnitId);
    return ruleFormulaMap.get(ruleId);
  }
  makeRuleDirty(unitId, subUnitId, ruleId) {
    var _a, _b, _c, _d;
    const formula1 = (_b = (_a = this._ruleFormulaMap.get(unitId)) == null ? void 0 : _a.get(subUnitId)) == null ? void 0 : _b.get(ruleId);
    const formula2 = (_d = (_c = this._ruleFormulaMap2.get(unitId)) == null ? void 0 : _c.get(subUnitId)) == null ? void 0 : _d.get(ruleId);
    if (formula1) {
      this._registerOtherFormulaService.markFormulaDirty(unitId, subUnitId, formula1.formulaId);
    }
    if (formula2) {
      this._registerOtherFormulaService.markFormulaDirty(unitId, subUnitId, formula2.formulaId);
    }
  }
};
DataValidationCustomFormulaService = __decorateClass([
  __decorateParam(0, IUniverInstanceService),
  __decorateParam(1, Inject(RegisterOtherFormulaService)),
  __decorateParam(2, Inject(DataValidationModel)),
  __decorateParam(3, Inject(DataValidationCacheService)),
  __decorateParam(4, Inject(DataValidatorRegistryService))
], DataValidationCustomFormulaService);

// ../packages/sheets-data-validation/src/utils/get-cell-data-origin.ts
function getCellValueOrigin(cell) {
  return getOriginCellValue(cell);
}
function getStringCellValue(cell) {
  var _a;
  return String((_a = getCellValueOrigin(cell)) != null ? _a : "");
}

// ../packages/sheets-data-validation/src/validators/util.ts
function serializeListOptions(options) {
  return options.filter(Boolean).join(",");
}
function deserializeListOptions(optionsStr) {
  return optionsStr.split(",").filter(Boolean);
}
function getDataValidationCellValue(cellData) {
  const cellValue = getCellValueOrigin(cellData);
  if (cellValue === void 0 || cellValue === null) {
    return "";
  }
  return cellValue.toString();
}
function getTransformedFormula(lexerTreeBuilder, rule, position) {
  const { formula1, formula2 } = rule;
  const originStartRow = rule.ranges[0].startRow;
  const originStartColumn = rule.ranges[0].startColumn;
  const offsetRow = position.row - originStartRow;
  const offsetColumn = position.col - originStartColumn;
  const transformedFormula1 = isFormulaString(formula1) ? lexerTreeBuilder.moveFormulaRefOffset(formula1, offsetColumn, offsetRow, true) : formula1;
  const transformedFormula2 = isFormulaString(formula2) ? lexerTreeBuilder.moveFormulaRefOffset(formula2, offsetColumn, offsetRow, true) : formula2;
  return {
    transformedFormula1,
    transformedFormula2
  };
}

// ../packages/sheets-data-validation/src/services/dv-list-cache.service.ts
var DataValidationListCacheService = class extends Disposable {
  constructor(_injector, _dataValidationModel) {
    super();
    this._injector = _injector;
    this._dataValidationModel = _dataValidationModel;
    // Cache structure: unitId -> subUnitId -> ruleId -> cache item
    __publicField(this, "_cache", /* @__PURE__ */ new Map());
    this._initRuleChangeListener();
  }
  _initRuleChangeListener() {
    this.disposeWithMe(
      this._dataValidationModel.ruleChange$.subscribe((change) => {
        if (change.type === "remove" || change.type === "update") {
          this.markRuleDirty(change.unitId, change.subUnitId, change.rule.uid);
        }
      })
    );
  }
  /**
   * Get cached list data or compute and cache it if not exists.
   */
  getOrCompute(unitId, subUnitId, rule) {
    const cached = this.getCache(unitId, subUnitId, rule.uid);
    if (cached) {
      return cached;
    }
    const formulaService = this._injector.get(DataValidationFormulaService);
    const results = formulaService.getRuleFormulaResultSync(unitId, subUnitId, rule.uid);
    return this.computeAndCache(unitId, subUnitId, rule, results);
  }
  _ensureCache(unitId, subUnitId) {
    let unitMap = this._cache.get(unitId);
    if (!unitMap) {
      unitMap = /* @__PURE__ */ new Map();
      this._cache.set(unitId, unitMap);
    }
    let subUnitMap = unitMap.get(subUnitId);
    if (!subUnitMap) {
      subUnitMap = /* @__PURE__ */ new Map();
      unitMap.set(subUnitId, subUnitMap);
    }
    return subUnitMap;
  }
  /**
   * Get cached list data for a rule. Returns undefined if not cached.
   */
  getCache(unitId, subUnitId, ruleId) {
    var _a, _b;
    return (_b = (_a = this._cache.get(unitId)) == null ? void 0 : _a.get(subUnitId)) == null ? void 0 : _b.get(ruleId);
  }
  /**
   * Set cache for a rule.
   */
  setCache(unitId, subUnitId, ruleId, item) {
    const cache = this._ensureCache(unitId, subUnitId);
    cache.set(ruleId, item);
  }
  /**
   * Mark a rule's cache as dirty (invalidate it).
   * Called when formula results change.
   */
  markRuleDirty(unitId, subUnitId, ruleId) {
    var _a, _b;
    (_b = (_a = this._cache.get(unitId)) == null ? void 0 : _a.get(subUnitId)) == null ? void 0 : _b.delete(ruleId);
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
  computeAndCache(unitId, subUnitId, rule, formulaResult) {
    var _a, _b, _c;
    const { formula1 = "", formula2 = "" } = rule;
    const list = isFormulaString(formula1) ? this._getRuleFormulaResultSet((_c = (_b = (_a = formulaResult == null ? void 0 : formulaResult[0]) == null ? void 0 : _a.result) == null ? void 0 : _b[0]) == null ? void 0 : _c[0]) : deserializeListOptions(formula1);
    const colorList = formula2.split(",");
    const listWithColor = list.map((label, i) => ({ label, color: colorList[i] || "" }));
    const colorMap = {};
    for (const item of listWithColor) {
      if (item.color) {
        colorMap[item.label] = item.color;
      }
    }
    const set = new Set(list);
    const cacheItem = { list, listWithColor, colorMap, set };
    this.setCache(unitId, subUnitId, rule.uid, cacheItem);
    return cacheItem;
  }
  /**
   * Extract string list from formula result cells.
   */
  _getRuleFormulaResultSet(result) {
    var _a, _b;
    if (!result) {
      return [];
    }
    const resultSet = /* @__PURE__ */ new Set();
    for (let i = 0, rowLen = result.length; i < rowLen; i++) {
      const row = result[i];
      if (!row) continue;
      for (let j = 0, colLen = row.length; j < colLen; j++) {
        const cell = row[j];
        const value = getCellValueOrigin(cell);
        if (value !== null && value !== void 0) {
          if (typeof value !== "string" && typeof (cell == null ? void 0 : cell.s) === "object" && ((_b = (_a = cell.s) == null ? void 0 : _a.n) == null ? void 0 : _b.pattern)) {
            resultSet.add(lib_exports.format(cell.s.n.pattern, value, { throws: false }));
            continue;
          }
          const valueStr = typeof value === "string" ? value : String(value);
          if (isLegalFormulaResult(valueStr)) {
            resultSet.add(valueStr);
          }
        }
      }
    }
    return [...resultSet];
  }
};
DataValidationListCacheService = __decorateClass([
  __decorateParam(0, Inject(Injector)),
  __decorateParam(1, Inject(DataValidationModel))
], DataValidationListCacheService);

// ../packages/sheets-data-validation/src/services/dv-formula.service.ts
var DataValidationFormulaService = class extends Disposable {
  constructor(_instanceService, _registerOtherFormulaService, _dataValidationCacheService, _dataValidationModel, _validatorRegistryService, _listCacheService) {
    super();
    this._instanceService = _instanceService;
    this._registerOtherFormulaService = _registerOtherFormulaService;
    this._dataValidationCacheService = _dataValidationCacheService;
    this._dataValidationModel = _dataValidationModel;
    this._validatorRegistryService = _validatorRegistryService;
    this._listCacheService = _listCacheService;
    __publicField(this, "_formulaRuleMap", /* @__PURE__ */ new Map());
    this._initFormulaResultHandler();
  }
  _initFormulaResultHandler() {
    this.disposeWithMe(this._registerOtherFormulaService.formulaResult$.subscribe((resultMap) => {
      for (const unitId in resultMap) {
        const unitMap = resultMap[unitId];
        const type = this._instanceService.getUnitType(unitId);
        if (type !== O.UNIVER_SHEET) continue;
        for (const subUnitId in unitMap) {
          const results = unitMap[subUnitId];
          const formulaMap = this._ensureRuleFormulaMap(unitId, subUnitId);
          results.forEach((result) => {
            var _a;
            const ruleId = (_a = result.extra) == null ? void 0 : _a.ruleId;
            if (ruleId && formulaMap.get(ruleId)) {
              const rule = this._dataValidationModel.getRuleById(unitId, subUnitId, ruleId);
              if (rule) {
                this._listCacheService.markRuleDirty(unitId, subUnitId, ruleId);
                this._dataValidationCacheService.markRangeDirty(unitId, subUnitId, rule.ranges);
              }
            }
          });
        }
      }
    }));
  }
  _ensureRuleFormulaMap(unitId, subUnitId) {
    let unitMap = this._formulaRuleMap.get(unitId);
    if (!unitMap) {
      unitMap = /* @__PURE__ */ new Map();
      this._formulaRuleMap.set(unitId, unitMap);
    }
    let subUnitMap = unitMap.get(subUnitId);
    if (!subUnitMap) {
      subUnitMap = /* @__PURE__ */ new Map();
      unitMap.set(subUnitId, subUnitMap);
    }
    return subUnitMap;
  }
  _registerSingleFormula(unitId, subUnitId, formula, ruleId) {
    const ranges = [{ startColumn: 0, endColumn: 0, startRow: 0, endRow: 0 }];
    return this._registerOtherFormulaService.registerFormulaWithRange(unitId, subUnitId, formula, ranges, { ruleId });
  }
  addRule(unitId, subUnitId, rule) {
    if (!shouldOffsetFormulaByRange(rule.type, this._validatorRegistryService) && rule.type !== "checkbox" /* CHECKBOX */) {
      const { formula1, formula2, uid: ruleId } = rule;
      const isFormula1Legal = isFormulaString(formula1);
      const isFormula2Legal = isFormulaString(formula2);
      if (!isFormula1Legal && !isFormula2Legal) {
        return;
      }
      const formulaRuleMap = this._ensureRuleFormulaMap(unitId, subUnitId);
      const item = [void 0, void 0];
      if (isFormula1Legal) {
        const id = this._registerSingleFormula(unitId, subUnitId, formula1, ruleId);
        item[0] = { id, text: formula1 };
      }
      if (isFormula2Legal) {
        const id = this._registerSingleFormula(unitId, subUnitId, formula2, ruleId);
        item[1] = { id, text: formula2 };
      }
      formulaRuleMap.set(ruleId, item);
    }
  }
  removeRule(unitId, subUnitId, ruleId) {
    const formulaRuleMap = this._ensureRuleFormulaMap(unitId, subUnitId);
    const item = formulaRuleMap.get(ruleId);
    if (!item) {
      return;
    }
    const [formula1, formula2] = item;
    const idList = [formula1 == null ? void 0 : formula1.id, formula2 == null ? void 0 : formula2.id].filter(Boolean);
    idList.length && this._registerOtherFormulaService.deleteFormula(unitId, subUnitId, idList);
  }
  getRuleFormulaResult(unitId, subUnitId, ruleId) {
    const ruleFormulaMap = this._ensureRuleFormulaMap(unitId, subUnitId);
    const formulaInfo = ruleFormulaMap.get(ruleId);
    if (!formulaInfo) {
      return Promise.resolve(null);
    }
    const getResult = async (info) => info && this._registerOtherFormulaService.getFormulaValue(unitId, subUnitId, info.id);
    return Promise.all([
      getResult(formulaInfo[0]),
      getResult(formulaInfo[1])
    ]);
  }
  getRuleFormulaResultSync(unitId, subUnitId, ruleId) {
    const ruleFormulaMap = this._ensureRuleFormulaMap(unitId, subUnitId);
    const formulaInfo = ruleFormulaMap.get(ruleId);
    if (!formulaInfo) {
      return void 0;
    }
    return formulaInfo.map((i) => {
      if (i) {
        return this._registerOtherFormulaService.getFormulaValueSync(unitId, subUnitId, i.id);
      }
      return void 0;
    });
  }
  getRuleFormulaInfo(unitId, subUnitId, ruleId) {
    const ruleFormulaMap = this._ensureRuleFormulaMap(unitId, subUnitId);
    return ruleFormulaMap.get(ruleId);
  }
};
DataValidationFormulaService = __decorateClass([
  __decorateParam(0, IUniverInstanceService),
  __decorateParam(1, Inject(RegisterOtherFormulaService)),
  __decorateParam(2, Inject(DataValidationCacheService)),
  __decorateParam(3, Inject(DataValidationModel)),
  __decorateParam(4, Inject(DataValidatorRegistryService)),
  __decorateParam(5, Inject(DataValidationListCacheService))
], DataValidationFormulaService);

// ../packages/sheets-data-validation/src/models/rule-matrix.ts
var RuleMatrix = class _RuleMatrix {
  constructor(value, _unitId, _subUnitId, _univerInstanceService, _disableTree = false) {
    this._unitId = _unitId;
    this._subUnitId = _subUnitId;
    this._univerInstanceService = _univerInstanceService;
    this._disableTree = _disableTree;
    __publicField(this, "_map");
    __publicField(this, "_tree", new RBush());
    __publicField(this, "_dirty", true);
    __publicField(this, "_buildTree", () => {
      if (!this._dirty || this._disableTree) {
        return;
      }
      this._tree.clear();
      const items = [];
      this._map.forEach((ranges, ruleId) => {
        ranges.forEach((range) => {
          items.push({
            minX: range.startRow,
            maxX: range.endRow,
            minY: range.startColumn,
            maxY: range.endColumn,
            ruleId
          });
        });
      });
      this._tree.load(items);
      this._dirty = false;
    });
    __publicField(this, "_debonceBuildTree", debounce_default(this._buildTree, 0));
    this._map = value;
    this._buildTree();
  }
  get _worksheet() {
    var _a;
    return (_a = this._univerInstanceService.getUnit(this._unitId, O.UNIVER_SHEET)) == null ? void 0 : _a.getSheetBySheetId(this._subUnitId);
  }
  _addRule(ruleId, _ranges) {
    if (!this._worksheet) {
      return;
    }
    const ranges = Rectangle.mergeRanges(_ranges.map((range) => Range.transformRange(range, this._worksheet)));
    this._map.forEach((value, key) => {
      const newRanges = Rectangle.subtractMulti(value, ranges);
      if (newRanges.length === 0) {
        this._map.delete(key);
      } else {
        this._map.set(key, newRanges);
      }
    });
    this._dirty = true;
    this._map.set(ruleId, ranges);
    this._debonceBuildTree();
  }
  addRule(rule) {
    this._addRule(rule.uid, rule.ranges);
  }
  removeRange(_ranges) {
    if (!this._worksheet) {
      return;
    }
    const ranges = _ranges.map((range) => Range.transformRange(range, this._worksheet));
    this._map.forEach((value, key) => {
      const newRanges = Rectangle.subtractMulti(value, ranges);
      if (newRanges.length === 0) {
        this._map.delete(key);
      } else {
        this._map.set(key, newRanges);
      }
    });
    this._dirty = true;
    this._debonceBuildTree();
  }
  _removeRule(ruleId) {
    this._map.delete(ruleId);
    this._dirty = true;
    this._debonceBuildTree();
  }
  removeRule(rule) {
    this._removeRule(rule.uid);
  }
  updateRange(ruleId, _newRanges) {
    this._removeRule(ruleId);
    this._addRule(ruleId, _newRanges);
  }
  addRangeRules(rules) {
    rules.forEach(({ id: ruleId, ranges }) => {
      if (!ranges.length) {
        return;
      }
      let current = this._map.get(ruleId);
      if (!current) {
        current = ranges;
        this._map.set(ruleId, current);
      } else {
        this._map.set(ruleId, Rectangle.mergeRanges([...current, ...ranges]));
        current = this._map.get(ruleId);
      }
      this._map.forEach((value, key) => {
        if (key === ruleId) {
          return;
        }
        const newRanges = Rectangle.subtractMulti(value, ranges);
        if (newRanges.length === 0) {
          this._map.delete(key);
        } else {
          this._map.set(key, newRanges);
        }
      });
    });
    this._dirty = true;
    this._debonceBuildTree();
  }
  diff(rules) {
    const mutations = [];
    let deleteIndex = 0;
    rules.forEach((rule, index) => {
      var _a;
      const newRanges = (_a = this._map.get(rule.uid)) != null ? _a : [];
      const oldRanges = rule.ranges;
      if (newRanges.length !== 0 && (newRanges.length !== oldRanges.length || newRanges.some((range, i) => !Rectangle.equals(range, oldRanges[i])))) {
        mutations.push({
          type: "update",
          ruleId: rule.uid,
          oldRanges,
          newRanges: Rectangle.sort(newRanges),
          rule
        });
      }
      if (newRanges.length === 0) {
        mutations.push({
          type: "delete",
          rule,
          index: index - deleteIndex
        });
        deleteIndex++;
      }
    });
    return mutations;
  }
  diffWithAddition(rules, additionRules) {
    const mutations = [];
    let deleteIndex = 0;
    rules.forEach((rule, index) => {
      var _a;
      const newRanges = (_a = this._map.get(rule.uid)) != null ? _a : [];
      const oldRanges = rule.ranges;
      if (newRanges.length !== 0 && (newRanges.length !== oldRanges.length || newRanges.some((range, i) => !Rectangle.equals(range, oldRanges[i])))) {
        mutations.push({
          type: "update",
          ruleId: rule.uid,
          oldRanges,
          newRanges: Rectangle.sort(newRanges),
          rule
        });
      }
      if (newRanges.length === 0) {
        mutations.push({
          type: "delete",
          rule,
          index: index - deleteIndex
        });
        deleteIndex++;
      }
    });
    Array.from(additionRules).forEach((rule) => {
      var _a;
      const newRanges = (_a = this._map.get(rule.uid)) != null ? _a : [];
      mutations.push({
        type: "add",
        rule: {
          ...rule,
          ranges: Rectangle.sort(newRanges)
        }
      });
    });
    return mutations;
  }
  clone() {
    return new _RuleMatrix(
      new Map(Tools.deepClone(Array.from(this._map.entries()))),
      this._unitId,
      this._subUnitId,
      this._univerInstanceService,
      // disable tree on cloned matrix, cause there is no need to search
      true
    );
  }
  getValue(row, col) {
    if (this._dirty) {
      this._buildTree();
    }
    const result = this._tree.search({
      minX: row,
      maxX: row,
      minY: col,
      maxY: col
    });
    return result.length > 0 ? result[0].ruleId : void 0;
  }
};

// ../packages/sheets-data-validation/src/models/sheet-data-validation-model.ts
var SheetDataValidationModel = class extends Disposable {
  constructor(_dataValidationModel, _univerInstanceService, _dataValidatorRegistryService, _dataValidationCacheService, _dataValidationFormulaService, _dataValidationCustomFormulaService, _commandService) {
    super();
    this._dataValidationModel = _dataValidationModel;
    this._univerInstanceService = _univerInstanceService;
    this._dataValidatorRegistryService = _dataValidatorRegistryService;
    this._dataValidationCacheService = _dataValidationCacheService;
    this._dataValidationFormulaService = _dataValidationFormulaService;
    this._dataValidationCustomFormulaService = _dataValidationCustomFormulaService;
    this._commandService = _commandService;
    __publicField(this, "_ruleMatrixMap", /* @__PURE__ */ new Map());
    __publicField(this, "_validStatusChange$", new Subject());
    __publicField(this, "_ruleChange$", new Subject());
    __publicField(this, "ruleChange$", this._ruleChange$.asObservable());
    __publicField(this, "validStatusChange$", this._validStatusChange$.asObservable());
    this._initRuleUpdateListener();
    this.disposeWithMe(() => {
      this._ruleChange$.complete();
      this._validStatusChange$.complete();
    });
    this._initUniverInstanceListener();
  }
  _initUniverInstanceListener() {
    this.disposeWithMe(
      this._univerInstanceService.unitDisposed$.subscribe((unit) => {
        this._ruleMatrixMap.delete(unit.getUnitId());
      })
    );
    this.disposeWithMe(
      this._commandService.onCommandExecuted((command) => {
        if (command.id === RemoveSheetMutation.id) {
          const { unitId, subUnitId } = command.params;
          const subUnitMap = this._ruleMatrixMap.get(unitId);
          if (subUnitMap) {
            subUnitMap.delete(subUnitId);
          }
        }
      })
    );
  }
  _initRuleUpdateListener() {
    const allRules = this._dataValidationModel.getAll();
    for (const [unitId, subUnitMap] of allRules) {
      for (const [subUnitId, rules] of subUnitMap) {
        for (const rule of rules) {
          this._addRule(unitId, subUnitId, rule);
          this._ruleChange$.next({
            type: "add",
            unitId,
            subUnitId,
            rule,
            source: "patched"
          });
        }
      }
    }
    this.disposeWithMe(
      this._dataValidationModel.ruleChange$.subscribe((ruleChange) => {
        switch (ruleChange.type) {
          case "add":
            this._addRule(ruleChange.unitId, ruleChange.subUnitId, ruleChange.rule);
            break;
          case "update":
            this._updateRule(ruleChange.unitId, ruleChange.subUnitId, ruleChange.rule.uid, ruleChange.oldRule, ruleChange.updatePayload);
            break;
          case "remove":
            this._removeRule(ruleChange.unitId, ruleChange.subUnitId, ruleChange.rule);
            break;
        }
        this._ruleChange$.next(ruleChange);
      })
    );
  }
  _ensureRuleMatrix(unitId, subUnitId) {
    let unitMap = this._ruleMatrixMap.get(unitId);
    if (!unitMap) {
      unitMap = /* @__PURE__ */ new Map();
      this._ruleMatrixMap.set(unitId, unitMap);
    }
    let matrix = unitMap.get(subUnitId);
    if (!matrix) {
      matrix = new RuleMatrix(/* @__PURE__ */ new Map(), unitId, subUnitId, this._univerInstanceService);
      unitMap.set(subUnitId, matrix);
    }
    return matrix;
  }
  _addRuleSideEffect(unitId, subUnitId, rule) {
    const ruleMatrix = this._ensureRuleMatrix(unitId, subUnitId);
    ruleMatrix.addRule(rule);
    this._dataValidationCacheService.addRule(unitId, subUnitId, rule);
    this._dataValidationFormulaService.addRule(unitId, subUnitId, rule);
    this._dataValidationCustomFormulaService.addRule(unitId, subUnitId, rule);
  }
  _addRule(unitId, subUnitId, rule) {
    const rules = Array.isArray(rule) ? rule : [rule];
    rules.forEach((item) => {
      this._addRuleSideEffect(unitId, subUnitId, item);
    });
  }
  _updateRule(unitId, subUnitId, ruleId, oldRule, payload) {
    const ruleMatrix = this._ensureRuleMatrix(unitId, subUnitId);
    const newRule = {
      ...oldRule,
      ...payload.payload
    };
    if (payload.type === 1 /* RANGE */) {
      ruleMatrix.updateRange(ruleId, payload.payload);
    } else if (payload.type === 3 /* ALL */) {
      ruleMatrix.updateRange(ruleId, payload.payload.ranges);
    }
    this._dataValidationCacheService.removeRule(unitId, subUnitId, oldRule);
    this._dataValidationCacheService.addRule(unitId, subUnitId, newRule);
    this._dataValidationFormulaService.removeRule(unitId, subUnitId, oldRule.uid);
    this._dataValidationFormulaService.addRule(unitId, subUnitId, newRule);
    this._dataValidationCustomFormulaService.deleteByRuleId(unitId, subUnitId, ruleId);
    this._dataValidationCustomFormulaService.addRule(unitId, subUnitId, newRule);
  }
  _removeRule(unitId, subUnitId, oldRule) {
    const ruleMatrix = this._ensureRuleMatrix(unitId, subUnitId);
    ruleMatrix.removeRule(oldRule);
    this._dataValidationCacheService.removeRule(unitId, subUnitId, oldRule);
    this._dataValidationCustomFormulaService.deleteByRuleId(unitId, subUnitId, oldRule.uid);
  }
  getValidator(type) {
    return this._dataValidatorRegistryService.getValidatorItem(type);
  }
  getRuleIdByLocation(unitId, subUnitId, row, col) {
    const ruleMatrix = this._ensureRuleMatrix(unitId, subUnitId);
    return ruleMatrix.getValue(row, col);
  }
  getRuleByLocation(unitId, subUnitId, row, col) {
    const ruleId = this.getRuleIdByLocation(unitId, subUnitId, row, col);
    if (!ruleId) {
      return void 0;
    }
    return this._dataValidationModel.getRuleById(unitId, subUnitId, ruleId);
  }
  validator(rule, pos, _onCompete) {
    const { col, row, unitId, subUnitId, worksheet } = pos;
    const onCompete = (status, changed) => {
      if (_onCompete) {
        _onCompete(status, changed);
      }
      if (changed) {
        this._validStatusChange$.next({
          unitId,
          subUnitId,
          ruleId: rule.uid,
          status,
          row,
          col
        });
      }
    };
    const cell = worksheet.getCellValueOnly(row, col);
    const validator = this.getValidator(rule.type);
    const cellRaw = worksheet.getCellRaw(row, col);
    const cellValue = getCellValueOrigin(cellRaw);
    if (validator) {
      const cache = this._dataValidationCacheService.ensureCache(unitId, subUnitId);
      const current = cache.getValue(row, col);
      if (current === null || current === void 0) {
        cache.setValue(row, col, "validating" /* VALIDATING */);
        validator.validator(
          {
            value: cellValue,
            unitId,
            subUnitId,
            row,
            column: col,
            worksheet: pos.worksheet,
            workbook: pos.workbook,
            interceptValue: getCellValueOrigin(cell),
            t: cellRaw == null ? void 0 : cellRaw.t
          },
          rule
        ).then((status) => {
          const realStatus = status ? "valid" /* VALID */ : "invalid" /* INVALID */;
          const now = cache.getValue(row, col);
          if (realStatus === "valid" /* VALID */) {
            cache.realDeleteValue(row, col);
          } else {
            cache.setValue(row, col, realStatus);
          }
          onCompete(realStatus, current !== now);
        });
        return "validating" /* VALIDATING */;
      }
      onCompete(current != null ? current : "valid" /* VALID */, false);
      return current != null ? current : "valid" /* VALID */;
    } else {
      onCompete("valid" /* VALID */, false);
      return "valid" /* VALID */;
    }
  }
  getRuleObjectMatrix(unitId, subUnitId) {
    return this._ensureRuleMatrix(unitId, subUnitId);
  }
  getRuleById(unitId, subUnitId, ruleId) {
    return this._dataValidationModel.getRuleById(unitId, subUnitId, ruleId);
  }
  getRuleIndex(unitId, subUnitId, ruleId) {
    return this._dataValidationModel.getRuleIndex(unitId, subUnitId, ruleId);
  }
  getRules(unitId, subUnitId) {
    return [...this._dataValidationModel.getRules(unitId, subUnitId)];
  }
  getUnitRules(unitId) {
    return this._dataValidationModel.getUnitRules(unitId);
  }
  deleteUnitRules(unitId) {
    return this._dataValidationModel.deleteUnitRules(unitId);
  }
  getSubUnitIds(unitId) {
    return this._dataValidationModel.getSubUnitIds(unitId);
  }
  getAll() {
    return this._dataValidationModel.getAll();
  }
};
SheetDataValidationModel = __decorateClass([
  __decorateParam(0, Inject(DataValidationModel)),
  __decorateParam(1, IUniverInstanceService),
  __decorateParam(2, Inject(DataValidatorRegistryService)),
  __decorateParam(3, Inject(DataValidationCacheService)),
  __decorateParam(4, Inject(DataValidationFormulaService)),
  __decorateParam(5, Inject(DataValidationCustomFormulaService)),
  __decorateParam(6, ICommandService)
], SheetDataValidationModel);

// ../packages/sheets-data-validation/src/validators/checkbox-validator.ts
var CHECKBOX_FORMULA_1 = 1;
var CHECKBOX_FORMULA_2 = 0;
function getFailMessage(formula, localeService) {
  if (Tools.isBlank(formula)) {
    return localeService.t("dataValidation.validFail.value");
  }
  if (isFormulaString(formula)) {
    return localeService.t("dataValidation.validFail.primitive");
  }
  return "";
}
var transformCheckboxValue = (value) => Tools.isDefine(value) && String(value).toLowerCase() === "true" ? "1" : String(value).toLowerCase() === "false" ? "0" : value;
var CheckboxValidator = class extends BaseDataValidator {
  constructor() {
    super(...arguments);
    __publicField(this, "id", "checkbox" /* CHECKBOX */);
    __publicField(this, "title", "dataValidation.checkbox.title");
    __publicField(this, "operators", []);
    __publicField(this, "scopes", ["sheet"]);
    __publicField(this, "order", 41);
    __publicField(this, "offsetFormulaByRange", false);
    __publicField(this, "_formulaService", this.injector.get(DataValidationFormulaService));
    __publicField(this, "skipDefaultFontRender", (rule, cellValue, pos) => {
      const { unitId, subUnitId } = pos;
      const { formula1, formula2 } = this.parseFormulaSync(rule, unitId, subUnitId);
      const valueStr = `${cellValue != null ? cellValue : ""}`;
      const res = !valueStr || (valueStr === `${formula1}` || valueStr === `${formula2}`);
      return res;
    });
  }
  validatorFormula(rule, unitId, subUnitId) {
    const { formula1, formula2 } = rule;
    const isEqual = formula1 === formula2;
    if (Tools.isBlank(formula1) && Tools.isBlank(formula2)) {
      return {
        success: true
      };
    }
    if (isEqual) {
      return {
        success: false,
        formula1: this.localeService.t("dataValidation.validFail.checkboxEqual"),
        formula2: this.localeService.t("dataValidation.validFail.checkboxEqual")
      };
    }
    const error1 = getFailMessage(formula1, this.localeService);
    const error2 = getFailMessage(formula2, this.localeService);
    return {
      success: !error1 && !error2,
      formula1: error1,
      formula2: error2
    };
  }
  async parseFormula(rule, unitId, subUnitId) {
    var _a, _b, _c, _d;
    const { formula1 = CHECKBOX_FORMULA_1, formula2 = CHECKBOX_FORMULA_2 } = rule;
    const results = await this._formulaService.getRuleFormulaResult(unitId, subUnitId, rule.uid);
    const originFormula1 = isFormulaString(formula1) ? getFormulaResult((_b = (_a = results == null ? void 0 : results[0]) == null ? void 0 : _a.result) == null ? void 0 : _b[0][0]) : formula1;
    const originFormula2 = isFormulaString(formula2) ? getFormulaResult((_d = (_c = results == null ? void 0 : results[1]) == null ? void 0 : _c.result) == null ? void 0 : _d[0][0]) : formula2;
    const isFormulaValid = isLegalFormulaResult(String(originFormula1)) && isLegalFormulaResult(String(originFormula2));
    return {
      formula1: transformCheckboxValue(originFormula1),
      formula2: transformCheckboxValue(originFormula2),
      originFormula1,
      originFormula2,
      isFormulaValid
    };
  }
  getExtraStyle(rule, value) {
    return {
      tb: 2 /* CLIP */
    };
  }
  parseFormulaSync(rule, unitId, subUnitId) {
    var _a, _b, _c, _d;
    const { formula1 = CHECKBOX_FORMULA_1, formula2 = CHECKBOX_FORMULA_2 } = rule;
    const results = this._formulaService.getRuleFormulaResultSync(unitId, subUnitId, rule.uid);
    const originFormula1 = isFormulaString(formula1) ? getFormulaResult((_b = (_a = results == null ? void 0 : results[0]) == null ? void 0 : _a.result) == null ? void 0 : _b[0][0]) : formula1;
    const originFormula2 = isFormulaString(formula2) ? getFormulaResult((_d = (_c = results == null ? void 0 : results[1]) == null ? void 0 : _c.result) == null ? void 0 : _d[0][0]) : formula2;
    const isFormulaValid = isLegalFormulaResult(String(originFormula1)) && isLegalFormulaResult(String(originFormula2));
    return {
      formula1: transformCheckboxValue(originFormula1),
      formula2: transformCheckboxValue(originFormula2),
      originFormula1,
      originFormula2,
      isFormulaValid
    };
  }
  async isValidType(cellInfo, formula, rule) {
    const { value, unitId, subUnitId } = cellInfo;
    const { formula1, formula2, originFormula1, originFormula2 } = await this.parseFormula(rule, unitId, subUnitId);
    if (!Tools.isDefine(formula1) || !Tools.isDefine(formula2)) {
      return true;
    }
    return Tools.isDefine(value) && (String(value) === String(formula1) || String(value) === String(formula2) || String(value) === String(originFormula1 != null ? originFormula1 : "") || String(value) === String(originFormula2 != null ? originFormula2 : ""));
  }
  generateRuleErrorMessage(rule) {
    return this.localeService.t("dataValidation.checkbox.error");
  }
  generateRuleName(rule) {
    return this.titleStr;
  }
};

// ../packages/sheets-data-validation/src/common/date-text-map.ts
var DateOperatorNameMap = {
  ["between" /* BETWEEN */]: "dataValidation.date.operators.between",
  ["equal" /* EQUAL */]: "dataValidation.date.operators.equal",
  ["greaterThan" /* GREATER_THAN */]: "dataValidation.date.operators.greaterThan",
  ["greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */]: "dataValidation.date.operators.greaterThanOrEqual",
  ["lessThan" /* LESS_THAN */]: "dataValidation.date.operators.lessThan",
  ["lessThanOrEqual" /* LESS_THAN_OR_EQUAL */]: "dataValidation.date.operators.lessThanOrEqual",
  ["notBetween" /* NOT_BETWEEN */]: "dataValidation.date.operators.notBetween",
  ["notEqual" /* NOT_EQUAL */]: "dataValidation.date.operators.notEqual"
};
var DateOperatorTextMap = {
  ["between" /* BETWEEN */]: "dataValidation.date.operators.between",
  ["equal" /* EQUAL */]: "dataValidation.date.operators.equal",
  ["greaterThan" /* GREATER_THAN */]: "dataValidation.date.operators.greaterThan",
  ["greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */]: "dataValidation.date.operators.greaterThanOrEqual",
  ["lessThan" /* LESS_THAN */]: "dataValidation.date.operators.lessThan",
  ["lessThanOrEqual" /* LESS_THAN_OR_EQUAL */]: "dataValidation.date.operators.lessThanOrEqual",
  ["notBetween" /* NOT_BETWEEN */]: "dataValidation.date.operators.notBetween",
  ["notEqual" /* NOT_EQUAL */]: "dataValidation.date.operators.notEqual"
};
var DateOperatorTitleMap = {
  ["between" /* BETWEEN */]: "dataValidation.date.ruleName.between",
  ["equal" /* EQUAL */]: "dataValidation.date.ruleName.equal",
  ["greaterThan" /* GREATER_THAN */]: "dataValidation.date.ruleName.greaterThan",
  ["greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */]: "dataValidation.date.ruleName.greaterThanOrEqual",
  ["lessThan" /* LESS_THAN */]: "dataValidation.date.ruleName.lessThan",
  ["lessThanOrEqual" /* LESS_THAN_OR_EQUAL */]: "dataValidation.date.ruleName.lessThanOrEqual",
  ["notBetween" /* NOT_BETWEEN */]: "dataValidation.date.ruleName.notBetween",
  ["notEqual" /* NOT_EQUAL */]: "dataValidation.date.ruleName.notEqual",
  NONE: "dataValidation.date.ruleName.legal"
};
var DateOperatorErrorTitleMap = {
  ["between" /* BETWEEN */]: "dataValidation.date.errorMsg.between",
  ["equal" /* EQUAL */]: "dataValidation.date.errorMsg.equal",
  ["greaterThan" /* GREATER_THAN */]: "dataValidation.date.errorMsg.greaterThan",
  ["greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */]: "dataValidation.date.errorMsg.greaterThanOrEqual",
  ["lessThan" /* LESS_THAN */]: "dataValidation.date.errorMsg.lessThan",
  ["lessThanOrEqual" /* LESS_THAN_OR_EQUAL */]: "dataValidation.date.errorMsg.lessThanOrEqual",
  ["notBetween" /* NOT_BETWEEN */]: "dataValidation.date.errorMsg.notBetween",
  ["notEqual" /* NOT_EQUAL */]: "dataValidation.date.errorMsg.notEqual",
  NONE: "dataValidation.date.errorMsg.legal"
};

// ../packages/sheets-data-validation/src/types/const/two-formula-operators.ts
var TWO_FORMULA_OPERATOR_COUNT2 = [
  "between" /* BETWEEN */,
  "notBetween" /* NOT_BETWEEN */
];

// ../packages/sheets-data-validation/src/validators/const.ts
var FORMULA12 = "{FORMULA1}";
var FORMULA22 = "{FORMULA2}";

// ../packages/sheets-data-validation/src/validators/date-validator.ts
var transformDate2SerialNumber = (value) => {
  var _a, _b;
  if (value === void 0 || value === null || typeof value === "boolean") {
    return void 0;
  }
  if (typeof value === "number" || !Number.isNaN(+value)) {
    return +value;
  }
  const v = (_a = lib_exports.parseDate(value)) == null ? void 0 : _a.v;
  if (Tools.isDefine(v)) {
    return v;
  }
  return (_b = lib_exports.parseDate((0, import_dayjs.default)(value).format("YYYY-MM-DD HH:mm:ss"))) == null ? void 0 : _b.v;
};
var DateValidator = class extends BaseDataValidator {
  constructor() {
    super(...arguments);
    __publicField(this, "id", "date" /* DATE */);
    __publicField(this, "title", "dataValidation.date.title");
    __publicField(this, "order", 40);
    __publicField(this, "operators", [
      "between" /* BETWEEN */,
      "equal" /* EQUAL */,
      "greaterThan" /* GREATER_THAN */,
      "greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */,
      "lessThan" /* LESS_THAN */,
      "lessThanOrEqual" /* LESS_THAN_OR_EQUAL */,
      "notBetween" /* NOT_BETWEEN */,
      "notEqual" /* NOT_EQUAL */
    ]);
    __publicField(this, "scopes", ["sheet"]);
    __publicField(this, "_customFormulaService", this.injector.get(DataValidationCustomFormulaService));
    __publicField(this, "_lexerTreeBuilder", this.injector.get(LexerTreeBuilder));
  }
  async parseFormula(rule, unitId, subUnitId, row, column) {
    const formulaResult1 = await this._customFormulaService.getCellFormulaValue(unitId, subUnitId, rule.uid, row, column);
    const formulaResult2 = await this._customFormulaService.getCellFormula2Value(unitId, subUnitId, rule.uid, row, column);
    const { formula1, formula2 } = rule;
    const isFormulaValid = isLegalFormulaResult(String(formulaResult1 == null ? void 0 : formulaResult1.v)) && isLegalFormulaResult(String(formulaResult2 == null ? void 0 : formulaResult2.v));
    return {
      formula1: transformDate2SerialNumber(isFormulaString(formula1) ? formulaResult1 == null ? void 0 : formulaResult1.v : formula1),
      formula2: transformDate2SerialNumber(isFormulaString(formula2) ? formulaResult2 == null ? void 0 : formulaResult2.v : formula2),
      isFormulaValid
    };
  }
  async isValidType(info) {
    const { interceptValue, value } = info;
    if (typeof value === "number" && typeof interceptValue === "string") {
      return Boolean(lib_exports.parseDate(interceptValue));
    }
    if (typeof interceptValue === "string") {
      return Boolean(lib_exports.parseDate(interceptValue));
    }
    return false;
  }
  _validatorSingleFormula(formula) {
    return !Tools.isBlank(formula) && (isFormulaString(formula) || !Number.isNaN(+formula) || Boolean(formula && lib_exports.parseDate(formula)));
  }
  validatorFormula(rule, unitId, subUnitId) {
    const operator = rule.operator;
    if (!operator) {
      return {
        success: true
      };
    }
    const formula1Success = this._validatorSingleFormula(rule.formula1);
    const errorMsg = this.localeService.t("dataValidation.validFail.date");
    const isTwoFormula = TWO_FORMULA_OPERATOR_COUNT2.includes(operator);
    if (isTwoFormula) {
      const formula2Success = this._validatorSingleFormula(rule.formula2);
      return {
        success: formula1Success && formula2Success,
        formula1: formula1Success ? void 0 : errorMsg,
        formula2: formula2Success ? void 0 : errorMsg
      };
    }
    return {
      success: formula1Success,
      formula1: formula1Success ? void 0 : errorMsg
    };
  }
  normalizeFormula(rule, _unitId, _subUnitId) {
    const { formula1, formula2, bizInfo } = rule;
    const normlizeSingleFormula = (formula) => {
      var _a;
      if (!formula) {
        return formula;
      }
      let date;
      if (!Number.isNaN(+formula)) {
        date = lib_exports.dateFromSerial(+formula);
      } else {
        const res = (_a = lib_exports.parseDate(formula)) == null ? void 0 : _a.v;
        if (res === void 0 || res === null) {
          return "";
        }
        date = lib_exports.dateFromSerial(res);
      }
      return (0, import_dayjs.default)(`${date[0]}/${date[1]}/${date[2]} ${date[3]}:${date[4]}:${date[5]}`).format((bizInfo == null ? void 0 : bizInfo.showTime) ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD");
    };
    return {
      formula1: isFormulaString(formula1) ? formula1 : normlizeSingleFormula(`${formula1}`),
      formula2: isFormulaString(formula2) ? formula2 : normlizeSingleFormula(`${formula2}`)
    };
  }
  transform(cellInfo, _formula, _rule) {
    const { value } = cellInfo;
    return {
      ...cellInfo,
      value: transformDate2SerialNumber(value)
    };
  }
  get operatorNames() {
    return this.operators.map((operator) => this.localeService.t(DateOperatorNameMap[operator]));
  }
  generateRuleName(rule) {
    var _a, _b;
    if (!rule.operator) {
      return this.localeService.t(DateOperatorTitleMap.NONE);
    }
    const ruleName = this.localeService.t(DateOperatorTitleMap[rule.operator]).replace(FORMULA12, (_a = rule.formula1) != null ? _a : "").replace(FORMULA22, (_b = rule.formula2) != null ? _b : "");
    return `${this.titleStr} ${ruleName}`;
  }
  generateRuleErrorMessage(rule, pos) {
    if (!rule.operator) {
      return this.titleStr;
    }
    const { transformedFormula1, transformedFormula2 } = getTransformedFormula(this._lexerTreeBuilder, rule, pos);
    const errorMsg = this.localeService.t(DateOperatorErrorTitleMap[rule.operator]).replace(FORMULA12, transformedFormula1 != null ? transformedFormula1 : "").replace(FORMULA22, transformedFormula2 != null ? transformedFormula2 : "");
    return `${errorMsg}`;
  }
};

// ../packages/sheets-data-validation/src/types/const/operator-text-map.ts
var OperatorTextMap2 = {
  ["between" /* BETWEEN */]: "dataValidation.operators.between",
  ["equal" /* EQUAL */]: "dataValidation.operators.equal",
  ["greaterThan" /* GREATER_THAN */]: "dataValidation.operators.greaterThan",
  ["greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */]: "dataValidation.operators.greaterThanOrEqual",
  ["lessThan" /* LESS_THAN */]: "dataValidation.operators.lessThan",
  ["lessThanOrEqual" /* LESS_THAN_OR_EQUAL */]: "dataValidation.operators.lessThanOrEqual",
  ["notBetween" /* NOT_BETWEEN */]: "dataValidation.operators.notBetween",
  ["notEqual" /* NOT_EQUAL */]: "dataValidation.operators.notEqual"
};
var OperatorTitleMap2 = {
  ["between" /* BETWEEN */]: "dataValidation.ruleName.between",
  ["equal" /* EQUAL */]: "dataValidation.ruleName.equal",
  ["greaterThan" /* GREATER_THAN */]: "dataValidation.ruleName.greaterThan",
  ["greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */]: "dataValidation.ruleName.greaterThanOrEqual",
  ["lessThan" /* LESS_THAN */]: "dataValidation.ruleName.lessThan",
  ["lessThanOrEqual" /* LESS_THAN_OR_EQUAL */]: "dataValidation.ruleName.lessThanOrEqual",
  ["notBetween" /* NOT_BETWEEN */]: "dataValidation.ruleName.notBetween",
  ["notEqual" /* NOT_EQUAL */]: "dataValidation.ruleName.notEqual"
};
var OperatorErrorTitleMap2 = {
  ["between" /* BETWEEN */]: "dataValidation.errorMsg.between",
  ["equal" /* EQUAL */]: "dataValidation.errorMsg.equal",
  ["greaterThan" /* GREATER_THAN */]: "dataValidation.errorMsg.greaterThan",
  ["greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */]: "dataValidation.errorMsg.greaterThanOrEqual",
  ["lessThan" /* LESS_THAN */]: "dataValidation.errorMsg.lessThan",
  ["lessThanOrEqual" /* LESS_THAN_OR_EQUAL */]: "dataValidation.errorMsg.lessThanOrEqual",
  ["notBetween" /* NOT_BETWEEN */]: "dataValidation.errorMsg.notBetween",
  ["notEqual" /* NOT_EQUAL */]: "dataValidation.errorMsg.notEqual",
  NONE: "dataValidation.errorMsg.legal"
};

// ../packages/sheets-data-validation/src/validators/decimal-validator.ts
function getCellValueNumber(cellValue) {
  return +cellValue;
}
var DecimalValidator = class extends BaseDataValidator {
  constructor() {
    super(...arguments);
    __publicField(this, "_customFormulaService", this.injector.get(DataValidationCustomFormulaService));
    __publicField(this, "id", "decimal" /* DECIMAL */);
    __publicField(this, "_lexerTreeBuilder", this.injector.get(LexerTreeBuilder));
    __publicField(this, "title", "dataValidation.decimal.title");
    __publicField(this, "order", 20);
    __publicField(this, "operators", [
      "between" /* BETWEEN */,
      "equal" /* EQUAL */,
      "greaterThan" /* GREATER_THAN */,
      "greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */,
      "lessThan" /* LESS_THAN */,
      "lessThanOrEqual" /* LESS_THAN_OR_EQUAL */,
      "notBetween" /* NOT_BETWEEN */,
      "notEqual" /* NOT_EQUAL */
    ]);
    __publicField(this, "scopes", ["sheet"]);
  }
  _isFormulaOrNumber(formula) {
    return !Tools.isBlank(formula) && (isFormulaString(formula) || !Number.isNaN(+formula));
  }
  async isValidType(cellInfo, formula, rule) {
    const { value: cellValue } = cellInfo;
    return !Number.isNaN(getCellValueNumber(cellValue));
  }
  transform(cellInfo, formula, rule) {
    const { value: cellValue } = cellInfo;
    return {
      ...cellInfo,
      value: getCellValueNumber(cellValue)
    };
  }
  _parseNumber(formula) {
    if (formula === void 0 || formula === null) {
      return Number.NaN;
    }
    return +formula;
  }
  async parseFormula(rule, unitId, subUnitId, row, column) {
    const formulaResult1 = await this._customFormulaService.getCellFormulaValue(unitId, subUnitId, rule.uid, row, column);
    const formulaResult2 = await this._customFormulaService.getCellFormula2Value(unitId, subUnitId, rule.uid, row, column);
    const { formula1, formula2 } = rule;
    const isFormulaValid = isLegalFormulaResult(String(formulaResult1 == null ? void 0 : formulaResult1.v)) && isLegalFormulaResult(String(formulaResult2 == null ? void 0 : formulaResult2.v));
    const info = {
      formula1: this._parseNumber(isFormulaString(formula1) ? formulaResult1 == null ? void 0 : formulaResult1.v : formula1),
      formula2: this._parseNumber(isFormulaString(formula2) ? formulaResult2 == null ? void 0 : formulaResult2.v : formula2),
      isFormulaValid
    };
    return info;
  }
  validatorFormula(rule, unitId, subUnitId) {
    const operator = rule.operator;
    if (!operator) {
      return {
        success: true
      };
    }
    const formula1Success = Tools.isDefine(rule.formula1) && this._isFormulaOrNumber(rule.formula1);
    const formula2Success = Tools.isDefine(rule.formula2) && this._isFormulaOrNumber(rule.formula2);
    const isTwoFormula = TWO_FORMULA_OPERATOR_COUNT2.includes(operator);
    const errorMsg = this.localeService.t("dataValidation.validFail.number");
    if (isTwoFormula) {
      return {
        success: formula1Success && formula2Success,
        formula1: formula1Success ? void 0 : errorMsg,
        formula2: formula2Success ? void 0 : errorMsg
      };
    }
    return {
      success: formula1Success,
      formula1: formula1Success ? "" : errorMsg
    };
  }
  generateRuleErrorMessage(rule, position) {
    if (!rule.operator) {
      return this.localeService.t(OperatorErrorTitleMap2.NONE).replace("{TYPE}", this.titleStr);
    }
    const { transformedFormula1, transformedFormula2 } = getTransformedFormula(this._lexerTreeBuilder, rule, position);
    const errorMsg = this.localeService.t(OperatorErrorTitleMap2[rule.operator]).replace(FORMULA12, transformedFormula1 != null ? transformedFormula1 : "").replace(FORMULA22, transformedFormula2 != null ? transformedFormula2 : "");
    return `${errorMsg}`;
  }
};

// ../packages/sheets-data-validation/src/validators/list-validator.ts
function getRuleFormulaResultSet(result) {
  var _a, _b;
  if (!result) {
    return [];
  }
  const resultSet = /* @__PURE__ */ new Set();
  for (let i = 0, rowLen = result.length; i < rowLen; i++) {
    const row = result[i];
    if (!row) continue;
    for (let j = 0, colLen = row.length; j < colLen; j++) {
      const cell = row[j];
      const value = getCellValueOrigin(cell);
      if (value !== null && value !== void 0) {
        if (typeof value !== "string" && typeof (cell == null ? void 0 : cell.s) === "object" && ((_b = (_a = cell.s) == null ? void 0 : _a.n) == null ? void 0 : _b.pattern)) {
          resultSet.add(lib_exports.format(cell.s.n.pattern, value, { throws: false }));
          continue;
        }
        const valueStr = typeof value === "string" ? value : String(value);
        if (isLegalFormulaResult(valueStr)) {
          resultSet.add(valueStr);
        }
      }
    }
  }
  return [...resultSet];
}
var supportedFormula = [
  "if",
  "indirect",
  "choose",
  "offset"
];
function isValidListFormula(formula, lexer) {
  if (!isFormulaString(formula)) {
    return true;
  }
  const isRefString = isReferenceString(formula.slice(1));
  if (isRefString) {
    return true;
  }
  const nodes = lexer.sequenceNodesBuilder(formula);
  return nodes && nodes.some((node) => typeof node === "object" && node.nodeType === 3 /* FUNCTION */ && supportedFormula.indexOf(node.token.toLowerCase()) > -1);
}
function isRuleIntersects(rule, sheetName) {
  const { formula1 = "", ranges } = rule;
  const isRefString = isReferenceString(formula1.slice(1));
  if (isRefString) {
    const refRange = deserializeRangeWithSheet(formula1.slice(1));
    if ((!refRange.sheetName || refRange.sheetName === sheetName) && ranges.some((range) => Rectangle.intersects(range, refRange.range))) {
      return true;
    }
  }
  return false;
}
var ListValidator = class extends BaseDataValidator {
  constructor() {
    super(...arguments);
    __publicField(this, "formulaService", this.injector.get(DataValidationFormulaService));
    __publicField(this, "_lexer", this.injector.get(LexerTreeBuilder));
    __publicField(this, "_univerInstanceService", this.injector.get(IUniverInstanceService));
    __publicField(this, "_listCacheService", this.injector.get(DataValidationListCacheService));
    __publicField(this, "order", 50);
    __publicField(this, "offsetFormulaByRange", false);
    __publicField(this, "id", "list" /* LIST */);
    __publicField(this, "title", "dataValidation.list.title");
    __publicField(this, "operators", []);
    __publicField(this, "scopes", ["sheet"]);
    __publicField(this, "skipDefaultFontRender", (rule) => {
      return rule.renderMode !== 0 /* TEXT */;
    });
  }
  validatorFormula(rule, unitId, subUnitId) {
    var _a, _b, _c;
    const success = !Tools.isBlank(rule.formula1);
    const valid = isValidListFormula((_a = rule.formula1) != null ? _a : "", this._lexer);
    const sheetName = (_c = (_b = this._univerInstanceService.getUnit(unitId, O.UNIVER_SHEET)) == null ? void 0 : _b.getSheetBySheetId(subUnitId)) == null ? void 0 : _c.getName();
    const isIntersects = isRuleIntersects(rule, sheetName != null ? sheetName : "");
    return {
      success: Boolean(success && valid && !isIntersects),
      formula1: success ? valid ? !isIntersects ? void 0 : this.localeService.t("dataValidation.validFail.listIntersects") : this.localeService.t("dataValidation.validFail.listInvalid") : this.localeService.t("dataValidation.validFail.list")
    };
  }
  getExtraStyle(rule, value, { style: defaultStyle }) {
    var _a;
    const tb = (_a = defaultStyle.tb !== 1 /* OVERFLOW */ ? defaultStyle.tb : 2 /* CLIP */) != null ? _a : 3 /* WRAP */;
    if (rule.type === "list" /* LIST */ && (rule.renderMode === 1 /* ARROW */ || rule.renderMode === 0 /* TEXT */)) {
      const colorMap = this.getListWithColorMap(rule);
      const valueStr = `${value != null ? value : ""}`;
      const color = colorMap[valueStr];
      if (color) {
        return {
          bg: {
            rgb: color
          },
          tb
        };
      }
    }
    return {
      tb
    };
  }
  parseCellValue(cellValue) {
    const cellString = cellValue.toString();
    return deserializeListOptions(cellString);
  }
  async parseFormula(rule, unitId, subUnitId) {
    var _a, _b;
    const results = await this.formulaService.getRuleFormulaResult(unitId, subUnitId, rule.uid);
    const formulaResult1 = getFormulaResult((_b = (_a = results == null ? void 0 : results[0]) == null ? void 0 : _a.result) == null ? void 0 : _b[0][0]);
    const isFormulaValid = isLegalFormulaResult(String(formulaResult1));
    return {
      formula1: void 0,
      formula2: void 0,
      isFormulaValid
    };
  }
  async isValidType(cellInfo, formula, rule) {
    const { value, unitId, subUnitId } = cellInfo;
    const { formula1 = "" } = rule;
    const formula1Result = isFormulaString(formula1) ? this._listCacheService.getOrCompute(
      unitId,
      subUnitId,
      rule
    ).list : deserializeListOptions(formula1);
    const selected = this.parseCellValue(value);
    return selected.every((i) => formula1Result.includes(i));
  }
  generateRuleName() {
    return this.localeService.t("dataValidation.list.name");
  }
  generateRuleErrorMessage() {
    return this.localeService.t("dataValidation.list.error");
  }
  _getUnitAndSubUnit(currentUnitId, currentSubUnitId) {
    var _a, _b;
    const workbook = (_a = currentUnitId ? this._univerInstanceService.getUniverSheetInstance(currentUnitId) : void 0) != null ? _a : this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET);
    if (!workbook) return null;
    const worksheet = (_b = currentSubUnitId ? workbook.getSheetBySheetId(currentSubUnitId) : void 0) != null ? _b : workbook.getActiveSheet();
    if (!worksheet) return null;
    return {
      unitId: workbook.getUnitId(),
      subUnitId: worksheet.getSheetId()
    };
  }
  getList(rule, currentUnitId, currentSubUnitId) {
    const location = this._getUnitAndSubUnit(currentUnitId, currentSubUnitId);
    if (!location) return [];
    const { unitId, subUnitId } = location;
    return this._listCacheService.getOrCompute(
      unitId,
      subUnitId,
      rule
    ).list;
  }
  async getListAsync(rule, currentUnitId, currentSubUnitId) {
    var _a, _b;
    const { formula1 = "" } = rule;
    const location = this._getUnitAndSubUnit(currentUnitId, currentSubUnitId);
    if (!location) return [];
    const { unitId, subUnitId } = location;
    const results = await this.formulaService.getRuleFormulaResult(unitId, subUnitId, rule.uid);
    return isFormulaString(formula1) ? getRuleFormulaResultSet((_b = (_a = results == null ? void 0 : results[0]) == null ? void 0 : _a.result) == null ? void 0 : _b[0][0]) : deserializeListOptions(formula1);
  }
  getListWithColor(rule, currentUnitId, currentSubUnitId) {
    const location = this._getUnitAndSubUnit(currentUnitId, currentSubUnitId);
    if (!location) return [];
    const { unitId, subUnitId } = location;
    return this._listCacheService.getOrCompute(
      unitId,
      subUnitId,
      rule
    ).listWithColor;
  }
  getListWithColorMap(rule, currentUnitId, currentSubUnitId) {
    const location = this._getUnitAndSubUnit(currentUnitId, currentSubUnitId);
    if (!location) return {};
    const { unitId, subUnitId } = location;
    return this._listCacheService.getOrCompute(
      unitId,
      subUnitId,
      rule
    ).colorMap;
  }
};

// ../packages/sheets-data-validation/src/validators/text-length-validator.ts
var TextLengthValidator = class extends BaseDataValidator {
  constructor() {
    super(...arguments);
    __publicField(this, "id", "textLength" /* TEXT_LENGTH */);
    __publicField(this, "title", "dataValidation.textLength.title");
    __publicField(this, "_lexerTreeBuilder", this.injector.get(LexerTreeBuilder));
    __publicField(this, "order", 30);
    __publicField(this, "operators", [
      "between" /* BETWEEN */,
      "equal" /* EQUAL */,
      "greaterThan" /* GREATER_THAN */,
      "greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */,
      "lessThan" /* LESS_THAN */,
      "lessThanOrEqual" /* LESS_THAN_OR_EQUAL */,
      "notBetween" /* NOT_BETWEEN */,
      "notEqual" /* NOT_EQUAL */
    ]);
    __publicField(this, "scopes", ["sheet"]);
    __publicField(this, "_customFormulaService", this.injector.get(DataValidationCustomFormulaService));
  }
  _isFormulaOrInt(formula) {
    return !Tools.isBlank(formula) && (isFormulaString(formula) || !Number.isNaN(+formula) && Number.isInteger(+formula));
  }
  validatorFormula(rule, _unitId, _subUnitId) {
    const operator = rule.operator;
    if (!operator) {
      return {
        success: false
      };
    }
    const formula1Success = Tools.isDefine(rule.formula1) && this._isFormulaOrInt(rule.formula1);
    const formula2Success = Tools.isDefine(rule.formula2) && this._isFormulaOrInt(rule.formula2);
    const isTwoFormula = TWO_FORMULA_OPERATOR_COUNT2.includes(operator);
    const errorMsg = this.localeService.t("dataValidation.validFail.number");
    if (isTwoFormula) {
      return {
        success: formula1Success && formula2Success,
        formula1: formula1Success ? void 0 : errorMsg,
        formula2: formula2Success ? void 0 : errorMsg
      };
    }
    return {
      success: formula1Success,
      formula1: errorMsg
    };
  }
  _parseNumber(formula) {
    if (formula === void 0 || formula === null) {
      return Number.NaN;
    }
    return +formula;
  }
  async parseFormula(rule, unitId, subUnitId, row, column) {
    const formulaResult1 = await this._customFormulaService.getCellFormulaValue(unitId, subUnitId, rule.uid, row, column);
    const formulaResult2 = await this._customFormulaService.getCellFormula2Value(unitId, subUnitId, rule.uid, row, column);
    const { formula1, formula2 } = rule;
    const isFormulaValid = isLegalFormulaResult(String(formulaResult1 == null ? void 0 : formulaResult1.v)) && isLegalFormulaResult(String(formulaResult2 == null ? void 0 : formulaResult2.v));
    return {
      formula1: this._parseNumber(isFormulaString(formula1) ? formulaResult1 == null ? void 0 : formulaResult1.v : formula1),
      formula2: this._parseNumber(isFormulaString(formula2) ? formulaResult2 == null ? void 0 : formulaResult2.v : formula2),
      isFormulaValid
    };
  }
  transform(cellInfo, _formula, _rule) {
    return {
      ...cellInfo,
      value: cellInfo.value.toString().length
    };
  }
  async isValidType(cellInfo, _formula, _rule) {
    const { value: cellValue } = cellInfo;
    return typeof cellValue === "string" || typeof cellValue === "number";
  }
  generateRuleErrorMessage(rule, pos) {
    if (!rule.operator) {
      return this.titleStr;
    }
    const { transformedFormula1, transformedFormula2 } = getTransformedFormula(this._lexerTreeBuilder, rule, pos);
    const errorMsg = this.localeService.t(TextLengthErrorTitleMap[rule.operator]).replace(FORMULA12, transformedFormula1 != null ? transformedFormula1 : "").replace(FORMULA22, transformedFormula2 != null ? transformedFormula2 : "");
    return `${errorMsg}`;
  }
};

// ../packages/sheets-data-validation/src/commands/commands/data-validation.command.ts
function isBlankCell(cellData) {
  var _a, _b;
  if (!cellData) {
    return true;
  }
  if (!cellData.p) {
    return Tools.isBlank(cellData.v);
  }
  const dataStream = ((_b = (_a = cellData.p.body) == null ? void 0 : _a.dataStream) != null ? _b : "").slice(0, -2).trim();
  return !dataStream;
}
function getDataValidationDiffMutations(unitId, subUnitId, diffs, accessor, source = "command", fillDefaultValue = true) {
  const lexerTreeBuilder = accessor.get(LexerTreeBuilder);
  const validatorRegistryService = accessor.get(DataValidatorRegistryService);
  const redoMutations = [];
  const undoMutations = [];
  const sheetDataValidationModel = accessor.get(SheetDataValidationModel);
  const univerInstanceService = accessor.get(IUniverInstanceService);
  const target = getSheetCommandTarget(univerInstanceService, { unitId, subUnitId });
  if (!target) {
    return {
      redoMutations,
      undoMutations
    };
  }
  const { worksheet } = target;
  const redoMatrix = new ObjectMatrix();
  let setRangeValue = false;
  function setRangesDefaultValue(ranges, defaultValue) {
    if (!fillDefaultValue) {
      return;
    }
    ranges.forEach((range) => {
      Range.foreach(range, (row, column) => {
        const cellData = worksheet.getCellRaw(row, column);
        const value = getStringCellValue(cellData);
        if ((isBlankCell(cellData) || value === defaultValue) && !(cellData == null ? void 0 : cellData.p)) {
          setRangeValue = true;
          redoMatrix.setValue(row, column, {
            v: defaultValue,
            p: null
          });
        }
      });
    });
  }
  diffs.forEach((diff) => {
    switch (diff.type) {
      case "delete":
        redoMutations.push({
          id: RemoveDataValidationMutation.id,
          params: {
            unitId,
            subUnitId,
            ruleId: diff.rule.uid,
            source
          }
        });
        undoMutations.unshift({
          id: AddDataValidationMutation.id,
          params: {
            unitId,
            subUnitId,
            rule: diff.rule,
            index: diff.index,
            source
          }
        });
        break;
      case "update": {
        if (shouldOffsetFormulaByRange(diff.rule.type, validatorRegistryService)) {
          const originRow = diff.oldRanges[0].startRow;
          const originColumn = diff.oldRanges[0].startColumn;
          const newRow = diff.newRanges[0].startRow;
          const newColumn = diff.newRanges[0].startColumn;
          const rowDiff = newRow - originRow;
          const columnDiff = newColumn - originColumn;
          const newFormula = isFormulaString(diff.rule.formula1) ? lexerTreeBuilder.moveFormulaRefOffset(diff.rule.formula1, columnDiff, rowDiff) : diff.rule.formula1;
          const newFormula2 = isFormulaString(diff.rule.formula2) ? lexerTreeBuilder.moveFormulaRefOffset(diff.rule.formula2, columnDiff, rowDiff) : diff.rule.formula2;
          if (newFormula !== diff.rule.formula1 || newFormula2 !== diff.rule.formula2 || !isRangesEqual(diff.newRanges, diff.oldRanges)) {
            redoMutations.push({
              id: UpdateDataValidationMutation.id,
              params: {
                unitId,
                subUnitId,
                ruleId: diff.ruleId,
                payload: {
                  type: 3 /* ALL */,
                  payload: {
                    formula1: newFormula,
                    formula2: newFormula2,
                    ranges: diff.newRanges
                  }
                }
              }
            });
            undoMutations.unshift({
              id: UpdateDataValidationMutation.id,
              params: {
                unitId,
                subUnitId,
                ruleId: diff.ruleId,
                payload: {
                  type: 3 /* ALL */,
                  payload: {
                    formula1: diff.rule.formula1,
                    formula2: diff.rule.formula2,
                    ranges: diff.oldRanges
                  }
                }
              }
            });
          } else {
            redoMutations.push({
              id: UpdateDataValidationMutation.id,
              params: {
                unitId,
                subUnitId,
                ruleId: diff.ruleId,
                payload: {
                  type: 1 /* RANGE */,
                  payload: diff.newRanges
                },
                source
              }
            });
            undoMutations.unshift({
              id: UpdateDataValidationMutation.id,
              params: {
                unitId,
                subUnitId,
                ruleId: diff.ruleId,
                payload: {
                  type: 1 /* RANGE */,
                  payload: diff.oldRanges
                },
                source
              }
            });
          }
        } else {
          redoMutations.push({
            id: UpdateDataValidationMutation.id,
            params: {
              unitId,
              subUnitId,
              ruleId: diff.ruleId,
              payload: {
                type: 1 /* RANGE */,
                payload: diff.newRanges
              },
              source
            }
          });
          undoMutations.unshift({
            id: UpdateDataValidationMutation.id,
            params: {
              unitId,
              subUnitId,
              ruleId: diff.ruleId,
              payload: {
                type: 1 /* RANGE */,
                payload: diff.oldRanges
              },
              source
            }
          });
        }
        const rule = sheetDataValidationModel.getRuleById(unitId, subUnitId, diff.ruleId);
        if (rule && rule.type === "checkbox" /* CHECKBOX */) {
          const validator = sheetDataValidationModel.getValidator("checkbox" /* CHECKBOX */);
          const formula = validator.parseFormulaSync(rule, unitId, subUnitId);
          setRangesDefaultValue(diff.newRanges, formula.formula2);
        }
        break;
      }
      case "add": {
        redoMutations.push({
          id: AddDataValidationMutation.id,
          params: {
            unitId,
            subUnitId,
            rule: diff.rule,
            source
          }
        });
        undoMutations.unshift({
          id: RemoveDataValidationMutation.id,
          params: {
            unitId,
            subUnitId,
            ruleId: diff.rule.uid,
            source
          }
        });
        if (diff.rule.type === "checkbox" /* CHECKBOX */) {
          const validator = sheetDataValidationModel.getValidator("checkbox" /* CHECKBOX */);
          const formula = validator.parseFormulaSync(diff.rule, unitId, subUnitId);
          setRangesDefaultValue(diff.rule.ranges, formula.originFormula2);
        }
        break;
      }
      default:
        break;
    }
  });
  if (setRangeValue) {
    const redoSetRangeValues = {
      id: SetRangeValuesMutation.id,
      params: {
        unitId,
        subUnitId,
        cellValue: redoMatrix.getData()
      }
    };
    const undoSetRangeValues = {
      id: SetRangeValuesMutation.id,
      params: SetRangeValuesUndoMutationFactory(accessor, redoSetRangeValues.params)
    };
    redoMutations.push(redoSetRangeValues);
    undoMutations.push(undoSetRangeValues);
  }
  return {
    redoMutations,
    undoMutations
  };
}
var UpdateSheetDataValidationRangeCommand = {
  type: 0 /* COMMAND */,
  id: "sheet.command.updateDataValidationRuleRange",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { unitId, subUnitId, ranges, ruleId } = params;
    const sheetDataValidationModel = accessor.get(SheetDataValidationModel);
    const commandService = accessor.get(ICommandService);
    const undoRedoService = accessor.get(IUndoRedoService);
    const currentRule = sheetDataValidationModel.getRuleById(unitId, subUnitId, ruleId);
    if (!currentRule) {
      return false;
    }
    const matrix = sheetDataValidationModel.getRuleObjectMatrix(unitId, subUnitId).clone();
    matrix.updateRange(ruleId, ranges);
    const diffs = matrix.diff(sheetDataValidationModel.getRules(unitId, subUnitId));
    const { redoMutations, undoMutations } = getDataValidationDiffMutations(unitId, subUnitId, diffs, accessor);
    undoRedoService.pushUndoRedo({
      undoMutations,
      redoMutations,
      unitID: unitId
    });
    sequenceExecute(redoMutations, commandService);
    return true;
  }
};
var AddSheetDataValidationCommand = {
  type: 0 /* COMMAND */,
  id: "sheet.command.addDataValidation",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { unitId, subUnitId, rule } = params;
    const sheetDataValidationModel = accessor.get(SheetDataValidationModel);
    const commandService = accessor.get(ICommandService);
    const undoRedoService = accessor.get(IUndoRedoService);
    const matrix = sheetDataValidationModel.getRuleObjectMatrix(unitId, subUnitId).clone();
    matrix.addRule(rule);
    const diffs = matrix.diff(sheetDataValidationModel.getRules(unitId, subUnitId));
    const validator = sheetDataValidationModel.getValidator(rule.type);
    const mutationParams = {
      unitId,
      subUnitId,
      rule: {
        ...rule,
        ...validator == null ? void 0 : validator.normalizeFormula(rule, unitId, subUnitId)
      }
    };
    const { redoMutations, undoMutations } = getDataValidationDiffMutations(unitId, subUnitId, diffs, accessor);
    redoMutations.push({
      id: AddDataValidationMutation.id,
      params: mutationParams
    });
    undoMutations.unshift({
      id: RemoveDataValidationMutation.id,
      params: {
        unitId,
        subUnitId,
        ruleId: rule.uid
      }
    });
    undoRedoService.pushUndoRedo({
      unitID: unitId,
      redoMutations,
      undoMutations
    });
    sequenceExecute(redoMutations, commandService);
    return true;
  }
};
var UpdateSheetDataValidationSettingCommand = {
  type: 0 /* COMMAND */,
  id: "sheets.command.update-data-validation-setting",
  // eslint-disable-next-line max-lines-per-function
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const commandService = accessor.get(ICommandService);
    const redoUndoService = accessor.get(IUndoRedoService);
    const sheetDataValidationModel = accessor.get(SheetDataValidationModel);
    const dataValidatorRegistryService = accessor.get(DataValidatorRegistryService);
    const { unitId, subUnitId, ruleId, setting } = params;
    const validator = dataValidatorRegistryService.getValidatorItem(setting.type);
    if (!validator) {
      return false;
    }
    const rule = sheetDataValidationModel.getRuleById(unitId, subUnitId, ruleId);
    if (!rule) {
      return false;
    }
    const newRule = { ...rule, ...setting };
    if (!validator.validatorFormula(newRule, unitId, subUnitId).success) {
      return false;
    }
    const mutationParams = {
      unitId,
      subUnitId,
      ruleId,
      payload: {
        type: 0 /* SETTING */,
        payload: {
          ...setting,
          ...validator.normalizeFormula(newRule, unitId, subUnitId)
        }
      }
    };
    const redoMutations = [{
      id: UpdateDataValidationMutation.id,
      params: mutationParams
    }];
    const undoMutationParams = {
      unitId,
      subUnitId,
      ruleId,
      payload: {
        type: 0 /* SETTING */,
        payload: getRuleSetting(rule)
      }
    };
    const undoMutations = [{
      id: UpdateDataValidationMutation.id,
      params: undoMutationParams
    }];
    if (setting.type === "checkbox" /* CHECKBOX */) {
      const ranges = rule.ranges;
      const univerInstanceService = accessor.get(IUniverInstanceService);
      const target = getSheetCommandTarget(univerInstanceService, { unitId, subUnitId });
      if (target) {
        const redoMatrix = new ObjectMatrix();
        const { worksheet } = target;
        const { formula2: oldFormula2 = CHECKBOX_FORMULA_2, formula1: oldFormula1 = CHECKBOX_FORMULA_1 } = rule;
        const { formula2 = CHECKBOX_FORMULA_2, formula1 = CHECKBOX_FORMULA_1 } = setting;
        let setted = false;
        ranges.forEach((range) => {
          Range.foreach(range, (row, column) => {
            const cellData = worksheet.getCellRaw(row, column);
            const value = getStringCellValue(cellData);
            if ((isBlankCell(cellData) || value === String(oldFormula2)) && !(cellData == null ? void 0 : cellData.p)) {
              redoMatrix.setValue(row, column, {
                v: formula2,
                p: null
              });
              setted = true;
            } else if (value === String(oldFormula1) && !(cellData == null ? void 0 : cellData.p)) {
              redoMatrix.setValue(row, column, {
                v: formula1,
                p: null
              });
              setted = true;
            }
          });
        });
        if (setted) {
          const redoSetRangeValues = {
            id: SetRangeValuesMutation.id,
            params: {
              unitId,
              subUnitId,
              cellValue: redoMatrix.getData()
            }
          };
          const undoSetRangeValues = {
            id: SetRangeValuesMutation.id,
            params: SetRangeValuesUndoMutationFactory(accessor, redoSetRangeValues.params)
          };
          redoMutations.push(redoSetRangeValues);
          undoMutations.push(undoSetRangeValues);
        }
      }
    }
    const res = sequenceExecute(redoMutations, commandService);
    if (res.result) {
      redoUndoService.pushUndoRedo({
        unitID: unitId,
        redoMutations,
        undoMutations
      });
      return true;
    }
    return false;
  }
};
var UpdateSheetDataValidationOptionsCommand = {
  type: 0 /* COMMAND */,
  id: "sheets.command.update-data-validation-options",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const commandService = accessor.get(ICommandService);
    const redoUndoService = accessor.get(IUndoRedoService);
    const sheetDataValidationModel = accessor.get(SheetDataValidationModel);
    const { unitId, subUnitId, ruleId, options } = params;
    const rule = sheetDataValidationModel.getRuleById(unitId, subUnitId, ruleId);
    if (!rule) {
      return false;
    }
    const mutationParams = {
      unitId,
      subUnitId,
      ruleId,
      payload: {
        type: 2 /* OPTIONS */,
        payload: options
      }
    };
    const redoMutations = [{
      id: UpdateDataValidationMutation.id,
      params: mutationParams
    }];
    const undoMutationParams = {
      unitId,
      subUnitId,
      ruleId,
      payload: {
        type: 2 /* OPTIONS */,
        payload: getRuleOptions(rule)
      }
    };
    const undoMutations = [{
      id: UpdateDataValidationMutation.id,
      params: undoMutationParams
    }];
    redoUndoService.pushUndoRedo({
      unitID: unitId,
      redoMutations,
      undoMutations
    });
    commandService.executeCommand(UpdateDataValidationMutation.id, mutationParams);
    return true;
  }
};
var ClearRangeDataValidationCommand = {
  type: 0 /* COMMAND */,
  id: "sheets.command.clear-range-data-validation",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { unitId, subUnitId, ranges } = params;
    const commandService = accessor.get(ICommandService);
    const univerInstanceService = accessor.get(IUniverInstanceService);
    const target = getSheetCommandTarget(univerInstanceService, { unitId, subUnitId });
    const sheetDataValidationModel = accessor.get(SheetDataValidationModel);
    if (!target) return false;
    const undoRedoService = accessor.get(IUndoRedoService);
    const matrix = sheetDataValidationModel.getRuleObjectMatrix(unitId, subUnitId).clone();
    matrix.removeRange(ranges);
    const diffs = matrix.diff(sheetDataValidationModel.getRules(unitId, subUnitId));
    const { redoMutations, undoMutations } = getDataValidationDiffMutations(unitId, subUnitId, diffs, accessor);
    undoRedoService.pushUndoRedo({
      unitID: unitId,
      redoMutations,
      undoMutations
    });
    return sequenceExecute(redoMutations, commandService).result;
  }
};
var RemoveSheetAllDataValidationCommand = {
  type: 0 /* COMMAND */,
  id: "sheet.command.remove-all-data-validation",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { unitId, subUnitId } = params;
    const commandService = accessor.get(ICommandService);
    const sheetDataValidationModel = accessor.get(SheetDataValidationModel);
    const undoRedoService = accessor.get(IUndoRedoService);
    const currentRules = [...sheetDataValidationModel.getRules(unitId, subUnitId)];
    const redoParams = {
      unitId,
      subUnitId,
      ruleId: currentRules.map((rule) => rule.uid)
    };
    const redoMutations = [{
      id: RemoveDataValidationMutation.id,
      params: redoParams
    }];
    const undoMutations = [{
      id: AddDataValidationMutation.id,
      params: {
        unitId,
        subUnitId,
        rule: currentRules
      }
    }];
    undoRedoService.pushUndoRedo({
      redoMutations,
      undoMutations,
      unitID: unitId
    });
    commandService.executeCommand(RemoveDataValidationMutation.id, redoParams);
    return true;
  }
};
var removeDataValidationUndoFactory = (accessor, redoParams) => {
  const sheetDataValidationModel = accessor.get(SheetDataValidationModel);
  const { unitId, subUnitId, ruleId, source } = redoParams;
  if (Array.isArray(ruleId)) {
    const rules = ruleId.map((id) => sheetDataValidationModel.getRuleById(unitId, subUnitId, id)).filter(Boolean);
    return [{
      id: AddDataValidationMutation.id,
      params: {
        unitId,
        subUnitId,
        rule: rules,
        source
      }
    }];
  }
  const undoMutations = [{
    id: AddDataValidationMutation.id,
    params: {
      unitId,
      subUnitId,
      rule: {
        ...sheetDataValidationModel.getRuleById(unitId, subUnitId, ruleId)
      },
      index: sheetDataValidationModel.getRuleIndex(unitId, subUnitId, ruleId)
    }
  }];
  return undoMutations;
};
var RemoveSheetDataValidationCommand = {
  type: 0 /* COMMAND */,
  id: "sheet.command.remove-data-validation-rule",
  handler(accessor, params) {
    if (!params) {
      return false;
    }
    const { unitId, subUnitId, ruleId } = params;
    const commandService = accessor.get(ICommandService);
    const undoRedoService = accessor.get(IUndoRedoService);
    const sheetDataValidationModel = accessor.get(SheetDataValidationModel);
    const redoMutations = [{
      id: RemoveDataValidationMutation.id,
      params
    }];
    const undoMutations = [{
      id: AddDataValidationMutation.id,
      params: {
        unitId,
        subUnitId,
        rule: {
          ...sheetDataValidationModel.getRuleById(unitId, subUnitId, ruleId)
        },
        index: sheetDataValidationModel.getRuleIndex(unitId, subUnitId, ruleId)
      }
    }];
    undoRedoService.pushUndoRedo({
      undoMutations,
      redoMutations,
      unitID: params.unitId
    });
    commandService.executeCommand(RemoveDataValidationMutation.id, params);
    return true;
  }
};

// ../packages/sheets-data-validation/src/common/const.ts
var DATA_VALIDATION_PLUGIN_NAME2 = "SHEET_DATA_VALIDATION_PLUGIN";

// ../packages/sheets-data-validation/src/controllers/config.schema.ts
var SHEETS_DATA_VALIDATION_PLUGIN_CONFIG_KEY = "sheets-data-validation.config";
var configSymbol2 = Symbol(SHEETS_DATA_VALIDATION_PLUGIN_CONFIG_KEY);
var defaultPluginConfig2 = {};

// ../packages/sheets-data-validation/src/controllers/dv-formula-ref-range.controller.ts
var DataValidationFormulaRefRangeController = class extends Disposable {
  constructor(_dataValidationModel, _formulaRefRangeService, _validatorRegistryService) {
    super();
    this._dataValidationModel = _dataValidationModel;
    this._formulaRefRangeService = _formulaRefRangeService;
    this._validatorRegistryService = _validatorRegistryService;
    __publicField(this, "_disposableMap", /* @__PURE__ */ new Map());
    __publicField(this, "registerRule", (unitId, subUnitId, rule) => {
      if (!shouldOffsetFormulaByRange(rule.type, this._validatorRegistryService)) {
        return;
      }
      this.register(unitId, subUnitId, rule);
    });
    this._initRefRange();
  }
  _getIdWithUnitId(unitID, subUnitId, ruleId) {
    return `${unitID}_${subUnitId}_${ruleId}`;
  }
  // eslint-disable-next-line max-lines-per-function
  register(unitId, subUnitId, rule) {
    const oldRanges = rule.ranges;
    const oldFormula1 = rule.formula1;
    const oldFormula2 = rule.formula2;
    const disposable = this._formulaRefRangeService.registerRangeFormula(unitId, subUnitId, oldRanges, [oldFormula1 != null ? oldFormula1 : "", oldFormula2 != null ? oldFormula2 : ""], (res) => {
      if (res.length === 0) {
        return {
          undos: [{
            id: AddDataValidationMutation.id,
            params: {
              unitId,
              subUnitId,
              rule,
              source: "patched"
            }
          }],
          redos: [{
            id: RemoveDataValidationMutation.id,
            params: {
              unitId,
              subUnitId,
              ruleId: rule.uid,
              source: "patched"
            }
          }]
        };
      }
      const redos = [];
      const undos = [];
      const first = res[0];
      redos.push({
        id: UpdateDataValidationMutation.id,
        params: {
          unitId,
          subUnitId,
          ruleId: rule.uid,
          payload: {
            type: 3 /* ALL */,
            payload: {
              ranges: first.ranges,
              formula1: first.formulas[0],
              formula2: first.formulas[1]
            }
          },
          source: "patched"
        }
      });
      undos.push({
        id: UpdateDataValidationMutation.id,
        params: {
          unitId,
          subUnitId,
          ruleId: rule.uid,
          payload: {
            type: 3 /* ALL */,
            payload: {
              ranges: oldRanges,
              formula1: oldFormula1,
              formula2: oldFormula2
            }
          },
          source: "patched"
        }
      });
      for (let i = 1; i < res.length; i++) {
        const item = res[i];
        const id2 = generateRandomId();
        redos.push({
          id: AddDataValidationMutation.id,
          params: {
            unitId,
            subUnitId,
            rule: {
              ...rule,
              uid: id2,
              formula1: item.formulas[0],
              formula2: item.formulas[1],
              ranges: item.ranges
            },
            source: "patched"
          }
        });
        undos.push({
          id: RemoveDataValidationMutation.id,
          params: {
            unitId,
            subUnitId,
            ruleId: id2,
            source: "patched"
          }
        });
      }
      return {
        undos,
        redos
      };
    });
    const id = this._getIdWithUnitId(unitId, subUnitId, rule.uid);
    this._disposableMap.set(id, disposable);
  }
  _initRefRange() {
    const allRules = this._dataValidationModel.getAll();
    for (const [unitId, subUnitMap] of allRules) {
      for (const [subUnitId, rules] of subUnitMap) {
        for (const rule of rules) {
          this.registerRule(unitId, subUnitId, rule);
        }
      }
    }
    this.disposeWithMe(
      this._dataValidationModel.ruleChange$.subscribe((option) => {
        const { unitId, subUnitId, rule } = option;
        switch (option.type) {
          case "add": {
            const rule2 = option.rule;
            this.registerRule(option.unitId, option.subUnitId, rule2);
            break;
          }
          case "remove": {
            const disposeSet = this._disposableMap.get(this._getIdWithUnitId(unitId, subUnitId, rule.uid));
            if (disposeSet) {
              disposeSet.dispose();
            }
            break;
          }
          case "update": {
            const rule2 = option.rule;
            const disposeSet = this._disposableMap.get(this._getIdWithUnitId(unitId, subUnitId, rule2.uid));
            if (disposeSet) {
              disposeSet.dispose();
            }
            this.registerRule(option.unitId, option.subUnitId, rule2);
            break;
          }
        }
      })
    );
    this.disposeWithMe(toDisposable(() => {
      this._disposableMap.forEach((item) => {
        item.dispose();
      });
      this._disposableMap.clear();
    }));
  }
};
DataValidationFormulaRefRangeController = __decorateClass([
  __decorateParam(0, Inject(SheetDataValidationModel)),
  __decorateParam(1, Inject(FormulaRefRangeService)),
  __decorateParam(2, Inject(DataValidatorRegistryService))
], DataValidationFormulaRefRangeController);

// ../packages/sheets-data-validation/src/controllers/dv-formula.controller.ts
var DataValidationFormulaController = class extends Disposable {
  constructor(_univerInstanceService, _permissionService, _lexerTreeBuilder) {
    super();
    this._univerInstanceService = _univerInstanceService;
    this._permissionService = _permissionService;
    this._lexerTreeBuilder = _lexerTreeBuilder;
  }
  getFormulaRefCheck(formulaString) {
    var _a, _b;
    const sequenceNodes = this._lexerTreeBuilder.sequenceNodesBuilder(formulaString);
    if (!sequenceNodes) {
      return true;
    }
    for (let i = 0; i < sequenceNodes.length; i++) {
      const node = sequenceNodes[i];
      if (typeof node === "string") {
        continue;
      }
      const { token } = node;
      const sequenceGrid = deserializeRangeWithSheetWithCache(token);
      const workbook = this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET);
      let targetSheet = workbook.getActiveSheet();
      const unitId = workbook.getUnitId();
      if (sequenceGrid.sheetName) {
        targetSheet = workbook.getSheetBySheetName(sequenceGrid.sheetName);
        if (!targetSheet) {
          return false;
        }
        const subUnitId = targetSheet == null ? void 0 : targetSheet.getSheetId();
        const viewPermission = this._permissionService.getPermissionPoint(new WorksheetViewPermission(unitId, subUnitId).id);
        if (!viewPermission) return false;
      }
      if (!targetSheet) {
        return false;
      }
      const { startRow, endRow, startColumn, endColumn } = sequenceGrid.range;
      for (let i2 = startRow; i2 <= endRow; i2++) {
        for (let j = startColumn; j <= endColumn; j++) {
          const permission = (_b = (_a = targetSheet.getCell(i2, j)) == null ? void 0 : _a.selectionProtection) == null ? void 0 : _b[0];
          if ((permission == null ? void 0 : permission[R.View]) === false) {
            return false;
          }
        }
      }
    }
    return true;
  }
};
DataValidationFormulaController = __decorateClass([
  __decorateParam(0, IUniverInstanceService),
  __decorateParam(1, IPermissionService),
  __decorateParam(2, Inject(LexerTreeBuilder))
], DataValidationFormulaController);

// ../packages/sheets-data-validation/src/controllers/dv-ref-range.controller.ts
var DataValidationRefRangeController = class extends Disposable {
  constructor(_dataValidationModel, _injector, _refRangeService, _dataValidationFormulaService, _formulaRefRangeService, _validatorRegistryService) {
    super();
    this._dataValidationModel = _dataValidationModel;
    this._injector = _injector;
    this._refRangeService = _refRangeService;
    this._dataValidationFormulaService = _dataValidationFormulaService;
    this._formulaRefRangeService = _formulaRefRangeService;
    this._validatorRegistryService = _validatorRegistryService;
    __publicField(this, "_disposableMap", /* @__PURE__ */ new Map());
    __publicField(this, "registerRule", (unitId, subUnitId, rule) => {
      if (shouldOffsetFormulaByRange(rule.type, this._validatorRegistryService)) {
        return;
      }
      this.register(unitId, subUnitId, rule);
      this.registerFormula(unitId, subUnitId, rule);
    });
    this._initRefRange();
  }
  _getIdWithUnitId(unitID, subUnitId, ruleId) {
    return `${unitID}_${subUnitId}_${ruleId}`;
  }
  // eslint-disable-next-line max-lines-per-function
  registerFormula(unitId, subUnitId, rule) {
    var _a;
    const ruleId = rule.uid;
    const id = this._getIdWithUnitId(unitId, subUnitId, ruleId);
    const disposeSet = (_a = this._disposableMap.get(id)) != null ? _a : /* @__PURE__ */ new Set();
    const handleFormulaChange = (type, formulaString) => {
      const oldRule = this._dataValidationModel.getRuleById(unitId, subUnitId, ruleId);
      if (!oldRule) {
        return { redos: [], undos: [] };
      }
      const oldFormula = oldRule[type];
      if (!oldFormula || oldFormula === formulaString) {
        return { redos: [], undos: [] };
      }
      const redoParams = {
        unitId,
        subUnitId,
        ruleId: rule.uid,
        payload: {
          type: 0 /* SETTING */,
          payload: {
            type: oldRule.type,
            formula1: oldRule.formula1,
            formula2: oldRule.formula2,
            [type]: formulaString
          }
        },
        source: "patched"
      };
      const undoParams = {
        unitId,
        subUnitId,
        ruleId: rule.uid,
        payload: {
          type: 0 /* SETTING */,
          payload: {
            type: oldRule.type,
            formula1: oldRule.formula1,
            formula2: oldRule.formula2
          }
        },
        source: "patched"
      };
      const redos = [
        {
          id: UpdateDataValidationMutation.id,
          params: redoParams
        }
      ];
      const undos = [
        {
          id: UpdateDataValidationMutation.id,
          params: undoParams
        }
      ];
      return { redos, undos };
    };
    const currentFormula = this._dataValidationFormulaService.getRuleFormulaInfo(unitId, subUnitId, ruleId);
    if (currentFormula) {
      const [formula1, formula2] = currentFormula;
      if (formula1) {
        const disposable = this._formulaRefRangeService.registerFormula(
          unitId,
          subUnitId,
          formula1.text,
          (newFormulaString) => handleFormulaChange("formula1", newFormulaString)
        );
        disposeSet.add(() => disposable.dispose());
      }
      if (formula2) {
        const disposable = this._formulaRefRangeService.registerFormula(
          unitId,
          subUnitId,
          formula2.text,
          (newFormulaString) => handleFormulaChange("formula2", newFormulaString)
        );
        disposeSet.add(() => disposable.dispose());
      }
    }
  }
  register(unitId, subUnitId, rule) {
    var _a;
    const handleRangeChange = (commandInfo) => {
      const oldRanges = [...rule.ranges];
      const resultRangesOrigin = oldRanges.map((range) => {
        return handleCommonDefaultRangeChangeWithEffectRefCommands(range, commandInfo);
      }).filter((range) => !!range);
      const resultRanges = resultRangesOrigin.flat();
      const isEqual = isRangesEqual(resultRanges, oldRanges);
      if (isEqual) {
        return { redos: [], undos: [] };
      }
      if (resultRanges.length) {
        const redoParams = {
          unitId,
          subUnitId,
          ruleId: rule.uid,
          payload: {
            type: 1 /* RANGE */,
            payload: resultRanges
          },
          source: "patched"
        };
        const redos = [{ id: UpdateDataValidationMutation.id, params: redoParams }];
        const undos = [{
          id: UpdateDataValidationMutation.id,
          params: {
            unitId,
            subUnitId,
            ruleId: rule.uid,
            payload: {
              type: 1 /* RANGE */,
              payload: oldRanges
            },
            source: "patched"
          }
        }];
        return { redos, undos };
      } else {
        const redoParams = { unitId, subUnitId, ruleId: rule.uid };
        const redos = [{ id: RemoveDataValidationMutation.id, params: redoParams }];
        const undos = removeDataValidationUndoFactory(this._injector, redoParams);
        return { redos, undos };
      }
    };
    const disposeList = [];
    rule.ranges.forEach((range) => {
      const disposable = this._refRangeService.registerRefRange(range, handleRangeChange, unitId, subUnitId);
      disposeList.push(() => disposable.dispose());
    });
    const id = this._getIdWithUnitId(unitId, subUnitId, rule.uid);
    const current = (_a = this._disposableMap.get(id)) != null ? _a : /* @__PURE__ */ new Set();
    current.add(() => disposeList.forEach((dispose) => dispose()));
    this._disposableMap.set(id, current);
  }
  _initRefRange() {
    const allRules = this._dataValidationModel.getAll();
    for (const [unitId, subUnitMap] of allRules) {
      for (const [subUnitId, rules] of subUnitMap) {
        for (const rule of rules) {
          this.registerRule(unitId, subUnitId, rule);
        }
      }
    }
    this.disposeWithMe(
      this._dataValidationModel.ruleChange$.subscribe((option) => {
        const { unitId, subUnitId, rule } = option;
        switch (option.type) {
          case "add": {
            const rule2 = option.rule;
            this.registerRule(option.unitId, option.subUnitId, rule2);
            break;
          }
          case "remove": {
            const disposeSet = this._disposableMap.get(this._getIdWithUnitId(unitId, subUnitId, rule.uid));
            if (disposeSet) {
              disposeSet.forEach((dispose) => dispose());
            }
            break;
          }
          case "update": {
            const rule2 = option.rule;
            const disposeSet = this._disposableMap.get(this._getIdWithUnitId(unitId, subUnitId, rule2.uid));
            if (disposeSet) {
              disposeSet.forEach((dispose) => dispose());
            }
            this.registerRule(option.unitId, option.subUnitId, rule2);
            break;
          }
        }
      })
    );
    this.disposeWithMe(toDisposable(() => {
      this._disposableMap.forEach((item) => {
        item.forEach((dispose) => dispose());
      });
      this._disposableMap.clear();
    }));
  }
};
DataValidationRefRangeController = __decorateClass([
  __decorateParam(0, Inject(SheetDataValidationModel)),
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, Inject(RefRangeService)),
  __decorateParam(3, Inject(DataValidationFormulaService)),
  __decorateParam(4, Inject(FormulaRefRangeService)),
  __decorateParam(5, Inject(DataValidatorRegistryService))
], DataValidationRefRangeController);

// ../packages/sheets-data-validation/src/controllers/dv-sheet.controller.ts
var SheetDataValidationSheetController = class extends Disposable {
  constructor(_sheetInterceptorService, _univerInstanceService, _sheetDataValidationModel) {
    super();
    this._sheetInterceptorService = _sheetInterceptorService;
    this._univerInstanceService = _univerInstanceService;
    this._sheetDataValidationModel = _sheetDataValidationModel;
    this._initSheetChange();
  }
  // eslint-disable-next-line max-lines-per-function
  _initSheetChange() {
    this.disposeWithMe(
      this._sheetInterceptorService.interceptCommand({
        // eslint-disable-next-line max-lines-per-function
        getMutations: (commandInfo) => {
          var _a;
          if (commandInfo.id === RemoveSheetCommand.id) {
            const params = commandInfo.params;
            const unitId = params.unitId || this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET).getUnitId();
            const workbook = this._univerInstanceService.getUniverSheetInstance(unitId);
            if (!workbook) {
              return { redos: [], undos: [] };
            }
            const subUnitId = params.subUnitId || ((_a = workbook.getActiveSheet()) == null ? void 0 : _a.getSheetId());
            if (!subUnitId) {
              return { redos: [], undos: [] };
            }
            const rules = this._sheetDataValidationModel.getRules(unitId, subUnitId);
            if (rules.length === 0) {
              return { redos: [], undos: [] };
            }
            const ids = rules.map((i) => i.uid);
            const redoParams = {
              unitId,
              subUnitId,
              ruleId: ids,
              source: "patched"
            };
            const undoParams = {
              unitId,
              subUnitId,
              rule: [...rules],
              source: "patched"
            };
            return {
              redos: [{
                id: RemoveDataValidationMutation.id,
                params: redoParams
              }],
              undos: [{
                id: AddDataValidationMutation.id,
                params: undoParams
              }]
            };
          } else if (commandInfo.id === CopySheetCommand.id) {
            const params = commandInfo.params;
            const { unitId, subUnitId, targetSubUnitId } = params;
            if (!unitId || !subUnitId || !targetSubUnitId) {
              return { redos: [], undos: [] };
            }
            const rules = this._sheetDataValidationModel.getRules(unitId, subUnitId);
            if (rules.length === 0) {
              return { redos: [], undos: [] };
            }
            const newRules = rules.map((rule) => {
              const newRule = { ...rule, uid: generateRandomId(6) };
              return newRule;
            });
            return {
              redos: [
                {
                  id: AddDataValidationMutation.id,
                  params: {
                    unitId,
                    subUnitId: targetSubUnitId,
                    rule: newRules,
                    source: "patched"
                  }
                }
              ],
              undos: [
                {
                  id: RemoveDataValidationMutation.id,
                  params: {
                    unitId,
                    subUnitId: targetSubUnitId,
                    ruleId: newRules.map((r) => r.uid),
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
SheetDataValidationSheetController = __decorateClass([
  __decorateParam(0, Inject(SheetInterceptorService)),
  __decorateParam(1, Inject(IUniverInstanceService)),
  __decorateParam(2, Inject(SheetDataValidationModel))
], SheetDataValidationSheetController);

// ../packages/sheets-data-validation/src/validators/any-validator.ts
var AnyValidator = class extends BaseDataValidator {
  constructor() {
    super(...arguments);
    __publicField(this, "id", "any" /* ANY */);
    __publicField(this, "title", "dataValidation.any.title");
    __publicField(this, "operators", []);
    __publicField(this, "scopes", ["sheet"]);
    __publicField(this, "order", 0);
    __publicField(this, "offsetFormulaByRange", false);
  }
  async parseFormula(rule, unitId, subUnitId) {
    return {
      formula1: rule.formula1,
      formula2: rule.formula2,
      isFormulaValid: true
    };
  }
  validatorFormula(rule, unitId, subUnitId) {
    return {
      success: true
    };
  }
  async isValidType(cellInfo, formula, rule) {
    return true;
  }
  generateRuleErrorMessage(rule) {
    return this.localeService.t("dataValidation.any.error");
  }
};

// ../packages/sheets-data-validation/src/validators/custom-validator.ts
var CustomFormulaValidator = class extends BaseDataValidator {
  constructor() {
    super(...arguments);
    __publicField(this, "id", "custom" /* CUSTOM */);
    __publicField(this, "title", "dataValidation.custom.title");
    __publicField(this, "operators", []);
    __publicField(this, "scopes", ["sheet"]);
    __publicField(this, "order", 60);
    __publicField(this, "_customFormulaService", this.injector.get(DataValidationCustomFormulaService));
    __publicField(this, "_lexerTreeBuilder", this.injector.get(LexerTreeBuilder));
  }
  validatorFormula(rule, unitId, subUnitId) {
    var _a;
    const success = isFormulaString(rule.formula1);
    const formulaText = (_a = rule.formula1) != null ? _a : "";
    const result = this._lexerTreeBuilder.checkIfAddBracket(formulaText);
    const valid = result === 0 && formulaText.startsWith("=" /* EQUALS */);
    return {
      success: success && valid,
      formula1: success && valid ? "" : this.localeService.t("dataValidation.validFail.formula")
    };
  }
  async parseFormula(_rule, _unitId, _subUnitId) {
    return {
      formula1: void 0,
      formula2: void 0,
      isFormulaValid: true
    };
  }
  async isValidType(cellInfo, _formula, _rule) {
    const { column, row, unitId, subUnitId } = cellInfo;
    const cellData = await this._customFormulaService.getCellFormulaValue(unitId, subUnitId, _rule.uid, row, column);
    const formulaResult = cellData == null ? void 0 : cellData.v;
    if (!isLegalFormulaResult(String(formulaResult))) {
      return false;
    }
    if (Tools.isDefine(formulaResult) && formulaResult !== "") {
      if (cellData.t === 3 /* BOOLEAN */) {
        return Boolean(formulaResult);
      }
      if (typeof formulaResult === "boolean") {
        return formulaResult;
      }
      if (typeof formulaResult === "number") {
        return Boolean(formulaResult);
      }
      if (typeof formulaResult === "string") {
        return isLegalFormulaResult(formulaResult);
      }
      return Boolean(formulaResult);
    }
    return false;
  }
  generateRuleErrorMessage(rule) {
    return this.localeService.t("dataValidation.custom.error");
  }
  generateRuleName(rule) {
    var _a;
    return this.localeService.t("dataValidation.custom.ruleName").replace("{FORMULA1}", (_a = rule.formula1) != null ? _a : "");
  }
};

// ../packages/sheets-data-validation/src/validators/list-multiple-validator.ts
var ListMultipleValidator = class extends ListValidator {
  constructor() {
    super(...arguments);
    __publicField(this, "id", "listMultiple" /* LIST_MULTIPLE */);
    __publicField(this, "title", "dataValidation.listMultiple.title");
    __publicField(this, "offsetFormulaByRange", false);
    __publicField(this, "skipDefaultFontRender", () => {
      return true;
    });
  }
};

// ../packages/sheets-data-validation/src/validators/whole-validator.ts
var WholeValidator = class extends BaseDataValidator {
  constructor() {
    super(...arguments);
    __publicField(this, "_customFormulaService", this.injector.get(DataValidationCustomFormulaService));
    __publicField(this, "_lexerTreeBuilder", this.injector.get(LexerTreeBuilder));
    __publicField(this, "id", "whole" /* WHOLE */);
    __publicField(this, "title", "dataValidation.whole.title");
    __publicField(this, "order", 10);
    __publicField(this, "operators", [
      "between" /* BETWEEN */,
      "equal" /* EQUAL */,
      "greaterThan" /* GREATER_THAN */,
      "greaterThanOrEqual" /* GREATER_THAN_OR_EQUAL */,
      "lessThan" /* LESS_THAN */,
      "lessThanOrEqual" /* LESS_THAN_OR_EQUAL */,
      "notBetween" /* NOT_BETWEEN */,
      "notEqual" /* NOT_EQUAL */
    ]);
    __publicField(this, "scopes", ["sheet"]);
  }
  _isFormulaOrInt(formula) {
    return !Tools.isBlank(formula) && (isFormulaString(formula) || !Number.isNaN(+formula) && Number.isInteger(+formula));
  }
  async isValidType(cellInfo, _formula, _rule) {
    const { value: cellValue } = cellInfo;
    const num = getCellValueNumber(cellValue);
    return !Number.isNaN(num) && Number.isInteger(num);
  }
  transform(cellInfo, _formula, _rule) {
    const { value: cellValue } = cellInfo;
    return {
      ...cellInfo,
      value: getCellValueNumber(cellValue)
    };
  }
  _parseNumber(formula) {
    if (formula === void 0 || formula === null) {
      return Number.NaN;
    }
    return +formula;
  }
  async parseFormula(rule, unitId, subUnitId, row, column) {
    const res1 = await this._customFormulaService.getCellFormulaValue(unitId, subUnitId, rule.uid, row, column);
    const res2 = await this._customFormulaService.getCellFormula2Value(unitId, subUnitId, rule.uid, row, column);
    const { formula1, formula2 } = rule;
    const formula1Result = isFormulaString(formula1) ? res1 == null ? void 0 : res1.v : formula1;
    const formula2Result = isFormulaString(formula2) ? res2 == null ? void 0 : res2.v : formula2;
    const isFormulaValid = isLegalFormulaResult(`${formula1Result}`) && isLegalFormulaResult(`${formula2Result}`);
    const info = {
      formula1: this._parseNumber(formula1Result),
      formula2: this._parseNumber(formula2Result),
      isFormulaValid
    };
    return info;
  }
  validatorFormula(rule, _unitId, _subUnitId) {
    const operator = rule.operator;
    if (!operator) {
      return {
        success: true
      };
    }
    const formula1Success = Tools.isDefine(rule.formula1) && this._isFormulaOrInt(rule.formula1);
    const formula2Success = Tools.isDefine(rule.formula2) && this._isFormulaOrInt(rule.formula2);
    const isTwoFormula = TWO_FORMULA_OPERATOR_COUNT2.includes(operator);
    const errorMsg = this.localeService.t("dataValidation.validFail.number");
    if (isTwoFormula) {
      return {
        success: formula1Success && formula2Success,
        formula1: formula1Success ? void 0 : errorMsg,
        formula2: formula2Success ? void 0 : errorMsg
      };
    }
    return {
      success: formula1Success,
      formula1: errorMsg
    };
  }
  generateRuleErrorMessage(rule, position) {
    if (!rule.operator) {
      return this.localeService.t(OperatorErrorTitleMap2.NONE).replace("{TYPE}", this.titleStr);
    }
    const { transformedFormula1, transformedFormula2 } = getTransformedFormula(this._lexerTreeBuilder, rule, position);
    const errorMsg = this.localeService.t(OperatorErrorTitleMap2[rule.operator]).replace(FORMULA12, transformedFormula1 != null ? transformedFormula1 : "").replace(FORMULA22, transformedFormula2 != null ? transformedFormula2 : "");
    return `${errorMsg}`;
  }
};

// ../packages/sheets-data-validation/src/controllers/dv.controller.ts
var DataValidationController = class extends RxDisposable {
  constructor(_univerInstanceService, _dataValidatorRegistryService, _injector, _selectionManagerService, _sheetInterceptorService, _sheetDataValidationModel) {
    super();
    this._univerInstanceService = _univerInstanceService;
    this._dataValidatorRegistryService = _dataValidatorRegistryService;
    this._injector = _injector;
    this._selectionManagerService = _selectionManagerService;
    this._sheetInterceptorService = _sheetInterceptorService;
    this._sheetDataValidationModel = _sheetDataValidationModel;
    this._init();
  }
  _init() {
    this._registerValidators();
    this._initCommandInterceptor();
  }
  _registerValidators() {
    [
      AnyValidator,
      DecimalValidator,
      WholeValidator,
      TextLengthValidator,
      DateValidator,
      CheckboxValidator,
      ListValidator,
      ListMultipleValidator,
      CustomFormulaValidator
    ].forEach((Validator) => {
      const validator = this._injector.createInstance(Validator);
      this.disposeWithMe(this._dataValidatorRegistryService.register(validator));
      this.disposeWithMe(toDisposable(() => this._injector.delete(Validator)));
    });
  }
  _initCommandInterceptor() {
    this._sheetInterceptorService.interceptCommand({
      getMutations: (commandInfo) => {
        var _a;
        if (commandInfo.id === ClearSelectionAllCommand.id) {
          const workbook = this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET);
          const unitId = workbook.getUnitId();
          const worksheet = workbook.getActiveSheet();
          if (!worksheet) {
            throw new Error("No active sheet found");
          }
          const subUnitId = worksheet.getSheetId();
          const selections = (_a = this._selectionManagerService.getCurrentSelections()) == null ? void 0 : _a.map((s) => s.range);
          const ruleMatrix = this._sheetDataValidationModel.getRuleObjectMatrix(unitId, subUnitId).clone();
          if (selections) {
            ruleMatrix.removeRange(selections);
          }
          const diffs = ruleMatrix.diff(this._sheetDataValidationModel.getRules(unitId, subUnitId));
          const { redoMutations, undoMutations } = getDataValidationDiffMutations(unitId, subUnitId, diffs, this._injector, "patched");
          return {
            undos: undoMutations,
            redos: redoMutations
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
DataValidationController = __decorateClass([
  __decorateParam(0, IUniverInstanceService),
  __decorateParam(1, Inject(DataValidatorRegistryService)),
  __decorateParam(2, Inject(Injector)),
  __decorateParam(3, Inject(SheetsSelectionsService)),
  __decorateParam(4, Inject(SheetInterceptorService)),
  __decorateParam(5, Inject(SheetDataValidationModel))
], DataValidationController);

// ../packages/sheets-data-validation/src/services/dv-validator-service.ts
var SheetsDataValidationValidatorService = class extends Disposable {
  constructor(_univerInstanceService, _sheetDataValidationModel, _dataValidationCacheService, _lifecycleService) {
    super();
    this._univerInstanceService = _univerInstanceService;
    this._sheetDataValidationModel = _sheetDataValidationModel;
    this._dataValidationCacheService = _dataValidationCacheService;
    this._lifecycleService = _lifecycleService;
    this._initRecalculate();
  }
  _initRecalculate() {
    const handleDirtyRanges = (ranges) => {
      if (ranges.length === 0) {
        return;
      }
      const workbook = this._univerInstanceService.getCurrentUnitForType(O.UNIVER_SHEET);
      const worksheet = workbook == null ? void 0 : workbook.getActiveSheet();
      const map = {};
      ranges.flat().forEach((range) => {
        if (!map[range.unitId]) {
          map[range.unitId] = {};
        }
        if (!map[range.unitId][range.subUnitId]) {
          map[range.unitId][range.subUnitId] = [];
        }
        const workbook2 = this._univerInstanceService.getUnit(range.unitId, O.UNIVER_SHEET);
        const worksheet2 = workbook2 == null ? void 0 : workbook2.getSheetBySheetId(range.subUnitId);
        if (!worksheet2) {
          return;
        }
        map[range.unitId][range.subUnitId].push(...range.ranges.map((range2) => Range.transformRange(range2, worksheet2)));
      });
      Object.entries(map).forEach(([unitId, subUnitMap]) => {
        Object.entries(subUnitMap).forEach(([subUnitId, ranges2]) => {
          if ((workbook == null ? void 0 : workbook.getUnitId()) === unitId && (worksheet == null ? void 0 : worksheet.getSheetId()) === subUnitId) {
            this.validatorRanges(unitId, subUnitId, ranges2);
          } else {
            requestIdleCallback(() => {
              this.validatorRanges(unitId, subUnitId, ranges2);
            });
          }
        });
      });
    };
    this.disposeWithMe(this._dataValidationCacheService.dirtyRanges$.pipe(bufferWhen(() => this._lifecycleService.lifecycle$.pipe(filter((stage) => stage === 2 /* Rendered */)))).subscribe(handleDirtyRanges));
    this.disposeWithMe(this._dataValidationCacheService.dirtyRanges$.pipe(filter(() => this._lifecycleService.stage >= 2 /* Rendered */), bufferDebounceTime(20)).subscribe(handleDirtyRanges));
  }
  async _validatorByCell(workbook, worksheet, row, col) {
    const unitId = workbook.getUnitId();
    const subUnitId = worksheet.getSheetId();
    if (!Tools.isDefine(row) || !Tools.isDefine(col)) {
      throw new Error(`row or col is not defined, row: ${row}, col: ${col}`);
    }
    let _row = row;
    let _col = col;
    const mergedCell = worksheet.getMergedCell(row, col);
    if (mergedCell) {
      _row = mergedCell.startRow;
      _col = mergedCell.startColumn;
    }
    const rule = this._sheetDataValidationModel.getRuleByLocation(unitId, subUnitId, _row, _col);
    if (!rule) {
      return "valid" /* VALID */;
    }
    return new Promise((resolve) => {
      this._sheetDataValidationModel.validator(rule, { unitId, subUnitId, row: _row, col: _col, worksheet, workbook }, (status) => {
        resolve(status);
      });
    });
  }
  async validatorCell(unitId, subUnitId, row, col) {
    const workbook = this._univerInstanceService.getUnit(unitId, O.UNIVER_SHEET);
    if (!workbook) {
      throw new Error(`cannot find current workbook, unitId: ${unitId}`);
    }
    const worksheet = workbook.getSheetBySheetId(subUnitId);
    if (!worksheet) {
      throw new Error(`cannot find current worksheet, sheetId: ${subUnitId}`);
    }
    return this._validatorByCell(workbook, worksheet, row, col);
  }
  async validatorRanges(unitId, subUnitId, ranges) {
    if (!ranges.length) {
      return Promise.resolve([]);
    }
    const workbook = this._univerInstanceService.getUnit(unitId, O.UNIVER_SHEET);
    if (!workbook) {
      throw new Error(`cannot find current workbook, unitId: ${unitId}`);
    }
    const worksheet = workbook.getSheetBySheetId(subUnitId);
    if (!worksheet) {
      throw new Error(`cannot find current worksheet, sheetId: ${subUnitId}`);
    }
    const allRules = this._sheetDataValidationModel.getRules(unitId, subUnitId);
    const ruleRanges = allRules.map((i) => i.ranges).flat();
    const intersectRanges = ranges.map((range) => ruleRanges.map((ruleRange) => getIntersectRange(range, ruleRange))).flat().filter(Boolean);
    const mergeCells = [];
    const result = await Promise.all(
      intersectRanges.map((range, resultRowIndex) => {
        const promises = [];
        for (let row = range.startRow; row <= range.endRow; row++) {
          for (let col = range.startColumn; col <= range.endColumn; col++) {
            promises.push(this._validatorByCell(workbook, worksheet, row, col));
            const mergedCell = worksheet.getMergedCell(row, col);
            if (mergedCell) {
              mergeCells.push({
                resultRowIndex,
                resultColIndex: promises.length - 1,
                row: mergedCell.startRow,
                col: mergedCell.startColumn
              });
            }
          }
        }
        return Promise.all(promises);
      })
    );
    if (mergeCells.length) {
      mergeCells.forEach(({ resultRowIndex, resultColIndex, row, col }) => {
        var _a;
        if (result[resultRowIndex][resultColIndex] === "validating" /* VALIDATING */) {
          result[resultRowIndex][resultColIndex] = (_a = this._dataValidationCacheService.getValue(unitId, subUnitId, row, col)) != null ? _a : "valid" /* VALID */;
        }
      });
    }
    return result;
  }
  async validatorWorksheet(unitId, subUnitId) {
    const workbook = this._univerInstanceService.getUnit(unitId, O.UNIVER_SHEET);
    if (!workbook) {
      throw new Error(`cannot find current workbook, unitId: ${unitId}`);
    }
    const worksheet = workbook.getSheetBySheetId(subUnitId);
    if (!worksheet) {
      throw new Error(`cannot find current worksheet, sheetId: ${subUnitId}`);
    }
    const rules = this._sheetDataValidationModel.getRules(unitId, subUnitId);
    await Promise.all(
      rules.map((rule) => {
        return Promise.all(
          rule.ranges.map((range) => {
            const promises = [];
            Range.foreach(range, (row, col) => {
              promises.push(this._validatorByCell(workbook, worksheet, row, col));
            });
            return Promise.all(promises);
          })
        );
      })
    );
    return this._dataValidationCacheService.ensureCache(unitId, subUnitId);
  }
  async validatorWorkbook(unitId) {
    const sheetIds = this._sheetDataValidationModel.getSubUnitIds(unitId);
    const results = await Promise.all(sheetIds.map((id) => this.validatorWorksheet(unitId, id)));
    const map = {};
    results.forEach((result, i) => {
      map[sheetIds[i]] = result;
    });
    return map;
  }
  getDataValidations(unitId, subUnitId, ranges) {
    const ruleMatrix = this._sheetDataValidationModel.getRuleObjectMatrix(unitId, subUnitId);
    const ruleIdSet = /* @__PURE__ */ new Set();
    ranges.forEach((range) => {
      Range.foreach(range, (row, col) => {
        const ruleId = ruleMatrix.getValue(row, col);
        if (ruleId) {
          ruleIdSet.add(ruleId);
        }
      });
    });
    const rules = Array.from(ruleIdSet).map((id) => this._sheetDataValidationModel.getRuleById(unitId, subUnitId, id)).filter(Boolean);
    return rules;
  }
  getDataValidation(unitId, subUnitId, ranges) {
    return this.getDataValidations(unitId, subUnitId, ranges)[0];
  }
};
SheetsDataValidationValidatorService = __decorateClass([
  __decorateParam(0, IUniverInstanceService),
  __decorateParam(1, Inject(SheetDataValidationModel)),
  __decorateParam(2, Inject(DataValidationCacheService)),
  __decorateParam(3, Inject(LifecycleService))
], SheetsDataValidationValidatorService);

// ../packages/sheets-data-validation/src/plugin.ts
var UniverSheetsDataValidationPlugin = class extends Plugin {
  constructor(_config = defaultPluginConfig2, _injector, _commandService, _configService) {
    super();
    this._config = _config;
    this._injector = _injector;
    this._commandService = _commandService;
    this._configService = _configService;
    const { ...rest } = merge_default(
      {},
      defaultPluginConfig2,
      this._config
    );
    this._configService.setConfig(SHEETS_DATA_VALIDATION_PLUGIN_CONFIG_KEY, rest);
  }
  onStarting() {
    [
      [DataValidationCacheService],
      [DataValidationListCacheService],
      [DataValidationFormulaService],
      [DataValidationCustomFormulaService],
      [SheetsDataValidationValidatorService],
      [SheetDataValidationModel],
      [DataValidationController],
      [DataValidationFormulaController],
      [SheetDataValidationSheetController],
      [DataValidationRefRangeController],
      [DataValidationFormulaRefRangeController]
    ].forEach((dep) => {
      this._injector.add(dep);
    });
    [
      AddSheetDataValidationCommand,
      UpdateSheetDataValidationRangeCommand,
      UpdateSheetDataValidationSettingCommand,
      UpdateSheetDataValidationOptionsCommand,
      RemoveSheetDataValidationCommand,
      RemoveSheetAllDataValidationCommand,
      ClearRangeDataValidationCommand
    ].forEach((command) => {
      this._commandService.registerCommand(command);
    });
    this._injector.get(DataValidationCacheService);
    this._injector.get(SheetsDataValidationValidatorService);
    this._injector.get(DataValidationController);
    this._injector.get(DataValidationFormulaRefRangeController);
    this._injector.get(DataValidationRefRangeController);
  }
  onReady() {
    this._injector.get(SheetDataValidationSheetController);
  }
  onRendered() {
    this._injector.get(DataValidationFormulaController);
  }
};
__publicField(UniverSheetsDataValidationPlugin, "pluginName", DATA_VALIDATION_PLUGIN_NAME2);
__publicField(UniverSheetsDataValidationPlugin, "type", O.UNIVER_SHEET);
UniverSheetsDataValidationPlugin = __decorateClass([
  DependentOn(UniverDataValidationPlugin),
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, ICommandService),
  __decorateParam(3, IConfigService)
], UniverSheetsDataValidationPlugin);

// ../packages/sheets-data-validation/src/utils/create.ts
function createDefaultNewRule(accessor) {
  const selectionManagerService = accessor.get(SheetsSelectionsService);
  const currentRanges = selectionManagerService.getCurrentSelections().map((s) => s.range);
  const uid = generateRandomId(6);
  const rule = {
    uid,
    type: "decimal" /* DECIMAL */,
    operator: "equal" /* EQUAL */,
    formula1: "100",
    ranges: currentRanges != null ? currentRanges : [{ startColumn: 0, endColumn: 0, startRow: 0, endRow: 0 }]
  };
  return rule;
}

// ../packages/sheets-data-validation/src/index.ts
var CUSTOM_FORMULA_INPUT_NAME = "data-validation.custom-formula-input";
var BASE_FORMULA_INPUT_NAME = "data-validation.formula-input";
var LIST_FORMULA_INPUT_NAME = "data-validation.list-formula-input";
var CHECKBOX_FORMULA_INPUT_NAME = "data-validation.checkbox-formula-input";

export {
  getRuleSetting,
  getRuleOptions,
  DataValidationModel,
  DataValidatorRegistryService,
  TWO_FORMULA_OPERATOR_COUNT,
  DataValidationCacheService,
  getFormulaResult,
  isLegalFormulaResult,
  getCellValueOrigin,
  serializeListOptions,
  deserializeListOptions,
  getDataValidationCellValue,
  DataValidationFormulaService,
  SheetDataValidationModel,
  CHECKBOX_FORMULA_1,
  CHECKBOX_FORMULA_2,
  transformCheckboxValue,
  getDataValidationDiffMutations,
  UpdateSheetDataValidationRangeCommand,
  AddSheetDataValidationCommand,
  UpdateSheetDataValidationSettingCommand,
  UpdateSheetDataValidationOptionsCommand,
  ClearRangeDataValidationCommand,
  RemoveSheetAllDataValidationCommand,
  RemoveSheetDataValidationCommand,
  DATA_VALIDATION_PLUGIN_NAME2 as DATA_VALIDATION_PLUGIN_NAME,
  DataValidationFormulaController,
  SheetsDataValidationValidatorService,
  UniverSheetsDataValidationPlugin,
  createDefaultNewRule,
  CUSTOM_FORMULA_INPUT_NAME,
  BASE_FORMULA_INPUT_NAME,
  LIST_FORMULA_INPUT_NAME,
  CHECKBOX_FORMULA_INPUT_NAME
};
//# sourceMappingURL=chunk-ZB3FDSA3.js.map
