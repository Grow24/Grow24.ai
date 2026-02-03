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
  title?: string // Job title (for meeting booking)
  pageTitle?: string // Title from the page/form (used as email subject)
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
  const subject = 'Welcome to Grow24.ai – Sign up for our Free Trial'
  
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
Source: ${data.source || 'start-free-trial'}
${data.metadata?.formTitle ? `Form Title: ${data.metadata.formTitle}` : ''}
${data.metadata?.formMessage ? `Form Message: ${data.metadata.formMessage}` : ''}

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
      formType: 'free-trial',
      ...data.metadata
    }
  }
}

/**
 * Demo Request Email Format
 */
function formatDemoRequestEmail(data: LeadData): EmailFormattedData {
  const subject = 'Welcome to Grow24.ai – Get a Demo Mail'
  
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
Source: ${data.source || 'get-demo'}
${data.metadata?.formTitle ? `Form Title: ${data.metadata.formTitle}` : ''}
${data.metadata?.formMessage ? `Form Message: ${data.metadata.formMessage}` : ''}

Additional Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.metadata?.solutionId ? `Solution ID: ${data.metadata.solutionId}` : ''}
${data.metadata?.solutionTitle ? `Solution: ${data.metadata.solutionTitle}` : ''}

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
      formType: 'demo-request',
      ...data.metadata
    }
  }
}

/**
 * Download Guide Email Format
 */
function formatDownloadGuideEmail(data: LeadData): EmailFormattedData {
  const subject = data.pageTitle || `Guide Download Request - ${data.name || data.email}`
  
  const body = `
Guide Download Request

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.designation ? `Designation: ${data.designation}` : ''}

Request Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Guide Download
Resource: Solution Guide
Timestamp: ${new Date().toLocaleString()}
Source: ${data.source || 'download-guide'}
${data.metadata?.formTitle ? `Form Title: ${data.metadata.formTitle}` : ''}
${data.metadata?.formMessage ? `Form Message: ${data.metadata.formMessage}` : ''}
${data.metadata?.solutionId ? `Solution ID: ${data.metadata.solutionId}` : ''}
${data.metadata?.solutionTitle ? `Solution: ${data.metadata.solutionTitle}` : ''}

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
      phone: data.phone,
      designation: data.designation,
      resourceType: 'guide',
      formType: 'download',
      ...data.metadata
    }
  }
}

/**
 * Source Sheet Access Email Format
 */
function formatSourceSheetEmail(data: LeadData): EmailFormattedData {
  const subject = data.pageTitle || `Source Sheet Access Request - ${data.name || data.email}`
  
  const body = `
Source Sheet Access Request

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.designation ? `Designation: ${data.designation}` : ''}

Request Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Source Sheet Access
Resource: Solution Source Sheet
Timestamp: ${new Date().toLocaleString()}
Source: ${data.source || 'source-sheet'}
${data.metadata?.formTitle ? `Form Title: ${data.metadata.formTitle}` : ''}
${data.metadata?.formMessage ? `Form Message: ${data.metadata.formMessage}` : ''}
${data.metadata?.solutionId ? `Solution ID: ${data.metadata.solutionId}` : ''}
${data.metadata?.solutionTitle ? `Solution: ${data.metadata.solutionTitle}` : ''}

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
      phone: data.phone,
      designation: data.designation,
      resourceType: 'source-sheet',
      formType: 'access',
      ...data.metadata
    }
  }
}

/**
 * Download Playbook Email Format
 */
function formatDownloadPlaybookEmail(data: LeadData): EmailFormattedData {
  const subject = data.pageTitle || `Playbook Download Request - ${data.name || data.email}`
  
  const body = `
Playbook Download Request

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.designation ? `Designation: ${data.designation}` : ''}

Request Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Playbook Download
Resource: Solution Playbook
Timestamp: ${new Date().toLocaleString()}
Source: ${data.source || 'download-playbook'}
${data.metadata?.formTitle ? `Form Title: ${data.metadata.formTitle}` : ''}
${data.metadata?.formMessage ? `Form Message: ${data.metadata.formMessage}` : ''}
${data.metadata?.solutionId ? `Solution ID: ${data.metadata.solutionId}` : ''}
${data.metadata?.solutionTitle ? `Solution: ${data.metadata.solutionTitle}` : ''}

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
      phone: data.phone,
      designation: data.designation,
      resourceType: 'playbook',
      formType: 'download',
      ...data.metadata
    }
  }
}

/**
 * Library Resource Access Email Format
 */
function formatLibraryResourceEmail(data: LeadData): EmailFormattedData {
  const resourceType = data.source === 'library-information' ? 'Information' : 'Training'
  const subject = data.pageTitle || `Library ${resourceType} Resource Access - ${data.name || data.email}`
  
  const body = `
Library Resource Access Request

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.designation ? `Designation: ${data.designation}` : ''}

Request Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Library Resource Access
Resource Category: ${resourceType}
Timestamp: ${new Date().toLocaleString()}
Source: ${data.source || 'library-information'}
${data.metadata?.formTitle ? `Form Title: ${data.metadata.formTitle}` : ''}
${data.metadata?.formMessage ? `Form Message: ${data.metadata.formMessage}` : ''}
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
      phone: data.phone,
      designation: data.designation,
      resourceType: resourceType.toLowerCase(),
      resourceTitle: data.metadata?.resourceTitle,
      formType: 'library-access',
      ...data.metadata
    }
  }
}

/**
 * Resource Hub Access Email Format
 */
