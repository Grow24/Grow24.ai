import { MenuConfig } from '@univerjs/ui';
export declare const DEBUGGER_PLUGIN_CONFIG_KEY = "debugger.config";
export declare const configSymbol: unique symbol;
export interface IUniverDebuggerConfig {
    menu?: MenuConfig;
    fab?: boolean;
    performanceMonitor?: {
        enabled: boolean;
    };
}
export declare const defaultPluginConfig: IUniverDebuggerConfig;
