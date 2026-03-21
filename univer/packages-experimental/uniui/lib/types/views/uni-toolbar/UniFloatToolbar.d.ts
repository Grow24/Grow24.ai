import { Nullable } from '@univerjs/core';
import { IUnitRendererProps } from '../workbench/UniWorkbench';
export interface IFloatingToolbarRef {
    update: () => void;
}
export declare enum UniFloatToolbarUIPart {
    NAME = "name"
}
export declare const UniFloatingToolbar: import('react').ForwardRefExoticComponent<{
    node: Nullable<IUnitRendererProps>;
} & import('react').RefAttributes<IFloatingToolbarRef>>;
export declare function UniDiv(): import("react/jsx-runtime").JSX.Element;
export declare function UnitName({ unitId }: {
    unitId: string;
}): import("react/jsx-runtime").JSX.Element;
