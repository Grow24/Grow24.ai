import { useState, useEffect, useRef } from "react";

interface Variable {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  category: string;
}

interface VariablePickerProps {
  isOpen: boolean;
  position: { top: number; left: number };
  onSelect: (variable: Variable) => void;
  onClose: () => void;
  searchQuery: string;
}

export default function VariablePicker({ 
  isOpen, 
  position, 
  onSelect, 
  onClose, 
  searchQuery 
}: VariablePickerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  const variables: Variable[] = [
    {
      id: "stopwatch",
      label: "Stopwatch",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      value: "{{stopwatch}}",
      category: "time"
    },
    {
      id: "timer",
      label: "Timer",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      value: "{{timer}}",
      category: "time"
    },
    {
      id: "task",
      label: "Task",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      value: "{{task}}",
      category: "productivity"
    },
    {
      id: "variable",
      label: "Variable",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      value: "{{variable}}",
      category: "data"
    },
    {
      id: "vote",
      label: "Vote",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      value: "{{vote}}",
      category: "interactive"
    },
    {
      id: "placeholder",
      label: "Placeholder chip",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
      value: "{{placeholder}}",
      category: "data"
    },
    {
      id: "current_date",
      label: "Current Date",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      value: "{{current_date}}",
      category: "time"
    },
    {
      id: "user_name",
      label: "User Name",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      value: "{{user_name}}",
      category: "user"
    },
    {
      id: "user_email",
      label: "User Email",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      value: "{{user_email}}",
      category: "user"
    },
    {
      id: "document_title",
      label: "Document Title",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      value: "{{document_title}}",
      category: "document"
    }
  ];

  const filteredVariables = variables.filter(variable =>
    variable.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedVariables = filteredVariables.reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, Variable[]>);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredVariables.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case "Enter":
          e.preventDefault();
          if (filteredVariables[selectedIndex]) {
            onSelect(filteredVariables[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredVariables, onSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 z-50 w-80 max-h-96 overflow-y-auto"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {/* Search Info */}
      {searchQuery && (
        <div className="px-4 py-2 border-b bg-gray-50">
          <p className="text-xs text-gray-500">
            Searching for: <span className="font-semibold text-gray-700">{searchQuery}</span>
          </p>
        </div>
      )}

      {/* Variables List */}
      {filteredVariables.length > 0 ? (
        <div className="py-2">
          {Object.entries(groupedVariables).map(([category, items]) => (
            <div key={category}>
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {category}
                </h3>
              </div>
              {items.map((variable) => {
                const globalIndex = filteredVariables.indexOf(variable);
                return (
                  <button
                    key={variable.id}
                    onClick={() => onSelect(variable)}
                    className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                      globalIndex === selectedIndex
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : "hover:bg-gray-50 border-l-4 border-transparent"
                    }`}
                  >
                    <div className={`${globalIndex === selectedIndex ? "text-blue-600" : "text-gray-500"}`}>
                      {variable.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        globalIndex === selectedIndex ? "text-blue-900" : "text-gray-900"
                      }`}>
                        {variable.label}
                      </p>
                      <p className="text-xs text-gray-500">{variable.value}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-8 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-sm text-gray-500">No variables found</p>
          <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
        </div>
      )}

      {/* Building Blocks Section */}
      <div className="border-t bg-gray-50">
        <button
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
          onClick={() => {
            alert("Building blocks feature coming soon!");
          }}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-sm font-medium text-gray-700">BUILDING BLOCKS</span>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Footer Help Text */}
      <div className="px-4 py-2 border-t bg-gray-50">
        <p className="text-xs text-gray-500">
          <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">↑</kbd>
          <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs ml-1">↓</kbd>
          {" "}to navigate • {" "}
          <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Enter</kbd>
          {" "}to select • {" "}
          <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Esc</kbd>
          {" "}to close
        </p>
      </div>
    </div>
  );
}
