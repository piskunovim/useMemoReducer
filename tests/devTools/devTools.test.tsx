import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import { useMemoReducer } from '../../src';
import * as useReduxDevtools from '../../src/hooks/useReduxDevtools/useReduxDevtools';
import { Dispatch } from '../../src/models';

type CustomDispatch<S, A> = {
  current: Dispatch<S, A> | null;
};

jest.mock('../../src/hooks/useReduxDevtools/useReduxDevtools');

describe('devTools', () => {
  const customDispatchRef: CustomDispatch<any, any> = { current: null };

  afterEach(() => {
    cleanup();
    customDispatchRef.current = null;
  });

  it('should dispatch action to devtools when devtools are enabled', () => {
    enum Action {
      MOCK_ACTION = 'MOCK_ACTION',
    }
    const reducer = jest.fn((state, action) => state);
    const initialState = {};

    // Mock the dispatchToDevtools function
    const mockDispatchToDevtools = jest.fn();

    // Mock implementation for useCreateReduxDevtools
    (useReduxDevtools.useCreateReduxDevtools as jest.Mock).mockImplementation(() => ({
      devtoolsEnabled: () => true,
      dispatchToDevtools: mockDispatchToDevtools,
    }));

    const DevToolsTestComponent = () => {
      const [, customDispatch] = useMemoReducer(reducer, initialState);

      // Expose customDispatch for the test
      React.useEffect(() => {
        customDispatchRef.current = customDispatch;
      }, [customDispatch]);

      return null;
    };

    render(<DevToolsTestComponent />);

    const mockAction = { type: Action.MOCK_ACTION };

    act(() => {
      customDispatchRef.current && customDispatchRef.current(mockAction);
    });

    // Assert that dispatchToDevtools was called with the correct action
    expect(mockDispatchToDevtools).toHaveBeenCalledWith(mockAction);
  });
});
