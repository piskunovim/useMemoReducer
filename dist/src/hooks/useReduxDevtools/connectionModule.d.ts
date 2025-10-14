import { ReduxDevtoolsExtensionConnection } from './models';
export type ConnectionWithId = ReduxDevtoolsExtensionConnection & {
    id: string;
};
type ById = {
    [key: string]: {
        connections: ConnectionWithId[];
        next: number;
    };
};
type Lookup = {
    [key: string]: ConnectionWithId;
};
export type ConnectionsPool = {
    byId: ById;
    lookup: Lookup;
};
export type Return = {
    connection: ConnectionWithId | null;
    connectionsPool: ConnectionsPool;
};
declare function createConnection(id: string): null | ConnectionWithId;
export declare function createConnectionModule(connectionFactory?: typeof createConnection): {
    addConnection: (baseId: string) => {
        connection: null;
        connectionsPool: ConnectionsPool;
    } | {
        connection: ConnectionWithId;
        connectionsPool: ConnectionsPool;
    };
    removeConnection: (connection: ConnectionWithId | null) => Return;
    getConnections: (baseId: string) => ConnectionWithId[];
    getConnectionById: (uniqueId: string) => ConnectionWithId;
    getConnectionsPool: () => ConnectionsPool;
    setConnectionsPool: (newConnectionsPool: ConnectionsPool) => void;
    createConnection: typeof createConnection;
};
export {};
//# sourceMappingURL=connectionModule.d.ts.map