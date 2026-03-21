import { IUnitRange, Disposable, IConfigService } from '@univerjs/core';
import { Observable, Subject } from 'rxjs';
import { IFeatureDirtyRangeType, IFormulaDatasetConfig, IFormulaExecuteResultMap, IFormulaStringMap, IRuntimeUnitDataType, IUnitRowData } from '../basics/common';
import { IFormulaDependencyTreeFullJson, IFormulaDependencyTreeJson } from '../engine/dependency/dependency-tree';
import { FunctionVariantType } from '../engine/reference-object/base-reference-object';
import { IAllRuntimeData, IExecutionInProgressParams, IFormulaRuntimeService } from './runtime.service';
import { Lexer } from '../engine/analysis/lexer';
import { AstTreeBuilder } from '../engine/analysis/parser';
import { IFormulaDependencyGenerator } from '../engine/dependency/formula-dependency';
import { Interpreter } from '../engine/interpreter/interpreter';
import { IFormulaCurrentConfigService } from './current-data.service';
export declare const DEFAULT_INTERVAL_COUNT = 500;
export declare const CYCLE_REFERENCE_COUNT = "cycleReferenceCount";
export declare const EVERY_N_FUNCTION_EXECUTION_PAUSE = 100;
export interface ICalculateFormulaService {
    readonly executionInProgressListener$: Observable<IExecutionInProgressParams>;
    readonly executionCompleteListener$: Observable<IAllRuntimeData>;
    setRuntimeFeatureCellData(featureId: string, featureData: IRuntimeUnitDataType): void;
    setRuntimeFeatureRange(featureId: string, featureRange: IFeatureDirtyRangeType): void;
    execute(formulaDatasetConfig: IFormulaDatasetConfig): Promise<void>;
    stopFormulaExecution(): void;
    calculate(formulaString: string, transformSuffix?: boolean): void;
    executeFormulas(formulas: IFormulaStringMap, rowData?: IUnitRowData): Promise<IFormulaExecuteResultMap>;
    getAllDependencyJson(rowData?: IUnitRowData): Promise<IFormulaDependencyTreeJson[]>;
    getCellDependencyJson(unitId: string, sheetId: string, row: number, column: number, rowData?: IUnitRowData): Promise<IFormulaDependencyTreeFullJson | undefined>;
    getRangeDependents(unitRanges: IUnitRange[]): Promise<IFormulaDependencyTreeJson[]>;
    getInRangeFormulas(unitRanges: IUnitRange[]): Promise<IFormulaDependencyTreeJson[]>;
}
export declare const ICalculateFormulaService: import('@wendellhu/redi').IdentifierDecorator<ICalculateFormulaService>;
export declare class CalculateFormulaService extends Disposable implements ICalculateFormulaService {
    protected readonly _configService: IConfigService;
    protected readonly _lexer: Lexer;
    protected readonly _currentConfigService: IFormulaCurrentConfigService;
    protected readonly _runtimeService: IFormulaRuntimeService;
    protected readonly _formulaDependencyGenerator: IFormulaDependencyGenerator;
    protected readonly _interpreter: Interpreter;
    protected readonly _astTreeBuilder: AstTreeBuilder;
    protected readonly _executionInProgressListener$: Subject<IExecutionInProgressParams>;
    readonly executionInProgressListener$: Observable<IExecutionInProgressParams>;
    protected readonly _executionCompleteListener$: Subject<IAllRuntimeData>;
    readonly executionCompleteListener$: Observable<IAllRuntimeData>;
    private _executeLock;
    constructor(_configService: IConfigService, _lexer: Lexer, _currentConfigService: IFormulaCurrentConfigService, _runtimeService: IFormulaRuntimeService, _formulaDependencyGenerator: IFormulaDependencyGenerator, _interpreter: Interpreter, _astTreeBuilder: AstTreeBuilder);
    dispose(): void;
    /**
     * Stop the execution of the formula.
     */
    stopFormulaExecution(): void;
    /**
     * When the feature is loading,
     * the pre-calculated content needs to be input to the formula engine in advance,
     * so that the formula can read the correct values.
     * @param featureId
     * @param featureData
     */
    setRuntimeFeatureCellData(featureId: string, featureData: IRuntimeUnitDataType): void;
    setRuntimeFeatureRange(featureId: string, featureRange: IFeatureDirtyRangeType): void;
    execute(formulaDatasetConfig: IFormulaDatasetConfig): Promise<void>;
    private _executeStep;
    private _getArrayFormulaDirtyRangeAndExcludedRange;
    protected _apply(isArrayFormulaState?: boolean): Promise<IAllRuntimeData | undefined>;
    executeFormulas(formulas: IFormulaStringMap, rowData?: IUnitRowData): Promise<IFormulaExecuteResultMap>;
    calculate(formulaString: string): Promise<FunctionVariantType | undefined>;
    getAllDependencyJson(): Promise<IFormulaDependencyTreeJson[]>;
    getCellDependencyJson(unitId: string, sheetId: string, row: number, column: number): Promise<IFormulaDependencyTreeFullJson | undefined>;
    getRangeDependents(unitRanges: IUnitRange[]): Promise<IFormulaDependencyTreeJson[]>;
    getInRangeFormulas(unitRanges: IUnitRange[]): Promise<IFormulaDependencyTreeJson[]>;
}
