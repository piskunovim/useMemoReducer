import { Dispatch } from './Dispatch';
export type ThunkAction<S, A, R = void> = (dispatch: Dispatch<S, A, R>, getState: () => S) => R;
//# sourceMappingURL=ThunkAction.d.ts.map