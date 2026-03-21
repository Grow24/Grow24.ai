import { IRgbColor, Nullable } from '@univerjs/core';
import { IShapeProps, Shape } from '@univerjs/engine-render';
export interface ISheetCrossHairHighlightShapeProps extends IShapeProps {
    color: IRgbColor;
}
export declare class SheetCrossHairHighlightShape extends Shape<ISheetCrossHairHighlightShapeProps> {
    protected _color: Nullable<IRgbColor>;
    constructor(key?: string, props?: ISheetCrossHairHighlightShapeProps);
    setShapeProps(props: Partial<ISheetCrossHairHighlightShapeProps>): void;
    protected _draw(ctx: CanvasRenderingContext2D): void;
}
