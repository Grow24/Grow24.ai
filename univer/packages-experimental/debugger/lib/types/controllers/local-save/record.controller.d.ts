import { ICommandService } from '@univerjs/core';
import { Observable } from 'rxjs';
export declare class RecordController {
    private _commandService;
    constructor(_commandService: ICommandService);
    record(): Observable<{
        type: "start";
    } | {
        type: "finish";
        data: Blob;
    }>;
    startSaveCommands(): () => [string & {}, string & {}, string & {}, string & {}][];
}
