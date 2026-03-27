import React, { useState, useEffect } from 'react';

interface QuickEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onCreateEvent: (title: string, startTime: string, endTime: string, description?: string, attendees?: string[], addMeet?: boolean) => void;
}

const QuickEventDialog: React.FC<QuickEventDialogProps> = ({ 
  isOpen, 
  onClose, 
  selectedDate,
  onCreateEvent 
}) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [attendees, setAttendees] = useState('');
  const [addMeet, setAddMeet] = useState(false);
  
  // Expandable sections
  const [showGuests, setShowGuests] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  // Format date for display
  const dateStr = selectedDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Set default times - Hook must be called unconditionally
  useEffect(() => {
    if (isOpen && !startTime) {
      const now = new Date(selectedDate);
      now.setHours(12, 0, 0, 0); // Default to 12:00 PM
      setStartTime(now.toISOString().slice(0, 16));
      
      const end = new Date(now);
      end.setHours(13, 0, 0, 0); // Default to 1:00 PM
      setEndTime(end.toISOString().slice(0, 16));
    }
  }, [isOpen, selectedDate, startTime]);

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setLocation('');
      setAttendees('');
      setAddMeet(false);
      setShowGuests(false);
      setShowLocation(false);
      setShowDescription(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (title.trim()) {
      const attendeesList = attendees
        .split(',')
        .map(email => email.trim())
        .filter(email => email);
      
      const fullDescription = [
        description,
        location ? `\n📍 Location: ${location}` : ''
      ].filter(Boolean).join('\n');

      onCreateEvent(title, startTime, endTime, fullDescription, attendeesList, addMeet);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-lg animate-fade-in overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 text-lg font-medium focus:outline-none placeholder-gray-400"
              autoFocus
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition ml-2"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Event Type Tabs */}
          <div className="flex gap-4 mt-3">
            <button className="pb-2 px-1 text-sm font-medium text-blue-600 border-b-2 border-blue-600">
              Event
            </button>
            <button className="pb-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Task
            </button>
            <button className="pb-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              Appointment
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {/* Date & Time */}
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 mb-2">{dateStr}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Time zone • Doesn't repeat
              </div>
            </div>
          </div>

          {/* Add Guests - Expandable */}
          <div>
            <button 
              onClick={() => setShowGuests(!showGuests)}
              className="flex items-center gap-3 w-full py-2 px-2 hover:bg-gray-50 rounded transition text-left"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm text-gray-700">Add guests</span>
              <svg 
                className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${showGuests ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showGuests && (
              <div className="ml-8 mt-2">
                <input
                  type="text"
                  placeholder="Enter email addresses (comma separated)"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Guests will receive email invitations
                </div>
              </div>
            )}
          </div>

          {/* Add Google Meet - Toggle */}
          <button 
            onClick={() => setAddMeet(!addMeet)}
            className={`flex items-center gap-3 w-full py-2 px-2 rounded transition text-left ${
              addMeet ? 'bg-blue-50 border-2 border-blue-300' : 'hover:bg-gray-50'
            }`}
          >
            <svg className={`w-5 h-5 ${addMeet ? 'text-blue-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className={`text-sm font-medium ${addMeet ? 'text-blue-600' : 'text-gray-700'}`}>
              {addMeet ? '✓ Google Meet added' : 'Add Google Meet video conferencing'}
            </span>
          </button>

          {/* Add Location - Expandable */}
          <div>
            <button 
              onClick={() => setShowLocation(!showLocation)}
              className="flex items-center gap-3 w-full py-2 px-2 hover:bg-gray-50 rounded transition text-left"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm text-gray-700">Add location</span>
              <svg 
                className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${showLocation ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showLocation && (
              <div className="ml-8 mt-2">
                <input
                  type="text"
                  placeholder="Enter meeting location or room"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Add Description - Expandable */}
          <div>
            <button 
              onClick={() => setShowDescription(!showDescription)}
              className="flex items-center gap-3 w-full py-2 px-2 hover:bg-gray-50 rounded transition text-left"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              <span className="text-sm text-gray-700">Add description or attachments</span>
              <svg 
                className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${showDescription ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showDescription && (
              <div className="ml-8 mt-2">
                <textarea
                  placeholder="Add meeting agenda, notes, or details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            )}
          </div>

          {/* Calendar Selection */}
          <div className="flex items-center gap-3 py-2 px-2 bg-gray-50 rounded">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm font-medium">HBMP Meet</span>
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                Busy • Default visibility • Notify 30 minutes before
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            More options
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickEventDialog;
