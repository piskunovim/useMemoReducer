import React from 'react';
import { act, waitFor, render, screen, cleanup } from '@testing-library/react';
import { fetchDataThunk } from './thunks';
import { reducer, initialState, FetchResponse, Thunk } from './reducer';
import { useMemoReducer } from '../../src';

const ThunksTestComponent = () => {
  const [useSelector, dispatch] = useMemoReducer(reducer, initialState);

  React.useEffect(() => {
    dispatch(fetchDataThunk() as unknown as Thunk<void>);
  }, [dispatch]);

  const title = useSelector((state) => state.title);
  const errorMessage = useSelector((state) => state.errorMessage);

  return (
    <div>
      {errorMessage && <span>{errorMessage}</span>}
      <span data-testid="title">{title}</span>
    </div>
  );
};

describe('thunks', () => {
  let fetchMock: jest.Mock;

  beforeEach(() => {
    fetchMock = jest.fn();
    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch data and render correctly', async () => {
    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve({ title: 'Validated' }) });

    await act(async () => {
      render(<ThunksTestComponent />);
    });

    await waitFor(() => {
      const dataElement = screen.getByTestId('title');
      expect(dataElement.textContent).toBe('Validated');
    });
  });

  it('should handle error when fetching data', async () => {
    fetchMock.mockResolvedValueOnce(Promise.reject(new Error('Failed to load the data')));

    await act(async () => {
      render(<ThunksTestComponent />);
    });

    await waitFor(() => {
      const errorElement = screen.queryByText('Failed to load the data');
      expect(errorElement).not.toBeNull();
    });
  });

  it('should have different states after unmount and render', async () => {
    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve({ title: 'Data 1' }) });

    const { getByTestId } = render(<ThunksTestComponent />);
    const dataElement = getByTestId('title');

    await act(async () => {
      await Promise.resolve();
    });

    expect(dataElement.textContent).toBe('Data 1');

    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve({ title: 'Data 2' }) });

    await act(async () => {
      cleanup(); // Unmount the component
      render(<ThunksTestComponent />);
      await Promise.resolve();
    });

    const updatedDataElement = getByTestId('title');
    expect(updatedDataElement.textContent).toBe('Data 2');
  });

  it('should clear error message after successful data fetch', async () => {
    fetchMock.mockResolvedValueOnce(Promise.reject(new Error('Failed to load the data')));

    await act(async () => {
      render(<ThunksTestComponent />);
    });

    const errorElement = screen.queryByText('Failed to load the data');
    expect(errorElement).not.toBeNull();

    fetchMock.mockResolvedValueOnce({ json: () => Promise.resolve({ title: 'Validated' }) });

    await act(async () => {
      cleanup();
      render(<ThunksTestComponent />);
    });

    const updatedErrorElement = screen.queryByText('Failed to load the data');
    expect(updatedErrorElement).toBeNull();
  });
});
