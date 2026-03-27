import { useEffect, useState, useRef } from "react";
import TemplateDialog from "../components/TemplateDialog";
import CustomFormBuilder from "../components/CustomFormBuilder";

interface GoogleForm {
  id: string;
  name: string;
  webViewLink: string;
  editLink?: string;
  responderUri?: string;
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
  approvers: string[];
  dueDate: string | null;
  isReadOnly: boolean;
}

interface Approver {
  email: string;
  name: string;
}

interface FormItem {
  itemId: string;
  title?: string;
  description?: string;
  questionItem?: {
    question: {
      questionId: string;
      required: boolean;
      choiceQuestion?: {
        type: string;
        options: Array<{ value: string }>;
      };
      textQuestion?: {
        paragraph: boolean;
      };
      scaleQuestion?: {
        low: number;
        high: number;
      };
      dateQuestion?: any;
      timeQuestion?: any;
    };
  };
  textItem?: {
    text: string;
  };
  imageItem?: any;
  videoItem?: any;
  pageBreakItem?: any;
}

interface FormDetails {
  formId: string;
  info: {
    title: string;
    description?: string;
  };
  items: FormItem[];
  settings: any;
}

export default function Forms() {
  const [forms, setForms] = useState<GoogleForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<GoogleForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showCustomFormBuilder, setShowCustomFormBuilder] = useState(false);
  const [editingCustomTemplate, setEditingCustomTemplate] = useState<any>(null);
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);
  const [activeFormMenu, setActiveFormMenu] = useState<string | null>(null);
  const [renamingForm, setRenamingForm] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareRole, setShareRole] = useState<"reader" | "commenter" | "writer">("writer");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [sharingForm, setSharingForm] = useState<GoogleForm | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [approverEmail, setApproverEmail] = useState("");
  const [approvalMessage, setApprovalMessage] = useState("Please review this form and provide your approval.");
  const [dueDate, setDueDate] = useState("");
  const [allowEdits, setAllowEdits] = useState(false);
  const [lockFile, setLockFile] = useState(true);
  const [userEmail] = useState("Grow24.ai");
  const [isManager] = useState(true);
  const [isAdmin] = useState(true);
  const [showFormList, setShowFormList] = useState(true);
  const [viewMode, setViewMode] = useState<"view" | "edit">("view");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [formDetails, setFormDetails] = useState<FormDetails | null>(null);
  const [loadingFormDetails, setLoadingFormDetails] = useState(false);

  const apiBase = import.meta.env.VITE_API_BASE_URL;

  // Load custom templates from localStorage
  useEffect(() => {
    const savedTemplates = localStorage.getItem('customFormTemplates');
    if (savedTemplates) {
      setCustomTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch(`${apiBase}/google/forms/list`);
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Not authorized. Please connect your Google account.");
          }
          throw new Error("Failed to fetch forms");
        }

        setForms(data.files || []);
        if (data.files && data.files.length > 0 && !selectedForm) {
          setSelectedForm(data.files[0]);
        }
      } catch (err: any) {
        setError(err.message);
        if (err.message.includes("Not authorized")) {
          window.location.href = `${apiBase}/google/auth`;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [apiBase, selectedForm]);

  // Fetch approval status when a form is selected
  useEffect(() => {
    const fetchApprovalStatus = async () => {
      if (!selectedForm) return;
      
      try {
        const res = await fetch(`${apiBase}/google/forms/${selectedForm.id}/approval-status`);
        if (res.ok) {
          const data = await res.json();
          setApprovalStatus(data);
        }
      } catch (err) {
        console.error("Error fetching approval status:", err);
      }
    };

    fetchApprovalStatus();
  }, [selectedForm, apiBase]);

  // Fetch form details when in edit mode
  useEffect(() => {
    const fetchFormDetails = async () => {
      if (!selectedForm || viewMode !== "edit") {
        setFormDetails(null);
        return;
      }
      
      setLoadingFormDetails(true);
      try {
        const res = await fetch(`${apiBase}/google/forms/${selectedForm.id}`);
        if (res.ok) {
          const data = await res.json();
          setFormDetails(data);
        }
      } catch (err) {
        console.error("Error fetching form details:", err);
      } finally {
        setLoadingFormDetails(false);
      }
    };

    fetchFormDetails();
  }, [selectedForm, viewMode, apiBase]);

  const getTemplateQuestions = (templateId: string) => {
    const templates: Record<string, any[]> = {
      "customer-feedback": [
        { 
          title: "How satisfied are you with our service?", 
          type: "scaleQuestion", 
          required: true,
          options: {
            low: 1,
            high: 5,
            lowLabel: "Not Satisfied",
            highLabel: "Very Satisfied"
          }
        },
        { title: "What did you like most?", type: "textQuestion", required: false },
        { 
          title: "How likely are you to recommend us?", 
          type: "scaleQuestion", 
          required: true,
          options: {
            low: 1,
            high: 10,
            lowLabel: "Not Likely",
            highLabel: "Very Likely"
          }
        },
      ],
      "event-registration": [
        { title: "Full Name", type: "textQuestion", required: true },
        { title: "Email Address", type: "textQuestion", required: true },
        { 
          title: "Will you attend?", 
          type: "choiceQuestion", 
          required: true, 
          options: { 
            type: "RADIO",
            options: [
              { value: "Yes" }, 
              { value: "No" }, 
              { value: "Maybe" }
            ] 
          } 
        },
      ],
      "job-application": [
        { title: "Full Name", type: "textQuestion", required: true },
        { title: "Email", type: "textQuestion", required: true },
        { title: "Phone Number", type: "textQuestion", required: true },
        { title: "Tell us about yourself", type: "textQuestion", required: true, options: { paragraph: true } },
      ],
      "contact-form": [
        { title: "Name", type: "textQuestion", required: true },
        { title: "Email", type: "textQuestion", required: true },
        { title: "Subject", type: "textQuestion", required: true },
        { title: "Message", type: "textQuestion", required: true, options: { paragraph: true } },
      ],
      "quiz-assessment": [
        { 
          title: "Question 1", 
          type: "choiceQuestion", 
          required: true, 
          options: { 
            type: "RADIO",
            options: [
              { value: "Option A" }, 
              { value: "Option B" }, 
              { value: "Option C" }
            ] 
          } 
        },
        { 
          title: "Question 2", 
          type: "choiceQuestion", 
          required: true, 
          options: { 
            type: "RADIO",
            options: [
              { value: "Option A" }, 
              { value: "Option B" }, 
              { value: "Option C" }
            ] 
          } 
        },
      ],
      "order-form": [
        { title: "Product Name", type: "textQuestion", required: true },
        { title: "Quantity", type: "textQuestion", required: true },
        { title: "Delivery Address", type: "textQuestion", required: true, options: { paragraph: true } },
      ],
      "feedback-request": [
        { title: "What went well?", type: "textQuestion", required: true, options: { paragraph: true } },
        { title: "What could be improved?", type: "textQuestion", required: true, options: { paragraph: true } },
        { title: "Additional comments", type: "textQuestion", required: false, options: { paragraph: true } },
      ],
      "meeting-rsvp": [
        { title: "Name", type: "textQuestion", required: true },
        { 
          title: "Will you attend?", 
          type: "choiceQuestion", 
          required: true, 
          options: { 
            type: "RADIO",
            options: [
              { value: "Yes" }, 
              { value: "No" }
            ] 
          } 
        },
        { title: "Dietary restrictions", type: "textQuestion", required: false },
      ],
      "product-survey": [
        { title: "Which product did you purchase?", type: "textQuestion", required: true },
        { 
          title: "How satisfied are you?", 
          type: "scaleQuestion", 
          required: true,
          options: {
            low: 1,
            high: 5,
            lowLabel: "Not Satisfied",
            highLabel: "Very Satisfied"
          }
        },
        { title: "What features would you like to see?", type: "textQuestion", required: false, options: { paragraph: true } },
      ],
      "employee-evaluation": [
        { title: "Employee Name", type: "textQuestion", required: true },
        { 
          title: "Performance Rating", 
          type: "scaleQuestion", 
          required: true,
          options: {
            low: 1,
            high: 5,
            lowLabel: "Needs Improvement",
            highLabel: "Excellent"
          }
        },
        { title: "Strengths", type: "textQuestion", required: true, options: { paragraph: true } },
        { title: "Areas for Improvement", type: "textQuestion", required: true, options: { paragraph: true } },
      ],
    };

    return templates[templateId] || [];
  };

  const handleAuthenticateInNewTab = (formUrl: string) => {
    setIsAuthenticating(true);
    // Open in new tab for authentication
    const authWindow = window.open(formUrl, '_blank');
    
    // Check if user has authenticated (they'll close the tab when done)
    const checkAuth = setInterval(() => {
      if (authWindow?.closed) {
        clearInterval(checkAuth);
        setIsAuthenticating(false);
        // Reload the iframe
        if (selectedForm) {
          const tempForm = selectedForm;
          setSelectedForm(null);
          setTimeout(() => setSelectedForm(tempForm), 100);
        }
      }
    }, 500);
    
    // Timeout after 5 minutes
    setTimeout(() => {
      clearInterval(checkAuth);
      setIsAuthenticating(false);
    }, 300000);
  };

  const createFormFromTemplate = async (templateId: string) => {
    try {
      const customTemplate = customTemplates.find(t => t.id === templateId);
      let questions: any[];
      let formTitle: string;
      let formDescription: string;

      if (customTemplate) {
        formTitle = customTemplate.name;
        formDescription = customTemplate.description;
        questions = customTemplate.questions;
      } else {
        questions = getTemplateQuestions(templateId);
        formTitle = templateId.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        formDescription = "Created from template";
      }
      
      const res = await fetch(`${apiBase}/google/forms/create`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: formTitle,
          description: formDescription,
          questions: questions
        })
      });
      const newForm = await res.json();

      if (res.status === 401) {
        window.location.href = `${apiBase}/google/auth`;
        return;
      }
      if (!res.ok) throw new Error("Failed to create form");

      setForms((prev) => [newForm, ...prev]);
      setSelectedForm(newForm);
      setViewMode("edit"); // Open in edit mode for new forms
      setShowTemplateMenu(false);
      setShowTemplateDialog(false);
    } catch (err) {
      console.error("Error creating form:", err);
      alert("Something went wrong while creating a form.");
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
      questions: template.questions
    };

    let updatedTemplates;
    if (editingCustomTemplate) {
      updatedTemplates = customTemplates.map(t => 
        t.id === editingCustomTemplate.id ? newTemplate : t
      );
    } else {
      updatedTemplates = [...customTemplates, newTemplate];
    }

    setCustomTemplates(updatedTemplates);
    localStorage.setItem('customFormTemplates', JSON.stringify(updatedTemplates));
    setShowCustomFormBuilder(false);
    setEditingCustomTemplate(null);
    setShowTemplateDialog(true);
    
    alert(`Template "${template.name}" saved successfully!`);
  };

  const handleEditCustomTemplate = (templateId: string) => {
    const template = customTemplates.find(t => t.id === templateId);
    if (template) {
      setEditingCustomTemplate(template);
      setShowTemplateDialog(false);
      setShowCustomFormBuilder(true);
    }
  };

  const handleDeleteCustomTemplate = (templateId: string) => {
    const updatedTemplates = customTemplates.filter(t => t.id !== templateId);
    setCustomTemplates(updatedTemplates);
    localStorage.setItem('customFormTemplates', JSON.stringify(updatedTemplates));
    alert("Template deleted successfully!");
  };

  const handleDeleteForm = async (formId: string, formName: string) => {
    if (!confirm(`Are you sure you want to delete "${formName}"?`)) return;
    
    try {
      const res = await fetch(`${apiBase}/google/forms/${formId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setForms((prev) => prev.filter((form) => form.id !== formId));
        if (selectedForm?.id === formId) {
          setSelectedForm(forms[0] || null);
        }
        alert("Form deleted successfully");
      } else {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        alert(`Error: ${errorData.error || "Could not delete form"}\n${errorData.details || ""}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting form. Please try again.");
    }
  };

  const startRename = (form: GoogleForm) => {
    setRenamingForm(form.id);
    setRenameValue(form.name);
    setActiveFormMenu(null);
  };

  const saveRename = async (formId: string) => {
    if (!renameValue.trim()) return;
    
    try {
      const res = await fetch(`${apiBase}/google/forms/${formId}/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameValue }),
      });

      if (res.ok) {
        setForms((prev) =>
          prev.map((form) =>
            form.id === formId ? { ...form, name: renameValue } : form
          )
        );
        if (selectedForm?.id === formId) {
          setSelectedForm({ ...selectedForm, name: renameValue });
        }
      }
    } catch (err) {
      console.error("Rename error:", err);
    } finally {
      setRenamingForm(null);
    }
  };

  const handleCopyForm = async (formId: string, formName: string) => {
    setActiveFormMenu(null);
    
    try {
      const res = await fetch(`${apiBase}/google/forms/${formId}/copy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        const copiedForm = await res.json();
        
        // Add the new form to the list immediately so user sees it
        setForms((prev) => [copiedForm, ...prev]);
        
        // Show success message with clear instructions
        alert(`✅ Successfully created: ${copiedForm.name}\n\n⏳ Please wait 5-10 seconds before clicking on the copied form.\n\nGoogle needs a moment to fully publish the form.`);
        
        // Wait for Google to fully process and publish the form (5 seconds)
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        // Refresh the forms list to get updated responderUri
        try {
          const listRes = await fetch(`${apiBase}/google/forms/list`);
          if (listRes.ok) {
            const data = await listRes.json();
            setForms(data.files || []);
            console.log(`✅ Form "${copiedForm.name}" is now ready to view`);
          }
        } catch (refreshErr) {
          console.error("Error refreshing forms:", refreshErr);
        }
      } else {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        alert(`Error: ${errorData.error || "Could not copy form"}\n${errorData.details || ""}`);
      }
    } catch (err) {
      console.error("Copy error:", err);
      alert("Error copying form. Please try again.");
    }
  };

  const openShareModal = async (form: GoogleForm) => {
    setSharingForm(form);
    setShowShareModal(true);
    setActiveFormMenu(null);

    try {
      const res = await fetch(`${apiBase}/google/forms/${form.id}/collaborators`);
      if (res.ok) {
        const data = await res.json();
        setCollaborators(data);
      }
    } catch (err) {
      console.error("Error fetching collaborators:", err);
    }
  };

  const handleShare = async () => {
    if (!sharingForm || !shareEmail.trim()) return;

    try {
      const res = await fetch(`${apiBase}/google/forms/${sharingForm.id}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: shareEmail, role: shareRole }),
      });

      if (res.ok) {
        alert(`Form shared with ${shareEmail}`);
        setShareEmail("");
        
        const collabRes = await fetch(`${apiBase}/google/forms/${sharingForm.id}/collaborators`);
        if (collabRes.ok) {
          const data = await collabRes.json();
          setCollaborators(data);
        }
      }
    } catch (err) {
      console.error("Share error:", err);
      alert("Error sharing form");
    }
  };

  const handleRemoveCollaborator = async (permissionId: string) => {
    if (!sharingForm) return;

    try {
      const res = await fetch(
        `${apiBase}/google/forms/${sharingForm.id}/collaborators/${permissionId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        setCollaborators((prev) => prev.filter((c) => c.id !== permissionId));
        alert("Collaborator removed");
      }
    } catch (err) {
      console.error("Remove collaborator error:", err);
    }
  };

  const handleUpdateCollaboratorRole = async (permissionId: string, newRole: string) => {
    if (!sharingForm) return;

    try {
      const res = await fetch(
        `${apiBase}/google/forms/${sharingForm.id}/collaborators/${permissionId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (res.ok) {
        const updatedPermission = await res.json();
        setCollaborators((prev) =>
          prev.map((c) =>
            c.id === permissionId ? { ...c, role: updatedPermission.role } : c
          )
        );
        alert("Access level updated successfully");
      }
    } catch (err) {
      console.error("Update collaborator role error:", err);
      alert("Failed to update access level");
    }
  };

  const addApprover = () => {
    if (!approverEmail.trim()) return;
    
    const email = approverEmail.trim().toLowerCase();
    if (approvers.some(a => a.email === email)) {
      alert("This approver is already added");
      return;
    }
    
    setApprovers([...approvers, { email, name: email.split('@')[0] }]);
    setApproverEmail("");
  };

  const removeApprover = (email: string) => {
    setApprovers(approvers.filter(a => a.email !== email));
  };

  const handleSubmitForApproval = async () => {
    if (!selectedForm) return;
    if (approvers.length === 0) {
      alert("Please add at least one approver");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/google/forms/${selectedForm.id}/submit-approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvers: approvers.map(a => a.email),
          message: approvalMessage,
          dueDate: dueDate || null,
          allowEdits: allowEdits,
          lockFile: lockFile,
          submittedBy: userEmail,
        }),
      });

      if (res.ok) {
        alert("Form submitted for approval successfully!");
        setShowApprovalModal(false);
        setApprovers([]);
        setApprovalMessage("Please review this form and provide your approval.");
        setDueDate("");
        setApprovalStatus({
          status: "pending",
          submittedBy: userEmail,
          approvers: approvers.map(a => a.email),
          dueDate: dueDate || null,
          isReadOnly: lockFile,
        });
      }
    } catch (err) {
      console.error("Submit approval error:", err);
      alert("Error submitting form for approval");
    }
  };

  const handleApprove = async () => {
    if (!selectedForm) return;
    
    try {
      const res = await fetch(`${apiBase}/google/forms/${selectedForm.id}/approve`, {
        method: "POST",
      });

      if (res.ok) {
        alert("Form approved successfully!");
        setApprovalStatus({
          ...approvalStatus!,
          status: "approved",
          isReadOnly: false,
        });
      }
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const handleReject = async () => {
    if (!selectedForm) return;
    
    const reason = prompt("Reason for rejection (optional):");
    
    try {
      const res = await fetch(`${apiBase}/google/forms/${selectedForm.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (res.ok) {
        alert("Form rejected");
        setApprovalStatus({
          ...approvalStatus!,
          status: "rejected",
          isReadOnly: false,
        });
      }
    } catch (err) {
      console.error("Reject error:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { text: "⏳ Pending Approval", color: "bg-yellow-100 text-yellow-800" };
      case "approved":
        return { text: "✅ Approved", color: "bg-green-100 text-green-800" };
      case "rejected":
        return { text: "❌ Rejected", color: "bg-red-100 text-red-800" };
      default:
        return { text: "📝 Draft", color: "bg-gray-100 text-gray-800" };
    }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading forms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left sidebar - Forms list */}
      {showFormList && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-800">My Forms</h1>
              <div className="relative">
                <button
                  onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm"
                >
                  + New
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showTemplateMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
                    <button
                      onClick={() => {
                        setShowTemplateDialog(true);
                        setShowTemplateMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-800">Start from template</div>
                        <div className="text-xs text-gray-500">Use pre-built forms</div>
                      </div>
                    </button>
                    <button
                      onClick={async () => {
                        setShowTemplateMenu(false);
                        await createFormFromTemplate("blank");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-800">Blank form</div>
                        <div className="text-xs text-gray-500">Start fresh</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {forms.map((form) => (
              <div
                key={form.id}
                className={`relative group rounded-lg p-3 mb-2 cursor-pointer transition-all ${
                  selectedForm?.id === form.id
                    ? "bg-orange-50 border-2 border-orange-300"
                    : "hover:bg-gray-50 border-2 border-transparent"
                }`}
                onClick={() => setSelectedForm(form)}
              >
                {renamingForm === form.id ? (
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => saveRename(form.id)}
                    onKeyDown={(e) => e.key === "Enter" && saveRename(form.id)}
                    className="w-full px-2 py-1 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 truncate">{form.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          📋 Form
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFormMenu(activeFormMenu === form.id ? null : form.id);
                        }}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-opacity"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>

                    {activeFormMenu === form.id && (
                      <>
                        {/* Backdrop to close menu */}
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveFormMenu(null);
                          }}
                        />
                        
                        {/* Menu dropdown */}
                        <div className="absolute right-2 top-12 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedForm(form);
                              setViewMode("edit");
                              setActiveFormMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startRename(form);
                              setActiveFormMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyForm(form.id, form.name);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Make a copy
                          </button>
                          <hr className="my-1 border-gray-200" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openShareModal(form);
                              setActiveFormMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            Share
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowApprovalModal(true);
                              setActiveFormMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Submit for Approval
                          </button>
                          <hr className="my-1 border-gray-200" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteForm(form.id, form.name);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-3 text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle sidebar button */}
      {!showFormList && (
        <button
          onClick={() => setShowFormList(true)}
          className="absolute left-4 top-4 z-10 bg-white border border-gray-300 rounded-lg p-2 shadow-md hover:bg-gray-50"
        >
          ▶
        </button>
      )}

      {/* Center panel - Form Viewer */}
      <div className="flex-1 bg-gray-50 relative flex flex-col">
        {selectedForm && approvalStatus && approvalStatus.status !== "draft" && (
          <div className={`px-6 py-3 border-b flex items-center justify-between ${
            approvalStatus.isReadOnly ? 'bg-orange-50' : 'bg-white'
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
                      <div key={index} className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
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
              
              {approvalStatus.status === "approved" && approvalStatus.isReadOnly && (
                <span className="text-sm text-green-600">🔒 Read-only mode</span>
              )}
            </div>

            {isManager && approvalStatus.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
              </div>
            )}
          </div>
        )}

        {selectedForm ? (
          <div className="flex flex-col h-full">
            <div className="px-6 py-4 border-b bg-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{selectedForm.name}</h2>
                <p className="text-sm text-gray-500">Google Form</p>
              </div>
              <div className="flex items-center gap-3">
                {/* View/Edit Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("view")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === "view"
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode("edit")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === "edit"
                        ? "bg-white text-orange-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative">
              {viewMode === "edit" ? (
                // Edit mode - Custom form editor using Forms API
                <div className="h-full overflow-y-auto bg-gray-50 p-6">
                  <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedForm.name}</h2>
                          <p className="text-sm text-gray-500">Edit your form questions and settings</p>
                        </div>
                        <button
                          onClick={() => window.open(`https://docs.google.com/forms/d/${selectedForm.id}/edit`, '_blank')}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Advanced Editor
                        </button>
                      </div>

                      <div className="space-y-4">
                        {loadingFormDetails ? (
                          <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                            <span className="ml-3 text-gray-600">Loading form structure...</span>
                          </div>
                        ) : formDetails ? (
                          <>
                            {/* Form Title & Description */}
                            <div className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-2 border-orange-200">
                              <h3 className="text-lg font-bold text-gray-900 mb-2">{formDetails.info.title}</h3>
                              {formDetails.info.description && (
                                <p className="text-sm text-gray-700">{formDetails.info.description}</p>
                              )}
                            </div>

                            {/* Questions List */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Questions ({formDetails.items?.filter(item => item.questionItem).length || 0})
                                </h3>
                                <button
                                  onClick={() => window.open(`https://docs.google.com/forms/d/${selectedForm.id}/edit`, '_blank')}
                                  className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                  Add Question
                                </button>
                              </div>

                              {formDetails.items && formDetails.items.length > 0 ? (
                                formDetails.items.map((item, index) => (
                                  <div key={item.itemId} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-all">
                                    {item.questionItem ? (
                                      <div>
                                        <div className="flex items-start justify-between mb-2">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <span className="text-xs font-semibold text-gray-500">Q{index + 1}</span>
                                              {item.questionItem.question.required && (
                                                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Required</span>
                                              )}
                                            </div>
                                            <h4 className="font-semibold text-gray-900">{item.title || "Untitled Question"}</h4>
                                            {item.description && (
                                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">
                                              {item.questionItem.question.choiceQuestion ? 
                                                (item.questionItem.question.choiceQuestion.type === 'RADIO' ? 'Multiple Choice' : 
                                                 item.questionItem.question.choiceQuestion.type === 'CHECKBOX' ? 'Checkboxes' : 'Dropdown') :
                                               item.questionItem.question.textQuestion ? 
                                                (item.questionItem.question.textQuestion.paragraph ? 'Paragraph' : 'Short Answer') :
                                               item.questionItem.question.scaleQuestion ? 'Linear Scale' :
                                               item.questionItem.question.dateQuestion ? 'Date' :
                                               item.questionItem.question.timeQuestion ? 'Time' : 'Question'}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Show options for choice questions */}
                                        {item.questionItem.question.choiceQuestion?.options && (
                                          <div className="mt-3 space-y-1.5 pl-4 border-l-2 border-gray-200">
                                            {item.questionItem.question.choiceQuestion.options.map((option, optIdx) => (
                                              <div key={optIdx} className="flex items-center gap-2 text-sm text-gray-700">
                                                <div className={`w-3 h-3 rounded-full ${
                                                  item.questionItem!.question.choiceQuestion!.type === 'RADIO' 
                                                    ? 'border-2 border-gray-400' 
                                                    : 'border-2 border-gray-400 rounded-sm'
                                                }`}></div>
                                                <span>{option.value}</span>
                                              </div>
                                            ))}
                                          </div>
                                        )}

                                        {/* Show scale for scale questions */}
                                        {item.questionItem.question.scaleQuestion && (
                                          <div className="mt-3 text-sm text-gray-600">
                                            Scale: {item.questionItem.question.scaleQuestion.low} to {item.questionItem.question.scaleQuestion.high}
                                          </div>
                                        )}
                                      </div>
                                    ) : item.textItem ? (
                                      <div className="text-gray-700">
                                        <span className="text-xs font-semibold text-gray-500 block mb-1">TEXT</span>
                                        {item.textItem.text}
                                      </div>
                                    ) : item.imageItem ? (
                                      <div className="text-gray-700">
                                        <span className="text-xs font-semibold text-gray-500 block mb-1">IMAGE</span>
                                        Image content
                                      </div>
                                    ) : item.pageBreakItem ? (
                                      <div className="text-gray-700 flex items-center gap-2">
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                        <span className="text-xs font-semibold text-gray-500">PAGE BREAK</span>
                                        <div className="flex-1 h-px bg-gray-300"></div>
                                      </div>
                                    ) : null}
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  No questions yet. Click "Advanced Editor" to add questions.
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                            <div className="flex items-start">
                              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <h3 className="text-sm font-semibold text-blue-900 mb-1">Quick Actions</h3>
                                <p className="text-sm text-blue-800">
                                  Use the buttons below for quick edits, or click <strong>"Advanced Editor"</strong> for full editing capabilities.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
                          <button
                            onClick={() => {
                              const newName = prompt("Enter new form name:", selectedForm.name);
                              if (newName && newName.trim()) {
                                fetch(`${apiBase}/google/forms/${selectedForm.id}/rename`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ name: newName }),
                                }).then(() => {
                                  setForms((prev) =>
                                    prev.map((f) =>
                                      f.id === selectedForm.id ? { ...f, name: newName } : f
                                    )
                                  );
                                  setSelectedForm({ ...selectedForm, name: newName });
                                  alert("Form renamed successfully!");
                                });
                              }
                            }}
                            className="p-3 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all text-center group"
                          >
                            <svg className="w-6 h-6 text-orange-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <span className="text-xs font-semibold text-gray-900">Rename</span>
                          </button>

                          <button
                            onClick={() => openShareModal(selectedForm)}
                            className="p-3 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all text-center group"
                          >
                            <svg className="w-6 h-6 text-orange-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <span className="text-xs font-semibold text-gray-900">Share</span>
                          </button>

                          <button
                            onClick={() => handleCopyForm(selectedForm.id, selectedForm.name)}
                            className="p-3 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all text-center group"
                          >
                            <svg className="w-6 h-6 text-orange-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs font-semibold text-gray-900">Duplicate</span>
                          </button>

                          <button
                            onClick={() => setViewMode("view")}
                            className="p-3 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all text-center group"
                          >
                            <svg className="w-6 h-6 text-orange-600 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="text-xs font-semibold text-gray-900">Preview</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // View mode - Show the form response page
                <iframe
                  key={`${viewMode}-${selectedForm.id}`}
                  src={selectedForm.responderUri ? `${selectedForm.responderUri}?embedded=true` : selectedForm.webViewLink}
                  className="w-full h-full border-0"
                  title={selectedForm.name}
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                >
                  Loading…
                </iframe>
              )}
              
              
              {/* Overlay to block Google's top bar if it appears */}
              <div className="absolute top-0 right-0 w-48 h-16 bg-transparent pointer-events-none z-10"></div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg">Select a form to view</p>
              <p className="text-sm mt-2">Or create a new form to get started</p>
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && sharingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-orange-50 to-red-50">
              <h2 className="text-xl font-semibold text-gray-800">Share "{sharingForm.name}"</h2>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Add people</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <select
                    value={shareRole}
                    onChange={(e) => setShareRole(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="reader">Viewer</option>
                    <option value="commenter">Commenter</option>
                    <option value="writer">Editor</option>
                  </select>
                  <button
                    onClick={handleShare}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Share
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">People with access</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {collaborators.map((collab) => (
                    <div key={collab.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                          {getInitials(collab.emailAddress || "?")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {collab.displayName || collab.emailAddress || "Unknown"}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{collab.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {collab.type === "user" && collab.role !== "owner" && (
                          <>
                            <select
                              value={collab.role}
                              onChange={(e) => handleUpdateCollaboratorRole(collab.id, e.target.value)}
                              className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                              <option value="reader">Viewer</option>
                              <option value="commenter">Commenter</option>
                              <option value="writer">Editor</option>
                            </select>
                            <button
                              onClick={() => handleRemoveCollaborator(collab.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          </>
                        )}
                        {collab.role === "owner" && (
                          <span className="text-xs text-gray-500 font-medium">Owner</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-orange-50 to-red-50">
              <h2 className="text-xl font-semibold text-gray-800">Submit for Approval</h2>
              <p className="text-sm text-gray-600 mt-1">Request approval for "{selectedForm.name}"</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Approvers Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approvers * <span className="text-gray-500 font-normal">(Add people who need to approve this form)</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="email"
                    value={approverEmail}
                    onChange={(e) => setApproverEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addApprover()}
                    placeholder="Enter email address"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <button
                    onClick={addApprover}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add
                  </button>
                </div>
                
                {approvers.length > 0 && (
                  <div className="space-y-2">
                    {approvers.map((approver) => (
                      <div key={approver.email} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {getInitials(approver.email)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{approver.name}</p>
                            <p className="text-xs text-gray-500">{approver.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeApprover(approver.email)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={approvalMessage}
                  onChange={(e) => setApprovalMessage(e.target.value)}
                  placeholder="Add a message for the approvers..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Permissions */}
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={allowEdits}
                    onChange={(e) => setAllowEdits(e.target.checked)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Allow approvers to edit the form</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={lockFile}
                    onChange={(e) => setLockFile(e.target.checked)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Lock form until approved</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitForApproval}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      )}

      <TemplateDialog
        isOpen={showTemplateDialog}
        onClose={() => setShowTemplateDialog(false)}
        onSelectTemplate={(templateId) => {
          createFormFromTemplate(templateId);
          setShowTemplateDialog(false);
        }}
        customTemplates={customTemplates}
        onEditCustomTemplate={handleEditCustomTemplate}
        onDeleteCustomTemplate={handleDeleteCustomTemplate}
        onCreateCustomTemplate={() => {
          setShowTemplateDialog(false);
          setShowCustomFormBuilder(true);
        }}
      />

      <CustomFormBuilder
        isOpen={showCustomFormBuilder}
        onClose={() => {
          setShowCustomFormBuilder(false);
          setEditingCustomTemplate(null);
        }}
        onSave={handleSaveCustomTemplate}
        editTemplate={editingCustomTemplate}
      />
    </div>
  );
}
