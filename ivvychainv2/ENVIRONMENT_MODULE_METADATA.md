# Environment Module - Complete Metadata & Structure

## Navigation Path
**Left Menu:** Business Insights → EVPS → Environment  
**Route:** `/business-insights/evps/environment`  
**Component:** `src/pages/Environment.js`

## Top-Level Module Tabs
1. Survey
2. OICA
3. Census
4. GDP Analysis
5. Exchange Rate Analysis
6. Inflation Analysis
7. SIAM Data Analysis
8. Second Hand Vehicles

---

## 1. SURVEY MODULE

### Route
`/business-insights/evps/environment/survey`

### Component
`src/components/environment/SurveyModule.js`

### Sub-Tabs
- **MASTER** - Survey master data and configuration
- **Performance** - Survey performance metrics and map
- **Insights** - Survey response analysis with stacked bar charts

### Filters
- **Select Survey:** Pill buttons (Retailer HABA, Detergent)

### MASTER Tab Structure

#### KPI Tiles (4 tiles)
1. **Name of Survey** → Value: survey name
2. **Target Audience** → Value: target audience type
3. **Target Completion** → Value: completion percentage
4. **Target Region** → Value: geographic region

#### Action Button
- **Take a survey** → Opens survey URL in new tab

### Performance Tab Structure

#### KPI Tiles (4 tiles)
1. **Name of Survey** → Value: survey name
2. **Sent Status** → Value: percentage sent
3. **Delivered Status** → Value: percentage delivered
4. **Completion Status** → Value: percentage completed

#### Map Widget
- **Title:** "Completion Metrics"
- **Type:** Leaflet map with clustered markers
- **Features:** Zoom controls (+/-), marker tooltips
- **Data:** Geo-coordinates with completion counts per territory

### Insights Tab Structure

#### Filters
- **Customer:** Dropdown (1, 2, 3, ...)
- **Territory:** Dropdown (India, North, South, ...)

#### Chart
- **Type:** Horizontal stacked bar chart
- **Y-axis:** Survey questions (10 questions)
- **X-axis:** Percentage (-100% to +100%)
- **Stacked segments:**
  - Strongly Disagree (Dark Red)
  - Disagree (Orange)
  - Neutral (Light Yellow)
  - Agree (Light Green)
  - Strongly Agree (Dark Green)

### Data Model

```javascript
// Survey Master
{
  survey_id: string,
  survey_name: string,
  target_audience: string,
  target_completion_pct: number,
  target_region: string,
  survey_url: string,
  start_date: date,
  end_date: date,
  status: 'Planned' | 'Live' | 'Closed'
}

// Survey Performance
{
  survey_id: string,
  territory_id: string,
  customer_segment_id: string,
  sent_count: number,
  delivered_count: number,
  completed_count: number,
  sent_pct: number,
  delivered_pct: number,
  completion_pct: number,
  lat: number,
  lng: number
}

// Survey Question Response Distribution
{
  survey_id: string,
  question_id: string,
  question_text: string,
  territory_id: string,
  customer_segment_id: string,
  response_category: 'Strongly Disagree' | 'Disagree' | 'Neutral' | 'Agree' | 'Strongly Agree',
  response_pct: number,
  response_count: number
}
```

---

## 2. OICA MODULE

### Route
`/business-insights/evps/environment/oica`

### Component
`src/components/environment/OicaModule.js`

### Sections

#### Section A: Sales by country by category
- **Filter:** Pill buttons (All Vehicles, Passenger Vehicles, Commercial Vehicles)
- **Chart:** Placeholder for sales visualization

#### Section B: Top N Country Marketers
- **Table Columns:**
  - ID
  - Country
  - Unit Sales 2007
  - Unit Sales 2017
  - CAGR (2007-2017)
  - Rank 2007
  - Rank 2017
  - Global Share 2007
  - Global Share 2017
- **Actions:** Copy, CSV, Print, Search

#### Section C: Growth Region on Map
- **Type:** Choropleth map
- **Metric:** CAGR or growth category
- **Features:** Zoom controls, country tooltips

