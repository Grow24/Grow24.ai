import { Nullable, Disposable } from '@univerjs/core';
export declare class DocMentionService extends Disposable {
    private readonly _editing$;
    readonly editing$: import('rxjs').Observable<Nullable<{
        unitId: string;
        index: number;
    }>>;
    get editing(): Nullable<{
        unitId: string;
        index: number;
    }>;
    constructor();
    startEditing(item: {
        unitId: string;
        index: number;
    }): void;
    endEditing(): void;
}
