import React, { FC, useEffect, useRef, useState } from 'react';

import { useMemoReducer } from '../../src';
import { Action, State, Actions, reducer as defaultReducer, initialState as defaultInitialState } from './reducer';

const SIDE_EFFECT_RENDER_COUNT_SELECTOR = 'side-effect-render-count';
const COUNT_VALUE_SELECTOR = 'count-value';
const INCREMENT_SELECTOR = 'increment';
const DECREMENT_SELECTOR = 'decrement';
const CHANGE_OBJECT_SELECTOR = 'change-object';
const OBJECT_VALUE_SELECTOR = 'object-value';

type Props = {
  reducer?: (state: State, action: Actions) => State;
  initialState?: State;
};

const DefaultTestComponent: FC<Props> = ({ reducer = defaultReducer, initialState = defaultInitialState }) => {
  const [sideEffectRender, updateSideEffectRender] = useState(0);
  const isFirstRender = useRef(true);
  const [useSelector, dispatch] = useMemoReducer(reducer, initialState);

  const count = useSelector((state) => state.count);
  const obj = useSelector((state) => state.object);

  useEffect(() => {
    if (!isFirstRender.current) {
      updateSideEffectRender((renders) => renders + 1);
    }
  }, [obj]);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return (
    <div>
      <span data-testid={SIDE_EFFECT_RENDER_COUNT_SELECTOR}>{sideEffectRender}</span>
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

const TestComponentWithoutRenders: FC<Props> = ({ reducer = defaultReducer, initialState = defaultInitialState }) => {
  const [sideEffectRender, updateSideEffectRender] = useState(0);
  const isFirstRender = useRef(true);
  const [useSelector, dispatch] = useMemoReducer(reducer, initialState);

  const obj = useSelector((state) => state.object);

  useEffect(() => {
    if (!isFirstRender.current) {
      updateSideEffectRender((renders) => renders + 1);
    }
  });

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  return (
    <div>
      <span data-testid={SIDE_EFFECT_RENDER_COUNT_SELECTOR}>{sideEffectRender}</span>
      <button data-testid={DECREMENT_SELECTOR} onClick={() => dispatch({ type: Action.DECREMENT })}>
        -
      </button>

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

export {
  DefaultTestComponent,
  TestComponentWithoutRenders,
  Action,
  DECREMENT_SELECTOR,
  INCREMENT_SELECTOR,
  SIDE_EFFECT_RENDER_COUNT_SELECTOR,
  COUNT_VALUE_SELECTOR,
  CHANGE_OBJECT_SELECTOR,
  OBJECT_VALUE_SELECTOR,
};
