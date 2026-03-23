import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from '../shared/Card';

const SiamModule = () => {
  const [productionData, setProductionData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    // Mock data matching the screenshots
    const years = ['2012-13', '2013-14', '2014-15', '2015-16', '2016-17', '2017-18'];
    
    // Production trends by vehicles (bar chart)
    const mockProductionBar = years.map((year) => ({
      year,
      'Passenger Vehicles': Math.floor(Math.random() * 2000000 + 1000000),
      'Commercial Vehicles': Math.floor(Math.random() * 100000),
      'Three Wheelers': Math.floor(Math.random() * 50000),
      'Two Wheelers': Math.floor(Math.random() * 5000000 + 14000000),
    }));

    // Production trends over years (line chart)
    const mockProductionLine = years.map((year) => ({
      year,
      'Passenger Vehicles': Math.floor(Math.random() * 2000000 + 1000000),
      'Commercial Vehicles': Math.floor(Math.random() * 100000),
      'Three Wheelers': Math.floor(Math.random() * 50000),
      'Two Wheelers': Math.floor(Math.random() * 5000000 + 14000000),
    }));

    // Sales Trends By Vehicles (bar chart)
    const mockSalesBar = years.map((year) => ({
      year,
      'Passenger Vehicles': Math.floor(Math.random() * 2000000 + 1000000),
      'Commercial Vehicles': Math.floor(Math.random() * 100000),
      'Three Wheelers': Math.floor(Math.random() * 50000),
      'Two Wheelers': Math.floor(Math.random() * 5000000 + 14000000),
    }));

    // Sales Trends Over Years (line chart)
    const mockSalesLine = years.map((year) => ({
      year,
      'Passenger Vehicles': Math.floor(Math.random() * 2000000 + 1000000),
      'Commercial Vehicles': Math.floor(Math.random() * 100000),
      'Three Wheelers': Math.floor(Math.random() * 50000),
      'Two Wheelers': Math.floor(Math.random() * 5000000 + 14000000),
    }));

    // Pie chart data (latest year)
    const latestYearData = mockSalesBar[mockSalesBar.length - 1];
    const total = latestYearData['Passenger Vehicles'] + latestYearData['Commercial Vehicles'] + 
                  latestYearData['Three Wheelers'] + latestYearData['Two Wheelers'];
    
    const mockPieData = [
      { name: 'Two Wheelers', value: latestYearData['Two Wheelers'], percentage: Math.round((latestYearData['Two Wheelers'] / total) * 100) },
      { name: 'Passenger Vehicles', value: latestYearData['Passenger Vehicles'], percentage: Math.round((latestYearData['Passenger Vehicles'] / total) * 100) },
      { name: 'Commercial Vehicles', value: latestYearData['Commercial Vehicles'], percentage: Math.round((latestYearData['Commercial Vehicles'] / total) * 100) },
      { name: 'Three Wheelers', value: latestYearData['Three Wheelers'], percentage: Math.round((latestYearData['Three Wheelers'] / total) * 100) },
    ];

    setProductionData({ bar: mockProductionBar, line: mockProductionLine });
    setSalesData({ bar: mockSalesBar, line: mockSalesLine });
    setPieData(mockPieData);
  }, []);

  const colors = {
    'Passenger Vehicles': '#3B82F6',
    'Commercial Vehicles': '#EF4444',
    'Three Wheelers': '#F97316',
    'Two Wheelers': '#10B981',
  };

  const pieColors = ['#10B981', '#3B82F6', '#EF4444', '#F97316'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">SIAM Data Analysis</h1>

      {/* Production trends by vehicles */}
      <Card title="Production trends by vehicles">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={productionData.bar}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis label={{ value: 'Units', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => value.toLocaleString()} />
            <Legend />
            <Bar dataKey="Passenger Vehicles" stackId="a" fill={colors['Passenger Vehicles']} />
            <Bar dataKey="Commercial Vehicles" stackId="a" fill={colors['Commercial Vehicles']} />
            <Bar dataKey="Three Wheelers" stackId="a" fill={colors['Three Wheelers']} />
            <Bar dataKey="Two Wheelers" stackId="a" fill={colors['Two Wheelers']} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Production trends over years */}
      <Card title="Production trends over years">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={productionData.line}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis label={{ value: 'Units', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => value.toLocaleString()} />
            <Legend />
            <Line type="monotone" dataKey="Passenger Vehicles" stroke={colors['Passenger Vehicles']} strokeWidth={2} />
            <Line type="monotone" dataKey="Commercial Vehicles" stroke={colors['Commercial Vehicles']} strokeWidth={2} />
            <Line type="monotone" dataKey="Three Wheelers" stroke={colors['Three Wheelers']} strokeWidth={2} />
            <Line type="monotone" dataKey="Two Wheelers" stroke={colors['Two Wheelers']} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Sales Trends By Vehicles */}
      <Card title="Sales Trends By Vehicles">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={salesData.bar}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis label={{ value: 'Units', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => value.toLocaleString()} />
            <Legend />
            <Bar dataKey="Passenger Vehicles" stackId="a" fill={colors['Passenger Vehicles']} />
            <Bar dataKey="Commercial Vehicles" stackId="a" fill={colors['Commercial Vehicles']} />
            <Bar dataKey="Three Wheelers" stackId="a" fill={colors['Three Wheelers']} />
            <Bar dataKey="Two Wheelers" stackId="a" fill={colors['Two Wheelers']} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Sales Trends Over Years */}
      <Card title="Sales Trends Over Years">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={salesData.line}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis label={{ value: 'Units', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => value.toLocaleString()} />
            <Legend />
            <Line type="monotone" dataKey="Passenger Vehicles" stroke={colors['Passenger Vehicles']} strokeWidth={2} />
            <Line type="monotone" dataKey="Commercial Vehicles" stroke={colors['Commercial Vehicles']} strokeWidth={2} />
            <Line type="monotone" dataKey="Three Wheelers" stroke={colors['Three Wheelers']} strokeWidth={2} />
            <Line type="monotone" dataKey="Two Wheelers" stroke={colors['Two Wheelers']} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Pie Chart */}
      <Card title="Pie Chart">
        <div className="grid grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col justify-center gap-4">
            {pieData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: pieColors[index] }}></div>
                <span className="text-sm font-medium">{item.name}</span>
                <span className="text-sm text-gray-600">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SiamModule;

