interface LeadData {
  email: string
  name?: string
  designation?: string
  phone?: string
  source?: string // e.g., 'cta-bar', 'get-demo', 'start-free-trial'
  date?: string // Date in YYYY-MM-DD format
  time?: string // Time in HH:MM am/pm format
  timezone?: string // Timezone (e.g., 'America/New_York')
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

    console.log('📤 Submitting lead:', { ...data, endpoint: API_ENDPOINT })

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        // Add date and time if not provided
        date: data.date || new Date().toISOString().split('T')[0], // YYYY-MM-DD
        time: data.time || new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }), // HH:MM am/pm
        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone, // e.g., 'America/New_York'
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
