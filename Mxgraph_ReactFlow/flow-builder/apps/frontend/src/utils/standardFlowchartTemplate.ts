export const createStandardFlowchartTemplate = () => {
  const nodes = [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 80, y: 100 },
      data: { label: 'Start' }
    },
    {
      id: 'process-1',
      type: 'process',
      position: { x: 200, y: 100 },
      data: { label: 'Search engine home page' }
    },
    {
      id: 'decision-1',
      type: 'decision',
      position: { x: 200, y: 200 },
      data: { label: 'Use the search engine?' }
    },
    {
      id: 'process-2',
      type: 'process',
      position: { x: 80, y: 300 },
      data: { label: 'Type in a search (i.e. agency)' }
    },
    {
      id: 'process-3',
      type: 'process',
      position: { x: 320, y: 300 },
      data: { label: 'Ask for recommendations' }
    },
    {
      id: 'process-4',
      type: 'process',
      position: { x: 80, y: 400 },
      data: { label: 'Search engine results page' }
    },
    {
      id: 'process-5',
      type: 'process',
      position: { x: 320, y: 400 },
      data: { label: 'Click the link to an agency\'s site' }
    },
    {
      id: 'process-6',
      type: 'process',
      position: { x: 80, y: 500 },
      data: { label: 'Look through search results' }
    },
    {
      id: 'process-7',
      type: 'process',
      position: { x: 440, y: 450 },
      data: { label: 'Agency\'s home page' }
    },
    {
      id: 'decision-2',
      type: 'decision',
      position: { x: 200, y: 550 },
      data: { label: 'Did you find a good agency?' }
    },
    {
      id: 'decision-3',
      type: 'decision',
      position: { x: 440, y: 550 },
      data: { label: 'Does it look good?' }
    },
    {
      id: 'decision-4',
      type: 'decision',
      position: { x: 200, y: 650 },
      data: { label: 'Did you want to search again?' }
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 440, y: 650 },
      data: { label: 'End' }
    }
  ];

  const edges = [
    { id: 'e1', source: 'start-1', target: 'process-1', type: 'straight' },
    { id: 'e2', source: 'process-1', target: 'decision-1', type: 'straight' },
    { id: 'e3', source: 'decision-1', target: 'process-2', type: 'straight', label: 'Yes' },
    { id: 'e4', source: 'decision-1', target: 'process-3', type: 'straight', label: 'No' },
    { id: 'e5', source: 'process-2', target: 'process-4', type: 'straight' },
    { id: 'e6', source: 'process-3', target: 'process-5', type: 'straight' },
    { id: 'e7', source: 'process-4', target: 'process-6', type: 'straight' },
    { id: 'e8', source: 'process-5', target: 'process-7', type: 'straight' },
    { id: 'e9', source: 'process-6', target: 'decision-2', type: 'straight' },
    { id: 'e10', source: 'process-7', target: 'decision-3', type: 'straight' },
    { id: 'e11', source: 'decision-2', target: 'decision-4', type: 'straight', label: 'No' },
    { id: 'e12', source: 'decision-3', target: 'end-1', type: 'straight', label: 'Yes' },
    { id: 'e13', source: 'decision-3', target: 'decision-2', type: 'straight', label: 'No' },
    { id: 'e14', source: 'decision-4', target: 'process-2', type: 'straight', label: 'Yes' },
    { id: 'e15', source: 'decision-4', target: 'end-1', type: 'straight', label: 'No' },
    { id: 'e16', source: 'decision-2', target: 'end-1', type: 'straight', label: 'Yes' }
  ];

  return { nodes, edges };
};