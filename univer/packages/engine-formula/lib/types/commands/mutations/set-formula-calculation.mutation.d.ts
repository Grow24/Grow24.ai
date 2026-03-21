import { IExecutionOptions, IMutation, IUnitRange, Nullable } from '@univerjs/core';
import { IFormulaExecuteResultMap, IFormulaStringMap, IRuntimeOtherUnitDataType, IRuntimeUnitDataPrimitiveType } from '../../basics/common';
import { IFormulaDependencyTreeFullJson, IFormulaDependencyTreeJson } from '../../engine/dependency/dependency-tree';
import { IFormulaDirtyData } from '../../services/current-data.service';
import { FormulaExecutedStateType, IExecutionInProgressParams } from '../../services/runtime.service';
export interface ISetFormulaCalculationStartMutation extends IFormulaDirtyData {
    options: Nullable<IExecutionOptions>;
}
export interface ISetFormulaStringBatchCalculationMutation {
    formulas: IFormulaStringMap;
}
export interface ISetFormulaStringBatchCalculationResultMutation {
    result: IFormulaExecuteResultMap;
}
export interface ISetFormulaStringBatchCalculationResultMutation {
    result: IFormulaExecuteResultMap;
}
export interface ISetFormulaDependencyCalculationMutation {
    unitId: string;
    sheetId: string;
    row: number;
    column: number;
}
export interface ISetFormulaDependencyCalculationResultMutation {
    result: IFormulaDependencyTreeJson[];
}
export interface ISetCellFormulaDependencyCalculationResultMutation {
    result: IFormulaDependencyTreeFullJson | undefined;
}
export interface ISetQueryFormulaDependencyMutation {
    unitRanges: IUnitRange[];
    isInRange?: boolean;
}
export interface ISetQueryFormulaDependencyResultMutation {
    result: IFormulaDependencyTreeJson[];
}
/**
 * TODO: @DR-Univer
 * Trigger the calculation of the formula and stop the formula
 */
export declare const SetFormulaCalculationStartMutation: IMutation<ISetFormulaCalculationStartMutation>;
export declare const SetFormulaStringBatchCalculationMutation: IMutation<ISetFormulaStringBatchCalculationMutation>;
export declare const SetFormulaStringBatchCalculationResultMutation: IMutation<ISetFormulaStringBatchCalculationResultMutation>;
export interface ISetFormulaCalculationStopMutation {
}
export declare const SetFormulaCalculationStopMutation: IMutation<ISetFormulaCalculationStopMutation>;
export interface ISetFormulaCalculationNotificationMutation {
    functionsExecutedState?: FormulaExecutedStateType;
    stageInfo?: IExecutionInProgressParams;
}
export declare const SetFormulaCalculationNotificationMutation: IMutation<ISetFormulaCalculationNotificationMutation>;
export interface ISetFormulaCalculationResultMutation {
    unitData: IRuntimeUnitDataPrimitiveType;
    unitOtherData: IRuntimeOtherUnitDataType;
}
export declare const SetFormulaCalculationResultMutation: IMutation<ISetFormulaCalculationResultMutation>;
export declare const SetFormulaDependencyCalculationMutation: IMutation<{}>;
export declare const SetFormulaDependencyCalculationResultMutation: IMutation<ISetFormulaDependencyCalculationResultMutation>;
export declare const SetCellFormulaDependencyCalculationMutation: IMutation<ISetFormulaDependencyCalculationMutation>;
export declare const SetCellFormulaDependencyCalculationResultMutation: IMutation<ISetCellFormulaDependencyCalculationResultMutation>;
export declare const SetQueryFormulaDependencyMutation: IMutation<ISetQueryFormulaDependencyMutation>;
export declare const SetQueryFormulaDependencyResultMutation: IMutation<ISetQueryFormulaDependencyResultMutation>;
