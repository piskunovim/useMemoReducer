import React, { FC, PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo } from 'react';

import { UseSelector, useMemoReducer } from '../../../src';
import { Action, State, Thunk, initialState, reducer } from './reducer';

type Context = {
  increment: () => void;
  decrement: () => void;
  useSelector: UseSelector<State>;
};

const CounterServiceContext = createContext({} as Context);

const useCounterService = (): Context => {
  return useContext(CounterServiceContext);
};

export const incrementAction = (): Thunk<void> => (dispatch) => {
  dispatch({ type: Action.INCREMENT });
};
export const decrementAction = (): Thunk<void> => (dispatch) => {
  dispatch({ type: Action.DECREMENT });
};

const CounterService: FC<PropsWithChildren> = ({ children }) => {
  const [useSelector, dispatch] = useMemoReducer(reducer, initialState);

  const increment = useCallback(() => {
    dispatch(incrementAction());
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

export const COUNTER_VALUE_SELECTOR = 'counter-value';
export const INCREMENT_SELECTOR = 'increment';
export const DECREMENT_SELECTOR = 'decrement';

export const counterServiceRerendersSpy = jest.fn();

const Counter: FC<PropsWithChildren> = () => {
  const counterService = useCounterService();

  const { useSelector, increment, decrement } = counterService;

  const counter = useSelector((state) => state.count);

  useEffect(() => {
    /* istanbul ignore next */
    counterServiceRerendersSpy();
  }, [counterService]);

  return (
    <>
      <span data-testid={COUNTER_VALUE_SELECTOR}>{counter}</span>
      <button data-testid={INCREMENT_SELECTOR} onClick={increment}>
        Increment
      </button>
      <button data-testid={DECREMENT_SELECTOR} onClick={decrement}>
        Decrement
      </button>
    </>
  );
};

export const ComponentWithContext: FC = () => {
  return (
    <CounterService>
      <Counter />
    </CounterService>
  );
};
