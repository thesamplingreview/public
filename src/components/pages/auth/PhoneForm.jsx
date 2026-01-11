'use client';

import {
  useRef, useState, useMemo, useCallback, useEffect,
} from 'react';
import { useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { useFetch } from '@/hooks/fetcher';
import { useValidated } from '@/hooks/auth';
import CInput from '@/components/CInput.jsx';
import CInputPhone from '@/components/CInputPhone.jsx';
import CButton from '@/components/CButton.jsx';
import CLoadingButton from '@/components/CLoadingButton.jsx';

function genDefaultInput() {
  return {
    contact: '',
    code: '',
  };
}

/**
 * Phone form with OTP verification using Evolution API
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
      // Success - callback immediately (toast will show after navigation)
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
      <Box mt={2}>
        <CodeInput
          name="code"
          value={input.code}
          contactNumber={input.contact}
          onChange={handleChange}
        />
      </Box>
      <Box mt={3}>
        <CLoadingButton
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!isValidated || !input.contact || !input.code}
          loading={loading}
        >
          Verify & Update
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

function CodeInput({
  name, value, contactNumber, onChange,
}) {
  const doFetch = useFetch();

  const [loading, setLoading] = useState(false);
  const [otpType, setOtpType] = useState('');
  const [notice, setNotice] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const clickable = useMemo(() => {
    return !loading && cooldown <= 0 && contactNumber.length > 6;
  }, [loading, cooldown, contactNumber]);

  const requestOtpWa = async () => {
    setLoading(true);
    setNotice('');
    setOtpType('');
    try {
      const { code } = await doFetch('/v1/auth/verify/contact/otp-wa', {
        method: 'POST',
        data: { contact: contactNumber },
      });
      if (code !== 200) {
        throw new Error('Unable to send OTP. Please try again later.');
      }
      setOtpType('wa');
      setCooldown(60);
    } catch (err) {
      setNotice(err.message);
    }
    setLoading(false);
  };

  const handleClickWa = () => {
    if (cooldown <= 0) {
      requestOtpWa();
    }
  };

  const timer = useRef(null);
  useEffect(() => {
    if (cooldown > 0) {
      timer.current = setTimeout(() => {
        setCooldown((oldState) => (oldState - 1));
      }, 1000);
    }

    return () => clearTimeout(timer.current);
  }, [cooldown]);

  return (
    <Grid container spacing={1}>
      <Grid xs={7}>
        <CInput
          name={name}
          placeholder="Enter OTP code"
          required
          value={value}
          onChange={onChange}
        />
      </Grid>
      <Grid xs={5}>
        <CButton
          variant="outlined"
          color="primary"
          fullWidth
          sx={{
            fontSize: '0.875em',
            height: '100%',
            px: 1,
          }}
          disabled={!clickable}
          onClick={handleClickWa}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Get OTP'}
        </CButton>
      </Grid>
      {notice && (
        <Grid xs={12}>
          <Typography variant="body2" fontSize="0.75em" color="error">
            {notice}
          </Typography>
        </Grid>
      )}
      {otpType === 'wa' && (
        <Grid xs={12}>
          <Typography component="span" variant="body2" fontSize="0.75em" color="text.light">
            OTP sent to your WhatsApp Number
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}

