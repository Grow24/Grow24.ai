import { useEffect, useState, useRef, lazy, Suspense } from "react";
import { io, Socket } from "socket.io-client";
import SmartInput from "../components/SmartInput";
import SheetChart from "../components/SheetChart";
import SheetValidator from "../components/SheetValidator";

// Lazy load heavy components for better initial load performance
const TemplateDialog = lazy(() => import("../components/TemplateDialog"));
const CustomTemplateBuilder = lazy(() => import("../components/CustomTemplateBuilder"));

interface GoogleSheet {
  id: string;
  name: string;
  webViewLink: string;
}

interface Collaborator {
  id: string;
  emailAddress?: string;
  role: string;
  type: string;
  displayName?: string;
}

interface ApprovalStatus {
  status: "draft" | "pending" | "approved" | "rejected";
  submittedBy: string | null;
  submittedAt: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  rejectionReason: string | null;
  isReadOnly: boolean;
  approvers?: string[];
  dueDate?: string;
  message?: string;
  allowEdits?: boolean;
  lockFile?: boolean;
}

interface Approver {
  email: string;
  name?: string;
  id: string;
}

export default function Sheets() {
  const [sheets, setSheets] = useState<GoogleSheet[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<GoogleSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showCustomTemplateBuilder, setShowCustomTemplateBuilder] = useState(false);
  const [editingCustomTemplate, setEditingCustomTemplate] = useState<any>(null);
  // Lazy initialization - only read localStorage once on mount
  const [customTemplates, setCustomTemplates] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('customTemplates');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load custom templates:', error);
      return [];
    }
  });
  const [activeSheetMenu, setActiveSheetMenu] = useState<string | null>(null);
  const [renamingSheet, setRenamingSheet] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareRole, setShareRole] = useState<"reader" | "commenter" | "writer">("writer");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [sharingSheet, setSharingSheet] = useState<GoogleSheet | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [approverEmail, setApproverEmail] = useState("");
  const [approvalMessage, setApprovalMessage] = useState("Please could you take a look over this?");
  const [dueDate, setDueDate] = useState("");
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [allowEdits, setAllowEdits] = useState(false);
  const [lockFile, setLockFile] = useState(true);
  const [userEmail] = useState("Grow24.ai");
  const [isManager] = useState(true);
  const [isAdmin] = useState(true);
  const [showSheetList, setShowSheetList] = useState(true);
  const [showChartPanel, setShowChartPanel] = useState(false);
  const [chartData, setChartData] = useState<any[][]>([]);
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [socketConnected, setSocketConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [sidebarWidth, setSidebarWidth] = useState(320); // Default 320px
  const [isResizing, setIsResizing] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL;

  // Handle sidebar resize
  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    // Constrain width between 200px and 600px
    if (newWidth >= 200 && newWidth <= 600) {
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Add/remove resize listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // Debounced save to localStorage - only save when customTemplates changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('customTemplates', JSON.stringify(customTemplates));
      } catch (error) {
        console.error('Failed to save custom templates:', error);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [customTemplates]);

  // Initialize Socket.IO connection for real-time updates
  useEffect(() => {
    const socket = io('http://localhost:3001', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket.IO connected:', socket.id);
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected');
      setSocketConnected(false);
    });

    socket.on('sheet.updated', async (data: { spreadsheetId: string; timestamp: string; metadata?: any }) => {
      console.log('📊 Sheet updated:', data);
      
      // If the updated sheet is the currently selected one, refresh chart data
      if (selectedSheet && data.spreadsheetId === selectedSheet.id) {
        console.log('🔄 Refreshing chart data for current sheet');
        await fetchSheetData(selectedSheet.id, false); // Don't auto-show on socket updates
      }
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error);
      setSocketConnected(false);
    });

    return () => {
      console.log('🧹 Cleaning up Socket.IO connection');
      socket.disconnect();
    };
  }, [selectedSheet]);

  // Fetch sheet data for charting
  const fetchSheetData = async (spreadsheetId: string, autoShow = false) => {
    try {
      setIsRefreshing(true);
      const res = await fetch(`${apiBase}/google/sheets/${spreadsheetId}/data`);
      if (res.ok) {
        const response = await res.json();
        console.log('📈 Fetched sheet data:', response);
        
        // Backend returns data.data (the actual sheet values)
        if (response.data && response.data.length > 0) {
          setChartData(response.data);
          setLastUpdate(new Date().toLocaleTimeString());
          // Only auto-show on initial load, not during polling
          if (autoShow && !showChartPanel) {
            setShowChartPanel(true);
          }
        }
      } else {
        console.error('Failed to fetch sheet data:', res.status);
      }
    } catch (error) {
      console.error('Error fetching sheet data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch chart data when a sheet is selected
  useEffect(() => {
    if (selectedSheet) {
      fetchSheetData(selectedSheet.id, true); // Auto-show on initial selection
    }
  }, [selectedSheet]);

  // Polling mechanism for real-time updates (fallback if webhooks aren't set up)
  useEffect(() => {
    if (!selectedSheet) return;

    // Poll every 3 seconds for changes
    const pollInterval = setInterval(() => {
      console.log('🔄 Polling for sheet updates...');
      fetchSheetData(selectedSheet.id, false); // Don't auto-show during polling
    }, 3000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [selectedSheet]);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const res = await fetch(`${apiBase}/google/sheets/list`);
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Not authorized. Please connect your Google account.");
          }
          throw new Error("Failed to fetch spreadsheets");
        }
        
        setSheets(data.files || []);
        if (data.files && data.files.length > 0) {
          setSelectedSheet(data.files[0]);
        }
      } catch (err) {
        console.error("Error fetching sheets:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchSheets();
  }, [apiBase]);

  // Close template menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowTemplateMenu(false);
      }
      if (activeSheetMenu && !(event.target as Element).closest('.relative')) {
        setActiveSheetMenu(null);
      }
    };

    if (showTemplateMenu || activeSheetMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTemplateMenu, activeSheetMenu]);

  // Fetch approval status when a sheet is selected
  useEffect(() => {
    const fetchApprovalStatus = async () => {
      if (!selectedSheet) return;
      
      try {
        const res = await fetch(`${apiBase}/google/sheets/${selectedSheet.id}/approval-status`);
        if (res.ok) {
          const data = await res.json();
          setApprovalStatus(data);
        }
      } catch (err) {
        console.error("Error fetching approval status:", err);
      }
    };

    fetchApprovalStatus();
  }, [selectedSheet, apiBase]);

  // Handle URL parameters for email actions
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sheetId = params.get('sheetId');
    const action = params.get('action');

    if (sheetId && action && sheets.length > 0) {
      const sheet = sheets.find(s => s.id === sheetId);
      if (sheet) {
        setSelectedSheet(sheet);
        
        if (action === 'approve') {
          handleApprove();
        } else if (action === 'reject') {
          handleReject();
        }
        
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [sheets]);

  const addApprover = () => {
    if (!approverEmail.trim()) return;
    
    const email = approverEmail.trim().toLowerCase();
    if (approvers.some(a => a.email === email)) {
      alert("This approver is already added");
      return;
    }
    
    const newApprover: Approver = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    };
    
    setApprovers(prev => [...prev, newApprover]);
    setApproverEmail("");
  };

  const removeApprover = (id: string) => {
    setApprovers(prev => prev.filter(a => a.id !== id));
  };

  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    const parts = name.split(/[._]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTemplateData = (templateId: string): string[][] => {
    const templates: Record<string, string[][]> = {
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

    return templates[templateId] || [];
  };

  const getPredefinedTemplateTypes = (templateId: string): any[] => {
    const typeDefinitions: Record<string, any[]> = {
      "budget-tracker": [
        { name: "Date", types: ["date"] },
        { name: "Category", types: ["text"] },
        { name: "Description", types: ["text"] },
        { name: "Income", types: ["currency", "number"] },
        { name: "Expense", types: ["currency", "number"] },
        { name: "Balance", types: ["currency", "number"] }
      ],
      "project-timeline": [
        { name: "Phase", types: ["text"] },
        { name: "Task", types: ["text"] },
        { name: "Owner", types: ["text"] },
        { name: "Start Date", types: ["date"] },
        { name: "End Date", types: ["date"] },
        { name: "Status", types: ["text"] },
        { name: "Progress", types: ["text"] }
      ],
      "inventory-tracker": [
        { name: "Item Code", types: ["text", "number"] },
        { name: "Product Name", types: ["text"] },
        { name: "Category", types: ["text"] },
        { name: "Quantity", types: ["number"] },
        { name: "Unit Price", types: ["currency"] },
        { name: "Reorder Level", types: ["number"] },
        { name: "Supplier", types: ["text"] }
      ],
      "contact-list": [
        { name: "Name", types: ["text"] },
        { name: "Email", types: ["email"] },
        { name: "Phone", types: ["text"] },
        { name: "Company", types: ["text"] },
        { name: "Position", types: ["text"] },
        { name: "Notes", types: ["text"] }
      ],
      "sales-tracker": [
        { name: "Date", types: ["date"] },
        { name: "Customer", types: ["text"] },
        { name: "Product", types: ["text"] },
        { name: "Quantity", types: ["number"] },
        { name: "Unit Price", types: ["currency"] },
        { name: "Total", types: ["currency"] },
        { name: "Status", types: ["text"] },
        { name: "Sales Rep", types: ["text"] }
      ],
      "employee-schedule": [
        { name: "Employee", types: ["text"] },
        { name: "Monday", types: ["text"] },
        { name: "Tuesday", types: ["text"] },
        { name: "Wednesday", types: ["text"] },
        { name: "Thursday", types: ["text"] },
        { name: "Friday", types: ["text"] },
        { name: "Weekend", types: ["text"] },
        { name: "Total Hours", types: ["number"] }
      ],
      "expense-report": [
        { name: "Date", types: ["date"] },
        { name: "Vendor", types: ["text"] },
        { name: "Item description", types: ["text"] },
        { name: "Amount", types: ["currency"] },
        { name: "Payment type", types: ["text"] },
        { name: "All expense category", types: ["text"] }
      ],
      "task-list": [
        { name: "Priority", types: ["text"] },
        { name: "Task", types: ["text"] },
        { name: "Description", types: ["text"] },
        { name: "Assigned To", types: ["text"] },
        { name: "Due Date", types: ["date"] },
        { name: "Status", types: ["text"] },
        { name: "Notes", types: ["text"] }
      ],
      "invoice-template": [
        { name: "Item", types: ["text"] },
        { name: "Description", types: ["text"] },
        { name: "Quantity", types: ["number"] },
        { name: "Unit Price", types: ["currency"] },
        { name: "Amount", types: ["currency"] }
      ],
      "attendance-tracker": [
        { name: "Employee Name", types: ["text"] },
        { name: "Employee ID", types: ["text", "number"] },
        { name: "Date", types: ["date"] },
        { name: "Check In", types: ["text"] },
        { name: "Check Out", types: ["text"] },
        { name: "Status", types: ["text"] },
        { name: "Hours Worked", types: ["number"] }
      ]
    };

    return typeDefinitions[templateId] || [];
  };

  const createSheetFromTemplate = async (templateId: string) => {
    // Optimistic UI: Create temporary sheet immediately
    const tempId = `temp-${Date.now()}`;
    const customTemplate = customTemplates.find(t => t.id === templateId);
    const templateName = customTemplate?.name || templateId.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');

    const tempSheet: GoogleSheet = {
      id: tempId,
      name: `Creating "${templateName}"...`,
      webViewLink: ''
    };

    // Show temp sheet immediately for better UX
    setSheets((prev) => [tempSheet, ...prev]);
    setSelectedSheet(tempSheet);
    setShowTemplateMenu(false);
    setShowTemplateDialog(false);

    try {
      // Prepare template data
      let templateData: string[][];
      let columnTypes: any[] = [];

      if (customTemplate) {
        // Build template data from custom template
        const headerRow = customTemplate.columns.map((col: any) => col.name);
        templateData = [headerRow, ...customTemplate.sampleRows];
        
        // Extract column types from custom template
        columnTypes = customTemplate.columns.map((col: any) => ({
          name: col.name,
          types: col.types || [col.type]
        }));
        
        console.log('Custom template column types:', columnTypes);
      } else {
        // Use predefined template
        templateData = getTemplateData(templateId);
        
        // Get predefined template column types
        columnTypes = getPredefinedTemplateTypes(templateId);
        console.log('Predefined template column types:', columnTypes);
      }
      
      const res = await fetch(`${apiBase}/google/sheets/create`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: templateName,
          templateData,
          columnTypes
        })
      });

      if (res.status === 401) {
        // Remove temp sheet on auth error
        setSheets((prev) => prev.filter(s => s.id !== tempId));
        setSelectedSheet(null);
        window.location.href = `${apiBase}/google/auth`;
        return;
      }

      const newSheet = await res.json();

      if (!res.ok) {
        throw new Error(newSheet.error || "Failed to create spreadsheet");
      }

      // Replace temp sheet with real sheet
      setSheets((prev) => prev.map(s => s.id === tempId ? newSheet : s));
      setSelectedSheet(newSheet);
    } catch (err) {
      console.error("Error creating sheet:", err);
      // Remove temp sheet on error
      setSheets((prev) => prev.filter(s => s.id !== tempId));
      setSelectedSheet(null);
      alert("Something went wrong while creating a spreadsheet.");
    }
  };

  const handleSaveCustomTemplate = (template: any) => {
    const newTemplate = {
      id: editingCustomTemplate?.id || `custom-${Date.now()}`,
      name: template.name,
      description: template.description,
      category: template.category,
      thumbnail: template.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2),
      isCustom: true,
      columns: template.columns,
      sampleRows: template.sampleRows
    };

    let updatedTemplates;
    if (editingCustomTemplate) {
      // Update existing template
      updatedTemplates = customTemplates.map(t => 
        t.id === editingCustomTemplate.id ? newTemplate : t
      );
    } else {
      // Add new template
      updatedTemplates = [...customTemplates, newTemplate];
    }

    setCustomTemplates(updatedTemplates);
    // Remove redundant save - handled by debounced useEffect
    setShowCustomTemplateBuilder(false);
    setEditingCustomTemplate(null);
    
    // Reopen the template dialog to show updated templates
    setShowTemplateDialog(true);
    
    alert(`Template "${template.name}" saved successfully!`);
  };

  const handleEditCustomTemplate = (templateId: string) => {
    const template = customTemplates.find(t => t.id === templateId);
    if (template) {
      setEditingCustomTemplate(template);
      setShowTemplateDialog(false);
      setShowCustomTemplateBuilder(true);
    }
  };

  const handleDeleteCustomTemplate = (templateId: string) => {
    const updatedTemplates = customTemplates.filter(t => t.id !== templateId);
    setCustomTemplates(updatedTemplates);
    // Remove redundant save - handled by debounced useEffect
    alert("Template deleted successfully!");
  };

  const handleDeleteSheet = async (sheetId: string, sheetName: string) => {
    if (!confirm(`Are you sure you want to delete "${sheetName}"?`)) return;
    
    try {
      const res = await fetch(`${apiBase}/google/sheets/${sheetId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSheets((prev) => prev.filter((sheet) => sheet.id !== sheetId));
        if (selectedSheet?.id === sheetId) {
          setSelectedSheet(sheets[0] || null);
        }
        alert("Spreadsheet deleted successfully");
      } else {
        // Try to get error details
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("Delete error response:", errorData);
        alert(`Failed to delete spreadsheet: ${errorData.details || errorData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error deleting sheet:", err);
      alert(`Failed to delete spreadsheet: ${err instanceof Error ? err.message : "Network error"}`);
    }
    setActiveSheetMenu(null);
  };

  const handleDuplicateSheet = async (sheetId: string, sheetName: string) => {
    // Optimistic UI: Show "Duplicating..." message
    const tempId = `temp-duplicate-${Date.now()}`;
    const tempSheet: GoogleSheet = {
      id: tempId,
      name: `Duplicating "${sheetName}"...`,
      webViewLink: ''
    };

    setSheets((prev) => [tempSheet, ...prev]);
    setActiveSheetMenu(null);

    try {
      const res = await fetch(`${apiBase}/google/sheets/${sheetId}/duplicate`, {
        method: "POST",
      });

      if (res.ok) {
        const duplicatedSheet = await res.json();
        
        // Replace temp sheet with actual duplicated sheet
        setSheets((prev) => prev.map(s => 
          s.id === tempId ? duplicatedSheet : s
        ));
        
        // Select the new duplicated sheet
        setSelectedSheet(duplicatedSheet);
        
        alert(`"${sheetName}" duplicated successfully!`);
      } else {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("Duplicate error response:", errorData);
        
        // Remove temp sheet on error
        setSheets((prev) => prev.filter(s => s.id !== tempId));
        
        alert(`Failed to duplicate spreadsheet: ${errorData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error duplicating sheet:", err);
      
      // Remove temp sheet on error
      setSheets((prev) => prev.filter(s => s.id !== tempId));
      
      alert(`Failed to duplicate spreadsheet: ${err instanceof Error ? err.message : "Network error"}`);
    }
  };

  const handleRenameSheet = async (sheetId: string) => {
    if (!renameValue.trim()) return;
    
    try {
      const res = await fetch(`${apiBase}/google/sheets/${sheetId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: renameValue }),
      });

      if (res.ok) {
        const updatedSheet = await res.json();
        setSheets((prev) =>
          prev.map((sheet) =>
            sheet.id === sheetId ? { ...sheet, name: updatedSheet.name } : sheet
          )
        );
        if (selectedSheet?.id === sheetId) {
          setSelectedSheet({ ...selectedSheet, name: updatedSheet.name });
        }
      }
    } catch (err) {
      console.error("Error renaming sheet:", err);
      alert("Failed to rename spreadsheet");
    }
    setRenamingSheet(null);
    setRenameValue("");
    setActiveSheetMenu(null);
  };

  const handleShowInfo = (sheet: GoogleSheet) => {
    alert(`Spreadsheet Information:\n\nName: ${sheet.name}\nID: ${sheet.id}\nLink: ${sheet.webViewLink}`);
    setActiveSheetMenu(null);
  };

  const handleOpenShareModal = async (sheet: GoogleSheet) => {
    setSharingSheet(sheet);
    setActiveSheetMenu(null);
    
    try {
      const res = await fetch(`${apiBase}/google/sheets/${sheet.id}/permissions`);
      if (res.ok) {
        const data = await res.json();
        setCollaborators(data.permissions || []);
      }
    } catch (err) {
      console.error("Error fetching collaborators:", err);
    }
    
    setShowShareModal(true);
  };

  const handleShareSheet = async () => {
    if (!sharingSheet || !shareEmail.trim()) {
      alert("Please enter an email address");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/google/sheets/${sharingSheet.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: shareEmail,
          role: shareRole,
          type: "user"
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Successfully shared with ${shareEmail}`);
        setShareEmail("");
        
        const permRes = await fetch(`${apiBase}/google/sheets/${sharingSheet.id}/permissions`);
        if (permRes.ok) {
          const permData = await permRes.json();
          setCollaborators(permData.permissions || []);
        }
      } else {
        const errorMsg = data.error || "Failed to share spreadsheet";
        if (errorMsg.includes("insufficient") || errorMsg.includes("permission")) {
          alert("❌ Insufficient permissions!\n\nYou need to reconnect your Google account with full Drive access.\n\nClick OK, then click 'Connect your Google account' to re-authorize.");
          setShowShareModal(false);
          window.location.href = `${apiBase}/google/auth`;
        } else {
          alert(`Failed to share: ${errorMsg}\n\nPlease check the email address and try again.`);
        }
      }
    } catch (err) {
      console.error("Error sharing sheet:", err);
      alert("An error occurred while sharing the spreadsheet. Check console for details.");
    }
  };

  const handleRemoveCollaborator = async (permissionId: string, email: string) => {
    if (!sharingSheet) return;
    
    if (!confirm(`Remove access for ${email}?`)) return;

    try {
      const res = await fetch(
        `${apiBase}/google/sheets/${sharingSheet.id}/permissions/${permissionId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setCollaborators(prev => prev.filter(c => c.id !== permissionId));
        alert("Collaborator removed successfully");
      }
    } catch (err) {
      console.error("Error removing collaborator:", err);
      alert("Failed to remove collaborator");
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "owner": return "Owner";
      case "writer": return "Editor";
      case "commenter": return "Commenter";
      case "reader": return "Viewer";
      default: return role;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner": return "bg-purple-100 text-purple-700";
      case "writer": return "bg-green-100 text-green-700";
      case "commenter": return "bg-blue-100 text-blue-700";
      case "reader": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleSubmitForApproval = async () => {
    if (!selectedSheet || approvers.length === 0) {
      alert("Please add at least one approver");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/google/sheets/${selectedSheet.id}/submit-approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submittedBy: userEmail,
          approvers: approvers.map(a => a.email),
          message: approvalMessage,
          dueDate: dueDate || null,
          allowEdits,
          lockFile,
        }),
      });

      if (res.ok) {
        alert("Spreadsheet submitted for approval!");
        setShowApprovalModal(false);
        setApprovers([]);
        setApproverEmail("");
        setApprovalMessage("Please could you take a look over this?");
        setDueDate("");
        setShowDueDatePicker(false);
        setAllowEdits(false);
        setLockFile(true);
        
        const statusRes = await fetch(`${apiBase}/google/sheets/${selectedSheet.id}/approval-status`);
        if (statusRes.ok) {
          const data = await statusRes.json();
          setApprovalStatus(data);
        }
      }
    } catch (err) {
      console.error("Error submitting for approval:", err);
      alert("Failed to submit for approval");
    }
  };

  const handleApprove = async () => {
    if (!selectedSheet) return;

    const makeReadOnly = confirm(
      "Do you want to make this spreadsheet read-only after approval?\n\n" +
      "Click OK to make it read-only (recommended)\n" +
      "Click Cancel to keep edit permissions"
    );

    try {
      const res = await fetch(`${apiBase}/google/sheets/${selectedSheet.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvedBy: userEmail,
          makeReadOnly,
        }),
      });

      if (res.ok) {
        alert("Spreadsheet approved successfully!");
        
        const statusRes = await fetch(`${apiBase}/google/sheets/${selectedSheet.id}/approval-status`);
        if (statusRes.ok) {
          const data = await statusRes.json();
          setApprovalStatus(data);
        }
      }
    } catch (err) {
      console.error("Error approving sheet:", err);
      alert("Failed to approve spreadsheet");
    }
  };

  const handleReject = async () => {
    if (!selectedSheet) return;

    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      const res = await fetch(`${apiBase}/google/sheets/${selectedSheet.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rejectedBy: userEmail,
          reason,
        }),
      });

      if (res.ok) {
        alert("Spreadsheet rejected");
        
        const statusRes = await fetch(`${apiBase}/google/sheets/${selectedSheet.id}/approval-status`);
        if (statusRes.ok) {
          const data = await statusRes.json();
          setApprovalStatus(data);
        }
      }
    } catch (err) {
      console.error("Error rejecting sheet:", err);
      alert("Failed to reject spreadsheet");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: { color: "bg-gray-100 text-gray-700", text: "📝 Draft" },
      pending: { color: "bg-yellow-100 text-yellow-700", text: "⏳ Pending Approval" },
      approved: { color: "bg-green-100 text-green-700", text: "✅ Approved" },
      rejected: { color: "bg-red-100 text-red-700", text: "❌ Rejected" },
    };
    return badges[status as keyof typeof badges] || badges.draft;
  };

  if (loading) return <div className="p-6">Loading spreadsheets...</div>;
  if (error)
    return (
      <div className="p-6 text-red-600">
        ⚠️ {error}. <br />
        <a
          href={`${apiBase}/google/auth`}
          className="text-green-600 underline"
        >
          Connect your Google account
        </a>
      </div>
    );

  return (
    <div className="flex h-full w-full">
      {/* Left panel - Sheet List */}
      {showSheetList && (
        <>
          <div 
            className="border-r bg-white flex flex-col h-screen flex-shrink-0 relative"
            style={{ width: `${sidebarWidth}px` }}
          >
            <div className="p-4 border-b flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">My Spreadsheets</h2>
              <div className="flex items-center gap-2">
                <div className="relative" ref={menuRef}>
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                    onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                  >
                    + New
                    <span className="text-xs">{showTemplateMenu ? '▲' : '▼'}</span>
                  </button>
                
                {showTemplateMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-2">
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-green-50 text-sm text-gray-700 transition-colors flex items-center gap-3"
                        onClick={() => {
                          createSheetFromTemplate("Blank Spreadsheet");
                          setShowTemplateMenu(false);
                        }}
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                        <span className="font-medium">Blank Spreadsheet</span>
                      </button>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-green-50 text-sm text-gray-700 transition-colors flex items-center gap-3"
                        onClick={() => {
                          setShowTemplateMenu(false);
                          setShowTemplateDialog(true);
                        }}
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="font-medium">Choose from Template</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>

        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-4">
            {sheets.map((sheet) => (
              <li
                key={sheet.id}
                className={`group relative p-2 cursor-pointer rounded text-sm flex items-center justify-between ${
                  selectedSheet?.id === sheet.id ? "bg-green-100" : "hover:bg-gray-100"
                }`}
              >
                {renamingSheet === sheet.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameSheet(sheet.id);
                        if (e.key === "Escape") {
                          setRenamingSheet(null);
                          setRenameValue("");
                        }
                      }}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                      autoFocus
                    />
                    <button
                      onClick={() => handleRenameSheet(sheet.id)}
                      className="text-green-600 hover:text-green-700 text-xs"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => {
                        setRenamingSheet(null);
                        setRenameValue("");
                      }}
                      className="text-red-600 hover:text-red-700 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className="flex-1 truncate"
                      onClick={() => setSelectedSheet(sheet)}
                    >
                      {sheet.name}
                    </span>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSheetMenu(activeSheetMenu === sheet.id ? null : sheet.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 px-2 py-1 hover:bg-gray-200 rounded transition-opacity"
                      >
                        ⋮
                      </button>
                      
                      {activeSheetMenu === sheet.id && (
                        <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSheet(sheet);
                              setShowApprovalModal(true);
                              setActiveSheetMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                          >
                            <span>📋</span> Submit for Approval
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenShareModal(sheet);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                          >
                            <span>👥</span> Share
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateSheet(sheet.id, sheet.name);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                          >
                            <span>📄</span> Duplicate
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRenameValue(sheet.name);
                              setRenamingSheet(sheet.id);
                              setActiveSheetMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                          >
                            <span>✏️</span> Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowInfo(sheet);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                          >
                            <span>ℹ️</span> Info
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSheet(sheet.id, sheet.name);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 flex items-center gap-2"
                          >
                            <span>🗑️</span> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Resize Handle */}
      <div
        className="w-1 bg-gray-200 hover:bg-green-500 cursor-col-resize transition-colors relative group"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
          <div className="w-1 h-12 bg-gray-400 group-hover:bg-green-600 rounded-full transition-colors"></div>
        </div>
      </div>
      </>
      )}

      {!showSheetList && (
        <button
          onClick={() => setShowSheetList(true)}
          className="fixed left-4 top-20 bg-green-600 text-white px-4 py-3 rounded-lg shadow-2xl hover:bg-green-700 z-50 flex items-center gap-2 font-medium"
          title="Show spreadsheet list"
        >
          <span className="text-xl">☰</span>
          <span>Show Sheets</span>
        </button>
      )}

      {/* Center panel - Sheet Viewer */}
      <div className="flex-1 bg-gray-50 relative flex flex-col min-w-0">
        {/* Socket.IO Connection Status */}
        <div className={`px-4 py-2 text-xs flex items-center justify-between border-b ${
          socketConnected ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span>{socketConnected ? '✓ Real-time sync active' : '⚠ Disconnected - Reconnecting...'}</span>
            </div>
            {lastUpdate && (
              <span className="text-gray-600 flex items-center gap-1">
                {isRefreshing && <span className="animate-spin">⟳</span>}
                Last update: {lastUpdate}
              </span>
            )}
          </div>
          <button
            onClick={() => setShowChartPanel(!showChartPanel)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              showChartPanel
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showChartPanel ? '📊 Hide Chart' : '📊 Show Chart'}
          </button>
        </div>

        {selectedSheet && approvalStatus && approvalStatus.status !== "draft" && (
          <div className={`px-6 py-3 border-b flex items-center justify-between ${
            approvalStatus.isReadOnly ? 'bg-green-50' : 'bg-white'
          }`}>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(approvalStatus.status).color}`}>
                {getStatusBadge(approvalStatus.status).text}
              </span>
              
              {approvalStatus.status === "pending" && approvalStatus.approvers && approvalStatus.approvers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Approvers:</span>
                  <div className="flex gap-1">
                    {approvalStatus.approvers.slice(0, 3).map((email, index) => (
                      <div key={index} className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {getInitials(email)}
                      </div>
                    ))}
                    {approvalStatus.approvers.length > 3 && (
                      <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        +{approvalStatus.approvers.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {approvalStatus.dueDate && (
                <span className="text-sm text-orange-600 flex items-center gap-1">
                  🕐 Due: {formatDueDate(approvalStatus.dueDate)}
                </span>
              )}
              
              {approvalStatus.status === "approved" && approvalStatus.isReadOnly && (
                <span className="text-sm text-green-700 flex items-center gap-2">
                  🔒 Read-only (Approved Spreadsheet)
                </span>
              )}
              
              {approvalStatus.status === "rejected" && approvalStatus.rejectionReason && (
                <span className="text-sm text-red-700">
                  Reason: {approvalStatus.rejectionReason}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {approvalStatus.status === "pending" && isManager && (
                <>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    ✗ Reject
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          {/* Sheet Viewer */}
          <div className={`${showChartPanel ? 'w-1/2' : 'w-full'} relative h-full flex flex-col`}>
            {selectedSheet ? (
              <div className="relative w-full h-full bg-white flex-1">
                <iframe
                  key={`sheet-${selectedSheet.id}-${showSheetList}`}
                  src={selectedSheet.webViewLink}
                  title={selectedSheet.name}
                  className="w-full h-full border-none"
                  allow="clipboard-read; clipboard-write"
                  style={{ minHeight: '100%', display: 'block' }}
                ></iframe>
                <div className="absolute top-0 right-0 w-48 h-16 bg-white pointer-events-none z-10"></div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 bg-white">
                <div className="text-center">
                  <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="mt-4 text-lg font-medium">No spreadsheet selected</p>
                  <p className="mt-2 text-sm text-gray-400">
                    {!showSheetList ? 'Click "☰ Show Sheets" to select a spreadsheet' : 'Select a spreadsheet from the list'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Chart Panel */}
          {showChartPanel && (
            <div className="w-1/2 border-l bg-gray-50 p-4">
              {selectedSheet && chartData.length > 0 ? (
                <SheetChart
                  spreadsheetId={selectedSheet.id}
                  data={chartData}
                  chartType={chartType}
                  onChartTypeChange={setChartType}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="mt-2">Loading chart data...</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && sharingSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Share "{sharingSheet.name}"</h2>
                <p className="text-sm text-gray-500 mt-1">Collaborate with others on this spreadsheet</p>
              </div>
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setSharingSheet(null);
                  setShareEmail("");
                  setCollaborators([]);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add people
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleShareSheet();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  />
                  <select
                    value={shareRole}
                    onChange={(e) => setShareRole(e.target.value as "reader" | "commenter" | "writer")}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  >
                    <option value="writer">Editor</option>
                    <option value="commenter">Commenter</option>
                    <option value="reader">Viewer</option>
                  </select>
                  <button
                    onClick={handleShareSheet}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Share
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  An email notification will be sent to the collaborator
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  People with access ({collaborators.length})
                </h3>
                <div className="space-y-2">
                  {collaborators.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4 text-center">
                      No collaborators yet. Add someone to get started!
                    </p>
                  ) : (
                    collaborators.map((collab) => (
                      <div
                        key={collab.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {collab.displayName?.[0]?.toUpperCase() || collab.emailAddress?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {collab.displayName || collab.emailAddress || "Unknown"}
                            </p>
                            {collab.emailAddress && collab.displayName && (
                              <p className="text-xs text-gray-500">{collab.emailAddress}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(collab.role)}`}>
                            {getRoleLabel(collab.role)}
                          </span>
                          {collab.role !== "owner" && (
                            <button
                              onClick={() => handleRemoveCollaborator(collab.id, collab.emailAddress || "this user")}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Remove access"
                            >
                              <span className="text-lg">🗑️</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Link to spreadsheet</h3>
                    <p className="text-xs text-gray-500 mt-1">Anyone with the link can view</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(sharingSheet.webViewLink);
                      alert("Link copied to clipboard!");
                    }}
                    className="px-4 py-2 text-green-600 border border-green-600 rounded hover:bg-green-50 transition-colors text-sm"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setSharingSheet(null);
                  setShareEmail("");
                  setCollaborators([]);
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">👤</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Request approval</h2>
              </div>
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovers([]);
                  setApproverEmail("");
                  setApprovalMessage("Please could you take a look over this?");
                  setDueDate("");
                  setShowDueDatePicker(false);
                  setAllowEdits(false);
                  setLockFile(true);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add approvers
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={approverEmail}
                      onChange={(e) => setApproverEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addApprover();
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    />
                    <button
                      onClick={addApprover}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  {approvers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {approvers.map((approver) => (
                        <div
                          key={approver.id}
                          className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {getInitials(approver.email)}
                          </div>
                          <span>{approver.email}</span>
                          <button
                            onClick={() => removeApprover(approver.id)}
                            className="text-green-600 hover:text-green-800 ml-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {approvers.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Everyone will need to approve the request
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optional)
                  <span className="text-xs text-gray-500 ml-2">Type @ to insert variables</span>
                </label>
                <div className="relative">
                  <SmartInput
                    value={approvalMessage}
                    onChange={setApprovalMessage}
                    placeholder="Add a message for the approvers... Type @ to insert variables"
                    multiline={true}
                  />
                  {approvalMessage && (
                    <button
                      onClick={() => setApprovalMessage("")}
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div>
                <button
                  onClick={() => setShowDueDatePicker(!showDueDatePicker)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-600">🕐</span>
                  <span className="text-sm">
                    {dueDate ? formatDueDate(dueDate) : "Add due date"}
                  </span>
                </button>
                
                {showDueDatePicker && (
                  <div className="mt-2">
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allowEdits"
                    checked={allowEdits}
                    onChange={(e) => setAllowEdits(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="allowEdits" className="text-sm text-gray-700">
                    Allow approvers to edit this file
                  </label>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="lockFile"
                    checked={lockFile}
                    onChange={(e) => setLockFile(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="lockFile" className="text-sm text-gray-700">
                    Lock file before sending approval request
                  </label>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs">👤</span>
                  </div>
                  <p className="text-sm text-green-800">
                    Edits during the approval process will reset any recorded approvals.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
              <a
                href="#"
                className="text-sm text-green-600 hover:text-green-800"
                onClick={(e) => e.preventDefault()}
              >
                Send feedback to Grow24.ai
              </a>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setApprovers([]);
                    setApproverEmail("");
                    setApprovalMessage("Please could you take a look over this?");
                    setDueDate("");
                    setShowDueDatePicker(false);
                    setAllowEdits(false);
                    setLockFile(true);
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitForApproval}
                  disabled={approvers.length === 0}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Send request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lazy-loaded components wrapped in Suspense for better performance */}
      {showTemplateDialog && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading templates...</p>
            </div>
          </div>
        }>
          <TemplateDialog
            isOpen={showTemplateDialog}
            onClose={() => setShowTemplateDialog(false)}
            onSelectTemplate={(templateId) => {
              createSheetFromTemplate(templateId);
              setShowTemplateDialog(false);
            }}
            customTemplates={customTemplates}
            onEditCustomTemplate={handleEditCustomTemplate}
            onDeleteCustomTemplate={handleDeleteCustomTemplate}
            onCreateCustomTemplate={() => {
              setShowTemplateDialog(false);
              setShowCustomTemplateBuilder(true);
            }}
          />
        </Suspense>
      )}

      {showCustomTemplateBuilder && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading template builder...</p>
            </div>
          </div>
        }>
          <CustomTemplateBuilder
            isOpen={showCustomTemplateBuilder}
            onClose={() => {
              setShowCustomTemplateBuilder(false);
              setEditingCustomTemplate(null);
            }}
            onSave={handleSaveCustomTemplate}
            editTemplate={editingCustomTemplate}
          />
        </Suspense>
      )}

        {/* Sheet Validation */}
        <SheetValidator 
          data={chartData}
          onValidationComplete={(results) => {
            console.log('Validation results:', results);
          }}
        />
    </div>
  );
}
