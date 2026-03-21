var V = Object.defineProperty;
var z = (t, e, i) => e in t ? V(t, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : t[e] = i;
var a = (t, e, i) => z(t, typeof e != "symbol" ? e + "" : e, i);
import { Disposable as $, CommandType as f, ICommandService as P, CustomRangeType as Y, IUniverInstanceService as k, IMentionIOService as q, generateRandomId as H, UniverInstanceType as W, Inject as m, Tools as J, Plugin as Q, merge as X, Injector as Z, IConfigService as ee } from "@univerjs/core";
import { deleteCustomRangeFactory as te, DocSelectionManagerService as N, replaceSelectionFactory as ne } from "@univerjs/docs";
import { IEditorService as ie, DocCanvasPopManagerService as oe, InsertCommand as re, MoveCursorOperation as se, DeleteLeftCommand as ce } from "@univerjs/docs-ui";
import { BehaviorSubject as b, filter as de } from "rxjs";
import { jsx as S, jsxs as w } from "react/jsx-runtime";
import { useDependency as h, useObservable as T, ComponentManager as ae } from "@univerjs/ui";
import { useRef as pe, useState as G, useMemo as ue, useEffect as ve } from "react";
import { clsx as R, borderClassName as le } from "@univerjs/design";
const me = "docs-mention-ui.config", j = {};
class M extends $ {
  constructor() {
    super();
    a(this, "_editing$", new b(void 0));
    a(this, "editing$", this._editing$.asObservable());
    this.disposeWithMe(() => {
      this._editing$.complete();
    });
  }
  get editing() {
    return this._editing$.value;
  }
  startEditing(i) {
    this._editing$.next(i);
  }
  endEditing() {
    this._editing$.next(void 0);
  }
}
const he = {
  type: f.OPERATION,
  id: "doc.operation.show-mention-info-popup",
  handler(t, e) {
    return !1;
  }
}, ge = {
  type: f.OPERATION,
  id: "doc.operation.close-mention-info-popup",
  handler(t) {
    return !1;
  }
}, F = {
  type: f.OPERATION,
  id: "doc.operation.show-mention-edit-popup",
  handler(t, e) {
    return e ? (t.get(M).startEditing({ unitId: e.unitId, index: e.startIndex }), !0) : !1;
  }
}, D = {
  type: f.OPERATION,
  id: "doc.operation.close-mention-edit-popup",
  handler(t) {
    return t.get(M).endEditing(), !0;
  }
}, B = {
  type: f.COMMAND,
  id: "docs.command.add-doc-mention",
  handler: async (t, e) => {
    if (!e)
      return !1;
    const { mention: i, unitId: n, startIndex: o } = e, r = t.get(P), p = t.get(N).getActiveTextRange();
    if (!p)
      return !1;
    const { metadata: _, ...I } = i, l = `@${i.label}`, u = {
      dataStream: l,
      customRanges: [{
        startIndex: 0,
        endIndex: l.length - 1,
        rangeId: i.id,
        rangeType: Y.MENTION,
        wholeEntity: !0,
        properties: {
          ...I,
          ..._
        }
      }]
    }, c = ne(
      t,
      {
        unitId: n,
        body: u,
        selection: {
          startOffset: o,
          endOffset: p.endOffset,
          collapsed: o === p.endOffset
        }
      }
    );
    return c ? r.syncExecuteCommand(c.id, c.params) : !1;
  }
}, fe = {
  type: f.COMMAND,
  id: "docs.command.delete-doc-mention",
  async handler(t, e) {
    if (!e)
      return !1;
    const { unitId: i, mentionId: n } = e, o = t.get(P), r = te(t, { unitId: i, rangeId: n });
    return r ? await o.syncExecuteCommand(r.id, r.params) : !1;
  }
}, _e = (t) => {
  var l, u;
  const { mentions: e, active: i, onSelect: n, onClick: o, editorId: r } = t, s = pe(null), [p, _] = G(i != null ? i : (u = (l = e[0]) == null ? void 0 : l.mentions[0]) == null ? void 0 : u.objectId), I = (c) => {
    n == null || n(c);
  };
  return /* @__PURE__ */ S(
    "div",
    {
      ref: s,
      "data-editorid": r,
      tabIndex: 0,
      className: R("univer-max-h-72 univer-w-72 univer-overflow-hidden univer-rounded-lg univer-bg-white univer-p-2 univer-shadow-md", le),
      onClick: o,
      children: e.map((c) => /* @__PURE__ */ w("div", { children: [
        /* @__PURE__ */ S("div", { className: "univer-mb-2 univer-font-medium", children: c.title }),
        c.mentions.map((d) => {
          var v;
          return /* @__PURE__ */ w(
            "div",
            {
              "data-editorid": r,
              className: R("univer-flex univer-cursor-pointer univer-items-center univer-rounded-md univer-p-2", {
                "univer-bg-gray-50": p === d.objectId
              }),
              onClick: () => I(d),
              onMouseEnter: () => _(d.objectId),
              children: [
                /* @__PURE__ */ S(
                  "img",
                  {
                    className: "univer-pointer-events-none univer-mr-1.5 univer-size-6 univer-flex-[0_0_auto] univer-rounded-md hover:univer-bg-gray-50",
                    src: (v = d.metadata) == null ? void 0 : v.icon
                  }
                ),
                /* @__PURE__ */ S("div", { className: "univer-pointer-events-none univer-flex-1 univer-truncate", children: d.label })
              ]
            },
            d.objectId
          );
        })
      ] }, c.type))
    }
  );
}, x = () => {
  var d;
  const t = h(g), e = h(P), i = h(k), n = T(t.editPopup$), o = h(q), r = h(ie), s = n ? i.getUnit(n.unitId) : null, p = h(N), [_, I] = G([]), l = ue(() => p.textSelection$.pipe(
    de((v) => v.unitId === (n == null ? void 0 : n.unitId))
  ), [p.textSelection$, n]), u = T(l), c = n ? (d = s == null ? void 0 : s.getBody()) == null ? void 0 : d.dataStream.slice(n.anchor, u == null ? void 0 : u.textRanges[0].startOffset) : "";
  return ve(() => {
    (async () => {
      if (n) {
        const v = await o.list({ unitId: n.unitId, search: c });
        I(v.list);
      }
    })();
  }, [o, n, c]), n ? /* @__PURE__ */ S(
    _e,
    {
      editorId: n.unitId,
      onClick: () => {
        t.closeEditPopup(), r.focus(n.unitId);
      },
      mentions: _,
      onSelect: async (v) => {
        await e.executeCommand(B.id, {
          unitId: i.getCurrentUnitOfType(W.UNIVER_DOC).getUnitId(),
          mention: {
            ...v,
            id: H()
          },
          startIndex: n.anchor
        }), r.focus(n.unitId);
      }
    }
  ) : null;
};
x.componentKey = "univer.popup.doc-mention-edit";
var Ie = Object.getOwnPropertyDescriptor, Se = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Ie(e, i) : e, r = t.length - 1, s; r >= 0; r--)
    (s = t[r]) && (o = s(o) || o);
  return o;
}, U = (t, e) => (i, n) => e(i, n, t);
let g = class extends $ {
  constructor(e, i) {
    super();
    a(this, "_infoPopup$", new b(void 0));
    a(this, "infoPopup$", this._infoPopup$.asObservable());
    a(this, "_editPopup$", new b(void 0));
    a(this, "editPopup$", this._editPopup$.asObservable());
    this._docCanvasPopupManagerService = e, this._docMentionService = i, this.disposeWithMe(this._docMentionService.editing$.subscribe((n) => {
      n != null ? this.showEditPopup(n.unitId, n.index) : this.closeEditPopup();
    }));
  }
  get infoPopup() {
    return this._infoPopup$.value;
  }
  get editPopup() {
    return this._editPopup$.value;
  }
  showInfoPopup() {
  }
  closeInfoPopup() {
  }
  showEditPopup(e, i) {
    this.closeEditPopup();
    const n = this._docCanvasPopupManagerService.attachPopupToRange(
      { startOffset: i, endOffset: i, collapsed: !0 },
      {
        componentKey: x.componentKey,
        onClickOutside: () => {
          this.closeEditPopup();
        },
        direction: "bottom"
      },
      e
    );
    this._editPopup$.next({ popup: n, anchor: i, unitId: e });
  }
  closeEditPopup() {
    this._docMentionService.editing != null && this._docMentionService.endEditing(), this.editPopup && (this.editPopup.popup.dispose(), this._editPopup$.next(null));
  }
};
g = Se([
  U(0, m(oe)),
  U(1, m(M))
], g);
var Pe = Object.getOwnPropertyDescriptor, Me = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Pe(e, i) : e, r = t.length - 1, s; r >= 0; r--)
    (s = t[r]) && (o = s(o) || o);
  return o;
}, O = (t, e) => (i, n) => e(i, n, t);
let E = class extends $ {
  constructor(t, e, i, n) {
    super(), this._commandService = t, this._docMentionService = e, this._textSelectionManagerService = i, this._docMentionPopupService = n, this._initTrigger();
  }
  _initTrigger() {
    this.disposeWithMe(
      this._commandService.onCommandExecuted((t) => {
        if (t.id === re.id) {
          const e = t.params, i = this._textSelectionManagerService.getActiveTextRange();
          e.body.dataStream === "@" && i && !J.isDefine(this._docMentionService.editing) && setTimeout(() => {
            this._commandService.executeCommand(F.id, {
              startIndex: i.startOffset - 1,
              unitId: e.unitId
            });
          }, 100);
        }
        if (t.id === se.id && this._commandService.executeCommand(D.id), t.id === ce.id) {
          if (this._docMentionPopupService.editPopup == null)
            return;
          const e = this._textSelectionManagerService.getActiveTextRange();
          e && e.endOffset <= this._docMentionPopupService.editPopup.anchor && this._commandService.executeCommand(D.id);
        }
      })
    );
  }
};
E = Me([
  O(0, P),
  O(1, m(M)),
  O(2, m(N)),
  O(3, m(g))
], E);
var Oe = Object.getOwnPropertyDescriptor, Ce = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Oe(e, i) : e, r = t.length - 1, s; r >= 0; r--)
    (s = t[r]) && (o = s(o) || o);
  return o;
}, A = (t, e) => (i, n) => e(i, n, t);
let y = class extends $ {
  constructor(t, e) {
    super(), this._commandService = t, this._componentManager = e, this._initCommands(), this._initComponents();
  }
  _initCommands() {
    [
      he,
      ge,
      F,
      D,
      B,
      fe
    ].forEach((t) => {
      this.disposeWithMe(this._commandService.registerCommand(t));
    });
  }
  _initComponents() {
    [[x.componentKey, x]].forEach(([e, i]) => {
      this.disposeWithMe(this._componentManager.register(e, i));
    });
  }
};
y = Ce([
  A(0, P),
  A(1, m(ae))
], y);
const xe = "DOC_MENTION_UI_PLUGIN";
var Ee = Object.getOwnPropertyDescriptor, ye = (t, e, i, n) => {
  for (var o = n > 1 ? void 0 : n ? Ee(e, i) : e, r = t.length - 1, s; r >= 0; r--)
    (s = t[r]) && (o = s(o) || o);
  return o;
}, K = (t, e) => (i, n) => e(i, n, t), C;
let L = (C = class extends Q {
  constructor(t = j, e, i) {
    super(), this._config = t, this._injector = e, this._configService = i;
    const { menu: n, ...o } = X(
      {},
      j,
      this._config
    );
    n && this._configService.setConfig("menu", n, { merge: !0 }), this._configService.setConfig(me, o);
  }
  onStarting() {
    [
      [M],
      [g],
      [y],
      [E]
    ].forEach((t) => {
      this._injector.add(t);
    }), this._injector.get(y);
  }
  onRendered() {
    this._injector.get(E), this._injector.get(g);
  }
}, a(C, "pluginName", xe), a(C, "type", W.UNIVER_DOC), C);
L = ye([
  K(1, m(Z)),
  K(2, ee)
], L);
export {
  g as DocMentionPopupService,
  L as UniverDocsMentionUIPlugin
};
