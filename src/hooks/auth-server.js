import { cookies } from 'next/headers';
// import { differenceInHours } from 'date-fns';
import { genRefreshRequest } from '@/helpers/request';
// import config from '@/config/app';

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

  const fetcher = async (url, options = {}) => {
    // eslint-disable-next-line no-console
    console.log('Fetch:', url);
    const requestInstance = genRefreshRequest({
      token,
      refreshToken,
      // updateTokenCb: (newToken) => {
      //   if (newToken) {
      //     try {
      //       cookies().set('access_token', newToken.token, {
      //         expires: Math.ceil(differenceInHours(new Date(newToken.expiry), new Date()) / 24),
      //       });
      //     } catch (err) {
      //       console.log(err);
      //     }
      //   }
      // },
    });
    const response = await requestInstance({
      url,
      ...options,
    });
    return response;
  };

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
    const result = await fetcher('/v1/auth/my');
    const { code, data } = result.data;
    if (code !== 200) {
      throw new Error('Invalid API');
    }
    return {
      token,
      refreshToken,
      auth: data,
      // eslint-disable-next-line no-underscore-dangle
      retryToken: result.config._retryToken, // force reset token on FE
    };
  } catch (err) {
    // error
    // console.log(err);
    return null;
  }
}
