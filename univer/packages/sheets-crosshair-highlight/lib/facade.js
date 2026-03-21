import { ICommandService as l } from "@univerjs/core";
import { FEventName as C, FUniver as n } from "@univerjs/core/facade";
import { EnableCrosshairHighlightOperation as h, DisableCrosshairHighlightOperation as s, ToggleCrosshairHighlightOperation as d, SetCrosshairHighlightColorOperation as g, SheetsCrosshairHighlightService as o, CROSSHAIR_HIGHLIGHT_COLORS as c } from "@univerjs/sheets-crosshair-highlight";
class H {
  get CrosshairHighlightEnabledChanged() {
    return "CrosshairHighlightEnabledChanged";
  }
  get CrosshairHighlightColorChanged() {
    return "CrosshairHighlightColorChanged";
  }
}
class v extends n {
  /**
   * @ignore
   */
  _initialize(i) {
    const r = i.get(l);
    this.registerEventHandler(
      this.Event.CrosshairHighlightEnabledChanged,
      () => r.onCommandExecuted((e) => {
        if (e.id === h.id || e.id === s.id || e.id === d.id) {
          const t = this.getActiveSheet();
          if (!t) return;
          this.fireEvent(this.Event.CrosshairHighlightEnabledChanged, {
            enabled: this.getCrosshairHighlightEnabled(),
            ...t
          });
        }
      })
    ), this.registerEventHandler(
      this.Event.CrosshairHighlightColorChanged,
      () => r.onCommandExecuted((e) => {
        if (e.id === g.id) {
          const t = this.getActiveSheet();
          if (!t) return;
          this.fireEvent(this.Event.CrosshairHighlightColorChanged, {
            color: this.getCrosshairHighlightColor(),
            ...t
          });
        }
      })
    );
  }
  setCrosshairHighlightEnabled(i) {
    return i ? this._commandService.syncExecuteCommand(h.id) : this._commandService.syncExecuteCommand(s.id), this;
  }
  setCrosshairHighlightColor(i) {
    return this._commandService.syncExecuteCommand(g.id, {
      value: i
    }), this;
  }
  getCrosshairHighlightEnabled() {
    return this._injector.get(o).enabled;
  }
  getCrosshairHighlightColor() {
    return this._injector.get(o).color;
  }
  get CROSSHAIR_HIGHLIGHT_COLORS() {
    return c;
  }
}
C.extend(H);
n.extend(v);
