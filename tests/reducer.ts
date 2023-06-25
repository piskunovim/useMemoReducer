export enum Action {
  INCREMENT = 'INCREMENT',
  DECREMENT = 'DECREMENT',
}

export type Actions = { type: Action.INCREMENT } | { type: Action.DECREMENT };

export type State = {
  count: number;
};

export const initialState = {
  count: 0,
};

export const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case Action.INCREMENT:
      return { count: state.count + 1 };
    case Action.DECREMENT:
      return { count: state.count - 1 };
    default:
      return state;
  }
};
