# HBMP Docs Platform - Comprehensive Project Summary

## Project Overview

**HBMP Docs Platform** is a monorepo web application for managing structured business documentation. It follows a hierarchical document management system where documents are organized by projects, dockets, and templates. The platform enforces a workflow-based approach with three levels: **Conceptual (C)**, **Logical (L)**, and **Implementation (I)** - collectively known as **CLI** or **CLIPON** levels.

### Core Purpose
Users create and manage business documents (Business Case, BRD, SRS, UAT Plan, etc.) entirely within HBMP. Documents can be exported to Word, PDF, or Google Docs for review/printing, but edits in exported documents do NOT sync back (export-only philosophy in v1).

---

## Architecture Overview

### Technology Stack

**Backend:**
- Node.js 20 + TypeScript + Express
- Prisma ORM with SQLite database (`server/prisma/dev.db`)
- REST API on port 4000
- CORS enabled for `http://localhost:5173`

**Frontend:**
- React 18+ with Vite
- TypeScript
- shadcn/ui components + Tailwind CSS
- React Router for navigation
- React Query (@tanstack/react-query) for data fetching
- TipTap for rich text editing
- Univer for spreadsheet/table editing

### Monorepo Structure
```
hbmp-docs-platform/
├── docs/              # Documentation (system-overview, api-spec, ui-spec, domain-model)
├── server/            # Backend Express API
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── routes/       # API route definitions
│   │   └── app.ts        # Express app setup
│   └── prisma/           # Database schema & migrations
└── client/            # Frontend React app
    └── src/
        ├── api/          # API client functions
        ├── components/   # React components
        ├── pages/        # Page components
        ├── types/        # TypeScript types
        └── utils/        # Utility functions
```

---

## Domain Model & Data Structure

### Core Entities

1. **Project** - Container for all documents and dockets
   - Fields: id, name, description, clientName, status (ACTIVE/ARCHIVED)

2. **Docket** - Logical folder grouping documents by purpose
   - Types: BUSINESS_CASE, BUSINESS_REQUIREMENTS, TEST
   - Levels: C (Conceptual), L (Logical), I (Implementation)
   - Default dockets created with each project:
     - Business Case Docket (C)
     - Business Requirements Docket (C/L)
     - Test Docket (I)

3. **DocumentTemplate** - Definition of document structure
   - Contains sections and fields
   - Examples: Business Case, BRD, SRS, UAT Plan, SIT Plan, UTP
   - Versioned and can evolve

4. **DocumentInstance** - Actual document created from a template
   - Status workflow: DRAFT → UNDER_REVIEW → APPROVED → SUPERSEDED
   - Has version number (starts at 1)
   - Contains section instances and field values

5. **TemplateSection** - Section within a document template
   - Has title, order, description (help text)
   - Contains template fields

6. **TemplateField** - Field definition within a section
   - Data types: RICH_TEXT, STRING, TEXT, NUMBER, DATE, SELECT, BOOLEAN
   - Can be mandatory or optional
   - Has help text and options (for SELECT)

7. **FieldValue** - Stored value for a field in a document instance
   - Stores HTML/JSON for RICH_TEXT, raw string for others

8. **Attachment** - File attached to a document
   - Supports upload/download

### Workflow Rules (CLIPON Logic)

- **Conceptual Level (C)**: Business Case, BRD/BRS, Testing Strategy
- **Logical Level (L)**: SRS, UAT Plan (becomes active only after Conceptual docs are Approved)
- **Implementation Level (I)**: SIT Plan, UTP (becomes active only after SRS is Approved)

**Gating Rules:**
- SRS cannot be created unless at least one BRD is Approved
- UAT cannot be created unless SRS is Approved
- SITP/UTP cannot be created unless SRS is Approved

---

## UI Structure & Components

### Global Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│ TopNavBar (Sticky)                                       │
│ [Logo] [Dashboard] [Dockets ▼] [Settings] [Project ▼]  │
│ [Context ▼] [Notifications] [Help] [User ▼]              │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Main Content Area (varies by page)                      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Page Hierarchy & Routes

1. **Login Page** (`/login`)
   - Simple fake authentication (stores user in localStorage)
   - Redirects to `/projects` on success

