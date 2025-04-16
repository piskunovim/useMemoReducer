import { Dispatch } from './Dispatch';
export type ThunkAction<S, A, R = void> = (dispatch: Dispatch<S, A>, getState: () => S) => R;
//# sourceMappingURL=ThunkAction.d.ts.map