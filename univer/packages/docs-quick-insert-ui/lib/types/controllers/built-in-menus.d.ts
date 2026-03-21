import { DocPopupMenu, IDocPopupMenuItem } from '../services/doc-quick-insert-popup.service';
export declare enum QuickInsertMenuGroup {
    Basic = "quick.insert.group.basic",
    Media = "quick.insert.group.media"
}
export declare const textMenu: IDocPopupMenuItem;
export declare const numberedListMenu: IDocPopupMenuItem;
export declare const bulletedListMenu: IDocPopupMenuItem;
export declare const dividerMenu: IDocPopupMenuItem;
export declare const tableMenu: IDocPopupMenuItem;
export declare const imageMenu: IDocPopupMenuItem;
export declare const builtInMenus: DocPopupMenu[];
export declare const builtInMenuCommandIds: Set<string>;
