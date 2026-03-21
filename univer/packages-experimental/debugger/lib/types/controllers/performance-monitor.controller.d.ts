import { IUniverInstanceService, LifecycleService, RxDisposable } from '@univerjs/core';
import { IRenderManagerService } from '@univerjs/engine-render';
export declare class PerformanceMonitorController extends RxDisposable {
    private readonly _instanceService;
    private readonly _renderManagerService;
    private _containerElement;
    private _currentUnitSub;
    constructor(lifecycleService: LifecycleService, _instanceService: IUniverInstanceService, _renderManagerService: IRenderManagerService);
    dispose(): void;
    private _disposeCurrentObserver;
    private _listenDocumentTypeChange;
    private _listenToRenderer;
}
