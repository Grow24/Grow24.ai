import React, { useRef, useState } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import ButtonGroup from './shared/ButtonGroup';
import Card from './shared/Card';
import DownloadButton from './shared/DownloadButton';
import { downloadInteractiveComposedChartDashboard } from '../utils/interactiveComposedChartExport';

const CustomerABCSection = ({ data, abcBand, selectedYear, comparisonMode, onABCBandChange, onYearChange, onComparisonChange }) => {
  const dashboardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Prepare data for all filter combinations (same structure as Product ABC)
      const allFilterData = {
        'A': {
          '2015': {
            'vs Prior': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            },
            'vs Target': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            }
          },
          '2016': {
            'vs Prior': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            },
            'vs Target': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            }
          },
          '2017': {
            'vs Prior': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            },
            'vs Target': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            }
          }
        },
        'B': {
          '2015': {
            'vs Prior': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            },
            'vs Target': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            }
          },
          '2016': {
            'vs Prior': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            },
            'vs Target': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            }
          },
          '2017': {
            'vs Prior': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            },
            'vs Target': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            }
          }
        },
        'C': {
          '2015': {
            'vs Prior': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            },
            'vs Target': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            }
          },
          '2016': {
            'vs Prior': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            },
            'vs Target': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            }
          },
          '2017': {
            'vs Prior': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            },
            'vs Target': {
              mainChart: data.mainChart || [],
              salesYTD: data.salesYTD || [],
              grossProfitYTD: data.grossProfitYTD || [],
              tableData: []
            }
          }
        }
      };

      const config = {
        chartTitle: 'Sales YTD vs Prior / Target',
        labelKey: 'period',
        barDataKeys: [
          { key: 'salesYTD', label: 'Sales YTD', color: '#3B82F6', yAxisID: 'y' },
          { key: 'salesPriorTarget', label: 'Sales Prior/Target YTD', color: '#FBBF24', yAxisID: 'y' }
        ],
        lineDataKeys: [
          { key: 'grossProfit', label: 'Gross Profit', color: '#10B981', yAxisID: 'y1' }
        ],
        chartDataKey: 'mainChart',
        tableDataKey: 'tableData',
        yAxisLabel: 'Sales',
        y1AxisLabel: 'Gross Profit',
        smallCharts: [
          {
            title: 'Sales YTD vs Prior/Target',
            dataKey: 'salesYTD',
            labelKey: 'period',
            type: 'line',
            dataKeys: [
              { key: 'current', label: 'Current', color: '#3B82F6' },
              { key: 'priorTarget', label: 'Prior/Target', color: '#FBBF24' }
            ]
          },
          {
            title: 'Gross Profit YTD vs Prior/Target',
            dataKey: 'grossProfitYTD',
            labelKey: 'period',
            type: 'line',
            dataKeys: [
              { key: 'current', label: 'Current', color: '#3B82F6' },
              { key: 'priorTarget', label: 'Prior/Target', color: '#FBBF24' }
            ]
          }
        ],
        filterGroups: [
          { name: 'abcBand', options: ['A', 'B', 'C'], label: 'ABC Band' },
          { name: 'selectedYear', options: ['2015', '2016', '2017'], label: 'Year' },
          { name: 'comparisonMode', options: ['vs Prior', 'vs Target'], label: 'Comparison Mode' }
        ]
      };

      await downloadInteractiveComposedChartDashboard(
        allFilterData,
        'Customer ABC',
        { abcBand, selectedYear, comparisonMode },
        config
      );
    } catch (error) {
      console.error('Error downloading dashboard:', error);
      alert('Failed to download dashboard. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div ref={dashboardRef}>
      <Card title="Customer ABC" className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-4">
            <ButtonGroup
              options={['A', 'B', 'C']}
              selected={abcBand}
              onSelect={onABCBandChange}
            />
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
            title="Download Customer ABC dashboard with metadata for HBMP AgentBot"
          />
        </div>

      {/* Top Right - Small Area Charts */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Sales YTD vs Prior/Target</h4>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={data.salesYTD}>
              <Area type="monotone" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="priorTarget" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Gross Profit YTD vs Prior/Target</h4>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={data.grossProfitYTD}>
              <Area type="monotone" dataKey="current" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="priorTarget" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Large Mixed Chart */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Sales YTD vs Prior / Target</h4>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data.mainChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="salesYTD" fill="#3B82F6" name="Sales YTD" />
            <Bar yAxisId="left" dataKey="salesPriorTarget" fill="#FBBF24" name="Sales Prior/Target YTD" />
            <Line yAxisId="right" type="monotone" dataKey="grossProfit" stroke="#10B981" strokeWidth={2} name="Gross Profit" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
    </div>
  );
};

export default CustomerABCSection;


