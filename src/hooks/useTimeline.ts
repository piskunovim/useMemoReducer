import { Dispatch, SetStateAction, useCallback } from 'react';

export const useTimeline = <S>(dispatch: Dispatch<SetStateAction<S>>, initialState: S) => {
  const jumpToAction = useCallback(
    (action: unknown) => {
      // @ts-expect-error ts(2322)
      console.log('Jump to state', { state: JSON.parse(action.state) });
      // @ts-expect-error ts(2322)
      dispatch(JSON.parse(action.state));
    },
    [dispatch],
  );

  const reset = useCallback(
    (action: unknown) => {
      console.log('Reset state', { action });
      dispatch(initialState);
    },
    [dispatch, initialState],
  );

  const NOT_IMPLEMENTED_ACTION = useCallback((action: unknown) => {
    console.log('NOT_IMPLEMENTED_ACTION', { action });
  }, []);

  return useCallback(
    (p: unknown) => {
      // // @ts-expect-error ts(2322)
      console.log('[useMemoReducer] Devtools state changed', { p });
      // @ts-expect-error ts(2322)
      if (p.type === 'DISPATCH' && p.payload.type === 'JUMP_TO_ACTION') {
        return jumpToAction(p);
      }
      // @ts-expect-error ts(2322)
      if (p.type === 'DISPATCH' && p.payload.type === 'RESET') {
        return reset(p);
      }
      // @ts-expect-error ts(2322)
      if (p.type === 'DISPATCH') {
        NOT_IMPLEMENTED_ACTION(p);
      }
    },
    [NOT_IMPLEMENTED_ACTION, jumpToAction, reset],
  );
};
