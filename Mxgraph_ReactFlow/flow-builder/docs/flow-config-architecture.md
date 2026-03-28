# Flow Configuration Architecture

## Overview

This document describes the end-to-end schema-based configuration system for the HBMP Flow Builder, providing a user-friendly interface while maintaining backward compatibility with legacy execution engines.

## Architecture Diagram

```mermaid
flowchart LR
    A[User: Click Node] --> B[NodeConfigDrawer]
    B --> C[Procedural Config Panel]
    C --> D[configMapper.ts → JSON]
    D --> E[nodeValidators.ts]
    E -->|Valid| F[PUT /api/flows/:id]
    E -->|Invalid| E2[Show Inline Errors]
    F --> G[Express + ConfigAdapter]
    G --> H[Prisma: NodeMaster.data JSON]
    H --> I[FlowVersionHistory Snapshot]
    I --> J[FlowRunner Executes]
    J --> K[Execution Logs → Frontend]
    C -.-> L[/api/catalog/fields & actions]
    C -.-> M[/api/flows/:id/test-decision]
```

## Data Flow Pipeline

### 1. Frontend Schema Layer

**Files:**
- `schemas/nodeSchemas.ts` - Zod schemas for type safety
- `mappers/configMapper.ts` - UI ↔ JSON conversion
- `validators/nodeValidators.ts` - Human-readable validation

**Process:**
1. User interacts with procedural config panels
2. Form data validated against Zod schemas
3. Mappers convert to canonical JSON format
4. Validators provide friendly error messages

### 2. Backend Processing Layer

**Files:**
- `services/NodeConfigSchema.ts` - Runtime type guards
- `services/ConfigAdapter.ts` - Legacy compatibility adapter
- `routes/devAudit.ts` - Flow analysis and audit

**Process:**
1. Express receives structured config data
2. ConfigAdapter detects and processes structured formats
3. Legacy compatibility ensured via `compileDecisionForLegacyEval()`
4. Version snapshots created automatically

### 3. Data Persistence Layer

**Database Tables:**
- `FlowMaster` - Flow metadata and versioning
- `NodeMaster` - Node configurations as JSON
- `EdgeMaster` - Flow connections and labels
- `VariableMaster` - Context variables and types
- `FlowVersionHistory` - Automatic snapshots for rollback

### 4. Execution Layer

**Legacy Preservation:**
- FlowRunner logic unchanged
- String-based expression evaluation maintained
- ConfigAdapter generates compatible formats
- Future-ready for structured comparison migration

## Node Configuration Panels

### Start Node
- **Input:** Step label, description, icon
- **Output:** `StartNodeData`
- **Features:** Entry point configuration

### Decision Node
- **Input:** Question, field + operator + value builder
- **Output:** `DecisionNodeData` with MECE validation
- **Features:** Path-based condition builder, auto edge sync

### Action Node
- **Input:** Type selector + form for email/API/DB config
- **Output:** `ActionNodeData`
- **Features:** Type-specific configuration panels

### Process Node
- **Input:** Assigned to, instructions, duration
- **Output:** `ProcessNodeData`
- **Features:** Business process metadata

### End Node
- **Input:** Outcome & message
- **Output:** `EndNodeData`
- **Features:** Flow completion configuration

## API Endpoints

### Core Flow Operations
- `GET /api/flows` - List all flows
- `GET /api/flows/:id` - Get flow details
- `PUT /api/flows/:id` - Update flow (with auto-versioning)
- `POST /api/flows/:id/validate` - Validate flow structure
- `POST /api/flows/:id/run` - Execute flow

### Catalog & Testing
- `GET /api/catalog/fields` - Available variables
- `GET /api/catalog/operators` - Operators by data type
- `GET /api/catalog/actions` - Action types
- `POST /api/flows/:id/test-decision` - Test decision logic

### Development & Audit
- `GET /api/dev/flows/:id/audit` - Flow analysis
- `GET /api/flows/:id/versions` - Version history
- `POST /api/flows/:id/versions` - Create snapshot

## Migration Strategy

### Legacy Data Normalization
```typescript
// Migration script: scripts/migrations/2025-normalize-node-data.ts
// Converts: "age > 18" → { field: "age", operator: "greater_than", value: 18 }
```

### Backward Compatibility
- All existing flows execute unchanged
- ConfigAdapter ensures legacy format generation
- Runtime type guards provide non-breaking validation warnings

## Real-Time Collaboration Foundation

### Socket.io Namespaces
- `/flow` - Flow editing collaboration
- `/whiteboard` - Diagram collaboration  
- `/docs` - Documentation collaboration

### Y.js Integration Ready
- WebSocket server configured
- Snapshot persistence every 30s
- Multi-user editing foundation prepared

## Acceptance Criteria Status

✅ **Non-tech user can configure flows via procedural panels**
- Form-based configuration for all node types
- Contextual help and validation guidance
- Visual type selectors and field builders

✅ **All JSON stored in NodeMaster.data is schema-valid**
- Zod validation on frontend and backend
- Runtime type guards with warnings
- Automatic schema compliance reporting

✅ **Legacy flows execute unchanged**
- FlowRunner logic preserved
- ConfigAdapter ensures compatibility
- String-based expression evaluation maintained

✅ **Every update creates FlowVersionHistory snapshots**
- Automatic snapshots before updates
- Manual snapshot creation API
- Rollback capability ready

✅ **Migration normalizes ≥ 90% legacy decision nodes**
- Expression parsing for common patterns
- Structured format generation
- Snapshot creation before migration

✅ **Catalog and test endpoints power dynamic forms**
- Field and operator catalogs
- Action type definitions
- Decision testing with sample data

✅ **UI remains consistent with React Flow canvas**
- Integrated with existing NodeConfigDrawer
- Maintains visual design language
- Seamless user experience

## Development Commands

```bash
# Generate Prisma client
npx prisma generate

# Run backend
npm run dev --workspace=apps/backend

# Run frontend  
npm run dev --workspace=apps/frontend

# Execute migration
ts-node scripts/migrations/2025-normalize-node-data.ts
```

## Future Enhancements

1. **Structured Expression Engine** - Replace eval with type-safe comparisons
2. **Advanced MECE Validation** - Logical overlap detection
3. **Template Library** - Reusable flow patterns
4. **Real-time Collaboration** - Multi-user editing with Y.js
5. **Visual Query Builder** - Drag-and-drop condition creation