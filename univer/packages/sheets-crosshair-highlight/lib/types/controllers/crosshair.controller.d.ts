import { Disposable, ICommandService } from '@univerjs/core';
import { ComponentManager, IMenuManagerService } from '@univerjs/ui';
export declare class SheetsCrosshairHighlightController extends Disposable {
    private readonly _componentMgr;
    private readonly _menuManagerService;
    private readonly _cmdSrv;
    constructor(_componentMgr: ComponentManager, _menuManagerService: IMenuManagerService, _cmdSrv: ICommandService);
    private _initCommands;
    private _initMenus;
    private _initComponents;
}
