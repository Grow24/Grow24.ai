import { IAccessor } from '@univerjs/core';
import { IMenuButtonItem, IMenuSelectorItem, MenuSchemaType } from '@univerjs/ui';
export declare const RECORD_MENU_ITEM_ID = "RECORD_MENU_ITEM";
export declare function RecordMenuItemFactory(): IMenuSelectorItem;
export declare function OpenRecorderMenuItemFactory(accessor: IAccessor): IMenuButtonItem;
export declare function ReplayLocalRecordMenuItemFactory(): IMenuButtonItem;
export declare function ReplayLocalRecordOnNamesakeMenuItemFactory(): IMenuButtonItem;
export declare function ReplayLocalRecordOnActiveMenuItemFactory(): IMenuButtonItem;
export declare const menuSchema: MenuSchemaType;
