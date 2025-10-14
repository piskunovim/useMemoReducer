import { MutableRefObject } from 'react';
import { ReduxDevtoolsExtensionConnection, UseMemoReducerOptions } from './models';
type ReturnType<A, S> = {
    dispatch: (action: A, state: S) => void;
    connection: ReduxDevtoolsExtensionConnection | null;
};
export declare const useReduxDevtools: <S, A>(noneReactiveState: MutableRefObject<S>, options?: UseMemoReducerOptions, listeners?: ((change: unknown) => void) | undefined) => ReturnType<A, S>;
export {};
//# sourceMappingURL=useReduxDevtools.d.ts.map