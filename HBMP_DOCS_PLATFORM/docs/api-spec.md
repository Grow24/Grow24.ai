# Backend API – v1 Specification

**Base URL**: `http://localhost:4000/api`

All endpoints return JSON unless specified otherwise.

## Health Check

### GET /health
Check if server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Projects

### GET /projects
Get all projects.

**Response:**
```json
{
  "projects": [
    {
      "id": "uuid",
      "name": "Project Name",
      "description": "Description",
      "clientName": "Client",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /projects
Create a new project. Automatically creates default dockets.

**Request Body:**
```json
{
  "name": "Project Name",
  "description": "Optional description",
  "clientName": "Optional client name"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Project Name",
  "description": "Optional description",
  "clientName": "Optional client name",
  "status": "ACTIVE",
  "createdAt": "2024-01-01T00:00:00Z",
  "dockets": [
    {
      "id": "uuid",
      "name": "Business Case Docket",
      "type": "BUSINESS_CASE",
      "level": "C"
    },
    {
      "id": "uuid",
      "name": "Business Requirements Docket",
      "type": "BUSINESS_REQUIREMENTS",
      "level": "C"
    },
    {
      "id": "uuid",
      "name": "Test Docket",
      "type": "TEST",
      "level": "I"
    }
  ]
}
```

### GET /projects/:projectId
Get a single project with its dockets.

**Response:**
```json
{
  "id": "uuid",
  "name": "Project Name",
  "dockets": [...],
  "documents": [...]
}
```

## Templates

### GET /templates
Get all active templates.

**Query Parameters:**
- `level` (optional): "C" | "L" | "I"
- `code` (optional): template code (e.g. "BUSINESS_CASE")

**Response:**
```json
{
  "templates": [
    {
      "id": "uuid",
      "name": "Business Case",
      "code": "BUSINESS_CASE",
      "level": "C",
      "version": 1,
      "isActive": true
    }
  ]
}
```

### GET /templates/:id
Get a template with its sections and fields.

**Response:**
```json
{
  "id": "uuid",
  "name": "Business Case",
  "code": "BUSINESS_CASE",
  "level": "C",
  "sections": [
    {
      "id": "uuid",
      "title": "Introduction",
      "order": 1,
      "description": "Purpose of the business case",
      "fields": [
        {
          "id": "uuid",
          "label": "Content",
          "dataType": "RICH_TEXT",
          "mandatory": true,
          "helpText": "Describe the purpose..."
        }
      ]
    }
  ]
}
```

## Documents

### POST /projects/:projectId/dockets/:docketId/documents
Create a new document instance from a template.

**Request Body:**
```json
{
  "templateId": "uuid",
  "title": "Business Case - Store A"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "Business Case - Store A",
  "templateId": "uuid",
  "status": "DRAFT",
  "version": 1,
  "level": "C",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### GET /documents/:documentId
Get a document with its template structure and field values.

**Response:**
```json
{
  "id": "uuid",
  "title": "Business Case - Store A",
  "projectId": "uuid",
  "docketId": "uuid",
  "templateId": "uuid",
  "status": "DRAFT",
  "version": 1,
  "level": "C",
  "template": {
    "name": "Business Case",
    "code": "BUSINESS_CASE",
    "sections": [
      {
        "id": "uuid",
        "title": "Introduction",
        "order": 1,
        "description": "Purpose of the business case",
        "sectionInstanceId": "uuid",
        "fields": [
          {
            "id": "uuid",
            "label": "Content",
            "dataType": "RICH_TEXT",
            "mandatory": true,
            "helpText": "Describe the purpose...",
            "fieldValueId": "uuid",
            "value": "<p>Initial content...</p>"
          }
        ]
      }
    ]
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### PUT /documents/:documentId
Update field values for a document.

**Request Body:**
```json
{
  "fieldValues": [
    {
      "fieldValueId": "uuid",
      "value": "<p>Updated content...</p>"
    }
  ]
}
```

**Response:**
```json
{
  "id": "uuid",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### POST /documents/:documentId/status
Change document status (workflow transition).

**Request Body:**
```json
{
  "status": "UNDER_REVIEW" | "APPROVED" | "DRAFT"
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "APPROVED",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Validation:**
- Cannot change to APPROVED if mandatory fields are empty
- Cannot create SRS unless BRD is APPROVED (future)

### GET /projects/:projectId/documents
Get all documents for a project.

**Response:**
```json
{
  "documents": [
    {
      "id": "uuid",
      "title": "Business Case - Store A",
      "templateId": "uuid",
      "templateName": "Business Case",
      "docketId": "uuid",
      "docketName": "Business Case Docket",
      "status": "DRAFT",
      "level": "C",
      "version": 1,
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## Attachments

### GET /documents/:documentId/attachments
Get all attachments for a document.

**Response:**
```json
{
  "attachments": [
    {
      "id": "uuid",
      "fileName": "diagram.png",
      "mimeType": "image/png",
      "uploadedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /documents/:documentId/attachments
Upload an attachment (multipart/form-data).

**Request:**
- `file`: File

**Response:**
```json
{
  "id": "uuid",
  "fileName": "diagram.png",
  "mimeType": "image/png",
  "uploadedAt": "2024-01-01T00:00:00Z"
}
```

### GET /attachments/:attachmentId/download
Download an attachment file.

**Response:** File stream

## Export

### GET /documents/:documentId/export
Export a document to DOCX or PDF.

**Query Parameters:**
- `format`: "docx" | "pdf"

**Response:** File download (application/vnd.openxmlformats-officedocument.wordprocessingml.document or application/pdf)

**Headers:**
```
Content-Disposition: attachment; filename="Business-Case-Store-A.docx"
```

### POST /documents/:documentId/export/google-doc
Export to Google Docs (v1: stub).

**Response:**
```json
{
  "url": "https://docs.google.com/document/d/...",
  "message": "Exported to Google Docs. Note: HBMP remains the source of truth."
}
```

**Note:** For v1, this can return a placeholder URL or show a "Coming soon" message.

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 404: Not Found
- 500: Internal Server Error

