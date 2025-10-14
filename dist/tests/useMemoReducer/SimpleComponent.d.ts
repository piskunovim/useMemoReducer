import { FC } from 'react';
import { State, Actions } from './reducer';
export declare const ALL_RENDERS_COUNT_SELECTOR = "all-renders-count";
export declare const CURENT_RENDERS_COUNT_SELECTOR = "current-renders-count";
export declare const COUNT_VALUE_SELECTOR = "count-value";
export declare const INCREMENT_SELECTOR = "increment";
export declare const DECREMENT_SELECTOR = "decrement";
export declare const CHANGE_OBJECT_SELECTOR = "change-object";
export declare const OBJECT_VALUE_SELECTOR = "object-value";
type Props = {
    reducer?: (state: State, action: Actions) => State;
    initialState?: State;
};
export declare const SimpleComponent: FC<Props>;
export {};
//# sourceMappingURL=SimpleComponent.d.ts.map