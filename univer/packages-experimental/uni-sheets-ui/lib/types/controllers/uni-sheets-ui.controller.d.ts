import { ICommandService, IConfigService, Injector } from '@univerjs/core';
import { SheetUIController } from '@univerjs/sheets-ui';
import { ComponentManager, ILayoutService, IMenuManagerService, IShortcutService, IUIPartsService } from '@univerjs/ui';
import { UniToolbarService } from '@univerjs/uniui';
export declare class UniSheetsUIController extends SheetUIController {
    private readonly _toolbarService;
    constructor(injector: Injector, componentManager: ComponentManager, layoutService: ILayoutService, commandService: ICommandService, shortcutService: IShortcutService, menuManagerService: IMenuManagerService, uiPartsService: IUIPartsService, configService: IConfigService, _toolbarService: UniToolbarService);
    protected _initWorkbenchParts(): void;
    private _initUniMenus;
    private _initMutations;
}
