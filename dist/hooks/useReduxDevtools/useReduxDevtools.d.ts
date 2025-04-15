import { ReduxDevtoolsExtensionConnection } from './models';
type ReturnType<A, S> = {
    devtoolsEnabled: () => boolean;
    dispatchToDevtools?: (action: A, state: S) => void;
    connection?: ReduxDevtoolsExtensionConnection;
};
export declare const useReduxDevtools: <S, A, O>(noneReactiveState: S, options?: O | undefined) => ReturnType<A, S>;
export {};
//# sourceMappingURL=useReduxDevtools.d.ts.map