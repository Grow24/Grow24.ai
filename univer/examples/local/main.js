import "./chunk-222VPS6G.js";
import {
  ThemeSwitcherService,
  render,
  require_jsx_runtime
} from "./chunk-CSPB4B6P.js";
import "./chunk-I5MCYWYL.js";
import "./chunk-OJWCZZ56.js";
import {
  default_default
} from "./chunk-ZRYQFDHJ.js";
import {
  __toESM
} from "./chunk-NSSCU2QI.js";

// ../package.json
var package_default = {
  name: "univer",
  type: "module",
  version: "0.12.4",
  private: true,
  packageManager: "pnpm@10.24.0",
  author: "DreamNum Co., Ltd. <developer@univer.ai>",
  license: "Apache-2.0",
  funding: {
    type: "opencollective",
    url: "https://opencollective.com/univer"
  },
  homepage: "https://univer.ai",
  repository: {
    type: "git",
    url: "https://github.com/dream-num/univer"
  },
  bugs: {
    url: "https://github.com/dream-num/univer/issues"
  },
  engines: {
    node: ">=20",
    pnpm: ">=10"
  },
  scripts: {
    prepare: "husky",
    "pre-commit": "lint-staged",
    dev: "pnpm --filter univer-examples dev:demo -- --host 0.0.0.0",
    "dev:libs": "pnpm --filter univer-examples dev:demo-libs",
    "dev:e2e": "pnpm --filter univer-examples dev:e2e",
    "use:react16": "tsx ./scripts/react-version-manager.ts --react=16",
    "use:react19": "tsx ./scripts/react-version-manager.ts --react=19",
    typecheck: "turbo typecheck",
    test: "turbo test -- --passWithNoTests",
    coverage: "turbo coverage -- --passWithNoTests",
    build: "turbo build --concurrency=30% --filter=!./common/*",
    "build:ci": "turbo build --concurrency=100% --filter=!./common/*",
    "build:demo": "pnpm --filter univer-examples build:demo",
    "build:e2e": "pnpm --filter univer-examples build:e2e",
    "serve:e2e": "serve ./examples/local",
    "test:e2e": "playwright test",
    lint: "eslint .",
    "storybook:dev": "pnpm --filter @univerjs/storybook dev:storybook",
    "storybook:build": "pnpm --filter @univerjs/storybook build:storybook",
    release: "release-it"
  },
  devDependencies: {
    "@antfu/eslint-config": "^6.3.0",
    "@commitlint/cli": "^20.1.0",
    "@commitlint/config-conventional": "^20.0.0",
    "@eslint-react/eslint-plugin": "^2.3.12",
    "@playwright/test": "^1.57.0",
    "@release-it-plugins/workspaces": "^5.0.3",
    "@release-it/conventional-changelog": "^10.0.2",
    "@types/fs-extra": "^11.0.4",
    "@types/node": "^24.10.1",
    "@types/react": "19.2.7",
    "@types/react-dom": "19.2.3",
    "@univerjs-infra/shared": "workspace:*",
    "@univerjs/design": "workspace:*",
    "@vitejs/plugin-react": "^5.1.1",
    eslint: "9.39.1",
    "eslint-plugin-format": "^1.0.2",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "fs-extra": "^11.3.2",
    husky: "^9.1.7",
    "lint-staged": "^16.2.7",
    "posthog-node": "^5.15.0",
    react: "19.2.0",
    "react-dom": "19.2.0",
    "release-it": "^19.0.6",
    serve: "^14.2.5",
    tailwindcss: "3.4.18",
    tsx: "^4.21.0",
    turbo: "^2.6.1",
    typescript: "^5.9.3",
    vitest: "^4.0.15"
  },
  pnpm: {
    onlyBuiltDependencies: [
      "esbuild"
    ]
  },
  resolutions: {
    "@types/react": "19.2.7",
    "@types/react-dom": "19.2.3",
    react: "19.2.0",
    "react-dom": "19.2.0"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
};

// src/main.tsx
var import_jsx_runtime = __toESM(require_jsx_runtime());
if (false) {
  console.table({
    // eslint-disable-next-line node/prefer-global/process
    NODE_ENV: "development",
    // eslint-disable-next-line node/prefer-global/process
    GIT_COMMIT_HASH: process.env.GIT_COMMIT_HASH,
    // eslint-disable-next-line node/prefer-global/process
    GIT_REF_NAME: process.env.GIT_REF_NAME,
    // eslint-disable-next-line node/prefer-global/process
    BUILD_TIME: process.env.BUILD_TIME
  });
}
function Examples() {
  new ThemeSwitcherService().injectThemeToHead(default_default);
  const demos = [{
    title: "\u{1F4CA} Sheets",
    href: "./sheets/"
  }, {
    title: "\u{1F4DD} Docs",
    href: "./docs/"
  }, {
    title: "\u{1F4FD}\uFE0F Slides",
    href: "./slides/"
  }, {
    title: "\u{1F5C2}\uFE0F Sheets No Worker",
    href: "./sheets-no-worker/"
  }, {
    title: "\u{1F5C2}\uFE0F Sheets Multi Instance",
    href: "./sheets-multi/"
  }, {
    title: "\u{1F5C2}\uFE0F Sheets With Webcomponent",
    href: "./sheets-webcomponent/"
  }, {
    title: "\u{1F3E1} Sheets Multi Units",
    href: "./sheets-multi-units/"
  }, {
    title: "\u{1F4C4} Sheets Uniscript",
    href: "./sheets-uniscript/"
  }, {
    title: "\u{1F4DA} Docs Uniscript",
    href: "./docs-uniscript/"
  }, {
    title: "\u{1F30C} Uni Mode",
    href: "./uni/"
  }, {
    title: "\u{1F4F1} Mobile",
    href: "./mobile-s/"
  }];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "section",
    {
      className: "univer-flex univer-h-full univer-flex-col univer-items-center univer-justify-center univer-gap-6",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "univer-flex univer-items-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { className: "univer-w-24", src: "/favicon.svg", alt: "Univer", draggable: false }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { className: "univer-text-slate-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "span",
              {
                className: `univer-bg-[linear-gradient(121deg,#0048ff_18.89%,#0c81ed_39.58%,#029dce_59.87%,#00bbb0_74.37%,#00c5a8_79.64%)] univer-bg-clip-text univer-text-4xl univer-text-transparent`,
                children: "Univer"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "sup",
              {
                className: `univer-relative -univer-top-1 univer-left-2 univer-rounded-xl univer-border univer-border-solid univer-border-current univer-px-2 univer-py-0.5 univer-text-xs`,
                children: package_default.version
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { className: "univer-container univer-flex univer-flex-wrap univer-justify-center univer-gap-6", children: demos.map((demo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "a",
          {
            className: `univer-rounded-lg univer-bg-primary-500 univer-px-6 univer-py-2.5 univer-font-medium univer-text-white univer-no-underline univer-shadow-sm univer-transition-all univer-duration-300 univer-ease-in-out hover:univer-scale-105 hover:univer-bg-emerald-500`,
            href: demo.href,
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: demo.title })
          },
          demo.title
        )) })
      ]
    }
  );
}
render(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Examples, {}), document.getElementById("app"));
//# sourceMappingURL=main.js.map
