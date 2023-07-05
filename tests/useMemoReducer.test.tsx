import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { useMemoReducer } from '../src';
import { DefaultTestComponent } from './defaultComponent';

describe('useMemoReducer', () => {
  test('it should initialize with correct initial state', () => {
    const { getByTestId } = render(<DefaultTestComponent />);
    const countValue = getByTestId('count-value');
    expect(countValue.textContent).toBe('0');
  });

  test('it should handle increment and decrement', () => {
    const { getByText, getByTestId } = render(<DefaultTestComponent />);
    const minusButton = getByText('-');
    const plusButton = getByText('+');
    const countValue = getByTestId('count-value');
    expect(countValue.textContent).toBe('0');
    fireEvent.click(plusButton);
    expect(countValue.textContent).toBe('1');
    fireEvent.click(minusButton);
    expect(countValue.textContent).toBe('0');
  });

  test('it should handle multiple increments', () => {
    const { getByText, getByTestId } = render(<DefaultTestComponent />);
    const plusButton = getByText('+');
    const countValue = getByTestId('count-value');
    fireEvent.click(plusButton);
    fireEvent.click(plusButton);
    fireEvent.click(plusButton);
    expect(countValue.textContent).toBe('3');
  });

  test('it should handle multiple decrements', () => {
    const { getByText, getByTestId } = render(<DefaultTestComponent />);
    const minusButton = getByText('-');
    const countValue = getByTestId('count-value');
    fireEvent.click(minusButton);
    fireEvent.click(minusButton);
    expect(countValue.textContent).toBe('-2');
  });

  test('it should handle a combination of increments and decrements', () => {
    const { getByText, getByTestId } = render(<DefaultTestComponent />);
    const minusButton = getByText('-');
    const plusButton = getByText('+');
    const countValue = getByTestId('count-value');
    fireEvent.click(plusButton);
    fireEvent.click(plusButton);
    fireEvent.click(minusButton);
    expect(countValue.textContent).toBe('1');
  });

  test('it should have the correct state after multiple different actions', () => {
    const { getByText, getByTestId } = render(<DefaultTestComponent />);
    const minusButton = getByText('-');
    const plusButton = getByText('+');
    const countValue = getByTestId('count-value');
    fireEvent.click(plusButton);
    fireEvent.click(plusButton);
    fireEvent.click(minusButton);
    fireEvent.click(plusButton);
    fireEvent.click(minusButton);
    fireEvent.click(minusButton);
    expect(countValue.textContent).toBe('0');
  });

  test('it should handle async actions', async () => {
    const { getByText, getByTestId } = render(<DefaultTestComponent />);
    const plusButton = getByText('+');
    const countValue = getByTestId('count-value');

    fireEvent.click(plusButton);

    await new Promise((r) => {
      setTimeout(r, 100);
    }); // simulate async action

    fireEvent.click(plusButton);

    expect(countValue.textContent).toBe('2');
  });

  test('it should re-render component when state changes', () => {
    const renderCount = { current: 0 };
    const TestComponentWithCounter = () => {
      renderCount.current += 1;
      const [useSelector, dispatch] = useMemoReducer((state, action) => state, {});
      const state = useSelector((state) => state);
      return null;
    };

    render(<TestComponentWithCounter />);
    render(<TestComponentWithCounter />);

    expect(renderCount.current).toBe(2);
  });

  test('it should handle custom action with payload', () => {
    type State = { count: number };
    enum Action {
      SET_COUNT = 'SET_COUNT',
    }
    type Actions = { type: Action.SET_COUNT; payload: number };

    type Props = {
      onCountUpdate: (count: number) => void;
    };
    const CustomActionTestComponent = ({ onCountUpdate }: Props) => {
      const [useSelector, dispatch] = useMemoReducer(
        (state: State, action: Actions) => {
          switch (action.type) {
            case Action.SET_COUNT:
              return { count: action.payload };
            default:
              return state;
          }
        },
        { count: 0 },
      );

      const count = useSelector((state) => state.count);

      React.useEffect(() => {
        dispatch({ type: Action.SET_COUNT, payload: 5 });
      }, [dispatch]);

      React.useEffect(() => {
        onCountUpdate(count);
      }, [count, onCountUpdate]);

      return null;
    };
    const handleCountUpdate = jest.fn();

    render(<CustomActionTestComponent onCountUpdate={handleCountUpdate} />);

    // Ensure that the mock function was called with the expected count value
    expect(handleCountUpdate).toHaveBeenCalledWith(5);
  });

  test('it should handle array state using useSelector', () => {
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

  test('it should not change state when dispatching invalid action type', () => {
    enum Action {
      INCREMENT = 'increment',
      DECREMENT = 'decrement',
      INVALID = 'invalid',
    }

    // TypeScript won't allow us to do messy stuff like this, but it's fine for testing
    type Actions = { type: Action.INCREMENT } | { type: Action.DECREMENT } | { type: Action.INVALID };
    type State = { count: number };

    type Props = {
      onCountUpdate: (count: number) => void;
    };
    const InvalidActionTestComponent = ({ onCountUpdate }: Props) => {
      const [useSelector, dispatch] = useMemoReducer(
        (state: State, action: Actions) => {
          switch (action.type) {
            case Action.INCREMENT:
              return { count: state.count + 1 };
            case Action.DECREMENT:
              return { count: state.count - 1 };
            default:
              return state;
          }
        },
        { count: 0 },
      );

      const count = useSelector((state) => state.count);

      React.useEffect(() => {
        dispatch({ type: Action.INVALID });
      }, [dispatch]);

      React.useEffect(() => {
        onCountUpdate(count);
      }, [count, onCountUpdate]);

      return null;
    };

    const handleCountUpdate = jest.fn();

    render(<InvalidActionTestComponent onCountUpdate={handleCountUpdate} />);

    // Ensure that the mock function was called with the expected count value
    expect(handleCountUpdate).toHaveBeenCalledWith(0);
  });
});
