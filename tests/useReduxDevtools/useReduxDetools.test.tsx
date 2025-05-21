import { Reducer } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';

import { useMemoReducer } from '../../src';
import { useReduxDevtools } from '../../src/hooks/useReduxDevtools/useReduxDevtools';
import { UseMemoReducerOptions } from '../../src/hooks/useReduxDevtools/models';

jest.mock('../../src/hooks/useReduxDevtools/useReduxDevtools');
jest.mock('../../src/hooks/useReduxDevtools/helpers');

const mockDevtoolsDispatch = jest.fn();

(useReduxDevtools as jest.Mock).mockImplementation(() => ({
  connection: {
    subscribe: () => console.log(),
  },
  dispatch: mockDevtoolsDispatch,
}));

const renderWithUseMemoReducer = <S, A>(
  reducer: Reducer<S, A> = jest.fn((state) => state),
  initialState = {} as S,
  options?: UseMemoReducerOptions,
) => {
  return renderHook(() => useMemoReducer(reducer, initialState, options));
};

describe('devTools', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fire a dispatch of the Redux Dev Tools Extension', async () => {
    const { result } = renderWithUseMemoReducer();
    const {
      current: [, dispatch],
    } = result;
    const Action = { type: 'MOCK_ACTION' };

    await act(async () => {
      dispatch(Action);
    });

    waitFor(() => {
      expect(mockDevtoolsDispatch).toHaveBeenCalledTimes(1);
      expect(mockDevtoolsDispatch).toHaveBeenCalledWith(Action);
    });
  });
});
