// Email formatting service - formats emails differently based on purpose

export interface EmailFormattedData {
  email: string
  subject: string
  body: string
  source: string
  metadata?: Record<string, any>
}

export interface LeadData {
  email: string
  name?: string
  designation?: string
  phone?: string
  source?: string
  date?: string
  time?: string
  timezone?: string
  title?: string
  metadata?: Record<string, any>
}

/**
 * Formats email data based on the source/purpose
 */
export function formatEmailBySource(data: LeadData): EmailFormattedData {
  const source = data.source || 'general'
  
  switch (source) {
    case 'start-free-trial':
      return formatFreeTrialEmail(data)
    
    case 'get-demo':
    case 'request-demo':
    case 'cta-request-demo':
      return formatDemoRequestEmail(data)
    
    case 'download-guide':
      return formatDownloadGuideEmail(data)
    
    case 'source-sheet':
      return formatSourceSheetEmail(data)
    
    case 'download-playbook':
      return formatDownloadPlaybookEmail(data)
    
    case 'library-information':
    case 'library-training':
      return formatLibraryResourceEmail(data)
    
    case 'resource-hub':
      return formatResourceHubEmail(data)
    
    case 'cta-bar':
    case 'cta-section':
      return formatNewsletterSubscriptionEmail(data)
    
    case 'explore-solution':
    case 'solutions-matrix':
      return formatSolutionInquiryEmail(data)
    
    case 'watch-concept':
      return formatWatchConceptEmail(data)
    
    case 'meeting-booking':
      return formatMeetingBookingEmail(data)
    
    default:
      return formatGeneralEmail(data)
  }
}

/**
 * Free Trial Signup Email Format
 */
function formatFreeTrialEmail(data: LeadData): EmailFormattedData {
  const subject = `New Free Trial Signup - ${data.name || 'User'}`
  
  const body = `
New Free Trial Signup Request

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Designation: ${data.designation || 'Not provided'}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}

Request Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Free Trial Signup
Timestamp: ${new Date().toLocaleString()}

Next Steps:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please follow up with the user to complete their free trial setup.
  `.trim()

  return {
    email: data.email,
    subject,
    body,
    source: 'start-free-trial',
    metadata: {
      name: data.name,
      designation: data.designation,
      phone: data.phone,
      formType: 'free-trial'
    }
  }
}

/**
 * Demo Request Email Format
 */
function formatDemoRequestEmail(data: LeadData): EmailFormattedData {
  const subject = `Demo Request - ${data.name || data.email}`
  
  const body = `
New Demo Request

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.designation ? `Designation: ${data.designation}` : ''}

Request Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Personalized Demo Request
Timestamp: ${new Date().toLocaleString()}
Source: ${data.source}

Next Steps:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please schedule a personalized demo session with the user.
  `.trim()

  return {
    email: data.email,
    subject,
    body,
    source: data.source || 'get-demo',
    metadata: {
      name: data.name,
      phone: data.phone,
      designation: data.designation,
      formType: 'demo-request'
    }
  }
}

/**
 * Download Guide Email Format
 */
function formatDownloadGuideEmail(data: LeadData): EmailFormattedData {
  const subject = `Guide Download Request - ${data.name || data.email}`
  
  const body = `
Guide Download Request

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}

Request Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Guide Download
Resource: Solution Guide
Timestamp: ${new Date().toLocaleString()}

Action Required:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please send the requested guide to the user's email address.
  `.trim()

  return {
    email: data.email,
    subject,
    body,
    source: 'download-guide',
    metadata: {
      name: data.name,
      resourceType: 'guide',
      formType: 'download'
    }
  }
}

/**
 * Source Sheet Access Email Format
 */
function formatSourceSheetEmail(data: LeadData): EmailFormattedData {
  const subject = `Source Sheet Access Request - ${data.name || data.email}`
  
  const body = `
Source Sheet Access Request

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}

Request Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Source Sheet Access
Resource: Solution Source Sheet
Timestamp: ${new Date().toLocaleString()}

Action Required:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please provide access to the source sheet for this solution.
  `.trim()

  return {
    email: data.email,
    subject,
    body,
    source: 'source-sheet',
    metadata: {
      name: data.name,
      resourceType: 'source-sheet',
      formType: 'access'
    }
  }
}

/**
 * Download Playbook Email Format
 */
function formatDownloadPlaybookEmail(data: LeadData): EmailFormattedData {
  const subject = `Playbook Download Request - ${data.name || data.email}`
  
  const body = `
Playbook Download Request

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}

Request Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Playbook Download
Resource: Solution Playbook
Timestamp: ${new Date().toLocaleString()}

Action Required:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please send the playbook download link to the user's email address.
  `.trim()

  return {
    email: data.email,
    subject,
    body,
    source: 'download-playbook',
    metadata: {
      name: data.name,
      resourceType: 'playbook',
      formType: 'download'
    }
  }
}

/**
 * Library Resource Access Email Format
 */
