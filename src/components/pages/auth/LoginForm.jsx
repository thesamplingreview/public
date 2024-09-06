'use client';

import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Alert from '@mui/material/Alert';
import { useValidated, useLogin } from '@/hooks/auth';
import CInput from '@/components/CInput.jsx';
import CInputPassword from '@/components/CInputPassword.jsx';
import CLoadingButton from '@/components/CLoadingButton.jsx';
import GoogleAuthBtn from './GoogleAuthBtn.jsx';

function genDefaultInput() {
  return {
    email: '',
    password: '',
  };
}

export default function LoginForm({ onComplete, ...props }) {
  const isValidated = useValidated();
  const doLogin = useLogin();

  const [input, setInput] = useState(genDefaultInput());
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = useCallback((e) => {
    setInput((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAlert(null);
    setLoading(true);
    try {
      const result = await doLogin(input);
      // callback
      if (onComplete) {
        onComplete(result);
      }
    } catch (err) {
      // console.log(err);
      setAlert({
        type: 'error',
        message: 'Invalid credential.',
      });
    }
    setLoading(false);
  };

  const handleGoogleLogin = async (auth) => {
    setAlert(null);
    // callback
    if (onComplete) {
      onComplete(auth);
    }
  };

  const handleGoogleError = (errMessage) => {
    setAlert({
      type: 'error',
      message: errMessage,
    });
  };

  return (
    <Box
      {...props}
      component="form"
      maxWidth="100%"
      width="28rem"
      mx="auto"
      onSubmit={handleSubmit}
    >
      {alert && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}
      <Box>
        <GoogleAuthBtn
          text="Continue with Google"
          disabled={loading}
          onAuth={handleGoogleLogin}
          onError={handleGoogleError}
        />
      </Box>

      <Grid container alignItems="center" my={3}>
        <Grid xs>
          <Box borderBottom="1px solid var(--border-500)" height="1px" />
        </Grid>
        <Grid xs="auto" px={1.5}>
          <Box
            fontSize="0.875rem"
            lineHeight="1"
            color="text.light"
          >
            or
          </Box>
        </Grid>
        <Grid xs>
          <Box borderBottom="1px solid var(--border-500)" height="1px" />
        </Grid>
      </Grid>

      <Box>
        <CInput
          type="email"
          name="email"
          placeholder="Login Email"
          required
          onChange={handleChange}
        />
      </Box>
      <Box mt={2}>
        <CInputPassword
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
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
