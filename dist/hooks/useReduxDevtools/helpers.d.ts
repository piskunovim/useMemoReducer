import { ReduxDevtoolsExtension, ReduxDevtoolsExtensionConnection, UseMemoReducerOptions } from './models';
export declare const withDevTools: (name: string) => false | ReduxDevtoolsExtension;
export declare const getConnectionName: (options?: UseMemoReducerOptions) => string;
export declare const isDevtoolsExist: (connectionName: string) => false | ReduxDevtoolsExtension;
export declare const connect: (connectionName: string, state: unknown) => null | ReduxDevtoolsExtensionConnection;
export declare const disconnect: (connectionName: string) => void;
export declare const isEnabled: (connectionName: string) => boolean;
//# sourceMappingURL=helpers.d.ts.map