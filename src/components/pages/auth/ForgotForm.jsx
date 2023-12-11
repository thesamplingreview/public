'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CInput from '@/components/CInput.jsx';
import CLoadingButton from '@/components/CLoadingButton.jsx';

function genDefaultInput() {
  return {
    email: '',
  };
}

export default function ForgotForm({ ...props }) {
  const [input, setInput] = useState(genDefaultInput());
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAlert(null);
    setLoading(true);
    try {
      await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      setInput(genDefaultInput());
      setAlert({
        type: 'success',
        message: 'Password reset has been sent.',
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      setAlert({
        type: 'error',
        message: 'Invalid email or email not found.',
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
          value={input.email}
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
          loading={loading}
        >
          Generate Reset Email
        </CLoadingButton>
      </Box>
    </Box>
  );
}
