import { useEffect, useRef, useState } from 'react';
import { Univer, UniverInstanceType } from '@univerjs/core';
import { defaultTheme } from '@univerjs/design';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { UniverUIPlugin } from '@univerjs/ui';

// Import Univer CSS
import '@univerjs/design/lib/index.css';
import '@univerjs/ui/lib/index.css';
import '@univerjs/sheets-ui/lib/index.css';

interface UniverSheetEditorProps {
  value: string; // JSON string of spreadsheet data
  onChange: (value: string) => void;
  containerId?: string;
}

export default function UniverSheetEditor({ 
  value, 
  onChange, 
  containerId = 'univer-sheet-container' 
}: UniverSheetEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const univerRef = useRef<Univer | null>(null);
  const changeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function initializeUniver() {
      if (!containerRef.current || univerRef.current) return;

      setIsLoading(true);
      setError(null);

      try {
        console.log('Starting Univer Sheets initialization...', { containerId });

        // Parse existing data or create default spreadsheet
        let initialData;
        try {
          initialData = value && value !== '{}' ? JSON.parse(value) : null;
        } catch (e) {
          console.warn('Failed to parse initial data, using empty spreadsheet', e);
          initialData = null;
        }

        // Create default workbook data
        const defaultWorkbookData = {
          id: `workbook-${containerId}`,
          name: 'Sheet1',
          appVersion: '3.0.0-alpha',
          sheets: {
            sheet1: {
              id: 'sheet1',
              name: 'Sheet1',
              cellData: initialData?.cellData || {},
              rowCount: 100,
              columnCount: 20,
            },
          },
          locale: 'en',
          styles: {},
        };

        console.log('Creating Univer instance...');
        // Create Univer instance
        const univer = new Univer({
          theme: defaultTheme,
        });

        console.log('Registering UI plugin...');
        // Register UI plugin first with container
        univer.registerPlugin(UniverUIPlugin, {
          container: containerRef.current!,
          header: true,
          toolbar: true,
          footer: true,
        });

        console.log('Registering Sheets plugins...');
        univer.registerPlugin(UniverSheetsPlugin);
        univer.registerPlugin(UniverSheetsUIPlugin);
        univer.registerPlugin(UniverSheetsFormulaPlugin);

        console.log('Creating workbook unit...');
        // Create workbook
        const workbook = univer.createUnit(UniverInstanceType.UNIVER_SHEET, defaultWorkbookData);
        console.log('Workbook created:', workbook?.getUnitId());

        univerRef.current = univer;

        // Listen for changes (debounced)
        const handleChange = () => {
          if (changeTimeoutRef.current) {
            clearTimeout(changeTimeoutRef.current);
          }
          changeTimeoutRef.current = setTimeout(() => {
            try {
              const univerAny = univer as any;
              const wb = univerAny.getUnit?.(UniverInstanceType.UNIVER_SHEET, `workbook-${containerId}`);
              if (wb) {
                const sheet = wb.getActiveSheet();
                if (sheet) {
                  // Get cell data
                  const cellData: Record<string, Record<string, any>> = {};
                  const rowCount = Math.min(sheet.getRowCount(), 100);
                  const colCount = Math.min(sheet.getColumnCount(), 20);

                  // Iterate through cells to get values
                  for (let row = 0; row < rowCount; row++) {
                    for (let col = 0; col < colCount; col++) {
                      const cell = sheet.getCell(row, col);
                      if (cell && cell.getValue()) {
                        if (!cellData[row]) {
                          cellData[row] = {};
                        }
                        cellData[row][col] = {
                          v: cell.getValue(),
                          t: cell.getType?.() || 'plain',
                        };
                      }
                    }
                  }

                  const dataToSave = {
                    cellData,
                    rowCount,
                    columnCount: colCount,
                  };
                  onChange(JSON.stringify(dataToSave));
                }
              }
            } catch (error) {
              console.error('Error saving spreadsheet data:', error);
            }
          }, 500);
        };

        // Subscribe to sheet changes
        const api = (univer as any).getAPI?.();
        if (api && typeof api.onSheetChange === 'function') {
          api.onSheetChange(() => {
            handleChange();
          });
        }

        // Wait a moment for rendering to complete
        setTimeout(() => {
          setIsLoading(false);
          console.log('Univer Sheets initialized successfully');
        }, 300);

      } catch (err: any) {
        console.error('Error initializing Univer Sheets:', err);
        console.error('Error details:', {
          message: err.message,
          stack: err.stack,
          name: err.name,
        });
        setError(err.message || 'Failed to initialize spreadsheet editor');
        setIsLoading(false);
        
        // Cleanup on error
        if (univerRef.current) {
          try {
            univerRef.current.dispose();
          } catch (e) {
            console.error('Error disposing Univer on error:', e);
          }
          univerRef.current = null;
        }
      }
    }

    // Wait for container to be mounted, then initialize
    if (!containerRef.current) {
      const checkInterval = setInterval(() => {
        if (containerRef.current) {
          clearInterval(checkInterval);
          initializeUniver();
        }
      }, 50);
      
      return () => clearInterval(checkInterval);
    }

    initializeUniver();

    // Cleanup function
    return () => {
      if (changeTimeoutRef.current) {
        clearTimeout(changeTimeoutRef.current);
      }
      if (univerRef.current) {
        try {
          console.log('Disposing Univer instance...');
          univerRef.current.dispose();
        } catch (e) {
          console.error('Error disposing Univer:', e);
        }
        univerRef.current = null;
      }
    };
  }, [containerId, onChange]); // Removed value from deps to avoid re-initialization

  // Update when value changes externally (only if different)
  useEffect(() => {
    if (!univerRef.current || !value || value === '{}') return;

    try {
      const data = JSON.parse(value);
      const workbook = (univerRef.current as any).getUnit?.(UniverInstanceType.UNIVER_SHEET, `workbook-${containerId}`);
      if (workbook && data.cellData) {
        const sheet = workbook.getActiveSheet();
        if (sheet) {
          // Update cell data
          Object.entries(data.cellData).forEach(([row, rowData]: [string, any]) => {
            Object.entries(rowData).forEach(([col, cellData]: [string, any]) => {
              try {
                sheet.setCellValue(parseInt(row), parseInt(col), cellData?.v || '');
              } catch (e) {
                // Ignore errors for individual cells
              }
            });
          });
        }
      }
    } catch (e) {
      console.error('Failed to parse spreadsheet data:', e);
    }
  }, [value, containerId]);

  if (error) {
    return (
      <div className="border rounded-lg bg-red-50 p-4">
        <p className="text-sm text-red-600 font-medium">Error loading spreadsheet</p>
        <p className="text-xs text-red-500 mt-1">{error}</p>
        <p className="text-xs text-red-400 mt-2">Please check the browser console for details.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="border rounded-lg bg-white p-4">
        <div className="flex items-center justify-center h-[500px]">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Loading spreadsheet editor...</p>
            <p className="text-xs text-muted-foreground mt-2">Initializing Univer Sheets</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      <div 
        ref={containerRef}
        id={containerId}
        className="w-full"
        style={{ height: '500px', minHeight: '400px' }}
      />
    </div>
  );
}
