import { REDUX_DEVTOOLS_KEY } from './constants';
import { disconnectObserver } from './DisconnectObserver';
import { ReduxDevtoolsExtension, ReduxDevtoolsExtensionConnection, WindowWithDevTools } from './models';

const getDevtoolsExtenstion = (arg: Window | WindowWithDevTools): false | ReduxDevtoolsExtension =>
  REDUX_DEVTOOLS_KEY in arg && (arg as WindowWithDevTools)[REDUX_DEVTOOLS_KEY];

const getUniqueName = (name: string) => `[useMemoReducer] ${name}`;

export const withDevTools = (name: string): false | ReduxDevtoolsExtension =>
  process.env.NODE_ENV === 'development' &&
  name !== '' &&
  typeof window !== 'undefined' &&
  getDevtoolsExtenstion(window);

const createConnection = (
  devtoolsExt: false | ReduxDevtoolsExtension,
  name: string,
): null | ReduxDevtoolsExtensionConnection => {
  if (!devtoolsExt) {
    return null;
  }

  return devtoolsExt.connect({ name: getUniqueName(name), trace: true, instanceId: getUniqueName(name) });
};

const getStackTrace = (): string => {
  const obj: { stack?: string } = {};
  Error.captureStackTrace(obj, getStackTrace);

  return obj?.stack ?? '';
};

const connections = new Map<string, ReduxDevtoolsExtensionConnection[]>([]);

const parseConnectionName = (connectionName: string): [string, number] => {
  const [name, number] = connectionName.split('/') as [string, number];

  return [name, number - 1];
};

export const getConnectionName = (): string => {
  try {
    const moduleStr = getStackTrace().split('\n')[9];
    const moduleName = moduleStr.trim().split(' ')[1];

    const connectionsByName = connections.get(moduleName) ?? [];
    const currentVersion = connectionsByName.length > 0 ? connectionsByName.length + 1 : 1;

    return `${moduleName}/${currentVersion}`;
  } catch (e) {
    // Now the useReduxDevtools works only for crome-extension
    return '';
  }
};

const removeConnection = (connectionName: string): void => {
  const [name, index] = parseConnectionName(connectionName);

  const connectionsByName = connections.get(name) ?? [];
  const currentConnection = connectionsByName[index];

  if (!currentConnection) {
    console.warn(`[useMemoReducer] Connection ${connectionName} is not exists`);

    return;
  }

  const newConnections = connectionsByName.filter((_, idx) => idx !== index);

  if (newConnections.length === 0) {
    connections.delete(name);
  } else {
    connections.set(name, newConnections);
  }
};

export const isDevtoolsExist = (connectionName: string): false | ReduxDevtoolsExtension => {
  return connectionName !== '' && withDevTools(connectionName);
};

export const connect = (connectionName: string, state: unknown): null | ReduxDevtoolsExtensionConnection => {
  const [name, index] = parseConnectionName(connectionName);

  const connectionsByName = connections.get(name) ?? [];
  const currentConnection = connectionsByName[index];

  if (currentConnection) {
    return currentConnection;
  }

  const newConnection = createConnection(withDevTools(connectionName), connectionName);

  if (!newConnection) {
    console.warn(`[useReduxDevtools] Connection ${connectionName} was not created.`);

    return null;
  }

  connections.set(name, [...connectionsByName, newConnection]);
  newConnection.init(state);

  return newConnection;
};

export const disconnect = (connectionName: string): void => {
  removeConnection(connectionName);

  const devtoolsExt = withDevTools(connectionName);

  if (devtoolsExt) {
    devtoolsExt.disconnect();
    disconnectObserver.emit();
  }
};

export const isEnabled = (connectionName: string): boolean => {
  const [name, number] = parseConnectionName(connectionName);

  return typeof connections.get(name)?.[number] !== 'undefined';
};
