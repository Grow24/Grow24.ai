import { ICellData, ICommand, IDisposable, ICommandService, Injector, IResourceManagerService, IUniverInstanceService } from '@univerjs/core';
import { IDocFormulaCache, ISlideFormulaCache, DumbUniFormulaService, IUniFormulaService } from '@univerjs/uni-formula';
import { IDocPopupPosition, ISlidePopupPosition } from '../commands/operations/operation';
export interface IUpdateSlideUniFormulaCacheCommandParams {
    unitId: string;
    positions: ISlidePopupPosition[];
    cache: ISlideFormulaCache[];
}
export interface IUpdateDocUniFormulaCacheCommandParams {
    /** The doc in which formula results changed. */
    unitId: string;
    positions: ISlidePopupPosition[] | IDocPopupPosition[];
    /** Calculation results. */
    cache: IDocFormulaCache[];
}
export declare const UpdateSlideUniFormulaCacheCommand: ICommand<IUpdateSlideUniFormulaCacheCommandParams>;
/**
 * This command is internal. It should not be exposed to third-party developers.
 *
 * @ignore
 */
export declare const UpdateDocUniFormulaCacheCommand: ICommand<IUpdateDocUniFormulaCacheCommandParams>;
/**
 * This service provides methods for docs and slides to register a formula into Univer's formula system.
 * And it also manages formula resources fields of docs and slides. `SHEET_FORMULA_REMOTE_PLUGIN`
 * is not required but optional here.
 */
export declare class UniFormulaService extends DumbUniFormulaService implements IUniFormulaService {
    private readonly _injector;
    private readonly _formulaIdToKey;
    private _canPerformFormulaCalculation;
    private get _registerOtherFormulaSrv();
    private get _dataSyncPrimaryController();
    constructor(_injector: Injector, resourceManagerService: IResourceManagerService, commandSrv: ICommandService, instanceSrv: IUniverInstanceService);
    /**
     * Register a doc formula into the formula system.
     */
    registerDocFormula(unitId: string, rangeId: string, f: string, v: ICellData['v'], t: ICellData['t']): IDisposable;
    registerSlideFormula(unitId: string, pageId: string, elementId: string, rangeId: string, f: string, v: ICellData['v'], t: ICellData['t']): IDisposable;
    unregisterDocFormula(unitId: string, rangeId: string): void;
    unregisterSlideFormula(unitId: string, pageId: string, elementId: string, formulaId: string): void;
    private _initFormulaRegistration;
    private _dataSyncDisposables;
    private _checkSyncingUnit;
    private _resultSubscription;
    private _checkResultSubscription;
    private _checkDisposingResultSubscription;
    private _disposeResultSubscription;
}
