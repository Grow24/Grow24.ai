# IVYCHAIN v2 - Business Performance Dashboard

React application for IVYCHAIN (Integrated Business Performance Improvement) with comprehensive Business Performance dashboard.

## Features

- **Environment Scanning** landing page with Venn diagram
- **Business Performance Dashboard** with:
  - Comprehensive filter panel
  - Highlights section with Text/Table views
  - Quick Overview with KPIs and charts
  - Treemap visualizations (Item Group, Industry Type, Product Group)
  - Monthly Trends charts
  - Sales Overview with multiple area charts
- Sidebar navigation with expandable sections
- Responsive design with Tailwind CSS
- Real-time data updates with debouncing

## Project Structure

```
ivvychain-v2/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── shared/     # Reusable components
│   │   │   ├── FilterPanel.js
│   │   │   ├── HighlightsSection.js
│   │   │   ├── QuickOverviewSection.js
│   │   │   ├── TreemapSection.js
│   │   │   ├── MonthlyTrendsSection.js
│   │   │   └── SalesOverviewSection.js
│   │   └── pages/
│   │       ├── EnvironmentScanning.js
│   │       └── BusinessPerformance.js
│   └── package.json
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── server.js
│   │   └── mockData.js
│   └── package.json
└── README.md
```

## Getting Started

### Frontend Setup
```bash
cd ivvychain-v2
npm install
npm start
```

Frontend runs on http://localhost:3000

### Backend Setup
```bash
cd ivvychain-v2/backend
npm install
npm run dev
```

Backend runs on http://localhost:3001

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Recharts (for charts)
- Axios (for API calls)

### Backend
- Node.js
- Express.js
- Mock data generators

## Navigation

Access Business Performance dashboard:
1. Click "Business Insights" in sidebar
2. Click "EVPS" to expand
3. Click "Business Performance"

## API Endpoints

- `POST /api/filters/results-summary` - Get filtered record summary
- `POST /api/highlights` - Get highlights data
- `POST /api/quick-overview` - Get quick overview charts
- `POST /api/item-group-treemap` - Get treemap data
- `POST /api/monthly-trends` - Get monthly trends charts
- `POST /api/sales-overview` - Get sales overview charts
