import { IDisposable, Nullable, Disposable, ICommandService, IUniverInstanceService } from '@univerjs/core';
import { IInsertCommandParams, DocCanvasPopManagerService } from '@univerjs/docs-ui';
import { Observable } from 'rxjs';
import { DocSelectionManagerService } from '@univerjs/docs';
import { IRenderManagerService } from '@univerjs/engine-render';
export interface IDocPopupGroupItem {
    id: string;
    icon?: string;
    title: string;
    children?: IDocPopupMenuItem[];
}
export interface IDocPopupMenuItem {
    id: string;
    icon?: string;
    title: string;
    keywords?: string[];
}
export type DocPopupMenu = IDocPopupGroupItem | IDocPopupMenuItem;
export interface IDocPopup {
    keyword: string;
    menus$: Observable<DocPopupMenu[]>;
    Placeholder?: React.ComponentType;
    preconditions?: (params: IInsertCommandParams) => boolean;
}
export declare class DocQuickInsertPopupService extends Disposable {
    private readonly _docCanvasPopupManagerService;
    private readonly _univerInstanceService;
    private readonly _commandService;
    private readonly _renderManagerService;
    private readonly _docSelectionManagerService;
    private readonly _popups;
    get popups(): IDocPopup[];
    private readonly _editPopup$;
    readonly editPopup$: Observable<Nullable<{
        popup: IDocPopup;
        anchor: number;
        disposable: IDisposable;
        unitId: string;
    }>>;
    get editPopup(): Nullable<{
        popup: IDocPopup;
        anchor: number;
        disposable: IDisposable;
        unitId: string;
    }>;
    private readonly _isComposing$;
    readonly isComposing$: Observable<boolean>;
    get isComposing(): boolean;
    setIsComposing(isComposing: boolean): void;
    private readonly _inputOffset$;
    readonly inputOffset$: Observable<{
        start: number;
        end: number;
    }>;
    get inputOffset(): {
        start: number;
        end: number;
    };
    setInputOffset(offset: {
        start: number;
        end: number;
    }): void;
    readonly filterKeyword$: Observable<string>;
    private _menuSelectedCallbacks;
    private _inputPlaceholderRenderRoot;
    private getDocEventManagerService;
    constructor(_docCanvasPopupManagerService: DocCanvasPopManagerService, _univerInstanceService: IUniverInstanceService, _commandService: ICommandService, _renderManagerService: IRenderManagerService, _docSelectionManagerService: DocSelectionManagerService);
    resolvePopup(keyword: string): IDocPopup | undefined;
    registerPopup(popup: IDocPopup): () => void;
    private _createInputPlaceholderRenderRoot;
    showPopup(options: {
        popup: IDocPopup;
        index: number;
        unitId: string;
    }): void;
    closePopup(): void;
    onMenuSelected(callback: (menu: IDocPopupMenuItem) => void): () => void;
    emitMenuSelected(menu: IDocPopupMenuItem): void;
}
