import { ISidebarService } from '@univerjs/ui';
export interface IUniSidebarProps {
    position: 'left' | 'right';
    sidebarService: ISidebarService;
    showClose?: boolean;
}
export declare function LeftSidebar(): import("react/jsx-runtime").JSX.Element;
export declare function RightSidebar(): import("react/jsx-runtime").JSX.Element;
export declare function UniSidebar(props: IUniSidebarProps): import("react/jsx-runtime").JSX.Element;
