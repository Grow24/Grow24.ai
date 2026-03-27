import { useMemo, useState } from "react";

interface Presentation {
  id: string;
  name: string;
  webViewLink: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (templateId: string, title: string) => void;
  presentations: Presentation[];
}

export default function TemplateDialog({ isOpen, onClose, onSelect, presentations }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Templates");
  const [title, setTitle] = useState("");
  const [templateInput, setTemplateInput] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [library, setLibrary] = useState<Array<{id:string; name:string; thumbnailLink?: string;}>>([]);

  const categories = useMemo(() => [
    "All Templates",
    "Library",
    "From Presentations",
    "Custom",
  ], []);

  // Load template library from backend when opened
  useMemo(() => {
    if (!isOpen) return;
    fetch(`/google/slides/templates`)
      .then(r => r.json())
      .then(d => setLibrary(d.templates || []))
      .catch(() => setLibrary([]));
  }, [isOpen]);

  if (!isOpen) return null;

  const parseId = (input: string) => {
    const urlMatch = input.match(/https?:\/\/docs.google.com\/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (urlMatch) return urlMatch[1];
    return input.trim();
  };

  const submit = () => {
    const id = selectedId || parseId(templateInput);
    if (!id) {
      alert("Please choose a template or paste a valid Slides URL/ID");
      return;
    }
    if (!title.trim()) {
      alert("Please enter a presentation title");
      return;
    }
    onSelect(id, title.trim());
  };

  const visibleTemplates = useMemo(() => {
    if (selectedCategory === "Library") return library;
    if (selectedCategory === "From Presentations") return presentations;
    // All Templates
    return [...library, ...presentations];
  }, [library, presentations, selectedCategory]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800">Select a template</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">×</button>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Left Sidebar */}
          <div className="w-56 border-r bg-gray-50 p-4 overflow-y-auto">
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    selectedCategory === category
                      ? "bg-orange-100 text-orange-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-br from-orange-400 to-rose-500"></span>
                  {category}
                </button>
              ))}
            </div>

            {/* Paste URL/ID */}
            <div className="mt-6 pt-6 border-t">
              <label className="block text-xs font-medium text-gray-600 mb-1">Or paste Slides URL/ID</label>
              <input
                type="text"
                placeholder="https://docs.google.com/presentation/d/... or ID"
                className="w-full px-3 py-2 border rounded text-sm"
                value={templateInput}
                onChange={(e) => setTemplateInput(e.target.value)}
              />
            </div>
          </div>

          {/* Right content - grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className={`group relative bg-white border-2 rounded-lg p-6 text-left hover:shadow-lg transition-all ${
                    selectedId === t.id ? "border-orange-500" : "border-gray-200 hover:border-orange-300"
                  }`}
                  title={t.name}
                >
                  {('thumbnailLink' in t && t.thumbnailLink) ? (
                    <img src={(t as any).thumbnailLink} className="w-28 h-20 object-cover rounded-lg mb-3 shadow-md group-hover:scale-105 transition-transform"/>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                      <span className="text-white text-xl font-bold tracking-tight">{(t.name || "T").substring(0,2).toUpperCase()}</span>
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors truncate">{t.name}</h3>
                  <p className="text-xs text-gray-500 truncate">Use this presentation as template</p>
                </button>
              ))}
            </div>

            {visibleTemplates.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">📄</div>
                <p className="text-lg">No templates available</p>
                <p className="text-sm mt-2">Paste a Slides URL/ID from your Drive</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center gap-3 justify-end bg-white">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">New presentation title</label>
            <input
              type="text"
              placeholder="Enter title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
          <button onClick={submit} className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">Create</button>
        </div>
      </div>
    </div>
  );
}
