import { useEffect, useState, useRef } from "react";
import TemplateDialog, { MeetingTemplate } from "../components/TemplateDialog";
import MiniCalendar from "../components/MiniCalendar";
import PublicCalendarWidget from "../components/PublicCalendarWidget";
import QuickEventDialog from "../components/QuickEventDialog";
import OBSControls from "../components/OBSControls";

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  htmlLink: string;
  hangoutLink?: string;
  conferenceData?: any;
  attendees?: Array<{ email: string; responseStatus?: string }>;
  status?: string;
  creator?: { email: string };
  organizer?: { email: string };
}

interface Approver {
  email: string;
  name: string;
}

export default function Meet() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [activeEventMenu, setActiveEventMenu] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [invitingEvent, setInvitingEvent] = useState<CalendarEvent | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [viewFilter, setViewFilter] = useState<"upcoming" | "all">("upcoming");
  const menuRef = useRef<HTMLDivElement>(null);
  const [userEmail] = useState("user@example.com");
  const [recordings, setRecordings] = useState<any[]>([]);
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [loadingRecordings, setLoadingRecordings] = useState(false);
  const [loadingTranscripts, setLoadingTranscripts] = useState(false);
  const [showQuickEventDialog, setShowQuickEventDialog] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date>(new Date());
  
  // Meeting iframe state (75/25 split-screen)
  const [inMeetingMode, setInMeetingMode] = useState(false);
  const [activeMeetingUrl, setActiveMeetingUrl] = useState("");
  
  // Create Meeting Form State
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDescription, setMeetingDescription] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [attendees, setAttendees] = useState<string[]>([]);
  const [attendeeInput, setAttendeeInput] = useState("");
  const [sendNotifications, setSendNotifications] = useState(true);
  
  // Invitation State
  const [inviteRecipients, setInviteRecipients] = useState<string[]>([]);
  const [recipientInput, setRecipientInput] = useState("");
  
  // Approval State
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [approverEmail, setApproverEmail] = useState("");
  const [approvalMessage, setApprovalMessage] = useState("Please review and approve this meeting.");

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3005";

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveEventMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch meetings
  useEffect(() => {
    fetchEvents();
  }, [viewFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const endpoint = viewFilter === "upcoming" ? "/google/calendar/events" : "/google/calendar/events/all";
      const res = await fetch(`${apiBase}${endpoint}`);
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Not authorized. Please connect your Google account.");
        }
        throw new Error("Failed to fetch meetings");
      }

      setEvents(data.events || []);
      if (data.events && data.events.length > 0 && !selectedEvent) {
        setSelectedEvent(data.events[0]);
      }
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes("Not authorized")) {
        // Don't auto-redirect, show connect button instead
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogle = () => {
    setIsAuthenticating(true);
    window.location.href = `${apiBase}/google/auth`;
  };

  const handleCreateMeeting = async (template?: MeetingTemplate, isInstant?: boolean) => {
    try {
      // Calculate default times if using template
      let startTime = startDateTime;
      let endTime = endDateTime;
      
      if (template && !startDateTime) {
        const now = new Date();
        now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15); // Round to next 15 min
        startTime = now.toISOString().slice(0, 16);
        
        const end = new Date(now);
        end.setMinutes(end.getMinutes() + template.duration);
        endTime = end.toISOString().slice(0, 16);
      }

      const res = await fetch(`${apiBase}/google/calendar/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: template ? template.name : meetingTitle,
          description: template ? template.description : meetingDescription,
          startTime: startTime,
          endTime: endTime,
          attendees: attendees,
          sendNotifications: sendNotifications,
        }),
      });

      if (!res.ok) throw new Error("Failed to create meeting");

      const createdMeeting = await res.json();
      
      await fetchEvents();
      setShowCreateModal(false);
      resetCreateForm();
      
      // If instant meeting, open Meet link immediately
      if (isInstant && createdMeeting.hangoutLink) {
        window.open(createdMeeting.hangoutLink, '_blank');
        alert(" Meeting created successfully! Opening Google Meet...");
      } else {
        alert(" Meeting created successfully!");
      }
    } catch (err: any) {
      alert("Error creating meeting: " + err.message);
    }
  };

  const handleInstantMeeting = async () => {
    // Set times for instant meeting (now to +1 hour)
    const now = new Date();
    const startTime = now.toISOString().slice(0, 16);
    
    const end = new Date(now);
    end.setHours(end.getHours() + 1);
    const endTime = end.toISOString().slice(0, 16);
    
    // Create meeting
    try {
      const res = await fetch(`${apiBase}/google/calendar/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: "Instant Meeting",
          description: "Quick meeting started at " + now.toLocaleString(),
          startTime: startTime,
          endTime: endTime,
          attendees: [],
          sendNotifications: false,
        }),
      });

      if (!res.ok) throw new Error("Failed to create meeting");

      const data = await res.json();
      
      // Set state for split-screen mode
      if (data.hangoutLink) {
        setActiveMeetingUrl(data.hangoutLink);
        setSelectedEvent(data);
        setInMeetingMode(true);
      }
      
      await fetchEvents();
    } catch (err: any) {
      console.error("Instant meeting error:", err);
      alert("Error creating instant meeting: " + err.message);
    }
  };

  const handleDeleteMeeting = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;

    try {
      const res = await fetch(`${apiBase}/google/calendar/events/${eventId}?sendNotifications=true`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete meeting");

      await fetchEvents();
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
      }
      alert(" Meeting deleted successfully!");
    } catch (err: any) {
      alert("Error deleting meeting: " + err.message);
    }
  };

  const handleSendInvitations = async () => {
    if (!invitingEvent || inviteRecipients.length === 0) return;

    try {
      const res = await fetch(`${apiBase}/google/calendar/events/${invitingEvent.id}/send-invitation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: inviteRecipients,
          organizer: userEmail,
        }),
      });

      if (!res.ok) throw new Error("Failed to send invitations");

      setShowInviteModal(false);
      setInvitingEvent(null);
      setInviteRecipients([]);
      alert("Invitations sent successfully!");
    } catch (err: any) {
      alert("Error sending invitations: " + err.message);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!selectedEvent || approvers.length === 0) return;

    try {
      const res = await fetch(`${apiBase}/google/calendar/events/${selectedEvent.id}/submit-approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvers: approvers.map(a => a.email),
          message: approvalMessage,
          submittedBy: userEmail,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit for approval");

      setShowApprovalModal(false);
      setApprovers([]);
      alert(" Meeting submitted for approval!");
    } catch (err: any) {
      alert("Error submitting for approval: " + err.message);
    }
  };

  const resetCreateForm = () => {
    setMeetingTitle("");
    setMeetingDescription("");
    setStartDateTime("");
    setEndDateTime("");
    setAttendees([]);
    setAttendeeInput("");
    setSendNotifications(true);
  };

  const addAttendee = () => {
    if (attendeeInput.trim() && !attendees.includes(attendeeInput.trim())) {
      setAttendees([...attendees, attendeeInput.trim()]);
      setAttendeeInput("");
    }
  };

  const removeAttendee = (email: string) => {
    setAttendees(attendees.filter(a => a !== email));
  };

  const addInviteRecipient = () => {
    if (recipientInput.trim() && !inviteRecipients.includes(recipientInput.trim())) {
      setInviteRecipients([...inviteRecipients, recipientInput.trim()]);
      setRecipientInput("");
    }
  };

  const removeInviteRecipient = (email: string) => {
    setInviteRecipients(inviteRecipients.filter(r => r !== email));
  };

  const addApprover = () => {
    if (approverEmail.trim() && !approvers.find(a => a.email === approverEmail.trim())) {
      setApprovers([...approvers, { email: approverEmail.trim(), name: approverEmail.trim() }]);
      setApproverEmail("");
    }
  };

  const removeApprover = (email: string) => {
    setApprovers(approvers.filter(a => a.email !== email));
  };

  const fetchRecordings = async (conferenceId: string) => {
    setLoadingRecordings(true);
    try {
      const res = await fetch(`${apiBase}/google/meet/${conferenceId}/recordings`);
      const data = await res.json();
      setRecordings(data.recordings || []);
    } catch (err) {
      console.error("Error fetching recordings:", err);
      setRecordings([]);
    } finally {
      setLoadingRecordings(false);
    }
  };

  const fetchTranscripts = async (conferenceId: string) => {
    setLoadingTranscripts(true);
    try {
      const res = await fetch(`${apiBase}/google/meet/${conferenceId}/transcripts`);
      const data = await res.json();
      setTranscripts(data.transcripts || []);
    } catch (err) {
      console.error("Error fetching transcripts:", err);
      setTranscripts([]);
    } finally {
      setLoadingTranscripts(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedCalendarDate(date);
    setShowQuickEventDialog(true);
  };

  const handleQuickCreateEvent = async (
    title: string, 
    startTime: string, 
    endTime: string,
    description?: string,
    attendees?: string[],
    addMeet?: boolean
  ) => {
    try {
      const res = await fetch(`${apiBase}/google/calendar/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: title,
          description: description || "",
          startTime: startTime,
          endTime: endTime,
          attendees: attendees || [],
          sendNotifications: attendees && attendees.length > 0,
          addMeet: addMeet || false,
        }),
      });

      if (!res.ok) throw new Error("Failed to create meeting");

      await fetchEvents();
      alert("Event created successfully!");
    } catch (err: any) {
      alert("Error creating event: " + err.message);
    }
  };

  const formatDateTime = (dateTime?: string, date?: string) => {
    if (dateTime) {
      return new Date(dateTime).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (date) {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
    return "N/A";
  };

  const isPastEvent = (event: CalendarEvent) => {
    const endTime = event.end.dateTime || event.end.date;
    if (!endTime) return false;
    return new Date(endTime) < new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-meet-50 to-meet-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-t-4 border-meet-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 animate-pulse border-4 border-meet-600 border-t-transparent rounded-full"></div>
            </div>
          </div>
          <p className="mt-6 text-meet-700 font-semibold text-lg">Loading meetings...</p>
          <p className="mt-2 text-meet-600 text-sm">Please wait while we fetch your calendar</p>
        </div>
      </div>
    );
  }

  if (error && error.includes("Not authorized")) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-meet-50 to-meet-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <svg className="w-24 h-24 mb-6 mx-auto text-meet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to HBMP Meet</h1>
          <p className="text-gray-600 mb-8">
            Connect your Google account to manage meetings and Google Meet conferences
          </p>
          <button
            onClick={handleConnectGoogle}
            disabled={isAuthenticating}
            className="bg-gradient-to-r from-meet-500 to-meet-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-meet-600 hover:to-meet-700 transition disabled:opacity-50 shadow-lg"
          >
            {isAuthenticating ? "Connecting..." : "🔗 Connect Google Account"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-meet-50 to-meet-100">
      {/* Meeting Mode: Split Screen with iframe */}
      {inMeetingMode ? (
        <div className="min-h-screen bg-gradient-to-br from-meet-50 to-meet-100 flex">
          {/* Google Meet Section (70% width) */}
          <div className="w-[70%] relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
            <div className="absolute top-4 right-4 bg-red-500 bg-opacity-90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg z-10">
              <p className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                ● Live Meeting
              </p>
            </div>
            
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-xl text-center mx-8 border-2 border-gray-100">
              <svg className="w-32 h-32 mb-6 mx-auto text-blue-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Google Meet is Ready!
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Due to Google's security policy, Meet opens in a separate window.
                <br />
                <span className="text-sm text-gray-500">Your recording controls remain here →</span>
              </p>
              
              <button
                onClick={() => {
                  const width = 1400;
                  const height = 900;
                  const left = window.screen.width - width - 50;
                  const top = 50;
                  
                  const meetWindow = window.open(
                    activeMeetingUrl, 
                    'GoogleMeetHBMP',
                    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
                  );
                  
                  if (meetWindow) {
                    meetWindow.focus();
                  } else {
                    alert('Please allow pop-ups for this site to open Google Meet');
                  }
                }}
                className="w-full px-8 py-5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Launch Google Meet
                <span className="text-sm opacity-80">(Opens Right)</span>
              </button>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-700">
                  <strong>Pro Tip:</strong> Position the Meet window on the right side of your screen
                  and keep this tab on the left for easy control access.
                </p>
              </div>
            </div>
          </div>

          {/* Controls Panel (30% width) */}
          <div className="w-[30%] bg-white shadow-2xl overflow-y-auto">
            {/* Header with Exit Button */}
            <div className="bg-gradient-to-r from-meet-500 to-meet-600 p-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
              <div>
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                   Meeting Controls
                </h2>
                <p className="text-meet-100 text-sm">Recording & Management</p>
              </div>
              <button
                onClick={() => setInMeetingMode(false)}
                className="bg-white text-meet-600 px-4 py-2 rounded-lg font-semibold hover:bg-meet-50 transition shadow-md"
              >
                ✕ Exit
              </button>
            </div>

            {/* Info Banner */}
            <div className="p-4 bg-yellow-50 border-b-2 border-yellow-200">
              <div className="flex items-start gap-3">
                <div className="text-2xl"><svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg></div>
                <div className="flex-1">
                  <p className="text-sm text-yellow-800 font-medium">
                    <strong>Note:</strong> If Meet doesn't load, click below to open in a new window.
                  </p>
                  <button
                    onClick={() => {
                      window.open(activeMeetingUrl, '_blank', 'width=1200,height=800');
                    }}
                    className="mt-2 text-xs bg-yellow-600 text-white px-3 py-1.5 rounded hover:bg-yellow-700 transition"
                  >
                    � Open in New Window
                  </button>
                </div>
              </div>
            </div>

            {/* OBS Recording Controls */}
            <div className="p-4">
              <OBSControls 
                apiBase={apiBase}
                onRecordingStart={() => {
                  console.log('Recording started for instant meeting');
                }}
                onRecordingStop={(path) => {
                  alert(`Recording saved!\n\nFile location:\n${path}`);
                }}
              />

              {/* Meeting Details */}
              {selectedEvent && (
                <div className="mt-6 space-y-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-xl">📅</span> Meeting Info
                    </h3>
                    <div className="text-sm text-gray-700 space-y-2.5">
                      <div className="flex items-start gap-2">
                        <strong className="min-w-[80px] text-gray-900">Title:</strong>
                        <span className="flex-1">{selectedEvent.summary}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <strong className="min-w-[80px] text-gray-900">Started:</strong>
                        <span className="flex-1">{formatDateTime(selectedEvent.start.dateTime, selectedEvent.start.date)}</span>
                      </div>
                      {selectedEvent.description && (
                        <div className="flex items-start gap-2">
                          <strong className="min-w-[80px] text-gray-900">Details:</strong>
                          <p className="flex-1 text-gray-600">{selectedEvent.description}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedEvent.hangoutLink || '');
                        alert('Meeting link copied!');
                      }}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-semibold shadow-md flex items-center justify-center gap-2"
                    >
                       Copy Meeting Link
                    </button>
                    <button
                      onClick={() => {
                        window.open(selectedEvent.hangoutLink, '_blank', 'width=1200,height=800');
                      }}
                      className="w-full bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:from-gray-300 hover:to-gray-400 transition font-semibold shadow-sm flex items-center justify-center gap-2"
                    >
                       Open in New Window
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Normal View: Header */}
          <header className="bg-white shadow-md border-b-4 border-meet-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold gradient-text flex items-center gap-3">
                HBMP Meet
              </h1>
              <p className="text-gray-600 mt-1">Google Meet & Calendar Management</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleInstantMeeting}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition shadow-lg flex items-center gap-2 animate-pulse"
              >
                 Instant Meeting
              </button>
              <button
                onClick={() => setShowTemplateDialog(true)}
                className="bg-gradient-to-r from-meet-500 to-meet-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-meet-600 hover:to-meet-700 transition shadow-lg flex items-center gap-2"
              >
                 Use Template
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-meet-600 to-meet-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-meet-700 hover:to-meet-800 transition shadow-lg flex items-center gap-2"
              >
                <span>➕</span> New Meeting
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Calendars */}
          <div className="lg:col-span-1 space-y-6">
            {/* View Filter */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                 View
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewFilter("upcoming")}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    viewFilter === "upcoming"
                      ? "bg-gradient-to-r from-meet-500 to-meet-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setViewFilter("all")}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    viewFilter === "all"
                      ? "bg-gradient-to-r from-meet-500 to-meet-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            {/* Mini Calendar */}
            <MiniCalendar 
              onDateSelect={handleDateSelect}
              selectedDate={selectedCalendarDate}
            />
            
            {/* Public Calendar Widget */}
            <PublicCalendarWidget defaultCalendarId="en.indian#holiday@group.v.calendar.google.com" />
          </div>

          {/* Meeting Details (Middle) */}
          <div className="lg:col-span-2">
            {selectedEvent ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-meet-500 to-meet-600 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    {selectedEvent.hangoutLink && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                    {selectedEvent.summary || "Untitled Meeting"}
                  </h2>
                  {isPastEvent(selectedEvent) && (
                    <span className="inline-block mt-2 bg-white bg-opacity-20 text-white text-sm px-3 py-1 rounded-full">
                      Past Event
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  {/* Meeting Link */}
                  {selectedEvent.hangoutLink && (
                    <div className="bg-gradient-to-r from-meet-50 to-meet-100 border-2 border-meet-300 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        Google Meet Link
                      </h3>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={selectedEvent.hangoutLink}
                          readOnly
                          className="flex-1 px-4 py-2 border border-meet-300 rounded-lg bg-white font-mono text-sm"
                        />
                        <a
                          href={selectedEvent.hangoutLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-meet-500 to-meet-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-meet-600 hover:to-meet-700 transition whitespace-nowrap"
                        >
                          Join Meeting
                        </a>
                      </div>
                    </div>
                  )}

                  {/* OBS Recording Controls */}
                  <OBSControls 
                    apiBase={apiBase}
                    onRecordingStart={() => {
                      console.log('Recording started for meeting:', selectedEvent.summary);
                    }}
                    onRecordingStop={(path) => {
                      alert(`Recording saved!\n\nFile location:\n${path}\n\nYou can find it in your OBS recordings folder.`);
                    }}
                  />

                  {/* Date & Time */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      Date 📅 Date & Time Time
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <p className="text-gray-700">
                        <strong>Start:</strong> {formatDateTime(selectedEvent.start.dateTime, selectedEvent.start.date)}
                      </p>
                      <p className="text-gray-700">
                        <strong>End:</strong> {formatDateTime(selectedEvent.end.dateTime, selectedEvent.end.date)}
                      </p>
                      {selectedEvent.start.timeZone && (
                        <p className="text-sm text-gray-600">
                          <strong>Timezone:</strong> {selectedEvent.start.timeZone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {selectedEvent.description && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        Description
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedEvent.description}</p>
                      </div>
                    </div>
                  )}

                  {/* Attendees */}
                  {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        Attendees ({selectedEvent.attendees.length})
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-2">
                          {selectedEvent.attendees.map((attendee, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span className="text-gray-700">{attendee.email}</span>
                              {attendee.responseStatus && (
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  attendee.responseStatus === "accepted"
                                    ? "bg-green-100 text-green-700"
                                    : attendee.responseStatus === "declined"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {attendee.responseStatus}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recordings & Transcripts - for past events */}
                  {selectedEvent.conferenceData?.conferenceId && isPastEvent(selectedEvent) && (
                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📼</span>
                        <span>Meeting Artifacts</span>
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Recordings Section */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-5 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-purple-900 flex items-center gap-2">
                              <span className="text-xl">🎥</span>
                              <span>Recordings</span>
                            </h4>
                            <button
                              onClick={() => fetchRecordings(selectedEvent.conferenceData.conferenceId)}
                              disabled={loadingRecordings}
                              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                              {loadingRecordings ? (
                                <span className="flex items-center gap-2">
                                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  Loading...
                                </span>
                              ) : "Fetch Recordings"}
                            </button>
                          </div>
                          {recordings.length > 0 ? (
                            <div className="space-y-2">
                              {recordings.map((recording: any, idx: number) => (
                                <div key={idx} className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm hover:shadow-md transition">
                                  <div>
                                    <p className="font-medium text-gray-900">{recording.name || `Recording ${idx + 1}`}</p>
                                    <p className="text-xs text-gray-600">{new Date(recording.startTime).toLocaleString()}</p>
                                  </div>
                                  <a
                                    href={recording.driveDestination?.file || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition shadow-sm"
                                  >
                                    Download
                                  </a>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600 italic">
                              {loadingRecordings ? "Loading..." : "No recordings available. Recordings appear after the meeting ends if recording was enabled."}
                            </p>
                          )}
                        </div>

                        {/* Transcripts Section */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-5 shadow-sm">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-blue-900 flex items-center gap-2">
                              <span className="text-xl">📝</span>
                              <span>Transcripts</span>
                            </h4>
                            <button
                              onClick={() => fetchTranscripts(selectedEvent.conferenceData.conferenceId)}
                              disabled={loadingTranscripts}
                              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                            >
                              {loadingTranscripts ? (
                                <span className="flex items-center gap-2">
                                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  Loading...
                                </span>
                              ) : "Fetch Transcripts"}
                            </button>
                          </div>
                          {transcripts.length > 0 ? (
                            <div className="space-y-2">
                              {transcripts.map((transcript: any, idx: number) => (
                                <div key={idx} className="bg-white rounded-lg p-3 flex items-center justify-between shadow-sm hover:shadow-md transition">
                                  <div>
                                    <p className="font-medium text-gray-900">{transcript.name || `Transcript ${idx + 1}`}</p>
                                    <p className="text-xs text-gray-600">{new Date(transcript.startTime).toLocaleString()}</p>
                                  </div>
                                  <a
                                    href={transcript.docsDestination?.document || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm"
                                  >
                                    View
                                  </a>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-700 italic bg-white bg-opacity-50 p-3 rounded-lg">
                              {loadingTranscripts ? (
                                <span className="flex items-center gap-2">
                                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  Loading transcripts...
                                </span>
                              ) : "No transcripts available. Enable captions during the meeting to generate transcripts."}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <a
                      href={selectedEvent.htmlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-meet-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-meet-600 transition text-center"
                    >
                      Open in Google Calendar
                    </a>
                    <button
                      onClick={() => {
                        setInvitingEvent(selectedEvent);
                        setShowInviteModal(true);
                      }}
                      className="flex-1 bg-meet-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-meet-700 transition"
                    >
                      Send Invitations
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <svg className="w-24 h-24 mb-4 mx-auto text-meet-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Meeting Selected</h3>
                <p className="text-gray-500 mb-6">Select a meeting from the list to view details</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-meet-500 to-meet-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-meet-600 hover:to-meet-700 transition shadow-md"
                  >
                    New Meeting
                  </button>
                  <button
                    onClick={handleInstantMeeting}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition shadow-md"
                  >
                    Instant Meeting
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Meetings List (Rightmost) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* List Header */}
              <div className="bg-gradient-to-r from-meet-500 to-meet-600 p-4 sticky top-0 z-10">
                <h3 className="text-white font-bold flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    
                    <span>Meetings</span>
                  </span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                    {events.length}
                  </span>
                </h3>
              </div>
              
              <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 350px)" }}>
                {events.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="text-5xl mb-4 animate-pulse">📋</div>
                    <p className="font-semibold text-lg text-gray-700">No meetings found</p>
                    <p className="text-sm mt-2 mb-4">
                      {viewFilter === "upcoming" 
                        ? "No upcoming meetings scheduled" 
                        : "No meetings in your calendar"}
                    </p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="mt-2 bg-gradient-to-r from-meet-500 to-meet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-meet-600 hover:to-meet-700 transition shadow-md"
                    >
                      Create Meeting
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={`p-4 cursor-pointer hover:bg-meet-50 transition relative ${
                          selectedEvent?.id === event.id ? "bg-meet-100 border-l-4 border-meet-600" : ""
                        } ${isPastEvent(event) ? "opacity-60" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate flex items-center gap-2">
                                {event.hangoutLink && <span className="text-lg">🎥</span>}
                                {event.summary || "Untitled Meeting"}
                              </h3>
                              {isPastEvent(event) && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                  Past
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                              <span>🕐</span>
                              {formatDateTime(event.start.dateTime, event.start.date)}
                            </p>
                            {event.attendees && event.attendees.length > 0 && (
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <span>👥</span>
                                {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveEventMenu(activeEventMenu === event.id ? null : event.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 p-1 transition"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                            </svg>
                          </button>
                        </div>

                        {/* Event Menu */}
                        {activeEventMenu === event.id && (
                          <div ref={menuRef} className="absolute right-4 top-12 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10 min-w-[200px]">
                            {event.hangoutLink && (
                              <a
                                href={event.hangoutLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-meet-50 flex items-center gap-2"
                              >
                                Join Meeting
                              </a>
                            )}
                            <a
                              href={event.htmlLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-meet-50 flex items-center gap-2"
                            >
                              Open in Calendar
                            </a>
                            <button
                              onClick={() => {
                                setInvitingEvent(event);
                                setShowInviteModal(true);
                                setActiveEventMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-meet-50 flex items-center gap-2"
                            >
                              Send Invitations
                            </button>
                            <button
                              onClick={() => {
                                setSelectedEvent(event);
                                setShowApprovalModal(true);
                                setActiveEventMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-meet-50 flex items-center gap-2"
                            >
                              Submit for Approval
                            </button>
                            <hr className="my-2" />
                            <button
                              onClick={() => {
                                handleDeleteMeeting(event.id);
                                setActiveEventMenu(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              Delete Meeting
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Dialog */}
      <TemplateDialog
        isOpen={showTemplateDialog}
        onClose={() => setShowTemplateDialog(false)}
        onSelectTemplate={(template) => {
          // Pre-fill form with template data
          setMeetingTitle(template.name);
          setMeetingDescription(template.description);
          
          // Set default times
          const now = new Date();
          now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15);
          setStartDateTime(now.toISOString().slice(0, 16));
          
          const end = new Date(now);
          end.setMinutes(end.getMinutes() + template.duration);
          setEndDateTime(end.toISOString().slice(0, 16));
          
          setShowTemplateDialog(false);
          setShowCreateModal(true);
        }}
      />

      {/* Create Meeting Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-meet-500 to-meet-600 text-white p-6">
              <h2 className="text-2xl font-bold">Create New Meeting</h2>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="e.g., Team Standup, Client Call, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-meet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={meetingDescription}
                  onChange={(e) => setMeetingDescription(e.target.value)}
                  placeholder="Add meeting agenda, notes, or details..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-meet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-meet-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={endDateTime}
                    onChange={(e) => setEndDateTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-meet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Attendees
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="email"
                    value={attendeeInput}
                    onChange={(e) => setAttendeeInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addAttendee()}
                    placeholder="Enter email address"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-meet-500"
                  />
                  <button
                    onClick={addAttendee}
                    className="bg-meet-500 text-white px-4 py-2 rounded-lg hover:bg-meet-600 transition"
                  >
                    Add
                  </button>
                </div>
                {attendees.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {attendees.map((email, idx) => (
                      <span
                        key={idx}
                        className="bg-meet-100 text-meet-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {email}
                        <button
                          onClick={() => removeAttendee(email)}
                          className="text-meet-600 hover:text-meet-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sendNotifications"
                    checked={sendNotifications}
                    onChange={(e) => setSendNotifications(e.target.checked)}
                    className="w-4 h-4 text-meet-600 focus:ring-meet-500"
                  />
                  <label htmlFor="sendNotifications" className="text-sm text-gray-700">
                    Send calendar invitations to attendees
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="instantJoin"
                  className="w-4 h-4 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="instantJoin" className="text-sm text-gray-700 font-medium">
                  Join meeting immediately after creation
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetCreateForm();
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const instantJoinCheckbox = document.getElementById('instantJoin') as HTMLInputElement;
                    handleCreateMeeting(undefined, instantJoinCheckbox?.checked);
                  }}
                  disabled={!meetingTitle || !startDateTime || !endDateTime}
                  className="px-6 py-2 bg-gradient-to-r from-meet-500 to-meet-600 text-white rounded-lg hover:from-meet-600 hover:to-meet-700 font-medium transition disabled:opacity-50"
                >
                  Create Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Invitations Modal */}
      {showInviteModal && invitingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-meet-500 to-meet-600 text-white p-6">
              <h2 className="text-2xl font-bold">Send Meeting Invitations</h2>
              <p className="text-meet-100 mt-1">{invitingEvent.summary}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Recipients
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="email"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addInviteRecipient()}
                    placeholder="Enter email address"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-meet-500"
                  />
                  <button
                    onClick={addInviteRecipient}
                    className="bg-meet-500 text-white px-4 py-2 rounded-lg hover:bg-meet-600 transition"
                  >
                    Add
                  </button>
                </div>
                {inviteRecipients.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {inviteRecipients.map((email, idx) => (
                      <span
                        key={idx}
                        className="bg-meet-100 text-meet-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {email}
                        <button
                          onClick={() => removeInviteRecipient(email)}
                          className="text-meet-600 hover:text-meet-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-meet-50 border border-meet-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Recipients will receive a beautifully formatted email with:
                </p>
                <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4 list-disc">
                  <li>Meeting title and description</li>
                  <li>Date, time, and duration</li>
                  <li>Google Meet join link</li>
                  <li>List of all attendees</li>
                </ul>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInvitingEvent(null);
                  setInviteRecipients([]);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvitations}
                disabled={inviteRecipients.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-meet-500 to-meet-600 text-white rounded-lg hover:from-meet-600 hover:to-meet-700 font-medium transition disabled:opacity-50"
              >
                Send Invitations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Event Dialog */}
      <QuickEventDialog
        isOpen={showQuickEventDialog}
        onClose={() => setShowQuickEventDialog(false)}
        selectedDate={selectedCalendarDate}
        onCreateEvent={handleQuickCreateEvent}
      />

      {/* Approval Modal */}
      {showApprovalModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-meet-500 to-meet-600 text-white p-6">
              <h2 className="text-2xl font-bold">Submit for Approval</h2>
              <p className="text-meet-100 mt-1">{selectedEvent.summary}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Approvers *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="email"
                    value={approverEmail}
                    onChange={(e) => setApproverEmail(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addApprover()}
                    placeholder="Enter approver email"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-meet-500"
                  />
                  <button
                    onClick={addApprover}
                    className="bg-meet-500 text-white px-4 py-2 rounded-lg hover:bg-meet-600 transition"
                  >
                    Add
                  </button>
                </div>
                {approvers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {approvers.map((approver, idx) => (
                      <span
                        key={idx}
                        className="bg-meet-100 text-meet-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {approver.email}
                        <button
                          onClick={() => removeApprover(approver.email)}
                          className="text-meet-600 hover:text-meet-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message to Approvers
                </label>
                <textarea
                  value={approvalMessage}
                  onChange={(e) => setApprovalMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-meet-500"
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovers([]);
                }}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitForApproval}
                disabled={approvers.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-meet-500 to-meet-600 text-white rounded-lg hover:from-meet-600 hover:to-meet-700 font-medium transition disabled:opacity-50"
              >
                Submit for Approval
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}

