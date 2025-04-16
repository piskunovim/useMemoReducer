import { useCallback, useMemo, useRef, useState } from 'react';

import { useCachedValue } from './useCachedValue';

export const useMainState = <S>(initialState: S) => {
  const cachedInitialState = useCachedValue(initialState);
  const [state, setState] = useState(cachedInitialState);

  const noneReactiveState = useRef(state);
  noneReactiveState.current = state;
  const getState = useCallback((): S => noneReactiveState.current, []);

  return useMemo(
    () => ({
      state,
      noneReactiveState,
      cachedInitialState,
      setState,
      getState,
    }),
    [state, getState],
  );
};
