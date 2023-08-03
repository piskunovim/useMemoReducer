import { act, renderHook, waitFor } from '@testing-library/react';

import { useMemoReducer } from '../../src';
import { getCurrentHookValue } from '../helpers';
import * as useReduxDevtools from '../../src/hooks/useReduxDevtools/useReduxDevtools';

jest.mock('../../src/hooks/useReduxDevtools/useReduxDevtools');
jest.mock('../../src/hooks/useReduxDevtools/helpers');

describe('devTools', () => {
  it('should dispatch an action to the Redux Dev Tools Extension when one is enabled', async () => {
    const mockDispatchToDevtools = jest.fn();

    (useReduxDevtools.useCreateReduxDevtools as jest.Mock).mockImplementation(() => ({
      devtoolsEnabled: () => true,
      dispatchToDevtools: mockDispatchToDevtools,
    }));

    const [, customDispatch] = getCurrentHookValue(
      renderHook(() =>
        useMemoReducer(
          jest.fn((state) => state),
          {},
        ),
      ),
    );

    const Action = { type: 'MOCK_ACTION' };
    await act(async () => {
      customDispatch(Action);
    });

    waitFor(() => {
      expect(mockDispatchToDevtools).toHaveBeenCalledWith(Action);
      expect(mockDispatchToDevtools).toHaveBeenCalledTimes(1);
    });
  });
});
