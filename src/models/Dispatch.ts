import { ThunkAction } from './ThunkAction';

export type Dispatch<S, A> = (
  action: A | ThunkAction<S, A>,
) => A | ThunkAction<S, A> extends (...args: any[]) => any ? ReturnType<A | ThunkAction<S, A>> : void;