#### Section D: Volume Units by Continent
- **Filter:** Pill buttons (All Vehicles, Passenger Vehicles, Commercial Vehicles)
- **Chart:** Placeholder for volume visualization

#### Section E: Continental Market Share
- **Table Columns:**
  - Continent
  - 2008, 2009, 2010, ..., 2017 (year columns)
- **Actions:** Copy, CSV, Print, Search

### Data Model

```javascript
// OICA Country Annual Stats
{
  country_code: string,
  country_name: string,
  year: number,
  vehicle_category: 'All' | 'Passenger' | 'Commercial',
  unit_sales: number,
  market_share: number,
  rank: number,
  continent: string
}

// Derived: CAGR 2007-2017
{
  country_code: string,
  cagr_2007_2017: number,
  growth_category: 'High' | 'Medium' | 'Low'
}
```

---

## 3. CENSUS MODULE

### Route
`/business-insights/evps/environment/census`

### Component
`src/components/environment/CensusModule.js`

### Sub-Tabs
- **Graphs** - Horizontal bar chart
- **Table** - Detailed census data table

### Filters (Left Panel)
- **Select Country:** Dropdown (default: India)
- **Select State:** Dropdown (All or specific state)
- **Select District:** Dropdown (All or specific district)

### Graphs Tab
- **Chart Type:** Horizontal bar chart
- **Y-axis:** State names or District names
- **X-axis:** Population
- **Behavior:** Updates based on State filter (state-level vs district-level)

### Table Tab
- **Columns:**
  - State name
  - District name
  - Population
  - Male
  - Female
- **Features:** Pagination, Search, Sort, Export

### Data Model

```javascript
// Census Stats
{
  country_code: string,
  country_name: string,
  state_code: string,
  state_name: string,
  district_code: string,
  district_name: string,
  population_total: number,
  population_male: number,
  population_female: number,
  census_year: number
}
```

---

## 4. GDP ANALYSIS MODULE

### Route
`/business-insights/evps/environment/gdp`

### Component
`src/components/environment/GdpModule.js`

### Sub-Tabs
- **Graphs** - Multi-series line chart
- **Table** - GDP data table

### Filters
- **Select Location:** Dropdown (All or specific country code)
- **Select Measure:** Dropdown (MLN_USD, USD_CAPITA, GROWTH)

### Graphs Tab
- **Chart Type:** Multi-series line chart
- **X-axis:** Years (1960-2017)
- **Y-axis:** GDP value (MLN_USD)
- **Series:** Multiple countries (ARG, AUS, AUT, BEL, BGR, etc.)
- **Legend:** Paginated (1/12, 2/12, etc.) with clickable items to toggle series
- **Tooltip:** Year, Country code, Value

### Table Tab
- **Columns:**
  - LOCATION
  - MEASURE
  - TIME (year)
  - Value
- **Features:** Pagination, Search, Sort, Export

### Data Model

```javascript
// GDP Data
{
  location_code: string,
  location_name: string,
  measure_code: string, // MLN_USD, USD_CAPITA, GROWTH
  measure_name: string,
  year: number,
  gdp_value: number
}
```

---

## 5. EXCHANGE RATE ANALYSIS MODULE

### Route
`/business-insights/evps/environment/exchange-rate`

### Component
`src/components/environment/ExchangeRateModule.js`

### Sub-Tabs
- **Graphs** - Multi-series line chart
- **Table** - Exchange rate data table

### Filters
- **Select Location:** Dropdown (All or specific country code)
- **Select Measure:** Dropdown (NATUSD, NATEUR, NATGBP)

### Graphs Tab
- **Chart Type:** Multi-series line chart
- **X-axis:** Years (1950-2016)
- **Y-axis:** Exchange rate
- **Series:** Multiple countries
- **Special:** IDN shows significant fluctuations
- **Legend:** Paginated with toggle functionality

### Table Tab
- **Columns:**
  - LOCATION
  - MEASURE
  - TIME (year)
  - Value
- **Features:** Pagination, Search, Sort, Export

### Data Model

```javascript
// Exchange Rate Data
{
  location_code: string,
  location_name: string,
  measure_code: string, // NATUSD, NATEUR, NATGBP
  measure_name: string,
  year: number,
  exchange_rate: number
}
```

