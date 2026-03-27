import { useState, useEffect } from "react";
import TemplatePreview from "./TemplatePreview";
import FieldNameAutocomplete from "./FieldNameAutocomplete";
import type { MasterElement } from "../data/masterElements";

interface Column {
  id: string;
  name: string;
  type: string;
  types?: string[]; // Support multiple types
}

interface CustomTemplateBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: {
    name: string;
    description: string;
    category: string;
    columns: Column[];
    sampleRows: string[][];
  }) => void;
  editTemplate?: {
    id: string;
    name: string;
    description: string;
    category: string;
    columns: Column[];
    sampleRows: string[][];
  } | null;
}

export default function CustomTemplateBuilder({ 
  isOpen, 
  onClose, 
  onSave,
  editTemplate 
}: CustomTemplateBuilderProps) {
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Custom");
  const [columns, setColumns] = useState<Column[]>([
    { id: "1", name: "Column 1", type: "text", types: ["text"] }
  ]);
  const [sampleRows, setSampleRows] = useState<string[][]>([["Sample data 1"]]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [showTypeSelector, setShowTypeSelector] = useState<string | null>(null);

  // Update state when editTemplate changes
  useEffect(() => {
    if (editTemplate) {
      setTemplateName(editTemplate.name || "");
      setDescription(editTemplate.description || "");
      setCategory(editTemplate.category || "Custom");
      setColumns(editTemplate.columns || [{ id: "1", name: "Column 1", type: "text" }]);
      setSampleRows(editTemplate.sampleRows || [["Sample data 1"]]);
    } else {
      // Reset to defaults when creating new template
      setTemplateName("");
      setDescription("");
      setCategory("Custom");
      setColumns([{ id: "1", name: "Column 1", type: "text" }]);
      setSampleRows([["Sample data 1"]]);
    }
  }, [editTemplate, isOpen]);

  const categories = ["Custom", "Finance", "Project Management", "Operations", "Productivity", "Sales", "HR"];

  // Validation functions
  const validateValue = (value: string, types: string[]): { isValid: boolean; message: string } => {
    if (!value.trim()) {
      return { isValid: true, message: "" }; // Empty values are allowed
    }

    const validationResults = types.map(type => {
      switch (type) {
        case "text":
          return { isValid: true, message: "" };
        
        case "number":
          const isNumber = !isNaN(parseFloat(value)) && isFinite(Number(value));
          return { 
            isValid: isNumber, 
            message: isNumber ? "" : "❌ Must be a valid number" 
          };
        
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const isEmail = emailRegex.test(value);
          return { 
            isValid: isEmail, 
            message: isEmail ? "" : "❌ Must be a valid email address" 
          };
        
        case "url":
          try {
            new URL(value);
            return { isValid: true, message: "" };
          } catch {
            return { isValid: false, message: "❌ Must be a valid URL" };
          }
        
        case "date":
          const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
          const isDate = dateRegex.test(value) || !isNaN(Date.parse(value));
          return { 
            isValid: isDate, 
            message: isDate ? "" : "❌ Must be a valid date (MM/DD/YYYY)" 
          };
        
        case "currency":
          const currencyRegex = /^\$?\d+(\.\d{2})?$/;
          const isCurrency = currencyRegex.test(value.replace(/,/g, ''));
          return { 
            isValid: isCurrency, 
            message: isCurrency ? "" : "❌ Must be a valid currency amount" 
          };
        
        default:
          return { isValid: true, message: "" };
      }
    });

    // If any validation passes, it's valid
    const anyValid = validationResults.some(result => result.isValid);
    if (anyValid) {
      return { isValid: true, message: "" };
    }

    // All failed, return combined error message
    const uniqueMessages = [...new Set(validationResults.map(r => r.message))];
    return { 
      isValid: false, 
      message: `Value doesn't match type(s): ${types.join(" or ")}. ${uniqueMessages.join(" ")}` 
    };
  };

  const toggleColumnType = (columnIndex: number, type: string) => {
    const updated = [...columns];
    const column = updated[columnIndex];
    const currentTypes = column.types || [column.type];
    
    if (currentTypes.includes(type)) {
      // Remove type if already selected
      const newTypes = currentTypes.filter(t => t !== type);
      if (newTypes.length === 0) {
        alert("Column must have at least one type");
        return;
      }
      column.types = newTypes;
      column.type = newTypes[0]; // Set primary type to first selected
    } else {
      // Add type
      column.types = [...currentTypes, type];
      column.type = type; // Update primary type
    }
    
    setColumns(updated);
    
    // Revalidate all cells in this column
    sampleRows.forEach((row, rowIndex) => {
      const cellValue = row[columnIndex];
      if (cellValue) {
        const validation = validateValue(cellValue, column.types || [column.type]);
        const errorKey = `${rowIndex}-${columnIndex}`;
        if (!validation.isValid) {
          setValidationErrors(prev => ({ ...prev, [errorKey]: validation.message }));
        } else {
          setValidationErrors(prev => {
            const updated = { ...prev };
            delete updated[errorKey];
            return updated;
          });
        }
      }
    });
  };

  const addColumn = () => {
    const newCol: Column = {
      id: Date.now().toString(),
      name: `Column ${columns.length + 1}`,
      type: "text",
      types: ["text"]
    };
    setColumns([...columns, newCol]);
    // Add empty cell to each sample row
    setSampleRows(sampleRows.map(row => [...row, ""]));
  };

  const removeColumn = (index: number) => {
    if (columns.length <= 1) {
      alert("Template must have at least one column");
      return;
    }
    setColumns(columns.filter((_, i) => i !== index));
    setSampleRows(sampleRows.map(row => row.filter((_, i) => i !== index)));
  };

  const updateColumn = (index: number, field: keyof Column, value: string) => {
    const updated = [...columns];
    updated[index] = { ...updated[index], [field]: value };
    setColumns(updated);
  };

  const addRow = () => {
    setSampleRows([...sampleRows, new Array(columns.length).fill("")]);
  };

  const removeRow = (rowIndex: number) => {
    if (sampleRows.length <= 1) {
      alert("Template must have at least one sample row");
      return;
    }
    setSampleRows(sampleRows.filter((_, i) => i !== rowIndex));
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    // Just update the cell value, validation happens on save
    const errorKey = `${rowIndex}-${colIndex}`;
    
    // Clear any previous error for this cell
    setValidationErrors(prev => {
      const updated = { ...prev };
      delete updated[errorKey];
      return updated;
    });
    
    const updated = [...sampleRows];
    updated[rowIndex] = [...updated[rowIndex]];
    updated[rowIndex][colIndex] = value;
    setSampleRows(updated);
  };

  const getPreviewData = (): string[][] => {
    const headerRow = columns.map(col => col.name || "Unnamed Column");
    return [headerRow, ...sampleRows];
  };

  const handlePreviewClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPreviewPosition({
      x: rect.left,
      y: rect.bottom + 10
    });
    setShowPreview(true);
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      alert("Please enter a template name");
      return;
    }
    if (columns.some(col => !col.name.trim())) {
      alert("All columns must have names");
      return;
    }

    // Validate all sample data cells
    const errors: { [key: string]: string } = {};
    let invalidCells: string[] = [];
    
    sampleRows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell.trim()) { // Only validate non-empty cells
          const column = columns[colIndex];
          const columnTypes = column.types || [column.type];
          const validation = validateValue(cell, columnTypes);
          
          if (!validation.isValid) {
            const errorKey = `${rowIndex}-${colIndex}`;
            errors[errorKey] = validation.message;
            invalidCells.push(`Row ${rowIndex + 1}, Column "${column.name}": ${cell}`);
          }
        }
      });
    });

    // If there are validation errors, show them and don't save
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      
      // Create a detailed error message
      const errorMessage = `❌ Invalid data found in ${invalidCells.length} cell(s):\n\n${
        invalidCells.slice(0, 5).map((cell, idx) => `${idx + 1}. ${cell}`).join('\n')
      }${invalidCells.length > 5 ? `\n... and ${invalidCells.length - 5} more` : ''}\n\n` +
      `Please correct the highlighted cells and try again.`;
      
      alert(errorMessage);
      return;
    }

    // Clear any previous errors
    setValidationErrors({});

    onSave({
      name: templateName,
      description: description,
      category: category,
      columns: columns,
      sampleRows: sampleRows
    });
    
    // Reset form
    setTemplateName("");
    setDescription("");
    setCategory("Custom");
    setColumns([{ id: "1", name: "Column 1", type: "text", types: ["text"] }]);
    setSampleRows([["Sample data 1"]]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-green-600 to-emerald-600">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {editTemplate ? "Edit Custom Template" : "Create Custom Template"}
            </h2>
            <p className="text-green-50 text-sm mt-1">Design your own spreadsheet template</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePreviewClick}
              className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-green-100 text-3xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Template Info */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Template Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., My Custom Template"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of your template"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Columns Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                Columns ({columns.length})
              </h3>
              <button
                onClick={addColumn}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Column
              </button>
            </div>
            
            <div className="space-y-2 bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
              {columns.map((col, index) => (
                <div key={col.id} className="bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1">
                      <FieldNameAutocomplete
                        value={col.name}
                        onChange={(value, element?: MasterElement) => {
                          // If a master element is selected, update both name and type
                          if (element) {
                            const newCols = [...columns];
                            newCols[index] = {
                              ...newCols[index],
                              name: element.label, // Use the element's label as the name
                              type: element.defaultType,
                              types: [element.defaultType]
                            };
                            setColumns(newCols);
                          } else {
                            // Just typing, update the name only
                            updateColumn(index, "name", value);
                          }
                        }}
                        placeholder="Enter or select column name..."
                        className="text-sm"
                      />
                    </div>
                    <button
                      onClick={() => setShowTypeSelector(showTypeSelector === col.id ? null : col.id)}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      Types ({(col.types || [col.type]).length})
                    </button>
                    <button
                      onClick={() => removeColumn(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove column"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Type selector dropdown */}
                  {showTypeSelector === col.id && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-2">Select one or more data types:</p>
                      <div className="grid grid-cols-3 gap-2">
                        {["text", "number", "date", "currency", "email", "url"].map((type) => {
                          const isSelected = (col.types || [col.type]).includes(type);
                          return (
                            <button
                              key={type}
                              onClick={() => toggleColumnType(index, type)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isSelected
                                  ? "bg-green-600 text-white"
                                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {isSelected && <span className="mr-1">✓</span>}
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-2 text-xs text-gray-600 bg-blue-50 p-2 rounded">
                        <strong>Selected:</strong> {(col.types || [col.type]).map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sample Data Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Sample Data ({sampleRows.length} rows)
              </h3>
              <button
                onClick={addRow}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Row
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-80 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-green-600 text-white sticky top-0">
                    <tr>
                      {columns.map((col, index) => (
                        <th key={col.id} className="px-4 py-3 text-left text-sm font-semibold">
                          {col.name || `Column ${index + 1}`}
                        </th>
                      ))}
                      <th className="px-4 py-3 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {sampleRows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-50">
                        {row.map((cell, colIndex) => {
                          const errorKey = `${rowIndex}-${colIndex}`;
                          const hasError = validationErrors[errorKey];
                          const columnTypes = columns[colIndex]?.types || [columns[colIndex]?.type || 'text'];
                          return (
                            <td key={colIndex} className="px-4 py-2">
                              <div className="relative">
                                <input
                                  type="text"
                                  value={cell}
                                  onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                                  placeholder={`Sample (${columnTypes.join('/')})`}
                                  className={`w-full px-2 py-1 border-2 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-colors ${
                                    hasError ? 'border-red-500 bg-red-50 text-red-900 font-medium' : 'border-gray-200'
                                  }`}
                                  title={hasError || `Accepts: ${columnTypes.join(', ')}`}
                                />
                                {hasError && (
                                  <>
                                    <div className="absolute -right-2 -top-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold z-20">
                                      !
                                    </div>
                                    <div className="absolute left-0 top-full mt-1 text-xs text-white bg-red-600 px-2 py-1 rounded shadow-lg z-30 max-w-xs">
                                      {hasError}
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                          );
                        })}
                        <td className="px-4 py-2">
                          <button
                            onClick={() => removeRow(rowIndex)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Remove row"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Error Banner */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800">
                  ⚠️ {Object.keys(validationErrors).length} validation error{Object.keys(validationErrors).length > 1 ? 's' : ''} found
                </p>
                <p className="text-xs text-red-700 mt-1">
                  Please correct the highlighted cells (in red) before creating the template. Check that all data matches the column type requirements.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            💡 Tip: Add meaningful column names and sample data to help users understand the template
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {editTemplate ? "Save Changes" : "Create Template"}
            </button>
          </div>
        </div>
      </div>

      {/* Template Preview */}
      {showPreview && (
        <TemplatePreview
          templateData={getPreviewData()}
          templateName={templateName || "Custom Template"}
          position={previewPosition}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
