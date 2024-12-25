'use client';

import { useEffect } from 'react';
import { usePathname, redirect } from 'next/navigation';
import { useValidated, useAuth } from '@/hooks/auth';
import CLoader from '@/components/CLoader.jsx';
import IconPreloader from '@/components/layouts/IconPreloader.jsx';

export default function Layout({ children }) {
  const [auth] = useAuth();
  const validated = useValidated();
  const pathname = usePathname();

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
