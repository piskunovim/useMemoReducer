import { Reducer, useCallback, useMemo, useRef } from 'react';

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
  const devtoolsRef = useRef(devtools);
  devtoolsRef.current = devtools;

  const reducerRef = useRef(reducer);
  const stateRef = useRef(initialState);

  const dispatch = (action: A) => {
    stateRef.current = reducerRef.current(stateRef.current, action);
    subscribersRef.current.forEach((sub) => sub(stateRef.current));
  };
  const getState = (): S => stateRef.current;

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
