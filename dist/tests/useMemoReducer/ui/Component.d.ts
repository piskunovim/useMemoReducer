/// <reference types="jest" />
import { FC } from 'react';
import { State, Actions } from './reducer';
export declare const COUNTER_VALUE_SELECTOR = "counter-value";
export declare const INCREMENT_SELECTOR = "increment";
export declare const DECREMENT_SELECTOR = "decrement";
export declare const BATCH_INCREMENT_SELECTOR = "batch-increment";
export declare const CHANGE_OBJECT_SELECTOR = "change-object";
export declare const OBJECT_VALUE_SELECTOR = "object-value";
export declare const allPartsOfStateRerendersSpy: jest.Mock<any, any, any>;
export declare const objectRerendersSpy: jest.Mock<any, any, any>;
export declare const counterRerendersSpy: jest.Mock<any, any, any>;
type Props = {
    reducer?: (state: State, action: Actions) => State;
    initialState?: State;
};
export declare const SimpleComponent: FC<Props>;
export {};
//# sourceMappingURL=Component.d.ts.map