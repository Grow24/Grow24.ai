import { useState } from "react";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  isCustom?: boolean;
}

interface TemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
  customTemplates?: Template[];
  onEditCustomTemplate?: (templateId: string) => void;
  onDeleteCustomTemplate?: (templateId: string) => void;
  onCreateCustomTemplate?: () => void;
}

export default function TemplateDialog({ 
  isOpen, 
  onClose, 
  onSelectTemplate,
  customTemplates = [],
  onEditCustomTemplate,
  onDeleteCustomTemplate,
  onCreateCustomTemplate
}: TemplateDialogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const templates: Template[] = [
    {
      id: "customer-feedback",
      name: "Customer Feedback Survey",
      description: "Collect customer satisfaction ratings",
      category: "Surveys",
      thumbnail: "CF"
    },
    {
      id: "event-registration",
      name: "Event Registration",
      description: "Register attendees for events",
      category: "Events",
      thumbnail: "ER"
    },
    {
      id: "job-application",
      name: "Job Application Form",
      description: "Collect job applicant information",
      category: "HR",
      thumbnail: "JA"
    },
    {
      id: "contact-form",
      name: "Contact Form",
      description: "General contact information form",
      category: "General",
      thumbnail: "CO"
    },
    {
      id: "quiz-assessment",
      name: "Quiz & Assessment",
      description: "Create quizzes and tests",
      category: "Education",
      thumbnail: "QZ"
    },
    {
      id: "order-form",
      name: "Order Form",
      description: "Product or service order form",
      category: "Sales",
      thumbnail: "OF"
    },
    {
      id: "feedback-request",
      name: "Feedback Request",
      description: "Request feedback from team members",
      category: "Internal",
      thumbnail: "FR"
    },
    {
      id: "meeting-rsvp",
      name: "Meeting RSVP",
      description: "Confirm meeting attendance",
      category: "Events",
      thumbnail: "MR"
    },
    {
      id: "product-survey",
      name: "Product Survey",
      description: "Gather product feedback",
      category: "Surveys",
      thumbnail: "PS"
    },
    {
      id: "employee-evaluation",
      name: "Employee Evaluation",
      description: "Performance review form",
      category: "HR",
      thumbnail: "EE"
    }
  ];

  const categories = ["all", "Surveys", "Events", "HR", "General", "Education", "Sales", "Internal", "Custom"];
  
  // Combine built-in and custom templates
  const allTemplates = [...templates, ...customTemplates];

  const filteredTemplates = selectedCategory === "all" 
    ? allTemplates 
    : allTemplates.filter(t => t.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800">Select a form template</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex h-[calc(90vh-140px)]">
          {/* Left Sidebar - Categories */}
          <div className="w-48 border-r bg-gray-50 p-4 overflow-y-auto">
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  selectedCategory === "all"
                    ? "bg-orange-100 text-orange-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500"></span>
                All Templates
              </button>
              
              {categories.filter(c => c !== "all").map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === category
                      ? "bg-orange-100 text-orange-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Create Custom Template button */}
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  if (onCreateCustomTemplate) {
                    onCreateCustomTemplate();
                  }
                }}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium text-sm">Create a custom Template</span>
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Design your own form structure
              </p>
            </div>
          </div>

          {/* Right Content - Template Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="group relative bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-orange-500 hover:shadow-lg transition-all"
                >
                  {/* 3-dot menu for custom templates */}
                  {template.isCustom && (
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(menuOpen === template.id ? null : template.id);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      
                      {/* Dropdown menu */}
                      {menuOpen === template.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpen(null);
                              if (onEditCustomTemplate) {
                                onEditCustomTemplate(template.id);
                              }
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Template
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpen(null);
                              if (onDeleteCustomTemplate && confirm(`Delete "${template.name}" template?`)) {
                                onDeleteCustomTemplate(template.id);
                              }
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete Template
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={() => onSelectTemplate(template.id)}
                    className="w-full"
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Thumbnail */}
                      <div className={`w-20 h-20 bg-gradient-to-br ${template.isCustom ? 'from-purple-500 to-pink-600' : 'from-orange-500 to-red-600'} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                        <span className="text-white text-xl font-bold tracking-tight">{template.thumbnail}</span>
                      </div>
                      
                      {/* Template Name */}
                      <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">
                        {template.name}
                        {template.isCustom && (
                          <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Custom</span>
                        )}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {template.description}
                      </p>
                      
                      {/* Category Badge */}
                      <div className="mt-3">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          {template.category}
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-lg">No templates found in this category</p>
                <p className="text-sm mt-2">Try selecting a different category</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
