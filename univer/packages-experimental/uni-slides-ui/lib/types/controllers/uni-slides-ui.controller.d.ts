import { ICommandService, Injector } from '@univerjs/core';
import { SlidesUIController } from '@univerjs/slides-ui';
import { ComponentManager, IMenuManagerService, IShortcutService, IUIPartsService } from '@univerjs/ui';
import { UniToolbarService } from '@univerjs/uniui';
export declare class UniSlidesUIController extends SlidesUIController {
    private readonly _toolbarService;
    constructor(_injector: Injector, _menuManagerService: IMenuManagerService, _componentManager: ComponentManager, _uiPartsService: IUIPartsService, _commandService: ICommandService, _shortcutService: IShortcutService, _toolbarService: UniToolbarService);
    protected _initUIComponents(): void;
    private _initUniMenus;
}
