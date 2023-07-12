import { ThunkAction } from '../../src';

export enum Action {
  INCREMENT = 'INCREMENT',
  DECREMENT = 'DECREMENT',
  OBJECT_VALUE_CHANGED = 'OBJECT_VALUE_CHANGED',
}

export type Actions =
  | { type: Action.INCREMENT }
  | { type: Action.DECREMENT }
  | { type: Action.OBJECT_VALUE_CHANGED; value: string };

export type State = {
  count: number;
  object: { value: string };
};

export type Thunk<R> = ThunkAction<State, Actions, R>;

export const initialState: State = {
  count: 0,
  object: { value: 'Some value' },
};

export const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case Action.INCREMENT:
      return { ...state, count: state.count + 1 };
    case Action.DECREMENT:
      return { ...state, count: state.count - 1 };
    case Action.OBJECT_VALUE_CHANGED:
      return { ...state, object: { ...state.object, value: action.value } };
    default:
      return state;
  }
};
