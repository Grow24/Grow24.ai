import { Disposable, IConfigService, Injector } from '@univerjs/core';
import { ComponentManager, IMenuManagerService, IUIPartsService } from '@univerjs/ui';
export declare class DebuggerController extends Disposable {
    private readonly _injector;
    private readonly _configService;
    protected readonly _uiPartsService: IUIPartsService;
    private readonly _menuManagerService;
    private readonly _componentManager;
    constructor(_injector: Injector, _configService: IConfigService, _uiPartsService: IUIPartsService, _menuManagerService: IMenuManagerService, _componentManager: ComponentManager);
    private _initCustomComponents;
}
