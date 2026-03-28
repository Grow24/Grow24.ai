import React, { useState } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import { useCollaboration, CollabUser } from '../../hooks/useCollaboration';
import { PresenceBar } from './PresenceBar';

interface CollaborativeWhiteboardProps {
  whiteboardId: string;
  currentUser: CollabUser;
}

export const CollaborativeWhiteboard: React.FC<CollaborativeWhiteboardProps> = ({
  whiteboardId,
  currentUser,
}) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  const { isConnected, connectedUsers } = useCollaboration({
    roomId: whiteboardId,
    namespace: 'whiteboard',
    user: currentUser,
  });

  return (
    <div className="h-screen w-full relative">
      <div className="absolute top-4 right-4 z-50">
        <PresenceBar
          users={connectedUsers}
          isConnected={isConnected}
          currentUser={currentUser}
        />
      </div>
      
      <Excalidraw
        ref={(api) => setExcalidrawAPI(api)}
        isCollaborating={true}
        renderTopRightUI={() => null}
      />
    </div>
  );
};