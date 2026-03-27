/**
 * Vite plugin: return real HTTP 404 for paths that are not defined app routes.
 * Prevents the SPA from loading at all for invalid URLs (e.g. /abc).
 */
import type { Plugin } from 'vite'

const VALID_PATHS = [
  '/',
  '/about',
  '/become-partner',
  '/dashboard',
  '/echarts',
  '/survey',
  '/library',
  '/privacy-policy',
  '/value-definition',
  '/what-we-offer',
]
const VALID_PREFIX = '/solutions/' // /solutions/overview, /solutions/anything

const BODY_404 = `<!DOCTYPE html>
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
</html>`

function isDefinedRoute(pathname: string): boolean {
  const path = pathname.replace(/\?.*$/, '').replace(/#.*$/, '').trim().replace(/\/$/, '') || '/'
  if (VALID_PATHS.includes(path)) return true
  if (path.startsWith(VALID_PREFIX)) return true
  return false
}

export function vite404Plugin(): Plugin {
  return {
    name: 'vite-404-undefined-routes',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? '/'
        const pathname = url.split('?')[0]
        // Skip assets, API, and Vite internals
        if (
          pathname.includes('.') ||
          pathname.startsWith('/@') ||
          pathname.startsWith('/node_modules') ||
          pathname.startsWith('/api/') ||
          pathname === '/univer' ||
          pathname.startsWith('/univer/') ||
          pathname === '/HBMPONE' ||
          pathname.startsWith('/HBMPONE/') ||
          pathname === '/HBMP_One' ||
          pathname.startsWith('/HBMP_One/') ||
          pathname === '/HBMP_DOCS_PLATFORM' ||
          pathname.startsWith('/HBMP_DOCS_PLATFORM/') ||
          pathname === '/app_manager' ||
          pathname.startsWith('/app_manager/') ||
          pathname === '/ivvychainv2' ||
          pathname.startsWith('/ivvychainv2/') ||
          pathname === '/Microsoft' ||
          pathname.startsWith('/Microsoft/') ||
          pathname === '/OpenStreetMaps' ||
          pathname.startsWith('/OpenStreetMaps/') ||
          pathname === '/ImageProcessing' ||
          pathname.startsWith('/ImageProcessing/') ||
          pathname === '/Google' ||
          pathname.startsWith('/Google/') ||
          pathname === '/mcp_server' ||
          pathname.startsWith('/mcp_server/')
        ) {
          return next()
        }
        if (!isDefinedRoute(pathname)) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(BODY_404)
          return
        }
        next()
      })
    },
  }
}
