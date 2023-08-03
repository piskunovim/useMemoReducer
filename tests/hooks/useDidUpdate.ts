import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

import { useDidMount } from './useDidMount';

export const useDidUpdate = (callback: EffectCallback, depends: DependencyList = []) => {
  const isMounted = useDidMount();

  const callbackRef = useRef<EffectCallback | null>(null);

  callbackRef.current = callback;

  useEffect(() => {
    if (isMounted) {
      return;
    }

    callbackRef.current?.();
  }, depends);
};
