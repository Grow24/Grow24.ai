import { useEffect, useState } from "react";
import TemplateDialog from "../components/TemplateDialog";
import ShareDialog from "../components/ShareDialog";

interface GooglePresentation {
  id: string;
  name: string;
  webViewLink: string;
  createdTime?: string;
  modifiedTime?: string;
}

export default function Slides() {
  const [presentations, setPresentations] = useState<GooglePresentation[]>([]);
  const [selectedPresentation, setSelectedPresentation] = useState<GooglePresentation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newPresentationTitle, setNewPresentationTitle] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [renamingPresentation, setRenamingPresentation] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3003";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      e.preventDefault();
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (isResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  useEffect(() => {
    // Check auth status then attempt to load data
    (async () => {
      try {
        const statusRes = await fetch(`${apiBase}/auth/status`);
        const status = await statusRes.json();
        setAuthorized(!!status.authorized);
      } catch (e) {
        setAuthorized(null);
      } finally {
        fetchPresentations();
      }
    })();
  }, []);

  const fetchPresentations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/google/slides/list`);
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Not authorized. Please connect your Google account.");
        }
        throw new Error("Failed to fetch presentations");
      }
      
      setPresentations(data.files || []);
      if (data.files && data.files.length > 0) {
        setSelectedPresentation(data.files[0]);
      }
    } catch (err) {
      console.error("Error fetching presentations:", err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createPresentation = async () => {
    if (!newPresentationTitle.trim()) {
      alert("Please enter a presentation title");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/google/slides/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newPresentationTitle }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create presentation");
      }

      const newPresentation = await res.json();
      setPresentations([newPresentation, ...presentations]);
      setSelectedPresentation(newPresentation);
      setNewPresentationTitle("");
      setShowCreateDialog(false);
      alert("Presentation created successfully!");
    } catch (err) {
      console.error("Error creating presentation:", err);
      alert(err instanceof Error ? err.message : "Failed to create presentation");
    }
  };

  const createFromTemplate = async (templateId: string, title: string) => {
    if (!templateId) {
      alert("Please select or paste a valid template ID/URL");
      return;
    }
    if (!title.trim()) {
      alert("Please enter a presentation title");
      return;
    }
    try {
      const res = await fetch(`${apiBase}/google/slides/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, templateId }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create from template");
      }
      const newPresentation = await res.json();
      setPresentations([newPresentation, ...presentations]);
      setSelectedPresentation(newPresentation);
      setShowTemplateDialog(false);
      alert("Presentation created from template!");
    } catch (err) {
      console.error("Error creating from template:", err);
      alert(err instanceof Error ? err.message : "Failed to create from template");
    }
  };

  const deletePresentation = async (presentationId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`${apiBase}/google/slides/${presentationId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPresentations(presentations.filter((p) => p.id !== presentationId));
        if (selectedPresentation?.id === presentationId) {
          setSelectedPresentation(presentations[0] || null);
        }
        alert("Presentation deleted successfully");
      } else {
        const errorData = await res.json();
        alert(`Failed to delete presentation: ${errorData.error || "Unknown error"}`);
      }
    } catch (err) {
      alert(`Failed to delete presentation: ${err instanceof Error ? err.message : "Network error"}`);
    }
  };

  const renamePresentation = async (presentationId: string) => {
    if (!renameValue.trim()) return;

    try {
      const res = await fetch(`${apiBase}/google/slides/${presentationId}/rename`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameValue }),
      });

      if (res.ok) {
        setPresentations(presentations.map((p) =>
          p.id === presentationId ? { ...p, name: renameValue } : p
        ));
        if (selectedPresentation?.id === presentationId) {
          setSelectedPresentation({ ...selectedPresentation, name: renameValue });
        }
        setRenamingPresentation(null);
        setRenameValue("");
      } else {
        alert("Failed to rename presentation");
      }
    } catch (err) {
      alert("Failed to rename presentation");
    }
  };

  if (error && error.includes("Not authorized")) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authorization Required</h2>
          <p className="text-gray-600 mb-6">
            Please authorize this application to access your Google Slides.
          </p>
          <a
            href={`${apiBase}/google/auth`}
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Connect Google Account
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading presentations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div 
        className="bg-white border-r border-gray-200 flex flex-col relative"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Presentations</h1>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs px-2 py-1 rounded-full ${authorized ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {authorized ? 'Connected to Google' : 'Not connected'}
            </span>
            {!authorized && (
              <a
                href={`${apiBase}/google/auth`}
                className="text-xs text-orange-700 hover:text-orange-800 underline"
              >
                Connect
              </a>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNewMenu((v) => !v)}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-xl">+ New</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5.23 7.21a.75.75 0 011.06.02L10 11l3.71-3.77a.75.75 0 111.08 1.04l-4.25 4.33a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"/></svg>
            </button>
            {showNewMenu && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-orange-200 rounded-lg shadow-lg z-10 overflow-hidden">
                <button
                  onClick={() => { setShowCreateDialog(true); setShowNewMenu(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50 flex items-center gap-2"
                >
                  <span className="text-orange-600">▦</span>
                  <span>Blank Presentation</span>
                </button>
                <button
                  onClick={() => { setShowTemplateDialog(true); setShowNewMenu(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-orange-50 flex items-center gap-2"
                >
                  <span className="text-orange-600">🧩</span>
                  <span>Choose from Template</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-4">
            {presentations.map((presentation) => (
              <li
                key={presentation.id}
                className={`group relative p-3 cursor-pointer rounded text-sm flex items-center justify-between ${
                  selectedPresentation?.id === presentation.id ? "bg-orange-100" : "hover:bg-gray-100"
                }`}
              >
                {renamingPresentation === presentation.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") renamePresentation(presentation.id);
                        if (e.key === "Escape") {
                          setRenamingPresentation(null);
                          setRenameValue("");
                        }
                      }}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                      autoFocus
                    />
                    <button
                      onClick={() => renamePresentation(presentation.id)}
                      className="text-green-600 hover:text-green-700 text-xs"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => {
                        setRenamingPresentation(null);
                        setRenameValue("");
                      }}
                      className="text-red-600 hover:text-red-700 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className="flex-1 truncate"
                      onClick={() => setSelectedPresentation(presentation)}
                    >
                      {presentation.name}
                    </span>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === presentation.id ? null : presentation.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 px-2 py-1 hover:bg-gray-200 rounded transition-opacity"
                      >
                        ⋮
                      </button>
                      
                      {activeMenu === presentation.id && (
                        <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowShareDialog(true);
                              setSelectedPresentation(presentation);
                              setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                          >
                            <span>👥</span> Share
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRenameValue(presentation.name);
                              setRenamingPresentation(presentation.id);
                              setActiveMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                          >
                            <span>✏️</span> Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deletePresentation(presentation.id, presentation.name);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 flex items-center gap-2"
                          >
                            <span>🗑️</span> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
          className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-orange-500 bg-transparent transition-colors z-10 group"
        >
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-gray-300 group-hover:bg-orange-500" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 relative flex flex-col">
        {selectedPresentation ? (
          <div className="flex-1 relative">
            <iframe
              src={selectedPresentation.webViewLink}
              className="w-full h-full border-0"
              allowFullScreen
              allow="clipboard-read; clipboard-write"
            ></iframe>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-xl">No presentation selected</p>
              <p className="text-sm mt-2">Create a new presentation to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Presentation</h3>
            <input
              type="text"
              value={newPresentationTitle}
              onChange={(e) => setNewPresentationTitle(e.target.value)}
              placeholder="Enter presentation title..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-4"
              onKeyDown={(e) => e.key === "Enter" && createPresentation()}
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateDialog(false);
                  setNewPresentationTitle("");
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createPresentation}
                className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Dialog */}
      {showTemplateDialog && (
        <TemplateDialog
          isOpen={showTemplateDialog}
          onClose={() => setShowTemplateDialog(false)}
          presentations={presentations}
          onSelect={(templateId: string, title: string) => createFromTemplate(templateId, title)}
        />
      )}

      {/* Share Dialog */}
      {showShareDialog && selectedPresentation && (
        <ShareDialog
          isOpen={showShareDialog}
          onClose={() => setShowShareDialog(false)}
          presentationId={selectedPresentation.id}
          presentationName={selectedPresentation.name}
        />
      )}
    </div>
  );
}
