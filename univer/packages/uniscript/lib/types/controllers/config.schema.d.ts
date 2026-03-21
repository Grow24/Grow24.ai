import { MenuConfig } from '@univerjs/ui';
export declare const UNISCRIPT_PLUGIN_CONFIG_KEY = "uniscript.config";
export declare const configSymbol: unique symbol;
export interface IUniverUniscriptConfig {
    menu?: MenuConfig;
    getWorkerUrl?: (moduleID: string, label: string) => string;
}
export declare const defaultPluginConfig: IUniverUniscriptConfig;
