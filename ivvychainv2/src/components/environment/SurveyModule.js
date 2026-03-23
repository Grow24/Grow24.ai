import React, { useState, useEffect } from 'react';
import Card from '../shared/Card';
import KPITiles from './shared/KPITiles';
import PillButtons from './shared/PillButtons';
import SurveyMap from './SurveyMap';

const SurveyModule = () => {
  const [activeTab, setActiveTab] = useState('master'); // 'master' | 'performance'
  const [selectedSurvey, setSelectedSurvey] = useState('Retailer HABA');
  const [surveyData, setSurveyData] = useState(null);

  useEffect(() => {
    // Fetch survey data based on selected survey
    const fetchSurveyData = () => {
      // Mock data - replace with API call
      const mockData = {
        'Retailer HABA': {
          master: {
            surveyName: 'Retailer HABA',
            targetAudience: 'Retailer',
            targetCompletion: '70%',
            targetRegion: 'pan India',
            surveyUrl: 'https://example.com/survey/haba',
          },
          performance: {
            surveyName: 'Retailer HABA',
            sentStatus: '96%',
            deliveredStatus: '75%',
            completionStatus: '70%',
            geoData: [
              { lat: 28.6139, lng: 77.2090, count: 107, territory: 'Delhi' },
              { lat: 31.1048, lng: 77.1734, count: 14, territory: 'Shimla' },
              { lat: 30.3165, lng: 78.0322, count: 84, territory: 'Uttarakhand' },
              { lat: 29.4727, lng: 77.7085, count: 14, territory: 'Muzaffarnagar' },
              { lat: 28.3640, lng: 79.4156, count: 10, territory: 'Bareilly' },
            ],
          },
        },
        'Detergent': {
          master: {
            surveyName: 'Detergent',
            targetAudience: 'Consumer',
            targetCompletion: '80%',
            targetRegion: 'North India',
            surveyUrl: 'https://example.com/survey/detergent',
          },
          performance: {
            surveyName: 'Detergent',
            sentStatus: '92%',
            deliveredStatus: '78%',
            completionStatus: '65%',
            geoData: [
              { lat: 28.6139, lng: 77.2090, count: 95, territory: 'Delhi' },
              { lat: 31.1048, lng: 77.1734, count: 12, territory: 'Shimla' },
            ],
          },
        },
      };
      setSurveyData(mockData[selectedSurvey]);
    };

    fetchSurveyData();
  }, [selectedSurvey]);

  const handleTakeSurvey = () => {
    if (surveyData?.master?.surveyUrl) {
      window.open(surveyData.master.surveyUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Survey Selection Header */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Survey</h2>
          <div className="flex items-center gap-4">
            <h4 className="text-sm font-semibold text-gray-700">Select Survey :</h4>
            <PillButtons
              options={['Retailer HABA', 'Detergent']}
              selected={selectedSurvey}
              onSelect={setSelectedSurvey}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-300 mb-4">
          <button
            onClick={() => setActiveTab('master')}
            className={`px-4 py-2 font-semibold relative ${
              activeTab === 'master'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <strong>MASTER</strong>
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-4 py-2 font-semibold relative ${
              activeTab === 'performance'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <strong>Performance</strong>
          </button>
          <div className="ml-auto">
            <strong className="text-gray-700">{selectedSurvey}</strong>
          </div>
        </div>

        {/* MASTER Tab Content */}
        {activeTab === 'master' && surveyData && (
          <div>
            {/* Info Boxes - Matching exact layout from image */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {surveyData.master.surveyName}
                </h3>
                <p className="text-sm text-gray-600">Name of Survey</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {surveyData.master.targetAudience}
                </h3>
                <p className="text-sm text-gray-600">Target Audience</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {surveyData.master.targetCompletion}
                </h3>
                <p className="text-sm text-gray-600">Target Completion</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {surveyData.master.targetRegion}
                </h3>
                <p className="text-sm text-gray-600">Target Region</p>
              </div>
            </div>

            {/* Take Survey Input */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Take a survey</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Take a survey"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  readOnly
                />
                <button
                  onClick={handleTakeSurvey}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab Content */}
        {activeTab === 'performance' && surveyData && (
          <div>
            <KPITiles
              tiles={[
                { label: 'Name of Survey', value: surveyData.performance.surveyName },
                { label: 'Sent Status', value: surveyData.performance.sentStatus },
                { label: 'Delivered Status', value: surveyData.performance.deliveredStatus },
                { label: 'Completion Status', value: surveyData.performance.completionStatus },
              ]}
            />
            <Card title="Completion Metrics" className="mt-6">
              <SurveyMap geoData={surveyData.performance.geoData} />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyModule;
