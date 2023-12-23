'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAuth } from '@/hooks/auth';
import SignupForm from '@/components/pages/auth/SignupForm.jsx';

export default function SignupClient() {
  const [auth] = useAuth();

  useEffect(() => {
    if (auth) {
      if (!auth.contactVerified) {
        redirect('/verify-phone');
      } else {
        redirect('/my');
      }
    }
  }, [auth]);

  return (
    <Box maxWidth="320px" textAlign="center" mx="auto">
      <Typography variant="h1" mb={2}>
        Sign Up
      </Typography>
      <Typography variant="body1" color="text.light" mb={4}>
        Lorem ipsuem
      </Typography>

      <SignupForm />

      <Box mt={3}>
        <Typography component="span" variant="body2">
          Already have an account?
        </Typography>
        <Typography
          variant="body2"
          component={Link}
          href="/login"
          ml={1}
          className="link-main"
        >
          Log in
        </Typography>
      </Box>
    </Box>
  );
}
