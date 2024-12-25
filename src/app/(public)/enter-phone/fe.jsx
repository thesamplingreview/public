'use client';

import { useEffect } from 'react';
import { redirect, useSearchParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAuth, useValidated } from '@/hooks/auth';
import PhoneForm from '@/components/pages/auth/PhoneForm.jsx';

/**
 * Change request #20241224
 * - disable OTP verification flow
 * - but require phone number
 */
export default function PhoneFormClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isValidated = useValidated();
  const [auth, setAuth] = useAuth();

  const handleComplete = (newInput) => {
    setAuth({
      ...auth,
      ...newInput,
      // contact_verified_at: (new Date()).valueOf(),
    });
    const redirectPath = searchParams.get('redirect');
    router.push(redirectPath || '/');
  };

  const handleSkip = () => {
    const redirectPath = searchParams.get('redirect');
    router.push(redirectPath || '/');
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
    <>
      <Box textAlign="center" mx="auto">
        <Typography variant="h1" mb={2}>
          Enter Phone Number
        </Typography>
        <Typography variant="body1" color="text.light" mb={4}>
          Enter your phone number to proceed
        </Typography>
      </Box>

      <Box maxWidth="320px" textAlign="center" mx="auto">
        <PhoneForm onComplete={handleComplete} onSkip={handleSkip} />
      </Box>
    </>
  );
}
