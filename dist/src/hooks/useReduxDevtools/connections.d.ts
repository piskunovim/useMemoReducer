import { ReduxDevtoolsExtension, ReduxDevtoolsExtensionConnection } from './models';
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
type ConnectionsPool = {
    byId: ById;
    lookup: Lookup;
};
export declare function createConnectionsPool(): ConnectionsPool;
export type Return = {
    connection: ConnectionWithId | null;
    connectionsPool: ConnectionsPool;
};
export declare function addConnection(connectionsPool: ConnectionsPool, baseId: string): Return;
export declare function getConnections(connectionsPool: ConnectionsPool, baseId: string): ReduxDevtoolsExtensionConnection[];
export declare function getConnectionById(connectionsPool: ConnectionsPool, uniqueId: string): ConnectionWithId;
export declare function removeConnection(connectionsPool: ConnectionsPool, connection: ConnectionWithId | null): Return;
export declare function withDevTools(): false | ReduxDevtoolsExtension;
export declare function refreshActiveConnections(connectionsPool: ConnectionsPool): ConnectionsPool;
export {};
//# sourceMappingURL=connections.d.ts.map