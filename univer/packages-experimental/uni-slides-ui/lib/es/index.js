import { jsxs as h, jsx as d } from "react/jsx-runtime";
import { IUniverInstanceService as O, ICommandService as M, LocaleService as H, UniverInstanceType as U, Inject as p, Injector as G } from "@univerjs/core";
import { SetSlidePageThumbOperation as z, ActivateSlidePageOperation as V, AppendSlideOperation as F, SlidesUIMenuSchema as W, SlidesUIController as Z, SlideEditorContainer as q, SLIDES_IMAGE_MENU_ID as J, SHAPE_MENU_ID as K, SlideAddTextCommand as Q } from "@univerjs/slides-ui";
import { useDependency as m, useObservable as C, RibbonStartGroup as X, IMenuManagerService as Y, ComponentManager as ee, IUIPartsService as re, IShortcutService as ne, connectInjector as x, BuiltInUIPart as ie } from "@univerjs/ui";
import { UNI_MENU_POSITIONS as te, UniToolbarService as se, UniUIPart as oe, BuiltinUniToolbarItemId as S } from "@univerjs/uniui";
import { clsx as _, borderClassName as ae, scrollbarClassName as ce } from "@univerjs/design";
import { IRenderManagerService as ue } from "@univerjs/engine-render";
import { useRef as R, createElement as $, forwardRef as le, useState as y, useMemo as de, createRef as ve, useEffect as b, useCallback as E } from "react";
function j({ ref: n, ...r }) {
  const { icon: t, id: i, className: s, extend: e, ...o } = r, v = `univerjs-icon univerjs-icon-${i} ${s || ""}`.trim(), u = R(`_${Ie()}`);
  return w(t, `${i}`, {
    defIds: t.defIds,
    idSuffix: u.current
  }, {
    ref: n,
    className: v,
    ...o
  }, e);
}
function w(n, r, t, i, s) {
  return $(n.tag, {
    key: r,
    ...fe(n, t, s),
    ...i
  }, (me(n, t).children || []).map((e, o) => w(e, `${r}-${n.tag}-${o}`, t, void 0, s)));
}
function fe(n, r, t) {
  const i = { ...n.attrs };
  t != null && t.colorChannel1 && i.fill === "colorChannel1" && (i.fill = t.colorChannel1), n.tag === "mask" && i.id && (i.id = i.id + r.idSuffix), Object.entries(i).forEach(([e, o]) => {
    e === "mask" && typeof o == "string" && (i[e] = o.replace(/url\(#(.*)\)/, `url(#$1${r.idSuffix})`));
  });
  const { defIds: s } = r;
  return !s || s.length === 0 || (n.tag === "use" && i["xlink:href"] && (i["xlink:href"] = i["xlink:href"] + r.idSuffix), Object.entries(i).forEach(([e, o]) => {
    typeof o == "string" && (i[e] = o.replace(/url\(#(.*)\)/, `url(#$1${r.idSuffix})`));
  })), i;
}
function me(n, r) {
  var i;
  const { defIds: t } = r;
  return !t || t.length === 0 ? n : n.tag === "defs" && ((i = n.children) != null && i.length) ? {
    ...n,
    children: n.children.map((s) => typeof s.attrs.id == "string" && t && t.includes(s.attrs.id) ? {
      ...s,
      attrs: {
        ...s.attrs,
        id: s.attrs.id + r.idSuffix
      }
    } : s)
  } : n;
}
function Ie() {
  return Math.random().toString(36).substring(2, 8);
}
j.displayName = "UniverIcon";
const ge = {
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
}, T = le(function(r, t) {
  return $(j, Object.assign({}, r, {
    id: "increase-icon",
    ref: t,
    icon: ge
  }));
});
T.displayName = "IncreaseIcon";
function he() {
  const n = m(O), r = m(M), t = m(ue), i = m(H), s = R(null), e = C(
    () => n.getCurrentTypeOfUnit$(U.UNIVER_SLIDE),
    void 0,
    void 0,
    []
  ), o = e == null ? void 0 : e.getPages(), v = e == null ? void 0 : e.getPageOrder();
  if (!o || !v)
    return null;
  const u = v.map((a) => o[a]), [A, L] = y(v[0]), [P, B] = y(0), I = de(() => u.map(() => ve()), [u]);
  b(() => {
    const a = e == null ? void 0 : e.activePage$.subscribe((c) => {
      var g;
      const f = (g = c == null ? void 0 : c.id) != null ? g : null;
      f && L(f);
    });
    return () => {
      a == null || a.unsubscribe();
    };
  }, []), b(() => {
    I.forEach((a, c) => {
      var f;
      if (a.current) {
        const g = u[c];
        (f = t.getRenderById(g.id)) == null || f.engine.setContainer(a.current);
      }
    }), I.length > 0 && r.syncExecuteCommand(z.id, {
      unitId: e == null ? void 0 : e.getUnitId()
    });
  }, [I, r, t, u, e]), b(() => {
    const a = s.current;
    a && B(a.clientHeight - 38);
  }, []);
  const D = E((a) => {
    r.syncExecuteCommand(V.id, { id: a, unitId: e == null ? void 0 : e.getUnitId() });
  }, [r, e]), k = E(() => {
    r.syncExecuteCommand(F.id, { unitId: e == null ? void 0 : e.getUnitId() });
  }, [r, e]);
  return /* @__PURE__ */ h("div", { className: "univer-flex univer-h-full univer-select-none univer-flex-col", ref: s, children: [
    /* @__PURE__ */ d(
      "div",
      {
        className: _("univer-overflow-y-auto", ce),
        style: { height: `${P}px` },
        children: u.map((a, c) => /* @__PURE__ */ h(
          "div",
          {
            className: _("univer-relative univer-my-4 univer-box-border univer-flex univer-w-[160px] univer-overflow-hidden univer-rounded-lg hover:univer-border-primary-600", ae, a.id === A && "univer-border-primary-600"),
            onClick: () => D(a.id),
            children: [
              /* @__PURE__ */ d(
                "span",
                {
                  className: "univer-absolute univer-bottom-1 univer-left-1 univer-z-10 univer-inline-flex univer-size-5 univer-items-center univer-justify-center univer-overflow-hidden univer-rounded univer-text-xs univer-text-white",
                  children: c + 1
                }
              ),
              /* @__PURE__ */ d("div", { ref: I[c], className: "univer-relative univer-h-[90px] univer-w-[160px]" })
            ]
          },
          a.id
        ))
      }
    ),
    /* @__PURE__ */ h(
      "button",
      {
        type: "button",
        className: "before:absolute before:left-0 before:top-0 before:h-px before:content-[''] before:univer-bg-gray-200 univer-relative univer-mt-4 univer-flex univer-h-8 univer-cursor-pointer univer-items-center univer-justify-center univer-rounded-lg univer-border-0 univer-bg-transparent univer-px-1 univer-text-primary-500 hover:univer-bg-gray-100 dark:hover:!univer-bg-gray-700",
        onClick: k,
        children: [
          /* @__PURE__ */ d(T, { className: "univer-mr-1 univer-size-4" }),
          /* @__PURE__ */ d("span", { children: i.t("slide.append") })
        ]
      }
    )
  ] });
}
const pe = {
  [te.TOOLBAR_MAIN]: W[X.FORMAT]
};
var Se = Object.getOwnPropertyDescriptor, be = (n, r, t, i) => {
  for (var s = i > 1 ? void 0 : i ? Se(r, t) : r, e = n.length - 1, o; e >= 0; e--)
    (o = n[e]) && (s = o(s) || s);
  return s;
}, l = (n, r) => (t, i) => r(t, i, n);
let N = class extends Z {
  constructor(n, r, t, i, s, e, o) {
    super(n, r, t, i, s, e), this._toolbarService = o, this._initUniMenus();
  }
  _initUIComponents() {
    this.disposeWithMe(this._uiPartsService.registerComponent(oe.OUTLINE, () => x(Ce, this._injector))), this.disposeWithMe(
      this._uiPartsService.registerComponent(ie.CONTENT, () => x(q, this._injector))
    );
  }
  _initUniMenus() {
    this._menuManagerService.appendRootMenu(pe), [
      [S.IMAGE, J],
      [S.FONT_GROUP, K],
      [S.TABLE, Q.id]
    ].forEach(([n, r]) => {
      this._toolbarService.implementItem(n, { id: r, type: U.UNIVER_SLIDE });
    });
  }
};
N = be([
  l(0, p(G)),
  l(1, Y),
  l(2, p(ee)),
  l(3, re),
  l(4, M),
  l(5, ne),
  l(6, p(se))
], N);
function Ce() {
  const n = m(O), r = C(n.focused$), t = C(() => n.getCurrentTypeOfUnit$(U.UNIVER_SLIDE), null, !1, []);
  return !t || r !== t.getUnitId() ? null : /* @__PURE__ */ d(he, {});
}
export {
  N as UniSlidesUIController
};
