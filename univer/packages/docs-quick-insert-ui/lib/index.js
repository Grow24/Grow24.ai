var Le = Object.defineProperty;
var Ae = (t, e, n) => e in t ? Le(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var C = (t, e, n) => Ae(t, typeof e != "symbol" ? e + "" : e, n);
import { CommandType as k, ICommandService as Q, RANGE_DIRECTION as je, LocaleService as ue, generateRandomId as Be, DisposableCollection as We, toDisposable as qe, Direction as B, Inject as f, IUniverInstanceService as pe, Disposable as Y, UniverInstanceType as H, DeleteDirection as Ze, DependentOn as Ve, Injector as Fe, IConfigService as Ge, Plugin as ze, merge as Ye } from "@univerjs/core";
import { DocSelectionManagerService as le, DocSkeletonManagerService as Je, RichTextEditingMutation as Xe } from "@univerjs/docs";
import { CutContentCommand as et, DocCanvasPopManagerService as Se, DocEventManagerService as Pe, OrderListCommand as tt, BulletListCommand as nt, HorizontalLineCommand as it, DocCreateTableOperation as rt, InsertCommand as st, IMEInputCommand as ot, DeleteCommand as ct, MoveCursorOperation as at, DeleteLeftCommand as dt } from "@univerjs/docs-ui";
import { useDependency as _, KeyCode as O, ComponentManager as ye, IShortcutService as xe, useObservable as T, ILayoutService as ut, useEvent as pt, UniverUIPlugin as lt } from "@univerjs/ui";
import { IRenderManagerService as he } from "@univerjs/engine-render";
import { map as Me, distinctUntilChanged as ht, tap as K, combineLatest as fe, BehaviorSubject as A, of as ft } from "rxjs";
import { jsx as h, jsxs as ve } from "react/jsx-runtime";
import { Menu as gt, clsx as re, scrollbarClassName as mt, MenuItemGroup as vt, MenuItem as Ct, Tooltip as _t, borderClassName as It } from "@univerjs/design";
import { useMemo as se, useState as Ce, useRef as j, useEffect as L, createElement as J, forwardRef as ge } from "react";
import { InsertDocImageCommand as St, UniverDocsDrawingUIPlugin as Pt } from "@univerjs/docs-drawing-ui";
import { UniverDocsDrawingPlugin as yt } from "@univerjs/docs-drawing";
import { UniverDrawingPlugin as xt } from "@univerjs/drawing";
import { UniverDrawingUIPlugin as Mt } from "@univerjs/drawing-ui";
const Oe = {
  id: "doc.command.delete-search-key",
  type: k.COMMAND,
  handler: (t, e) => {
    const n = t.get(Q), { start: i, end: r } = e;
    return n.syncExecuteCommand(et.id, {
      segmentId: "",
      textRanges: [{
        startOffset: i,
        endOffset: i,
        collapsed: !0
      }],
      selections: [{
        startOffset: i,
        endOffset: r,
        collapsed: !1,
        direction: je.FORWARD
      }]
    });
  }
}, Ot = "docs.quick.insert.keyword-input-placeholder", W = () => {
  const t = _(ue);
  return /* @__PURE__ */ h("div", { className: "univer-translate-y-1.5 univer-text-sm univer-text-gray-500", children: t.t("docQuickInsert.keywordInputPlaceholder") });
};
W.componentKey = Ot;
const bt = "docs.quick.insert.placeholder", q = () => {
  const t = _(ue);
  return /* @__PURE__ */ h(
    "div",
    {
      className: "univer-flex univer-h-full univer-items-center univer-justify-center univer-rounded-lg univer-bg-white univer-px-12 univer-py-6 univer-text-gray-400 univer-shadow-lg",
      children: /* @__PURE__ */ h("span", { children: t.t("docQuickInsert.placeholder") })
    }
  );
};
q.componentKey = bt;
function oe(t, e) {
  return t.map((n) => ({ ...n })).filter((n) => {
    if ("children" in n)
      return n.children = oe(n.children, e), n.children.length > 0;
    const i = n.keywords;
    return i ? i.some((r) => r.includes(e)) : n.title.toLowerCase().includes(e);
  });
}
function be(t, e) {
  return t.map((n) => {
    const i = { ...n };
    return "children" in i && (i.children = be(i.children, e)), i.title = e.t(i.title), "keywords" in i && (i.keywords = i.keywords.concat(i.title).map((r) => r.toLowerCase())), i;
  });
}
const wt = [O.ARROW_UP, O.ARROW_DOWN, O.ENTER], Z = () => {
  const t = _(ue), e = _(I), n = _(ye), i = _(xe), r = _(Q), s = se(() => Be(), []), [c, l] = Ce(0), o = j(null), a = j(0);
  a.current = 0;
  const d = T(e.filterKeyword$, ""), u = T(e.editPopup$), g = T(u == null ? void 0 : u.popup.menus$, []), S = se(() => be(g, t), [g]), [b, P] = Ce(() => oe(S, d.toLowerCase()));
  L(() => {
    const m = requestIdleCallback(() => {
      P(oe(S, d.toLowerCase()));
    });
    return () => {
      cancelIdleCallback(m);
    };
  }, [S, d]);
  const y = (m) => {
    e.emitMenuSelected(m), r.executeCommand(U.id);
  };
  L(() => {
    const m = new We();
    i.getAllShortcuts().filter((p) => p.binding && wt.includes(p.binding)).forEach((p) => {
      const M = p.preconditions;
      p.preconditions = () => !1, m.add(qe(() => {
        p.preconditions = M;
      }));
    });
    const x = {
      id: `quick.insert.popup.enter.${s}`,
      type: k.OPERATION,
      handler: () => {
        const p = o.current;
        p && y(p);
      }
    }, D = {
      id: `quick.insert.popup.move.cursor.up.${s}`,
      type: k.OPERATION,
      handler: () => {
        l((p) => {
          const M = p - 1;
          return M >= 0 ? M : a.current - 1;
        });
      }
    }, R = {
      id: `quick.insert.popup.move.cursor.down.${s}`,
      type: k.OPERATION,
      handler: () => {
        l((p) => {
          const M = p + 1;
          return M <= a.current - 1 ? M : 0;
        });
      }
    };
    return m.add(r.registerCommand(D)), m.add(r.registerCommand(R)), m.add(r.registerCommand(x)), m.add(i.registerShortcut({
      priority: 1e3,
      id: D.id,
      binding: O.ARROW_UP,
      preconditions: () => !0,
      staticParameters: {
        direction: B.UP
      }
    })), m.add(i.registerShortcut({
      priority: 1e3,
      id: R.id,
      binding: O.ARROW_DOWN,
      preconditions: () => !0,
      staticParameters: {
        direction: B.DOWN
      }
    })), m.add(i.registerShortcut({
      priority: 1e3,
      id: x.id,
      binding: O.ENTER,
      preconditions: () => !0
    })), () => {
      m.dispose();
    };
  }, []), L(() => {
    l(0);
  }, [b]);
  const w = j(/* @__PURE__ */ new Map());
  L(() => () => {
    w.current.clear();
  }, []);
  function $(m) {
    return m.map((v) => {
      const ee = v.icon, x = ee ? n.get(ee) : null;
      if ("children" in v)
        return /* @__PURE__ */ h(
          vt,
          {
            title: /* @__PURE__ */ ve(
              "div",
              {
                className: "univer-mb-2 univer-flex univer-items-center univer-text-xs univer-text-gray-400",
                children: [
                  x && /* @__PURE__ */ h("span", { className: "univer-mr-2 univer-inline-flex univer-text-base", children: /* @__PURE__ */ h(x, {}) }),
                  /* @__PURE__ */ h("span", { children: v.title })
                ]
              }
            ),
            children: $(v.children)
          },
          v.id
        );
      const D = a.current, R = c === D;
      if (R) {
        o.current = v;
        const p = w.current.get(v.id);
        p == null || p.scrollIntoView({
          block: "nearest"
        });
      }
      return a.current++, /* @__PURE__ */ h(
        Ct,
        {
          ref: (p) => {
            p && w.current.set(v.id, p);
          },
          onMouseEnter: () => l(D),
          onMouseLeave: () => l(Number.NaN),
          className: re("univer-w-[calc(220px-var(--padding-base)*2)] univer-text-sm", {
            "hover:univer-bg-transparent": !R,
            "univer-bg-gray-100 dark:!univer-bg-gray-500": R
          }),
          onClick: () => {
            y(v);
          },
          children: /* @__PURE__ */ ve(
            "div",
            {
              className: "univer-flex univer-w-full univer-items-center univer-px-1",
              children: [
                x && /* @__PURE__ */ h("span", { className: "univer-mr-2 univer-inline-flex univer-text-base", children: /* @__PURE__ */ h(x, {}) }),
                /* @__PURE__ */ h(_t, { showIfEllipsis: !0, title: v.title, placement: "right", children: /* @__PURE__ */ h("span", { className: "univer-truncate", children: v.title }) })
              ]
            }
          )
        },
        v.id
      );
    });
  }
  const Ke = b.length > 0, me = (u == null ? void 0 : u.popup.Placeholder) || n.get(q.componentKey);
  return /* @__PURE__ */ h("div", { className: "univer-mt-2", children: Ke ? /* @__PURE__ */ h(
    gt,
    {
      wrapperClass: re("univer-max-h-[360px] univer-w-[220px] univer-overflow-y-auto univer-overflow-x-hidden", mt),
      children: $(b)
    }
  ) : me && /* @__PURE__ */ h(me, {}) });
};
Z.componentKey = "docs.quick.insert.popup";
var Rt = Object.getOwnPropertyDescriptor, kt = (t, e, n, i) => {
  for (var r = i > 1 ? void 0 : i ? Rt(e, n) : e, s = t.length - 1, c; s >= 0; s--)
    (c = t[s]) && (r = c(r) || r);
  return r;
}, N = (t, e) => (n, i) => e(n, i, t);
const _e = {
  dispose: () => {
  }
};
let I = class extends Y {
  constructor(e, n, i, r, s) {
    super();
    C(this, "_popups", /* @__PURE__ */ new Set());
    C(this, "_editPopup$", new A(void 0));
    C(this, "editPopup$", this._editPopup$.asObservable());
    C(this, "_isComposing$", new A(!1));
    C(this, "isComposing$", this._isComposing$.asObservable());
    C(this, "_inputOffset$", new A({ start: 0, end: 0 }));
    C(this, "inputOffset$", this._inputOffset$.asObservable());
    C(this, "filterKeyword$");
    C(this, "_menuSelectedCallbacks", /* @__PURE__ */ new Set());
    C(this, "_inputPlaceholderRenderRoot", null);
    this._docCanvasPopupManagerService = e, this._univerInstanceService = n, this._commandService = i, this._renderManagerService = r, this._docSelectionManagerService = s, this.disposeWithMe(this._editPopup$);
    const c = (o, a) => {
      var d, u;
      return (u = (d = this._univerInstanceService.getCurrentUnitOfType(H.UNIVER_DOC)) == null ? void 0 : d.getBody()) == null ? void 0 : u.dataStream.slice(o, a);
    };
    let l = "";
    this.filterKeyword$ = this._inputOffset$.pipe(
      Me((o) => {
        var d;
        const a = c(o.start, o.end);
        return (d = a == null ? void 0 : a.slice(1)) != null ? d : "";
      }),
      ht(),
      K((o) => {
        l = o;
      })
    ), this.disposeWithMe(fe([
      this.filterKeyword$.pipe(K((o) => {
        var a, d, u;
        o.length > 0 ? (d = (a = this._inputPlaceholderRenderRoot) == null ? void 0 : a.unmount) == null || d.dispose() : (u = this._inputPlaceholderRenderRoot) == null || u.mount();
      })),
      this.isComposing$.pipe(K((o) => {
        var a, d, u;
        o ? (d = (a = this._inputPlaceholderRenderRoot) == null ? void 0 : a.unmount) == null || d.dispose() : l.length <= 0 && ((u = this._inputPlaceholderRenderRoot) == null || u.mount());
      })),
      this.editPopup$.pipe(K((o) => {
        var a, d;
        o || ((d = (a = this._inputPlaceholderRenderRoot) == null ? void 0 : a.unmount) == null || d.dispose(), this._inputPlaceholderRenderRoot = null);
      }))
    ]).subscribe());
  }
  get popups() {
    return Array.from(this._popups);
  }
  get editPopup() {
    return this._editPopup$.value;
  }
  get isComposing() {
    return this._isComposing$.value;
  }
  setIsComposing(e) {
    this._isComposing$.next(e);
  }
  get inputOffset() {
    return this._inputOffset$.value;
  }
  setInputOffset(e) {
    this._inputOffset$.next(e);
  }
  getDocEventManagerService(e) {
    var n;
    return (n = this._renderManagerService.getRenderById(e)) == null ? void 0 : n.with(Pe);
  }
  resolvePopup(e) {
    return Array.from(this._popups).find((n) => n.keyword === e);
  }
  registerPopup(e) {
    return this._popups.add(e), () => {
      this._popups.delete(e);
    };
  }
  _createInputPlaceholderRenderRoot(e) {
    return {
      isMounted: !1,
      mount() {
        if (this.isMounted)
          return;
        this.isMounted = !0;
        const i = e();
        this.unmount = {
          dispose: () => {
            i.dispose(), this.isMounted = !1;
          }
        };
      }
    };
  }
  showPopup(e) {
    var d, u;
    const { popup: n, index: i, unitId: r } = e;
    this.closePopup();
    const s = this._univerInstanceService.getUnit(r), c = (u = (d = s == null ? void 0 : s.getBody()) == null ? void 0 : d.paragraphs) == null ? void 0 : u.find((g) => g.startIndex > i);
    if (!c)
      return;
    const l = this.getDocEventManagerService(r), o = l == null ? void 0 : l.findParagraphBoundByIndex(c.startIndex);
    if (!o)
      return;
    this._inputPlaceholderRenderRoot = this._createInputPlaceholderRenderRoot(() => {
      var $;
      const g = ($ = this._renderManagerService.getRenderById(r)) == null ? void 0 : $.with(Je), S = this._docSelectionManagerService.getActiveTextRange();
      if (!g || !S)
        return _e;
      const P = g.getSkeleton().findNodeByCharIndex(S.startOffset, S.segmentId, S.segmentPage);
      if (!((P == null ? void 0 : P.content) === "\r"))
        return _e;
      const w = this._docCanvasPopupManagerService.attachPopupToRange(
        { startOffset: i + 1, endOffset: i + 1, collapsed: !1 },
        {
          componentKey: W.componentKey,
          onClickOutside: () => {
            w.dispose();
          },
          direction: "horizontal"
        },
        r
      );
      return w;
    }), this._inputPlaceholderRenderRoot.mount();
    const a = this._docCanvasPopupManagerService.attachPopupToRect(
      o.firstLine,
      {
        componentKey: Z.componentKey,
        onClickOutside: () => {
          this.closePopup();
        },
        direction: "bottom"
      },
      r
    );
    this._editPopup$.next({ disposable: a, popup: n, anchor: i, unitId: r });
  }
  closePopup() {
    this.editPopup && (this.editPopup.disposable.dispose(), this._editPopup$.next(null));
  }
  onMenuSelected(e) {
    return this._menuSelectedCallbacks.add(e), () => {
      this._menuSelectedCallbacks.delete(e);
    };
  }
  emitMenuSelected(e) {
    const { start: n, end: i } = this.inputOffset;
    this._commandService.syncExecuteCommand(Oe.id, {
      start: n,
      end: i
    }), setTimeout(() => {
      this._menuSelectedCallbacks.forEach((r) => r(e));
    }, 0);
  }
};
I = kt([
  N(0, f(Se)),
  N(1, f(pe)),
  N(2, f(Q)),
  N(3, f(he)),
  N(4, f(le))
], I);
const we = {
  type: k.OPERATION,
  id: "doc.operation.show-quick-insert-popup",
  handler(t, e) {
    const n = t.get(I);
    return e ? (n.showPopup(e), !0) : !1;
  }
}, U = {
  type: k.OPERATION,
  id: "doc.operation.close-quick-insert-popup",
  handler(t) {
    return t.get(I).closePopup(), !0;
  }
}, Re = {
  id: "quick-insert.text.menu",
  title: "docQuickInsert.menu.text",
  icon: "TextIcon",
  keywords: ["text"]
}, ke = {
  id: tt.id,
  title: "docQuickInsert.menu.numberedList",
  icon: "OrderIcon",
  keywords: ["numbered", "list", "ordered"]
}, $e = {
  id: nt.id,
  title: "docQuickInsert.menu.bulletedList",
  icon: "UnorderIcon",
  keywords: ["bulleted", "list", "unordered"]
}, De = {
  id: it.id,
  title: "docQuickInsert.menu.divider",
  icon: "DividerIcon",
  keywords: ["divider", "line", "separate"]
}, Ne = {
  id: rt.id,
  title: "docQuickInsert.menu.table",
  icon: "GridIcon",
  keywords: ["table", "grid", "spreadsheet"]
}, Ee = {
  id: St.id,
  title: "docQuickInsert.menu.image",
  icon: "AdditionAndSubtractionIcon",
  keywords: ["image", "picture", "photo"]
}, $t = [
  {
    title: "docQuickInsert.group.basics",
    id: "quick.insert.group.basic",
    children: [
      Re,
      ke,
      $e,
      De,
      Ne,
      Ee
    ]
  }
], Dt = /* @__PURE__ */ new Set([
  ke.id,
  $e.id,
  De.id,
  Ne.id,
  Ee.id
]);
var Nt = Object.getOwnPropertyDescriptor, Et = (t, e, n, i) => {
  for (var r = i > 1 ? void 0 : i ? Nt(e, n) : e, s = t.length - 1, c; s >= 0; s--)
    (c = t[s]) && (r = c(r) || r);
  return r;
}, E = (t, e) => (n, i) => e(n, i, t);
let V = class extends Y {
  constructor(t, e, n, i, r) {
    super(), this._commandService = t, this._textSelectionManagerService = e, this._docQuickInsertPopupService = n, this._shortcutService = i, this._univerInstanceService = r, this.disposeWithMe(this._shortcutService.registerShortcut({
      id: U.id,
      binding: O.ESC,
      preconditions: () => !!this._docQuickInsertPopupService.editPopup,
      priority: 1e3
    })), this._initTrigger(), this._initMenuHandler();
  }
  // eslint-disable-next-line max-lines-per-function
  _initTrigger() {
    this.disposeWithMe(
      // eslint-disable-next-line complexity, max-lines-per-function
      this._commandService.onCommandExecuted((t) => {
        var s, c, l;
        const { _docQuickInsertPopupService: e, _textSelectionManagerService: n, _commandService: i } = this, r = this._univerInstanceService.getCurrentUnitOfType(H.UNIVER_DOC);
        if (!(r != null && r.getDisabled())) {
          if (t.id === st.id) {
            const o = t.params;
            if (e.editPopup) {
              e.setInputOffset({
                start: e.inputOffset.start,
                end: o.range.endOffset + 1
              });
              return;
            }
            const a = n.getActiveTextRange();
            if (!a)
              return;
            const d = e.resolvePopup(o.body.dataStream);
            if (!d || !(d.preconditions ? d.preconditions(o) : !0))
              return;
            e.setInputOffset({ start: a.startOffset - 1, end: a.startOffset }), setTimeout(() => {
              i.executeCommand(we.id, {
                index: a.startOffset - 1,
                unitId: o.unitId,
                popup: d
              });
            }, 100);
          }
          if (t.id === ot.id) {
            const o = t.params;
            !e.isComposing && o.isCompositionStart && e.setIsComposing(!0), e.isComposing && o.isCompositionEnd && e.setIsComposing(!1);
          }
          if (t.id === Xe.id) {
            const o = t.params;
            if (o.isCompositionEnd) {
              const a = (c = (s = o.textRanges) == null ? void 0 : s[0]) == null ? void 0 : c.endOffset;
              a && e.setInputOffset({ start: e.inputOffset.start, end: a });
            }
          }
          if (t.id === ct.id) {
            const o = t.params;
            if (e.editPopup && o.direction === Ze.LEFT) {
              const a = (l = o.len) != null ? l : 0;
              e.setInputOffset({ start: e.inputOffset.start, end: o.range.endOffset - a });
            }
          }
          if (t.id === at.id) {
            const o = t.params;
            (o.direction === B.LEFT || o.direction === B.RIGHT) && e.editPopup && i.executeCommand(U.id);
          }
          if (t.id === dt.id) {
            const o = n.getActiveTextRange();
            if (!e.editPopup || !o)
              return;
            o.endOffset <= e.editPopup.anchor && i.executeCommand(U.id);
          }
        }
      })
    );
  }
  _initMenuHandler() {
    this.disposeWithMe(this._docQuickInsertPopupService.onMenuSelected((t) => {
      t.id !== Re.id && Dt.has(t.id) && this._commandService.executeCommand(t.id);
    }));
  }
};
V = Et([
  E(0, Q),
  E(1, f(le)),
  E(2, f(I)),
  E(3, f(xe)),
  E(4, f(pe))
], V);
function X({ ref: t, ...e }) {
  const { icon: n, id: i, className: r, extend: s, ...c } = e, l = `univerjs-icon univerjs-icon-${i} ${r || ""}`.trim(), o = j(`_${Qt()}`);
  return Te(n, `${i}`, {
    defIds: n.defIds,
    idSuffix: o.current
  }, {
    ref: t,
    className: l,
    ...c
  }, s);
}
function Te(t, e, n, i, r) {
  return J(t.tag, {
    key: e,
    ...Tt(t, n, r),
    ...i
  }, (Ut(t, n).children || []).map((s, c) => Te(s, `${e}-${t.tag}-${c}`, n, void 0, r)));
}
function Tt(t, e, n) {
  const i = { ...t.attrs };
  n != null && n.colorChannel1 && i.fill === "colorChannel1" && (i.fill = n.colorChannel1), t.tag === "mask" && i.id && (i.id = i.id + e.idSuffix), Object.entries(i).forEach(([s, c]) => {
    s === "mask" && typeof c == "string" && (i[s] = c.replace(/url\(#(.*)\)/, `url(#$1${e.idSuffix})`));
  });
  const { defIds: r } = e;
  return !r || r.length === 0 || (t.tag === "use" && i["xlink:href"] && (i["xlink:href"] = i["xlink:href"] + e.idSuffix), Object.entries(i).forEach(([s, c]) => {
    typeof c == "string" && (i[s] = c.replace(/url\(#(.*)\)/, `url(#$1${e.idSuffix})`));
  })), i;
}
function Ut(t, e) {
  var i;
  const { defIds: n } = e;
  return !n || n.length === 0 ? t : t.tag === "defs" && ((i = t.children) != null && i.length) ? {
    ...t,
    children: t.children.map((r) => typeof r.attrs.id == "string" && n && n.includes(r.attrs.id) ? {
      ...r,
      attrs: {
        ...r.attrs,
        id: r.attrs.id + e.idSuffix
      }
    } : r)
  } : t;
}
function Qt() {
  return Math.random().toString(36).substring(2, 8);
}
X.displayName = "UniverIcon";
const Ht = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M1.01953 3.13985C1.01953 2.77258 1.31726 2.47485 1.68453 2.47485H2.73713C3.1044 2.47485 3.40213 2.77258 3.40213 3.13985C3.40213 3.50712 3.1044 3.80485 2.73713 3.80485H1.68453C1.31726 3.80485 1.01953 3.50712 1.01953 3.13985Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M4.17734 3.13985C4.17734 2.77258 4.47507 2.47485 4.84234 2.47485H6.94754C7.31481 2.47485 7.61254 2.77258 7.61254 3.13985C7.61254 3.50712 7.31481 3.80485 6.94754 3.80485H4.84234C4.47507 3.80485 4.17734 3.50712 4.17734 3.13985Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M8.38775 3.13985C8.38775 2.77258 8.68548 2.47485 9.05275 2.47485H11.158C11.5252 2.47485 11.823 2.77258 11.823 3.13985C11.823 3.50712 11.5252 3.80485 11.158 3.80485H9.05275C8.68548 3.80485 8.38775 3.50712 8.38775 3.13985Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M12.5982 3.13985C12.5982 2.77258 12.8959 2.47485 13.2632 2.47485H14.3158C14.683 2.47485 14.9808 2.77258 14.9808 3.13985C14.9808 3.50712 14.683 3.80485 14.3158 3.80485H13.2632C12.8959 3.80485 12.5982 3.50712 12.5982 3.13985Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M1.01953 7.99972C1.01953 7.63245 1.31726 7.33472 1.68453 7.33472H14.3158C14.683 7.33472 14.9808 7.63245 14.9808 7.99972C14.9808 8.36699 14.683 8.66472 14.3158 8.66472H1.68453C1.31726 8.66472 1.01953 8.36699 1.01953 7.99972Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M1.68453 12.1951C1.31726 12.1951 1.01953 12.4928 1.01953 12.8601C1.01953 13.2273 1.31726 13.5251 1.68453 13.5251H2.73713C3.1044 13.5251 3.40213 13.2273 3.40213 12.8601C3.40213 12.4928 3.1044 12.1951 2.73713 12.1951H1.68453Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M4.84234 12.1951C4.47507 12.1951 4.17734 12.4928 4.17734 12.8601C4.17734 13.2273 4.47507 13.5251 4.84234 13.5251H6.94754C7.31481 13.5251 7.61254 13.2273 7.61254 12.8601C7.61254 12.4928 7.31481 12.1951 6.94754 12.1951H4.84234Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M9.05275 12.1951C8.68548 12.1951 8.38775 12.4928 8.38775 12.8601C8.38775 13.2273 8.68548 13.5251 9.05275 13.5251H11.158C11.5252 13.5251 11.823 13.2273 11.823 12.8601C11.823 12.4928 11.5252 12.1951 11.158 12.1951H9.05275Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M13.2632 12.1951C12.8959 12.1951 12.5982 12.4928 12.5982 12.8601C12.5982 13.2273 12.8959 13.5251 13.2632 13.5251H14.3158C14.683 13.5251 14.9808 13.2273 14.9808 12.8601C14.9808 12.4928 14.683 12.1951 14.3158 12.1951H13.2632Z"
      }
    }
  ]
}, ce = ge(function(e, n) {
  return J(X, Object.assign({}, e, {
    id: "divider-icon",
    ref: n,
    icon: Ht
  }));
});
ce.displayName = "DividerIcon";
const Kt = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 16 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M8.6 1.99991C8.60001 1.66854 8.33138 1.39991 8.00001 1.3999C7.66864 1.3999 7.40001 1.66853 7.4 1.9999L7.39996 7.3999H1.9999C1.66853 7.3999 1.3999 7.66853 1.3999 7.9999C1.3999 8.33127 1.66853 8.5999 1.9999 8.5999H7.39995L7.3999 13.9999C7.3999 14.3313 7.66853 14.5999 7.9999 14.5999C8.33127 14.5999 8.5999 14.3313 8.5999 13.9999L8.59995 8.5999H13.9999C14.3313 8.5999 14.5999 8.33127 14.5999 7.9999C14.5999 7.66853 14.3313 7.3999 13.9999 7.3999H8.59996L8.6 1.99991Z"
    }
  }]
}, Ue = ge(function(e, n) {
  return J(X, Object.assign({}, e, {
    id: "increase-icon",
    ref: n,
    icon: Kt
  }));
});
Ue.displayName = "IncreaseIcon";
const Lt = {
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
      clipPath: "url(#text-icon_clip0_1293_26)"
    },
    children: [{
      tag: "path",
      attrs: { d: "M2.22891 2.07227C1.89754 2.07227 1.62891 2.34089 1.62891 2.67227C1.62891 3.00364 1.89754 3.27227 2.22891 3.27227H6.29541V14.0056C6.29541 14.337 6.56404 14.6056 6.89541 14.6056C7.22678 14.6056 7.49541 14.337 7.49541 14.0056V3.27227H11.5622C11.8936 3.27227 12.1622 3.00364 12.1622 2.67227C12.1622 2.34089 11.8936 2.07227 11.5622 2.07227H2.22891Z" }
    }, {
      tag: "path",
      attrs: { d: "M10.2289 6.40552C9.89754 6.40552 9.62891 6.67415 9.62891 7.00552C9.62891 7.33689 9.89754 7.60552 10.2289 7.60552H12.2954V14.0055C12.2954 14.3369 12.564 14.6055 12.8954 14.6055C13.2268 14.6055 13.4954 14.3369 13.4954 14.0055V7.60552H15.5622C15.8936 7.60552 16.1622 7.33689 16.1622 7.00552C16.1622 6.67415 15.8936 6.40552 15.5622 6.40552H10.2289Z" }
    }]
  }, {
    tag: "defs",
    attrs: {},
    children: [{
      tag: "clipPath",
      attrs: { id: "text-icon_clip0_1293_26" },
      children: [{
        tag: "path",
        attrs: {
          fill: "white",
          d: "M0 0H16V16H0z",
          transform: "translate(.9)"
        }
      }]
    }]
  }],
  defIds: ["text-icon_clip0_1293_26"]
}, ae = ge(function(e, n) {
  return J(X, Object.assign({}, e, {
    id: "text-icon",
    ref: n,
    icon: Lt
  }));
});
ae.displayName = "TextIcon";
const Qe = "doc.quick-insert.button";
var At = Object.getOwnPropertyDescriptor, jt = (t, e, n, i) => {
  for (var r = i > 1 ? void 0 : i ? At(e, n) : e, s = t.length - 1, c; s >= 0; s--)
    (c = t[s]) && (r = c(r) || r);
  return r;
}, te = (t, e) => (n, i) => e(n, i, t);
let F = class extends Y {
  constructor(e, n, i, r) {
    super();
    C(this, "_popup$", new A(null));
    C(this, "popup$", this._popup$.asObservable());
    this._context = e, this._docEventManagerService = n, this._docQuickInsertPopupService = i, this._docCanvasPopManagerService = r, this._init();
  }
  get popup() {
    return this._popup$.value;
  }
  _init() {
    this.disposeWithMe(fe([this._docEventManagerService.hoverParagraphLeftRealTime$, this._docEventManagerService.hoverParagraphRealTime$]).subscribe(([e, n]) => {
      var s;
      const i = e != null ? e : n, r = this._context.unit.getDisabled();
      if (!i || r) {
        this._hideMenu(!0);
        return;
      }
      if (i.paragraphStart === i.paragraphEnd) {
        if (this._docQuickInsertPopupService.editPopup || i.startIndex === ((s = this.popup) == null ? void 0 : s.startIndex)) return;
        this._hideMenu(!0);
        const c = this._docCanvasPopManagerService.attachPopupToRect(i.firstLine, {
          componentKey: Qe,
          direction: "left-center"
        }, this._context.unit.getUnitId());
        this._popup$.next({
          startIndex: i.startIndex,
          disposable: c
        });
      } else
        this._hideMenu(!0);
    }));
  }
  _hideMenu(e) {
    this._docQuickInsertPopupService.editPopup || this.popup && (e || this.popup.disposable.canDispose()) && (this.popup.disposable.dispose(), this._popup$.next(null));
  }
};
F = jt([
  te(1, f(Pe)),
  te(2, f(I)),
  te(3, f(Se))
], F);
const de = ({ className: t = "" }) => {
  const e = _(I), n = _(pe), i = _(he), r = T(se(() => n.getCurrentTypeOfUnit$(H.UNIVER_DOC), [n])), s = r && i.getRenderById(r.getUnitId()), c = s == null ? void 0 : s.with(F), l = _(ut), o = _(le), a = T(e.editPopup$), d = pt((u) => {
    var P;
    const g = c == null ? void 0 : c.popup;
    if (!g)
      return;
    const S = e.popups, b = {
      keyword: "",
      menus$: fe(S.map((y) => y.menus$)).pipe(
        Me((y) => y.flat())
      )
    };
    o.replaceDocRanges([{
      startOffset: g.startIndex,
      endOffset: g.startIndex
    }]), e.setInputOffset({ start: g.startIndex - 1, end: g.startIndex - 1 }), e.showPopup({
      popup: b,
      index: g.startIndex - 1,
      unitId: (P = r == null ? void 0 : r.getUnitId()) != null ? P : ""
    }), setTimeout(() => {
      l.focus();
    });
  });
  return /* @__PURE__ */ h(
    "div",
    {
      className: re("univer-mr-1 univer-flex univer-cursor-pointer univer-items-center univer-gap-2.5 univer-rounded-full univer-p-1.5 univer-shadow-sm hover:univer-bg-gray-100 dark:!univer-text-gray-200 dark:hover:!univer-bg-gray-700", It, {
        "univer-bg-gray-100 dark:!univer-bg-gray-700": a,
        "univer-bg-white dark:!univer-bg-gray-900": !a
      }, t),
      role: "button",
      tabIndex: 0,
      onClick: d,
      children: /* @__PURE__ */ h(
        Ue,
        {
          className: "univer-text-gray-800 dark:!univer-text-gray-200"
        }
      )
    }
  );
};
de.componentKey = Qe;
var Bt = Object.getOwnPropertyDescriptor, Wt = (t, e, n, i) => {
  for (var r = i > 1 ? void 0 : i ? Bt(e, n) : e, s = t.length - 1, c; s >= 0; s--)
    (c = t[s]) && (r = c(r) || r);
  return r;
}, ne = (t, e) => (n, i) => e(n, i, t);
let G = class extends Y {
  constructor(t, e, n) {
    super(), this._commandService = t, this._docQuickInsertPopupService = e, this._componentManager = n, this._initCommands(), this._initComponents(), this._initMenus();
  }
  _initCommands() {
    [
      Oe,
      we,
      U
    ].forEach((t) => {
      this.disposeWithMe(this._commandService.registerCommand(t));
    });
  }
  _initComponents() {
    [
      [Z.componentKey, Z],
      [W.componentKey, W],
      [q.componentKey, q],
      [ce.displayName, ce],
      [ae.displayName, ae],
      [de.componentKey, de]
    ].forEach(([e, n]) => {
      e && this.disposeWithMe(this._componentManager.register(e, n));
    }), [
      {
        keyword: "/",
        menus$: ft($t),
        // only show when the cursor is at the beginning of a line
        preconditions: (e) => {
          var n;
          return ((n = e.range.startNodePosition) == null ? void 0 : n.glyph) === 0;
        }
      }
    ].forEach((e) => {
      this.disposeWithMe(this._docQuickInsertPopupService.registerPopup(e));
    });
  }
  _initMenus() {
  }
};
G = Wt([
  ne(0, Q),
  ne(1, f(I)),
  ne(2, f(ye))
], G);
const qt = "docs-quick-insert-ui.config", Ie = {};
var Zt = Object.defineProperty, Vt = Object.getOwnPropertyDescriptor, Ft = (t, e, n) => e in t ? Zt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, Gt = (t, e, n, i) => {
  for (var r = i > 1 ? void 0 : i ? Vt(e, n) : e, s = t.length - 1, c; s >= 0; s--)
    (c = t[s]) && (r = c(r) || r);
  return r;
}, ie = (t, e) => (n, i) => e(n, i, t), He = (t, e, n) => Ft(t, typeof e != "symbol" ? e + "" : e, n);
const zt = "DOC_QUICK_INSERT_UI_PLUGIN";
let z = class extends ze {
  constructor(t = Ie, e, n, i) {
    super(), this._config = t, this._injector = e, this._renderManagerSrv = n, this._configService = i;
    const { menu: r, ...s } = Ye(
      {},
      Ie,
      this._config
    );
    r && this._configService.setConfig("menu", r, { merge: !0 }), this._configService.setConfig(qt, s);
  }
  onStarting() {
    [
      [G],
      [V],
      [I]
    ].forEach((e) => this._injector.add(e)), this._injector.get(G);
  }
  onRendered() {
    this._injector.get(V), this._injector.get(I), [
      [F]
    ].forEach((t) => {
      this._renderManagerSrv.registerRenderModule(H.UNIVER_DOC, t);
    });
  }
};
He(z, "type", H.UNIVER_DOC);
He(z, "pluginName", zt);
z = Gt([
  Ve(Mt, xt, Pt, yt, lt),
  ie(1, f(Fe)),
  ie(2, f(he)),
  ie(3, Ge)
], z);
export {
  I as DocQuickInsertPopupService,
  V as DocQuickInsertTriggerController,
  G as DocQuickInsertUIController,
  Ot as KeywordInputPlaceholderComponentKey,
  bt as QuickInsertPlaceholderComponentKey,
  z as UniverDocsQuickInsertUIPlugin
};
