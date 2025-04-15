/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { disconnectObserver } from './DisconnectObserver';
import { connect, disconnect, getConnectionName, isDevtoolsExist, isEnabled } from './helpers';
import { ReduxDevtoolsExtensionConnection, UseMemoReducerOptions } from './models';

type ReturnType<A, S> = {
  devtoolsEnabled: () => boolean;
  dispatchToDevtools?: (action: A, state: S) => void;
  connection?: ReduxDevtoolsExtensionConnection;
};

export const useReduxDevtools = <S, A, O>(noneReactiveState: S, options?: O): ReturnType<A, S> => {
  const [connectionName] = useState(() => getConnectionName(options as UseMemoReducerOptions));
  const connection = useMemo(
    () => (isDevtoolsExist(connectionName) ? connect(connectionName, noneReactiveState) : null),
    [connectionName, noneReactiveState],
  );

  if (!connection) {
    return useMemo(() => ({ devtoolsEnabled: () => false }), []);
  }

  const unsubscribe = useRef<() => void | null>();

  const subscribe = useCallback(() => {
    unsubscribe.current?.();

    return connection?.subscribe(() => {
      // Implement monitors actions.
      // For example time traveling:
    });
  }, [connection]);

  const reconnect = useCallback(() => {
    connection?.send({ type: '@@RECONNECT' }, noneReactiveState);
    unsubscribe.current = subscribe();
  }, [connection, subscribe, noneReactiveState]);

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
    (action: A, state: S) => {
      connection?.send(action, state);
    },
    [connection],
  );

  const devtoolsEnabled = useCallback(() => {
    return isEnabled(connectionName);
  }, [connectionName]);

  return useMemo(
    () => ({ devtoolsEnabled, dispatchToDevtools, connection }),
    [devtoolsEnabled, dispatchToDevtools, connection],
  );
};
