const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data generators
const generateMockData = require('./mockData');
const dashboardRegistry = require('./dashboardRegistry');

// Routes
app.post('/api/filters/results-summary', (req, res) => {
  const { filters } = req.body;
  // Mock summary based on filters
  const records = Math.floor(Math.random() * 5000) + 2000;
  const invoices = Math.floor(records * 0.5);
  res.json({ records, invoices });
});

app.post('/api/highlights', (req, res) => {
  const highlights = generateMockData.getHighlights();
  res.json(highlights);
});

app.post('/api/quick-overview', (req, res) => {
  const data = generateMockData.getQuickOverview(req.body);
  res.json(data);
});

app.post('/api/item-group-treemap', (req, res) => {
  const data = generateMockData.getTreemapData();
  res.json(data);
});

app.post('/api/monthly-trends', (req, res) => {
  const data = generateMockData.getMonthlyTrends(req.body);
  res.json(data);
});

app.post('/api/sales-overview', (req, res) => {
  const data = generateMockData.getSalesOverview(req.body);
  res.json(data);
});

app.post('/api/sales-growth', (req, res) => {
  const data = generateMockData.getSalesGrowth(req.body);
  res.json(data);
});

app.post('/api/sales-person', (req, res) => {
  const data = generateMockData.getSalesPerson(req.body);
  res.json(data);
});

app.post('/api/product-abc', (req, res) => {
  const data = generateMockData.getProductABC(req.body);
  res.json(data);
});

app.post('/api/sales-last-year', (req, res) => {
  const data = generateMockData.getSalesLastYear(req.body);
  res.json(data);
});

app.post('/api/top-products', (req, res) => {
  const data = generateMockData.getTopProducts(req.body);
  res.json(data);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'IVYCHAIN v2 API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

