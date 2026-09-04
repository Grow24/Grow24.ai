export const store = {
  company: {
    name: 'PBMP Sample Co.',
    profile: 'Industrial products company evaluating Product X launch in India.',
  },
  projects: [
    {
      name: 'Product X Market Entry',
      status: 'planning',
      geography: ['Mumbai', 'Delhi', 'Bangalore'],
      summary: 'Proposed launch of Product X in three Indian metro markets.',
      planRevenueCr: 50,
      planRoiPct: 22,
    },
    {
      name: 'Project Alpha',
      status: 'in_progress',
      geography: ['India'],
      summary: 'Existing delivery programme used for actuals-vs-plan review.',
      planRevenueCr: 12,
      planRoiPct: 18,
      scheduleVariancePct: -18,
      costVariancePct: 9,
      benefits: 'on_plan',
    },
  ],
  customers: [
    { name: 'Tata Motors', segment: 'Enterprise', region: 'Mumbai', status: 'active' },
    { name: 'Delhi Metro Corp', segment: 'Public', region: 'Delhi', status: 'active' },
    { name: 'Bengaluru Tech Parks', segment: 'Enterprise', region: 'Bangalore', status: 'prospect' },
  ],
  sales: [
    { product: 'Product X', geography: 'Mumbai', period: 'last_12_months', revenueCr: 18.2, roiPct: 24, risk: 'Medium', units: 410 },
    { product: 'Product X', geography: 'Delhi', period: 'last_12_months', revenueCr: 15.7, roiPct: 19, risk: 'Low', units: 355 },
    { product: 'Product X', geography: 'Bangalore', period: 'last_12_months', revenueCr: 13.6, roiPct: 16, risk: 'Medium', units: 298 },
  ],
  actuals: {
    'Project Alpha': {
      planCostCr: 8.4,
      actualCostCr: 9.16,
      planScheduleMonths: 14,
      elapsedMonths: 16.5,
      revenueRecognizedCr: 6.1,
    },
    'Product X Market Entry': {
      planCostCr: 22,
      actualCostCr: 4.1,
      planScheduleMonths: 18,
      elapsedMonths: 3,
      revenueRecognizedCr: 0,
    },
  },
  requirements: [],
  risks: [
    { id: 'R-1', project: 'Project Alpha', title: 'Vendor delay', severity: 'High', status: 'open' },
    { id: 'R-2', project: 'Project Alpha', title: 'Cost escalation', severity: 'Medium', status: 'open' },
    { id: 'R-3', project: 'Project Alpha', title: 'Resource shortage', severity: 'Medium', status: 'open' },
  ],
};

let reqSeq = 1;
let riskSeq = 4;

export function findProject(name) {
  const q = String(name || '').toLowerCase();
  return store.projects.find((p) => p.name.toLowerCase().includes(q));
}

export function findCustomer(name) {
  const q = String(name || '').toLowerCase();
  return store.customers.find((c) => c.name.toLowerCase().includes(q));
}

export function getSales({ product, geography, period }) {
  return store.sales.filter((row) => {
    const p = !product || row.product.toLowerCase().includes(String(product).toLowerCase());
    const g = !geography || row.geography.toLowerCase().includes(String(geography).toLowerCase());
    const t = !period || row.period === period || period === 'last_12_months';
    return p && g && t;
  });
}

export function createRequirement(description) {
  const item = {
    id: `REQ-${String(reqSeq++).padStart(3, '0')}`,
    description,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
  store.requirements.push(item);
  return item;
}

export function updateProjectStatus(project, status) {
  const p = findProject(project);
  if (!p) return null;
  p.status = status;
  p.updatedAt = new Date().toISOString();
  return p;
}

export function getActuals(project) {
  const p = findProject(project);
  if (!p) return null;
  return { project: p.name, ...(store.actuals[p.name] || {}) };
}

export function getRisks(project) {
  const p = findProject(project);
  if (!p) return [];
  return store.risks.filter((r) => r.project === p.name);
}

export function createRisk({ project, title, severity = 'Medium' }) {
  const p = findProject(project);
  if (!p) return null;
  const item = {
    id: `R-${riskSeq++}`,
    project: p.name,
    title,
    severity,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
  store.risks.push(item);
  return item;
}

export function updateRisk({ id, status, title, severity }) {
  const item = store.risks.find((r) => r.id === id);
  if (!item) return null;
  if (status) item.status = status;
  if (title) item.title = title;
  if (severity) item.severity = severity;
  item.updatedAt = new Date().toISOString();
  return item;
}
