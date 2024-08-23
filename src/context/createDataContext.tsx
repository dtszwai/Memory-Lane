import { useReducer, Reducer, Dispatch, createContext } from "react";

type BoundActions<T, A, R> = {
  [K in keyof T]: T[K] extends (d: Dispatch<A>, state: R) => infer R
    ? R
    : never;
};

type ContextValue<T, R, A> = { state: R } & BoundActions<T, A, R>;

const createDataContext = <
  A,
  T extends {
    [key: string]: (dispatch: Dispatch<A>, state: R) => any;
  },
  R,
>(
  reducer: Reducer<R, A>,
  actions: T,
  initialState: R,
) => {
  const Context = createContext({
    state: initialState,
  } as ContextValue<T, R, A>);

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Bind the actions to the dispatch
    const boundActions = {} as BoundActions<T, A, R>;
    for (let key in actions) {
      boundActions[key] = actions[key](dispatch, state);
    }

    return (
      <Context.Provider value={{ state, ...boundActions }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
};

export default createDataContext;
