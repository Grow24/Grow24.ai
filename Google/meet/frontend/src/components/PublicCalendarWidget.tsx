import React, { useState } from 'react';

interface PublicCalendarWidgetProps {
  defaultCalendarId?: string;
}

const PublicCalendarWidget: React.FC<PublicCalendarWidgetProps> = ({ defaultCalendarId }) => {
  const [calendarId, setCalendarId] = useState(defaultCalendarId || '');
  const [showCalendar, setShowCalendar] = useState(!!defaultCalendarId);
  const [inputValue, setInputValue] = useState('');

  // Popular public calendars
  const popularCalendars = [
    { name: 'Holidays in India', id: 'en.indian#holiday@group.v.calendar.google.com' },
    { name: 'Holidays in USA', id: 'en.usa#holiday@group.v.calendar.google.com' },
    { name: 'Holidays in UK', id: 'en.uk#holiday@group.v.calendar.google.com' },
    { name: 'Moon Phases', id: 'ht3jlfaac5lfd6263ulfh4tql8@group.calendar.google.com' },
  ];

  const handleLoadCalendar = () => {
    if (inputValue.trim()) {
      setCalendarId(inputValue.trim());
      setShowCalendar(true);
    }
  };

  const handleSelectPopular = (id: string) => {
    setCalendarId(id);
    setShowCalendar(true);
    setInputValue(id);
  };

  const calendarUrl = calendarId 
    ? `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}&mode=AGENDA&showTitle=0&showNav=0&showPrint=0&showCalendars=0&showTz=0&height=400&wkst=1&bgcolor=%23ffffff`
    : '';

  return (
    <div className="bg-white rounded-lg material-shadow p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            🌍 Public Calendar
          </h3>
          {showCalendar && (
            <button
              onClick={() => setShowCalendar(false)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Change
            </button>
          )}
        </div>

        {!showCalendar ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-2 font-medium">
                Popular Calendars
              </label>
              <div className="space-y-1">
                {popularCalendars.map((cal) => (
                  <button
                    key={cal.id}
                    onClick={() => handleSelectPopular(cal.id)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded transition"
                  >
                    {cal.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <label className="block text-xs text-gray-600 mb-2 font-medium">
                Custom Calendar ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="calendar@example.com"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleLoadCalendar()}
                />
                <button
                  onClick={handleLoadCalendar}
                  disabled={!inputValue.trim()}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Load
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Enter a public Google Calendar ID
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-xs text-gray-600 bg-blue-50 px-3 py-2 rounded">
              <strong>Calendar:</strong> {calendarId.split('@')[0]}
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <iframe
                src={calendarUrl}
                style={{ border: 0 }}
                width="100%"
                height="400"
                frameBorder="0"
                scrolling="yes"
                title="Public Google Calendar"
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <a
                href={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-3 py-2 text-sm bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
              >
                Open Full Calendar
              </a>
              <button
                onClick={() => {
                  setShowCalendar(false);
                  setInputValue('');
                  setCalendarId('');
                }}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 font-medium rounded hover:bg-gray-200 transition"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {!showCalendar && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-700">
            <strong>Tip:</strong> This widget shows public Google Calendars only. 
            Your private meetings are listed above.
          </p>
        </div>
      )}
    </div>
  );
};

export default PublicCalendarWidget;

