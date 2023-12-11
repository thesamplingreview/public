'use client';

import { useRef } from 'react';
import { useOnce } from '@/hooks/ui';

export default function IconPreloader() {
  const $el = useRef(null);

  useOnce(() => {
    const ver = '1.0';
    fetch(`/sprite.svg?v=${ver}`)
      .then((resp) => resp.text())
      .then((resp) => {
        $el.current.innerHTML = resp.replaceAll('id="', 'id="ic_');
      });
  });

  return (
    <div ref={$el} style={{ display: 'none' }} />
  );
}
