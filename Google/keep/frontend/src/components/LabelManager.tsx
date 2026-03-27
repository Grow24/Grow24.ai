import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface LabelManagerProps {
  labels: string[];
  onSave: (labels: string[]) => void;
  onClose: () => void;
}

const LabelManager: React.FC<LabelManagerProps> = ({
  labels,
  onSave,
  onClose,
}) => {
  const [localLabels, setLocalLabels] = useState<string[]>(labels);
  const [newLabel, setNewLabel] = useState("");

  const handleAddLabel = () => {
    if (newLabel.trim() && !localLabels.includes(newLabel.trim())) {
      setLocalLabels([...localLabels, newLabel.trim()]);
      setNewLabel("");
    }
  };

  const handleRemoveLabel = (label: string) => {
    setLocalLabels(localLabels.filter((l) => l !== label));
  };

  const handleSave = () => {
    onSave(localLabels);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Manage Labels</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Add new label */}
          <div className="flex space-x-2 mb-6">
            <input
              type="text"
              placeholder="New label..."
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddLabel()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-keep-500"
            />
            <button
              onClick={handleAddLabel}
              className="bg-keep-500 hover:bg-keep-600 text-white p-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Label list */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {localLabels.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No labels yet. Add one above!
              </p>
            ) : (
              localLabels.map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="font-medium text-gray-700">{label}</span>
                  <button
                    onClick={() => handleRemoveLabel(label)}
                    className="p-1 hover:bg-red-100 rounded text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-keep-500 hover:bg-keep-600 text-white rounded-lg transition-colors"
          >
            Save Labels
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabelManager;