2. **Projects Page** (`/projects`)
   - Lists all projects as cards
   - Each card shows: name, client, status badge, progress (C: X/Y · L: X/Y · I: X/Y)
   - "Open" button navigates to project dashboard
   - "+ New Project" button creates new project

3. **Project Dashboard** (`/projects/:projectId`)
   - Shows project name and client
   - **KPI Cards Row**: Business Cases count, BRDs count, SRS count, Test Plans count
   - **Docket Cards Row**: Three cards (Business Case, Business Requirements, Test)
   - Each docket card shows documents list with status badges and actions (Open, Export)

4. **Document Editor** (`/projects/:projectId/dockets/:docketId/documents/:documentId`)
   - Main editing interface with 3-column layout
   - Left: Section navigation sidebar
   - Center: Section content editor
   - Right: Meta panel with tabs (Info, Checklist, Flow, Workflow)

---

## Component Breakdown

### Layout Components

#### 1. **AppShell** (`components/layout/AppShell.tsx`)
- Wrapper component for all authenticated pages
- Renders `TopNavBar` and main content area
- Provides consistent layout structure

#### 2. **TopNavBar** (`components/layout/TopNavBar.tsx`)
- Sticky header bar
- **Left**: Logo "HBMP One" (links to projects)
- **Center**: Navigation menu (Dashboard, Templates, Dockets dropdown, Settings)
- **Right**: Project selector, Context switcher (Personal/Organization), Notifications, Help, User menu
- Shows project name when inside a project
- Dockets dropdown allows quick navigation to docket sections on dashboard

#### 3. **ProjectSidebar** (`components/layout/ProjectSidebar.tsx`)
- Left sidebar navigation (currently not heavily used, but available)
- Lists: Dashboard, Dockets, Templates, Reports, Settings

### Dashboard Components

#### 4. **DocketCard** (`components/dashboard/DocketCard.tsx`)
- Card component displaying a docket and its documents
- **Header**: Docket name + level badge
- **Body**:
  - If no documents: Shows "No documents created yet" + Create button
  - If documents exist: Lists documents with:
    - Document title
    - Status badge (Draft/Under Review/Approved)
    - Actions: "Open" button, Export icon button
- **Create Button**: Can be disabled with tooltip (for workflow gating)
- Handles navigation to document editor

#### 5. **StepperCLIO** (`components/dashboard/StepperCLIO.tsx`)
- Horizontal stepper showing: Conceptual → Logical → Implementation
- Visual states: Active (filled circle), Enabled (outlined), Disabled (greyed)
- Clicking filters dashboard to that level
- Shows tooltips on disabled steps explaining prerequisites

### Document Editor Components

#### 6. **DocumentHeader** (`components/document/DocumentHeader.tsx`)
- Sticky header below TopNavBar
- **Breadcrumb**: Project Name / Docket Name / Document Title
- **Title Line**: Document title + template name + level badge
- **Status & Actions Bar** (right-aligned):
  - Status badge (Draft/Under Review/Approved)
  - "Save Draft" button
  - "Submit for Review" button (disabled if required fields empty)
  - "Approve" button (for approvers)
  - "Export ▼" dropdown (Word, PDF, Google Doc, Google Sheets, Excel)
- Shows checklist completion percentage if available

#### 7. **SectionNav** (`components/document/SectionNav.tsx`)
- **Left sidebar** in document editor
- **Header**: "Document tabs" + collapse/expand button + Add tab button
- **Sections List**: Scrollable list of all document sections
  - Each item shows: File icon, Section number + title
  - Status indicators (dot): Grey (untouched), Blue (has data), Green (all mandatory filled)
  - Active section highlighted with blue background
  - Hover shows three-dot menu with options:
    - Add subtab
    - Delete
    - Duplicate
    - Rename (opens dialog)
    - Choose emoji
    - Copy link
    - Show outline
    - Move up/down/into
- **Collapsible**: Can collapse to icon-only view
- Clicking section scrolls center panel to that section

