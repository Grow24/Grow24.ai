import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export type AwarenessUser = {
  id: string;
  name: string;
  color?: string;
  avatarUrl?: string;
};

export type CollabHandles = {
  ydoc: Y.Doc;
  provider: WebsocketProvider;
  awareness: any;
  destroy: () => void;
};

export function createYjsProvider(roomId: string, currentUser: AwarenessUser, url = 'ws://localhost:3002'): CollabHandles {
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider(url, roomId, ydoc, { connect: true });
  const awareness = provider.awareness;
  awareness.setLocalStateField('user', currentUser);
  return {
    ydoc,
    provider,
    awareness,
    destroy: () => {
      provider.destroy();
      ydoc.destroy();
    },
  };
}


