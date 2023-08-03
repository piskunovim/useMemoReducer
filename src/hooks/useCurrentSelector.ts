import { useCallback, useEffect, useRef, useState } from 'react';

import { Selector, Subscriber } from '../models';

export type UseCurrentSelector = <S, TSelected = unknown>(
  selector: Selector<S, TSelected>,
  store: S,
  subscribers: {
    subscribe: (subscriber: Subscriber<S>) => void;
    unSubscribe: (subscriber: Subscriber<S>) => void;
  },
) => TSelected;

export const useCurrentSelector: UseCurrentSelector = (selector, store, { subscribe, unSubscribe }) => {
  const [, forceRender] = useState(0);

  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const selectedStateRef = useRef(selector(store));
  selectedStateRef.current = selector(store);

  const checkForUpdates = useCallback((newStore: typeof store) => {
    // Compare new selected state to the last time this hook ran
    const newState = selectorRef.current(newStore);
    // If new state differs from previous state, rerun this hook
    if (newState !== selectedStateRef.current) forceRender((s) => s + 1);
  }, []);

  const isSubscribed = useRef(false);

  const cleanUp = useCallback(() => {
    isSubscribed.current = false;
    unSubscribe(checkForUpdates);
  }, [unSubscribe, checkForUpdates]);

  useEffect(() => {
    if (!isSubscribed.current) {
      subscribe(checkForUpdates);
    }
    isSubscribed.current = true;

    return cleanUp;
  }, [checkForUpdates, cleanUp, subscribe]);

  return selectedStateRef.current;
};
