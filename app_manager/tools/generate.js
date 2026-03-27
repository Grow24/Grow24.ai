#!/usr/bin/env node
import fs from "fs";
import path from "path";

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function write(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, content, "utf8");
  console.log("created", p);
}

function escapeJSX(s) {
  return String(s).replace(/</g, "\\u003c");
}

function renderNodeToJSX(node, idx = 0) {
  const props = node.props || {};
  const style = props.style || {};
  
  // Build inline style object
  const inlineStyle = {};
  if (style.backgroundColor) inlineStyle.backgroundColor = style.backgroundColor;
  if (style.textColor) inlineStyle.color = style.textColor;
  if (style.borderColor) inlineStyle.borderColor = style.borderColor;
  if (style.borderWidth != null) inlineStyle.borderWidth = style.borderWidth + 'px';
  if (style.radius != null) inlineStyle.borderRadius = style.radius + 'px';
  if (style.px != null) { inlineStyle.paddingLeft = style.px + 'px'; inlineStyle.paddingRight = style.px + 'px'; }
  if (style.py != null) { inlineStyle.paddingTop = style.py + 'px'; inlineStyle.paddingBottom = style.py + 'px'; }
  if (style.fontSize != null) inlineStyle.fontSize = style.fontSize + 'px';
  if (style.bold) inlineStyle.fontWeight = '700';
  if (style.italic) inlineStyle.fontStyle = 'italic';
  if (style.shadow) inlineStyle.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
  if (style.width) inlineStyle.width = style.width;
  if (style.left != null) inlineStyle.left = style.left + '%';
  if (style.top != null) inlineStyle.top = style.top + '%';
  if (style.zIndex != null) inlineStyle.zIndex = style.zIndex;
  
  const styleAttr = Object.keys(inlineStyle).length ? ` style={${JSON.stringify(inlineStyle)}}` : "";

  if (node.type === "Text") {
    const align = props.align || style.align || 'left';
    return `<p${styleAttr} style={{...${JSON.stringify(inlineStyle)}, textAlign: '${align}'}}>${escapeJSX(props.text || "")}</p>`;
  }
  
  if (node.type === "Button") {
    const variant = props.variant || 'primary';
    let btnClass = variant === 'primary' ? 'btn-primary' : variant === 'secondary' ? 'btn-secondary' : 'btn-ghost';
    return `<button${styleAttr} className="${btnClass}">${escapeJSX(props.text || "Button")}</button>`;
  }
  
  if (node.type === "Input") {
    const inputType = props.inputType || 'text';
    const label = props.label || '';
    const placeholder = props.placeholder || '';
    const helpText = props.helpText || '';
    return `<div className="input-wrapper"${styleAttr}>
      ${label ? `<label>${escapeJSX(label)}</label>` : ''}
      <input type="${inputType}" placeholder="${escapeJSX(placeholder)}" />
      ${helpText ? `<div className="help-text">${escapeJSX(helpText)}</div>` : ''}
    </div>`;
  }
  
  if (node.type === "Card") {
    const children = (node.children || []).map((c, i) => renderNodeToJSX(c, i)).join("\n");
    return `<div className="card"${styleAttr}>${children || '<p style={{color:"#aaa"}}>Empty card</p>'}</div>`;
  }
  
  if (node.type === "Grid") {
    const columns = props.columns || '1fr 1fr';
    const gap = props.gap || 12;
    const gridStyle = { display: 'grid', gridTemplateColumns: columns, gap: gap + 'px', ...inlineStyle };
    const children = (node.children || []).map((c, i) => renderNodeToJSX(c, i)).join("\n");
    return `<div className="grid" style={${JSON.stringify(gridStyle)}}>${children || '<p style={{color:"#aaa"}}>Empty grid</p>'}</div>`;
  }
  
  if (node.type === "AuthScreen") {
    const title = props.title || 'Sign In';
    const description = props.description || '';
    const showCard = props.showCard !== false;
    const children = (node.children || []).map((c, i) => renderNodeToJSX(c, i)).join("\n");
    const wrapperClass = showCard ? 'auth-card' : 'auth-plain';
    return `<div className="${wrapperClass}"${styleAttr}>
      <h2>${escapeJSX(title)}</h2>
      ${description ? `<p className="auth-description">${escapeJSX(description)}</p>` : ''}
      ${children}
    </div>`;
  }
  
  // root or unknown
  if (node.children && node.children.length) return node.children.map((c, i) => renderNodeToJSX(c, i)).join("\n");
  return `<!-- unknown node ${node.type} -->`;
}

