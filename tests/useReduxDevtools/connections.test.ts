import {
  createConnectionModule,
  ConnectionWithId,
  ConnectionsPool,
} from '../../src/hooks/useReduxDevtools/connectionModule';
import { ReduxDevtoolsExtensionConnection } from '../../src/hooks/useReduxDevtools/models';

const isSignatureEqual = (obj: unknown, expectedObj: unknown) => {
  try {
    expect(JSON.stringify(obj)).toEqual(JSON.stringify(expectedObj));
  } catch (e) {
    expect(obj).toEqual(expectedObj);
  }
};

const connectionMock = (connection: Partial<ReduxDevtoolsExtensionConnection> & { id: string }): ConnectionWithId => {
  return {
    init: jest.fn(),
    send: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
    ...connection,
  };
};

const baseConnectionFactory = (id: string) => connectionMock({ id });

const createConnectionSpy = jest.fn();

describe('addConnection', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should add connection when baseId is empty', () => {
    const connectionBaseId = '';
    const expectedConnection = null;
    const expectedConnectionsPool: ConnectionsPool = {
      byId: {},
      lookup: {},
    };
    const { addConnection } = createConnectionModule(() => null);

    const result = addConnection(connectionBaseId);

    expect(result.connection).toEqual(expectedConnection);
    expect(result.connectionsPool).toEqual(expectedConnectionsPool);
  });

  it('should add connection when the Redux Devtools Extension is not defined', () => {
    const connectionBaseId = 'counter';
    const expectedConnection = null;
    const expectedConnectionsPool: ConnectionsPool = {
      byId: {},
      lookup: {},
    };
    const { addConnection } = createConnectionModule(createConnectionSpy);

    createConnectionSpy.mockReturnValue(expectedConnection);
    const result = addConnection(connectionBaseId);

    expect(result.connection).toEqual(expectedConnection);
    expect(result.connectionsPool).toEqual(expectedConnectionsPool);
  });

  it('should add connection', () => {
    const connectionBaseId = 'counter';
    const expectedConnection = connectionMock({ id: `${connectionBaseId}/1` });
    const { addConnection } = createConnectionModule(createConnectionSpy);

    const expectedConnectionsPool: ConnectionsPool = {
      byId: {
        [connectionBaseId]: {
          connections: [expectedConnection],
          next: 2,
        },
      },
      lookup: { [expectedConnection.id]: expectedConnection },
    };

    createConnectionSpy.mockReturnValue(expectedConnection);
    const result = addConnection(connectionBaseId);

    expect(result.connection).toEqual(expectedConnection);
    expect(result.connectionsPool).toEqual(expectedConnectionsPool);
  });

  it('should add multiple connections from the one group', () => {
    const connectionBaseId = 'counter';
    const expectedConnection1 = connectionMock({ id: `${connectionBaseId}/1` });
    const expectedConnection2 = connectionMock({ id: `${connectionBaseId}/2` });
    const { addConnection } = createConnectionModule(createConnectionSpy);

    const expectedConnectionsPool: ConnectionsPool = {
      byId: {
        [connectionBaseId]: {
          connections: [expectedConnection1, expectedConnection2],
          next: 3,
        },
      },
      lookup: { [expectedConnection1.id]: expectedConnection1, [expectedConnection2.id]: expectedConnection2 },
    };

    createConnectionSpy.mockReturnValue(expectedConnection1);
    addConnection(connectionBaseId);
    createConnectionSpy.mockReturnValue(expectedConnection2);
    const result = addConnection(connectionBaseId);

    expect(result.connection).toEqual(expectedConnection2);
    expect(result.connectionsPool).toEqual(expectedConnectionsPool);
  });

  it('should add multiple connections from various groups', () => {
    const connectionBaseId1 = 'counter';
    const connectionBaseId2 = 'anotherCounter';
    const expectedConnection1 = connectionMock({ id: `${connectionBaseId1}/1` });
    const expectedConnection2 = connectionMock({ id: `${connectionBaseId2}/1` });
    const { addConnection } = createConnectionModule(createConnectionSpy);

    const expectedConnectionsPool: ConnectionsPool = {
      byId: {
        [connectionBaseId1]: {
          connections: [expectedConnection1],
          next: 2,
        },
        [connectionBaseId2]: {
          connections: [expectedConnection2],
          next: 2,
        },
      },
      lookup: { [expectedConnection1.id]: expectedConnection1, [expectedConnection2.id]: expectedConnection2 },
    };

    createConnectionSpy.mockReturnValue(expectedConnection1);
    addConnection(connectionBaseId1);
    createConnectionSpy.mockReturnValue(expectedConnection2);
    const result = addConnection(connectionBaseId2);

    expect(result.connection).toEqual(expectedConnection2);
    expect(result.connectionsPool).toEqual(expectedConnectionsPool);
  });
});

