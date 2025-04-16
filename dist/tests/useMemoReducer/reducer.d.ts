import { ThunkAction } from '../../src';
export declare enum Action {
    INCREMENT = "INCREMENT",
    DECREMENT = "DECREMENT",
    OBJECT_VALUE_CHANGED = "OBJECT_VALUE_CHANGED"
}
export type Actions = {
    type: Action.INCREMENT;
} | {
    type: Action.DECREMENT;
} | {
    type: Action.OBJECT_VALUE_CHANGED;
    value: string;
};
export type State = {
    count: number;
    object: {
        value: string;
    };
};
export type Thunk<R> = ThunkAction<State, Actions, R>;
export declare const initialState: State;
export declare const reducer: (state: State, action: Actions) => State;
//# sourceMappingURL=reducer.d.ts.map