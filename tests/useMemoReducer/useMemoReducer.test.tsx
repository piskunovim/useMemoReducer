import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { useMemoReducer } from '../../src';
import {
  CHANGE_OBJECT_SELECTOR,
  COUNT_VALUE_SELECTOR,
  DECREMENT_SELECTOR,
  DefaultTestComponent,
  INCREMENT_SELECTOR,
  OBJECT_VALUE_SELECTOR,
  SIDE_EFFECT_RENDER_COUNT_SELECTOR,
  TestComponentWithoutRenders,
} from './defaultComponent';

describe('useMemoReducer', () => {
  it('should initialize correctly', () => {
    const { getByTestId } = render(<DefaultTestComponent />);
    const countValue = getByTestId(COUNT_VALUE_SELECTOR);
    const objectValue = getByTestId(OBJECT_VALUE_SELECTOR);

    expect(countValue.textContent).toBe('0');
    expect(objectValue.textContent).toBe(JSON.stringify({ value: 'Some value' }));
  });

  it('should handle increment and decrement correctly', () => {
    const { getByTestId } = render(<DefaultTestComponent />);
    const decrementButton = getByTestId(DECREMENT_SELECTOR);
    const incrementButton = getByTestId(INCREMENT_SELECTOR);
    const countValue = getByTestId(COUNT_VALUE_SELECTOR);

    expect(countValue.textContent).toBe('0');

    fireEvent.click(incrementButton);
    expect(countValue.textContent).toBe('1');

    fireEvent.click(decrementButton);
    expect(countValue.textContent).toBe('0');
  });

  it('should have the correct state after multiple different actions', () => {
    const { getByTestId } = render(<DefaultTestComponent />);
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

  it('should change part of the State which was changed', () => {
    const { getByTestId } = render(<DefaultTestComponent />);
    const incrementButton = getByTestId(INCREMENT_SELECTOR);
    const sideEffectRenderCount = getByTestId(SIDE_EFFECT_RENDER_COUNT_SELECTOR);
    const countValue = getByTestId(COUNT_VALUE_SELECTOR);
    const objectValue = getByTestId(OBJECT_VALUE_SELECTOR);

    expect(sideEffectRenderCount.textContent).toBe('0');

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);

    expect(sideEffectRenderCount.textContent).toBe('0');
    expect(countValue.textContent).toBe('2');
    expect(objectValue.textContent).toBe(JSON.stringify({ value: 'Some value' }));
  });

  it('shouldn`t re-render a component when own properties weren`t changed', () => {
    const { getByTestId } = render(<TestComponentWithoutRenders />);
    const incrementButton = getByTestId(INCREMENT_SELECTOR);
    const sideEffectRenderCount = getByTestId(SIDE_EFFECT_RENDER_COUNT_SELECTOR);

    expect(sideEffectRenderCount.textContent).toBe('0');

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);

    expect(sideEffectRenderCount.textContent).toBe('0');
  });

  it('should re-render a component when own properties were changed', () => {
    const { getByTestId } = render(<DefaultTestComponent />);
    const changeObjectButton = getByTestId(CHANGE_OBJECT_SELECTOR);
    const sideEffectRenderCount = getByTestId(SIDE_EFFECT_RENDER_COUNT_SELECTOR);
    const objectValue = getByTestId(OBJECT_VALUE_SELECTOR);

    expect(sideEffectRenderCount.textContent).toBe('0');

    fireEvent.click(changeObjectButton);
    fireEvent.click(changeObjectButton);

    expect(sideEffectRenderCount.textContent).toBe('2');
    expect(objectValue.textContent).toBe(JSON.stringify({ value: 'Some value changed' }));
  });

  it('should handle array state using useSelector', () => {
    type State = string[];
    enum Action {
      ADD_ITEM = 'ADD_ITEM',
    }
    type Actions = { type: Action.ADD_ITEM; payload: string };

    type Props = {
      onItemsUpdate: (items: string[]) => void;
    };
    const ArrayStateTestComponent = ({ onItemsUpdate }: Props) => {
      const [useSelector, dispatch] = useMemoReducer((state: State, action: Actions) => {
        switch (action.type) {
          case Action.ADD_ITEM:
            return [...state, action.payload];
          default:
            return state;
        }
      }, []);

      const items = useSelector((state) => state);

      React.useEffect(() => {
        dispatch({ type: Action.ADD_ITEM, payload: 'Item 1' });
      }, [dispatch]);

      React.useEffect(() => {
        onItemsUpdate(items);
      }, [items, onItemsUpdate]);

      return null;
    };

    const handleItemsUpdate = jest.fn();

    render(<ArrayStateTestComponent onItemsUpdate={handleItemsUpdate} />);

    // Ensure that the mock function was called with the expected items array
    expect(handleItemsUpdate).toHaveBeenCalledWith(expect.arrayContaining(['Item 1']));
  });
});