#### 8. **SectionContent** (`components/document/SectionContent.tsx`)
- **Center column** in document editor
- **Section Navigation Stepper**: Compact bar showing "Section X of Y" with Previous/Next buttons
- **Current Section Card**:
  - Header: Section number + title + description (help text)
  - Fields area: Renders fields based on data type:
    - **RICH_TEXT**: RichTextEditor (TipTap) for regular text, UniverSheetEditor for table sections
    - **STRING/TEXT**: Textarea
    - **SELECT**: Dropdown (future)
    - **NUMBER**: Number input (future)
    - **DATE**: Date picker (future)
    - **BOOLEAN**: Checkbox (future)
  - Each field shows label, mandatory indicator (*), help text
- **Save Button**: Sticky at bottom, saves all field changes
- **Table Detection**: Automatically detects table sections (by title keywords like "list", "table", "items", "constraints", "glossary", "stakeholder") and uses Univer spreadsheet editor instead of rich text

#### 9. **RichTextEditor** (`components/document/RichTextEditor.tsx`)
- TipTap-based rich text editor
- Supports formatting: headings, bold, italic, underline, lists, links, etc.
- Toolbar appears when field is focused (via EditorContext)
- Stores HTML content

#### 10. **UniverSheetEditor** (`components/document/UniverSheetEditor.tsx`)
- Univer-based spreadsheet editor for table sections
- Stores data as JSON
- Provides Excel-like editing experience
- Used for sections requiring structured table data (stakeholder lists, constraints, glossary, etc.)

#### 11. **MetaPanel** (`components/document/MetaPanel.tsx`)
- **Right sidebar** in document editor
- **Tab Navigation**: Info | Checklist | Flow | Workflow
- **Tab Content**:

  **a. Info Tab:**
  - Document Info card: Template name, Level, Version, Created/Updated dates
  - Status card: Explains current status and what user can do
  - Attachments card: Lists attachments + "Add attachment" button

  **b. Checklist Tab:**
  - Shows checklist items grouped by category (Content, Stakeholders, Process, Scope, Constraints, Governance, Risk & Dependencies, Traceability)
  - Each item has status: DONE, OPEN, AUTO_PASSED, AUTO_FAILED
  - Tags: MANDATORY, AUTO
  - Shows completion percentage
  - "Go to Section" links for items with sectionId
  - Required 100% completion for approval

  **c. Flow Tab:**
  - Visual process flow diagram (ProcessFlow component)
  - Shows document relationships and dependencies
  - CLIPON level visualization
  - Shows which documents are blocking/unblocking others

  **d. Workflow Tab:**
  - Workflow history and transitions (WorkflowTab component)
  - Shows approval workflow
  - Allows executing workflow transitions (Submit, Approve, Request Changes)
  - Shows checklist blocking status

#### 12. **ProcessFlow** (`components/document/ProcessFlow.tsx`)
- Visual flow diagram component
- Shows documents as nodes with connections
- Color-coded by level (C/L/I)
- Shows status and completion indicators
- Interactive: clicking nodes navigates to documents

#### 13. **WorkflowTab** (`components/document/WorkflowTab.tsx`)
- Displays workflow history
- Shows transitions: DRAFT → UNDER_REVIEW → APPROVED
- Allows executing workflow actions
- Shows comments and approvers
- Blocks approval if checklist incomplete

#### 14. **ChecklistTab** (`components/document/ChecklistTab.tsx`)
- Detailed checklist view
- Grouped by category
- Filterable by status
- Shows mandatory vs auto-checked items
- Links to sections

#### 15. **EditorContext** (`components/document/EditorContext.tsx`)
- React Context for managing editor state
- Tracks focused field for toolbar positioning
- Provides editor utilities

#### 16. **EditorToolbar** (`components/document/EditorToolbar.tsx`)
- Floating toolbar for rich text editor
- Appears when RICH_TEXT field is focused
- Formatting options: headings, bold, italic, lists, etc.

---

## Component Interactions & Data Flow

### 1. **Project Dashboard Flow**

```
User opens Project Dashboard
  ↓
ProjectDashboardPage loads
  ↓
Fetches: project data, documents list, templates list
  ↓
Renders KPI cards (counts documents by type)
  ↓
Renders DocketCard components (one per docket)
  ↓
User clicks "Create Business Case" on DocketCard
  ↓
handleCreateBusinessCase() called
  ↓
Calls documentsApi.create() with templateId
  ↓
Navigates to DocumentEditorPage
```

