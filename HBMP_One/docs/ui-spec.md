# UI/UX Spec – HBMP Docs Prototype

## Global Layout

### Top Suite Navbar (like Zoho)
**Component:** `TopNavBar`

**Left Section:**
- Logo + product name: **HBMP One**
- Clicking logo → navigate to Home/Projects

**Center Section:**
- Horizontal app menu: `Home | Docs | Dashboards`
- Focus on **Docs** module in this prototype
- Context selector dropdown: `Personal | Organization` (for future: Marketing, IT, etc.)

**Right Section:**
- Notifications icon (bell)
- Help icon (?)
- User avatar with dropdown:
  - Profile
  - Logout

### CLI Stepper (under suite navbar, inside Docs module)
**Component:** `StepperCLIO`

Horizontal stepper showing:
```
● Conceptual → ○ Logical → ○ Implementation
```

**States:**
- **Active** (filled circle + bold label): Current level
- **Enabled** (outlined circle): Unlocked but not active
- **Disabled** (greyed): Locked until prerequisites met

**Behavior:**
- Clicking a step filters dashboard to that level
- Shows tooltip on disabled steps: "Requires Approved BRD"

### Body Layout (when project selected)

**Left Sidebar:** `ProjectSidebar`
- Dashboard
- Dockets (group heading)
  - Business Case Docket
  - Business Requirements Docket
  - Test Docket
- Templates (view-only)
- Reports (future)
- Settings

**Main Content:** Page-specific (Projects, Dashboard, Document Editor)

---

## Screen: Login (`/login`)

**Route:** `/login`

**Layout:**
- Centered card on neutral background
- Product logo at top
- Header: "Sign in to HBMP"
- Fields:
  - Email input
  - Password input
- Actions:
  - Primary button: "Log in"
- Footer: "Forgot password?" link (non-functional in v1)

**On Success:** Redirect to `/projects`

---

## Screen: My Projects (`/projects`)

**Route:** `/projects`

**Top Navbar:** Visible, no project selected

**Main Content:**
- Header row:
  - Title: "My Projects"
  - Right-aligned: `+ New Project` button
- Body: Grid/list of Project Cards

**Project Card:**
- Title: Project name
- Subtitle: Client name
- Badges:
  - Status: Active / Archived
  - Progress: `C: 2/2 · L: 1/2 · I: 0/2`
- Actions:
  - Primary: "Open" button
  - Secondary: `⋯` menu (Archive, Settings - future)

**Clicking "Open":** Navigate to `/projects/:projectId` (Project Dashboard)

---

## Screen: Project Dashboard (`/projects/:projectId`)

**Route:** `/projects/:projectId`

**Top:**
- Project selector shows current project
- CLI Stepper centered (Conceptual active by default)

**Left Sidebar:**
- Dashboard highlighted
- Dockets listed below

**Main Content:** Zoho-style dashboard layout

### 1. KPI Cards (top row)
Widget cards showing:
- **Business Cases:** `[2 Draft] [1 Approved]`
- **BRDs:** `[1 Draft] [0 Approved]`
- **SRS:** `[0 Draft] [0 Approved]`
- **Test Plans:** `[0 Draft] [0 Approved]`
- **Docs waiting for my approval:** `[3]`

### 2. Docket Cards (second row)

#### Business Case Docket Card
**Component:** `DocketCard`

- **Title:** "Business Case Docket"
- **Badge:** `Level: Conceptual`
- **Body (no documents):**
  - Message: "No Business Case created yet."
  - Button: `+ Create Business Case`
- **Body (with documents):**
  - Small table:
    | Name | Status | Last Updated | Actions |
    |------|--------|--------------|---------|
    | Business Case v1 | Approved | 02 Jan 2026 | Open | Export | ⋯ |

#### Business Requirements Docket Card
- **Title:** "Business Requirements Docket"
- **Badge:** `Levels: Conceptual & Logical`
- **Top row (buttons):**
  - `+ Create BRD/BRS`
  - `+ Create Testing Strategy`
  - `+ Generate SRS` (disabled until BRD Approved, tooltip: "Requires Approved BRD")
  - `+ Create UAT Plan` (disabled until SRS Approved)
- **Document list** grouped by level:
  - **Conceptual section:**
    - BRD(s)
    - Testing Strategy
  - **Logical section:**
    - SRS
    - UAT Plan

#### Test Docket Card
- **Title:** "Test Docket"
- **Badge:** `Level: Implementation`
- **Buttons:**
  - `+ Create SIT Plan` (disabled until SRS Approved)
  - `+ Create Unit Test Plan` (disabled until SRS Approved)
- **Document list** (when present)

### 3. Activity & Charts (bottom row - future)
- "Recent Document Activity" list
- "Documents by Status" bar chart

---

## Screen: Document Editor (`/projects/:projectId/dockets/:docketId/documents/:documentId`)

**Route:** `/projects/:projectId/dockets/:docketId/documents/:documentId`

**Generic screen** used for all document types (Business Case, BRD, SRS, etc.). Renders sections/fields from template.

### Header (under top navbar)

**Breadcrumb:**
```
Project Name / [Docket Name] / [Document Title]
```

