import { IImageWatermarkConfig, ITextWatermarkConfig, IWatermarkTypeEnum } from '@univerjs/engine-render';
import { FUniver } from '@univerjs/core/facade';
/**
 * @ignore
 */
export interface IFUniverWatermarkMixin {
    /**
     * Adds a watermark to the unit. Supports both text and image watermarks based on the specified type.
     * @param {IWatermarkTypeEnum.Text} type - The type of watermark to add is Text.
     * @param {ITextWatermarkConfig} config - The configuration object for the text type watermark.
     * @returns {FUniver} The {@link FUniver} instance for chaining.
     * @throws {Error} Throws an error if the watermark type is unknown.
     * @example
     * ```ts
     * univerAPI.addWatermark('text', {
     *   content: 'Univer',
     *   fontSize: 20,
     *   repeat: true,
     * });
     * ```
     */
    addWatermark(type: IWatermarkTypeEnum.Text, config: ITextWatermarkConfig): FUniver;
    /**
     * Adds a watermark to the unit. Supports both text and image watermarks based on the specified type.
     * @param {IWatermarkTypeEnum.Image} type - The type of watermark to add is Image.
     * @param {IImageWatermarkConfig} config - The configuration object for the image type watermark.
     * @returns {FUniver} The {@link FUniver} instance for chaining.
     * @throws {Error} Throws an error if the watermark type is unknown.
     * @example
     * ```ts
     * univerAPI.addWatermark('image', {
     *   url: 'https://avatars.githubusercontent.com/u/61444807?s=48&v=4',
     *   width: 100,
     *   height: 100,
     * });
     * ```
     */
    addWatermark(type: IWatermarkTypeEnum.Image, config: IImageWatermarkConfig): FUniver;
    addWatermark(type: IWatermarkTypeEnum.Text | IWatermarkTypeEnum.Image, config: ITextWatermarkConfig | IImageWatermarkConfig): FUniver;
    /**
     * Deletes the currently applied watermark from the unit.
     * This function retrieves the watermark service and invokes the method to remove any existing watermark configuration.
     * @returns {FUniver} The {@link FUniver} instance for chaining.
     * @example
     * ```ts
     * univerAPI.deleteWatermark();
     * ```
     */
    deleteWatermark(): FUniver;
}
export declare class FUniverWatermarkMixin extends FUniver {
    addWatermark(type: IWatermarkTypeEnum.Text, config: ITextWatermarkConfig): FUniver;
    addWatermark(type: IWatermarkTypeEnum.Image, config: IImageWatermarkConfig): FUniver;
    deleteWatermark(): FUniver;
}
export declare class FWatermarkEnum {
    get IWatermarkTypeEnum(): typeof IWatermarkTypeEnum;
}
declare module '@univerjs/core/facade' {
    interface FUniver extends IFUniverWatermarkMixin {
    }
    interface FEnum extends FWatermarkEnum {
    }
}
