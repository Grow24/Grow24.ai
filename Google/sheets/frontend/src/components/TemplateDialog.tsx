import { useState } from "react";
import TemplatePreview from "./TemplatePreview";

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
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const templates: Template[] = [
    {
      id: "budget-tracker",
      name: "Budget Tracker",
      description: "Track income and expenses",
      category: "Finance",
      thumbnail: "BT"
    },
    {
      id: "project-timeline",
      name: "Project Timeline",
      description: "Plan project milestones",
      category: "Project Management",
      thumbnail: "PT"
    },
    {
      id: "inventory-tracker",
      name: "Inventory Tracker",
      description: "Manage stock levels",
      category: "Operations",
      thumbnail: "IT"
    },
    {
      id: "contact-list",
      name: "Contact List",
      description: "Organize contacts",
      category: "Productivity",
      thumbnail: "CL"
    },
    {
      id: "sales-tracker",
      name: "Sales Tracker",
      description: "Monitor sales performance",
      category: "Sales",
      thumbnail: "ST"
    },
    {
      id: "employee-schedule",
      name: "Employee Schedule",
      description: "Manage work schedules",
      category: "HR",
      thumbnail: "ES"
    },
    {
      id: "expense-report",
      name: "Expense Report",
      description: "Track business expenses",
      category: "Finance",
      thumbnail: "ER"
    },
    {
      id: "task-list",
      name: "Task List",
      description: "Organize tasks and todos",
      category: "Productivity",
      thumbnail: "TL"
    },
    {
      id: "invoice-template",
      name: "Invoice",
      description: "Create professional invoices",
      category: "Finance",
      thumbnail: "IN"
    },
    {
      id: "attendance-tracker",
      name: "Attendance Tracker",
      description: "Track attendance records",
      category: "HR",
      thumbnail: "AT"
    }
  ];

  const categories = ["all", "Custom", "Finance", "Project Management", "Operations", "Productivity", "Sales", "HR"];
  
  // Combine built-in and custom templates
  const allTemplates = [...templates, ...customTemplates];

  const filteredTemplates = selectedCategory === "all" 
    ? allTemplates 
    : allTemplates.filter(t => t.category === selectedCategory);

  const getTemplatePreviewData = (template: Template): string[][] => {
    // If it's a custom template, build data from its columns and sample rows
    if (template.isCustom) {
      const customTemplate = customTemplates.find(t => t.id === template.id);
      if (customTemplate && 'columns' in customTemplate && 'sampleRows' in customTemplate) {
        const headerRow = (customTemplate as any).columns.map((col: any) => col.name);
        return [headerRow, ...(customTemplate as any).sampleRows];
      }
    }
    
    // For predefined templates, return sample data
    const templateData: Record<string, string[][]> = {
      "budget-tracker": [
        ["Date", "Category", "Description", "Income", "Expense", "Balance"],
        ["01/01/2024", "Salary", "Monthly paycheck", "5000", "", "5000"],
        ["01/05/2024", "Groceries", "Weekly shopping", "", "150", "4850"],
        ["01/10/2024", "Utilities", "Electric bill", "", "120", "4730"],
      ],
      "project-timeline": [
        ["Phase", "Task", "Owner", "Start Date", "End Date", "Status", "Progress"],
        ["Planning", "Requirements gathering", "John Doe", "01/01/2024", "01/15/2024", "Completed", "100%"],
        ["Design", "UI/UX mockups", "Jane Smith", "01/16/2024", "01/30/2024", "In Progress", "60%"],
        ["Development", "Backend API", "Mike Johnson", "02/01/2024", "02/28/2024", "Not Started", "0%"],
      ],
      "inventory-tracker": [
        ["Item Code", "Product Name", "Category", "Quantity", "Unit Price", "Reorder Level", "Supplier"],
        ["ITM001", "Laptop Dell XPS 13", "Electronics", "25", "$999", "10", "Dell Inc"],
        ["ITM002", "Office Chair", "Furniture", "50", "$150", "15", "Office Depot"],
        ["ITM003", "Printer Paper", "Supplies", "200", "$25", "50", "Staples"],
      ],
      "contact-list": [
        ["Name", "Email", "Phone", "Company", "Position", "Notes"],
        ["John Doe", "john@example.com", "(555) 123-4567", "Acme Corp", "CEO", "Key decision maker"],
        ["Jane Smith", "jane@example.com", "(555) 234-5678", "Tech Solutions", "CTO", "Technical contact"],
        ["Bob Wilson", "bob@example.com", "(555) 345-6789", "Global Inc", "Manager", "Procurement lead"],
      ],
      "sales-tracker": [
        ["Date", "Customer", "Product", "Quantity", "Unit Price", "Total", "Status", "Sales Rep"],
        ["01/15/2024", "ABC Company", "Widget Pro", "100", "$50", "$5,000", "Completed", "Sarah"],
        ["01/16/2024", "XYZ Corp", "Gadget Plus", "50", "$75", "$3,750", "Pending", "Mike"],
        ["01/17/2024", "Tech Startup", "Widget Pro", "200", "$50", "$10,000", "Completed", "Sarah"],
      ],
      "employee-schedule": [
        ["Employee", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Weekend", "Total Hours"],
        ["John Doe", "9:00 AM - 5:00 PM", "9:00 AM - 5:00 PM", "9:00 AM - 5:00 PM", "9:00 AM - 5:00 PM", "9:00 AM - 3:00 PM", "Off", "38"],
        ["Jane Smith", "10:00 AM - 6:00 PM", "10:00 AM - 6:00 PM", "Off", "10:00 AM - 6:00 PM", "10:00 AM - 6:00 PM", "Off", "32"],
        ["Mike Johnson", "8:00 AM - 4:00 PM", "8:00 AM - 4:00 PM", "8:00 AM - 4:00 PM", "8:00 AM - 4:00 PM", "8:00 AM - 4:00 PM", "Off", "40"],
      ],
      "expense-report": [
        ["Date", "Vendor", "Item description", "Amount", "Payment type", "All expense category"],
        ["10/12/2024", "Alpha Hotel", "Hotel reservation + tax", "$1,298.00", "Bank transfer", "Lodging"],
        ["19/12/2024", "Beta Airlines", "Flight", "$5,647.43", "Credit card", "Travel"],
        ["24/12/2024", "Gamma Coffee", "Breakfast", "$8.99", "Cash", "Meals"],
      ],
      "task-list": [
        ["Priority", "Task", "Description", "Assigned To", "Due Date", "Status", "Notes"],
        ["High", "Complete Q1 Report", "Finalize quarterly financial report", "John Doe", "01/31/2024", "In Progress", "Waiting on data"],
        ["Medium", "Update Website", "Refresh homepage content", "Jane Smith", "02/15/2024", "Not Started", ""],
        ["Low", "Team Meeting", "Monthly sync-up", "All Team", "02/01/2024", "Scheduled", "Zoom link sent"],
      ],
      "invoice-template": [
        ["Item", "Description", "Quantity", "Unit Price", "Amount"],
        ["Consulting Services", "Strategic planning session", "10 hrs", "$150", "$1,500"],
        ["Design Work", "Logo and brand identity", "1", "$500", "$500"],
        ["", "", "", "Subtotal:", "$2,000"],
        ["", "", "", "Tax (10%):", "$200"],
        ["", "", "", "Total:", "$2,200"],
      ],
      "attendance-tracker": [
        ["Employee Name", "Employee ID", "Date", "Check In", "Check Out", "Status", "Hours Worked"],
        ["John Doe", "EMP001", "01/15/2024", "9:00 AM", "5:00 PM", "Present", "8"],
        ["Jane Smith", "EMP002", "01/15/2024", "9:15 AM", "5:00 PM", "Present", "7.75"],
        ["Mike Johnson", "EMP003", "01/15/2024", "", "", "Absent", "0"],
      ],
    };

    return templateData[template.id] || [["No preview available"]];
  };

  const handleMouseEnter = (template: Template, event: React.MouseEvent) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }

    // Capture the element and position immediately
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const position = {
      x: rect.right,
      y: rect.top
    };

    // Set a small delay before showing preview (300ms)
    const timeout = setTimeout(() => {
      console.log('Showing preview for:', template.name, 'at position:', position);
      setPreviewPosition(position);
      setPreviewTemplate(template);
    }, 300);

    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    // Clear timeout if user moves away before delay completes
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const closePreview = () => {
    setPreviewTemplate(null);
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800">Select a template</h2>
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
                    ? "bg-green-100 text-green-700 font-medium"
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
                      ? "bg-green-100 text-green-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Help me create button */}
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  if (onCreateCustomTemplate) {
                    onCreateCustomTemplate();
                  }
                }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium text-sm">Custom Template</span>
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Design your own template structure
              </p>
            </div>
          </div>

          {/* Right Content - Template Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="group relative bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-green-500 hover:shadow-lg transition-all cursor-pointer"
                  onMouseEnter={(e) => handleMouseEnter(template, e)}
                  onMouseLeave={handleMouseLeave}
                  title="Hover to preview template"
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
                      {/* Preview indicator - shown on hover */}
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-green-500 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Preview
                        </div>
                      </div>
                      
                      {/* Thumbnail */}
                      <div className={`w-20 h-20 bg-gradient-to-br ${template.isCustom ? 'from-purple-500 to-pink-600' : 'from-green-500 to-emerald-600'} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                        <span className="text-white text-xl font-bold tracking-tight">{template.thumbnail}</span>
                      </div>
                      
                      {/* Template Name */}
                      <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-green-600 transition-colors">
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </div>
                <p className="text-lg">No templates found in this category</p>
                <p className="text-sm mt-2">Try selecting a different category</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Preview */}
      {previewTemplate && (
        <TemplatePreview
          templateData={getTemplatePreviewData(previewTemplate)}
          templateName={previewTemplate.name}
          position={previewPosition}
          onClose={closePreview}
        />
      )}
    </div>
  );
}
