import React from "react";

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const colors = [
  { name: "Default", value: "default", bg: "#ffffff" },
  { name: "Red", value: "red", bg: "#fecaca" },
  { name: "Orange", value: "orange", bg: "#fed7aa" },
  { name: "Yellow", value: "yellow", bg: "#fef08a" },
  { name: "Green", value: "green", bg: "#bbf7d0" },
  { name: "Blue", value: "blue", bg: "#bfdbfe" },
  { name: "Purple", value: "purple", bg: "#e9d5ff" },
  { name: "Pink", value: "pink", bg: "#fbcfe8" },
  { name: "Gray", value: "gray", bg: "#e5e7eb" },
];

const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorSelect,
}) => {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <p className="text-sm font-medium text-gray-700 mb-3">Choose a color</p>
      <div className="grid grid-cols-9 gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onColorSelect(color.value)}
            className={`w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
              selectedColor === color.value
                ? "border-keep-600 ring-2 ring-keep-300"
                : "border-gray-300"
            }`}
            style={{ backgroundColor: color.bg }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
