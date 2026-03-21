import { ReactFlowInstance } from '@xyflow/react';
import { Disposable } from '@univerjs/core';
export interface IFlowViewport {
    zoom: number;
    x: number;
    y: number;
}
export declare class FlowManagerService extends Disposable {
    private readonly _viewportChanged$;
    readonly viewportChanged$: import('rxjs').Observable<IFlowViewport | null>;
    private _flowInstance;
    constructor();
    getViewport(): import('@xyflow/react').Viewport;
    setViewport(viewport: {
        zoom: number;
        x: number;
        y: number;
    }): void;
    setReactFlowInstance(instance: ReactFlowInstance<any>): void;
    fitView(): void;
    zoomIn(): void;
    zoomOut(): void;
    setViewportChanged(viewport: IFlowViewport): void;
}
