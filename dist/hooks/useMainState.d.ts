/// <reference types="react" />
export declare const useMainState: <S>(initialState: S) => {
    state: S;
    noneReactiveState: import("react").MutableRefObject<S>;
    cachedInitialState: S;
    setState: import("react").Dispatch<import("react").SetStateAction<S>>;
    getState: () => S;
};
//# sourceMappingURL=useMainState.d.ts.map