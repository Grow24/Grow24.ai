import { MenuConfig } from '@univerjs/ui';
export declare const ACTION_RECORDER_PLUGIN_CONFIG_KEY = "action-recorder.config";
export declare const configSymbol: unique symbol;
export interface IUniverActionRecorderConfig {
    menu?: MenuConfig;
    replayOnly?: boolean;
}
export declare const defaultPluginConfig: IUniverActionRecorderConfig;
