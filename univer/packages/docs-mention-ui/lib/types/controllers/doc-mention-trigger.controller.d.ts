import { Disposable, ICommandService } from '@univerjs/core';
import { DocSelectionManagerService } from '@univerjs/docs';
import { DocMentionPopupService } from '../services/doc-mention-popup.service';
import { DocMentionService } from '../services/doc-mention.service';
export declare class DocMentionTriggerController extends Disposable {
    private readonly _commandService;
    private readonly _docMentionService;
    private readonly _textSelectionManagerService;
    private readonly _docMentionPopupService;
    constructor(_commandService: ICommandService, _docMentionService: DocMentionService, _textSelectionManagerService: DocSelectionManagerService, _docMentionPopupService: DocMentionPopupService);
    private _initTrigger;
}
