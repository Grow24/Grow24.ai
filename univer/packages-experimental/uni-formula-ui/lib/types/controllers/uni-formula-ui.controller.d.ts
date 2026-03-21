import { Disposable, ICommandService } from '@univerjs/core';
import { ComponentManager } from '@univerjs/ui';
export declare class UniFormulaUniController extends Disposable {
    private readonly _commandSrv;
    private readonly _componentManager;
    constructor(_commandSrv: ICommandService, _componentManager: ComponentManager);
}
