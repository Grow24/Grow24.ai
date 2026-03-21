import { IUniverActionRecorderConfig } from './controllers/config.schema';
import { IConfigService, Injector, Plugin } from '@univerjs/core';
/**
 * This plugin provides a recorder for user's interactions with Univer,
 * it only records commands (and some special operations) so that it can be replayed later.
 */
export declare class UniverActionRecorderPlugin extends Plugin {
    private readonly _config;
    protected readonly _injector: Injector;
    private readonly _configService;
    static pluginName: string;
    constructor(_config: Partial<IUniverActionRecorderConfig> | undefined, _injector: Injector, _configService: IConfigService);
    onStarting(): void;
    onSteady(): void;
}
