export const createCustomerRegistrationTemplate = () => {
  const nodes = [
    {
      id: 'start-1',
      type: 'start',
      position: { x: 400, y: 50 },
      data: { label: 'START\nCustomer Registration' }
    },
    {
      id: 'process-1',
      type: 'process',
      position: { x: 400, y: 150 },
      data: { label: 'PROCESS\nValidate Documents\nBusiness process' }
    },
    {
      id: 'decision-1',
      type: 'decision',
      position: { x: 400, y: 280 },
      data: { label: 'DECISION\nNew Account?\n2 outcomes' }
    },
    {
      id: 'action-1',
      type: 'action',
      position: { x: 200, y: 400 },
      data: { label: 'ACTION\nSend Rejection Email' }
    },
    {
      id: 'action-2',
      type: 'action',
      position: { x: 600, y: 400 },
      data: { label: 'ACTION\nSend Approval Email' }
    },
    {
      id: 'end-1',
      type: 'end',
      position: { x: 400, y: 520 },
      data: { label: 'END\nNew end' }
    }
  ];

  const edges = [
    { id: 'e1', source: 'start-1', target: 'process-1', type: 'straight' },
    { id: 'e2', source: 'process-1', target: 'decision-1', type: 'straight' },
    { id: 'e3', source: 'decision-1', target: 'action-1', type: 'straight', label: 'Reject' },
    { id: 'e4', source: 'decision-1', target: 'action-2', type: 'straight', label: 'Approve' },
    { id: 'e5', source: 'action-1', target: 'end-1', type: 'straight' },
    { id: 'e6', source: 'action-2', target: 'end-1', type: 'straight' }
  ];

  return { nodes, edges };
};