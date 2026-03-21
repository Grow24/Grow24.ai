import { ICellData, IDisposable, Nullable, Disposable, ICommandService, IResourceManagerService, IUniverInstanceService } from '@univerjs/core';
import { IDocFormulaCache, IDocFormulaReference } from '../models/doc-formula';
import { ISlideFormulaReference } from '../models/slide-formula';
export interface IUniFormulaService {
    updateDocFormulaResults(unitId: string, formulaIds: string[], v: IDocFormulaCache[]): boolean;
    updateSlideFormulaResults(unitId: string, pageId: string, elementId: string, formulaId: string, v: IDocFormulaCache): boolean;
    hasDocFormula(unitId: string, formulaId: string): boolean;
    getDocFormula(unitId: string, rangeId: string): Nullable<IDocFormulaReference>;
    registerDocFormula(unitId: string, rangeId: string, f: string, v: ICellData['v'], t: ICellData['t']): IDisposable;
    unregisterDocFormula(unitId: string, rangeId: string): void;
    hasSlideFormula(unitId: string, pageId: string, elementId: string, formulaId: string): boolean;
    getSlideFormula(unitId: string, pageId: string, elementId: string, formulaId: string): Nullable<ISlideFormulaReference>;
    registerSlideFormula(unitId: string, pageId: string, elementId: string, f: string, v: ICellData['v'], t: ICellData['t']): IDisposable;
    unregisterSlideFormula(unitId: string, pageId: string, elementId: string, formulaId: string): void;
}
export declare const IUniFormulaService: import('@wendellhu/redi').IdentifierDecorator<IUniFormulaService>;
export declare class DumbUniFormulaService extends Disposable implements IUniFormulaService {
    protected readonly _commandSrv: ICommandService;
    protected readonly _instanceSrv: IUniverInstanceService;
    protected readonly _docFormulas: Map<string, IDocFormulaReference>;
    protected readonly _slideFormulas: Map<string, ISlideFormulaReference>;
    constructor(resourceManagerSrv: IResourceManagerService, _commandSrv: ICommandService, _instanceSrv: IUniverInstanceService);
    hasDocFormula(unitId: string, formulaId: string): boolean;
    getDocFormula(unitId: string, rangeId: string): Nullable<IDocFormulaReference>;
    updateDocFormulaResults(unitId: string, formulaIds: string[], v: IDocFormulaCache[]): boolean;
    /**
     * Register a doc formula into the formula system.
     */
    registerDocFormula(unitId: string, rangeId: string, f: string, v: ICellData['v'], t: ICellData['t']): IDisposable;
    unregisterDocFormula(unitId: string, rangeId: string): void;
    updateSlideFormulaResults(unitId: string, pageId: string, elementId: string, formulaId: string, v: IDocFormulaCache): boolean;
    private _initDocFormulaResources;
    /**
     * Remove all formulas under a doc.
     */
    private _unregisterDoc;
    registerSlideFormula(unitId: string, pageId: string, elementId: string, rangeId: string, f: string, v: ICellData['v'], t: ICellData['t']): IDisposable;
    hasSlideFormula(unitId: string, pageId: string, elementId: string, formulaId: string): boolean;
    getSlideFormula(unitId: string, pageId: string, elementId: string, formulaId: string): Nullable<ISlideFormulaReference>;
    unregisterSlideFormula(unitId: string, pageId: string, elementId: string, formulaId: string): void;
    private _getAllFormulasOfUnit;
}
export declare function getPseudoDocUnitKey(unitId: string): string;
export declare function getDocFormulaKey(unitId: string, formulaId: string): string;
