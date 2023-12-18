'use client';

import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useValidated, useLogin } from '@/hooks/auth';
import CInput from '@/components/CInput.jsx';
import CInputPassword from '@/components/CInputPassword.jsx';
import CLoadingButton from '@/components/CLoadingButton.jsx';

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
      console.log(err);
      setAlert({
        type: 'error',
        message: 'Invalid credential.',
      });
    }
    setLoading(false);
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
