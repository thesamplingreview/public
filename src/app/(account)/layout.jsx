'use client';

import { useEffect } from 'react';
import Box from '@mui/material/Box';
import { useValidated, useAuth } from '@/hooks/auth';
import CLoader from '@/components/CLoader.jsx';
import Header from '@/components/layouts/Header.jsx';
import IconPreloader from '@/components/layouts/IconPreloader.jsx';

export default function Layout({ children }) {
  const [auth] = useAuth();
  const isValidated = useValidated();

  useEffect(() => {
    if (isValidated && !auth) {
      console.log('no auth... redirecting...');
    }
  }, [auth, isValidated]);

  if (!isValidated || !auth) {
    return <CLoader full />;
  }
  return (
    <>
      <Header />
      <Box
        component="main"
        minHeight="calc(100vh - 3.75rem)"
      >
        {children}
      </Box>
      <IconPreloader />
    </>
  );
}