---

## 6. INFLATION ANALYSIS MODULE

### Route
`/business-insights/evps/environment/inflation`

### Component
`src/components/environment/InflationModule.js`

### Sub-Tabs
- **Graphs** - Multi-series line chart
- **Table** - Inflation data table

### Filters
- **Select Location:** Dropdown (All or specific country code)
- **Select Measure:** Dropdown (AGRWTH, CPI, DEFLATOR)

### Graphs Tab
- **Chart Type:** Multi-series line chart
- **X-axis:** Years (1916-2016)
- **Y-axis:** Inflation value (AGRWTH)
- **Series:** Multiple countries
- **Special:** Some countries show spikes (e.g., LTU in 1992)
- **Legend:** Paginated with toggle functionality

### Table Tab
- **Columns:**
  - LOCATION
  - MEASURE
  - TIME (year)
  - Value
- **Features:** Pagination, Search, Sort, Export

### Data Model

```javascript
// Inflation Data
{
  location_code: string,
  location_name: string,
  measure_code: string, // AGRWTH, CPI, DEFLATOR
  measure_name: string,
  year: number,
  inflation_value: number
}
```

---

## 7. SIAM DATA ANALYSIS MODULE

### Route
`/business-insights/evps/environment/siam`

### Component
`src/components/environment/SiamModule.js`

### Sections (2x2 Grid + Pie Chart)

#### 1. Production trends by vehicles
- **Chart Type:** Stacked bar chart
- **X-axis:** Years (2012-13 to 2016-17)
- **Y-axis:** Production units
- **Series:** Passenger Vehicles, Commercial Vehicles, Three Wheelers, Two Wheelers

#### 2. Production trends over years
- **Chart Type:** Multi-line chart
- **X-axis:** Years (2012-13 to 2016-17)
- **Y-axis:** Production units
- **Series:** Same as above

#### 3. Sales Trends By Vehicles
- **Chart Type:** Stacked bar chart
- **X-axis:** Years (2012-13 to 2017-18)
- **Y-axis:** Sales units
- **Series:** Same vehicle categories

#### 4. Sales Trends Over Years
- **Chart Type:** Multi-line chart
- **X-axis:** Years (2012-13 to 2017-18)
- **Y-axis:** Sales units
- **Series:** Same vehicle categories

#### 5. Pie Chart
- **Type:** Pie chart showing market share
- **Segments:** Two Wheelers (81%), Passenger Vehicles (13%), Commercial Vehicles, Three Wheelers
- **Legend:** Color-coded by vehicle type

### Data Model

```javascript
// SIAM Vehicle Year Data
{
  year: string, // '2012-13', '2013-14', etc.
  vehicle_category: 'Passenger Vehicles' | 'Commercial Vehicles' | 'Three Wheelers' | 'Two Wheelers',
  production_units: number,
  sales_units: number
}
```

---

## 8. SECOND HAND VEHICLES MODULE

### Route
`/business-insights/evps/environment/second-hand`

### Component
`src/components/environment/SecondHandVehiclesModule.js`

### Sections

#### Section 1: All India Repurposed/New Growth(%)
- **Layout:** Chart (left) + Table (right)
- **Chart Type:** Line chart
- **Series:** Repurposed (blue), New (red)
- **X-axis:** Period (2016, 2017, 2018)
- **Y-axis:** Growth percentage (8-14%)
- **Table Columns:**
  - Type (Repurposed/New)
  - Growth
  - Period

#### Section 2: Segment wise Repurposed/New Growth(%)
- **Layout:** Chart (left) + Table (right)
- **Chart Type:** Line chart
- **Series:** Repurposed (blue), New (red)
- **X-axis:** Period (2016, 2017, 2018)
- **Y-axis:** Growth percentage (0-30%)
- **Table Columns:**
  - Segment (e.g., Luxuary)
  - Type (Repurposed/New)
  - Growth
  - Period

