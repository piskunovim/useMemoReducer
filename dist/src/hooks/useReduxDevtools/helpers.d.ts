import { ConnectionWithId } from './connectionModule';
export declare function connect(id: string, state: unknown): null | ConnectionWithId;
export declare function disconnect(connection: ConnectionWithId | null): void;
export declare function getConnection(uniqueId: string): ConnectionWithId;
export declare function isExist(connection: ConnectionWithId | null): connection is ConnectionWithId;
//# sourceMappingURL=helpers.d.ts.map