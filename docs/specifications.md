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