describe('removeConnection', () => {
  it('should not remove the connection when initial connection`s pool is empty', () => {
    const connectionBaseId = 'counter';
    const expectedConnection = connectionMock({ id: `${connectionBaseId}/1` });
    const expectedConnectionsPool: ConnectionsPool = {
      byId: {},
      lookup: {},
    };

    const { removeConnection } = createConnectionModule(baseConnectionFactory);

    const result = removeConnection(expectedConnection);

    expect(expectedConnection.unsubscribe).toHaveBeenCalled();
    expect(expectedConnection.unsubscribe).toHaveBeenCalledTimes(1);
    expect(result.connection).toEqual(expectedConnection);
    expect(result.connectionsPool).toEqual(expectedConnectionsPool);
  });

  it('should remove the connection and call its unsubscribe method', () => {
    const connectionBaseId = 'counter';
    const expectedConnection = connectionMock({ id: `${connectionBaseId}/1` });
    const initialConnectionsPool: ConnectionsPool = {
      byId: {
        [connectionBaseId]: {
          connections: [expectedConnection],
          next: 2,
        },
      },
      lookup: { [expectedConnection.id]: expectedConnection },
    };
    const expectedConnectionsPool: ConnectionsPool = {
      byId: {},
      lookup: {},
    };
    const { removeConnection, setConnectionsPool } = createConnectionModule(createConnectionSpy);
    setConnectionsPool(initialConnectionsPool);

    createConnectionSpy.mockImplementation(connectionMock);
    const result = removeConnection(expectedConnection);

    expect(expectedConnection.unsubscribe).toHaveBeenCalled();
    expect(expectedConnection.unsubscribe).toHaveBeenCalledTimes(1);
    expect(result.connection).toEqual(expectedConnection);
    expect(result.connectionsPool).toEqual(expectedConnectionsPool);
  });

  it('should not change the connections when the connection to remove wasn`t passed', () => {
    const connectionBaseId = 'counter';
    const expectedConnection = connectionMock({ id: `${connectionBaseId}/1` });
    const initialConnectionsPool: ConnectionsPool = {
      byId: { [connectionBaseId]: { connections: [expectedConnection], next: 2 } },
      lookup: { [expectedConnection.id]: expectedConnection },
    };
    const { removeConnection, setConnectionsPool } = createConnectionModule(baseConnectionFactory);
    setConnectionsPool(initialConnectionsPool);

    const result = removeConnection(null);

    expect(result.connection).toEqual(null);
    expect(result.connectionsPool).toEqual(initialConnectionsPool);
  });

  it('should remove the connection and reconnect the rest in the same group', () => {
    const connectionBaseId = 'counter';
    const conn1 = connectionMock({ id: `${connectionBaseId}/1` });
    const conn2 = connectionMock({ id: `${connectionBaseId}/2` });
    const initialConnectionsPool: ConnectionsPool = {
      byId: { [connectionBaseId]: { connections: [conn1, conn2], next: 3 } },
      lookup: { [conn1.id]: conn1, [conn2.id]: conn2 },
    };
    const expectedConnectionsPool: ConnectionsPool = {
      byId: { [connectionBaseId]: { connections: [conn2], next: 3 } },
      lookup: { [conn2.id]: conn2 },
    };
    const { removeConnection, setConnectionsPool } = createConnectionModule(baseConnectionFactory);
    setConnectionsPool(initialConnectionsPool);

    const result = removeConnection(conn1);

    isSignatureEqual(result.connection, conn1);
    isSignatureEqual(result.connectionsPool, expectedConnectionsPool);
  });

  it('should remove the connection and reconnect the rest in different groups', () => {
    const connectionBaseId1 = 'counter';
    const conn1 = connectionMock({ id: `${connectionBaseId1}/1` });
    const conn2 = connectionMock({ id: `${connectionBaseId1}/2` });
    const connectionBaseId2 = 'anotherCounter';
    const conn3 = connectionMock({ id: `${connectionBaseId2}/1` });
    const conn4 = connectionMock({ id: `${connectionBaseId2}/2` });
    const initialConnectionsPool: ConnectionsPool = {
      byId: {
        [connectionBaseId1]: { connections: [conn1, conn2], next: 3 },
        [connectionBaseId2]: { connections: [conn3, conn4], next: 3 },
      },
      lookup: { [conn1.id]: conn1, [conn2.id]: conn2, [conn3.id]: conn3, [conn4.id]: conn4 },
    };
    const expectedConnectionsPool: ConnectionsPool = {
      byId: {
        [connectionBaseId1]: { connections: [conn1], next: 3 },
        [connectionBaseId2]: { connections: [conn3, conn4], next: 3 },
      },
      lookup: { [conn1.id]: conn1, [conn3.id]: conn3, [conn4.id]: conn4 },
    };
    const { removeConnection, setConnectionsPool } = createConnectionModule(baseConnectionFactory);
    setConnectionsPool(initialConnectionsPool);

    const result = removeConnection(conn2);

    isSignatureEqual(result.connection, conn2);
    isSignatureEqual(result.connectionsPool, expectedConnectionsPool);
  });
});

