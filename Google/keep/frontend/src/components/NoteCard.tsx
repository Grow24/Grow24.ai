import React, { useState } from "react";
import {
  MoreVertical,
  Pin,
  Archive,
  Trash2,
  Share2,
  CheckCircle,
  Tag,
  Edit,
} from "lucide-react";

interface NoteCardProps {
  note: any;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  onArchive: () => void;
  onPin: () => void;
  availableLabels: string[];
  viewMode: "grid" | "list";
}

const colorMap: Record<string, string> = {
  default: "bg-white",
  red: "bg-red-100",
  orange: "bg-orange-100",
  yellow: "bg-yellow-100",
  green: "bg-green-100",
  blue: "bg-blue-100",
  purple: "bg-purple-100",
  pink: "bg-pink-100",
  gray: "bg-gray-100",
};

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onUpdate,
  onDelete,
  onArchive,
  onPin,
  availableLabels,
  viewMode,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.properties.title || "");
  const [editContent, setEditContent] = useState(note.properties.content || "");

  const handleSaveEdit = () => {
    onUpdate({
      title: editTitle,
      content: editContent,
    });
    setIsEditing(false);
  };

  const toggleLabel = (label: string) => {
    const currentLabels = note.properties.labels || [];
    const newLabels = currentLabels.includes(label)
      ? currentLabels.filter((l: string) => l !== label)
      : [...currentLabels, label];
    onUpdate({ labels: newLabels });
  };

  const backgroundColor =
    colorMap[note.properties.color] || colorMap.default;

  return (
    <div
      className={`${backgroundColor} rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200 ${
        viewMode === "list" ? "flex" : ""
      }`}
    >
      <div className="p-4 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 text-lg font-semibold bg-transparent border-b border-gray-400 focus:outline-none"
              autoFocus
            />
          ) : (
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              {note.properties.title || "Untitled"}
            </h3>
          )}

          <div className="flex items-center space-x-1">
            {note.properties.isPinned && (
              <Pin className="w-4 h-4 text-keep-600 fill-current" />
            )}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 py-2">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      onPin();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Pin className="w-4 h-4" />
                    <span>{note.properties.isPinned ? "Unpin" : "Pin"}</span>
                  </button>
                  <button
                    onClick={() => {
                      onArchive();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Archive className="w-4 h-4" />
                    <span>
                      {note.properties.isArchived ? "Unarchive" : "Archive"}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this note?")) {
                        onDelete();
                      }
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-transparent border border-gray-400 rounded p-2 focus:outline-none resize-none"
            rows={4}
          />
        ) : (
          <p className="text-gray-700 mb-3 whitespace-pre-wrap">
            {note.properties.content || "No content"}
          </p>
        )}

        {/* Checklist */}
        {note.properties.checklist && note.properties.checklist.length > 0 && (
          <div className="mb-3 space-y-1">
            {note.properties.checklist.map((item: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle
                  className={`w-4 h-4 ${
                    item.checked ? "text-green-600" : "text-gray-400"
                  }`}
                />
                <span
                  className={
                    item.checked ? "line-through text-gray-500" : "text-gray-700"
                  }
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Labels */}
        {note.properties.labels && note.properties.labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {note.properties.labels.map((label: string) => (
              <span
                key={label}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-keep-200 text-keep-800"
              >
                <Tag className="w-3 h-3 mr-1" />
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Approval status */}
        {note.properties.approvalStatus &&
          note.properties.approvalStatus !== "draft" && (
            <div className="mb-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  note.properties.approvalStatus === "approved"
                    ? "bg-green-100 text-green-800"
                    : note.properties.approvalStatus === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {note.properties.approvalStatus.toUpperCase()}
              </span>
            </div>
          )}

        {/* Edit actions */}
        {isEditing && (
          <div className="flex space-x-2 mt-3">
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-keep-500 text-white rounded hover:bg-keep-600"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditTitle(note.properties.title || "");
                setEditContent(note.properties.content || "");
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-xs text-gray-500 mt-3">
          {new Date(note.properties.modifiedTime).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
