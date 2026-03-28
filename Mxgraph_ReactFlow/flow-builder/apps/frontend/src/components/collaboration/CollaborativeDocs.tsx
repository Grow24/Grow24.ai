import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCollaboration, CollabUser } from '../../hooks/useCollaboration';
import { PresenceBar } from './PresenceBar';

interface CollaborativeDocsProps {
  docId: string;
  currentUser: CollabUser;
}

export const CollaborativeDocs: React.FC<CollaborativeDocsProps> = ({
  docId,
  currentUser,
}) => {
  const { isConnected, connectedUsers } = useCollaboration({
    roomId: docId,
    namespace: 'docs',
    user: currentUser,
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start collaborating...</p>',
  });

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-semibold">Collaborative Document</h1>
        <PresenceBar
          users={connectedUsers}
          isConnected={isConnected}
          currentUser={currentUser}
        />
      </div>
      
      <div className="flex-1 p-4">
        <EditorContent 
          editor={editor} 
          className="prose max-w-none h-full border rounded p-4 focus-within:ring-2 focus-within:ring-blue-500"
        />
      </div>
    </div>
  );
};