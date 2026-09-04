import { v4 as uuid } from 'uuid';
import type { MemoryRecord } from '../types';

const store = new Map<string, MemoryRecord>();

export function writeMemory(scope: MemoryRecord['scope'], key: string, value: string): MemoryRecord {
  const existing = [...store.values()].find((m) => m.scope === scope && m.key === key);
  const rec: MemoryRecord = {
    id: existing?.id || uuid(),
    scope,
    key,
    value,
    updatedAt: new Date().toISOString(),
  };
  store.set(rec.id, rec);
  return rec;
}

export function listMemory(): MemoryRecord[] {
  return [...store.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function seedMemory() {
  if (store.size) return;
  writeMemory('workspace', 'orchestration-rule', 'PBMP supplies semantics; LibreChat is the generic Agent Runtime.');
  writeMemory('workspace', 'model-rule', 'LibreChat is not an LLM. Intelligence comes from the attached model.');
  writeMemory('agent', 'allowSelf', 'Main PBMP Agent may spawn isolated copies of itself.');
  writeMemory('user', 'preferred-canvas', 'Prefer interactive dashboards over static pictures.');
}
