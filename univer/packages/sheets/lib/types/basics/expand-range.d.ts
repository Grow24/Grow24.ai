import { IRange, Worksheet } from '@univerjs/core';
export interface IExpandParams {
    left?: boolean;
    right?: boolean;
    up?: boolean;
    down?: boolean;
}
/**
 * Expand the range to a continuous range, it uses when Ctrl + A , or only one cell selected to add a pivot table adn so on.
 * The demo unit=YSvbxFMCTxugbku-IWNyxQ&type=2&subunit=U_wr1DEF84N_mbesFNmxR in pro.
 * The excel behavior rules:
 * 1. If the range has a span, the range should expand to whole span range.
 * 2. If range left, right, up, down has value, the range should expand to the cell which has value.
 * 3. If the range has no value, the range should not expand.
 * 4. If the merge has span, the every cell value in span should be the anchor of the span range.
 * 5. The span range should be not part in the result range.
 * @param {IRange} startRange The start range.
 * @param {IExpandParams} directions The directions to expand.
 * @param {Worksheet} worksheet The worksheet working on.
 * @returns {IRange} The expanded range.
 */
export declare function expandToContinuousRange(startRange: IRange, directions: IExpandParams, worksheet: Worksheet): IRange;
