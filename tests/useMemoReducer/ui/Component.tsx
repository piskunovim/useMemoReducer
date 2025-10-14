import React, { FC, useEffect } from 'react';

import { useMemoReducer } from '../../../src';
import { Action, State, Actions, reducer as defaultReducer, initialState as defaultInitialState } from './reducer';

export const COUNTER_VALUE_SELECTOR = 'counter-value';
export const INCREMENT_SELECTOR = 'increment';
export const DECREMENT_SELECTOR = 'decrement';
export const BATCH_INCREMENT_SELECTOR = 'batch-increment';
export const CHANGE_OBJECT_SELECTOR = 'change-object';
export const OBJECT_VALUE_SELECTOR = 'object-value';

export const allPartsOfStateRerendersSpy = jest.fn();
export const objectRerendersSpy = jest.fn();
export const counterRerendersSpy = jest.fn();

type Props = {
  reducer?: (state: State, action: Actions) => State;
  initialState?: State;
};

export const SimpleComponent: FC<Props> = ({ reducer = defaultReducer, initialState = defaultInitialState }) => {
  const [useSelector, dispatch] = useMemoReducer(reducer, initialState);

  const count = useSelector((state) => state.count);
  const obj = useSelector((state) => state.object);

  useEffect(() => {
    allPartsOfStateRerendersSpy();
  }, [obj, count]);

  useEffect(() => {
    objectRerendersSpy();
  }, [obj]);

  useEffect(() => {
    counterRerendersSpy();
  }, [count]);

  const increment = () => {
    dispatch({ type: Action.INCREMENT });
  };

  const decrement = () => {
    dispatch({ type: Action.DECREMENT });
  };

  const batchIncrement = () => {
    dispatch({ type: Action.INCREMENT });
    dispatch({ type: Action.INCREMENT });
    dispatch({ type: Action.INCREMENT });
  };

  return (
    <div>
      <button data-testid={DECREMENT_SELECTOR} onClick={decrement}>
        -
      </button>
      <span data-testid={COUNTER_VALUE_SELECTOR}>{count}</span>
      <button data-testid={INCREMENT_SELECTOR} onClick={increment}>
        +
      </button>
      <button data-testid={BATCH_INCREMENT_SELECTOR} onClick={batchIncrement}>
        +++
      </button>
      <span data-testid={OBJECT_VALUE_SELECTOR}>{JSON.stringify(obj)}</span>
    </div>
  );
};
