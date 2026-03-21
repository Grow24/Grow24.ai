import { IAccessor } from '@univerjs/core';
import { IMenuButtonItem, IMenuItem, IMenuSelectorItem } from '@univerjs/ui';
export declare const UNIT_LINE_COLOR_MENU_ID = "UNIT_LINE_COLOR_MENU_ID";
export declare const DOWNLOAD_MENU_ID = "DOWNLOAD_MENU_ID";
export declare const SHARE_MENU_ID = "SHARE_MENU_ID";
export declare const LOCK_MENU_ID = "LOCK_MENU_ID";
export declare const PRINT_MENU_ID = "PRINT_MENU_ID";
export declare const ZEN_MENU_ID = "ZEN_MENU_ID";
export declare const DELETE_MENU_ID: string;
export declare const FRAME_SIZE_MENU_ID = "FRAME_SIZE_MENU_ID";
export declare const FONT_GROUP_MENU_ID = "FONT_GROUP_MENU_ID";
export declare const FAKE_FONT_FAMILY_MENU_ID = "FAKE_FONT_FAMILY_MENU_ID";
export declare const FAKE_FONT_SIZE_MENU_ID = "FAKE_FONT_SIZE_MENU_ID";
export declare const FAKE_FONT_COLOR_MENU_ID = "FAKE_FONT_COLOR_MENU_ID";
export declare const FAKE_BG_COLOR_MENU_ID = "FAKE_BG_COLOR_MENU_ID";
export declare const FAKE_IMAGE_MENU_ID = "FAKE_IMAGE_MENU_ID";
export declare const FAKE_FONT_GROUP_MENU_ID = "FAKE_FONT_GROUP_MENU_ID";
export declare const FAKE_TABLE_MENU_ID = "FAKE_TABLE_MENU_ID";
export declare const FAKE_UNORDER_LIST_MENU_ID = "FAKE_UNORDER_LIST_MENU_ID";
export declare const FAKE_ORDER_LIST_MENU_ID = "FAKE_ORDER_LIST_MENU_ID";
export declare enum UNI_MENU_POSITIONS {
    TOOLBAR_MAIN = "toolbar_main",
    TOOLBAR_FLOAT = "toolbar_float"
}
export declare function FakeFontFamilySelectorMenuItemFactory(): IMenuSelectorItem<string>;
export declare function FakeFontSizeSelectorMenuItemFactory(): IMenuSelectorItem<number>;
export declare function FakeTextColorSelectorMenuItemFactory(): IMenuSelectorItem<string>;
export declare function FakeBackgroundColorSelectorMenuItemFactory(): IMenuSelectorItem<string>;
export declare function FakeImageMenuFactory(): IMenuItem;
export declare function FakeUnorderListMenuItemFactory(): IMenuItem;
export declare function FakeOrderListMenuItemFactory(): IMenuItem;
export declare function FontGroupMenuItemFactory(accessor: IAccessor): IMenuSelectorItem;
export declare function FakeFontGroupMenuItemFactory(): IMenuSelectorItem;
export declare function FakePivotTableMenuItemFactory(): IMenuItem;
export declare function UnitLineColorMenuItemFactory(): IMenuButtonItem;
export declare function DownloadMenuItemFactory(): IMenuButtonItem;
export declare function ShareMenuItemFactory(): IMenuButtonItem;
export declare function LockMenuItemFactory(): IMenuButtonItem;
export declare function PrintMenuItemFactory(): IMenuButtonItem;
export declare function ZenMenuItemFactory(): IMenuButtonItem;
export declare function DeleteMenuItemFactory(): IMenuButtonItem;
