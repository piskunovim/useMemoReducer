export type Dispatch<S, A, R = void> = (action: A | ((dispatch: Dispatch<S, A, R>, getState: () => S) => R)) => R;
