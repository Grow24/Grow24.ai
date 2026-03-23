import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Card from '../shared/Card';

const SurveyInsightsChart = ({ surveyId }) => {
  const [customerFilter, setCustomerFilter] = useState('1');
  const [territoryFilter, setTerritoryFilter] = useState('India');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Mock data - replace with API call
    const mockData = [
      {
        question: 'I am unaware of schemes launched by the company',
        stronglyDisagree: 2,
        disagree: 5,
        neutral: 11,
        agree: 45,
        stronglyAgree: 37,
      },
      {
        question: 'The company representative has visited my outlet in the past year',
        stronglyDisagree: 1,
        disagree: 1,
        neutral: 11,
        agree: 52,
        stronglyAgree: 35,
      },
      {
        question: 'I need to fulfil orders through the Wholesaler',
        stronglyDisagree: 8,
        disagree: 14,
        neutral: 27,
        agree: 35,
        stronglyAgree: 16,
      },
      {
        question: 'The distributor sales rep visits my store atleast once a week',
        stronglyDisagree: 2,
        disagree: 2,
        neutral: 5,
        agree: 58,
        stronglyAgree: 33,
      },
      {
        question: 'The distributor sales rep visits my store atleast once every 1-2 weeks',
        stronglyDisagree: 7,
        disagree: 9,
        neutral: 38,
        agree: 32,
        stronglyAgree: 14,
      },
      {
        question: 'The distributor extends credit',
        stronglyDisagree: 11,
        disagree: 13,
        neutral: 51,
        agree: 20,
        stronglyAgree: 5,
      },
      {
        question: 'The consumer asks us for the company\'s products',
        stronglyDisagree: 7,
        disagree: 8,
        neutral: 24,
        agree: 42,
        stronglyAgree: 19,
      },
      {
        question: 'I am comfortable using payment apps like PayTM',
        stronglyDisagree: 15,
        disagree: 16,
        neutral: 33,
        agree: 28,
        stronglyAgree: 8,
      },
      {
        question: 'A direct connection with the company is important to be aware of schemes and products',
        stronglyDisagree: 17,
        disagree: 18,
        neutral: 38,
        agree: 22,
        stronglyAgree: 5,
      },
      {
        question: 'I would like to participate in a Rewards program',
        stronglyDisagree: 1,
        disagree: 1,
        neutral: 11,
        agree: 52,
        stronglyAgree: 35,
      },
    ];

    setChartData(mockData);
  }, [surveyId, customerFilter, territoryFilter]);

  // Transform data for stacked bar chart
  const transformedData = chartData.map((item) => ({
    question: item.question,
    'Strongly Disagree': -item.stronglyDisagree,
    'Disagree': -item.disagree,
    'Neutral': item.neutral,
    'Agree': item.agree,
    'Strongly Agree': item.stronglyAgree,
  }));

  const colors = {
    'Strongly Disagree': '#DC2626',
    'Disagree': '#F97316',
    'Neutral': '#FCD34D',
    'Agree': '#86EFAC',
    'Strongly Agree': '#16A34A',
  };

  return (
    <Card title="Survey Insights">
      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">Customer:</label>
          <select
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-gray-700">Territory:</label>
          <select
            value={territoryFilter}
            onChange={(e) => setTerritoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="India">India</option>
            <option value="North">North</option>
            <option value="South">South</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div style={{ height: '600px', overflowY: 'auto' }}>
        <ResponsiveContainer width="100%" height={Math.max(600, chartData.length * 60)}>
          <BarChart
            data={transformedData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 300, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              domain={[-100, 100]}
              tickFormatter={(value) => `${Math.abs(value)}%`}
              label={{ value: 'Percentage', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              type="category"
              dataKey="question"
              width={280}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              formatter={(value, name) => [`${Math.abs(value)}%`, name]}
              contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
            />
            <Legend />
            {Object.keys(colors).map((key) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={colors[key]}
                name={key}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex gap-4 justify-center flex-wrap">
        {Object.entries(colors).map(([label, color]) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: color }}></div>
            <span className="text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SurveyInsightsChart;

