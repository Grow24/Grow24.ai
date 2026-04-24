# Grow24.ai - Enterprise SaaS Platform

A production-ready, enterprise-grade SaaS platform built with the TanStack ecosystem for Personal & Business Management.

## 🚀 Features

- **3D Atmospheric Background**: React Three Fiber-powered immersive experience with emerald-green organic mesh
- **Glassmorphic Design**: Modern, elegant UI with translucent glass effects inspired by BCG.com
- **Type-Safe Routing**: TanStack Router with full TypeScript support and parallel routes
- **Mega-Menu with PBMP Logic**: Tabbed navigation with accordion-based solution exploration
- **Interactive Solutions Grid**: 5-column grid with hover/click persistence and side panel
- **Faceted Search Hub**: MECE resource filtering with bookmark-friendly URL parameters
- **Floating Widgets**: WhatsApp chat and AI-powered chatbot with intent-based responses
- **Authentication**: Integrated Clerk authentication for enterprise-grade security (optional)

## 📋 Tech Stack

- **Frontend Framework**: React 19 with TanStack Start (SSR/SPA hybrid)
- **Routing**: TanStack Router (type-safe, search-param driven)
- **Styling**: Tailwind CSS 4.0 with custom glassmorphism utilities
- **Animations**: Framer Motion for smooth, performant transitions
- **3D Graphics**: React Three Fiber with WebGPU/WebGL2 fallback
- **Backend**: TanStack Start with server functions
- **Authentication**: Clerk (optional)
- **Package Manager**: Bun/pnpm

## 🏗️ Project Structure

```
Grow24/
├── src/
│   ├── components/
│   │   ├── CalmBackground.tsx      # 3D React Three Fiber background
│   │   ├── Header.tsx              # Sticky header with logo & CTAs
│   │   ├── MegaMenu.tsx            # PBMP-powered mega menu
│   │   ├── SolutionsGrid.tsx       # Interactive 5-column solutions grid
│   │   ├── ResourceHub.tsx         # Faceted search library
│   │   ├── FloatingWidgets.tsx     # WhatsApp & Chatbot components
│   │   └── RootLayout.tsx          # Persistent layout wrapper
│   ├── routes/
│   │   ├── index.tsx               # Home page
│   │   ├── solutions.tsx           # Solutions page
│   │   └── resources.tsx           # Resources hub page
│   ├── router.ts                   # TanStack Router configuration
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── public/
│   └── logo.webp                   # High-res logo
├── vite.config.ts                  # Vite configuration
├── tailwind.config.ts              # Tailwind with glassmorphism
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies
└── index.html                      # HTML entry point
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js >= 18.0.0
- Bun or pnpm (Bun recommended for speed)

### 1. Install Dependencies

```bash
bun install
# or
pnpm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
# Update .env.local with your values (optional):
# - CLERK_SECRET_KEY: From Clerk dashboard (for authentication)
# - VITE_CLERK_PUBLISHABLE_KEY: From Clerk dashboard (for authentication)
# - VITE_API_ENDPOINT: Chatbot API endpoint (defaults to localhost:3000/api/chat)
```

### 3. Development server

**Main site only** (Vite):

```bash
npm run dev
# or: bun run dev / pnpm dev
```

Open **http://localhost:5173/**

**Run all apps together on one origin** (`http://localhost:5173`):

1. One-time: install Univer (pnpm) and HBMPONE client — see **[docs/LOCAL_DEV_UNIVER.md](./docs/LOCAL_DEV_UNIVER.md)**.
2. Start everything:

```bash
npm run dev:all
```

Then open:

| URL | App |
|-----|-----|
| http://localhost:5173/ | Main website |
| http://localhost:5173/app_manager/ | app_manager |
| http://localhost:5173/Google/ | Google |
| http://localhost:5173/HBMP_AgentBot/ | HBMP_AgentBot |
| http://localhost:5173/HBMP_DOCS_PLATFORM/ | HBMP_DOCS_PLATFORM |
| http://localhost:5173/hbmp_form_manager/ | hbmp_form_manager |
| http://localhost:5173/HBMP_One/ | HBMP_One |
| http://localhost:5173/ImageProcessing/ | ImageProcessing |
| http://localhost:5173/ivvychainv2/ | ivvychainv2 |
| http://localhost:5173/mcp_server/ | mcp_server |
| http://localhost:5173/Microsoft/ | Microsoft |
| http://localhost:5173/Mxgraph_ReactFlow/ | Mxgraph_ReactFlow |
| http://localhost:5173/mxgraph_standalone/ | mxgraph_standalone |
| http://localhost:5173/OpenStreetMaps/ | OpenStreetMaps |
| http://localhost:5173/whatsappchat/ | whatsappchat |
| http://localhost:5173/Project/ | project |
| http://localhost:5173/n8n/ | n8n |
| http://localhost:5173/univer/ | univer |

Optional: HBMP API on port **4000** — `cd HBMPONE/server && npm install && npm run dev`

