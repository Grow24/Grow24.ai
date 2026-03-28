import React, { useEffect } from 'react';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  useEffect(() => {
    // Add focus-visible polyfill styles
    const style = document.createElement('style');
    style.textContent = `
      .focus-visible:focus {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }
      
      .focus-visible:focus:not(.focus-visible) {
        outline: none;
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .border-gray-200 {
          border-color: #000000;
        }
        .text-gray-600 {
          color: #000000;
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
      
      /* Screen reader only text */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `;
    document.head.appendChild(style);
    
    // Add keyboard navigation support
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip if user is typing in an input
      const activeElement = document.activeElement;
      if (activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.contentEditable === 'true'
      )) {
        return;
      }
      
      // Add global keyboard shortcuts
      if (event.key === 'Tab') {
        // Ensure tab navigation works properly
        document.body.classList.add('keyboard-navigation');
      }
    };
    
    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-navigation');
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    
    // Set initial ARIA attributes
    document.body.setAttribute('role', 'application');
    document.body.setAttribute('aria-label', 'Flow Builder Application');
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      document.head.removeChild(style);
    };
  }, []);
  
  return <>{children}</>;
};