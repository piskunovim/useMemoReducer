import { useEffect } from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { ThunkAction, useMemoReducer } from '../../src';
import { Log } from '../../src/utils/Log';

type State = {
  counter: number;
  person: {
    name: string;
    age: number;
  };
};

type CounterAction = { type: 'incrementCounter' } | { type: 'decrementCounter' } | { type: 'makeYounger' };

const counterReducer = (state: State, action: CounterAction): State => {
  switch (action.type) {
    case 'incrementCounter':
      return { ...state, counter: state.counter + 1 };
    case 'decrementCounter':
      return { ...state, counter: state.counter - 1 };
    case 'makeYounger':
      return { ...state, person: { ...state.person, age: state.person.age - 10 } };
    default:
      return state;
  }
};

const useSelectorRenderSpy = jest.fn();
const dispatchRenderSpy = jest.fn();
const counterRenderSpy = jest.fn();
const personRenderSpy = jest.fn();

const delay = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const getStateInsideThunkMock = jest.fn();
const asyncThunk: ThunkAction<State, CounterAction> = async (dispatch, getState) => {
  getStateInsideThunkMock(getState());
  dispatch({ type: 'incrementCounter' });
  dispatch({ type: 'incrementCounter' });
  await delay();
  getStateInsideThunkMock(getState());
  dispatch({ type: 'incrementCounter' });
};

const renderUseMemoReducer = (config = { reactStrictMode: false }) => {
  const render = renderHook(() => {
    const [useSelector, dispatch] = useMemoReducer(counterReducer, {
      counter: 0,
      person: { name: 'John Doe', age: 100 },
    });

    const counter = useSelector((state: State) => state.counter);
    const person = useSelector((state: State) => state.person);

    useEffect(() => {
      useSelectorRenderSpy();
    }, [useSelector]);

    useEffect(() => {
      dispatchRenderSpy();
    }, [dispatch]);

    useEffect(() => {
      counterRenderSpy(counter);
    }, [counter]);

    useEffect(() => {
      personRenderSpy();
    }, [person]);

    return {
      counter,
      person,
      dispatch,
    };
  }, config);

  return render;
};

