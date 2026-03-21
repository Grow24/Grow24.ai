import { Nullable, Disposable, ILocalStorageService } from '@univerjs/core';
import { IWatermarkConfigWithType } from '@univerjs/engine-render';
export declare class WatermarkService extends Disposable {
    private _localStorageService;
    private readonly _updateConfig$;
    readonly updateConfig$: import('rxjs').Observable<Nullable<IWatermarkConfigWithType>>;
    private readonly _refresh$;
    readonly refresh$: import('rxjs').Observable<number>;
    constructor(_localStorageService: ILocalStorageService);
    getWatermarkConfig(): Promise<IWatermarkConfigWithType | null>;
    updateWatermarkConfig(config: IWatermarkConfigWithType): void;
    deleteWatermarkConfig(): void;
    refresh(): void;
    dispose(): void;
}
