'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useFetch } from '@/hooks/fetcher';
import { useValidated } from '@/hooks/auth';
import CInputPhone from '@/components/CInputPhone.jsx';
import CButton from '@/components/CButton.jsx';
import CLoadingButton from '@/components/CLoadingButton.jsx';

function genDefaultInput() {
  return {
    contact: '',
  };
}

/**
 * Change request #20241224
 * - disable OTP verification flow
 * - but require phone number
 */
export default function PhoneForm({ onComplete, onSkip, ...props }) {
  const searchParams = useSearchParams();
  const doFetch = useFetch();
  const isValidated = useValidated();

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
      const { code } = await doFetch('/v1/auth/my/contact', {
        method: 'PUT',
        data: input,
      });
      if (code !== 200) {
        throw new Error('Failed to update contact.');
      }
      // callback
      onComplete(input);
    } catch (err) {
      let errMsg;
      if (err?.response?.data?.code === 422) {
        errMsg = err.response.data.validator?.[0]?.msg || err.response.data.error;
      }
      setAlert({
        type: 'error',
        message: errMsg || err.message,
      });
    }
    setLoading(false);
  };

  const handleSkip = () => {
    onSkip();
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
        <CInputPhone
          name="contact"
          placeholder="Phone Number"
          required
          value={input.contact}
          onChange={handleChange}
        />
      </Box>
      <Box mt={3}>
        <CLoadingButton
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!isValidated || !input.contact}
          loading={loading}
        >
          Update
        </CLoadingButton>
      </Box>

      {searchParams.get('skip') === 'true' && (
        <Box mt={1}>
          <CButton
            color="text"
            fullWidth
            sx={[
              (theme) => ({
                fontSize: '0.875rem',
                color: theme.palette.text.light,
              }),
            ]}
            onClick={handleSkip}
          >
            Skip for now
          </CButton>
        </Box>
      )}
    </Box>
  );
}
