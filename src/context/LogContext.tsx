import { createContext, Dispatch, Reducer, useEffect, useReducer } from "react";
import { Log, LogCloud, LogLocal, paths } from "../constants";
import { CloudStorage } from "../storage";
import * as Crypto from "expo-crypto";
import _ from "lodash";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, database } from "../firebase";
import { convertCloudToLocal } from "../utils";

enum ActionType {
  GetLogs = "GET_LOGS",
  AddLog = "ADD_LOG",
  UpdateLog = "UPDATE_LOG",
  DeleteLog = "DELETE_LOG",
  syncLogs = "SYNC_LOGS",
}

type State = Map<string, LogLocal>;

type Action =
  | { type: ActionType.GetLogs; payload: State }
  | { type: ActionType.AddLog; payload: LogLocal }
  | { type: ActionType.UpdateLog; payload: LogLocal }
  | { type: ActionType.DeleteLog; payload: string }
  | { type: ActionType.syncLogs; payload: LogLocal[] };

type BoundActions = {
  getLogs: () => Promise<void>;
  addLog: (data: Log) => Promise<void>;
  updateLog: (data: LogLocal) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  togglePublic: (id: string) => Promise<void>;
  syncLogs: (logs: LogLocal[]) => void;
};

const logReducer: Reducer<State, Action> = (state, action) => {
  const newState = new Map(state);
  switch (action.type) {
    case ActionType.GetLogs:
      return new Map(action.payload);
    case ActionType.AddLog:
      return newState.set(action.payload.id, action.payload);
    case ActionType.UpdateLog:
      newState.set(action.payload.id, action.payload);
      return newState;
    case ActionType.DeleteLog:
      newState.delete(action.payload);
      return newState;
    default:
      return state;
  }
};

const actionHandlers = (
  dispatch: Dispatch<Action>,
  state: State,
): BoundActions => ({
  getLogs: async () => {
    const logs = await CloudStorage.getLogs();
    const filteredLogs = new Map(
      Array.from(logs).filter(([_, entry]) => !entry.isDeleted),
    );
    dispatch({ type: ActionType.GetLogs, payload: filteredLogs });
  },
  addLog: async (data) => {
    const log = { id: Crypto.randomUUID(), lastUpdated: data.date, data };
    dispatch({ type: ActionType.AddLog, payload: log });
    CloudStorage.addLog(log);
  },
  updateLog: async (data) => {
    const updatedLog = { ...data, lastUpdated: new Date() };
    dispatch({ type: ActionType.UpdateLog, payload: updatedLog });
    CloudStorage.updateLog(updatedLog);
  },
  deleteLog: async (id) => {
    dispatch({ type: ActionType.DeleteLog, payload: id });
    CloudStorage.deleteLog(id);
  },
  toggleFavorite: async (id) => {
    const log = state.get(id);
    if (!log) return;
    const newLog = _.cloneDeep(log);
    newLog.data.isFavorite = !newLog.data.isFavorite;
    newLog.lastUpdated = new Date();
    dispatch({ type: ActionType.UpdateLog, payload: newLog });
    CloudStorage.updateLog(newLog);
  },
  togglePublic: async (id) => {
    const log = state.get(id);
    if (!log) return;
    log.isPublic = !log.isPublic;
    log.lastUpdated = new Date();
    if (log.isPublic) {
      log.publicId = (await CloudStorage.setPublic(id)) as string;
    } else {
      await CloudStorage.setPrivate(id);
    }
    dispatch({ type: ActionType.UpdateLog, payload: log });
  },
  syncLogs: (logs) =>
    logs.forEach((log) => {
      const existingLog = state.get(log.id);
      if (log.isDeleted) {
        if (existingLog) {
          dispatch({ type: ActionType.DeleteLog, payload: log.id });
        }
        return;
      }
      if (!existingLog) {
        dispatch({ type: ActionType.AddLog, payload: log });
      } else if (
        new Date(log.lastUpdated) > new Date(existingLog.lastUpdated)
      ) {
        dispatch({ type: ActionType.UpdateLog, payload: log });
      }
    }),
});

const LogContext = createContext({ state: new Map() } as {
  state: State;
} & BoundActions);

const LogProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(logReducer, new Map());
  const boundActions = actionHandlers(dispatch, state);

  useEffect(() => {
    if (auth.currentUser === null) return;

    const unsubscribe = onSnapshot(
      collection(database, paths.userEntries(auth.currentUser?.uid as string)),
      (snapshot) => {
        if (snapshot.empty) return;
        const logs = snapshot.docs.map((doc) =>
          convertCloudToLocal(doc.data() as LogCloud),
        );
        boundActions.syncLogs(logs);
      },
    );

    return () => unsubscribe();
  }, [auth.currentUser]);

  return (
    <LogContext.Provider value={{ state, ...boundActions }}>
      {children}
    </LogContext.Provider>
  );
};

export { LogContext, LogProvider };
