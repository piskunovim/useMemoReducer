/// <reference types="jest" />
import { FC } from 'react';
import { Thunk } from './reducer';
export declare const incrementAction: () => Thunk<void>;
export declare const decrementAction: () => Thunk<void>;
export declare const COUNTER_VALUE_SELECTOR = "counter-value";
export declare const INCREMENT_SELECTOR = "increment";
export declare const DECREMENT_SELECTOR = "decrement";
export declare const counterServiceRerendersSpy: jest.Mock<any, any, any>;
export declare const ComponentWithContext: FC;
//# sourceMappingURL=ComponentWithContext.d.ts.map