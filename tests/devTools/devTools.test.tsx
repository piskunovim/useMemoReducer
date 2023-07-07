import { renderHook } from '@testing-library/react';

import { useMemoReducer } from '../../src';
import { getCurrentHookValue } from '../helpers';
import * as useReduxDevtools from '../../src/hooks/useReduxDevtools/useReduxDevtools';

jest.mock('../../src/hooks/useReduxDevtools/useReduxDevtools');
jest.mock('../../src/hooks/useReduxDevtools/helpers');

describe('devTools', () => {
  it('should dispatch an action to the Redux Dev Tools Extension when one is enabled', () => {
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

    customDispatch(Action);

    expect(mockDispatchToDevtools).toHaveBeenCalledWith(Action);
    expect(mockDispatchToDevtools).toHaveBeenCalledTimes(1);
  });
});
