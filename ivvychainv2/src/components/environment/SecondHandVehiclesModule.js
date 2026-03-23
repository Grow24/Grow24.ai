import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from '../shared/Card';
import DataTable from './shared/DataTable';

const SecondHandVehiclesModule = () => {
  const [allIndiaData, setAllIndiaData] = useState({ chart: [], table: [] });
  const [segmentData, setSegmentData] = useState({ chart: [], table: [] });
  const [brandSegmentData, setBrandSegmentData] = useState({ chart: [], table: [] });

  useEffect(() => {
    // All India Repurposed/New Growth(%)
    const allIndiaChart = [
      { period: 2016, Repurposed: 11, New: 9 },
      { period: 2017, Repurposed: 12, New: 9 },
      { period: 2018, Repurposed: 14, New: 11 },
    ];

    const allIndiaTable = [
      { type: 'Repurposed', growth: 14, period: 2018 },
      { type: 'New', growth: 11, period: 2018 },
      { type: 'Repurposed', growth: 12, period: 2017 },
      { type: 'New', growth: 9, period: 2017 },
      { type: 'Repurposed', growth: 11, period: 2016 },
      { type: 'New', growth: 9, period: 2016 },
    ];

    // Segment wise Repurposed/New Growth(%)
    const segmentChart = [
      { period: 2016, Repurposed: 12, New: 9 },
      { period: 2017, Repurposed: 14, New: 11 },
      { period: 2018, Repurposed: 22, New: 18 },
    ];

    const segmentTable = [
      { segment: 'Luxuary', type: 'Repurposed', growth: 22, period: 2018 },
      { segment: 'Luxuary', type: 'New', growth: 18, period: 2018 },
      { segment: 'Luxuary', type: 'Repurposed', growth: 14, period: 2017 },
      { segment: 'Luxuary', type: 'New', growth: 11, period: 2017 },
      { segment: 'Luxuary', type: 'Repurposed', growth: 12, period: 2016 },
      { segment: 'Luxuary', type: 'New', growth: 9, period: 2016 },
    ];

    // Brand wise, Segment wise Repurposed/New Growth(%)
    const brandSegmentChart = [
      { period: 2016, Mercedez: 16, BMW: 22, Skoda: 15 },
      { period: 2017, Mercedez: 15, BMW: 22, Skoda: 15 },
      { period: 2018, Mercedez: 15, BMW: 22, Skoda: 16 },
    ];

    const brandSegmentTable = [
      { brand: 'Mercedez', segment: 'Luxuary', type: 'Repurposed', growth: 15, period: 2018 },
      { brand: 'Mercedez', segment: 'Luxuary', type: 'Repurposed', growth: 15, period: 2017 },
      { brand: 'Mercedez', segment: 'Luxuary', type: 'Repurposed', growth: 16, period: 2016 },
      { brand: 'BMW', segment: 'Luxuary', type: 'Repurposed', growth: 22, period: 2018 },
      { brand: 'BMW', segment: 'Luxuary', type: 'Repurposed', growth: 22, period: 2017 },
      { brand: 'BMW', segment: 'Luxuary', type: 'Repurposed', growth: 22, period: 2016 },
      { brand: 'Skoda', segment: 'Luxuary', type: 'Repurposed', growth: 16, period: 2018 },
      { brand: 'Skoda', segment: 'Luxuary', type: 'Repurposed', growth: 15, period: 2017 },
      { brand: 'Skoda', segment: 'Luxuary', type: 'Repurposed', growth: 15, period: 2016 },
    ];

    setAllIndiaData({ chart: allIndiaChart, table: allIndiaTable });
    setSegmentData({ chart: segmentChart, table: segmentTable });
    setBrandSegmentData({ chart: brandSegmentChart, table: brandSegmentTable });
  }, []);

  const allIndiaColumns = [
    { key: 'type', label: 'Type' },
    { key: 'growth', label: 'Growth' },
    { key: 'period', label: 'Period' },
  ];

  const segmentColumns = [
    { key: 'segment', label: 'Segment' },
    { key: 'type', label: 'Type' },
    { key: 'growth', label: 'Growth' },
    { key: 'period', label: 'Period' },
  ];

  const brandSegmentColumns = [
    { key: 'brand', label: 'Brand' },
    { key: 'segment', label: 'Segment' },
    { key: 'type', label: 'Type' },
    { key: 'growth', label: 'Growth' },
    { key: 'period', label: 'Period' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Second Hand Vehicles</h1>

      {/* All India Repurposed/New Growth(%) */}
      <Card title="All India Repurposed/New Growth(%)">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={allIndiaData.chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[8, 14]} label={{ value: 'Growth %', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Repurposed" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="New" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <DataTable data={allIndiaData.table} columns={allIndiaColumns} pageSize={10} />
          </div>
        </div>
      </Card>

      {/* Segment wise Repurposed/New Growth(%) */}
      <Card title="Segment wise Repurposed/New Growth(%)">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={segmentData.chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[0, 30]} label={{ value: 'Growth %', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Repurposed" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="New" stroke="#EF4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <DataTable data={segmentData.table} columns={segmentColumns} pageSize={10} />
          </div>
        </div>
      </Card>

      {/* Brand wise, Segment wise Repurposed/New Growth(%) */}
      <Card title="Brand wise, Segment wise Repurposed/New Growth(%)">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={brandSegmentData.chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis domain={[15, 22.5]} label={{ value: 'Growth %', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Mercedez" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="BMW" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="Skoda" stroke="#F97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <DataTable data={brandSegmentData.table} columns={brandSegmentColumns} pageSize={10} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SecondHandVehiclesModule;

