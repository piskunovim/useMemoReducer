/* eslint-disable react-hooks/rules-of-hooks */
import { MutableRefObject, useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import { connect, disconnect, getConnection, isExist } from './helpers';
import { disconnectObserver } from './DisconnectObserver';
import { ReduxDevtoolsExtensionConnection, UseMemoReducerOptions } from './models';

import { ConnectionWithId, Return } from './connectionModule';

type ReturnType<A, S> = {
  dispatch: (action: A, state: S) => void;
  connection: ReduxDevtoolsExtensionConnection | null;
};

export const useReduxDevtools = <S, A>(
  noneReactiveState: MutableRefObject<S>,
  options?: UseMemoReducerOptions,
  listeners?: (change: unknown) => void,
): ReturnType<A, S> => {
  const connectionRef = useRef<ConnectionWithId | null>(null);
  useLayoutEffect(() => {
    connectionRef.current = connect(options?.id ?? '', noneReactiveState.current);
  }, [noneReactiveState, options?.id]);

  const onListenersRef = useRef(listeners);
  onListenersRef.current = listeners;

  const unsubscribe = useRef<() => void | null>();

  const subscribe = useCallback(() => {
    console.log('SUBSCRIBE...', { connection: connectionRef.current, onListenersRef });

    unsubscribe.current?.();

    return connectionRef.current?.subscribe(onListenersRef.current);
  }, []);

  const reconnect = useCallback(
    (payload: Return) => {
      console.log('RECONNECT...', { connection: connectionRef.current, payload });
      if (!isExist(connectionRef.current)) {
        return;
      }

      connectionRef.current = getConnection(connectionRef.current.id);
      unsubscribe.current = subscribe();
      connectionRef.current?.send({ type: '@@RECONNECT' }, noneReactiveState.current);
    },
    [noneReactiveState, subscribe],
  );

  useEffect(() => {
    disconnectObserver.subscribe(reconnect);

    return () => {
      disconnectObserver.unsubscribe(reconnect);
    };
  }, [reconnect]);

  useEffect(() => {
    if (!isExist(connectionRef.current)) {
      return;
    }

    unsubscribe.current = subscribe();

    return () => {
      if (!isExist(connectionRef.current)) {
        return;
      }

      unsubscribe.current?.();
      disconnect(connectionRef.current);
    };
  }, [subscribe]);

  const dispatch = useCallback((action: A, state: S) => {
    connectionRef.current?.send(action, state);
  }, []);

  return useMemo(() => ({ dispatch, connection: connectionRef.current }), [dispatch]);
};
