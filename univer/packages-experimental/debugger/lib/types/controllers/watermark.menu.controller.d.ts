import { Disposable } from '@univerjs/core';
import { ComponentManager, IMenuManagerService } from '@univerjs/ui';
export declare const WATERMARK_PANEL = "WATERMARK_PANEL";
export declare const WATERMARK_PANEL_FOOTER = "WATERMARK_PANEL_FOOTER";
export declare class UniverWatermarkMenuController extends Disposable {
    protected readonly _menuManagerService: IMenuManagerService;
    private readonly _componentManager;
    constructor(_menuManagerService: IMenuManagerService, _componentManager: ComponentManager);
    private _initComponents;
}
