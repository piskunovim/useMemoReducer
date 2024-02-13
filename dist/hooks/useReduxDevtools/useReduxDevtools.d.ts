import { Reducer } from 'react';
type ReturnType<A> = {
    devtoolsEnabled: () => boolean;
    dispatchToDevtools?: (action: A) => void;
};
export declare const useCreateReduxDevtools: <S, A, O>(reducer: Reducer<S, A>, initialState: S, options?: O | undefined) => ReturnType<A>;
export {};
//# sourceMappingURL=useReduxDevtools.d.ts.map