#### Section 3: Brand wise, Segment wise Repurposed/New Growth(%)
- **Layout:** Chart (left) + Table (right)
- **Chart Type:** Multi-line chart
- **Series:** Mercedez (blue), BMW (red), Skoda (orange)
- **X-axis:** Period (2016, 2017, 2018)
- **Y-axis:** Growth percentage (15-22.5%)
- **Table Columns:**
  - Brand
  - Segment
  - Type
  - Growth
  - Period

### Data Model

```javascript
// Used Vehicle Growth - All India
{
  type: 'Repurposed' | 'New',
  period_year: number,
  growth_pct: number
}

// Used Vehicle Growth - Segment
{
  segment: string, // 'Luxuary', etc.
  type: 'Repurposed' | 'New',
  period_year: number,
  growth_pct: number
}

// Used Vehicle Growth - Brand Segment
{
  brand: string, // 'Mercedez', 'BMW', 'Skoda'
  segment: string,
  type: 'Repurposed' | 'New',
  period_year: number,
  growth_pct: number
}
```

---

## COMMON UI COMPONENTS

### DataTable Component
**Location:** `src/components/environment/shared/DataTable.js`

**Features:**
- Pagination (10/25/50/100 entries)
- Column sorting (ascending/descending)
- Search/filter
- Export (Copy, CSV, Print)
- Scrollable body with fixed header
- Custom column rendering

**Props:**
```javascript
{
  data: Array,
  columns: Array<{key, label, render?}>,
  pagination: boolean,
  pageSize: number,
  searchable: boolean,
  sortable: boolean,
  exportable: boolean,
  onRowClick: function
}
```

### KPITiles Component
**Location:** `src/components/environment/shared/KPITiles.js`

**Props:**
```javascript
{
  tiles: Array<{label: string, value: string|number}>
}
```

### PillButtons Component
**Location:** `src/components/environment/shared/PillButtons.js`

**Props:**
```javascript
{
  options: Array<string | {value, label}>,
  selected: string,
  onSelect: function
}
```

### Card Component
**Location:** `src/components/shared/Card.js`

**Props:**
```javascript
{
  title: string,
  children: ReactNode,
  className: string
}
```

---

## STATE MANAGEMENT STRUCTURE

### Global Environment State
```javascript
{
  environment: {
    survey: {
      selectedSurvey: string,
      activeTab: 'master' | 'performance' | 'insights',
      customerFilter: string,
      territoryFilter: string,
      masterData: Object,
      performanceData: Object,
      insightsData: Array
    },
    oica: {
      vehicleCategory: 'All Vehicles' | 'Passenger Vehicles' | 'Commercial Vehicles',
      countryData: Array,
      continentData: Array,
      mapData: Array
    },
    census: {
      activeTab: 'graphs' | 'table',
      countryFilter: string,
      stateFilter: string,
      districtFilter: string,
      graphData: Array,
      tableData: Array
    },
    gdp: {
      activeTab: 'graphs' | 'table',
      locationFilter: string,
      measureFilter: string,
      chartData: Array,
      tableData: Array,
      visibleSeries: Set,
      legendPage: number
    },
    exchangeRate: {
      activeTab: 'graphs' | 'table',
      locationFilter: string,
      measureFilter: string,
      chartData: Array,
      tableData: Array,
      visibleSeries: Set,
      legendPage: number
    },
    inflation: {
      activeTab: 'graphs' | 'table',
      locationFilter: string,
      measureFilter: string,
      chartData: Array,
      tableData: Array,
      visibleSeries: Set,
      legendPage: number
    },
    siam: {
      productionData: Object,
      salesData: Object,
      pieData: Array
    },
    secondHand: {
      allIndiaData: Object,
      segmentData: Object,
      brandSegmentData: Object
    }
  }
}
```

---

## API ENDPOINTS (Suggested)

### Survey APIs
- `GET /api/environment/survey/master?surveyId={id}`
- `GET /api/environment/survey/performance?surveyId={id}`
- `GET /api/environment/survey/insights?surveyId={id}&customer={id}&territory={id}`
- `GET /api/environment/survey/geo?surveyId={id}`

### OICA APIs
- `GET /api/environment/oica/countries?category={category}`
- `GET /api/environment/oica/continents?category={category}`
- `GET /api/environment/oica/map-data?category={category}`

