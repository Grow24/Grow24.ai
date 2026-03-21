import { IUniverUniscriptConfig } from './controllers/config.schema';
import { IConfigService, Injector, Plugin } from '@univerjs/core';
export declare class UniverUniscriptPlugin extends Plugin {
    private readonly _config;
    protected _injector: Injector;
    private readonly _configService;
    static pluginName: string;
    constructor(_config: Partial<IUniverUniscriptConfig> | undefined, _injector: Injector, _configService: IConfigService);
    onStarting(): void;
    onSteady(): void;
    /**
     * Allows being overridden, replacing with a new UniscriptExecutionService.
     */
    registerExecution(): void;
}
