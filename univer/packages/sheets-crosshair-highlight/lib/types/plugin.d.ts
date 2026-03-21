import { IUniverSheetsCrosshairHighlightConfig } from './controllers/config.schema';
import { IConfigService, Injector, Plugin, UniverInstanceType } from '@univerjs/core';
import { IRenderManagerService } from '@univerjs/engine-render';
export declare class UniverSheetsCrosshairHighlightPlugin extends Plugin {
    private readonly _config;
    protected readonly _injector: Injector;
    private readonly _renderManagerService;
    private readonly _configService;
    static pluginName: string;
    static type: UniverInstanceType;
    constructor(_config: Partial<IUniverSheetsCrosshairHighlightConfig> | undefined, _injector: Injector, _renderManagerService: IRenderManagerService, _configService: IConfigService);
    onStarting(): void;
    onReady(): void;
}
