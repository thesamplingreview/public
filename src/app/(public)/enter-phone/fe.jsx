'use client';

import { useEffect, useContext } from 'react';
import { redirect, useSearchParams, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useAuth, useValidated } from '@/hooks/auth';
import ToastContext from '@/contexts/ToastContext.jsx';
import PhoneForm from '@/components/pages/auth/PhoneForm.jsx';
import appConfig from '@/config/app';

/**
 * Phone number entry with OTP verification via Evolution API
 */
export default function PhoneFormClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isValidated = useValidated();
  const [auth, setAuth] = useAuth();
  const { showToast } = useContext(ToastContext);

  const handleComplete = (newInput) => {
    setAuth({
      ...auth,
      ...newInput,
      ...(appConfig.phoneOtpRequired && { contact_verified_at: (new Date()).valueOf() }),
    });
    const redirectPath = searchParams.get('redirect') || '/';
    
    // Show toast immediately, then navigate
    showToast(appConfig.phoneOtpRequired ? 'Phone number verified successfully!' : 'Phone number saved.', 'success');
    
    // Navigate after a short delay to allow toast to appear
    setTimeout(() => {
      router.push(redirectPath);
    }, 100);
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
          {appConfig.phoneOtpRequired ? 'Verify Phone Number' : 'Phone Number'}
        </Typography>
        <Typography variant="body1" color="text.light" mb={4}>
          {appConfig.phoneOtpRequired ? 'Enter your phone number and verify with OTP code' : 'Enter your phone number'}
        </Typography>
      </Box>

      <Box maxWidth="320px" textAlign="center" mx="auto">
        <PhoneForm onComplete={handleComplete} onSkip={handleSkip} />
      </Box>
    </>
  );
}
