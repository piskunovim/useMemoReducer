import { Selector, Subscriber } from '../models';
export type UseCurrentSelector = <S, TSelected = unknown>(selector: Selector<S, TSelected>, store: S, subscribers: {
    subscribe: (subscriber: Subscriber<S>) => void;
    unSubscribe: (subscriber: Subscriber<S>) => void;
}) => TSelected;
export declare const useCurrentSelector: UseCurrentSelector;
//# sourceMappingURL=useCurrentSelector.d.ts.map