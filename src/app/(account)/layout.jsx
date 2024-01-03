'use client';

import { useEffect } from 'react';
import { usePathname, redirect } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useValidated, useAuth } from '@/hooks/auth';
import CLoader from '@/components/CLoader.jsx';
import Header from '@/components/layouts/Header.jsx';
import Footer from '@/components/layouts/Footer.jsx';
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
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box
        component="main"
        flexGrow="1"
        py={{ xs: 2, md: 5, lg: 7 }}
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f6f7ff 100%)',
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
      <Footer />
      <IconPreloader />
    </Box>
  );
}
