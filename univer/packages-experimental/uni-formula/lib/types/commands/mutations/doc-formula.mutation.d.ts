import { IMutation } from '@univerjs/core';
export interface IAddDocUniFormulaMutationParams {
    unitId: string;
    rangeId: string;
    f: string;
}
export declare const AddDocUniFormulaMutation: IMutation<IAddDocUniFormulaMutationParams>;
export interface IUpdateDocUniFormulaMutationParams extends IAddDocUniFormulaMutationParams {
}
export declare const UpdateDocUniFormulaMutation: IMutation<IUpdateDocUniFormulaMutationParams>;
export interface IRemoveDocUniFormulaMutationParams {
    unitId: string;
    rangeId: string;
}
export declare const RemoveDocUniFormulaMutation: IMutation<IRemoveDocUniFormulaMutationParams>;
