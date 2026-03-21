import { Disposable, ICommandService, Injector, IUniverInstanceService } from '@univerjs/core';
import { DocSelectionManagerService } from '@univerjs/docs';
import { IEditorService } from '@univerjs/docs-ui';
import { UniFormulaPopupService } from '../services/formula-popup.service';
export declare class SlideUniFormulaInputController extends Disposable {
    private readonly _injector;
    private readonly _instanceSrv;
    private readonly _commandSrv;
    private readonly _editorSrv;
    private readonly _textSelectionManagerService;
    private readonly _formulaPopupSrv;
    constructor(_injector: Injector, _instanceSrv: IUniverInstanceService, _commandSrv: ICommandService, _editorSrv: IEditorService, _textSelectionManagerService: DocSelectionManagerService, _formulaPopupSrv: UniFormulaPopupService);
    private _initCommands;
    private _initKeyboardListeners;
    private _removeTimer;
    private _showPopup;
    private _closePopupTimer;
    private _closePopup;
}
