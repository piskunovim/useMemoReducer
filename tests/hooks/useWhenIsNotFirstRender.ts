import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

import { useIsFirstRender } from './useIsFirstRender';

export const useWhenIsNotFirstRender = (callback: EffectCallback, depends: DependencyList) => {
  const isFirstRender = useIsFirstRender();

  const callbackRef = useRef<EffectCallback | null>(null);

  callbackRef.current = callback;

  useEffect(() => {
    if (isFirstRender) {
      return;
    }

    callbackRef.current?.();
  }, depends);
};
