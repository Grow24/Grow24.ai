import { Disposable, ICommandService } from '@univerjs/core';
import { ComponentManager } from '@univerjs/ui';
export declare class DocMentionUIController extends Disposable {
    private readonly _commandService;
    private readonly _componentManager;
    constructor(_commandService: ICommandService, _componentManager: ComponentManager);
    private _initCommands;
    private _initComponents;
}
