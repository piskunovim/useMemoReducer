import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import {
  ComponentWithContext,
  COUNTER_VALUE_SELECTOR,
  DECREMENT_SELECTOR,
  INCREMENT_SELECTOR,
  counterServiceRerendersSpy,
} from './ComponentWithContext';

const renderComponent = () => {
  const result = render(<ComponentWithContext />);

  const { getByTestId } = result;

  const counterValue = getByTestId(COUNTER_VALUE_SELECTOR);
  const decrementButton = getByTestId(DECREMENT_SELECTOR);
  const incrementButton = getByTestId(INCREMENT_SELECTOR);

  return {
    ...result,
    counterValue,
    decrementButton,
    incrementButton,
  };
};

describe('Component with Context that uses useMemoReducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shouldn`t change the Service', () => {
    const { incrementButton, decrementButton, counterValue } = renderComponent();

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(decrementButton);

    expect(counterServiceRerendersSpy).toHaveBeenCalledTimes(1);
    expect(counterValue.textContent).toBe('2');
  });
});
