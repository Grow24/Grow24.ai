import { IImageWatermarkConfig, ITextWatermarkConfig, IUserInfoWatermarkConfig } from '@univerjs/engine-render';
export declare const WATERMARK_PLUGIN_CONFIG_KEY = "watermark.config";
export declare const configSymbol: unique symbol;
export interface IUniverWatermarkConfig {
    userWatermarkSettings?: Partial<IUserInfoWatermarkConfig>;
    textWatermarkSettings?: Partial<ITextWatermarkConfig>;
    imageWatermarkSettings?: Partial<IImageWatermarkConfig>;
}
export declare const defaultPluginConfig: IUniverWatermarkConfig;
