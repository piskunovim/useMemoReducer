import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import {
  SimpleComponent,
  COUNT_VALUE_SELECTOR,
  CHANGE_OBJECT_SELECTOR,
  DECREMENT_SELECTOR,
  INCREMENT_SELECTOR,
  OBJECT_VALUE_SELECTOR,
  CURENT_RENDERS_COUNT_SELECTOR,
  ALL_RENDERS_COUNT_SELECTOR,
} from './SimleComponent';
import {
  COUNTER_CURENT_RENDERS_COUNT_SELECTOR,
  ComponentWithContext,
  OBJECT_VIEWER_CURENT_RENDERS_COUNT_SELECTOR,
} from './ComponentWithContext';

describe('useMemoReducer', () => {
  it('should initialize correctly', () => {
    const { getByTestId } = render(<SimpleComponent />);
    const countValue = getByTestId(COUNT_VALUE_SELECTOR);
    const objectValue = getByTestId(OBJECT_VALUE_SELECTOR);

    expect(countValue.textContent).toBe('0');
    expect(objectValue.textContent).toBe(JSON.stringify({ value: 'Some value' }));
  });

  it('should handle increment and decrement correctly', () => {
    const { getByTestId } = render(<SimpleComponent />);
    const decrementButton = getByTestId(DECREMENT_SELECTOR);
    const incrementButton = getByTestId(INCREMENT_SELECTOR);
    const countValue = getByTestId(COUNT_VALUE_SELECTOR);

    expect(countValue.textContent).toBe('0');

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    expect(countValue.textContent).toBe('2');

    fireEvent.click(decrementButton);
    expect(countValue.textContent).toBe('1');
  });

  it('should have the correct state after multiple different actions', () => {
    const { getByTestId } = render(<SimpleComponent />);
    const decrementButton = getByTestId(DECREMENT_SELECTOR);
    const incrementButton = getByTestId(INCREMENT_SELECTOR);
    const countValue = getByTestId('count-value');

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(decrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(decrementButton);

    expect(countValue.textContent).toBe('1');
  });

  it('shouldn`t fire a useEffect correctly when a part of the state wasn`t changed', () => {
    const { getByTestId } = render(<SimpleComponent />);
    const incrementButton = getByTestId(INCREMENT_SELECTOR);
    const decrementButton = getByTestId(DECREMENT_SELECTOR);
    const allRendersCount = getByTestId(ALL_RENDERS_COUNT_SELECTOR);
    const currentRendersCount = getByTestId(CURENT_RENDERS_COUNT_SELECTOR);
    const countValue = getByTestId(COUNT_VALUE_SELECTOR);
    const objectValue = getByTestId(OBJECT_VALUE_SELECTOR);
    const initialAllRenders = allRendersCount.textContent;

    expect(initialAllRenders).toBe('1');

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(decrementButton);

    expect(currentRendersCount.textContent).toBe('0');
    expect(allRendersCount.textContent).toBe('5');
    expect(countValue.textContent).toBe('2');
    expect(objectValue.textContent).toBe(JSON.stringify({ value: 'Some value' }));
  });

  it('should fire a useEffect correctly when a part of the state was changed', () => {
    const { getByTestId } = render(<SimpleComponent />);
    const changeObjectButton = getByTestId(CHANGE_OBJECT_SELECTOR);
    const allRendersCount = getByTestId(ALL_RENDERS_COUNT_SELECTOR);
    const currentRendersCount = getByTestId(CURENT_RENDERS_COUNT_SELECTOR);
    const objectValue = getByTestId(OBJECT_VALUE_SELECTOR);
    const initialAllRenders = allRendersCount.textContent;
    const initialCurrentRenders = currentRendersCount.textContent;

    expect(initialAllRenders).toBe('1');
    expect(initialCurrentRenders).toBe('0');

    fireEvent.click(changeObjectButton);
    fireEvent.click(changeObjectButton);

    expect(allRendersCount.textContent).toBe('3');
    expect(currentRendersCount.textContent).toBe('2');
    expect(objectValue.textContent).toBe(JSON.stringify({ value: 'Some value changed' }));
  });
});

describe('useMemoReducer with with the ContextApi', () => {
  it('should rerender only a component which data was changed', () => {
    const { getByTestId } = render(<ComponentWithContext />);
    const incrementButton = getByTestId(INCREMENT_SELECTOR);
    const decrementButton = getByTestId(DECREMENT_SELECTOR);
    const counterCurrentRendersCount = getByTestId(COUNTER_CURENT_RENDERS_COUNT_SELECTOR);
    const objectViewerCurrentRendersCount = getByTestId(OBJECT_VIEWER_CURENT_RENDERS_COUNT_SELECTOR);
    const countValue = getByTestId(COUNT_VALUE_SELECTOR);
    const objectValue = getByTestId(OBJECT_VALUE_SELECTOR);
    const initialCounterCurrentRenders = counterCurrentRendersCount.textContent;
    const initialObjectViewerCounterCurrentRenders = objectViewerCurrentRendersCount.textContent;

    expect(initialCounterCurrentRenders).toBe('0');
    expect(initialObjectViewerCounterCurrentRenders).toBe('0');

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(decrementButton);

    expect(counterCurrentRendersCount.textContent).toBe('4');
    expect(objectViewerCurrentRendersCount.textContent).toBe('0');
    expect(countValue.textContent).toBe('2');
    expect(objectValue.textContent).toBe(JSON.stringify({ value: 'Some value' }));
  });
});
