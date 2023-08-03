import React, { FC, useEffect, useState } from 'react';

import { useMemoReducer } from '../../src';
import { useDidUpdate } from '../hooks';
import { Action, State, Actions, reducer as defaultReducer, initialState as defaultInitialState } from './reducer';

export const ALL_RENDERS_COUNT_SELECTOR = 'all-renders-count';
export const CURENT_RENDERS_COUNT_SELECTOR = 'current-renders-count';
export const COUNT_VALUE_SELECTOR = 'count-value';
export const INCREMENT_SELECTOR = 'increment';
export const DECREMENT_SELECTOR = 'decrement';
export const CHANGE_OBJECT_SELECTOR = 'change-object';
export const OBJECT_VALUE_SELECTOR = 'object-value';

type Props = {
  reducer?: (state: State, action: Actions) => State;
  initialState?: State;
};

export const SimpleComponent: FC<Props> = ({ reducer = defaultReducer, initialState = defaultInitialState }) => {
  const [currentRenders, updateCurrentRenders] = useState(0);

  const [allRenders, updateAllRenders] = useState(0);

  const [useSelector, dispatch] = useMemoReducer(reducer, initialState);

  const count = useSelector((state) => state.count);
  const obj = useSelector((state) => state.object);

  useEffect(() => {
    updateAllRenders((renders) => renders + 1);
  }, [obj, count]);

  useDidUpdate(() => {
    updateCurrentRenders((renders) => renders + 1);
  }, [obj]);

  return (
    <div>
      <span data-testid={ALL_RENDERS_COUNT_SELECTOR}>{allRenders}</span>
      <span data-testid={CURENT_RENDERS_COUNT_SELECTOR}>{currentRenders}</span>
      <button data-testid={DECREMENT_SELECTOR} onClick={() => dispatch({ type: Action.DECREMENT })}>
        -
      </button>
      <span data-testid={COUNT_VALUE_SELECTOR}>{count}</span>
      <button data-testid={INCREMENT_SELECTOR} onClick={() => dispatch({ type: Action.INCREMENT })}>
        +
      </button>
      <span data-testid={OBJECT_VALUE_SELECTOR}>{JSON.stringify(obj)}</span>
      <button
        data-testid={CHANGE_OBJECT_SELECTOR}
        onClick={() => dispatch({ type: Action.OBJECT_VALUE_CHANGED, value: 'Some value changed' })}
      >
        Change object
      </button>
    </div>
  );
};
