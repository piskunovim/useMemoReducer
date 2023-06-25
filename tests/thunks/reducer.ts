import { ThunkAction } from '../../src';

export enum Action {
  FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS',
  FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE',
}

type Actions = { type: Action.FETCH_DATA_SUCCESS; data: State } | { type: Action.FETCH_DATA_FAILURE; error: Error };

export type Thunk<R> = ThunkAction<State, Actions, R>;

export type FetchResponse = {
  title: string;
};

type State = {
  title: string;
  errorMessage: string;
};

export const initialState: State = {
  title: '',
  errorMessage: '',
};

export const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case Action.FETCH_DATA_SUCCESS:
      const { title } = action.data;
      return { ...state, title };
    case Action.FETCH_DATA_FAILURE:
      return { ...state, errorMessage: action.error.message };
    default:
      return state;
  }
};
