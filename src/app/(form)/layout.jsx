'use client';

import { useEffect, useContext } from 'react';
import { usePathname, redirect, useSearchParams, useRouter } from 'next/navigation';
import { useValidated, useAuth } from '@/hooks/auth';
import ToastContext from '@/contexts/ToastContext.jsx';
import CLoader from '@/components/CLoader.jsx';
import IconPreloader from '@/components/layouts/IconPreloader.jsx';

export default function Layout({ children }) {
  const [auth] = useAuth();
  const validated = useValidated();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useContext(ToastContext);

  // Check for stored toast message in sessionStorage
  useEffect(() => {
    const storedToast = sessionStorage.getItem('toast_message');
    if (storedToast) {
      try {
        const { message, severity } = JSON.parse(storedToast);
        setTimeout(() => {
          showToast(message, severity);
          sessionStorage.removeItem('toast_message');
        }, 300);
      } catch (err) {
        sessionStorage.removeItem('toast_message');
      }
    }
  }, [showToast]);

  useEffect(() => {
    if (validated) {
      /**
       * Change request #20241224
       * - disable OTP verification flow
       * - but require phone number
       */
      if (!auth) {
        redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
      // } else if (!auth.contactVerified) {
      //   redirect(`/verify-phone?redirect=${encodeURIComponent(pathname)}`);
      } else if (!auth.contact) {
        redirect(`/enter-phone?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [auth, validated, pathname]);

  if (!validated || !auth) {
    return <CLoader full />;
  }
  return (
    <>
      {children}
      <IconPreloader />
    </>
  );
}
