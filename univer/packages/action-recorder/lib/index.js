var ne = Object.defineProperty;
var oe = (e, t, r) => t in e ? ne(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var l = (e, t, r) => oe(e, typeof t != "symbol" ? t + "" : t, r);
import { Disposable as P, CommandType as m, ICommandService as M, ILogService as H, IUniverInstanceService as J, awaitTime as ie, Inject as O, Injector as G, IConfigService as ce, Plugin as ae, merge as se } from "@univerjs/core";
import { useRef as de, createElement as Z, forwardRef as le, useCallback as y } from "react";
import { SetSelectionsOperation as A, CopySheetCommand as me, DeleteRangeMoveLeftCommand as ue, DeleteRangeMoveUpCommand as he, DeltaColumnWidthCommand as ge, DeltaRowHeightCommand as fe, InsertSheetCommand as pe, InsertColAfterCommand as Se, InsertColBeforeCommand as ve, InsertRowAfterCommand as Ce, InsertRowBeforeCommand as _e, RemoveSheetCommand as ye, SetStyleCommand as Re, AddWorksheetMergeCommand as Ie, AddWorksheetMergeAllCommand as Oe, AddWorksheetMergeVerticalCommand as we, AddWorksheetMergeHorizontalCommand as Me, SetFrozenCommand as $e, CancelFrozenCommand as xe, SetHorizontalTextAlignCommand as Ne, SetOverlineCommand as Ue, SetRangeValuesCommand as Ae, SetStrikeThroughCommand as be, SetTextColorCommand as Fe, SetTextRotationCommand as Pe, SetTextWrapCommand as Te, SetVerticalTextAlignCommand as De, SetWorksheetActivateCommand as Ee, SetWorksheetActiveOperation as Le } from "@univerjs/sheets";
import { SetSheetFilterRangeCommand as je, SetSheetsFilterCriteriaCommand as Be, RemoveSheetFilterCommand as ke } from "@univerjs/sheets-filter";
import { SetRangeBoldCommand as Ve, SetRangeFontFamilyCommand as We, SetRangeFontSizeCommand as ze, SetRangeItalicCommand as He, SetRangeStrickThroughCommand as Je, SetRangeSubscriptCommand as Ge, SetRangeSuperscriptCommand as Ze, SetRangeTextColorCommand as Ke, SetRangeUnderlineCommand as Ye, SheetCopyCommand as qe, SheetCutCommand as Qe, SheetPasteBesidesBorderCommand as Xe, SheetPasteColWidthCommand as et, SheetPasteCommand as tt, SheetPasteFormatCommand as rt, SheetPasteShortKeyCommand as nt, SheetPasteValueCommand as ot, AutoFillCommand as it, RefillCommand as ct } from "@univerjs/sheets-ui";
import { ILocalFileService as K, IMessageService as $, useDependency as b, useObservable as F, RibbonOthersGroup as at, MenuItemType as _, IUIPartsService as st, IMenuManagerService as dt, ComponentManager as lt, BuiltInUIPart as mt, connectInjector as ut } from "@univerjs/ui";
import { BehaviorSubject as R } from "rxjs";
import { MessageType as x, Button as N } from "@univerjs/design";
import { jsx as g, jsxs as k } from "react/jsx-runtime";
function Y({ ref: e, ...t }) {
  const { icon: r, id: n, className: o, extend: i, ...c } = t, a = `univerjs-icon univerjs-icon-${n} ${o || ""}`.trim(), u = de(`_${ft()}`);
  return q(r, `${n}`, {
    defIds: r.defIds,
    idSuffix: u.current
  }, {
    ref: e,
    className: a,
    ...c
  }, i);
}
function q(e, t, r, n, o) {
  return Z(e.tag, {
    key: t,
    ...ht(e, r, o),
    ...n
  }, (gt(e, r).children || []).map((i, c) => q(i, `${t}-${e.tag}-${c}`, r, void 0, o)));
}
function ht(e, t, r) {
  const n = { ...e.attrs };
  r != null && r.colorChannel1 && n.fill === "colorChannel1" && (n.fill = r.colorChannel1), e.tag === "mask" && n.id && (n.id = n.id + t.idSuffix), Object.entries(n).forEach(([i, c]) => {
    i === "mask" && typeof c == "string" && (n[i] = c.replace(/url\(#(.*)\)/, `url(#$1${t.idSuffix})`));
  });
  const { defIds: o } = t;
  return !o || o.length === 0 || (e.tag === "use" && n["xlink:href"] && (n["xlink:href"] = n["xlink:href"] + t.idSuffix), Object.entries(n).forEach(([i, c]) => {
    typeof c == "string" && (n[i] = c.replace(/url\(#(.*)\)/, `url(#$1${t.idSuffix})`));
  })), n;
}
function gt(e, t) {
  var n;
  const { defIds: r } = t;
  return !r || r.length === 0 ? e : e.tag === "defs" && ((n = e.children) != null && n.length) ? {
    ...e,
    children: e.children.map((o) => typeof o.attrs.id == "string" && r && r.includes(o.attrs.id) ? {
      ...o,
      attrs: {
        ...o.attrs,
        id: o.attrs.id + t.idSuffix
      }
    } : o)
  } : e;
}
function ft() {
  return Math.random().toString(36).substring(2, 8);
}
Y.displayName = "UniverIcon";
const pt = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 17 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "g",
    attrs: {
      fill: "currentColor",
      clipPath: "url(#record-icon_clip0_1559_19)"
    },
    children: [{
      tag: "path",
      attrs: { d: "M7.60303 10C8.7076 10 9.60303 9.10457 9.60303 8C9.60303 6.89543 8.7076 6 7.60303 6C6.49846 6 5.60303 6.89543 5.60303 8C5.60303 9.10457 6.49846 10 7.60303 10Z" }
    }, {
      tag: "path",
      attrs: {
        d: "M1.66943 5.29023C1.66941 3.85426 2.83349 2.69017 4.26946 2.69019L10.9362 2.69026C12.3192 2.69028 13.45 3.77008 13.5315 5.13259L14.5692 4.55638C15.3024 4.14929 16.2032 4.67947 16.2032 5.51809V10.4819C16.2032 11.3205 15.3024 11.8507 14.5692 11.4436L13.5315 10.8674C13.45 12.2299 12.3192 13.3097 10.9362 13.3097H4.26953C2.83361 13.3097 1.66956 12.1457 1.66953 10.7098L1.66943 5.29023ZM13.5362 9.49743L15.0032 10.312V5.68799L13.5362 6.50254V9.49743ZM4.26945 3.89019C3.49623 3.89018 2.86942 4.517 2.86943 5.29021L2.86953 10.7098C2.86955 11.483 3.49634 12.1097 4.26953 12.1097H10.9362C11.7094 12.1097 12.3362 11.4829 12.3362 10.7097V5.29026C12.3362 4.51707 11.7094 3.89027 10.9362 3.89026L4.26945 3.89019Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    }]
  }, {
    tag: "defs",
    attrs: {},
    children: [{
      tag: "clipPath",
      attrs: { id: "record-icon_clip0_1559_19" },
      children: [{
        tag: "path",
        attrs: {
          fill: "white",
          d: "M0 0H16V16H0z",
          transform: "translate(.94)"
        }
      }]
    }]
  }],
  defIds: ["record-icon_clip0_1559_19"]
}, T = le(function(t, r) {
  return Z(Y, Object.assign({}, t, {
    id: "record-icon",
    ref: r,
    icon: pt
  }));
});
T.displayName = "RecordIcon";
var St = Object.getOwnPropertyDescriptor, vt = (e, t, r, n) => {
  for (var o = n > 1 ? void 0 : n ? St(t, r) : t, i = e.length - 1, c; i >= 0; i--)
    (c = e[i]) && (o = c(o) || o);
  return o;
}, I = (e, t) => (r, n) => t(r, n, e);
let d = class extends P {
  constructor(t, r, n, o) {
    super();
    l(this, "_shouldRecordCommands", /* @__PURE__ */ new Set());
    l(this, "_panelOpened$", new R(!1));
    l(this, "panelOpened$", this._panelOpened$.asObservable());
    l(this, "_recorder", null);
    l(this, "_recording$", new R(!1));
    l(this, "recording$", this._recording$.asObservable());
    l(this, "_recorded$", new R([]));
    l(this, "_recordedCommands$", new R([]));
    l(this, "recordedCommands$", this._recordedCommands$.asObservable());
    this._commandSrv = t, this._logService = r, this._localFileService = n, this._instanceService = o;
  }
  get recording() {
    return this._recording$.getValue();
  }
  get _recorded() {
    return this._recorded$.getValue();
  }
  get _recordedCommands() {
    return this._recordedCommands$.getValue();
  }
  registerRecordedCommand(t) {
    if (t.type === m.MUTATION) throw new Error("[CommandRecorderService] Cannot record mutation commands.");
    this._shouldRecordCommands.add(t.id);
  }
  togglePanel(t) {
    this._panelOpened$.next(t), t === !1 && this.stopRecording();
  }
  startRecording(t = !1) {
    this._recorder = this._commandSrv.onCommandExecuted((r) => {
      var n, o;
      if (this._shouldRecordCommands.has(r.id)) {
        const i = this._recorded, c = this._recordedCommands;
        let a = { ...r };
        const u = (n = this._instanceService.getFocusedUnit()) == null ? void 0 : n.getUnitId(), { unitId: h = u, subUnitId: s } = a == null ? void 0 : a.params;
        if (t && h && s) {
          const S = (o = this._instanceService.getUnit(h).getSheetBySheetId(s)) == null ? void 0 : o.getName();
          a = {
            ...a,
            params: {
              ...a.params,
              subUnitId: S
            }
          };
        }
        a.id === A.id && i.length > 0 && i[i.length - 1].id === A.id ? i[i.length - 1] = a : (i.push(a), this._recorded$.next(i), a.type === m.COMMAND && (c.push(a), this._recordedCommands$.next(c)));
      }
    }), this._recording$.next(!0);
  }
  stopRecording() {
    var t;
    (t = this._recorder) == null || t.dispose(), this._recorder = null, this._recorded$.next([]), this._recordedCommands$.next([]), this._recording$.next(!1);
  }
  completeRecording() {
    const t = this._recorded.slice();
    this._localFileService.downloadFile(new Blob([JSON.stringify(t, null, 2)]), "recorded-commands.json"), this._logService.error("Recorded commands:", t), this.stopRecording();
  }
};
d = vt([
  I(0, M),
  I(1, H),
  I(2, K),
  I(3, J)
], d);
const Q = {
  id: "action-recorder.command.start-recording",
  type: m.COMMAND,
  handler: (e, t) => (e.get(d).startRecording(!!(t != null && t.replaceId)), !0)
}, X = {
  id: "action-recorder.command.complete-recording",
  type: m.COMMAND,
  handler: (e) => (e.get(d).completeRecording(), !0)
}, ee = {
  id: "action-recorder.command.stop-recording",
  type: m.COMMAND,
  handler: (e) => (e.get(d).completeRecording(), !0)
};
var Ct = Object.getOwnPropertyDescriptor, _t = (e, t, r, n) => {
  for (var o = n > 1 ? void 0 : n ? Ct(t, r) : t, i = e.length - 1, c; i >= 0; i--)
    (c = e[i]) && (o = c(o) || o);
  return o;
}, C = (e, t) => (r, n) => t(r, n, e), D = /* @__PURE__ */ ((e) => (e.DEFAULT = "default", e.NAME = "name", e.ACTIVE = "active", e))(D || {});
let f = class extends P {
  constructor(e, t, r, n, o) {
    super(), this._messageService = e, this._instanceService = t, this._localFileService = r, this._logService = n, this._commandService = o;
  }
  /**
   * Read a local file and try to replay commands in this JSON.
   */
  async replayLocalJSON(e = "default") {
    const t = await this._localFileService.openFile({ multiple: !1, accept: ".json" });
    if (t.length !== 1) return !1;
    const r = t[0];
    try {
      return this.replayCommands(JSON.parse(await r.text()), { mode: e });
    } catch {
      return this._messageService.show({
        type: x.Error,
        content: `Failed to replay commands from local file ${r.name}.`
      }), !1;
    }
  }
  /**
   * Replay a list of commands. Note that `unitId` of these commands would be changed to the focused unit.
   * @param commands - The commands to replay.
   * @returns If the replay is successful.
   */
  async replayCommands(e, t) {
    var o, i, c;
    const r = (o = this._instanceService.getFocusedUnit()) == null ? void 0 : o.getUnitId();
    r || this._logService.error("[ReplayService]", "no focused unit to replay commands");
    const { mode: n } = t || {};
    for (const a of e) {
      const { id: u, params: h } = a, s = h;
      if (s) {
        if (typeof s.unitId < "u" && (s.unitId = r), n === "name" && s.subUnitId !== "undefined") {
          const v = (i = this._instanceService.getFocusedUnit().getSheetBySheetName(s.subUnitId)) == null ? void 0 : i.getSheetId();
          v ? s.subUnitId = v : this._logService.error("[ReplayService]", `failed to find subunit by subUnitName = ${s.subUnitId}`);
        }
        if (n === "active" && s.subUnitId !== "undefined") {
          const v = (c = this._instanceService.getFocusedUnit().getActiveSheet()) == null ? void 0 : c.getSheetId();
          v ? s.subUnitId = v : this._logService.error("[ReplayService]", "failed to find active subunit");
        }
        if (!await this._commandService.executeCommand(u, h)) return !1;
      } else if (!await this._commandService.executeCommand(u)) return !1;
    }
    return !0;
  }
  /**
   * Replay a list of commands with a random delay between each command.
   * @param commands - The commands to replay.
   */
  async replayCommandsWithDelay(e) {
    var r;
    const t = (r = this._instanceService.getFocusedUnit()) == null ? void 0 : r.getUnitId();
    t || this._logService.error("[ReplayService]", "no focused unit to replay commands");
    for (const n of e) {
      await ie(yt());
      const { id: o, params: i } = n;
      if (i) {
        if (typeof i.unitId < "u" && (i.unitId = t), !await this._commandService.executeCommand(o, i)) return !1;
      } else if (!await this._commandService.executeCommand(o)) return !1;
    }
    return !0;
  }
};
f = _t([
  C(0, $),
  C(1, J),
  C(2, K),
  C(3, H),
  C(4, M)
], f);
function yt() {
  return Math.floor(Math.random() * 800) + 200;
}
const E = {
  id: "action-recorder.command.replay-local-records",
  type: m.COMMAND,
  handler: async (e) => {
    const r = await e.get(f).replayLocalJSON();
    return r && e.get($).show({
      type: x.Success,
      content: "Successfully replayed local records"
    }), r;
  }
}, L = {
  id: "action-recorder.command.replay-local-records-name",
  type: m.COMMAND,
  handler: async (e) => {
    const r = await e.get(f).replayLocalJSON(D.NAME);
    return r && e.get($).show({
      type: x.Success,
      content: "Successfully replayed local records"
    }), r;
  }
}, j = {
  id: "action-recorder.command.replay-local-records-active",
  type: m.COMMAND,
  handler: async (e) => {
    const r = await e.get(f).replayLocalJSON(D.ACTIVE);
    return r && e.get($).show({
      type: x.Success,
      content: "Successfully replayed local records"
    }), r;
  }
}, B = {
  id: "action-recorder.operation.open-panel",
  type: m.OPERATION,
  handler(e) {
    return e.get(d).togglePanel(!0), !0;
  }
}, te = {
  id: "action-recorder.operation.close-panel",
  type: m.OPERATION,
  handler(e) {
    return e.get(d).togglePanel(!1), !0;
  }
};
function Rt() {
  const e = b(d);
  return F(e.panelOpened$) ? /* @__PURE__ */ g(It, {}) : null;
}
function It() {
  var s;
  const e = b(M), t = b(d), r = F(t.recording$), n = F(t.recordedCommands$), o = (s = n == null ? void 0 : n.length) != null ? s : 0, i = y(() => {
    r || e.executeCommand(te.id);
  }, [e, r]), c = y((S) => {
    r || e.executeCommand(Q.id, { replaceId: S });
  }, [e, r]), a = y(() => {
    r && e.executeCommand(X.id);
  }, [e, r]), u = y(() => {
    r && e.executeCommand(ee.id);
  }, [e, r]), h = r ? o === 0 ? "Recording..." : `${o}: ${n[o - 1].id}` : "Start Recording";
  return /* @__PURE__ */ k(
    "div",
    {
      className: "univer-fixed univer-bottom-20 univer-left-1/2 univer-z-[1000] univer-flex univer-h-16 univer-w-[512px] -univer-translate-x-1/2 univer-items-center univer-rounded-lg univer-bg-white univer-px-5 univer-shadow-lg",
      children: [
        /* @__PURE__ */ g("div", { className: "univer-mr-2 univer-size-5 univer-shrink-0 univer-grow-0 univer-text-xl", children: /* @__PURE__ */ g(T, {}) }),
        /* @__PURE__ */ g("div", { className: "univer-flex-1 univer-text-sm", children: h }),
        /* @__PURE__ */ k("div", { className: "univer-flex univer-w-64 univer-shrink-0 univer-grow-0 univer-justify-between", children: [
          /* @__PURE__ */ g(
            N,
            {
              className: "univer-w-20",
              onClick: r ? u : i,
              children: r ? "Cancel" : "Close"
            }
          ),
          /* @__PURE__ */ g(
            N,
            {
              className: "univer-w-20",
              variant: "primary",
              onClick: r ? a : () => c(),
              children: r ? "Save" : "Start"
            }
          ),
          !r && /* @__PURE__ */ g(N, { variant: "primary", onClick: () => c(!0), children: "Start(N)" })
        ] })
      ]
    }
  );
}
const re = "RECORD_MENU_ITEM";
function Ot() {
  return {
    id: re,
    type: _.SUBITEMS,
    icon: "RecordIcon",
    tooltip: "action-recorder.menu.title"
  };
}
function wt(e) {
  const t = e.get(d);
  return {
    id: B.id,
    title: "action-recorder.menu.record",
    type: _.BUTTON,
    disabled$: t.panelOpened$
  };
}
function Mt() {
  return {
    id: E.id,
    title: "action-recorder.menu.replay-local",
    type: _.BUTTON
  };
}
function $t() {
  return {
    id: L.id,
    title: "action-recorder.menu.replay-local-name",
    type: _.BUTTON
  };
}
function xt() {
  return {
    id: j.id,
    title: "action-recorder.menu.replay-local-active",
    type: _.BUTTON
  };
}
const Nt = {
  [at.OTHERS]: {
    [re]: {
      order: 1,
      menuItemFactory: Ot,
      [B.id]: {
        order: 1,
        menuItemFactory: wt
      },
      [E.id]: {
        order: 2,
        menuItemFactory: Mt
      },
      [L.id]: {
        order: 3,
        menuItemFactory: $t
      },
      [j.id]: {
        order: 4,
        menuItemFactory: xt
      }
    }
  }
};
var Ut = Object.getOwnPropertyDescriptor, At = (e, t, r, n) => {
  for (var o = n > 1 ? void 0 : n ? Ut(t, r) : t, i = e.length - 1, c; i >= 0; i--)
    (c = e[i]) && (o = c(o) || o);
  return o;
}, p = (e, t) => (r, n) => t(r, n, e);
let w = class extends P {
  constructor(e, t, r, n, o, i) {
    super(), this._commandSrv = e, this._uiPartsSrv = t, this._menuManagerService = r, this._componentManager = n, this._actionRecorderService = o, this._injector = i, this._initCommands(), this._initUI(), this._initSheetsCommands(), this._initDocsCommands();
  }
  _initCommands() {
    [
      Q,
      ee,
      X,
      B,
      te,
      E,
      L,
      j
    ].forEach((e) => this._commandSrv.registerCommand(e));
  }
  _initUI() {
    this._uiPartsSrv.registerComponent(mt.GLOBAL, () => ut(Rt, this._injector)), this.disposeWithMe(
      this._componentManager.register("RecordIcon", T)
    ), this._menuManagerService.mergeMenu(Nt);
  }
  _initSheetsCommands() {
    [
      // InsertColCommand,
      // InsertRowCommand,
      // #region basic commands
      me,
      ue,
      he,
      ge,
      fe,
      pe,
      Se,
      ve,
      Ce,
      _e,
      ye,
      Re,
      Ie,
      Oe,
      we,
      Me,
      // ResetBackgroundColorCommand,
      // ResetTextColorCommand,
      // SetBackgroundColorCommand,
      // SetBoldCommand,
      // SetFontFamilyCommand,
      // SetFontSizeCommand,
      $e,
      xe,
      Ne,
      // SetItalicCommand,
      Ue,
      Ve,
      We,
      ze,
      He,
      Je,
      Ge,
      Ze,
      Ke,
      Ye,
      Ae,
      be,
      Fe,
      Pe,
      Te,
      // SetUnderlineCommand,
      De,
      qe,
      Qe,
      Xe,
      et,
      tt,
      rt,
      nt,
      ot,
      it,
      ct,
      Ee,
      Le,
      A,
      // #endregion
      // #region data validation command
      // #endregion
      // #region conditional formatting command
      // #endregion
      // #region filter command
      je,
      Be,
      ke
      // #endregion
    ].forEach((e) => this._actionRecorderService.registerRecordedCommand(e));
  }
  _initDocsCommands() {
  }
};
w = At([
  p(0, M),
  p(1, st),
  p(2, dt),
  p(3, O(lt)),
  p(4, O(d)),
  p(5, O(G))
], w);
const bt = "action-recorder.config", V = {};
var Ft = Object.getOwnPropertyDescriptor, Pt = (e, t, r, n) => {
  for (var o = n > 1 ? void 0 : n ? Ft(t, r) : t, i = e.length - 1, c; i >= 0; i--)
    (c = e[i]) && (o = c(o) || o);
  return o;
}, W = (e, t) => (r, n) => t(r, n, e), U;
let z = (U = class extends ae {
  constructor(e = V, t, r) {
    super(), this._config = e, this._injector = t, this._configService = r;
    const { menu: n, ...o } = se(
      {},
      V,
      this._config
    );
    n && this._configService.setConfig("menu", n, { merge: !0 }), this._configService.setConfig(bt, o);
  }
  onStarting() {
    (this._config.replayOnly ? [[f]] : [
      [d],
      [f],
      [w]
    ]).forEach((t) => this._injector.add(t));
  }
  onSteady() {
    this._config.replayOnly || this._injector.get(w);
  }
}, l(U, "pluginName", "UNIVER_ACTION_RECORDER_PLUGIN"), U);
z = Pt([
  W(1, O(G)),
  W(2, ce)
], z);
export {
  d as ActionRecorderService,
  f as ActionReplayService,
  z as UniverActionRecorderPlugin
};
