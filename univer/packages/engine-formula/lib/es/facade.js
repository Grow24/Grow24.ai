import { FBase as _, FUniver as C } from "@univerjs/core/facade";
import { Inject as u, ICommandService as v, Injector as h, IConfigService as x } from "@univerjs/core";
import { LexerTreeBuilder as g, SetFormulaCalculationStartMutation as m, SetFormulaCalculationStopMutation as F, SetFormulaCalculationNotificationMutation as d, GlobalComputingStatusService as E, ENGINE_FORMULA_CYCLE_REFERENCE_COUNT as y, SetFormulaCalculationResultMutation as T, SetFormulaStringBatchCalculationMutation as R, SetFormulaStringBatchCalculationResultMutation as M, SetFormulaDependencyCalculationMutation as D, SetFormulaDependencyCalculationResultMutation as I, SetCellFormulaDependencyCalculationMutation as b, SetCellFormulaDependencyCalculationResultMutation as B, SetQueryFormulaDependencyMutation as p, SetQueryFormulaDependencyResultMutation as f } from "@univerjs/engine-formula";
import { firstValueFrom as L, race as P, filter as w, timer as N, map as O } from "rxjs";
var j = Object.getOwnPropertyDescriptor, A = (e, t, i, r) => {
  for (var n = r > 1 ? void 0 : r ? j(t, i) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (n = o(n) || n);
  return n;
}, s = (e, t) => (i, r) => t(i, r, e);
let c = class extends _ {
  constructor(e, t, i, r) {
    super(), this._commandService = e, this._injector = t, this._lexerTreeBuilder = i, this._configService = r, this._initialize();
  }
  /**
   * @ignore
   */
  _initialize() {
  }
  /**
   * The tree builder for formula string.
   * @type {LexerTreeBuilder}
   */
  get lexerTreeBuilder() {
    return this._lexerTreeBuilder;
  }
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
  moveFormulaRefOffset(e, t, i, r) {
    return this._lexerTreeBuilder.moveFormulaRefOffset(e, t, i, r);
  }
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
  sequenceNodesBuilder(e) {
    return this._lexerTreeBuilder.sequenceNodesBuilder(e) || [];
  }
  /**
   * Start the calculation of the formula.
   *
   * @example
   * ```ts
   * const formulaEngine = univerAPI.getFormula();
   * formulaEngine.executeCalculation();
   * ```
   */
  executeCalculation() {
    this._commandService.executeCommand(m.id, { commands: [], forceCalculation: !0 }, { onlyLocal: !0 });
  }
  /**
   * Stop the calculation of the formula.
   *
   * @example
   * ```ts
   * const formulaEngine = univerAPI.getFormula();
   * formulaEngine.stopCalculation();
   * ```
   */
  stopCalculation() {
    this._commandService.executeCommand(F.id, {});
  }
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
  calculationStart(e) {
    return this._commandService.onCommandExecuted((t) => {
      if (t.id === m.id) {
        const i = t.params;
        e(i.forceCalculation);
      }
    });
  }
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
  calculationEnd(e) {
    return this._commandService.onCommandExecuted((t) => {
      if (t.id !== d.id)
        return;
      const i = t.params;
      i.functionsExecutedState !== void 0 && e(i.functionsExecutedState);
    });
  }
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
  whenComputingCompleteAsync(e) {
    const t = this._injector.get(E);
    return t.computingStatus ? Promise.resolve(!0) : L(P(
      t.computingStatus$.pipe(w((i) => i)),
      N(e != null ? e : 3e4).pipe(O(() => !1))
    ));
  }
  /**
   * @deprecated Use `whenComputingCompleteAsync` instead.
   * @returns {Promise<void>} This method returns a promise that resolves when the calculation is complete.
   */
  onCalculationEnd() {
    return new Promise((e, t) => {
      const i = setTimeout(() => {
        t(new Error("Calculation end timeout"));
      }, 3e4), r = this.calculationEnd(() => {
        clearTimeout(i), r.dispose(), e();
      });
    });
  }
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
  calculationProcessing(e) {
    return this._commandService.onCommandExecuted((t) => {
      if (t.id !== d.id)
        return;
      const i = t.params;
      i.stageInfo !== void 0 && e(i.stageInfo);
    });
  }
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
  setMaxIteration(e) {
    this._configService.setConfig(y, e);
  }
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
  calculationResultApplied(e) {
    return this._commandService.onCommandExecuted((t) => {
      if (t.id !== T.id)
        return;
      const i = t.params;
      i !== void 0 && requestIdleCallback(() => {
        e(i);
      });
    });
  }
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
  onCalculationResultApplied() {
    return new Promise((e, t) => {
      let i = !1, r = !1;
      const n = setTimeout(() => {
        l(), t(new Error("Calculation end timeout"));
      }, 3e4), a = setTimeout(() => {
        i || (l(), e());
      }, 500), o = this.calculationProcessing(() => {
        i || (i = !0, clearTimeout(a));
      }), S = this.calculationResultApplied(() => {
        r || (r = !0, l(), e());
      });
      function l() {
        clearTimeout(n), clearTimeout(a), o.dispose(), S.dispose();
      }
    });
  }
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
  executeFormulas(e, t) {
    this._commandService.executeCommand(R.id, { formulas: e }, { onlyLocal: !0 });
    const i = this._commandService.onCommandExecuted((r) => {
      if (r.id !== M.id)
        return;
      const n = r.params;
      n.result != null && t(n.result), i.dispose();
    });
  }
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
  getAllDependencyTrees(e) {
    this._commandService.executeCommand(D.id, void 0, { onlyLocal: !0 });
    const t = this._commandService.onCommandExecuted((i) => {
      if (i.id !== I.id)
        return;
      const r = i.params;
      r.result != null && e(r.result), t.dispose();
    });
  }
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
  getCellDependencyTree(e, t) {
    this._commandService.executeCommand(b.id, e, { onlyLocal: !0 });
    const i = this._commandService.onCommandExecuted((r) => {
      if (r.id !== B.id)
        return;
      const n = r.params;
      n.result !== void 0 && t(n.result), i.dispose();
    });
  }
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
  getRangeDependents(e, t) {
    this._commandService.executeCommand(p.id, { unitRanges: e }, { onlyLocal: !0 });
    const i = this._commandService.onCommandExecuted((r) => {
      if (r.id !== f.id)
        return;
      const n = r.params;
      n.result != null && t(n.result), i.dispose();
    });
  }
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
  getInRangeFormulas(e, t) {
    this._commandService.executeCommand(p.id, { unitRanges: e, isInRange: !0 }, { onlyLocal: !0 });
    const i = this._commandService.onCommandExecuted((r) => {
      if (r.id !== f.id)
        return;
      const n = r.params;
      n.result != null && t(n.result), i.dispose();
    });
  }
};
c = A([
  s(0, u(v)),
  s(1, u(h)),
  s(2, u(g)),
  s(3, x)
], c);
class U extends C {
  getFormula() {
    return this._injector.createInstance(c);
  }
}
C.extend(U);
export {
  c as FFormula
};
