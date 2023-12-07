'use client';

import { redirect } from 'next/navigation';
import { useOnce } from '@/hooks/ui';
import { useLogout } from '@/hooks/auth';
import CLoader from '@/components/CLoader.jsx';

export default function LogoutForm() {
  const doLogout = useLogout();

  useOnce(() => {
    doLogout();
    redirect('/');
  });

  return (
    <CLoader full="header" />
  );
}
