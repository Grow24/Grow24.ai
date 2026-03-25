import { createContext, useContext, ReactNode, useState } from 'react';
import { Editor } from '@tiptap/react';

interface EditorContextType {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [editor, setEditor] = useState<Editor | null>(null);

  return (
    <EditorContext.Provider value={{ editor, setEditor }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  const context = useContext(EditorContext);
  if (!context) {
    return { editor: null, setEditor: () => {} };
  }
  return context;
}


