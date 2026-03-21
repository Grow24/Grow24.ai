import { IUniverWatermarkConfig } from './controllers/config.schema';
import { IConfigService, ILocalStorageService, Injector, Plugin } from '@univerjs/core';
import { IRenderManagerService } from '@univerjs/engine-render';
export declare class UniverWatermarkPlugin extends Plugin {
    private readonly _config;
    protected _injector: Injector;
    private readonly _configService;
    private readonly _renderManagerSrv;
    private readonly _localStorageService;
    static pluginName: string;
    constructor(_config: Partial<IUniverWatermarkConfig> | undefined, _injector: Injector, _configService: IConfigService, _renderManagerSrv: IRenderManagerService, _localStorageService: ILocalStorageService);
    private _initWatermarkStorage;
    private _initDependencies;
    onRendered(): void;
    private _initRenderDependencies;
}
