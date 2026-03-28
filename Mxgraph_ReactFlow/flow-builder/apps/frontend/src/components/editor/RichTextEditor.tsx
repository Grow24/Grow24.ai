import React, { useEffect, useMemo } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { createYjsProvider } from '../../lib/collabProvider';

interface RichTextEditorProps {
  docId: string;
  user: { id: string; name: string; color?: string };
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ docId, user }) => {
  const { ydoc, provider, awareness, destroy } = useMemo(() =>
    createYjsProvider(`docs-${docId}`, user), [docId, user]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: ydoc as unknown as any }),
      CollaborationCursor.configure({ provider: provider as unknown as any, user })
    ],
    content: ''
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
      destroy();
    };
  }, [editor, destroy]);

  return (
    <div className="border rounded">
      <EditorContent editor={editor} />
    </div>
  );
};