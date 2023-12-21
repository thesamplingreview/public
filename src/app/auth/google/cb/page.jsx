'use client';

import { useOnce } from '@/hooks/ui';
import CLoader from '@/components/CLoader.jsx';

export default function GoogleAuthCb() {
  useOnce(() => {
    const hash = window.location.hash.substring(1);
    const searchParams = new URLSearchParams(hash);
    const token = searchParams.get('access_token');
    if (window.opener) {
      window.opener.postMessage(token, '*');
      window.close();
    }
  }, []);

  return <CLoader full />;
}
