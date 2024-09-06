'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import config from '@/config/app';
import { useUpdated } from '@/hooks/ui';
import { useGoogleAuth } from '@/hooks/auth';
import CLoadingButton from '@/components/CLoadingButton.jsx';

export default function GoogleAuthBtn({
  text, disabled, onAuth, onError,
}) {
  const doGoogleAuth = useGoogleAuth();

  const [token, setToken] = useState('');
  const [opening, setOpening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const closeCheckTimer = useRef(null);
  const openPopup = () => {
    const popup = window.open(`${config.url}/auth/google`, 'auth', 'width=480,height=580');
    if (!popup) {
      setError(new Error('Please allow popup'));
      return;
    }

    setOpening(true);
    setToken('');
    setError(null);
    // internal check for closing
    closeCheckTimer.current = setInterval(() => {
      if (popup.closed) {
        clearInterval(closeCheckTimer.current);
        setOpening(false);
      }
    }, 1000);
  };

  const fetchMe = async (accessToken) => {
    if (!accessToken) {
      return;
    }

    setLoading(true);
    try {
      // tokeninfo API are unable to use, it need id_token instead of access_token?
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
      // const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${accessToken}`);
      const result = await response.json();
      if (!result?.sub) {
        throw new Error('Unable to connect with Google');
      }

      // do server action
      const auth = await doGoogleAuth({
        email: result.email,
        token: accessToken,
      });

      if (onAuth) {
        onAuth(auth);
      }
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  const handleSignIn = () => {
    openPopup();
  };

  const handleCallback = (e) => {
    if (e.data) {
      setToken(e.data);
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleCallback);
    return () => {
      clearInterval(closeCheckTimer.current);
      window.removeEventListener('message', handleCallback);
    };
  }, []);

  useUpdated(() => {
    if (token) {
      fetchMe(token);
    }
  }, [token]);

  useUpdated(() => {
    if (error) {
      onError(error.message);
    }
  }, [error]);

  return (
    <>
      <CLoadingButton
        variant="outlined"
        fullWidth
        rounded
        loading={loading}
        disabled={disabled || opening}
        sx={{
          color: 'var(--color-500)',
          borderColor: 'var(--color-300)',
        }}
        onClick={handleSignIn}
      >
        <Image
          src="/images/ic-google.svg"
          alt="Google"
          width="24"
          height="24"
        />
        <Box component="span" ml={2}>
          {text}
        </Box>
      </CLoadingButton>
    </>
  );
}
