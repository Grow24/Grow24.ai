# HBMP Docs Platform – System Overview

## Goal

Build a web app (prototype) where users create and manage structured business documents inside HBMP:

**Conceptual level:**
- Business Case
- Business Requirement Document (BRD/BRS)
- Testing Strategy

**Logical level:**
- System Requirements Specification (SRS)
- User Acceptance Test Plan (UATP)

**Implementation level:**
- System Integration Test Plan (SITP)
- Unit Test Plan (UTP)

**Core Principle:** Users only edit documents inside HBMP. HBMP can export documents to Google Docs / Word / PDF for review/printing. Edits in exported docs do NOT sync back (no import in v1).

## Key Concepts

### Project
Container for all dockets & documents. A project represents a business initiative or client engagement.

### Docket
Logical folder of documents by purpose, per project:
- **Business Case Docket** - Contains Business Case documents
- **Business Requirements Docket** - Contains BRD/BRS, SRS, UAT Plan
- **Test Docket** - Contains SITP and UTP

### Document Template
Definition of sections & fields for one type of document (Business Case, BRD, SRS, etc.). Templates are versioned and can evolve without breaking existing documents.

### Document Instance
Actual document for a project, created from a template. Each instance has its own status, version, and field values.

### Section / Field
Individual parts of a document. Sections contain fields (RICH_TEXT, STRING, NUMBER, etc.).

## Levels (C / L / I)

### Conceptual (C)
Why, business view, high-level scope:
- Business Case
- BRD/BRS
- Testing Strategy

### Logical (L)
Structured system specification:
- SRS
- UAT Plan

### Implementation (I)
Technical test documents:
- SITP
- UTP

The UI shows a **CLI stepper**: Conceptual → Logical → Implementation.

## Architecture

### Backend
- **Stack**: Node.js 20, TypeScript, Express
- **DB**: SQLite via Prisma (file: dev.db)
- **Port**: http://localhost:4000
- **Responsibilities**:
  - Manage projects, dockets, templates, documents, sections, field values
  - Enforce basic workflow (Draft → Under Review → Approved)
  - Generate exports (DOCX/PDF; Google Docs stub)

### Frontend
- **Stack**: React + Vite + TypeScript + shadcn/ui + Tailwind CSS
- **Port**: http://localhost:5173
- **Responsibilities**:
  - Login (simple fake auth for now)
  - My Projects page
  - Project Dashboard with Zoho-like cards & widgets
  - Document Editor with:
    - Left section nav (from template)
    - Center content with rich text fields
    - Right meta panel (attachments, status, info)
  - Top-level suite nav + Personal/Organization context switcher

### Monorepo Layout
```
hbmp-docs-platform/
├─ docs/
├─ server/
└─ client/
```

## Initial Vertical Slice (MVP)

We implement **Business Case flow end-to-end first**, then reuse the engine for BRD, SRS, etc.:

1. Create Project
2. Create Business Case document from template
3. Edit sections using rich-text editor
4. Save & change status (Draft/Approved)
5. Export Business Case to DOCX/PDF

Once this works, we add:
- BRD template & flow (Conceptual)
- SRS template & "Generate SRS from BRD" (Logical)
- UAT Plan template (Logical)
- SITP & UTP templates (Implementation)

## Workflow Rules

- **Step 2 (Logical)** becomes active only after Conceptual docs reach "Approved" status (Business Case + BRD/BRS at minimum)
- **Step 3 (Implementation)** becomes active only after SRS is "Approved"
- SRS cannot be created unless at least one BRD in the project is Approved
- UAT cannot be created unless SRS is Approved
- SITP/UTP cannot be created unless SRS is Approved

## Export Philosophy

- Export-only by default (no import)
- Google Docs, Word, PDF exports are "read-only for HBMP"
- Edits must come back via HBMP editor
- Future: optional import toggle (configurable by admin)

