# `useMemoReducer`

![Workflow Status](https://img.shields.io/github/actions/workflow/status/piskunovim/useMemoReducer/ci.yml)
![Version](https://img.shields.io/github/package-json/v/piskunovim/useMemoReducer/main?label=version)
[![codecov](https://codecov.io/gh/piskunovim/useMemoReducer/branch/main/graph/badge.svg?token=1O85HE84LP)](https://codecov.io/gh/piskunovim/useMemoReducer)

## Overview

`useMemoReducer` is a custom React hook that provides an optimized way to manage the state within a React component, similar to how `useReducer` works, but with integrated support for memoization, performance optimization, and debugging capabilities through Redux DevTools.

## Features 

- 🚀 **Performance Optimization**: `useMemoReducer` leverages memoization to optimize your component's performance, ensuring re-renders only occur when selected state segments change.

- 🧩 **Thunk Integration**: Enhance your state management by utilizing thunks with `useMemoReducer`. This integration allows for more complex and asynchronous actions, providing greater flexibility and control.

- ⚡ **Empowered React Context**: `useMemoReducer` truly shines when integrated with React Context. It enables you to create compact, isolated yet robustly managed state stores, optimizing state handling within your React applications.

- 🔧 **Debugging with Redux DevTools**: Gain insights into the state flow by integrating `useMemoReducer`with Redux DevTools. Simply assign meaningful names to your connections, and delve into state transitions, actions, and timelines, all at your fingertips.

Harness the full potential of `useMemoReducer` to build scalable, efficient, and maintainable React applications.

## Installation

```javascript
npm install use-memo-reducer
```

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

## Contexts

One of the standout applications of `useMemoReducer` lies in enhancing React Contexts for state management. Traditionally, React Contexts have had a reputation for being cumbersome when it comes to state storage, mainly due to the challenges in optimizing providers to prevent unnecessary re-renders upon state changes.

However, `useMemoReducer` paves the way for a solution to this issue, empowering you to craft highly efficient and versatile state management services.

Let’s illustrate this with an example. Imagine that we are building a simple counter, and we wish to create a service that allows incrementing and decrementing a value within the state.

```javascript
import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  memo,
} from "react";
import { useMemoReducer } from "use-memo-reducer";

export const CounterServiceContext = createContext({});

export const useCounterService = () => useContext(CounterServiceContext);

const counterReducer = (state, action) => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
};

export const CounterService = memo(({ children }) => {
  const [useSelector, dispatch] = useMemoReducer(counterReducer, { count: 0 });

  const decrement = useCallback(
    () => dispatch({ type: "decrement" }),
    [dispatch]
  );
  const increment = useCallback(() => {
    dispatch({ type: "increment" });
  }, [dispatch]);

  const contextValues = useMemo(
    () => ({
      useSelector,
      decrement,
      increment,
    }),
    []
  );

  return (
    <CounterServiceContext.Provider value={contextValues}>
      {children}
    </CounterServiceContext.Provider>
  );
});
```

Notably, the service is memoized, ensuring that the provider doesn't trigger needless re-renders. `useMemoReducer` seamlessly handles the orchestration of re-rendering processes. All that’s required on your end is to retrieve the UserSelector from the context hook within the necessary React component, and then pass the selector to it, akin to the familiar workflow with Redux.

```javascript
const Counter = () => {
  const { useSelector } = useCounterService();

  const count = useSelector((state) => state.count);

  return <span>{count}</span>;
};

const ActionButtons = () => {
  const { decrement, increment } = useCounterService();

  return (
    <>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
    </>
  );
};
```

Let’s integrate this in the counter component.

```javascript
const CounterComponent = () => (
  <CounterService>
    <Counter />
    <ActionButtons />
  </CounterService>
);
```

What we've achieved here is the creation of a localized store dedicated to a set of components. But what’s even more impressive is the scalability: should you need multiple counters on a single page, simply instantiate this component multiple times. Each counter will maintain its distinct state and independent logic, providing an autonomous ecosystem for each instance.

```javascript
const MainComponent = () => (
  <>
    <CounterComponent />
    <CounterComponent />
  </>
);

createRoot(document.getElementById("app-init")).render(<MainComponent />);
```

This methodology unlocks boundless possibilities for ingenuity and experimentation in your development process.

## Integration with Redux DevTools

`useMemoReducer` supports integration with Redux DevTools. Make sure you have the Redux DevTools extension installed in your browser. This allows you to inspect the state and actions, which can be incredibly helpful during development.

In order to enable the integration, you need to pass the `devtoolsName` option to the hook in lowercase. This is the name that will be used to identify your store in the Redux DevTools.

```javascript
const [useSelector, dispatch] = useMemoReducer(counterReducer, initialState, {
  devtoolsName: 'counter',
});
```

## Signature

```typescript
function useMemoReducer<S, A, O>(
  reducer: Reducer<S, A>,
  initialState: S,
  options?: O
): [useSelector: UseSelector<S>, dispatch: Dispatch<S, A>];
```

- **`reducer`**: A reducing function that returns a new state, given the current state and an action.
- **`initialState`**: The initial state to be used for the first render.
- **`useSelector`**: A hook similar to `useSelector` in Redux. It takes a selector function as an argument and returns the selected state. The selector will be re-run whenever an action is dispatched and some part of the state may have changed.
- **`dispatch`**: A dispatch function is responsible for sending actions to the store. It accepts both standard action objects and thunks.

## Types

- **`S`**: The type of state used by the reducer.
- **`A`**: The type of actions that can be dispatched to the reducer.
- **`O`**: The type representing the options for the hook, such as `{ devtoolsName }`.

Remember, regardless hook introduces bunch of optimisation and performance abilities the final user of the hook is a developer. Use this hook judiciously
