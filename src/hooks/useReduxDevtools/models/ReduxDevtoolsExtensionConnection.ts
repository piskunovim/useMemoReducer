export type ReduxDevtoolsExtensionConnection = {
  init: (initialState: unknown) => void;
  subscribe(listener?: (change: unknown) => void): () => void;
  unsubscribe(): void;
  send(action: unknown, state: unknown): void;
};
