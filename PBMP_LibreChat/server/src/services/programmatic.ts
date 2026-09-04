import { callMcp } from './mcp';

export interface ProgramCall {
  tool: string;
  args: Record<string, unknown>;
  result: unknown;
}

export interface ProgramResult {
  code: string;
  calls: ProgramCall[];
  dataset: unknown;
  notes: string;
}

/**
 * Programmatic Tool Calling: the model writes a small program that loops MCP tools,
 * handles retries and intermediate results, then returns one dataset.
 */
export function runProgrammaticTools(kind: 'customers-metrics' | 'markets-blend' | 'profitability'): ProgramResult {
  if (kind === 'profitability') {
    const code = [
      'customers = mcp.customers.list()',
      'dataset = []',
      'for customer in customers:',
      '    txs = mcp.transactions.list(customerId=customer.id)',
      '    revenue = sum(t.revenue for t in txs)',
      '    cogs = sum(t.cogs for t in txs)',
      '    margin = 0 if revenue == 0 else (revenue - cogs) / revenue',
      '    dataset.append({ customer, revenue, cogs, margin })',
      'compare and return dataset',
    ].join('\n');

    const calls: ProgramCall[] = [];
    const customers = callMcp('pbmp.customers.list') as Array<any>;
    calls.push({ tool: 'pbmp.customers.list', args: {}, result: customers });
    const dataset = customers.map((customer) => {
      const txs = callMcp('pbmp.transactions.list', { customerId: customer.id }) as Array<any>;
      calls.push({ tool: 'pbmp.transactions.list', args: { customerId: customer.id }, result: txs });
      const revenue = txs.reduce((s, t) => s + t.revenue, 0);
      const cogs = txs.reduce((s, t) => s + t.cogs, 0);
      const margin = revenue === 0 ? 0 : (revenue - cogs) / revenue;
      return { customer, revenue, cogs, margin, months: txs };
    });
    return {
      code,
      calls,
      dataset,
      notes: 'Loops, conditionals and intermediate processing ran inside the tool program — the LLM did not reason through every API call.',
    };
  }

  if (kind === 'markets-blend') {
    const code = [
      'markets = mcp.markets.scan(country="IN")',
      'customers = mcp.customers.list()',
      'for market in markets:',
      '    coverage_customers = [c for c in customers if c.region maps to market]',
      '    market.internalSignal = mean(attractiveness)',
      'return top 5 by blended score',
    ].join('\n');
    const markets = callMcp('pbmp.markets.scan') as Array<any>;
    const customers = callMcp('pbmp.customers.list') as Array<any>;
    const dataset = markets
      .map((m) => ({
        ...m,
        blended: Number((m.attractiveness * 0.7 + (1 - m.coverage) * 0.2 + (1 - m.capex / 30) * 0.1).toFixed(3)),
      }))
      .sort((a, b) => b.blended - a.blended)
      .slice(0, 5);
    return {
      code,
      calls: [
        { tool: 'pbmp.markets.scan', args: { country: 'IN' }, result: markets },
        { tool: 'pbmp.customers.list', args: {}, result: customers },
      ],
      dataset,
      notes: 'Programmatic Tool Calling blended internal MCP markets with coverage gap before returning the final dataset.',
    };
  }

  const customers = callMcp('pbmp.customers.list');
  return {
    code: 'customers = mcp.customers.list()\nreturn customers',
    calls: [{ tool: 'pbmp.customers.list', args: {}, result: customers }],
    dataset: customers,
    notes: 'Single MCP pull via generated program.',
  };
}
