import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { Dispatch } from './models';
import { useMemoReducer } from './useMemoReducer';

type MemoReducerContextType<S, A> = {
  dispatch?: Dispatch<S, A>;
};

const contexts: { [key: string]: React.Context<MemoReducerContextType<any, any>> } = {};

export const useMemoReducerContext = <S, A>(contextKey?: string): MemoReducerContextType<S, A> => {
  const Context = contextKey ? contexts[contextKey] : contexts.default;
  const context = useContext(Context);

  if (!context) {
    throw new Error('useMemoReducerContext must be used within a MemoReducerProvider');
  }

  return context;
};

type Props<S, A> = {
  children: ReactNode;
  reducer: (state: S, action: A) => S;
  initialState: S;
  contextKey?: string;
};

export const MemoReducerProvider = <S, A>({ children, reducer, initialState, contextKey }: Props<S, A>) => {
  const [useSelector, dispatch] = useMemoReducer(reducer, initialState);

  const currentContextKey = contextKey || 'default';

  if (!contexts[currentContextKey]) {
    contexts[currentContextKey] = createContext<MemoReducerContextType<S, A>>({});
  }

  const Context = contexts[currentContextKey];

  const contextValue = useMemo(() => ({ useSelector, dispatch }), [useSelector, dispatch]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
