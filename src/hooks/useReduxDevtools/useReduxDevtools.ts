import { Reducer, useCallback, useEffect, useMemo, useRef } from 'react';

import { disconnectObserver } from './DisconnectObserver';
import { connect, disconnect, getConnectionName, isDevtoolsExist, isEnabled } from './helpers';
import { ReduxDevtoolsExtension, UseMemoReducerOptions } from './models';

type ReturnType<A> = { devtoolsEnabled: () => boolean; dispatchToDevtools?: (action: A) => void };

const useReduxDevtools = <S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  connectionName: string,
  devtoolsExist: boolean | ReduxDevtoolsExtension,
): ReturnType<A> => {
  const devtoolsReducerRef = useRef(reducer(initialState, { type: '@@INIT' } as unknown as A));
  const connection = useMemo(
    () => (devtoolsExist ? connect(connectionName, devtoolsReducerRef.current) : null),
    [connectionName, devtoolsExist],
  );

  if (!connection) {
    return { devtoolsEnabled: () => false };
  }

  const unsubscribe = useRef<Function | null>();

  const subscribe = useCallback(() => {
    unsubscribe.current?.();

    return connection?.subscribe((message) => {
      // Implement monitors actions.
      // For example time traveling:
    });
  }, [connection]);

  const reconnect = useCallback(() => {
    connection?.send({ type: '@@RECONNECT' }, devtoolsReducerRef.current);
    unsubscribe.current = subscribe();
  }, [connection, subscribe]);

  useEffect(() => {
    disconnectObserver.subscribe(reconnect);

    return () => {
      disconnectObserver.unsubscribe(reconnect);
    };
  }, [reconnect]);

  useEffect(() => {
    unsubscribe.current = subscribe();

    return () => {
      unsubscribe.current?.();
      disconnect(connectionName);
    };
  }, [connectionName, subscribe]);

  const dispatchToDevtools = useCallback(
    (action: A) => {
      devtoolsReducerRef.current = reducer(devtoolsReducerRef.current, action);
      connection?.send(action, devtoolsReducerRef.current);
    },
    [connection, reducer],
  );

  const devtoolsEnabled = useCallback(() => {
    return isEnabled(connectionName);
  }, [connectionName]);

  return useMemo(() => ({ devtoolsEnabled, dispatchToDevtools }), [devtoolsEnabled, dispatchToDevtools]);
};

export const useCreateReduxDevtools = <S, A, O>(
  reducer: Reducer<S, A>,
  initialState: S,
  options?: O,
): ReturnType<A> => {
  const memoizedInitialState = useRef(initialState);
  const connectionName = useMemo(() => getConnectionName(options as UseMemoReducerOptions), []);

  return useReduxDevtools(reducer, memoizedInitialState.current, connectionName, isDevtoolsExist(connectionName));
};
