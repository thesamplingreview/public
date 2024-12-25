'use client';

import { useEffect } from 'react';
import { useSearchParams, redirect } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAuth } from '@/hooks/auth';
import SignupForm from '@/components/pages/auth/SignupForm.jsx';

export default function SignupClient() {
  const searchParams = useSearchParams();
  const [auth] = useAuth();

  useEffect(() => {
    if (auth) {
      /**
       * Change request #20241224
       * - disable OTP verification flow
       * - but require phone number
       */
      if (!auth.contact) {
        redirect('/enter-phone?skip=true');
      // }
      // if (!auth.contactVerified) {
        // redirect('/verify-phone?skip=true');
      } else {
        const redirectPath = searchParams.get('redirect');
        redirect(redirectPath || '/');
      }
    }
  }, [auth, searchParams]);

  return (
    <Box maxWidth="320px" textAlign="center" mx="auto">
      <Typography variant="h1" mb={2}>
        Sign Up
      </Typography>
      <Typography variant="body1" color="text.light" mb={4}>
        Create your account and join our sampling programs for free.
      </Typography>

      <SignupForm />

      <Box mt={3}>
        <Typography component="span" variant="body2">
          Already have an account?
        </Typography>
        <Typography
          variant="body2"
          component={Link}
          href={`/login?${searchParams.toString()}`}
          ml={1}
          className="link-main"
        >
          Log in
        </Typography>
      </Box>
    </Box>
  );
}
