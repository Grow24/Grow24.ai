import { Injector, Plugin } from '@univerjs/core';
import { ComponentManager } from '@univerjs/ui';
/**
 * The plugin that allows Univer to use web components as UI components.
 */
export declare class UniverWebComponentAdapterPlugin extends Plugin {
    private readonly _config;
    protected readonly _injector: Injector;
    protected readonly _componentManager: ComponentManager;
    static pluginName: string;
    constructor(_config: {} | undefined, _injector: Injector, _componentManager: ComponentManager);
    onStarting(): void;
}
export declare function WebComponentComponentWrapper(options: {
    component: CustomElementConstructor;
    props?: Record<string, any>;
    reactUtils: typeof ComponentManager.prototype.reactUtils;
}): import('react').DetailedReactHTMLElement<import('react').HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
