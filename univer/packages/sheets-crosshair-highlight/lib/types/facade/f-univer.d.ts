import { Injector } from '@univerjs/core';
import { IEventBase, FUniver } from '@univerjs/core/facade';
import { FWorkbook, FWorksheet } from '@univerjs/sheets/facade';
/**
 * @ignore
 */
export interface IFSheetCrosshairHighlightEventMixin {
    /**
     * Triggered when the crosshair highlight is enabled or disabled.
     * @see {@link ICrosshairHighlightEnabledChangedEvent}
     * @example
     * ```ts
     * const disposable = univerAPI.addEvent(univerAPI.Event.CrosshairHighlightEnabledChanged, (params) => {
     *   const { enabled, workbook, worksheet } = params;
     *   console.log(params);
     * });
     *
     * // Remove the event listener, use `disposable.dispose()`
     * ```
     */
    readonly CrosshairHighlightEnabledChanged: 'CrosshairHighlightEnabledChanged';
    /**
     * Triggered when the crosshair highlight color is changed.
     * @see {@link ICrosshairHighlightColorChangedEvent}
     * @example
     * ```ts
     * const disposable = univerAPI.addEvent(univerAPI.Event.CrosshairHighlightColorChanged, (params) => {
     *   const { color, workbook, worksheet } = params;
     *   console.log(params);
     * });
     *
     * // Remove the event listener, use `disposable.dispose()`
     * ```
     */
    readonly CrosshairHighlightColorChanged: 'CrosshairHighlightColorChanged';
}
export interface ICrosshairHighlightEnabledChangedEvent extends IEventBase {
    /**
     * Whether the crosshair highlight is enabled.
     */
    enabled: boolean;
    /**
     * The workbook that the crosshair highlight is enabled in.
     */
    workbook: FWorkbook;
    /**
     * The worksheet that the crosshair highlight is enabled in.
     */
    worksheet: FWorksheet;
}
export interface ICrosshairHighlightColorChangedEvent extends IEventBase {
    /**
     * The color of the crosshair highlight.
     */
    color: string;
    /**
     * The workbook that the crosshair highlight is enabled in.
     */
    workbook: FWorkbook;
    /**
     * The worksheet that the crosshair highlight is enabled in.
     */
    worksheet: FWorksheet;
}
/**
 * @ignore
 */
export declare class FSheetCrosshairHighlightEventMixin implements IFSheetCrosshairHighlightEventMixin {
    get CrosshairHighlightEnabledChanged(): 'CrosshairHighlightEnabledChanged';
    get CrosshairHighlightColorChanged(): 'CrosshairHighlightColorChanged';
}
/**
 * @ignore
 */
export interface ISheetCrosshairHighlightEventConfigs {
    CrosshairHighlightEnabledChanged: ICrosshairHighlightEnabledChangedEvent;
    CrosshairHighlightColorChanged: ICrosshairHighlightColorChangedEvent;
}
/**
 * @ignore
 */
export interface IFUniverCrosshairHighlightMixin {
    /**
     * Enable or disable crosshair highlight.
     * @param {boolean} enabled - Whether to enable the crosshair highlight
     * @returns {FUniver} The FUniver instance for chaining
     * @example
     * ```ts
     * univerAPI.setCrosshairHighlightEnabled(true);
     * ```
     */
    setCrosshairHighlightEnabled(enabled: boolean): FUniver;
    /**
     * Set the color of the crosshair highlight.
     * @param {string} color - The color of the crosshair highlight, if the color not has alpha channel, the alpha channel will be set to 0.5
     * @returns {FUniver} The FUniver instance for chaining
     * @example
     * ```ts
     * univerAPI.setCrosshairHighlightColor('#FF0000');
     * // or
     * univerAPI.setCrosshairHighlightColor('rgba(232, 11, 11, 0.2)');
     * ```
     */
    setCrosshairHighlightColor(color: string): FUniver;
    /**
     * Get whether the crosshair highlight is enabled.
     * @returns {boolean} Whether the crosshair highlight is enabled
     * @example
     * ```ts
     * console.log(univerAPI.getCrosshairHighlightEnabled());
     * ```
     */
    getCrosshairHighlightEnabled(): boolean;
    /**
     * Get the color of the crosshair highlight.
     * @returns {string} The color of the crosshair highlight
     * @example
     * ```ts
     * console.log(univerAPI.getCrosshairHighlightColor());
     * ```
     */
    getCrosshairHighlightColor(): string;
    /**
     * Get the available built-in colors for the crosshair highlight.
     */
    readonly CROSSHAIR_HIGHLIGHT_COLORS: string[];
}
/**
 * @ignore
 */
export declare class FUniverCrosshairHighlightMixin extends FUniver implements IFUniverCrosshairHighlightMixin {
    /**
     * @ignore
     */
    _initialize(injector: Injector): void;
    setCrosshairHighlightEnabled(enabled: boolean): FUniver;
    setCrosshairHighlightColor(color: string): FUniver;
    getCrosshairHighlightEnabled(): boolean;
    getCrosshairHighlightColor(): string;
    get CROSSHAIR_HIGHLIGHT_COLORS(): string[];
}
declare module '@univerjs/core/facade' {
    interface FUniver extends IFUniverCrosshairHighlightMixin {
    }
    interface FEventName extends IFSheetCrosshairHighlightEventMixin {
    }
    interface IEventParamConfig extends ISheetCrosshairHighlightEventConfigs {
    }
}
