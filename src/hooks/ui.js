import { useRef, useEffect } from 'react';
import { isArraysEqual } from '@/helpers/utils';

/**
 * Hook will trigger once time only after mount
 *
 * @param  {void}  cb
 */
export function useOnce(cb) {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      return;
    }
    isMounted.current = true;
    cb();
  }, [cb]);
}

/**
 * Hook won't trigger if dependencies don't changed
 *
 * @param  {void}  cb
 * @param  {array}  dependencies - support string dependencies only
 */
export function useUpdated(cb, dependencies = []) {
  const cached = useRef(dependencies);

  useEffect(() => {
    if (!isArraysEqual(cached.current, dependencies)) {
      cached.current = dependencies;
      cb();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