function generateApp(def, outDir) {
  ensureDir(outDir);

  // write package.json
  const pkg = {
    name: def.metadata?.id || "generated-app",
    version: def.metadata?.version || "0.0.0",
    private: true,
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    },
    dependencies: {
      react: "^19.0.0",
      "react-dom": "^19.0.0",
    },
    devDependencies: {
      vite: "^7.0.0",
      "@vitejs/plugin-react": "^5.0.0",
    },
  };
  write(path.join(outDir, "package.json"), JSON.stringify(pkg, null, 2));
  write(path.join(outDir, ".nvmrc"), "20.19.1\n");
  
  // vite.config.js
  write(
    path.join(outDir, "vite.config.js"),
    `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`);

  // index.html with PWA support
  const appName = def.metadata?.name || "Generated App";
  write(
    path.join(outDir, "index.html"),
    `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appName}</title>
    
    <!-- PWA Meta Tags -->
    <meta name="description" content="${def.metadata?.description || 'Built with Low-Code Builder'}" />
    <meta name="theme-color" content="#0f172a" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <link rel="apple-touch-icon" href="/icon.svg" />
    
    <!-- iOS Meta Tags -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="${appName}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
    <script>
      // Register Service Worker for PWA
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('✅ PWA: Service Worker registered'))
            .catch(err => console.log('❌ PWA: Service Worker registration failed', err));
        });
      }
    </script>
  </body>
</html>`
  );

  // src/main.jsx
  write(
    path.join(outDir, "src/main.jsx"),
    `import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')).render(<App />)
`);

  // styles
  write(
    path.join(outDir, "src/styles.css"),
    `body { font-family: Inter, system-ui, sans-serif; padding: 24px; margin: 0; background: #f8fafc; }
.card { border: 1px solid #e5e7eb; padding: 16px; border-radius: 8px; background: #fff; }
.grid { display: grid; }
.auth-card { max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; }
.auth-plain { max-width: 640px; margin: 0 auto; }
.auth-description { color: #64748b; margin-bottom: 16px; }
.btn-primary { background: #0f172a; color: #fff; padding: 10px 16px; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; }
.btn-secondary { background: #fff; color: #0f172a; padding: 10px 16px; border-radius: 8px; border: 1px solid #e5e7eb; cursor: pointer; font-weight: 500; }
.btn-ghost { background: transparent; color: #0f172a; padding: 10px 16px; border: none; cursor: pointer; font-weight: 500; }
.input-wrapper { margin-bottom: 12px; }
.input-wrapper label { display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px; }
.input-wrapper input { width: 100%; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; }
.input-wrapper .help-text { font-size: 12px; color: #64748b; margin-top: 4px; }
`);

  // App.jsx and pages
  const pages = def.pages || [];
  const pageImports = [];
  const pageRoutes = [];

  // For simplicity create a single App that renders first page
  const firstPage = pages[0] || { id: 'p1', name: 'Home', children: def.tree?.children || [] };
  const pageJSX = renderNodeToJSX({ children: firstPage.children || [] });

  write(
    path.join(outDir, "src/App.jsx"),
    `import React from 'react'
export default function App(){
  return (
    <div>
      <h1>${def.metadata?.name ? escapeJSX(def.metadata.name) : "Generated App"}</h1>
      <div>${pageJSX}</div>
    </div>
  )
}
`
  );

  // PWA Manifest
  const manifest = {
    name: appName,
    short_name: appName.substring(0, 12),
    description: def.metadata?.description || "Built with Low-Code Builder",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable"
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      }
    ]
  };
  write(path.join(outDir, "public/manifest.json"), JSON.stringify(manifest, null, 2));

  // Service Worker for offline support
  const serviceWorker = `// Service Worker for PWA
const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Clone the request
        const fetchRequest = event.request.clone();
        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          // Clone the response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
  );
});
`;
  write(path.join(outDir, "public/sw.js"), serviceWorker);

  // Create visible PWA icon as SVG (works better than 1px PNG)
  const appInitial = appName.charAt(0).toUpperCase();
  const iconSVG = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0f172a" rx="64"/>
  <text x="256" y="320" font-size="280" fill="#ffffff" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold">${appInitial}</text>
</svg>`;
  
  write(path.join(outDir, "public/icon.svg"), iconSVG);
  
  // Also keep basic PNG placeholders for compatibility
  const minimalPNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
    'base64'
  );
  write(path.join(outDir, "public/icon-192.png"), minimalPNG);
  write(path.join(outDir, "public/icon-512.png"), minimalPNG);
  
  console.log("✅ PWA support added (manifest.json + service worker + icons)");
}

// CLI
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: generate.js <app.json> [outDir]");
  process.exit(1);
}
const jsonPath = path.resolve(args[0]);
if (!fs.existsSync(jsonPath)) {
  console.error("file not found:", jsonPath);
  process.exit(1);
}
const def = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
const outDir = path.resolve(args[1] || path.join(process.cwd(), "generated", def.metadata?.id || "myapp"));
generateApp(def, outDir);
console.log("Generation complete ->", outDir);
