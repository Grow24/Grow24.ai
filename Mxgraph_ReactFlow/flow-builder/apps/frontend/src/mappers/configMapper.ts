import { NodeConfig } from '../schemas/nodeSchemas';

// Convert form state to canonical JSON for backend
export const mapConfigToJSON = (config: NodeConfig): any => {
  switch (config.type) {
    case 'start':
      return {
        label: config.label,
      };

    case 'decision':
      return {
        label: config.label,
        conditions: config.conditions,
        defaultPath: config.defaultPath,
      };

    case 'action':
      return {
        label: config.label,
        actionType: config.actionType,
        config: config.config || {},
        outputVar: config.outputVar,
      };

    case 'process':
      return {
        label: config.label,
        description: config.description,
      };

    case 'end':
      return {
        label: config.label,
        status: config.status || 'success',
      };

    case 'table':
      return {
        label: config.label,
        rows: config.rows,
        cols: config.cols,
        cells: config.cells,
        columnWidths: config.columnWidths,
        rowHeights: config.rowHeights,
      };

    default:
      return { label: config.label };
  }
};

// Convert backend JSON to form state
export const mapJSONToConfig = (type: string, data: any): NodeConfig => {
  const baseConfig = { type: type as any, label: data.label || '' };

  switch (type) {
    case 'start':
      return baseConfig as NodeConfig;

    case 'decision':
      // Handle both legacy and new condition formats
      const conditions = data.legacyConditions || data.conditions || [];
      return {
        ...baseConfig,
        conditions: Array.isArray(conditions) ? conditions.map((c: any) => ({
          id: c.id || `condition_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          label: c.label || '',
          expression: c.expression || ''
        })) : [],
        defaultPath: data.defaultPath || 'default',
      } as NodeConfig;

    case 'action':
      return {
        ...baseConfig,
        actionType: data.actionType || 'email',
        config: data.config || {},
        outputVar: data.outputVar,
      } as NodeConfig;

    case 'process':
      return {
        ...baseConfig,
        description: data.description,
      } as NodeConfig;

    case 'end':
      return {
        ...baseConfig,
        status: data.status || 'success',
      } as NodeConfig;

    case 'table':
      return {
        ...baseConfig,
        rows: data.rows || 3,
        cols: data.cols || 3,
        cells: data.cells || [['A1', 'B1', 'C1'], ['A2', 'B2', 'C2'], ['A3', 'B3', 'C3']],
        columnWidths: data.columnWidths || [80, 80, 80],
        rowHeights: data.rowHeights || [30, 30, 30],
      } as NodeConfig;

    default:
      return baseConfig as NodeConfig;
  }
};