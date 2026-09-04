import { CONTRACTS, CUSTOMERS, INDIA_MARKETS, PIPELINE, TRANSACTIONS } from '../catalog';

export function callMcp(toolId: string, args: Record<string, unknown> = {}) {
  switch (toolId) {
    case 'pbmp.customers.list': {
      const region = typeof args.region === 'string' ? args.region : undefined;
      const product = typeof args.product === 'string' ? args.product : undefined;
      return CUSTOMERS.filter((c) => (!region || c.region === region) && (!product || c.product === product));
    }
    case 'pbmp.transactions.list': {
      const customerId = typeof args.customerId === 'string' ? args.customerId : undefined;
      const month = typeof args.month === 'string' ? args.month : undefined;
      return TRANSACTIONS.filter((t) => (!customerId || t.customerId === customerId) && (!month || t.month === month));
    }
    case 'pbmp.markets.scan':
      return INDIA_MARKETS;
    case 'pbmp.contracts.list': {
      const counterparty = typeof args.counterparty === 'string' ? args.counterparty : undefined;
      return CONTRACTS.filter((c) => !counterparty || c.counterparty === counterparty);
    }
    case 'pbmp.pipeline.byRegion': {
      const product = typeof args.product === 'string' ? args.product : undefined;
      return PIPELINE.filter((p) => !product || p.product === product);
    }
    default:
      throw new Error(`Unknown MCP tool: ${toolId}`);
  }
}

export const MCP_REGISTRY = {
  server: 'pbmp',
  description: 'PBMP business data MCP — customers, transactions, markets, contracts, pipeline',
  tools: [
    'pbmp.customers.list',
    'pbmp.transactions.list',
    'pbmp.markets.scan',
    'pbmp.contracts.list',
    'pbmp.pipeline.byRegion',
  ],
};
