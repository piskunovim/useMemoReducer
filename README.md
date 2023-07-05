# `useMemoReducer`
**Empowering Selective Rendering**

![Workflow Status](https://img.shields.io/github/actions/workflow/status/piskunovim/useMemoReducer/ci.yml)
![Version](https://img.shields.io/github/package-json/v/piskunovim/useMemoReducer/main?label=version)
![bundle size](https://img.shields.io/badge/bundle%20size-2.31%20KB_(minified_+_gzipped)-brightgreen)
[![codecov](https://codecov.io/gh/piskunovim/useMemoReducer/branch/main/graph/badge.svg?token=1O85HE84LP)](https://codecov.io/gh/piskunovim/useMemoReducer)

## Overview

`useMemoReducer` is a React hook engineered to efficiently manage state within a **React Context** by decoupling state updates in your module from the Context's child re-rendering.

Its usage closely mirrors that of `useReducer`, but additionally supports **thunks** and integrates seamlessly with **Redux DevTools** for enhanced debugging.


## Installation

```javascript
npm install use-memo-reducer
```

Import:

```javascript
import { useMemoReducer } from 'use-memo-reducer';
```

## Features

✨ **Enhanced Selective Rendering**: increase performance with `useMemoReducer` selective rendering, letting your components render only what's necessary! 🚀

🤝 **Broad React Version Support**: Embrace flexibility with full support for React versions 16, 17, and 18, ensuring seamless integration into any project! 🛠️

💡 Thunk Support:Tap into the potency of thunks to manage intricate and asynchronous actions, fortifying your state management architecture!  🌟

🔍 **Redux DevTools Integration**: Supercharge your development experience with seamless integration with Redux DevTools, keeping track of state changes with ease and precision! 🕵️‍♂️


## Basic Usage

The `useMemoReducer` hook offers an efficient way to ensure that your component only renders when it is truly necessary. This can be especially beneficial in scenarios where the component's state is composed of multiple properties, and you want to avoid unnecessary re-renders when some of these properties change.

Let’s take an example where the state is an object containing two properties: `count` and `user`. We will manipulate the state using buttons and observe the rendering behavior.

```javascript
import React from "react";
import { createRoot } from "react-dom/client";
import { useMemoReducer } from "use-memo-reducer";

const counterReducer = (state, action) => {
  switch (action.type) {
    case "increment": {
      return { ...state, count: state.count + 1 };
    }
    case "decrement": {
      return { ...state, count: state.count - 1 };
    }
    case "switch_user": {
      return { ...state, user: { ...state.user, name: "Jane" } };
    }
    default:
      return state;
  }
};

const App = () => {
  const [useSelector, dispatch] = useMemoReducer(counterReducer, {
    count: 0,
    user: { name: "John" },
  });

  // An extra re-render will only occur when
  // the "Switch User" button is clicked.
  console.log("rerender...");

  const user = useSelector((state) => state.user);

  return (
    <div className="App">
      <h2>User data: {JSON.stringify(user)}</h2>

      <button onClick={() => dispatch({ type: "decrement" })}>Decrement</button>
      <button onClick={() => dispatch({ type: "increment" })}>Increment</button>
      <button onClick={() => dispatch({ type: "switch_user" })}>
        Switch User
      </button>
    </div>
  );
};

createRoot(document.getElementById("app-init")).render(<App />);
```
[![Edit basic-use-memo-reducer](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/basic-use-memo-reducer-n5z9yg?fontsize=14&hidenavigation=1&theme=dark)

Let's delve into the behavior of this component powered by the `useMemoReducer` hook. Pay attention to the line with `console.log("rerender...")`. This acts as an indicator in the console every time the component re-renders, which is very helpful for tracking updates.

Now, an important part of this hook is the `useSelector` function. This function enables you to subscribe to specific properties within the state. In this example, we have subscribed to the user property. The intriguing part here is that the component will only re-render when there are changes to the user property. This selective rendering is one of the strengths of the `useMemoReducer` hook.

But what about the `count` property? Well, if you increment or decrement the `count` without altering the `user`, you’ll notice that the component does not re-render. This is because it’s not subscribed to the `count` property.

This highlights the heart of `useMemoReducer`, transforming the way you manage rendering behavior for enhanced performance and efficiency.

## Context

Let's create a simple application that will use **React Context** and `useMemoReducer` and will show how child optimised rerendering does work. 
    
<img alt="useMemoReducer usage demo" src="media/demo.gif" width="800" />

[![Edit use-memo-reducer-context-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/use-memo-reducer-context-example-pcv676?fontsize=14&hidenavigation=1&theme=dark)

Traditionally, React Contexts have had a reputation for being cumbersome when it comes to state storage, mainly due to the challenges in optimizing providers to prevent unnecessary re-renders upon state changes. `useMemoReducer` paves the way for a solution to this issue.

Imagine that we are building a simple counter, and we wish to create a service that allows incrementing and decrementing a value within the state.

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

Notably, the service is memoized is memoized to optimize performance by avoiding unnecessary re-renders. `useMemoReducer` seamlessly handles the orchestration of re-rendering processes. All that’s required on your end is to retrieve the `useSelector` from the context hook within the necessary React component, and then pass the selector to it, akin to the familiar workflow with Redux.

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

### Simple usage

Here is an example that demonstrates how to use `useMemoReducer` within a simple functional component.

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

##  Contributors 👥

<table>
  <tr style='border: none;'>
    <td style="text-align:center;border:none;"><a href="https://github.com/VladimirGr"><img src="https://github.com/VladimirGr.png" style="border-radius:50%;" width="100px;" alt="Vladimir Grigoryev"/><br /><sub><b>Vladimir Grigoryev</b></sub></a><br /></td>
    <td style="text-align:center;border:none;"><a href="https://github.com/piskunovim"><img src="https://github.com/piskunovim.png" style="border-radius:50%;" width="100px;" alt="Igor Piskunov"/><br /><sub><b>Igor Piskunov</b></sub></a><br /></td>
  </tr>
</table>

