var Oe = Object.defineProperty;
var De = (e, t, r) => t in e ? Oe(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var _ = (e, t, r) => De(e, typeof t != "symbol" ? t + "" : t, r);
import { ILogService as ke, IUniverInstanceService as f, ObjectMatrix as ve, Range as Re, ThemeService as G, IPermissionService as ue, UniverInstanceType as A, LocaleType as h, LocaleService as Me, Inject as x, ICommandService as Be, CommandType as Fe, IResourceLoaderService as Le, UserManagerService as Pe, createDefaultUser as We, ILocalStorageService as He, Disposable as q, IConfigService as Z, Injector as ge, BooleanNumber as I, DocumentFlavor as je, awaitTime as b, LifecycleService as Ve, RxDisposable as ze, LifecycleStages as Ke, Plugin as Ge, merge as qe, registerDependencies as Ze, touchDependencies as F } from "@univerjs/core";
import { useDependency as d, IDialogService as Xe, IConfirmService as Je, IMessageService as Ye, INotificationService as Qe, ISidebarService as X, ILocalFileService as Ae, useObservable as H, IClipboardInterfaceService as $e, IMenuManagerService as he, ComponentManager as me, IUIPartsService as et, BuiltInUIPart as tt, connectInjector as nt } from "@univerjs/ui";
import { jsx as s, jsxs as l } from "react/jsx-runtime";
import { clsx as U, borderClassName as Se, MessageType as Q, Button as j, InputNumber as m, Checkbox as V, Input as rt, Select as fe, Dropdown as at, ColorPicker as it, DropdownMenu as st } from "@univerjs/design";
import { SheetsSelectionsService as ot, getSheetCommandTarget as be, WorksheetEditPermission as $, WorkbookEditablePermission as ee, WorkbookManageCollaboratorPermission as te } from "@univerjs/sheets";
import { useEffect as E, useState as z, useRef as lt, createElement as M, forwardRef as J, useCallback as ct } from "react";
import { DocFloatDomController as dt } from "@univerjs/docs-drawing-ui";
import { SheetCanvasFloatDomManagerService as pt } from "@univerjs/sheets-drawing-ui";
import { Observable as vt, filter as ut, take as gt, takeUntil as At, distinctUntilChanged as ht } from "rxjs";
import { greenTheme as mt, defaultTheme as St } from "@univerjs/themes";
import { IWatermarkTypeEnum as S, UNIVER_WATERMARK_STORAGE_KEY as ft, ptToPixel as w, IRenderManagerService as bt } from "@univerjs/engine-render";
import { WATERMARK_IMAGE_ALLOW_IMAGE_LIST as yt, WatermarkService as ye, WatermarkTextBaseConfig as K, WatermarkImageBaseConfig as It } from "@univerjs/watermark";
import { DEFAULT_WORKBOOK_DATA_DEMO as ne, DEFAULT_WORKBOOK_DATA_DEMO_DEFAULT_STYLE as xt } from "@univerjs/mockdata";
const Y = "debugger.config", re = {
  fab: !0,
  performanceMonitor: {
    enabled: !0
  }
}, wt = () => /* @__PURE__ */ s("div", { style: {
  width: "100px",
  height: "30px",
  backgroundColor: "#fff",
  border: "1px solid #ccc",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center"
}, onClick: () => {
  console.warn("click");
}, children: "FloatButton" }), Ct = () => /* @__PURE__ */ l("button", { type: "button", style: {
  width: "80px",
  height: "50px",
  backgroundColor: "#fff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  borderRadius: "25px",
  border: "none",
  color: "white",
  cursor: "pointer",
  transition: "all 0.3s ease",
  background: "linear-gradient(90deg, #00C9FF 0%, #92FE9D 50%, #00C9FF 100%)",
  backgroundSize: "200% auto",
  animation: "gradient 3s linear infinite",
  ":hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 20px rgba(0, 201, 255, 0.3)"
  }
}, onClick: () => {
  console.warn("click");
}, children: [
  "AI",
  /* @__PURE__ */ s("style", { children: `
                    @keyframes gradient {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }

                    button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 10px 20px rgba(0, 201, 255, 0.3);
                    }
                ` })
] }), _t = "data:image/jpeg;base64,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", Nt = () => /* @__PURE__ */ s("img", { className: "univer-size-full", draggable: !1, src: _t }), Tt = () => /* @__PURE__ */ s(
  "div",
  {
    className: U("univer-flex univer-size-full univer-origin-top-left univer-items-center univer-justify-center univer-bg-white dark:!univer-bg-gray-900", Se),
    children: "Loading..."
  }
);
function Et() {
  const e = d(ke), t = d(ot), r = d(f);
  return {
    type: "item",
    children: "🗒️ Console cell content",
    onSelect: () => {
      const n = t.getCurrentSelections(), i = be(r), o = new ve();
      n.forEach((v) => {
        Re.foreach(v.range, (p, c) => {
          o.setValue(p, c, i == null ? void 0 : i.worksheet.getCell(p, c));
        });
      }), e.debug("cell-content", o);
    }
  };
}
function Ut() {
  const e = d(G);
  return E(() => {
    const r = localStorage.getItem("local.darkMode");
    r === "dark" ? (document.documentElement.classList.add("univer-dark"), e.setDarkMode(!0)) : r === "system" && e.setDarkMode(!1);
  }, []), {
    type: "item",
    children: "🌓 Toggle dark mode",
    onSelect: () => {
      const r = e.darkMode ? "light" : "dark";
      e.setDarkMode(r === "dark"), localStorage.setItem("local.darkMode", r);
    }
  };
}
const Ot = [
  {
    label: "Open dialog",
    value: "dialog"
  },
  {
    label: "Draggable dialog",
    value: "draggable"
  },
  {
    label: "Open confirm",
    value: "confirm"
  }
];
function Dt() {
  const e = d(Xe), t = d(Je), r = (a) => {
    a === "draggable" ? e.open({
      id: "draggable",
      children: { title: "Draggable Dialog Content" },
      title: { title: "Draggable Dialog" },
      draggable: !0,
      destroyOnClose: !0,
      preservePositionOnDestroy: !0,
      width: 350,
      onClose() {
      },
      onOpenChange(n) {
        n || e.close("draggable");
      }
    }) : a === "dialog" ? e.open({
      id: "dialog1",
      children: { title: "Dialog Content" },
      footer: { title: "Dialog Footer" },
      title: { title: "Dialog Title" },
      draggable: !1,
      onClose() {
      },
      onOpenChange(n) {
        n || e.close("dialog1");
      }
    }) : a === "confirm" && (t.open({
      id: "confirm1",
      children: { title: "Confirm Content" },
      title: { title: "Confirm Title" },
      confirmText: "hello",
      cancelText: "world",
      onClose() {
        t.close("confirm1");
      }
    }), t.open({
      id: "confirm2",
      children: { title: "Confirm2 Content" },
      title: { title: "Confirm2 Title" },
      onClose() {
        t.close("confirm2");
      }
    }));
  };
  return {
    type: "subItem",
    children: "💬 Dialog & Confirm",
    options: Ot.map((a) => ({
      type: "item",
      children: a.label,
      onSelect: () => r(a.value)
    }))
  };
}
const kt = [
  {
    label: "Dispose Univer",
    value: "univer"
  },
  {
    label: "Dispose current unit",
    value: "unit"
  }
];
function Rt() {
  const e = d(f), t = (r) => {
    var a;
    if (r === "univer")
      (a = window.univer) == null || a.dispose(), window.univer = void 0, window.univerAPI = void 0;
    else if (r === "unit") {
      const n = e.getFocusedUnit();
      return n ? e.disposeUnit(n.getUnitId()) : !1;
    }
  };
  return {
    type: "subItem",
    children: "🗑️ Dispose",
    options: kt.map((r) => ({
      type: "item",
      children: r.label,
      onSelect: () => t(r.value)
    }))
  };
}
const Mt = [
  {
    label: "Change workbook editable",
    value: "univer"
  },
  {
    label: "Change worksheet editable",
    value: "sheet"
  }
];
function Bt() {
  const e = d(f), t = d(ue), r = (a) => {
    const n = be(e);
    if (!n)
      return !1;
    const { workbook: i, worksheet: o, unitId: v, subUnitId: p } = n;
    if (!i || !o)
      return !1;
    if (a === "sheet") {
      const c = t.getPermissionPoint(new $(v, p).id);
      t.updatePermissionPoint(new $(v, p).id, !c);
    } else {
      const c = i.getUnitId(), u = t.getPermissionPoint(new ee(c).id);
      t.updatePermissionPoint(new ee(c).id, !u);
    }
  };
  return {
    type: "subItem",
    children: "✍️ Editable",
    options: Mt.map((a) => ({
      type: "item",
      children: a.label,
      onSelect: () => r(a.value)
    }))
  };
}
function Ft() {
  const e = d(f), t = d(pt), r = d(dt);
  return {
    type: "item",
    children: "☁️ Create floating DOM",
    onSelect: () => {
      e.getCurrentUnitOfType(A.UNIVER_SHEET) ? t.addFloatDomToPosition({
        allowTransform: !0,
        initPosition: {
          startX: 200,
          endX: 400,
          startY: 200,
          endY: 400
        },
        componentKey: "ImageDemo",
        data: {
          aa: "128"
        }
      }) : r.insertFloatDom({
        allowTransform: !0,
        componentKey: "ImageDemo",
        data: {
          aa: "128"
        }
      }, {
        height: 300
      });
    }
  };
}
const Lt = [
  {
    label: "English",
    value: h.EN_US
  },
  {
    label: "Français",
    value: h.FR_FR
  },
  {
    label: "简体中文",
    value: h.ZH_CN
  },
  {
    label: "Русский",
    value: h.RU_RU
  },
  {
    label: "繁體中文",
    value: h.ZH_TW
  },
  {
    label: "Tiếng Việt",
    value: h.VI_VN
  },
  {
    label: "日本語",
    value: h.JA_JP
  },
  {
    label: "한국어",
    value: h.KO_KR
  },
  {
    label: "Español",
    value: "es-ES"
  },
  {
    label: "Català",
    value: "ca-ES"
  }
];
function Pt() {
  const e = d(Me);
  async function t(a) {
    let n;
    switch (a) {
      case h.ZH_CN:
        n = await import("@univerjs/mockdata/locales/zh-CN");
        break;
      case h.ZH_TW:
        n = await import("@univerjs/mockdata/locales/zh-TW");
        break;
      case h.FR_FR:
        n = await import("@univerjs/mockdata/locales/fr-FR");
        break;
      case h.RU_RU:
        n = await import("@univerjs/mockdata/locales/ru-RU");
        break;
      case h.VI_VN:
        n = await import("@univerjs/mockdata/locales/vi-VN");
        break;
      case h.JA_JP:
        n = await import("@univerjs/mockdata/locales/ja-JP");
        break;
      case h.KO_KR:
        n = await import("@univerjs/mockdata/locales/ko-KR");
        break;
      case "es-ES":
        n = await import("@univerjs/mockdata/locales/es-ES");
        break;
      case "ca-ES":
        n = await import("@univerjs/mockdata/locales/ca-ES");
        break;
      case h.EN_US:
      default:
        n = await import("@univerjs/mockdata/locales/en-US");
        break;
    }
    e.load({
      [a]: n.default
    });
  }
  E(() => {
    const a = localStorage.getItem("local.locale");
    a && t(a).then(() => {
      e.setLocale(a);
    });
  }, []);
  const r = async (a) => {
    await t(a), e.setLocale(a), localStorage.setItem("local.locale", a);
  };
  return {
    type: "subItem",
    children: "🌐 Languages",
    options: Lt.map((a) => ({
      type: "radio",
      value: e.getCurrentLocale(),
      options: [{
        label: a.label,
        value: a.value
      }],
      onSelect: r
    }))
  };
}
const Wt = [
  {
    label: "Open message",
    value: ""
  },
  {
    label: "Open loading message",
    value: "loading"
  }
];
function Ht() {
  const e = d(Ye), t = (r) => {
    r === "loading" ? e.show({
      type: Q.Loading,
      content: "Loading message",
      duration: 3e3
    }) : e.show({
      type: Q.Success,
      content: "Demo message",
      duration: 1500
    });
  };
  return {
    type: "subItem",
    children: "✉️ Message",
    options: Wt.map((r) => ({
      type: "item",
      children: r.label,
      onSelect: () => t(r.value)
    }))
  };
}
const jt = [
  {
    label: "Notification success",
    value: "success"
  },
  {
    label: "Notification info",
    value: "info"
  },
  {
    label: "Notification warning",
    value: "warning"
  },
  {
    label: "Notification error",
    value: "error"
  }
];
function Vt() {
  const e = d(Qe), t = (r) => {
    e.show({
      type: r,
      content: "Lorem Ipusm dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      title: "Notification Title"
    });
  };
  return {
    type: "subItem",
    children: "🔔 Notification",
    options: jt.map((r) => ({
      type: "item",
      children: r.label,
      onSelect: () => t(r.value)
    }))
  };
}
const zt = "TestEditorContainer", Kt = [
  {
    label: "Open sidebar",
    value: "open"
  },
  {
    label: "Close sidebar",
    value: "close"
  }
];
function Gt() {
  const e = d(X), t = (r) => {
    r === "open" ? e.open({
      header: { title: "Sidebar title" },
      children: { label: zt },
      footer: { title: "Sidebar Footer" },
      onClose: () => {
      }
    }) : r === "close" && e.close();
  };
  return {
    type: "subItem",
    children: "🧩 Sidebar",
    options: Kt.map((r) => ({
      type: "item",
      children: r.label,
      onSelect: () => t(r.value)
    }))
  };
}
var qt = Object.getOwnPropertyDescriptor, Zt = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? qt(t, r) : t, i = e.length - 1, o; i >= 0; i--)
    (o = e[i]) && (n = o(n) || n);
  return n;
}, Xt = (e, t) => (r, a) => t(r, a, e);
let O = class {
  constructor(e) {
    this._commandService = e;
  }
  record() {
    return new vt((e) => {
      navigator.mediaDevices.getDisplayMedia({ video: !0 }).then((t) => {
        e.next({ type: "start" });
        const r = MediaRecorder.isTypeSupported("video/webm; codecs=vp9") ? "video/webm; codecs=vp9" : "video/webm", a = new MediaRecorder(t, { mimeType: r }), n = [];
        a.addEventListener("dataavailable", function(i) {
          n.push(i.data);
        }), a.addEventListener("stop", function() {
          const i = new Blob(n, { type: n[0].type });
          e.next({ type: "finish", data: i }), e.complete();
        }), a.start();
      });
    });
  }
  startSaveCommands() {
    const e = [], t = performance.now(), r = this._commandService.beforeCommandExecuted((a) => {
      try {
        e.push([
          String((performance.now() - t) / 1e3),
          a.id,
          String(a.type || Fe.COMMAND),
          JSON.stringify(a.params || "")
        ]);
      } catch (n) {
        console.error(`${a.id}  unable to serialize`), console.error(n);
      }
    });
    return () => (r.dispose(), e);
  }
};
O = Zt([
  Xt(0, x(Be))
], O);
const Jt = [
  {
    label: "Save workbook",
    value: "workbook"
  },
  {
    label: "Save worksheet",
    value: "sheet"
  },
  {
    label: "Record",
    value: "record"
  },
  {
    label: "Load snapshot",
    value: "load"
  }
], ae = (e) => {
  const t = e.sheets, r = {};
  return Object.keys(t).forEach((a) => {
    const n = t[a];
    new ve(n.cellData).forValue((i, o, v) => {
      const p = v == null ? void 0 : v.s;
      if (p && typeof p == "string") {
        const c = e.styles[p];
        c && (r[p] = c);
      }
    });
  }), e.styles = r, e;
};
function Yt() {
  const e = d(f), t = d(Le), r = d(Ae), a = d(O), n = async (i) => {
    const o = (/* @__PURE__ */ new Date()).toLocaleString(), v = e.getCurrentUnitOfType(A.UNIVER_SHEET);
    if (!v) {
      const u = e.getCurrentUnitOfType(A.UNIVER_DOC), g = t.saveUnit(u.getUnitId());
      {
        const Te = process.env.GIT_COMMIT_HASH, Ee = process.env.GIT_REF_NAME, Ue = process.env.BUILD_TIME;
        g.__env__ = { gitHash: Te, gitBranch: Ee, buildTime: Ue };
      }
      const y = JSON.stringify(g, null, 2);
      return r.downloadFile(new Blob([y]), `${o} snapshot.json`), !0;
    }
    const p = v.getActiveSheet();
    if (!p)
      return !1;
    const c = t.saveUnit(v.getUnitId());
    {
      const u = process.env.GIT_COMMIT_HASH, g = process.env.GIT_REF_NAME, y = process.env.BUILD_TIME;
      c.__env__ = { gitHash: u, gitBranch: g, buildTime: y };
    }
    if (i === "sheet") {
      const u = p.getSheetId(), g = c.sheets[u];
      c.sheets = { [u]: g }, c.sheetOrder = [u];
      const y = JSON.stringify(ae(c), null, 2);
      r.downloadFile(new Blob([y]), `${o} snapshot.json`);
    } else if (i === "workbook") {
      const u = JSON.stringify(ae(c), null, 2);
      r.downloadFile(new Blob([u]), `${o} snapshot.json`);
    } else if (i === "record") {
      let u = () => [];
      a.record().subscribe((g) => {
        if (g.type === "start" && (u = a.startSaveCommands()), g.type === "finish") {
          const y = u();
          r.downloadFile(g.data, `${o} video.webm`), r.downloadFile(new Blob([JSON.stringify(y, null, 2)]), `${o} commands.json`);
        }
      });
    } else if (i === "load") {
      const u = await r.openFile({ multiple: !1, accept: ".json" });
      if (u.length !== 1) return !1;
      const g = await u[0].text();
      return e.createUnit(A.UNIVER_SHEET, JSON.parse(g)), !0;
    }
  };
  return {
    type: "subItem",
    children: "📷 Snapshot",
    options: Jt.map((i) => ({
      type: "item",
      children: i.label,
      onSelect: () => n(i.value)
    }))
  };
}
const L = [
  {
    label: "🟢",
    value: mt
  },
  {
    label: "🔵",
    value: St
  }
];
function Qt() {
  const e = d(G);
  E(() => {
    const r = localStorage.getItem("local.theme"), a = L.find((n) => n.label === r);
    a && e.setTheme(a.value);
  }, []);
  const t = (r) => {
    localStorage.setItem("local.theme", r);
    const a = L.find((n) => n.label === r);
    a && e.setTheme(a.value);
  };
  return {
    type: "subItem",
    children: "🎨 Themes",
    options: L.map((r) => ({
      type: "item",
      children: r.label,
      onSelect: () => t(r.label)
    }))
  };
}
const ie = [
  {
    label: "Create another sheet",
    value: "create"
  }
];
function $t() {
  const e = d(f), [t, r] = z([...ie]), a = H(e.unitAdded$), n = H(e.unitDisposed$);
  E(() => {
    const v = e.getAllUnitsForType(A.UNIVER_SHEET).map((p) => ({
      label: p.getName() || p.getUnitId(),
      value: p.getUnitId()
    }));
    r([
      ...ie,
      ...v
    ]);
  }, [a, n]);
  const i = (o) => {
    if (o === "create")
      e.createUnit(A.UNIVER_SHEET, {});
    else {
      if (!e.getUnit(o)) return !1;
      e.setCurrentUnitForType(o);
    }
  };
  return {
    type: "subItem",
    children: "🪸 Units",
    options: t.map((o) => ({
      type: "item",
      children: o.label,
      onSelect: () => i(o.value)
    }))
  };
}
const en = [
  {
    label: "Owner",
    value: 2
    /* Owner */
  },
  {
    label: "Editor",
    value: 1
    /* Editor */
  },
  {
    label: "Reader",
    value: 0
    /* Reader */
  }
];
function tn() {
  const e = d(f), t = d(Pe), r = d(ue), a = (n) => {
    t.setCurrentUser(We(n));
    const o = e.getCurrentUnitOfType(A.UNIVER_SHEET).getUnitId();
    n === 2 ? r.updatePermissionPoint(new te(o).id, !0) : r.updatePermissionPoint(new te(o).id, !1);
  };
  return {
    type: "subItem",
    children: "👥 Change user's role",
    options: en.map((n) => ({
      type: "item",
      children: n.label,
      onSelect: () => a(n.value)
    }))
  };
}
function nn({ config: e, onChange: t }) {
  const r = d(Ae);
  return e ? /* @__PURE__ */ l("div", { className: "univer-grid univer-gap-2", children: [
    /* @__PURE__ */ s("div", { className: "univer-text-gray-400", children: "Image" }),
    /* @__PURE__ */ l("div", { className: "univer-mb-4 univer-grid univer-gap-1", children: [
      /* @__PURE__ */ s(
        j,
        {
          className: "univer-mb-2",
          onClick: async () => {
            const n = await r.openFile({
              multiple: !1,
              accept: yt.map((p) => `.${p.replace("image/", "")}`).join(",")
            });
            if (n.length === 0)
              return !1;
            const o = n[0], v = new FileReader();
            v.onload = function(p) {
              var c;
              if ((c = p.target) != null && c.result) {
                const u = p.target.result, g = new Image();
                g.onload = function() {
                  t({ ...e, url: u, width: Math.max(20, g.width), height: Math.max(g.height, 20), originRatio: g.width / g.height });
                }, g.src = u;
              }
            }, v.readAsDataURL(o);
          },
          children: e.url ? "Replace Image" : "Upload Image"
        }
      ),
      /* @__PURE__ */ l("div", { className: "univer-flex univer-gap-2 univer-text-center", children: [
        /* @__PURE__ */ l("div", { className: "univer-grid univer-flex-1 univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Opacity" }),
          /* @__PURE__ */ s(
            m,
            {
              className: "univer-box-border univer-h-7",
              value: e.opacity,
              max: 1,
              min: 0,
              step: 0.05,
              onChange: (n) => {
                n != null && t({ ...e, opacity: Number.parseFloat(n.toString()) });
              }
            }
          )
        ] }),
        /* @__PURE__ */ l("div", { className: "univer-grid univer-flex-1 univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Keep Ratio" }),
          /* @__PURE__ */ s(
            V,
            {
              className: "univer-justify-center univer-self-baseline",
              checked: e.maintainAspectRatio,
              onChange: (n) => {
                t(n === !0 ? { ...e, maintainAspectRatio: n, height: Math.round(e.width / e.originRatio) } : { ...e, maintainAspectRatio: n });
              }
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ s("div", { className: "univer-grid univer-gap-2 univer-text-center", children: /* @__PURE__ */ l("div", { className: "univer-flex univer-gap-2", children: [
      /* @__PURE__ */ l("div", { className: "univer-grid univer-flex-1 univer-gap-1", children: [
        /* @__PURE__ */ s("div", { children: "Width" }),
        /* @__PURE__ */ s(
          m,
          {
            className: "univer-box-border univer-h-7",
            value: e.width,
            min: 20,
            onChange: (n) => {
              if (n != null) {
                const i = Math.max(20, Number.parseInt(n.toString()));
                e.maintainAspectRatio ? t({ ...e, width: i, height: Math.round(i / e.originRatio) }) : t({ ...e, width: i });
              }
            }
          }
        )
      ] }),
      /* @__PURE__ */ l("div", { className: "univer-grid univer-flex-1 univer-gap-1", children: [
        /* @__PURE__ */ s("div", { children: "Height" }),
        /* @__PURE__ */ s(
          m,
          {
            className: "univer-box-border univer-h-7",
            value: e.height,
            min: 20,
            onChange: (n) => {
              if (n != null) {
                const i = Math.max(20, Number.parseInt(n.toString()));
                e.maintainAspectRatio ? t({ ...e, height: i, width: Math.round(i * e.originRatio) }) : t({ ...e, height: Number.parseInt(n.toString()) });
              }
            }
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ s("div", { className: "univer-text-gray-400", children: "Layout Settings" }),
    /* @__PURE__ */ l("div", { className: "univer-grid univer-gap-2 univer-text-center", children: [
      /* @__PURE__ */ l("div", { className: "univer-flex univer-gap-2", children: [
        /* @__PURE__ */ l("div", { className: "univer-grid univer-flex-1 univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Rotate" }),
          /* @__PURE__ */ s(
            m,
            {
              className: "univer-box-border univer-h-7",
              value: e.rotate,
              max: 360,
              min: -360,
              onChange: (n) => {
                n != null && t({ ...e, rotate: Number.parseInt(n.toString()) });
              }
            }
          )
        ] }),
        /* @__PURE__ */ l("div", { className: "univer-grid univer-flex-1 univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Repeat" }),
          /* @__PURE__ */ s(
            V,
            {
              className: "univer-justify-center univer-self-baseline",
              checked: e.repeat,
              onChange: (n) => t({ ...e, repeat: n })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ l("div", { className: "univer-flex univer-gap-2", children: [
        /* @__PURE__ */ l("div", { className: "univer-grid univer-flex-1 univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Horizontal Spacing" }),
          /* @__PURE__ */ s(
            m,
            {
              className: "univer-box-border univer-h-7",
              value: e.spacingX,
              min: 0,
              onChange: (n) => {
                n != null && t({ ...e, spacingX: Number.parseInt(n.toString()) });
              }
            }
          )
        ] }),
        /* @__PURE__ */ l("div", { className: "univer-grid univer-flex-1 univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Vertical Spacing" }),
          /* @__PURE__ */ s(
            m,
            {
              className: "univer-box-border univer-h-7",
              value: e.spacingY,
              min: 0,
              onChange: (n) => {
                n != null && t({ ...e, spacingY: Number.parseInt(n.toString()) });
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ l("div", { className: "univer-flex univer-gap-2", children: [
        /* @__PURE__ */ l("div", { className: "univer-grid univer-flex-1 univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Horizontal Start Position" }),
          /* @__PURE__ */ s(
            m,
            {
              className: "univer-box-border univer-h-7",
              value: e.x,
              min: 0,
              onChange: (n) => {
                n != null && t({ ...e, x: Number.parseInt(n.toString()) });
              }
            }
          )
        ] }),
        /* @__PURE__ */ l("div", { className: "univer-grid univer-flex-1 univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Vertical Start Position" }),
          /* @__PURE__ */ s(
            m,
            {
              className: "univer-box-border univer-h-7",
              value: e.y,
              min: 0,
              onChange: (n) => {
                n != null && t({ ...e, y: Number.parseInt(n.toString()) });
              }
            }
          )
        ] })
      ] })
    ] })
  ] }) : null;
}
function B({ ref: e, ...t }) {
  const { icon: r, id: a, className: n, extend: i, ...o } = t, v = `univerjs-icon univerjs-icon-${a} ${n || ""}`.trim(), p = lt(`_${sn()}`);
  return Ie(r, `${a}`, {
    defIds: r.defIds,
    idSuffix: p.current
  }, {
    ref: e,
    className: v,
    ...o
  }, i);
}
function Ie(e, t, r, a, n) {
  return M(e.tag, {
    key: t,
    ...rn(e, r, n),
    ...a
  }, (an(e, r).children || []).map((i, o) => Ie(i, `${t}-${e.tag}-${o}`, r, void 0, n)));
}
function rn(e, t, r) {
  const a = { ...e.attrs };
  r != null && r.colorChannel1 && a.fill === "colorChannel1" && (a.fill = r.colorChannel1), e.tag === "mask" && a.id && (a.id = a.id + t.idSuffix), Object.entries(a).forEach(([i, o]) => {
    i === "mask" && typeof o == "string" && (a[i] = o.replace(/url\(#(.*)\)/, `url(#$1${t.idSuffix})`));
  });
  const { defIds: n } = t;
  return !n || n.length === 0 || (e.tag === "use" && a["xlink:href"] && (a["xlink:href"] = a["xlink:href"] + t.idSuffix), Object.entries(a).forEach(([i, o]) => {
    typeof o == "string" && (a[i] = o.replace(/url\(#(.*)\)/, `url(#$1${t.idSuffix})`));
  })), a;
}
function an(e, t) {
  var a;
  const { defIds: r } = t;
  return !r || r.length === 0 ? e : e.tag === "defs" && ((a = e.children) != null && a.length) ? {
    ...e,
    children: e.children.map((n) => typeof n.attrs.id == "string" && r && r.includes(n.attrs.id) ? {
      ...n,
      attrs: {
        ...n.attrs,
        id: n.attrs.id + t.idSuffix
      }
    } : n)
  } : e;
}
function sn() {
  return Math.random().toString(36).substring(2, 8);
}
B.displayName = "UniverIcon";
const on = {
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
      d: "M4.65791 1.30005C3.77355 1.30005 3.05664 2.01696 3.05664 2.90132V12.8588C3.05664 13.8755 3.88086 14.6998 4.89759 14.6998H9.1016C11.2233 14.6998 12.9433 12.9798 12.9433 10.8581C12.9433 9.13925 11.8145 7.68407 10.2578 7.1934C10.8806 6.56856 11.2655 5.70659 11.2655 4.75472C11.2655 2.84676 9.71883 1.30005 7.81087 1.30005H4.65791ZM4.25664 2.90132C4.25664 2.6797 4.4363 2.50005 4.65791 2.50005H7.81087C9.05609 2.50005 10.0655 3.5095 10.0655 4.75472C10.0655 5.99993 9.05609 7.00938 7.81087 7.00938H4.25664V2.90132ZM4.25664 12.8588V8.21636H9.1016C10.5606 8.21636 11.7433 9.39909 11.7433 10.8581C11.7433 12.317 10.5606 13.4998 9.1016 13.4998H4.89759C4.5436 13.4998 4.25664 13.2128 4.25664 12.8588Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, xe = J(function(t, r) {
  return M(B, Object.assign({}, t, {
    id: "bold-icon",
    ref: r,
    icon: on
  }));
});
xe.displayName = "BoldIcon";
const ln = {
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
      d: "M9.80385 1.40005H11.9997C12.3311 1.40005 12.5997 1.66868 12.5997 2.00005C12.5997 2.33143 12.3311 2.60005 11.9997 2.60005H10.1185L7.12251 13.4001H9.33324C9.66461 13.4001 9.93324 13.6687 9.93324 14.0001C9.93324 14.3314 9.66461 14.6001 9.33324 14.6001H6.34785C6.33847 14.6003 6.32905 14.6003 6.31962 14.6001H3.9999C3.66853 14.6001 3.3999 14.3314 3.3999 14.0001C3.3999 13.6687 3.66853 13.4001 3.9999 13.4001H5.87719L8.87322 2.60005H6.66641C6.33504 2.60005 6.06641 2.33143 6.06641 2.00005C6.06641 1.66868 6.33504 1.40005 6.66641 1.40005H9.52916C9.61698 1.37929 9.71064 1.3781 9.80385 1.40005Z"
    }
  }]
}, we = J(function(t, r) {
  return M(B, Object.assign({}, t, {
    id: "italic-icon",
    ref: r,
    icon: ln
  }));
});
we.displayName = "ItalicIcon";
const cn = {
  tag: "svg",
  attrs: {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 17 16",
    width: "1em",
    height: "1em"
  },
  children: [{
    tag: "path",
    attrs: {
      fill: "colorChannel1",
      d: "M1.98682 13.4992C1.98682 12.5603 2.74793 11.7992 3.68682 11.7992H14.2868C15.2257 11.7992 15.9868 12.5603 15.9868 13.4992V13.4992C15.9868 14.4381 15.2257 15.1992 14.2868 15.1992H3.68682C2.74793 15.1992 1.98682 14.4381 1.98682 13.4992V13.4992Z"
    }
  }, {
    tag: "path",
    attrs: {
      fill: "currentColor",
      d: "M10.3014 1.70389C9.85268 0.479568 8.12109 0.479557 7.67238 1.70389L4.72235 9.75326C4.60832 10.0644 4.76811 10.4091 5.07924 10.5231C5.39038 10.6371 5.73504 10.4773 5.84907 10.1662L6.99975 7.02646C7.03588 7.03324 7.07314 7.03679 7.11123 7.03679H10.9778L12.1247 10.1662C12.2387 10.4773 12.5834 10.6371 12.8945 10.5231C13.2057 10.4091 13.3654 10.0644 13.2514 9.75326L10.3014 1.70389ZM10.538 5.83679L9.17467 2.11682C9.11057 1.94192 8.8632 1.94192 8.7991 2.11682L7.43576 5.83679H10.538Z",
      fillRule: "evenodd",
      clipRule: "evenodd"
    }
  }]
}, Ce = J(function(t, r) {
  return M(B, Object.assign({}, t, {
    id: "font-color-double-icon",
    ref: r,
    icon: cn
  }));
});
Ce.displayName = "FontColorDoubleIcon";
function dn(e) {
  var a;
  const { config: t, onChange: r } = e;
  return t ? /* @__PURE__ */ l("div", { className: "univer-grid univer-gap-2", children: [
    /* @__PURE__ */ s("div", { className: "univer-text-gray-400", children: "Style Settings" }),
    /* @__PURE__ */ l("div", { className: "univer-mb-4 univer-grid univer-gap-1", children: [
      /* @__PURE__ */ s("div", { children: "Content" }),
      /* @__PURE__ */ s(
        rt,
        {
          value: t.content,
          onChange: (n) => r({ ...t, content: n }),
          placeholder: "Enter text"
        }
      )
    ] }),
    /* @__PURE__ */ l("div", { className: "univer-grid univer-gap-4", children: [
      /* @__PURE__ */ l("div", { className: "univer-flex univer-gap-2", children: [
        /* @__PURE__ */ l("div", { className: "univer-grid univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Font Size" }),
          /* @__PURE__ */ s(
            m,
            {
              value: t.fontSize,
              max: 72,
              min: 12,
              onChange: (n) => {
                n != null && r({ ...t, fontSize: Number.parseInt(n.toString()) });
              }
            }
          )
        ] }),
        /* @__PURE__ */ l("div", { className: "univer-grid univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Direction" }),
          /* @__PURE__ */ s(
            fe,
            {
              value: t.direction,
              options: [
                { label: "Left to Right", value: "ltr" },
                { label: "Right to Left", value: "rtl" }
              ],
              onChange: (n) => r({ ...t, direction: n })
            }
          )
        ] }),
        /* @__PURE__ */ l("div", { className: "univer-grid univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Opacity" }),
          /* @__PURE__ */ s(
            m,
            {
              max: 1,
              min: 0,
              step: 0.05,
              value: t.opacity,
              onChange: (n) => {
                n != null && r({ ...t, opacity: Number.parseFloat(n.toString()) });
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ l(
        "div",
        {
          className: "univer-flex univer-justify-around univer-gap-4 [&_a]:univer-flex [&_a]:univer-size-6 [&_a]:univer-items-center [&_a]:univer-justify-center [&_a]:univer-rounded",
          children: [
            /* @__PURE__ */ s(
              at,
              {
                overlay: /* @__PURE__ */ s("div", { className: "univer-rounded-lg univer-p-4", children: /* @__PURE__ */ s(it, { value: t.color, onChange: (n) => r({ ...t, color: n }) }) }),
                children: /* @__PURE__ */ s(
                  "a",
                  {
                    className: "hover:univer-bg-gray-100 dark:hover:!univer-bg-gray-700",
                    children: /* @__PURE__ */ s(Ce, { extend: { colorChannel1: (a = t.color) != null ? a : "#2c53f1" } })
                  }
                )
              }
            ),
            /* @__PURE__ */ s(
              "a",
              {
                className: U("hover:univer-bg-gray-100 dark:hover:!univer-bg-gray-700", {
                  "univer-bg-gray-200 dark:!univer-bg-gray-600": t.bold
                }),
                onClick: () => {
                  r({ ...t, bold: !t.bold });
                },
                children: /* @__PURE__ */ s(xe, {})
              }
            ),
            /* @__PURE__ */ s(
              "a",
              {
                className: U("hover:univer-bg-gray-100 dark:hover:!univer-bg-gray-700", {
                  "univer-bg-gray-200 dark:!univer-bg-gray-600": t.italic
                }),
                onClick: () => {
                  r({ ...t, italic: !t.italic });
                },
                children: /* @__PURE__ */ s(we, {})
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ s("div", { className: "univer-text-gray-400", children: "Layout Settings" }),
    /* @__PURE__ */ l("div", { className: "univer-grid univer-gap-2 univer-text-center", children: [
      /* @__PURE__ */ l("div", { className: "univer-flex univer-gap-2", children: [
        /* @__PURE__ */ l("div", { className: "univer-grid univer-flex-1 univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Rotate" }),
          /* @__PURE__ */ s(
            m,
            {
              value: t.rotate,
              max: 360,
              min: -360,
              onChange: (n) => {
                n != null && r({ ...t, rotate: Number.parseInt(n.toString()) });
              }
            }
          )
        ] }),
        /* @__PURE__ */ l("div", { className: "univer-grid univer-flex-1 univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Repeat" }),
          /* @__PURE__ */ s(
            V,
            {
              className: "univer-justify-center univer-self-baseline",
              checked: t.repeat,
              onChange: (n) => r({ ...t, repeat: n })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ l("div", { className: "univer-flex univer-gap-2", children: [
        /* @__PURE__ */ l("div", { className: "univer-grid univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Horizontal Spacing" }),
          /* @__PURE__ */ s(
            m,
            {
              value: t.spacingX,
              min: 0,
              onChange: (n) => {
                n != null && r({ ...t, spacingX: Number.parseInt(n.toString()) });
              }
            }
          )
        ] }),
        /* @__PURE__ */ l("div", { className: "univer-grid univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Vertical Spacing" }),
          /* @__PURE__ */ s(
            m,
            {
              value: t.spacingY,
              min: 0,
              onChange: (n) => {
                n != null && r({ ...t, spacingY: Number.parseInt(n.toString()) });
              }
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ l("div", { className: "univer-flex univer-gap-2", children: [
        /* @__PURE__ */ l("div", { className: "univer-grid univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Horizontal Start Position" }),
          /* @__PURE__ */ s(
            m,
            {
              value: t.x,
              min: 0,
              onChange: (n) => {
                n != null && r({ ...t, x: Number.parseInt(n.toString()) });
              }
            }
          )
        ] }),
        /* @__PURE__ */ l("div", { className: "univer-grid univer-gap-1", children: [
          /* @__PURE__ */ s("div", { children: "Vertical Start Position" }),
          /* @__PURE__ */ s(
            m,
            {
              value: t.y,
              min: 0,
              onChange: (n) => {
                n != null && r({ ...t, y: Number.parseInt(n.toString()) });
              }
            }
          )
        ] })
      ] })
    ] })
  ] }) : null;
}
function pn() {
  const [e, t] = z(S.Text), [r, a] = z(), n = d(ye), i = d(He), o = H(n.refresh$);
  function v(c, u) {
    a(c), n.updateWatermarkConfig({ type: u != null ? u : e, config: c });
  }
  const p = ct(async () => {
    const c = await i.getItem(ft);
    c ? (t(c.type), a(c.config)) : a({ text: K });
  }, []);
  return E(() => {
    p();
  }, [o, p]), /* @__PURE__ */ l("div", { className: "univer-grid univer-gap-3 univer-text-sm", children: [
    /* @__PURE__ */ l("div", { className: "univer-grid univer-gap-2", children: [
      /* @__PURE__ */ s("div", { className: "univer-text-gray-400", children: "Type" }),
      /* @__PURE__ */ s(
        fe,
        {
          value: e,
          options: [
            { label: "Text", value: S.Text },
            { label: "Image", value: S.Image }
          ],
          onChange: (c) => {
            t(c), c === S.Text ? v({ text: K }, S.Text) : c === S.Image && v({ image: It }, S.Image);
          }
        }
      )
    ] }),
    /* @__PURE__ */ l("div", { className: "univer-grid univer-gap-2", children: [
      e === S.Text && /* @__PURE__ */ s(dn, { config: r == null ? void 0 : r.text, onChange: (c) => v({ text: c }) }),
      e === S.Image && /* @__PURE__ */ s(nn, { config: r == null ? void 0 : r.image, onChange: (c) => v({ image: c }) })
    ] })
  ] });
}
function vn() {
  const e = d(X), t = d(ye), r = d($e);
  return /* @__PURE__ */ l("div", { className: "univer-flex univer-items-center univer-justify-between", children: [
    /* @__PURE__ */ s(
      "a",
      {
        className: "univer-text-sm univer-text-primary-600 univer-underline",
        onClick: () => {
          t.updateWatermarkConfig({
            type: S.Text,
            config: { text: K }
          }), t.refresh();
        },
        children: "Cancel Watermark"
      }
    ),
    /* @__PURE__ */ l("div", { className: "univer-flex univer-items-center univer-gap-2", children: [
      /* @__PURE__ */ s(
        j,
        {
          onClick: async () => {
            const a = await t.getWatermarkConfig();
            let n;
            (a == null ? void 0 : a.type) === S.Text ? n = a.config.text : (a == null ? void 0 : a.type) === S.Image && (n = a.config.image), r.writeText(JSON.stringify(n));
          },
          children: "Copy Config"
        }
      ),
      /* @__PURE__ */ s(
        j,
        {
          onClick: async () => {
            var n, i;
            const a = await t.getWatermarkConfig();
            ((a == null ? void 0 : a.type) === S.Text && !((n = a.config.text) != null && n.content) || (a == null ? void 0 : a.type) === S.Image && !((i = a.config.image) != null && i.url)) && t.deleteWatermarkConfig(), e.close();
          },
          children: "Close Panel"
        }
      )
    ] })
  ] });
}
var un = Object.getOwnPropertyDescriptor, gn = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? un(t, r) : t, i = e.length - 1, o; i >= 0; i--)
    (o = e[i]) && (n = o(n) || n);
  return n;
}, se = (e, t) => (r, a) => t(r, a, e);
const _e = "WATERMARK_PANEL", Ne = "WATERMARK_PANEL_FOOTER";
let D = class extends q {
  constructor(e, t) {
    super(), this._menuManagerService = e, this._componentManager = t, this._initComponents();
  }
  _initComponents() {
    [
      [_e, pn],
      [Ne, vn]
    ].forEach(([e, t]) => {
      this.disposeWithMe(this._componentManager.register(e, t));
    });
  }
};
D = gn([
  se(0, he),
  se(1, x(me))
], D);
function An() {
  const e = d(X);
  return {
    type: "item",
    children: "🌊 Watermark Settings",
    onSelect: () => {
      e.open({
        header: { title: "Watermark" },
        children: { label: _e },
        footer: { label: Ne },
        onClose: () => {
        },
        width: 330
      });
    }
  };
}
function hn() {
  var o;
  const e = d(Z), r = (o = d(f).getFocusedUnit()) == null ? void 0 : o.type;
  if (!r) return null;
  const a = [
    Pt(),
    Ut(),
    Qt(),
    An(),
    { type: "separator" },
    Vt(),
    Ht(),
    Dt(),
    Gt(),
    { type: "separator" },
    r === A.UNIVER_SHEET && Ft(),
    r === A.UNIVER_SHEET && Et(),
    r === A.UNIVER_SHEET && $t(),
    Yt(),
    Bt(),
    r === A.UNIVER_SHEET && tn(),
    Rt()
  ].filter((v) => v !== null), n = e.getConfig(Y), i = n == null ? void 0 : n.performanceMonitor;
  return /* @__PURE__ */ l(
    "div",
    {
      className: "univer-fixed univer-bottom-12 univer-right-8 univer-z-[9999] univer-flex univer-select-none univer-flex-col univer-items-center univer-gap-1",
      children: [
        /* @__PURE__ */ s(st, { align: "end", items: a, children: /* @__PURE__ */ s(
          "button",
          {
            className: U("univer-flex univer-size-9 univer-cursor-pointer univer-items-center univer-justify-center univer-rounded-full univer-bg-white univer-text-base univer-text-gray-900 univer-shadow univer-outline-none univer-transition-shadow hover:univer-ring-1 hover:univer-ring-primary-400 dark:!univer-bg-gray-900 dark:!univer-text-gray-200", Se),
            type: "button",
            children: "🏗️"
          }
        ) }),
        (i == null ? void 0 : i.enabled) && /* @__PURE__ */ s("span", { "data-u-comp": "debugger-fps", className: "univer-text-xs univer-text-gray-400" })
      ]
    }
  );
}
var mn = Object.getOwnPropertyDescriptor, Sn = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? mn(t, r) : t, i = e.length - 1, o; i >= 0; i--)
    (o = e[i]) && (n = o(n) || n);
  return n;
}, N = (e, t) => (r, a) => t(r, a, e);
let T = class extends q {
  constructor(e, t, r, a, n) {
    super(), this._injector = e, this._configService = t, this._uiPartsService = r, this._menuManagerService = a, this._componentManager = n, this._initCustomComponents(), this._injector.add([O]);
  }
  _initCustomComponents() {
    [
      ["ImageDemo", Nt],
      ["RangeLoading", Tt],
      ["FloatButton", wt],
      ["AIButton", Ct]
    ].forEach(([t, r]) => {
      this.disposeWithMe(
        this._componentManager.register(t, r)
      );
    });
    const e = this._configService.getConfig(Y);
    e != null && e.fab && this.disposeWithMe(
      this._uiPartsService.registerComponent(tt.GLOBAL, () => nt(hn, this._injector))
    );
  }
};
T = Sn([
  N(0, x(ge)),
  N(1, Z),
  N(2, et),
  N(3, he),
  N(4, x(me))
], T);
function fn() {
  return {
    id: "d",
    tableSource: {},
    drawings: {},
    drawingsOrder: [],
    headers: {},
    footers: {},
    body: {
      dataStream: `荷塘月色\r\r作者：朱自清\r\r这几天心里颇不宁静。今晚在院子里坐着乘凉，忽然想起日日走过的荷塘，在这满月的光里，总该另有一番样子吧。月亮渐渐地升高了，墙外马路上孩子们的欢笑，已经听不见了；妻在屋里拍着闰儿，迷迷糊糊地哼着眠歌。我悄悄地披了大衫，带上门出去。\r\r沿着荷塘，是一条曲折的小煤屑路。这是一条幽僻的路；白天也少人走，夜晚更加寂寞。荷塘四面，长着许多树，蓊蓊郁郁的。路图片一片是些杨柳，和一些不知道名字的树。没有月光的晚上，这路上阴森森的，有些怕人。今晚却很好，虽然月光也还是淡淡的。\r\r路上只我一个人，背着手踱着。这一片天地好像是我的；我也像超出了平常的自己，到了另一个世界里。我爱热闹，也爱冷静；爱群居，也爱独处。像今晚上，一个人在这苍茫的月下，什么都可以想，什么都可以不想，便觉是个自由的人。白天里一定要做的事，一定要说的话是现在都可不理。这是独处的妙处，我且受用这无边的荷香月色好了。\r\r曲曲折折的荷塘上面，弥望的是田田的叶子。叶子出水很高，像亭亭的舞女的裙。层层的叶子中间，零星地点缀着些白花，有袅娜地开着的，有羞涩地打着朵儿的；正如一粒粒的明珠，又如碧天里的星星，又如刚出浴的美人。微风过处，送来缕缕清香，仿佛远处高楼上渺茫的歌声似的。这时候叶子与花也有一丝的颤动，像闪电般，霎时传过荷塘的那边去了。叶子本是肩并肩密密地挨着，这便宛然有了一道凝碧的波痕。叶子底下是脉脉的流水，遮住了，不能见一些颜色；而叶子却更见风致了。\r\r月光如流水一般，静静地泻在这一片叶子和花上。薄薄的青雾浮起在荷塘里。叶子和花仿佛在牛乳中洗过一样，又像笼着轻纱的梦。虽然是满月，天上却有一层淡淡的云，所以不能朗照；但我以为这恰是到了好处——酣眠固不可少，小睡也别有风味的。月光是隔了树照过来的，高处丛生的灌木，落下参差的斑驳的黑影，峭楞楞如鬼一般；弯弯的杨柳的稀疏的倩影，却又像是画在荷叶上。塘中的月色并不均匀；但光与影有着和谐的旋律，如梵婀玲上奏着的名曲。\r\r荷塘的四面，远远近近，高高低低都是树，而杨柳最多。这些树将一片荷塘重重围住；只在小路一旁，漏着几段空隙，像是特为月光留下的。树色一例是阴阴的，乍看像一团烟雾；但杨柳的丰姿，便在烟雾里也辨得出。树梢上隐隐约约的是一带远山，只有些大意罢了。树缝里也漏着一两点路灯光，没精打采的，是渴睡人的眼。这时候最热闹的，要数树上的蝉声与水里的蛙声；但热闹是它们的，我什么也没有。\r\r忽然想起采莲的事情来了。采莲是江南的旧俗，似乎很早就有，而六朝时为盛；从诗歌里可以约略知道。采莲的是少年的女子，她们是荡着小船，唱着艳歌去的。采莲人不用说很多，还有看采莲的人。那是一个热闹的季节，也是一个风流的季节。梁元帝《采莲赋》里说得好：\r\r于是妖童女，荡舟心许；鷁首徐回，兼传羽杯；櫂将移而藻挂，船欲动而萍开。尔其纤腰束素，迁延顾步；夏始春余，叶嫩花初，恐沾裳而浅笑，畏倾船而敛裾。\r\r可见当时嬉游的光景了。这真是有趣的事，可惜我们现在早已无福消受了。\r\r于是又记起，《西洲曲》里的句子：\r\r采莲南塘秋，莲花过人头；低头弄莲子，莲子清如水。\r\r今晚若有采莲人，这儿的莲花也算得“过人头”了；只不见一些流水的影子，是不行的。这令我到底惦着江南了。——这样想着，猛一抬头，不觉已是自己的门前；轻轻地推门进去，什么声息也没有，妻已睡熟好久了。\r\r一九二七年七月，北京清华园。\r\r\r\r《荷塘月色》语言朴素典雅，准确生动，贮满诗意，满溢着朱自清的散文语言一贯有朴素的美，不用浓墨重彩，画的是淡墨水彩。\r\r朱自清先生一笔写景一笔说情，看起来松散不知所云，可仔细体会下，就能感受到先生在字里行间表述出的苦闷，而随之读者也被先生的文字所感染，被带进了他当时那苦闷而无法明喻的心情。这就是优异散文的必须品质之一。\r\r扩展资料：\r一首长诗《毁灭》奠定了朱自清在文坛新诗人的地位，而《桨声灯影里的秦淮河》则被公认为白话美文的典范。朱自清用白话美文向复古派宣战，有力地回击了复古派“白话不能作美文”之说，他是“五四”新文学运动的开拓者之一。\r\r朱自清的美文影响了一代又一代人。作家贾平凹说：来到扬州，第一个想到的人是朱自清，他是知识分子中最最了不起的人物。\r\r实际上，朱自清的写作路程是非常曲折的，他早期的时候大多数作品都是诗歌，但是他的诗歌和我国古代诗人的诗有很大区别，他的诗是用白话文写的，这其实也是他写作的惯用风格。\r\r后来，朱自清开始写一些关于社会的文章，因为那个时候社会比较混乱，这时候的作品大多抨击社会的黑暗面，文体风格大多硬朗，基调伉俪。到了后期，大多是写关于山水的文章，这类文章的写作格调大多以清丽雅致为主。\r\r朱自清的写作风格虽然在不同的时期随着他的人生阅历和社会形态的不同而发生着变化，但是他文章的主基调是没有变的，他这一生，所写的所有文章风格上都有一个非常显著的特点，那就是简约平淡，他不是类似古代花间词派的诗人们，不管是他的诗词还是他的文章从来都不用过于华丽的辞藻，他崇尚的是平淡。\r\r英国友人戴立克试过英译朱自清几篇散文，译完一读显得单薄，远远不如原文流利。他不服气，改用稍微古奥的英文重译，好多了：“那是说，朱先生外圆内方，文字尽管浅白，心思却很深沉，译笔只好朝深处经营。”朱自清的很多文章，譬如《背影》《祭亡妇》，读来自有一番只可意会不可言传的东西。\r\r平淡就是朱自清的写作风格。他不是豪放派的作家，他在创作的时候钟情于清新的风格，给人耳目一新的感觉。在他的文章中包含了他对生活的向往，由此可见他的写作风格和他待人处事的态度也是有几分相似的。他的文章非常优美，但又不会让人觉得狭隘，给人一种豁达渊博的感觉，这就是朱自清的写作风格，更是朱自清的为人品质。\r\r写有《荷塘月色》《背影》等名篇的著名散文家朱自清先生，不仅自己一生风骨正气，还用无形的家风涵养子孙。良好的家风家规意蕴深远，催人向善，是凝聚情感、涵养德行、砥砺成才的人生信条。“北有朱自清，南有朱物华，一文一武，一南一北，双星闪耀”，这是中国知识界、教育界对朱家两兄弟的赞誉。\r\r朱自清性格温和，为人和善，对待年轻人平易近人，是个平和的人。他取字“佩弦”，意思要像弓弦那样将自己绷紧，给人的感觉是自我要求高，偶尔有呆气。朱自清教学负责，对学生要求严格，修他的课的学生都受益不少。\r\r1948 年 6 月，患胃病多年的朱自清，在《抗议美国扶日政策并拒绝领取美援面粉宣言》上，一丝不苟地签下了自己的名字。随后，朱自清还将面粉配购证以及面粉票退了回去。1948 年 8 月 12 日，朱自清因不堪胃病折磨，离开人世。在新的时代即将到来时，朱自清却匆匆地离人们远去。他为人们留下了无数经典的诗歌和文字，还有永不屈服的精神。\r\r朱自清没有豪言壮语，他只是用坚定的行动、朴实的语言，向世人展示了中国知识分子在祖国危难之际坚定的革命性，体现了中国人的骨气，表现了无比高贵的民族气节，呈现了人生最有价值的一面，谱就了生命中最华丽的乐章。\r\r他以“自清”为名，自勉在困境中不丧志；他身患重病，至死拒领美援面粉，其气节令世人感佩；他的《背影》《荷塘月色》《匆匆》脍炙人口；他的文字追求“真”，没有半点矫饰，却蕴藏着动人心弦的力量。\r\r朱自清不但在文学创作方面有很高的造诣，也是一名革命民主主义战士，在反饥饿、反内战的斗争中，他始终保持着一个正直的爱国知识分子的气节和情操。毛泽东对朱自清宁肯饿死不领美国“救济粉”的精神给予称赞，赞扬他“表现了我们民族的英雄气概”。\r
`,
      textRuns: [
        {
          st: 0,
          ed: 4,
          ts: {
            fs: 20,
            ff: "Microsoft YaHei",
            cl: {
              rgb: "rgb(255, 255, 255)"
            },
            bl: I.TRUE,
            bg: {
              rgb: "#FF6670"
            },
            it: I.TRUE
          }
        },
        {
          st: 6,
          ed: 9,
          ts: {
            fs: 16,
            ff: "Microsoft YaHei",
            cl: {
              rgb: "rgb(30, 30, 30)"
            },
            bl: I.FALSE
          }
        },
        {
          st: 9,
          ed: 12,
          ts: {
            fs: 16,
            ff: "Microsoft YaHei",
            cl: {
              rgb: "rgb(30, 30, 30)"
            },
            bl: I.TRUE
          }
        },
        {
          st: 14,
          ed: 3064,
          ts: {
            fs: 12,
            ff: "Microsoft YaHei",
            cl: {
              rgb: "rgb(30, 30, 30)"
            },
            bl: I.FALSE
          }
        }
      ],
      paragraphs: [
        {
          startIndex: 4,
          paragraphStyle: {
            spaceAbove: { v: 0 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 5,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 12,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 13,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 127,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
            // hanging: 20,
            // indentStart: 50,
            // indentEnd: 50,
            // indentFirstLine: 50,
          }
        },
        {
          startIndex: 128,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 244,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 245,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 398,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 399,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 618,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 619,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 824,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 825,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1007,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1008,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1130,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1131,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1203,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1204,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1238,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1239,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1256,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1257,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1282,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1283,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1380,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1381,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1396,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1397,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1398,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1399,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1457,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1458,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1559,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1560,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1566,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1670,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1671,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1728,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1729,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1811,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1812,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1912,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 1913,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 2053,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 2054,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 2190,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 2191,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 2341,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 2342,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 2481,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 2482,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 2582,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 2583,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 2750,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 2751,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 2853,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 2854,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 2948,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 2949,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        },
        {
          startIndex: 3065,
          paragraphStyle: {
            spaceAbove: { v: 10 },
            lineSpacing: 2,
            spaceBelow: { v: 0 }
          }
        }
      ],
      sectionBreaks: [
        {
          startIndex: 3066
          // columnProperties: [
          //     {
          //         width: ptToPixel(240),
          //         paddingEnd: ptToPixel(15),
          //     },
          // ],
          // columnSeparatorType: ColumnSeparatorType.NONE,
          // sectionType: SectionType.SECTION_TYPE_UNSPECIFIED,
          // textDirection: textDirectionDocument,
          // contentDirection: textDirection!,
        }
      ],
      customBlocks: [],
      tables: []
    },
    documentStyle: {
      pageSize: {
        width: w(595),
        height: w(842)
      },
      documentFlavor: je.TRADITIONAL,
      marginTop: w(50),
      marginBottom: w(50),
      marginRight: w(50),
      marginLeft: w(50),
      renderConfig: {
        vertexAngle: 0,
        centerAngle: 0
      },
      defaultHeaderId: "",
      defaultFooterId: "",
      evenPageHeaderId: "",
      evenPageFooterId: "",
      firstPageHeaderId: "",
      firstPageFooterId: "",
      evenAndOddHeaders: I.FALSE,
      useFirstPageHeaderFooter: I.FALSE,
      marginHeader: 30,
      marginFooter: 30
    }
  };
}
function oe() {
  return {
    id: "test",
    appVersion: "3.0.0-alpha",
    sheets: {
      sheet1: {
        id: "sheet1",
        name: "sheet1",
        cellData: {
          0: {
            3: {
              f: "=SUM(A1)",
              si: "3e4r5t"
            }
          },
          1: {
            3: {
              f: "=SUM(A2)",
              si: "OSPtzm"
            }
          },
          2: {
            3: {
              si: "OSPtzm"
            }
          },
          3: {
            3: {
              si: "OSPtzm"
            }
          }
        },
        rowCount: 100,
        columnCount: 100
      }
    },
    locale: h.ZH_CN,
    name: "",
    sheetOrder: [],
    styles: {},
    resources: []
  };
}
var bn = Object.getOwnPropertyDescriptor, yn = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? bn(t, r) : t, i = e.length - 1, o; i >= 0; i--)
    (o = e[i]) && (n = o(n) || n);
  return n;
}, le = (e, t) => (r, a) => t(r, a, e);
const C = 5e3, ce = 5e3;
let k = class extends q {
  constructor(e, t) {
    super(), this._univerInstanceService = e, this._themeService = t, this._initPlugin();
  }
  dispose() {
    window.E2EControllerAPI = void 0;
  }
  _initPlugin() {
    window.E2EControllerAPI = {
      loadAndRelease: (e, t, r) => this._loadAndRelease(e, t, r),
      loadDefaultSheet: (e) => this._loadDefaultSheet(e),
      loadDemoSheet: () => this._loadDemoSheet(),
      loadMergeCellSheet: () => this._loadMergeCellSheet(2e3),
      loadDefaultStyleSheet: (e) => this._loadDefaultStyleSheet(e),
      disposeCurrSheetUnit: (e) => this._disposeDefaultSheetUnit(e),
      setDarkMode: (e) => this._setDarkMode(e),
      loadDefaultDoc: (e) => this._loadDefaultDoc(e),
      disposeUniver: () => this._disposeUniver()
    };
  }
  _setDarkMode(e) {
    this._themeService.setDarkMode(e);
  }
  async _loadAndRelease(e, t = C, r = ce) {
    const a = `e2e${e}`, n = oe();
    n.id = a, this._univerInstanceService.createUnit(A.UNIVER_SHEET, n), await b(t), this._univerInstanceService.disposeUnit(a), await b(r);
  }
  async _loadDefaultSheet(e = C) {
    this._univerInstanceService.createUnit(A.UNIVER_SHEET, oe()), await b(e);
  }
  async _loadDemoSheet() {
    this._univerInstanceService.createUnit(A.UNIVER_SHEET, ne), await b(C);
  }
  /**
   * sheet-003 in default data
   */
  async _loadMergeCellSheet(e = C) {
    const t = { ...ne };
    t.sheetOrder = ["sheet-0003"], this._univerInstanceService.createUnit(A.UNIVER_SHEET, t), await b(e);
  }
  async _loadDefaultStyleSheet(e = C) {
    const t = { ...xt };
    this._univerInstanceService.createUnit(A.UNIVER_SHEET, t), await b(e);
  }
  async _loadDefaultDoc(e = C) {
    this._univerInstanceService.createUnit(A.UNIVER_DOC, fn()), await b(e);
  }
  async _disposeUniver() {
    var e;
    (e = window.univer) == null || e.dispose(), window.univer = void 0, window.univerAPI = void 0;
  }
  async _disposeDefaultSheetUnit(e = ce) {
    const t = this._univerInstanceService.getCurrentUnitForType(A.UNIVER_SHEET), r = t == null ? void 0 : t.getUnitId();
    await this._univerInstanceService.disposeUnit(r || ""), await b(e);
  }
};
k = yn([
  le(0, f),
  le(1, x(G))
], k);
var In = Object.getOwnPropertyDescriptor, xn = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? In(t, r) : t, i = e.length - 1, o; i >= 0; i--)
    (o = e[i]) && (n = o(n) || n);
  return n;
}, P = (e, t) => (r, a) => t(r, a, e);
let R = class extends ze {
  constructor(t, r, a) {
    super();
    _(this, "_containerElement");
    _(this, "_currentUnitSub");
    this._instanceService = r, this._renderManagerService = a, t.subscribeWithPrevious().pipe(
      ut((n) => n === Ke.Rendered),
      gt(1)
    ).subscribe(() => this._listenDocumentTypeChange());
  }
  dispose() {
    super.dispose(), this._disposeCurrentObserver();
  }
  _disposeCurrentObserver() {
    var t;
    (t = this._currentUnitSub) == null || t.unsubscribe(), this._currentUnitSub = null;
  }
  _listenDocumentTypeChange() {
    this._instanceService.focused$.pipe(At(this.dispose$), ht()).subscribe((t) => {
      this._disposeCurrentObserver(), t && this._listenToRenderer(t);
    });
  }
  _listenToRenderer(t) {
    const r = this._renderManagerService.getRenderById(t);
    if (r) {
      const { engine: a } = r;
      this._currentUnitSub = a.endFrame$.subscribe(() => {
        this._containerElement ? this._containerElement.textContent = `FPS: ${Math.round(a.getFps()).toString()}` : this._containerElement = document.querySelector("[data-u-comp=debugger-fps]");
      });
    }
  }
};
R = xn([
  P(0, x(Ve)),
  P(1, f),
  P(2, bt)
], R);
var wn = Object.getOwnPropertyDescriptor, Cn = (e, t, r, a) => {
  for (var n = a > 1 ? void 0 : a ? wn(t, r) : t, i = e.length - 1, o; i >= 0; i--)
    (o = e[i]) && (n = o(n) || n);
  return n;
}, de = (e, t) => (r, a) => t(r, a, e), W;
let pe = (W = class extends Ge {
  constructor(t = re, r, a) {
    super();
    _(this, "_debuggerController");
    this._config = t, this._injector = r, this._configService = a;
    const { menu: n, ...i } = qe(
      {},
      re,
      this._config
    );
    n && this._configService.setConfig("menu", n, { merge: !0 }), this._configService.setConfig(Y, i);
  }
  onStarting() {
    var r;
    const t = [
      [T],
      [k],
      [D]
    ];
    ((r = this._config.performanceMonitor) == null ? void 0 : r.enabled) !== !1 && t.push([R]), Ze(this._injector, t), F(this._injector, [
      [k]
    ]);
  }
  onReady() {
    F(this._injector, [
      [T]
    ]);
  }
  onRendered() {
    F(this._injector, [
      [R],
      [D]
    ]);
  }
  getDebuggerController() {
    return this._debuggerController = this._injector.get(T), this._debuggerController;
  }
}, _(W, "pluginName", "UNIVER_DEBUGGER_PLUGIN"), W);
pe = Cn([
  de(1, x(ge)),
  de(2, Z)
], pe);
export {
  pe as UniverDebuggerPlugin
};
