import { defineComponent } from 'vue';
import { Injector, Plugin } from '@univerjs/core';
import { ComponentManager } from '@univerjs/ui';
/**
 * The plugin that allows Univer to use Vue 3 components as UI components.
 */
export declare class UniverVue3AdapterPlugin extends Plugin {
    private readonly _config;
    protected readonly _injector: Injector;
    protected readonly _componentManager: ComponentManager;
    static pluginName: string;
    constructor(_config: {} | undefined, _injector: Injector, _componentManager: ComponentManager);
    onStarting(): void;
}
export declare function VueComponentWrapper(options: {
    component: ReturnType<typeof defineComponent>;
    props: Record<string, any>;
    reactUtils: typeof ComponentManager.prototype.reactUtils;
}): import('react').DetailedReactHTMLElement<import('react').HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
