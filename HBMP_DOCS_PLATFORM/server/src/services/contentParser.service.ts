/**
 * Enhanced content parser for extracting structured content from text
 * Supports headings, lists, tables, and field mapping
 */

export interface ParsedContent {
  sections: ContentSection[];
  tables: TableContent[];
  lists: ListContent[];
}

export interface ContentSection {
  heading: string;
  content: string;
  level: number; // Heading level (1-6)
}

export interface TableContent {
  headers: string[];
  rows: string[][];
  title?: string;
}

export interface ListContent {
  items: string[];
  ordered: boolean;
  title?: string;
}

/**
 * Parse text content into structured sections
 */
export function parseStructuredContent(text: string): ParsedContent {
  const lines = text.split('\n').map((line) => line.trim()).filter((line) => line);
  
  const sections: ContentSection[] = [];
  const tables: TableContent[] = [];
  const lists: ListContent[] = [];
  
  let currentSection: ContentSection | null = null;
  let currentList: string[] = [];
  let isInTable = false;
  let currentTable: TableContent | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for headings
    if (line.startsWith('#')) {
      // Save current section if exists
      if (currentSection) {
        sections.push(currentSection);
      }
      
      // Parse heading level
      const match = line.match(/^(#+)\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const heading = match[2];
        currentSection = {
          heading,
          content: '',
          level,
        };
      }
      continue;
    }

    // Check for markdown tables
    if (line.startsWith('|') && line.endsWith('|')) {
      if (!isInTable) {
        // Start new table
        if (currentTable) {
          tables.push(currentTable);
        }
        currentTable = {
          headers: [],
          rows: [],
        };
        isInTable = true;
      }

      const cells = line
        .split('|')
        .map((cell) => cell.trim())
        .filter((cell) => cell && !cell.match(/^[-:]+$/)); // Filter out separator rows

      if (cells.length > 0) {
        if (currentTable && currentTable.headers.length === 0) {
          // First row is header
          currentTable.headers = cells;
        } else if (currentTable) {
          // Data row
          currentTable.rows.push(cells);
        }
      }
      continue;
    } else {
      // End of table
      if (isInTable && currentTable) {
        tables.push(currentTable);
        currentTable = null;
      }
      isInTable = false;
    }

    // Check for lists
    if (line.match(/^[-*]\s+/) || line.match(/^\d+\.\s+/)) {
      const isOrdered = /^\d+\./.test(line);
      const itemText = line.replace(/^[-*\d.]+\s+/, '');
      
      if (currentList.length === 0 || (isOrdered && currentList.length > 0)) {
        // Start new list
        if (currentList.length > 0) {
          lists.push({
            items: [...currentList],
            ordered: false,
          });
        }
        currentList = [itemText];
      } else {
        currentList.push(itemText);
      }
      continue;
    } else {
      // End of list
      if (currentList.length > 0) {
        lists.push({
          items: [...currentList],
          ordered: false,
        });
        currentList = [];
      }
    }

    // Regular content line
    if (currentSection) {
      currentSection.content += (currentSection.content ? '\n' : '') + line;
    }
  }

  // Save remaining sections/lists/tables
  if (currentSection) {
    sections.push(currentSection);
  }
  if (currentList.length > 0) {
    lists.push({
      items: currentList,
      ordered: false,
    });
  }
  if (currentTable) {
    tables.push(currentTable);
  }

  return { sections, tables, lists };
}

/**
 * Map parsed content to document fields based on field labels
 */
export function mapContentToFields(
  parsedContent: ParsedContent,
  fields: Array<{ id: string; label: string; dataType: string }>
): Map<string, string> {
  const fieldMap = new Map<string, string>();

  // Helper function to calculate similarity between two strings
  const similarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    if (s1 === s2) return 1;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    
    // Simple word overlap
    const words1 = new Set(s1.split(/\s+/));
    const words2 = new Set(s2.split(/\s+/));
    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    return intersection.size / union.size;
  };

  // Map sections to fields
  fields.forEach((field) => {
    const fieldLabelLower = field.label.toLowerCase();
    let bestMatch: { content: string; score: number } | null = null;

    // Try to match with section headings
    parsedContent.sections.forEach((section) => {
      const headingLower = section.heading.toLowerCase();
      const score = similarity(headingLower, fieldLabelLower);
      
      // Also check if heading contains key terms from field label
      const fieldKeywords = fieldLabelLower.split(/\s+/).filter((w) => w.length > 3);
      const hasKeywords = fieldKeywords.some((keyword) => headingLower.includes(keyword));
      
      const finalScore = hasKeywords ? Math.max(score, 0.6) : score;

      if (finalScore > 0.5 && (!bestMatch || finalScore > bestMatch.score)) {
        bestMatch = {
          content: section.content || section.heading,
          score: finalScore,
        };
      }
    });

    // Try keyword-based matching if no good heading match
    if (!bestMatch || bestMatch.score < 0.7) {
      const keywords = [
        ...fieldLabelLower.split(/\s+/),
        ...extractKeywords(fieldLabelLower),
      ];

      parsedContent.sections.forEach((section) => {
        const combinedText = `${section.heading} ${section.content}`.toLowerCase();
        const hasKeywords = keywords.some((keyword) => combinedText.includes(keyword));
        
        if (hasKeywords) {
          const content = section.content || section.heading;
          const score = 0.6; // Medium confidence
          if (!bestMatch || score > bestMatch.score) {
            bestMatch = { content, score };
          }
        }
      });
    }

    if (bestMatch && bestMatch.score > 0.5) {
      fieldMap.set(field.id, bestMatch.content);
    }
  });

  return fieldMap;
}

/**
 * Extract keywords from field label
 */
function extractKeywords(label: string): string[] {
  const lower = label.toLowerCase();
  const keywords: string[] = [];

  // Common business terms
  const termMappings: Record<string, string[]> = {
    objective: ['goal', 'purpose', 'aim'],
    benefit: ['advantage', 'value', 'gain'],
    cost: ['expense', 'price', 'budget'],
    risk: ['threat', 'hazard', 'danger'],
    requirement: ['need', 'specification', 'criteria'],
    stakeholder: ['user', 'customer', 'client'],
    scope: ['boundary', 'limit', 'range'],
  };

  Object.keys(termMappings).forEach((key) => {
    if (lower.includes(key)) {
      keywords.push(...termMappings[key]);
    }
  });

  return keywords;
}

/**
 * Convert table to markdown format
 */
export function tableToMarkdown(table: TableContent): string {
  const lines: string[] = [];
  
  if (table.headers.length > 0) {
    lines.push(`| ${table.headers.join(' | ')} |`);
    lines.push(`| ${table.headers.map(() => '---').join(' | ')} |`);
    
    table.rows.forEach((row) => {
      const paddedRow = [...row];
      while (paddedRow.length < table.headers.length) {
        paddedRow.push('');
      }
      lines.push(`| ${paddedRow.join(' | ')} |`);
    });
  }

  return lines.join('\n');
}

/**
 * Convert list to markdown format
 */
export function listToMarkdown(list: ListContent): string {
  const prefix = list.ordered ? (index: number) => `${index + 1}. ` : '- ';
  return list.items.map((item, index) => `${list.ordered ? `${index + 1}. ` : '- '}${item}`).join('\n');
}


