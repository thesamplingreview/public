'use client';

import { useEffect } from 'react';
import { redirect, useSearchParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAuth, useValidated } from '@/hooks/auth';
import PhoneVerificationForm from '@/components/pages/auth/PhoneVerificationForm.jsx';

export default function PhoneVerificationClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isValidated = useValidated();
  const [auth, setAuth] = useAuth();

  const handleComplete = () => {
    setAuth({
      ...auth,
      contact_verified_at: (new Date()).valueOf(),
    });
    const redirectPath = searchParams.get('redirect');
    router.push(redirectPath || '/my');
  };

  const handleSkip = () => {
    const redirectPath = searchParams.get('redirect');
    router.push(redirectPath || '/my');
  };

  useEffect(() => {
    if (isValidated) {
      if (!auth) {
        redirect('/login');
      }
      // else if (auth.contactVerified) {
      //   redirect('/my');
      // }
    }
  }, [isValidated, auth]);

  return (
    <Box maxWidth="320px" textAlign="center" mx="auto">
      <Typography variant="h1" mb={2}>
        Phone Verification
      </Typography>
      <Typography variant="body1" color="text.light" mb={4}>
        Enter and verify your phone number
      </Typography>

      <PhoneVerificationForm onComplete={handleComplete} onSkip={handleSkip} />
    </Box>
  );
}
