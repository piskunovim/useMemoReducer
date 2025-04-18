import { REDUX_DEVTOOLS_KEY } from './constants';
import { ReduxDevtoolsExtension, ReduxDevtoolsExtensionConnection, WindowWithDevTools } from './models';

export type ConnectionWithId = ReduxDevtoolsExtensionConnection & { id: string };
type ById = { [key: string]: { connections: ConnectionWithId[]; next: number } };
type Lookup = { [key: string]: ConnectionWithId };

type ConnectionsPool = {
  byId: ById;
  lookup: Lookup;
};

export function createConnectionsPool(): ConnectionsPool {
  return {
    byId: {}, // { connectionId: { connections: [...], next: 2 } }
    lookup: {}, // { "connectionId": connectionObject, "connectionId/2": connectionObject, ... }
  };
}

type Return = {
  connection: ConnectionWithId | null;
  connectionsPool: ConnectionsPool;
};

export function addConnection(connectionsPool: ConnectionsPool, baseId: string): Return {
  if (!baseId) {
    return { connection: null, connectionsPool };
  }

  const byId = { ...connectionsPool.byId };
  const lookup = { ...connectionsPool.lookup };

  let baseState = byId[baseId] || { connections: [], next: 2 };

  let newId;
  if (baseState.connections.length === 0) {
    newId = `${baseId}/${1}`;
  } else {
    newId = `${baseId}/${baseState.next}`;
    baseState = { ...baseState, next: baseState.next + 1 };
  }

  const connection = createConnection(newId);

  if (!connection) {
    return {
      connection: null,
      connectionsPool,
    };
  }

  const newConnections = [...baseState.connections, connection];

  byId[baseId] = { ...baseState, connections: newConnections };

  lookup[newId] = connection;

  return {
    connection,
    connectionsPool: { byId, lookup },
  };
}

export function getConnections(connectionsPool: ConnectionsPool, baseId: string): ReduxDevtoolsExtensionConnection[] {
  return connectionsPool.byId[baseId]?.connections || [];
}

export function getConnectionById(connectionsPool: ConnectionsPool, uniqueId: string) {
  return connectionsPool.lookup[uniqueId];
}

export function removeConnection(connectionsPool: ConnectionsPool, connection: ConnectionWithId | null): Return {
  if (!connection) return { connection: null, connectionsPool };

  const byId = { ...connectionsPool.byId };
  const lookup = { ...connectionsPool.lookup };

  delete lookup[connection.id];

  const baseId = connection.id.split('/')[0];

  const baseState = byId[baseId];
  const newConnections = baseState.connections.filter((conn) => conn.id !== connection.id);

  connection.unsubscribe();

  if (newConnections.length === 0) {
    delete byId[baseId];

    const newConnectionsPool = refreshActiveConnections({
      byId,
      lookup,
    });

    return { connection, connectionsPool: newConnectionsPool };
  }

  byId[baseId] = { ...baseState, connections: newConnections };

  const newConnectionsPool = refreshActiveConnections({
    byId,
    lookup,
  });

  return { connection, connectionsPool: newConnectionsPool };
}

function getDevtoolsExtension(arg: Window | WindowWithDevTools): false | ReduxDevtoolsExtension {
  return REDUX_DEVTOOLS_KEY in arg && (arg as WindowWithDevTools)[REDUX_DEVTOOLS_KEY];
}

function getUniqueName(id: string) {
  return `[useMemoReducer] ${id}`;
}

export function withDevTools(): false | ReduxDevtoolsExtension {
  return process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && getDevtoolsExtension(window);
}

function createConnection(id: string): null | ConnectionWithId {
  const devtoolsExt = withDevTools();

  if (!devtoolsExt) {
    return null;
  }

  return { id, ...devtoolsExt.connect({ name: getUniqueName(id), trace: true, instanceId: getUniqueName(id) }) };
}

export function refreshActiveConnections(connectionsPool: ConnectionsPool): ConnectionsPool {
  const devtoolsExt = withDevTools();
  if (!devtoolsExt) return connectionsPool;

  devtoolsExt.disconnect();

  let newPool: ConnectionsPool = createConnectionsPool();

  Object.keys(connectionsPool.lookup).forEach((baseId) => {
    newPool = addConnection(newPool, baseId.split('/')[0]).connectionsPool;
  });

  console.log('Connections after refresh...', { connectionsPool, newPool });

  return newPool;
}
