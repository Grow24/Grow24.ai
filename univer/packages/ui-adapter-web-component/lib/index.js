import { DependentOn as _, Inject as u, Injector as d, Plugin as g } from "@univerjs/core";
import { UniverUIPlugin as v, ComponentManager as E } from "@univerjs/ui";
var P = Object.defineProperty, C = Object.getOwnPropertyDescriptor, h = (e, t, n) => t in e ? P(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, b = (e, t, n, o) => {
  for (var r = o > 1 ? void 0 : o ? C(t, n) : t, c = e.length - 1, a; c >= 0; c--)
    (a = e[c]) && (r = a(r) || r);
  return r;
}, l = (e, t) => (n, o) => t(n, o, e), U = (e, t, n) => h(e, t + "", n);
let m = class extends g {
  constructor(e = {}, t, n) {
    super(), this._config = e, this._injector = t, this._componentManager = n;
  }
  onStarting() {
    const { createElement: e, useEffect: t, useRef: n } = this._componentManager.reactUtils;
    this._componentManager.setHandler("web-component", (o, r) => () => e(w, {
      component: o,
      props: {
        name: r
      },
      reactUtils: { createElement: e, useEffect: t, useRef: n }
    }));
  }
};
U(m, "pluginName", "UNIVER_UI_ADAPTER_WEB_COMPONENT_PLUGIN");
m = b([
  _(v),
  l(1, u(d)),
  l(2, u(E))
], m);
function w(e) {
  const { component: t, props: n, reactUtils: o } = e, { name: r } = n != null ? n : {}, { createElement: c, useEffect: a, useRef: f } = o;
  if (!r)
    throw new Error("WebComponentComponentWrapper requires a name prop to define the custom element.");
  customElements.get(r) || customElements.define(r, t);
  const i = f(null);
  return a(() => {
    if (!i.current) return;
    const p = document.createElement(r);
    return i.current.appendChild(p), () => {
      var s;
      (s = i.current) == null || s.removeChild(p);
    };
  }, []), c("div", { ref: i });
}
export {
  m as UniverWebComponentAdapterPlugin
};
