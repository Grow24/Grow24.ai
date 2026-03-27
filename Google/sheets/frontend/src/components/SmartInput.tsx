import { useState, useRef, useEffect } from "react";
import VariablePicker from "./VariablePicker";

interface SmartInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}

export default function SmartInput({ 
  value, 
  onChange, 
  placeholder = "Type @ to insert variables...",
  className = "",
  multiline = false 
}: SmartInputProps) {
  const [showVariablePicker, setShowVariablePicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    
    onChange(newValue);

    // Check if user typed "@"
    if (newValue[cursorPosition - 1] === "@") {
      const rect = e.target.getBoundingClientRect();
      setPickerPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
      });
      setMentionStartIndex(cursorPosition - 1);
      setSearchQuery("");
      setShowVariablePicker(true);
    } 
    // Check if user is typing after "@"
    else if (showVariablePicker && mentionStartIndex !== -1) {
      const textAfterMention = newValue.substring(mentionStartIndex + 1, cursorPosition);
      
      // Close picker if user moves cursor before @ or presses space
      if (cursorPosition <= mentionStartIndex || textAfterMention.includes(" ")) {
        setShowVariablePicker(false);
      } else {
        setSearchQuery(textAfterMention);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && showVariablePicker) {
      setShowVariablePicker(false);
      e.preventDefault();
    }
  };

  const handleVariableSelect = (variable: { value: string; label: string }) => {
    if (inputRef.current && mentionStartIndex !== -1) {
      const cursorPosition = inputRef.current.selectionStart || 0;
      const beforeMention = value.substring(0, mentionStartIndex);
      const afterCursor = value.substring(cursorPosition);
      
      const newValue = beforeMention + variable.value + afterCursor;
      onChange(newValue);
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = mentionStartIndex + variable.value.length;
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
          inputRef.current.focus();
        }
      }, 0);
    }
    
    setShowVariablePicker(false);
    setMentionStartIndex(-1);
    setSearchQuery("");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showVariablePicker && inputRef.current && !inputRef.current.contains(e.target as Node)) {
        // Check if click is on the variable picker
        const target = e.target as HTMLElement;
        if (!target.closest('[role="variable-picker"]')) {
          setShowVariablePicker(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showVariablePicker]);

  const commonProps = {
    value: value,
    onChange: handleInput,
    onKeyDown: handleKeyDown,
    placeholder: placeholder,
    className: `${className} focus:outline-none focus:ring-2 focus:ring-green-500`,
  };

  return (
    <div className="relative w-full">
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          {...commonProps}
          rows={4}
          className={`${commonProps.className} w-full px-4 py-2 border border-gray-300 rounded-lg resize-none`}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          {...commonProps}
          type="text"
          className={`${commonProps.className} w-full px-4 py-2 border border-gray-300 rounded-lg`}
        />
      )}

      <div role="variable-picker">
        <VariablePicker
          isOpen={showVariablePicker}
          position={pickerPosition}
          onSelect={handleVariableSelect}
          onClose={() => setShowVariablePicker(false)}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
}
