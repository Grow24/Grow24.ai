import { DocumentDataModel, INeedCheckDisposable, Nullable, Disposable } from '@univerjs/core';
import { IRenderContext, IRenderModule } from '@univerjs/engine-render';
import { DocCanvasPopManagerService, DocEventManagerService } from '@univerjs/docs-ui';
import { DocQuickInsertPopupService } from '../services/doc-quick-insert-popup.service';
export declare class DocQuickInsertMenuController extends Disposable implements IRenderModule {
    private _context;
    private _docEventManagerService;
    private _docQuickInsertPopupService;
    private _docCanvasPopManagerService;
    private _popup$;
    readonly popup$: import('rxjs').Observable<Nullable<{
        startIndex: number;
        disposable: INeedCheckDisposable;
    }>>;
    get popup(): Nullable<{
        startIndex: number;
        disposable: INeedCheckDisposable;
    }>;
    constructor(_context: IRenderContext<DocumentDataModel>, _docEventManagerService: DocEventManagerService, _docQuickInsertPopupService: DocQuickInsertPopupService, _docCanvasPopManagerService: DocCanvasPopManagerService);
    private _init;
    private _hideMenu;
}
