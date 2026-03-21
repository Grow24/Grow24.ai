import { IDisposable, Nullable, Disposable, ICommandService, IContextService, ILogService } from '@univerjs/core';
import { IPopupPosition } from '../commands/operations/operation';
import { DocCanvasPopManagerService } from '@univerjs/docs-ui';
import { IShortcutService } from '@univerjs/ui';
import { IUniFormulaService } from '@univerjs/uni-formula';
export declare const DOC_FORMULA_POPUP_KEY: "DOC_FORMULA_POPUP";
export interface IUniFormulaPopupInfo {
    unitId: string;
    type: 'new' | 'existing';
    f: Nullable<string>;
    disposable: IDisposable;
    startIndex: number;
    position?: IPopupPosition;
}
export declare class UniFormulaPopupService extends Disposable {
    private readonly _docCanvasPopupManagerService;
    private readonly _uniFormulaService;
    private readonly _contextService;
    private readonly _logService;
    private readonly _commandService;
    private readonly _shortcutService;
    private readonly _popupInfo$;
    readonly popupInfo$: import('rxjs').Observable<Nullable<IUniFormulaPopupInfo>>;
    get popupInfo(): Nullable<IUniFormulaPopupInfo>;
    private _popupLocked;
    get popupLocked(): boolean;
    private readonly _popupHovered$;
    readonly popupHovered$: import('rxjs').Observable<boolean>;
    private _cachedFormulaString;
    constructor(_docCanvasPopupManagerService: DocCanvasPopManagerService, _uniFormulaService: IUniFormulaService, _contextService: IContextService, _logService: ILogService, _commandService: ICommandService, _shortcutService: IShortcutService);
    dispose(): void;
    cacheFormulaString(f: string): void;
    hoverPopup(hovered: boolean): void;
    showDocPopup(unitId: string, startIndex: number, type: 'new'): boolean;
    showDocPopup(unitId: string, startIndex: number, type: 'existing', position: IPopupPosition): boolean;
    showDocPopup(unitId: string, startIndex: number, type: 'new' | 'existing', position?: IPopupPosition): boolean;
    lockPopup(): void;
    canConfirmPopup(): boolean;
    confirmPopup(): Promise<boolean>;
    unlockPopup(): void;
    closePopup(force?: boolean): boolean;
}