describe('useMemoReducerRerenders', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should initialize state', () => {
    const { result } = renderUseMemoReducer();

    expect(result.current.counter).toBe(0);

    expect(useSelectorRenderSpy).toHaveBeenCalledTimes(1);
    expect(dispatchRenderSpy).toHaveBeenCalledTimes(1);
    expect(counterRenderSpy).toHaveBeenCalledTimes(1);
    expect(personRenderSpy).toHaveBeenCalledTimes(1);
  });

  test('should call useEffect only for changed state', () => {
    const { result } = renderUseMemoReducer();

    expect(result.current.counter).toBe(0);

    act(() => {
      result.current.dispatch({ type: 'incrementCounter' });
    });

    expect(result.current.counter).toBe(1);

    expect(useSelectorRenderSpy).toHaveBeenCalledTimes(1);
    expect(dispatchRenderSpy).toHaveBeenCalledTimes(1);
    expect(counterRenderSpy).toHaveBeenCalledTimes(2);
    expect(personRenderSpy).toHaveBeenCalledTimes(1);
  });

  test('should work correctly with concurrent state changes', () => {
    const { result } = renderUseMemoReducer();

    expect(result.current.counter).toBe(0);
    expect(result.current.person.age).toBe(100);

    act(() => {
      result.current.dispatch({ type: 'incrementCounter' });
      result.current.dispatch({ type: 'makeYounger' });
      result.current.dispatch({ type: 'incrementCounter' });
      result.current.dispatch({ type: 'makeYounger' });
      result.current.dispatch({ type: 'makeYounger' });
      result.current.dispatch({ type: 'incrementCounter' });
    });

    expect(result.current.counter).toBe(3);
    expect(result.current.person.age).toBe(70);

    expect(useSelectorRenderSpy).toHaveBeenCalledTimes(1);
    expect(dispatchRenderSpy).toHaveBeenCalledTimes(1);
    expect(counterRenderSpy).toHaveBeenCalledTimes(2);
    expect(personRenderSpy).toHaveBeenCalledTimes(2);
  });

  test('should work correctly in strict mode', () => {
    const { result } = renderUseMemoReducer({ reactStrictMode: true });

    expect(result.current.counter).toBe(0);
    expect(result.current.person.age).toBe(100);

    act(() => {
      result.current.dispatch({ type: 'incrementCounter' });
      result.current.dispatch({ type: 'makeYounger' });
      result.current.dispatch({ type: 'incrementCounter' });
      result.current.dispatch({ type: 'makeYounger' });
      result.current.dispatch({ type: 'makeYounger' });
      result.current.dispatch({ type: 'incrementCounter' });
    });

    expect(result.current.counter).toBe(3);
    expect(result.current.person.age).toBe(70);

    expect(useSelectorRenderSpy).toHaveBeenCalledTimes(2);
    expect(dispatchRenderSpy).toHaveBeenCalledTimes(2);
    expect(counterRenderSpy).toHaveBeenCalledTimes(3);
    expect(personRenderSpy).toHaveBeenCalledTimes(3);
  });

  test('should work correctly with async thunk', async () => {
    const { result } = renderUseMemoReducer();

    expect(result.current.counter).toBe(0);
    expect(result.current.person.age).toBe(100);

    await act(async () => {
      result.current.dispatch(asyncThunk);
    });

    await waitFor(() => {
      expect(result.current.counter).toBe(3);
      expect(result.current.person.age).toBe(100);

      expect(getStateInsideThunkMock).toHaveBeenCalledTimes(2);
      expect(getStateInsideThunkMock).toHaveBeenCalledWith({ counter: 0, person: { name: 'John Doe', age: 100 } });
      expect(getStateInsideThunkMock).toHaveBeenCalledWith({ counter: 2, person: { name: 'John Doe', age: 100 } });

      expect(useSelectorRenderSpy).toHaveBeenCalledTimes(1);
      expect(dispatchRenderSpy).toHaveBeenCalledTimes(1);
      expect(personRenderSpy).toHaveBeenCalledTimes(1);

      expect(counterRenderSpy).toHaveBeenCalledTimes(3);
      expect(counterRenderSpy).toHaveBeenCalledWith(0);
      expect(counterRenderSpy).toHaveBeenCalledWith(2);
      expect(counterRenderSpy).toHaveBeenCalledWith(3);
    });
  });

  test('should work correctly with concurrent state changes with async thunk', async () => {
    const { result } = renderUseMemoReducer();

    expect(result.current.counter).toBe(0);
    expect(result.current.person.age).toBe(100);

    await act(async () => {
      result.current.dispatch(asyncThunk);
      result.current.dispatch({ type: 'incrementCounter' });
      result.current.dispatch({ type: 'makeYounger' });
      result.current.dispatch({ type: 'incrementCounter' });
      result.current.dispatch({ type: 'makeYounger' });
      result.current.dispatch({ type: 'makeYounger' });
      result.current.dispatch({ type: 'incrementCounter' });
    });

    await waitFor(() => {
      expect(result.current.counter).toBe(6);
      expect(result.current.person.age).toBe(70);

      expect(getStateInsideThunkMock).toHaveBeenCalledTimes(2);
      expect(getStateInsideThunkMock).toHaveBeenCalledWith({ counter: 0, person: { name: 'John Doe', age: 100 } });
      expect(getStateInsideThunkMock).toHaveBeenCalledWith({ counter: 5, person: { name: 'John Doe', age: 70 } });

      expect(useSelectorRenderSpy).toHaveBeenCalledTimes(1);
      expect(dispatchRenderSpy).toHaveBeenCalledTimes(1);

      expect(counterRenderSpy).toHaveBeenCalledTimes(3);
      expect(counterRenderSpy).toHaveBeenCalledWith(0);
      expect(counterRenderSpy).toHaveBeenCalledWith(5);
      expect(counterRenderSpy).toHaveBeenCalledWith(6);

      expect(personRenderSpy).toHaveBeenCalledTimes(2);
    });
  });

  test('should correctly unmount', async () => {
    const consoleErrorSpy = jest.spyOn(Log, 'warn');

    const { result, unmount } = renderUseMemoReducer({ reactStrictMode: true });

    unmount();

    act(() => {
      result.current.dispatch({ type: 'incrementCounter' });
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('You are trying to dispatch an action after the component was unmounted'),
    );
  });
});
