'use client';

import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Box from '@mui/material/Box';
import { useValidated, useAuth, useLogin } from '@/hooks/auth';
import { getFormData } from '@/helpers/utils';
import CInput from '@/components/CInput.jsx';
import CInputPassword from '@/components/CInputPassword.jsx';
import CLoadingButton from '@/components/CLoadingButton.jsx';

export default function LoginForm() {
  const isValidated = useValidated();
  const [auth] = useAuth();
  const doLogin = useLogin();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const input = getFormData(e.target);

    setError(null);
    setLoading(true);
    try {
      await doLogin(input);
      redirect('/my');
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isValidated && auth) {
      redirect('/my');
    }
  }, [isValidated, auth]);

  return (
    <Box
      component="form"
      maxWidth="100%"
      width="28rem"
      mx="auto"
      onSubmit={handleSubmit}
    >
      <Box mt={4}>
        <CInput
          type="email"
          name="email"
          placeholder="Login Email"
          required
        />
      </Box>
      <Box mt={2}>
        <CInputPassword
          name="password"
          placeholder="Password"
          required
        />
      </Box>
      <Box mt={3} mb={3}>
        <CLoadingButton
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          rounded
          disabled={!isValidated}
          loading={loading}
        >
          Login
        </CLoadingButton>
      </Box>
    </Box>
  );
}
