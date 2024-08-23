import { Dispatch } from "react";
import createContext from "./createDataContext";

const SET_LOG = "set_log";
const DELETE_LOG = "delete_log";

type State = Map<any, any>;

type Action =
  | { type: typeof SET_LOG; payload: { key: string; value: any } }
  | { type: typeof DELETE_LOG; payload: string };

type BoundActions = {
  setCache: (d: Dispatch<Action>) => (key: any, value: any) => void;
  deleteCache: (d: Dispatch<Action>) => (key: any) => void;
};

const cacheReducer = (state: State, action: Action) => {
  const newState = new Map(state);
  switch (action.type) {
    case SET_LOG:
      return newState.set(action.payload.key, action.payload.value);
    case DELETE_LOG:
      newState.delete(action.payload);
      return newState;
    default:
      return state;
  }
};

const setCache: BoundActions["setCache"] = (dispatch) => (key, value) =>
  dispatch({ type: SET_LOG, payload: { key, value } });

const deleteCache: BoundActions["deleteCache"] = (dispatch) => (key) =>
  dispatch({ type: DELETE_LOG, payload: key });

export const { Context, Provider } = createContext<Action, BoundActions, State>(
  cacheReducer,
  { setCache, deleteCache },
  new Map(),
);