### 2. **Document Editor Flow**

```
User opens Document Editor
  ↓
DocumentEditorPage loads
  ↓
Fetches document data (with template structure + field values)
  ↓
Renders 3-column layout:
  - Left: SectionNav (sections list)
  - Center: SectionContent (current section editor)
  - Right: MetaPanel (info/checklist/flow/workflow tabs)
  ↓
User selects section in SectionNav
  ↓
setActiveSectionId() called
  ↓
SectionContent scrolls to/show selected section
  ↓
User edits field (e.g., RichTextEditor)
  ↓
handleFieldChange() updates local state
  ↓
User clicks "Save Changes"
  ↓
handleSave() called
  ↓
Calls documentsApi.update() with fieldValues array
  ↓
Backend saves to database
  ↓
React Query invalidates cache
  ↓
UI refreshes with saved data
```

### 3. **Workflow Transition Flow**

```
User clicks "Submit for Review" in DocumentHeader
  ↓
handleWorkflowTransition('SUBMIT') called
  ↓
Checks checklist completion (if Approve action)
  ↓
If incomplete: Shows error toast, switches to Checklist tab
  ↓
If complete: Calls documentsApi.executeWorkflowTransition()
  ↓
Backend validates transition and updates status
  ↓
Creates workflow history entry
  ↓
React Query invalidates document queries
  ↓
UI updates: Status badge changes, buttons enable/disable
  ↓
Other documents may become unblocked (workflow gating)
```

### 4. **Export Flow**

```
User clicks "Export ▼" dropdown in DocumentHeader
  ↓
Selects format (Word/PDF/Google Doc/Excel/Google Sheets)
  ↓
handleExport(format) called
  ↓
If Google format:
  - Calls documentsApi.exportToGoogle()
  - Shows success toast with URL
  - Opens Google Docs/Sheets in new tab
  ↓
If file format (Word/PDF/Excel):
  - Calls documentsApi.export()
  - Receives Blob response
  - Creates download link
  - Triggers browser download
  - Shows success toast
```

### 5. **Checklist Integration**

```
Document loads
  ↓
MetaPanel fetches/getMockChecklistItems() (mock for now)
  ↓
Calculates checklistSummary (completion percentage)
  ↓
Shows in DocumentHeader as badge
  ↓
User opens Checklist tab
  ↓
ChecklistTab renders items grouped by category
  ↓
User clicks "Go to Section" link
  ↓
Scrolls to section in SectionContent
  ↓
When user tries to Approve:
  ↓
Checks if checklistSummary.completionPercent === 100
  ↓
If not: Blocks approval, shows error, switches to Checklist tab
  ↓
If yes: Allows approval
```

### 6. **Table Section Detection**

```
SectionContent renders section
  ↓
Checks section title/description for keywords:
  - "list", "table", "items", "constraints", "glossary", "stakeholder"
  ↓
If matches: Renders UniverSheetEditor (spreadsheet)
  ↓
If not: Renders RichTextEditor (rich text)
  ↓
UniverSheetEditor stores data as JSON
  ↓
RichTextEditor stores data as HTML
```

---

## API Integration

### API Client Structure (`client/src/api/`)

1. **httpClient.ts**: Axios instance with base URL and interceptors
2. **projects.api.ts**: Project CRUD operations
3. **documents.api.ts**: Document CRUD, status updates, workflow, export
4. **templates.api.ts**: Template fetching

### Key API Endpoints Used

- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project with dockets
- `GET /api/templates?level=C` - Get templates by level
- `GET /api/documents/:id` - Get document with structure
- `POST /api/projects/:projectId/dockets/:docketId/documents` - Create document
- `PUT /api/documents/:id` - Update field values
- `POST /api/documents/:id/workflow/transition` - Execute workflow action
- `GET /api/documents/:id/export?format=docx` - Export document

---

## State Management

### React Query (Server State)
- Manages all API data fetching
- Automatic caching and refetching
- Query invalidation on mutations
- Optimistic updates where applicable