**Deploy (GitHub → Zeabur / Docker):** use the root **`Dockerfile`** (Caddy serves `/`, `/univer/`, `/HBMPONE/`, `/n8n/`). Deploy n8n as a separate Zeabur service from `n8n/n8n-tesseract` and set `N8N_UPSTREAM` on the frontend service. See **[DEPLOY_ZEABUR.md](./DEPLOY_ZEABUR.md)**. Pushes to `main`/`master` run **`.github/workflows/build.yml`** to verify `npm run build`.

### 4. Build for Production

```bash
bun run build
bun run start
```

## 📦 Key Dependencies

### Frontend

- `react@19` - UI library
- `@tanstack/start` - Full-stack framework
- `@tanstack/react-router` - Type-safe routing
- `@tanstack/react-query` - Data fetching
- `framer-motion` - Animation library
- `@react-three/fiber` - 3D graphics
- `three` - 3D engine
- `tailwindcss@4` - Styling
- `react-floating-whatsapp` - WhatsApp widget

### Backend & Services

- `@clerk/tanstack-start` - Authentication (optional)
- PBMP ChatBot backend - Express server with Google Gemini AI integration

### Development

- `typescript` - Type safety
- `vite` - Build tool
- `@tanstack/router-plugin/vite` - Vite integration
- `@tanstack/eslint-plugin-router` - Linting

## 🎨 Styling Customization

### Glassmorphism Utilities

Available in `tailwind.config.ts`:

- `.glass` - Full glass effect with blur
- `.glass-dark` - Dark variant
- `.glass-sm` - Small glass element
- `.text-gradient` - Emerald gradient text

### Color Palette

- **Primary**: Emerald (#10b981)
- **Light**: Emerald-400 (#4ade80)
- **Dark**: Emerald-700 (#15803d)
- **Secondary**: Cyan for accents

## 🔐 Authentication Setup (Optional)

Authentication is optional. If you want to use Clerk:

1. Create a Clerk account at https://clerk.com
2. Create a new application
3. Copy your keys to `.env.local`:
   - `CLERK_SECRET_KEY` (Secret)
   - `VITE_CLERK_PUBLISHABLE_KEY` (Publishable)
4. Configure your app URL in Clerk dashboard

The app will work without authentication - Clerk integration gracefully degrades if keys are not provided.

## 🤖 Chatbot & WhatsApp Integration

The platform includes a powerful AI chatbot with WhatsApp integration:

### PBMP ChatBot Features

- **AI-Powered Responses**: Uses Google Gemini 2.0 Flash for intelligent conversations
- **RAG Integration**: Retrieval-Augmented Generation with AstraDB knowledge base
- **WhatsApp Integration**: Connect via WhatsApp Business API (WAPI.in.net)
- **Voice Input**: Audio recording and transcription support
- **Diagram Visualization**: Personal and Professional PBMP cycle diagrams
- **Meeting Booking**: Conversational meeting scheduling flow

### Chatbot Backend Setup

The chatbot backend is deployed separately. The frontend components are integrated in `src/components/pbmp/` and connect to the deployed backend API endpoint.

Configure the API endpoint via environment variable:
```bash
VITE_API_ENDPOINT=https://your-backend-url/api/chat
```

## 🚀 Performance Optimizations

- **Lazy Loading**: Components load on-demand with React.lazy
- **Code Splitting**: Automatic route-based and vendor chunks
- **Image Optimization**: WebP format with fallbacks
- **CSS-in-JS**: Tailwind for minimal CSS output
- **Three.js Optimization**: Mesh instancing and LOD management
- **SSR Ready**: TanStack Start handles hydration

## 📱 Responsive Design

- Mobile-first approach with Tailwind breakpoints
- Glassmorphic design scales beautifully on all devices
- Touch-optimized floating widgets
- Responsive grid layouts with CSS Grid

## 🔍 SEO & Accessibility

- Semantic HTML with proper heading hierarchy
- ARIA labels on interactive elements
- SVG icons for accessibility
- Meta tags for social sharing
- Structured data ready

## 🧪 Type Checking & Linting

```bash
# Type check
bun run type-check

# Lint code
bun run lint

# Format code
bun run format
```

## 📚 Resources & Documentation

- [TanStack Start Docs](https://tanstack.com/start/latest)
- [TanStack Router Docs](https://tanstack.com/router/latest)
- [Tailwind CSS 4.0](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Clerk Documentation](https://clerk.com/docs)

## 🤝 Contributing

This is a production-ready scaffold. Feel free to customize:

1. Update color schemes in `tailwind.config.ts`
2. Modify components in `src/components/`
3. Add new routes in `src/routes/`
4. Customize chatbot behavior by updating the backend API (deployed separately)

## 📄 License

Enterprise SaaS Platform - All Rights Reserved

## 🆘 Support

For issues, questions, or customization requests, refer to the official documentation of each library or contact support.

---

**Built with ❤️ using TanStack ecosystem - 2026**
