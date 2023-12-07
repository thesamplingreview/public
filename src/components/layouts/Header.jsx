'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useAuth } from '@/hooks/auth';

export default function Header() {
  const [auth] = useAuth();

  return (
    <Box
      component="header"
      height="3.75rem"
      bgcolor="#fff"
    >
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Box>
          <Link href="/">
            <span>LOGO</span>
          </Link>
        </Box>
        <Box flexGrow="1" px={3}>
          Nav
        </Box>
        <Box>
          {auth && (
            <>
              <Link href="/my">My Account</Link>
              <Link href="/logout">Logout</Link>
            </>
          )}
          {!auth && (
            <Link href="/login">Login</Link>
          )}
        </Box>
      </Container>
    </Box>
  );
}
