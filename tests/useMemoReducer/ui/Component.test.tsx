import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import {
  SimpleComponent,
  COUNTER_VALUE_SELECTOR,
  DECREMENT_SELECTOR,
  INCREMENT_SELECTOR,
  BATCH_INCREMENT_SELECTOR,
  OBJECT_VALUE_SELECTOR,
  objectRerendersSpy,
  allPartsOfStateRerendersSpy,
  counterRerendersSpy,
} from './Component';

const renderComponent = () => {
  const result = render(<SimpleComponent />);

  const { getByTestId } = result;

  const counterValue = getByTestId(COUNTER_VALUE_SELECTOR);
  const objectValue = getByTestId(OBJECT_VALUE_SELECTOR);
  const decrementButton = getByTestId(DECREMENT_SELECTOR);
  const incrementButton = getByTestId(INCREMENT_SELECTOR);
  const batchIncrementButton = getByTestId(BATCH_INCREMENT_SELECTOR);

  return {
    ...result,
    counterValue,
    objectValue,
    decrementButton,
    incrementButton,
    batchIncrementButton,
  };
};

describe('Component with useMemoReducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be initialized correctly', () => {
    const { counterValue, objectValue } = renderComponent();

    expect(allPartsOfStateRerendersSpy).toHaveBeenCalledTimes(1);
    expect(objectRerendersSpy).toHaveBeenCalledTimes(1);
    expect(counterValue.textContent).toBe('0');
    expect(objectValue.textContent).toBe(JSON.stringify({ value: 'Some value' }));
  });

  it('should handle increment action correctly', () => {
    const { counterValue, incrementButton } = renderComponent();

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);

    expect(counterRerendersSpy).toHaveBeenCalledTimes(3);
    expect(counterValue.textContent).toBe('2');
  });

  it('should handle different actions correctly', () => {
    const { counterValue, incrementButton, decrementButton } = renderComponent();

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(decrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(decrementButton);

    expect(counterValue.textContent).toBe('1');
    expect(counterRerendersSpy).toHaveBeenCalledTimes(6);
  });

  it('should change only the part of the state that was changed if this part', () => {
    const { incrementButton, decrementButton, counterValue, objectValue } = renderComponent();

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(decrementButton);

    expect(objectRerendersSpy).toHaveBeenCalledTimes(1);
    expect(counterRerendersSpy).toHaveBeenCalledTimes(4);
    expect(counterValue.textContent).toBe('1');
    expect(objectValue.textContent).toBe(JSON.stringify({ value: 'Some value' }));
  });

  it('should correctly work with the react batching', () => {
    const { batchIncrementButton, counterValue } = renderComponent();

    fireEvent.click(batchIncrementButton);

    expect(counterRerendersSpy).toHaveBeenCalledTimes(2);
    expect(counterValue.textContent).toBe('3');
  });
});
