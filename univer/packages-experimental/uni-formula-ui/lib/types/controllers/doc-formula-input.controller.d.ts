import { Disposable, ICommandService, ILogService, IUniverInstanceService } from '@univerjs/core';
import { DocSelectionManagerService } from '@univerjs/docs';
import { IEditorService } from '@univerjs/docs-ui';
import { IRenderManagerService } from '@univerjs/engine-render';
import { UniFormulaPopupService } from '../services/formula-popup.service';
export declare class DocUniFormulaInputController extends Disposable {
    private readonly _commandService;
    private readonly _instanceSrv;
    private readonly _editorService;
    private readonly _logService;
    private readonly _formulaPopupSrv;
    private readonly _renderManagerService;
    private readonly _textSelectionManagerService;
    constructor(_commandService: ICommandService, _instanceSrv: IUniverInstanceService, _editorService: IEditorService, _logService: ILogService, _formulaPopupSrv: UniFormulaPopupService, _renderManagerService: IRenderManagerService, _textSelectionManagerService: DocSelectionManagerService);
    private _initCommands;
    private _initKeyboardListeners;
    private _initHoverListener;
    private _hovered;
    private _removeTimer;
    private _showPopup;
    private _closePopupTimer;
    private _closePopup;
}
