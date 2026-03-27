import { google } from 'googleapis';

/**
 * Extract document ID from Google Docs/Sheets/Slides URL
 */
export function extractDocumentId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/(?:document|spreadsheets|presentation)\/d\/([a-zA-Z0-9-_]+)/);
    return pathMatch ? pathMatch[1] : null;
  } catch {
    return null;
  }
}

/**
 * Get Google Docs API client (requires OAuth token)
 * For now, returns null - OAuth implementation pending
 */
export async function getGoogleDocsClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  
  return google.docs({ version: 'v1', auth });
}

/**
 * Get Google Sheets API client
 */
export async function getGoogleSheetsClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  
  return google.sheets({ version: 'v4', auth });
}

/**
 * Get Google Slides API client
 */
export async function getGoogleSlidesClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  
  return google.slides({ version: 'v1', auth });
}

/**
 * Fetch Google Doc content
 */
export async function fetchGoogleDocContent(docId: string, accessToken: string): Promise<string> {
  const docs = await getGoogleDocsClient(accessToken);
  const doc = await docs.documents.get({ documentId: docId });
  
  if (!doc.data.body?.content) {
    return '';
  }

  // Parse document structure into text
  const textContent: string[] = [];
  
  const processElement = (element: any) => {
    if (element.paragraph) {
      const para = element.paragraph;
      if (para.elements) {
        const paraText = para.elements
          .map((el: any) => {
            if (el.textRun) return el.textRun.content || '';
            return '';
          })
          .join('');
        
        if (paraText.trim()) {
          // Check if it's a heading
          const style = para.paragraphStyle?.namedStyleType;
          if (style?.startsWith('HEADING')) {
            textContent.push(`\n## ${paraText.trim()}\n`);
          } else {
            textContent.push(paraText.trim());
          }
        }
      }
    } else if (element.table) {
      // Process table
      const table = element.table;
      if (table.tableRows) {
        table.tableRows.forEach((row: any) => {
          if (row.tableCells) {
            const rowText = row.tableCells
              .map((cell: any) => {
                if (cell.content) {
                  return cell.content
                    .map((c: any) => {
                      if (c.paragraph?.elements) {
                        return c.paragraph.elements
                          .map((e: any) => e.textRun?.content || '')
                          .join('');
                      }
                      return '';
                    })
                    .join(' ')
                    .trim();
                }
                return '';
              })
              .join(' | ');
            textContent.push(`| ${rowText} |`);
          }
        });
        textContent.push(''); // Empty line after table
      }
    }
  };

  doc.data.body.content.forEach(processElement);
  
  return textContent.join('\n');
}

/**
 * Fetch Google Sheet content (first sheet)
 */
export async function fetchGoogleSheetContent(sheetId: string, accessToken: string): Promise<string> {
  const sheets = await getGoogleSheetsClient(accessToken);
  
  // Get spreadsheet metadata
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
  const firstSheet = spreadsheet.data.sheets?.[0];
  if (!firstSheet?.properties?.title) {
    return '';
  }

  // Get values from first sheet
  const range = `${firstSheet.properties.title}!A1:Z1000`; // Adjust range as needed
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  const rows = response.data.values || [];
  
  // Convert to markdown table format
  const lines: string[] = [];
  rows.forEach((row, index) => {
    if (index === 0 && row.length > 0) {
      // Header row
      lines.push(`| ${row.join(' | ')} |`);
      lines.push(`| ${row.map(() => '---').join(' | ')} |`);
    } else if (row.length > 0) {
      lines.push(`| ${row.map(cell => cell || '').join(' | ')} |`);
    }
  });

  return lines.join('\n');
}

/**
 * Fetch Google Slides content
 */
export async function fetchGoogleSlidesContent(presentationId: string, accessToken: string): Promise<string> {
  const slides = await getGoogleSlidesClient(accessToken);
  const presentation = await slides.presentations.get({ presentationId });
  
  if (!presentation.data.slides) {
    return '';
  }

  const textContent: string[] = [];
  
  presentation.data.slides.forEach((slide, index) => {
    textContent.push(`\n## Slide ${index + 1}\n`);
    
    if (slide.pageElements) {
      slide.pageElements.forEach((element: any) => {
        if (element.shape?.text?.textElements) {
          const slideText = element.shape.text.textElements
            .map((el: any) => {
              if (el.textRun) return el.textRun.content || '';
              return '';
            })
            .join('');
          if (slideText.trim()) {
            textContent.push(slideText.trim());
          }
        }
      });
    }
  });

  return textContent.join('\n');
}


