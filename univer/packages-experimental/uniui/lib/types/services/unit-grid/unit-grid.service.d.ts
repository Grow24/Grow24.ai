import { Nullable, UnitModel, Disposable, ILocalStorageService, IUniverInstanceService, UniverInstanceType } from '@univerjs/core';
import { IRender, IRenderManagerService } from '@univerjs/engine-render';
import { Observable } from 'rxjs';
export type IUnitGrid = IProjectNode[];
export interface IProjectNode {
    id: string;
    data: {
        unitId: string;
        type: UniverInstanceType;
    };
    style: {
        width: string;
        height: string;
        display: string;
        borderRadius: string;
        border: string;
        backgroundColor: string;
    };
    position: {
        x: number;
        y: number;
    };
}
export interface IUnitGridService {
    readonly unitGrid: IProjectNode[];
    readonly unitGrid$: Observable<IProjectNode[]>;
    readonly newNode: IProjectNode | null;
    readonly newNode$: Observable<IProjectNode | null>;
    setContainerForRender(unitId: string, element: HTMLElement): void;
    changeDimension(id: string, dimensions: {
        width: number;
        height: number;
    }): void;
    changePosition(id: string, position: {
        x: number;
        y: number;
    }): void;
}
export declare const IUnitGridService: import('@wendellhu/redi').IdentifierDecorator<IUnitGridService>;
/**
 * This services decides which (now at maximum two) units are going to be rendered in the browser.
 */
export declare class UnitGridService extends Disposable implements IUnitGridService {
    protected readonly _renderSrv: IRenderManagerService;
    protected readonly _localStorageService: ILocalStorageService;
    private readonly _univerInstanceService;
    protected _unitGrid: IUnitGrid;
    private readonly _unitGrid$;
    readonly unitGrid$: Observable<IUnitGrid>;
    protected _newNode: IProjectNode | null;
    private readonly _newNode$;
    readonly newNode$: Observable<IProjectNode | null>;
    get unitGrid(): IUnitGrid;
    get cachedGrid(): Nullable<IUnitGrid>;
    get newNode(): IProjectNode | null;
    private _nodeIndex;
    constructor(_renderSrv: IRenderManagerService, _localStorageService: ILocalStorageService, _univerInstanceService: IUniverInstanceService);
    dispose(): void;
    setNewNodeObserver(): void;
    setContainerForRender(unitId: string, element: HTMLElement): void;
    changeDimension(id: string, dimension: {
        width: number;
        height: number;
    }): void;
    changePosition(id: string, position: {
        x: number;
        y: number;
    }): void;
    private _init;
    protected _cachedGrid: Nullable<IUnitGrid>;
    protected _initData(): Promise<void>;
    protected _cacheData(): void;
    protected _onRendererCreated(renderer: IRender): void;
    private _insertNewNode;
    protected _onUnitDisposed(unitModel: UnitModel): void;
    private _emitLayoutChange;
}
export declare function getGridUnitLocalCacheKey(projectId: string): string;
