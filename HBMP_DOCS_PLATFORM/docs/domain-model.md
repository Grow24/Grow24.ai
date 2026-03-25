# Domain Model (v1 – Business Docs)

## Entities

### Project
Container for all project-related documents and dockets.

**Fields:**
- `id`: string (UUID)
- `name`: string
- `description`: string (optional)
- `clientName`: string (optional)
- `status`: "ACTIVE" | "ARCHIVED"
- `createdAt`: Date
- `updatedAt`: Date

### Docket
Logical folder grouping documents by purpose within a project.

**Fields:**
- `id`: string (UUID)
- `projectId`: string → Project
- `name`: string (e.g. "Business Case Docket")
- `type`: "BUSINESS_CASE" | "BUSINESS_REQUIREMENTS" | "TEST"
- `level`: "C" | "L" | "I" (can be multiple for Business Requirements)
- `createdAt`: Date

**Default Dockets (created with each project):**
- Business Case Docket (C)
- Business Requirements Docket (C/L)
- Test Docket (I)

### DocumentTemplate
Definition of document structure (sections and fields).

**Fields:**
- `id`: string (UUID)
- `name`: string (e.g. "Business Case", "BRD", "SRS")
- `code`: string (e.g. "BUSINESS_CASE", "BRD", "SRS")
- `level`: "C" | "L" | "I"
- `version`: number
- `isActive`: boolean
- `createdAt`: Date
- `updatedAt`: Date

### TemplateSection
Section within a document template.

**Fields:**
- `id`: string (UUID)
- `templateId`: string → DocumentTemplate
- `title`: string
- `order`: number
- `description`: string (optional, help text)

### TemplateField
Field definition within a section.

**Fields:**
- `id`: string (UUID)
- `sectionId`: string → TemplateSection
- `label`: string
- `dataType`: "RICH_TEXT" | "STRING" | "TEXT" | "NUMBER" | "DATE" | "SELECT" | "BOOLEAN"
- `mandatory`: boolean
- `helpText`: string (optional)
- `options`: string (optional, JSON for SELECT type)
- `order`: number

### DocumentInstance
Actual document created from a template.

**Fields:**
- `id`: string (UUID)
- `projectId`: string → Project
- `docketId`: string → Docket
- `templateId`: string → DocumentTemplate
- `title`: string
- `level`: "C" | "L" | "I" (derived from template)
- `status`: "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "SUPERSEDED"
- `version`: number (starts at 1)
- `createdBy`: string (fake user for v1)
- `createdAt`: Date
- `updatedAt`: Date

### SectionInstance
Instance of a template section for a specific document.

**Fields:**
- `id`: string (UUID)
- `documentId`: string → DocumentInstance
- `templateSectionId`: string → TemplateSection

### FieldValue
Stored value for a field in a document instance.

**Fields:**
- `id`: string (UUID)
- `sectionInstanceId`: string → SectionInstance
- `templateFieldId`: string → TemplateField
- `value`: string (HTML/JSON for RICH_TEXT; raw string for others)

### Attachment
File attached to a document.

**Fields:**
- `id`: string (UUID)
- `documentId`: string → DocumentInstance
- `fileName`: string
- `mimeType`: string
- `storagePath`: string (local file path for v1)
- `uploadedBy`: string
- `uploadedAt`: Date

## Business Case Template – Sections

Template code = "BUSINESS_CASE" has sections:

1. **Introduction**
   - Purpose of the business case
   - Primary audience

2. **Needs Statement**
   - Problem Statement
   - Opportunity Statement
   - Format: "Problem/Opportunity of X → Effect of Y → Impact of Z"

3. **Goals & Objectives**
   - High-level Goals
   - Detailed Objectives
   - SMART breakdown

4. **Situation Analysis**
   - Current-State Analysis
   - Root Cause Analysis
   - Opportunity Analysis
   - Gap Analysis

5. **Alternative Assessment**
   - Solution Approach Options (Build vs Buy vs Hybrid)
   - Solution Option Levels (Do Nothing, Minimum Effort, Maximum Effort)

6. **Cost–Benefit Analysis**
   - High-level feasibility & financial analysis
   - Methods: IRR, NPV, Payback Period, ROI

7. **Risk Analysis**
   - Constraints
   - Assumptions
   - Risks
   - Dependencies

8. **Solution Recommendation**
   - Recommended solution description
   - Solution Options Ranking
   - Primary Reason for Selection
   - Key Deliverables

9. **Implementation Approach**
   - Milestones / Roadmap
   - Roles & Responsibilities (RACI)
   - Implementation Dependencies
   - High-level Timelines

10. **Evaluation Measures**
    - Metric description
    - Method of measuring
    - Baseline metrics
    - Target metrics

11. **Supporting Documentation & Approvals**
    - Appendix / Attachments
    - Approvers & Sign-off section

**Initial Implementation:**
Each section has one RICH_TEXT field named "content" with appropriate helpText. Later we can break into more fields/tables.

## Relationships

- Project → has many → Dockets
- Project → has many → DocumentInstances
- Docket → has many → DocumentInstances
- DocumentTemplate → has many → TemplateSections
- TemplateSection → has many → TemplateFields
- DocumentInstance → has many → SectionInstances
- SectionInstance → has many → FieldValues
- DocumentInstance → has many → Attachments

## Future Entities (Phase 2)

- TraceLink (links between documents)
- DocumentVersion (full versioning history)
- Comment (comments on documents/sections)
- WorkflowStep (custom workflow definitions)

