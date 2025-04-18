import { disconnectObserver } from './DisconnectObserver';

import { addConnection, removeConnection, createConnectionsPool, ConnectionWithId } from './connections';

let connectionsPool = createConnectionsPool();

export function connect(id: string, state: unknown): null | ConnectionWithId {
  const result = addConnection(connectionsPool, id);

  if (!result.connection) {
    if (id) {
      console.warn(`[useReduxDevtools] Connection ${id} was not created.`);
    }

    return result.connection;
  }

  result.connection.init(state);

  connectionsPool = result.connectionsPool;

  console.log('After connect', { connectionsPool });

  return result.connection;
}

export function disconnect(connection: ConnectionWithId | null): void {
  const res = removeConnection(connectionsPool, connection);

  if (!res.connection) {
    console.warn(`[useReduxDevtools] Connection was not created.`);

    return;
  }

  connectionsPool = res.connectionsPool;

  console.log('After remove', { connectionsPool });

  disconnectObserver.emit();
}

export function isExist(connection: ConnectionWithId | null): connection is ConnectionWithId {
  return !!connection;
}
