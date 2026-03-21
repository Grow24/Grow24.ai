import { IUniverUIConfig, ILayoutService, IUIPartsService } from '@univerjs/ui';
import { Disposable, Injector, LifecycleService } from '@univerjs/core';
export declare class UniverUniUIController extends Disposable {
    private readonly _config;
    private readonly _injector;
    private readonly _lifecycleService;
    private readonly _uiPartsService;
    private readonly _layoutService?;
    constructor(_config: IUniverUIConfig, _injector: Injector, _lifecycleService: LifecycleService, _uiPartsService: IUIPartsService, _layoutService?: ILayoutService | undefined);
    private _bootstrapWorkbench;
    private _initBuiltinComponents;
}
