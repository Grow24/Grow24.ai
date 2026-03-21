import { ICommand } from '@univerjs/core';
export interface IAddDocUniFormulaCommandParams {
    unitId: string;
    startIndex: number;
    f: string;
}
export declare const AddDocUniFormulaCommand: ICommand<IAddDocUniFormulaCommandParams>;
export interface IUpdateDocUniFormulaCommandParams {
    unitId: string;
    rangeId: string;
    f: string;
}
export declare const UpdateDocUniFormulaCommand: ICommand<IUpdateDocUniFormulaCommandParams>;
export interface IRemoveDocUniFormulaCommandParams {
    unitId: string;
    rangeId: string;
}
export declare const RemoveDocUniFormulaCommand: ICommand<IRemoveDocUniFormulaCommandParams>;
