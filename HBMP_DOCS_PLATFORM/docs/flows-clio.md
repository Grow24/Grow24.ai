# Conceptual → Logical → Implementation Flow

## Overview

HBMP Docs Platform guides users through three levels of documentation:

1. **Conceptual (C)** - Business perspective, why, high-level scope
2. **Logical (L)** - Structured system specification
3. **Implementation (I)** - Technical test documents

## Step 1 – Conceptual Level

### Create Business Case Docket
**User Action:** "New Project → Create Business Case"

**System Behavior:**
- HBMP opens Business Case editor (template-driven)
- User fills sections: Introduction, Needs Statement, Goals, Situation Analysis, etc.
- User saves (Draft → Under Review → Approved)

### Create Business Requirements Docket
**Prerequisite:** Business Case is Approved

**User Action:** "Create BRD/BRS"

**System Behavior:**
- HBMP enables BRD creation
- User fills BRD template:
  - Needs Assessment
  - Business Goals & KPIs
  - Stakeholder Requirements
  - AS-IS/TO-BE Process
  - Scope (In/Out)
  - Constraints & Assumptions
- Optional: Testing Strategy document also created here

### Export (Conceptual)
**User Action:** Click "Export → Google Doc / Word"

**System Behavior:**
- HBMP generates formatted doc
- User reviews outside, but must come back to HBMP for edits

**Output of Step 1:**
- Business Case + BRD + Testing Strategy, all approved inside HBMP

---

## Step 2 – Logical Level

### Create SRS from BRD
**Prerequisite:** BRD/BRS is Approved

**User Action:** In Business Requirements Docket, click "Generate SRS from BRD"

**System Behavior:**
- HBMP picks SRS template
- Pre-fills sections from BRD:
  - Scope
  - Stakeholders
  - Goals
- BA refines, adds:
  - Functional Requirements (FRs)
  - Non-Functional Requirements (NFRs)
  - Use Cases
  - Data & Interfaces
  - Business Rules
- SRS goes Draft → Review → Logical Approved

### Create User Acceptance Test Plan (UAT Plan)
**Prerequisite:** SRS is Approved

**User Action:** "Create UAT Plan"

**System Behavior:**
- HBMP enables UAT Plan creation
- UAT template:
  - Links to key FRs/Use Cases from SRS
  - UAT scenarios mapped to SRS requirements
- UAT Plan goes Draft → Review → Approved

### Export (Logical)
**User Action:** Export SRS and UAT Plan

**System Behavior:**
- Documents exported to Google Docs/Word
- Edits must come back via HBMP

**Output of Step 2:**
- SRS + UAT Plan (Logical artifacts), clean and ready for design/build

---

## Step 3 – Implementation Level

### Create Test Docket
**Prerequisite:** SRS is Approved

**User Action:** "Create Test Docket for this SRS"

**System Behavior:**
- HBMP enables Test Docket creation

### Create System Integration Test Plan (SITP)
**User Action:** "Create SIT Plan"

**System Behavior:**
- SIT template:
  - Integration points (modules/systems)
  - End-to-end scenarios mapped to SRS FRs
- SITP goes Draft → Review → Approved

### Create Unit Test Plan (UTP)
**User Action:** "Create Unit Test Plan"

**System Behavior:**
- UTP template:
  - Components/APIs
  - Coverage targets, tools
- UTP goes Draft → Review → Approved

### Export (Implementation)
**User Action:** Export SITP & UTP

**System Behavior:**
- Documents exported for QA teams as Word/PDF
- HBMP holds the master versions

**Output of Step 3:**
- Implementation test plans tied back to SRS and, indirectly, to BRD & Business Case

---

## Workflow Rules Summary

### Conceptual → Logical
- **Gate:** At least one BRD must be Approved
- **UI:** Logical step becomes clickable/enabled
- **Action:** "Generate SRS" button becomes active

### Logical → Implementation
- **Gate:** SRS must be Approved
- **UI:** Implementation step becomes clickable/enabled
- **Action:** "Create SIT Plan" and "Create UTP" buttons become active

### Status Transitions
- **Draft → Under Review:** Editor can submit (if required fields filled)
- **Under Review → Approved:** Approver role required
- **Approved → Superseded:** When new version is created (future)

---

## User Journey Example

1. **Login** → My Projects
2. **Open Project** → Project Dashboard (Conceptual step active)
3. **Create Business Case** → Fill sections → Save → Submit → Approve
4. **Create BRD** → Fill sections → Save → Submit → Approve
5. **Logical step unlocks** → Click Logical
6. **Generate SRS** → Pre-filled from BRD → Refine → Save → Submit → Approve
7. **Create UAT Plan** → Link to SRS FRs → Save → Submit → Approve
8. **Implementation step unlocks** → Click Implementation
9. **Create SIT Plan** → Fill scenarios → Save → Submit → Approve
10. **Create UTP** → Fill components → Save → Submit → Approve
11. **Export all documents** → Share externally for review/printing

---

## Future Enhancements

- **Import from edited docs:** Optional toggle (default: OFF)
- **Change Management:** Impact analysis when BRD/SRS changes
- **Traceability:** Visual links between documents
- **Versioning:** Full history of document changes
- **Collaboration:** Comments, @mentions, notifications
- **Custom Workflows:** Organization-specific approval steps

