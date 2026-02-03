import { useState } from 'react'

export interface LeadData {
  email: string;
  name: string;
  title: string;
  date?: string;
  time?: string;
  timezone?: string;
}

interface MeetingBookingProps {
  onComplete: (data: LeadData) => void;
  onCancel?: () => void;
}

const inputBase =
  'w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
const btnPrimary =
  'px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors shrink-0'
const btnSecondary =
  'px-4 py-2 rounded-xl bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500 text-gray-700 dark:text-slate-200 font-medium text-sm transition-colors'

const EmailStep = ({ onSubmit }: { onSubmit: (email: string) => void }) => {
  const [email, setEmail] = useState('')

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        We may have just a few questions. First, what&apos;s your email address?
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className={inputBase}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && email.trim()) {
              e.preventDefault()
              onSubmit(email.trim())
            }
          }}
        />
        <button
          type="button"
          onClick={() => email.trim() && onSubmit(email.trim())}
          disabled={!email.trim()}
          className={btnPrimary}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

const NameStep = ({ onSubmit, onBack }: { onSubmit: (name: string) => void; onBack?: () => void }) => {
  const [name, setName] = useState('')

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-900 dark:text-white">What is your name?</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className={inputBase}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && name.trim()) {
              e.preventDefault()
              onSubmit(name.trim())
            }
          }}
        />
        <button
          type="button"
          onClick={() => name.trim() && onSubmit(name.trim())}
          disabled={!name.trim()}
          className={btnPrimary}
        >
          Continue
        </button>
      </div>
      {onBack && (
        <button type="button" onClick={onBack} className={btnSecondary}>
          Back
        </button>
      )}
    </div>
  )
}

const TitleStep = ({ onSubmit, onBack }: { onSubmit: (title: string) => void; onBack?: () => void }) => {
  const [title, setTitle] = useState('')

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-gray-900 dark:text-white">Last question, what is your title?</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Your job title"
          className={inputBase}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && title.trim()) {
              e.preventDefault()
              onSubmit(title.trim())
            }
          }}
        />
        <button
          type="button"
          onClick={() => title.trim() && onSubmit(title.trim())}
          disabled={!title.trim()}
          className={btnPrimary}
        >
          Continue
        </button>
      </div>
      {onBack && (
        <button type="button" onClick={onBack} className={btnSecondary}>
          Back
        </button>
      )}
    </div>
  )
}

