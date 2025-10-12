import React, {createContext} from 'react'

export interface LoaderContext {
  loading: boolean;
  setLoading: React.TransitionStartFunction;
}
export const LoaderContext = createContext<LoaderContext|null>(null)