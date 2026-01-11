'use client';

import { useEffect, useContext } from 'react';
import { usePathname } from 'next/navigation';
import ToastContext from '@/contexts/ToastContext.jsx';

/**
 * Client component to handle toast messages from sessionStorage
 * Checks for stored toast messages and displays them on route changes
 */
export default function ToastHandler() {
  const { showToast } = useContext(ToastContext);
  const pathname = usePathname();

  useEffect(() => {
    // Check for stored toast message on every route change
    const storedToast = sessionStorage.getItem('toast_message');
    console.log('[ToastHandler] Checking for toast message:', storedToast, 'pathname:', pathname);
    if (storedToast) {
      try {
        const { message, severity } = JSON.parse(storedToast);
        console.log('[ToastHandler] Found toast message, showing:', message);
        // Show toast after a brief delay to ensure page is rendered
        const timer = setTimeout(() => {
          console.log('[ToastHandler] Calling showToast');
          showToast(message, severity || 'success');
          // Clear the stored message
          sessionStorage.removeItem('toast_message');
        }, 500);
        
        return () => clearTimeout(timer);
      } catch (err) {
        console.error('[ToastHandler] Error parsing toast message:', err);
        sessionStorage.removeItem('toast_message');
      }
    }
  }, [pathname, showToast]);

  return null;
}