**Title Line:**
- Large text: `[Document Title]` (e.g., "Business Case – Store A")
- Subtitle: `Template: Business Case · Level: Conceptual`

**Status & Action Bar (right-aligned):**
- Status badge: `Draft` / `Under Review` / `Approved`
- Buttons:
  - `Save Draft`
  - `Submit for Review` (disabled if required fields empty)
  - `Approve` (only visible for approver role; stubbed in v1)
  - `Export ▾` (dropdown: Word, PDF, Google Doc)

**Sticky:** Header stays visible when scrolling

### Rich Text Toolbar (below header)

**Component:** `RichTextToolbar`

Single-row toolbar (activates when RICH_TEXT field is focused):

**Row 1:**
- Undo / Redo
- Style dropdown: `Normal text`, `Heading 1`, `Heading 2`, `Heading 3`
- Font size dropdown: `10, 11, 12, 14, 16, 18, 24`
- Bold, Italic, Underline
- Text color, Highlight
- Bulleted list, Numbered list, Checklist
- Increase indent, Decrease indent
- Align left, center, right
- Link, Horizontal rule

**Behavior:** Toolbar follows focused RICH_TEXT field

### 3-Column Body Layout

#### Left Column: SectionNav
**Component:** `SectionNav`

**Title:** "Sections"

**List:** Sections from `TemplateSection[]` (e.g., for Business Case):
1. Introduction
2. Needs Statement
3. Goals & Objectives
4. Situation Analysis
5. Alternative Assessment
6. Cost–Benefit Analysis
7. Risk Analysis
8. Solution Recommendation
9. Implementation Approach
10. Evaluation Measures
11. Supporting Documentation & Approvals

**Each item shows:**
- Section number + title
- Small dot indicator:
  - Grey = untouched
  - Blue = has data
  - Green = all mandatory fields filled

**Behavior:**
- Clicking section scrolls center panel to that section
- Highlights active section (bold + left border)

#### Center Column: SectionContent
**Component:** `SectionContent`

**For each section:** Render as a card

**Card Structure:**
- **Section Header:**
  - Title: `<number>. <title>`
  - Optional info icon
  - Right side: "Completed" tick (when all required fields filled)
- **Help Text:**
  - Small text from `TemplateSection.description` or `TemplateField.helpText`
- **Fields Area:**
  - Render fields based on `TemplateField.dataType`:
    - `RICH_TEXT` → Rich text editor (with toolbar)
    - `STRING` → Input field
    - `TEXT` → Textarea
    - `SELECT` → Dropdown
    - `NUMBER` → Number input
    - `DATE` → Date picker
    - `BOOLEAN` → Checkbox
- **Section Footer:**
  - Subtle links: "Mark as complete" / "Add note" (optional)

**Scrolling:** Center panel scrolls independently; section headers can stick at top

#### Right Column: MetaPanel
**Component:** `MetaPanel`

**Blocks:**

1. **Document Info**
   - Project name
   - Docket name
   - Template name & level
   - Created by / created at
   - Last updated by / at

2. **Status Helper**
   - Text explaining current status:
     - Draft → "You can freely edit. When ready, submit for review."
     - Under Review → "Editing may be locked; reviewers will approve."
     - Approved → "Document is approved. Create new version to edit."

3. **Attachments**
   - Heading: "Attachments"
   - List of files (name, icon, download)
   - Button: `+ Add attachment` (opens file picker)

4. **Activity / Comments** (v2 - optional for MVP)

**Styling:** Subtle background (light grey) to distinguish from main content

---

## Interaction Examples

### Create Business Case
1. User opens Project Dashboard
2. On Business Case Docket card, clicks `+ Create Business Case`
3. Frontend calls `POST /projects/:projectId/dockets/:docketId/documents` with Business Case `templateId`
4. Navigate to `DocumentEditorPage` for new document

### Edit and Save
1. User clicks "Needs Statement" in SectionNav
2. Types into rich text field
3. Clicks `Save Draft` → `PUT /documents/:documentId`
4. On reload, all content restored from API

### Approve & Export
1. Once completed, user (approver) clicks `Approve` → status API
2. User clicks `Export → Word` → calls export endpoint and downloads file

---

## Design Principles

- **Clean, minimal color palette:** Off-white background, one primary blue for buttons
- **Status badges:** Soft colors (green=Approved, amber=Review, grey=Draft)
- **Clear CTAs:** One main CTA per screen
- **Progress indicators:** CLI stepper + section completion dots
- **Export as secondary:** Keep Export dropdown in top-right, not hero buttons
- **No clutter:** Hide advanced options in collapsible sidebars
- **Responsive:** Works on desktop (mobile can be v2)

---

## Component Library (shadcn/ui)

Use shadcn/ui components for:
- Button, Badge, Card, Input, Textarea, Select
- Dialog (Modal), Dropdown Menu, Toast
- Tabs, Accordion, Separator
- Table, Avatar, Tooltip

Custom components:
- RichTextEditor (TipTap-based)
- StepperCLIO (custom)
- SectionNav (custom)
- DocumentHeader (custom)

