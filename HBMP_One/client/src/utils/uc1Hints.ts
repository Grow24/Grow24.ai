/**
 * UC-1 (Credit & Claims Mgmt / Urgent Order Optimization) example hints
 * These are shown as placeholder helper text for empty fields
 */

export interface FieldHint {
  templateCode: string;
  fieldLabel: string;
  hint: string;
}

/**
 * Get hint for a specific field based on template code and field label/id
 */
export function getFieldHint(templateCode: string, fieldLabel: string, fieldId?: string): string | null {
  const code = templateCode.toUpperCase();
  const label = fieldLabel.toLowerCase();

  // Business Case hints
  if (code === 'BUSINESS_CASE') {
    // Objectives
    if (label.includes('objective') || label.includes('goal')) {
      return 'Example: Reduce DSO by 20–30% within 6 months';
    }
    // Root cause
    if (label.includes('root cause') || label.includes('problem') || label.includes('issue')) {
      return 'Example: No standardized workflow + missing documentation';
    }
    // Risks
    if (label.includes('risk') && !label.includes('mitigation')) {
      return 'Example: Delayed manufacturer credit notes';
    }
    // Benefits
    if (label.includes('benefit') || label.includes('value')) {
      return 'Example: Faster credit processing reduces working capital';
    }
    // Scope
    if (label.includes('scope') || label.includes('in scope')) {
      return 'Example: Urgent order workflow for Credit & Claims department';
    }
    // Out of scope
    if (label.includes('out of scope') || label.includes('excluded')) {
      return 'Example: Non-urgent order processing remains unchanged';
    }
    // Stakeholders
    if (label.includes('stakeholder')) {
      return 'Example: Credit Manager, Claims Analyst, Finance Director';
    }
    // Success metrics
    if (label.includes('metric') || label.includes('kpi') || label.includes('success')) {
      return 'Example: 50% reduction in credit note processing time';
    }
  }

  // BRD hints
  if (code === 'BRD') {
    // Business requirements
    if (label.includes('requirement') || label.includes('need')) {
      return 'Example: System must auto-validate credit note against purchase order';
    }
    // Functional requirement
    if (label.includes('functional')) {
      return 'Example: Credit note approval workflow with 3-level escalation';
    }
    // Non-functional requirement
    if (label.includes('non-functional') || label.includes('performance')) {
      return 'Example: Process 1000+ credit notes per day with <2s response time';
    }
    // Business rules
    if (label.includes('rule') || label.includes('policy')) {
      return 'Example: Credit notes >$10k require director approval';
    }
    // Assumptions
    if (label.includes('assumption')) {
      return 'Example: Credit team will be trained on new system';
    }
    // Constraints
    if (label.includes('constraint')) {
      return 'Example: Must integrate with existing ERP within Q2';
    }
    // Dependencies
    if (label.includes('dependency') || label.includes('dependent')) {
      return 'Example: Depends on ERP API availability';
    }
    // AS-IS process
    if (label.includes('as-is') || label.includes('current process')) {
      return 'Example: Manual Excel-based tracking with email approvals';
    }
    // TO-BE process
    if (label.includes('to-be') || label.includes('future process')) {
      return 'Example: Automated workflow with digital approvals and real-time tracking';
    }
  }

  // SRS hints
  if (code === 'SRS') {
    // System requirement
    if (label.includes('system') && label.includes('requirement')) {
      return 'Example: System shall provide REST API for credit note submission';
    }
    // Use case
    if (label.includes('use case') || label.includes('scenario')) {
      return 'Example: User submits credit note → System validates → Auto-routes for approval';
    }
    // Interface
    if (label.includes('interface') || label.includes('integration')) {
      return 'Example: SOAP interface to ERP system for order lookup';
    }
    // Data requirement
    if (label.includes('data') || label.includes('database')) {
      return 'Example: Store credit note details, approval history, and audit trail';
    }
  }

  // Generic fallbacks
  if (label.includes('description') || label.includes('detail')) {
    return 'Provide a clear and concise description';
  }
  if (label.includes('name') || label.includes('title')) {
    return 'Enter a descriptive name';
  }
  if (label.includes('date') || label.includes('time')) {
    return 'Select appropriate date/time';
  }

  return null;
}

/**
 * Check if a field is empty (for showing hints)
 */
export function isFieldEmpty(value: string | undefined | null): boolean {
  if (!value) return true;
  // Check if value is empty HTML (just tags)
  if (typeof value === 'string') {
    const stripped = value.replace(/<[^>]*>/g, '').trim();
    return stripped.length === 0;
  }
  return false;
}

