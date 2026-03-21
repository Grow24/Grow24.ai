import { Disposable, ICommandService } from '@univerjs/core';
import { FlowManagerService } from '../services/flow/flow-manager.service';
export declare class UniuiFlowController extends Disposable {
    protected readonly _commandService: ICommandService;
    protected readonly _flowManagerService: FlowManagerService;
    constructor(_commandService: ICommandService, _flowManagerService: FlowManagerService);
    private _initCommands;
    private _triggerCommands;
}
