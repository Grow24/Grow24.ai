import { IRange, Workbook, Worksheet, Disposable, IContextService } from '@univerjs/core';
import { IRenderContext, IRenderModule } from '@univerjs/engine-render';
import { SheetsSelectionsService } from '@univerjs/sheets';
import { SheetSkeletonManagerService } from '@univerjs/sheets-ui';
import { SheetsCrosshairHighlightService } from '../../services/crosshair.service';
export declare class SheetCrosshairHighlightRenderController extends Disposable implements IRenderModule {
    private readonly _context;
    private readonly _sheetSkeletonManagerService;
    private readonly _sheetsSelectionsService;
    private readonly _sheetsCrosshairHighlightService;
    private readonly _contextService;
    private readonly _refSelectionsService;
    private _shapes;
    private _rangeCollection;
    private _color;
    constructor(_context: IRenderContext<Workbook>, _sheetSkeletonManagerService: SheetSkeletonManagerService, _sheetsSelectionsService: SheetsSelectionsService, _sheetsCrosshairHighlightService: SheetsCrosshairHighlightService, _contextService: IContextService, _refSelectionsService: SheetsSelectionsService);
    private _transformSelection;
    private _initRenderListener;
    addSelection(range: IRange, sheet: Worksheet): void;
    private _clear;
    private _addShapes;
    render(ranges: IRange[]): void;
    dispose(): Promise<void>;
}
