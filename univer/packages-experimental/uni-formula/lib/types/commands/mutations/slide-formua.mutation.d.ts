import { IMutation } from '@univerjs/core';
export interface IAddSlideUniFormulaMutationParams {
    unitId: string;
    pageId: string;
    elementId: string;
    rangeId: string;
    f: string;
}
export declare const AddSlideUniFormulaMutation: IMutation<IAddSlideUniFormulaMutationParams>;
export interface IUpdateSlideUniFormulaMutationParams extends IAddSlideUniFormulaMutationParams {
}
export declare const UpdateSlideUniFormulaMutation: IMutation<IUpdateSlideUniFormulaMutationParams>;
