'use server';

import { cookies } from 'next/headers';
import config from '@/config/app';

/**
 * Server-side only hooks
 */
// retrieve tokens directly from cookies
export async function useServerTokens() {
  return {
    token: cookies().get('access_token')?.value || '',
    refreshToken: cookies().get('refresh_token')?.value || '',
  };
}

// generate server request instance
export async function useServerFetch() {
  const { token, refreshToken } = await useServerTokens();

  // DEPRECATED: next don't allow to set cookies like this, hence need to find another workaround
  // const updateToken = (newToken) => {
  //   if (newToken) {
  //     cookies().set('access_token', 'asdasdad', {
  //       expires: Math.ceil(differenceInHours(new Date(newToken.expiry), new Date()) / 24),
  //     });
  //   }
  // };

  const genEndpoint = (url) => {
    return `${config.apiUrl}${url}`;
  };

  /* eslint-disable no-underscore-dangle, no-console */
  // changing server fetch to native fetch due to nextjs behavior
  const fetcher = async (url, options = {}) => {
    const endpoint = genEndpoint(url);
    console.log('Fetch: ', endpoint);
    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      const result = await response.json();
      if (!response.ok) {
        const error = new Error(response.statusText);
        error.response = result;
        throw error;
      }
      // console.log(result);
      // append retry token
      if (options._retryToken) {
        return { ...result, retryToken: options._retryToken };
      }
      return result;
    } catch (err) {
      if (err.response?.code === 401 && refreshToken && !options._retry) {
        const refreshEndpoint = genEndpoint('/v1/auth/token-refresh');
        console.log('Fetch: ', refreshEndpoint);
        const refreshResponse = await fetch(refreshEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            refresh_token: refreshToken,
          }),
        });
        const refreshResult = await refreshResponse.json();
        if (refreshResult.data?.jwt?.access) {
          const newToken = refreshResult.data.jwt.access;
          // move to FE update (refer to options._retryToken)
          // updateToken(newToken);

          const refetch = await fetcher(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newToken.token}`,
            },
            _retry: true,
            _retryToken: newToken, // letting FE handle set cookie
          });
          return refetch;
        }
      }
      throw err;
    }
  };
  /* eslint-enable no-underscore-dangle, no-console */

  return fetcher;
}

/**
 * Note: this hook will always check with server, hence usehook must be awaited
 */
// get auth data
export async function useServerAuth() {
  const fetcher = await useServerFetch();
  const { token, refreshToken } = await useServerTokens();
  if (!token && !refreshToken) {
    return null;
  }

  try {
    const { code, data, retryToken } = await fetcher('/v1/auth/my');
    if (code !== 200) {
      throw new Error('Invalid API');
    }
    return {
      token,
      refreshToken,
      auth: data,
      retryToken,
    };
  } catch (err) {
    // error
  }
  return null;
}
