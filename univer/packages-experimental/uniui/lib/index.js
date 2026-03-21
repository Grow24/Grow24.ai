var gu = Object.defineProperty;
var pu = (e, t, n) => t in e ? gu(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Se = (e, t, n) => pu(e, typeof t != "symbol" ? t + "" : t, n);
import { Disposable as yt, CommandType as pi, IUniverInstanceService as Me, UniverInstanceType as ue, Tools as mu, createIdentifier as yu, isInternalEditorID as vu, ILocalStorageService as Hs, UndoCommand as wu, RedoCommand as xu, toDisposable as En, ICommandService as vt, IPermissionService as _u, IContextService as mi, FOCUSING_FX_BAR_EDITOR as Cu, Rectangle as bu, DOCS_FORMULA_BAR_EDITOR_UNIT_ID_KEY as Su, LocaleService as Nu, ThemeService as Eu, debounce as Iu, Inject as et, Injector as yi, LifecycleService as Mu, Optional as Au, LifecycleStages as br, DependentOn as Lu, Plugin as $u, merge as Tu, mergeOverrideWithDependencies as ku } from "@univerjs/core";
import { BehaviorSubject as Ur, Observable as Ue, merge as Ou, switchMap as Pu, EMPTY as go, filter as Du, delay as Ru, take as Fu, throttleTime as Vu, auditTime as Hu, map as zu, distinctUntilChanged as po } from "rxjs";
import { MenuItemType as ve, useDependency as te, useObservable as be, IMenuManagerService as Qn, useComponentsOfPart as ct, ComponentContainer as at, ToolbarItem as zs, ISidebarService as vi, ILeftSidebarService as wi, CustomLabel as Bu, ComponentManager as Jn, KeyCode as Uu, ThemeSwitcherService as Bs, BuiltInUIPart as lt, GlobalZone as Wu, ContextMenu as Zu, UNI_DISABLE_CHANGING_FOCUS_KEY as Xu, IUIPartsService as Us, ILayoutService as Ws, connectInjector as Wr, CanvasPopup as Yu, FloatDom as Gu, UIMenuSchema as Ku, RibbonStartGroup as qu, DISABLE_AUTO_FOCUS_KEY as ju, ZIndexManager as Qu, ShortcutPanelService as Ju, UIPartsService as ef, DesktopLayoutService as tf, IShortcutService as nf, ShortcutService as rf, IPlatformService as of, PlatformService as sf, MenuManagerService as cf, IContextMenuService as af, ContextMenuService as lf, IClipboardInterfaceService as uf, BrowserClipboardService as ff, INotificationService as df, DesktopNotificationService as hf, IGalleryService as gf, DesktopGalleryService as pf, IDialogService as mf, DesktopDialogService as yf, IConfirmService as vf, DesktopConfirmService as wf, DesktopSidebarService as mo, IZenZoneService as xf, DesktopZenZoneService as _f, IGlobalZoneService as Cf, DesktopGlobalZoneService as bf, IMessageService as Sf, DesktopMessageService as Nf, DesktopLocalStorageService as Ef, IBeforeCloseService as If, DesktopBeforeCloseService as Mf, ILocalFileService as Af, DesktopLocalFileService as Lf, ICanvasPopupService as $f, CanvasPopupService as Tf, CanvasFloatDomService as kf, IUIController as yo, SharedController as Of, ErrorController as Pf, ShortcutPanelController as Df, UNIVER_UI_PLUGIN_NAME as Rf } from "@univerjs/ui";
import { IRenderManagerService as Zs, DeviceInputEventType as Zr, UniverRenderEnginePlugin as Ff } from "@univerjs/engine-render";
import { jsx as I, jsxs as Q, Fragment as De } from "react/jsx-runtime";
import { clsx as nt, Dropdown as Vf, borderClassName as xi, Tooltip as Hf, Button as Xr, scrollbarClassName as zf, ConfigProvider as Bf, ConfigContext as Uf, unmount as Wf, render as Zf } from "@univerjs/design";
import * as me from "react";
import _i, { useRef as ne, createElement as we, forwardRef as pe, memo as fe, useState as ge, useCallback as he, createContext as Ci, useMemo as ye, useContext as Ot, useLayoutEffect as on, useEffect as J, useImperativeHandle as Xf } from "react";
import * as Yf from "react-dom";
import { createPortal as Gf } from "react-dom";
import { IEditorBridgeService as Xs, SetCellEditVisibleOperation as Yr, IFormulaEditorManagerService as Kf, EMBEDDING_FORMULA_EDITOR_COMPONENT_KEY as qf, useActiveWorkbook as jf, useKeyEventConfig as Qf, useWorkbooks as Jf } from "@univerjs/sheets-ui";
import { SheetsSelectionsService as ed, WorksheetProtectionRuleModel as td, RangeProtectionRuleModel as nd, RangeProtectionPermissionEditPoint as rd, WorkbookEditablePermission as id, WorksheetSetCellValuePermission as od, WorksheetEditPermission as sd } from "@univerjs/sheets";
import { FONT_GROUP_MENU_ID as cd } from "@univerjs/uniui";
class er extends yt {
  constructor() {
    super();
    Se(this, "_viewportChanged$", new Ur(null));
    Se(this, "viewportChanged$", this._viewportChanged$.asObservable());
    Se(this, "_flowInstance");
  }
  getViewport() {
    var n;
    return (n = this._flowInstance) == null ? void 0 : n.getViewport();
  }
  setViewport(n) {
    var r;
    (r = this._flowInstance) == null || r.setViewport(n, {
      duration: 100
    });
  }
  setReactFlowInstance(n) {
    this._flowInstance = n;
  }
  fitView() {
    this._flowInstance && this._flowInstance.fitView();
  }
  zoomIn() {
    this._flowInstance && this._flowInstance.zoomIn();
  }
  zoomOut() {
    this._flowInstance && this._flowInstance.zoomOut();
  }
  setViewportChanged(n) {
    this._viewportChanged$.next(n);
  }
}
const vo = {
  id: "uniui.operation.set-flow-viewport",
  type: pi.OPERATION,
  handler: async (e, t, n) => {
    const { fromCollab: r } = n || {};
    if (!r)
      return !0;
    const i = e.get(er), o = i.getViewport(), { viewport: s } = t, { zoom: c, x: a, y: l } = s;
    return o && c === o.zoom && a === o.x && l === o.y ? !1 : (i.setViewport(s), !0);
  }
}, bi = {
  id: "uniui.operation.uni-focus-unit",
  type: pi.OPERATION,
  handler: async (e, t) => {
    const { unitId: n } = t;
    return e.get(Me).focusUnit(n), !0;
  }
}, Ys = {
  id: "uniui.operation.dispose-unit",
  type: pi.OPERATION,
  handler: async (e) => {
    var r;
    const t = e.get(Me), n = (r = t.getFocusedUnit()) == null ? void 0 : r.getUnitId();
    return n && t.disposeUnit(n), !0;
  }
}, Si = "DOWNLOAD_MENU_ID", Ni = "SHARE_MENU_ID", ad = "LOCK_MENU_ID", Ei = "PRINT_MENU_ID", Ii = "ZEN_MENU_ID", Mi = Ys.id, Gr = "FONT_GROUP_MENU_ID", Ai = "FAKE_FONT_FAMILY_MENU_ID", Li = "FAKE_FONT_SIZE_MENU_ID", $i = "FAKE_FONT_COLOR_MENU_ID", Ti = "FAKE_BG_COLOR_MENU_ID", ki = "FAKE_IMAGE_MENU_ID", Oi = "FAKE_FONT_GROUP_MENU_ID", Pi = "FAKE_TABLE_MENU_ID", Di = "FAKE_UNORDER_LIST_MENU_ID", Ri = "FAKE_ORDER_LIST_MENU_ID";
var Xt = /* @__PURE__ */ ((e) => (e.TOOLBAR_MAIN = "toolbar_main", e.TOOLBAR_FLOAT = "toolbar_float", e))(Xt || {});
function ld() {
  return {
    id: Ai,
    tooltip: "toolbar.font",
    type: ve.SELECTOR,
    label: "UI_PLUGIN_DOCS_FONT_SIZE_COMPONENT",
    selections: [],
    disabled$: new Ue((e) => {
      e.next(!0);
    })
  };
}
function ud() {
  return {
    id: Li,
    type: ve.SELECTOR,
    tooltip: "toolbar.fontSize",
    label: {
      name: "UI_PLUGIN_DOCS_FONT_SIZE_COMPONENT",
      props: {
        min: 1,
        max: 400
      }
    },
    selections: [],
    disabled$: new Ue((e) => {
      e.next(!0);
    })
  };
}
function fd() {
  return {
    id: $i,
    icon: "FontColorDoubleIcon",
    tooltip: "toolbar.textColor.main",
    type: ve.BUTTON_SELECTOR,
    selections: [],
    disabled$: new Ue((e) => {
      e.next(!0);
    })
  };
}
function dd() {
  return {
    id: Ti,
    tooltip: "toolbar.fillColor.main",
    type: ve.BUTTON_SELECTOR,
    icon: "PaintBucketDoubleIcon",
    selections: [],
    disabled$: new Ue((e) => {
      e.next(!0);
    })
  };
}
function hd() {
  return {
    id: ki,
    type: ve.SUBITEMS,
    icon: "AdditionAndSubtractionIcon",
    tooltip: "sheetImage.title",
    disabled$: new Ue((e) => {
      e.next(!0);
    })
  };
}
function gd() {
  return {
    id: Di,
    type: ve.BUTTON_SELECTOR,
    icon: "UnorderIcon",
    tooltip: "toolbar.unorder",
    disabled$: new Ue((e) => {
      e.next(!0);
    })
  };
}
function pd() {
  return {
    id: Ri,
    type: ve.BUTTON_SELECTOR,
    icon: "OrderIcon",
    tooltip: "toolbar.order",
    disabled$: new Ue((e) => {
      e.next(!0);
    })
  };
}
function md(e) {
  const t = e.get(Me);
  return {
    id: Gr,
    type: ve.SUBITEMS,
    tooltip: "Font group",
    icon: "BoldIcon",
    hidden$: new Ue((n) => {
      const r = t.focused$.subscribe((s) => {
        if (s == null)
          return n.next(!0);
        const c = t.getUnitType(s);
        n.next(c === ue.UNIVER_SLIDE);
      }), i = t.getFocusedUnit();
      if (i == null)
        return n.next(!0);
      const o = t.getUnitType(i.getUnitId());
      return n.next(o === ue.UNIVER_SLIDE), () => r.unsubscribe();
    })
  };
}
function yd() {
  return {
    id: Oi,
    type: ve.SUBITEMS,
    tooltip: "Font group",
    icon: "BoldIcon",
    disabled$: new Ue((e) => {
      e.next(!0);
    })
  };
}
function vd() {
  return {
    id: Pi,
    type: ve.BUTTON,
    icon: "PivotTableIcon",
    tooltip: "PivotTable",
    disabled$: new Ue((e) => {
      e.next(!0);
    })
  };
}
function wd() {
  return {
    id: Si,
    type: ve.BUTTON,
    title: "",
    tooltip: "Download",
    icon: "DownloadIcon"
  };
}
function xd() {
  return {
    id: Ni,
    type: ve.BUTTON,
    title: "",
    tooltip: "Share",
    icon: "ShareIcon"
  };
}
function _d() {
  return {
    id: Ei,
    type: ve.BUTTON,
    title: "",
    tooltip: "Print",
    icon: "PrintIcon"
  };
}
function Cd() {
  return {
    id: Ii,
    type: ve.BUTTON,
    title: "",
    icon: "ZenIcon",
    tooltip: "Full screen"
  };
}
function bd() {
  return {
    id: Mi,
    type: ve.BUTTON,
    title: "Delete",
    tooltip: "Delete",
    icon: "DeleteIcon"
  };
}
const U9 = (e, t) => ({
  ...mu.deepClone(t),
  id: e
});
function xe({ ref: e, ...t }) {
  const { icon: n, id: r, className: i, extend: o, ...s } = t, c = `univerjs-icon univerjs-icon-${r} ${i || ""}`.trim(), a = ne(`_${Ed()}`);
  return Gs(n, `${r}`, {
    defIds: n.defIds,
    idSuffix: a.current
  }, {
    ref: e,
    className: c,
    ...s
  }, o);
}
function Gs(e, t, n, r, i) {
  return we(e.tag, {
    key: t,
    ...Sd(e, n, i),
    ...r
  }, (Nd(e, n).children || []).map((o, s) => Gs(o, `${t}-${e.tag}-${s}`, n, void 0, i)));
}
function Sd(e, t, n) {
  const r = { ...e.attrs };
  n != null && n.colorChannel1 && r.fill === "colorChannel1" && (r.fill = n.colorChannel1), e.tag === "mask" && r.id && (r.id = r.id + t.idSuffix), Object.entries(r).forEach(([o, s]) => {
    o === "mask" && typeof s == "string" && (r[o] = s.replace(/url\(#(.*)\)/, `url(#$1${t.idSuffix})`));
  });
  const { defIds: i } = t;
  return !i || i.length === 0 || (e.tag === "use" && r["xlink:href"] && (r["xlink:href"] = r["xlink:href"] + t.idSuffix), Object.entries(r).forEach(([o, s]) => {
    typeof s == "string" && (r[o] = s.replace(/url\(#(.*)\)/, `url(#$1${t.idSuffix})`));
  })), r;
}
function Nd(e, t) {
  var r;
  const { defIds: n } = t;
  return !n || n.length === 0 ? e : e.tag === "defs" && ((r = e.children) != null && r.length) ? {
    ...e,
    children: e.children.map((i) => typeof i.attrs.id == "string" && n && n.includes(i.attrs.id) ? {
      ...i,
      attrs: {
        ...i.attrs,
        id: i.attrs.id + t.idSuffix
      }
    } : i)
  } : e;
}
function Ed() {
  return Math.random().toString(36).substring(2, 8);
}
xe.displayName = "UniverIcon";
const Id = {
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
      d: "M14.1544 3.75557C14.3887 3.98988 14.3887 4.36978 14.1544 4.6041L6.51409 12.2444C6.40157 12.3569 6.24896 12.4201 6.08983 12.4201C5.9307 12.4201 5.77808 12.3569 5.66556 12.2444L1.84541 8.42425C1.6111 8.18993 1.6111 7.81003 1.84541 7.57572C2.07973 7.34141 2.45963 7.34141 2.69394 7.57572L6.08983 10.9716L13.3059 3.75557C13.5402 3.52126 13.9201 3.52126 14.1544 3.75557Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, Fi = pe(function(t, n) {
  return we(xe, Object.assign({}, t, {
    id: "check-mark-icon",
    ref: n,
    icon: Id
  }));
});
Fi.displayName = "CheckMarkIcon";
const Md = {
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
      d: "M3.71274 2.86421C3.47843 2.6299 3.09853 2.6299 2.86421 2.86421C2.6299 3.09853 2.6299 3.47843 2.86421 3.71274L7.15154 8.00007L2.86421 12.2874C2.6299 12.5217 2.6299 12.9016 2.86421 13.1359C3.09853 13.3702 3.47843 13.3702 3.71274 13.1359L8.00007 8.84859L12.2874 13.1359C12.5217 13.3702 12.9016 13.3702 13.1359 13.1359C13.3702 12.9016 13.3702 12.5217 13.1359 12.2874L8.84859 8.00007L13.1359 3.71274C13.3702 3.47843 13.3702 3.09853 13.1359 2.86421C12.9016 2.6299 12.5217 2.6299 12.2874 2.86421L8.00007 7.15154L3.71274 2.86421Z"
    }
  }]
}, Vi = pe(function(t, n) {
  return we(xe, Object.assign({}, t, {
    id: "close-icon",
    ref: n,
    icon: Md
  }));
});
Vi.displayName = "CloseIcon";
const Ad = {
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
        d: "M5.3313 1.4667C5.3313 1.13533 5.59993 0.866699 5.9313 0.866699H10.069C10.4004 0.866699 10.669 1.13533 10.669 1.4667C10.669 1.79807 10.4004 2.0667 10.069 2.0667H5.9313C5.59993 2.0667 5.3313 1.79807 5.3313 1.4667Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M1.09985 3.64443C1.09985 3.31306 1.36848 3.04443 1.69985 3.04443H14.2999C14.6312 3.04443 14.8999 3.31306 14.8999 3.64443C14.8999 3.9758 14.6312 4.24443 14.2999 4.24443H1.69985C1.36848 4.24443 1.09985 3.9758 1.09985 3.64443Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M6.12398 8.30171C6.35829 8.0674 6.73819 8.0674 6.97251 8.30171L8.00007 9.32928L9.02764 8.30171C9.26195 8.0674 9.64185 8.0674 9.87617 8.30171C10.1105 8.53603 10.1105 8.91593 9.87617 9.15024L8.8486 10.1778L9.87617 11.2054C10.1105 11.4397 10.1105 11.8196 9.87617 12.0539C9.64185 12.2882 9.26195 12.2882 9.02764 12.0539L8.00007 11.0263L6.97251 12.0539C6.73819 12.2882 6.35829 12.2882 6.12398 12.0539C5.88966 11.8196 5.88966 11.4397 6.12398 11.2054L7.15154 10.1778L6.12398 9.15024C5.88966 8.91593 5.88966 8.53603 6.12398 8.30171Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M4.75332 5.22217C3.86966 5.22217 3.15332 5.93851 3.15332 6.82217V12.5331C3.15332 13.9691 4.31738 15.1332 5.75332 15.1332H10.2465C11.6825 15.1332 12.8465 13.9691 12.8465 12.5331V6.82217C12.8465 5.93851 12.1302 5.22217 11.2465 5.22217H4.75332ZM4.35332 6.82217C4.35332 6.60125 4.53241 6.42217 4.75332 6.42217H11.2465C11.4674 6.42217 11.6465 6.60125 11.6465 6.82217V12.5331C11.6465 13.3063 11.0197 13.9332 10.2465 13.9332H5.75332C4.98012 13.9332 4.35332 13.3063 4.35332 12.5331V6.82217Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    }
  ]
}, Ks = pe(function(t, n) {
  return we(xe, Object.assign({}, t, {
    id: "delete-icon",
    ref: n,
    icon: Ad
  }));
});
Ks.displayName = "DeleteIcon";
const Ld = {
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
      d: "M8.66203 1.99996C8.66203 1.63269 8.3643 1.33496 7.99703 1.33496C7.62976 1.33496 7.33203 1.63269 7.33203 1.99996V9.05833L5.47019 7.19648C5.21049 6.93678 4.78943 6.93678 4.52973 7.19648C4.27004 7.45618 4.27004 7.87724 4.52973 8.13694L7.49155 11.0988C7.61015 11.2373 7.78475 11.3266 7.9803 11.3314C8.15698 11.3366 8.33534 11.2718 8.47019 11.1369L11.4702 8.13694C11.7299 7.87724 11.7299 7.45618 11.4702 7.19648C11.2105 6.93678 10.7894 6.93678 10.5297 7.19648L8.66203 9.06419V1.99996Z"
    }
  }, {
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M14 7.33496C14.3672 7.33496 14.665 7.63269 14.665 7.99996V11C14.665 13.0241 13.0241 14.665 11 14.665H4.99996C2.97584 14.665 1.33496 13.0241 1.33496 11V8.00273C1.33496 7.63546 1.63269 7.33773 1.99996 7.33773C2.36723 7.33773 2.66496 7.63546 2.66496 8.00273V11C2.66496 12.2895 3.71038 13.335 4.99996 13.335H11C12.2895 13.335 13.335 12.2895 13.335 11V7.99996C13.335 7.63269 13.6327 7.33496 14 7.33496Z"
    }
  }]
}, qs = pe(function(t, n) {
  return we(xe, Object.assign({}, t, {
    id: "download-icon",
    ref: n,
    icon: Ld
  }));
});
qs.displayName = "DownloadIcon";
const $d = {
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
        d: "M10.3999 1.9999C10.3999 1.66853 10.6685 1.3999 10.9999 1.3999H13.9999C14.3313 1.3999 14.5999 1.66853 14.5999 1.9999V4.9999C14.5999 5.33127 14.3313 5.5999 13.9999 5.5999C13.6685 5.5999 13.3999 5.33127 13.3999 4.9999V3.41428L11.0902 5.724C10.8559 5.95831 10.476 5.95831 10.2417 5.724C10.0073 5.48968 10.0073 5.10979 10.2417 4.87547L12.5172 2.5999H10.9999C10.6685 2.5999 10.3999 2.33127 10.3999 1.9999Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M10.2758 10.2436C10.5101 10.0093 10.89 10.0093 11.1244 10.2436L13.3999 12.5191V10.9999C13.3999 10.6685 13.6685 10.3999 13.9999 10.3999C14.3313 10.3999 14.5999 10.6685 14.5999 10.9999V13.9999C14.5999 14.3313 14.3313 14.5999 13.9999 14.5999H10.9999C10.6685 14.5999 10.3999 14.3313 10.3999 13.9999C10.3999 13.6685 10.6685 13.3999 10.9999 13.3999H12.5836L10.2758 11.0921C10.0415 10.8578 10.0415 10.4779 10.2758 10.2436Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M5.75535 11.0943C5.99085 10.8611 5.99276 10.4812 5.75964 10.2458C5.52651 10.0103 5.14661 10.0083 4.91112 10.2415L2.5999 12.5295V10.9999C2.5999 10.6685 2.33127 10.3999 1.9999 10.3999C1.66853 10.3999 1.3999 10.6685 1.3999 10.9999V13.9999C1.3999 14.3313 1.66853 14.5999 1.9999 14.5999H4.9999C5.33127 14.5999 5.5999 14.3313 5.5999 13.9999C5.5999 13.6685 5.33127 13.3999 4.9999 13.3999H3.42632L5.75535 11.0943Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M1.3999 1.9999C1.3999 1.91908 1.41588 1.842 1.44485 1.77163L1.56933 1.58204L1.5735 1.57779C1.63111 1.51959 1.69769 1.47566 1.76883 1.44601C1.83995 1.41631 1.91803 1.3999 1.99992 1.3999H4.9999C5.33127 1.3999 5.5999 1.66853 5.5999 1.9999C5.5999 2.33127 5.33127 2.5999 4.9999 2.5999H3.45884L5.75535 4.87333C5.99085 5.10646 5.99276 5.48636 5.75964 5.72185C5.52651 5.95735 5.14661 5.95927 4.91112 5.72614L2.5999 3.43815V4.9999C2.5999 5.33127 2.33127 5.5999 1.9999 5.5999C1.66853 5.5999 1.3999 5.33127 1.3999 4.9999V1.9999Z"
      }
    }
  ]
}, js = pe(function(t, n) {
  return we(xe, Object.assign({}, t, {
    id: "fullscreen-icon",
    ref: n,
    icon: $d
  }));
});
js.displayName = "FullscreenIcon";
const Td = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 17 17",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M6.06409 5.53454C5.93592 5.53454 5.84083 5.41567 5.86897 5.29063L5.95442 4.9109C6.05444 4.48178 6.23806 4.11547 6.51182 3.81952C6.81082 3.49628 7.25398 3.35405 7.79738 3.35405C7.99847 3.35405 8.21359 3.37775 8.44188 3.42245C8.46089 3.42617 8.47974 3.43006 8.49846 3.4341C8.7099 3.4798 8.93698 3.38478 9.02031 3.18514L9.24767 2.6404C9.33457 2.43219 9.23178 2.19404 9.01582 2.12874C8.98358 2.11899 8.95028 2.10912 8.91591 2.09914C8.62745 2.01631 8.28392 1.97217 7.88074 1.97217C6.82015 1.97217 6.02714 2.23936 5.4746 2.7444C4.90987 3.26069 4.50889 3.99917 4.28413 4.9762L2.83703 11.1909C2.76126 11.5286 2.666 11.8917 2.54844 12.2812C2.42975 12.6734 2.2873 13.0595 2.12221 13.4373C1.95577 13.8159 1.76813 14.1762 1.55955 14.5171C1.49345 14.6251 1.42515 14.7282 1.35467 14.8263C1.26508 14.9509 1.3347 15.133 1.48655 15.1554C2.13635 15.2509 2.8179 15.0763 3.18197 14.5296C3.32661 14.3124 3.46779 14.0646 3.60509 13.7851C3.96635 13.0497 4.30522 12.0103 4.61867 10.6574L5.469 7.01534C5.49013 6.92483 5.57082 6.86081 5.66376 6.86081H7.62478C7.8097 6.86081 7.97051 6.73405 8.01371 6.55425L8.14014 6.02798C8.20057 5.77642 8.00992 5.53454 7.75121 5.53454H6.06409Z"
    }
  }, {
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M14.3211 5.72037L12.5124 7.96963L11.4089 5.77754C11.3422 5.63012 11.1954 5.5354 11.0336 5.5354H10.3129C10.0085 5.5354 9.80921 5.85428 9.9427 6.1279L11.4089 9.05502L8.79783 12.1493C8.56587 12.4158 8.75519 12.8315 9.10855 12.8315H9.68607C9.80672 12.8315 9.9605 12.7822 10.0388 12.6904L12.1108 10.2648L13.1176 12.561C13.1786 12.7231 13.333 12.8315 13.5061 12.8315H14.3C14.5831 12.8315 14.7417 12.6175 14.6426 12.3524L13.1728 9.28628C13.1728 9.28628 15.4009 6.45542 15.6013 6.17892C15.7966 5.90929 15.6023 5.5354 15.2693 5.5354H14.6661C14.5275 5.5354 14.4333 5.58887 14.3211 5.72037Z"
    }
  }]
}, Qs = pe(function(t, n) {
  return we(xe, Object.assign({}, t, {
    id: "fx-icon",
    ref: n,
    icon: Td
  }));
});
Qs.displayName = "FxIcon";
const kd = {
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
}, Js = pe(function(t, n) {
  return we(xe, Object.assign({}, t, {
    id: "increase-icon",
    ref: n,
    icon: kd
  }));
});
Js.displayName = "IncreaseIcon";
const Od = {
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
        d: "M2.62402 7.72905C2.58427 7.72905 2.55205 7.76127 2.55205 7.80102V13.6782C2.55205 13.7179 2.58427 13.7502 2.62402 13.7502H13.3755C13.4152 13.7502 13.4474 13.7179 13.4474 13.6782V7.80102C13.4474 7.76127 13.4152 7.72905 13.3755 7.72905H2.62402ZM1.35205 7.80102C1.35205 7.09853 1.92153 6.52905 2.62402 6.52905H13.3755C14.0779 6.52905 14.6474 7.09853 14.6474 7.80102V13.6782C14.6474 14.3807 14.0779 14.9502 13.3755 14.9502H2.62402C1.92153 14.9502 1.35205 14.3807 1.35205 13.6782V7.80102Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M8 2.25005C6.69847 2.25003 5.64336 3.30513 5.64336 4.60666V7.12895C5.64336 7.46032 5.37473 7.72895 5.04336 7.72895C4.71199 7.72895 4.44336 7.46032 4.44336 7.12895V4.60666C4.44336 2.64239 6.04451 1.05565 8.00879 1.05566M8 2.25005L8.00879 1.05566L8 2.25005ZM8.00879 1.05566L8 2.25005C9.30154 2.25003 10.3567 3.30513 10.3567 4.60666V7.12895C10.3567 7.46032 10.6253 7.72895 10.9567 7.72895C11.288 7.72895 11.5567 7.46032 11.5567 7.12895V4.60666C11.5567 2.64239 9.97306 1.05565 8.00879 1.05566Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M8.00039 9.4668C8.33176 9.4668 8.60039 9.73543 8.60039 10.0668V12.0827C8.60039 12.4141 8.33176 12.6827 8.00039 12.6827C7.66902 12.6827 7.40039 12.4141 7.40039 12.0827V10.0668C7.40039 9.73543 7.66902 9.4668 8.00039 9.4668Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    }
  ]
}, ec = pe(function(t, n) {
  return we(xe, Object.assign({}, t, {
    id: "lock-icon",
    ref: n,
    icon: Od
  }));
});
ec.displayName = "LockIcon";
const Pd = {
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
        d: "M1.66504 2.8666C1.66504 2.53523 1.93367 2.2666 2.26504 2.2666H13.735C14.0664 2.2666 14.335 2.53523 14.335 2.8666C14.335 3.19797 14.0664 3.4666 13.735 3.4666H2.26504C1.93367 3.4666 1.66504 3.19797 1.66504 2.8666Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M1.66504 8.00002C1.66504 7.66865 1.93367 7.40002 2.26504 7.40002H13.735C14.0664 7.40002 14.335 7.66865 14.335 8.00002C14.335 8.3314 14.0664 8.60002 13.735 8.60002H2.26504C1.93367 8.60002 1.66504 8.3314 1.66504 8.00002Z"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M2.26504 12.5334C1.93367 12.5334 1.66504 12.8021 1.66504 13.1334C1.66504 13.4648 1.93367 13.7334 2.26504 13.7334H13.735C14.0664 13.7334 14.335 13.4648 14.335 13.1334C14.335 12.8021 14.0664 12.5334 13.735 12.5334H2.26504Z"
      }
    }
  ]
}, tc = pe(function(t, n) {
  return we(xe, Object.assign({}, t, {
    id: "menu-icon",
    ref: n,
    icon: Pd
  }));
});
tc.displayName = "MenuIcon";
const Dd = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 17 16",
    width: "1em",
    height: "1em"
  },
  children: [
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M1.4082 3.74922C1.4082 4.63288 2.12455 5.34922 3.0082 5.34922H4.2082C5.09186 5.34922 5.8082 4.63287 5.8082 3.74922V2.54922C5.8082 1.66556 5.09186 0.949219 4.2082 0.949219H3.0082C2.12455 0.949219 1.4082 1.66556 1.4082 2.54922V3.74922ZM3.0082 4.14922C2.78729 4.14922 2.6082 3.97013 2.6082 3.74922V2.54922C2.6082 2.32831 2.78729 2.14922 3.0082 2.14922H4.2082C4.42912 2.14922 4.6082 2.32831 4.6082 2.54922V3.74922C4.6082 3.97013 4.42912 4.14922 4.2082 4.14922L3.0082 4.14922Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M8.60757 5.24912C7.72391 5.24912 7.00757 4.53278 7.00757 3.64912V2.64912C7.00757 1.76547 7.72391 1.04912 8.60757 1.04912L14.0076 1.04912C14.8912 1.04912 15.6076 1.76546 15.6076 2.64912V3.64912C15.6076 4.53278 14.8912 5.24912 14.0076 5.24912L8.60757 5.24912ZM8.20757 3.64912C8.20757 3.87003 8.38665 4.04912 8.60757 4.04912L14.0076 4.04912C14.2285 4.04912 14.4076 3.87003 14.4076 3.64912V2.64912C14.4076 2.42821 14.2285 2.24912 14.0076 2.24912L8.60757 2.24912C8.38665 2.24912 8.20757 2.42821 8.20757 2.64912V3.64912Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M1.5083 8.05078C1.5083 7.16713 2.22464 6.45078 3.1083 6.45078H4.1083C4.99196 6.45078 5.7083 7.16713 5.7083 8.05078V13.4508C5.7083 14.3344 4.99196 15.0508 4.1083 15.0508H3.1083C2.22464 15.0508 1.5083 14.3344 1.5083 13.4508V8.05078ZM3.1083 7.65078C2.88739 7.65078 2.7083 7.82987 2.7083 8.05078V13.4508C2.7083 13.6717 2.88739 13.8508 3.1083 13.8508H4.1083C4.32921 13.8508 4.5083 13.6717 4.5083 13.4508V8.05078C4.5083 7.82987 4.32921 7.65078 4.1083 7.65078H3.1083Z",
        fillRule: "evenodd",
        clipRule: "evenodd"
      }
    },
    {
      tag: "path",
      attrs: {
        fill: "currentColor",
        d: "M8.01375 13.0622L9.82677 14.8752C10.0611 15.1095 10.441 15.1095 10.6753 14.8752C10.9096 14.6409 10.9096 14.261 10.6753 14.0267L9.60391 12.9553L12.5981 12.9537C14.0335 12.953 15.1968 11.7891 15.1968 10.3537V7.70108C15.1968 7.3697 14.9281 7.10108 14.5968 7.10108C14.2654 7.10108 13.9968 7.3697 13.9968 7.70108V10.3537C13.9968 11.1266 13.3704 11.7533 12.5975 11.7537L9.60349 11.7553L10.6753 10.6835C10.9096 10.4492 10.9096 10.0693 10.6753 9.83495C10.441 9.60063 10.0611 9.60063 9.82677 9.83495L8.01375 11.648C7.62322 12.0385 7.62322 12.6717 8.01375 13.0622Z"
      }
    }
  ]
}, nc = pe(function(t, n) {
  return we(xe, Object.assign({}, t, {
    id: "pivot-table-icon",
    ref: n,
    icon: Dd
  }));
});
nc.displayName = "PivotTableIcon";
const Rd = {
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
      d: "M4.20039 8.06641C3.86902 8.06641 3.60039 8.33504 3.60039 8.66641C3.60039 8.99778 3.86902 9.26641 4.20039 9.26641H5.20039C5.53176 9.26641 5.80039 8.99778 5.80039 8.66641C5.80039 8.33504 5.53176 8.06641 5.20039 8.06641H4.20039Z"
    }
  }, {
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M13.1297 3.19844C13.1297 2.20418 12.3236 1.39824 11.3293 1.39844L4.66878 1.39977C3.67481 1.39997 2.86914 2.2058 2.86914 3.19977V5.49756C2.03331 5.65308 1.4005 6.38619 1.40049 7.26709L1.40039 12.7996C1.40037 13.7937 2.20626 14.5997 3.20039 14.5997L6.62542 14.5997C6.63896 14.6006 6.65263 14.601 6.66641 14.601C6.68018 14.601 6.69385 14.6006 6.70739 14.5997L11.6256 14.5997C11.6391 14.6006 11.6527 14.601 11.6664 14.601C11.6801 14.601 11.6937 14.6006 11.7072 14.5997L12.7996 14.5997C13.7937 14.5997 14.5996 13.7938 14.5996 12.7997V7.26641C14.5996 6.38503 13.9662 5.65161 13.1297 5.4966V3.19844ZM11.0664 13.3997L7.26641 13.3997V12.3344C7.26641 12.1135 7.44549 11.9344 7.66641 11.9344H10.6664C10.8873 11.9344 11.0664 12.1135 11.0664 12.3344V13.3997ZM12.2664 12.3344V13.3997L12.7996 13.3997C13.131 13.3997 13.3996 13.1311 13.3996 12.7997V7.26641C13.3996 6.93502 13.131 6.66638 12.7996 6.66641L3.20044 6.66712C2.86909 6.66715 2.60049 6.93576 2.60049 7.26711L2.60039 12.7996C2.60038 13.131 2.86901 13.3997 3.20039 13.3997L6.06641 13.3997V12.3344C6.06641 11.4507 6.78275 10.7344 7.66641 10.7344H10.6664C11.5501 10.7344 12.2664 11.4507 12.2664 12.3344ZM11.9297 5.46647V3.19844C11.9297 2.86702 11.661 2.59837 11.3296 2.59844L4.66902 2.59977C4.3377 2.59984 4.06914 2.86845 4.06914 3.19977V5.46706L11.9297 5.46647Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, rc = pe(function(t, n) {
  return we(xe, Object.assign({}, t, {
    id: "print-icon",
    ref: n,
    icon: Rd
  }));
});
rc.displayName = "PrintIcon";
const Fd = {
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
      d: "M9.56665 3.30559C9.56665 1.97703 10.6437 0.900024 11.9722 0.900024C13.3008 0.900024 14.3778 1.97703 14.3778 3.30559C14.3778 4.63413 13.3008 5.71115 11.9722 5.71115C11.266 5.71115 10.6309 5.40684 10.1908 4.9222L6.31986 7.26747C6.39362 7.49845 6.43344 7.7446 6.43344 8.00004C6.43344 8.23219 6.40055 8.45665 6.33919 8.66903L10.2718 10.9928C10.7071 10.5578 11.3082 10.2888 11.9722 10.2888C13.3008 10.2888 14.3778 11.3658 14.3778 12.6944C14.3778 14.0229 13.3008 15.0999 11.9722 15.0999C10.6437 15.0999 9.56665 14.0229 9.56665 12.6944C9.56665 12.4623 9.59951 12.238 9.66082 12.0257L5.72811 9.70179C5.29284 10.1367 4.69176 10.4056 4.02788 10.4056C2.69933 10.4056 1.62231 9.32859 1.62231 8.00004C1.62231 6.6715 2.69933 5.59448 4.02788 5.59448C4.66781 5.59448 5.24938 5.84436 5.68034 6.25187L9.63052 3.8586C9.58875 3.68104 9.56665 3.49589 9.56665 3.30559ZM11.9722 2.10002C11.3064 2.10002 10.7667 2.63978 10.7667 3.30559C10.7667 3.97139 11.3064 4.51115 11.9722 4.51115C12.638 4.51115 13.1778 3.97139 13.1778 3.30559C13.1778 2.63978 12.638 2.10002 11.9722 2.10002ZM4.02788 6.79448C3.36207 6.79448 2.82231 7.33424 2.82231 8.00004C2.82231 8.66585 3.36207 9.20561 4.02788 9.20561C4.69368 9.20561 5.23344 8.66585 5.23344 8.00004C5.23344 7.33424 4.69368 6.79448 4.02788 6.79448ZM10.7667 12.6944C10.7667 12.0286 11.3064 11.4888 11.9722 11.4888C12.638 11.4888 13.1778 12.0286 13.1778 12.6944C13.1778 13.3602 12.638 13.8999 11.9722 13.8999C11.3064 13.8999 10.7667 13.3602 10.7667 12.6944Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, ic = pe(function(t, n) {
  return we(xe, Object.assign({}, t, {
    id: "share-icon",
    ref: n,
    icon: Fd
  }));
});
ic.displayName = "ShareIcon";
const Vd = {
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
      d: "M7.84425 13.276C7.84411 13.6256 7.5606 13.9089 7.211 13.9088L2.729 13.907C2.3796 13.9068 2.09639 13.6236 2.09625 13.2742L2.09454 8.78533C2.09441 8.43573 2.3777 8.15222 2.7273 8.15209C3.07689 8.15196 3.3604 8.43525 3.36054 8.78484L3.36166 11.7431L11.7467 3.35802L8.78851 3.35687C8.43891 3.35674 8.15562 3.07322 8.15575 2.72363C8.15589 2.37403 8.4394 2.09074 8.789 2.09088L13.271 2.09261C13.6204 2.09275 13.9036 2.37596 13.9037 2.72537L13.9055 7.2143C13.9056 7.56389 13.6223 7.84741 13.2727 7.84754C12.9231 7.84768 12.6396 7.56438 12.6395 7.21479L12.6383 4.2568L4.25353 12.6416L7.2115 12.6428C7.5611 12.6429 7.84439 12.9264 7.84425 13.276Z"
    }
  }]
}, oc = pe(function(t, n) {
  return we(xe, Object.assign({}, t, {
    id: "zen-icon",
    ref: n,
    icon: Vd
  }));
});
oc.displayName = "ZenIcon";
const Hd = {
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
      d: "M1.33362 7.97412C1.33362 7.69798 1.55748 7.47412 1.83362 7.47412L14.1664 7.47412C14.4425 7.47412 14.6664 7.69798 14.6664 7.97412C14.6664 8.25026 14.4425 8.47412 14.1664 8.47412L1.83362 8.47412C1.55748 8.47412 1.33362 8.25026 1.33362 7.97412Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, sc = pe(function(t, n) {
  return we(xe, Object.assign({}, t, {
    id: "zoom-reduce-icon",
    ref: n,
    icon: Hd
  }));
});
sc.displayName = "ZoomReduceIcon";
function de(e) {
  if (typeof e == "string" || typeof e == "number") return "" + e;
  let t = "";
  if (Array.isArray(e))
    for (let n = 0, r; n < e.length; n++)
      (r = de(e[n])) !== "" && (t += (t && " ") + r);
  else
    for (let n in e)
      e[n] && (t += (t && " ") + n);
  return t;
}
var zd = { value: () => {
} };
function tr() {
  for (var e = 0, t = arguments.length, n = {}, r; e < t; ++e) {
    if (!(r = arguments[e] + "") || r in n || /[\s.]/.test(r)) throw new Error("illegal type: " + r);
    n[r] = [];
  }
  return new In(n);
}
function In(e) {
  this._ = e;
}
function Bd(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var r = "", i = n.indexOf(".");
    if (i >= 0 && (r = n.slice(i + 1), n = n.slice(0, i)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: r };
  });
}
In.prototype = tr.prototype = {
  constructor: In,
  on: function(e, t) {
    var n = this._, r = Bd(e + "", n), i, o = -1, s = r.length;
    if (arguments.length < 2) {
      for (; ++o < s; ) if ((i = (e = r[o]).type) && (i = Ud(n[i], e.name))) return i;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++o < s; )
      if (i = (e = r[o]).type) n[i] = wo(n[i], e.name, t);
      else if (t == null) for (i in n) n[i] = wo(n[i], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new In(e);
  },
  call: function(e, t) {
    if ((i = arguments.length - 2) > 0) for (var n = new Array(i), r = 0, i, o; r < i; ++r) n[r] = arguments[r + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (o = this._[e], r = 0, i = o.length; r < i; ++r) o[r].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var r = this._[e], i = 0, o = r.length; i < o; ++i) r[i].value.apply(t, n);
  }
};
function Ud(e, t) {
  for (var n = 0, r = e.length, i; n < r; ++n)
    if ((i = e[n]).name === t)
      return i.value;
}
function wo(e, t, n) {
  for (var r = 0, i = e.length; r < i; ++r)
    if (e[r].name === t) {
      e[r] = zd, e = e.slice(0, r).concat(e.slice(r + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var Kr = "http://www.w3.org/1999/xhtml";
const xo = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Kr,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function nr(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), xo.hasOwnProperty(t) ? { space: xo[t], local: e } : e;
}
function Wd(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === Kr && t.documentElement.namespaceURI === Kr ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function Zd(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function cc(e) {
  var t = nr(e);
  return (t.local ? Zd : Wd)(t);
}
function Xd() {
}
function Hi(e) {
  return e == null ? Xd : function() {
    return this.querySelector(e);
  };
}
function Yd(e) {
  typeof e != "function" && (e = Hi(e));
  for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
    for (var o = t[i], s = o.length, c = r[i] = new Array(s), a, l, d = 0; d < s; ++d)
      (a = o[d]) && (l = e.call(a, a.__data__, d, o)) && ("__data__" in a && (l.__data__ = a.__data__), c[d] = l);
  return new Ie(r, this._parents);
}
function Gd(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function Kd() {
  return [];
}
function ac(e) {
  return e == null ? Kd : function() {
    return this.querySelectorAll(e);
  };
}
function qd(e) {
  return function() {
    return Gd(e.apply(this, arguments));
  };
}
function jd(e) {
  typeof e == "function" ? e = qd(e) : e = ac(e);
  for (var t = this._groups, n = t.length, r = [], i = [], o = 0; o < n; ++o)
    for (var s = t[o], c = s.length, a, l = 0; l < c; ++l)
      (a = s[l]) && (r.push(e.call(a, a.__data__, l, s)), i.push(a));
  return new Ie(r, i);
}
function lc(e) {
  return function() {
    return this.matches(e);
  };
}
function uc(e) {
  return function(t) {
    return t.matches(e);
  };
}
var Qd = Array.prototype.find;
function Jd(e) {
  return function() {
    return Qd.call(this.children, e);
  };
}
function eh() {
  return this.firstElementChild;
}
function th(e) {
  return this.select(e == null ? eh : Jd(typeof e == "function" ? e : uc(e)));
}
var nh = Array.prototype.filter;
function rh() {
  return Array.from(this.children);
}
function ih(e) {
  return function() {
    return nh.call(this.children, e);
  };
}
function oh(e) {
  return this.selectAll(e == null ? rh : ih(typeof e == "function" ? e : uc(e)));
}
function sh(e) {
  typeof e != "function" && (e = lc(e));
  for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
    for (var o = t[i], s = o.length, c = r[i] = [], a, l = 0; l < s; ++l)
      (a = o[l]) && e.call(a, a.__data__, l, o) && c.push(a);
  return new Ie(r, this._parents);
}
function fc(e) {
  return new Array(e.length);
}
function ch() {
  return new Ie(this._enter || this._groups.map(fc), this._parents);
}
function kn(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
kn.prototype = {
  constructor: kn,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function ah(e) {
  return function() {
    return e;
  };
}
function lh(e, t, n, r, i, o) {
  for (var s = 0, c, a = t.length, l = o.length; s < l; ++s)
    (c = t[s]) ? (c.__data__ = o[s], r[s] = c) : n[s] = new kn(e, o[s]);
  for (; s < a; ++s)
    (c = t[s]) && (i[s] = c);
}
function uh(e, t, n, r, i, o, s) {
  var c, a, l = /* @__PURE__ */ new Map(), d = t.length, u = o.length, f = new Array(d), g;
  for (c = 0; c < d; ++c)
    (a = t[c]) && (f[c] = g = s.call(a, a.__data__, c, t) + "", l.has(g) ? i[c] = a : l.set(g, a));
  for (c = 0; c < u; ++c)
    g = s.call(e, o[c], c, o) + "", (a = l.get(g)) ? (r[c] = a, a.__data__ = o[c], l.delete(g)) : n[c] = new kn(e, o[c]);
  for (c = 0; c < d; ++c)
    (a = t[c]) && l.get(f[c]) === a && (i[c] = a);
}
function fh(e) {
  return e.__data__;
}
function dh(e, t) {
  if (!arguments.length) return Array.from(this, fh);
  var n = t ? uh : lh, r = this._parents, i = this._groups;
  typeof e != "function" && (e = ah(e));
  for (var o = i.length, s = new Array(o), c = new Array(o), a = new Array(o), l = 0; l < o; ++l) {
    var d = r[l], u = i[l], f = u.length, g = hh(e.call(d, d && d.__data__, l, r)), p = g.length, h = c[l] = new Array(p), w = s[l] = new Array(p), y = a[l] = new Array(f);
    n(d, u, h, w, y, g, t);
    for (var C = 0, m = 0, v, _; C < p; ++C)
      if (v = h[C]) {
        for (C >= m && (m = C + 1); !(_ = w[m]) && ++m < p; ) ;
        v._next = _ || null;
      }
  }
  return s = new Ie(s, r), s._enter = c, s._exit = a, s;
}
function hh(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function gh() {
  return new Ie(this._exit || this._groups.map(fc), this._parents);
}
function ph(e, t, n) {
  var r = this.enter(), i = this, o = this.exit();
  return typeof e == "function" ? (r = e(r), r && (r = r.selection())) : r = r.append(e + ""), t != null && (i = t(i), i && (i = i.selection())), n == null ? o.remove() : n(o), r && i ? r.merge(i).order() : i;
}
function mh(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, r = t._groups, i = n.length, o = r.length, s = Math.min(i, o), c = new Array(i), a = 0; a < s; ++a)
    for (var l = n[a], d = r[a], u = l.length, f = c[a] = new Array(u), g, p = 0; p < u; ++p)
      (g = l[p] || d[p]) && (f[p] = g);
  for (; a < i; ++a)
    c[a] = n[a];
  return new Ie(c, this._parents);
}
function yh() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var r = e[t], i = r.length - 1, o = r[i], s; --i >= 0; )
      (s = r[i]) && (o && s.compareDocumentPosition(o) ^ 4 && o.parentNode.insertBefore(s, o), o = s);
  return this;
}
function vh(e) {
  e || (e = wh);
  function t(u, f) {
    return u && f ? e(u.__data__, f.__data__) : !u - !f;
  }
  for (var n = this._groups, r = n.length, i = new Array(r), o = 0; o < r; ++o) {
    for (var s = n[o], c = s.length, a = i[o] = new Array(c), l, d = 0; d < c; ++d)
      (l = s[d]) && (a[d] = l);
    a.sort(t);
  }
  return new Ie(i, this._parents).order();
}
function wh(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function xh() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function _h() {
  return Array.from(this);
}
function Ch() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], i = 0, o = r.length; i < o; ++i) {
      var s = r[i];
      if (s) return s;
    }
  return null;
}
function bh() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function Sh() {
  return !this.node();
}
function Nh(e) {
  for (var t = this._groups, n = 0, r = t.length; n < r; ++n)
    for (var i = t[n], o = 0, s = i.length, c; o < s; ++o)
      (c = i[o]) && e.call(c, c.__data__, o, i);
  return this;
}
function Eh(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Ih(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Mh(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Ah(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function Lh(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function $h(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function Th(e, t) {
  var n = nr(e);
  if (arguments.length < 2) {
    var r = this.node();
    return n.local ? r.getAttributeNS(n.space, n.local) : r.getAttribute(n);
  }
  return this.each((t == null ? n.local ? Ih : Eh : typeof t == "function" ? n.local ? $h : Lh : n.local ? Ah : Mh)(n, t));
}
function dc(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function kh(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Oh(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function Ph(e, t, n) {
  return function() {
    var r = t.apply(this, arguments);
    r == null ? this.style.removeProperty(e) : this.style.setProperty(e, r, n);
  };
}
function Dh(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? kh : typeof t == "function" ? Ph : Oh)(e, t, n == null ? "" : n)) : It(this.node(), e);
}
function It(e, t) {
  return e.style.getPropertyValue(t) || dc(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Rh(e) {
  return function() {
    delete this[e];
  };
}
function Fh(e, t) {
  return function() {
    this[e] = t;
  };
}
function Vh(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function Hh(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Rh : typeof t == "function" ? Vh : Fh)(e, t)) : this.node()[e];
}
function hc(e) {
  return e.trim().split(/^|\s+/);
}
function zi(e) {
  return e.classList || new gc(e);
}
function gc(e) {
  this._node = e, this._names = hc(e.getAttribute("class") || "");
}
gc.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function pc(e, t) {
  for (var n = zi(e), r = -1, i = t.length; ++r < i; ) n.add(t[r]);
}
function mc(e, t) {
  for (var n = zi(e), r = -1, i = t.length; ++r < i; ) n.remove(t[r]);
}
function zh(e) {
  return function() {
    pc(this, e);
  };
}
function Bh(e) {
  return function() {
    mc(this, e);
  };
}
function Uh(e, t) {
  return function() {
    (t.apply(this, arguments) ? pc : mc)(this, e);
  };
}
function Wh(e, t) {
  var n = hc(e + "");
  if (arguments.length < 2) {
    for (var r = zi(this.node()), i = -1, o = n.length; ++i < o; ) if (!r.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? Uh : t ? zh : Bh)(n, t));
}
function Zh() {
  this.textContent = "";
}
function Xh(e) {
  return function() {
    this.textContent = e;
  };
}
function Yh(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t == null ? "" : t;
  };
}
function Gh(e) {
  return arguments.length ? this.each(e == null ? Zh : (typeof e == "function" ? Yh : Xh)(e)) : this.node().textContent;
}
function Kh() {
  this.innerHTML = "";
}
function qh(e) {
  return function() {
    this.innerHTML = e;
  };
}
function jh(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t == null ? "" : t;
  };
}
function Qh(e) {
  return arguments.length ? this.each(e == null ? Kh : (typeof e == "function" ? jh : qh)(e)) : this.node().innerHTML;
}
function Jh() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function e0() {
  return this.each(Jh);
}
function t0() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function n0() {
  return this.each(t0);
}
function r0(e) {
  var t = typeof e == "function" ? e : cc(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function i0() {
  return null;
}
function o0(e, t) {
  var n = typeof e == "function" ? e : cc(e), r = t == null ? i0 : typeof t == "function" ? t : Hi(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), r.apply(this, arguments) || null);
  });
}
function s0() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function c0() {
  return this.each(s0);
}
function a0() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function l0() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function u0(e) {
  return this.select(e ? l0 : a0);
}
function f0(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function d0(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function h0(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", r = t.indexOf(".");
    return r >= 0 && (n = t.slice(r + 1), t = t.slice(0, r)), { type: t, name: n };
  });
}
function g0(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, r = -1, i = t.length, o; n < i; ++n)
        o = t[n], (!e.type || o.type === e.type) && o.name === e.name ? this.removeEventListener(o.type, o.listener, o.options) : t[++r] = o;
      ++r ? t.length = r : delete this.__on;
    }
  };
}
function p0(e, t, n) {
  return function() {
    var r = this.__on, i, o = d0(t);
    if (r) {
      for (var s = 0, c = r.length; s < c; ++s)
        if ((i = r[s]).type === e.type && i.name === e.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = o, i.options = n), i.value = t;
          return;
        }
    }
    this.addEventListener(e.type, o, n), i = { type: e.type, name: e.name, value: t, listener: o, options: n }, r ? r.push(i) : this.__on = [i];
  };
}
function m0(e, t, n) {
  var r = h0(e + ""), i, o = r.length, s;
  if (arguments.length < 2) {
    var c = this.node().__on;
    if (c) {
      for (var a = 0, l = c.length, d; a < l; ++a)
        for (i = 0, d = c[a]; i < o; ++i)
          if ((s = r[i]).type === d.type && s.name === d.name)
            return d.value;
    }
    return;
  }
  for (c = t ? p0 : g0, i = 0; i < o; ++i) this.each(c(r[i], t, n));
  return this;
}
function yc(e, t, n) {
  var r = dc(e), i = r.CustomEvent;
  typeof i == "function" ? i = new i(t, n) : (i = r.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function y0(e, t) {
  return function() {
    return yc(this, e, t);
  };
}
function v0(e, t) {
  return function() {
    return yc(this, e, t.apply(this, arguments));
  };
}
function w0(e, t) {
  return this.each((typeof t == "function" ? v0 : y0)(e, t));
}
function* x0() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var r = e[t], i = 0, o = r.length, s; i < o; ++i)
      (s = r[i]) && (yield s);
}
var vc = [null];
function Ie(e, t) {
  this._groups = e, this._parents = t;
}
function sn() {
  return new Ie([[document.documentElement]], vc);
}
function _0() {
  return this;
}
Ie.prototype = sn.prototype = {
  constructor: Ie,
  select: Yd,
  selectAll: jd,
  selectChild: th,
  selectChildren: oh,
  filter: sh,
  data: dh,
  enter: ch,
  exit: gh,
  join: ph,
  merge: mh,
  selection: _0,
  order: yh,
  sort: vh,
  call: xh,
  nodes: _h,
  node: Ch,
  size: bh,
  empty: Sh,
  each: Nh,
  attr: Th,
  style: Dh,
  property: Hh,
  classed: Wh,
  text: Gh,
  html: Qh,
  raise: e0,
  lower: n0,
  append: r0,
  insert: o0,
  remove: c0,
  clone: u0,
  datum: f0,
  on: m0,
  dispatch: w0,
  [Symbol.iterator]: x0
};
function Ne(e) {
  return typeof e == "string" ? new Ie([[document.querySelector(e)]], [document.documentElement]) : new Ie([[e]], vc);
}
function C0(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function Le(e, t) {
  if (e = C0(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var r = n.createSVGPoint();
      return r.x = e.clientX, r.y = e.clientY, r = r.matrixTransform(t.getScreenCTM().inverse()), [r.x, r.y];
    }
    if (t.getBoundingClientRect) {
      var i = t.getBoundingClientRect();
      return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const b0 = { passive: !1 }, Yt = { capture: !0, passive: !1 };
function Sr(e) {
  e.stopImmediatePropagation();
}
function bt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function wc(e) {
  var t = e.document.documentElement, n = Ne(e).on("dragstart.drag", bt, Yt);
  "onselectstart" in t ? n.on("selectstart.drag", bt, Yt) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function xc(e, t) {
  var n = e.document.documentElement, r = Ne(e).on("dragstart.drag", null);
  t && (r.on("click.drag", bt, Yt), setTimeout(function() {
    r.on("click.drag", null);
  }, 0)), "onselectstart" in n ? r.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const pn = (e) => () => e;
function qr(e, {
  sourceEvent: t,
  subject: n,
  target: r,
  identifier: i,
  active: o,
  x: s,
  y: c,
  dx: a,
  dy: l,
  dispatch: d
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: r, enumerable: !0, configurable: !0 },
    identifier: { value: i, enumerable: !0, configurable: !0 },
    active: { value: o, enumerable: !0, configurable: !0 },
    x: { value: s, enumerable: !0, configurable: !0 },
    y: { value: c, enumerable: !0, configurable: !0 },
    dx: { value: a, enumerable: !0, configurable: !0 },
    dy: { value: l, enumerable: !0, configurable: !0 },
    _: { value: d }
  });
}
qr.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function S0(e) {
  return !e.ctrlKey && !e.button;
}
function N0() {
  return this.parentNode;
}
function E0(e, t) {
  return t == null ? { x: e.x, y: e.y } : t;
}
function I0() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function _c() {
  var e = S0, t = N0, n = E0, r = I0, i = {}, o = tr("start", "drag", "end"), s = 0, c, a, l, d, u = 0;
  function f(v) {
    v.on("mousedown.drag", g).filter(r).on("touchstart.drag", w).on("touchmove.drag", y, b0).on("touchend.drag touchcancel.drag", C).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function g(v, _) {
    if (!(d || !e.call(this, v, _))) {
      var b = m(this, t.call(this, v, _), v, _, "mouse");
      b && (Ne(v.view).on("mousemove.drag", p, Yt).on("mouseup.drag", h, Yt), wc(v.view), Sr(v), l = !1, c = v.clientX, a = v.clientY, b("start", v));
    }
  }
  function p(v) {
    if (bt(v), !l) {
      var _ = v.clientX - c, b = v.clientY - a;
      l = _ * _ + b * b > u;
    }
    i.mouse("drag", v);
  }
  function h(v) {
    Ne(v.view).on("mousemove.drag mouseup.drag", null), xc(v.view, l), bt(v), i.mouse("end", v);
  }
  function w(v, _) {
    if (e.call(this, v, _)) {
      var b = v.changedTouches, M = t.call(this, v, _), L = b.length, $, V;
      for ($ = 0; $ < L; ++$)
        (V = m(this, M, v, _, b[$].identifier, b[$])) && (Sr(v), V("start", v, b[$]));
    }
  }
  function y(v) {
    var _ = v.changedTouches, b = _.length, M, L;
    for (M = 0; M < b; ++M)
      (L = i[_[M].identifier]) && (bt(v), L("drag", v, _[M]));
  }
  function C(v) {
    var _ = v.changedTouches, b = _.length, M, L;
    for (d && clearTimeout(d), d = setTimeout(function() {
      d = null;
    }, 500), M = 0; M < b; ++M)
      (L = i[_[M].identifier]) && (Sr(v), L("end", v, _[M]));
  }
  function m(v, _, b, M, L, $) {
    var V = o.copy(), k = Le($ || b, _), O, D, x;
    if ((x = n.call(v, new qr("beforestart", {
      sourceEvent: b,
      target: f,
      identifier: L,
      active: s,
      x: k[0],
      y: k[1],
      dx: 0,
      dy: 0,
      dispatch: V
    }), M)) != null)
      return O = x.x - k[0] || 0, D = x.y - k[1] || 0, function T(S, A, E) {
        var N = k, P;
        switch (S) {
          case "start":
            i[L] = T, P = s++;
            break;
          case "end":
            delete i[L], --s;
          // falls through
          case "drag":
            k = Le(E || A, _), P = s;
            break;
        }
        V.call(
          S,
          v,
          new qr(S, {
            sourceEvent: A,
            subject: x,
            target: f,
            identifier: L,
            active: P,
            x: k[0] + O,
            y: k[1] + D,
            dx: k[0] - N[0],
            dy: k[1] - N[1],
            dispatch: V
          }),
          M
        );
      };
  }
  return f.filter = function(v) {
    return arguments.length ? (e = typeof v == "function" ? v : pn(!!v), f) : e;
  }, f.container = function(v) {
    return arguments.length ? (t = typeof v == "function" ? v : pn(v), f) : t;
  }, f.subject = function(v) {
    return arguments.length ? (n = typeof v == "function" ? v : pn(v), f) : n;
  }, f.touchable = function(v) {
    return arguments.length ? (r = typeof v == "function" ? v : pn(!!v), f) : r;
  }, f.on = function() {
    var v = o.on.apply(o, arguments);
    return v === o ? f : v;
  }, f.clickDistance = function(v) {
    return arguments.length ? (u = (v = +v) * v, f) : Math.sqrt(u);
  }, f;
}
function Bi(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Cc(e, t) {
  var n = Object.create(e.prototype);
  for (var r in t) n[r] = t[r];
  return n;
}
function cn() {
}
var Gt = 0.7, On = 1 / Gt, St = "\\s*([+-]?\\d+)\\s*", Kt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", Ve = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", M0 = /^#([0-9a-f]{3,8})$/, A0 = new RegExp(`^rgb\\(${St},${St},${St}\\)$`), L0 = new RegExp(`^rgb\\(${Ve},${Ve},${Ve}\\)$`), $0 = new RegExp(`^rgba\\(${St},${St},${St},${Kt}\\)$`), T0 = new RegExp(`^rgba\\(${Ve},${Ve},${Ve},${Kt}\\)$`), k0 = new RegExp(`^hsl\\(${Kt},${Ve},${Ve}\\)$`), O0 = new RegExp(`^hsla\\(${Kt},${Ve},${Ve},${Kt}\\)$`), _o = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Bi(cn, dt, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Co,
  // Deprecated! Use color.formatHex.
  formatHex: Co,
  formatHex8: P0,
  formatHsl: D0,
  formatRgb: bo,
  toString: bo
});
function Co() {
  return this.rgb().formatHex();
}
function P0() {
  return this.rgb().formatHex8();
}
function D0() {
  return bc(this).formatHsl();
}
function bo() {
  return this.rgb().formatRgb();
}
function dt(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = M0.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? So(t) : n === 3 ? new Ce(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? mn(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? mn(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = A0.exec(e)) ? new Ce(t[1], t[2], t[3], 1) : (t = L0.exec(e)) ? new Ce(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = $0.exec(e)) ? mn(t[1], t[2], t[3], t[4]) : (t = T0.exec(e)) ? mn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = k0.exec(e)) ? Io(t[1], t[2] / 100, t[3] / 100, 1) : (t = O0.exec(e)) ? Io(t[1], t[2] / 100, t[3] / 100, t[4]) : _o.hasOwnProperty(e) ? So(_o[e]) : e === "transparent" ? new Ce(NaN, NaN, NaN, 0) : null;
}
function So(e) {
  return new Ce(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function mn(e, t, n, r) {
  return r <= 0 && (e = t = n = NaN), new Ce(e, t, n, r);
}
function R0(e) {
  return e instanceof cn || (e = dt(e)), e ? (e = e.rgb(), new Ce(e.r, e.g, e.b, e.opacity)) : new Ce();
}
function jr(e, t, n, r) {
  return arguments.length === 1 ? R0(e) : new Ce(e, t, n, r == null ? 1 : r);
}
function Ce(e, t, n, r) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +r;
}
Bi(Ce, jr, Cc(cn, {
  brighter(e) {
    return e = e == null ? On : Math.pow(On, e), new Ce(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Gt : Math.pow(Gt, e), new Ce(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Ce(ut(this.r), ut(this.g), ut(this.b), Pn(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: No,
  // Deprecated! Use color.formatHex.
  formatHex: No,
  formatHex8: F0,
  formatRgb: Eo,
  toString: Eo
}));
function No() {
  return `#${st(this.r)}${st(this.g)}${st(this.b)}`;
}
function F0() {
  return `#${st(this.r)}${st(this.g)}${st(this.b)}${st((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Eo() {
  const e = Pn(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${ut(this.r)}, ${ut(this.g)}, ${ut(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Pn(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function ut(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function st(e) {
  return e = ut(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Io(e, t, n, r) {
  return r <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new $e(e, t, n, r);
}
function bc(e) {
  if (e instanceof $e) return new $e(e.h, e.s, e.l, e.opacity);
  if (e instanceof cn || (e = dt(e)), !e) return new $e();
  if (e instanceof $e) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, r = e.b / 255, i = Math.min(t, n, r), o = Math.max(t, n, r), s = NaN, c = o - i, a = (o + i) / 2;
  return c ? (t === o ? s = (n - r) / c + (n < r) * 6 : n === o ? s = (r - t) / c + 2 : s = (t - n) / c + 4, c /= a < 0.5 ? o + i : 2 - o - i, s *= 60) : c = a > 0 && a < 1 ? 0 : s, new $e(s, c, a, e.opacity);
}
function V0(e, t, n, r) {
  return arguments.length === 1 ? bc(e) : new $e(e, t, n, r == null ? 1 : r);
}
function $e(e, t, n, r) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +r;
}
Bi($e, V0, Cc(cn, {
  brighter(e) {
    return e = e == null ? On : Math.pow(On, e), new $e(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Gt : Math.pow(Gt, e), new $e(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, r = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - r;
    return new Ce(
      Nr(e >= 240 ? e - 240 : e + 120, i, r),
      Nr(e, i, r),
      Nr(e < 120 ? e + 240 : e - 120, i, r),
      this.opacity
    );
  },
  clamp() {
    return new $e(Mo(this.h), yn(this.s), yn(this.l), Pn(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Pn(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Mo(this.h)}, ${yn(this.s) * 100}%, ${yn(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Mo(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function yn(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Nr(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Ui = (e) => () => e;
function H0(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function z0(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(r) {
    return Math.pow(e + r * t, n);
  };
}
function B0(e) {
  return (e = +e) == 1 ? Sc : function(t, n) {
    return n - t ? z0(t, n, e) : Ui(isNaN(t) ? n : t);
  };
}
function Sc(e, t) {
  var n = t - e;
  return n ? H0(e, n) : Ui(isNaN(e) ? t : e);
}
const Dn = (function e(t) {
  var n = B0(t);
  function r(i, o) {
    var s = n((i = jr(i)).r, (o = jr(o)).r), c = n(i.g, o.g), a = n(i.b, o.b), l = Sc(i.opacity, o.opacity);
    return function(d) {
      return i.r = s(d), i.g = c(d), i.b = a(d), i.opacity = l(d), i + "";
    };
  }
  return r.gamma = e, r;
})(1);
function U0(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, r = t.slice(), i;
  return function(o) {
    for (i = 0; i < n; ++i) r[i] = e[i] * (1 - o) + t[i] * o;
    return r;
  };
}
function W0(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Z0(e, t) {
  var n = t ? t.length : 0, r = e ? Math.min(n, e.length) : 0, i = new Array(r), o = new Array(n), s;
  for (s = 0; s < r; ++s) i[s] = Wt(e[s], t[s]);
  for (; s < n; ++s) o[s] = t[s];
  return function(c) {
    for (s = 0; s < r; ++s) o[s] = i[s](c);
    return o;
  };
}
function X0(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(r) {
    return n.setTime(e * (1 - r) + t * r), n;
  };
}
function Fe(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function Y0(e, t) {
  var n = {}, r = {}, i;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (i in t)
    i in e ? n[i] = Wt(e[i], t[i]) : r[i] = t[i];
  return function(o) {
    for (i in n) r[i] = n[i](o);
    return r;
  };
}
var Qr = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Er = new RegExp(Qr.source, "g");
function G0(e) {
  return function() {
    return e;
  };
}
function K0(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Nc(e, t) {
  var n = Qr.lastIndex = Er.lastIndex = 0, r, i, o, s = -1, c = [], a = [];
  for (e = e + "", t = t + ""; (r = Qr.exec(e)) && (i = Er.exec(t)); )
    (o = i.index) > n && (o = t.slice(n, o), c[s] ? c[s] += o : c[++s] = o), (r = r[0]) === (i = i[0]) ? c[s] ? c[s] += i : c[++s] = i : (c[++s] = null, a.push({ i: s, x: Fe(r, i) })), n = Er.lastIndex;
  return n < t.length && (o = t.slice(n), c[s] ? c[s] += o : c[++s] = o), c.length < 2 ? a[0] ? K0(a[0].x) : G0(t) : (t = a.length, function(l) {
    for (var d = 0, u; d < t; ++d) c[(u = a[d]).i] = u.x(l);
    return c.join("");
  });
}
function Wt(e, t) {
  var n = typeof t, r;
  return t == null || n === "boolean" ? Ui(t) : (n === "number" ? Fe : n === "string" ? (r = dt(t)) ? (t = r, Dn) : Nc : t instanceof dt ? Dn : t instanceof Date ? X0 : W0(t) ? U0 : Array.isArray(t) ? Z0 : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Y0 : Fe)(e, t);
}
var Ao = 180 / Math.PI, Jr = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Ec(e, t, n, r, i, o) {
  var s, c, a;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (a = e * n + t * r) && (n -= e * a, r -= t * a), (c = Math.sqrt(n * n + r * r)) && (n /= c, r /= c, a /= c), e * r < t * n && (e = -e, t = -t, a = -a, s = -s), {
    translateX: i,
    translateY: o,
    rotate: Math.atan2(t, e) * Ao,
    skewX: Math.atan(a) * Ao,
    scaleX: s,
    scaleY: c
  };
}
var vn;
function q0(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? Jr : Ec(t.a, t.b, t.c, t.d, t.e, t.f);
}
function j0(e) {
  return e == null || (vn || (vn = document.createElementNS("http://www.w3.org/2000/svg", "g")), vn.setAttribute("transform", e), !(e = vn.transform.baseVal.consolidate())) ? Jr : (e = e.matrix, Ec(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Ic(e, t, n, r) {
  function i(l) {
    return l.length ? l.pop() + " " : "";
  }
  function o(l, d, u, f, g, p) {
    if (l !== u || d !== f) {
      var h = g.push("translate(", null, t, null, n);
      p.push({ i: h - 4, x: Fe(l, u) }, { i: h - 2, x: Fe(d, f) });
    } else (u || f) && g.push("translate(" + u + t + f + n);
  }
  function s(l, d, u, f) {
    l !== d ? (l - d > 180 ? d += 360 : d - l > 180 && (l += 360), f.push({ i: u.push(i(u) + "rotate(", null, r) - 2, x: Fe(l, d) })) : d && u.push(i(u) + "rotate(" + d + r);
  }
  function c(l, d, u, f) {
    l !== d ? f.push({ i: u.push(i(u) + "skewX(", null, r) - 2, x: Fe(l, d) }) : d && u.push(i(u) + "skewX(" + d + r);
  }
  function a(l, d, u, f, g, p) {
    if (l !== u || d !== f) {
      var h = g.push(i(g) + "scale(", null, ",", null, ")");
      p.push({ i: h - 4, x: Fe(l, u) }, { i: h - 2, x: Fe(d, f) });
    } else (u !== 1 || f !== 1) && g.push(i(g) + "scale(" + u + "," + f + ")");
  }
  return function(l, d) {
    var u = [], f = [];
    return l = e(l), d = e(d), o(l.translateX, l.translateY, d.translateX, d.translateY, u, f), s(l.rotate, d.rotate, u, f), c(l.skewX, d.skewX, u, f), a(l.scaleX, l.scaleY, d.scaleX, d.scaleY, u, f), l = d = null, function(g) {
      for (var p = -1, h = f.length, w; ++p < h; ) u[(w = f[p]).i] = w.x(g);
      return u.join("");
    };
  };
}
var Q0 = Ic(q0, "px, ", "px)", "deg)"), J0 = Ic(j0, ", ", ")", ")"), e1 = 1e-12;
function Lo(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function t1(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function n1(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const Mn = (function e(t, n, r) {
  function i(o, s) {
    var c = o[0], a = o[1], l = o[2], d = s[0], u = s[1], f = s[2], g = d - c, p = u - a, h = g * g + p * p, w, y;
    if (h < e1)
      y = Math.log(f / l) / t, w = function(M) {
        return [
          c + M * g,
          a + M * p,
          l * Math.exp(t * M * y)
        ];
      };
    else {
      var C = Math.sqrt(h), m = (f * f - l * l + r * h) / (2 * l * n * C), v = (f * f - l * l - r * h) / (2 * f * n * C), _ = Math.log(Math.sqrt(m * m + 1) - m), b = Math.log(Math.sqrt(v * v + 1) - v);
      y = (b - _) / t, w = function(M) {
        var L = M * y, $ = Lo(_), V = l / (n * C) * ($ * n1(t * L + _) - t1(_));
        return [
          c + V * g,
          a + V * p,
          l * $ / Lo(t * L + _)
        ];
      };
    }
    return w.duration = y * 1e3 * t / Math.SQRT2, w;
  }
  return i.rho = function(o) {
    var s = Math.max(1e-3, +o), c = s * s, a = c * c;
    return e(s, c, a);
  }, i;
})(Math.SQRT2, 2, 4);
var Mt = 0, Bt = 0, Vt = 0, Mc = 1e3, Rn, Ut, Fn = 0, ht = 0, rr = 0, qt = typeof performance == "object" && performance.now ? performance : Date, Ac = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Wi() {
  return ht || (Ac(r1), ht = qt.now() + rr);
}
function r1() {
  ht = 0;
}
function Vn() {
  this._call = this._time = this._next = null;
}
Vn.prototype = Lc.prototype = {
  constructor: Vn,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Wi() : +n) + (t == null ? 0 : +t), !this._next && Ut !== this && (Ut ? Ut._next = this : Rn = this, Ut = this), this._call = e, this._time = n, ei();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, ei());
  }
};
function Lc(e, t, n) {
  var r = new Vn();
  return r.restart(e, t, n), r;
}
function i1() {
  Wi(), ++Mt;
  for (var e = Rn, t; e; )
    (t = ht - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --Mt;
}
function $o() {
  ht = (Fn = qt.now()) + rr, Mt = Bt = 0;
  try {
    i1();
  } finally {
    Mt = 0, s1(), ht = 0;
  }
}
function o1() {
  var e = qt.now(), t = e - Fn;
  t > Mc && (rr -= t, Fn = e);
}
function s1() {
  for (var e, t = Rn, n, r = 1 / 0; t; )
    t._call ? (r > t._time && (r = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : Rn = n);
  Ut = e, ei(r);
}
function ei(e) {
  if (!Mt) {
    Bt && (Bt = clearTimeout(Bt));
    var t = e - ht;
    t > 24 ? (e < 1 / 0 && (Bt = setTimeout($o, e - qt.now() - rr)), Vt && (Vt = clearInterval(Vt))) : (Vt || (Fn = qt.now(), Vt = setInterval(o1, Mc)), Mt = 1, Ac($o));
  }
}
function To(e, t, n) {
  var r = new Vn();
  return t = t == null ? 0 : +t, r.restart((i) => {
    r.stop(), e(i + t);
  }, t, n), r;
}
var c1 = tr("start", "end", "cancel", "interrupt"), a1 = [], $c = 0, ko = 1, ti = 2, An = 3, Oo = 4, ni = 5, Ln = 6;
function ir(e, t, n, r, i, o) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  l1(e, n, {
    name: t,
    index: r,
    // For context during callback.
    group: i,
    // For context during callback.
    on: c1,
    tween: a1,
    time: o.time,
    delay: o.delay,
    duration: o.duration,
    ease: o.ease,
    timer: null,
    state: $c
  });
}
function Zi(e, t) {
  var n = Re(e, t);
  if (n.state > $c) throw new Error("too late; already scheduled");
  return n;
}
function We(e, t) {
  var n = Re(e, t);
  if (n.state > An) throw new Error("too late; already running");
  return n;
}
function Re(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function l1(e, t, n) {
  var r = e.__transition, i;
  r[t] = n, n.timer = Lc(o, 0, n.time);
  function o(l) {
    n.state = ko, n.timer.restart(s, n.delay, n.time), n.delay <= l && s(l - n.delay);
  }
  function s(l) {
    var d, u, f, g;
    if (n.state !== ko) return a();
    for (d in r)
      if (g = r[d], g.name === n.name) {
        if (g.state === An) return To(s);
        g.state === Oo ? (g.state = Ln, g.timer.stop(), g.on.call("interrupt", e, e.__data__, g.index, g.group), delete r[d]) : +d < t && (g.state = Ln, g.timer.stop(), g.on.call("cancel", e, e.__data__, g.index, g.group), delete r[d]);
      }
    if (To(function() {
      n.state === An && (n.state = Oo, n.timer.restart(c, n.delay, n.time), c(l));
    }), n.state = ti, n.on.call("start", e, e.__data__, n.index, n.group), n.state === ti) {
      for (n.state = An, i = new Array(f = n.tween.length), d = 0, u = -1; d < f; ++d)
        (g = n.tween[d].value.call(e, e.__data__, n.index, n.group)) && (i[++u] = g);
      i.length = u + 1;
    }
  }
  function c(l) {
    for (var d = l < n.duration ? n.ease.call(null, l / n.duration) : (n.timer.restart(a), n.state = ni, 1), u = -1, f = i.length; ++u < f; )
      i[u].call(e, d);
    n.state === ni && (n.on.call("end", e, e.__data__, n.index, n.group), a());
  }
  function a() {
    n.state = Ln, n.timer.stop(), delete r[t];
    for (var l in r) return;
    delete e.__transition;
  }
}
function $n(e, t) {
  var n = e.__transition, r, i, o = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((r = n[s]).name !== t) {
        o = !1;
        continue;
      }
      i = r.state > ti && r.state < ni, r.state = Ln, r.timer.stop(), r.on.call(i ? "interrupt" : "cancel", e, e.__data__, r.index, r.group), delete n[s];
    }
    o && delete e.__transition;
  }
}
function u1(e) {
  return this.each(function() {
    $n(this, e);
  });
}
function f1(e, t) {
  var n, r;
  return function() {
    var i = We(this, e), o = i.tween;
    if (o !== n) {
      r = n = o;
      for (var s = 0, c = r.length; s < c; ++s)
        if (r[s].name === t) {
          r = r.slice(), r.splice(s, 1);
          break;
        }
    }
    i.tween = r;
  };
}
function d1(e, t, n) {
  var r, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var o = We(this, e), s = o.tween;
    if (s !== r) {
      i = (r = s).slice();
      for (var c = { name: t, value: n }, a = 0, l = i.length; a < l; ++a)
        if (i[a].name === t) {
          i[a] = c;
          break;
        }
      a === l && i.push(c);
    }
    o.tween = i;
  };
}
function h1(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var r = Re(this.node(), n).tween, i = 0, o = r.length, s; i < o; ++i)
      if ((s = r[i]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? f1 : d1)(n, e, t));
}
function Xi(e, t, n) {
  var r = e._id;
  return e.each(function() {
    var i = We(this, r);
    (i.value || (i.value = {}))[t] = n.apply(this, arguments);
  }), function(i) {
    return Re(i, r).value[t];
  };
}
function Tc(e, t) {
  var n;
  return (typeof t == "number" ? Fe : t instanceof dt ? Dn : (n = dt(t)) ? (t = n, Dn) : Nc)(e, t);
}
function g1(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function p1(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function m1(e, t, n) {
  var r, i = n + "", o;
  return function() {
    var s = this.getAttribute(e);
    return s === i ? null : s === r ? o : o = t(r = s, n);
  };
}
function y1(e, t, n) {
  var r, i = n + "", o;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === i ? null : s === r ? o : o = t(r = s, n);
  };
}
function v1(e, t, n) {
  var r, i, o;
  return function() {
    var s, c = n(this), a;
    return c == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), a = c + "", s === a ? null : s === r && a === i ? o : (i = a, o = t(r = s, c)));
  };
}
function w1(e, t, n) {
  var r, i, o;
  return function() {
    var s, c = n(this), a;
    return c == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), a = c + "", s === a ? null : s === r && a === i ? o : (i = a, o = t(r = s, c)));
  };
}
function x1(e, t) {
  var n = nr(e), r = n === "transform" ? J0 : Tc;
  return this.attrTween(e, typeof t == "function" ? (n.local ? w1 : v1)(n, r, Xi(this, "attr." + e, t)) : t == null ? (n.local ? p1 : g1)(n) : (n.local ? y1 : m1)(n, r, t));
}
function _1(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function C1(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function b1(e, t) {
  var n, r;
  function i() {
    var o = t.apply(this, arguments);
    return o !== r && (n = (r = o) && C1(e, o)), n;
  }
  return i._value = t, i;
}
function S1(e, t) {
  var n, r;
  function i() {
    var o = t.apply(this, arguments);
    return o !== r && (n = (r = o) && _1(e, o)), n;
  }
  return i._value = t, i;
}
function N1(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var r = nr(e);
  return this.tween(n, (r.local ? b1 : S1)(r, t));
}
function E1(e, t) {
  return function() {
    Zi(this, e).delay = +t.apply(this, arguments);
  };
}
function I1(e, t) {
  return t = +t, function() {
    Zi(this, e).delay = t;
  };
}
function M1(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? E1 : I1)(t, e)) : Re(this.node(), t).delay;
}
function A1(e, t) {
  return function() {
    We(this, e).duration = +t.apply(this, arguments);
  };
}
function L1(e, t) {
  return t = +t, function() {
    We(this, e).duration = t;
  };
}
function $1(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? A1 : L1)(t, e)) : Re(this.node(), t).duration;
}
function T1(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    We(this, e).ease = t;
  };
}
function k1(e) {
  var t = this._id;
  return arguments.length ? this.each(T1(t, e)) : Re(this.node(), t).ease;
}
function O1(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    We(this, e).ease = n;
  };
}
function P1(e) {
  if (typeof e != "function") throw new Error();
  return this.each(O1(this._id, e));
}
function D1(e) {
  typeof e != "function" && (e = lc(e));
  for (var t = this._groups, n = t.length, r = new Array(n), i = 0; i < n; ++i)
    for (var o = t[i], s = o.length, c = r[i] = [], a, l = 0; l < s; ++l)
      (a = o[l]) && e.call(a, a.__data__, l, o) && c.push(a);
  return new Ye(r, this._parents, this._name, this._id);
}
function R1(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, r = t.length, i = n.length, o = Math.min(r, i), s = new Array(r), c = 0; c < o; ++c)
    for (var a = t[c], l = n[c], d = a.length, u = s[c] = new Array(d), f, g = 0; g < d; ++g)
      (f = a[g] || l[g]) && (u[g] = f);
  for (; c < r; ++c)
    s[c] = t[c];
  return new Ye(s, this._parents, this._name, this._id);
}
function F1(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function V1(e, t, n) {
  var r, i, o = F1(t) ? Zi : We;
  return function() {
    var s = o(this, e), c = s.on;
    c !== r && (i = (r = c).copy()).on(t, n), s.on = i;
  };
}
function H1(e, t) {
  var n = this._id;
  return arguments.length < 2 ? Re(this.node(), n).on.on(e) : this.each(V1(n, e, t));
}
function z1(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function B1() {
  return this.on("end.remove", z1(this._id));
}
function U1(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Hi(e));
  for (var r = this._groups, i = r.length, o = new Array(i), s = 0; s < i; ++s)
    for (var c = r[s], a = c.length, l = o[s] = new Array(a), d, u, f = 0; f < a; ++f)
      (d = c[f]) && (u = e.call(d, d.__data__, f, c)) && ("__data__" in d && (u.__data__ = d.__data__), l[f] = u, ir(l[f], t, n, f, l, Re(d, n)));
  return new Ye(o, this._parents, t, n);
}
function W1(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = ac(e));
  for (var r = this._groups, i = r.length, o = [], s = [], c = 0; c < i; ++c)
    for (var a = r[c], l = a.length, d, u = 0; u < l; ++u)
      if (d = a[u]) {
        for (var f = e.call(d, d.__data__, u, a), g, p = Re(d, n), h = 0, w = f.length; h < w; ++h)
          (g = f[h]) && ir(g, t, n, h, f, p);
        o.push(f), s.push(d);
      }
  return new Ye(o, s, t, n);
}
var Z1 = sn.prototype.constructor;
function X1() {
  return new Z1(this._groups, this._parents);
}
function Y1(e, t) {
  var n, r, i;
  return function() {
    var o = It(this, e), s = (this.style.removeProperty(e), It(this, e));
    return o === s ? null : o === n && s === r ? i : i = t(n = o, r = s);
  };
}
function kc(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function G1(e, t, n) {
  var r, i = n + "", o;
  return function() {
    var s = It(this, e);
    return s === i ? null : s === r ? o : o = t(r = s, n);
  };
}
function K1(e, t, n) {
  var r, i, o;
  return function() {
    var s = It(this, e), c = n(this), a = c + "";
    return c == null && (a = c = (this.style.removeProperty(e), It(this, e))), s === a ? null : s === r && a === i ? o : (i = a, o = t(r = s, c));
  };
}
function q1(e, t) {
  var n, r, i, o = "style." + t, s = "end." + o, c;
  return function() {
    var a = We(this, e), l = a.on, d = a.value[o] == null ? c || (c = kc(t)) : void 0;
    (l !== n || i !== d) && (r = (n = l).copy()).on(s, i = d), a.on = r;
  };
}
function j1(e, t, n) {
  var r = (e += "") == "transform" ? Q0 : Tc;
  return t == null ? this.styleTween(e, Y1(e, r)).on("end.style." + e, kc(e)) : typeof t == "function" ? this.styleTween(e, K1(e, r, Xi(this, "style." + e, t))).each(q1(this._id, e)) : this.styleTween(e, G1(e, r, t), n).on("end.style." + e, null);
}
function Q1(e, t, n) {
  return function(r) {
    this.style.setProperty(e, t.call(this, r), n);
  };
}
function J1(e, t, n) {
  var r, i;
  function o() {
    var s = t.apply(this, arguments);
    return s !== i && (r = (i = s) && Q1(e, s, n)), r;
  }
  return o._value = t, o;
}
function eg(e, t, n) {
  var r = "style." + (e += "");
  if (arguments.length < 2) return (r = this.tween(r)) && r._value;
  if (t == null) return this.tween(r, null);
  if (typeof t != "function") throw new Error();
  return this.tween(r, J1(e, t, n == null ? "" : n));
}
function tg(e) {
  return function() {
    this.textContent = e;
  };
}
function ng(e) {
  return function() {
    var t = e(this);
    this.textContent = t == null ? "" : t;
  };
}
function rg(e) {
  return this.tween("text", typeof e == "function" ? ng(Xi(this, "text", e)) : tg(e == null ? "" : e + ""));
}
function ig(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function og(e) {
  var t, n;
  function r() {
    var i = e.apply(this, arguments);
    return i !== n && (t = (n = i) && ig(i)), t;
  }
  return r._value = e, r;
}
function sg(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, og(e));
}
function cg() {
  for (var e = this._name, t = this._id, n = Oc(), r = this._groups, i = r.length, o = 0; o < i; ++o)
    for (var s = r[o], c = s.length, a, l = 0; l < c; ++l)
      if (a = s[l]) {
        var d = Re(a, t);
        ir(a, e, n, l, s, {
          time: d.time + d.delay + d.duration,
          delay: 0,
          duration: d.duration,
          ease: d.ease
        });
      }
  return new Ye(r, this._parents, e, n);
}
function ag() {
  var e, t, n = this, r = n._id, i = n.size();
  return new Promise(function(o, s) {
    var c = { value: s }, a = { value: function() {
      --i === 0 && o();
    } };
    n.each(function() {
      var l = We(this, r), d = l.on;
      d !== e && (t = (e = d).copy(), t._.cancel.push(c), t._.interrupt.push(c), t._.end.push(a)), l.on = t;
    }), i === 0 && o();
  });
}
var lg = 0;
function Ye(e, t, n, r) {
  this._groups = e, this._parents = t, this._name = n, this._id = r;
}
function Oc() {
  return ++lg;
}
var Ze = sn.prototype;
Ye.prototype = {
  constructor: Ye,
  select: U1,
  selectAll: W1,
  selectChild: Ze.selectChild,
  selectChildren: Ze.selectChildren,
  filter: D1,
  merge: R1,
  selection: X1,
  transition: cg,
  call: Ze.call,
  nodes: Ze.nodes,
  node: Ze.node,
  size: Ze.size,
  empty: Ze.empty,
  each: Ze.each,
  on: H1,
  attr: x1,
  attrTween: N1,
  style: j1,
  styleTween: eg,
  text: rg,
  textTween: sg,
  remove: B1,
  tween: h1,
  delay: M1,
  duration: $1,
  ease: k1,
  easeVarying: P1,
  end: ag,
  [Symbol.iterator]: Ze[Symbol.iterator]
};
function ug(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var fg = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: ug
};
function dg(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function hg(e) {
  var t, n;
  e instanceof Ye ? (t = e._id, e = e._name) : (t = Oc(), (n = fg).time = Wi(), e = e == null ? null : e + "");
  for (var r = this._groups, i = r.length, o = 0; o < i; ++o)
    for (var s = r[o], c = s.length, a, l = 0; l < c; ++l)
      (a = s[l]) && ir(a, e, t, l, s, n || dg(a, t));
  return new Ye(r, this._parents, e, t);
}
sn.prototype.interrupt = u1;
sn.prototype.transition = hg;
const wn = (e) => () => e;
function gg(e, {
  sourceEvent: t,
  target: n,
  transform: r,
  dispatch: i
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: r, enumerable: !0, configurable: !0 },
    _: { value: i }
  });
}
function Xe(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
Xe.prototype = {
  constructor: Xe,
  scale: function(e) {
    return e === 1 ? this : new Xe(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new Xe(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var or = new Xe(1, 0, 0);
Pc.prototype = Xe.prototype;
function Pc(e) {
  for (; !e.__zoom; ) if (!(e = e.parentNode)) return or;
  return e.__zoom;
}
function Ir(e) {
  e.stopImmediatePropagation();
}
function Ht(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function pg(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function mg() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function Po() {
  return this.__zoom || or;
}
function yg(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function vg() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function wg(e, t, n) {
  var r = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], o = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    i > r ? (r + i) / 2 : Math.min(0, r) || Math.max(0, i),
    s > o ? (o + s) / 2 : Math.min(0, o) || Math.max(0, s)
  );
}
function Dc() {
  var e = pg, t = mg, n = wg, r = yg, i = vg, o = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], c = 250, a = Mn, l = tr("start", "zoom", "end"), d, u, f, g = 500, p = 150, h = 0, w = 10;
  function y(x) {
    x.property("__zoom", Po).on("wheel.zoom", L, { passive: !1 }).on("mousedown.zoom", $).on("dblclick.zoom", V).filter(i).on("touchstart.zoom", k).on("touchmove.zoom", O).on("touchend.zoom touchcancel.zoom", D).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  y.transform = function(x, T, S, A) {
    var E = x.selection ? x.selection() : x;
    E.property("__zoom", Po), x !== E ? _(x, T, S, A) : E.interrupt().each(function() {
      b(this, arguments).event(A).start().zoom(null, typeof T == "function" ? T.apply(this, arguments) : T).end();
    });
  }, y.scaleBy = function(x, T, S, A) {
    y.scaleTo(x, function() {
      var E = this.__zoom.k, N = typeof T == "function" ? T.apply(this, arguments) : T;
      return E * N;
    }, S, A);
  }, y.scaleTo = function(x, T, S, A) {
    y.transform(x, function() {
      var E = t.apply(this, arguments), N = this.__zoom, P = S == null ? v(E) : typeof S == "function" ? S.apply(this, arguments) : S, R = N.invert(P), F = typeof T == "function" ? T.apply(this, arguments) : T;
      return n(m(C(N, F), P, R), E, s);
    }, S, A);
  }, y.translateBy = function(x, T, S, A) {
    y.transform(x, function() {
      return n(this.__zoom.translate(
        typeof T == "function" ? T.apply(this, arguments) : T,
        typeof S == "function" ? S.apply(this, arguments) : S
      ), t.apply(this, arguments), s);
    }, null, A);
  }, y.translateTo = function(x, T, S, A, E) {
    y.transform(x, function() {
      var N = t.apply(this, arguments), P = this.__zoom, R = A == null ? v(N) : typeof A == "function" ? A.apply(this, arguments) : A;
      return n(or.translate(R[0], R[1]).scale(P.k).translate(
        typeof T == "function" ? -T.apply(this, arguments) : -T,
        typeof S == "function" ? -S.apply(this, arguments) : -S
      ), N, s);
    }, A, E);
  };
  function C(x, T) {
    return T = Math.max(o[0], Math.min(o[1], T)), T === x.k ? x : new Xe(T, x.x, x.y);
  }
  function m(x, T, S) {
    var A = T[0] - S[0] * x.k, E = T[1] - S[1] * x.k;
    return A === x.x && E === x.y ? x : new Xe(x.k, A, E);
  }
  function v(x) {
    return [(+x[0][0] + +x[1][0]) / 2, (+x[0][1] + +x[1][1]) / 2];
  }
  function _(x, T, S, A) {
    x.on("start.zoom", function() {
      b(this, arguments).event(A).start();
    }).on("interrupt.zoom end.zoom", function() {
      b(this, arguments).event(A).end();
    }).tween("zoom", function() {
      var E = this, N = arguments, P = b(E, N).event(A), R = t.apply(E, N), F = S == null ? v(R) : typeof S == "function" ? S.apply(E, N) : S, z = Math.max(R[1][0] - R[0][0], R[1][1] - R[0][1]), H = E.__zoom, Z = typeof T == "function" ? T.apply(E, N) : T, X = a(H.invert(F).concat(z / H.k), Z.invert(F).concat(z / Z.k));
      return function(W) {
        if (W === 1) W = Z;
        else {
          var U = X(W), G = z / U[2];
          W = new Xe(G, F[0] - U[0] * G, F[1] - U[1] * G);
        }
        P.zoom(null, W);
      };
    });
  }
  function b(x, T, S) {
    return !S && x.__zooming || new M(x, T);
  }
  function M(x, T) {
    this.that = x, this.args = T, this.active = 0, this.sourceEvent = null, this.extent = t.apply(x, T), this.taps = 0;
  }
  M.prototype = {
    event: function(x) {
      return x && (this.sourceEvent = x), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(x, T) {
      return this.mouse && x !== "mouse" && (this.mouse[1] = T.invert(this.mouse[0])), this.touch0 && x !== "touch" && (this.touch0[1] = T.invert(this.touch0[0])), this.touch1 && x !== "touch" && (this.touch1[1] = T.invert(this.touch1[0])), this.that.__zoom = T, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(x) {
      var T = Ne(this.that).datum();
      l.call(
        x,
        this.that,
        new gg(x, {
          sourceEvent: this.sourceEvent,
          target: y,
          transform: this.that.__zoom,
          dispatch: l
        }),
        T
      );
    }
  };
  function L(x, ...T) {
    if (!e.apply(this, arguments)) return;
    var S = b(this, T).event(x), A = this.__zoom, E = Math.max(o[0], Math.min(o[1], A.k * Math.pow(2, r.apply(this, arguments)))), N = Le(x);
    if (S.wheel)
      (S.mouse[0][0] !== N[0] || S.mouse[0][1] !== N[1]) && (S.mouse[1] = A.invert(S.mouse[0] = N)), clearTimeout(S.wheel);
    else {
      if (A.k === E) return;
      S.mouse = [N, A.invert(N)], $n(this), S.start();
    }
    Ht(x), S.wheel = setTimeout(P, p), S.zoom("mouse", n(m(C(A, E), S.mouse[0], S.mouse[1]), S.extent, s));
    function P() {
      S.wheel = null, S.end();
    }
  }
  function $(x, ...T) {
    if (f || !e.apply(this, arguments)) return;
    var S = x.currentTarget, A = b(this, T, !0).event(x), E = Ne(x.view).on("mousemove.zoom", F, !0).on("mouseup.zoom", z, !0), N = Le(x, S), P = x.clientX, R = x.clientY;
    wc(x.view), Ir(x), A.mouse = [N, this.__zoom.invert(N)], $n(this), A.start();
    function F(H) {
      if (Ht(H), !A.moved) {
        var Z = H.clientX - P, X = H.clientY - R;
        A.moved = Z * Z + X * X > h;
      }
      A.event(H).zoom("mouse", n(m(A.that.__zoom, A.mouse[0] = Le(H, S), A.mouse[1]), A.extent, s));
    }
    function z(H) {
      E.on("mousemove.zoom mouseup.zoom", null), xc(H.view, A.moved), Ht(H), A.event(H).end();
    }
  }
  function V(x, ...T) {
    if (e.apply(this, arguments)) {
      var S = this.__zoom, A = Le(x.changedTouches ? x.changedTouches[0] : x, this), E = S.invert(A), N = S.k * (x.shiftKey ? 0.5 : 2), P = n(m(C(S, N), A, E), t.apply(this, T), s);
      Ht(x), c > 0 ? Ne(this).transition().duration(c).call(_, P, A, x) : Ne(this).call(y.transform, P, A, x);
    }
  }
  function k(x, ...T) {
    if (e.apply(this, arguments)) {
      var S = x.touches, A = S.length, E = b(this, T, x.changedTouches.length === A).event(x), N, P, R, F;
      for (Ir(x), P = 0; P < A; ++P)
        R = S[P], F = Le(R, this), F = [F, this.__zoom.invert(F), R.identifier], E.touch0 ? !E.touch1 && E.touch0[2] !== F[2] && (E.touch1 = F, E.taps = 0) : (E.touch0 = F, N = !0, E.taps = 1 + !!d);
      d && (d = clearTimeout(d)), N && (E.taps < 2 && (u = F[0], d = setTimeout(function() {
        d = null;
      }, g)), $n(this), E.start());
    }
  }
  function O(x, ...T) {
    if (this.__zooming) {
      var S = b(this, T).event(x), A = x.changedTouches, E = A.length, N, P, R, F;
      for (Ht(x), N = 0; N < E; ++N)
        P = A[N], R = Le(P, this), S.touch0 && S.touch0[2] === P.identifier ? S.touch0[0] = R : S.touch1 && S.touch1[2] === P.identifier && (S.touch1[0] = R);
      if (P = S.that.__zoom, S.touch1) {
        var z = S.touch0[0], H = S.touch0[1], Z = S.touch1[0], X = S.touch1[1], W = (W = Z[0] - z[0]) * W + (W = Z[1] - z[1]) * W, U = (U = X[0] - H[0]) * U + (U = X[1] - H[1]) * U;
        P = C(P, Math.sqrt(W / U)), R = [(z[0] + Z[0]) / 2, (z[1] + Z[1]) / 2], F = [(H[0] + X[0]) / 2, (H[1] + X[1]) / 2];
      } else if (S.touch0) R = S.touch0[0], F = S.touch0[1];
      else return;
      S.zoom("touch", n(m(P, R, F), S.extent, s));
    }
  }
  function D(x, ...T) {
    if (this.__zooming) {
      var S = b(this, T).event(x), A = x.changedTouches, E = A.length, N, P;
      for (Ir(x), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, g), N = 0; N < E; ++N)
        P = A[N], S.touch0 && S.touch0[2] === P.identifier ? delete S.touch0 : S.touch1 && S.touch1[2] === P.identifier && delete S.touch1;
      if (S.touch1 && !S.touch0 && (S.touch0 = S.touch1, delete S.touch1), S.touch0) S.touch0[1] = this.__zoom.invert(S.touch0[0]);
      else if (S.end(), S.taps === 2 && (P = Le(P, this), Math.hypot(u[0] - P[0], u[1] - P[1]) < w)) {
        var R = Ne(this).on("dblclick.zoom");
        R && R.apply(this, arguments);
      }
    }
  }
  return y.wheelDelta = function(x) {
    return arguments.length ? (r = typeof x == "function" ? x : wn(+x), y) : r;
  }, y.filter = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : wn(!!x), y) : e;
  }, y.touchable = function(x) {
    return arguments.length ? (i = typeof x == "function" ? x : wn(!!x), y) : i;
  }, y.extent = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : wn([[+x[0][0], +x[0][1]], [+x[1][0], +x[1][1]]]), y) : t;
  }, y.scaleExtent = function(x) {
    return arguments.length ? (o[0] = +x[0], o[1] = +x[1], y) : [o[0], o[1]];
  }, y.translateExtent = function(x) {
    return arguments.length ? (s[0][0] = +x[0][0], s[1][0] = +x[1][0], s[0][1] = +x[0][1], s[1][1] = +x[1][1], y) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, y.constrain = function(x) {
    return arguments.length ? (n = x, y) : n;
  }, y.duration = function(x) {
    return arguments.length ? (c = +x, y) : c;
  }, y.interpolate = function(x) {
    return arguments.length ? (a = x, y) : a;
  }, y.on = function() {
    var x = l.on.apply(l, arguments);
    return x === l ? y : x;
  }, y.clickDistance = function(x) {
    return arguments.length ? (h = (x = +x) * x, y) : Math.sqrt(h);
  }, y.tapDistance = function(x) {
    return arguments.length ? (w = +x, y) : w;
  }, y;
}
const ze = {
  error001: () => "[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#001",
  error002: () => "It looks like you've created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them.",
  error003: (e) => `Node type "${e}" not found. Using fallback type "default".`,
  error004: () => "The React Flow parent container needs a width and a height to render the graph.",
  error005: () => "Only child nodes can use a parent extent.",
  error006: () => "Can't create edge. An edge needs a source and a target.",
  error007: (e) => `The old edge with id=${e} does not exist.`,
  error009: (e) => `Marker type "${e}" doesn't exist.`,
  error008: (e, { id: t, sourceHandle: n, targetHandle: r }) => `Couldn't create edge for ${e} handle id: "${e === "source" ? n : r}", edge id: ${t}.`,
  error010: () => "Handle: No node id found. Make sure to only use a Handle inside a custom Node.",
  error011: (e) => `Edge type "${e}" not found. Using fallback type "default".`,
  error012: (e) => `Node with id "${e}" does not exist, it may have been removed. This can happen when a node is deleted before the "onNodeClick" handler is called.`,
  error013: (e = "react") => `It seems that you haven't loaded the styles. Please import '@xyflow/${e}/dist/style.css' or base.css to make sure everything is working properly.`,
  error014: () => "useNodeConnections: No node ID found. Call useNodeConnections inside a custom Node or provide a node ID.",
  error015: () => "It seems that you are trying to drag a node that is not initialized. Please use onNodesChange as explained in the docs."
}, jt = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
], Rc = ["Enter", " ", "Escape"], Fc = {
  "node.a11yDescription.default": "Press enter or space to select a node. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.keyboardDisabled": "Press enter or space to select a node. You can then use the arrow keys to move the node around. Press delete to remove it and escape to cancel.",
  "node.a11yDescription.ariaLiveMessage": ({ direction: e, x: t, y: n }) => `Moved selected node ${e}. New position, x: ${t}, y: ${n}`,
  "edge.a11yDescription.default": "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel.",
  // Control elements
  "controls.ariaLabel": "Control Panel",
  "controls.zoomIn.ariaLabel": "Zoom In",
  "controls.zoomOut.ariaLabel": "Zoom Out",
  "controls.fitView.ariaLabel": "Fit View",
  "controls.interactive.ariaLabel": "Toggle Interactivity",
  // Mini map
  "minimap.ariaLabel": "Mini Map",
  // Handle
  "handle.ariaLabel": "Handle"
};
var At;
(function(e) {
  e.Strict = "strict", e.Loose = "loose";
})(At || (At = {}));
var ft;
(function(e) {
  e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal";
})(ft || (ft = {}));
var Qt;
(function(e) {
  e.Partial = "partial", e.Full = "full";
})(Qt || (Qt = {}));
const Vc = {
  inProgress: !1,
  isValid: null,
  from: null,
  fromHandle: null,
  fromPosition: null,
  fromNode: null,
  to: null,
  toHandle: null,
  toPosition: null,
  toNode: null,
  pointer: null
};
var Qe;
(function(e) {
  e.Bezier = "default", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e.SimpleBezier = "simplebezier";
})(Qe || (Qe = {}));
var Hn;
(function(e) {
  e.Arrow = "arrow", e.ArrowClosed = "arrowclosed";
})(Hn || (Hn = {}));
var Y;
(function(e) {
  e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom";
})(Y || (Y = {}));
const Do = {
  [Y.Left]: Y.Right,
  [Y.Right]: Y.Left,
  [Y.Top]: Y.Bottom,
  [Y.Bottom]: Y.Top
};
function Hc(e) {
  return e === null ? null : e ? "valid" : "invalid";
}
const zc = (e) => "id" in e && "source" in e && "target" in e, xg = (e) => "id" in e && "position" in e && !("source" in e) && !("target" in e), Yi = (e) => "id" in e && "internals" in e && !("source" in e) && !("target" in e), an = (e, t = [0, 0]) => {
  var c;
  const { width: n, height: r } = Ge(e), i = (c = e.origin) != null ? c : t, o = n * i[0], s = r * i[1];
  return {
    x: e.position.x - o,
    y: e.position.y - s
  };
}, _g = (e, t = { nodeOrigin: [0, 0] }) => {
  if (e.length === 0)
    return { x: 0, y: 0, width: 0, height: 0 };
  const n = e.reduce((r, i) => {
    const o = typeof i == "string";
    let s = !t.nodeLookup && !o ? i : void 0;
    t.nodeLookup && (s = o ? t.nodeLookup.get(i) : Yi(i) ? i : t.nodeLookup.get(i.id));
    const c = s ? zn(s, t.nodeOrigin) : { x: 0, y: 0, x2: 0, y2: 0 };
    return sr(r, c);
  }, { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 });
  return cr(n);
}, ln = (e, t = {}) => {
  let n = { x: 1 / 0, y: 1 / 0, x2: -1 / 0, y2: -1 / 0 }, r = !1;
  return e.forEach((i) => {
    (t.filter === void 0 || t.filter(i)) && (n = sr(n, zn(i)), r = !0);
  }), r ? cr(n) : { x: 0, y: 0, width: 0, height: 0 };
}, Gi = (e, t, [n, r, i] = [0, 0, 1], o = !1, s = !1) => {
  var l, d, u, f, g, p;
  const c = {
    ...fn(t, [n, r, i]),
    width: t.width / i,
    height: t.height / i
  }, a = [];
  for (const h of e.values()) {
    const { measured: w, selectable: y = !0, hidden: C = !1 } = h;
    if (s && !y || C)
      continue;
    const m = (u = (d = (l = w.width) != null ? l : h.width) != null ? d : h.initialWidth) != null ? u : null, v = (p = (g = (f = w.height) != null ? f : h.height) != null ? g : h.initialHeight) != null ? p : null, _ = Jt(c, $t(h)), b = (m != null ? m : 0) * (v != null ? v : 0), M = o && _ > 0;
    (!h.internals.handleBounds || M || _ >= b || h.dragging) && a.push(h);
  }
  return a;
}, Cg = (e, t) => {
  const n = /* @__PURE__ */ new Set();
  return e.forEach((r) => {
    n.add(r.id);
  }), t.filter((r) => n.has(r.source) || n.has(r.target));
};
function bg(e, t) {
  const n = /* @__PURE__ */ new Map(), r = t != null && t.nodes ? new Set(t.nodes.map((i) => i.id)) : null;
  return e.forEach((i) => {
    i.measured.width && i.measured.height && ((t == null ? void 0 : t.includeHiddenNodes) || !i.hidden) && (!r || r.has(i.id)) && n.set(i.id, i);
  }), n;
}
async function Sg({ nodes: e, width: t, height: n, panZoom: r, minZoom: i, maxZoom: o }, s) {
  var d, u, f;
  if (e.size === 0)
    return Promise.resolve(!0);
  const c = bg(e, s), a = ln(c), l = Ki(a, t, n, (d = s == null ? void 0 : s.minZoom) != null ? d : i, (u = s == null ? void 0 : s.maxZoom) != null ? u : o, (f = s == null ? void 0 : s.padding) != null ? f : 0.1);
  return await r.setViewport(l, {
    duration: s == null ? void 0 : s.duration,
    ease: s == null ? void 0 : s.ease,
    interpolate: s == null ? void 0 : s.interpolate
  }), Promise.resolve(!0);
}
function Bc({ nodeId: e, nextPosition: t, nodeLookup: n, nodeOrigin: r = [0, 0], nodeExtent: i, onError: o }) {
  var g, p, h;
  const s = n.get(e), c = s.parentId ? n.get(s.parentId) : void 0, { x: a, y: l } = c ? c.internals.positionAbsolute : { x: 0, y: 0 }, d = (g = s.origin) != null ? g : r;
  let u = s.extent || i;
  if (s.extent === "parent" && !s.expandParent)
    if (!c)
      o == null || o("005", ze.error005());
    else {
      const w = c.measured.width, y = c.measured.height;
      w && y && (u = [
        [a, l],
        [a + w, l + y]
      ]);
    }
  else c && Tt(s.extent) && (u = [
    [s.extent[0][0] + a, s.extent[0][1] + l],
    [s.extent[1][0] + a, s.extent[1][1] + l]
  ]);
  const f = Tt(u) ? gt(t, u, s.measured) : t;
  return (s.measured.width === void 0 || s.measured.height === void 0) && (o == null || o("015", ze.error015())), {
    position: {
      x: f.x - a + ((p = s.measured.width) != null ? p : 0) * d[0],
      y: f.y - l + ((h = s.measured.height) != null ? h : 0) * d[1]
    },
    positionAbsolute: f
  };
}
async function Ng({ nodesToRemove: e = [], edgesToRemove: t = [], nodes: n, edges: r, onBeforeDelete: i }) {
  const o = new Set(e.map((f) => f.id)), s = [];
  for (const f of n) {
    if (f.deletable === !1)
      continue;
    const g = o.has(f.id), p = !g && f.parentId && s.find((h) => h.id === f.parentId);
    (g || p) && s.push(f);
  }
  const c = new Set(t.map((f) => f.id)), a = r.filter((f) => f.deletable !== !1), d = Cg(s, a);
  for (const f of a)
    c.has(f.id) && !d.find((p) => p.id === f.id) && d.push(f);
  if (!i)
    return {
      edges: d,
      nodes: s
    };
  const u = await i({
    nodes: s,
    edges: d
  });
  return typeof u == "boolean" ? u ? { edges: d, nodes: s } : { edges: [], nodes: [] } : u;
}
const Lt = (e, t = 0, n = 1) => Math.min(Math.max(e, t), n), gt = (e = { x: 0, y: 0 }, t, n) => {
  var r, i;
  return {
    x: Lt(e.x, t[0][0], t[1][0] - ((r = n == null ? void 0 : n.width) != null ? r : 0)),
    y: Lt(e.y, t[0][1], t[1][1] - ((i = n == null ? void 0 : n.height) != null ? i : 0))
  };
};
function Uc(e, t, n) {
  const { width: r, height: i } = Ge(n), { x: o, y: s } = n.internals.positionAbsolute;
  return gt(e, [
    [o, s],
    [o + r, s + i]
  ], t);
}
const Ro = (e, t, n) => e < t ? Lt(Math.abs(e - t), 1, t) / t : e > n ? -Lt(Math.abs(e - n), 1, t) / t : 0, Wc = (e, t, n = 15, r = 40) => {
  const i = Ro(e.x, r, t.width - r) * n, o = Ro(e.y, r, t.height - r) * n;
  return [i, o];
}, sr = (e, t) => ({
  x: Math.min(e.x, t.x),
  y: Math.min(e.y, t.y),
  x2: Math.max(e.x2, t.x2),
  y2: Math.max(e.y2, t.y2)
}), ri = ({ x: e, y: t, width: n, height: r }) => ({
  x: e,
  y: t,
  x2: e + n,
  y2: t + r
}), cr = ({ x: e, y: t, x2: n, y2: r }) => ({
  x: e,
  y: t,
  width: n - e,
  height: r - t
}), $t = (e, t = [0, 0]) => {
  var i, o, s, c, a, l, d, u;
  const { x: n, y: r } = Yi(e) ? e.internals.positionAbsolute : an(e, t);
  return {
    x: n,
    y: r,
    width: (c = (s = (o = (i = e.measured) == null ? void 0 : i.width) != null ? o : e.width) != null ? s : e.initialWidth) != null ? c : 0,
    height: (u = (d = (l = (a = e.measured) == null ? void 0 : a.height) != null ? l : e.height) != null ? d : e.initialHeight) != null ? u : 0
  };
}, zn = (e, t = [0, 0]) => {
  var i, o, s, c, a, l, d, u;
  const { x: n, y: r } = Yi(e) ? e.internals.positionAbsolute : an(e, t);
  return {
    x: n,
    y: r,
    x2: n + ((c = (s = (o = (i = e.measured) == null ? void 0 : i.width) != null ? o : e.width) != null ? s : e.initialWidth) != null ? c : 0),
    y2: r + ((u = (d = (l = (a = e.measured) == null ? void 0 : a.height) != null ? l : e.height) != null ? d : e.initialHeight) != null ? u : 0)
  };
}, Zc = (e, t) => cr(sr(ri(e), ri(t))), Jt = (e, t) => {
  const n = Math.max(0, Math.min(e.x + e.width, t.x + t.width) - Math.max(e.x, t.x)), r = Math.max(0, Math.min(e.y + e.height, t.y + t.height) - Math.max(e.y, t.y));
  return Math.ceil(n * r);
}, Fo = (e) => Te(e.width) && Te(e.height) && Te(e.x) && Te(e.y), Te = (e) => !isNaN(e) && isFinite(e), Eg = (e, t) => {
}, un = (e, t = [1, 1]) => ({
  x: t[0] * Math.round(e.x / t[0]),
  y: t[1] * Math.round(e.y / t[1])
}), fn = ({ x: e, y: t }, [n, r, i], o = !1, s = [1, 1]) => {
  const c = {
    x: (e - n) / i,
    y: (t - r) / i
  };
  return o ? un(c, s) : c;
}, Bn = ({ x: e, y: t }, [n, r, i]) => ({
  x: e * i + n,
  y: t * i + r
});
function xt(e, t) {
  if (typeof e == "number")
    return Math.floor((t - t / (1 + e)) * 0.5);
  if (typeof e == "string" && e.endsWith("px")) {
    const n = parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(n);
  }
  if (typeof e == "string" && e.endsWith("%")) {
    const n = parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(t * n * 0.01);
  }
  return console.error(`[React Flow] The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function Ig(e, t, n) {
  var r, i, o, s, c, a, l, d;
  if (typeof e == "string" || typeof e == "number") {
    const u = xt(e, n), f = xt(e, t);
    return {
      top: u,
      right: f,
      bottom: u,
      left: f,
      x: f * 2,
      y: u * 2
    };
  }
  if (typeof e == "object") {
    const u = xt((i = (r = e.top) != null ? r : e.y) != null ? i : 0, n), f = xt((s = (o = e.bottom) != null ? o : e.y) != null ? s : 0, n), g = xt((a = (c = e.left) != null ? c : e.x) != null ? a : 0, t), p = xt((d = (l = e.right) != null ? l : e.x) != null ? d : 0, t);
    return { top: u, right: p, bottom: f, left: g, x: g + p, y: u + f };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function Mg(e, t, n, r, i, o) {
  const { x: s, y: c } = Bn(e, [t, n, r]), { x: a, y: l } = Bn({ x: e.x + e.width, y: e.y + e.height }, [t, n, r]), d = i - a, u = o - l;
  return {
    left: Math.floor(s),
    top: Math.floor(c),
    right: Math.floor(d),
    bottom: Math.floor(u)
  };
}
const Ki = (e, t, n, r, i, o) => {
  const s = Ig(o, t, n), c = (t - s.x) / e.width, a = (n - s.y) / e.height, l = Math.min(c, a), d = Lt(l, r, i), u = e.x + e.width / 2, f = e.y + e.height / 2, g = t / 2 - u * d, p = n / 2 - f * d, h = Mg(e, g, p, d, t, n), w = {
    left: Math.min(h.left - s.left, 0),
    top: Math.min(h.top - s.top, 0),
    right: Math.min(h.right - s.right, 0),
    bottom: Math.min(h.bottom - s.bottom, 0)
  };
  return {
    x: g - w.left + w.right,
    y: p - w.top + w.bottom,
    zoom: d
  };
}, en = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator == null ? void 0 : navigator.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function Tt(e) {
  return e != null && e !== "parent";
}
function Ge(e) {
  var t, n, r, i, o, s, c, a;
  return {
    width: (i = (r = (n = (t = e.measured) == null ? void 0 : t.width) != null ? n : e.width) != null ? r : e.initialWidth) != null ? i : 0,
    height: (a = (c = (s = (o = e.measured) == null ? void 0 : o.height) != null ? s : e.height) != null ? c : e.initialHeight) != null ? a : 0
  };
}
function Xc(e) {
  var t, n, r, i, o, s;
  return ((r = (n = (t = e.measured) == null ? void 0 : t.width) != null ? n : e.width) != null ? r : e.initialWidth) !== void 0 && ((s = (o = (i = e.measured) == null ? void 0 : i.height) != null ? o : e.height) != null ? s : e.initialHeight) !== void 0;
}
function Yc(e, t = { width: 0, height: 0 }, n, r, i) {
  var c, a;
  const o = { ...e }, s = r.get(n);
  if (s) {
    const l = s.origin || i;
    o.x += s.internals.positionAbsolute.x - ((c = t.width) != null ? c : 0) * l[0], o.y += s.internals.positionAbsolute.y - ((a = t.height) != null ? a : 0) * l[1];
  }
  return o;
}
function Vo(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function Ag() {
  let e, t;
  return { promise: new Promise((r, i) => {
    e = r, t = i;
  }), resolve: e, reject: t };
}
function Lg(e) {
  return { ...Fc, ...e || {} };
}
function Zt(e, { snapGrid: t = [0, 0], snapToGrid: n = !1, transform: r, containerBounds: i }) {
  var d, u;
  const { x: o, y: s } = ke(e), c = fn({ x: o - ((d = i == null ? void 0 : i.left) != null ? d : 0), y: s - ((u = i == null ? void 0 : i.top) != null ? u : 0) }, r), { x: a, y: l } = n ? un(c, t) : c;
  return {
    xSnapped: a,
    ySnapped: l,
    ...c
  };
}
const qi = (e) => ({
  width: e.offsetWidth,
  height: e.offsetHeight
}), Gc = (e) => {
  var t;
  return ((t = e == null ? void 0 : e.getRootNode) == null ? void 0 : t.call(e)) || (window == null ? void 0 : window.document);
}, $g = ["INPUT", "SELECT", "TEXTAREA"];
function Kc(e) {
  var r, i;
  const t = ((i = (r = e.composedPath) == null ? void 0 : r.call(e)) == null ? void 0 : i[0]) || e.target;
  return (t == null ? void 0 : t.nodeType) !== 1 ? !1 : $g.includes(t.nodeName) || t.hasAttribute("contenteditable") || !!t.closest(".nokey");
}
const qc = (e) => "clientX" in e, ke = (e, t) => {
  var o, s, c, a;
  const n = qc(e), r = n ? e.clientX : (o = e.touches) == null ? void 0 : o[0].clientX, i = n ? e.clientY : (s = e.touches) == null ? void 0 : s[0].clientY;
  return {
    x: r - ((c = t == null ? void 0 : t.left) != null ? c : 0),
    y: i - ((a = t == null ? void 0 : t.top) != null ? a : 0)
  };
}, Ho = (e, t, n, r, i) => {
  const o = t.querySelectorAll(`.${e}`);
  return !o || !o.length ? null : Array.from(o).map((s) => {
    const c = s.getBoundingClientRect();
    return {
      id: s.getAttribute("data-handleid"),
      type: e,
      nodeId: i,
      position: s.getAttribute("data-handlepos"),
      x: (c.left - n.left) / r,
      y: (c.top - n.top) / r,
      ...qi(s)
    };
  });
};
function jc({ sourceX: e, sourceY: t, targetX: n, targetY: r, sourceControlX: i, sourceControlY: o, targetControlX: s, targetControlY: c }) {
  const a = e * 0.125 + i * 0.375 + s * 0.375 + n * 0.125, l = t * 0.125 + o * 0.375 + c * 0.375 + r * 0.125, d = Math.abs(a - e), u = Math.abs(l - t);
  return [a, l, d, u];
}
function xn(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function zo({ pos: e, x1: t, y1: n, x2: r, y2: i, c: o }) {
  switch (e) {
    case Y.Left:
      return [t - xn(t - r, o), n];
    case Y.Right:
      return [t + xn(r - t, o), n];
    case Y.Top:
      return [t, n - xn(n - i, o)];
    case Y.Bottom:
      return [t, n + xn(i - n, o)];
  }
}
function Qc({ sourceX: e, sourceY: t, sourcePosition: n = Y.Bottom, targetX: r, targetY: i, targetPosition: o = Y.Top, curvature: s = 0.25 }) {
  const [c, a] = zo({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: i,
    c: s
  }), [l, d] = zo({
    pos: o,
    x1: r,
    y1: i,
    x2: e,
    y2: t,
    c: s
  }), [u, f, g, p] = jc({
    sourceX: e,
    sourceY: t,
    targetX: r,
    targetY: i,
    sourceControlX: c,
    sourceControlY: a,
    targetControlX: l,
    targetControlY: d
  });
  return [
    `M${e},${t} C${c},${a} ${l},${d} ${r},${i}`,
    u,
    f,
    g,
    p
  ];
}
function Jc({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const i = Math.abs(n - e) / 2, o = n < e ? n + i : n - i, s = Math.abs(r - t) / 2, c = r < t ? r + s : r - s;
  return [o, c, i, s];
}
function Tg({ sourceNode: e, targetNode: t, selected: n = !1, zIndex: r, elevateOnSelect: i = !1 }) {
  if (r !== void 0)
    return r;
  const o = i && n ? 1e3 : 0, s = Math.max(e.parentId || i && e.selected ? e.internals.z : 0, t.parentId || i && t.selected ? t.internals.z : 0);
  return o + s;
}
function kg({ sourceNode: e, targetNode: t, width: n, height: r, transform: i }) {
  const o = sr(zn(e), zn(t));
  o.x === o.x2 && (o.x2 += 1), o.y === o.y2 && (o.y2 += 1);
  const s = {
    x: -i[0] / i[2],
    y: -i[1] / i[2],
    width: n / i[2],
    height: r / i[2]
  };
  return Jt(s, cr(o)) > 0;
}
const Og = ({ source: e, sourceHandle: t, target: n, targetHandle: r }) => `xy-edge__${e}${t || ""}-${n}${r || ""}`, Pg = (e, t) => t.some((n) => n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)), Dg = (e, t) => {
  if (!e.source || !e.target)
    return t;
  let n;
  return zc(e) ? n = { ...e } : n = {
    ...e,
    id: Og(e)
  }, Pg(n, t) ? t : (n.sourceHandle === null && delete n.sourceHandle, n.targetHandle === null && delete n.targetHandle, t.concat(n));
};
function ea({ sourceX: e, sourceY: t, targetX: n, targetY: r }) {
  const [i, o, s, c] = Jc({
    sourceX: e,
    sourceY: t,
    targetX: n,
    targetY: r
  });
  return [`M ${e},${t}L ${n},${r}`, i, o, s, c];
}
const Bo = {
  [Y.Left]: { x: -1, y: 0 },
  [Y.Right]: { x: 1, y: 0 },
  [Y.Top]: { x: 0, y: -1 },
  [Y.Bottom]: { x: 0, y: 1 }
}, Rg = ({ source: e, sourcePosition: t = Y.Bottom, target: n }) => t === Y.Left || t === Y.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 }, Uo = (e, t) => Math.sqrt(Math.pow(t.x - e.x, 2) + Math.pow(t.y - e.y, 2));
function Fg({ source: e, sourcePosition: t = Y.Bottom, target: n, targetPosition: r = Y.Top, center: i, offset: o, stepPosition: s }) {
  var b, M, L, $;
  const c = Bo[t], a = Bo[r], l = { x: e.x + c.x * o, y: e.y + c.y * o }, d = { x: n.x + a.x * o, y: n.y + a.y * o }, u = Rg({
    source: l,
    sourcePosition: t,
    target: d
  }), f = u.x !== 0 ? "x" : "y", g = u[f];
  let p = [], h, w;
  const y = { x: 0, y: 0 }, C = { x: 0, y: 0 }, [, , m, v] = Jc({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (c[f] * a[f] === -1) {
    f === "x" ? (h = (b = i.x) != null ? b : l.x + (d.x - l.x) * s, w = (M = i.y) != null ? M : (l.y + d.y) / 2) : (h = (L = i.x) != null ? L : (l.x + d.x) / 2, w = ($ = i.y) != null ? $ : l.y + (d.y - l.y) * s);
    const V = [
      { x: h, y: l.y },
      { x: h, y: d.y }
    ], k = [
      { x: l.x, y: w },
      { x: d.x, y: w }
    ];
    c[f] === g ? p = f === "x" ? V : k : p = f === "x" ? k : V;
  } else {
    const V = [{ x: l.x, y: d.y }], k = [{ x: d.x, y: l.y }];
    if (f === "x" ? p = c.x === g ? k : V : p = c.y === g ? V : k, t === r) {
      const S = Math.abs(e[f] - n[f]);
      if (S <= o) {
        const A = Math.min(o - 1, o - S);
        c[f] === g ? y[f] = (l[f] > e[f] ? -1 : 1) * A : C[f] = (d[f] > n[f] ? -1 : 1) * A;
      }
    }
    if (t !== r) {
      const S = f === "x" ? "y" : "x", A = c[f] === a[S], E = l[S] > d[S], N = l[S] < d[S];
      (c[f] === 1 && (!A && E || A && N) || c[f] !== 1 && (!A && N || A && E)) && (p = f === "x" ? V : k);
    }
    const O = { x: l.x + y.x, y: l.y + y.y }, D = { x: d.x + C.x, y: d.y + C.y }, x = Math.max(Math.abs(O.x - p[0].x), Math.abs(D.x - p[0].x)), T = Math.max(Math.abs(O.y - p[0].y), Math.abs(D.y - p[0].y));
    x >= T ? (h = (O.x + D.x) / 2, w = p[0].y) : (h = p[0].x, w = (O.y + D.y) / 2);
  }
  return [[
    e,
    { x: l.x + y.x, y: l.y + y.y },
    ...p,
    { x: d.x + C.x, y: d.y + C.y },
    n
  ], h, w, m, v];
}
function Vg(e, t, n, r) {
  const i = Math.min(Uo(e, t) / 2, Uo(t, n) / 2, r), { x: o, y: s } = t;
  if (e.x === o && o === n.x || e.y === s && s === n.y)
    return `L${o} ${s}`;
  if (e.y === s) {
    const l = e.x < n.x ? -1 : 1, d = e.y < n.y ? 1 : -1;
    return `L ${o + i * l},${s}Q ${o},${s} ${o},${s + i * d}`;
  }
  const c = e.x < n.x ? 1 : -1, a = e.y < n.y ? -1 : 1;
  return `L ${o},${s + i * a}Q ${o},${s} ${o + i * c},${s}`;
}
function ii({ sourceX: e, sourceY: t, sourcePosition: n = Y.Bottom, targetX: r, targetY: i, targetPosition: o = Y.Top, borderRadius: s = 5, centerX: c, centerY: a, offset: l = 20, stepPosition: d = 0.5 }) {
  const [u, f, g, p, h] = Fg({
    source: { x: e, y: t },
    sourcePosition: n,
    target: { x: r, y: i },
    targetPosition: o,
    center: { x: c, y: a },
    offset: l,
    stepPosition: d
  });
  return [u.reduce((y, C, m) => {
    let v = "";
    return m > 0 && m < u.length - 1 ? v = Vg(u[m - 1], C, u[m + 1], s) : v = `${m === 0 ? "M" : "L"}${C.x} ${C.y}`, y += v, y;
  }, ""), f, g, p, h];
}
function Wo(e) {
  var t;
  return e && !!(e.internals.handleBounds || (t = e.handles) != null && t.length) && !!(e.measured.width || e.width || e.initialWidth);
}
function Hg(e) {
  var u, f, g, p, h;
  const { sourceNode: t, targetNode: n } = e;
  if (!Wo(t) || !Wo(n))
    return null;
  const r = t.internals.handleBounds || Zo(t.handles), i = n.internals.handleBounds || Zo(n.handles), o = Xo((u = r == null ? void 0 : r.source) != null ? u : [], e.sourceHandle), s = Xo(
    // when connection type is loose we can define all handles as sources and connect source -> source
    e.connectionMode === At.Strict ? (f = i == null ? void 0 : i.target) != null ? f : [] : ((g = i == null ? void 0 : i.target) != null ? g : []).concat((p = i == null ? void 0 : i.source) != null ? p : []),
    e.targetHandle
  );
  if (!o || !s)
    return (h = e.onError) == null || h.call(e, "008", ze.error008(o ? "target" : "source", {
      id: e.id,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle
    })), null;
  const c = (o == null ? void 0 : o.position) || Y.Bottom, a = (s == null ? void 0 : s.position) || Y.Top, l = tn(t, o, c), d = tn(n, s, a);
  return {
    sourceX: l.x,
    sourceY: l.y,
    targetX: d.x,
    targetY: d.y,
    sourcePosition: c,
    targetPosition: a
  };
}
function Zo(e) {
  var r, i;
  if (!e)
    return null;
  const t = [], n = [];
  for (const o of e)
    o.width = (r = o.width) != null ? r : 1, o.height = (i = o.height) != null ? i : 1, o.type === "source" ? t.push(o) : o.type === "target" && n.push(o);
  return {
    source: t,
    target: n
  };
}
function tn(e, t, n = Y.Left, r = !1) {
  var l, d, u;
  const i = ((l = t == null ? void 0 : t.x) != null ? l : 0) + e.internals.positionAbsolute.x, o = ((d = t == null ? void 0 : t.y) != null ? d : 0) + e.internals.positionAbsolute.y, { width: s, height: c } = t != null ? t : Ge(e);
  if (r)
    return { x: i + s / 2, y: o + c / 2 };
  switch ((u = t == null ? void 0 : t.position) != null ? u : n) {
    case Y.Top:
      return { x: i + s / 2, y: o };
    case Y.Right:
      return { x: i + s, y: o + c / 2 };
    case Y.Bottom:
      return { x: i + s / 2, y: o + c };
    case Y.Left:
      return { x: i, y: o + c / 2 };
  }
}
function Xo(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function oi(e, t) {
  return e ? typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((r) => `${r}=${e[r]}`).join("&")}` : "";
}
function zg(e, { id: t, defaultColor: n, defaultMarkerStart: r, defaultMarkerEnd: i }) {
  const o = /* @__PURE__ */ new Set();
  return e.reduce((s, c) => ([c.markerStart || r, c.markerEnd || i].forEach((a) => {
    if (a && typeof a == "object") {
      const l = oi(a, t);
      o.has(l) || (s.push({ id: l, color: a.color || n, ...a }), o.add(l));
    }
  }), s), []).sort((s, c) => s.id.localeCompare(c.id));
}
const ta = 1e3, Bg = 10, ji = {
  nodeOrigin: [0, 0],
  nodeExtent: jt,
  elevateNodesOnSelect: !0,
  defaults: {}
}, Ug = {
  ...ji,
  checkEquality: !0
};
function Qi(e, t) {
  const n = { ...e };
  for (const r in t)
    t[r] !== void 0 && (n[r] = t[r]);
  return n;
}
function Wg(e, t, n) {
  const r = Qi(ji, n);
  for (const i of e.values())
    if (i.parentId)
      Ji(i, e, t, r);
    else {
      const o = an(i, r.nodeOrigin), s = Tt(i.extent) ? i.extent : r.nodeExtent, c = gt(o, s, Ge(i));
      i.internals.positionAbsolute = c;
    }
}
function Zg(e, t) {
  var i, o;
  if (!e.handles)
    return e.measured ? t == null ? void 0 : t.internals.handleBounds : void 0;
  const n = [], r = [];
  for (const s of e.handles) {
    const c = {
      id: s.id,
      width: (i = s.width) != null ? i : 1,
      height: (o = s.height) != null ? o : 1,
      nodeId: e.id,
      x: s.x,
      y: s.y,
      position: s.position,
      type: s.type
    };
    s.type === "source" ? n.push(c) : s.type === "target" && r.push(c);
  }
  return {
    source: n,
    target: r
  };
}
function si(e, t, n, r) {
  var l, d;
  const i = Qi(Ug, r);
  let o = { i: -1 }, s = e.length > 0;
  const c = new Map(t), a = i != null && i.elevateNodesOnSelect ? ta : 0;
  t.clear(), n.clear();
  for (const u of e) {
    let f = c.get(u.id);
    if (i.checkEquality && u === (f == null ? void 0 : f.internals.userNode))
      t.set(u.id, f);
    else {
      const g = an(u, i.nodeOrigin), p = Tt(u.extent) ? u.extent : i.nodeExtent, h = gt(g, p, Ge(u));
      f = {
        ...i.defaults,
        ...u,
        measured: {
          width: (l = u.measured) == null ? void 0 : l.width,
          height: (d = u.measured) == null ? void 0 : d.height
        },
        internals: {
          positionAbsolute: h,
          // if user re-initializes the node or removes `measured` for whatever reason, we reset the handleBounds so that the node gets re-measured
          handleBounds: Zg(u, f),
          z: na(u, a),
          userNode: u
        }
      }, t.set(u.id, f);
    }
    (f.measured === void 0 || f.measured.width === void 0 || f.measured.height === void 0) && !f.hidden && (s = !1), u.parentId && Ji(f, t, n, r, o);
  }
  return s;
}
function Xg(e, t) {
  if (!e.parentId)
    return;
  const n = t.get(e.parentId);
  n ? n.set(e.id, e) : t.set(e.parentId, /* @__PURE__ */ new Map([[e.id, e]]));
}
function Ji(e, t, n, r, i) {
  const { elevateNodesOnSelect: o, nodeOrigin: s, nodeExtent: c } = Qi(ji, r), a = e.parentId, l = t.get(a);
  if (!l) {
    console.warn(`Parent node ${a} not found. Please make sure that parent nodes are in front of their child nodes in the nodes array.`);
    return;
  }
  Xg(e, n), i && !l.parentId && l.internals.rootParentIndex === void 0 && (l.internals.rootParentIndex = ++i.i, l.internals.z = l.internals.z + i.i * Bg), i && l.internals.rootParentIndex !== void 0 && (i.i = l.internals.rootParentIndex);
  const d = o ? ta : 0, { x: u, y: f, z: g } = Yg(e, l, s, c, d), { positionAbsolute: p } = e.internals, h = u !== p.x || f !== p.y;
  (h || g !== e.internals.z) && t.set(e.id, {
    ...e,
    internals: {
      ...e.internals,
      positionAbsolute: h ? { x: u, y: f } : p,
      z: g
    }
  });
}
function na(e, t) {
  return (Te(e.zIndex) ? e.zIndex : 0) + (e.selected ? t : 0);
}
function Yg(e, t, n, r, i) {
  var g;
  const { x: o, y: s } = t.internals.positionAbsolute, c = Ge(e), a = an(e, n), l = Tt(e.extent) ? gt(a, e.extent, c) : a;
  let d = gt({ x: o + l.x, y: s + l.y }, r, c);
  e.extent === "parent" && (d = Uc(d, c, t));
  const u = na(e, i), f = (g = t.internals.z) != null ? g : 0;
  return {
    x: d.x,
    y: d.y,
    z: f >= u ? f + 1 : u
  };
}
function eo(e, t, n, r = [0, 0]) {
  var s, c;
  const i = [], o = /* @__PURE__ */ new Map();
  for (const a of e) {
    const l = t.get(a.parentId);
    if (!l)
      continue;
    const d = (c = (s = o.get(a.parentId)) == null ? void 0 : s.expandedRect) != null ? c : $t(l), u = Zc(d, a.rect);
    o.set(a.parentId, { expandedRect: u, parent: l });
  }
  return o.size > 0 && o.forEach(({ expandedRect: a, parent: l }, d) => {
    var v, _;
    const u = l.internals.positionAbsolute, f = Ge(l), g = (v = l.origin) != null ? v : r, p = a.x < u.x ? Math.round(Math.abs(u.x - a.x)) : 0, h = a.y < u.y ? Math.round(Math.abs(u.y - a.y)) : 0, w = Math.max(f.width, Math.round(a.width)), y = Math.max(f.height, Math.round(a.height)), C = (w - f.width) * g[0], m = (y - f.height) * g[1];
    (p > 0 || h > 0 || C || m) && (i.push({
      id: d,
      type: "position",
      position: {
        x: l.position.x - p + C,
        y: l.position.y - h + m
      }
    }), (_ = n.get(d)) == null || _.forEach((b) => {
      e.some((M) => M.id === b.id) || i.push({
        id: b.id,
        type: "position",
        position: {
          x: b.position.x + p,
          y: b.position.y + h
        }
      });
    })), (f.width < a.width || f.height < a.height || p || h) && i.push({
      id: d,
      type: "dimensions",
      setAttributes: !0,
      dimensions: {
        width: w + (p ? g[0] * p - C : 0),
        height: y + (h ? g[1] * h - m : 0)
      }
    });
  }), i;
}
function Gg(e, t, n, r, i, o) {
  const s = r == null ? void 0 : r.querySelector(".xyflow__viewport");
  let c = !1;
  if (!s)
    return { changes: [], updatedInternals: c };
  const a = [], l = window.getComputedStyle(s), { m22: d } = new window.DOMMatrixReadOnly(l.transform), u = [];
  for (const f of e.values()) {
    const g = t.get(f.id);
    if (!g)
      continue;
    if (g.hidden) {
      t.set(g.id, {
        ...g,
        internals: {
          ...g.internals,
          handleBounds: void 0
        }
      }), c = !0;
      continue;
    }
    const p = qi(f.nodeElement), h = g.measured.width !== p.width || g.measured.height !== p.height;
    if (!!(p.width && p.height && (h || !g.internals.handleBounds || f.force))) {
      const y = f.nodeElement.getBoundingClientRect(), C = Tt(g.extent) ? g.extent : o;
      let { positionAbsolute: m } = g.internals;
      g.parentId && g.extent === "parent" ? m = Uc(m, p, t.get(g.parentId)) : C && (m = gt(m, C, p));
      const v = {
        ...g,
        measured: p,
        internals: {
          ...g.internals,
          positionAbsolute: m,
          handleBounds: {
            source: Ho("source", f.nodeElement, y, d, g.id),
            target: Ho("target", f.nodeElement, y, d, g.id)
          }
        }
      };
      t.set(g.id, v), g.parentId && Ji(v, t, n, { nodeOrigin: i }), c = !0, h && (a.push({
        id: g.id,
        type: "dimensions",
        dimensions: p
      }), g.expandParent && g.parentId && u.push({
        id: g.id,
        parentId: g.parentId,
        rect: $t(v, i)
      }));
    }
  }
  if (u.length > 0) {
    const f = eo(u, t, n, i);
    a.push(...f);
  }
  return { changes: a, updatedInternals: c };
}
async function Kg({ delta: e, panZoom: t, transform: n, translateExtent: r, width: i, height: o }) {
  if (!t || !e.x && !e.y)
    return Promise.resolve(!1);
  const s = await t.setViewportConstrained({
    x: n[0] + e.x,
    y: n[1] + e.y,
    zoom: n[2]
  }, [
    [0, 0],
    [i, o]
  ], r), c = !!s && (s.x !== n[0] || s.y !== n[1] || s.k !== n[2]);
  return Promise.resolve(c);
}
function Yo(e, t, n, r, i, o) {
  let s = i;
  const c = r.get(s) || /* @__PURE__ */ new Map();
  r.set(s, c.set(n, t)), s = `${i}-${e}`;
  const a = r.get(s) || /* @__PURE__ */ new Map();
  if (r.set(s, a.set(n, t)), o) {
    s = `${i}-${e}-${o}`;
    const l = r.get(s) || /* @__PURE__ */ new Map();
    r.set(s, l.set(n, t));
  }
}
function ra(e, t, n) {
  e.clear(), t.clear();
  for (const r of n) {
    const { source: i, target: o, sourceHandle: s = null, targetHandle: c = null } = r, a = { edgeId: r.id, source: i, target: o, sourceHandle: s, targetHandle: c }, l = `${i}-${s}--${o}-${c}`, d = `${o}-${c}--${i}-${s}`;
    Yo("source", a, d, e, i, s), Yo("target", a, l, e, o, c), t.set(r.id, r);
  }
}
function ia(e, t) {
  if (!e.parentId)
    return !1;
  const n = t.get(e.parentId);
  return n ? n.selected ? !0 : ia(n, t) : !1;
}
function Go(e, t, n) {
  var i;
  let r = e;
  do {
    if ((i = r == null ? void 0 : r.matches) != null && i.call(r, t))
      return !0;
    if (r === n)
      return !1;
    r = r == null ? void 0 : r.parentElement;
  } while (r);
  return !1;
}
function qg(e, t, n, r) {
  var o, s;
  const i = /* @__PURE__ */ new Map();
  for (const [c, a] of e)
    if ((a.selected || a.id === r) && (!a.parentId || !ia(a, e)) && (a.draggable || t && typeof a.draggable > "u")) {
      const l = e.get(c);
      l && i.set(c, {
        id: c,
        position: l.position || { x: 0, y: 0 },
        distance: {
          x: n.x - l.internals.positionAbsolute.x,
          y: n.y - l.internals.positionAbsolute.y
        },
        extent: l.extent,
        parentId: l.parentId,
        origin: l.origin,
        expandParent: l.expandParent,
        internals: {
          positionAbsolute: l.internals.positionAbsolute || { x: 0, y: 0 }
        },
        measured: {
          width: (o = l.measured.width) != null ? o : 0,
          height: (s = l.measured.height) != null ? s : 0
        }
      });
    }
  return i;
}
function Mr({ nodeId: e, dragItems: t, nodeLookup: n, dragging: r = !0 }) {
  var s, c, a;
  const i = [];
  for (const [l, d] of t) {
    const u = (s = n.get(l)) == null ? void 0 : s.internals.userNode;
    u && i.push({
      ...u,
      position: d.position,
      dragging: r
    });
  }
  if (!e)
    return [i[0], i];
  const o = (c = n.get(e)) == null ? void 0 : c.internals.userNode;
  return [
    o ? {
      ...o,
      position: ((a = t.get(e)) == null ? void 0 : a.position) || o.position,
      dragging: r
    } : i[0],
    i
  ];
}
function jg({ dragItems: e, snapGrid: t, x: n, y: r }) {
  const i = e.values().next().value;
  if (!i)
    return null;
  const o = {
    x: n - i.distance.x,
    y: r - i.distance.y
  }, s = un(o, t);
  return {
    x: s.x - o.x,
    y: s.y - o.y
  };
}
function Qg({ onNodeMouseDown: e, getStoreItems: t, onDragStart: n, onDrag: r, onDragStop: i }) {
  let o = { x: null, y: null }, s = 0, c = /* @__PURE__ */ new Map(), a = !1, l = { x: 0, y: 0 }, d = null, u = !1, f = null, g = !1, p = !1, h = null;
  function w({ noDragClassName: C, handleSelector: m, domNode: v, isSelectable: _, nodeId: b, nodeClickDistance: M = 0 }) {
    f = Ne(v);
    function L({ x: O, y: D }) {
      const { nodeLookup: x, nodeExtent: T, snapGrid: S, snapToGrid: A, nodeOrigin: E, onNodeDrag: N, onSelectionDrag: P, onError: R, updateNodePositions: F } = t();
      o = { x: O, y: D };
      let z = !1;
      const H = c.size > 1, Z = H && T ? ri(ln(c)) : null, X = H && A ? jg({
        dragItems: c,
        snapGrid: S,
        x: O,
        y: D
      }) : null;
      for (const [W, U] of c) {
        if (!x.has(W))
          continue;
        let G = { x: O - U.distance.x, y: D - U.distance.y };
        A && (G = X ? {
          x: Math.round(G.x + X.x),
          y: Math.round(G.y + X.y)
        } : un(G, S));
        let j = null;
        if (H && T && !U.extent && Z) {
          const { positionAbsolute: q } = U.internals, K = q.x - Z.x + T[0][0], re = q.x + U.measured.width - Z.x2 + T[1][0], ce = q.y - Z.y + T[0][1], se = q.y + U.measured.height - Z.y2 + T[1][1];
          j = [
            [K, ce],
            [re, se]
          ];
        }
        const { position: B, positionAbsolute: ee } = Bc({
          nodeId: W,
          nextPosition: G,
          nodeLookup: x,
          nodeExtent: j || T,
          nodeOrigin: E,
          onError: R
        });
        z = z || U.position.x !== B.x || U.position.y !== B.y, U.position = B, U.internals.positionAbsolute = ee;
      }
      if (p = p || z, !!z && (F(c, !0), h && (r || N || !b && P))) {
        const [W, U] = Mr({
          nodeId: b,
          dragItems: c,
          nodeLookup: x
        });
        r == null || r(h, c, W, U), N == null || N(h, W, U), b || P == null || P(h, U);
      }
    }
    async function $() {
      var E, N;
      if (!d)
        return;
      const { transform: O, panBy: D, autoPanSpeed: x, autoPanOnNodeDrag: T } = t();
      if (!T) {
        a = !1, cancelAnimationFrame(s);
        return;
      }
      const [S, A] = Wc(l, d, x);
      (S !== 0 || A !== 0) && (o.x = ((E = o.x) != null ? E : 0) - S / O[2], o.y = ((N = o.y) != null ? N : 0) - A / O[2], await D({ x: S, y: A }) && L(o)), s = requestAnimationFrame($);
    }
    function V(O) {
      var H;
      const { nodeLookup: D, multiSelectionActive: x, nodesDraggable: T, transform: S, snapGrid: A, snapToGrid: E, selectNodesOnDrag: N, onNodeDragStart: P, onSelectionDragStart: R, unselectNodesAndEdges: F } = t();
      u = !0, (!N || !_) && !x && b && ((H = D.get(b)) != null && H.selected || F()), _ && N && b && (e == null || e(b));
      const z = Zt(O.sourceEvent, { transform: S, snapGrid: A, snapToGrid: E, containerBounds: d });
      if (o = z, c = qg(D, T, z, b), c.size > 0 && (n || P || !b && R)) {
        const [Z, X] = Mr({
          nodeId: b,
          dragItems: c,
          nodeLookup: D
        });
        n == null || n(O.sourceEvent, c, Z, X), P == null || P(O.sourceEvent, Z, X), b || R == null || R(O.sourceEvent, X);
      }
    }
    const k = _c().clickDistance(M).on("start", (O) => {
      const { domNode: D, nodeDragThreshold: x, transform: T, snapGrid: S, snapToGrid: A } = t();
      d = (D == null ? void 0 : D.getBoundingClientRect()) || null, g = !1, p = !1, h = O.sourceEvent, x === 0 && V(O), o = Zt(O.sourceEvent, { transform: T, snapGrid: S, snapToGrid: A, containerBounds: d }), l = ke(O.sourceEvent, d);
    }).on("drag", (O) => {
      const { autoPanOnNodeDrag: D, transform: x, snapGrid: T, snapToGrid: S, nodeDragThreshold: A, nodeLookup: E } = t(), N = Zt(O.sourceEvent, { transform: x, snapGrid: T, snapToGrid: S, containerBounds: d });
      if (h = O.sourceEvent, (O.sourceEvent.type === "touchmove" && O.sourceEvent.touches.length > 1 || // if user deletes a node while dragging, we need to abort the drag to prevent errors
      b && !E.has(b)) && (g = !0), !g) {
        if (!a && D && u && (a = !0, $()), !u) {
          const P = ke(O.sourceEvent, d), R = P.x - l.x, F = P.y - l.y;
          Math.sqrt(R * R + F * F) > A && V(O);
        }
        (o.x !== N.xSnapped || o.y !== N.ySnapped) && c && u && (l = ke(O.sourceEvent, d), L(N));
      }
    }).on("end", (O) => {
      if (!(!u || g) && (a = !1, u = !1, cancelAnimationFrame(s), c.size > 0)) {
        const { nodeLookup: D, updateNodePositions: x, onNodeDragStop: T, onSelectionDragStop: S } = t();
        if (p && (x(c, !1), p = !1), i || T || !b && S) {
          const [A, E] = Mr({
            nodeId: b,
            dragItems: c,
            nodeLookup: D,
            dragging: !1
          });
          i == null || i(O.sourceEvent, c, A, E), T == null || T(O.sourceEvent, A, E), b || S == null || S(O.sourceEvent, E);
        }
      }
    }).filter((O) => {
      const D = O.target;
      return !O.button && (!C || !Go(D, `.${C}`, v)) && (!m || Go(D, m, v));
    });
    f.call(k);
  }
  function y() {
    f == null || f.on(".drag", null);
  }
  return {
    update: w,
    destroy: y
  };
}
function Jg(e, t, n) {
  const r = [], i = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const o of t.values())
    Jt(i, $t(o)) > 0 && r.push(o);
  return r;
}
const ep = 250;
function tp(e, t, n, r) {
  var c, a, l, d, u;
  let i = [], o = 1 / 0;
  const s = Jg(e, n, t + ep);
  for (const f of s) {
    const g = [...(a = (c = f.internals.handleBounds) == null ? void 0 : c.source) != null ? a : [], ...(d = (l = f.internals.handleBounds) == null ? void 0 : l.target) != null ? d : []];
    for (const p of g) {
      if (r.nodeId === p.nodeId && r.type === p.type && r.id === p.id)
        continue;
      const { x: h, y: w } = tn(f, p, p.position, !0), y = Math.sqrt(Math.pow(h - e.x, 2) + Math.pow(w - e.y, 2));
      y > t || (y < o ? (i = [{ ...p, x: h, y: w }], o = y) : y === o && i.push({ ...p, x: h, y: w }));
    }
  }
  if (!i.length)
    return null;
  if (i.length > 1) {
    const f = r.type === "source" ? "target" : "source";
    return (u = i.find((g) => g.type === f)) != null ? u : i[0];
  }
  return i[0];
}
function oa(e, t, n, r, i, o = !1) {
  var l, d, u, f, g, p;
  const s = r.get(e);
  if (!s)
    return null;
  const c = i === "strict" ? (l = s.internals.handleBounds) == null ? void 0 : l[t] : [...(u = (d = s.internals.handleBounds) == null ? void 0 : d.source) != null ? u : [], ...(g = (f = s.internals.handleBounds) == null ? void 0 : f.target) != null ? g : []], a = (p = n ? c == null ? void 0 : c.find((h) => h.id === n) : c == null ? void 0 : c[0]) != null ? p : null;
  return a && o ? { ...a, ...tn(s, a, a.position, !0) } : a;
}
function sa(e, t) {
  return e || (t != null && t.classList.contains("target") ? "target" : t != null && t.classList.contains("source") ? "source" : null);
}
function np(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
const ca = () => !0;
function rp(e, { connectionMode: t, connectionRadius: n, handleId: r, nodeId: i, edgeUpdaterType: o, isTarget: s, domNode: c, nodeLookup: a, lib: l, autoPanOnConnect: d, flowId: u, panBy: f, cancelConnection: g, onConnectStart: p, onConnect: h, onConnectEnd: w, isValidConnection: y = ca, onReconnectEnd: C, updateConnection: m, getTransform: v, getFromHandle: _, autoPanSpeed: b, dragThreshold: M = 1, handleDomNode: L }) {
  const $ = Gc(e.target);
  let V = 0, k;
  const { x: O, y: D } = ke(e), x = sa(o, L), T = c == null ? void 0 : c.getBoundingClientRect();
  let S = !1;
  if (!T || !x)
    return;
  const A = oa(i, x, r, a, t);
  if (!A)
    return;
  let E = ke(e, T), N = !1, P = null, R = !1, F = null;
  function z() {
    if (!d || !T)
      return;
    const [B, ee] = Wc(E, T, b);
    f({ x: B, y: ee }), V = requestAnimationFrame(z);
  }
  const H = {
    ...A,
    nodeId: i,
    type: x,
    position: A.position
  }, Z = a.get(i);
  let W = {
    inProgress: !0,
    isValid: null,
    from: tn(Z, H, Y.Left, !0),
    fromHandle: H,
    fromPosition: H.position,
    fromNode: Z,
    to: E,
    toHandle: null,
    toPosition: Do[H.position],
    toNode: null,
    pointer: E
  };
  function U() {
    S = !0, m(W), p == null || p(e, { nodeId: i, handleId: r, handleType: x });
  }
  M === 0 && U();
  function G(B) {
    if (!S) {
      const { x: re, y: ce } = ke(B), se = re - O, oe = ce - D;
      if (!(se * se + oe * oe > M * M))
        return;
      U();
    }
    if (!_() || !H) {
      j(B);
      return;
    }
    const ee = v();
    E = ke(B, T), k = tp(fn(E, ee, !1, [1, 1]), n, a, H), N || (z(), N = !0);
    const q = aa(B, {
      handle: k,
      connectionMode: t,
      fromNodeId: i,
      fromHandleId: r,
      fromType: s ? "target" : "source",
      isValidConnection: y,
      doc: $,
      lib: l,
      flowId: u,
      nodeLookup: a
    });
    F = q.handleDomNode, P = q.connection, R = np(!!k, q.isValid);
    const K = {
      // from stays the same
      ...W,
      isValid: R,
      to: q.toHandle && R ? Bn({ x: q.toHandle.x, y: q.toHandle.y }, ee) : E,
      toHandle: q.toHandle,
      toPosition: R && q.toHandle ? q.toHandle.position : Do[H.position],
      toNode: q.toHandle ? a.get(q.toHandle.nodeId) : null,
      pointer: E
    };
    m(K), W = K;
  }
  function j(B) {
    if (!("touches" in B && B.touches.length > 0)) {
      if (S) {
        (k || F) && P && R && (h == null || h(P));
        const { inProgress: ee, ...q } = W, K = {
          ...q,
          toPosition: W.toHandle ? W.toPosition : null
        };
        w == null || w(B, K), o && (C == null || C(B, K));
      }
      g(), cancelAnimationFrame(V), N = !1, R = !1, P = null, F = null, $.removeEventListener("mousemove", G), $.removeEventListener("mouseup", j), $.removeEventListener("touchmove", G), $.removeEventListener("touchend", j);
    }
  }
  $.addEventListener("mousemove", G), $.addEventListener("mouseup", j), $.addEventListener("touchmove", G), $.addEventListener("touchend", j);
}
function aa(e, { handle: t, connectionMode: n, fromNodeId: r, fromHandleId: i, fromType: o, doc: s, lib: c, flowId: a, isValidConnection: l = ca, nodeLookup: d }) {
  const u = o === "target", f = t ? s.querySelector(`.${c}-flow__handle[data-id="${a}-${t == null ? void 0 : t.nodeId}-${t == null ? void 0 : t.id}-${t == null ? void 0 : t.type}"]`) : null, { x: g, y: p } = ke(e), h = s.elementFromPoint(g, p), w = h != null && h.classList.contains(`${c}-flow__handle`) ? h : f, y = {
    handleDomNode: w,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (w) {
    const C = sa(void 0, w), m = w.getAttribute("data-nodeid"), v = w.getAttribute("data-handleid"), _ = w.classList.contains("connectable"), b = w.classList.contains("connectableend");
    if (!m || !C)
      return y;
    const M = {
      source: u ? m : r,
      sourceHandle: u ? v : i,
      target: u ? r : m,
      targetHandle: u ? i : v
    };
    y.connection = M;
    const $ = _ && b && (n === At.Strict ? u && C === "source" || !u && C === "target" : m !== r || v !== i);
    y.isValid = $ && l(M), y.toHandle = oa(m, C, v, d, n, !0);
  }
  return y;
}
const ci = {
  onPointerDown: rp,
  isValid: aa
};
function ip({ domNode: e, panZoom: t, getTransform: n, getViewScale: r }) {
  const i = Ne(e);
  function o({ translateExtent: c, width: a, height: l, zoomStep: d = 1, pannable: u = !0, zoomable: f = !0, inversePan: g = !1 }) {
    const p = (m) => {
      if (m.sourceEvent.type !== "wheel" || !t)
        return;
      const v = n(), _ = m.sourceEvent.ctrlKey && en() ? 10 : 1, b = -m.sourceEvent.deltaY * (m.sourceEvent.deltaMode === 1 ? 0.05 : m.sourceEvent.deltaMode ? 1 : 2e-3) * d, M = v[2] * Math.pow(2, b * _);
      t.scaleTo(M);
    };
    let h = [0, 0];
    const w = (m) => {
      var v, _;
      (m.sourceEvent.type === "mousedown" || m.sourceEvent.type === "touchstart") && (h = [
        (v = m.sourceEvent.clientX) != null ? v : m.sourceEvent.touches[0].clientX,
        (_ = m.sourceEvent.clientY) != null ? _ : m.sourceEvent.touches[0].clientY
      ]);
    }, y = (m) => {
      var V, k;
      const v = n();
      if (m.sourceEvent.type !== "mousemove" && m.sourceEvent.type !== "touchmove" || !t)
        return;
      const _ = [
        (V = m.sourceEvent.clientX) != null ? V : m.sourceEvent.touches[0].clientX,
        (k = m.sourceEvent.clientY) != null ? k : m.sourceEvent.touches[0].clientY
      ], b = [_[0] - h[0], _[1] - h[1]];
      h = _;
      const M = r() * Math.max(v[2], Math.log(v[2])) * (g ? -1 : 1), L = {
        x: v[0] - b[0] * M,
        y: v[1] - b[1] * M
      }, $ = [
        [0, 0],
        [a, l]
      ];
      t.setViewportConstrained({
        x: L.x,
        y: L.y,
        zoom: v[2]
      }, $, c);
    }, C = Dc().on("start", w).on("zoom", u ? y : null).on("zoom.wheel", f ? p : null);
    i.call(C, {});
  }
  function s() {
    i.on("zoom", null);
  }
  return {
    update: o,
    destroy: s,
    pointer: Le
  };
}
const ar = (e) => ({
  x: e.x,
  y: e.y,
  zoom: e.k
}), Ar = ({ x: e, y: t, zoom: n }) => or.translate(e, t).scale(n), _t = (e, t) => e.target.closest(`.${t}`), la = (e, t) => t === 2 && Array.isArray(e) && e.includes(2), op = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2, Lr = (e, t = 0, n = op, r = () => {
}) => {
  const i = typeof t == "number" && t > 0;
  return i || r(), i ? e.transition().duration(t).ease(n).on("end", r) : e;
}, ua = (e) => {
  const t = e.ctrlKey && en() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
};
function sp({ zoomPanValues: e, noWheelClassName: t, d3Selection: n, d3Zoom: r, panOnScrollMode: i, panOnScrollSpeed: o, zoomOnPinch: s, onPanZoomStart: c, onPanZoom: a, onPanZoomEnd: l }) {
  return (d) => {
    if (_t(d, t))
      return d.ctrlKey && d.preventDefault(), !1;
    d.preventDefault(), d.stopImmediatePropagation();
    const u = n.property("__zoom").k || 1;
    if (d.ctrlKey && s) {
      const w = Le(d), y = ua(d), C = u * Math.pow(2, y);
      r.scaleTo(n, C, w, d);
      return;
    }
    const f = d.deltaMode === 1 ? 20 : 1;
    let g = i === ft.Vertical ? 0 : d.deltaX * f, p = i === ft.Horizontal ? 0 : d.deltaY * f;
    !en() && d.shiftKey && i !== ft.Vertical && (g = d.deltaY * f, p = 0), r.translateBy(
      n,
      -(g / u) * o,
      -(p / u) * o,
      // @ts-ignore
      { internal: !0 }
    );
    const h = ar(n.property("__zoom"));
    clearTimeout(e.panScrollTimeout), e.isPanScrolling ? (a == null || a(d, h), e.panScrollTimeout = setTimeout(() => {
      l == null || l(d, h), e.isPanScrolling = !1;
    }, 150)) : (e.isPanScrolling = !0, c == null || c(d, h));
  };
}
function cp({ noWheelClassName: e, preventScrolling: t, d3ZoomHandler: n }) {
  return function(r, i) {
    const o = r.type === "wheel", s = !t && o && !r.ctrlKey, c = _t(r, e);
    if (r.ctrlKey && o && c && r.preventDefault(), s || c)
      return null;
    r.preventDefault(), n.call(this, r, i);
  };
}
function ap({ zoomPanValues: e, onDraggingChange: t, onPanZoomStart: n }) {
  return (r) => {
    var o, s, c;
    if ((o = r.sourceEvent) != null && o.internal)
      return;
    const i = ar(r.transform);
    e.mouseButton = ((s = r.sourceEvent) == null ? void 0 : s.button) || 0, e.isZoomingOrPanning = !0, e.prevViewport = i, ((c = r.sourceEvent) == null ? void 0 : c.type) === "mousedown" && t(!0), n && (n == null || n(r.sourceEvent, i));
  };
}
function lp({ zoomPanValues: e, panOnDrag: t, onPaneContextMenu: n, onTransformChange: r, onPanZoom: i }) {
  return (o) => {
    var s, c, a;
    e.usedRightMouseButton = !!(n && la(t, (s = e.mouseButton) != null ? s : 0)), (c = o.sourceEvent) != null && c.sync || r([o.transform.x, o.transform.y, o.transform.k]), i && !((a = o.sourceEvent) != null && a.internal) && (i == null || i(o.sourceEvent, ar(o.transform)));
  };
}
function up({ zoomPanValues: e, panOnDrag: t, panOnScroll: n, onDraggingChange: r, onPanZoomEnd: i, onPaneContextMenu: o }) {
  return (s) => {
    var c, a;
    if (!((c = s.sourceEvent) != null && c.internal) && (e.isZoomingOrPanning = !1, o && la(t, (a = e.mouseButton) != null ? a : 0) && !e.usedRightMouseButton && s.sourceEvent && o(s.sourceEvent), e.usedRightMouseButton = !1, r(!1), i)) {
      const l = ar(s.transform);
      e.prevViewport = l, clearTimeout(e.timerId), e.timerId = setTimeout(
        () => {
          i == null || i(s.sourceEvent, l);
        },
        // we need a setTimeout for panOnScroll to supress multiple end events fired during scroll
        n ? 150 : 0
      );
    }
  };
}
function fp({ zoomActivationKeyPressed: e, zoomOnScroll: t, zoomOnPinch: n, panOnDrag: r, panOnScroll: i, zoomOnDoubleClick: o, userSelectionActive: s, noWheelClassName: c, noPanClassName: a, lib: l, connectionInProgress: d }) {
  return (u) => {
    var w;
    const f = e || t, g = n && u.ctrlKey, p = u.type === "wheel";
    if (u.button === 1 && u.type === "mousedown" && (_t(u, `${l}-flow__node`) || _t(u, `${l}-flow__edge`)))
      return !0;
    if (!r && !f && !i && !o && !n || s || d && !p || _t(u, c) && p || _t(u, a) && (!p || i && p && !e) || !n && u.ctrlKey && p)
      return !1;
    if (!n && u.type === "touchstart" && ((w = u.touches) == null ? void 0 : w.length) > 1)
      return u.preventDefault(), !1;
    if (!f && !i && !g && p || !r && (u.type === "mousedown" || u.type === "touchstart") || Array.isArray(r) && !r.includes(u.button) && u.type === "mousedown")
      return !1;
    const h = Array.isArray(r) && r.includes(u.button) || !u.button || u.button <= 1;
    return (!u.ctrlKey || p) && h;
  };
}
function dp({ domNode: e, minZoom: t, maxZoom: n, translateExtent: r, viewport: i, onPanZoom: o, onPanZoomStart: s, onPanZoomEnd: c, onDraggingChange: a }) {
  const l = {
    isZoomingOrPanning: !1,
    usedRightMouseButton: !1,
    prevViewport: {},
    mouseButton: 0,
    timerId: void 0,
    panScrollTimeout: void 0,
    isPanScrolling: !1
  }, d = e.getBoundingClientRect(), u = Dc().scaleExtent([t, n]).translateExtent(r), f = Ne(e).call(u);
  C({
    x: i.x,
    y: i.y,
    zoom: Lt(i.zoom, t, n)
  }, [
    [0, 0],
    [d.width, d.height]
  ], r);
  const g = f.on("wheel.zoom"), p = f.on("dblclick.zoom");
  u.wheelDelta(ua);
  function h(k, O) {
    return f ? new Promise((D) => {
      u == null || u.interpolate((O == null ? void 0 : O.interpolate) === "linear" ? Wt : Mn).transform(Lr(f, O == null ? void 0 : O.duration, O == null ? void 0 : O.ease, () => D(!0)), k);
    }) : Promise.resolve(!1);
  }
  function w({ noWheelClassName: k, noPanClassName: O, onPaneContextMenu: D, userSelectionActive: x, panOnScroll: T, panOnDrag: S, panOnScrollMode: A, panOnScrollSpeed: E, preventScrolling: N, zoomOnPinch: P, zoomOnScroll: R, zoomOnDoubleClick: F, zoomActivationKeyPressed: z, lib: H, onTransformChange: Z, connectionInProgress: X, paneClickDistance: W, selectionOnDrag: U }) {
    x && !l.isZoomingOrPanning && y();
    const G = T && !z && !x;
    u.clickDistance(U ? 1 / 0 : !Te(W) || W < 0 ? 0 : W);
    const j = G ? sp({
      zoomPanValues: l,
      noWheelClassName: k,
      d3Selection: f,
      d3Zoom: u,
      panOnScrollMode: A,
      panOnScrollSpeed: E,
      zoomOnPinch: P,
      onPanZoomStart: s,
      onPanZoom: o,
      onPanZoomEnd: c
    }) : cp({
      noWheelClassName: k,
      preventScrolling: N,
      d3ZoomHandler: g
    });
    if (f.on("wheel.zoom", j, { passive: !1 }), !x) {
      const ee = ap({
        zoomPanValues: l,
        onDraggingChange: a,
        onPanZoomStart: s
      });
      u.on("start", ee);
      const q = lp({
        zoomPanValues: l,
        panOnDrag: S,
        onPaneContextMenu: !!D,
        onPanZoom: o,
        onTransformChange: Z
      });
      u.on("zoom", q);
      const K = up({
        zoomPanValues: l,
        panOnDrag: S,
        panOnScroll: T,
        onPaneContextMenu: D,
        onPanZoomEnd: c,
        onDraggingChange: a
      });
      u.on("end", K);
    }
    const B = fp({
      zoomActivationKeyPressed: z,
      panOnDrag: S,
      zoomOnScroll: R,
      panOnScroll: T,
      zoomOnDoubleClick: F,
      zoomOnPinch: P,
      userSelectionActive: x,
      noPanClassName: O,
      noWheelClassName: k,
      lib: H,
      connectionInProgress: X
    });
    u.filter(B), F ? f.on("dblclick.zoom", p) : f.on("dblclick.zoom", null);
  }
  function y() {
    u.on("zoom", null);
  }
  async function C(k, O, D) {
    const x = Ar(k), T = u == null ? void 0 : u.constrain()(x, O, D);
    return T && await h(T), new Promise((S) => S(T));
  }
  async function m(k, O) {
    const D = Ar(k);
    return await h(D, O), new Promise((x) => x(D));
  }
  function v(k) {
    if (f) {
      const O = Ar(k), D = f.property("__zoom");
      (D.k !== k.zoom || D.x !== k.x || D.y !== k.y) && (u == null || u.transform(f, O, null, { sync: !0 }));
    }
  }
  function _() {
    const k = f ? Pc(f.node()) : { x: 0, y: 0, k: 1 };
    return { x: k.x, y: k.y, zoom: k.k };
  }
  function b(k, O) {
    return f ? new Promise((D) => {
      u == null || u.interpolate((O == null ? void 0 : O.interpolate) === "linear" ? Wt : Mn).scaleTo(Lr(f, O == null ? void 0 : O.duration, O == null ? void 0 : O.ease, () => D(!0)), k);
    }) : Promise.resolve(!1);
  }
  function M(k, O) {
    return f ? new Promise((D) => {
      u == null || u.interpolate((O == null ? void 0 : O.interpolate) === "linear" ? Wt : Mn).scaleBy(Lr(f, O == null ? void 0 : O.duration, O == null ? void 0 : O.ease, () => D(!0)), k);
    }) : Promise.resolve(!1);
  }
  function L(k) {
    u == null || u.scaleExtent(k);
  }
  function $(k) {
    u == null || u.translateExtent(k);
  }
  function V(k) {
    const O = !Te(k) || k < 0 ? 0 : k;
    u == null || u.clickDistance(O);
  }
  return {
    update: w,
    destroy: y,
    setViewport: m,
    setViewportConstrained: C,
    getViewport: _,
    scaleTo: b,
    scaleBy: M,
    setScaleExtent: L,
    setTranslateExtent: $,
    syncViewport: v,
    setClickDistance: V
  };
}
var pt;
(function(e) {
  e.Line = "line", e.Handle = "handle";
})(pt || (pt = {}));
const hp = ["top-left", "top-right", "bottom-left", "bottom-right"], gp = ["top", "right", "bottom", "left"];
function pp({ width: e, prevWidth: t, height: n, prevHeight: r, affectsX: i, affectsY: o }) {
  const s = e - t, c = n - r, a = [s > 0 ? 1 : s < 0 ? -1 : 0, c > 0 ? 1 : c < 0 ? -1 : 0];
  return s && i && (a[0] = a[0] * -1), c && o && (a[1] = a[1] * -1), a;
}
function Ko(e) {
  const t = e.includes("right") || e.includes("left"), n = e.includes("bottom") || e.includes("top"), r = e.includes("left"), i = e.includes("top");
  return {
    isHorizontal: t,
    isVertical: n,
    affectsX: r,
    affectsY: i
  };
}
function qe(e, t) {
  return Math.max(0, t - e);
}
function je(e, t) {
  return Math.max(0, e - t);
}
function _n(e, t, n) {
  return Math.max(0, t - e, e - n);
}
function qo(e, t) {
  return e ? !t : t;
}
function mp(e, t, n, r, i, o, s, c) {
  let { affectsX: a, affectsY: l } = t;
  const { isHorizontal: d, isVertical: u } = t, f = d && u, { xSnapped: g, ySnapped: p } = n, { minWidth: h, maxWidth: w, minHeight: y, maxHeight: C } = r, { x: m, y: v, width: _, height: b, aspectRatio: M } = e;
  let L = Math.floor(d ? g - e.pointerX : 0), $ = Math.floor(u ? p - e.pointerY : 0);
  const V = _ + (a ? -L : L), k = b + (l ? -$ : $), O = -o[0] * _, D = -o[1] * b;
  let x = _n(V, h, w), T = _n(k, y, C);
  if (s) {
    let E = 0, N = 0;
    a && L < 0 ? E = qe(m + L + O, s[0][0]) : !a && L > 0 && (E = je(m + V + O, s[1][0])), l && $ < 0 ? N = qe(v + $ + D, s[0][1]) : !l && $ > 0 && (N = je(v + k + D, s[1][1])), x = Math.max(x, E), T = Math.max(T, N);
  }
  if (c) {
    let E = 0, N = 0;
    a && L > 0 ? E = je(m + L, c[0][0]) : !a && L < 0 && (E = qe(m + V, c[1][0])), l && $ > 0 ? N = je(v + $, c[0][1]) : !l && $ < 0 && (N = qe(v + k, c[1][1])), x = Math.max(x, E), T = Math.max(T, N);
  }
  if (i) {
    if (d) {
      const E = _n(V / M, y, C) * M;
      if (x = Math.max(x, E), s) {
        let N = 0;
        !a && !l || a && !l && f ? N = je(v + D + V / M, s[1][1]) * M : N = qe(v + D + (a ? L : -L) / M, s[0][1]) * M, x = Math.max(x, N);
      }
      if (c) {
        let N = 0;
        !a && !l || a && !l && f ? N = qe(v + V / M, c[1][1]) * M : N = je(v + (a ? L : -L) / M, c[0][1]) * M, x = Math.max(x, N);
      }
    }
    if (u) {
      const E = _n(k * M, h, w) / M;
      if (T = Math.max(T, E), s) {
        let N = 0;
        !a && !l || l && !a && f ? N = je(m + k * M + O, s[1][0]) / M : N = qe(m + (l ? $ : -$) * M + O, s[0][0]) / M, T = Math.max(T, N);
      }
      if (c) {
        let N = 0;
        !a && !l || l && !a && f ? N = qe(m + k * M, c[1][0]) / M : N = je(m + (l ? $ : -$) * M, c[0][0]) / M, T = Math.max(T, N);
      }
    }
  }
  $ = $ + ($ < 0 ? T : -T), L = L + (L < 0 ? x : -x), i && (f ? V > k * M ? $ = (qo(a, l) ? -L : L) / M : L = (qo(a, l) ? -$ : $) * M : d ? ($ = L / M, l = a) : (L = $ * M, a = l));
  const S = a ? m + L : m, A = l ? v + $ : v;
  return {
    width: _ + (a ? -L : L),
    height: b + (l ? -$ : $),
    x: o[0] * L * (a ? -1 : 1) + S,
    y: o[1] * $ * (l ? -1 : 1) + A
  };
}
const fa = { width: 0, height: 0, x: 0, y: 0 }, yp = {
  ...fa,
  pointerX: 0,
  pointerY: 0,
  aspectRatio: 1
};
function vp(e) {
  return [
    [0, 0],
    [e.measured.width, e.measured.height]
  ];
}
function wp(e, t, n) {
  var l, d;
  const r = t.position.x + e.position.x, i = t.position.y + e.position.y, o = (l = e.measured.width) != null ? l : 0, s = (d = e.measured.height) != null ? d : 0, c = n[0] * o, a = n[1] * s;
  return [
    [r - c, i - a],
    [r + o - c, i + s - a]
  ];
}
function xp({ domNode: e, nodeId: t, getStoreItems: n, onChange: r, onEnd: i }) {
  const o = Ne(e);
  let s = {
    controlDirection: Ko("bottom-right"),
    boundaries: {
      minWidth: 0,
      minHeight: 0,
      maxWidth: Number.MAX_VALUE,
      maxHeight: Number.MAX_VALUE
    },
    resizeDirection: void 0,
    keepAspectRatio: !1
  };
  function c({ controlPosition: l, boundaries: d, keepAspectRatio: u, resizeDirection: f, onResizeStart: g, onResize: p, onResizeEnd: h, shouldResize: w }) {
    let y = { ...fa }, C = { ...yp };
    s = {
      boundaries: d,
      resizeDirection: f,
      keepAspectRatio: u,
      controlDirection: Ko(l)
    };
    let m, v = null, _ = [], b, M, L, $ = !1;
    const V = _c().on("start", (k) => {
      var P, R, F, z, H, Z;
      const { nodeLookup: O, transform: D, snapGrid: x, snapToGrid: T, nodeOrigin: S, paneDomNode: A } = n();
      if (m = O.get(t), !m)
        return;
      v = (P = A == null ? void 0 : A.getBoundingClientRect()) != null ? P : null;
      const { xSnapped: E, ySnapped: N } = Zt(k.sourceEvent, {
        transform: D,
        snapGrid: x,
        snapToGrid: T,
        containerBounds: v
      });
      y = {
        width: (R = m.measured.width) != null ? R : 0,
        height: (F = m.measured.height) != null ? F : 0,
        x: (z = m.position.x) != null ? z : 0,
        y: (H = m.position.y) != null ? H : 0
      }, C = {
        ...y,
        pointerX: E,
        pointerY: N,
        aspectRatio: y.width / y.height
      }, b = void 0, m.parentId && (m.extent === "parent" || m.expandParent) && (b = O.get(m.parentId), M = b && m.extent === "parent" ? vp(b) : void 0), _ = [], L = void 0;
      for (const [X, W] of O)
        if (W.parentId === t && (_.push({
          id: X,
          position: { ...W.position },
          extent: W.extent
        }), W.extent === "parent" || W.expandParent)) {
          const U = wp(W, m, (Z = W.origin) != null ? Z : S);
          L ? L = [
            [Math.min(U[0][0], L[0][0]), Math.min(U[0][1], L[0][1])],
            [Math.max(U[1][0], L[1][0]), Math.max(U[1][1], L[1][1])]
          ] : L = U;
        }
      g == null || g(k, { ...y });
    }).on("drag", (k) => {
      var re, ce, se;
      const { transform: O, snapGrid: D, snapToGrid: x, nodeOrigin: T } = n(), S = Zt(k.sourceEvent, {
        transform: O,
        snapGrid: D,
        snapToGrid: x,
        containerBounds: v
      }), A = [];
      if (!m)
        return;
      const { x: E, y: N, width: P, height: R } = y, F = {}, z = (re = m.origin) != null ? re : T, { width: H, height: Z, x: X, y: W } = mp(C, s.controlDirection, S, s.boundaries, s.keepAspectRatio, z, M, L), U = H !== P, G = Z !== R, j = X !== E && U, B = W !== N && G;
      if (!j && !B && !U && !G)
        return;
      if ((j || B || z[0] === 1 || z[1] === 1) && (F.x = j ? X : y.x, F.y = B ? W : y.y, y.x = F.x, y.y = F.y, _.length > 0)) {
        const oe = X - E, _e = W - N;
        for (const Ae of _)
          Ae.position = {
            x: Ae.position.x - oe + z[0] * (H - P),
            y: Ae.position.y - _e + z[1] * (Z - R)
          }, A.push(Ae);
      }
      if ((U || G) && (F.width = U && (!s.resizeDirection || s.resizeDirection === "horizontal") ? H : y.width, F.height = G && (!s.resizeDirection || s.resizeDirection === "vertical") ? Z : y.height, y.width = F.width, y.height = F.height), b && m.expandParent) {
        const oe = z[0] * ((ce = F.width) != null ? ce : 0);
        F.x && F.x < oe && (y.x = oe, C.x = C.x - (F.x - oe));
        const _e = z[1] * ((se = F.height) != null ? se : 0);
        F.y && F.y < _e && (y.y = _e, C.y = C.y - (F.y - _e));
      }
      const ee = pp({
        width: y.width,
        prevWidth: P,
        height: y.height,
        prevHeight: R,
        affectsX: s.controlDirection.affectsX,
        affectsY: s.controlDirection.affectsY
      }), q = { ...y, direction: ee };
      (w == null ? void 0 : w(k, q)) !== !1 && ($ = !0, p == null || p(k, q), r(F, A));
    }).on("end", (k) => {
      $ && (h == null || h(k, { ...y }), i == null || i({ ...y }), $ = !1);
    });
    o.call(V);
  }
  function a() {
    o.on(".drag", null);
  }
  return {
    update: c,
    destroy: a
  };
}
function _p(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var $r = { exports: {} }, Tr = {}, kr = { exports: {} }, Or = {};
var jo;
function Cp() {
  if (jo) return Or;
  jo = 1;
  var e = _i;
  function t(u, f) {
    return u === f && (u !== 0 || 1 / u === 1 / f) || u !== u && f !== f;
  }
  var n = typeof Object.is == "function" ? Object.is : t, r = e.useState, i = e.useEffect, o = e.useLayoutEffect, s = e.useDebugValue;
  function c(u, f) {
    var g = f(), p = r({ inst: { value: g, getSnapshot: f } }), h = p[0].inst, w = p[1];
    return o(
      function() {
        h.value = g, h.getSnapshot = f, a(h) && w({ inst: h });
      },
      [u, g, f]
    ), i(
      function() {
        return a(h) && w({ inst: h }), u(function() {
          a(h) && w({ inst: h });
        });
      },
      [u]
    ), s(g), g;
  }
  function a(u) {
    var f = u.getSnapshot;
    u = u.value;
    try {
      var g = f();
      return !n(u, g);
    } catch {
      return !0;
    }
  }
  function l(u, f) {
    return f();
  }
  var d = typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u" ? l : c;
  return Or.useSyncExternalStore = e.useSyncExternalStore !== void 0 ? e.useSyncExternalStore : d, Or;
}
var Qo;
function bp() {
  return Qo || (Qo = 1, kr.exports = Cp()), kr.exports;
}
var Jo;
function Sp() {
  if (Jo) return Tr;
  Jo = 1;
  var e = _i, t = bp();
  function n(l, d) {
    return l === d && (l !== 0 || 1 / l === 1 / d) || l !== l && d !== d;
  }
  var r = typeof Object.is == "function" ? Object.is : n, i = t.useSyncExternalStore, o = e.useRef, s = e.useEffect, c = e.useMemo, a = e.useDebugValue;
  return Tr.useSyncExternalStoreWithSelector = function(l, d, u, f, g) {
    var p = o(null);
    if (p.current === null) {
      var h = { hasValue: !1, value: null };
      p.current = h;
    } else h = p.current;
    p = c(
      function() {
        function y(b) {
          if (!C) {
            if (C = !0, m = b, b = f(b), g !== void 0 && h.hasValue) {
              var M = h.value;
              if (g(M, b))
                return v = M;
            }
            return v = b;
          }
          if (M = v, r(m, b)) return M;
          var L = f(b);
          return g !== void 0 && g(M, L) ? (m = b, M) : (m = b, v = L);
        }
        var C = !1, m, v, _ = u === void 0 ? null : u;
        return [
          function() {
            return y(d());
          },
          _ === null ? void 0 : function() {
            return y(_());
          }
        ];
      },
      [d, u, f, g]
    );
    var w = i(l, p[0], p[1]);
    return s(
      function() {
        h.hasValue = !0, h.value = w;
      },
      [w]
    ), a(w), w;
  }, Tr;
}
var es;
function Np() {
  return es || (es = 1, $r.exports = Sp()), $r.exports;
}
var Ep = Np();
const Ip = /* @__PURE__ */ _p(Ep), Mp = {}, ts = (e) => {
  let t;
  const n = /* @__PURE__ */ new Set(), r = (d, u) => {
    const f = typeof d == "function" ? d(t) : d;
    if (!Object.is(f, t)) {
      const g = t;
      t = (u != null ? u : typeof f != "object" || f === null) ? f : Object.assign({}, t, f), n.forEach((p) => p(t, g));
    }
  }, i = () => t, a = { setState: r, getState: i, getInitialState: () => l, subscribe: (d) => (n.add(d), () => n.delete(d)), destroy: () => {
    (Mp ? "production" : void 0) !== "production" && console.warn(
      "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
    ), n.clear();
  } }, l = t = e(r, i, a);
  return a;
}, Ap = (e) => e ? ts(e) : ts, { useDebugValue: Lp } = _i, { useSyncExternalStoreWithSelector: $p } = Ip, Tp = (e) => e;
function da(e, t = Tp, n) {
  const r = $p(
    e.subscribe,
    e.getState,
    e.getServerState || e.getInitialState,
    t,
    n
  );
  return Lp(r), r;
}
const ns = (e, t) => {
  const n = Ap(e), r = (i, o = t) => da(n, i, o);
  return Object.assign(r, n), r;
}, kp = (e, t) => e ? ns(e, t) : ns;
function le(e, t) {
  if (Object.is(e, t))
    return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  if (e instanceof Map && t instanceof Map) {
    if (e.size !== t.size) return !1;
    for (const [r, i] of e)
      if (!Object.is(i, t.get(r)))
        return !1;
    return !0;
  }
  if (e instanceof Set && t instanceof Set) {
    if (e.size !== t.size) return !1;
    for (const r of e)
      if (!t.has(r))
        return !1;
    return !0;
  }
  const n = Object.keys(e);
  if (n.length !== Object.keys(t).length)
    return !1;
  for (const r of n)
    if (!Object.prototype.hasOwnProperty.call(t, r) || !Object.is(e[r], t[r]))
      return !1;
  return !0;
}
const lr = Ci(null), Op = lr.Provider, ha = ze.error001();
function ie(e, t) {
  const n = Ot(lr);
  if (n === null)
    throw new Error(ha);
  return da(n, e, t);
}
function ae() {
  const e = Ot(lr);
  if (e === null)
    throw new Error(ha);
  return ye(() => ({
    getState: e.getState,
    setState: e.setState,
    subscribe: e.subscribe
  }), [e]);
}
const rs = { display: "none" }, Pp = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
}, ga = "react-flow__node-desc", pa = "react-flow__edge-desc", Dp = "react-flow__aria-live", Rp = (e) => e.ariaLiveMessage, Fp = (e) => e.ariaLabelConfig;
function Vp({ rfId: e }) {
  const t = ie(Rp);
  return I("div", { id: `${Dp}-${e}`, "aria-live": "assertive", "aria-atomic": "true", style: Pp, children: t });
}
function Hp({ rfId: e, disableKeyboardA11y: t }) {
  const n = ie(Fp);
  return Q(De, { children: [I("div", { id: `${ga}-${e}`, style: rs, children: t ? n["node.a11yDescription.default"] : n["node.a11yDescription.keyboardDisabled"] }), I("div", { id: `${pa}-${e}`, style: rs, children: n["edge.a11yDescription.default"] }), !t && I(Vp, { rfId: e })] });
}
const ur = pe(({ position: e = "top-left", children: t, className: n, style: r, ...i }, o) => {
  const s = `${e}`.split("-");
  return I("div", { className: de(["react-flow__panel", n, ...s]), style: r, ref: o, ...i, children: t });
});
ur.displayName = "Panel";
function zp({ proOptions: e, position: t = "bottom-right" }) {
  return e != null && e.hideAttribution ? null : I(ur, { position: t, className: "react-flow__attribution", "data-message": "Please only hide this attribution when you are subscribed to React Flow Pro: https://pro.reactflow.dev", children: I("a", { href: "https://reactflow.dev", target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
const Bp = (e) => {
  const t = [], n = [];
  for (const [, r] of e.nodeLookup)
    r.selected && t.push(r.internals.userNode);
  for (const [, r] of e.edgeLookup)
    r.selected && n.push(r);
  return { selectedNodes: t, selectedEdges: n };
}, Cn = (e) => e.id;
function Up(e, t) {
  return le(e.selectedNodes.map(Cn), t.selectedNodes.map(Cn)) && le(e.selectedEdges.map(Cn), t.selectedEdges.map(Cn));
}
function Wp({ onSelectionChange: e }) {
  const t = ae(), { selectedNodes: n, selectedEdges: r } = ie(Bp, Up);
  return J(() => {
    const i = { nodes: n, edges: r };
    e == null || e(i), t.getState().onSelectionChangeHandlers.forEach((o) => o(i));
  }, [n, r, e]), null;
}
const Zp = (e) => !!e.onSelectionChangeHandlers;
function Xp({ onSelectionChange: e }) {
  const t = ie(Zp);
  return e || t ? I(Wp, { onSelectionChange: e }) : null;
}
const ma = [0, 0], Yp = { x: 0, y: 0, zoom: 1 }, Gp = [
  "nodes",
  "edges",
  "defaultNodes",
  "defaultEdges",
  "onConnect",
  "onConnectStart",
  "onConnectEnd",
  "onClickConnectStart",
  "onClickConnectEnd",
  "nodesDraggable",
  "autoPanOnNodeFocus",
  "nodesConnectable",
  "nodesFocusable",
  "edgesFocusable",
  "edgesReconnectable",
  "elevateNodesOnSelect",
  "elevateEdgesOnSelect",
  "minZoom",
  "maxZoom",
  "nodeExtent",
  "onNodesChange",
  "onEdgesChange",
  "elementsSelectable",
  "connectionMode",
  "snapGrid",
  "snapToGrid",
  "translateExtent",
  "connectOnClick",
  "defaultEdgeOptions",
  "fitView",
  "fitViewOptions",
  "onNodesDelete",
  "onEdgesDelete",
  "onDelete",
  "onNodeDrag",
  "onNodeDragStart",
  "onNodeDragStop",
  "onSelectionDrag",
  "onSelectionDragStart",
  "onSelectionDragStop",
  "onMoveStart",
  "onMove",
  "onMoveEnd",
  "noPanClassName",
  "nodeOrigin",
  "autoPanOnConnect",
  "autoPanOnNodeDrag",
  "onError",
  "connectionRadius",
  "isValidConnection",
  "selectNodesOnDrag",
  "nodeDragThreshold",
  "connectionDragThreshold",
  "onBeforeDelete",
  "debug",
  "autoPanSpeed",
  "ariaLabelConfig"
], is = [...Gp, "rfId"], Kp = (e) => ({
  setNodes: e.setNodes,
  setEdges: e.setEdges,
  setMinZoom: e.setMinZoom,
  setMaxZoom: e.setMaxZoom,
  setTranslateExtent: e.setTranslateExtent,
  setNodeExtent: e.setNodeExtent,
  reset: e.reset,
  setDefaultNodesAndEdges: e.setDefaultNodesAndEdges
}), os = {
  /*
   * these are values that are also passed directly to other components
   * than the StoreUpdater. We can reduce the number of setStore calls
   * by setting the same values here as prev fields.
   */
  translateExtent: jt,
  nodeOrigin: ma,
  minZoom: 0.5,
  maxZoom: 2,
  elementsSelectable: !0,
  noPanClassName: "nopan",
  rfId: "1"
};
function qp(e) {
  const { setNodes: t, setEdges: n, setMinZoom: r, setMaxZoom: i, setTranslateExtent: o, setNodeExtent: s, reset: c, setDefaultNodesAndEdges: a } = ie(Kp, le), l = ae();
  J(() => (a(e.defaultNodes, e.defaultEdges), () => {
    d.current = os, c();
  }), []);
  const d = ne(os);
  return J(
    () => {
      for (const u of is) {
        const f = e[u], g = d.current[u];
        f !== g && (typeof e[u] > "u" || (u === "nodes" ? t(f) : u === "edges" ? n(f) : u === "minZoom" ? r(f) : u === "maxZoom" ? i(f) : u === "translateExtent" ? o(f) : u === "nodeExtent" ? s(f) : u === "ariaLabelConfig" ? l.setState({ ariaLabelConfig: Lg(f) }) : u === "fitView" ? l.setState({ fitViewQueued: f }) : u === "fitViewOptions" ? l.setState({ fitViewOptions: f }) : l.setState({ [u]: f })));
      }
      d.current = e;
    },
    // Only re-run the effect if one of the fields we track changes
    is.map((u) => e[u])
  ), null;
}
function ss() {
  return typeof window > "u" || !window.matchMedia ? null : window.matchMedia("(prefers-color-scheme: dark)");
}
function jp(e) {
  var r;
  const [t, n] = ge(e === "system" ? null : e);
  return J(() => {
    if (e !== "system") {
      n(e);
      return;
    }
    const i = ss(), o = () => n(i != null && i.matches ? "dark" : "light");
    return o(), i == null || i.addEventListener("change", o), () => {
      i == null || i.removeEventListener("change", o);
    };
  }, [e]), t !== null ? t : (r = ss()) != null && r.matches ? "dark" : "light";
}
const cs = typeof document < "u" ? document : null;
function nn(e = null, t = { target: cs, actInsideInputWithModifier: !0 }) {
  const [n, r] = ge(!1), i = ne(!1), o = ne(/* @__PURE__ */ new Set([])), [s, c] = ye(() => {
    if (e !== null) {
      const l = (Array.isArray(e) ? e : [e]).filter((u) => typeof u == "string").map((u) => u.replace("+", `
`).replace(`

`, `
+`).split(`
`)), d = l.reduce((u, f) => u.concat(...f), []);
      return [l, d];
    }
    return [[], []];
  }, [e]);
  return J(() => {
    var d, u;
    const a = (d = t == null ? void 0 : t.target) != null ? d : cs, l = (u = t == null ? void 0 : t.actInsideInputWithModifier) != null ? u : !0;
    if (e !== null) {
      const f = (h) => {
        var C, m;
        if (i.current = h.ctrlKey || h.metaKey || h.shiftKey || h.altKey, (!i.current || i.current && !l) && Kc(h))
          return !1;
        const y = ls(h.code, c);
        if (o.current.add(h[y]), as(s, o.current, !1)) {
          const v = ((m = (C = h.composedPath) == null ? void 0 : C.call(h)) == null ? void 0 : m[0]) || h.target, _ = (v == null ? void 0 : v.nodeName) === "BUTTON" || (v == null ? void 0 : v.nodeName) === "A";
          t.preventDefault !== !1 && (i.current || !_) && h.preventDefault(), r(!0);
        }
      }, g = (h) => {
        const w = ls(h.code, c);
        as(s, o.current, !0) ? (r(!1), o.current.clear()) : o.current.delete(h[w]), h.key === "Meta" && o.current.clear(), i.current = !1;
      }, p = () => {
        o.current.clear(), r(!1);
      };
      return a == null || a.addEventListener("keydown", f), a == null || a.addEventListener("keyup", g), window.addEventListener("blur", p), window.addEventListener("contextmenu", p), () => {
        a == null || a.removeEventListener("keydown", f), a == null || a.removeEventListener("keyup", g), window.removeEventListener("blur", p), window.removeEventListener("contextmenu", p);
      };
    }
  }, [e, r]), n;
}
function as(e, t, n) {
  return e.filter((r) => n || r.length === t.size).some((r) => r.every((i) => t.has(i)));
}
function ls(e, t) {
  return t.includes(e) ? "code" : "key";
}
const Qp = () => {
  const e = ae();
  return ye(() => ({
    zoomIn: (t) => {
      const { panZoom: n } = e.getState();
      return n ? n.scaleBy(1.2, { duration: t == null ? void 0 : t.duration }) : Promise.resolve(!1);
    },
    zoomOut: (t) => {
      const { panZoom: n } = e.getState();
      return n ? n.scaleBy(1 / 1.2, { duration: t == null ? void 0 : t.duration }) : Promise.resolve(!1);
    },
    zoomTo: (t, n) => {
      const { panZoom: r } = e.getState();
      return r ? r.scaleTo(t, { duration: n == null ? void 0 : n.duration }) : Promise.resolve(!1);
    },
    getZoom: () => e.getState().transform[2],
    setViewport: async (t, n) => {
      var c, a, l;
      const { transform: [r, i, o], panZoom: s } = e.getState();
      return s ? (await s.setViewport({
        x: (c = t.x) != null ? c : r,
        y: (a = t.y) != null ? a : i,
        zoom: (l = t.zoom) != null ? l : o
      }, n), Promise.resolve(!0)) : Promise.resolve(!1);
    },
    getViewport: () => {
      const [t, n, r] = e.getState().transform;
      return { x: t, y: n, zoom: r };
    },
    setCenter: async (t, n, r) => e.getState().setCenter(t, n, r),
    fitBounds: async (t, n) => {
      var l;
      const { width: r, height: i, minZoom: o, maxZoom: s, panZoom: c } = e.getState(), a = Ki(t, r, i, o, s, (l = n == null ? void 0 : n.padding) != null ? l : 0.1);
      return c ? (await c.setViewport(a, {
        duration: n == null ? void 0 : n.duration,
        ease: n == null ? void 0 : n.ease,
        interpolate: n == null ? void 0 : n.interpolate
      }), Promise.resolve(!0)) : Promise.resolve(!1);
    },
    screenToFlowPosition: (t, n = {}) => {
      var f, g;
      const { transform: r, snapGrid: i, snapToGrid: o, domNode: s } = e.getState();
      if (!s)
        return t;
      const { x: c, y: a } = s.getBoundingClientRect(), l = {
        x: t.x - c,
        y: t.y - a
      }, d = (f = n.snapGrid) != null ? f : i, u = (g = n.snapToGrid) != null ? g : o;
      return fn(l, r, u, d);
    },
    flowToScreenPosition: (t) => {
      const { transform: n, domNode: r } = e.getState();
      if (!r)
        return t;
      const { x: i, y: o } = r.getBoundingClientRect(), s = Bn(t, n);
      return {
        x: s.x + i,
        y: s.y + o
      };
    }
  }), []);
};
function ya(e, t) {
  const n = [], r = /* @__PURE__ */ new Map(), i = [];
  for (const o of e)
    if (o.type === "add") {
      i.push(o);
      continue;
    } else if (o.type === "remove" || o.type === "replace")
      r.set(o.id, [o]);
    else {
      const s = r.get(o.id);
      s ? s.push(o) : r.set(o.id, [o]);
    }
  for (const o of t) {
    const s = r.get(o.id);
    if (!s) {
      n.push(o);
      continue;
    }
    if (s[0].type === "remove")
      continue;
    if (s[0].type === "replace") {
      n.push({ ...s[0].item });
      continue;
    }
    const c = { ...o };
    for (const a of s)
      Jp(a, c);
    n.push(c);
  }
  return i.length && i.forEach((o) => {
    o.index !== void 0 ? n.splice(o.index, 0, { ...o.item }) : n.push({ ...o.item });
  }), n;
}
function Jp(e, t) {
  var n;
  switch (e.type) {
    case "select": {
      t.selected = e.selected;
      break;
    }
    case "position": {
      typeof e.position < "u" && (t.position = e.position), typeof e.dragging < "u" && (t.dragging = e.dragging);
      break;
    }
    case "dimensions": {
      typeof e.dimensions < "u" && ((n = t.measured) != null || (t.measured = {}), t.measured.width = e.dimensions.width, t.measured.height = e.dimensions.height, e.setAttributes && ((e.setAttributes === !0 || e.setAttributes === "width") && (t.width = e.dimensions.width), (e.setAttributes === !0 || e.setAttributes === "height") && (t.height = e.dimensions.height))), typeof e.resizing == "boolean" && (t.resizing = e.resizing);
      break;
    }
  }
}
function va(e, t) {
  return ya(e, t);
}
function em(e, t) {
  return ya(e, t);
}
function ot(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function Ct(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const r = [];
  for (const [i, o] of e) {
    const s = t.has(i);
    !(o.selected === void 0 && !s) && o.selected !== s && (n && (o.selected = s), r.push(ot(o.id, s)));
  }
  return r;
}
function us({ items: e = [], lookup: t }) {
  var i, o;
  const n = [], r = new Map(e.map((s) => [s.id, s]));
  for (const [s, c] of e.entries()) {
    const a = t.get(c.id), l = (o = (i = a == null ? void 0 : a.internals) == null ? void 0 : i.userNode) != null ? o : a;
    l !== void 0 && l !== c && n.push({ id: c.id, item: c, type: "replace" }), l === void 0 && n.push({ item: c, type: "add", index: s });
  }
  for (const [s] of t)
    r.get(s) === void 0 && n.push({ id: s, type: "remove" });
  return n;
}
function fs(e) {
  return {
    id: e.id,
    type: "remove"
  };
}
const ds = (e) => xg(e), tm = (e) => zc(e);
function wa(e) {
  return pe(e);
}
const nm = typeof window < "u" ? on : J;
function hs(e) {
  const [t, n] = ge(BigInt(0)), [r] = ge(() => rm(() => n((i) => i + BigInt(1))));
  return nm(() => {
    const i = r.get();
    i.length && (e(i), r.reset());
  }, [t]), r;
}
function rm(e) {
  let t = [];
  return {
    get: () => t,
    reset: () => {
      t = [];
    },
    push: (n) => {
      t.push(n), e();
    }
  };
}
const xa = Ci(null);
function im({ children: e }) {
  const t = ae(), n = he((c) => {
    const { nodes: a = [], setNodes: l, hasDefaultNodes: d, onNodesChange: u, nodeLookup: f, fitViewQueued: g } = t.getState();
    let p = a;
    for (const w of c)
      p = typeof w == "function" ? w(p) : w;
    const h = us({
      items: p,
      lookup: f
    });
    d && l(p), h.length > 0 ? u == null || u(h) : g && window.requestAnimationFrame(() => {
      const { fitViewQueued: w, nodes: y, setNodes: C } = t.getState();
      w && C(y);
    });
  }, []), r = hs(n), i = he((c) => {
    const { edges: a = [], setEdges: l, hasDefaultEdges: d, onEdgesChange: u, edgeLookup: f } = t.getState();
    let g = a;
    for (const p of c)
      g = typeof p == "function" ? p(g) : p;
    d ? l(g) : u && u(us({
      items: g,
      lookup: f
    }));
  }, []), o = hs(i), s = ye(() => ({ nodeQueue: r, edgeQueue: o }), []);
  return I(xa.Provider, { value: s, children: e });
}
function om() {
  const e = Ot(xa);
  if (!e)
    throw new Error("useBatchContext must be used within a BatchProvider");
  return e;
}
const sm = (e) => !!e.panZoom;
function fr() {
  const e = Qp(), t = ae(), n = om(), r = ie(sm), i = ye(() => {
    const o = (u) => t.getState().nodeLookup.get(u), s = (u) => {
      n.nodeQueue.push(u);
    }, c = (u) => {
      n.edgeQueue.push(u);
    }, a = (u) => {
      var y, C, m, v;
      const { nodeLookup: f, nodeOrigin: g } = t.getState(), p = ds(u) ? u : f.get(u.id), h = p.parentId ? Yc(p.position, p.measured, p.parentId, f, g) : p.position, w = {
        ...p,
        position: h,
        width: (C = (y = p.measured) == null ? void 0 : y.width) != null ? C : p.width,
        height: (v = (m = p.measured) == null ? void 0 : m.height) != null ? v : p.height
      };
      return $t(w);
    }, l = (u, f, g = { replace: !1 }) => {
      s((p) => p.map((h) => {
        if (h.id === u) {
          const w = typeof f == "function" ? f(h) : f;
          return g.replace && ds(w) ? w : { ...h, ...w };
        }
        return h;
      }));
    }, d = (u, f, g = { replace: !1 }) => {
      c((p) => p.map((h) => {
        if (h.id === u) {
          const w = typeof f == "function" ? f(h) : f;
          return g.replace && tm(w) ? w : { ...h, ...w };
        }
        return h;
      }));
    };
    return {
      getNodes: () => t.getState().nodes.map((u) => ({ ...u })),
      getNode: (u) => {
        var f;
        return (f = o(u)) == null ? void 0 : f.internals.userNode;
      },
      getInternalNode: o,
      getEdges: () => {
        const { edges: u = [] } = t.getState();
        return u.map((f) => ({ ...f }));
      },
      getEdge: (u) => t.getState().edgeLookup.get(u),
      setNodes: s,
      setEdges: c,
      addNodes: (u) => {
        const f = Array.isArray(u) ? u : [u];
        n.nodeQueue.push((g) => [...g, ...f]);
      },
      addEdges: (u) => {
        const f = Array.isArray(u) ? u : [u];
        n.edgeQueue.push((g) => [...g, ...f]);
      },
      toObject: () => {
        const { nodes: u = [], edges: f = [], transform: g } = t.getState(), [p, h, w] = g;
        return {
          nodes: u.map((y) => ({ ...y })),
          edges: f.map((y) => ({ ...y })),
          viewport: {
            x: p,
            y: h,
            zoom: w
          }
        };
      },
      deleteElements: async ({ nodes: u = [], edges: f = [] }) => {
        const { nodes: g, edges: p, onNodesDelete: h, onEdgesDelete: w, triggerNodeChanges: y, triggerEdgeChanges: C, onDelete: m, onBeforeDelete: v } = t.getState(), { nodes: _, edges: b } = await Ng({
          nodesToRemove: u,
          edgesToRemove: f,
          nodes: g,
          edges: p,
          onBeforeDelete: v
        }), M = b.length > 0, L = _.length > 0;
        if (M) {
          const $ = b.map(fs);
          w == null || w(b), C($);
        }
        if (L) {
          const $ = _.map(fs);
          h == null || h(_), y($);
        }
        return (L || M) && (m == null || m({ nodes: _, edges: b })), { deletedNodes: _, deletedEdges: b };
      },
      /**
       * Partial is defined as "the 2 nodes/areas are intersecting partially".
       * If a is contained in b or b is contained in a, they are both
       * considered fully intersecting.
       */
      getIntersectingNodes: (u, f = !0, g) => {
        const p = Fo(u), h = p ? u : a(u), w = g !== void 0;
        return h ? (g || t.getState().nodes).filter((y) => {
          const C = t.getState().nodeLookup.get(y.id);
          if (C && !p && (y.id === u.id || !C.internals.positionAbsolute))
            return !1;
          const m = $t(w ? y : C), v = Jt(m, h);
          return f && v > 0 || v >= m.width * m.height || v >= h.width * h.height;
        }) : [];
      },
      isNodeIntersecting: (u, f, g = !0) => {
        const h = Fo(u) ? u : a(u);
        if (!h)
          return !1;
        const w = Jt(h, f);
        return g && w > 0 || w >= f.width * f.height || w >= h.width * h.height;
      },
      updateNode: l,
      updateNodeData: (u, f, g = { replace: !1 }) => {
        l(u, (p) => {
          const h = typeof f == "function" ? f(p) : f;
          return g.replace ? { ...p, data: h } : { ...p, data: { ...p.data, ...h } };
        }, g);
      },
      updateEdge: d,
      updateEdgeData: (u, f, g = { replace: !1 }) => {
        d(u, (p) => {
          const h = typeof f == "function" ? f(p) : f;
          return g.replace ? { ...p, data: h } : { ...p, data: { ...p.data, ...h } };
        }, g);
      },
      getNodesBounds: (u) => {
        const { nodeLookup: f, nodeOrigin: g } = t.getState();
        return _g(u, { nodeLookup: f, nodeOrigin: g });
      },
      getHandleConnections: ({ type: u, id: f, nodeId: g }) => {
        var p, h;
        return Array.from((h = (p = t.getState().connectionLookup.get(`${g}-${u}${f ? `-${f}` : ""}`)) == null ? void 0 : p.values()) != null ? h : []);
      },
      getNodeConnections: ({ type: u, handleId: f, nodeId: g }) => {
        var p, h;
        return Array.from((h = (p = t.getState().connectionLookup.get(`${g}${u ? f ? `-${u}-${f}` : `-${u}` : ""}`)) == null ? void 0 : p.values()) != null ? h : []);
      },
      fitView: async (u) => {
        var g;
        const f = (g = t.getState().fitViewResolver) != null ? g : Ag();
        return t.setState({ fitViewQueued: !0, fitViewOptions: u, fitViewResolver: f }), n.nodeQueue.push((p) => [...p]), f.promise;
      }
    };
  }, []);
  return ye(() => ({
    ...i,
    ...e,
    viewportInitialized: r
  }), [r]);
}
const gs = (e) => e.selected, cm = typeof window < "u" ? window : void 0;
function am({ deleteKeyCode: e, multiSelectionKeyCode: t }) {
  const n = ae(), { deleteElements: r } = fr(), i = nn(e, { actInsideInputWithModifier: !1 }), o = nn(t, { target: cm });
  J(() => {
    if (i) {
      const { edges: s, nodes: c } = n.getState();
      r({ nodes: c.filter(gs), edges: s.filter(gs) }), n.setState({ nodesSelectionActive: !1 });
    }
  }, [i]), J(() => {
    n.setState({ multiSelectionActive: o });
  }, [o]);
}
function lm(e) {
  const t = ae();
  J(() => {
    const n = () => {
      var i, o, s, c, a;
      if (!e.current || !((s = (o = (i = e.current).checkVisibility) == null ? void 0 : o.call(i)) == null || s))
        return !1;
      const r = qi(e.current);
      (r.height === 0 || r.width === 0) && ((a = (c = t.getState()).onError) == null || a.call(c, "004", ze.error004())), t.setState({ width: r.width || 500, height: r.height || 500 });
    };
    if (e.current) {
      n(), window.addEventListener("resize", n);
      const r = new ResizeObserver(() => n());
      return r.observe(e.current), () => {
        window.removeEventListener("resize", n), r && e.current && r.unobserve(e.current);
      };
    }
  }, []);
}
const dr = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
}, um = (e) => ({
  userSelectionActive: e.userSelectionActive,
  lib: e.lib,
  connectionInProgress: e.connection.inProgress
});
function fm({ onPaneContextMenu: e, zoomOnScroll: t = !0, zoomOnPinch: n = !0, panOnScroll: r = !1, panOnScrollSpeed: i = 0.5, panOnScrollMode: o = ft.Free, zoomOnDoubleClick: s = !0, panOnDrag: c = !0, defaultViewport: a, translateExtent: l, minZoom: d, maxZoom: u, zoomActivationKeyCode: f, preventScrolling: g = !0, children: p, noWheelClassName: h, noPanClassName: w, onViewportChange: y, isControlledViewport: C, paneClickDistance: m, selectionOnDrag: v }) {
  const _ = ae(), b = ne(null), { userSelectionActive: M, lib: L, connectionInProgress: $ } = ie(um, le), V = nn(f), k = ne();
  lm(b);
  const O = he((D) => {
    y == null || y({ x: D[0], y: D[1], zoom: D[2] }), C || _.setState({ transform: D });
  }, [y, C]);
  return J(() => {
    if (b.current) {
      k.current = dp({
        domNode: b.current,
        minZoom: d,
        maxZoom: u,
        translateExtent: l,
        viewport: a,
        onDraggingChange: (S) => _.setState({ paneDragging: S }),
        onPanZoomStart: (S, A) => {
          const { onViewportChangeStart: E, onMoveStart: N } = _.getState();
          N == null || N(S, A), E == null || E(A);
        },
        onPanZoom: (S, A) => {
          const { onViewportChange: E, onMove: N } = _.getState();
          N == null || N(S, A), E == null || E(A);
        },
        onPanZoomEnd: (S, A) => {
          const { onViewportChangeEnd: E, onMoveEnd: N } = _.getState();
          N == null || N(S, A), E == null || E(A);
        }
      });
      const { x: D, y: x, zoom: T } = k.current.getViewport();
      return _.setState({
        panZoom: k.current,
        transform: [D, x, T],
        domNode: b.current.closest(".react-flow")
      }), () => {
        var S;
        (S = k.current) == null || S.destroy();
      };
    }
  }, []), J(() => {
    var D;
    (D = k.current) == null || D.update({
      onPaneContextMenu: e,
      zoomOnScroll: t,
      zoomOnPinch: n,
      panOnScroll: r,
      panOnScrollSpeed: i,
      panOnScrollMode: o,
      zoomOnDoubleClick: s,
      panOnDrag: c,
      zoomActivationKeyPressed: V,
      preventScrolling: g,
      noPanClassName: w,
      userSelectionActive: M,
      noWheelClassName: h,
      lib: L,
      onTransformChange: O,
      connectionInProgress: $,
      selectionOnDrag: v,
      paneClickDistance: m
    });
  }, [
    e,
    t,
    n,
    r,
    i,
    o,
    s,
    c,
    V,
    g,
    w,
    M,
    h,
    L,
    O,
    $,
    v,
    m
  ]), I("div", { className: "react-flow__renderer", ref: b, style: dr, children: p });
}
const dm = (e) => ({
  userSelectionActive: e.userSelectionActive,
  userSelectionRect: e.userSelectionRect
});
function hm() {
  const { userSelectionActive: e, userSelectionRect: t } = ie(dm, le);
  return e && t ? I("div", { className: "react-flow__selection react-flow__container", style: {
    width: t.width,
    height: t.height,
    transform: `translate(${t.x}px, ${t.y}px)`
  } }) : null;
}
const Pr = (e, t) => (n) => {
  n.target === t.current && (e == null || e(n));
}, gm = (e) => ({
  userSelectionActive: e.userSelectionActive,
  elementsSelectable: e.elementsSelectable,
  connectionInProgress: e.connection.inProgress,
  dragging: e.paneDragging
});
function pm({ isSelecting: e, selectionKeyPressed: t, selectionMode: n = Qt.Full, panOnDrag: r, paneClickDistance: i, selectionOnDrag: o, onSelectionStart: s, onSelectionEnd: c, onPaneClick: a, onPaneContextMenu: l, onPaneScroll: d, onPaneMouseEnter: u, onPaneMouseMove: f, onPaneMouseLeave: g, children: p }) {
  const h = ae(), { userSelectionActive: w, elementsSelectable: y, dragging: C, connectionInProgress: m } = ie(gm, le), v = y && (e || w), _ = ne(null), b = ne(), M = ne(/* @__PURE__ */ new Set()), L = ne(/* @__PURE__ */ new Set()), $ = ne(!1), V = (E) => {
    if ($.current || m) {
      $.current = !1;
      return;
    }
    a == null || a(E), h.getState().resetSelectedElements(), h.setState({ nodesSelectionActive: !1 });
  }, k = (E) => {
    if (Array.isArray(r) && (r != null && r.includes(2))) {
      E.preventDefault();
      return;
    }
    l == null || l(E);
  }, O = d ? (E) => d(E) : void 0, D = (E) => {
    $.current && (E.stopPropagation(), $.current = !1);
  }, x = (E) => {
    var Z, X;
    const { domNode: N } = h.getState();
    if (b.current = N == null ? void 0 : N.getBoundingClientRect(), !b.current)
      return;
    const P = E.target === _.current;
    if (!P && !!E.target.closest(".nokey") || !e || !(o && P || t) || E.button !== 0 || !E.isPrimary)
      return;
    (X = (Z = E.target) == null ? void 0 : Z.setPointerCapture) == null || X.call(Z, E.pointerId), $.current = !1;
    const { x: z, y: H } = ke(E.nativeEvent, b.current);
    h.setState({
      userSelectionRect: {
        width: 0,
        height: 0,
        startX: z,
        startY: H,
        x: z,
        y: H
      }
    }), P || (E.stopPropagation(), E.preventDefault());
  }, T = (E) => {
    var ce, se;
    const { userSelectionRect: N, transform: P, nodeLookup: R, edgeLookup: F, connectionLookup: z, triggerNodeChanges: H, triggerEdgeChanges: Z, defaultEdgeOptions: X, resetSelectedElements: W } = h.getState();
    if (!b.current || !N)
      return;
    const { x: U, y: G } = ke(E.nativeEvent, b.current), { startX: j, startY: B } = N;
    if (!$.current) {
      const oe = t ? 0 : i;
      if (Math.hypot(U - j, G - B) <= oe)
        return;
      W(), s == null || s(E);
    }
    $.current = !0;
    const ee = {
      startX: j,
      startY: B,
      x: U < j ? U : j,
      y: G < B ? G : B,
      width: Math.abs(U - j),
      height: Math.abs(G - B)
    }, q = M.current, K = L.current;
    M.current = new Set(Gi(R, ee, P, n === Qt.Partial, !0).map((oe) => oe.id)), L.current = /* @__PURE__ */ new Set();
    const re = (ce = X == null ? void 0 : X.selectable) != null ? ce : !0;
    for (const oe of M.current) {
      const _e = z.get(oe);
      if (_e)
        for (const { edgeId: Ae } of _e.values()) {
          const it = F.get(Ae);
          it && ((se = it.selectable) != null ? se : re) && L.current.add(Ae);
        }
    }
    if (!Vo(q, M.current)) {
      const oe = Ct(R, M.current, !0);
      H(oe);
    }
    if (!Vo(K, L.current)) {
      const oe = Ct(F, L.current);
      Z(oe);
    }
    h.setState({
      userSelectionRect: ee,
      userSelectionActive: !0,
      nodesSelectionActive: !1
    });
  }, S = (E) => {
    var N, P;
    E.button === 0 && ((P = (N = E.target) == null ? void 0 : N.releasePointerCapture) == null || P.call(N, E.pointerId), !w && E.target === _.current && h.getState().userSelectionRect && (V == null || V(E)), h.setState({
      userSelectionActive: !1,
      userSelectionRect: null
    }), $.current && (c == null || c(E), h.setState({
      nodesSelectionActive: M.current.size > 0
    })));
  }, A = r === !0 || Array.isArray(r) && r.includes(0);
  return Q("div", { className: de(["react-flow__pane", { draggable: A, dragging: C, selection: e }]), onClick: v ? void 0 : Pr(V, _), onContextMenu: Pr(k, _), onWheel: Pr(O, _), onPointerEnter: v ? void 0 : u, onPointerMove: v ? T : f, onPointerUp: v ? S : void 0, onPointerDownCapture: v ? x : void 0, onClickCapture: v ? D : void 0, onPointerLeave: g, ref: _, style: dr, children: [p, I(hm, {})] });
}
function ai({ id: e, store: t, unselect: n = !1, nodeRef: r }) {
  const { addSelectedNodes: i, unselectNodesAndEdges: o, multiSelectionActive: s, nodeLookup: c, onError: a } = t.getState(), l = c.get(e);
  if (!l) {
    a == null || a("012", ze.error012(e));
    return;
  }
  t.setState({ nodesSelectionActive: !1 }), l.selected ? (n || l.selected && s) && (o({ nodes: [l], edges: [] }), requestAnimationFrame(() => {
    var d;
    return (d = r == null ? void 0 : r.current) == null ? void 0 : d.blur();
  })) : i([e]);
}
function _a({ nodeRef: e, disabled: t = !1, noDragClassName: n, handleSelector: r, nodeId: i, isSelectable: o, nodeClickDistance: s }) {
  const c = ae(), [a, l] = ge(!1), d = ne();
  return J(() => {
    d.current = Qg({
      getStoreItems: () => c.getState(),
      onNodeMouseDown: (u) => {
        ai({
          id: u,
          store: c,
          nodeRef: e
        });
      },
      onDragStart: () => {
        l(!0);
      },
      onDragStop: () => {
        l(!1);
      }
    });
  }, []), J(() => {
    var u, f;
    if (t)
      (u = d.current) == null || u.destroy();
    else if (e.current)
      return (f = d.current) == null || f.update({
        noDragClassName: n,
        handleSelector: r,
        domNode: e.current,
        isSelectable: o,
        nodeId: i,
        nodeClickDistance: s
      }), () => {
        var g;
        (g = d.current) == null || g.destroy();
      };
  }, [n, r, t, o, e, i]), a;
}
const mm = (e) => (t) => t.selected && (t.draggable || e && typeof t.draggable > "u");
function Ca() {
  const e = ae();
  return he((n) => {
    const { nodeExtent: r, snapToGrid: i, snapGrid: o, nodesDraggable: s, onError: c, updateNodePositions: a, nodeLookup: l, nodeOrigin: d } = e.getState(), u = /* @__PURE__ */ new Map(), f = mm(s), g = i ? o[0] : 5, p = i ? o[1] : 5, h = n.direction.x * g * n.factor, w = n.direction.y * p * n.factor;
    for (const [, y] of l) {
      if (!f(y))
        continue;
      let C = {
        x: y.internals.positionAbsolute.x + h,
        y: y.internals.positionAbsolute.y + w
      };
      i && (C = un(C, o));
      const { position: m, positionAbsolute: v } = Bc({
        nodeId: y.id,
        nextPosition: C,
        nodeLookup: l,
        nodeExtent: r,
        nodeOrigin: d,
        onError: c
      });
      y.position = m, y.internals.positionAbsolute = v, u.set(y.id, y);
    }
    a(u);
  }, []);
}
const to = Ci(null), ym = to.Provider;
to.Consumer;
const ba = () => Ot(to), vm = (e) => ({
  connectOnClick: e.connectOnClick,
  noPanClassName: e.noPanClassName,
  rfId: e.rfId
}), wm = (e, t, n) => (r) => {
  const { connectionClickStartHandle: i, connectionMode: o, connection: s } = r, { fromHandle: c, toHandle: a, isValid: l } = s, d = (a == null ? void 0 : a.nodeId) === e && (a == null ? void 0 : a.id) === t && (a == null ? void 0 : a.type) === n;
  return {
    connectingFrom: (c == null ? void 0 : c.nodeId) === e && (c == null ? void 0 : c.id) === t && (c == null ? void 0 : c.type) === n,
    connectingTo: d,
    clickConnecting: (i == null ? void 0 : i.nodeId) === e && (i == null ? void 0 : i.id) === t && (i == null ? void 0 : i.type) === n,
    isPossibleEndHandle: o === At.Strict ? (c == null ? void 0 : c.type) !== n : e !== (c == null ? void 0 : c.nodeId) || t !== (c == null ? void 0 : c.id),
    connectionInProcess: !!c,
    clickConnectionInProcess: !!i,
    valid: d && l
  };
};
function xm({ type: e = "source", position: t = Y.Top, isValidConnection: n, isConnectable: r = !0, isConnectableStart: i = !0, isConnectableEnd: o = !0, id: s, onConnect: c, children: a, className: l, onMouseDown: d, onTouchStart: u, ...f }, g) {
  var T, S;
  const p = s || null, h = e === "target", w = ae(), y = ba(), { connectOnClick: C, noPanClassName: m, rfId: v } = ie(vm, le), { connectingFrom: _, connectingTo: b, clickConnecting: M, isPossibleEndHandle: L, connectionInProcess: $, clickConnectionInProcess: V, valid: k } = ie(wm(y, p, e), le);
  y || (S = (T = w.getState()).onError) == null || S.call(T, "010", ze.error010());
  const O = (A) => {
    const { defaultEdgeOptions: E, onConnect: N, hasDefaultEdges: P } = w.getState(), R = {
      ...E,
      ...A
    };
    if (P) {
      const { edges: F, setEdges: z } = w.getState();
      z(Dg(R, F));
    }
    N == null || N(R), c == null || c(R);
  }, D = (A) => {
    if (!y)
      return;
    const E = qc(A.nativeEvent);
    if (i && (E && A.button === 0 || !E)) {
      const N = w.getState();
      ci.onPointerDown(A.nativeEvent, {
        handleDomNode: A.currentTarget,
        autoPanOnConnect: N.autoPanOnConnect,
        connectionMode: N.connectionMode,
        connectionRadius: N.connectionRadius,
        domNode: N.domNode,
        nodeLookup: N.nodeLookup,
        lib: N.lib,
        isTarget: h,
        handleId: p,
        nodeId: y,
        flowId: N.rfId,
        panBy: N.panBy,
        cancelConnection: N.cancelConnection,
        onConnectStart: N.onConnectStart,
        onConnectEnd: N.onConnectEnd,
        updateConnection: N.updateConnection,
        onConnect: O,
        isValidConnection: n || N.isValidConnection,
        getTransform: () => w.getState().transform,
        getFromHandle: () => w.getState().connection.fromHandle,
        autoPanSpeed: N.autoPanSpeed,
        dragThreshold: N.connectionDragThreshold
      });
    }
    E ? d == null || d(A) : u == null || u(A);
  }, x = (A) => {
    const { onClickConnectStart: E, onClickConnectEnd: N, connectionClickStartHandle: P, connectionMode: R, isValidConnection: F, lib: z, rfId: H, nodeLookup: Z, connection: X } = w.getState();
    if (!y || !P && !i)
      return;
    if (!P) {
      E == null || E(A.nativeEvent, { nodeId: y, handleId: p, handleType: e }), w.setState({ connectionClickStartHandle: { nodeId: y, type: e, id: p } });
      return;
    }
    const W = Gc(A.target), U = n || F, { connection: G, isValid: j } = ci.isValid(A.nativeEvent, {
      handle: {
        nodeId: y,
        id: p,
        type: e
      },
      connectionMode: R,
      fromNodeId: P.nodeId,
      fromHandleId: P.id || null,
      fromType: P.type,
      isValidConnection: U,
      flowId: H,
      doc: W,
      lib: z,
      nodeLookup: Z
    });
    j && G && O(G);
    const B = structuredClone(X);
    delete B.inProgress, B.toPosition = B.toHandle ? B.toHandle.position : null, N == null || N(A, B), w.setState({ connectionClickStartHandle: null });
  };
  return I("div", { "data-handleid": p, "data-nodeid": y, "data-handlepos": t, "data-id": `${v}-${y}-${p}-${e}`, className: de([
    "react-flow__handle",
    `react-flow__handle-${t}`,
    "nodrag",
    m,
    l,
    {
      source: !h,
      target: h,
      connectable: r,
      connectablestart: i,
      connectableend: o,
      clickconnecting: M,
      connectingfrom: _,
      connectingto: b,
      valid: k,
      /*
       * shows where you can start a connection from
       * and where you can end it while connecting
       */
      connectionindicator: r && (!$ || L) && ($ || V ? o : i)
    }
  ]), onMouseDown: D, onTouchStart: D, onClick: C ? x : void 0, ref: g, ...f, children: a });
}
const Un = fe(wa(xm));
function _m({ data: e, isConnectable: t, sourcePosition: n = Y.Bottom }) {
  return Q(De, { children: [e == null ? void 0 : e.label, I(Un, { type: "source", position: n, isConnectable: t })] });
}
function Cm({ data: e, isConnectable: t, targetPosition: n = Y.Top, sourcePosition: r = Y.Bottom }) {
  return Q(De, { children: [I(Un, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label, I(Un, { type: "source", position: r, isConnectable: t })] });
}
function bm() {
  return null;
}
function Sm({ data: e, isConnectable: t, targetPosition: n = Y.Top }) {
  return Q(De, { children: [I(Un, { type: "target", position: n, isConnectable: t }), e == null ? void 0 : e.label] });
}
const Wn = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
}, ps = {
  input: _m,
  default: Cm,
  output: Sm,
  group: bm
};
function Nm(e) {
  var t, n, r, i, o, s, c, a, l, d;
  return e.internals.handleBounds === void 0 ? {
    width: (r = (t = e.width) != null ? t : e.initialWidth) != null ? r : (n = e.style) == null ? void 0 : n.width,
    height: (s = (i = e.height) != null ? i : e.initialHeight) != null ? s : (o = e.style) == null ? void 0 : o.height
  } : {
    width: (a = e.width) != null ? a : (c = e.style) == null ? void 0 : c.width,
    height: (d = e.height) != null ? d : (l = e.style) == null ? void 0 : l.height
  };
}
const Em = (e) => {
  const { width: t, height: n, x: r, y: i } = ln(e.nodeLookup, {
    filter: (o) => !!o.selected
  });
  return {
    width: Te(t) ? t : null,
    height: Te(n) ? n : null,
    userSelectionActive: e.userSelectionActive,
    transformString: `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]}) translate(${r}px,${i}px)`
  };
};
function Im({ onSelectionContextMenu: e, noPanClassName: t, disableKeyboardA11y: n }) {
  const r = ae(), { width: i, height: o, transformString: s, userSelectionActive: c } = ie(Em, le), a = Ca(), l = ne(null);
  if (J(() => {
    var f;
    n || (f = l.current) == null || f.focus({
      preventScroll: !0
    });
  }, [n]), _a({
    nodeRef: l
  }), c || !i || !o)
    return null;
  const d = e ? (f) => {
    const g = r.getState().nodes.filter((p) => p.selected);
    e(f, g);
  } : void 0, u = (f) => {
    Object.prototype.hasOwnProperty.call(Wn, f.key) && (f.preventDefault(), a({
      direction: Wn[f.key],
      factor: f.shiftKey ? 4 : 1
    }));
  };
  return I("div", { className: de(["react-flow__nodesselection", "react-flow__container", t]), style: {
    transform: s
  }, children: I("div", { ref: l, className: "react-flow__nodesselection-rect", onContextMenu: d, tabIndex: n ? void 0 : -1, onKeyDown: n ? void 0 : u, style: {
    width: i,
    height: o
  } }) });
}
const ms = typeof window < "u" ? window : void 0, Mm = (e) => ({ nodesSelectionActive: e.nodesSelectionActive, userSelectionActive: e.userSelectionActive });
function Sa({ children: e, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: i, onPaneContextMenu: o, onPaneScroll: s, paneClickDistance: c, deleteKeyCode: a, selectionKeyCode: l, selectionOnDrag: d, selectionMode: u, onSelectionStart: f, onSelectionEnd: g, multiSelectionKeyCode: p, panActivationKeyCode: h, zoomActivationKeyCode: w, elementsSelectable: y, zoomOnScroll: C, zoomOnPinch: m, panOnScroll: v, panOnScrollSpeed: _, panOnScrollMode: b, zoomOnDoubleClick: M, panOnDrag: L, defaultViewport: $, translateExtent: V, minZoom: k, maxZoom: O, preventScrolling: D, onSelectionContextMenu: x, noWheelClassName: T, noPanClassName: S, disableKeyboardA11y: A, onViewportChange: E, isControlledViewport: N }) {
  const { nodesSelectionActive: P, userSelectionActive: R } = ie(Mm), F = nn(l, { target: ms }), z = nn(h, { target: ms }), H = z || L, Z = z || v, X = d && H !== !0, W = F || R || X;
  return am({ deleteKeyCode: a, multiSelectionKeyCode: p }), I(fm, { onPaneContextMenu: o, elementsSelectable: y, zoomOnScroll: C, zoomOnPinch: m, panOnScroll: Z, panOnScrollSpeed: _, panOnScrollMode: b, zoomOnDoubleClick: M, panOnDrag: !F && H, defaultViewport: $, translateExtent: V, minZoom: k, maxZoom: O, zoomActivationKeyCode: w, preventScrolling: D, noWheelClassName: T, noPanClassName: S, onViewportChange: E, isControlledViewport: N, paneClickDistance: c, selectionOnDrag: X, children: Q(pm, { onSelectionStart: f, onSelectionEnd: g, onPaneClick: t, onPaneMouseEnter: n, onPaneMouseMove: r, onPaneMouseLeave: i, onPaneContextMenu: o, onPaneScroll: s, panOnDrag: H, isSelecting: !!W, selectionMode: u, selectionKeyPressed: F, paneClickDistance: c, selectionOnDrag: X, children: [e, P && I(Im, { onSelectionContextMenu: x, noPanClassName: S, disableKeyboardA11y: A })] }) });
}
Sa.displayName = "FlowRenderer";
const Am = fe(Sa), Lm = (e) => (t) => e ? Gi(t.nodeLookup, { x: 0, y: 0, width: t.width, height: t.height }, t.transform, !0).map((n) => n.id) : Array.from(t.nodeLookup.keys());
function $m(e) {
  return ie(he(Lm(e), [e]), le);
}
const Tm = (e) => e.updateNodeInternals;
function km() {
  const e = ie(Tm), [t] = ge(() => typeof ResizeObserver > "u" ? null : new ResizeObserver((n) => {
    const r = /* @__PURE__ */ new Map();
    n.forEach((i) => {
      const o = i.target.getAttribute("data-id");
      r.set(o, {
        id: o,
        nodeElement: i.target,
        force: !0
      });
    }), e(r);
  }));
  return J(() => () => {
    t == null || t.disconnect();
  }, [t]), t;
}
function Om({ node: e, nodeType: t, hasDimensions: n, resizeObserver: r }) {
  const i = ae(), o = ne(null), s = ne(null), c = ne(e.sourcePosition), a = ne(e.targetPosition), l = ne(t), d = n && !!e.internals.handleBounds;
  return J(() => {
    o.current && !e.hidden && (!d || s.current !== o.current) && (s.current && (r == null || r.unobserve(s.current)), r == null || r.observe(o.current), s.current = o.current);
  }, [d, e.hidden]), J(() => () => {
    s.current && (r == null || r.unobserve(s.current), s.current = null);
  }, []), J(() => {
    if (o.current) {
      const u = l.current !== t, f = c.current !== e.sourcePosition, g = a.current !== e.targetPosition;
      (u || f || g) && (l.current = t, c.current = e.sourcePosition, a.current = e.targetPosition, i.getState().updateNodeInternals(/* @__PURE__ */ new Map([[e.id, { id: e.id, nodeElement: o.current, force: !0 }]])));
    }
  }, [e.id, t, e.sourcePosition, e.targetPosition]), o;
}
function Pm({ id: e, onClick: t, onMouseEnter: n, onMouseMove: r, onMouseLeave: i, onContextMenu: o, onDoubleClick: s, nodesDraggable: c, elementsSelectable: a, nodesConnectable: l, nodesFocusable: d, resizeObserver: u, noDragClassName: f, noPanClassName: g, disableKeyboardA11y: p, rfId: h, nodeTypes: w, nodeClickDistance: y, onError: C }) {
  var U, G, j;
  const { node: m, internals: v, isParent: _ } = ie((B) => {
    const ee = B.nodeLookup.get(e), q = B.parentLookup.has(e);
    return {
      node: ee,
      internals: ee.internals,
      isParent: q
    };
  }, le);
  let b = m.type || "default", M = (w == null ? void 0 : w[b]) || ps[b];
  M === void 0 && (C == null || C("003", ze.error003(b)), b = "default", M = (w == null ? void 0 : w.default) || ps.default);
  const L = !!(m.draggable || c && typeof m.draggable > "u"), $ = !!(m.selectable || a && typeof m.selectable > "u"), V = !!(m.connectable || l && typeof m.connectable > "u"), k = !!(m.focusable || d && typeof m.focusable > "u"), O = ae(), D = Xc(m), x = Om({ node: m, nodeType: b, hasDimensions: D, resizeObserver: u }), T = _a({
    nodeRef: x,
    disabled: m.hidden || !L,
    noDragClassName: f,
    handleSelector: m.dragHandle,
    nodeId: e,
    isSelectable: $,
    nodeClickDistance: y
  }), S = Ca();
  if (m.hidden)
    return null;
  const A = Ge(m), E = Nm(m), N = $ || L || t || n || r || i, P = n ? (B) => n(B, { ...v.userNode }) : void 0, R = r ? (B) => r(B, { ...v.userNode }) : void 0, F = i ? (B) => i(B, { ...v.userNode }) : void 0, z = o ? (B) => o(B, { ...v.userNode }) : void 0, H = s ? (B) => s(B, { ...v.userNode }) : void 0, Z = (B) => {
    const { selectNodesOnDrag: ee, nodeDragThreshold: q } = O.getState();
    $ && (!ee || !L || q > 0) && ai({
      id: e,
      store: O,
      nodeRef: x
    }), t && t(B, { ...v.userNode });
  }, X = (B) => {
    if (!(Kc(B.nativeEvent) || p)) {
      if (Rc.includes(B.key) && $) {
        const ee = B.key === "Escape";
        ai({
          id: e,
          store: O,
          unselect: ee,
          nodeRef: x
        });
      } else if (L && m.selected && Object.prototype.hasOwnProperty.call(Wn, B.key)) {
        B.preventDefault();
        const { ariaLabelConfig: ee } = O.getState();
        O.setState({
          ariaLiveMessage: ee["node.a11yDescription.ariaLiveMessage"]({
            direction: B.key.replace("Arrow", "").toLowerCase(),
            x: ~~v.positionAbsolute.x,
            y: ~~v.positionAbsolute.y
          })
        }), S({
          direction: Wn[B.key],
          factor: B.shiftKey ? 4 : 1
        });
      }
    }
  }, W = () => {
    var se;
    if (p || !((se = x.current) != null && se.matches(":focus-visible")))
      return;
    const { transform: B, width: ee, height: q, autoPanOnNodeFocus: K, setCenter: re } = O.getState();
    if (!K)
      return;
    Gi(/* @__PURE__ */ new Map([[e, m]]), { x: 0, y: 0, width: ee, height: q }, B, !0).length > 0 || re(m.position.x + A.width / 2, m.position.y + A.height / 2, {
      zoom: B[2]
    });
  };
  return I("div", { className: de([
    "react-flow__node",
    `react-flow__node-${b}`,
    {
      // this is overwritable by passing `nopan` as a class name
      [g]: L
    },
    m.className,
    {
      selected: m.selected,
      selectable: $,
      parent: _,
      draggable: L,
      dragging: T
    }
  ]), ref: x, style: {
    zIndex: v.z,
    transform: `translate(${v.positionAbsolute.x}px,${v.positionAbsolute.y}px)`,
    pointerEvents: N ? "all" : "none",
    visibility: D ? "visible" : "hidden",
    ...m.style,
    ...E
  }, "data-id": e, "data-testid": `rf__node-${e}`, onMouseEnter: P, onMouseMove: R, onMouseLeave: F, onContextMenu: z, onClick: Z, onDoubleClick: H, onKeyDown: k ? X : void 0, tabIndex: k ? 0 : void 0, onFocus: k ? W : void 0, role: (U = m.ariaRole) != null ? U : k ? "group" : void 0, "aria-roledescription": "node", "aria-describedby": p ? void 0 : `${ga}-${h}`, "aria-label": m.ariaLabel, ...m.domAttributes, children: I(ym, { value: e, children: I(M, { id: e, data: m.data, type: b, positionAbsoluteX: v.positionAbsolute.x, positionAbsoluteY: v.positionAbsolute.y, selected: (G = m.selected) != null ? G : !1, selectable: $, draggable: L, deletable: (j = m.deletable) != null ? j : !0, isConnectable: V, sourcePosition: m.sourcePosition, targetPosition: m.targetPosition, dragging: T, dragHandle: m.dragHandle, zIndex: v.z, parentId: m.parentId, ...A }) }) });
}
var Dm = fe(Pm);
const Rm = (e) => ({
  nodesDraggable: e.nodesDraggable,
  nodesConnectable: e.nodesConnectable,
  nodesFocusable: e.nodesFocusable,
  elementsSelectable: e.elementsSelectable,
  onError: e.onError
});
function Na(e) {
  const { nodesDraggable: t, nodesConnectable: n, nodesFocusable: r, elementsSelectable: i, onError: o } = ie(Rm, le), s = $m(e.onlyRenderVisibleElements), c = km();
  return I("div", { className: "react-flow__nodes", style: dr, children: s.map((a) => (
    /*
     * The split of responsibilities between NodeRenderer and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For example, when you’re dragging a single node, that node gets
     * updated multiple times per second. If `NodeRenderer` were to update
     * every time, it would have to re-run the `nodes.map()` loop every
     * time. This gets pricey with hundreds of nodes, especially if every
     * loop cycle does more than just rendering a JSX element!
     *
     * As a result of this choice, we took the following implementation
     * decisions:
     * - NodeRenderer subscribes *only* to node IDs – and therefore
     *   rerender *only* when visible nodes are added or removed.
     * - NodeRenderer performs all operations the result of which can be
     *   shared between nodes (such as creating the `ResizeObserver`
     *   instance, or subscribing to `selector`). This means extra prop
     *   drilling into `NodeComponentWrapper`, but it means we need to run
     *   these operations only once – instead of once per node.
     * - Any operations that you’d normally write inside `nodes.map` are
     *   moved into `NodeComponentWrapper`. This ensures they are
     *   memorized – so if `NodeRenderer` *has* to rerender, it only
     *   needs to regenerate the list of nodes, nothing else.
     */
    I(Dm, { id: a, nodeTypes: e.nodeTypes, nodeExtent: e.nodeExtent, onClick: e.onNodeClick, onMouseEnter: e.onNodeMouseEnter, onMouseMove: e.onNodeMouseMove, onMouseLeave: e.onNodeMouseLeave, onContextMenu: e.onNodeContextMenu, onDoubleClick: e.onNodeDoubleClick, noDragClassName: e.noDragClassName, noPanClassName: e.noPanClassName, rfId: e.rfId, disableKeyboardA11y: e.disableKeyboardA11y, resizeObserver: c, nodesDraggable: t, nodesConnectable: n, nodesFocusable: r, elementsSelectable: i, nodeClickDistance: e.nodeClickDistance, onError: o }, a)
  )) });
}
Na.displayName = "NodeRenderer";
const Fm = fe(Na);
function Vm(e) {
  return ie(he((n) => {
    if (!e)
      return n.edges.map((i) => i.id);
    const r = [];
    if (n.width && n.height)
      for (const i of n.edges) {
        const o = n.nodeLookup.get(i.source), s = n.nodeLookup.get(i.target);
        o && s && kg({
          sourceNode: o,
          targetNode: s,
          width: n.width,
          height: n.height,
          transform: n.transform
        }) && r.push(i.id);
      }
    return r;
  }, [e]), le);
}
const Hm = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e }
  };
  return I("polyline", { className: "arrow", style: n, strokeLinecap: "round", fill: "none", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4" });
}, zm = ({ color: e = "none", strokeWidth: t = 1 }) => {
  const n = {
    strokeWidth: t,
    ...e && { stroke: e, fill: e }
  };
  return I("polyline", { className: "arrowclosed", style: n, strokeLinecap: "round", strokeLinejoin: "round", points: "-5,-4 0,0 -5,4 -5,-4" });
}, ys = {
  [Hn.Arrow]: Hm,
  [Hn.ArrowClosed]: zm
};
function Bm(e) {
  const t = ae();
  return ye(() => {
    var i, o;
    return Object.prototype.hasOwnProperty.call(ys, e) ? ys[e] : ((o = (i = t.getState()).onError) == null || o.call(i, "009", ze.error009(e)), null);
  }, [e]);
}
const Um = ({ id: e, type: t, color: n, width: r = 12.5, height: i = 12.5, markerUnits: o = "strokeWidth", strokeWidth: s, orient: c = "auto-start-reverse" }) => {
  const a = Bm(t);
  return a ? I("marker", { className: "react-flow__arrowhead", id: e, markerWidth: `${r}`, markerHeight: `${i}`, viewBox: "-10 -10 20 20", markerUnits: o, orient: c, refX: "0", refY: "0", children: I(a, { color: n, strokeWidth: s }) }) : null;
}, Ea = ({ defaultColor: e, rfId: t }) => {
  const n = ie((o) => o.edges), r = ie((o) => o.defaultEdgeOptions), i = ye(() => zg(n, {
    id: t,
    defaultColor: e,
    defaultMarkerStart: r == null ? void 0 : r.markerStart,
    defaultMarkerEnd: r == null ? void 0 : r.markerEnd
  }), [n, r, t, e]);
  return i.length ? I("svg", { className: "react-flow__marker", "aria-hidden": "true", children: I("defs", { children: i.map((o) => I(Um, { id: o.id, type: o.type, color: o.color, width: o.width, height: o.height, markerUnits: o.markerUnits, strokeWidth: o.strokeWidth, orient: o.orient }, o.id)) }) }) : null;
};
Ea.displayName = "MarkerDefinitions";
var Wm = fe(Ea);
function Ia({ x: e, y: t, label: n, labelStyle: r, labelShowBg: i = !0, labelBgStyle: o, labelBgPadding: s = [2, 4], labelBgBorderRadius: c = 2, children: a, className: l, ...d }) {
  const [u, f] = ge({ x: 1, y: 0, width: 0, height: 0 }), g = de(["react-flow__edge-textwrapper", l]), p = ne(null);
  return J(() => {
    if (p.current) {
      const h = p.current.getBBox();
      f({
        x: h.x,
        y: h.y,
        width: h.width,
        height: h.height
      });
    }
  }, [n]), n ? Q("g", { transform: `translate(${e - u.width / 2} ${t - u.height / 2})`, className: g, visibility: u.width ? "visible" : "hidden", ...d, children: [i && I("rect", { width: u.width + 2 * s[0], x: -s[0], y: -s[1], height: u.height + 2 * s[1], className: "react-flow__edge-textbg", style: o, rx: c, ry: c }), I("text", { className: "react-flow__edge-text", y: u.height / 2, dy: "0.3em", ref: p, style: r, children: n }), a] }) : null;
}
Ia.displayName = "EdgeText";
const Zm = fe(Ia);
function hr({ path: e, labelX: t, labelY: n, label: r, labelStyle: i, labelShowBg: o, labelBgStyle: s, labelBgPadding: c, labelBgBorderRadius: a, interactionWidth: l = 20, ...d }) {
  return Q(De, { children: [I("path", { ...d, d: e, fill: "none", className: de(["react-flow__edge-path", d.className]) }), l ? I("path", { d: e, fill: "none", strokeOpacity: 0, strokeWidth: l, className: "react-flow__edge-interaction" }) : null, r && Te(t) && Te(n) ? I(Zm, { x: t, y: n, label: r, labelStyle: i, labelShowBg: o, labelBgStyle: s, labelBgPadding: c, labelBgBorderRadius: a }) : null] });
}
function vs({ pos: e, x1: t, y1: n, x2: r, y2: i }) {
  return e === Y.Left || e === Y.Right ? [0.5 * (t + r), n] : [t, 0.5 * (n + i)];
}
function Ma({ sourceX: e, sourceY: t, sourcePosition: n = Y.Bottom, targetX: r, targetY: i, targetPosition: o = Y.Top }) {
  const [s, c] = vs({
    pos: n,
    x1: e,
    y1: t,
    x2: r,
    y2: i
  }), [a, l] = vs({
    pos: o,
    x1: r,
    y1: i,
    x2: e,
    y2: t
  }), [d, u, f, g] = jc({
    sourceX: e,
    sourceY: t,
    targetX: r,
    targetY: i,
    sourceControlX: s,
    sourceControlY: c,
    targetControlX: a,
    targetControlY: l
  });
  return [
    `M${e},${t} C${s},${c} ${a},${l} ${r},${i}`,
    d,
    u,
    f,
    g
  ];
}
function Aa(e) {
  return fe(({ id: t, sourceX: n, sourceY: r, targetX: i, targetY: o, sourcePosition: s, targetPosition: c, label: a, labelStyle: l, labelShowBg: d, labelBgStyle: u, labelBgPadding: f, labelBgBorderRadius: g, style: p, markerEnd: h, markerStart: w, interactionWidth: y }) => {
    const [C, m, v] = Ma({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: i,
      targetY: o,
      targetPosition: c
    }), _ = e.isInternal ? void 0 : t;
    return I(hr, { id: _, path: C, labelX: m, labelY: v, label: a, labelStyle: l, labelShowBg: d, labelBgStyle: u, labelBgPadding: f, labelBgBorderRadius: g, style: p, markerEnd: h, markerStart: w, interactionWidth: y });
  });
}
const Xm = Aa({ isInternal: !1 }), La = Aa({ isInternal: !0 });
Xm.displayName = "SimpleBezierEdge";
La.displayName = "SimpleBezierEdgeInternal";
function $a(e) {
  return fe(({ id: t, sourceX: n, sourceY: r, targetX: i, targetY: o, label: s, labelStyle: c, labelShowBg: a, labelBgStyle: l, labelBgPadding: d, labelBgBorderRadius: u, style: f, sourcePosition: g = Y.Bottom, targetPosition: p = Y.Top, markerEnd: h, markerStart: w, pathOptions: y, interactionWidth: C }) => {
    const [m, v, _] = ii({
      sourceX: n,
      sourceY: r,
      sourcePosition: g,
      targetX: i,
      targetY: o,
      targetPosition: p,
      borderRadius: y == null ? void 0 : y.borderRadius,
      offset: y == null ? void 0 : y.offset,
      stepPosition: y == null ? void 0 : y.stepPosition
    }), b = e.isInternal ? void 0 : t;
    return I(hr, { id: b, path: m, labelX: v, labelY: _, label: s, labelStyle: c, labelShowBg: a, labelBgStyle: l, labelBgPadding: d, labelBgBorderRadius: u, style: f, markerEnd: h, markerStart: w, interactionWidth: C });
  });
}
const Ta = $a({ isInternal: !1 }), ka = $a({ isInternal: !0 });
Ta.displayName = "SmoothStepEdge";
ka.displayName = "SmoothStepEdgeInternal";
function Oa(e) {
  return fe(({ id: t, ...n }) => {
    var i;
    const r = e.isInternal ? void 0 : t;
    return I(Ta, { ...n, id: r, pathOptions: ye(() => {
      var o;
      return { borderRadius: 0, offset: (o = n.pathOptions) == null ? void 0 : o.offset };
    }, [(i = n.pathOptions) == null ? void 0 : i.offset]) });
  });
}
const Ym = Oa({ isInternal: !1 }), Pa = Oa({ isInternal: !0 });
Ym.displayName = "StepEdge";
Pa.displayName = "StepEdgeInternal";
function Da(e) {
  return fe(({ id: t, sourceX: n, sourceY: r, targetX: i, targetY: o, label: s, labelStyle: c, labelShowBg: a, labelBgStyle: l, labelBgPadding: d, labelBgBorderRadius: u, style: f, markerEnd: g, markerStart: p, interactionWidth: h }) => {
    const [w, y, C] = ea({ sourceX: n, sourceY: r, targetX: i, targetY: o }), m = e.isInternal ? void 0 : t;
    return I(hr, { id: m, path: w, labelX: y, labelY: C, label: s, labelStyle: c, labelShowBg: a, labelBgStyle: l, labelBgPadding: d, labelBgBorderRadius: u, style: f, markerEnd: g, markerStart: p, interactionWidth: h });
  });
}
const Gm = Da({ isInternal: !1 }), Ra = Da({ isInternal: !0 });
Gm.displayName = "StraightEdge";
Ra.displayName = "StraightEdgeInternal";
function Fa(e) {
  return fe(({ id: t, sourceX: n, sourceY: r, targetX: i, targetY: o, sourcePosition: s = Y.Bottom, targetPosition: c = Y.Top, label: a, labelStyle: l, labelShowBg: d, labelBgStyle: u, labelBgPadding: f, labelBgBorderRadius: g, style: p, markerEnd: h, markerStart: w, pathOptions: y, interactionWidth: C }) => {
    const [m, v, _] = Qc({
      sourceX: n,
      sourceY: r,
      sourcePosition: s,
      targetX: i,
      targetY: o,
      targetPosition: c,
      curvature: y == null ? void 0 : y.curvature
    }), b = e.isInternal ? void 0 : t;
    return I(hr, { id: b, path: m, labelX: v, labelY: _, label: a, labelStyle: l, labelShowBg: d, labelBgStyle: u, labelBgPadding: f, labelBgBorderRadius: g, style: p, markerEnd: h, markerStart: w, interactionWidth: C });
  });
}
const Km = Fa({ isInternal: !1 }), Va = Fa({ isInternal: !0 });
Km.displayName = "BezierEdge";
Va.displayName = "BezierEdgeInternal";
const ws = {
  default: Va,
  straight: Ra,
  step: Pa,
  smoothstep: ka,
  simplebezier: La
}, xs = {
  sourceX: null,
  sourceY: null,
  targetX: null,
  targetY: null,
  sourcePosition: null,
  targetPosition: null
}, qm = (e, t, n) => n === Y.Left ? e - t : n === Y.Right ? e + t : e, jm = (e, t, n) => n === Y.Top ? e - t : n === Y.Bottom ? e + t : e, _s = "react-flow__edgeupdater";
function Cs({ position: e, centerX: t, centerY: n, radius: r = 10, onMouseDown: i, onMouseEnter: o, onMouseOut: s, type: c }) {
  return I("circle", { onMouseDown: i, onMouseEnter: o, onMouseOut: s, className: de([_s, `${_s}-${c}`]), cx: qm(t, r, e), cy: jm(n, r, e), r, stroke: "transparent", fill: "transparent" });
}
function Qm({ isReconnectable: e, reconnectRadius: t, edge: n, sourceX: r, sourceY: i, targetX: o, targetY: s, sourcePosition: c, targetPosition: a, onReconnect: l, onReconnectStart: d, onReconnectEnd: u, setReconnecting: f, setUpdateHover: g }) {
  const p = ae(), h = (v, _) => {
    if (v.button !== 0)
      return;
    const { autoPanOnConnect: b, domNode: M, isValidConnection: L, connectionMode: $, connectionRadius: V, lib: k, onConnectStart: O, onConnectEnd: D, cancelConnection: x, nodeLookup: T, rfId: S, panBy: A, updateConnection: E } = p.getState(), N = _.type === "target", P = (z, H) => {
      f(!1), u == null || u(z, n, _.type, H);
    }, R = (z) => l == null ? void 0 : l(n, z), F = (z, H) => {
      f(!0), d == null || d(v, n, _.type), O == null || O(z, H);
    };
    ci.onPointerDown(v.nativeEvent, {
      autoPanOnConnect: b,
      connectionMode: $,
      connectionRadius: V,
      domNode: M,
      handleId: _.id,
      nodeId: _.nodeId,
      nodeLookup: T,
      isTarget: N,
      edgeUpdaterType: _.type,
      lib: k,
      flowId: S,
      cancelConnection: x,
      panBy: A,
      isValidConnection: L,
      onConnect: R,
      onConnectStart: F,
      onConnectEnd: D,
      onReconnectEnd: P,
      updateConnection: E,
      getTransform: () => p.getState().transform,
      getFromHandle: () => p.getState().connection.fromHandle,
      dragThreshold: p.getState().connectionDragThreshold,
      handleDomNode: v.currentTarget
    });
  }, w = (v) => {
    var _;
    return h(v, { nodeId: n.target, id: (_ = n.targetHandle) != null ? _ : null, type: "target" });
  }, y = (v) => {
    var _;
    return h(v, { nodeId: n.source, id: (_ = n.sourceHandle) != null ? _ : null, type: "source" });
  }, C = () => g(!0), m = () => g(!1);
  return Q(De, { children: [(e === !0 || e === "source") && I(Cs, { position: c, centerX: r, centerY: i, radius: t, onMouseDown: w, onMouseEnter: C, onMouseOut: m, type: "source" }), (e === !0 || e === "target") && I(Cs, { position: a, centerX: o, centerY: s, radius: t, onMouseDown: y, onMouseEnter: C, onMouseOut: m, type: "target" })] });
}
function Jm({ id: e, edgesFocusable: t, edgesReconnectable: n, elementsSelectable: r, onClick: i, onDoubleClick: o, onContextMenu: s, onMouseEnter: c, onMouseMove: a, onMouseLeave: l, reconnectRadius: d, onReconnect: u, onReconnectStart: f, onReconnectEnd: g, rfId: p, edgeTypes: h, noPanClassName: w, onError: y, disableKeyboardA11y: C }) {
  var ee, q;
  let m = ie((K) => K.edgeLookup.get(e));
  const v = ie((K) => K.defaultEdgeOptions);
  m = v ? { ...v, ...m } : m;
  let _ = m.type || "default", b = (h == null ? void 0 : h[_]) || ws[_];
  b === void 0 && (y == null || y("011", ze.error011(_)), _ = "default", b = (h == null ? void 0 : h.default) || ws.default);
  const M = !!(m.focusable || t && typeof m.focusable > "u"), L = typeof u < "u" && (m.reconnectable || n && typeof m.reconnectable > "u"), $ = !!(m.selectable || r && typeof m.selectable > "u"), V = ne(null), [k, O] = ge(!1), [D, x] = ge(!1), T = ae(), { zIndex: S, sourceX: A, sourceY: E, targetX: N, targetY: P, sourcePosition: R, targetPosition: F } = ie(he((K) => {
    const re = K.nodeLookup.get(m.source), ce = K.nodeLookup.get(m.target);
    if (!re || !ce)
      return {
        zIndex: m.zIndex,
        ...xs
      };
    const se = Hg({
      id: e,
      sourceNode: re,
      targetNode: ce,
      sourceHandle: m.sourceHandle || null,
      targetHandle: m.targetHandle || null,
      connectionMode: K.connectionMode,
      onError: y
    });
    return {
      zIndex: Tg({
        selected: m.selected,
        zIndex: m.zIndex,
        sourceNode: re,
        targetNode: ce,
        elevateOnSelect: K.elevateEdgesOnSelect
      }),
      ...se || xs
    };
  }, [m.source, m.target, m.sourceHandle, m.targetHandle, m.selected, m.zIndex]), le), z = ye(() => m.markerStart ? `url('#${oi(m.markerStart, p)}')` : void 0, [m.markerStart, p]), H = ye(() => m.markerEnd ? `url('#${oi(m.markerEnd, p)}')` : void 0, [m.markerEnd, p]);
  if (m.hidden || A === null || E === null || N === null || P === null)
    return null;
  const Z = (K) => {
    var oe;
    const { addSelectedEdges: re, unselectNodesAndEdges: ce, multiSelectionActive: se } = T.getState();
    $ && (T.setState({ nodesSelectionActive: !1 }), m.selected && se ? (ce({ nodes: [], edges: [m] }), (oe = V.current) == null || oe.blur()) : re([e])), i && i(K, m);
  }, X = o ? (K) => {
    o(K, { ...m });
  } : void 0, W = s ? (K) => {
    s(K, { ...m });
  } : void 0, U = c ? (K) => {
    c(K, { ...m });
  } : void 0, G = a ? (K) => {
    a(K, { ...m });
  } : void 0, j = l ? (K) => {
    l(K, { ...m });
  } : void 0, B = (K) => {
    var re;
    if (!C && Rc.includes(K.key) && $) {
      const { unselectNodesAndEdges: ce, addSelectedEdges: se } = T.getState();
      K.key === "Escape" ? ((re = V.current) == null || re.blur(), ce({ edges: [m] })) : se([e]);
    }
  };
  return I("svg", { style: { zIndex: S }, children: Q("g", { className: de([
    "react-flow__edge",
    `react-flow__edge-${_}`,
    m.className,
    w,
    {
      selected: m.selected,
      animated: m.animated,
      inactive: !$ && !i,
      updating: k,
      selectable: $
    }
  ]), onClick: Z, onDoubleClick: X, onContextMenu: W, onMouseEnter: U, onMouseMove: G, onMouseLeave: j, onKeyDown: M ? B : void 0, tabIndex: M ? 0 : void 0, role: (ee = m.ariaRole) != null ? ee : M ? "group" : "img", "aria-roledescription": "edge", "data-id": e, "data-testid": `rf__edge-${e}`, "aria-label": m.ariaLabel === null ? void 0 : m.ariaLabel || `Edge from ${m.source} to ${m.target}`, "aria-describedby": M ? `${pa}-${p}` : void 0, ref: V, ...m.domAttributes, children: [!D && I(b, { id: e, source: m.source, target: m.target, type: m.type, selected: m.selected, animated: m.animated, selectable: $, deletable: (q = m.deletable) != null ? q : !0, label: m.label, labelStyle: m.labelStyle, labelShowBg: m.labelShowBg, labelBgStyle: m.labelBgStyle, labelBgPadding: m.labelBgPadding, labelBgBorderRadius: m.labelBgBorderRadius, sourceX: A, sourceY: E, targetX: N, targetY: P, sourcePosition: R, targetPosition: F, data: m.data, style: m.style, sourceHandleId: m.sourceHandle, targetHandleId: m.targetHandle, markerStart: z, markerEnd: H, pathOptions: "pathOptions" in m ? m.pathOptions : void 0, interactionWidth: m.interactionWidth }), L && I(Qm, { edge: m, isReconnectable: L, reconnectRadius: d, onReconnect: u, onReconnectStart: f, onReconnectEnd: g, sourceX: A, sourceY: E, targetX: N, targetY: P, sourcePosition: R, targetPosition: F, setUpdateHover: O, setReconnecting: x })] }) });
}
var e3 = fe(Jm);
const t3 = (e) => ({
  edgesFocusable: e.edgesFocusable,
  edgesReconnectable: e.edgesReconnectable,
  elementsSelectable: e.elementsSelectable,
  connectionMode: e.connectionMode,
  onError: e.onError
});
function Ha({ defaultMarkerColor: e, onlyRenderVisibleElements: t, rfId: n, edgeTypes: r, noPanClassName: i, onReconnect: o, onEdgeContextMenu: s, onEdgeMouseEnter: c, onEdgeMouseMove: a, onEdgeMouseLeave: l, onEdgeClick: d, reconnectRadius: u, onEdgeDoubleClick: f, onReconnectStart: g, onReconnectEnd: p, disableKeyboardA11y: h }) {
  const { edgesFocusable: w, edgesReconnectable: y, elementsSelectable: C, onError: m } = ie(t3, le), v = Vm(t);
  return Q("div", { className: "react-flow__edges", children: [I(Wm, { defaultColor: e, rfId: n }), v.map((_) => I(e3, { id: _, edgesFocusable: w, edgesReconnectable: y, elementsSelectable: C, noPanClassName: i, onReconnect: o, onContextMenu: s, onMouseEnter: c, onMouseMove: a, onMouseLeave: l, onClick: d, reconnectRadius: u, onDoubleClick: f, onReconnectStart: g, onReconnectEnd: p, rfId: n, onError: m, edgeTypes: r, disableKeyboardA11y: h }, _))] });
}
Ha.displayName = "EdgeRenderer";
const n3 = fe(Ha), r3 = (e) => `translate(${e.transform[0]}px,${e.transform[1]}px) scale(${e.transform[2]})`;
function i3({ children: e }) {
  const t = ie(r3);
  return I("div", { className: "react-flow__viewport xyflow__viewport react-flow__container", style: { transform: t }, children: e });
}
function o3(e) {
  const t = fr(), n = ne(!1);
  J(() => {
    !n.current && t.viewportInitialized && e && (setTimeout(() => e(t), 1), n.current = !0);
  }, [e, t.viewportInitialized]);
}
const s3 = (e) => {
  var t;
  return (t = e.panZoom) == null ? void 0 : t.syncViewport;
};
function c3(e) {
  const t = ie(s3), n = ae();
  return J(() => {
    e && (t == null || t(e), n.setState({ transform: [e.x, e.y, e.zoom] }));
  }, [e, t]), null;
}
function a3(e) {
  return e.connection.inProgress ? { ...e.connection, to: fn(e.connection.to, e.transform) } : { ...e.connection };
}
function l3(e) {
  return a3;
}
function u3(e) {
  const t = l3();
  return ie(t, le);
}
const f3 = (e) => ({
  nodesConnectable: e.nodesConnectable,
  isValid: e.connection.isValid,
  inProgress: e.connection.inProgress,
  width: e.width,
  height: e.height
});
function d3({ containerStyle: e, style: t, type: n, component: r }) {
  const { nodesConnectable: i, width: o, height: s, isValid: c, inProgress: a } = ie(f3, le);
  return !(o && i && a) ? null : I("svg", { style: e, width: o, height: s, className: "react-flow__connectionline react-flow__container", children: I("g", { className: de(["react-flow__connection", Hc(c)]), children: I(za, { style: t, type: n, CustomComponent: r, isValid: c }) }) });
}
const za = ({ style: e, type: t = Qe.Bezier, CustomComponent: n, isValid: r }) => {
  const { inProgress: i, from: o, fromNode: s, fromHandle: c, fromPosition: a, to: l, toNode: d, toHandle: u, toPosition: f, pointer: g } = u3();
  if (!i)
    return;
  if (n)
    return I(n, { connectionLineType: t, connectionLineStyle: e, fromNode: s, fromHandle: c, fromX: o.x, fromY: o.y, toX: l.x, toY: l.y, fromPosition: a, toPosition: f, connectionStatus: Hc(r), toNode: d, toHandle: u, pointer: g });
  let p = "";
  const h = {
    sourceX: o.x,
    sourceY: o.y,
    sourcePosition: a,
    targetX: l.x,
    targetY: l.y,
    targetPosition: f
  };
  switch (t) {
    case Qe.Bezier:
      [p] = Qc(h);
      break;
    case Qe.SimpleBezier:
      [p] = Ma(h);
      break;
    case Qe.Step:
      [p] = ii({
        ...h,
        borderRadius: 0
      });
      break;
    case Qe.SmoothStep:
      [p] = ii(h);
      break;
    default:
      [p] = ea(h);
  }
  return I("path", { d: p, fill: "none", className: "react-flow__connection-path", style: e });
};
za.displayName = "ConnectionLine";
const h3 = {};
function bs(e = h3) {
  ne(e), ae(), J(() => {
  }, [e]);
}
function g3() {
  ae(), ne(!1), J(() => {
  }, []);
}
function Ba({ nodeTypes: e, edgeTypes: t, onInit: n, onNodeClick: r, onEdgeClick: i, onNodeDoubleClick: o, onEdgeDoubleClick: s, onNodeMouseEnter: c, onNodeMouseMove: a, onNodeMouseLeave: l, onNodeContextMenu: d, onSelectionContextMenu: u, onSelectionStart: f, onSelectionEnd: g, connectionLineType: p, connectionLineStyle: h, connectionLineComponent: w, connectionLineContainerStyle: y, selectionKeyCode: C, selectionOnDrag: m, selectionMode: v, multiSelectionKeyCode: _, panActivationKeyCode: b, zoomActivationKeyCode: M, deleteKeyCode: L, onlyRenderVisibleElements: $, elementsSelectable: V, defaultViewport: k, translateExtent: O, minZoom: D, maxZoom: x, preventScrolling: T, defaultMarkerColor: S, zoomOnScroll: A, zoomOnPinch: E, panOnScroll: N, panOnScrollSpeed: P, panOnScrollMode: R, zoomOnDoubleClick: F, panOnDrag: z, onPaneClick: H, onPaneMouseEnter: Z, onPaneMouseMove: X, onPaneMouseLeave: W, onPaneScroll: U, onPaneContextMenu: G, paneClickDistance: j, nodeClickDistance: B, onEdgeContextMenu: ee, onEdgeMouseEnter: q, onEdgeMouseMove: K, onEdgeMouseLeave: re, reconnectRadius: ce, onReconnect: se, onReconnectStart: oe, onReconnectEnd: _e, noDragClassName: Ae, noWheelClassName: it, noPanClassName: Dt, disableKeyboardA11y: Rt, nodeExtent: xr, rfId: hn, viewport: wt, onViewportChange: Ft }) {
  return bs(e), bs(t), g3(), o3(n), c3(wt), I(Am, { onPaneClick: H, onPaneMouseEnter: Z, onPaneMouseMove: X, onPaneMouseLeave: W, onPaneContextMenu: G, onPaneScroll: U, paneClickDistance: j, deleteKeyCode: L, selectionKeyCode: C, selectionOnDrag: m, selectionMode: v, onSelectionStart: f, onSelectionEnd: g, multiSelectionKeyCode: _, panActivationKeyCode: b, zoomActivationKeyCode: M, elementsSelectable: V, zoomOnScroll: A, zoomOnPinch: E, zoomOnDoubleClick: F, panOnScroll: N, panOnScrollSpeed: P, panOnScrollMode: R, panOnDrag: z, defaultViewport: k, translateExtent: O, minZoom: D, maxZoom: x, onSelectionContextMenu: u, preventScrolling: T, noDragClassName: Ae, noWheelClassName: it, noPanClassName: Dt, disableKeyboardA11y: Rt, onViewportChange: Ft, isControlledViewport: !!wt, children: Q(i3, { children: [I(n3, { edgeTypes: t, onEdgeClick: i, onEdgeDoubleClick: s, onReconnect: se, onReconnectStart: oe, onReconnectEnd: _e, onlyRenderVisibleElements: $, onEdgeContextMenu: ee, onEdgeMouseEnter: q, onEdgeMouseMove: K, onEdgeMouseLeave: re, reconnectRadius: ce, defaultMarkerColor: S, noPanClassName: Dt, disableKeyboardA11y: Rt, rfId: hn }), I(d3, { style: h, type: p, component: w, containerStyle: y }), I("div", { className: "react-flow__edgelabel-renderer" }), I(Fm, { nodeTypes: e, onNodeClick: r, onNodeDoubleClick: o, onNodeMouseEnter: c, onNodeMouseMove: a, onNodeMouseLeave: l, onNodeContextMenu: d, nodeClickDistance: B, onlyRenderVisibleElements: $, noPanClassName: Dt, noDragClassName: Ae, disableKeyboardA11y: Rt, nodeExtent: xr, rfId: hn }), I("div", { className: "react-flow__viewport-portal" })] }) });
}
Ba.displayName = "GraphView";
const p3 = fe(Ba), Ss = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: i, height: o, fitView: s, fitViewOptions: c, minZoom: a = 0.5, maxZoom: l = 2, nodeOrigin: d, nodeExtent: u } = {}) => {
  var b, M, L;
  const f = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), w = (b = r != null ? r : t) != null ? b : [], y = (M = n != null ? n : e) != null ? M : [], C = d != null ? d : [0, 0], m = u != null ? u : jt;
  ra(p, h, w);
  const v = si(y, f, g, {
    nodeOrigin: C,
    nodeExtent: m,
    elevateNodesOnSelect: !1
  });
  let _ = [0, 0, 1];
  if (s && i && o) {
    const $ = ln(f, {
      filter: (D) => !!((D.width || D.initialWidth) && (D.height || D.initialHeight))
    }), { x: V, y: k, zoom: O } = Ki($, i, o, a, l, (L = c == null ? void 0 : c.padding) != null ? L : 0.1);
    _ = [V, k, O];
  }
  return {
    rfId: "1",
    width: i != null ? i : 0,
    height: o != null ? o : 0,
    transform: _,
    nodes: y,
    nodesInitialized: v,
    nodeLookup: f,
    parentLookup: g,
    edges: w,
    edgeLookup: h,
    connectionLookup: p,
    onNodesChange: null,
    onEdgesChange: null,
    hasDefaultNodes: n !== void 0,
    hasDefaultEdges: r !== void 0,
    panZoom: null,
    minZoom: a,
    maxZoom: l,
    translateExtent: jt,
    nodeExtent: m,
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    connectionMode: At.Strict,
    domNode: null,
    paneDragging: !1,
    noPanClassName: "nopan",
    nodeOrigin: C,
    nodeDragThreshold: 1,
    connectionDragThreshold: 1,
    snapGrid: [15, 15],
    snapToGrid: !1,
    nodesDraggable: !0,
    nodesConnectable: !0,
    nodesFocusable: !0,
    edgesFocusable: !0,
    edgesReconnectable: !0,
    elementsSelectable: !0,
    elevateNodesOnSelect: !0,
    elevateEdgesOnSelect: !1,
    selectNodesOnDrag: !0,
    multiSelectionActive: !1,
    fitViewQueued: s != null ? s : !1,
    fitViewOptions: c,
    fitViewResolver: null,
    connection: { ...Vc },
    connectionClickStartHandle: null,
    connectOnClick: !0,
    ariaLiveMessage: "",
    autoPanOnConnect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnNodeFocus: !0,
    autoPanSpeed: 15,
    connectionRadius: 20,
    onError: Eg,
    isValidConnection: void 0,
    onSelectionChangeHandlers: [],
    lib: "react",
    debug: !1,
    ariaLabelConfig: Fc
  };
}, m3 = ({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, width: i, height: o, fitView: s, fitViewOptions: c, minZoom: a, maxZoom: l, nodeOrigin: d, nodeExtent: u }) => kp((f, g) => {
  async function p() {
    const { nodeLookup: h, panZoom: w, fitViewOptions: y, fitViewResolver: C, width: m, height: v, minZoom: _, maxZoom: b } = g();
    w && (await Sg({
      nodes: h,
      width: m,
      height: v,
      panZoom: w,
      minZoom: _,
      maxZoom: b
    }, y), C == null || C.resolve(!0), f({ fitViewResolver: null }));
  }
  return {
    ...Ss({
      nodes: e,
      edges: t,
      width: i,
      height: o,
      fitView: s,
      fitViewOptions: c,
      minZoom: a,
      maxZoom: l,
      nodeOrigin: d,
      nodeExtent: u,
      defaultNodes: n,
      defaultEdges: r
    }),
    setNodes: (h) => {
      const { nodeLookup: w, parentLookup: y, nodeOrigin: C, elevateNodesOnSelect: m, fitViewQueued: v } = g(), _ = si(h, w, y, {
        nodeOrigin: C,
        nodeExtent: u,
        elevateNodesOnSelect: m,
        checkEquality: !0
      });
      v && _ ? (p(), f({ nodes: h, nodesInitialized: _, fitViewQueued: !1, fitViewOptions: void 0 })) : f({ nodes: h, nodesInitialized: _ });
    },
    setEdges: (h) => {
      const { connectionLookup: w, edgeLookup: y } = g();
      ra(w, y, h), f({ edges: h });
    },
    setDefaultNodesAndEdges: (h, w) => {
      if (h) {
        const { setNodes: y } = g();
        y(h), f({ hasDefaultNodes: !0 });
      }
      if (w) {
        const { setEdges: y } = g();
        y(w), f({ hasDefaultEdges: !0 });
      }
    },
    /*
     * Every node gets registerd at a ResizeObserver. Whenever a node
     * changes its dimensions, this function is called to measure the
     * new dimensions and update the nodes.
     */
    updateNodeInternals: (h) => {
      const { triggerNodeChanges: w, nodeLookup: y, parentLookup: C, domNode: m, nodeOrigin: v, nodeExtent: _, debug: b, fitViewQueued: M } = g(), { changes: L, updatedInternals: $ } = Gg(h, y, C, m, v, _);
      $ && (Wg(y, C, { nodeOrigin: v, nodeExtent: _ }), M ? (p(), f({ fitViewQueued: !1, fitViewOptions: void 0 })) : f({}), (L == null ? void 0 : L.length) > 0 && (b && console.log("React Flow: trigger node changes", L), w == null || w(L)));
    },
    updateNodePositions: (h, w = !1) => {
      var _, b;
      const y = [], C = [], { nodeLookup: m, triggerNodeChanges: v } = g();
      for (const [M, L] of h) {
        const $ = m.get(M), V = !!($ != null && $.expandParent && ($ != null && $.parentId) && (L != null && L.position)), k = {
          id: M,
          type: "position",
          position: V ? {
            x: Math.max(0, L.position.x),
            y: Math.max(0, L.position.y)
          } : L.position,
          dragging: w
        };
        V && $.parentId && y.push({
          id: M,
          parentId: $.parentId,
          rect: {
            ...L.internals.positionAbsolute,
            width: (_ = L.measured.width) != null ? _ : 0,
            height: (b = L.measured.height) != null ? b : 0
          }
        }), C.push(k);
      }
      if (y.length > 0) {
        const { parentLookup: M, nodeOrigin: L } = g(), $ = eo(y, m, M, L);
        C.push(...$);
      }
      v(C);
    },
    triggerNodeChanges: (h) => {
      const { onNodesChange: w, setNodes: y, nodes: C, hasDefaultNodes: m, debug: v } = g();
      if (h != null && h.length) {
        if (m) {
          const _ = va(h, C);
          y(_);
        }
        v && console.log("React Flow: trigger node changes", h), w == null || w(h);
      }
    },
    triggerEdgeChanges: (h) => {
      const { onEdgesChange: w, setEdges: y, edges: C, hasDefaultEdges: m, debug: v } = g();
      if (h != null && h.length) {
        if (m) {
          const _ = em(h, C);
          y(_);
        }
        v && console.log("React Flow: trigger edge changes", h), w == null || w(h);
      }
    },
    addSelectedNodes: (h) => {
      const { multiSelectionActive: w, edgeLookup: y, nodeLookup: C, triggerNodeChanges: m, triggerEdgeChanges: v } = g();
      if (w) {
        const _ = h.map((b) => ot(b, !0));
        m(_);
        return;
      }
      m(Ct(C, /* @__PURE__ */ new Set([...h]), !0)), v(Ct(y));
    },
    addSelectedEdges: (h) => {
      const { multiSelectionActive: w, edgeLookup: y, nodeLookup: C, triggerNodeChanges: m, triggerEdgeChanges: v } = g();
      if (w) {
        const _ = h.map((b) => ot(b, !0));
        v(_);
        return;
      }
      v(Ct(y, /* @__PURE__ */ new Set([...h]))), m(Ct(C, /* @__PURE__ */ new Set(), !0));
    },
    unselectNodesAndEdges: ({ nodes: h, edges: w } = {}) => {
      const { edges: y, nodes: C, nodeLookup: m, triggerNodeChanges: v, triggerEdgeChanges: _ } = g(), b = h || C, M = w || y, L = b.map((V) => {
        const k = m.get(V.id);
        return k && (k.selected = !1), ot(V.id, !1);
      }), $ = M.map((V) => ot(V.id, !1));
      v(L), _($);
    },
    setMinZoom: (h) => {
      const { panZoom: w, maxZoom: y } = g();
      w == null || w.setScaleExtent([h, y]), f({ minZoom: h });
    },
    setMaxZoom: (h) => {
      const { panZoom: w, minZoom: y } = g();
      w == null || w.setScaleExtent([y, h]), f({ maxZoom: h });
    },
    setTranslateExtent: (h) => {
      var w;
      (w = g().panZoom) == null || w.setTranslateExtent(h), f({ translateExtent: h });
    },
    resetSelectedElements: () => {
      const { edges: h, nodes: w, triggerNodeChanges: y, triggerEdgeChanges: C, elementsSelectable: m } = g();
      if (!m)
        return;
      const v = w.reduce((b, M) => M.selected ? [...b, ot(M.id, !1)] : b, []), _ = h.reduce((b, M) => M.selected ? [...b, ot(M.id, !1)] : b, []);
      y(v), C(_);
    },
    setNodeExtent: (h) => {
      const { nodes: w, nodeLookup: y, parentLookup: C, nodeOrigin: m, elevateNodesOnSelect: v, nodeExtent: _ } = g();
      h[0][0] === _[0][0] && h[0][1] === _[0][1] && h[1][0] === _[1][0] && h[1][1] === _[1][1] || (si(w, y, C, {
        nodeOrigin: m,
        nodeExtent: h,
        elevateNodesOnSelect: v,
        checkEquality: !1
      }), f({ nodeExtent: h }));
    },
    panBy: (h) => {
      const { transform: w, width: y, height: C, panZoom: m, translateExtent: v } = g();
      return Kg({ delta: h, panZoom: m, transform: w, translateExtent: v, width: y, height: C });
    },
    setCenter: async (h, w, y) => {
      const { width: C, height: m, maxZoom: v, panZoom: _ } = g();
      if (!_)
        return Promise.resolve(!1);
      const b = typeof (y == null ? void 0 : y.zoom) < "u" ? y.zoom : v;
      return await _.setViewport({
        x: C / 2 - h * b,
        y: m / 2 - w * b,
        zoom: b
      }, { duration: y == null ? void 0 : y.duration, ease: y == null ? void 0 : y.ease, interpolate: y == null ? void 0 : y.interpolate }), Promise.resolve(!0);
    },
    cancelConnection: () => {
      f({
        connection: { ...Vc }
      });
    },
    updateConnection: (h) => {
      f({ connection: h });
    },
    reset: () => f({ ...Ss() })
  };
}, Object.is);
function Ua({ initialNodes: e, initialEdges: t, defaultNodes: n, defaultEdges: r, initialWidth: i, initialHeight: o, initialMinZoom: s, initialMaxZoom: c, initialFitViewOptions: a, fitView: l, nodeOrigin: d, nodeExtent: u, children: f }) {
  const [g] = ge(() => m3({
    nodes: e,
    edges: t,
    defaultNodes: n,
    defaultEdges: r,
    width: i,
    height: o,
    fitView: l,
    minZoom: s,
    maxZoom: c,
    fitViewOptions: a,
    nodeOrigin: d,
    nodeExtent: u
  }));
  return I(Op, { value: g, children: I(im, { children: f }) });
}
function y3({ children: e, nodes: t, edges: n, defaultNodes: r, defaultEdges: i, width: o, height: s, fitView: c, fitViewOptions: a, minZoom: l, maxZoom: d, nodeOrigin: u, nodeExtent: f }) {
  return Ot(lr) ? I(De, { children: e }) : I(Ua, { initialNodes: t, initialEdges: n, defaultNodes: r, defaultEdges: i, initialWidth: o, initialHeight: s, fitView: c, initialFitViewOptions: a, initialMinZoom: l, initialMaxZoom: d, nodeOrigin: u, nodeExtent: f, children: e });
}
const v3 = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
function w3({ nodes: e, edges: t, defaultNodes: n, defaultEdges: r, className: i, nodeTypes: o, edgeTypes: s, onNodeClick: c, onEdgeClick: a, onInit: l, onMove: d, onMoveStart: u, onMoveEnd: f, onConnect: g, onConnectStart: p, onConnectEnd: h, onClickConnectStart: w, onClickConnectEnd: y, onNodeMouseEnter: C, onNodeMouseMove: m, onNodeMouseLeave: v, onNodeContextMenu: _, onNodeDoubleClick: b, onNodeDragStart: M, onNodeDrag: L, onNodeDragStop: $, onNodesDelete: V, onEdgesDelete: k, onDelete: O, onSelectionChange: D, onSelectionDragStart: x, onSelectionDrag: T, onSelectionDragStop: S, onSelectionContextMenu: A, onSelectionStart: E, onSelectionEnd: N, onBeforeDelete: P, connectionMode: R, connectionLineType: F = Qe.Bezier, connectionLineStyle: z, connectionLineComponent: H, connectionLineContainerStyle: Z, deleteKeyCode: X = "Backspace", selectionKeyCode: W = "Shift", selectionOnDrag: U = !1, selectionMode: G = Qt.Full, panActivationKeyCode: j = "Space", multiSelectionKeyCode: B = en() ? "Meta" : "Control", zoomActivationKeyCode: ee = en() ? "Meta" : "Control", snapToGrid: q, snapGrid: K, onlyRenderVisibleElements: re = !1, selectNodesOnDrag: ce, nodesDraggable: se, autoPanOnNodeFocus: oe, nodesConnectable: _e, nodesFocusable: Ae, nodeOrigin: it = ma, edgesFocusable: Dt, edgesReconnectable: Rt, elementsSelectable: xr = !0, defaultViewport: hn = Yp, minZoom: wt = 0.5, maxZoom: Ft = 2, translateExtent: so = jt, preventScrolling: fl = !0, nodeExtent: _r, defaultMarkerColor: dl = "#b1b1b7", zoomOnScroll: hl = !0, zoomOnPinch: gl = !0, panOnScroll: pl = !1, panOnScrollSpeed: ml = 0.5, panOnScrollMode: yl = ft.Free, zoomOnDoubleClick: vl = !0, panOnDrag: wl = !0, onPaneClick: xl, onPaneMouseEnter: _l, onPaneMouseMove: Cl, onPaneMouseLeave: bl, onPaneScroll: Sl, onPaneContextMenu: Nl, paneClickDistance: El = 1, nodeClickDistance: Il = 0, children: Ml, onReconnect: Al, onReconnectStart: Ll, onReconnectEnd: $l, onEdgeContextMenu: Tl, onEdgeDoubleClick: kl, onEdgeMouseEnter: Ol, onEdgeMouseMove: Pl, onEdgeMouseLeave: Dl, reconnectRadius: Rl = 10, onNodesChange: Fl, onEdgesChange: Vl, noDragClassName: Hl = "nodrag", noWheelClassName: zl = "nowheel", noPanClassName: co = "nopan", fitView: ao, fitViewOptions: lo, connectOnClick: Bl, attributionPosition: Ul, proOptions: Wl, defaultEdgeOptions: Zl, elevateNodesOnSelect: Xl, elevateEdgesOnSelect: Yl, disableKeyboardA11y: uo = !1, autoPanOnConnect: Gl, autoPanOnNodeDrag: Kl, autoPanSpeed: ql, connectionRadius: jl, isValidConnection: Ql, onError: Jl, style: eu, id: fo, nodeDragThreshold: tu, connectionDragThreshold: nu, viewport: ru, onViewportChange: iu, width: ou, height: su, colorMode: cu = "light", debug: au, onScroll: gn, ariaLabelConfig: lu, ...uu }, fu) {
  const Cr = fo || "1", du = jp(cu), hu = he((ho) => {
    ho.currentTarget.scrollTo({ top: 0, left: 0, behavior: "instant" }), gn == null || gn(ho);
  }, [gn]);
  return I("div", { "data-testid": "rf__wrapper", ...uu, onScroll: hu, style: { ...eu, ...v3 }, ref: fu, className: de(["react-flow", i, du]), id: fo, role: "application", children: Q(y3, { nodes: e, edges: t, width: ou, height: su, fitView: ao, fitViewOptions: lo, minZoom: wt, maxZoom: Ft, nodeOrigin: it, nodeExtent: _r, children: [I(p3, { onInit: l, onNodeClick: c, onEdgeClick: a, onNodeMouseEnter: C, onNodeMouseMove: m, onNodeMouseLeave: v, onNodeContextMenu: _, onNodeDoubleClick: b, nodeTypes: o, edgeTypes: s, connectionLineType: F, connectionLineStyle: z, connectionLineComponent: H, connectionLineContainerStyle: Z, selectionKeyCode: W, selectionOnDrag: U, selectionMode: G, deleteKeyCode: X, multiSelectionKeyCode: B, panActivationKeyCode: j, zoomActivationKeyCode: ee, onlyRenderVisibleElements: re, defaultViewport: hn, translateExtent: so, minZoom: wt, maxZoom: Ft, preventScrolling: fl, zoomOnScroll: hl, zoomOnPinch: gl, zoomOnDoubleClick: vl, panOnScroll: pl, panOnScrollSpeed: ml, panOnScrollMode: yl, panOnDrag: wl, onPaneClick: xl, onPaneMouseEnter: _l, onPaneMouseMove: Cl, onPaneMouseLeave: bl, onPaneScroll: Sl, onPaneContextMenu: Nl, paneClickDistance: El, nodeClickDistance: Il, onSelectionContextMenu: A, onSelectionStart: E, onSelectionEnd: N, onReconnect: Al, onReconnectStart: Ll, onReconnectEnd: $l, onEdgeContextMenu: Tl, onEdgeDoubleClick: kl, onEdgeMouseEnter: Ol, onEdgeMouseMove: Pl, onEdgeMouseLeave: Dl, reconnectRadius: Rl, defaultMarkerColor: dl, noDragClassName: Hl, noWheelClassName: zl, noPanClassName: co, rfId: Cr, disableKeyboardA11y: uo, nodeExtent: _r, viewport: ru, onViewportChange: iu }), I(qp, { nodes: e, edges: t, defaultNodes: n, defaultEdges: r, onConnect: g, onConnectStart: p, onConnectEnd: h, onClickConnectStart: w, onClickConnectEnd: y, nodesDraggable: se, autoPanOnNodeFocus: oe, nodesConnectable: _e, nodesFocusable: Ae, edgesFocusable: Dt, edgesReconnectable: Rt, elementsSelectable: xr, elevateNodesOnSelect: Xl, elevateEdgesOnSelect: Yl, minZoom: wt, maxZoom: Ft, nodeExtent: _r, onNodesChange: Fl, onEdgesChange: Vl, snapToGrid: q, snapGrid: K, connectionMode: R, translateExtent: so, connectOnClick: Bl, defaultEdgeOptions: Zl, fitView: ao, fitViewOptions: lo, onNodesDelete: V, onEdgesDelete: k, onDelete: O, onNodeDragStart: M, onNodeDrag: L, onNodeDragStop: $, onSelectionDrag: T, onSelectionDragStart: x, onSelectionDragStop: S, onMove: d, onMoveStart: u, onMoveEnd: f, noPanClassName: co, nodeOrigin: it, rfId: Cr, autoPanOnConnect: Gl, autoPanOnNodeDrag: Kl, autoPanSpeed: ql, onError: Jl, connectionRadius: jl, isValidConnection: Ql, selectNodesOnDrag: ce, nodeDragThreshold: tu, connectionDragThreshold: nu, onBeforeDelete: P, debug: au, ariaLabelConfig: lu }), I(Xp, { onSelectionChange: D }), Ml, I(zp, { proOptions: Wl, position: Ul }), I(Hp, { rfId: Cr, disableKeyboardA11y: uo })] }) });
}
var x3 = wa(w3);
function _3(e) {
  const [t, n] = ge(e), r = he((i) => n((o) => va(i, o)), []);
  return [t, n, r];
}
function C3({ dimensions: e, lineWidth: t, variant: n, className: r }) {
  return I("path", { strokeWidth: t, d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`, className: de(["react-flow__background-pattern", n, r]) });
}
function b3({ radius: e, className: t }) {
  return I("circle", { cx: e, cy: e, r: e, className: de(["react-flow__background-pattern", "dots", t]) });
}
var tt;
(function(e) {
  e.Lines = "lines", e.Dots = "dots", e.Cross = "cross";
})(tt || (tt = {}));
const S3 = {
  [tt.Dots]: 1,
  [tt.Lines]: 1,
  [tt.Cross]: 6
}, N3 = (e) => ({ transform: e.transform, patternId: `pattern-${e.rfId}` });
function Wa({
  id: e,
  variant: t = tt.Dots,
  // only used for dots and cross
  gap: n = 20,
  // only used for lines and cross
  size: r,
  lineWidth: i = 1,
  offset: o = 0,
  color: s,
  bgColor: c,
  style: a,
  className: l,
  patternClassName: d
}) {
  const u = ne(null), { transform: f, patternId: g } = ie(N3, le), p = r || S3[t], h = t === tt.Dots, w = t === tt.Cross, y = Array.isArray(n) ? n : [n, n], C = [y[0] * f[2] || 1, y[1] * f[2] || 1], m = p * f[2], v = Array.isArray(o) ? o : [o, o], _ = w ? [m, m] : C, b = [
    v[0] * f[2] || 1 + _[0] / 2,
    v[1] * f[2] || 1 + _[1] / 2
  ], M = `${g}${e || ""}`;
  return Q("svg", { className: de(["react-flow__background", l]), style: {
    ...a,
    ...dr,
    "--xy-background-color-props": c,
    "--xy-background-pattern-color-props": s
  }, ref: u, "data-testid": "rf__background", children: [I("pattern", { id: M, x: f[0] % C[0], y: f[1] % C[1], width: C[0], height: C[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${b[0]},-${b[1]})`, children: h ? I(b3, { radius: m / 2, className: d }) : I(C3, { dimensions: _, lineWidth: i, variant: t, className: d }) }), I("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${M})` })] });
}
Wa.displayName = "Background";
const E3 = fe(Wa);
function I3() {
  return I("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: I("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function M3() {
  return I("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: I("path", { d: "M0 0h32v4.2H0z" }) });
}
function A3() {
  return I("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: I("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function L3() {
  return I("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: I("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function $3() {
  return I("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: I("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
function bn({ children: e, className: t, ...n }) {
  return I("button", { type: "button", className: de(["react-flow__controls-button", t]), ...n, children: e });
}
const T3 = (e) => ({
  isInteractive: e.nodesDraggable || e.nodesConnectable || e.elementsSelectable,
  minZoomReached: e.transform[2] <= e.minZoom,
  maxZoomReached: e.transform[2] >= e.maxZoom,
  ariaLabelConfig: e.ariaLabelConfig
});
function Za({ style: e, showZoom: t = !0, showFitView: n = !0, showInteractive: r = !0, fitViewOptions: i, onZoomIn: o, onZoomOut: s, onFitView: c, onInteractiveChange: a, className: l, children: d, position: u = "bottom-left", orientation: f = "vertical", "aria-label": g }) {
  const p = ae(), { isInteractive: h, minZoomReached: w, maxZoomReached: y, ariaLabelConfig: C } = ie(T3, le), { zoomIn: m, zoomOut: v, fitView: _ } = fr(), b = () => {
    m(), o == null || o();
  }, M = () => {
    v(), s == null || s();
  }, L = () => {
    _(i), c == null || c();
  }, $ = () => {
    p.setState({
      nodesDraggable: !h,
      nodesConnectable: !h,
      elementsSelectable: !h
    }), a == null || a(!h);
  };
  return Q(ur, { className: de(["react-flow__controls", f === "horizontal" ? "horizontal" : "vertical", l]), position: u, style: e, "data-testid": "rf__controls", "aria-label": g != null ? g : C["controls.ariaLabel"], children: [t && Q(De, { children: [I(bn, { onClick: b, className: "react-flow__controls-zoomin", title: C["controls.zoomIn.ariaLabel"], "aria-label": C["controls.zoomIn.ariaLabel"], disabled: y, children: I(I3, {}) }), I(bn, { onClick: M, className: "react-flow__controls-zoomout", title: C["controls.zoomOut.ariaLabel"], "aria-label": C["controls.zoomOut.ariaLabel"], disabled: w, children: I(M3, {}) })] }), n && I(bn, { className: "react-flow__controls-fitview", onClick: L, title: C["controls.fitView.ariaLabel"], "aria-label": C["controls.fitView.ariaLabel"], children: I(A3, {}) }), r && I(bn, { className: "react-flow__controls-interactive", onClick: $, title: C["controls.interactive.ariaLabel"], "aria-label": C["controls.interactive.ariaLabel"], children: h ? I($3, {}) : I(L3, {}) }), d] });
}
Za.displayName = "Controls";
fe(Za);
function k3({ id: e, x: t, y: n, width: r, height: i, style: o, color: s, strokeColor: c, strokeWidth: a, className: l, borderRadius: d, shapeRendering: u, selected: f, onClick: g }) {
  const { background: p, backgroundColor: h } = o || {}, w = s || p || h;
  return I("rect", { className: de(["react-flow__minimap-node", { selected: f }, l]), x: t, y: n, rx: d, ry: d, width: r, height: i, style: {
    fill: w,
    stroke: c,
    strokeWidth: a
  }, shapeRendering: u, onClick: g ? (y) => g(y, e) : void 0 });
}
const O3 = fe(k3), P3 = (e) => e.nodes.map((t) => t.id), Dr = (e) => e instanceof Function ? e : () => e;
function D3({
  nodeStrokeColor: e,
  nodeColor: t,
  nodeClassName: n = "",
  nodeBorderRadius: r = 5,
  nodeStrokeWidth: i,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: o = O3,
  onClick: s
}) {
  const c = ie(P3, le), a = Dr(t), l = Dr(e), d = Dr(n), u = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision";
  return I(De, { children: c.map((f) => (
    /*
     * The split of responsibilities between MiniMapNodes and
     * NodeComponentWrapper may appear weird. However, it’s designed to
     * minimize the cost of updates when individual nodes change.
     *
     * For more details, see a similar commit in `NodeRenderer/index.tsx`.
     */
    I(F3, { id: f, nodeColorFunc: a, nodeStrokeColorFunc: l, nodeClassNameFunc: d, nodeBorderRadius: r, nodeStrokeWidth: i, NodeComponent: o, onClick: s, shapeRendering: u }, f)
  )) });
}
function R3({ id: e, nodeColorFunc: t, nodeStrokeColorFunc: n, nodeClassNameFunc: r, nodeBorderRadius: i, nodeStrokeWidth: o, shapeRendering: s, NodeComponent: c, onClick: a }) {
  const { node: l, x: d, y: u, width: f, height: g } = ie((p) => {
    const { internals: h } = p.nodeLookup.get(e), w = h.userNode, { x: y, y: C } = h.positionAbsolute, { width: m, height: v } = Ge(w);
    return {
      node: w,
      x: y,
      y: C,
      width: m,
      height: v
    };
  }, le);
  return !l || l.hidden || !Xc(l) ? null : I(c, { x: d, y: u, width: f, height: g, style: l.style, selected: !!l.selected, className: r(l), color: t(l), borderRadius: i, strokeColor: n(l), strokeWidth: o, shapeRendering: s, onClick: a, id: l.id });
}
const F3 = fe(R3);
var V3 = fe(D3);
const H3 = 200, z3 = 150, B3 = (e) => !e.hidden, U3 = (e) => {
  const t = {
    x: -e.transform[0] / e.transform[2],
    y: -e.transform[1] / e.transform[2],
    width: e.width / e.transform[2],
    height: e.height / e.transform[2]
  };
  return {
    viewBB: t,
    boundingRect: e.nodeLookup.size > 0 ? Zc(ln(e.nodeLookup, { filter: B3 }), t) : t,
    rfId: e.rfId,
    panZoom: e.panZoom,
    translateExtent: e.translateExtent,
    flowWidth: e.width,
    flowHeight: e.height,
    ariaLabelConfig: e.ariaLabelConfig
  };
}, W3 = "react-flow__minimap-desc";
function Xa({
  style: e,
  className: t,
  nodeStrokeColor: n,
  nodeColor: r,
  nodeClassName: i = "",
  nodeBorderRadius: o = 5,
  nodeStrokeWidth: s,
  /*
   * We need to rename the prop to be `CapitalCase` so that JSX will render it as
   * a component properly.
   */
  nodeComponent: c,
  bgColor: a,
  maskColor: l,
  maskStrokeColor: d,
  maskStrokeWidth: u,
  position: f = "bottom-right",
  onClick: g,
  onNodeClick: p,
  pannable: h = !1,
  zoomable: w = !1,
  ariaLabel: y,
  inversePan: C,
  zoomStep: m = 1,
  offsetScale: v = 5
}) {
  var q, K;
  const _ = ae(), b = ne(null), { boundingRect: M, viewBB: L, rfId: $, panZoom: V, translateExtent: k, flowWidth: O, flowHeight: D, ariaLabelConfig: x } = ie(U3, le), T = (q = e == null ? void 0 : e.width) != null ? q : H3, S = (K = e == null ? void 0 : e.height) != null ? K : z3, A = M.width / T, E = M.height / S, N = Math.max(A, E), P = N * T, R = N * S, F = v * N, z = M.x - (P - M.width) / 2 - F, H = M.y - (R - M.height) / 2 - F, Z = P + F * 2, X = R + F * 2, W = `${W3}-${$}`, U = ne(0), G = ne();
  U.current = N, J(() => {
    if (b.current && V)
      return G.current = ip({
        domNode: b.current,
        panZoom: V,
        getTransform: () => _.getState().transform,
        getViewScale: () => U.current
      }), () => {
        var re;
        (re = G.current) == null || re.destroy();
      };
  }, [V]), J(() => {
    var re;
    (re = G.current) == null || re.update({
      translateExtent: k,
      width: O,
      height: D,
      inversePan: C,
      pannable: h,
      zoomStep: m,
      zoomable: w
    });
  }, [h, w, C, m, k, O, D]);
  const j = g ? (re) => {
    var oe;
    const [ce, se] = ((oe = G.current) == null ? void 0 : oe.pointer(re)) || [0, 0];
    g(re, { x: ce, y: se });
  } : void 0, B = p ? he((re, ce) => {
    const se = _.getState().nodeLookup.get(ce).internals.userNode;
    p(re, se);
  }, []) : void 0, ee = y != null ? y : x["minimap.ariaLabel"];
  return I(ur, { position: f, style: {
    ...e,
    "--xy-minimap-background-color-props": typeof a == "string" ? a : void 0,
    "--xy-minimap-mask-background-color-props": typeof l == "string" ? l : void 0,
    "--xy-minimap-mask-stroke-color-props": typeof d == "string" ? d : void 0,
    "--xy-minimap-mask-stroke-width-props": typeof u == "number" ? u * N : void 0,
    "--xy-minimap-node-background-color-props": typeof r == "string" ? r : void 0,
    "--xy-minimap-node-stroke-color-props": typeof n == "string" ? n : void 0,
    "--xy-minimap-node-stroke-width-props": typeof s == "number" ? s : void 0
  }, className: de(["react-flow__minimap", t]), "data-testid": "rf__minimap", children: Q("svg", { width: T, height: S, viewBox: `${z} ${H} ${Z} ${X}`, className: "react-flow__minimap-svg", role: "img", "aria-labelledby": W, ref: b, onClick: j, children: [ee && I("title", { id: W, children: ee }), I(V3, { onClick: B, nodeColor: r, nodeStrokeColor: n, nodeBorderRadius: o, nodeClassName: i, nodeStrokeWidth: s, nodeComponent: c }), I("path", { className: "react-flow__minimap-mask", d: `M${z - F},${H - F}h${Z + F * 2}v${X + F * 2}h${-Z - F * 2}z
        M${L.x},${L.y}h${L.width}v${L.height}h${-L.width}z`, fillRule: "evenodd", pointerEvents: "none" })] }) });
}
Xa.displayName = "MiniMap";
fe(Xa);
const Z3 = (e) => (t) => e ? `${Math.max(1 / t.transform[2], 1)}` : void 0, X3 = {
  [pt.Line]: "right",
  [pt.Handle]: "bottom-right"
};
function Y3({ nodeId: e, position: t, variant: n = pt.Handle, className: r, style: i = void 0, children: o, color: s, minWidth: c = 10, minHeight: a = 10, maxWidth: l = Number.MAX_VALUE, maxHeight: d = Number.MAX_VALUE, keepAspectRatio: u = !1, resizeDirection: f, autoScale: g = !0, shouldResize: p, onResizeStart: h, onResize: w, onResizeEnd: y }) {
  const C = ba(), m = typeof e == "string" ? e : C, v = ae(), _ = ne(null), b = n === pt.Handle, M = ie(he(Z3(b && g), [b, g]), le), L = ne(null), $ = t != null ? t : X3[n];
  J(() => {
    if (!(!_.current || !m))
      return L.current || (L.current = xp({
        domNode: _.current,
        nodeId: m,
        getStoreItems: () => {
          const { nodeLookup: k, transform: O, snapGrid: D, snapToGrid: x, nodeOrigin: T, domNode: S } = v.getState();
          return {
            nodeLookup: k,
            transform: O,
            snapGrid: D,
            snapToGrid: x,
            nodeOrigin: T,
            paneDomNode: S
          };
        },
        onChange: (k, O) => {
          var P, R, F, z, H, Z, X;
          const { triggerNodeChanges: D, nodeLookup: x, parentLookup: T, nodeOrigin: S } = v.getState(), A = [], E = { x: k.x, y: k.y }, N = x.get(m);
          if (N && N.expandParent && N.parentId) {
            const W = (P = N.origin) != null ? P : S, U = (F = (R = k.width) != null ? R : N.measured.width) != null ? F : 0, G = (H = (z = k.height) != null ? z : N.measured.height) != null ? H : 0, j = {
              id: N.id,
              parentId: N.parentId,
              rect: {
                width: U,
                height: G,
                ...Yc({
                  x: (Z = k.x) != null ? Z : N.position.x,
                  y: (X = k.y) != null ? X : N.position.y
                }, { width: U, height: G }, N.parentId, x, W)
              }
            }, B = eo([j], x, T, S);
            A.push(...B), E.x = k.x ? Math.max(W[0] * U, k.x) : void 0, E.y = k.y ? Math.max(W[1] * G, k.y) : void 0;
          }
          if (E.x !== void 0 && E.y !== void 0) {
            const W = {
              id: m,
              type: "position",
              position: { ...E }
            };
            A.push(W);
          }
          if (k.width !== void 0 && k.height !== void 0) {
            const U = {
              id: m,
              type: "dimensions",
              resizing: !0,
              setAttributes: f ? f === "horizontal" ? "width" : "height" : !0,
              dimensions: {
                width: k.width,
                height: k.height
              }
            };
            A.push(U);
          }
          for (const W of O) {
            const U = {
              ...W,
              type: "position"
            };
            A.push(U);
          }
          D(A);
        },
        onEnd: ({ width: k, height: O }) => {
          const D = {
            id: m,
            type: "dimensions",
            resizing: !1,
            dimensions: {
              width: k,
              height: O
            }
          };
          v.getState().triggerNodeChanges([D]);
        }
      })), L.current.update({
        controlPosition: $,
        boundaries: {
          minWidth: c,
          minHeight: a,
          maxWidth: l,
          maxHeight: d
        },
        keepAspectRatio: u,
        resizeDirection: f,
        onResizeStart: h,
        onResize: w,
        onResizeEnd: y,
        shouldResize: p
      }), () => {
        var k;
        (k = L.current) == null || k.destroy();
      };
  }, [
    $,
    c,
    a,
    l,
    d,
    u,
    h,
    w,
    y,
    p
  ]);
  const V = $.split("-");
  return I("div", { className: de(["react-flow__resize-control", "nodrag", ...V, n, r]), ref: _, style: {
    ...i,
    scale: M,
    ...s && { [b ? "backgroundColor" : "borderColor"]: s }
  }, children: o });
}
const Ns = fe(Y3);
function G3({ nodeId: e, isVisible: t = !0, handleClassName: n, handleStyle: r, lineClassName: i, lineStyle: o, color: s, minWidth: c = 10, minHeight: a = 10, maxWidth: l = Number.MAX_VALUE, maxHeight: d = Number.MAX_VALUE, keepAspectRatio: u = !1, autoScale: f = !0, shouldResize: g, onResizeStart: p, onResize: h, onResizeEnd: w }) {
  return t ? Q(De, { children: [gp.map((y) => I(Ns, { className: i, style: o, nodeId: e, position: y, variant: pt.Line, color: s, minWidth: c, minHeight: a, maxWidth: l, maxHeight: d, onResizeStart: p, keepAspectRatio: u, autoScale: f, shouldResize: g, onResize: h, onResizeEnd: w }, y)), hp.map((y) => I(Ns, { className: n, style: r, nodeId: e, position: y, color: s, minWidth: c, minHeight: a, maxWidth: l, maxHeight: d, onResizeStart: p, keepAspectRatio: u, autoScale: f, shouldResize: g, onResize: h, onResizeEnd: w }, y))] }) : null;
}
var K3 = Object.getOwnPropertyDescriptor, q3 = (e, t, n, r) => {
  for (var i = r > 1 ? void 0 : r ? K3(t, n) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (i = s(i) || i);
  return i;
}, Rr = (e, t) => (n, r) => t(n, r, e);
const no = yu("uniui.grid.service");
let li = class extends yt {
  constructor(t, n, r) {
    super();
    // TODO@wzhudev: currently we only support at maximum 2 units rendered side by side.
    // In the future we would introduce a grid system (very much like vscode's) to support more
    // units and more complex layout.
    Se(this, "_unitGrid", []);
    Se(this, "_unitGrid$", new Ur(this._unitGrid));
    Se(this, "unitGrid$", this._unitGrid$.asObservable());
    Se(this, "_newNode", null);
    Se(this, "_newNode$", new Ur(null));
    Se(this, "newNode$", this._newNode$.asObservable());
    Se(this, "_nodeIndex", 0);
    Se(this, "_cachedGrid", null);
    this._renderSrv = t, this._localStorageService = n, this._univerInstanceService = r, this._init();
  }
  get unitGrid() {
    return this._unitGrid;
  }
  get cachedGrid() {
    return this._cachedGrid;
  }
  get newNode() {
    return this._newNode;
  }
  dispose() {
    super.dispose(), this._unitGrid$.complete(), this._newNode$.complete();
  }
  setNewNodeObserver() {
    this._newNode$.next(this._newNode);
  }
  setContainerForRender(t, n) {
    var r;
    (r = this._renderSrv.getRenderById(t)) == null || r.engine.setContainer(n);
  }
  changeDimension(t, n) {
    const r = this._unitGrid.find((i) => i.id === t);
    r && (r.style.width = `${n.width}px`, r.style.height = `${n.height}px`, this._cacheData());
  }
  changePosition(t, n) {
    const r = this._unitGrid.find((i) => i.id === t);
    r && (r.position.x = n.x, r.position.y = n.y, this._cacheData());
  }
  async _init() {
    await this._initData(), this._renderSrv.getRenderAll().forEach((t) => this._onRendererCreated(t)), this.disposeWithMe(this._renderSrv.created$.subscribe((t) => this._onRendererCreated(t))), this.disposeWithMe(this._univerInstanceService.unitDisposed$.subscribe((t) => this._onUnitDisposed(t)));
  }
  async _initData() {
    const t = await this._localStorageService.getItem(Es("static"));
    t && (this._cachedGrid = t);
  }
  _cacheData() {
    this._localStorageService.setItem(Es("static"), this.unitGrid);
  }
  _onRendererCreated(t) {
    const { unitId: n, type: r, isThumbNail: i } = t;
    vu(n) || i || this._insertNewNode(n, r);
  }
  _insertNewNode(t, n) {
    var s, c;
    const r = this._nodeIndex;
    this._nodeIndex += 1;
    const i = 3, o = (c = (s = this._cachedGrid) == null ? void 0 : s.find((a) => a.id === t)) != null ? c : {
      id: t,
      data: {
        unitId: t,
        type: n
      },
      style: {
        width: n === ue.UNIVER_SLIDE ? "1000px" : "940px",
        height: "854px",
        display: "flex",
        borderRadius: "8px",
        border: "1px solid #ccc",
        backgroundColor: n === ue.UNIVER_SHEET ? "#fff" : "#f4f6f8"
      },
      position: { x: r % i * 1050, y: Math.floor(r / i) * 950 + 40 }
    };
    this._unitGrid.push(o), this._newNode = o, this._emitLayoutChange();
  }
  _onUnitDisposed(t) {
    const n = t.getUnitId(), r = this._unitGrid.findIndex((i) => i.id === n);
    r !== -1 && (this._unitGrid.splice(r, 1), this._emitLayoutChange());
  }
  _emitLayoutChange() {
    this._unitGrid$.next(this._unitGrid.slice()), this._cacheData();
  }
};
li = q3([
  Rr(0, Zs),
  Rr(1, Hs),
  Rr(2, Me)
], li);
function Es(e) {
  return `project-cache-${e}`;
}
function j3(e) {
  const t = te(Me), n = ye(() => t.getUnit(e), [e, t]);
  return be(n == null ? void 0 : n.name$, "", !1, [n]);
}
function Q3(e) {
  const t = te(Me), n = be(t.focused$);
  return e === n;
}
const ui = Math.min, Nt = Math.max, Zn = Math.round, He = (e) => ({
  x: e,
  y: e
}), J3 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
}, e2 = {
  start: "end",
  end: "start"
};
function Is(e, t, n) {
  return Nt(e, ui(t, n));
}
function gr(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function mt(e) {
  return e.split("-")[0];
}
function pr(e) {
  return e.split("-")[1];
}
function Ya(e) {
  return e === "x" ? "y" : "x";
}
function Ga(e) {
  return e === "y" ? "height" : "width";
}
const t2 = /* @__PURE__ */ new Set(["top", "bottom"]);
function Je(e) {
  return t2.has(mt(e)) ? "y" : "x";
}
function Ka(e) {
  return Ya(Je(e));
}
function n2(e, t, n) {
  n === void 0 && (n = !1);
  const r = pr(e), i = Ka(e), o = Ga(i);
  let s = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
  return t.reference[o] > t.floating[o] && (s = Xn(s)), [s, Xn(s)];
}
function r2(e) {
  const t = Xn(e);
  return [fi(e), t, fi(t)];
}
function fi(e) {
  return e.replace(/start|end/g, (t) => e2[t]);
}
const Ms = ["left", "right"], As = ["right", "left"], i2 = ["top", "bottom"], o2 = ["bottom", "top"];
function s2(e, t, n) {
  switch (e) {
    case "top":
    case "bottom":
      return n ? t ? As : Ms : t ? Ms : As;
    case "left":
    case "right":
      return t ? i2 : o2;
    default:
      return [];
  }
}
function c2(e, t, n, r) {
  const i = pr(e);
  let o = s2(mt(e), n === "start", r);
  return i && (o = o.map((s) => s + "-" + i), t && (o = o.concat(o.map(fi)))), o;
}
function Xn(e) {
  return e.replace(/left|right|bottom|top/g, (t) => J3[t]);
}
function a2(e) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...e
  };
}
function l2(e) {
  return typeof e != "number" ? a2(e) : {
    top: e,
    right: e,
    bottom: e,
    left: e
  };
}
function Yn(e) {
  const {
    x: t,
    y: n,
    width: r,
    height: i
  } = e;
  return {
    width: r,
    height: i,
    top: n,
    left: t,
    right: t + r,
    bottom: n + i,
    x: t,
    y: n
  };
}
function Ls(e, t, n) {
  let {
    reference: r,
    floating: i
  } = e;
  const o = Je(t), s = Ka(t), c = Ga(s), a = mt(t), l = o === "y", d = r.x + r.width / 2 - i.width / 2, u = r.y + r.height / 2 - i.height / 2, f = r[c] / 2 - i[c] / 2;
  let g;
  switch (a) {
    case "top":
      g = {
        x: d,
        y: r.y - i.height
      };
      break;
    case "bottom":
      g = {
        x: d,
        y: r.y + r.height
      };
      break;
    case "right":
      g = {
        x: r.x + r.width,
        y: u
      };
      break;
    case "left":
      g = {
        x: r.x - i.width,
        y: u
      };
      break;
    default:
      g = {
        x: r.x,
        y: r.y
      };
  }
  switch (pr(t)) {
    case "start":
      g[s] -= f * (n && l ? -1 : 1);
      break;
    case "end":
      g[s] += f * (n && l ? -1 : 1);
      break;
  }
  return g;
}
const u2 = async (e, t, n) => {
  const {
    placement: r = "bottom",
    strategy: i = "absolute",
    middleware: o = [],
    platform: s
  } = n, c = o.filter(Boolean), a = await (s.isRTL == null ? void 0 : s.isRTL(t));
  let l = await s.getElementRects({
    reference: e,
    floating: t,
    strategy: i
  }), {
    x: d,
    y: u
  } = Ls(l, r, a), f = r, g = {}, p = 0;
  for (let h = 0; h < c.length; h++) {
    const {
      name: w,
      fn: y
    } = c[h], {
      x: C,
      y: m,
      data: v,
      reset: _
    } = await y({
      x: d,
      y: u,
      initialPlacement: r,
      placement: f,
      strategy: i,
      middlewareData: g,
      rects: l,
      platform: s,
      elements: {
        reference: e,
        floating: t
      }
    });
    d = C != null ? C : d, u = m != null ? m : u, g = {
      ...g,
      [w]: {
        ...g[w],
        ...v
      }
    }, _ && p <= 50 && (p++, typeof _ == "object" && (_.placement && (f = _.placement), _.rects && (l = _.rects === !0 ? await s.getElementRects({
      reference: e,
      floating: t,
      strategy: i
    }) : _.rects), {
      x: d,
      y: u
    } = Ls(l, f, a)), h = -1);
  }
  return {
    x: d,
    y: u,
    placement: f,
    strategy: i,
    middlewareData: g
  };
};
async function qa(e, t) {
  var n;
  t === void 0 && (t = {});
  const {
    x: r,
    y: i,
    platform: o,
    rects: s,
    elements: c,
    strategy: a
  } = e, {
    boundary: l = "clippingAncestors",
    rootBoundary: d = "viewport",
    elementContext: u = "floating",
    altBoundary: f = !1,
    padding: g = 0
  } = gr(t, e), p = l2(g), w = c[f ? u === "floating" ? "reference" : "floating" : u], y = Yn(await o.getClippingRect({
    element: (n = await (o.isElement == null ? void 0 : o.isElement(w))) == null || n ? w : w.contextElement || await (o.getDocumentElement == null ? void 0 : o.getDocumentElement(c.floating)),
    boundary: l,
    rootBoundary: d,
    strategy: a
  })), C = u === "floating" ? {
    x: r,
    y: i,
    width: s.floating.width,
    height: s.floating.height
  } : s.reference, m = await (o.getOffsetParent == null ? void 0 : o.getOffsetParent(c.floating)), v = await (o.isElement == null ? void 0 : o.isElement(m)) ? await (o.getScale == null ? void 0 : o.getScale(m)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  }, _ = Yn(o.convertOffsetParentRelativeRectToViewportRelativeRect ? await o.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements: c,
    rect: C,
    offsetParent: m,
    strategy: a
  }) : C);
  return {
    top: (y.top - _.top + p.top) / v.y,
    bottom: (_.bottom - y.bottom + p.bottom) / v.y,
    left: (y.left - _.left + p.left) / v.x,
    right: (_.right - y.right + p.right) / v.x
  };
}
const f2 = function(e) {
  return e === void 0 && (e = {}), {
    name: "flip",
    options: e,
    async fn(t) {
      var n, r;
      const {
        placement: i,
        middlewareData: o,
        rects: s,
        initialPlacement: c,
        platform: a,
        elements: l
      } = t, {
        mainAxis: d = !0,
        crossAxis: u = !0,
        fallbackPlacements: f,
        fallbackStrategy: g = "bestFit",
        fallbackAxisSideDirection: p = "none",
        flipAlignment: h = !0,
        ...w
      } = gr(e, t);
      if ((n = o.arrow) != null && n.alignmentOffset)
        return {};
      const y = mt(i), C = Je(c), m = mt(c) === c, v = await (a.isRTL == null ? void 0 : a.isRTL(l.floating)), _ = f || (m || !h ? [Xn(c)] : r2(c)), b = p !== "none";
      !f && b && _.push(...c2(c, h, p, v));
      const M = [c, ..._], L = await qa(t, w), $ = [];
      let V = ((r = o.flip) == null ? void 0 : r.overflows) || [];
      if (d && $.push(L[y]), u) {
        const x = n2(i, s, v);
        $.push(L[x[0]], L[x[1]]);
      }
      if (V = [...V, {
        placement: i,
        overflows: $
      }], !$.every((x) => x <= 0)) {
        var k, O;
        const x = (((k = o.flip) == null ? void 0 : k.index) || 0) + 1, T = M[x];
        if (T && (!(u === "alignment" ? C !== Je(T) : !1) || // We leave the current main axis only if every placement on that axis
        // overflows the main axis.
        V.every((E) => Je(E.placement) === C ? E.overflows[0] > 0 : !0)))
          return {
            data: {
              index: x,
              overflows: V
            },
            reset: {
              placement: T
            }
          };
        let S = (O = V.filter((A) => A.overflows[0] <= 0).sort((A, E) => A.overflows[1] - E.overflows[1])[0]) == null ? void 0 : O.placement;
        if (!S)
          switch (g) {
            case "bestFit": {
              var D;
              const A = (D = V.filter((E) => {
                if (b) {
                  const N = Je(E.placement);
                  return N === C || // Create a bias to the `y` side axis due to horizontal
                  // reading directions favoring greater width.
                  N === "y";
                }
                return !0;
              }).map((E) => [E.placement, E.overflows.filter((N) => N > 0).reduce((N, P) => N + P, 0)]).sort((E, N) => E[1] - N[1])[0]) == null ? void 0 : D[0];
              A && (S = A);
              break;
            }
            case "initialPlacement":
              S = c;
              break;
          }
        if (i !== S)
          return {
            reset: {
              placement: S
            }
          };
      }
      return {};
    }
  };
}, d2 = /* @__PURE__ */ new Set(["left", "top"]);
async function h2(e, t) {
  const {
    placement: n,
    platform: r,
    elements: i
  } = e, o = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), s = mt(n), c = pr(n), a = Je(n) === "y", l = d2.has(s) ? -1 : 1, d = o && a ? -1 : 1, u = gr(t, e);
  let {
    mainAxis: f,
    crossAxis: g,
    alignmentAxis: p
  } = typeof u == "number" ? {
    mainAxis: u,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: u.mainAxis || 0,
    crossAxis: u.crossAxis || 0,
    alignmentAxis: u.alignmentAxis
  };
  return c && typeof p == "number" && (g = c === "end" ? p * -1 : p), a ? {
    x: g * d,
    y: f * l
  } : {
    x: f * l,
    y: g * d
  };
}
const g2 = function(e) {
  return e === void 0 && (e = 0), {
    name: "offset",
    options: e,
    async fn(t) {
      var n, r;
      const {
        x: i,
        y: o,
        placement: s,
        middlewareData: c
      } = t, a = await h2(t, e);
      return s === ((n = c.offset) == null ? void 0 : n.placement) && (r = c.arrow) != null && r.alignmentOffset ? {} : {
        x: i + a.x,
        y: o + a.y,
        data: {
          ...a,
          placement: s
        }
      };
    }
  };
}, p2 = function(e) {
  return e === void 0 && (e = {}), {
    name: "shift",
    options: e,
    async fn(t) {
      const {
        x: n,
        y: r,
        placement: i
      } = t, {
        mainAxis: o = !0,
        crossAxis: s = !1,
        limiter: c = {
          fn: (w) => {
            let {
              x: y,
              y: C
            } = w;
            return {
              x: y,
              y: C
            };
          }
        },
        ...a
      } = gr(e, t), l = {
        x: n,
        y: r
      }, d = await qa(t, a), u = Je(mt(i)), f = Ya(u);
      let g = l[f], p = l[u];
      if (o) {
        const w = f === "y" ? "top" : "left", y = f === "y" ? "bottom" : "right", C = g + d[w], m = g - d[y];
        g = Is(C, g, m);
      }
      if (s) {
        const w = u === "y" ? "top" : "left", y = u === "y" ? "bottom" : "right", C = p + d[w], m = p - d[y];
        p = Is(C, p, m);
      }
      const h = c.fn({
        ...t,
        [f]: g,
        [u]: p
      });
      return {
        ...h,
        data: {
          x: h.x - n,
          y: h.y - r,
          enabled: {
            [f]: o,
            [u]: s
          }
        }
      };
    }
  };
};
function mr() {
  return typeof window < "u";
}
function Pt(e) {
  return ja(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function Ee(e) {
  var t;
  return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Ke(e) {
  var t;
  return (t = (ja(e) ? e.ownerDocument : e.document) || window.document) == null ? void 0 : t.documentElement;
}
function ja(e) {
  return mr() ? e instanceof Node || e instanceof Ee(e).Node : !1;
}
function Oe(e) {
  return mr() ? e instanceof Element || e instanceof Ee(e).Element : !1;
}
function Be(e) {
  return mr() ? e instanceof HTMLElement || e instanceof Ee(e).HTMLElement : !1;
}
function $s(e) {
  return !mr() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof Ee(e).ShadowRoot;
}
const m2 = /* @__PURE__ */ new Set(["inline", "contents"]);
function dn(e) {
  const {
    overflow: t,
    overflowX: n,
    overflowY: r,
    display: i
  } = Pe(e);
  return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && !m2.has(i);
}
const y2 = /* @__PURE__ */ new Set(["table", "td", "th"]);
function v2(e) {
  return y2.has(Pt(e));
}
const w2 = [":popover-open", ":modal"];
function yr(e) {
  return w2.some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
const x2 = ["transform", "translate", "scale", "rotate", "perspective"], _2 = ["transform", "translate", "scale", "rotate", "perspective", "filter"], C2 = ["paint", "layout", "strict", "content"];
function ro(e) {
  const t = io(), n = Oe(e) ? Pe(e) : e;
  return x2.some((r) => n[r] ? n[r] !== "none" : !1) || (n.containerType ? n.containerType !== "normal" : !1) || !t && (n.backdropFilter ? n.backdropFilter !== "none" : !1) || !t && (n.filter ? n.filter !== "none" : !1) || _2.some((r) => (n.willChange || "").includes(r)) || C2.some((r) => (n.contain || "").includes(r));
}
function b2(e) {
  let t = rt(e);
  for (; Be(t) && !kt(t); ) {
    if (ro(t))
      return t;
    if (yr(t))
      return null;
    t = rt(t);
  }
  return null;
}
function io() {
  return typeof CSS > "u" || !CSS.supports ? !1 : CSS.supports("-webkit-backdrop-filter", "none");
}
const S2 = /* @__PURE__ */ new Set(["html", "body", "#document"]);
function kt(e) {
  return S2.has(Pt(e));
}
function Pe(e) {
  return Ee(e).getComputedStyle(e);
}
function vr(e) {
  return Oe(e) ? {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  } : {
    scrollLeft: e.scrollX,
    scrollTop: e.scrollY
  };
}
function rt(e) {
  if (Pt(e) === "html")
    return e;
  const t = (
    // Step into the shadow DOM of the parent of a slotted node.
    e.assignedSlot || // DOM Element detected.
    e.parentNode || // ShadowRoot detected.
    $s(e) && e.host || // Fallback.
    Ke(e)
  );
  return $s(t) ? t.host : t;
}
function Qa(e) {
  const t = rt(e);
  return kt(t) ? e.ownerDocument ? e.ownerDocument.body : e.body : Be(t) && dn(t) ? t : Qa(t);
}
function Ja(e, t, n) {
  var r;
  t === void 0 && (t = []);
  const i = Qa(e), o = i === ((r = e.ownerDocument) == null ? void 0 : r.body), s = Ee(i);
  return o ? (di(s), t.concat(s, s.visualViewport || [], dn(i) ? i : [], [])) : t.concat(i, Ja(i, []));
}
function di(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function el(e) {
  const t = Pe(e);
  let n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0;
  const i = Be(e), o = i ? e.offsetWidth : n, s = i ? e.offsetHeight : r, c = Zn(n) !== o || Zn(r) !== s;
  return c && (n = o, r = s), {
    width: n,
    height: r,
    $: c
  };
}
function tl(e) {
  return Oe(e) ? e : e.contextElement;
}
function Et(e) {
  const t = tl(e);
  if (!Be(t))
    return He(1);
  const n = t.getBoundingClientRect(), {
    width: r,
    height: i,
    $: o
  } = el(t);
  let s = (o ? Zn(n.width) : n.width) / r, c = (o ? Zn(n.height) : n.height) / i;
  return (!s || !Number.isFinite(s)) && (s = 1), (!c || !Number.isFinite(c)) && (c = 1), {
    x: s,
    y: c
  };
}
const N2 = /* @__PURE__ */ He(0);
function nl(e) {
  const t = Ee(e);
  return !io() || !t.visualViewport ? N2 : {
    x: t.visualViewport.offsetLeft,
    y: t.visualViewport.offsetTop
  };
}
function E2(e, t, n) {
  return t === void 0 && (t = !1), !n || t && n !== Ee(e) ? !1 : t;
}
function rn(e, t, n, r) {
  t === void 0 && (t = !1), n === void 0 && (n = !1);
  const i = e.getBoundingClientRect(), o = tl(e);
  let s = He(1);
  t && (r ? Oe(r) && (s = Et(r)) : s = Et(e));
  const c = E2(o, n, r) ? nl(o) : He(0);
  let a = (i.left + c.x) / s.x, l = (i.top + c.y) / s.y, d = i.width / s.x, u = i.height / s.y;
  if (o) {
    const f = Ee(o), g = r && Oe(r) ? Ee(r) : r;
    let p = f, h = di(p);
    for (; h && r && g !== p; ) {
      const w = Et(h), y = h.getBoundingClientRect(), C = Pe(h), m = y.left + (h.clientLeft + parseFloat(C.paddingLeft)) * w.x, v = y.top + (h.clientTop + parseFloat(C.paddingTop)) * w.y;
      a *= w.x, l *= w.y, d *= w.x, u *= w.y, a += m, l += v, p = Ee(h), h = di(p);
    }
  }
  return Yn({
    width: d,
    height: u,
    x: a,
    y: l
  });
}
function wr(e, t) {
  const n = vr(e).scrollLeft;
  return t ? t.left + n : rn(Ke(e)).left + n;
}
function rl(e, t) {
  const n = e.getBoundingClientRect(), r = n.left + t.scrollLeft - wr(e, n), i = n.top + t.scrollTop;
  return {
    x: r,
    y: i
  };
}
function I2(e) {
  let {
    elements: t,
    rect: n,
    offsetParent: r,
    strategy: i
  } = e;
  const o = i === "fixed", s = Ke(r), c = t ? yr(t.floating) : !1;
  if (r === s || c && o)
    return n;
  let a = {
    scrollLeft: 0,
    scrollTop: 0
  }, l = He(1);
  const d = He(0), u = Be(r);
  if ((u || !u && !o) && ((Pt(r) !== "body" || dn(s)) && (a = vr(r)), Be(r))) {
    const g = rn(r);
    l = Et(r), d.x = g.x + r.clientLeft, d.y = g.y + r.clientTop;
  }
  const f = s && !u && !o ? rl(s, a) : He(0);
  return {
    width: n.width * l.x,
    height: n.height * l.y,
    x: n.x * l.x - a.scrollLeft * l.x + d.x + f.x,
    y: n.y * l.y - a.scrollTop * l.y + d.y + f.y
  };
}
function M2(e) {
  return Array.from(e.getClientRects());
}
function A2(e) {
  const t = Ke(e), n = vr(e), r = e.ownerDocument.body, i = Nt(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth), o = Nt(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight);
  let s = -n.scrollLeft + wr(e);
  const c = -n.scrollTop;
  return Pe(r).direction === "rtl" && (s += Nt(t.clientWidth, r.clientWidth) - i), {
    width: i,
    height: o,
    x: s,
    y: c
  };
}
const Ts = 25;
function L2(e, t) {
  const n = Ee(e), r = Ke(e), i = n.visualViewport;
  let o = r.clientWidth, s = r.clientHeight, c = 0, a = 0;
  if (i) {
    o = i.width, s = i.height;
    const d = io();
    (!d || d && t === "fixed") && (c = i.offsetLeft, a = i.offsetTop);
  }
  const l = wr(r);
  if (l <= 0) {
    const d = r.ownerDocument, u = d.body, f = getComputedStyle(u), g = d.compatMode === "CSS1Compat" && parseFloat(f.marginLeft) + parseFloat(f.marginRight) || 0, p = Math.abs(r.clientWidth - u.clientWidth - g);
    p <= Ts && (o -= p);
  } else l <= Ts && (o += l);
  return {
    width: o,
    height: s,
    x: c,
    y: a
  };
}
const $2 = /* @__PURE__ */ new Set(["absolute", "fixed"]);
function T2(e, t) {
  const n = rn(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, o = Be(e) ? Et(e) : He(1), s = e.clientWidth * o.x, c = e.clientHeight * o.y, a = i * o.x, l = r * o.y;
  return {
    width: s,
    height: c,
    x: a,
    y: l
  };
}
function ks(e, t, n) {
  let r;
  if (t === "viewport")
    r = L2(e, n);
  else if (t === "document")
    r = A2(Ke(e));
  else if (Oe(t))
    r = T2(t, n);
  else {
    const i = nl(e);
    r = {
      x: t.x - i.x,
      y: t.y - i.y,
      width: t.width,
      height: t.height
    };
  }
  return Yn(r);
}
function il(e, t) {
  const n = rt(e);
  return n === t || !Oe(n) || kt(n) ? !1 : Pe(n).position === "fixed" || il(n, t);
}
function k2(e, t) {
  const n = t.get(e);
  if (n)
    return n;
  let r = Ja(e, []).filter((c) => Oe(c) && Pt(c) !== "body"), i = null;
  const o = Pe(e).position === "fixed";
  let s = o ? rt(e) : e;
  for (; Oe(s) && !kt(s); ) {
    const c = Pe(s), a = ro(s);
    !a && c.position === "fixed" && (i = null), (o ? !a && !i : !a && c.position === "static" && !!i && $2.has(i.position) || dn(s) && !a && il(e, s)) ? r = r.filter((d) => d !== s) : i = c, s = rt(s);
  }
  return t.set(e, r), r;
}
function O2(e) {
  let {
    element: t,
    boundary: n,
    rootBoundary: r,
    strategy: i
  } = e;
  const s = [...n === "clippingAncestors" ? yr(t) ? [] : k2(t, this._c) : [].concat(n), r], c = s[0], a = s.reduce((l, d) => {
    const u = ks(t, d, i);
    return l.top = Nt(u.top, l.top), l.right = ui(u.right, l.right), l.bottom = ui(u.bottom, l.bottom), l.left = Nt(u.left, l.left), l;
  }, ks(t, c, i));
  return {
    width: a.right - a.left,
    height: a.bottom - a.top,
    x: a.left,
    y: a.top
  };
}
function P2(e) {
  const {
    width: t,
    height: n
  } = el(e);
  return {
    width: t,
    height: n
  };
}
function D2(e, t, n) {
  const r = Be(t), i = Ke(t), o = n === "fixed", s = rn(e, !0, o, t);
  let c = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const a = He(0);
  function l() {
    a.x = wr(i);
  }
  if (r || !r && !o)
    if ((Pt(t) !== "body" || dn(i)) && (c = vr(t)), r) {
      const g = rn(t, !0, o, t);
      a.x = g.x + t.clientLeft, a.y = g.y + t.clientTop;
    } else i && l();
  o && !r && i && l();
  const d = i && !r && !o ? rl(i, c) : He(0), u = s.left + c.scrollLeft - a.x - d.x, f = s.top + c.scrollTop - a.y - d.y;
  return {
    x: u,
    y: f,
    width: s.width,
    height: s.height
  };
}
function Fr(e) {
  return Pe(e).position === "static";
}
function Os(e, t) {
  if (!Be(e) || Pe(e).position === "fixed")
    return null;
  if (t)
    return t(e);
  let n = e.offsetParent;
  return Ke(e) === n && (n = n.ownerDocument.body), n;
}
function ol(e, t) {
  const n = Ee(e);
  if (yr(e))
    return n;
  if (!Be(e)) {
    let i = rt(e);
    for (; i && !kt(i); ) {
      if (Oe(i) && !Fr(i))
        return i;
      i = rt(i);
    }
    return n;
  }
  let r = Os(e, t);
  for (; r && v2(r) && Fr(r); )
    r = Os(r, t);
  return r && kt(r) && Fr(r) && !ro(r) ? n : r || b2(e) || n;
}
const R2 = async function(e) {
  const t = this.getOffsetParent || ol, n = this.getDimensions, r = await n(e.floating);
  return {
    reference: D2(e.reference, await t(e.floating), e.strategy),
    floating: {
      x: 0,
      y: 0,
      width: r.width,
      height: r.height
    }
  };
};
function F2(e) {
  return Pe(e).direction === "rtl";
}
const V2 = {
  convertOffsetParentRelativeRectToViewportRelativeRect: I2,
  getDocumentElement: Ke,
  getClippingRect: O2,
  getOffsetParent: ol,
  getElementRects: R2,
  getClientRects: M2,
  getDimensions: P2,
  getScale: Et,
  isElement: Oe,
  isRTL: F2
}, H2 = g2, z2 = p2, B2 = f2, U2 = (e, t, n) => {
  const r = /* @__PURE__ */ new Map(), i = {
    platform: V2,
    ...n
  }, o = {
    ...i.platform,
    _c: r
  };
  return u2(e, t, {
    ...i,
    platform: o
  });
};
var W2 = typeof document < "u", Z2 = function() {
}, Tn = W2 ? on : Z2;
function Gn(e, t) {
  if (e === t)
    return !0;
  if (typeof e != typeof t)
    return !1;
  if (typeof e == "function" && e.toString() === t.toString())
    return !0;
  let n, r, i;
  if (e && t && typeof e == "object") {
    if (Array.isArray(e)) {
      if (n = e.length, n !== t.length) return !1;
      for (r = n; r-- !== 0; )
        if (!Gn(e[r], t[r]))
          return !1;
      return !0;
    }
    if (i = Object.keys(e), n = i.length, n !== Object.keys(t).length)
      return !1;
    for (r = n; r-- !== 0; )
      if (!{}.hasOwnProperty.call(t, i[r]))
        return !1;
    for (r = n; r-- !== 0; ) {
      const o = i[r];
      if (!(o === "_owner" && e.$$typeof) && !Gn(e[o], t[o]))
        return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function sl(e) {
  return typeof window > "u" ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Ps(e, t) {
  const n = sl(e);
  return Math.round(t * n) / n;
}
function Vr(e) {
  const t = me.useRef(e);
  return Tn(() => {
    t.current = e;
  }), t;
}
function X2(e) {
  e === void 0 && (e = {});
  const {
    placement: t = "bottom",
    strategy: n = "absolute",
    middleware: r = [],
    platform: i,
    elements: {
      reference: o,
      floating: s
    } = {},
    transform: c = !0,
    whileElementsMounted: a,
    open: l
  } = e, [d, u] = me.useState({
    x: 0,
    y: 0,
    strategy: n,
    placement: t,
    middlewareData: {},
    isPositioned: !1
  }), [f, g] = me.useState(r);
  Gn(f, r) || g(r);
  const [p, h] = me.useState(null), [w, y] = me.useState(null), C = me.useCallback((E) => {
    E !== b.current && (b.current = E, h(E));
  }, []), m = me.useCallback((E) => {
    E !== M.current && (M.current = E, y(E));
  }, []), v = o || p, _ = s || w, b = me.useRef(null), M = me.useRef(null), L = me.useRef(d), $ = a != null, V = Vr(a), k = Vr(i), O = Vr(l), D = me.useCallback(() => {
    if (!b.current || !M.current)
      return;
    const E = {
      placement: t,
      strategy: n,
      middleware: f
    };
    k.current && (E.platform = k.current), U2(b.current, M.current, E).then((N) => {
      const P = {
        ...N,
        // The floating element's position may be recomputed while it's closed
        // but still mounted (such as when transitioning out). To ensure
        // `isPositioned` will be `false` initially on the next open, avoid
        // setting it to `true` when `open === false` (must be specified).
        isPositioned: O.current !== !1
      };
      x.current && !Gn(L.current, P) && (L.current = P, Yf.flushSync(() => {
        u(P);
      }));
    });
  }, [f, t, n, k, O]);
  Tn(() => {
    l === !1 && L.current.isPositioned && (L.current.isPositioned = !1, u((E) => ({
      ...E,
      isPositioned: !1
    })));
  }, [l]);
  const x = me.useRef(!1);
  Tn(() => (x.current = !0, () => {
    x.current = !1;
  }), []), Tn(() => {
    if (v && (b.current = v), _ && (M.current = _), v && _) {
      if (V.current)
        return V.current(v, _, D);
      D();
    }
  }, [v, _, D, V, $]);
  const T = me.useMemo(() => ({
    reference: b,
    floating: M,
    setReference: C,
    setFloating: m
  }), [C, m]), S = me.useMemo(() => ({
    reference: v,
    floating: _
  }), [v, _]), A = me.useMemo(() => {
    const E = {
      position: n,
      left: 0,
      top: 0
    };
    if (!S.floating)
      return E;
    const N = Ps(S.floating, d.x), P = Ps(S.floating, d.y);
    return c ? {
      ...E,
      transform: "translate(" + N + "px, " + P + "px)",
      ...sl(S.floating) >= 1.5 && {
        willChange: "transform"
      }
    } : {
      position: n,
      left: N,
      top: P
    };
  }, [n, c, S.floating, d.x, d.y]);
  return me.useMemo(() => ({
    ...d,
    update: D,
    refs: T,
    elements: S,
    floatingStyles: A
  }), [d, D, T, S, A]);
}
const Y2 = (e, t) => ({
  ...H2(e),
  options: [e, t]
}), G2 = (e, t) => ({
  ...z2(e),
  options: [e, t]
}), K2 = (e, t) => ({
  ...B2(e),
  options: [e, t]
});
var q2 = /* @__PURE__ */ ((e) => (e.NAME = "name", e))(q2 || {});
const j2 = [
  Si,
  Ni,
  ad,
  Ei,
  Ii,
  Mi
], Q2 = pe(({ node: e }, t) => {
  const n = te(Qn), r = be(n.menuChanged$), [i, o] = ge([]), { x: s, y: c, refs: a, strategy: l, update: d } = X2({
    placement: "top",
    middleware: [Y2(10), K2(), G2({ padding: 5 })]
  }), { setReference: u, setFloating: f } = a, g = ct(
    "name"
    /* NAME */
  ), p = () => {
    const h = n.getMenuByPositionKey(Xt.TOOLBAR_FLOAT);
    if (h) {
      const w = j2.map((y) => {
        var C;
        return (C = h.find((m) => m.key === y)) == null ? void 0 : C.item;
      }).filter((y) => !!y);
      o(w);
    }
  };
  return Xf(t, () => ({
    update: () => d()
  }), [d]), J(() => {
    if (e) {
      const h = document.querySelector(`[data-id="${e.unitId}"]`);
      u(h);
    }
  }, [e, u]), J(() => {
    p();
  }, [r]), !e || !a.reference.current ? null : /* @__PURE__ */ I(
    "div",
    {
      ref: f,
      className: "univer-flex univer-items-center univer-gap-2 univer-rounded-md univer-bg-white univer-text-sm univer-text-primary-600 dark:!univer-bg-gray-900",
      style: { position: l, top: c != null ? c : 0, left: s != null ? s : 0 },
      children: /* @__PURE__ */ Q(
        "div",
        {
          className: "univer-inline-flex univer-flex-shrink-0 univer-items-center univer-gap-2 univer-p-2",
          children: [
            /* @__PURE__ */ I(
              at,
              {
                components: g,
                fallback: /* @__PURE__ */ I(J2, { unitId: e.unitId })
              },
              "name"
            ),
            /* @__PURE__ */ I(cl, {}),
            /* @__PURE__ */ I("div", { className: "univer-flex", children: i.map((h) => /* @__PURE__ */ I(zs, { ...h }, h.id)) })
          ]
        }
      )
    }
  );
});
function cl() {
  return /* @__PURE__ */ I("div", { className: "univer-h-6 univer-w-px univer-bg-gray-100" });
}
function J2({ unitId: e }) {
  const n = te(Me).getUnit(e), r = be(n == null ? void 0 : n.name$);
  return /* @__PURE__ */ I(
    "div",
    {
      className: "univer-flex univer-h-6 univer-items-center univer-gap-1 univer-rounded-md univer-bg-white univer-px-1 univer-py-0 univer-text-sm univer-text-gray-900 dark:!univer-text-white",
      children: r
    }
  );
}
const Sn = (e) => {
  const { children: t, onClick: n, style: r, tooltips: i } = e;
  return /* @__PURE__ */ I(Hf, { title: i, children: /* @__PURE__ */ I(
    Xr,
    {
      variant: "text",
      className: "univer-p-1.5",
      onClick: n,
      style: r,
      children: t
    }
  ) });
}, e9 = 2, Ds = 0.1, t9 = 1, Hr = [10, 50, 75, 100, 125, 150, 200, 0];
var al = /* @__PURE__ */ ((e) => (e.AI = "AI", e))(al || {});
const n9 = ({ zoom: e, onItemClick: t }) => {
  const n = te(no), { zoomIn: r, zoomOut: i, fitView: o, getNodes: s, setCenter: c, getZoom: a } = fr(), l = Math.floor(e * 100), d = r9() ? 360 : 12, u = () => {
    r();
  }, f = () => {
    i();
  }, g = () => {
    document.body.requestFullscreen();
  }, p = he((y) => {
    const C = s(), m = C.map(($) => $.position.x), v = C.map(($) => {
      var V, k;
      return $.position.x + ((k = (V = $.measured) == null ? void 0 : V.width) != null ? k : 0);
    }), _ = C.map(($) => $.position.y), b = C.map(($) => {
      var V, k;
      return $.position.y + ((k = (V = $.measured) == null ? void 0 : V.height) != null ? k : 0);
    }), M = (Math.min(...m) + Math.max(...v)) / 2, L = (Math.min(..._) + Math.max(...b)) / 2;
    c(M, L, { zoom: y });
  }, [s, c]), h = (y) => {
    var C, m;
    if (y) {
      const { x: v, y: _ } = y.position, b = Number.parseInt(`${(C = y.style) == null ? void 0 : C.width}`) || 0, M = Number.parseInt(`${(m = y.style) == null ? void 0 : m.height}`) || 0;
      c(v + b / 2, _ + M / 2, {
        duration: 300,
        zoom: 1
      });
    }
  }, w = he((y) => {
    y === 0 ? o() : p(y / 100);
  }, [p, o]);
  return on(() => {
    setTimeout(() => {
      p(1);
    }, 1e3);
  }, [p]), J(() => {
    const y = n.newNode$.subscribe((C) => h(C));
    return () => {
      y.unsubscribe();
    };
  }, [o]), /* @__PURE__ */ Q(
    "div",
    {
      className: nt("univer-fixed univer-bottom-3 univer-right-3 univer-flex univer-w-fit univer-items-center univer-gap-3 univer-rounded-[10px] univer-bg-white univer-p-2 univer-shadow", xi),
      style: { right: `${d}px` },
      children: [
        /* @__PURE__ */ I(Sn, { tooltips: "Full screen", onClick: g, children: /* @__PURE__ */ I(js, {}) }),
        /* @__PURE__ */ I(Sn, { tooltips: "Zoom in", onClick: u, children: /* @__PURE__ */ I(Js, {}) }),
        /* @__PURE__ */ I(
          Vf,
          {
            overlay: /* @__PURE__ */ I(
              "div",
              {
                className: "univer-box-border univer-grid univer-w-32 univer-items-center univer-gap-1 univer-p-4 univer-text-xs",
                children: Hr == null ? void 0 : Hr.map((y) => /* @__PURE__ */ Q(
                  "a",
                  {
                    className: nt("univer-relative univer-box-border univer-cursor-pointer univer-rounded univer-py-1 univer-pl-9 univer-text-gray-900 univer-no-underline univer-transition-colors univer-duration-200 hover:univer-bg-gray-100 dark:!univer-text-white dark:hover:!univer-bg-gray-700", y === l ? "univer-bg-gray-100" : ""),
                    onClick: () => w(y),
                    children: [
                      y === l && /* @__PURE__ */ I(
                        "span",
                        {
                          className: "univer-absolute univer-left-1 univer-top-0 univer-flex univer-h-full univer-items-center univer-text-green-600",
                          children: /* @__PURE__ */ I(Fi, {})
                        }
                      ),
                      /* @__PURE__ */ I("span", { children: y === 0 ? "Fit View" : `${y}%` })
                    ]
                  },
                  y
                ))
              }
            ),
            children: /* @__PURE__ */ Q(
              "a",
              {
                className: "univer-h-7 univer-w-[55px] univer-cursor-pointer univer-rounded univer-text-center univer-text-xs univer-leading-loose univer-text-gray-700 univer-no-underline univer-transition-all univer-duration-200 group-data-[open=true]:univer-bg-gray-200 hover:univer-bg-gray-200",
                children: [
                  l,
                  "%"
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ I(Sn, { tooltips: "Zoom out", onClick: f, children: /* @__PURE__ */ I(sc, {}) }),
        /* @__PURE__ */ I(cl, {}),
        /* @__PURE__ */ I(Sn, { tooltips: "AI", onClick: () => t == null ? void 0 : t("AI"), style: { background: "#274FEE" }, children: /* @__PURE__ */ Q("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", children: [
          /* @__PURE__ */ I("path", { d: "M5.09091 19C4.63904 19 4.27273 18.6337 4.27273 18.1818C4.27273 17.7299 4.63904 17.3636 5.09091 17.3636C5.54278 17.3636 5.90909 17.7299 5.90909 18.1818C5.90909 18.6337 5.54278 19 5.09091 19Z", fill: "white" }),
          /* @__PURE__ */ I("path", { d: "M14.9091 2.63636C14.4572 2.63636 14.0909 2.27005 14.0909 1.81818C14.0909 1.36631 14.4572 1 14.9091 1C15.361 1 15.7273 1.36631 15.7273 1.81818C15.7273 2.27005 15.361 2.63636 14.9091 2.63636Z", fill: "white" }),
          /* @__PURE__ */ I("path", { d: "M18.1818 5.90909C17.7299 5.90909 17.3636 5.54278 17.3636 5.09091C17.3636 4.63904 17.7299 4.27273 18.1818 4.27273C18.6337 4.27273 19 4.63904 19 5.09091C19 5.54278 18.6337 5.90909 18.1818 5.90909Z", fill: "white" }),
          /* @__PURE__ */ I("path", { d: "M8.93208 4.29446C9.20363 3.17457 10.7964 3.17457 11.0679 4.29446L11.8151 7.3759C11.9121 7.77574 12.2243 8.08792 12.6241 8.18487L15.7055 8.93208C16.8254 9.20363 16.8254 10.7964 15.7055 11.0679L12.6241 11.8151C12.2243 11.9121 11.9121 12.2243 11.8151 12.6241L11.0679 15.7055C10.7964 16.8254 9.20363 16.8254 8.93208 15.7055L8.18487 12.6241C8.08792 12.2243 7.77574 11.9121 7.3759 11.8151L4.29446 11.0679C3.17457 10.7964 3.17457 9.20363 4.29446 8.93208L7.3759 8.18487C7.77574 8.08792 8.08792 7.77574 8.18487 7.3759L8.93208 4.29446Z", fill: "white" }),
          /* @__PURE__ */ I("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M18.4393 12.4507C18.8203 12.5929 19.0139 13.0171 18.8717 13.3981C17.9506 15.8661 16.0383 17.8485 13.6187 18.8611C13.2435 19.0181 12.8121 18.8412 12.6551 18.4661C12.4981 18.0909 12.675 17.6595 13.0501 17.5025C15.0952 16.6467 16.7134 14.9692 17.4919 12.8831C17.6341 12.5021 18.0583 12.3085 18.4393 12.4507Z", fill: "white" }),
          /* @__PURE__ */ I("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M7.56245 1.56016C7.70495 1.94106 7.51169 2.36536 7.1308 2.50786C5.03326 3.29259 3.34878 4.92965 2.49933 6.9978C2.34482 7.37399 1.9146 7.55369 1.53842 7.39918C1.16223 7.24467 0.982523 6.81445 1.13703 6.43827C2.14164 3.99234 4.13199 2.05736 6.61475 1.1285C6.99565 0.986002 7.41995 1.17926 7.56245 1.56016Z", fill: "white" }),
          /* @__PURE__ */ I("path", { d: "M1.81818 15.7273C1.36631 15.7273 1 15.361 1 14.9091C1 14.4572 1.36631 14.0909 1.81818 14.0909C2.27005 14.0909 2.63636 14.4572 2.63636 14.9091C2.63636 15.361 2.27005 15.7273 1.81818 15.7273Z", fill: "white" })
        ] }) })
      ]
    }
  );
};
function r9() {
  const e = te(vi), [t, n] = ge(!1);
  return J(() => {
    const r = e.sidebarOptions$.subscribe((i) => {
      n(!!i.visible);
    });
    return () => {
      r.unsubscribe();
    };
  }, [e]), t;
}
function i9() {
  const e = te(wi);
  return /* @__PURE__ */ I(ll, { position: "left", sidebarService: e, showClose: !1 });
}
function o9() {
  const e = te(vi);
  return /* @__PURE__ */ I(ll, { position: "right", sidebarService: e });
}
function ll(e) {
  var d;
  const { sidebarService: t, position: n, showClose: r = !0 } = e, i = be(t.sidebarOptions$), o = ne(null), s = ye(() => {
    if (!i)
      return null;
    const u = { ...i };
    for (const f of ["children", "header", "footer"]) {
      const g = f;
      if (i[g]) {
        const p = i[g];
        p && (u[g] = /* @__PURE__ */ I(Bu, { ...p }));
      }
    }
    return u;
  }, [i]);
  J(() => {
    const u = (g) => {
      t.scrollEvent$.next(g);
    }, f = o.current;
    return f && f.addEventListener("scroll", u), () => {
      f == null || f.removeEventListener("scroll", u);
    };
  }, [t]);
  const c = ye(() => s != null && s.visible ? typeof s.width == "number" ? `${s.width}px` : s.width : "0px", [s]);
  function a() {
    var f;
    const u = {
      ...i,
      visible: !1
    };
    t.sidebarOptions$.next(u), (f = u == null ? void 0 : u.onClose) == null || f.call(u);
  }
  const l = (d = s == null ? void 0 : s.visible) != null ? d : !1;
  return /* @__PURE__ */ I(
    "aside",
    {
      className: nt("univer-pointer-events-auto univer-fixed univer-bottom-3 univer-top-12 univer-z-20 univer-box-border univer-overflow-hidden univer-rounded-lg univer-shadow-lg univer-transition-all", xi, {
        "univer-left-3 univer-w-[180px]": n === "left",
        "univer-right-3 univer-min-w-[280px] univer-max-w-[400px]": n === "right",
        "univer-translate-x-[calc(-100%-12px)]": n === "left" && !l,
        "univer-translate-x-[calc(100%+12px)]": n === "right" && !l
      }),
      style: { width: c },
      children: /* @__PURE__ */ Q(
        "section",
        {
          ref: o,
          className: nt("univer-m-auto univer-box-border univer-flex univer-h-0 univer-min-h-full univer-w-full univer-flex-col univer-overflow-hidden univer-overflow-y-auto univer-bg-white", zf),
          children: [
            r && /* @__PURE__ */ Q(
              "header",
              {
                className: "univer-sticky univer-top-0 univer-z-10 univer-box-border univer-flex univer-h-[44px] univer-flex-shrink-0 univer-flex-grow-0 univer-content-between univer-items-center univer-justify-between univer-p-4 univer-pb-0 univer-text-lg univer-font-medium",
                children: [
                  s == null ? void 0 : s.header,
                  /* @__PURE__ */ I("a", { className: "univer-cursor-pointer", onClick: a, children: /* @__PURE__ */ I(Vi, {}) })
                ]
              }
            ),
            /* @__PURE__ */ I(
              "section",
              {
                className: "univer-box-border univer-flex-grow univer-p-2",
                children: s == null ? void 0 : s.children
              }
            ),
            (s == null ? void 0 : s.footer) && /* @__PURE__ */ I("footer", { className: "univer-sticky univer-bottom-0 univer-box-border univer-p-4", children: s.footer })
          ]
        }
      )
    }
  );
}
var s9 = /* @__PURE__ */ ((e) => (e.UNDO = "undo", e.REDO = "redo", e.FONT_FAMILY = "font-famaily", e.FONT_SIZE = "font-size", e.FONT_GROUP = "font-group", e.COLOR = "color", e.BACKGROUND = "background", e.IMAGE = "image", e.TABLE = "table", e.UNORDER_LIST = "unorder-list", e.ORDER_LIST = "order-list", e))(s9 || {});
class oo extends yt {
  constructor() {
    super();
    Se(this, "_items");
    this._init();
  }
  _init() {
    this._items = [
      {
        id: "undo",
        impl: [{ id: wu.id, type: ue.UNIVER_UNKNOWN }]
      },
      {
        id: "redo",
        impl: [{ id: xu.id, type: ue.UNIVER_UNKNOWN }]
      },
      {
        id: "font-famaily",
        impl: [{ id: Ai, type: ue.UNIVER_UNKNOWN }]
      },
      {
        id: "font-size",
        impl: [{ id: Li, type: ue.UNIVER_UNKNOWN }]
      },
      {
        id: "font-group",
        impl: [
          { id: Oi, type: ue.UNIVER_UNKNOWN },
          { id: Gr, type: ue.UNIVER_SHEET },
          { id: Gr, type: ue.UNIVER_DOC }
        ]
      },
      {
        id: "color",
        impl: [{ id: $i, type: ue.UNIVER_UNKNOWN }]
      },
      {
        id: "background",
        impl: [{ id: Ti, type: ue.UNIVER_UNKNOWN }]
      },
      {
        id: "image",
        impl: [{ id: ki, type: ue.UNIVER_UNKNOWN }]
      },
      {
        id: "unorder-list",
        impl: [{ id: Di, type: ue.UNIVER_UNKNOWN }]
      },
      {
        id: "order-list",
        impl: [{ id: Ri, type: ue.UNIVER_UNKNOWN }]
      },
      {
        id: "table",
        impl: [{ id: Pi, type: ue.UNIVER_UNKNOWN }]
      }
    ];
  }
  addItem(n) {
    return this._items.push(n), En(() => {
      this._items = this._items.filter((r) => r.id !== n.id);
    });
  }
  getItems() {
    return this._items;
  }
  implementItem(n, r) {
    const i = this._items.find((o) => o.id === n);
    return i ? (i.impl.push(r), En(() => {
      i.impl = i.impl.filter((o) => o.id !== r.id);
    })) : En(() => {
    });
  }
}
const c9 = () => {
  const e = te(Xs), t = te(Me), n = te(vt), r = be(e.visible$), i = be(t.focused$), o = (r == null ? void 0 : r.visible) && i || !1, s = he(() => {
    i && n.executeCommand(Yr.id, {
      visible: !0,
      eventType: Zr.PointerDown,
      unitId: i
    });
  }, [e, i]);
  return /* @__PURE__ */ Q(De, { children: [
    /* @__PURE__ */ Q(
      "div",
      {
        className: nt("univer-flex univer-cursor-pointer univer-items-center univer-gap-2 univer-rounded-md univer-border-primary-400 univer-bg-primary-300 univer-px-3 univer-py-1.5 univer-text-sm univer-text-primary-600", {
          "univer-opacity-30": !i
        }),
        onClick: () => s(),
        children: [
          /* @__PURE__ */ I(Qs, {}),
          /* @__PURE__ */ I("span", { className: "univer-whitespace-nowrap univer-text-xs", children: "Write formula" })
        ]
      }
    ),
    /* @__PURE__ */ I(
      "div",
      {
        className: nt("dark:!univer-bg-dark univer-absolute univer-left-0 univer-top-0 univer-z-10 univer-h-full univer-w-full univer-bg-white", {
          "univer-hidden": !o
        }),
        children: /* @__PURE__ */ I(a9, {})
      }
    )
  ] });
};
function a9() {
  var v;
  te(Kf);
  const e = te(Xs), t = te(Jn), n = te(vt), r = te(ed), i = te(td), o = te(nd), s = te(_u), c = te(mi), [a, l] = ge(!1), d = te(Me), u = t.get(qf), f = jf(), g = c.getContextValue(Cu), p = be(e.currentEditCellState$), h = ne(0), w = Qf(h, (v = p == null ? void 0 : p.unitId) != null ? v : "");
  function y(_, b) {
    return [
      new id(_).id,
      new od(_, b).id,
      new sd(_, b).id
    ];
  }
  on(() => {
    const _ = d.getCurrentUnitForType(ue.UNIVER_SHEET), b = Ou(
      i.ruleChange$,
      o.ruleChange$,
      r.selectionMoveEnd$,
      r.selectionSet$,
      _.activeSheet$
    ).pipe(
      Pu(() => {
        var x, T;
        const M = _.getUnitId(), L = _.getActiveSheet();
        if (!L) return go;
        const $ = L.getSheetId();
        if (!((x = r.getCurrentLastSelection()) == null ? void 0 : x.range)) return go;
        const k = y(M, $), O = (T = r.getCurrentSelections()) == null ? void 0 : T.map((S) => S.range);
        return o.getSubunitRuleList(M, $).filter((S) => S.ranges.some((A) => O == null ? void 0 : O.some((E) => bu.intersects(A, E)))).forEach((S) => {
          k.push(new rd(M, $, S.permissionId).id);
        }), s.composePermission$(k);
      })
    ).subscribe((M) => {
      M && l(!M.every((L) => L.value));
    });
    return () => {
      b.unsubscribe();
    };
  }, []);
  function C() {
    var b;
    e.isVisible().visible && n.executeCommand(Yr.id, {
      visible: !1,
      eventType: Zr.Keyboard,
      keycode: Uu.ESC,
      unitId: (b = f == null ? void 0 : f.getUnitId()) != null ? b : ""
    });
  }
  function m() {
    var b;
    e.isVisible().visible && n.executeCommand(Yr.id, {
      visible: !1,
      eventType: Zr.PointerDown,
      unitId: (b = f == null ? void 0 : f.getUnitId()) != null ? b : ""
    });
  }
  return /* @__PURE__ */ Q(
    "div",
    {
      className: "univer-box-border univer-flex univer-h-full univer-w-full univer-items-center univer-gap-2 univer-p-2",
      children: [
        /* @__PURE__ */ Q(
          "div",
          {
            className: nt("univer-univer-grow-0 univer-flex univer-shrink-0 univer-px-1.5", {
              "univer-cursor-not-allowed univer-text-gray-200": a
            }),
            children: [
              /* @__PURE__ */ I(Xr, { size: "small", variant: "text", className: "univer-text-red-600", onClick: C, children: /* @__PURE__ */ I(Vi, {}) }),
              /* @__PURE__ */ I(Xr, { size: "small", variant: "text", className: "univer-text-green-600", onClick: m, children: /* @__PURE__ */ I(Fi, {}) })
            ]
          }
        ),
        u && /* @__PURE__ */ I(
          u,
          {
            className: "univer-h-full univer-shrink univer-grow",
            disableSelectionOnClick: !0,
            editorId: Su,
            initValue: "",
            onChange: () => {
            },
            isFocus: g,
            unitId: p == null ? void 0 : p.unitId,
            subUnitId: p == null ? void 0 : p.sheetId,
            autofocus: !1,
            isSupportAcrossSheet: !0,
            resetSelectionOnBlur: !1,
            isSingle: !1,
            keyboardEventConfig: w,
            onFormulaSelectingChange: (_, b) => {
              h.current = _, b && (_ ? e.enableForceKeepVisible() : e.disableForceKeepVisible());
            },
            autoScrollbar: !1,
            disableContextMenu: !1
          }
        )
      ]
    }
  );
}
function l9() {
  var u, f;
  const e = te(oo), t = te(Me), n = be(t.focused$), r = te(Qn), i = be(r.menuChanged$), [o, s] = ge([]), c = n ? (f = (u = t.getUnit(n)) == null ? void 0 : u.type) != null ? f : ue.UNIVER_UNKNOWN : ue.UNIVER_UNKNOWN, a = e.getItems(), l = Jf().length > 0, d = () => {
    const g = r.getMenuByPositionKey(Xt.TOOLBAR_MAIN);
    if (g) {
      const p = a.map((h) => {
        var _, b;
        const { impl: w } = h, y = w.find((M) => M.type === c), C = (_ = g.find((M) => M.key === (y == null ? void 0 : y.id))) == null ? void 0 : _.item;
        if (C)
          return C;
        const m = w.find((M) => M.type === ue.UNIVER_UNKNOWN), v = (b = g.find((M) => M.key === (m == null ? void 0 : m.id))) == null ? void 0 : b.item;
        return v || null;
      }).filter((h) => !!h && !h.id.startsWith("FAKE_"));
      s(p);
    }
  };
  return J(() => {
    d();
  }, [i]), /* @__PURE__ */ Q(
    "div",
    {
      className: "univer-relative univer-box-border univer-flex univer-select-none univer-items-center univer-gap-2 univer-overflow-hidden univer-rounded-lg univer-border univer-border-gray-300 univer-bg-white univer-p-2 univer-text-sm univer-shadow-lg",
      children: [
        l && /* @__PURE__ */ I(c9, {}),
        /* @__PURE__ */ I("div", { className: "univer-flex univer-shrink-0 univer-items-center univer-gap-1", children: o.map((g) => g && /* @__PURE__ */ I(zs, { ...g }, g.id)) })
      ]
    }
  );
}
function u9(e) {
  var P;
  const {
    header: t = !0,
    contextMenu: n = !0,
    mountContainer: r,
    onRendered: i
  } = e, o = te(Nu), s = te(Eu), c = te(no), a = te(Me), l = te(Zs), d = te(er), u = te(vt), f = te(Bs), g = ne(null), p = ne(null), h = ne(null), w = ct(lt.HEADER), y = ct(lt.CONTENT), C = ct(lt.GLOBAL), m = be(a.focused$);
  J(() => {
    g.current && (i == null || i(g.current));
  }, [i]), on(() => {
    const R = s.currentTheme$.subscribe((F) => {
      f.injectThemeToHead(F);
    });
    return () => {
      R.unsubscribe();
    };
  }, []);
  const [v, _] = ge(o.getLocales()), [b, M] = ge(t9), L = he((R) => {
    switch (R) {
      case al.AI: {
        u.executeCommand("project.controls-pro-search.operation");
        break;
      }
    }
  }, [u]), $ = he(Iu(() => {
    l.getRenderAll().forEach((R) => R.engine.resize());
  }, 400), [l]), V = ye(() => document.createElement("div"), []);
  J(() => {
    document.body.appendChild(V);
    const R = [
      o.localeChanged$.subscribe(() => {
        _(o.getLocales());
      })
    ];
    return () => {
      R.forEach((F) => F.unsubscribe()), document.body.removeChild(V);
    };
  }, [o, r, V]);
  const k = {
    customNode: f9
  }, O = be(c.unitGrid$, void 0, !0), D = ye(() => O.map((R) => ({
    id: R.id,
    type: "customNode",
    dragHandle: ".univer-uni-node-drag-handle",
    style: R.style,
    focusable: !0,
    data: {
      unitId: R.data.unitId,
      gridService: c,
      instanceService: a
    },
    position: R.position
  })), [O]), [x, T, S] = _3(D);
  J(() => {
    T(D);
  }, [D]);
  const A = he((R, F) => {
    var H;
    (H = p.current) == null || H.update();
    const { zoom: z } = F;
    M(z), d.setViewportChanged(F);
  }, [p, M, d]), E = he((R) => {
    d.setReactFlowInstance(R);
  }, [d]), N = !!m;
  return /* @__PURE__ */ I(Bf, { locale: v == null ? void 0 : v.design, mountContainer: V, children: /* @__PURE__ */ Q(Ua, { children: [
    /* @__PURE__ */ Q(
      "div",
      {
        "data-u-comp": "workbench-layout",
        className: "univer-relative univer-flex univer-h-full univer-min-h-0 univer-flex-col",
        tabIndex: -1,
        onBlur: (R) => R.stopPropagation(),
        children: [
          /* @__PURE__ */ I("div", { className: "univer-absolute univer-left-0 univer-top-0 univer-h-full univer-w-full", children: /* @__PURE__ */ Q(
            "section",
            {
              className: "univer-relative univer-flex univer-h-full univer-w-full",
              ref: g,
              "data-range-selector": !0,
              onContextMenu: (R) => R.preventDefault(),
              children: [
                /* @__PURE__ */ I(
                  x3,
                  {
                    ref: h,
                    maxZoom: e9,
                    minZoom: Ds,
                    zoomOnDoubleClick: !N,
                    zoomOnPinch: !N,
                    zoomOnScroll: !N,
                    panOnDrag: !N,
                    panOnScroll: !N,
                    nodes: x,
                    nodeTypes: k,
                    onNodesChange: (R) => {
                      R.forEach((F) => {
                        F.type === "dimensions" && F.resizing ? c.changeDimension(F.id, { width: F.dimensions.width, height: F.dimensions.height }) : F.type === "position" && c.changePosition(F.id, { x: F.position.x, y: F.position.y });
                      }), S(R);
                    },
                    onReset: $,
                    fitView: !0,
                    defaultViewport: { zoom: Ds, x: 0, y: 0 },
                    onPointerDown: (R) => {
                      R.target instanceof HTMLElement && (R.target.dataset.uComp === "render-canvas" || R.target.classList.contains("react-flow__resize-control")) || u.executeCommand(bi.id, { unitId: null });
                    },
                    onMove: A,
                    onInit: E,
                    children: /* @__PURE__ */ I(E3, { bgColor: "#f4f6f8", color: "#d9d9d9" })
                  }
                ),
                /* @__PURE__ */ I(at, { components: y }, "content")
              ]
            }
          ) }),
          /* @__PURE__ */ Q(
            "div",
            {
              className: "univer-pointer-events-none univer-absolute univer-left-0 univer-top-0 univer-h-full univer-w-full [&>*]:univer-pointer-events-auto",
              children: [
                t && /* @__PURE__ */ I(
                  "div",
                  {
                    className: "univer-relative univer-z-10 univer-flex univer-w-full univer-items-center univer-justify-center univer-pt-3",
                    children: /* @__PURE__ */ Q("div", { className: "univer-pointer-events-auto univer-max-w-[calc(100%-650px)]", children: [
                      /* @__PURE__ */ I(l9, {}),
                      /* @__PURE__ */ I(at, { components: w }, "header")
                    ] })
                  }
                ),
                /* @__PURE__ */ I(Q2, { ref: p, node: (P = x.find((R) => R.id === m)) == null ? void 0 : P.data }),
                /* @__PURE__ */ I(i9, {}),
                /* @__PURE__ */ I(o9, {}),
                /* @__PURE__ */ I(n9, { zoom: b, onItemClick: L })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ I(at, { components: C }, "global"),
    /* @__PURE__ */ I(Wu, {}),
    n && /* @__PURE__ */ I(Zu, {}),
    /* @__PURE__ */ I(h9, {})
  ] }) });
}
function f9({ data: e }) {
  const { unitId: t } = e, n = j3(t), r = Q3(t), i = ct(lt.UNIT), o = te(mi), s = te(vt), c = be(
    () => o.subscribeContextValue$(Xu),
    !1,
    !1,
    []
  ), a = he(() => {
    !c && !r && s.executeCommand(bi.id, { unitId: t });
  }, [c, r, t, s]);
  return /* @__PURE__ */ Q("div", { className: "univer-relative univer-flex univer-h-full univer-w-full", onPointerDownCapture: a, children: [
    /* @__PURE__ */ I(G3, { isVisible: r, minWidth: 180, minHeight: 100 }),
    /* @__PURE__ */ I(
      d9,
      {
        ...e
      },
      e.unitId
    ),
    /* @__PURE__ */ I(
      "div",
      {
        className: "univer-absolute -univer-left-8 univer-flex univer-h-[18px] univer-w-[18px] univer-items-center univer-justify-center univer-rounded univer-p-1 univer-shadow-sm",
        children: /* @__PURE__ */ I(tc, {})
      }
    ),
    /* @__PURE__ */ I(
      "div",
      {
        className: "univer-absolute -univer-top-6 univer-left-0 univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200",
        children: n
      }
    ),
    /* @__PURE__ */ I(at, { components: i, sharedProps: { unitId: t } }, "unit")
  ] });
}
function d9(e) {
  const { unitId: t, gridService: n } = e, r = ne(null), i = te(Me), s = be(i.focused$) === t;
  return J(() => {
    r.current && n.setContainerForRender(t, r.current);
  }, [n, t]), /* @__PURE__ */ I(
    "div",
    {
      className: nt("univer-relative univer-flex-1 univer-overflow-hidden univer-rounded-lg univer-border-transparent", xi, {
        "univer-border-primary-600": s
      }),
      ref: r,
      onWheel: (c) => c.stopPropagation()
    }
  );
}
function h9() {
  const { mountContainer: e } = Ot(Uf), t = ct(lt.FLOATING);
  return Gf(/* @__PURE__ */ I(at, { components: t }, "floating"), e);
}
var g9 = Object.getOwnPropertyDescriptor, p9 = (e, t, n, r) => {
  for (var i = r > 1 ? void 0 : r ? g9(t, n) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (i = s(i) || i);
  return i;
}, Nn = (e, t) => (n, r) => t(n, r, e);
const m9 = 3e3;
let hi = class extends yt {
  constructor(e, t, n, r, i) {
    super(), this._config = e, this._injector = t, this._lifecycleService = n, this._uiPartsService = r, this._layoutService = i, this._initBuiltinComponents(), Promise.resolve().then(() => this._bootstrapWorkbench());
  }
  _bootstrapWorkbench() {
    this.disposeWithMe(
      y9(this._injector, this._config, (e, t) => {
        this._layoutService && (this.disposeWithMe(this._layoutService.registerContentElement(e)), this.disposeWithMe(this._layoutService.registerContainerElement(t))), this._lifecycleService.lifecycle$.pipe(
          Du((n) => n === br.Ready),
          Ru(300),
          Fu(1)
        ).subscribe(() => {
          this._lifecycleService.stage = br.Rendered, setTimeout(() => this._lifecycleService.stage = br.Steady, m9);
        });
      })
    );
  }
  _initBuiltinComponents() {
    this.disposeWithMe(this._uiPartsService.registerComponent(lt.FLOATING, () => Wr(Yu, this._injector))), this.disposeWithMe(this._uiPartsService.registerComponent(lt.UNIT, () => Wr(Gu, this._injector)));
  }
};
hi = p9([
  Nn(1, et(yi)),
  Nn(2, et(Mu)),
  Nn(3, Us),
  Nn(4, Au(Ws))
], hi);
function y9(e, t, n) {
  let r;
  const i = t.container;
  if (typeof i == "string") {
    const c = document.getElementById(i);
    c ? r = c : r = Rs(i);
  } else i instanceof HTMLElement ? r = i : r = Rs("univer");
  const o = Wr(u9, e);
  function s() {
    Zf(
      /* @__PURE__ */ I(
        o,
        {
          ...t,
          mountContainer: r,
          onRendered: (c) => n(c, r)
        }
      ),
      r
    );
  }
  return s(), En(() => {
    Wf(r);
  });
}
function Rs(e) {
  const t = document.createElement("div");
  return t.id = e, t;
}
var v9 = Object.getOwnPropertyDescriptor, w9 = (e, t, n, r) => {
  for (var i = r > 1 ? void 0 : r ? v9(t, n) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (i = s(i) || i);
  return i;
}, Fs = (e, t) => (n, r) => t(n, r, e);
let Kn = class extends yt {
  constructor(e, t) {
    super(), this._commandService = e, this._flowManagerService = t, this._initCommands(), this._triggerCommands();
  }
  _initCommands() {
    [
      vo,
      bi
    ].forEach((e) => {
      this.disposeWithMe(this._commandService.registerCommand(e));
    });
  }
  _triggerCommands() {
    this._flowManagerService.viewportChanged$.pipe(
      Vu(100, void 0, { leading: !0, trailing: !0 }),
      Hu(100)
    ).subscribe((e) => {
      e && this._commandService.executeCommand(vo.id, { viewport: e });
    });
  }
};
Kn = w9([
  Fs(0, vt),
  Fs(1, et(er))
], Kn);
var x9 = /* @__PURE__ */ ((e) => (e.OUTLINE = "OUTLINE", e))(x9 || {});
function ul() {
  const e = ct(
    "OUTLINE"
    /* OUTLINE */
  );
  return /* @__PURE__ */ I(at, { components: e }, "outline");
}
ul.componentName = "Outline";
var _9 = Object.getOwnPropertyDescriptor, C9 = (e, t, n, r) => {
  for (var i = r > 1 ? void 0 : r ? _9(t, n) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (i = s(i) || i);
  return i;
}, zr = (e, t) => (n, r) => t(n, r, e);
const Vs = "OUTLINE_COMPONENT";
let qn = class extends yt {
  constructor(e, t, n) {
    super(), this._componentManager = e, this._univerInstanceService = t, this._leftSidebarService = n, this._initComponents(), this._initShowOutlineListener();
  }
  _initComponents() {
    this.disposeWithMe(this._componentManager.register(Vs, ul));
  }
  _initShowOutlineListener() {
    this.disposeWithMe(this._univerInstanceService.focused$.pipe(
      zu((e) => {
        var t;
        return e ? ((t = this._univerInstanceService.getUnit(e)) == null ? void 0 : t.type) !== ue.UNIVER_DOC : !1;
      }),
      po()
    ).subscribe((e) => {
      e ? this._leftSidebarService.open({
        children: { label: Vs },
        visible: !0,
        width: 185
      }) : this._leftSidebarService.close();
    })), this.disposeWithMe(this._univerInstanceService.unitDisposed$.pipe(
      po()
    ).subscribe(() => {
      this._leftSidebarService.close();
    }));
  }
};
qn = C9([
  zr(0, et(Jn)),
  zr(1, Me),
  zr(2, wi)
], qn);
const b9 = {
  [Xt.TOOLBAR_MAIN]: {
    ...Ku[qu.HISTORY],
    [Ai]: {
      menuItemFactory: ld
    },
    [Li]: {
      menuItemFactory: ud
    },
    [$i]: {
      menuItemFactory: fd
    },
    [Ti]: {
      menuItemFactory: dd
    },
    [ki]: {
      menuItemFactory: hd
    },
    [Di]: {
      menuItemFactory: gd
    },
    [Ri]: {
      menuItemFactory: pd
    },
    [cd]: {
      menuItemFactory: md
    },
    [Oi]: {
      menuItemFactory: yd
    },
    [Pi]: {
      menuItemFactory: vd
    }
  },
  [Xt.TOOLBAR_FLOAT]: {
    [Si]: {
      menuItemFactory: wd
    },
    [Ni]: {
      menuItemFactory: xd
    },
    // [LOCK_MENU_ID]: {
    //     menuItemFactory: LockMenuItemFactory,
    // },
    [Ei]: {
      menuItemFactory: _d
    },
    [Ii]: {
      menuItemFactory: Cd
    },
    [Mi]: {
      menuItemFactory: bd
    }
  }
};
var S9 = Object.getOwnPropertyDescriptor, N9 = (e, t, n, r) => {
  for (var i = r > 1 ? void 0 : r ? S9(t, n) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (i = s(i) || i);
  return i;
}, zt = (e, t) => (n, r) => t(n, r, e);
let jn = class extends yt {
  constructor(e, t, n, r, i) {
    super(), this._menuManagerService = e, this._injector = t, this._componentManager = n, this._commandService = r, this._toolbarService = i, this._initComponent(), this._initMenus(), this._initCommands();
  }
  _initComponent() {
    const e = this._componentManager, t = {
      DownloadIcon: qs,
      ShareIcon: ic,
      LockIcon: ec,
      PrintIcon: rc,
      ZenIcon: oc,
      DeleteIcon: Ks,
      PivotTableIcon: nc
    };
    for (const n in t)
      this.disposeWithMe(e.register(n, t[n]));
  }
  _initMenus() {
    this._menuManagerService.appendRootMenu(b9);
  }
  _initCommands() {
    [
      Ys
    ].forEach((e) => {
      this.disposeWithMe(this._commandService.registerCommand(e));
    });
  }
};
jn = N9([
  zt(0, Qn),
  zt(1, et(yi)),
  zt(2, et(Jn)),
  zt(3, vt),
  zt(4, et(oo))
], jn);
var E9 = Object.defineProperty, I9 = Object.getOwnPropertyDescriptor, M9 = (e, t, n) => t in e ? E9(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, A9 = (e, t, n, r) => {
  for (var i = r > 1 ? void 0 : r ? I9(t, n) : t, o = e.length - 1, s; o >= 0; o--)
    (s = e[o]) && (i = s(i) || i);
  return i;
}, Br = (e, t) => (n, r) => t(n, r, e), L9 = (e, t, n) => M9(e, t + "", n);
let gi = class extends $u {
  constructor(e = {}, t, n, r) {
    super(), this._config = e, this._injector = t, this._contextService = n, this._commandService = r, this._config = Tu({}, this._config), this._config.disableAutoFocus && this._contextService.setContextValue(ju, !0);
  }
  onStarting() {
    ku([
      [Jn],
      [Qu],
      [Ju],
      [er],
      [oo],
      [no, { useClass: li }],
      [Us, { useClass: ef }],
      [Ws, { useClass: tf }],
      [nf, { useClass: rf }],
      [of, { useClass: sf }],
      [Qn, { useClass: cf }],
      [af, { useClass: lf }],
      [Bs],
      [uf, { useClass: ff, lazy: !0 }],
      [df, { useClass: hf, lazy: !0 }],
      [gf, { useClass: pf, lazy: !0 }],
      [mf, { useClass: yf, lazy: !0 }],
      [vf, { useClass: wf, lazy: !0 }],
      [vi, { useClass: mo, lazy: !0 }],
      [wi, { useClass: mo, lazy: !0 }],
      [xf, { useClass: _f, lazy: !0 }],
      [Cf, { useClass: bf, lazy: !0 }],
      [Sf, { useClass: Nf, lazy: !0 }],
      [Hs, { useClass: Ef, lazy: !0 }],
      [If, { useClass: Mf }],
      [Af, { useClass: Lf }],
      [$f, { useClass: Tf }],
      [kf],
      [yo, {
        useFactory: () => this._injector.createInstance(hi, this._config)
      }],
      [Of],
      [Pf],
      [Df],
      [qn],
      [jn],
      [Kn]
    ], this._config.override).forEach((t) => this._injector.add(t));
  }
  onReady() {
    this._injector.get(yo), this._injector.get(Kn), this._injector.get(qn), this._injector.get(jn);
  }
};
L9(gi, "pluginName", Rf);
gi = A9([
  Lu(Ff),
  Br(1, et(yi)),
  Br(2, mi),
  Br(3, vt)
], gi);
export {
  s9 as BuiltinUniToolbarItemId,
  Mi as DELETE_MENU_ID,
  Si as DOWNLOAD_MENU_ID,
  Gr as FONT_GROUP_MENU_ID,
  no as IUnitGridService,
  ad as LOCK_MENU_ID,
  Ei as PRINT_MENU_ID,
  Ni as SHARE_MENU_ID,
  vo as SetFlowViewportOperation,
  Xt as UNI_MENU_POSITIONS,
  q2 as UniFloatToolbarUIPart,
  bi as UniFocusUnitOperation,
  oo as UniToolbarService,
  x9 as UniUIPart,
  li as UnitGridService,
  gi as UniverUniUIPlugin,
  Ii as ZEN_MENU_ID,
  U9 as generateCloneMutation,
  Es as getGridUnitLocalCacheKey
};
