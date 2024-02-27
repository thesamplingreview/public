import { useContext, useCallback } from 'react';
import request from '@/helpers/request';
import AuthContext from '@/contexts/AuthContext.jsx';

export function useValidated() {
  const { validated } = useContext(AuthContext);

  return validated;
}

export function useAuth() {
  const { user, setUser } = useContext(AuthContext);

  return [user, setUser];
}

export function useToken() {
  const { token, setToken } = useContext(AuthContext);

  return [token, setToken];
}

export function useRefreshToken() {
  const { refreshToken, setRefreshToken } = useContext(AuthContext);

  return [refreshToken, setRefreshToken];
}

/**
 * Perform login
 *
 * @param  {string}  provider
 * @return Void
 */
export function useLogin(provider = '') {
  const [, setToken] = useToken();
  const [, setRefresh] = useRefreshToken();
  const [, setUser] = useAuth();

  const doLogin = useCallback(async (input) => {
    try {
      let endpoint = '/v1/auth/login';
      if (provider === 'google') {
        endpoint = '/v1/auth/login/google';
      }

      const { data } = await request({
        url: endpoint,
        method: 'POST',
        data: input,
      });
      if (data.code !== 200) {
        throw new Error('Unable to login.');
      }
      const {
        jwt: { access, refresh },
        user,
      } = data.data;

      // set state
      setToken(access);
      setRefresh(refresh);
      setUser(user);
      // return
      return user;
    } catch (err) {
      const errCode = err.response?.data?.code || 500;
      if (!err.response || errCode === 500) {
        // eslint-disable-next-line no-console
        console.log(err);
        throw new Error('Something went wrong, please contact support');
      }
      throw new Error('Invalid authentication!');
    }
  }, [setToken, setRefresh, setUser, provider]);

  return doLogin;
}

/**
 * Perform logout
 *
 * @return Void
 */
export function useLogout() {
  const [, setToken] = useToken();
  const [, setRefresh] = useRefreshToken();
  const [, setUser] = useAuth();

  const doLogout = useCallback(() => {
    // set state
    setToken(null);
    setRefresh(null);
    setUser(null);

    return true;
  }, [setToken, setRefresh, setUser]);

  return doLogout;
}

/**
 * Perform signup
 *
 * @param  {string}  provider
 * @return Void
 */
export function useSignup(provider = '') {
  const doLogin = useLogin(provider);

  const doSignup = useCallback(async (input) => {
    try {
      let endpoint = '/v1/auth/signup';
      if (provider === 'google') {
        endpoint = '/v1/auth/signup/google';
      }

      const { data } = await request({
        url: endpoint,
        method: 'POST',
        data: input,
      });
      if (data.code !== 200) {
        throw new Error('Unable to signup.');
      }

      // auto-login
      const user = await doLogin({
        email: input.email,
        token: input.token,
        password: input.password,
      });

      return user;
    } catch (err) {
      const errCode = err.response?.data?.code || 500;
      if (errCode === 422) {
        const errMsg = err.response.data.validator?.[0]?.msg || err.response.data.error || 'Invalid authentication';
        throw new Error(errMsg);
      }
      if (!err.response || errCode === 500) {
        // eslint-disable-next-line no-console
        console.log(err);
        throw new Error('Something went wrong, please contact support');
      }
      throw new Error('Invalid authentication!');
    }
  }, [doLogin, provider]);

  return doSignup;
}
