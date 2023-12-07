import Qs from 'qs';
import axios from 'axios';
import config from '@/config/app';

const instance = axios.create({
  baseURL: config.apiUrl,
  paramsSerializer: (params) => (Qs.stringify(params, { arrayFormat: 'indices' })),
});

export default instance;

/**
 * Refresh request
 */
export async function postRefreshToken(refreshToken) {
  const { data: refreshData } = await instance({
    url: '/v1/auth/token-refresh',
    method: 'POST',
    data: { refresh_token: refreshToken },
  });
  return refreshData.data?.jwt?.access;
}

/**
 * Generate request instance with referesh token
 *
 * @return Axios instance
 */
export function genRefreshRequest({
  token,
  refreshToken = '',
  updateTokenCb = null,
}) {
  const newInstance = instance.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // response interceptor - retry with refresh token
  newInstance.interceptors.response.use((resp) => {
    return resp;
  }, async (err) => {
    const originalRequest = err.config;
    /* eslint-disable no-underscore-dangle */
    if (err.response?.data?.code === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true;
      const newToken = await postRefreshToken(refreshToken);
      if (!newToken) {
        return Promise.reject(err);
      }

      // reset token
      originalRequest.headers.Authorization = `Bearer ${newToken.token}`;
      originalRequest._retryToken = newToken;

      // callback
      if (updateTokenCb) {
        updateTokenCb(newToken);
      }

      return newInstance(originalRequest);
    }
    /* eslint-enable no-underscore-dangle */
    return Promise.reject(err);
  });

  return newInstance;
}
