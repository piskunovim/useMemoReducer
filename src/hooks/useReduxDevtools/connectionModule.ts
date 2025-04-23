import { REDUX_DEVTOOLS_KEY } from './constants';
import { ReduxDevtoolsExtension, ReduxDevtoolsExtensionConnection, WindowWithDevTools } from './models';

export type ConnectionWithId = ReduxDevtoolsExtensionConnection & { id: string };
type ById = { [key: string]: { connections: ConnectionWithId[]; next: number } };
type Lookup = { [key: string]: ConnectionWithId };

export type ConnectionsPool = {
  byId: ById;
  lookup: Lookup;
};

export type Return = {
  connection: ConnectionWithId | null;
  connectionsPool: ConnectionsPool;
};

function withDevTools(): false | ReduxDevtoolsExtension {
  return process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && getDevtoolsExtension(window);
}

function getDevtoolsExtension(arg: Window | WindowWithDevTools): false | ReduxDevtoolsExtension {
  return REDUX_DEVTOOLS_KEY in arg && (arg as WindowWithDevTools)[REDUX_DEVTOOLS_KEY];
}

function getUniqueName(id: string) {
  return `[useMemoReducer] ${id}`;
}

function createConnection(id: string): null | ConnectionWithId {
  const devtoolsExt = withDevTools();

  if (!devtoolsExt) {
    return null;
  }

  return { id, ...devtoolsExt.connect({ name: getUniqueName(id), trace: true, instanceId: getUniqueName(id) }) };
}

export function createConnectionModule(connectionFactory = createConnection) {
  let connectionsPool = createConnectionsPool();

  return {
    addConnection,
    removeConnection,
    getConnections,
    getConnectionById,
    getConnectionsPool,
    setConnectionsPool,
    createConnection,
  };

  function addConnection(baseId: string) {
    const connectionsPool = getConnectionsPool();

    if (!baseId) {
      return { connection: null, connectionsPool };
    }

    let baseState = connectionsPool.byId[baseId] || { connections: [], next: 2 };

    let newId;
    if (baseState.connections.length === 0) {
      newId = `${baseId}/${1}`;
    } else {
      newId = `${baseId}/${baseState.next}`;
      baseState = { ...baseState, next: baseState.next + 1 };
    }
    const connection = connectionFactory(newId);

    if (!connection) {
      return {
        connection: null,
        connectionsPool: getConnectionsPool(),
      };
    }

    setConnectionsPool({
      byId: {
        ...connectionsPool.byId,
        [baseId]: {
          ...baseState,
          connections: [...baseState.connections, connection],
        },
      },
      lookup: {
        ...connectionsPool.lookup,
        [newId]: connection,
      },
    });

    return {
      connection,
      connectionsPool: getConnectionsPool(),
    };
  }

  function removeConnection(connection: ConnectionWithId | null): Return {
    const connectionsPool = getConnectionsPool();

    if (!connection) return { connection: null, connectionsPool };

    const byId = { ...connectionsPool.byId };
    const lookup = { ...connectionsPool.lookup };

    delete lookup[connection.id];

    const baseId = getBaseId(connection.id);

    const baseState = byId[baseId];
    const newConnections = (baseState?.connections ?? []).filter((conn) => conn.id !== connection.id);

    connection.unsubscribe();

    if (newConnections.length === 0) {
      delete byId[baseId];
    } else {
      byId[baseId] = { ...baseState, connections: newConnections };
    }

    setConnectionsPool(
      refreshActiveConnections({
        byId,
        lookup,
      }),
    );

    return { connection, connectionsPool: getConnectionsPool() };
  }

  function getConnections(baseId: string): ConnectionWithId[] {
    return connectionsPool.byId[baseId]?.connections || [];
  }

  function getConnectionById(uniqueId: string) {
    return connectionsPool.lookup[uniqueId];
  }

  function getConnectionsPool() {
    return connectionsPool;
  }

  /**
   * Private methods
   */

  function setConnectionsPool(newConnectionsPool: ConnectionsPool) {
    connectionsPool = newConnectionsPool;
  }

  function refreshConnection(connectionsPool: ConnectionsPool, uniqueId: string, lastNext: number): ConnectionsPool {
    if (!uniqueId) {
      return connectionsPool;
    }

    const byId = { ...connectionsPool.byId };
    const lookup = { ...connectionsPool.lookup };

    const baseId = getBaseId(uniqueId);

    let baseState = byId[baseId] || { connections: [], next: lastNext };

    let newId = uniqueId;
    if (baseState.connections.length > 0) {
      baseState = { ...baseState, next: lastNext };
    }

    const connection = connectionFactory(newId);

    if (!connection) {
      return connectionsPool;
    }

    const newConnections = [...baseState.connections, connection];

    byId[baseId] = { ...baseState, connections: newConnections };

    lookup[newId] = connection;

    return {
      byId,
      lookup,
    };
  }

  function refreshActiveConnections(connectionsPool: ConnectionsPool): ConnectionsPool {
    const devtoolsExt = withDevTools();
    // istanbul ignore next
    if (devtoolsExt) {
      devtoolsExt.disconnect();
    }

    let newPool: ConnectionsPool = createConnectionsPool();

    Object.keys(connectionsPool.lookup).forEach((uniqueId) => {
      const { next } = connectionsPool.byId[getBaseId(uniqueId)];

      newPool = refreshConnection(newPool, uniqueId, next);
    });

    return newPool;
  }

  function getBaseId(uniqueId: string) {
    return uniqueId.split('/')[0];
  }

  function createConnectionsPool(): ConnectionsPool {
    return {
      byId: {},
      lookup: {},
    };
  }
}
