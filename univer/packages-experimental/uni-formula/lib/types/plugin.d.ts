import { Injector, Plugin, UniverInstanceType } from '@univerjs/core';
export declare class UniverDocUniFormulaPlugin extends Plugin {
    private readonly _config;
    protected readonly _injector: Injector;
    static pluginName: string;
    static type: UniverInstanceType;
    constructor(_config: {
        playDumb: boolean;
    } | undefined, _injector: Injector);
    onStarting(): void;
}
