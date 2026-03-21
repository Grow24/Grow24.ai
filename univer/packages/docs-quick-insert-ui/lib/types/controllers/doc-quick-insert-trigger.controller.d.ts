import { Disposable, ICommandService, IUniverInstanceService } from '@univerjs/core';
import { DocSelectionManagerService } from '@univerjs/docs';
import { IShortcutService } from '@univerjs/ui';
import { DocQuickInsertPopupService } from '../services/doc-quick-insert-popup.service';
export declare class DocQuickInsertTriggerController extends Disposable {
    private readonly _commandService;
    private readonly _textSelectionManagerService;
    private readonly _docQuickInsertPopupService;
    private readonly _shortcutService;
    private readonly _univerInstanceService;
    constructor(_commandService: ICommandService, _textSelectionManagerService: DocSelectionManagerService, _docQuickInsertPopupService: DocQuickInsertPopupService, _shortcutService: IShortcutService, _univerInstanceService: IUniverInstanceService);
    private _initTrigger;
    private _initMenuHandler;
}
