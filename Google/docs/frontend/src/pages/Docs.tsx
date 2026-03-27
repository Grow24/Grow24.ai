import { useEffect, useState, useRef } from "react";
import TemplateDialog from "../components/TemplateDialog";
import SmartInput from "../components/SmartInput";

interface GoogleDoc {
  id: string;
  name: string;
  webViewLink: string;
}

interface Heading {
  text: string;
  level: number;
  isExpanded?: boolean;
  children?: Heading[];
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

export default function Docs() {
  const [docs, setDocs] = useState<GoogleDoc[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<GoogleDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [showNavigation, setShowNavigation] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [activeDocMenu, setActiveDocMenu] = useState<string | null>(null);
  const [renamingDoc, setRenamingDoc] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareRole, setShareRole] = useState<"reader" | "commenter" | "writer">("writer");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [sharingDoc, setSharingDoc] = useState<GoogleDoc | null>(null);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [approverEmail, setApproverEmail] = useState("");
  const [approvalMessage, setApprovalMessage] = useState("Please could you take a look over this?");
  const [dueDate, setDueDate] = useState("");
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [allowEdits, setAllowEdits] = useState(false);
  const [lockFile, setLockFile] = useState(true);
  const [userEmail] = useState("Grow24.ai"); // Replace with actual user email from auth
  const [isManager] = useState(true); // Replace with actual role check from auth
  const [isAdmin] = useState(true); // Replace with actual role check from auth
  const [showDocumentList, setShowDocumentList] = useState(true);
  const [showVariablesPanel, setShowVariablesPanel] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL;

  const variables = [
    { id: "current_date", label: "Current Date", value: "{{current_date}}", category: "Time" },
    { id: "user_name", label: "User Name", value: "{{user_name}}", category: "User" },
    { id: "user_email", label: "User Email", value: "{{user_email}}", category: "User" },
    { id: "document_title", label: "Document Title", value: "{{document_title}}", category: "Document" },
    { id: "manager_name", label: "Manager Name", value: "{{manager_name}}", category: "User" },
    { id: "start_date", label: "Start Date", value: "{{start_date}}", category: "Time" },
    { id: "task", label: "Task Checkbox", value: "☐ Task", category: "Interactive" },
    { id: "placeholder", label: "Placeholder", value: "[Your text here]", category: "Text" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied "${text}" to clipboard! Now paste it in your document.`);
  };

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch(`${apiBase}/google/docs/list`);
        const data = await res.json();
        
        // Log API call
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).logApiCall?.({
          id: Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          method: "GET",
          endpoint: "/google/docs/list",
          response: data,
          status: res.status,
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Not authorized. Please connect your Google account.");
          }
          throw new Error("Failed to fetch documents");
        }
        
        setDocs(data.files || []);
        if (data.files && data.files.length > 0) {
          setSelectedDoc(data.files[0]);
        }
      } catch (err) {
        console.error("Error fetching docs:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [apiBase]);

  // Close template menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowTemplateMenu(false);
      }
      // Close 3-dot menu when clicking outside
      if (activeDocMenu && !(event.target as Element).closest('.relative')) {
        setActiveDocMenu(null);
      }
    };

    if (showTemplateMenu || activeDocMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTemplateMenu, activeDocMenu]);

  // Fetch document headings when a document is selected
  useEffect(() => {
    const fetchDocumentHeadings = async (docId: string) => {
      try {
        const res = await fetch(`${apiBase}/google/docs/${docId}`);
        if (!res.ok) return;
        
        const docData = await res.json();
        const extractedHeadings: Heading[] = [];
        
        // Extract headings from document content
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        docData.body?.content?.forEach((element: any) => {
          if (element.paragraph) {
            const style = element.paragraph.paragraphStyle?.namedStyleType;
            if (style && style.startsWith('HEADING')) {
              const level = parseInt(style.replace('HEADING_', ''));
              const text = element.paragraph.elements
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ?.map((e: any) => e.textRun?.content || '')
                .join('')
                .trim();
              if (text) {
                extractedHeadings.push({ text, level });
              }
            }
          }
        });
        
        // Add sample headings if document is empty
        if (extractedHeadings.length === 0) {
          extractedHeadings.push(
            { text: "EXECUTIVE SUMMARY", level: 1 },
            { text: "CURRENT SITUATION", level: 1 },
            { text: "SOLUTION", level: 1 },
            { text: "COSTS", level: 1 },
            { text: "IMPLEMENTATION PLAN", level: 1 },
            { text: "BENEFITS", level: 1 },
            { text: "CONCLUSION", level: 1 },
            { text: "Appendix A", level: 1, children: [
              { text: "Objectives, Approach, and Methodology", level: 2 }
            ]},
            { text: "Appendix B", level: 1, children: [
              { text: "Opportunity Analysis Process Flow", level: 2 }
            ]}
          );
        }
        
        setHeadings(extractedHeadings);
      } catch (err) {
        console.error("Error fetching headings:", err);
      }
    };

    if (selectedDoc) {
      fetchDocumentHeadings(selectedDoc.id);
    }
  }, [selectedDoc, apiBase]);

  // Fetch approval status when a document is selected
  useEffect(() => {
    const fetchApprovalStatus = async () => {
      if (!selectedDoc) return;
      
      try {
        const res = await fetch(`${apiBase}/google/docs/${selectedDoc.id}/approval-status`);
        if (res.ok) {
          const data = await res.json();
          setApprovalStatus(data);
        }
      } catch (err) {
        console.error("Error fetching approval status:", err);
      }
    };

    fetchApprovalStatus();
  }, [selectedDoc, apiBase]);

  const toggleExpand = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Approver management functions
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

  const createDocFromTemplate = async (templateName: string, templateContent: string | null) => {
    try {
      // Create the document with the template name as title
      const res = await fetch(`${apiBase}/google/docs/create`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: templateName })
      });
      const newDoc = await res.json();

      if (res.status === 401) {
        window.location.href = `${apiBase}/google/auth`;
        return;
      }
      if (!res.ok) throw new Error("Failed to create document");

      // If template has content, add it to the document
      if (templateContent) {
        const requests = [
          {
            insertText: {
              location: { index: 1 },
              text: templateContent
            }
          }
        ];

        const requestBody = { requests };
        await fetch(`${apiBase}/google/docs/${newDoc.id}/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody)
        });
      }

      // Add the document to the list
      setDocs((prev) => [newDoc, ...prev]);
      setSelectedDoc(newDoc);
      setShowTemplateMenu(false);
    } catch (err) {
      console.error("Error creating doc:", err);
      alert("Something went wrong while creating a document.");
    }
  };

  const handleDeleteDoc = async (docId: string, docName: string) => {
    if (!confirm(`Are you sure you want to delete "${docName}"?`)) return;
    
    try {
      const res = await fetch(`${apiBase}/google/docs/${docId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDocs((prev) => prev.filter((doc) => doc.id !== docId));
        if (selectedDoc?.id === docId) {
          setSelectedDoc(docs[0] || null);
        }
        alert("Document deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting doc:", err);
      alert("Failed to delete document");
    }
    setActiveDocMenu(null);
  };

  const handleRenameDoc = async (docId: string) => {
    if (!renameValue.trim()) return;
    
    try {
      const res = await fetch(`${apiBase}/google/docs/${docId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: renameValue }),
      });

      if (res.ok) {
        const updatedDoc = await res.json();
        setDocs((prev) =>
          prev.map((doc) =>
            doc.id === docId ? { ...doc, name: updatedDoc.name } : doc
          )
        );
        if (selectedDoc?.id === docId) {
          setSelectedDoc({ ...selectedDoc, name: updatedDoc.name });
        }
      }
    } catch (err) {
      console.error("Error renaming doc:", err);
      alert("Failed to rename document");
    }
    setRenamingDoc(null);
    setRenameValue("");
    setActiveDocMenu(null);
  };

  const handleShowInfo = (doc: GoogleDoc) => {
    alert(`Document Information:\n\nName: ${doc.name}\nID: ${doc.id}\nLink: ${doc.webViewLink}`);
    setActiveDocMenu(null);
  };

  const handleOpenShareModal = async (doc: GoogleDoc) => {
    setSharingDoc(doc);
    setActiveDocMenu(null);
    
    // Fetch existing collaborators
    try {
      const res = await fetch(`${apiBase}/google/docs/${doc.id}/permissions`);
      if (res.ok) {
        const data = await res.json();
        setCollaborators(data.permissions || []);
      }
    } catch (err) {
      console.error("Error fetching collaborators:", err);
    }
    
    setShowShareModal(true);
  };

  const handleShareDocument = async () => {
    if (!sharingDoc || !shareEmail.trim()) {
      alert("Please enter an email address");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/google/docs/${sharingDoc.id}/share`, {
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
        
        // Refresh collaborators list
        const permRes = await fetch(`${apiBase}/google/docs/${sharingDoc.id}/permissions`);
        if (permRes.ok) {
          const permData = await permRes.json();
          setCollaborators(permData.permissions || []);
        }
      } else {
        // Show detailed error message
        const errorMsg = data.error || "Failed to share document";
        if (errorMsg.includes("insufficient") || errorMsg.includes("permission")) {
          alert("❌ Insufficient permissions!\n\nYou need to reconnect your Google account with full Drive access.\n\nClick OK, then click 'Connect your Google account' to re-authorize.");
          setShowShareModal(false);
          window.location.href = `${apiBase}/google/auth`;
        } else {
          alert(`Failed to share: ${errorMsg}\n\nPlease check the email address and try again.`);
        }
      }
    } catch (err) {
      console.error("Error sharing document:", err);
      alert("An error occurred while sharing the document. Check console for details.");
    }
  };

  const handleRemoveCollaborator = async (permissionId: string, email: string) => {
    if (!sharingDoc) return;
    
    if (!confirm(`Remove access for ${email}?`)) return;

    try {
      const res = await fetch(
        `${apiBase}/google/docs/${sharingDoc.id}/permissions/${permissionId}`,
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
      case "writer": return "bg-blue-100 text-blue-700";
      case "commenter": return "bg-green-100 text-green-700";
      case "reader": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleSubmitForApproval = async () => {
    if (!selectedDoc || approvers.length === 0) {
      alert("Please add at least one approver");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/google/docs/${selectedDoc.id}/submit-approval`, {
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
        alert("Document submitted for approval!");
        setShowApprovalModal(false);
        setApprovers([]);
        setApproverEmail("");
        setApprovalMessage("Please could you take a look over this?");
        setDueDate("");
        setShowDueDatePicker(false);
        setAllowEdits(false);
        setLockFile(true);
        
        // Refresh approval status
        const statusRes = await fetch(`${apiBase}/google/docs/${selectedDoc.id}/approval-status`);
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
    if (!selectedDoc) return;

    const makeReadOnly = confirm(
      "Do you want to make this document read-only after approval?\n\n" +
      "Click OK to make it read-only (recommended)\n" +
      "Click Cancel to keep edit permissions"
    );

    try {
      const res = await fetch(`${apiBase}/google/docs/${selectedDoc.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvedBy: userEmail,
          makeReadOnly,
        }),
      });

      if (res.ok) {
        alert("Document approved successfully!");
        
        // Refresh approval status
        const statusRes = await fetch(`${apiBase}/google/docs/${selectedDoc.id}/approval-status`);
        if (statusRes.ok) {
          const data = await statusRes.json();
          setApprovalStatus(data);
        }
      }
    } catch (err) {
      console.error("Error approving document:", err);
      alert("Failed to approve document");
    }
  };

  const handleReject = async () => {
    if (!selectedDoc) return;

    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      const res = await fetch(`${apiBase}/google/docs/${selectedDoc.id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rejectedBy: userEmail,
          reason,
        }),
      });

      if (res.ok) {
        alert("Document rejected");
        
        // Refresh approval status
        const statusRes = await fetch(`${apiBase}/google/docs/${selectedDoc.id}/approval-status`);
        if (statusRes.ok) {
          const data = await statusRes.json();
          setApprovalStatus(data);
        }
      }
    } catch (err) {
      console.error("Error rejecting document:", err);
      alert("Failed to reject document");
    }
  };

  const handleGrantEditAccess = async () => {
    if (!selectedDoc) return;

    const email = prompt("Enter email address to grant edit access:");
    if (!email) return;

    try {
      const res = await fetch(`${apiBase}/google/docs/${selectedDoc.id}/grant-edit-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: email,
          grantedBy: userEmail,
        }),
      });

      if (res.ok) {
        alert(`Edit access granted to ${email}`);
      }
    } catch (err) {
      console.error("Error granting edit access:", err);
      alert("Failed to grant edit access");
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

  if (loading) return <div className="p-6">Loading documents...</div>;
  if (error)
    return (
      <div className="p-6 text-red-600">
        ⚠️ {error}. <br />
        <a
          href={`${apiBase}/google/auth`}
          className="text-blue-600 underline"
        >
          Connect your Google account
        </a>
      </div>
    );

  return (
    <div className="flex h-full">
      {/* Left panel - Document List */}
      {showDocumentList && (
        <div className="w-1/4 border-r bg-white flex flex-col h-screen">
          <div className="p-4 border-b flex-shrink-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">My Documents</h2>
              <div className="flex items-center gap-2">
                <div className="relative" ref={menuRef}>
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                    onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                  >
                    + New
                    <span className="text-xs">{showTemplateMenu ? '▲' : '▼'}</span>
                  </button>
                
                {/* Template dropdown menu */}
                {showTemplateMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="py-2">
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm text-gray-700 transition-colors flex items-center gap-3"
                        onClick={() => {
                          createDocFromTemplate("Blank Document", null);
                          setShowTemplateMenu(false);
                        }}
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-medium">Blank Document</span>
                      </button>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm text-gray-700 transition-colors flex items-center gap-3"
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
              <button
                onClick={() => setShowDocumentList(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
                title="Hide document list"
              >
                ◀
              </button>
              </div>
            </div>
          </div>

        {/* Scrollable document list */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-4">
            {docs.map((doc) => (
              <li
                key={doc.id}
                className={`group relative p-2 cursor-pointer rounded text-sm flex items-center justify-between ${
                  selectedDoc?.id === doc.id ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
              >
                {renamingDoc === doc.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameDoc(doc.id);
                        if (e.key === "Escape") {
                          setRenamingDoc(null);
                          setRenameValue("");
                        }
                      }}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                      autoFocus
                    />
                    <button
                      onClick={() => handleRenameDoc(doc.id)}
                      className="text-green-600 hover:text-green-700 text-xs"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => {
                        setRenamingDoc(null);
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
                      onClick={() => setSelectedDoc(doc)}
                    >
                      {doc.name}
                    </span>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDocMenu(activeDocMenu === doc.id ? null : doc.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 px-2 py-1 hover:bg-gray-200 rounded transition-opacity"
                      >
                        ⋮
                      </button>
                      
                      {/* 3-dot menu */}
                      {activeDocMenu === doc.id && (
                        <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDoc(doc);
                              setShowApprovalModal(true);
                              setActiveDocMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                          >
                            <span>📋</span> Submit for Approval
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenShareModal(doc);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                          >
                            <span>👥</span> Share
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setRenameValue(doc.name);
                              setRenamingDoc(doc.id);
                              setActiveDocMenu(null);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                          >
                            <span>✏️</span> Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowInfo(doc);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                          >
                            <span>ℹ️</span> Info
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDoc(doc.id, doc.name);
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
      )}

      {/* Toggle button to show document list when hidden */}
      {!showDocumentList && (
        <button
          onClick={() => setShowDocumentList(true)}
          className="fixed left-4 top-4 bg-blue-600 text-white px-3 py-2 rounded shadow-lg hover:bg-blue-700 z-30"
          title="Show document list"
        >
          ▶
        </button>
      )}

      {/* Center panel - Document Viewer */}
      <div className="flex-1 bg-gray-50 relative flex flex-col">
        {/* Variables Panel Toggle Button */}
        {selectedDoc && (
          <button
            onClick={() => setShowVariablesPanel(!showVariablesPanel)}
            className="absolute top-4 right-4 z-20 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-md flex items-center gap-2"
            title="Toggle Variables Panel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Variables
          </button>
        )}

        {/* Variables Side Panel */}
        {showVariablesPanel && selectedDoc && (
          <div className="absolute top-16 right-4 z-20 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Header */}
            <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <h3 className="font-semibold text-gray-800">Variables</h3>
              </div>
              <button
                onClick={() => setShowVariablesPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Info */}
            <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
              <p className="text-xs text-blue-800">
                Click any variable below to copy it, then paste into your document.
              </p>
            </div>

            {/* Variables List */}
            <div className="p-2">
              {Object.entries(
                variables.reduce((acc, variable) => {
                  if (!acc[variable.category]) {
                    acc[variable.category] = [];
                  }
                  acc[variable.category].push(variable);
                  return acc;
                }, {} as Record<string, typeof variables>)
              ).map(([category, items]) => (
                <div key={category} className="mb-3">
                  <h4 className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {category}
                  </h4>
                  <div className="space-y-1">
                    {items.map((variable) => (
                      <button
                        key={variable.id}
                        onClick={() => copyToClipboard(variable.value)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors group flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700">
                            {variable.label}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">{variable.value}</p>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t bg-gray-50">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Click to copy, then paste in your document
              </p>
            </div>
          </div>
        )}

        {/* Approval Status Bar */}
        {selectedDoc && approvalStatus && approvalStatus.status !== "draft" && (
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
                      <div key={index} className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
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
                  🔒 Read-only (Approved Document)
                </span>
              )}
              
              {approvalStatus.status === "rejected" && approvalStatus.rejectionReason && (
                <span className="text-sm text-red-700">
                  Reason: {approvalStatus.rejectionReason}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {/* Manager actions */}
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

              {/* Admin actions */}
              {approvalStatus.isReadOnly && isAdmin && (
                <button
                  onClick={handleGrantEditAccess}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                >
                  🔓 Grant Edit Access
                </button>
              )}
            </div>
          </div>
        )}

        {selectedDoc ? (
          <div className="relative w-full flex-1">
            <iframe
              src={selectedDoc.webViewLink}
              title={selectedDoc.name}
              className="w-full h-full border-none"
            ></iframe>
            {/* Overlay to hide Share and Meet buttons in Google Docs header */}
            <div className="absolute top-0 right-0 w-48 h-16 bg-white pointer-events-none z-10"></div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a document to open
          </div>
        )}
      </div>

      {/* Right panel - Navigation */}
      {showNavigation && selectedDoc && (
        <div className="w-80 bg-white border-l shadow-lg">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-2xl font-light text-blue-600">Navigation</h2>
            <button
              onClick={() => setShowNavigation(false)}
              className="text-gray-500 hover:text-gray-700"
              title="Hide navigation"
            >
              ▶
            </button>
          </div>
          
          <div className="p-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search document"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
              />
              <span className="absolute right-3 top-2.5 text-blue-600">🔍</span>
            </div>

            <div className="flex border-b mb-4">
              <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-semibold">
                HEADINGS
              </button>
              <button className="px-4 py-2 text-gray-500">PAGES</button>
              <button className="px-4 py-2 text-gray-500">RESULTS</button>
            </div>

            <div className="space-y-1">
              {headings.length > 0 ? (
                headings.map((heading, index) => (
                  <div key={index}>
                    <div
                      className={`py-2 px-3 cursor-pointer hover:bg-blue-50 rounded flex items-center justify-between ${
                        heading.level === 1 ? 'font-semibold text-gray-800' : 'text-gray-600'
                      } ${expandedItems.has(index) ? 'bg-blue-100' : ''}`}
                      style={{ paddingLeft: `${(heading.level - 1) * 16 + 12}px` }}
                      onClick={() => heading.children && toggleExpand(index)}
                    >
                      <div className="flex items-center gap-2">
                        {heading.children && (
                          <span className="text-xs">
                            {expandedItems.has(index) ? '▼' : '▶'}
                          </span>
                        )}
                        <span>{heading.text}</span>
                      </div>
                    </div>
                    
                    {/* Render children if expanded */}
                    {heading.children && expandedItems.has(index) && (
                      <div className="ml-4">
                        {heading.children.map((child, childIndex) => (
                          <div
                            key={`${index}-${childIndex}`}
                            className="py-2 px-3 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
                            style={{ paddingLeft: `${(child.level) * 16}px` }}
                          >
                            • {child.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No headings found</p>
                  <p className="text-sm mt-2">Add headings to see document structure</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toggle button when navigation is hidden */}
      {!showNavigation && selectedDoc && (
        <button
          onClick={() => setShowNavigation(true)}
          className="fixed right-4 top-4 bg-blue-600 text-white px-3 py-2 rounded shadow-lg hover:bg-blue-700 z-30"
          title="Show navigation"
        >
          ◀
        </button>
      )}

      {/* Share Modal */}
      {showShareModal && sharingDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Share "{sharingDoc.name}"</h2>
                <p className="text-sm text-gray-500 mt-1">Collaborate with others on this document</p>
              </div>
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setSharingDoc(null);
                  setShareEmail("");
                  setCollaborators([]);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Add Collaborator Section */}
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
                      if (e.key === "Enter") handleShareDocument();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <select
                    value={shareRole}
                    onChange={(e) => setShareRole(e.target.value as "reader" | "commenter" | "writer")}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  >
                    <option value="writer">Editor</option>
                    <option value="commenter">Commenter</option>
                    <option value="reader">Viewer</option>
                  </select>
                  <button
                    onClick={handleShareDocument}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Share
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  An email notification will be sent to the collaborator
                </p>
              </div>

              {/* Current Collaborators */}
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
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
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

              {/* Link Sharing Section */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Link to document</h3>
                    <p className="text-xs text-gray-500 mt-1">Anyone with the link can view</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(sharingDoc.webViewLink);
                      alert("Link copied to clipboard!");
                    }}
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors text-sm"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => {
                  setShowShareModal(false);
                  setSharingDoc(null);
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

      {/* Enhanced Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">👤</span>
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

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
              {/* Add Approvers Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add approvers
                </label>
                <div className="space-y-3">
                  {/* Approver Input */}
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={approverEmail}
                      onChange={(e) => setApproverEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addApprover();
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={addApprover}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  {/* Approver Pills */}
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
                  
                  {/* Approval Requirement Text */}
                  {approvers.length > 0 && (
                    <p className="text-sm text-gray-600">
                      Everyone will need to approve the request
                    </p>
                  )}
                </div>
              </div>

              {/* Message Section */}
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

              {/* Due Date Section */}
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
                      className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Approval Options */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="allowEdits"
                    checked={allowEdits}
                    onChange={(e) => setAllowEdits(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="lockFile" className="text-sm text-gray-700">
                    Lock file before sending approval request
                  </label>
                </div>
              </div>

              {/* Information Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs">👤</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Edits during the approval process will reset any recorded approvals.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={(e) => e.preventDefault()}
              >
                Send feedback to Google
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
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Send request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Dialog */}
      <TemplateDialog
        isOpen={showTemplateDialog}
        onClose={() => setShowTemplateDialog(false)}
        onSelectTemplate={(templateName, templateContent) => {
          createDocFromTemplate(templateName, templateContent);
          setShowTemplateDialog(false);
        }}
      />
    </div>
  );
}
