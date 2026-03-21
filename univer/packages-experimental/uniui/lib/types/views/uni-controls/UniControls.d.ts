import { CSSProperties, ReactElement } from 'react';
export declare const UniControlButton: (props: {
    tooltips: string;
    children?: ReactElement;
    onClick: () => void;
    style?: CSSProperties;
}) => import("react/jsx-runtime").JSX.Element;
export declare const MAX_ZOOM = 2;
export declare const MIN_ZOOM = 0.1;
export declare const DEFAULT_ZOOM = 1;
export declare enum UniControlItem {
    AI = "AI"
}
export declare const UniControls: ({ zoom, onItemClick }: {
    zoom: number;
    onItemClick?: (key: UniControlItem) => void;
}) => import("react/jsx-runtime").JSX.Element;
