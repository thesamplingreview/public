'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Alert from '@mui/material/Alert';
import { useFetch } from '@/hooks/fetcher';
import { useAuth } from '@/hooks/auth';
import CInput from '@/components/CInput.jsx';
import CInputPhone from '@/components/CInputPhone.jsx';
import CIcon from '@/components/CIcon.jsx';
import CLoadingButton from '@/components/CLoadingButton.jsx';

function genInput(data) {
  return {
    name: data?.name || '',
    // contact: data?.contact || '',
  };
}

export default function ProfileForm() {
  const doFetch = useFetch();
  const [auth, setAuth] = useAuth();

  const [input, setInput] = useState(genInput(auth));
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAlert(null);
    setSaving(true);
    try {
      const { code, data } = await doFetch('/v1/auth/my', {
        method: 'PUT',
        data: input,
      });
      if (code !== 200) {
        throw new Error('Failed to update. Please try again later.');
      }
      setAlert({
        type: 'success',
        message: 'Profile updated.',
      });
      // update context cache
      setAuth({
        ...auth,
        name: data.name,
        // contact: data.contact,
      });
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message,
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
          <CInput
            name="email"
            value={auth.email}
            required
            disabled
            helperText={(
              <Box component="span" display="flex" alignItems="center">
                <CIcon name="question" mr={1} />
                Contact our support for changes
              </Box>
            )}
          />
        </Grid>
        <Grid xs={12} md={8} lg={6}>
          <CInput
            placeholder="Enter name"
            required
            name="name"
            value={input.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid xs={12} md={8} lg={6}>
          <CInputPhone
            placeholder="Enter contact"
            required
            name="contact"
            value={auth.contact}
            disabled
            // onChange={handleChange}
            helperText={(
              <Box component="span" display="flex" alignItems="center">
                <CIcon name="question" mr={1} />
                Contact our support for changes
              </Box>
            )}
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