const CalendarStep = ({
  onSubmit,
  onBack,
  contactPerson = { name: 'PBMP ChatBot', title: 'Management Consultant' }
}: {
  onSubmit: (date: string, time: string, timezone: string) => void;
  onBack?: () => void;
  contactPerson?: { name: string; title: string };
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedTimezone, setSelectedTimezone] = useState<string>('America/New_York')

  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const timeSlots = [
    '9:00 am', '9:30 am', '10:00 am', '10:30 am',
    '11:00 am', '11:30 am', '12:00 pm', '12:30 pm',
    '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm',
    '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm'
  ]

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Asia/Calcutta', label: 'India Standard Time' }
  ]

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-slate-600/50 border border-gray-200 dark:border-slate-500">
        <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold text-sm">
          {contactPerson.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{contactPerson.name}</div>
          <div className="text-xs text-gray-500 dark:text-slate-400">{contactPerson.title}</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-slate-300">⏱ 15 minutes</span>
        <select
          value={selectedTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-600 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {timezones.map((tz) => (
            <option key={tz.value} value={tz.value}>{tz.label}</option>
          ))}
        </select>
      </div>

      <p className="text-sm font-medium text-gray-900 dark:text-white">Where should we send the invite?</p>

      <div className="space-y-4">
        <div>
          <div className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Select date
          </div>
          <div className="flex flex-wrap gap-2">
            {getAvailableDates().map((date) => {
              const dateStr = date.toISOString().split('T')[0]
              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDate(dateStr)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDate === dateStr
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-500'
                  }`}
                >
                  {formatDate(date)}
                </button>
              )
            })}
          </div>
        </div>

        {selectedDate && (
          <div>
            <div className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Select time
            </div>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedTime === time
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-500'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="button"
          onClick={() => selectedDate && selectedTime && onSubmit(selectedDate, selectedTime, selectedTimezone)}
          disabled={!selectedDate || !selectedTime}
          className={btnPrimary}
        >
          Continue
        </button>
        {onBack && (
          <button type="button" onClick={onBack} className={btnSecondary}>
            Back
          </button>
        )}
      </div>
    </div>
  )
}

const ConfirmStep = ({
  data,
  onConfirm,
  isSubmitting,
  isSubmitted
}: {
  data: LeadData;
  onConfirm: () => void;
  isSubmitting?: boolean;
  isSubmitted?: boolean;
}) => {
  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(date)
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' })
    const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' })
    const day = dateObj.getDate()
    const year = dateObj.getFullYear()
    return `${time} ${data.timezone || 'Eastern Time'}, ${dayName}, ${monthName} ${day}, ${year}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 dark:bg-slate-600/50 border border-gray-200 dark:border-slate-500">
        <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold text-sm">
          {data.name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{data.name}</div>
          <div className="text-xs text-gray-500 dark:text-slate-400">{data.title}</div>
        </div>
        <div className="ml-auto w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
          ✓
        </div>
      </div>

      {!isSubmitted ? (
        <>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Ready to schedule your meeting?</h3>
            {data.date && data.time && (
              <p className="text-sm text-gray-600 dark:text-slate-300">{formatDateTime(data.date, data.time)}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-slate-400">Confirmation will be sent to {data.email}</p>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Click below to confirm your meeting with our team.
          </p>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className={btnPrimary}
          >
            {isSubmitting ? 'Scheduling...' : 'Schedule Meeting'}
          </button>
        </>
      ) : (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">✅ Meeting Scheduled!</h3>
          {data.date && data.time && (
            <p className="text-sm text-gray-600 dark:text-slate-300">{formatDateTime(data.date, data.time)}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-slate-400">Confirmation sent to {data.email}</p>
          <p className="text-sm text-gray-700 dark:text-slate-300">
            Thank you, {data.name}! We&apos;re excited to connect with you and show you how PBMP can transform your
            business management. A calendar invite and meeting details have been sent to your inbox.
          </p>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Our team will reach out shortly. Looking forward to speaking with you! 🎉
          </p>
        </div>
      )}
    </div>
  )
}

const MeetingBooking = ({ onComplete }: MeetingBookingProps) => {
  const [step, setStep] = useState<'email' | 'name' | 'title' | 'calendar' | 'confirm'>('email')
  const [leadData, setLeadData] = useState<LeadData>({
    email: '',
    name: '',
    title: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleEmailSubmit = (email: string) => {
    setLeadData({ ...leadData, email })
    setStep('name')
  }

  const handleNameSubmit = (name: string) => {
    setLeadData({ ...leadData, name })
    setStep('title')
  }

  const handleTitleSubmit = (title: string) => {
    setLeadData({ ...leadData, title })
    setStep('calendar')
  }

  const handleCalendarSelect = (date: string, time: string, timezone: string) => {
    setLeadData({ ...leadData, date, time, timezone })
    setStep('confirm')
  }

  const handleConfirm = async () => {
    if (isSubmitting || isSubmitted) return
    setIsSubmitting(true)

    try {
      const chatEndpoint = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/api/chat'
      const baseUrl = chatEndpoint.replace('/api/chat', '')
      const leadsEndpoint = `${baseUrl}/api/leads`

      const response = await fetch(leadsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadData,
          source: 'meeting-booking',
          pageTitle: 'Meeting Booking Confirmation',
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => onComplete(leadData), 1500)
      } else {
        console.error('Failed to save lead')
        setIsSubmitted(true)
        setTimeout(() => onComplete(leadData), 1500)
      }
    } catch (error) {
      console.error('Error saving lead:', error)
      setIsSubmitted(true)
      setTimeout(() => onComplete(leadData), 1500)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-w-0">
      {step === 'email' && <EmailStep onSubmit={handleEmailSubmit} />}
      {step === 'name' && (
        <NameStep onSubmit={handleNameSubmit} onBack={() => setStep('email')} />
      )}
      {step === 'title' && (
        <TitleStep onSubmit={handleTitleSubmit} onBack={() => setStep('name')} />
      )}
      {step === 'calendar' && (
        <CalendarStep onSubmit={handleCalendarSelect} onBack={() => setStep('title')} />
      )}
      {step === 'confirm' && (
        <ConfirmStep
          data={leadData}
          onConfirm={handleConfirm}
          isSubmitting={isSubmitting}
          isSubmitted={isSubmitted}
        />
      )}
    </div>
  )
}

export default MeetingBooking
