import { act, renderHook } from '@testing-library/react';

import { getCurrentHookValue } from '../helpers';
import { fetchDataThunk } from './thunks';
import { reducer, initialState, Thunk } from './reducer';
import { useMemoReducer } from '../../src';

describe('thunks', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch the data and render correctly', async () => {
    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve({ title: 'Validated' }) });
    const [useSelector, dispatch] = getCurrentHookValue(renderHook(() => useMemoReducer(reducer, initialState)));
    const initialTitle = getCurrentHookValue(renderHook(() => useSelector((state) => state.title)));

    await act(async () => {
      dispatch(fetchDataThunk() as unknown as Thunk<void>);
    });
    const changedTitle = getCurrentHookValue(renderHook(() => useSelector((state) => state.title)));

    expect(initialTitle).toBe('');
    expect(changedTitle).toBe('Validated');
  });

  it('should handle the error when fetching the data', async () => {
    fetchMock.mockResolvedValueOnce(Promise.reject(new Error('Failed to load the data')));
    const [useSelector, dispatch] = getCurrentHookValue(renderHook(() => useMemoReducer(reducer, initialState)));
    const initialTitle = getCurrentHookValue(renderHook(() => useSelector((state) => state.title)));
    const initialErrorMessage = getCurrentHookValue(renderHook(() => useSelector((state) => state.errorMessage)));

    await act(async () => {
      dispatch(fetchDataThunk() as unknown as Thunk<void>);
    });

    const changedTitle = getCurrentHookValue(renderHook(() => useSelector((state) => state.title)));
    const changedErrorMessage = getCurrentHookValue(renderHook(() => useSelector((state) => state.errorMessage)));

    expect(initialTitle).toBe('');
    expect(initialErrorMessage).toBe('');
    expect(changedTitle).toBe('');
    expect(changedErrorMessage).toBe('Failed to load the data');
  });

  it('should clear the error when data was fetched successfully', async () => {
    fetchMock.mockResolvedValueOnce(Promise.reject(new Error('Failed to load the data')));
    const [useSelector, dispatch] = getCurrentHookValue(renderHook(() => useMemoReducer(reducer, initialState)));
    const initialTitle = getCurrentHookValue(renderHook(() => useSelector((state) => state.title)));
    const initialErrorMessage = getCurrentHookValue(renderHook(() => useSelector((state) => state.errorMessage)));

    await act(async () => {
      dispatch(fetchDataThunk() as unknown as Thunk<void>);
    });

    const changedErrorMessageAfterReject = getCurrentHookValue(
      renderHook(() => useSelector((state) => state.errorMessage)),
    );

    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve({ title: 'Validated' }) });

    await act(async () => {
      dispatch(fetchDataThunk() as unknown as Thunk<void>);
    });

    const changedTitleAfterSuccess = getCurrentHookValue(renderHook(() => useSelector((state) => state.title)));
    const changedErrorMessageAfterSuccess = getCurrentHookValue(
      renderHook(() => useSelector((state) => state.errorMessage)),
    );

    expect(initialTitle).toBe('');
    expect(initialErrorMessage).toBe('');

    expect(changedErrorMessageAfterReject).toBe('Failed to load the data');

    expect(changedTitleAfterSuccess).toBe('Validated');
    expect(changedErrorMessageAfterSuccess).toBe('');
  });
});
