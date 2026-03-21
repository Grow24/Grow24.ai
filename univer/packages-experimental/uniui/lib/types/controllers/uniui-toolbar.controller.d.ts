import { MenuConfig, ComponentManager, IMenuManagerService } from '@univerjs/ui';
import { Disposable, ICommandService, Injector } from '@univerjs/core';
import { UniToolbarService } from '../services/toolbar/uni-toolbar-service';
export interface IUniuiToolbarConfig {
    menu: MenuConfig;
}
export declare const DefaultUniuiToolbarConfig: {};
export declare class UniuiToolbarController extends Disposable {
    protected readonly _menuManagerService: IMenuManagerService;
    protected readonly _injector: Injector;
    protected readonly _componentManager: ComponentManager;
    protected readonly _commandService: ICommandService;
    protected readonly _toolbarService: UniToolbarService;
    constructor(_menuManagerService: IMenuManagerService, _injector: Injector, _componentManager: ComponentManager, _commandService: ICommandService, _toolbarService: UniToolbarService);
    private _initComponent;
    private _initMenus;
    private _initCommands;
}
