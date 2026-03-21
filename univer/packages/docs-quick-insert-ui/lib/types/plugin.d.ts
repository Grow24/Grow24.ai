import { IUniverDocsQuickInsertUIConfig } from './controllers/config.schema';
import { IConfigService, Injector, Plugin, UniverInstanceType } from '@univerjs/core';
import { IRenderManagerService } from '@univerjs/engine-render';
export declare class UniverDocsQuickInsertUIPlugin extends Plugin {
    private readonly _config;
    protected _injector: Injector;
    private _renderManagerSrv;
    private readonly _configService;
    static type: UniverInstanceType;
    static pluginName: string;
    constructor(_config: Partial<IUniverDocsQuickInsertUIConfig> | undefined, _injector: Injector, _renderManagerSrv: IRenderManagerService, _configService: IConfigService);
    onStarting(): void;
    onRendered(): void;
}
