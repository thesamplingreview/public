'use client';

import { createContext, useState, useCallback } from 'react';
import Cookie from 'js-cookie';
import { differenceInHours } from 'date-fns';
// import { genRefreshRequest } from '@/helpers/request';
import { useOnce } from '@/hooks/ui';

// using cookies
const initialState = {
  validated: false,
  token: Cookie.get('access_token') || '',
  refreshToken: Cookie.get('refresh_token') || '',
  user: null,
};

const AuthContext = createContext(initialState);

const cachedUserData = (data) => {
  if (!data) {
    return null;
  }
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    contact: data.contact,
    emailVerified: !!data.email_verified_at,
    contactVerified: !!data.contact_verified_at,
  };
};

export const AuthProvider = ({
  initData,
  children,
}) => {
  const [validated, setValidated] = useState(initialState.validating);
  const [token, setToken] = useState(initData.token);
  const [refreshToken, setRefreshToken] = useState(initData.refreshToken);
  const [user, setUser] = useState(cachedUserData(initData.auth));

  // additional layer for state update
  const setTokenHook = useCallback((newToken) => {
    if (!newToken) {
      setToken('');
      Cookie.remove('access_token');
    } else if (typeof newToken === 'object') {
      setToken(newToken.token);
      // sync with cookie
      Cookie.set('access_token', newToken.token, {
        expires: Math.ceil(differenceInHours(new Date(newToken.expiry), new Date()) / 24),
      });
    } else {
      setToken(newToken);
    }
  }, [setToken]);

  const setRefreshHook = useCallback((newToken) => {
    if (!newToken) {
      setRefreshToken('');
      Cookie.remove('refresh_token');
    } else if (typeof newToken === 'object') {
      setRefreshToken(newToken.token);
      // sync with cookie
      Cookie.set('refresh_token', newToken.token, {
        expires: Math.ceil(differenceInHours(new Date(newToken.expiry), new Date()) / 24),
      });
    } else {
      setRefreshToken(newToken);
    }
  }, [setRefreshToken]);

  const setUserHook = useCallback((data) => {
    if (data) {
      setUser(cachedUserData(data));
    } else {
      setUser(null);
    }
  }, [setUser]);

  useOnce(() => {
    if (initData.retryToken) {
      setTokenHook(initData.retryToken);
    }
    setValidated(true);
  });
  // auth check (migrated to server-side)
  // useOnce(async () => {
  //   if (user) {
  //     setValidated(true);
  //     return;
  //   }

  //   // perform server check
  //   if (token || refreshToken) {
  //     try {
  //       const requestInstance = genRefreshRequest({
  //         token,
  //         refreshToken,
  //         updateTokenCb: setTokenHook,
  //       });
  //       const result = await requestInstance({
  //         url: '/v1/auth/my',
  //       });
  //       const { code, data } = result.data;
  //       if (code !== 200) {
  //         throw new Error('Invalid API');
  //       }
  //       setUserHook(data);
  //     } catch (err) {
  //       setTokenHook('');
  //       setRefreshHook('');
  //       setUserHook(null);
  //     }
  //   }
  //   setValidated(true);
  // });

  return (
    <AuthContext.Provider value={{
      validated,
      token,
      setToken: setTokenHook,
      refreshToken,
      setRefreshToken: setRefreshHook,
      user,
      setUser: setUserHook,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
