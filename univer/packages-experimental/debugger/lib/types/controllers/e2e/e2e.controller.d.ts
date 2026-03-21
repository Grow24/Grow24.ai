import { Univer, Disposable, IUniverInstanceService, ThemeService } from '@univerjs/core';
import { FUniver } from '@univerjs/core/facade';
export interface IE2EControllerAPI {
    loadAndRelease(id: number, loadTimeout?: number, disposeTimeout?: number): Promise<void>;
    loadDefaultSheet(loadTimeout?: number): Promise<void>;
    loadDemoSheet(loadTimeout?: number): Promise<void>;
    loadMergeCellSheet(loadTimeout?: number): Promise<void>;
    loadDefaultStyleSheet(loadTimeout?: number): Promise<void>;
    loadDefaultDoc(loadTimeout?: number): Promise<void>;
    setDarkMode(darkMode: boolean): void;
    disposeUniver(): Promise<void>;
    disposeCurrSheetUnit(disposeTimeout?: number): Promise<void>;
}
declare global {
    interface Window {
        E2EControllerAPI: IE2EControllerAPI;
        univer?: Univer;
        univerAPI?: FUniver;
    }
}
/**
 * This controller expose a API on `Window` for the E2E tests.
 */
export declare class E2EController extends Disposable {
    private readonly _univerInstanceService;
    private readonly _themeService;
    constructor(_univerInstanceService: IUniverInstanceService, _themeService: ThemeService);
    dispose(): void;
    private _initPlugin;
    private _setDarkMode;
    private _loadAndRelease;
    private _loadDefaultSheet;
    private _loadDemoSheet;
    /**
     * sheet-003 in default data
     */
    private _loadMergeCellSheet;
    private _loadDefaultStyleSheet;
    private _loadDefaultDoc;
    private _disposeUniver;
    private _disposeDefaultSheetUnit;
}
