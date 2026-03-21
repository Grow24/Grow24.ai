import { FWorkbook } from '@univerjs/sheets/facade';
/**
 * @ignore
 */
export interface IFWorkbookSheetsZenEditorMixin {
    /**
     * Enter the zen editing process on the active cell
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the zen editing process was started successfully.
     * @example
     * ```ts
     * const fWorkbook = univerAPI.getActiveWorkbook();
     * const success = await fWorkbook.startZenEditingAsync();
     * console.log(success);
     * ```
     */
    startZenEditingAsync(): Promise<boolean>;
    /**
     * End the zen editing process on the active cell and optionally save the changes
     * @async
     * @param {boolean} save - Whether to save the changes, default is true
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the zen editing process was ended successfully.
     * @example
     * ```ts
     * const fWorkbook = univerAPI.getActiveWorkbook();
     * const success = await fWorkbook.endZenEditingAsync(false);
     * console.log(success);
     * ```
     */
    endZenEditingAsync(save?: boolean): Promise<boolean>;
}
export declare class FWorkbookSheetsZenEditorMixin extends FWorkbook implements IFWorkbookSheetsZenEditorMixin {
    startZenEditingAsync(): Promise<boolean>;
    endZenEditingAsync(save?: boolean): Promise<boolean>;
}
declare module '@univerjs/sheets/facade' {
    interface FWorkbook extends IFWorkbookSheetsZenEditorMixin {
    }
}
