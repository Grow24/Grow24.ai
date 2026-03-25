// vite.config.ts
import { defineConfig } from "file:///home/bappu/websitenew/web/node_modules/vite/dist/node/index.js";
import react from "file:///home/bappu/websitenew/web/node_modules/@vitejs/plugin-react/dist/index.js";
import { TanStackRouterVite } from "file:///home/bappu/websitenew/web/node_modules/@tanstack/router-plugin/dist/esm/vite.js";
import { resolve } from "path";

// vite-404-plugin.ts
var VALID_PATHS = [
  "/",
  "/about",
  "/become-partner",
  "/dashboard",
  "/echarts",
  "/survey",
  "/library",
  "/privacy-policy",
  "/value-definition",
  "/what-we-offer"
];
var VALID_PREFIX = "/solutions/";
var BODY_404 = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>404 Not Found</title>
</head>
<body>
  <h1>Not Found</h1>
  <p>The requested URL was not found on this server.<br>
  Additionally, a 404 Not Found error was encountered while trying to use an ErrorDocument to handle the request.</p>
</body>
</html>`;
function isDefinedRoute(pathname) {
  const path = pathname.replace(/\?.*$/, "").replace(/#.*$/, "").trim().replace(/\/$/, "") || "/";
  if (VALID_PATHS.includes(path)) return true;
  if (path.startsWith(VALID_PREFIX)) return true;
  return false;
}
function vite404Plugin() {
  return {
    name: "vite-404-undefined-routes",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? "/";
        const pathname = url.split("?")[0];
        if (pathname.includes(".") || pathname.startsWith("/@") || pathname.startsWith("/node_modules") || pathname.startsWith("/api/") || pathname === "/univer" || pathname.startsWith("/univer/") || pathname === "/HBMPONE" || pathname.startsWith("/HBMPONE/") || pathname === "/HBMP_DOCS_PLATFORM" || pathname.startsWith("/HBMP_DOCS_PLATFORM/") || pathname === "/ivvychainv2" || pathname.startsWith("/ivvychainv2/") || pathname === "/Microsoft" || pathname.startsWith("/Microsoft/") || pathname === "/OpenStreetMaps" || pathname.startsWith("/OpenStreetMaps/") || pathname === "/ImageProcessing" || pathname.startsWith("/ImageProcessing/")) {
          return next();
        }
        if (!isDefinedRoute(pathname)) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(BODY_404);
          return;
        }
        next();
      });
    }
  };
}

// vite.config.ts
var __vite_injected_original_dirname = "/home/bappu/websitenew/web";
var vite_config_default = defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    // Child apps are served by their own dev servers and proxied by this root server.
    // Ignore those trees to avoid Linux inotify exhaustion (ENOSPC).
    watch: {
      ignored: [
        "**/univer/**",
        "**/HBMPONE/**",
        "**/HBMP_DOCS_PLATFORM/**",
        "**/ivvychainv2/**",
        "**/mcp_server/**",
        "**/Microsoft/**",
        "**/OpenStreetMaps/**",
        "**/ImageProcessing/**",
        "**/dist/**",
        "**/backend/**"
      ]
    },
    proxy: {
      // More specific than `/api` → HBMP backend
      "/api/send-email": {
        target: "http://localhost:3000",
        changeOrigin: true
      },
      // HBMPONE client (Vite) — keep /HBMPONE prefix; client uses base: /HBMPONE/
      "/HBMPONE": {
        target: `http://localhost:${process.env.HBMPONE_PORT || "5175"}`,
        changeOrigin: true,
        ws: true
      },
      "/HBMP_DOCS_PLATFORM": {
        target: `http://localhost:${process.env.HBMP_DOCS_PORT || "5177"}`,
        changeOrigin: true,
        ws: true
      },
      // ivvychainv2 (CRA dev server) — keep /ivvychainv2 prefix
      "/ivvychainv2": {
        target: `http://localhost:${process.env.IVVY_PORT || "5176"}`,
        changeOrigin: true,
        ws: true
      },
      // Microsoft Graph app (Express) — keep /Microsoft prefix
      "/Microsoft": {
        target: `http://localhost:${process.env.MICROSOFT_PORT || "5180"}`,
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/Microsoft/, "") || "/"
      },
      // OpenStreetMaps static app — strip /OpenStreetMaps prefix
      "/OpenStreetMaps": {
        target: `http://localhost:${process.env.OSM_PORT || "5181"}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/OpenStreetMaps/, "") || "/"
      },
      // ImageProcessing static app — strip /ImageProcessing prefix
      "/ImageProcessing": {
        target: `http://localhost:${process.env.IMAGE_PROCESSING_PORT || "5182"}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ImageProcessing/, "") || "/"
      },
      // HBMP docs API (Express on 4000 by default)
      "/api": {
        target: `http://localhost:${process.env.HBMP_API_PORT || "4000"}`,
        changeOrigin: true
      },
      "/univer": {
        target: `http://localhost:${process.env.UNIVER_PORT || "3002"}`,
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/univer/, "")
      }
    }
  },
  plugins: [
    vite404Plugin(),
    {
      name: "subapp-index-redirect",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || "";
          if (url === "/OpenStreetMaps" || url === "/OpenStreetMaps/") {
            res.statusCode = 302;
            res.setHeader("Location", "/OpenStreetMaps/index.html");
            res.end();
            return;
          }
          if (url === "/Microsoft" || url === "/Microsoft/") {
            res.statusCode = 302;
            res.setHeader("Location", "/Microsoft/index.html");
            res.end();
            return;
          }
          if (url === "/ImageProcessing" || url === "/ImageProcessing/") {
            res.statusCode = 302;
            res.setHeader("Location", "/ImageProcessing/index.html");
            res.end();
            return;
          }
          next();
        });
      }
    },
    TanStackRouterVite(),
    react({
      // Ensure React is properly handled
      jsxRuntime: "automatic"
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "./src"),
      "@components": resolve(__vite_injected_original_dirname, "./src/components"),
      "@routes": resolve(__vite_injected_original_dirname, "./src/routes"),
      "@lib": resolve(__vite_injected_original_dirname, "./src/lib")
    },
    dedupe: ["react", "react-dom"]
  },
  build: {
    target: "ES2022",
    minify: "terser",
    sourcemap: false,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("three") || id.includes("@react-three")) {
              return "three";
            }
            if (id.includes("@tanstack")) {
              return "tanstack";
            }
          }
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAidml0ZS00MDQtcGx1Z2luLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvYmFwcHUvd2Vic2l0ZW5ldy93ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2JhcHB1L3dlYnNpdGVuZXcvd2ViL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2JhcHB1L3dlYnNpdGVuZXcvd2ViL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCB7IFRhblN0YWNrUm91dGVyVml0ZSB9IGZyb20gJ0B0YW5zdGFjay9yb3V0ZXItcGx1Z2luL3ZpdGUnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IHZpdGU0MDRQbHVnaW4gfSBmcm9tICcuL3ZpdGUtNDA0LXBsdWdpbidcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogJzAuMC4wLjAnLFxuICAgIHBvcnQ6IDUxNzMsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAvLyBDaGlsZCBhcHBzIGFyZSBzZXJ2ZWQgYnkgdGhlaXIgb3duIGRldiBzZXJ2ZXJzIGFuZCBwcm94aWVkIGJ5IHRoaXMgcm9vdCBzZXJ2ZXIuXG4gICAgLy8gSWdub3JlIHRob3NlIHRyZWVzIHRvIGF2b2lkIExpbnV4IGlub3RpZnkgZXhoYXVzdGlvbiAoRU5PU1BDKS5cbiAgICB3YXRjaDoge1xuICAgICAgaWdub3JlZDogW1xuICAgICAgICAnKiovdW5pdmVyLyoqJyxcbiAgICAgICAgJyoqL0hCTVBPTkUvKionLFxuICAgICAgICAnKiovSEJNUF9ET0NTX1BMQVRGT1JNLyoqJyxcbiAgICAgICAgJyoqL2l2dnljaGFpbnYyLyoqJyxcbiAgICAgICAgJyoqL21jcF9zZXJ2ZXIvKionLFxuICAgICAgICAnKiovTWljcm9zb2Z0LyoqJyxcbiAgICAgICAgJyoqL09wZW5TdHJlZXRNYXBzLyoqJyxcbiAgICAgICAgJyoqL0ltYWdlUHJvY2Vzc2luZy8qKicsXG4gICAgICAgICcqKi9kaXN0LyoqJyxcbiAgICAgICAgJyoqL2JhY2tlbmQvKionLFxuICAgICAgXSxcbiAgICB9LFxuICAgIHByb3h5OiB7XG4gICAgICAvLyBNb3JlIHNwZWNpZmljIHRoYW4gYC9hcGlgIFx1MjE5MiBIQk1QIGJhY2tlbmRcbiAgICAgICcvYXBpL3NlbmQtZW1haWwnOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICAvLyBIQk1QT05FIGNsaWVudCAoVml0ZSkgXHUyMDE0IGtlZXAgL0hCTVBPTkUgcHJlZml4OyBjbGllbnQgdXNlcyBiYXNlOiAvSEJNUE9ORS9cbiAgICAgICcvSEJNUE9ORSc6IHtcbiAgICAgICAgdGFyZ2V0OiBgaHR0cDovL2xvY2FsaG9zdDoke3Byb2Nlc3MuZW52LkhCTVBPTkVfUE9SVCB8fCAnNTE3NSd9YCxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICB3czogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICAnL0hCTVBfRE9DU19QTEFURk9STSc6IHtcbiAgICAgICAgdGFyZ2V0OiBgaHR0cDovL2xvY2FsaG9zdDoke3Byb2Nlc3MuZW52LkhCTVBfRE9DU19QT1JUIHx8ICc1MTc3J31gLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHdzOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIC8vIGl2dnljaGFpbnYyIChDUkEgZGV2IHNlcnZlcikgXHUyMDE0IGtlZXAgL2l2dnljaGFpbnYyIHByZWZpeFxuICAgICAgJy9pdnZ5Y2hhaW52Mic6IHtcbiAgICAgICAgdGFyZ2V0OiBgaHR0cDovL2xvY2FsaG9zdDoke3Byb2Nlc3MuZW52LklWVllfUE9SVCB8fCAnNTE3Nid9YCxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICB3czogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICAvLyBNaWNyb3NvZnQgR3JhcGggYXBwIChFeHByZXNzKSBcdTIwMTQga2VlcCAvTWljcm9zb2Z0IHByZWZpeFxuICAgICAgJy9NaWNyb3NvZnQnOiB7XG4gICAgICAgIHRhcmdldDogYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwcm9jZXNzLmVudi5NSUNST1NPRlRfUE9SVCB8fCAnNTE4MCd9YCxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICB3czogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL01pY3Jvc29mdC8sICcnKSB8fCAnLycsXG4gICAgICB9LFxuICAgICAgLy8gT3BlblN0cmVldE1hcHMgc3RhdGljIGFwcCBcdTIwMTQgc3RyaXAgL09wZW5TdHJlZXRNYXBzIHByZWZpeFxuICAgICAgJy9PcGVuU3RyZWV0TWFwcyc6IHtcbiAgICAgICAgdGFyZ2V0OiBgaHR0cDovL2xvY2FsaG9zdDoke3Byb2Nlc3MuZW52Lk9TTV9QT1JUIHx8ICc1MTgxJ31gLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9PcGVuU3RyZWV0TWFwcy8sICcnKSB8fCAnLycsXG4gICAgICB9LFxuICAgICAgLy8gSW1hZ2VQcm9jZXNzaW5nIHN0YXRpYyBhcHAgXHUyMDE0IHN0cmlwIC9JbWFnZVByb2Nlc3NpbmcgcHJlZml4XG4gICAgICAnL0ltYWdlUHJvY2Vzc2luZyc6IHtcbiAgICAgICAgdGFyZ2V0OiBgaHR0cDovL2xvY2FsaG9zdDoke3Byb2Nlc3MuZW52LklNQUdFX1BST0NFU1NJTkdfUE9SVCB8fCAnNTE4Mid9YCxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvSW1hZ2VQcm9jZXNzaW5nLywgJycpIHx8ICcvJyxcbiAgICAgIH0sXG4gICAgICAvLyBIQk1QIGRvY3MgQVBJIChFeHByZXNzIG9uIDQwMDAgYnkgZGVmYXVsdClcbiAgICAgICcvYXBpJzoge1xuICAgICAgICB0YXJnZXQ6IGBodHRwOi8vbG9jYWxob3N0OiR7cHJvY2Vzcy5lbnYuSEJNUF9BUElfUE9SVCB8fCAnNDAwMCd9YCxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgfSxcbiAgICAgICcvdW5pdmVyJzoge1xuICAgICAgICB0YXJnZXQ6IGBodHRwOi8vbG9jYWxob3N0OiR7cHJvY2Vzcy5lbnYuVU5JVkVSX1BPUlQgfHwgJzMwMDInfWAsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgd3M6IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC91bml2ZXIvLCAnJyksXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICB2aXRlNDA0UGx1Z2luKCksXG4gICAge1xuICAgICAgbmFtZTogJ3N1YmFwcC1pbmRleC1yZWRpcmVjdCcsXG4gICAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgICAgY29uc3QgdXJsID0gcmVxLnVybCB8fCAnJ1xuICAgICAgICAgIGlmICh1cmwgPT09ICcvT3BlblN0cmVldE1hcHMnIHx8IHVybCA9PT0gJy9PcGVuU3RyZWV0TWFwcy8nKSB7XG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDMwMlxuICAgICAgICAgICAgcmVzLnNldEhlYWRlcignTG9jYXRpb24nLCAnL09wZW5TdHJlZXRNYXBzL2luZGV4Lmh0bWwnKVxuICAgICAgICAgICAgcmVzLmVuZCgpXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHVybCA9PT0gJy9NaWNyb3NvZnQnIHx8IHVybCA9PT0gJy9NaWNyb3NvZnQvJykge1xuICAgICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSAzMDJcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0xvY2F0aW9uJywgJy9NaWNyb3NvZnQvaW5kZXguaHRtbCcpXG4gICAgICAgICAgICByZXMuZW5kKClcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodXJsID09PSAnL0ltYWdlUHJvY2Vzc2luZycgfHwgdXJsID09PSAnL0ltYWdlUHJvY2Vzc2luZy8nKSB7XG4gICAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDMwMlxuICAgICAgICAgICAgcmVzLnNldEhlYWRlcignTG9jYXRpb24nLCAnL0ltYWdlUHJvY2Vzc2luZy9pbmRleC5odG1sJylcbiAgICAgICAgICAgIHJlcy5lbmQoKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuICAgICAgICAgIG5leHQoKVxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICB9LFxuICAgIFRhblN0YWNrUm91dGVyVml0ZSgpLFxuICAgIHJlYWN0KHtcbiAgICAgIC8vIEVuc3VyZSBSZWFjdCBpcyBwcm9wZXJseSBoYW5kbGVkXG4gICAgICBqc3hSdW50aW1lOiAnYXV0b21hdGljJyxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICAgICdAY29tcG9uZW50cyc6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29tcG9uZW50cycpLFxuICAgICAgJ0Byb3V0ZXMnOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3JvdXRlcycpLFxuICAgICAgJ0BsaWInOiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2xpYicpLFxuICAgIH0sXG4gICAgZGVkdXBlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICB9LFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ0VTMjAyMicsXG4gICAgbWluaWZ5OiAndGVyc2VyJyxcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIGNvbW1vbmpzT3B0aW9uczoge1xuICAgICAgaW5jbHVkZTogWy9ub2RlX21vZHVsZXMvXSxcbiAgICAgIHRyYW5zZm9ybU1peGVkRXNNb2R1bGVzOiB0cnVlLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczogKGlkKSA9PiB7XG4gICAgICAgICAgLy8gRG9uJ3QgbWFudWFsbHkgY2h1bmsgUmVhY3QgLSBsZXQgVml0ZSBoYW5kbGUgaXQgdG8gYXZvaWQgbG9hZGluZyBpc3N1ZXNcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICAvLyBPbmx5IGNodW5rIGxhcmdlIGxpYnJhcmllcywgbm90IFJlYWN0XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ3RocmVlJykgfHwgaWQuaW5jbHVkZXMoJ0ByZWFjdC10aHJlZScpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAndGhyZWUnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ0B0YW5zdGFjaycpKSB7XG4gICAgICAgICAgICAgIHJldHVybiAndGFuc3RhY2snXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBMZXQgZXZlcnl0aGluZyBlbHNlIGJlIGF1dG8tY2h1bmtlZCBieSBWaXRlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSlcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvYmFwcHUvd2Vic2l0ZW5ldy93ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2JhcHB1L3dlYnNpdGVuZXcvd2ViL3ZpdGUtNDA0LXBsdWdpbi50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9iYXBwdS93ZWJzaXRlbmV3L3dlYi92aXRlLTQwNC1wbHVnaW4udHNcIjsvKipcbiAqIFZpdGUgcGx1Z2luOiByZXR1cm4gcmVhbCBIVFRQIDQwNCBmb3IgcGF0aHMgdGhhdCBhcmUgbm90IGRlZmluZWQgYXBwIHJvdXRlcy5cbiAqIFByZXZlbnRzIHRoZSBTUEEgZnJvbSBsb2FkaW5nIGF0IGFsbCBmb3IgaW52YWxpZCBVUkxzIChlLmcuIC9hYmMpLlxuICovXG5pbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnXG5cbmNvbnN0IFZBTElEX1BBVEhTID0gW1xuICAnLycsXG4gICcvYWJvdXQnLFxuICAnL2JlY29tZS1wYXJ0bmVyJyxcbiAgJy9kYXNoYm9hcmQnLFxuICAnL2VjaGFydHMnLFxuICAnL3N1cnZleScsXG4gICcvbGlicmFyeScsXG4gICcvcHJpdmFjeS1wb2xpY3knLFxuICAnL3ZhbHVlLWRlZmluaXRpb24nLFxuICAnL3doYXQtd2Utb2ZmZXInLFxuXVxuY29uc3QgVkFMSURfUFJFRklYID0gJy9zb2x1dGlvbnMvJyAvLyAvc29sdXRpb25zL292ZXJ2aWV3LCAvc29sdXRpb25zL2FueXRoaW5nXG5cbmNvbnN0IEJPRFlfNDA0ID0gYDwhRE9DVFlQRSBodG1sPlxuPGh0bWw+XG48aGVhZD5cbiAgPG1ldGEgY2hhcnNldD1cInV0Zi04XCI+XG4gIDx0aXRsZT40MDQgTm90IEZvdW5kPC90aXRsZT5cbjwvaGVhZD5cbjxib2R5PlxuICA8aDE+Tm90IEZvdW5kPC9oMT5cbiAgPHA+VGhlIHJlcXVlc3RlZCBVUkwgd2FzIG5vdCBmb3VuZCBvbiB0aGlzIHNlcnZlci48YnI+XG4gIEFkZGl0aW9uYWxseSwgYSA0MDQgTm90IEZvdW5kIGVycm9yIHdhcyBlbmNvdW50ZXJlZCB3aGlsZSB0cnlpbmcgdG8gdXNlIGFuIEVycm9yRG9jdW1lbnQgdG8gaGFuZGxlIHRoZSByZXF1ZXN0LjwvcD5cbjwvYm9keT5cbjwvaHRtbD5gXG5cbmZ1bmN0aW9uIGlzRGVmaW5lZFJvdXRlKHBhdGhuYW1lOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgcGF0aCA9IHBhdGhuYW1lLnJlcGxhY2UoL1xcPy4qJC8sICcnKS5yZXBsYWNlKC8jLiokLywgJycpLnRyaW0oKS5yZXBsYWNlKC9cXC8kLywgJycpIHx8ICcvJ1xuICBpZiAoVkFMSURfUEFUSFMuaW5jbHVkZXMocGF0aCkpIHJldHVybiB0cnVlXG4gIGlmIChwYXRoLnN0YXJ0c1dpdGgoVkFMSURfUFJFRklYKSkgcmV0dXJuIHRydWVcbiAgcmV0dXJuIGZhbHNlXG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2aXRlNDA0UGx1Z2luKCk6IFBsdWdpbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZpdGUtNDA0LXVuZGVmaW5lZC1yb3V0ZXMnLFxuICAgIGFwcGx5OiAnc2VydmUnLFxuICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IHJlcS51cmwgPz8gJy8nXG4gICAgICAgIGNvbnN0IHBhdGhuYW1lID0gdXJsLnNwbGl0KCc/JylbMF1cbiAgICAgICAgLy8gU2tpcCBhc3NldHMsIEFQSSwgYW5kIFZpdGUgaW50ZXJuYWxzXG4gICAgICAgIGlmIChcbiAgICAgICAgICBwYXRobmFtZS5pbmNsdWRlcygnLicpIHx8XG4gICAgICAgICAgcGF0aG5hbWUuc3RhcnRzV2l0aCgnL0AnKSB8fFxuICAgICAgICAgIHBhdGhuYW1lLnN0YXJ0c1dpdGgoJy9ub2RlX21vZHVsZXMnKSB8fFxuICAgICAgICAgIHBhdGhuYW1lLnN0YXJ0c1dpdGgoJy9hcGkvJykgfHxcbiAgICAgICAgICBwYXRobmFtZSA9PT0gJy91bml2ZXInIHx8XG4gICAgICAgICAgcGF0aG5hbWUuc3RhcnRzV2l0aCgnL3VuaXZlci8nKSB8fFxuICAgICAgICAgIHBhdGhuYW1lID09PSAnL0hCTVBPTkUnIHx8XG4gICAgICAgICAgcGF0aG5hbWUuc3RhcnRzV2l0aCgnL0hCTVBPTkUvJykgfHxcbiAgICAgICAgICBwYXRobmFtZSA9PT0gJy9IQk1QX0RPQ1NfUExBVEZPUk0nIHx8XG4gICAgICAgICAgcGF0aG5hbWUuc3RhcnRzV2l0aCgnL0hCTVBfRE9DU19QTEFURk9STS8nKSB8fFxuICAgICAgICAgIHBhdGhuYW1lID09PSAnL2l2dnljaGFpbnYyJyB8fFxuICAgICAgICAgIHBhdGhuYW1lLnN0YXJ0c1dpdGgoJy9pdnZ5Y2hhaW52Mi8nKSB8fFxuICAgICAgICAgIHBhdGhuYW1lID09PSAnL01pY3Jvc29mdCcgfHxcbiAgICAgICAgICBwYXRobmFtZS5zdGFydHNXaXRoKCcvTWljcm9zb2Z0LycpIHx8XG4gICAgICAgICAgcGF0aG5hbWUgPT09ICcvT3BlblN0cmVldE1hcHMnIHx8XG4gICAgICAgICAgcGF0aG5hbWUuc3RhcnRzV2l0aCgnL09wZW5TdHJlZXRNYXBzLycpIHx8XG4gICAgICAgICAgcGF0aG5hbWUgPT09ICcvSW1hZ2VQcm9jZXNzaW5nJyB8fFxuICAgICAgICAgIHBhdGhuYW1lLnN0YXJ0c1dpdGgoJy9JbWFnZVByb2Nlc3NpbmcvJylcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIG5leHQoKVxuICAgICAgICB9XG4gICAgICAgIGlmICghaXNEZWZpbmVkUm91dGUocGF0aG5hbWUpKSB7XG4gICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDRcbiAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAndGV4dC9odG1sOyBjaGFyc2V0PXV0Zi04JylcbiAgICAgICAgICByZXMuZW5kKEJPRFlfNDA0KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIG5leHQoKVxuICAgICAgfSlcbiAgICB9LFxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdRLFNBQVMsb0JBQW9CO0FBQzdSLE9BQU8sV0FBVztBQUNsQixTQUFTLDBCQUEwQjtBQUNuQyxTQUFTLGVBQWU7OztBQ0d4QixJQUFNLGNBQWM7QUFBQSxFQUNsQjtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGO0FBQ0EsSUFBTSxlQUFlO0FBRXJCLElBQU0sV0FBVztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFhakIsU0FBUyxlQUFlLFVBQTJCO0FBQ2pELFFBQU0sT0FBTyxTQUFTLFFBQVEsU0FBUyxFQUFFLEVBQUUsUUFBUSxRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxPQUFPLEVBQUUsS0FBSztBQUM1RixNQUFJLFlBQVksU0FBUyxJQUFJLEVBQUcsUUFBTztBQUN2QyxNQUFJLEtBQUssV0FBVyxZQUFZLEVBQUcsUUFBTztBQUMxQyxTQUFPO0FBQ1Q7QUFFTyxTQUFTLGdCQUF3QjtBQUN0QyxTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxnQkFBZ0IsUUFBUTtBQUN0QixhQUFPLFlBQVksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTO0FBQ3pDLGNBQU0sTUFBTSxJQUFJLE9BQU87QUFDdkIsY0FBTSxXQUFXLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUVqQyxZQUNFLFNBQVMsU0FBUyxHQUFHLEtBQ3JCLFNBQVMsV0FBVyxJQUFJLEtBQ3hCLFNB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
