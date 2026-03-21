import { Disposable } from '@univerjs/core';
export declare const CROSSHAIR_HIGHLIGHT_COLORS: string[];
export declare class SheetsCrosshairHighlightService extends Disposable {
    private readonly _enabled$;
    readonly enabled$: import('rxjs').Observable<boolean>;
    get enabled(): boolean;
    private readonly _color$;
    readonly color$: import('rxjs').Observable<string>;
    get color(): string;
    dispose(): void;
    setEnabled(value: boolean): void;
    setColor(value: string): void;
}