function formatResourceHubEmail(data: LeadData): EmailFormattedData {
  const subject = data.pageTitle || `Resource Hub Access Request - ${data.name || data.email}`
  
  const body = `
Resource Hub Access Request

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.designation ? `Designation: ${data.designation}` : ''}

Request Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Resource Hub Access
Timestamp: ${new Date().toLocaleString()}
Source: ${data.source || 'resource-hub'}
${data.metadata?.formTitle ? `Form Title: ${data.metadata.formTitle}` : ''}
${data.metadata?.formMessage ? `Form Message: ${data.metadata.formMessage}` : ''}
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
      phone: data.phone,
      designation: data.designation,
      resourceTitle: data.metadata?.resourceTitle,
      formType: 'resource-access',
      ...data.metadata
    }
  }
}

/**
 * Newsletter Subscription Email Format
 */
function formatNewsletterSubscriptionEmail(data: LeadData): EmailFormattedData {
  // Determine subject based on source
  let subject = 'Welcome to Grow24.ai – Subscribe'
  
  // If it's from cta-section (homepage CTA), keep the same subject
  // If it's from cta-bar (Global CTA Bar), use Subscribe subject
  if (data.source === 'cta-section') {
    subject = 'Welcome to Grow24.ai – Subscribe'
  } else if (data.source === 'cta-bar') {
    subject = 'Welcome to Grow24.ai – Subscribe'
  }
  
  const body = `
New Newsletter Subscription

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email: ${data.email}
${data.name ? `Name: ${data.name}` : ''}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.designation ? `Designation: ${data.designation}` : ''}

Subscription Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Newsletter Subscription
Source: ${data.source === 'cta-bar' ? 'Global CTA Bar - Subscribe Free' : data.source === 'cta-section' ? 'Homepage CTA Section' : 'Unknown'}
Timestamp: ${new Date().toLocaleString()}
${data.metadata?.formTitle ? `Form Title: ${data.metadata.formTitle}` : ''}
${data.metadata?.formMessage ? `Form Message: ${data.metadata.formMessage}` : ''}

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
      phone: data.phone,
      designation: data.designation,
      subscriptionType: 'newsletter',
      formType: 'subscription',
      ...data.metadata
    }
  }
}

/**
 * Solution Inquiry Email Format
 */
function formatSolutionInquiryEmail(data: LeadData): EmailFormattedData {
  const subject = data.pageTitle || `Solution Inquiry - ${data.name || data.email}`
  
  const body = `
Solution Inquiry Request

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.designation ? `Designation: ${data.designation}` : ''}

Inquiry Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Solution Information Request
Source: ${data.source === 'explore-solution' ? 'Solution Detail Page' : 'Solutions Matrix'}
Timestamp: ${new Date().toLocaleString()}
${data.metadata?.formTitle ? `Form Title: ${data.metadata.formTitle}` : ''}
${data.metadata?.formMessage ? `Form Message: ${data.metadata.formMessage}` : ''}
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
      phone: data.phone,
      designation: data.designation,
      solutionId: data.metadata?.solutionId,
      solutionTitle: data.metadata?.solutionTitle,
      formType: 'solution-inquiry',
      ...data.metadata
    }
  }
}

/**
 * Watch Concept Email Format
 */
function formatWatchConceptEmail(data: LeadData): EmailFormattedData {
  const subject = data.pageTitle || `Concept Video Interest - ${data.name || data.email}`
  
  const body = `
Concept Video Interest

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.designation ? `Designation: ${data.designation}` : ''}

Interest Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: Concept Video View
Action: User watched the Grow24.ai concept video
Timestamp: ${new Date().toLocaleString()}
Source: ${data.source || 'watch-concept'}
${data.metadata?.formTitle ? `Form Title: ${data.metadata.formTitle}` : ''}
${data.metadata?.formMessage ? `Form Message: ${data.metadata.formMessage}` : ''}

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
      phone: data.phone,
      designation: data.designation,
      action: 'video-watched',
      formType: 'interest',
      ...data.metadata
    }
  }
}

/**
 * Meeting Booking Email Format
 */
function formatMeetingBookingEmail(data: LeadData): EmailFormattedData {
  const subject = data.pageTitle || `Meeting Booking Confirmation - ${data.name || data.email}`
  
  const body = `
Meeting Booking Confirmation

Contact Information:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${data.name || 'Not provided'}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.designation ? `Designation: ${data.designation}` : ''}
${data.title ? `Title: ${data.title}` : ''}

Meeting Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: ${data.date || 'Not specified'}
Time: ${data.time || 'Not specified'}
Timezone: ${data.timezone || 'Not specified'}
Timestamp: ${new Date().toLocaleString()}
Source: ${data.source || 'meeting-booking'}
${data.metadata?.formTitle ? `Form Title: ${data.metadata.formTitle}` : ''}
${data.metadata?.formMessage ? `Form Message: ${data.metadata.formMessage}` : ''}

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
      phone: data.phone,
      designation: data.designation,
      title: data.title,
      date: data.date,
      time: data.time,
      timezone: data.timezone,
      formType: 'meeting-booking',
      ...data.metadata
    }
  }
}

/**
 * General Email Format (fallback)
 */
function formatGeneralEmail(data: LeadData): EmailFormattedData {
  const subject = data.pageTitle || `New Inquiry - ${data.name || data.email}`
  
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
${data.metadata?.formTitle ? `Form Title: ${data.metadata.formTitle}` : ''}
${data.metadata?.formMessage ? `Form Message: ${data.metadata.formMessage}` : ''}

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
      formType: 'general-inquiry',
      ...data.metadata
    }
  }
}
