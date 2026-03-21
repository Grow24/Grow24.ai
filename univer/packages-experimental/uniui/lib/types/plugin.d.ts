import { IUniverUIConfig } from '@univerjs/ui';
import { ICommandService, IContextService, Injector, Plugin } from '@univerjs/core';
/**
 * This plugin enables the Uni Mode of Univer. It should replace
 * `UniverUIPlugin` when registered.
 */
export declare class UniverUniUIPlugin extends Plugin {
    private readonly _config;
    protected readonly _injector: Injector;
    private readonly _contextService;
    private readonly _commandService;
    static pluginName: string;
    constructor(_config: Partial<IUniverUIConfig> | undefined, _injector: Injector, _contextService: IContextService, _commandService: ICommandService);
    onStarting(): void;
    onReady(): void;
}
