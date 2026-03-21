import { Injector, Plugin, UniverInstanceType } from '@univerjs/core';
export declare class UniverDocUniFormulaUIPlugin extends Plugin {
    protected readonly _injector: Injector;
    static pluginName: string;
    static type: UniverInstanceType;
    constructor(_config: unknown, _injector: Injector);
    onStarting(): void;
    onReady(): void;
    onSteady(): void;
}
