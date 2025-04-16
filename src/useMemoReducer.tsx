import { Reducer, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import { useCurrentSelector as currentSelector, useReduxDevtools, useCachedValue, useMainState } from './hooks';
import { Dispatch, ThunkAction, Subscriber, Subscribers, UseSelector } from './models';
import { isThunk } from './helpers';
import { UseMemoReducerOptions } from './hooks/useReduxDevtools/models';

export const useMemoReducer = <S, A, O>(
  reducer: Reducer<S, A>,
  initialState: S,
  options?: UseMemoReducerOptions,
): [UseSelector<S>, Dispatch<S, A>] => {
  /**
   * We must set these values only once
   */
  const cachedOptions = useCachedValue(options);
  const cachedReducer = useCachedValue(reducer);

  const { state, noneReactiveState, cachedInitialState, setState, getState } = useMainState(initialState);

  const devtools = useReduxDevtools(noneReactiveState, cachedOptions);

  // useEffect(() => {
  //   console.log('devtools was changed', { devtools: JSON.stringify(devtools) });
  // }, [devtools]);

  useEffect(() => {
    if (devtools.devtoolsEnabled()) {
      // @ts-expect-error ts(2322)
      devtools.connection.subscribe((p) => {
        // // @ts-expect-error ts(2322)
        console.log('[useMemoReducer] Devtools state changed', { p });
        // @ts-expect-error ts(2322)
        if (p.type === 'DISPATCH' && p.payload.type === 'JUMP_TO_ACTION') {
          // @ts-expect-error ts(2322)
          console.log('Jump to state', { state: JSON.parse(p.state) });
          // @ts-expect-error ts(2322)
          setState(JSON.parse(p.state));
        }
        // @ts-expect-error ts(2322)
        if (p.type === 'DISPATCH' && p.payload.type === 'RESET') {
          console.log('Reset state');
          setState(cachedInitialState);
        }
      });
    }
  }, [devtools, cachedInitialState]);

  // @ts-expect-error ts(2322)
  const enhancedDispatch: Dispatch<S, A> = useCallback(
    (action: A | ThunkAction<S, A>) => {
      if (isThunk<S, A>(action)) {
        return action(enhancedDispatch, getState);
      }

      const newState = cachedReducer(noneReactiveState.current, action);

      if (devtools.devtoolsEnabled()) {
        // @ts-expect-error ts(2322)
        devtools.dispatchToDevtools?.(action, newState);
      }

      return setState(newState);
    },
    [getState, devtools, cachedReducer],
  );

  const subscribersRef = useRef<Subscribers<S>>(new Set([]));

  const subscribe = useCallback((subscriber: Subscriber<S>) => {
    subscribersRef.current.add(subscriber);
  }, []);

  const unSubscribe = useCallback((subscriber: Subscriber<S>) => {
    subscribersRef.current.delete(subscriber);
  }, []);

  const useSelector: UseSelector<S> = useCallback(
    <TSelected,>(selector: (store: S) => TSelected) =>
      currentSelector<S, TSelected>(selector, getState(), { subscribe, unSubscribe }),
    [getState, subscribe, unSubscribe],
  );

  useLayoutEffect(() => {
    // Notify all subscribers when store state changes
    subscribersRef.current.forEach((sub) => sub(state));
  }, [state]);

  return useMemo(() => [useSelector, enhancedDispatch], [enhancedDispatch, useSelector]);
};
