import { formatEmailBySource, LeadData as EmailLeadData } from './emailService'

export interface LeadData {
  email: string
  name?: string
  designation?: string
  phone?: string
  source?: string // e.g., 'cta-bar', 'get-demo', 'start-free-trial'
  date?: string // Date in YYYY-MM-DD format
  time?: string // Time in HH:MM am/pm format
  timezone?: string // Timezone (e.g., 'America/New_York')
  title?: string // Job title (for meeting booking)
  pageTitle?: string // Title from the page/form (used as email subject)
  metadata?: Record<string, any>
}

// Get the API endpoint - use the same backend as chat service
const getApiEndpoint = () => {
  if (typeof window !== 'undefined' && (window as any).PBMP_CHAT_API_ENDPOINT) {
    const chatEndpoint = (window as any).PBMP_CHAT_API_ENDPOINT
    return chatEndpoint.replace('/api/chat', '/api/leads')
  }
  const chatEndpoint = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/api/chat'
  return chatEndpoint.replace('/api/chat', '/api/leads')
}

export async function submitLead(data: LeadData): Promise<{ success: boolean; message: string }> {
  try {
    const API_ENDPOINT = getApiEndpoint()

    // Format email data based on source/purpose
    const emailData: EmailLeadData = {
      email: data.email,
      name: data.name,
      designation: data.designation,
      phone: data.phone,
      source: data.source,
      date: data.date,
      time: data.time,
      timezone: data.timezone,
      title: data.title,
      pageTitle: data.pageTitle,
      metadata: data.metadata
    }

    const formattedEmail = formatEmailBySource(emailData)

    console.log('📤 Submitting lead:', { ...data, endpoint: API_ENDPOINT })
    console.log('📧 Formatted email:', formattedEmail)
    console.log('📧 Email Subject:', formattedEmail.subject)
    console.log('📧 Email Source:', formattedEmail.source)

    // Send formatted email data to backend
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Include original data for backward compatibility
        ...data,
        // Override pageTitle with formatted subject to ensure backend uses correct subject
        pageTitle: formattedEmail.subject,
        // Include formatted email data
        emailFormat: {
          subject: formattedEmail.subject,
          body: formattedEmail.body,
          source: formattedEmail.source,
        },
        // Also include subject at top level for backend compatibility
        subject: formattedEmail.subject,
        emailBody: formattedEmail.body,
        // Include metadata
        metadata: formattedEmail.metadata,
        timestamp: new Date().toISOString(),
        // Add date and time if not provided (for meeting bookings)
        date: data.date || (data.source === 'meeting-booking' ? undefined : new Date().toISOString().split('T')[0]),
        time: data.time || (data.source === 'meeting-booking' ? undefined : new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })),
        timezone: data.timezone || (data.source === 'meeting-booking' ? undefined : Intl.DateTimeFormat().resolvedOptions().timeZone),
      }),
    })

    console.log('📥 Response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to submit lead' }))
      console.error('❌ Lead submission failed:', errorData)
      throw new Error(errorData.message || 'Failed to submit lead')
    }

    const result = await response.json()
    console.log('✅ Lead submitted successfully:', result)
    return {
      success: true,
      message: result.message || 'Thank you! We\'ll be in touch soon.'
    }
  } catch (error) {
    console.error('❌ Lead submission error:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Something went wrong. Please try again.'
    }
  }
}
