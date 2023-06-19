import { REDUX_DEVTOOLS_KEY } from '../constants';
import { ReduxDevtoolsExtension } from './ReduxDevtoolsExtension';

export type WindowWithDevTools = Window & {
  [REDUX_DEVTOOLS_KEY]: ReduxDevtoolsExtension;
};
