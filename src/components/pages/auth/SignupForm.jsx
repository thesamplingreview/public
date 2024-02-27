'use client';

import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { useValidated, useSignup } from '@/hooks/auth';
import CInput from '@/components/CInput.jsx';
import CInputPassword from '@/components/CInputPassword.jsx';
import CButton from '@/components/CButton.jsx';
import CLoadingButton from '@/components/CLoadingButton.jsx';
import GoogleAuthBtn from './GoogleAuthBtn.jsx';

function genDefaultInput() {
  return {
    email: '',
    name: '',
    password: '',
  };
}

export default function SignupForm({ onComplete, ...props }) {
  const isValidated = useValidated();
  const doSignup = useSignup();
  const doGoogleSignup = useSignup('google');

  const [view, setView] = useState('index');
  const [input, setInput] = useState(genDefaultInput());
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleUseEmail = () => {
    setAlert(null);
    setView('form');
  };

  const handleReset = () => {
    setAlert(null);
    setInput(genDefaultInput());
    setView('index');
  };

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
      const result = await doSignup(input);
      // callback
      onComplete(result);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || 'Failed to signup.',
      });
    }
    setLoading(false);
  };

  const handleUseGoogle = async (profile) => {
    const formData = {
      email: profile.email,
      name: profile.name || '',
      token: profile.accessToken,
      google_user_id: profile.id,
    };
    setAlert(null);
    setLoading(true);
    try {
      const result = await doGoogleSignup(formData);
      // callback
      onComplete(result);
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message,
      });
    }
    setLoading(false);
  };

  return (
    <Box
      {...props}
      maxWidth="100%"
      width="28rem"
      mx="auto"
    >
      {alert && (
        <Alert severity={alert.type} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {/* view #index */}
      {view === 'index' && (
        <>
          <Box>
            <GoogleAuthBtn
              text="Sign up with Google"
              disabled={loading || !isValidated}
              onAuth={handleUseGoogle}
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
            <CButton
              variant="contained"
              fullWidth
              disabled={loading || !isValidated}
              onClick={handleUseEmail}
            >
              Sign up with Email
            </CButton>
          </Box>
        </>
      )}

      {/* view #form */}
      {view === 'form' && (
        <SignupEmailForm
          input={input}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleReset}
        />
      )}
    </Box>
  );
}

function SignupEmailForm({
  input,
  loading,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <Box component="form" onSubmit={onSubmit}>
      <Box>
        <CInput
          name="name"
          placeholder="Your Name"
          required
          value={input.name}
          onChange={onChange}
        />
      </Box>
      <Box mt={2}>
        <CInput
          type="email"
          name="email"
          placeholder="Login Email"
          required
          value={input.email}
          onChange={onChange}
        />
      </Box>
      <Box mt={2}>
        <CInputPassword
          name="password"
          placeholder="Password"
          required
          value={input.password}
          onChange={onChange}
        />
      </Box>
      <Box mt={3}>
        <CLoadingButton
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          loading={loading}
        >
          Sign Up
        </CLoadingButton>
      </Box>
      <Box mt={2}>
        <Typography
          component="span"
          fontSize="0.85em"
          color="text.light"
          className="link no-line clickable"
          onClick={onCancel}
        >
          Cancel
        </Typography>
      </Box>
    </Box>
  );
}
