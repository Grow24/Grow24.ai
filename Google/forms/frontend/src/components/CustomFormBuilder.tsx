import { useState, useEffect } from "react";

interface Question {
  id: string;
  title: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface CustomFormBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: {
    name: string;
    description: string;
    category: string;
    questions: Question[];
  }) => void;
  editTemplate?: {
    id: string;
    name: string;
    description: string;
    category: string;
    questions: Question[];
  } | null;
}

export default function CustomFormBuilder({ 
  isOpen, 
  onClose, 
  onSave,
  editTemplate 
}: CustomFormBuilderProps) {
  const [templateName, setTemplateName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Custom");
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", title: "Question 1", type: "textQuestion", required: false, options: [] }
  ]);

  const categories = ["Custom", "Surveys", "Events", "HR", "General", "Education", "Sales", "Internal"];
  
  const questionTypes = [
    { value: "textQuestion", label: "Short Answer" },
    { value: "paragraphQuestion", label: "Paragraph" },
    { value: "multipleChoiceQuestion", label: "Multiple Choice" },
    { value: "checkboxQuestion", label: "Checkboxes" },
    { value: "dropdownQuestion", label: "Dropdown" },
    { value: "scaleQuestion", label: "Linear Scale" },
    { value: "dateQuestion", label: "Date" },
    { value: "timeQuestion", label: "Time" },
  ];

  // Update state when editTemplate changes
  useEffect(() => {
    if (editTemplate) {
      setTemplateName(editTemplate.name || "");
      setDescription(editTemplate.description || "");
      setCategory(editTemplate.category || "Custom");
      setQuestions(editTemplate.questions || [{ id: "1", title: "Question 1", type: "textQuestion", required: false, options: [] }]);
    } else {
      setTemplateName("");
      setDescription("");
      setCategory("Custom");
      setQuestions([{ id: "1", title: "Question 1", type: "textQuestion", required: false, options: [] }]);
    }
  }, [editTemplate, isOpen]);

  const addQuestion = () => {
    const newQ: Question = {
      id: Date.now().toString(),
      title: `Question ${questions.length + 1}`,
      type: "textQuestion",
      required: false,
      options: []
    };
    setQuestions([...questions, newQ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert("Form must have at least one question");
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    
    // Initialize options for choice-based questions
    if (field === "type" && (value === "multipleChoiceQuestion" || value === "checkboxQuestion" || value === "dropdownQuestion")) {
      updated[index].options = updated[index].options?.length ? updated[index].options : ["Option 1"];
    }
    
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    const currentOptions = updated[qIndex].options || [];
    updated[qIndex].options = [...currentOptions, `Option ${currentOptions.length + 1}`];
    setQuestions(updated);
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    const currentOptions = updated[qIndex].options || [];
    if (currentOptions.length <= 1) {
      alert("Question must have at least one option");
      return;
    }
    updated[qIndex].options = currentOptions.filter((_, i) => i !== optIndex);
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    const currentOptions = updated[qIndex].options || [];
    currentOptions[optIndex] = value;
    updated[qIndex].options = currentOptions;
    setQuestions(updated);
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      alert("Please enter a template name");
      return;
    }
    if (questions.some(q => !q.title.trim())) {
      alert("All questions must have titles");
      return;
    }

    onSave({
      name: templateName,
      description: description,
      category: category,
      questions: questions
    });
    
    // Reset form
    setTemplateName("");
    setDescription("");
    setCategory("Custom");
    setQuestions([{ id: "1", title: "Question 1", type: "textQuestion", required: false, options: [] }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-orange-600 to-red-600">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {editTemplate ? "Edit Custom Form Template" : "Create Custom Form Template"}
            </h2>
            <p className="text-orange-50 text-sm mt-1">Design your own form structure</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-orange-100 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Template Info */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  placeholder="e.g., My Custom Form"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  placeholder="Brief description of your form template"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Questions ({questions.length})
              </h3>
              <button
                onClick={addQuestion}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Question
              </button>
            </div>
            
            <div className="space-y-4">
              {questions.map((q, qIndex) => (
                <div key={q.id} className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={q.title}
                        onChange={(e) => updateQuestion(qIndex, "title", e.target.value)}
                        placeholder="Question title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-medium"
                      />
                    </div>
                    <select
                      value={q.type}
                      onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                    >
                      {questionTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeQuestion(qIndex)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove question"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Options for choice-based questions */}
                  {(q.type === "multipleChoiceQuestion" || q.type === "checkboxQuestion" || q.type === "dropdownQuestion") && (
                    <div className="ml-4 space-y-2">
                      {(q.options || []).map((opt, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <span className="text-gray-400">•</span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                            className="flex-1 px-3 py-1 border border-gray-200 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                          />
                          <button
                            onClick={() => removeOption(qIndex, optIndex)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(qIndex)}
                        className="text-orange-600 hover:text-orange-700 text-sm flex items-center gap-1 ml-4"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add option
                      </button>
                    </div>
                  )}

                  {/* Required checkbox */}
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`required-${q.id}`}
                      checked={q.required}
                      onChange={(e) => updateQuestion(qIndex, "required", e.target.checked)}
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor={`required-${q.id}`} className="text-sm text-gray-600">
                      Required question
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            💡 Tip: Add clear question titles and appropriate question types for better responses
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
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {editTemplate ? "Save Changes" : "Create Template"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
