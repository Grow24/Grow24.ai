import { evaluate } from '../lib/expression';

describe('Expression Evaluator', () => {
  test('evaluates simple expressions', () => {
    expect(evaluate('amount > 1000', { amount: 1500 })).toBe(true);
    expect(evaluate('amount > 1000', { amount: 500 })).toBe(false);
  });

  test('evaluates complex expressions', () => {
    expect(evaluate('amount > 1000 && industry == "tech"', { 
      amount: 1500, 
      industry: 'tech' 
    })).toBe(true);
  });

  test('blocks dangerous identifiers', () => {
    expect(() => evaluate('process.exit()', {})).toThrow();
    expect(() => evaluate('global.something', {})).toThrow();
  });
});