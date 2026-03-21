import { Disposable, UniverInstanceType } from '@univerjs/core';
interface IItemImpl {
    id: string;
    type: UniverInstanceType;
}
export interface IUniToolbarItem {
    id: string;
    impl: IItemImpl[];
}
export declare enum BuiltinUniToolbarItemId {
    UNDO = "undo",
    REDO = "redo",
    FONT_FAMILY = "font-famaily",
    FONT_SIZE = "font-size",
    FONT_GROUP = "font-group",
    COLOR = "color",
    BACKGROUND = "background",
    IMAGE = "image",
    TABLE = "table",
    UNORDER_LIST = "unorder-list",
    ORDER_LIST = "order-list"
}
export declare class UniToolbarService extends Disposable {
    private _items;
    constructor();
    private _init;
    addItem(item: IUniToolbarItem): import('@wendellhu/redi').IDisposable;
    getItems(): IUniToolbarItem[];
    implementItem(id: string, impl: IItemImpl): import('@wendellhu/redi').IDisposable;
}
export {};
