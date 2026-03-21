import { Disposable, ICommandService } from '@univerjs/core';
import { ComponentManager, IMenuManagerService } from '@univerjs/ui';
export declare class UniscriptController extends Disposable {
    private readonly _menuManagerService;
    constructor(_menuManagerService: IMenuManagerService, commandService: ICommandService, componentManager: ComponentManager);
}
