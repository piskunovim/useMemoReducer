import { Reducer, useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import {
  useCurrentSelector as currentSelector,
  useReduxDevtools,
  useCachedValue,
  useMainState,
  useTimeline,
} from './hooks';
import { Dispatch, ThunkAction, Subscriber, Subscribers, UseSelector } from './models';
import { isThunk } from './helpers';
import { UseMemoReducerOptions } from './hooks/useReduxDevtools/models';

export const useMemoReducer = <S, A>(
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

  const timelineListener = useTimeline(setState, cachedInitialState);

  const devtools = useReduxDevtools(noneReactiveState, cachedOptions, timelineListener);

  // @ts-expect-error ts(2322)
  const enhancedDispatch: Dispatch<S, A> = useCallback(
    (action: A | ThunkAction<S, A>) => {
      if (isThunk<S, A>(action)) {
        return action(enhancedDispatch, getState);
      }

      const newState = cachedReducer(noneReactiveState.current, action);

      devtools.dispatch(action, newState);

      return setState(newState);
    },
    [cachedReducer, noneReactiveState, devtools, setState, getState],
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
