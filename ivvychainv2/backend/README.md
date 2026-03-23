# IVYCHAIN v2 Backend API

Node.js + Express backend for Business Performance Dashboard.

## Setup

```bash
npm install
npm run dev
```

Server runs on http://localhost:3001

## API Endpoints

- `POST /api/filters/results-summary` - Get filtered record summary
- `POST /api/highlights` - Get highlights data
- `POST /api/quick-overview` - Get quick overview charts data
- `POST /api/item-group-treemap` - Get treemap data
- `POST /api/monthly-trends` - Get monthly trends charts
- `POST /api/sales-overview` - Get sales overview charts

All endpoints accept filter parameters in the request body.

