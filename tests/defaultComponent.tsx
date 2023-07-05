import React from 'react';

import { useMemoReducer } from '../src';
import { Action, reducer, initialState } from './reducer';

const DefaultTestComponent = () => {
  const [useSelector, dispatch] = useMemoReducer(reducer, initialState);

  const count = useSelector((state) => state.count);

  return (
    <div>
      <button onClick={() => dispatch({ type: Action.DECREMENT })}>-</button>
      <span data-testid="count-value">{count}</span>
      <button onClick={() => dispatch({ type: Action.INCREMENT })}>+</button>
    </div>
  );
};

export { DefaultTestComponent, Action };
