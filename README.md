# `useMemoReducer` Hook

## Overview

`useMemoReducer` is a custom React hook that provides an optimized way to manage the state within a React component, similar to how `useReducer` works, but with integrated support for memoization, performance optimization, and debugging capabilities through Redux DevTools.

## Usage

### Step 1: Import `useMemoReducer`

Import `useMemoReducer` into the file where you want to use it.

```javascript
import { useMemoReducer } from 'use-memo-reducer';
```

### Step 2: Use `useMemoReducer` in your component

Here is an example that demonstrates how to use `useMemoReducer` within a functional component.

```javascript
import React from 'react';
import { useMemoReducer } from './useMemoReducer';

// Define the initial state
const initialState = { count: 0 };

// Define the reducer
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

const CounterComponent = () => {
  // Use the useMemoReducer hook
  const [useSelector, dispatch] = useMemoReducer(counterReducer, initialState);

  // Select the count value from state
  const count = useSelector(state => state.count);

  return (
    <div>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <span>Count: {count}</span>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  );
};

export default CounterComponent;
```

In this example, `useMemoReducer` is used similarly to `useReducer`. The difference is that you get a `useSelector` function instead of the state directly. This allows you to selectively pick parts of the state, and your component will only re-render if the selected parts change.

## Thunks

That's right! You can also dispatch a thunk (a function) instead of a plain action. This is useful for performing async actions or computing derived state before dispatching a plain action.

```javascript
import React from 'react';
import { useMemoReducer } from './useMemoReducer';

const initialState = { count: 0, loading: false };

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'loading':
      return { ...state, loading: true };  
    default:
      throw state;
  }
};

const CounterComponent = () => {
  const [useSelector, dispatch] = useMemoReducer(counterReducer, initialState);

  const count = useSelector(state => state.count);
  const loading = useSelector(state => state.loading);

  // An example thunk to increment the counter after a delay
  const delayedIncrement = (dispatch, getState) => {
    // Dispatch a loading action
    dispatch({ type: 'loading' });

    // After a delay, increment the counter
    setTimeout(() => {
      const currentState = getState();
      if (currentState.loading) {
        dispatch({ type: 'increment' });
      }
    }, 1000);
  };

  return (
    <div>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <span>Count: {count}</span>
      {loading && <span>Loading...</span>}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch(delayedIncrement)}>Delayed Increment</button>
    </div>
  );
};

export default CounterComponent;
```

## Considerations

- `useMemoReducer` is best suited for cases where performance optimization is critical.
- The hook is also useful if you want to integrate the Redux DevTools in regular reducer process.
- Remember, regardless hook introduces bunch of optimisation and performance abilities the final user of the hook is a developer. Use this hook judiciously

## Integration with Redux DevTools

`useMemoReducer` supports integration with Redux DevTools. Make sure you have the Redux DevTools extension installed in your browser. This allows you to inspect the state and actions, time travel, and more, which can be incredibly helpful during development.

## Signature

```typescript
function useMemoReducer<S, A>(
  reducer: Reducer<S, A>,
  initialState: S
): [useSelector: UseSelector<S>, dispatch: Dispatch<S, A>];
```

- **`reducer`**: A reducing function that returns a new state, given the current state and an action.
- **`initialState`**: The initial state to be used for the first render.
- **`UseSelector`**: A hook similar to `useSelector` in Redux. It takes a selector function as an argument and returns the selected state. The selector will be re-run whenever an action is dispatched and some part of the state may have changed.
- **`Dispatch`**: A dispatch function is responsible for sending actions to the store. It accepts both standard action objects and thunks.

## Types

- **`S`**: The type of state used by the reducer.
- **`A`**: The type of actions that can be dispatched to the reducer.

