var G = Object.defineProperty;
var L = (t, e, r) => e in t ? G(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var p = (t, e, r) => L(t, typeof e != "symbol" ? e + "" : e, r);
import { Disposable as _, CommandType as A, toDisposable as M, IConfigService as j, createIdentifier as q, ILogService as H, Inject as E, Injector as N, LocaleService as T, ThemeService as z, DisposableCollection as K, UniverInstanceType as Y, ICommandService as J, Plugin as Q, merge as X } from "@univerjs/core";
import { ISidebarService as Z, useDependency as l, IShortcutService as ee, IMessageService as te, getMenuHiddenObservable as re, MenuItemType as ne, RibbonOthersGroup as ie, IMenuManagerService as oe, ComponentManager as se } from "@univerjs/ui";
import { BehaviorSubject as ce, distinctUntilChanged as ae } from "rxjs";
import { jsxs as le, jsx as g } from "react/jsx-runtime";
import { Button as ue, MessageType as w } from "@univerjs/design";
import { editor as pe } from "monaco-editor";
import { useRef as f, useEffect as de, useCallback as ve } from "react";
import { FUniver as ge } from "@univerjs/core/facade";
import { RangeProtectionPermissionEditPoint as he, WorksheetEditPermission as me, WorksheetSetCellStylePermission as _e, WorksheetSetCellValuePermission as fe, WorkbookEditablePermission as Se } from "@univerjs/sheets";
import { getCurrentRangeDisable$ as Ie } from "@univerjs/sheets-ui";
class D extends _ {
  constructor() {
    super(...arguments);
    p(this, "_open$", new ce(!1));
    p(this, "open$", this._open$.pipe(ae()));
  }
  get isOpen() {
    return this._open$.getValue();
  }
  dispose() {
    super.dispose(), this._open$.next(!1), this._open$.complete();
  }
  open() {
    this._open$.next(!0);
  }
  close() {
    this._open$.next(!1);
  }
}
const R = "ScriptPanel", C = {
  type: A.OPERATION,
  id: "univer.operation.toggle-script-panel",
  handler: (t) => {
    const e = t.get(D), r = t.get(Z);
    return e.isOpen ? (e.close(), r.close()) : (e.open(), r.open({
      header: { title: "script-panel.title" },
      children: { label: R },
      width: 600
    })), !0;
  }
}, k = "uniscript.config", x = {};
var Pe = Object.getOwnPropertyDescriptor, Ee = (t, e, r, n) => {
  for (var i = n > 1 ? void 0 : n ? Pe(e, r) : e, o = t.length - 1, s; o >= 0; o--)
    (s = t[o]) && (i = s(i) || i);
  return i;
}, Ce = (t, e) => (r, n) => e(r, n, t);
let h = class extends _ {
  constructor(e) {
    super();
    p(this, "_editorInstance", null);
    this._configService = e;
  }
  dispose() {
    super.dispose(), this._editorInstance && this._editorInstance.dispose();
  }
  setEditorInstance(e) {
    return this._editorInstance = e, M(() => this._editorInstance = null);
  }
  getEditorInstance() {
    return this._editorInstance;
  }
  requireVscodeEditor() {
    if (!window.MonacoEnvironment) {
      const e = this._configService.getConfig(k);
      window.MonacoEnvironment = { getWorkerUrl: e == null ? void 0 : e.getWorkerUrl };
    }
  }
};
h = Ee([
  Ce(0, j)
], h);
var be = Object.getOwnPropertyDescriptor, Oe = (t, e, r, n) => {
  for (var i = n > 1 ? void 0 : n ? be(e, r) : e, o = t.length - 1, s; o >= 0; o--)
    (s = t[o]) && (i = s(i) || i);
  return i;
}, y = (t, e) => (r, n) => e(r, n, t);
const W = q("univer.uniscript.execution-service");
let P = class extends _ {
  constructor(t, e) {
    super(), this._logService = t, this._injector = e;
  }
  async execute(t) {
    this._logService.log("[UniscriptExecutionService]", "executing Uniscript...");
    const e = ge.newAPI(this._injector), r = new Function("univerAPI", `(() => {${t}})()`);
    try {
      return r(e), !0;
    } catch (n) {
      return this._logService.error(n), !1;
    }
  }
};
P = Oe([
  y(0, H),
  y(1, E(N))
], P);
function we() {
  const t = f(null), e = f(null), r = f(null), n = l(T), i = l(ee), o = l(h), s = l(z);
  de(() => {
    const b = e.current, u = t.current;
    let c = null, d = null;
    if (b && u) {
      o.requireVscodeEditor();
      const v = r.current = pe.create(b, {
        value: "",
        language: "javascript",
        theme: s.darkMode ? "vs-dark" : "vs-light"
      });
      d = new ResizeObserver(() => {
        let O = requestIdleCallback(() => {
          if (!O) return;
          const { height: V, width: B } = u.getBoundingClientRect();
          v.layout({ width: B, height: V }), O = void 0;
        });
      }), d.observe(u);
      let a;
      c = new K(), c.add(o.setEditorInstance(v)), c.add(
        v.onDidFocusEditorWidget(() => {
          a = i.forceEscape();
        })
      ), c.add(
        v.onDidBlurEditorWidget(() => {
          a == null || a.dispose(), a = void 0;
        })
      ), c.add(M(() => a == null ? void 0 : a.dispose()));
    }
    return () => {
      d && u && d.unobserve(u), c == null || c.dispose();
    };
  }, [o, i]);
  const F = xe(r);
  return /* @__PURE__ */ le("div", { className: "univer-h-full", children: [
    /* @__PURE__ */ g("div", { ref: t, className: "univer-h-[calc(100%-60px)] univer-w-full univer-overflow-hidden", children: /* @__PURE__ */ g("div", { ref: e }) }),
    /* @__PURE__ */ g("div", { className: "univer-mt-2.5", children: /* @__PURE__ */ g(ue, { variant: "primary", onClick: F, children: n.t("script-panel.panel.execute") }) })
  ] });
}
function xe(t) {
  const e = l(W), r = l(te), n = l(T);
  return ve(() => {
    var o;
    const i = (o = t.current) == null ? void 0 : o.getModel();
    i && e.execute(i.getValue()).then(() => {
      r.show({
        content: n.t("uniscript.message.success"),
        type: w.Success
      });
    }).catch(() => {
      r.show({
        content: n.t("uniscript.message.failed"),
        type: w.Error
      });
    });
  }, [n, r, t, e]);
}
function ye(t) {
  return {
    id: C.id,
    title: "toggle-script-panel",
    tooltip: "script-panel.tooltip.menu-button",
    icon: "CodeIcon",
    type: ne.BUTTON,
    // FIXME hidden$ and disabled$ are not correctly in doc
    hidden$: re(t, Y.UNIVER_SHEET),
    disabled$: Ie(t, { workbookTypes: [Se], worksheetTypes: [me, _e, fe], rangeTypes: [he] })
  };
}
const Ue = {
  [ie.OTHERS]: {
    [C.id]: {
      order: 0,
      menuItemFactory: ye
    }
  }
};
var $e = Object.getOwnPropertyDescriptor, Me = (t, e, r, n) => {
  for (var i = n > 1 ? void 0 : n ? $e(e, r) : e, o = t.length - 1, s; o >= 0; o--)
    (s = t[o]) && (i = s(i) || i);
  return i;
}, S = (t, e) => (r, n) => e(r, n, t);
let m = class extends _ {
  constructor(t, e, r) {
    super(), this._menuManagerService = t, this._menuManagerService.mergeMenu(Ue), this.disposeWithMe(r.register(R, we)), this.disposeWithMe(e.registerCommand(C));
  }
};
m = Me([
  S(0, oe),
  S(1, J),
  S(2, E(se))
], m);
var je = Object.getOwnPropertyDescriptor, Ne = (t, e, r, n) => {
  for (var i = n > 1 ? void 0 : n ? je(e, r) : e, o = t.length - 1, s; o >= 0; o--)
    (s = t[o]) && (i = s(i) || i);
  return i;
}, U = (t, e) => (r, n) => e(r, n, t);
const Te = "UNIVER_UNISCRIPT_PLUGIN";
var I;
let $ = (I = class extends Q {
  constructor(t = x, e, r) {
    super(), this._config = t, this._injector = e, this._configService = r;
    const { menu: n, ...i } = X(
      {},
      x,
      this._config
    );
    n && this._configService.setConfig("menu", n, { merge: !0 }), this._configService.setConfig(k, i);
  }
  onStarting() {
    const t = this._injector;
    [
      [m],
      [h],
      [D]
    ].forEach((r) => t.add(r)), this.registerExecution();
  }
  onSteady() {
    this._injector.get(m);
  }
  /**
   * Allows being overridden, replacing with a new UniscriptExecutionService.
   */
  registerExecution() {
    this._injector.add([W, { useClass: P }]);
  }
}, p(I, "pluginName", Te), I);
$ = Ne([
  U(1, E(N)),
  U(2, j)
], $);
export {
  W as IUniscriptExecutionService,
  h as ScriptEditorService,
  C as ToggleScriptPanelOperation,
  $ as UniverUniscriptPlugin
};
