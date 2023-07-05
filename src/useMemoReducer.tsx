import { Reducer, useCallback, useLayoutEffect, useMemo, useReducer, useRef } from 'react';

import { useCurrentSelector as currentSelector } from './hooks/useCurrentSelector';
import { useCreateReduxDevtools } from './hooks/useReduxDevtools/useReduxDevtools';
import { Dispatch, ThunkAction, Subscriber, Subscribers, UseSelector } from './models';
import { isThunk } from './helpers';

export const useMemoReducer = <S, A, O>(
  reducer: Reducer<S, A>,
  initialState: S,
  options?: O,
): [UseSelector<S>, Dispatch<S, A>] => {
  const devtools = useCreateReduxDevtools(reducer, initialState, options);
  const [store, dispatch] = useReducer(reducer, initialState);

  const devtoolsRef = useRef(devtools);
  devtoolsRef.current = devtools;

  const storeRef = useRef(store);
  storeRef.current = store;
  const getState = (): S => storeRef.current;

  const customDispatch: Dispatch<S, A> = useCallback((action: A | ThunkAction<S, A>) => {
    if (isThunk<S, A>(action)) {
      return action(customDispatch, getState);
    }

    if (devtoolsRef.current.devtoolsEnabled()) {
      devtoolsRef.current.dispatchToDevtools?.(action);
    }

    return dispatch(action);
  }, []);

  const subscribersRef = useRef<Subscribers<S>>(new Set([]));

  useLayoutEffect(() => {
    // Notify all subscribers when store state changes
    subscribersRef.current.forEach((sub) => sub(store));
  }, [store]);

  const subscribe = useCallback((subscriber: Subscriber<S>) => {
    subscribersRef.current.add(subscriber);
  }, []);

  const unSubscribe = useCallback((subscriber: Subscriber<S>) => {
    subscribersRef.current.delete(subscriber);
  }, []);

  const useSelector: UseSelector<S> = useCallback(
    <TSelected,>(selector: (store: S) => TSelected) =>
      currentSelector<S, TSelected>(selector, getState(), { subscribe, unSubscribe }),
    [subscribe, unSubscribe],
  );

  return useMemo(() => [useSelector, customDispatch], [customDispatch, useSelector]);
};
