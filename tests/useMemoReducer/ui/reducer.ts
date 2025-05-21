import { ThunkAction } from '../../../src';

export enum Action {
  INCREMENT = 'INCREMENT',
  DECREMENT = 'DECREMENT',
}

export type Actions = { type: Action.INCREMENT } | { type: Action.DECREMENT };

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
    /* istanbul ignore next */
    default:
      return state;
  }
};
