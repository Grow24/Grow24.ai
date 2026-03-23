import React, { useRef, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import ButtonGroup from './shared/ButtonGroup';
import Card from './shared/Card';
import DownloadButton from './shared/DownloadButton';
import { downloadInteractiveScatterChartDashboard } from '../utils/interactiveScatterChartExport';

const SalesGrowthAnalysisSection = ({ data, selectedYear, selectedQuarter, onYearChange, onQuarterChange }) => {
  const dashboardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Prepare data for ALL years and quarters
      // Since we only have current data, we'll use it for all combinations
      // In a real scenario, you'd fetch all year/quarter data
      const allYearQuarterData = {
        '2015': {
          'Q1': {
            fytd: data.fytd || [],
            prior: data.prior || [],
            percentVsPrior: data.percentVsPrior || []
          },
          'Q2': {
            fytd: data.fytd || [],
            prior: data.prior || [],
            percentVsPrior: data.percentVsPrior || []
          },
          'Q3': {
            fytd: data.fytd || [],
            prior: data.prior || [],
            percentVsPrior: data.percentVsPrior || []
          },
          'Q4': {
            fytd: data.fytd || [],
            prior: data.prior || [],
            percentVsPrior: data.percentVsPrior || []
          }
        },
        '2016': {
          'Q1': {
            fytd: data.fytd || [],
            prior: data.prior || [],
            percentVsPrior: data.percentVsPrior || []
          },
          'Q2': {
            fytd: data.fytd || [],
            prior: data.prior || [],
            percentVsPrior: data.percentVsPrior || []
          },
          'Q3': {
            fytd: data.fytd || [],
            prior: data.prior || [],
            percentVsPrior: data.percentVsPrior || []
          },
          'Q4': {
            fytd: data.fytd || [],
            prior: data.prior || [],
            percentVsPrior: data.percentVsPrior || []
          }
        },
        '2017': {
          'Q1': {
            fytd: data.fytd || [],
            prior: data.prior || [],
            percentVsPrior: data.percentVsPrior || []
          },
          'Q2': {
            fytd: data.fytd || [],
            prior: data.prior || [],
            percentVsPrior: data.percentVsPrior || []
          },
          'Q3': {
            fytd: data.fytd || [],
            prior: data.prior || [],
            percentVsPrior: data.percentVsPrior || []
          },
          'Q4': {
            fytd: data.fytd || [],
            prior: data.prior || [],
            percentVsPrior: data.percentVsPrior || []
          }
        }
      };

      const initialFilters = {
        selectedYear,
        selectedQuarter
      };

      await downloadInteractiveScatterChartDashboard(allYearQuarterData, 'Sales Growth Analysis', initialFilters);
    } catch (error) {
      console.error('Error downloading dashboard:', error);
      alert('Failed to download dashboard. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div ref={dashboardRef}>
      <Card title="Sales Growth Analysis" className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-4">
            <ButtonGroup
              options={['2015', '2016', '2017']}
              selected={selectedYear}
              onSelect={onYearChange}
            />
            <ButtonGroup
              options={['Q1', 'Q2', 'Q3', 'Q4']}
              selected={selectedQuarter}
              onSelect={onQuarterChange}
            />
          </div>
          <DownloadButton
            onClick={handleDownload}
            isDownloading={isDownloading}
            title="Download Sales Growth Analysis dashboard with metadata for HBMP AgentBot"
          />
        </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Chart - By SalesPerson value (FYTD) */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">By SalesPerson – value (FYTD)</h4>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={data.fytd}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="grossMargin" 
                name="Gross Margin"
                label={{ value: 'Gross Margin', position: 'insideBottom', offset: -5 }}
                domain={[-25000000, 100000000]}
              />
              <YAxis 
                type="number" 
                dataKey="sales" 
                name="Sales"
                label={{ value: 'Sales', angle: -90, position: 'insideLeft' }}
                domain={[-25000000, 125000000]}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="SalesPerson" data={data.fytd} fill="#8884d8">
                {data.fytd.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Right Chart - By SalesPerson value (% vs Prior) */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">By SalesPerson – value (% vs Prior)</h4>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={data.percentVsPrior}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="percentGrossMargin" 
                name="% Gross Margin"
                label={{ value: '% Gross Margin', position: 'insideBottom', offset: -5 }}
                domain={[-25000000, 50000000]}
              />
              <YAxis 
                type="number" 
                dataKey="percentSales" 
                name="% Sales"
                label={{ value: '% Sales', angle: -90, position: 'insideLeft' }}
                domain={[-25000000, 125000000]}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="SalesPerson" data={data.percentVsPrior} fill="#8884d8">
                {data.percentVsPrior.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
    </div>
  );
};

export default SalesGrowthAnalysisSection;


