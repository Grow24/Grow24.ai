import { IUniverDebuggerConfig } from './controllers/config.schema';
import { IConfigService, Injector, Plugin } from '@univerjs/core';
import { DebuggerController } from './controllers/debugger.controller';
export declare class UniverDebuggerPlugin extends Plugin {
    private readonly _config;
    readonly _injector: Injector;
    private readonly _configService;
    static pluginName: string;
    private _debuggerController;
    constructor(_config: Partial<IUniverDebuggerConfig> | undefined, _injector: Injector, _configService: IConfigService);
    onStarting(): void;
    onReady(): void;
    onRendered(): void;
    getDebuggerController(): DebuggerController;
}
