import { ThunkAction } from './ThunkAction';

export type Dispatch<S, A> = <T extends A | ThunkAction<S, A>>(
  action: T,
) => T extends (...args: any[]) => any ? ReturnType<T> : void;
