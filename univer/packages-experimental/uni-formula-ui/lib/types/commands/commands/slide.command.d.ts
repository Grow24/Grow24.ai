import { ICommand } from '@univerjs/core';
export interface IAddSlideUniFormulaCommandParams {
    unitId: string;
    pageId: string;
    elementId: string;
    startIndex: number;
    f: string;
}
export declare const AddSlideUniFormulaCommand: ICommand<IAddSlideUniFormulaCommandParams>;
