import { ThunkAction } from './models';
export const isThunk = <S, A, R = void>(action: any): action is ThunkAction<S, A, R> => {
  return typeof action === 'function';
};
