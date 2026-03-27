/**
 * Global Master Elements Registry
 * Standardized field names to ensure consistency across all templates
 */

export interface MasterElement {
  id: string;
  label: string;
  category: string;
  description: string;
  aliases: string[]; // Common variations
  defaultType: string;
  example?: string;
}

export const MASTER_ELEMENTS: MasterElement[] = [
  // Personal Information
  {
    id: "name",
    label: "Name",
    category: "Personal",
    description: "Full name of a person",
    aliases: ["Full Name", "Person Name", "Employee Name", "Customer Name"],
    defaultType: "text",
    example: "John Doe"
  },
  {
    id: "first_name",
    label: "First Name",
    category: "Personal",
    description: "Given name",
    aliases: ["Given Name", "FirstName"],
    defaultType: "text",
    example: "John"
  },
  {
    id: "last_name",
    label: "Last Name",
    category: "Personal",
    description: "Family name or surname",
    aliases: ["Surname", "Family Name", "LastName"],
    defaultType: "text",
    example: "Doe"
  },
  {
    id: "email",
    label: "Email",
    category: "Contact",
    description: "Email address",
    aliases: ["Email Address", "E-mail", "Mail"],
    defaultType: "email",
    example: "john@example.com"
  },
  {
    id: "phone",
    label: "Phone",
    category: "Contact",
    description: "Phone number",
    aliases: ["Phone Number", "Mobile", "Contact Number", "Tel"],
    defaultType: "text",
    example: "(555) 123-4567"
  },
  {
    id: "address",
    label: "Address",
    category: "Contact",
    description: "Physical address",
    aliases: ["Street Address", "Location", "Mailing Address"],
    defaultType: "text",
    example: "123 Main St"
  },
  
  // Business & Organization
  {
    id: "company",
    label: "Company",
    category: "Business",
    description: "Company or organization name",
    aliases: ["Company Name", "Organization", "Business Name"],
    defaultType: "text",
    example: "Acme Corp"
  },
  {
    id: "position",
    label: "Position",
    category: "Business",
    description: "Job title or role",
    aliases: ["Job Title", "Role", "Title", "Designation"],
    defaultType: "text",
    example: "Manager"
  },
  {
    id: "department",
    label: "Department",
    category: "Business",
    description: "Department or division",
    aliases: ["Division", "Team", "Unit"],
    defaultType: "text",
    example: "Sales"
  },
  {
    id: "employee_id",
    label: "Employee ID",
    category: "Business",
    description: "Unique employee identifier",
    aliases: ["Staff ID", "EMP ID", "EmployeeID"],
    defaultType: "text",
    example: "EMP001"
  },
  
  // Financial
  {
    id: "amount",
    label: "Amount",
    category: "Financial",
    description: "Monetary value",
    aliases: ["Price", "Cost", "Value", "Total"],
    defaultType: "currency",
    example: "$1,500"
  },
  {
    id: "quantity",
    label: "Quantity",
    category: "Financial",
    description: "Number of items",
    aliases: ["Qty", "Count", "Number", "Units"],
    defaultType: "number",
    example: "100"
  },
  {
    id: "unit_price",
    label: "Unit Price",
    category: "Financial",
    description: "Price per unit",
    aliases: ["Price Per Unit", "Rate", "Unit Cost"],
    defaultType: "currency",
    example: "$50"
  },
  {
    id: "subtotal",
    label: "Subtotal",
    category: "Financial",
    description: "Subtotal amount before tax",
    aliases: ["Sub Total", "Sub-Total"],
    defaultType: "currency",
    example: "$5,000"
  },
  {
    id: "tax",
    label: "Tax",
    category: "Financial",
    description: "Tax amount",
    aliases: ["Tax Amount", "VAT", "Sales Tax"],
    defaultType: "currency",
    example: "$500"
  },
  {
    id: "total",
    label: "Total",
    category: "Financial",
    description: "Total amount including tax",
    aliases: ["Grand Total", "Total Amount", "Final Amount"],
    defaultType: "currency",
    example: "$5,500"
  },
  
  // Date & Time
  {
    id: "date",
    label: "Date",
    category: "DateTime",
    description: "Calendar date",
    aliases: ["Created Date", "Entry Date", "Transaction Date"],
    defaultType: "date",
    example: "01/15/2024"
  },
  {
    id: "start_date",
    label: "Start Date",
    category: "DateTime",
    description: "Beginning date",
    aliases: ["From Date", "Begin Date", "StartDate"],
    defaultType: "date",
    example: "01/01/2024"
  },
  {
    id: "end_date",
    label: "End Date",
    category: "DateTime",
    description: "Ending date",
    aliases: ["To Date", "Finish Date", "EndDate", "Due Date"],
    defaultType: "date",
    example: "12/31/2024"
  },
  {
    id: "time",
    label: "Time",
    category: "DateTime",
    description: "Time of day",
    aliases: ["Time Stamp", "Hour", "Timestamp"],
    defaultType: "text",
    example: "09:00 AM"
  },
  
  // Status & Classification
  {
    id: "status",
    label: "Status",
    category: "Status",
    description: "Current status or state",
    aliases: ["State", "Condition", "Current Status"],
    defaultType: "text",
    example: "Active"
  },
  {
    id: "priority",
    label: "Priority",
    category: "Status",
    description: "Priority level",
    aliases: ["Importance", "Priority Level"],
    defaultType: "text",
    example: "High"
  },
  {
    id: "category",
    label: "Category",
    category: "Classification",
    description: "Classification category",
    aliases: ["Type", "Class", "Group"],
    defaultType: "text",
    example: "Electronics"
  },
  
  // Description & Notes
  {
    id: "description",
    label: "Description",
    category: "Text",
    description: "Detailed description",
    aliases: ["Details", "Desc", "Summary"],
    defaultType: "text",
    example: "Product description here..."
  },
  {
    id: "notes",
    label: "Notes",
    category: "Text",
    description: "Additional notes or comments",
    aliases: ["Comments", "Remarks", "Additional Info"],
    defaultType: "text",
    example: "Important notes..."
  },
  
  // Product & Inventory
  {
    id: "product",
    label: "Product",
    category: "Product",
    description: "Product name",
    aliases: ["Product Name", "Item", "Item Name"],
    defaultType: "text",
    example: "Widget Pro"
  },
  {
    id: "sku",
    label: "SKU",
    category: "Product",
    description: "Stock Keeping Unit",
    aliases: ["Product Code", "Item Code", "Code"],
    defaultType: "text",
    example: "SKU-001"
  },
  {
    id: "vendor",
    label: "Vendor",
    category: "Product",
    description: "Supplier or vendor name",
    aliases: ["Supplier", "Provider", "Seller"],
    defaultType: "text",
    example: "ABC Supplies"
  },
  
  // Sales & Customer
  {
    id: "customer",
    label: "Customer",
    category: "Sales",
    description: "Customer name",
    aliases: ["Client", "Customer Name", "Client Name"],
    defaultType: "text",
    example: "XYZ Corp"
  },
  {
    id: "sales_rep",
    label: "Sales Rep",
    category: "Sales",
    description: "Sales representative",
    aliases: ["Sales Representative", "Account Manager", "Rep"],
    defaultType: "text",
    example: "Sarah"
  },
  {
    id: "invoice_number",
    label: "Invoice Number",
    category: "Sales",
    description: "Invoice identifier",
    aliases: ["Invoice No", "Invoice ID", "Bill Number"],
    defaultType: "text",
    example: "INV-001"
  }
];

/**
 * Get all categories
 */
export function getCategories(): string[] {
  const categories = [...new Set(MASTER_ELEMENTS.map(el => el.category))];
  return categories.sort();
}

/**
 * Search master elements by query
 */
export function searchMasterElements(query: string): MasterElement[] {
  if (!query || query.length < 2) return MASTER_ELEMENTS;
  
  const lowerQuery = query.toLowerCase();
  
  return MASTER_ELEMENTS.filter(element => {
    // Search in label
    if (element.label.toLowerCase().includes(lowerQuery)) return true;
    
    // Search in aliases
    if (element.aliases.some(alias => alias.toLowerCase().includes(lowerQuery))) return true;
    
    // Search in description
    if (element.description.toLowerCase().includes(lowerQuery)) return true;
    
    return false;
  });
}

/**
 * Get master element by ID
 */
export function getMasterElement(id: string): MasterElement | undefined {
  return MASTER_ELEMENTS.find(el => el.id === id);
}

/**
 * Get elements by category
 */
export function getElementsByCategory(category: string): MasterElement[] {
  return MASTER_ELEMENTS.filter(el => el.category === category);
}
