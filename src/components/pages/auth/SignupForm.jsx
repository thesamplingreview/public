'use client';

import { useState, useMemo, useCallback } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useValidated, useSignup } from '@/hooks/auth';
import CInput from '@/components/CInput.jsx';
import CInputPhone from '@/components/CInputPhone.jsx';
import CInputPassword from '@/components/CInputPassword.jsx';
import CLoadingButton from '@/components/CLoadingButton.jsx';

function genDefaultInput() {
  return {
    email: '',
    name: '',
    password: '',
    contact: '',
  };
}

export default function SignupForm({ onComplete, ...props }) {
  const isValidated = useValidated();
  const doSignup = useSignup();

  const [input, setInput] = useState(genDefaultInput());
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const isSubmitable = useMemo(() => {
    const {
      name, email, password, contact,
    } = input;

    return (
      name && email && password && contact
    );
  }, [input]);

  const handleChange = useCallback((e) => {
    setInput((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!isSubmitable) {
      setAlert({
        type: 'error',
        message: 'Incomplete data',
      });
      return;
    }

    setAlert(null);
    setLoading(true);
    try {
      const result = await doSignup(input);
      // callback
      onComplete(result);
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Failed to signup.',
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
          name="name"
          placeholder="Your Name"
          required
          onChange={handleChange}
        />
      </Box>
      <Box mt={2}>
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
      <Box mt={2}>
        <CInputPhone
          name="contact"
          placeholder="Contact Number"
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
          Sign Up
        </CLoadingButton>
      </Box>
    </Box>
  );
}
