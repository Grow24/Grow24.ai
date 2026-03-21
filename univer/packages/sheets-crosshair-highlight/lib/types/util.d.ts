import { IRange } from '@univerjs/core';
export declare class CrossHairRangeCollection {
    private _selectedRanges;
    private _ranges;
    addRange(range: IRange): void;
    setSelectedRanges(selectedRange: IRange[]): void;
    private _getSplitRanges;
    private _getIntersects;
    getRanges(): IRange[];
    reset(): void;
}
