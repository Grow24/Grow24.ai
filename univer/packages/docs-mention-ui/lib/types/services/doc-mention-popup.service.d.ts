import { IDisposable, Nullable, Disposable } from '@univerjs/core';
import { DocCanvasPopManagerService } from '@univerjs/docs-ui';
import { DocMentionService } from './doc-mention.service';
export declare class DocMentionPopupService extends Disposable {
    private readonly _docCanvasPopupManagerService;
    private readonly _docMentionService;
    private readonly _infoPopup$;
    readonly infoPopup$: import('rxjs').Observable<undefined>;
    get infoPopup(): undefined;
    private readonly _editPopup$;
    readonly editPopup$: import('rxjs').Observable<Nullable<{
        anchor: number;
        popup: IDisposable;
        unitId: string;
    }>>;
    get editPopup(): Nullable<{
        anchor: number;
        popup: IDisposable;
        unitId: string;
    }>;
    constructor(_docCanvasPopupManagerService: DocCanvasPopManagerService, _docMentionService: DocMentionService);
    showInfoPopup(): void;
    closeInfoPopup(): void;
    showEditPopup(unitId: string, index: number): void;
    closeEditPopup(): void;
}
