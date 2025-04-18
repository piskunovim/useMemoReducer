/* eslint-disable react-hooks/rules-of-hooks */
import { MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react';

import { connect, disconnect, isExist } from './helpers';
import { disconnectObserver } from './DisconnectObserver';
import { ReduxDevtoolsExtensionConnection, UseMemoReducerOptions } from './models';

type ReturnType<A, S> = {
  dispatch: (action: A, state: S) => void;
  connection: ReduxDevtoolsExtensionConnection | null;
};

export const useReduxDevtools = <S, A>(
  noneReactiveState: MutableRefObject<S>,
  options?: UseMemoReducerOptions,
  listeners?: (change: unknown) => void,
): ReturnType<A, S> => {
  const connection = useMemo(
    () => connect(options?.id ?? '', noneReactiveState.current),
    [noneReactiveState, options?.id],
  );
  const onListenersRef = useRef(listeners);
  onListenersRef.current = listeners;

  const unsubscribe = useRef<() => void | null>();

  const subscribe = useCallback(() => {
    console.log('SUBSCRIBE...', { connection, onListenersRef });

    unsubscribe.current?.();

    return connection?.subscribe(onListenersRef.current);
  }, [connection]);

  const reconnect = useCallback(() => {
    console.log('RECONNECT...', { connection });

    unsubscribe.current = subscribe();
    connection?.send({ type: '@@RECONNECT' }, noneReactiveState.current);
  }, [connection, noneReactiveState, subscribe]);

  useEffect(() => {
    disconnectObserver.subscribe(reconnect);

    return () => {
      disconnectObserver.unsubscribe(reconnect);
    };
  }, [reconnect]);

  useEffect(() => {
    if (!isExist(connection)) {
      return;
    }

    unsubscribe.current = subscribe();

    return () => {
      if (!isExist(connection)) {
        return;
      }

      unsubscribe.current?.();
      disconnect(connection);
    };
  }, [connection, subscribe]);

  const dispatch = useCallback(
    (action: A, state: S) => {
      connection?.send(action, state);
    },
    [connection],
  );

  return useMemo(() => ({ dispatch, connection }), [dispatch, connection]);
};
