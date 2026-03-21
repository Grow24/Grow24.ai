import { ICommand } from '@univerjs/core';
import { IDocPopup } from '../../services/doc-quick-insert-popup.service';
export interface IShowQuickInsertPopupOperationParams {
    unitId: string;
    index: number;
    popup: IDocPopup;
}
export declare const ShowQuickInsertPopupOperation: ICommand<IShowQuickInsertPopupOperationParams>;
export declare const CloseQuickInsertPopupOperation: ICommand;
