# Low-Code Responsive Builder

## Overview

A visual drag-and-drop builder for creating web apps and deploying to Vercel with one click. Built with React, TypeScript, Vite, Tailwind CSS, and Express backend.

**Features**: Visual components library, responsive design (mobile/tablet/web), flow & absolute canvas modes, one-click Vercel deployment, export as JSON or React+Vite projects.

---

## Project Structure

```
src/                   # React frontend
├── components/        # MiniBuilder.tsx (main editor), Default.tsx
├── App.tsx & index.tsx

backend/
├── server.js          # Express API for code generation & deployment

tools/
├── generate.js        # Converts app JSON → React+Vite projects
├── generate-expo.js   # Converts app JSON → React Native

Configuration: package.json, vite.config.ts, tsconfig.json, eslint.config.js
```

---

## Quick Start

### 1. Install & Setup

```bash
npm install

# Create .env for Vercel deployment (optional)
echo "VERCEL_TOKEN=your_token_here" > .env
```

Get token from: https://vercel.com/account/tokens

### 2. Run Development Server

```bash
npm run dev
# Or individually:
npm run frontend  # Terminal 1
npm run backend   # Terminal 2
```

Open: `http://localhost:5173`

---

## Commands

| Command            | Purpose                  |
| ------------------ | ------------------------ |
| `npm run dev`      | Start frontend + backend |
| `npm run frontend` | Vite dev server          |
| `npm run backend`  | Express API server       |
| `npm run build`    | Production build         |
| `npm run lint`     | Check code quality       |

---

## Tech Stack

- **Frontend**: React 19, TypeScript 5.8, Tailwind CSS 4, Vite 7
- **Backend**: Express 4, @vercel/client, Archiver
- **Tools**: ESLint, npm-run-all, dotenv

---

## How It Works

### Architecture Overview

```
┌─────────────────────┐
│   Frontend (React)  │
│   - Visual Editor   │  User drag-drops components,
│   - Canvas View     │  configures styles, exports app
└──────────┬──────────┘
           │ HTTP Requests
           ↓
┌─────────────────────┐
│  Backend (Express)  │
│  - API Server       │  Receives app definition (JSON),
│  - Code Generator   │  generates code, deploys to Vercel
│  - Vercel Client    │
└─────────────────────┘
```

### Step-by-Step Flow

1. **User Opens Editor** → Frontend loads `MiniBuilder.tsx` with empty canvas

2. **Drag & Drop** → User adds components (Text, Button, Input, etc.)
   - Each component stored in state with props: `{ type, props: { style, content } }`
   - Visual preview updates in real-time

3. **Configure Styles** → User sets colors, padding, borders, positioning
   - Styles stored as JSON object in component props
   - Responsive modes (mobile/tablet/web) preview different layouts

4. **Export/Deploy Options**:
   - **Download JSON**: Saves app definition as JSON file
   - **Generate Web**: Sends app JSON to `/api/generate-web`
   - **Deploy to Vercel**: Sends app JSON to `/api/deploy`

5. **Backend Processing**:

   ```
   App Definition (JSON)
        ↓
   [server.js validates & receives request]
        ↓
   [generate.js transforms JSON → React code]
        ↓
   [Creates project structure]
        ├─ components/
        ├─ package.json
        ├─ vite.config.ts
        ├─ tsconfig.json
        └─ src/App.tsx (rendered components)
        ↓
   [Archives as ZIP]
        ↓
   [For deployment: Uses @vercel/client to upload & deploy]
   ```

6. **generate.js Logic**:
   - Reads JSON file containing component tree
   - Function `renderNodeToJSX(node)` converts each component to JSX code
   - Generates complete App.tsx with all components
   - Creates package.json with React, Vite, Tailwind dependencies
   - Outputs to folder, then zips it

7. **Live App**:
   - If deployed: Vercel builds & hosts the generated React project
   - If downloaded: User can run `npm install && npm run dev` locally

### Data Flow Example

**User creates a simple button:**

```json
{
  "components": [
    {
      "id": "btn-1",
      "type": "Button",
      "props": {
        "content": "Click Me",
        "style": {
          "backgroundColor": "#3b82f6",
          "textColor": "#ffffff",
          "px": 16,
          "py": 8,
          "radius": 6
        }
      }
    }
  ]
}
```

**generate.js converts to:**

```jsx
export default function App() {
  return (
    <button
      style={{
        backgroundColor: "#3b82f6",
        color: "#ffffff",
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingTop: "8px",
        paddingBottom: "8px",
        borderRadius: "6px",
      }}
    >
      Click Me
    </button>
  );
}
```

### Frontend-Backend Communication

| Frontend Action | Endpoint            | Data Sent | Returns    |
| --------------- | ------------------- | --------- | ---------- |
| Export JSON     | Local Save          | App JSON  | JSON file  |
| Generate Web    | `/api/generate-web` | App JSON  | ZIP file   |
| Deploy Live     | `/api/deploy`       | App JSON  | Vercel URL |

---

## Core Workflow

1. **Build**: Drag components in visual builder → configure styles/content
2. **Export**: Download JSON or generate full React+Vite project (zipped)
3. **Deploy**: Click "Deploy to Vercel" → app goes live instantly

---

## API Endpoints

- `POST /api/generate-web` - Generate React+Vite project
- `POST /api/generate-expo` - Generate React Native project
- `POST /api/deploy` - Deploy to Vercel (requires VERCEL_TOKEN)

---

## Components Available

Text, Button, Input, Card, Grid, Auth Screen

---

## Troubleshooting

```bash
# Port in use
lsof -i :3000

# Clear cache & reinstall
rm -rf node_modules && npm install

# TypeScript build errors
npm run build
```

---

## Key Files

- `src/components/MiniBuilder.tsx` - Main visual editor
- `backend/server.js` - API & deployment logic
- `tools/generate.js` - Code generation engine
- `vite.config.ts` - Build configuration
- `package.json` - Dependencies & scripts
