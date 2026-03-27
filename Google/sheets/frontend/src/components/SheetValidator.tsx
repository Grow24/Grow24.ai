import { useEffect, useState } from 'react';

interface ValidationRule {
  id: string;
  name: string;
  type: 'profit-percentage' | 'custom';
  columnName: string;
  threshold?: number;
  operator?: 'less-than' | 'greater-than' | 'equal-to';
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface ValidationResult {
  rule: ValidationRule;
  passed: boolean;
  actualValue?: number;
  message: string;
}

interface SheetValidatorProps {
  data: any[][];
  onValidationComplete?: (results: ValidationResult[]) => void;
}

export default function SheetValidator({ data, onValidationComplete }: SheetValidatorProps) {
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [showValidations, setShowValidations] = useState(false);

  // Default validation rules
  const defaultRules: ValidationRule[] = [
    {
      id: 'profit-check',
      name: 'Overall Profit Check',
      type: 'profit-percentage',
      columnName: 'Profit',
      threshold: 10,
      operator: 'less-than',
      message: 'Overall profit is less than the ideal 10%',
      severity: 'warning'
    }
  ];

  const calculateProfitPercentage = (data: any[][]): number | null => {
    if (!data || data.length < 2) return null;

    const headers = data[0];
    
    // Find profit-related columns (case-insensitive)
    const profitIndex = headers.findIndex((h: string) => 
      h?.toLowerCase().includes('profit')
    );
    
    const revenueIndex = headers.findIndex((h: string) => 
      h?.toLowerCase().includes('revenue') || 
      h?.toLowerCase().includes('sales') || 
      h?.toLowerCase().includes('total')
    );

    if (profitIndex === -1) return null;

    // Extract numeric values from profit column
    const profitValues = data.slice(1)
      .map(row => {
        const value = row[profitIndex];
        if (typeof value === 'string') {
          // Remove currency symbols, commas, and parse
          const cleaned = value.replace(/[$,€£¥]/g, '').trim();
          const num = parseFloat(cleaned);
          return isNaN(num) ? 0 : num;
        }
        return typeof value === 'number' ? value : 0;
      })
      .filter(v => v !== 0);

    if (profitValues.length === 0) return null;

    // If we have revenue, calculate profit percentage
    if (revenueIndex !== -1) {
      const revenueValues = data.slice(1)
        .map(row => {
          const value = row[revenueIndex];
          if (typeof value === 'string') {
            const cleaned = value.replace(/[$,€£¥]/g, '').trim();
            const num = parseFloat(cleaned);
            return isNaN(num) ? 0 : num;
          }
          return typeof value === 'number' ? value : 0;
        })
        .filter(v => v !== 0);

      const totalProfit = profitValues.reduce((sum, val) => sum + val, 0);
      const totalRevenue = revenueValues.reduce((sum, val) => sum + val, 0);

      if (totalRevenue > 0) {
        return (totalProfit / totalRevenue) * 100;
      }
    }

    // If no revenue column, assume profit is already in percentage
    const avgProfit = profitValues.reduce((sum, val) => sum + val, 0) / profitValues.length;
    
    // Check if values seem to be percentages (0-100 range)
    if (avgProfit >= 0 && avgProfit <= 100) {
      return avgProfit;
    }

    // Otherwise, can't calculate meaningful percentage
    return null;
  };

  useEffect(() => {
    if (!data || data.length < 2) {
      setValidationResults([]);
      return;
    }

    const results: ValidationResult[] = [];

    // Run each validation rule
    defaultRules.forEach(rule => {
      if (rule.type === 'profit-percentage') {
        const profitPercentage = calculateProfitPercentage(data);
        
        if (profitPercentage === null) {
          // Skip validation if we can't find profit data
          return;
        }

        const threshold = rule.threshold || 10;
        const passed = profitPercentage >= threshold;

        results.push({
          rule,
          passed,
          actualValue: profitPercentage,
          message: passed 
            ? `✓ Profit is healthy at ${profitPercentage.toFixed(2)}%` 
            : `⚠ ${rule.message}. Current profit: ${profitPercentage.toFixed(2)}%`
        });
      }
    });

    setValidationResults(results);
    
    // Auto-show if there are failures
    const hasFailures = results.some(r => !r.passed);
    if (hasFailures) {
      setShowValidations(true);
    }

    // Notify parent component
    if (onValidationComplete) {
      onValidationComplete(results);
    }
  }, [data]);

  if (validationResults.length === 0) {
    return null;
  }

  const failedValidations = validationResults.filter(r => !r.passed);
  const passedValidations = validationResults.filter(r => r.passed);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Badge */}
      {!showValidations && (
        <button
          onClick={() => setShowValidations(true)}
          className={`px-4 py-3 rounded-full shadow-lg font-medium text-sm flex items-center gap-2 transition-all hover:scale-105 ${
            failedValidations.length > 0
              ? 'bg-orange-500 text-white hover:bg-orange-600 animate-pulse'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {failedValidations.length > 0 ? (
            <>
              <span className="text-lg">⚠</span>
              <span>{failedValidations.length} Issue{failedValidations.length > 1 ? 's' : ''}</span>
            </>
          ) : (
            <>
              <span className="text-lg">✓</span>
              <span>All Validated</span>
            </>
          )}
        </button>
      )}

      {/* Validation Panel */}
      {showValidations && (
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-[600px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b bg-gradient-to-r from-green-50 to-emerald-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Sheet Validation</h3>
                <p className="text-xs text-gray-600">
                  {validationResults.length} rule{validationResults.length > 1 ? 's' : ''} checked
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowValidations(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="text-xl">✕</span>
            </button>
          </div>

          {/* Results */}
          <div className="overflow-y-auto flex-1 p-4 space-y-3">
            {/* Failed Validations */}
            {failedValidations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Issues Found ({failedValidations.length})
                </h4>
                {failedValidations.map((result, index) => (
                  <div
                    key={`failed-${index}`}
                    className="border border-orange-200 bg-orange-50 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">⚠</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-orange-900 text-sm">
                          {result.rule.name}
                        </p>
                        <p className="text-sm text-orange-800 mt-1">
                          {result.message}
                        </p>
                        {result.actualValue !== undefined && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-orange-500 h-full transition-all"
                                style={{ width: `${Math.min(result.actualValue, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-orange-700">
                              {result.actualValue.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="pl-9 space-y-1">
                      <p className="text-xs text-orange-700">
                        <strong>Expected:</strong> ≥ {result.rule.threshold}%
                      </p>
                      <p className="text-xs text-orange-700">
                        <strong>Action:</strong> Review your pricing strategy or reduce costs
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Passed Validations */}
            {passedValidations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Passed ({passedValidations.length})
                </h4>
                {passedValidations.map((result, index) => (
                  <div
                    key={`passed-${index}`}
                    className="border border-green-200 bg-green-50 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-green-900 text-sm">
                          {result.rule.name}
                        </p>
                        <p className="text-sm text-green-800 mt-1">
                          {result.message}
                        </p>
                        {result.actualValue !== undefined && (
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-green-500 h-full transition-all"
                                style={{ width: `${Math.min(result.actualValue, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-green-700">
                              {result.actualValue.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t bg-gray-50 flex items-center justify-between">
            <p className="text-xs text-gray-600">
              Last checked: {new Date().toLocaleTimeString()}
            </p>
            <button
              onClick={() => setShowValidations(false)}
              className="text-xs text-green-600 hover:text-green-700 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
