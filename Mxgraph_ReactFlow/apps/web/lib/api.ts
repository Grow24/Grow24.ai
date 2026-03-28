/** Prefix for app-relative URLs when served under a path (e.g. /Mxgraph_ReactFlow/). */
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}
