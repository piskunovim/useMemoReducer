export type Selector<S, TSelected = unknown> = (store: S) => TSelected;
