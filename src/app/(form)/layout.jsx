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
    if (validated && !auth) {
      redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
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
