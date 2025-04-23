import { disconnectObserver } from './DisconnectObserver';
import { createConnectionModule } from './connectionModule';

import { ConnectionWithId } from './connectionModule';

const { addConnection, removeConnection, getConnectionById } = createConnectionModule();

export function connect(id: string, state: unknown): null | ConnectionWithId {
  const result = addConnection(id);

  if (!result.connection) {
    if (id) {
      console.warn(`[useReduxDevtools] Connection ${id} was not created.`);
    }

    return result.connection;
  }

  result.connection.init(state);

  console.log('After connect', { connectionsPool: result.connectionsPool });

  return result.connection;
}

export function disconnect(connection: ConnectionWithId | null): void {
  const result = removeConnection(connection);

  if (!result.connection) {
    console.warn(`[useReduxDevtools] Connection was not removed.`);

    return;
  }

  console.log('After remove', { connectionsPool: result.connectionsPool });

  disconnectObserver.emit(result);
}

export function getConnection(uniqueId: string): ConnectionWithId {
  return getConnectionById(uniqueId);
}

export function isExist(connection: ConnectionWithId | null): connection is ConnectionWithId {
  return !!connection;
}
