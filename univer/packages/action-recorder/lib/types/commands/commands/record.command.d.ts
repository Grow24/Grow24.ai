import { ICommand } from '@univerjs/core';
interface IStartRecordingActionCommandParams {
    replaceId?: boolean;
}
export declare const StartRecordingActionCommand: ICommand<IStartRecordingActionCommandParams>;
export declare const CompleteRecordingActionCommand: ICommand;
export declare const StopRecordingActionCommand: ICommand;
export {};
