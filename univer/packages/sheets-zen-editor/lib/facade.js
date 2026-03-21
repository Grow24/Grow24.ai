import { ICommandService as u, CanceledError as k, IUniverInstanceService as p, RichTextValue as w, DOCS_ZEN_EDITOR_UNIT_ID_KEY as S } from "@univerjs/core";
import { FUniver as f } from "@univerjs/core/facade";
import { RichTextEditingMutation as T } from "@univerjs/docs";
import { IEditorBridgeService as v } from "@univerjs/sheets-ui";
import { OpenZenEditorCommand as l, CancelZenEditCommand as C, ConfirmZenEditCommand as m } from "@univerjs/sheets-zen-editor";
import { FWorkbook as x } from "@univerjs/sheets/facade";
class b extends f {
  // eslint-disable-next-line max-lines-per-function
  _initSheetZenEditorEvent(i) {
    const h = i.get(u);
    this.registerEventHandler(
      this.Event.BeforeSheetEditStart,
      () => h.beforeCommandExecuted((e) => {
        if (e.id === l.id) {
          const t = this.getCommandSheetTarget(e);
          if (!t)
            return;
          const { workbook: s, worksheet: d } = t, o = i.get(v), c = e.params, { keycode: a, eventType: E } = c, r = o.getEditLocation(), n = {
            row: r.row,
            column: r.column,
            eventType: E,
            keycode: a,
            workbook: s,
            worksheet: d,
            isZenEditor: !0
          };
          if (this.fireEvent(this.Event.BeforeSheetEditStart, n), n.cancel)
            throw new k();
        }
      })
    ), this.registerEventHandler(
      this.Event.BeforeSheetEditEnd,
      () => h.beforeCommandExecuted((e) => {
        if (e.id === C.id || e.id === m.id) {
          const t = this.getCommandSheetTarget(e);
          if (!t)
            return;
          const { workbook: s, worksheet: d } = t, o = i.get(v), c = i.get(p), a = e.params, { keycode: E, eventType: r } = a, n = o.getEditLocation(), g = {
            row: n.row,
            column: n.column,
            eventType: r,
            keycode: E,
            workbook: s,
            worksheet: d,
            isZenEditor: !0,
            value: w.create(c.getUnit(S).getSnapshot()),
            isConfirm: e.id === m.id
          };
          if (this.fireEvent(this.Event.BeforeSheetEditEnd, g), g.cancel)
            throw new k();
        }
      })
    ), this.registerEventHandler(
      this.Event.SheetEditStarted,
      () => h.onCommandExecuted((e) => {
        if (e.id === l.id) {
          const t = this.getCommandSheetTarget(e);
          if (!t)
            return;
          const { workbook: s, worksheet: d } = t, o = i.get(v), c = e.params, { keycode: a, eventType: E } = c, r = o.getEditLocation(), n = {
            row: r.row,
            column: r.column,
            eventType: E,
            keycode: a,
            workbook: s,
            worksheet: d,
            isZenEditor: !0
          };
          this.fireEvent(this.Event.SheetEditStarted, n);
        }
      })
    ), this.registerEventHandler(
      this.Event.SheetEditEnded,
      () => h.onCommandExecuted((e) => {
        if (e.id === C.id || e.id === m.id) {
          const t = this.getCommandSheetTarget(e);
          if (!t)
            return;
          const { workbook: s, worksheet: d } = t, o = i.get(v), c = e.params, { keycode: a, eventType: E } = c, r = o.getEditLocation(), n = {
            row: r.row,
            column: r.column,
            eventType: E,
            keycode: a,
            workbook: s,
            worksheet: d,
            isZenEditor: !0,
            isConfirm: e.id === m.id
          };
          this.fireEvent(this.Event.SheetEditEnded, n);
        }
      })
    ), this.registerEventHandler(
      this.Event.SheetEditChanging,
      () => h.onCommandExecuted((e) => {
        if (e.id === T.id) {
          const t = this.getActiveSheet();
          if (!t)
            return;
          const { workbook: s, worksheet: d } = t, o = i.get(v), c = i.get(p), a = e.params;
          if (!o.isVisible().visible) return;
          const { unitId: E } = a;
          if (E === S) {
            const { row: r, column: n } = o.getEditLocation(), g = {
              workbook: s,
              worksheet: d,
              row: r,
              column: n,
              value: w.create(c.getUnit(S).getSnapshot()),
              isZenEditor: !0
            };
            this.fireEvent(this.Event.SheetEditChanging, g);
          }
        }
      })
    );
  }
  /**
   * @ignore
   */
  _initialize(i) {
    this._initSheetZenEditorEvent(i);
  }
}
f.extend(b);
class y extends x {
  startZenEditingAsync() {
    return this._injector.get(u).executeCommand(l.id);
  }
  endZenEditingAsync(i = !0) {
    const h = this._injector.get(u);
    return i ? h.executeCommand(m.id) : h.executeCommand(C.id);
  }
}
x.extend(y);