function formatLibraryResourceEmail(data: LeadData): EmailFormattedData {
  const resourceType = data.source === 'library-information' ? 'Information' : 'Training'
  const subject = `Library ${resourceType} Resource Access - ${data.name || data.email}`
  
  const body = `
Library Resource Access Request

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}

Request Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Library Resource Access
Resource Category: ${resourceType}
Timestamp: ${new Date().toLocaleString()}
${data.metadata?.resourceTitle ? `Resource: ${data.metadata.resourceTitle}` : ''}

Action Required:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please grant access to the requested ${resourceType.toLowerCase()} resource.
  `.trim()

  return {
    email: data.email,
    subject,
    body,
    source: data.source || 'library-information',
    metadata: {
      name: data.name,
      resourceType: resourceType.toLowerCase(),
      resourceTitle: data.metadata?.resourceTitle,
      formType: 'library-access'
    }
  }
}

/**
 * Resource Hub Access Email Format
 */
function formatResourceHubEmail(data: LeadData): EmailFormattedData {
  const subject = `Resource Hub Access Request - ${data.name || data.email}`
  
  const body = `
Resource Hub Access Request

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}

Request Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Resource Hub Access
Timestamp: ${new Date().toLocaleString()}
${data.metadata?.resourceTitle ? `Resource: ${data.metadata.resourceTitle}` : ''}

Action Required:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please provide access to the requested resource from the Resource Hub.
  `.trim()

  return {
    email: data.email,
    subject,
    body,
    source: 'resource-hub',
    metadata: {
      name: data.name,
      resourceTitle: data.metadata?.resourceTitle,
      formType: 'resource-access'
    }
  }
}

/**
 * Newsletter Subscription Email Format
 */
function formatNewsletterSubscriptionEmail(data: LeadData): EmailFormattedData {
  const subject = `Newsletter Subscription - ${data.email}`
  
  const body = `
New Newsletter Subscription

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: ${data.email}
${data.name ? `Name: ${data.name}` : ''}

Subscription Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Newsletter Subscription
Source: ${data.source === 'cta-bar' ? 'Global CTA Bar' : 'Homepage CTA Section'}
Timestamp: ${new Date().toLocaleString()}

Action Required:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please add this user to the newsletter mailing list.
  `.trim()

  return {
    email: data.email,
    subject,
    body,
    source: data.source || 'cta-bar',
    metadata: {
      name: data.name,
      subscriptionType: 'newsletter',
      formType: 'subscription'
    }
  }
}

/**
 * Solution Inquiry Email Format
 */
function formatSolutionInquiryEmail(data: LeadData): EmailFormattedData {
  const subject = `Solution Inquiry - ${data.name || data.email}`
  
  const body = `
Solution Inquiry Request

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}

Inquiry Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Solution Information Request
Source: ${data.source === 'explore-solution' ? 'Solution Detail Page' : 'Solutions Matrix'}
Timestamp: ${new Date().toLocaleString()}
${data.metadata?.solutionId ? `Solution ID: ${data.metadata.solutionId}` : ''}
${data.metadata?.solutionTitle ? `Solution: ${data.metadata.solutionTitle}` : ''}

Next Steps:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please follow up with more information about the requested solution.
  `.trim()

  return {
    email: data.email,
    subject,
    body,
    source: data.source || 'explore-solution',
    metadata: {
      name: data.name,
      solutionId: data.metadata?.solutionId,
      solutionTitle: data.metadata?.solutionTitle,
      formType: 'solution-inquiry'
    }
  }
}

/**
 * Watch Concept Email Format
 */
function formatWatchConceptEmail(data: LeadData): EmailFormattedData {
  const subject = `Concept Video Interest - ${data.name || data.email}`
  
  const body = `
Concept Video Interest

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}

Interest Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Concept Video View
Action: User watched the Grow24.ai concept video
Timestamp: ${new Date().toLocaleString()}

Next Steps:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
User has shown interest by watching the concept video. Consider following up with additional information.
  `.trim()

  return {
    email: data.email,
    subject,
    body,
    source: 'watch-concept',
    metadata: {
      name: data.name,
      action: 'video-watched',
      formType: 'interest'
    }
  }
}

/**
 * Meeting Booking Email Format
 */
function formatMeetingBookingEmail(data: LeadData): EmailFormattedData {
  const subject = `Meeting Booking Confirmation - ${data.name || data.email}`
  
  const body = `
Meeting Booking Confirmation

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}
${data.title ? `Title: ${data.title}` : ''}

Meeting Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: ${data.date || 'Not specified'}
Time: ${data.time || 'Not specified'}
Timezone: ${data.timezone || 'Not specified'}
Timestamp: ${new Date().toLocaleString()}

Confirmation:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A meeting has been scheduled. Please send a calendar invitation to the user.
  `.trim()

  return {
    email: data.email,
    subject,
    body,
    source: 'meeting-booking',
    metadata: {
      name: data.name,
      title: data.title,
      date: data.date,
      time: data.time,
      timezone: data.timezone,
      formType: 'meeting-booking'
    }
  }
}

/**
 * General Email Format (fallback)
 */
function formatGeneralEmail(data: LeadData): EmailFormattedData {
  const subject = `New Inquiry - ${data.name || data.email}`
  
  const body = `
New Inquiry Received

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.designation ? `Designation: ${data.designation}` : ''}

Inquiry Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: General Inquiry
Source: ${data.source || 'general'}
Timestamp: ${new Date().toLocaleString()}

Please follow up with the user.
  `.trim()

  return {
    email: data.email,
    subject,
    body,
    source: data.source || 'general',
    metadata: {
      name: data.name,
      phone: data.phone,
      designation: data.designation,
      formType: 'general-inquiry'
    }
  }
}
