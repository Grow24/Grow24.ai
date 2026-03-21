import { ICommandService, IConfigService, Injector, IUniverInstanceService } from '@univerjs/core';
import { DocUIController } from '@univerjs/docs-ui';
import { ComponentManager, ILayoutService, IMenuManagerService, IShortcutService, IUIPartsService } from '@univerjs/ui';
import { UniToolbarService } from '@univerjs/uniui';
export declare class UniDocsUIController extends DocUIController {
    private readonly _toolbarService;
    constructor(injector: Injector, componentManager: ComponentManager, commandService: ICommandService, layoutService: ILayoutService, menuManagerService: IMenuManagerService, uiPartsService: IUIPartsService, univerInstanceService: IUniverInstanceService, shortcutService: IShortcutService, configService: IConfigService, _toolbarService: UniToolbarService);
    private _initUniMenus;
    private _initMutations;
}
