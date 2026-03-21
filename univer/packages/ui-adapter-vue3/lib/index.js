import { DependentOn as _, Inject as s, Injector as m, Plugin as d } from "@univerjs/core";
import { UniverUIPlugin as g, ComponentManager as v } from "@univerjs/ui";
import { h as P, render as p } from "vue";
var U = Object.defineProperty, h = Object.getOwnPropertyDescriptor, E = (e, r, t) => r in e ? U(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[r] = t, I = (e, r, t, o) => {
  for (var n = o > 1 ? void 0 : o ? h(r, t) : r, c = e.length - 1, u; c >= 0; c--)
    (u = e[c]) && (n = u(n) || n);
  return n;
}, l = (e, r) => (t, o) => r(t, o, e), O = (e, r, t) => E(e, r + "", t);
let i = class extends d {
  constructor(e = {}, r, t) {
    super(), this._config = e, this._injector = r, this._componentManager = t;
  }
  onStarting() {
    const { createElement: e, useEffect: r, useRef: t } = this._componentManager.reactUtils;
    this._componentManager.setHandler("vue3", (o) => (n) => e(b, {
      component: o,
      props: Object.keys(n).reduce((c, u) => (u !== "key" && (c[u] = n[u]), c), {}),
      reactUtils: { createElement: e, useEffect: r, useRef: t }
    }));
  }
};
O(i, "pluginName", "UNIVER_UI_ADAPTER_VUE3_PLUGIN");
i = I([
  _(g),
  l(1, s(m)),
  l(2, s(v))
], i);
function b(e) {
  const { component: r, props: t, reactUtils: o } = e, { createElement: n, useEffect: c, useRef: u } = o, a = u(null);
  return c(() => {
    if (!a.current) return;
    const f = P(r, t);
    return p(f, a.current), () => {
      a.current && p(null, a.current);
    };
  }, [t]), n("div", { ref: a });
}
export {
  i as UniverVue3AdapterPlugin
};