### Local State (Component State)
- Form field values (in SectionContent)
- Active section ID (in DocumentEditorPage)
- Active tab in MetaPanel
- UI state (collapsed sidebars, dialogs, etc.)

### Context (EditorContext)
- Focused field tracking for toolbar
- Editor utilities

---

## Styling & Design System

### Design Principles
- Clean, minimal color palette (off-white background, primary blue)
- Status badges: Green (Approved), Amber (Review), Grey (Draft)
- Clear CTAs (one main action per screen)
- Progress indicators (CLI stepper, section completion dots)
- Responsive (desktop-first, mobile v2)

### Component Library
- **shadcn/ui**: Button, Badge, Card, Input, Textarea, Dialog, Dropdown Menu, Toast
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Icon library

---

## Key Features Implemented

### ✅ Completed Features

1. **Project Management**
   - Create/list projects
   - Project dashboard with KPI cards
   - Docket cards with document lists

2. **Document Management**
   - Create documents from templates
   - Edit documents with section navigation
   - Rich text editing (TipTap)
   - Spreadsheet editing (Univer) for table sections
   - Save field values
   - Status workflow (Draft → Under Review → Approved)

3. **Workflow System**
   - Workflow transitions (Submit, Approve, Request Changes)
   - Checklist-based approval gating
   - Workflow history tracking
   - CLIPON level gating (Logical requires Conceptual approved, etc.)

4. **Export Functionality**
   - Word (DOCX) export
   - PDF export
   - Google Docs export (stub)
   - Google Sheets export (stub)
   - Excel (XLSX) export

5. **UI Components**
   - Section navigation sidebar
   - Rich text editor with toolbar
   - Spreadsheet editor
   - Meta panel with tabs
   - Process flow visualization
   - Checklist view

### 🚧 In Progress / TODO

1. **Templates**: BRD, SRS, UAT Plan, SIT Plan, UTP templates (only Business Case seeded)
2. **Real Authentication**: Currently fake (localStorage)
3. **File Attachments**: UI exists but upload/download needs completion
4. **Comments**: Not implemented
5. **Version History**: Not implemented
6. **Trace Links**: Not implemented
7. **Google Integration**: Stub implementations need real API integration

---

## Data Flow Summary

### Reading Data
1. Component mounts → React Query fetches data → Cache stores → Component renders
2. User navigates → React Router updates URL → Component loads → Fetches data

### Writing Data
1. User edits field → Local state updates → User clicks Save → API call → Backend saves → Cache invalidates → UI refreshes

### Workflow Updates
1. User triggers workflow action → Validation (checklist, gating) → API call → Backend updates status + creates history → Cache invalidates → UI updates → Other documents may unblock

---

## Extension Points for ChatGPT

When explaining this to ChatGPT to increase functionality, emphasize:

1. **Template System**: Easy to add new document templates by seeding database
2. **Field Types**: Can extend field types (currently RICH_TEXT, STRING, TEXT)
3. **Workflow Rules**: Can add custom workflow rules in backend controllers
4. **Export Formats**: Can add new export formats (currently DOCX, PDF, Google Docs stub)
5. **Checklist System**: Can add template-specific checklist items
6. **UI Components**: Modular component structure allows easy extension
7. **API Endpoints**: RESTful API makes it easy to add new endpoints
8. **CLIPON Logic**: Can extend level gating rules

---

## Key Files Reference

### Frontend Entry Points
- `client/src/main.tsx` - React app entry
- `client/src/App.tsx` - Router setup
- `client/src/pages/` - Page components

### Backend Entry Points
- `server/src/index.ts` - Server startup
- `server/src/app.ts` - Express app configuration
- `server/src/routes/` - Route definitions
- `server/src/controllers/` - Request handlers

### Database
- `server/prisma/schema.prisma` - Database schema
- `server/prisma/seed.ts` - Seed data (Business Case template)

### Documentation
- `docs/system-overview.md` - System architecture
- `docs/domain-model.md` - Data model
- `docs/api-spec.md` - API specification
- `docs/ui-spec.md` - UI/UX specification

---

This summary provides a complete theoretical overview of the HBMP Docs Platform, its components, interactions, and architecture. Use this to explain the system to ChatGPT or other AI assistants for extending functionality.




