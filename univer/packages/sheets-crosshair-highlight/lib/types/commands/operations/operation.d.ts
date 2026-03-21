import { IOperation } from '@univerjs/core';
/**
 * A {@link CommandType.OPERATION} to toggle the crosshair highlight.
 */
export declare const ToggleCrosshairHighlightOperation: IOperation;
/**
 * A {@link CommandType.OPERATION} to set the crosshair highlight color.
 * @property {string} value - The color value to set.
 */
export interface ISetCrosshairHighlightColorOperationParams {
    value: string;
}
/**
 * A {@link CommandType.OPERATION} to set the crosshair highlight color. It the crosshair highlight is not enabled,
 * it will be enabled.
 *
 * Its params {@link ISetCrosshairHighlightColorOperationParams} contains the color value to set as and is required.
 */
export declare const SetCrosshairHighlightColorOperation: IOperation<ISetCrosshairHighlightColorOperationParams>;
/**
 * A {@link CommandType.OPERATION} to enable the crosshair highlight.
 */
export declare const EnableCrosshairHighlightOperation: IOperation;
/**
 * A {@link CommandType.OPERATION} to disable the crosshair highlight.
 */
export declare const DisableCrosshairHighlightOperation: IOperation;
