import { ICellData } from '@univerjs/core';
export declare const DOC_FORMULA_RESOURCE_KEY = "DOC_FORMULA_RESOURCE";
/**
 * This interface represents a single formula entity in a Univer Doc.
 */
export interface IDocFormulaData {
    /** Id of this formula. It should be unique in a single document, and bound to the custom range's id. */
    rangeId: string;
    /**
     * Raw formula string. For example `=SUM(A1:B4)`.
     */
    f: string;
    /**
     * Formula calculation result.
     */
    v?: ICellData['v'];
    /**
     * Formula calculation format.
     */
    t?: ICellData['t'];
}
export interface IDocFormulaReference extends IDocFormulaData {
    unitId: string;
    /** Formula id assigned by the formula engine. It should not be written to snapshot. */
    formulaId: string;
}
export interface IDocFormulaCache extends Pick<ICellData, 'v' | 't'> {
}
export declare function toJson(formulas: IDocFormulaReference[]): string;
