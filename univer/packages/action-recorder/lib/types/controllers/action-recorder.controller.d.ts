import { Disposable, ICommandService, Injector } from '@univerjs/core';
import { ComponentManager, IMenuManagerService, IUIPartsService } from '@univerjs/ui';
import { ActionRecorderService } from '../services/action-recorder.service';
export declare class ActionRecorderController extends Disposable {
    private readonly _commandSrv;
    private readonly _uiPartsSrv;
    private readonly _menuManagerService;
    private readonly _componentManager;
    private readonly _actionRecorderService;
    private readonly _injector;
    constructor(_commandSrv: ICommandService, _uiPartsSrv: IUIPartsService, _menuManagerService: IMenuManagerService, _componentManager: ComponentManager, _actionRecorderService: ActionRecorderService, _injector: Injector);
    private _initCommands;
    private _initUI;
    private _initSheetsCommands;
    private _initDocsCommands;
}
