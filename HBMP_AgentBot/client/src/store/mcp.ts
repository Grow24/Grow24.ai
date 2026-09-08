import { atomFamily, atomWithStorage } from 'jotai/utils';
import { Constants, LocalStorageKeys } from 'librechat-data-provider';

/**
 * Creates a storage atom for MCP values per conversation
 * Uses atomFamily to create unique atoms for each conversation ID
 */
export const mcpValuesAtomFamily = atomFamily((conversationId: string | null) => {
  const key = conversationId ?? Constants.NEW_CONVO;
  const storageKey = `${LocalStorageKeys.LAST_MCP_}${key}`;

  // AgentBot demo: keep pbmp selected on new chats and after the first
  // message creates a real conversation id (empty default used to uncheck it).
  return atomWithStorage<string[]>(storageKey, ['pbmp'], undefined, { getOnInit: true });
});

/**
 * Global storage atom for MCP pinned state (shared across all conversations)
 */
export const mcpPinnedAtom = atomWithStorage<boolean>(LocalStorageKeys.PIN_MCP_, true, undefined, {
  getOnInit: true,
});
