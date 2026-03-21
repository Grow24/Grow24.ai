import { jsxs as z, jsx as p } from "react/jsx-runtime";
import { ICommandService as T, IUniverInstanceService as y, IContextService as b, UniverInstanceType as R, EDITOR_ACTIVATED as M, FOCUSING_SHEET as N, BooleanNumber as O, FontItalic as E, FontWeight as U, DOCS_NORMAL_EDITOR_UNIT_ID_KEY as de, Inject as Y, Injector as me, IConfigService as ge } from "@univerjs/core";
import { SetWorksheetActiveOperation as C, SetWorksheetOrderMutation as Se, InsertSheetMutation as fe, SetWorksheetNameMutation as ve, RemoveSheetMutation as he, SetWorksheetHideMutation as Ie, SetTabColorMutation as pe, InsertSheetCommand as Ce, SheetsSelectionsService as k, SetRangeValuesMutation as A, SetSelectionsOperation as L, RangeProtectionPermissionEditPoint as w, WorksheetEditPermission as $, WorksheetSetCellStylePermission as F, WorkbookEditablePermission as D, SetBackgroundColorCommand as Te } from "@univerjs/sheets";
import { SHEETS_IMAGE_MENU_ID as ye } from "@univerjs/sheets-drawing-ui";
import { useActiveWorkbook as Re, deriveStateFromActiveSheet$ as B, getCurrentRangeDisable$ as H, SheetsUIMenuSchema as xe, SheetUIController as Ee, RenderSheetContent as Ue, SetRangeFontFamilyCommand as _e, SetRangeFontSizeCommand as be, SetRangeTextColorCommand as Me, SetRangeBoldCommand as Ne, SetRangeItalicCommand as Oe, SetRangeUnderlineCommand as ke, SetRangeStrickThroughCommand as Ae } from "@univerjs/sheets-ui";
import { useDependency as oe, getMenuHiddenObservable as V, MenuItemType as j, RibbonStartGroup as Le, ComponentManager as we, ILayoutService as $e, IShortcutService as Fe, IMenuManagerService as De, IUIPartsService as Be, connectInjector as ee, BuiltInUIPart as He, useObservable as te } from "@univerjs/ui";
import { UNI_MENU_POSITIONS as Ve, FONT_GROUP_MENU_ID as je, UniToolbarService as We, UniUIPart as Pe, BuiltinUniToolbarItemId as x, generateCloneMutation as _ } from "@univerjs/uniui";
import { clsx as ne, Tooltip as Ge, scrollbarClassName as Ke } from "@univerjs/design";
import { useRef as se, createElement as ae, forwardRef as ze, useState as ie, useCallback as Ye, useEffect as Ze } from "react";
import { SetTextSelectionsOperation as W, DocSelectionManagerService as qe } from "@univerjs/docs";
import { SetInlineFormatCommand as P } from "@univerjs/docs-ui";
import { Observable as G } from "rxjs";
function le({ ref: e, ...i }) {
  const { icon: r, id: t, className: n, extend: a, ...s } = i, S = `univerjs-icon univerjs-icon-${t} ${n || ""}`.trim(), d = se(`_${Xe()}`);
  return ce(r, `${t}`, {
    defIds: r.defIds,
    idSuffix: d.current
  }, {
    ref: e,
    className: S,
    ...s
  }, a);
}
function ce(e, i, r, t, n) {
  return ae(e.tag, {
    key: i,
    ...Je(e, r, n),
    ...t
  }, (Qe(e, r).children || []).map((a, s) => ce(a, `${i}-${e.tag}-${s}`, r, void 0, n)));
}
function Je(e, i, r) {
  const t = { ...e.attrs };
  r != null && r.colorChannel1 && t.fill === "colorChannel1" && (t.fill = r.colorChannel1), e.tag === "mask" && t.id && (t.id = t.id + i.idSuffix), Object.entries(t).forEach(([a, s]) => {
    a === "mask" && typeof s == "string" && (t[a] = s.replace(/url\(#(.*)\)/, `url(#$1${i.idSuffix})`));
  });
  const { defIds: n } = i;
  return !n || n.length === 0 || (e.tag === "use" && t["xlink:href"] && (t["xlink:href"] = t["xlink:href"] + i.idSuffix), Object.entries(t).forEach(([a, s]) => {
    typeof s == "string" && (t[a] = s.replace(/url\(#(.*)\)/, `url(#$1${i.idSuffix})`));
  })), t;
}
function Qe(e, i) {
  var t;
  const { defIds: r } = i;
  return !r || r.length === 0 ? e : e.tag === "defs" && ((t = e.children) != null && t.length) ? {
    ...e,
    children: e.children.map((n) => typeof n.attrs.id == "string" && r && r.includes(n.attrs.id) ? {
      ...n,
      attrs: {
        ...n.attrs,
        id: n.attrs.id + i.idSuffix
      }
    } : n)
  } : e;
}
function Xe() {
  return Math.random().toString(36).substring(2, 8);
}
le.displayName = "UniverIcon";
const et = {
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
}, ue = ze(function(i, r) {
  return ae(le, Object.assign({}, i, {
    id: "increase-icon",
    ref: r,
    icon: et
  }));
});
ue.displayName = "IncreaseIcon";
function tt() {
  const [e, i] = ie([]), [r, t] = ie(""), n = Re(), a = oe(T), s = se(null), S = Ye(() => {
    var c;
    const o = ((c = n.getActiveSheet()) == null ? void 0 : c.getSheetId()) || "";
    t(o);
    const u = n.getSheets(), v = n.getActiveSheet(), h = u.filter((l) => !l.isSheetHidden()).map((l, g) => {
      var X;
      return {
        sheetId: l.getSheetId(),
        label: l.getName(),
        index: g,
        selected: v === l,
        color: (X = l.getTabColor()) != null ? X : void 0
      };
    });
    i(h), t(o);
  }, [n]);
  Ze(() => {
    S();
    const o = f();
    return () => {
      o.dispose();
    };
  }, [n]);
  const d = (o) => {
    o && a.executeCommand(C.id, {
      subUnitId: o,
      unitId: n.getUnitId()
    });
  }, m = () => {
    a.executeCommand(Ce.id);
  }, f = () => a.onCommandExecuted((o) => {
    switch (o.id) {
      case pe.id:
      case Ie.id:
      case he.id:
      case ve.id:
      case fe.id:
      case Se.id:
      case C.id:
        S();
        break;
    }
  });
  return /* @__PURE__ */ z("div", { className: "univer-flex univer-h-full univer-select-none univer-flex-col univer-justify-between", ref: s, children: [
    /* @__PURE__ */ p("div", { className: ne("univer-overflow-y-auto", Ke), children: /* @__PURE__ */ p("div", { className: "univer-flex univer-flex-col univer-gap-1 univer-text-sm univer-font-medium", children: e.map((o, u) => /* @__PURE__ */ p(
      "div",
      {
        className: ne("univer-flex univer-h-8 univer-cursor-pointer univer-items-center univer-rounded-lg univer-px-1 univer-py-0 hover:univer-bg-gray-100 dark:hover:!univer-bg-gray-700", r === o.sheetId ? "univer-text-primary-500" : ""),
        onClick: () => d(o.sheetId),
        children: /* @__PURE__ */ p(Ge, { showIfEllipsis: !0, title: o.label, placement: "right", children: /* @__PURE__ */ z("span", { children: [
          " ",
          o.label,
          " "
        ] }) })
      },
      u
    )) }) }),
    /* @__PURE__ */ z(
      "button",
      {
        type: "button",
        className: "before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-gray-100 before:content-[''] univer-relative univer-mt-4 univer-flex univer-h-8 univer-items-center univer-justify-center univer-rounded-lg univer-border-0 univer-bg-transparent univer-text-primary-600 hover:univer-cursor-pointer hover:univer-bg-gray-100 dark:hover:!univer-bg-gray-700",
        onClick: m,
        children: [
          /* @__PURE__ */ p(ue, { className: "univer-mr-1 univer-size-4" }),
          /* @__PURE__ */ p("span", { children: "New sheet" })
        ]
      }
    )
  ] });
}
const Z = "sheet.command.uni-bold", q = "sheet.command.uni-italic", J = "sheet.command.uni-underline", Q = "sheet.command.uni-strike";
function nt(e) {
  const i = e.get(T), r = e.get(y), t = e.get(b), n = e.get(k);
  return {
    id: Z,
    type: j.BUTTON,
    icon: "BoldIcon",
    title: "Set bold",
    tooltip: "toolbar.bold",
    disabled$: H(e, { workbookTypes: [D], worksheetTypes: [$, F], rangeTypes: [w] }),
    activated$: B(r, !1, ({ worksheet: a }) => new G((s) => {
      var f;
      const S = i.onCommandExecuted((o) => {
        var v, h;
        const u = o.id;
        if (u === A.id || u === L.id || u === C.id) {
          const c = (v = n.getCurrentLastSelection()) == null ? void 0 : v.primary;
          let l = U.NORMAL;
          if (c != null) {
            const g = a.getRange(c.startRow, c.startColumn);
            l = g == null ? void 0 : g.getFontWeight();
          }
          s.next(l === U.BOLD);
        }
        if ((u === W.id || u === P.id) && t.getContextValue(M) && t.getContextValue(N)) {
          const c = K(e);
          if (c == null)
            return;
          const l = (h = c.ts) == null ? void 0 : h.bl;
          s.next(l === O.TRUE);
        }
      }), d = (f = n.getCurrentLastSelection()) == null ? void 0 : f.primary;
      if (!a) {
        s.next(!1);
        return;
      }
      let m = U.NORMAL;
      if (d != null) {
        const o = a.getRange(d.startRow, d.startColumn);
        m = o == null ? void 0 : o.getFontWeight();
      }
      return s.next(m === U.BOLD), S.dispose;
    })),
    hidden$: V(e, R.UNIVER_SHEET)
  };
}
function it(e) {
  const i = e.get(T), r = e.get(y), t = e.get(k), n = e.get(b);
  return {
    id: q,
    type: j.BUTTON,
    icon: "ItalicIcon",
    title: "Set italic",
    tooltip: "toolbar.italic",
    disabled$: H(e, { workbookTypes: [D], worksheetTypes: [$, F], rangeTypes: [w] }),
    activated$: B(r, !1, ({ worksheet: a }) => new G((s) => {
      var f;
      const S = i.onCommandExecuted((o) => {
        var v, h;
        const u = o.id;
        if (u === A.id || u === L.id || u === C.id) {
          const c = (v = t.getCurrentLastSelection()) == null ? void 0 : v.primary;
          let l = E.NORMAL;
          if (c != null) {
            const g = a.getRange(c.startRow, c.startColumn);
            l = g == null ? void 0 : g.getFontStyle();
          }
          s.next(l === E.ITALIC);
        }
        if ((u === W.id || u === P.id) && n.getContextValue(M) && n.getContextValue(N)) {
          const c = K(e);
          if (c == null) return;
          const l = (h = c.ts) == null ? void 0 : h.it;
          s.next(l === O.TRUE);
        }
      }), d = (f = t.getCurrentLastSelection()) == null ? void 0 : f.primary;
      let m = E.NORMAL;
      if (d != null) {
        const o = a.getRange(d.startRow, d.startColumn);
        m = o == null ? void 0 : o.getFontStyle();
      }
      return s.next(m === E.ITALIC), S.dispose;
    })),
    hidden$: V(e, R.UNIVER_SHEET)
  };
}
function rt(e) {
  const i = e.get(T), r = e.get(y), t = e.get(k), n = e.get(b);
  return {
    id: J,
    type: j.BUTTON,
    icon: "UnderlineIcon",
    title: "Set underline",
    tooltip: "toolbar.underline",
    activated$: B(r, !1, ({ worksheet: a }) => new G((s) => {
      var f;
      const S = i.onCommandExecuted((o) => {
        var v, h;
        const u = o.id;
        if (u === A.id || u === L.id || u === C.id) {
          const c = (v = t.getCurrentLastSelection()) == null ? void 0 : v.primary;
          let l;
          if (c != null) {
            const g = a.getRange(c.startRow, c.startColumn);
            l = g == null ? void 0 : g.getUnderline();
          }
          s.next(!!(l && l.s));
        }
        if ((u === W.id || u === P.id) && n.getContextValue(M) && n.getContextValue(N)) {
          const c = K(e);
          if (c == null) return;
          const l = (h = c.ts) == null ? void 0 : h.ul;
          s.next((l == null ? void 0 : l.s) === O.TRUE);
        }
      }), d = (f = t.getCurrentLastSelection()) == null ? void 0 : f.primary;
      let m;
      if (d != null) {
        const o = a.getRange(d.startRow, d.startColumn);
        m = o == null ? void 0 : o.getUnderline();
      }
      return s.next(!!(m && m.s)), S.dispose;
    })),
    disabled$: H(e, { workbookTypes: [D], worksheetTypes: [$, F], rangeTypes: [w] }),
    hidden$: V(e, R.UNIVER_SHEET)
  };
}
function ot(e) {
  const i = e.get(T), r = e.get(y), t = e.get(k), n = e.get(b);
  return {
    id: Q,
    type: j.BUTTON,
    icon: "StrikethroughIcon",
    title: "Set strike through",
    tooltip: "toolbar.strikethrough",
    disabled$: H(e, { workbookTypes: [D], worksheetTypes: [$, F], rangeTypes: [w] }),
    activated$: B(r, !1, ({ worksheet: a }) => new G((s) => {
      var f;
      const S = i.onCommandExecuted((o) => {
        var v, h;
        const u = o.id;
        if (u === A.id || u === L.id || u === C.id) {
          const c = (v = t.getCurrentLastSelection()) == null ? void 0 : v.primary;
          let l;
          if (c != null) {
            const g = a.getRange(c.startRow, c.startColumn);
            l = g == null ? void 0 : g.getStrikeThrough();
          }
          s.next(!!(l && l.s));
        }
        if ((u === W.id || u === P.id) && n.getContextValue(M) && n.getContextValue(N)) {
          const c = K(e);
          if (c == null)
            return;
          const l = (h = c.ts) == null ? void 0 : h.st;
          s.next((l == null ? void 0 : l.s) === O.TRUE);
        }
      }), d = (f = t.getCurrentLastSelection()) == null ? void 0 : f.primary;
      let m;
      if (d != null) {
        const o = a.getRange(d.startRow, d.startColumn);
        m = o == null ? void 0 : o.getStrikeThrough();
      }
      return s.next(!!(m && m.s)), S.dispose;
    })),
    hidden$: V(e, R.UNIVER_SHEET)
  };
}
function K(e) {
  var d;
  const i = e.get(y), r = e.get(qe), t = i.getUniverDocInstance(de), n = r.getActiveRectRange();
  if (t == null || n == null) return null;
  const a = (d = t.getBody()) == null ? void 0 : d.textRuns;
  if (a == null) return;
  const { startOffset: s } = n;
  return a.find(({ st: m, ed: f }) => s >= m && s <= f);
}
const st = {
  [Ve.TOOLBAR_MAIN]: xe[Le.FORMAT],
  [je]: {
    [Z]: {
      order: 0,
      menuItemFactory: nt
    },
    [q]: {
      order: 1,
      menuItemFactory: it
    },
    [J]: {
      order: 2,
      menuItemFactory: rt
    },
    [Q]: {
      order: 3,
      menuItemFactory: ot
    }
  }
};
var at = Object.getOwnPropertyDescriptor, lt = (e, i, r, t) => {
  for (var n = t > 1 ? void 0 : t ? at(i, r) : i, a = e.length - 1, s; a >= 0; a--)
    (s = e[a]) && (n = s(n) || n);
  return n;
}, I = (e, i) => (r, t) => i(r, t, e);
let re = class extends Ee {
  constructor(e, i, r, t, n, a, s, S, d) {
    super(
      e,
      i,
      r,
      t,
      n,
      a,
      s,
      S
    ), this._toolbarService = d, this._initUniMenus(), this._initMutations();
  }
  _initWorkbenchParts() {
    const e = this._uiPartsService, i = this._injector;
    this.disposeWithMe(e.registerComponent(Pe.OUTLINE, () => ee(ct, i))), this.disposeWithMe(e.registerComponent(He.CONTENT, () => ee(Ue, i)));
  }
  _initUniMenus() {
    this._menuManagerService.appendRootMenu(st), [
      [x.FONT_FAMILY, _e.id],
      [x.FONT_SIZE, be.id],
      [x.COLOR, Me.id],
      [x.BACKGROUND, Te.id],
      [x.IMAGE, ye]
    ].forEach(([e, i]) => {
      this._toolbarService.implementItem(e, { id: i, type: R.UNIVER_SHEET });
    });
  }
  _initMutations() {
    [
      _(Z, Ne),
      _(q, Oe),
      _(J, ke),
      _(Q, Ae)
    ].forEach((e) => {
      this.disposeWithMe(this._commandService.registerCommand(e));
    });
  }
};
re = lt([
  I(0, Y(me)),
  I(1, Y(we)),
  I(2, $e),
  I(3, T),
  I(4, Fe),
  I(5, De),
  I(6, Be),
  I(7, ge),
  I(8, Y(We))
], re);
function ct() {
  const e = oe(y), i = te(e.focused$), r = te(() => e.getCurrentTypeOfUnit$(R.UNIVER_SHEET), null, !1, []);
  return !r || i !== (r == null ? void 0 : r.getUnitId()) ? null : /* @__PURE__ */ p(tt, {});
}
export {
  re as UniSheetsUIController
};
