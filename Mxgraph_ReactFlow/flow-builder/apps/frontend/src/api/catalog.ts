// Catalog API for dynamic dropdowns and field options

export interface CatalogItem {
  id: string;
  label: string;
  description?: string;
  category?: string;
}

// Mock data - replace with actual API calls
const mockOperators: CatalogItem[] = [
  { id: 'equals', label: 'Equals', description: 'Exact match' },
  { id: 'not_equals', label: 'Not Equals', description: 'Does not match' },
  { id: 'greater_than', label: 'Greater Than', description: 'Numeric comparison' },
  { id: 'less_than', label: 'Less Than', description: 'Numeric comparison' },
  { id: 'contains', label: 'Contains', description: 'Text contains substring' },
  { id: 'starts_with', label: 'Starts With', description: 'Text begins with' },
  { id: 'ends_with', label: 'Ends With', description: 'Text ends with' },
];

const mockActionTypes: CatalogItem[] = [
  { id: 'email', label: 'Email Notification', description: 'Send automated emails' },
  { id: 'api', label: 'API Integration', description: 'Call external services' },
  { id: 'db', label: 'Database Operation', description: 'CRUD operations' },
  { id: 'webhook', label: 'Webhook', description: 'HTTP callbacks' },
];

const mockFields: CatalogItem[] = [
  { id: 'customerEmail', label: 'Customer Email', category: 'customer' },
  { id: 'customerName', label: 'Customer Name', category: 'customer' },
  { id: 'revenue', label: 'Annual Revenue', category: 'financial' },
  { id: 'accountType', label: 'Account Type', category: 'account' },
  { id: 'registrationDate', label: 'Registration Date', category: 'temporal' },
];

export const catalogApi = {
  // Get available operators for conditions
  getOperators: async (): Promise<CatalogItem[]> => {
    return Promise.resolve(mockOperators);
  },

  // Get available action types
  getActionTypes: async (): Promise<CatalogItem[]> => {
    return Promise.resolve(mockActionTypes);
  },

  // Get available fields for expressions
  getFields: async (category?: string): Promise<CatalogItem[]> => {
    if (category) {
      return Promise.resolve(mockFields.filter(f => f.category === category));
    }
    return Promise.resolve(mockFields);
  },

  // Get field categories
  getFieldCategories: async (): Promise<CatalogItem[]> => {
    const categories = [...new Set(mockFields.map(f => f.category))];
    return Promise.resolve(
      categories.map(cat => ({
        id: cat || 'general',
        label: cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'General'
      }))
    );
  },
};