import type { Catalog, ChatResponse } from './types';

const apiBase = (import.meta.env.VITE_API_URL || `${import.meta.env.BASE_URL}api`).replace(/\/$/, '');

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${apiBase}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export const api = {
  health: () => json('/health'),
  catalog: () => json<Catalog>('/catalog'),
  chat: (body: Record<string, unknown>) =>
    json<ChatResponse>('/chat', { method: 'POST', body: JSON.stringify(body) }),
  interpreter: (language: string, code: string) =>
    json('/interpreter', { method: 'POST', body: JSON.stringify({ language, code }) }),
  programmatic: (kind: string) =>
    json('/programmatic', { method: 'POST', body: JSON.stringify({ kind }) }),
  mcp: (toolId: string, args: Record<string, unknown> = {}) =>
    json(`/mcp/${encodeURIComponent(toolId)}`, { method: 'POST', body: JSON.stringify(args) }),
};

export { apiBase };
