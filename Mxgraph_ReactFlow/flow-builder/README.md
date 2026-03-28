# HBMP Flow Builder

A Salesforce Flow-style visual workflow builder with React + TypeScript frontend and Node.js + Prisma + MySQL backend.

## Quick Start

### Prerequisites
- Node.js 18+
- SQLite (included with Node.js)

### Setup

1. **Install dependencies:**
```bash
npm run install:all
```

2. **Setup database:**
```bash
cd apps/backend
npx prisma migrate dev
npx prisma generate
npm run db:seed
```

3. **Start development servers:**
```bash
npm run dev
```

This starts:
- Backend API: http://localhost:3001
- Frontend: http://localhost:5173

## Features

### ✅ Backend (Node.js + Express + Prisma + SQLite)
- **Models**: FlowMaster, NodeMaster, EdgeMaster, VariableMaster, FlowVersionHistory
- **API**: CRUD flows, validate flows, run flows
- **Services**: FlowValidator (MECE validation), FlowRunner (execution engine)
- **Security**: Safe expression evaluator, Zod validation, CORS

### ✅ Frontend (React + TypeScript + Tailwind + @xyflow/react)
- **Visual Builder**: Drag nodes, connect edges, configure properties
- **Node Types**: Start, Decision (MECE branches), Action, End
- **Features**: Auto-layout, validation, execution, autosave
- **UI**: ShadCN components, responsive design

### ✅ Flow Validation
- One Start node, ≥1 End node reachable
- Valid edges and node references
- Decision nodes: MECE conditions, unique labels, default path
- Action nodes: valid actionType (email/api/db)

### ✅ Flow Execution
- Start→Decision→Action→End logic
- Safe expression evaluation (blocks globals)
- Action adapters: email/api/db simulation
- Execution logs and output context

## Usage

1. **Create Flow**: Click "New" to create empty flow
2. **Add Nodes**: Click node buttons in sidebar to add to canvas
3. **Connect**: Drag between node handles to create edges
4. **Configure**: Click nodes to open configuration drawer
5. **Validate**: Click "Validate" to check flow structure
6. **Execute**: Click "Run" to execute flow logic
7. **Save**: Click "Save" to persist to database

## Architecture

```
apps/
├── backend/
│   ├── src/
│   │   ├── lib/           # expression.ts, graph.ts
│   │   ├── services/      # FlowValidator.ts, FlowRunner.ts
│   │   ├── tests/         # Vitest unit tests
│   │   └── server.ts      # Express API
│   └── prisma/
│       └── schema.prisma  # Database models
└── frontend/
    ├── src/
    │   ├── api/           # flows.ts (axios client)
    │   ├── components/
    │   │   ├── nodes/     # StartNode, DecisionNode, etc.
    │   │   └── NodeConfigDrawer.tsx
    │   ├── config/        # nodeTypes.ts
    │   └── pages/         # FlowBuilder.tsx
    └── package.json
```

## Testing

```bash
cd apps/backend
npm test
```

## Database Schema

- **FlowMaster**: id, name, version, status, description, timestamps
- **NodeMaster**: flowId, nodeId, type, label, data(JSON), positionX/Y
- **EdgeMaster**: flowId, edgeId, source, target, handles, label, animated
- **VariableMaster**: flowId, name, type, defaultValue(JSON)
- **FlowVersionHistory**: flowId, version, jsonBackup(JSON), author, createdAt

All with proper foreign keys and cascade deletes.