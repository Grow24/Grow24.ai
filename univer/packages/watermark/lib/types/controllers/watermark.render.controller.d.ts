import { UnitModel, ILocalStorageService, RxDisposable, UserManagerService } from '@univerjs/core';
import { IRenderContext, IRenderModule } from '@univerjs/engine-render';
import { WatermarkService } from '../services/watermark.service';
export declare class WatermarkRenderController extends RxDisposable implements IRenderModule {
    private readonly _context;
    private _watermarkService;
    private _localStorageService;
    private _userManagerService;
    private readonly _watermarkLayer;
    constructor(_context: IRenderContext<UnitModel>, _watermarkService: WatermarkService, _localStorageService: ILocalStorageService, _userManagerService: UserManagerService);
    private _initAddRender;
    private _initWatermarkConfig;
    private _initWatermarkUpdate;
}
