import React, { FC, PropsWithChildren, createContext, useCallback, useContext, useMemo, useState } from 'react';

import { UseSelector, useMemoReducer } from '../../src';
import { Action, State, Thunk, initialState, reducer } from './reducer';
import { useWhenIsNotFirstRender } from '../hooks';

type Context = {
  increment: () => void;
  decrement: () => void;
  useSelector: UseSelector<State>;
};

const CounterServiceContext = createContext({} as Context);

const useCounterService = (): Context => {
  return useContext(CounterServiceContext);
};

export const incerementAction = (): Thunk<void> => (dispatch) => {
  dispatch({ type: Action.INCREMENT });
};
export const decrementAction = (): Thunk<void> => (dispatch) => {
  dispatch({ type: Action.DECREMENT });
};

const CounterService: FC<PropsWithChildren> = ({ children }) => {
  const [useSelector, dispatch] = useMemoReducer(reducer, initialState);

  const increment = useCallback(() => {
    dispatch(incerementAction());
  }, [dispatch]);

  const decrement = useCallback(() => {
    dispatch(decrementAction());
  }, [dispatch]);

  const contextValue: Context = useMemo(
    () => ({ useSelector, increment, decrement }),
    [decrement, increment, useSelector],
  );

  return <CounterServiceContext.Provider value={contextValue}>{children}</CounterServiceContext.Provider>;
};

export const COUNTER_CURENT_RENDERS_COUNT_SELECTOR = 'counter-current-renders-count';
export const OBJECT_VIEWER_CURENT_RENDERS_COUNT_SELECTOR = 'object-viewer-counter-current-renders-count';
export const COUNT_VALUE_SELECTOR = 'count-value';
export const INCREMENT_SELECTOR = 'increment';
export const DECREMENT_SELECTOR = 'decrement';
export const CHANGE_OBJECT_SELECTOR = 'change-object';
export const OBJECT_VALUE_SELECTOR = 'object-value';

const Counter: FC<PropsWithChildren> = () => {
  const [renders, updateRender] = useState(0);
  const { useSelector, increment, decrement } = useCounterService();

  const count = useSelector((state) => state.count);

  useWhenIsNotFirstRender(() => {
    updateRender((renders) => renders + 1);
  }, [count]);

  return (
    <>
      <span data-testid={COUNTER_CURENT_RENDERS_COUNT_SELECTOR}>{renders}</span>
      <span data-testid={COUNT_VALUE_SELECTOR}>{count}</span>
      <button data-testid={INCREMENT_SELECTOR} onClick={increment}>
        Increment
      </button>
      <button data-testid={DECREMENT_SELECTOR} onClick={decrement}>
        Decrement
      </button>
    </>
  );
};

const ObjectViewer: FC<PropsWithChildren> = () => {
  const [renders, updateRender] = useState(0);
  const { useSelector, increment, decrement } = useCounterService();

  const object = useSelector((state) => state.object);

  useWhenIsNotFirstRender(() => {
    updateRender((renders) => renders + 1);
  }, [object, increment, decrement]);

  useWhenIsNotFirstRender(() => {
    updateRender((renders) => renders + 1);
  });

  return (
    <>
      <span data-testid={OBJECT_VIEWER_CURENT_RENDERS_COUNT_SELECTOR}>{renders}</span>
      <span data-testid={OBJECT_VALUE_SELECTOR}>{JSON.stringify(object)}</span>
    </>
  );
};

export const ComponentWithContext: FC = () => {
  return (
    <CounterService>
      <Counter />
      <ObjectViewer />
    </CounterService>
  );
};
