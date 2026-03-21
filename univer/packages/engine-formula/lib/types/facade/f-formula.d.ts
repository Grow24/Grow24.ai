import { IDisposable, IUnitRange, ICommandService, IConfigService, Injector } from '@univerjs/core';
import { FormulaExecutedStateType, IExecutionInProgressParams, IFormulaDependencyTreeFullJson, IFormulaDependencyTreeJson, IFormulaExecuteResultMap, IFormulaStringMap, ISequenceNode, ISetFormulaCalculationResultMutation, LexerTreeBuilder } from '@univerjs/engine-formula';
import { FBase } from '@univerjs/core/facade';
/**
 * This interface class provides methods to modify the behavior of the operation formula.
 * @hideconstructor
 */
export declare class FFormula extends FBase {
    protected readonly _commandService: ICommandService;
    protected readonly _injector: Injector;
    private _lexerTreeBuilder;
    protected readonly _configService: IConfigService;
    constructor(_commandService: ICommandService, _injector: Injector, _lexerTreeBuilder: LexerTreeBuilder, _configService: IConfigService);
    /**
     * @ignore
     */
    _initialize(): void;
    /**
     * The tree builder for formula string.
     * @type {LexerTreeBuilder}
     */
    get lexerTreeBuilder(): LexerTreeBuilder;
    /**
     * Offsets the formula
     * @param {string} formulaString - The formula string to offset
     * @param {number} refOffsetX - The offset column
     * @param {number} refOffsetY - The offset row
     * @param {boolean} [ignoreAbsolute] - Whether to ignore the absolute reference
     * @returns {string} The offset formula string
     *
     * @example
     * ```ts
     * const formulaEngine = univerAPI.getFormula();
     * const result = formulaEngine.moveFormulaRefOffset('=SUM(A1,B2)', 1, 1);
     * console.log(result);
     * ```
     */
    moveFormulaRefOffset(formulaString: string, refOffsetX: number, refOffsetY: number, ignoreAbsolute?: boolean): string;
    /**
     * Resolves the formula string to a 'node' node
     * @param {string} formulaString - The formula string to resolve
     * @returns {Array<ISequenceNode | string>} The nodes of the formula string
     *
     * @example
     * ```ts
     * const formulaEngine = univerAPI.getFormula();
     * const nodes = formulaEngine.sequenceNodesBuilder('=SUM(A1,B2)');
     * console.log(nodes);
     * ```
     */
    sequenceNodesBuilder(formulaString: string): (string | ISequenceNode)[];
    /**
     * Start the calculation of the formula.
     *
     * @example
     * ```ts
     * const formulaEngine = univerAPI.getFormula();
     * formulaEngine.executeCalculation();
     * ```
     */
    executeCalculation(): void;
    /**
     * Stop the calculation of the formula.
     *
     * @example
     * ```ts
     * const formulaEngine = univerAPI.getFormula();
     * formulaEngine.stopCalculation();
     * ```
     */
    stopCalculation(): void;
    /**
     * Listening calculation starts.
     * @param {Function} callback - The callback function to be called when the formula calculation starts.
     * @returns {IDisposable} The disposable instance.
     *
     * @example
     * ```ts
     * const formulaEngine = univerAPI.getFormula();
     * formulaEngine.calculationStart((forceCalculation) => {
     *   console.log('Calculation start', forceCalculation);
     * });
     * ```
     */
    calculationStart(callback: (forceCalculation: boolean) => void): IDisposable;
    /**
     * Listening calculation ends.
     * @param {Function} callback - The callback function to be called when the formula calculation ends.
     * @returns {IDisposable} The disposable instance.
     *
     * @example
     * ```ts
     * const formulaEngine = univerAPI.getFormula();
     * formulaEngine.calculationEnd((functionsExecutedState) => {
     *   console.log('Calculation end', functionsExecutedState);
     * });
     * ```
     */
    calculationEnd(callback: (functionsExecutedState: FormulaExecutedStateType) => void): IDisposable;
    /**
     * Wait for computing in the Univer instance to complete. Please note that this does not only include formula calculation,
     * but also other computing tasks, e.g. pivot table calculation.
     * @param {number} [timeout] The maximum time to wait for the computing to complete, in milliseconds. The default
     * value is 30,000 milliseconds.
     * @returns {Promise<boolean>} This method returns `true` if the computing is complete. If the timeout is reached, this
     * method returns `false`.
     *
     * @example
     * ```ts
     * const formulaEngine = univerAPI.getFormula();
     * formulaEngine.whenComputingCompleteAsync(3000).then((isComplete) => {
     *   console.log('Computing complete:', isComplete);
     * });
     * ```
     */
    whenComputingCompleteAsync(timeout?: number): Promise<boolean>;
    /**
     * @deprecated Use `whenComputingCompleteAsync` instead.
     * @returns {Promise<void>} This method returns a promise that resolves when the calculation is complete.
     */
    onCalculationEnd(): Promise<void>;
    /**
     * Listening calculation processing.
     * @param {Function} callback - The callback function to be called when the formula calculation is in progress.
     * @returns {IDisposable} The disposable instance.
     *
     * @example
     * ```ts
     * const formulaEngine = univerAPI.getFormula();
     * formulaEngine.calculationProcessing((stageInfo) => {
     *   console.log('Calculation processing', stageInfo);
     * });
     * ```
     */
    calculationProcessing(callback: (stageInfo: IExecutionInProgressParams) => void): IDisposable;
    /**
     * When a formula contains a circular reference, set the maximum number of iterations for the formula calculation.
     * @param {number} maxIteration The maximum number of iterations. The default value is 1.
     *
     * @example
     * ```ts
     * // Set the maximum number of iterations for the formula calculation to 5.
     * // The default value is 1.
     * const formulaEngine = univerAPI.getFormula();
     * formulaEngine.setMaxIteration(5);
     * ```
     */
    setMaxIteration(maxIteration: number): void;
    /**
     * Listens for the moment when formula-calculation results are applied.
     *
     * This event fires after the engine completes a calculation cycle and
     * dispatches a `SetFormulaCalculationResultMutation`.
     * The callback is invoked during an idle frame to avoid blocking UI updates.
     *
     * @param {Function} callback - A function called with the calculation result payload
     * once the result-application mutation is emitted.
     * @returns {IDisposable} A disposable used to unsubscribe from the event.
     *
     * @example
     * ```ts
     * const formulaEngine = univerAPI.getFormula();
     *
     * const dispose = formulaEngine.calculationResultApplied((result) => {
     *   console.log('Calculation results applied:', result);
     * });
     *
     * // Later…
     * dispose.dispose();
     * ```
     */
    calculationResultApplied(callback: (result: ISetFormulaCalculationResultMutation) => void): IDisposable;
    /**
     * Waits for formula-calculation results to be applied.
     *
     * This method resolves under three conditions:
     * 1. A real calculation runs and the engine emits a "calculation started" signal,
     *    followed by a "calculation result applied" signal.
     * 2. No calculation actually starts within 500 ms — the method assumes there is
     *    nothing to wait for and resolves automatically.
     * 3. A global 30 s timeout triggers, in which case the promise rejects.
     *
     * The API internally listens to both “calculation in progress” events and
     * “calculation result applied” events, ensuring it behaves correctly whether
     * formulas are recalculated or skipped due to cache/state.
     *
     * @returns {Promise<void>} A promise that resolves when calculation results are applied
     * or when no calculation occurs within the start-detection window.
     *
     * @example
     * ```ts
     * const formulaEngine = univerAPI.getFormula();
     *
     * // Wait for formula updates to apply before reading values.
     * await formulaEngine.onCalculationResultApplied();
     *
     * const value = sheet.getRange("C24").getValue();
     * console.log("Updated value:", value);
     * ```
     */
    onCalculationResultApplied(): Promise<void>;
    /**
     * Execute a batch of formulas asynchronously and receive computed results.
     *
     * Each formula cell is represented as a string array:
     *   [fullFormula, ...subFormulas]
     *
     * Where:
     *   - fullFormula (index 0) is the complete formula expression written in the cell.
     *     Example: "=SUM(A1:A10) + SQRT(D7)".
     *
     *   - subFormulas (index 1+) are **optional decomposed expressions** extracted from
     *     the full formula. Each of them can be independently computed by the formula engine.
     *
     *     These sub-expressions can include:
     *       - Single-cell references:  "A2", "B2", "C5"
     *       - Range references:        "A1:A10"
     *       - Function calls:          "SQRT(D7)", "ABS(A2-B2)"
     *       - Any sub-formula that was parsed out of the original formula and can be
     *         evaluated on its own.
     *
     *     The batch execution engine may use these sub-formulas for dependency resolution,
     *     incremental computation, or performance optimizations.
     *
     * @param {IFormulaStringMap} formulas
     *        Nested structure (unit → sheet → row → column) describing formulas and
     *        their decomposed sub-expressions.
     *
     * @param {(result: IFormulaExecuteResultMap) => void} callback
     *        Receives the computed value map mirroring the input structure.
     *
     * @returns {IDisposable}
     *          A disposer to stop listening for batch results.
     *
     * @example
     * ```ts
     * const formulaEngine = univerAPI.getFormula();
     * const formulas = {
     *   Book1: {
     *     Sheet1: {
     *       2: {
     *         3: [
     *           // Full formula:
     *           "=SUM(A1:A10) + SQRT(D7)",
     *
     *           // Decomposed sub-formulas (each one can be evaluated independently):
     *           "SUM(A1:A10)",   // sub-formula 1
     *           "SQRT(D7)",      // sub-formula 2
     *           "A1:A10",        // range reference
     *           "D7",            // single-cell reference
     *         ],
     *       },
     *       4: {
     *         5: [
     *           "=A2 + B2 + SQRT(C5)",
     *           "A2",
     *           "B2",
     *           "SQRT(C5)",
     *         ],
     *       }
     *     },
     *   },
     * };
     *
     * const disposer = formulaEngine.executeFormulas(formulas, (result) => {
     *   console.log(result);
     * });
     *
     * ```
     */
    executeFormulas(formulas: IFormulaStringMap, callback: (result: IFormulaExecuteResultMap) => void): void;
    /**
     * Retrieve all formula dependency trees that were produced during the latest
     * dependency-analysis run. This triggers a local dependency-calculation command
     * and returns the complete set of dependency trees once the calculation finishes.
     *
     * @param callback A function invoked with the resulting array of dependency trees.
     *
     * @returns {IDisposable} An object that disposes the internal event listener.
     *
     * @example
     * ```ts
     * const formulaEngine = univerAPI.getFormula();
     *
     * // Fetch all dependency trees generated for the current workbook.
     * const disposable = formulaEngine.getAllDependencyTrees((trees) => {
     *     console.log('All dependency trees:', trees);
     * });
     *
     * ```
     */
    getAllDependencyTrees(callback: (result: IFormulaDependencyTreeJson[]) => void): void;
    /**
     * Retrieve the dependency tree of a specific cell. This triggers a local
     * dependency-calculation command for the given unit, sheet, and cell location,
     * and returns the computed dependency tree when the calculation is completed.
     *
     * @param param The target cell location:
     *   - `unitId`  The workbook ID.
     *   - `sheetId` The sheet ID.
     *   - `row`     The zero-based row index.
     *   - `column`  The zero-based column index.
     *
     * @param callback A function invoked with the resulting dependency tree or
     * `undefined` if no dependency tree exists for that cell.
     *
     * @returns {IDisposable} An object that disposes the internal event listener.
     *
     * @example
     * ```ts
     * const formulaEngine = univerAPI.getFormula();
     *
     * // Query the dependency tree for cell B2 in a specific sheet.
     * const disposable = formulaEngine.getCellDependencyTree(
     *     { unitId: 'workbook1', sheetId: 'sheet1', row: 1, column: 1 },
     *     (tree) => {
     *         console.log('Cell dependency tree:', tree);
     *     }
     * );
     *
     * ```
     */
    getCellDependencyTree(param: {
        unitId: string;
        sheetId: string;
        row: number;
        column: number;
    }, callback: (result: IFormulaDependencyTreeFullJson | undefined) => void): void;
    /**
     * Retrieve the full dependency trees for all formulas that *depend on* the
     * specified ranges. This triggers a local dependency-calculation command and
     * invokes the callback once the calculation completes.
     *
     * @param unitRanges An array of workbook/sheet ranges to query. Each range
     *   includes:
     *   - `unitId`  The workbook ID.
     *   - `sheetId` The sheet ID.
     *   - `range`   The row/column boundaries.
     *
     * @param callback A function invoked with an array of `IFormulaDependencyTreeJson`
     * results. Each entry represents a formula node and its parent/child
     * relationships within the dependency graph.
     *
     * @example
     * ```ts
     * const formulaEngine = univerAPI.getFormula();
     *
     * // Query all formulas that depend on A1:B10 in Sheet1.
     * formulaEngine.getRangeDependents(
     *     [{ unitId: 'workbook1', sheetId: 'sheet1', range: { startRow: 0, endRow: 9, startColumn: 0, endColumn: 1 } }],
     *     (result) => {
     *         console.log('Dependent formulas:', result);
     *     }
     * );
     * ```
     */
    getRangeDependents(unitRanges: IUnitRange[], callback: (result: IFormulaDependencyTreeJson[]) => void): void;
    /**
     * Retrieve the dependency trees of all formulas *inside* the specified ranges.
     * Unlike `getRangeDependents`, this API only returns formulas whose definitions
     * physically reside within the queried ranges.
     *
     * Internally this triggers the same dependency-calculation command but with
     * `isInRange = true`, and the callback is invoked when the results are ready.
     *
     * @param unitRanges An array of workbook/sheet ranges defining the lookup
     *   boundaries:
     *   - `unitId`  The workbook ID.
     *   - `sheetId` The sheet ID.
     *   - `range`   The zero-based grid range.
     *
     * @param callback Receives an array of `IFormulaDependencyTreeJson` describing
     * every formula found in the provided ranges along with their parent/child
     * relationships.
     *
     * @example
     * ```ts
     * const formulaEngine = univerAPI.getFormula();
     *
     * // Query all formulas that lie within A1:D20 in Sheet1.
     * formulaEngine.getInRangeFormulas(
     *     [{ unitId: 'workbook1', sheetId: 'sheet1', range: { startRow: 0, endRow: 19, startColumn: 0, endColumn: 3 } }],
     *     (result) => {
     *         console.log('Formulas inside range:', result);
     *     }
     * );
     * ```
     */
    getInRangeFormulas(unitRanges: IUnitRange[], callback: (result: IFormulaDependencyTreeJson[]) => void): void;
}
