import { ReduxDevtoolsExtensionConnection, UseMemoReducerOptions } from './models';
type ReturnType<A, S> = {
    devtoolsEnabled: () => boolean;
    dispatchToDevtools?: (action: A, state: S) => void;
    connection?: ReduxDevtoolsExtensionConnection;
};
export declare const useReduxDevtools: <S, A>(noneReactiveState: S, options?: UseMemoReducerOptions) => ReturnType<A, S>;
export {};
//# sourceMappingURL=useReduxDevtools.d.ts.map