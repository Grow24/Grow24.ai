import { ICommand, IDocMention } from '@univerjs/core';
export interface IAddDocMentionCommandParams {
    mention: IDocMention;
    unitId: string;
    startIndex: number;
}
export declare const AddDocMentionCommand: ICommand<IAddDocMentionCommandParams>;
export interface IDeleteDocMentionCommandParams {
    unitId: string;
    mentionId: string;
}
export declare const DeleteDocMentionCommand: ICommand<IDeleteDocMentionCommandParams>;
