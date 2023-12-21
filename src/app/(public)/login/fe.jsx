'use client';

import { useEffect } from 'react';
import { useSearchParams, redirect } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAuth } from '@/hooks/auth';
import LoginForm from '@/components/pages/auth/LoginForm.jsx';

export default function LoginClient() {
  const searchParams = useSearchParams();
  const [auth] = useAuth();

  useEffect(() => {
    if (auth) {
      const redirectPath = searchParams.get('redirect');
      redirect(redirectPath || '/my');
    }
  }, [auth, searchParams]);

  return (
    <Box maxWidth="320px" textAlign="center" mx="auto">
      <Typography variant="h1" mb={2}>
        Log In
      </Typography>
      <Typography variant="body1" color="text.light" mb={4}>
        Welcome back. Lorem ipsuem
      </Typography>

      <LoginForm />

      <Box mt={3}>
        <Typography
          component={Link}
          href="/forgot-password"
          variant="body2"
          className="link no-line"
        >
          Forgot password?
        </Typography>
      </Box>

      <Box mt={1}>
        <Typography component="span" variant="body2">
          Don&lsquo;t have an account?
        </Typography>
        <Typography
          variant="body2"
          component={Link}
          href="/signup"
          ml={1}
          className="link-main"
        >
          Sign up
        </Typography>
      </Box>
    </Box>
  );
}
