import { ICommand, IOperation } from '@univerjs/core';
export interface IDocPopupPosition {
    rangeId?: string;
}
export interface ISlidePopupPosition extends IDocPopupPosition {
    pageId: string;
    elementId: string;
}
export type IPopupPosition = IDocPopupPosition | ISlidePopupPosition;
export declare function isSlidePosition(position?: IPopupPosition): position is ISlidePopupPosition;
export interface IShowDocFormulaPopupOperationParams {
    unitId: string;
    startIndex: number;
    type?: 'new' | 'existing';
    position: IDocPopupPosition;
}
export interface IShowSlideFormulaPopupOPerationParams extends IShowDocFormulaPopupOperationParams {
    position: ISlidePopupPosition;
}
export type IShowFormulaPopupOperationParams = IShowDocFormulaPopupOperationParams | IShowSlideFormulaPopupOPerationParams;
export declare const ShowFormulaPopupOperation: IOperation<IShowFormulaPopupOperationParams>;
export declare const CloseFormulaPopupOperation: IOperation;
export declare const ConfirmFormulaPopupCommand: ICommand;
