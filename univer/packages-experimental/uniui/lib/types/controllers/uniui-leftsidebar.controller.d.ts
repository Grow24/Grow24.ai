import { ISidebarService, ComponentManager } from '@univerjs/ui';
import { Disposable, IUniverInstanceService } from '@univerjs/core';
export declare class UniuiLeftSidebarController extends Disposable {
    private readonly _componentManager;
    private readonly _univerInstanceService;
    private readonly _leftSidebarService;
    constructor(_componentManager: ComponentManager, _univerInstanceService: IUniverInstanceService, _leftSidebarService: ISidebarService);
    private _initComponents;
    private _initShowOutlineListener;
}
