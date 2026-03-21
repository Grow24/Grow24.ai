import { MenuConfig } from '@univerjs/ui';
export declare const DOCS_MENTION_UI_PLUGIN_CONFIG_KEY = "docs-mention-ui.config";
export declare const configSymbol: unique symbol;
export interface IUniverDocsMentionUIConfig {
    menu?: MenuConfig;
}
export declare const defaultPluginConfig: IUniverDocsMentionUIConfig;
