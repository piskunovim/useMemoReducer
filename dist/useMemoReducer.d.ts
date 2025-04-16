import { Reducer } from 'react';
import { Dispatch, UseSelector } from './models';
import { UseMemoReducerOptions } from './hooks/useReduxDevtools/models';
export declare const useMemoReducer: <S, A, O>(reducer: Reducer<S, A>, initialState: S, options?: UseMemoReducerOptions) => [UseSelector<S>, Dispatch<S, A>];
//# sourceMappingURL=useMemoReducer.d.ts.map