### Census APIs
- `GET /api/environment/census/states?country={code}`
- `GET /api/environment/census/districts?country={code}&state={code}`
- `GET /api/environment/census/data?country={code}&state={code}&district={code}`

### GDP/Exchange Rate/Inflation APIs
- `GET /api/environment/{module}/data?location={code}&measure={code}`
- `GET /api/environment/{module}/locations`
- `GET /api/environment/{module}/measures`

### SIAM APIs
- `GET /api/environment/siam/production`
- `GET /api/environment/siam/sales`
- `GET /api/environment/siam/market-share`

### Second Hand Vehicles APIs
- `GET /api/environment/second-hand/all-india`
- `GET /api/environment/second-hand/segment`
- `GET /api/environment/second-hand/brand-segment`

---

## BEHAVIORAL SPECIFICATIONS

### Tab Navigation
- Top-level tabs (Survey, OICA, etc.) update URL and scroll to top
- Inner tabs (Graphs/Table, MASTER/Performance) are client-side only
- Tab state persists during filter changes

### Filter Behavior
- All dropdowns trigger data refetch or client-side filtering
- Charts and tables stay synchronized
- Loading states shown during data fetch

### Chart Interactions
- Hover tooltips: Year, Series name, Formatted value
- Legend items clickable to toggle series visibility
- Paginated legends for modules with many series (GDP, FX, Inflation)

### Table Interactions
- Column sorting: Click header to toggle asc/desc
- Pagination: Show N entries, Previous/Next, page numbers
- Search: Real-time filtering across all columns
- Export: Copy (clipboard), CSV (download), Print (print dialog)
- Scroll: Fixed header, scrollable body

### Map Interactions
- Zoom: +/- buttons and scroll/pinch
- Pan: Drag to move
- Tooltips: Show on marker hover
- Clusters: Expand on click

### Scroll Behavior
- Page scroll: Normal browser scroll between sections
- Table scroll: Internal scrollbar within fixed-height container
- Jump to top: Smooth scroll to page top

---

## FILE STRUCTURE

```
ivvychain-v2/src/
├── pages/
│   └── Environment.js (main page with tab navigation)
├── components/
│   ├── environment/
│   │   ├── shared/
│   │   │   ├── DataTable.js
│   │   │   ├── KPITiles.js
│   │   │   └── PillButtons.js
│   │   ├── SurveyModule.js
│   │   ├── SurveyMap.js
│   │   ├── SurveyInsightsChart.js
│   │   ├── OicaModule.js
│   │   ├── OicaMap.js
│   │   ├── CensusModule.js
│   │   ├── GdpModule.js
│   │   ├── ExchangeRateModule.js
│   │   ├── InflationModule.js
│   │   ├── SiamModule.js
│   │   └── SecondHandVehiclesModule.js
│   └── shared/
│       └── Card.js
```

---

## IMPLEMENTATION STATUS

✅ **Completed:**
- Main Environment page with 8 module tabs
- Survey module (MASTER, Performance, Insights tabs)
- OICA module (country table, continent table, map)
- Census module (Graphs/Table tabs, filters)
- GDP Analysis module (Graphs/Table tabs, multi-series chart, paginated legend)
- Exchange Rate Analysis module (Graphs/Table tabs, multi-series chart)
- Inflation Analysis module (Graphs/Table tabs, multi-series chart)
- SIAM Data Analysis module (4 charts + pie chart)
- Second Hand Vehicles module (3 sections with charts + tables)
- Shared components (DataTable, KPITiles, PillButtons)
- Navigation integration (Sidebar, App.js)

✅ **Features Implemented:**
- Functional buttons and filters
- Scrollable tables with pagination
- Export actions (Copy, CSV, Print)
- Interactive charts with tooltips
- Map visualizations (SVG-based, ready for Leaflet)
- State management for all modules
- Mock data generation

🔄 **Ready for:**
- Backend API integration (replace mock data functions)
- Leaflet map library integration (replace SVG maps)
- Real-time data updates
- Advanced filtering and drill-down capabilities


