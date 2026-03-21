import { ICommand } from '@univerjs/core';
export interface IShowMentionInfoPopupOperationParams {
    unitId: string;
    mentionId: string;
}
export declare const ShowMentionInfoPopupOperation: ICommand<IShowMentionInfoPopupOperationParams>;
export declare const CloseMentionInfoPopupOperation: ICommand;
export interface IShowMentionEditPopupOperationParams {
    startIndex: number;
    unitId: string;
}
export declare const ShowMentionEditPopupOperation: ICommand<IShowMentionEditPopupOperationParams>;
export declare const CloseMentionEditPopupOperation: ICommand;
