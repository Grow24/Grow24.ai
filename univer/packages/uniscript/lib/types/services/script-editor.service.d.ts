import { IDisposable, Disposable, IConfigService } from '@univerjs/core';
import { editor } from 'monaco-editor';
/**
 * This service is for loading monaco editor and its resources. It also holds the
 * monaco editor instance so user can interact with the editor programmatically.
 */
export declare class ScriptEditorService extends Disposable {
    private readonly _configService;
    private _editorInstance;
    constructor(_configService: IConfigService);
    dispose(): void;
    setEditorInstance(editor: editor.IStandaloneCodeEditor): IDisposable;
    getEditorInstance(): editor.IStandaloneCodeEditor | null;
    requireVscodeEditor(): void;
}
