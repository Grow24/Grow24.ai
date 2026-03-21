import { Disposable, ICommandService } from '@univerjs/core';
import { ComponentManager } from '@univerjs/ui';
import { DocQuickInsertPopupService } from '../services/doc-quick-insert-popup.service';
export declare class DocQuickInsertUIController extends Disposable {
    private readonly _commandService;
    private readonly _docQuickInsertPopupService;
    private readonly _componentManager;
    constructor(_commandService: ICommandService, _docQuickInsertPopupService: DocQuickInsertPopupService, _componentManager: ComponentManager);
    private _initCommands;
    private _initComponents;
    private _initMenus;
}
