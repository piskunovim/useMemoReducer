import { EnhancerOptions } from 'redux-devtools-extension';

import { ReduxDevtoolsExtensionConnection } from './ReduxDevtoolsExtensionConnection';

export type ReduxDevtoolsExtension = {
  connect(options: EnhancerOptions & { instanceId?: string }): ReduxDevtoolsExtensionConnection;
  disconnect(): void;
  send(
    action: unknown,
    state: unknown,
    options?: boolean | { serialize: boolean | Record<string, unknown> },
    instanceId?: string,
  ): void;
};
