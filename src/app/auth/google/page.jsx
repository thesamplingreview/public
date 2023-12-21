'use client';

import config from '@/config/app';
import googleConfig from '@/config/google';
import { useOnce } from '@/hooks/ui';
import CLoader from '@/components/CLoader.jsx';

export default function GoogleAuth() {
  useOnce(() => {
    const params = new URLSearchParams({
      client_id: googleConfig.clientId,
      scope: 'profile email',
      redirect_uri: `${config.url}/auth/google/cb`,
      response_type: 'token',
    });
    window.location.href = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
  });

  return <CLoader full />;
}
