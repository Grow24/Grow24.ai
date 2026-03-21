import { Disposable, ILogService, Injector } from '@univerjs/core';
export declare const IUniscriptExecutionService: import('@wendellhu/redi').IdentifierDecorator<IUniscriptExecutionService>;
export interface IUniscriptExecutionService {
    execute(code: string): Promise<boolean>;
}
/**
 * This service is to execute Uniscript code.
 */
export declare class UniscriptExecutionService extends Disposable implements IUniscriptExecutionService {
    private readonly _logService;
    private readonly _injector;
    constructor(_logService: ILogService, _injector: Injector);
    execute(code: string): Promise<boolean>;
}
