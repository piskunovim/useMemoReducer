import { Thunk, Action } from './reducer';

export const fetchDataThunk = (): Thunk<Promise<void>> => {
  return async (dispatch) => {
    try {
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();
      dispatch({ type: Action.FETCH_DATA_SUCCESS, data });
    } catch (error) {
      dispatch({ type: Action.FETCH_DATA_FAILURE, error: Error('Failed to load the data') });
    }
  };
};
