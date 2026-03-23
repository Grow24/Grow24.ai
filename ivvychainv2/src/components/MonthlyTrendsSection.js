import React, { useRef, useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ButtonGroup from './shared/ButtonGroup';
import Card from './shared/Card';
import DownloadButton from './shared/DownloadButton';
import { downloadInteractiveChartDashboard } from '../utils/interactiveChartExport';

const MonthlyTrendsSection = ({ 
  data = {}, 
  selectedYear = '2017', 
  comparisonMode = 'vs Prior', 
  onYearChange = () => {}, 
  onComparisonChange = () => {} 
}) => {
  const dashboardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  // Default data structure
  const defaultData = {
    monthlySales: data.monthlySales || [
      { month: 'Jan', sales: 4000, salesPriorTarget: 3500, grossProfitPercent: 25 },
      { month: 'Feb', sales: 3000, salesPriorTarget: 3200, grossProfitPercent: 28 },
      { month: 'Mar', sales: 5000, salesPriorTarget: 4500, grossProfitPercent: 30 },
      { month: 'Apr', sales: 4500, salesPriorTarget: 4000, grossProfitPercent: 27 },
      { month: 'May', sales: 5500, salesPriorTarget: 5000, grossProfitPercent: 32 },
      { month: 'Jun', sales: 6000, salesPriorTarget: 5500, grossProfitPercent: 35 }
    ],
    grossProfit: data.grossProfit || [
      { quarter: 'Q1', grossProfit: 12000, gpPriorTarget: 11000, sales: 12000 },
      { quarter: 'Q2', grossProfit: 16000, gpPriorTarget: 15000, sales: 16000 },
      { quarter: 'Q3', grossProfit: 18000, gpPriorTarget: 17000, sales: 18000 },
      { quarter: 'Q4', grossProfit: 20000, gpPriorTarget: 19000, sales: 20000 }
    ]
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Prepare data for ALL years and comparison modes
      const allYearData = {
        '2015': {
          'vs Prior': {
            monthlySales: [
              { month: 'APR 2016', sales: 38147261, salesPriorTarget: 30014451, grossProfitPercent: 10.98654 },
              { month: 'MAY 2016', sales: 33417682, salesPriorTarget: 31015358, grossProfitPercent: 26.59366 },
              { month: 'JUN 2016', sales: 30582741, salesPriorTarget: 29724098, grossProfitPercent: 36.20779 },
              { month: 'JUL 2016', sales: 30734538, salesPriorTarget: 29445904, grossProfitPercent: 16.22861 },
              { month: 'AUG 2016', sales: 35250861, salesPriorTarget: 30768177, grossProfitPercent: 20.06495 },
              { month: 'SEP 2016', sales: 35744853, salesPriorTarget: 28500035, grossProfitPercent: 35.44168 }
            ],
            grossProfit: [
              { quarter: '2015 Q1', grossProfit: 24514079, gpPriorTarget: 23324790, sales: 24514079 },
              { quarter: '2015 Q2', grossProfit: 21484611, gpPriorTarget: 21932579, sales: 21484611 },
              { quarter: '2015 Q3', grossProfit: 21449461, gpPriorTarget: 22332199, sales: 21449461 },
              { quarter: '2015 Q4', grossProfit: 21136129, gpPriorTarget: 21242109, sales: 21136129 }
            ]
          },
          'vs Target': {
            monthlySales: [
              { month: 'APR 2016', sales: 38147261, salesPriorTarget: 32000000, grossProfitPercent: 10.98654 },
              { month: 'MAY 2016', sales: 33417682, salesPriorTarget: 33000000, grossProfitPercent: 26.59366 },
              { month: 'JUN 2016', sales: 30582741, salesPriorTarget: 31000000, grossProfitPercent: 36.20779 },
              { month: 'JUL 2016', sales: 30734538, salesPriorTarget: 30500000, grossProfitPercent: 16.22861 },
              { month: 'AUG 2016', sales: 35250861, salesPriorTarget: 32000000, grossProfitPercent: 20.06495 },
              { month: 'SEP 2016', sales: 35744853, salesPriorTarget: 30000000, grossProfitPercent: 35.44168 }
            ],
            grossProfit: [
              { quarter: '2015 Q1', grossProfit: 24514079, gpPriorTarget: 25000000, sales: 24514079 },
              { quarter: '2015 Q2', grossProfit: 21484611, gpPriorTarget: 23000000, sales: 21484611 },
              { quarter: '2015 Q3', grossProfit: 21449461, gpPriorTarget: 23000000, sales: 21449461 },
              { quarter: '2015 Q4', grossProfit: 21136129, gpPriorTarget: 22000000, sales: 21136129 }
            ]
          }
        },
        '2016': {
          'vs Prior': {
            monthlySales: [
              { month: 'MAY 2016', sales: 40000000, salesPriorTarget: 35000000, grossProfitPercent: 28 },
              { month: 'JUN 2016', sales: 35000000, salesPriorTarget: 32000000, grossProfitPercent: 32 },
              { month: 'JUL 2016', sales: 38000000, salesPriorTarget: 34000000, grossProfitPercent: 30 },
              { month: 'AUG 2016', sales: 42000000, salesPriorTarget: 38000000, grossProfitPercent: 35 },
              { month: 'SEP 2016', sales: 39000000, salesPriorTarget: 36000000, grossProfitPercent: 33 },
              { month: 'OCT 2016', sales: 41000000, salesPriorTarget: 37000000, grossProfitPercent: 31 }
            ],
            grossProfit: [
              { quarter: '2016 Q1', grossProfit: 26000000, gpPriorTarget: 24000000, sales: 26000000 },
              { quarter: '2016 Q2', grossProfit: 24000000, gpPriorTarget: 23000000, sales: 24000000 },
              { quarter: '2016 Q3', grossProfit: 25000000, gpPriorTarget: 24000000, sales: 25000000 },
              { quarter: '2016 Q4', grossProfit: 27000000, gpPriorTarget: 25000000, sales: 27000000 }
            ]
          },
          'vs Target': {
            monthlySales: [
              { month: 'MAY 2016', sales: 40000000, salesPriorTarget: 38000000, grossProfitPercent: 28 },
              { month: 'JUN 2016', sales: 35000000, salesPriorTarget: 35000000, grossProfitPercent: 32 },
              { month: 'JUL 2016', sales: 38000000, salesPriorTarget: 36000000, grossProfitPercent: 30 },
              { month: 'AUG 2016', sales: 42000000, salesPriorTarget: 40000000, grossProfitPercent: 35 },
              { month: 'SEP 2016', sales: 39000000, salesPriorTarget: 38000000, grossProfitPercent: 33 },
              { month: 'OCT 2016', sales: 41000000, salesPriorTarget: 39000000, grossProfitPercent: 31 }
            ],
            grossProfit: [
              { quarter: '2016 Q1', grossProfit: 26000000, gpPriorTarget: 26000000, sales: 26000000 },
              { quarter: '2016 Q2', grossProfit: 24000000, gpPriorTarget: 25000000, sales: 24000000 },
              { quarter: '2016 Q3', grossProfit: 25000000, gpPriorTarget: 26000000, sales: 25000000 },
              { quarter: '2016 Q4', grossProfit: 27000000, gpPriorTarget: 28000000, sales: 27000000 }
            ]
          }
        },
        '2017': {
          'vs Prior': {
            monthlySales: defaultData.monthlySales,
            grossProfit: defaultData.grossProfit
          },
          'vs Target': {
            monthlySales: defaultData.monthlySales.map(d => ({
              ...d,
              salesPriorTarget: d.sales * 0.95 // Target is 95% of actual sales
            })),
            grossProfit: defaultData.grossProfit.map(d => ({
              ...d,
              gpPriorTarget: d.grossProfit * 0.95
            }))
          }
        }
      };

      const initialFilters = {
        selectedYear,
        comparisonMode
      };

      await downloadInteractiveChartDashboard(allYearData, 'Monthly Trends', initialFilters);
    } catch (error) {
      console.error('Error downloading dashboard:', error);
      alert('Failed to download dashboard. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div ref={dashboardRef}>
      <Card title="Monthly Trends" className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-4">
            <ButtonGroup
              options={['2015', '2016', '2017']}
              selected={selectedYear}
              onSelect={onYearChange}
            />
            <ButtonGroup
              options={['vs Prior', 'vs Target']}
              selected={comparisonMode}
              onSelect={onComparisonChange}
            />
          </div>
          <DownloadButton
            onClick={handleDownload}
            isDownloading={isDownloading}
            title="Download Monthly Trends dashboard with metadata for HBMP AgentBot"
          />
        </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Monthly Sales vs Prior / Target</h4>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={defaultData.monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3B82F6" />
              <Bar dataKey="salesPriorTarget" fill="#FBBF24" />
              <Line type="monotone" dataKey="grossProfitPercent" stroke="#10B981" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Gross Profit Chart */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Gross Profit vs Prior / Target</h4>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={defaultData.grossProfit}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="grossProfit" fill="#3B82F6" />
              <Bar dataKey="gpPriorTarget" fill="#FBBF24" />
              <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
    </div>
  );
};

export default MonthlyTrendsSection;

