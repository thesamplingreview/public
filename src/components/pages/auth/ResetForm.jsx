'use client';

import { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import request from '@/helpers/request';
import CInputPassword from '@/components/CInputPassword.jsx';
import CLoadingButton from '@/components/CLoadingButton.jsx';

function genDefaultInput() {
  return {
    password: '',
    passwordConfirm: '',
  };
}

export default function ResetForm({ ...props }) {
  const params = useParams();
  const searchParams = useSearchParams();

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

    // validation
    if (input.password !== input.passwordConfirm) {
      setAlert({
        type: 'error',
        message: 'Password not match.',
      });
      return;
    }

    setAlert(null);
    setLoading(true);
    try {
      const formdata = {
        password: input.password,
        token: params.token,
        email: searchParams.get('email'),
      };
      await request('/v1/auth/password/reset', {
        method: 'POST',
        data: formdata,
      });
      setInput(genDefaultInput());
      setAlert({
        type: 'success',
        message: 'Password has successfully reset.',
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Invalid token or token expired.',
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
        <CInputPassword
          name="password"
          placeholder="New password"
          required
          value={input.password}
          onChange={handleChange}
        />
      </Box>
      <Box mt={2}>
        <CInputPassword
          name="passwordConfirm"
          placeholder="Re-enter password"
          required
          value={input.passwordConfirm}
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
          Reset Password
        </CLoadingButton>
      </Box>
    </Box>
  );
}
