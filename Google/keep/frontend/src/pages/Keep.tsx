import React, { useState, useEffect, lazy, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Grid,
  List,
  Archive,
  Tag,
  Bell,
  Settings,
  Filter,
  FileText,
} from "lucide-react";
import NoteCard from "../components/NoteCard";

const TemplateDialog = lazy(() => import("../components/TemplateDialog"));
const ColorPicker = lazy(() => import("../components/ColorPicker"));
const LabelManager = lazy(() => import("../components/LabelManager"));

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface Note {
  id: string;
  properties: {
    title: string;
    content: string;
    color: string;
    labels: string[];
    isPinned: boolean;
    isArchived: boolean;
    checklist: ChecklistItem[];
    approvalStatus: string;
    createdTime: string;
    modifiedTime: string;
  };
}

interface ChecklistItem {
  text: string;
  checked: boolean;
}

const Keep: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showArchived, setShowArchived] = useState(false);
  const [filterLabel, setFilterLabel] = useState<string | null>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLabelManager, setShowLabelManager] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteColor, setNewNoteColor] = useState("default");
  const [newNoteLabels, setNewNoteLabels] = useState<string[]>([]);
  const [availableLabels, setAvailableLabels] = useState<string[]>([]);

  const queryClient = useQueryClient();

  // Load available labels from localStorage
  useEffect(() => {
    const savedLabels = localStorage.getItem("keepLabels");
    if (savedLabels) {
      setAvailableLabels(JSON.parse(savedLabels));
    }
  }, []);

  // Listen for auth success
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "auth-success") {
        setAuthenticated(true);
        queryClient.invalidateQueries({ queryKey: ["notes"] });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [queryClient]);

  // Fetch notes
  const {
    data: notesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/google/keep/notes`);
      if (response.status === 401) {
        setAuthenticated(false);
        throw new Error("Not authenticated");
      }
      if (!response.ok) throw new Error("Failed to fetch notes");
      setAuthenticated(true); // Set authenticated if notes load successfully
      return response.json();
    },
    retry: 1,
    retryDelay: 1000,
  });

  // Create note mutation
  const createNoteMutation = useMutation({
    mutationFn: async (noteData: any) => {
      console.log("Creating note:", noteData);
      const response = await fetch(`${API_URL}/google/keep/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Create note error:", errorText);
        throw new Error(`Failed to create note: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Note created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setNewNoteTitle("");
      setNewNoteContent("");
      setNewNoteColor("default");
      setNewNoteLabels([]);
    },
    onError: (error: any) => {
      console.error("Create note mutation error:", error);
      alert(`Failed to create note: ${error.message}`);
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: async ({ noteId, updates }: { noteId: string; updates: any }) => {
      const response = await fetch(`${API_URL}/google/keep/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update note");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const response = await fetch(`${API_URL}/google/keep/notes/${noteId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete note");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // Archive/unarchive mutation
  const archiveMutation = useMutation({
    mutationFn: async ({ noteId, archived }: { noteId: string; archived: boolean }) => {
      const response = await fetch(`${API_URL}/google/keep/notes/${noteId}/archive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived }),
      });
      if (!response.ok) throw new Error("Failed to archive note");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // Pin/unpin mutation
  const pinMutation = useMutation({
    mutationFn: async ({ noteId, pinned }: { noteId: string; pinned: boolean }) => {
      const response = await fetch(`${API_URL}/google/keep/notes/${noteId}/pin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned }),
      });
      if (!response.ok) throw new Error("Failed to pin note");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  // Handle authentication
  const handleAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/google/auth`);
      const data = await response.json();
      window.open(data.authUrl, "_blank", "width=600,height=700");
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  // Handle create note
  const handleCreateNote = () => {
    if (!newNoteTitle && !newNoteContent) return;

    createNoteMutation.mutate({
      title: newNoteTitle || "Untitled",
      content: newNoteContent,
      color: newNoteColor,
      labels: newNoteLabels,
      isPinned: false,
    });
  };

  // Handle template selection
  const handleTemplateSelect = (template: any) => {
    createNoteMutation.mutate({
      title: template.title,
      content: template.content,
      color: template.color || "default",
      labels: template.labels || [],
      checklist: template.checklist || [],
      isPinned: false,
    });
    setShowTemplateDialog(false);
  };

  // Handle label save
  const handleSaveLabels = (labels: string[]) => {
    setAvailableLabels(labels);
    localStorage.setItem("keepLabels", JSON.stringify(labels));
    setShowLabelManager(false);
  };

  // Filter notes
  const notes = notesData?.notes || [];
  const filteredNotes = notes.filter((note: Note) => {
    const matchesSearch =
      note.properties.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.properties.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesArchive = showArchived
      ? note.properties.isArchived
      : !note.properties.isArchived;
    const matchesLabel = filterLabel
      ? note.properties.labels?.includes(filterLabel)
      : true;
    return matchesSearch && matchesArchive && matchesLabel;
  });

  // Separate pinned and unpinned
  const pinnedNotes = filteredNotes.filter((n: Note) => n.properties.isPinned);
  const unpinnedNotes = filteredNotes.filter((n: Note) => !n.properties.isPinned);

  // Show loading during initial auth check
  if (isLoading && !authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-keep-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-keep-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">HBMP Keep</h1>
          <p className="text-gray-600 mb-6">Google Keep Notes Integration</p>
          <button
            onClick={handleAuth}
            className="w-full bg-keep-500 hover:bg-keep-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-keep-500 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">HBMP Keep</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-keep-500 w-64"
                />
              </div>

              {/* View toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-white shadow"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-white shadow"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Actions */}
              <button
                onClick={() => setShowArchived(!showArchived)}
                className={`p-2 rounded-lg ${
                  showArchived
                    ? "bg-keep-100 text-keep-700"
                    : "hover:bg-gray-100"
                }`}
                title="Toggle archived"
              >
                <Archive className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowLabelManager(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Manage labels"
              >
                <Tag className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowTemplateDialog(true)}
                className="bg-keep-500 hover:bg-keep-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200"
              >
                <Plus className="w-5 h-5" />
                <span>Template</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Label filters */}
        {availableLabels.length > 0 && (
          <div className="mb-6 flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <button
              onClick={() => setFilterLabel(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                filterLabel === null
                  ? "bg-keep-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            {availableLabels.map((label) => (
              <button
                key={label}
                onClick={() => setFilterLabel(label)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filterLabel === label
                    ? "bg-keep-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* New note input */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <input
            type="text"
            placeholder="Note title..."
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            className="w-full text-xl font-semibold mb-4 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-keep-500"
          />
          <textarea
            placeholder="Take a note..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-keep-500 resize-none"
            rows={4}
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Choose color"
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-gray-300"
                  style={{
                    backgroundColor:
                      newNoteColor === "default" ? "#fff" : newNoteColor,
                  }}
                />
              </button>

              {availableLabels.length > 0 && (
                <select
                  multiple
                  value={newNoteLabels}
                  onChange={(e) =>
                    setNewNoteLabels(
                      Array.from(e.target.selectedOptions, (o) => o.value)
                    )
                  }
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  {availableLabels.map((label) => (
                    <option key={label} value={label}>
                      {label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <button
              onClick={handleCreateNote}
              disabled={createNoteMutation.isPending}
              className="bg-keep-500 hover:bg-keep-600 text-white px-6 py-2 rounded-lg font-semibold transition duration-200 disabled:opacity-50"
            >
              {createNoteMutation.isPending ? "Creating..." : "Create Note"}
            </button>
          </div>

          {showColorPicker && (
            <Suspense fallback={<div>Loading...</div>}>
              <ColorPicker
                selectedColor={newNoteColor}
                onColorSelect={(color) => {
                  setNewNoteColor(color);
                  setShowColorPicker(false);
                }}
              />
            </Suspense>
          )}
        </div>

        {/* Notes display */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-keep-500 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-700">Failed to load notes</p>
          </div>
        )}

        {!isLoading && !error && filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No notes yet</p>
          </div>
        )}

        {/* Pinned notes */}
        {pinnedNotes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Pinned
            </h2>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-4"
              }
            >
              {pinnedNotes.map((note: Note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onUpdate={(updates) =>
                    updateNoteMutation.mutate({ noteId: note.id, updates })
                  }
                  onDelete={() => deleteNoteMutation.mutate(note.id)}
                  onArchive={() =>
                    archiveMutation.mutate({
                      noteId: note.id,
                      archived: !note.properties.isArchived,
                    })
                  }
                  onPin={() =>
                    pinMutation.mutate({
                      noteId: note.id,
                      pinned: !note.properties.isPinned,
                    })
                  }
                  availableLabels={availableLabels}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other notes */}
        {unpinnedNotes.length > 0 && (
          <div>
            {pinnedNotes.length > 0 && (
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Other notes
              </h2>
            )}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-4"
              }
            >
              {unpinnedNotes.map((note: Note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onUpdate={(updates) =>
                    updateNoteMutation.mutate({ noteId: note.id, updates })
                  }
                  onDelete={() => deleteNoteMutation.mutate(note.id)}
                  onArchive={() =>
                    archiveMutation.mutate({
                      noteId: note.id,
                      archived: !note.properties.isArchived,
                    })
                  }
                  onPin={() =>
                    pinMutation.mutate({
                      noteId: note.id,
                      pinned: !note.properties.isPinned,
                    })
                  }
                  availableLabels={availableLabels}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Dialogs */}
      {showTemplateDialog && (
        <Suspense fallback={<div>Loading...</div>}>
          <TemplateDialog
            onClose={() => setShowTemplateDialog(false)}
            onSelect={handleTemplateSelect}
          />
        </Suspense>
      )}

      {showLabelManager && (
        <Suspense fallback={<div>Loading...</div>}>
          <LabelManager
            labels={availableLabels}
            onSave={handleSaveLabels}
            onClose={() => setShowLabelManager(false)}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Keep;
