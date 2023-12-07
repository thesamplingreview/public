import { useCallback } from 'react';
import { genRefreshRequest } from '@/helpers/request';
import { useToken, useRefreshToken } from './auth';

/**
 * Fetcher with token and auto-refresh
 *
 * @return Promise
 */
export function useFetch() {
  const [token, setToken] = useToken();
  const [refresh] = useRefreshToken();

  const fetch = useCallback(async (
    url,
    options = null,
  ) => {
    const requestInstance = genRefreshRequest({
      token,
      refreshToken: refresh,
      updateTokenCb: setToken,
    });
    const response = await requestInstance({
      url,
      ...options,
    });

    return response?.data || null;
  }, [token, setToken, refresh]);

  return fetch;
}
