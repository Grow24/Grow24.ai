import { ICellData } from '@univerjs/core';
export interface ISlideFormulaData {
    rangeId: string;
    f: string;
    v?: ICellData['v'];
    t?: ICellData['t'];
}
export interface ISlideFormulaReference extends ISlideFormulaData {
    unitId: string;
    pageId: string;
    elementId: string;
    formulaId: string;
}
export interface ISlideFormulaCache extends Pick<ICellData, 'v' | 't'> {
}
export declare function slideToJson(formulas: ISlideFormulaReference[]): string;
