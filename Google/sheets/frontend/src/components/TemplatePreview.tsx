import { useEffect, useRef } from "react";

interface TemplatePreviewProps {
  templateData: string[][];
  templateName: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export default function TemplatePreview({ 
  templateData, 
  templateName,
  position,
  onClose 
}: TemplatePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  console.log('TemplatePreview rendering:', templateName, 'position:', position, 'data rows:', templateData.length);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (previewRef.current && !previewRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Small delay before adding the listener to prevent immediate closure
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Calculate optimal position to prevent overflow
  const getPosition = () => {
    if (!previewRef.current) return { top: position.y, left: position.x };
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let top = position.y;
    let left = position.x + 20; // Offset to the right
    
    // Adjust if preview goes off screen horizontally
    if (left + 600 > viewportWidth) {
      left = position.x - 620; // Show to the left instead
    }
    
    // Adjust if preview goes off screen vertically
    if (top + 400 > viewportHeight) {
      top = viewportHeight - 420;
    }
    
    // Ensure minimum margins
    top = Math.max(20, top);
    left = Math.max(20, left);
    
    return { top, left };
  };

  const calculatedPosition = getPosition();

  return (
    <div
      ref={previewRef}
      className="fixed z-[9999] bg-white rounded-lg shadow-2xl border-2 border-green-500 overflow-hidden animate-fadeIn"
      style={{
        top: `${calculatedPosition.top}px`,
        left: `${calculatedPosition.left}px`,
        width: '600px',
        maxHeight: '400px',
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <h3 className="font-semibold text-white text-sm">Preview: {templateName}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-green-100 transition-colors"
          title="Close preview"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Preview Content */}
      <div className="overflow-auto max-h-[340px] bg-gray-50">
        {templateData.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-green-100 sticky top-0">
              <tr>
                {templateData[0].map((header, index) => (
                  <th
                    key={index}
                    className="px-3 py-2 text-left text-xs font-semibold text-green-800 border-b-2 border-green-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {templateData.slice(1).map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`border-b border-gray-200 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50 transition-colors`}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-3 py-2 text-xs text-gray-700 border-r border-gray-100 last:border-r-0"
                    >
                      {cell || <span className="text-gray-400 italic">Empty</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center h-40 text-gray-400">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No preview data available</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-gray-100 px-4 py-2 border-t border-gray-200">
        <p className="text-xs text-gray-600 flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Click the template card to create a new spreadsheet with this structure
        </p>
      </div>
    </div>
  );
}
