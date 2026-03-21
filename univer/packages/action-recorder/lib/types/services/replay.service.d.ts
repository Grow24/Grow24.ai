import { ICommandInfo, Disposable, ICommandService, ILogService, IUniverInstanceService } from '@univerjs/core';
import { ILocalFileService, IMessageService } from '@univerjs/ui';
export declare enum ReplayMode {
    DEFAULT = "default",
    NAME = "name",
    ACTIVE = "active"
}
/**
 * This service is for replaying user actions.
 */
export declare class ActionReplayService extends Disposable {
    private readonly _messageService;
    private readonly _instanceService;
    private readonly _localFileService;
    private readonly _logService;
    private readonly _commandService;
    constructor(_messageService: IMessageService, _instanceService: IUniverInstanceService, _localFileService: ILocalFileService, _logService: ILogService, _commandService: ICommandService);
    /**
     * Read a local file and try to replay commands in this JSON.
     */
    replayLocalJSON(mode?: ReplayMode): Promise<boolean>;
    /**
     * Replay a list of commands. Note that `unitId` of these commands would be changed to the focused unit.
     * @param commands - The commands to replay.
     * @returns If the replay is successful.
     */
    replayCommands(commands: ICommandInfo[], options?: {
        mode: ReplayMode;
    }): Promise<boolean>;
    /**
     * Replay a list of commands with a random delay between each command.
     * @param commands - The commands to replay.
     */
    replayCommandsWithDelay(commands: ICommandInfo[]): Promise<boolean>;
}
