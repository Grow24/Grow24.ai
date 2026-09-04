import {
  createRequirement,
  createRisk,
  findCustomer,
  findProject,
  getActuals,
  getRisks,
  getSales,
  updateProjectStatus,
  updateRisk,
} from './store.js';

function ok(data) {
  return { ok: true, data };
}

function fail(message) {
  return { ok: false, error: message };
}

export const toolDefs = [
  {
    name: 'get_project',
    description: 'Get a PBMP project by name, including status and summary.',
    inputSchema: {
      type: 'object',
      properties: { project_name: { type: 'string' } },
      required: ['project_name'],
    },
  },
  {
    name: 'get_customer',
    description: 'Get a PBMP customer by name.',
    inputSchema: {
      type: 'object',
      properties: { customer_name: { type: 'string' } },
      required: ['customer_name'],
    },
  },
  {
    name: 'get_sales',
    description: 'Get sales for a product, geography and period (use last_12_months).',
    inputSchema: {
      type: 'object',
      properties: {
        product: { type: 'string' },
        geography: { type: 'string' },
        period: { type: 'string' },
      },
      required: ['product'],
    },
  },
  {
    name: 'create_requirement',
    description: 'Create a requirement in PBMP.',
    inputSchema: {
      type: 'object',
      properties: { description: { type: 'string' } },
      required: ['description'],
    },
  },
  {
    name: 'update_project_status',
    description: 'Update a PBMP project status.',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string' },
        status: { type: 'string' },
      },
      required: ['project', 'status'],
    },
  },
  {
    name: 'get_project_actuals',
    description: 'Get actual vs plan figures for a project.',
    inputSchema: {
      type: 'object',
      properties: { project_name: { type: 'string' } },
      required: ['project_name'],
    },
  },
  {
    name: 'get_project_risks',
    description: 'List risks on a PBMP project.',
    inputSchema: {
      type: 'object',
      properties: { project_name: { type: 'string' } },
      required: ['project_name'],
    },
  },
  {
    name: 'create_risk',
    description: 'Add a risk to a PBMP project. Prefer human approval before calling.',
    inputSchema: {
      type: 'object',
      properties: {
        project: { type: 'string' },
        title: { type: 'string' },
        severity: { type: 'string' },
      },
      required: ['project', 'title'],
    },
  },
  {
    name: 'update_risk',
    description: 'Update a PBMP risk. Prefer human approval before calling.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        status: { type: 'string' },
        title: { type: 'string' },
        severity: { type: 'string' },
      },
      required: ['id'],
    },
  },
];

export function callTool(name, args = {}) {
  switch (name) {
    case 'get_project': {
      const p = findProject(args.project_name);
      return p ? ok(p) : fail(`Project not found: ${args.project_name}`);
    }
    case 'get_customer': {
      const c = findCustomer(args.customer_name);
      return c ? ok(c) : fail(`Customer not found: ${args.customer_name}`);
    }
    case 'get_sales':
      return ok(getSales(args));
    case 'create_requirement':
      return ok(createRequirement(args.description));
    case 'update_project_status': {
      const p = updateProjectStatus(args.project, args.status);
      return p ? ok(p) : fail(`Project not found: ${args.project}`);
    }
    case 'get_project_actuals': {
      const a = getActuals(args.project_name);
      return a ? ok(a) : fail(`Project not found: ${args.project_name}`);
    }
    case 'get_project_risks':
      return ok(getRisks(args.project_name));
    case 'create_risk': {
      const r = createRisk(args);
      return r ? ok(r) : fail(`Project not found: ${args.project}`);
    }
    case 'update_risk': {
      const r = updateRisk(args);
      return r ? ok(r) : fail(`Risk not found: ${args.id}`);
    }
    default:
      return fail(`Unknown tool: ${name}`);
  }
}
