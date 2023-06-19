export type UseSelector<S> = <TSelected>(selector: (store: S) => TSelected) => TSelected;
