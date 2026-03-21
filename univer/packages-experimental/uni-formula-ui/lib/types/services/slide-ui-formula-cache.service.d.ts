import { Disposable } from '@univerjs/core';
import { ISlideEditorBridgeService } from '@univerjs/slides-ui';
import { IAddSlideUniFormulaCommandParams } from '../commands/commands/slide.command';
import { UniFormulaService } from './uni-formula.service';
export declare class SlideUIFormulaCacheService extends Disposable {
    private readonly _editorBridgeService;
    private readonly _uniFormulaService;
    private readonly _caches;
    constructor(_editorBridgeService: ISlideEditorBridgeService, _uniFormulaService: UniFormulaService);
    writeCache(rangeId: string, params: IAddSlideUniFormulaCommandParams): void;
    private _checkApplyCache;
    private _applyCache;
    clearCache(): void;
}
