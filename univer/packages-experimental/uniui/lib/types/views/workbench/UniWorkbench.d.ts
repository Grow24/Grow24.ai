import { IWorkbenchOptions } from '@univerjs/ui';
import { IUniverInstanceService } from '@univerjs/core';
import { IUnitGridService } from '../../services/unit-grid/unit-grid.service';
import '@xyflow/react/dist/style.css';
export interface IUniWorkbenchProps extends IWorkbenchOptions {
    mountContainer: HTMLElement;
    onRendered: (contentEl: HTMLElement) => void;
}
export declare function UniWorkbench(props: IUniWorkbenchProps): import("react/jsx-runtime").JSX.Element;
export interface IUnitRendererProps {
    unitId: string;
    gridService: IUnitGridService;
    instanceService: IUniverInstanceService;
}
