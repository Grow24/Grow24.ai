import { Injector } from '@univerjs/core';
import { FUniver } from '@univerjs/core/facade';
/**
 * @ignore
 */
export interface IFUniverSheetsZenEditorMixin {
}
export declare class FUniverSheetsZenEditorMixin extends FUniver implements IFUniverSheetsZenEditorMixin {
    private _initSheetZenEditorEvent;
    /**
     * @ignore
     */
    _initialize(injector: Injector): void;
}
declare module '@univerjs/core/facade' {
    interface FUniver extends IFUniverSheetsZenEditorMixin {
    }
}
