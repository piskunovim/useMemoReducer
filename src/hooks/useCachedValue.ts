import { useRef } from 'react';

export const useCachedValue = <T>(value: T): T => {
  const valueRef = useRef(value);

  return valueRef.current;
};
