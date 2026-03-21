import { ICommandService as s, UniverInstanceType as I, BooleanNumber as S, IUniverInstanceService as g, DOCS_NORMAL_EDITOR_UNIT_ID_KEY as F, Inject as v, Injector as y, IConfigService as b } from "@univerjs/core";
import { DOCS_IMAGE_MENU_ID as A } from "@univerjs/docs-drawing-ui";
import { SetInlineFormatCommand as _, DocsUIMenuSchema as B, DocUIController as L, SetInlineFormatFontFamilyCommand as $, SetInlineFormatFontSizeCommand as k, SetInlineFormatTextColorCommand as w, SetInlineFormatTextBackgroundColorCommand as P, OrderListCommand as G, BulletListCommand as V, SetInlineFormatBoldCommand as j, SetInlineFormatItalicCommand as K, SetInlineFormatUnderlineCommand as W, SetInlineFormatStrikethroughCommand as Y, DocCreateTableOperation as z } from "@univerjs/docs-ui";
import { getMenuHiddenObservable as O, MenuItemType as T, RibbonStartGroup as H, ComponentManager as Z, ILayoutService as q, IMenuManagerService as J, IUIPartsService as Q, IShortcutService as X } from "@univerjs/ui";
import { UNI_MENU_POSITIONS as tt, FONT_GROUP_MENU_ID as et, UniToolbarService as nt, BuiltinUniToolbarItemId as l, generateCloneMutation as u } from "@univerjs/uniui";
import { SetTextSelectionsOperation as C, DocSelectionManagerService as ot } from "@univerjs/docs";
import "@univerjs/engine-render";
import { Observable as U } from "rxjs";
const M = "doc.command.uni-italic", f = "doc.command.uni-bold", R = "doc.command.uni-underline", h = "doc.command.uni-strike", E = "doc.command.uni-table";
function it(t) {
  const i = t.get(s);
  return {
    id: f,
    type: T.BUTTON,
    icon: "BoldIcon",
    title: "Set bold",
    tooltip: "toolbar.bold",
    activated$: new U((n) => {
      const r = i.onCommandExecuted((a) => {
        var o;
        const e = a.id;
        if (e === C.id || e === _.id) {
          const d = p(t);
          if (d == null)
            return;
          const c = (o = d.ts) == null ? void 0 : o.bl;
          n.next(c === S.TRUE);
        }
      });
      return n.next(!1), r.dispose;
    }),
    hidden$: O(t, I.UNIVER_DOC)
  };
}
function rt(t) {
  const i = t.get(s);
  return {
    id: M,
    type: T.BUTTON,
    icon: "ItalicIcon",
    title: "Set italic",
    tooltip: "toolbar.italic",
    activated$: new U((n) => {
      const r = i.onCommandExecuted((a) => {
        var o;
        const e = a.id;
        if (e === C.id || e === _.id) {
          const d = p(t);
          if (d == null)
            return;
          const c = (o = d.ts) == null ? void 0 : o.it;
          n.next(c === S.TRUE);
        }
      });
      return n.next(!1), r.dispose;
    }),
    hidden$: O(t, I.UNIVER_DOC)
  };
}
function at(t) {
  const i = t.get(s);
  return {
    id: R,
    type: T.BUTTON,
    icon: "UnderlineIcon",
    title: "Set underline",
    tooltip: "toolbar.underline",
    activated$: new U((n) => {
      const r = i.onCommandExecuted((a) => {
        var o;
        const e = a.id;
        if (e === C.id || e === _.id) {
          const d = p(t);
          if (d == null)
            return;
          const c = (o = d.ts) == null ? void 0 : o.ul;
          n.next((c == null ? void 0 : c.s) === S.TRUE);
        }
      });
      return n.next(!1), r.dispose;
    }),
    hidden$: O(t, I.UNIVER_DOC)
  };
}
function ct(t) {
  const i = t.get(s);
  return {
    id: h,
    type: T.BUTTON,
    icon: "StrikethroughIcon",
    title: "Set strike through",
    tooltip: "toolbar.strikethrough",
    activated$: new U((n) => {
      const r = i.onCommandExecuted((a) => {
        var o;
        const e = a.id;
        if (e === C.id || e === _.id) {
          const d = p(t);
          if (d == null)
            return;
          const c = (o = d.ts) == null ? void 0 : o.st;
          n.next((c == null ? void 0 : c.s) === S.TRUE);
        }
      });
      return n.next(!1), r.dispose;
    }),
    hidden$: O(t, I.UNIVER_DOC)
  };
}
function p(t) {
  var c;
  const i = t.get(g), n = t.get(ot), r = i.getUniverDocInstance(F), a = n.getActiveTextRange();
  if (r == null || a == null) return null;
  const e = (c = r.getBody()) == null ? void 0 : c.textRuns;
  if (e == null) return;
  const { startOffset: o } = a;
  return e.find(({ st: D, ed: x }) => o >= D && o <= x);
}
const dt = {
  [tt.TOOLBAR_MAIN]: B[H.FORMAT],
  [et]: {
    [f]: {
      order: 0,
      menuItemFactory: it
    },
    [M]: {
      order: 1,
      menuItemFactory: rt
    },
    [R]: {
      order: 2,
      menuItemFactory: at
    },
    [h]: {
      order: 3,
      menuItemFactory: ct
    }
  }
};
var mt = Object.getOwnPropertyDescriptor, lt = (t, i, n, r) => {
  for (var a = r > 1 ? void 0 : r ? mt(i, n) : i, e = t.length - 1, o; e >= 0; e--)
    (o = t[e]) && (a = o(a) || a);
  return a;
}, m = (t, i) => (n, r) => i(n, r, t);
let N = class extends L {
  constructor(t, i, n, r, a, e, o, d, c, D) {
    super(
      t,
      i,
      n,
      r,
      a,
      e,
      o,
      d,
      c
    ), this._toolbarService = D, this._initUniMenus(), this._initMutations();
  }
  _initUniMenus() {
    this._menuManagerService.appendRootMenu(dt), [
      [l.FONT_FAMILY, $.id],
      [l.FONT_SIZE, k.id],
      [l.COLOR, w.id],
      [l.BACKGROUND, P.id],
      [l.IMAGE, A],
      [l.TABLE, E],
      [l.ORDER_LIST, G.id],
      [l.UNORDER_LIST, V.id]
    ].forEach(([t, i]) => {
      this.disposeWithMe(this._toolbarService.implementItem(t, { id: i, type: I.UNIVER_DOC }));
    });
  }
  _initMutations() {
    [
      u(f, j),
      u(M, K),
      u(R, W),
      u(h, Y),
      u(E, z)
    ].forEach((t) => {
      this.disposeWithMe(this._commandService.registerCommand(t));
    });
  }
};
N = lt([
  m(0, v(y)),
  m(1, v(Z)),
  m(2, s),
  m(3, q),
  m(4, J),
  m(5, Q),
  m(6, g),
  m(7, X),
  m(8, b),
  m(9, v(nt))
], N);
export {
  N as UniDocsUIController
};
