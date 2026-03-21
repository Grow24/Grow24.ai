import { ICommand } from '@univerjs/core';
export interface ISetFlowViewportParams {
    viewport: {
        zoom: number;
        x: number;
        y: number;
    };
}
export declare const SetFlowViewportOperation: ICommand;
