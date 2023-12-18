'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Alert from '@mui/material/Alert';
import { useFetch } from '@/hooks/fetcher';
import CInputPassword from '@/components/CInputPassword.jsx';
import CLoadingButton from '@/components/CLoadingButton.jsx';

function genInput() {
  return {
    old_password: '',
    new_password: '',
    passwordConfirm: '',
  };
}

export default function PasswordForm() {
  const doFetch = useFetch();

  const [input, setInput] = useState(genInput());
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAlert(null);
    setSaving(true);
    try {
      // validation
      /* eslint-disable camelcase */
      const { new_password, passwordConfirm } = input;
      if (new_password !== passwordConfirm) {
        throw new Error('Password not matched.');
      }
      /* eslint-enable camelcase */

      const { code } = await doFetch('/v1/auth/my/password', {
        method: 'PUT',
        data: input,
      });
      if (code !== 200) {
        throw new Error('Failed to update. Please try again later.');
      }
      setAlert({
        type: 'success',
        message: 'Password changed.',
      });
      // reset input
      setInput(genInput());
    } catch (err) {
      let customMsg;
      if (err.response?.data?.code === 422) {
        customMsg = err.response.data.validator[0].msg;
      } else if (err.response?.data?.error) {
        customMsg = err.response.data.error;
      }
      setAlert({
        type: 'error',
        message: customMsg || err.message,
      });
    }
    setSaving(false);
  };

  const handleChange = (e) => {
    setInput((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Box
      component="form"
      bgcolor="#fff"
      borderRadius="1rem"
      p={{ md: 3, lg: 4 }}
      sx={{ boxShadow: '0 2px 4px rgba(0,0,0,.15)' }}
      onSubmit={handleSubmit}
    >
      <Grid
        container
        spacing={3}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {alert && (
          <Grid xs={12} md={8} lg={6}>
            <Alert severity={alert.type}>
              {alert.message}
            </Alert>
          </Grid>
        )}
        <Grid xs={12} md={8} lg={6}>
          <CInputPassword
            placeholder="Old password"
            required
            name="old_password"
            value={input.old_password}
            onChange={handleChange}
          />
        </Grid>
        <Grid xs={12} md={8} lg={6}>
          <CInputPassword
            placeholder="New password"
            required
            name="new_password"
            value={input.new_password}
            onChange={handleChange}
          />
        </Grid>
        <Grid xs={12} md={8} lg={6}>
          <CInputPassword
            placeholder="Re-enter password"
            required
            name="passwordConfirm"
            value={input.passwordConfirm}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Box textAlign="center" mt={4}>
        <CLoadingButton
          variant="contained"
          type="submit"
          loading={saving}
          sx={{ px: 4 }}
        >
          Save
        </CLoadingButton>
      </Box>
    </Box>
  );
}