describe('getConnections', () => {
  it('should return connections', () => {
    const connectionBaseId = 'counter';
    const expectedConnection = connectionMock({ id: `${connectionBaseId}/1` });
    const initialConnectionsPool: ConnectionsPool = {
      byId: {
        [connectionBaseId]: {
          connections: [expectedConnection],
          next: 2,
        },
      },
      lookup: { [expectedConnection.id]: expectedConnection },
    };

    const { getConnections, setConnectionsPool } = createConnectionModule();
    setConnectionsPool(initialConnectionsPool);

    expect(getConnections(connectionBaseId)).toEqual(initialConnectionsPool.byId[connectionBaseId].connections);
  });

  it('should return empty array of connections when there isn`t the group by baseId', () => {
    const connectionBaseId = 'counter';
    const expectedConnection = connectionMock({ id: `${connectionBaseId}/1` });
    const initialConnectionsPool: ConnectionsPool = {
      byId: {
        [connectionBaseId]: {
          connections: [expectedConnection],
          next: 2,
        },
      },
      lookup: { [expectedConnection.id]: expectedConnection },
    };

    const { getConnections, setConnectionsPool } = createConnectionModule();
    setConnectionsPool(initialConnectionsPool);

    expect(getConnections('anotherCounter')).toEqual([]);
  });
});

describe('getConnectionById', () => {
  it('should return connection', () => {
    const connectionBaseId = 'counter';
    const expectedConnection = connectionMock({ id: `${connectionBaseId}/1` });
    const initialConnectionsPool: ConnectionsPool = {
      byId: {
        [connectionBaseId]: {
          connections: [expectedConnection],
          next: 2,
        },
      },
      lookup: { [expectedConnection.id]: expectedConnection },
    };

    const { getConnectionById, setConnectionsPool } = createConnectionModule();
    setConnectionsPool(initialConnectionsPool);

    expect(getConnectionById(expectedConnection.id)).toEqual(expectedConnection);
  });

  it('should return undefined when there isn`t connection', () => {
    const connectionBaseId = 'counter';
    const expectedConnection = connectionMock({ id: `${connectionBaseId}/1` });
    const initialConnectionsPool: ConnectionsPool = {
      byId: {
        [connectionBaseId]: {
          connections: [expectedConnection],
          next: 2,
        },
      },
      lookup: { [expectedConnection.id]: expectedConnection },
    };

    const { getConnectionById, setConnectionsPool } = createConnectionModule();
    setConnectionsPool(initialConnectionsPool);

    expect(getConnectionById('anotherCounter')).not.toBeDefined();
  });
});
