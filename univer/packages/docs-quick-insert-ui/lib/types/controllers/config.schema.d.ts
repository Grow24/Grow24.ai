import { MenuConfig } from '@univerjs/ui';
export declare const DOCS_QUICK_INSERT_UI_PLUGIN_CONFIG_KEY = "docs-quick-insert-ui.config";
export declare const configSymbol: unique symbol;
export interface IUniverDocsQuickInsertUIConfig {
    menu?: MenuConfig;
}
export declare const defaultPluginConfig: IUniverDocsQuickInsertUIConfig;
