import { useState, useRef, useEffect } from 'react';
import { searchMasterElements, getCategories, getElementsByCategory, MasterElement } from '../data/masterElements';

interface FieldNameAutocompleteProps {
  value: string;
  onChange: (value: string, element?: MasterElement) => void;
  placeholder?: string;
  className?: string;
}

export default function FieldNameAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Enter field name...",
  className = ""
}: FieldNameAutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<MasterElement[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update suggestions when value changes
    const results = searchMasterElements(value);
    setSuggestions(results);
    setSelectedIndex(0);
  }, [value]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    // Close dropdown on scroll
    const handleScroll = () => {
      if (showSuggestions) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [showSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
    setActiveCategory(null);
  };

  const handleSelectSuggestion = (element: MasterElement, event?: React.MouseEvent) => {
    event?.preventDefault();
    event?.stopPropagation();
    onChange(element.label, element);
    setShowSuggestions(false);
    inputRef.current?.blur(); // Remove focus to prevent reopening
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setShowSuggestions(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  const categories = getCategories();

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
        />
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onChange('');
            }}
            onMouseDown={(e) => e.preventDefault()}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={dropdownRef}
          className="fixed bg-white border border-gray-300 rounded-lg shadow-2xl max-h-96 overflow-hidden flex"
          style={{
            zIndex: 9999,
            left: inputRef.current?.getBoundingClientRect().left + 'px',
            top: (inputRef.current?.getBoundingClientRect().bottom ?? 0) + 4 + 'px',
            width: inputRef.current?.offsetWidth + 'px',
            minWidth: '500px'
          }}
        >
          {/* Category Filter Sidebar */}
          <div className="w-40 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-2">
              <button
                onClick={() => {
                  setActiveCategory(null);
                  setSuggestions(searchMasterElements(value));
                }}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  !activeCategory ? 'bg-green-100 text-green-700 font-medium' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                All Fields ({searchMasterElements(value).length})
              </button>
            </div>
            <div className="border-t border-gray-200"></div>
            <div className="p-2 space-y-1">
              {categories.map(category => {
                const categoryElements = getElementsByCategory(category);
                const filteredCount = categoryElements.filter(el => 
                  searchMasterElements(value).includes(el)
                ).length;
                
                if (filteredCount === 0) return null;
                
                return (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category);
                      const filtered = getElementsByCategory(category).filter(el =>
                        searchMasterElements(value).includes(el)
                      );
                      setSuggestions(filtered);
                      setSelectedIndex(0);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      activeCategory === category 
                        ? 'bg-green-100 text-green-700 font-medium' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category}</span>
                      <span className="text-xs text-gray-400">{filteredCount}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Suggestions List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {suggestions.map((element, index) => (
                <button
                  key={element.id}
                  onClick={(e) => handleSelectSuggestion(element, e)}
                  onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-3 py-3 rounded-md transition-colors ${
                    index === selectedIndex 
                      ? 'bg-green-50 border border-green-200' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{element.label}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {element.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{element.description}</p>
                      {element.aliases.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {element.aliases.slice(0, 3).map((alias, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">
                              {alias}
                            </span>
                          ))}
                          {element.aliases.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{element.aliases.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                      {element.example && (
                        <p className="text-xs text-gray-400 mt-1 italic">
                          e.g. {element.example}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded font-mono">
                        {element.defaultType}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Helper Text */}
      {showSuggestions && (
        <div className="mt-1 text-xs text-gray-500 flex items-center gap-4">
          <span>↑↓ Navigate</span>
          <span>Enter Select</span>
          <span>Esc Close</span>
        </div>
      )}
    </div>
  );
}
