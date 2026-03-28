const BLOCKED_IDENTIFIERS = [
  'process', 'global', 'window', 'document', 'eval', 'Function',
  'require', 'module', 'exports', '__dirname', '__filename'
];

export function evaluate(expression: string, context: Record<string, any>): boolean {
  try {
    // Allow common operators and characters for expressions
    const sanitized = expression.replace(/[^a-zA-Z0-9\s><=!&|+\-*/().'"_]/g, '');
    
    // Check for blocked identifiers
    for (const blocked of BLOCKED_IDENTIFIERS) {
      if (sanitized.includes(blocked)) {
        throw new Error(`Blocked identifier: ${blocked}`);
      }
    }
    
    // Basic syntax validation - just check if it's a reasonable expression
    if (!sanitized.trim()) {
      throw new Error('Empty expression');
    }
    
    // For validation purposes, just check if the expression has valid syntax
    // Replace variables with dummy values for syntax checking
    let testExpression = sanitized;
    const variablePattern = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
    testExpression = testExpression.replace(variablePattern, '1');
    
    // Test if the expression is syntactically valid
    const func = new Function('return ' + testExpression);
    func(); // This will throw if syntax is invalid
    
    return true; // If we get here, syntax is valid
  } catch (error) {
    throw new Error(`Invalid expression: ${expression}`);
  }
}