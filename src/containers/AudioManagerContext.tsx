import type { Reducer, Dispatch, FC } from "react";
import React, {
  useContext,
  createContext,
  useSyncExternalStore,
  useReducer,
} from "react";
import {
  audioManagerSingleton,
  AudioManagerState,
  defaultState,
} from "../utilities/audioManager";

export enum ActionTypes {
  Clear = "clear",
  Update = "update",
  SaveAndReload = "saveAndReload",
}
type SavePayload = {
  cache: Cache;
};

export const update = (payload: AudioManagerState) => ({ payload } as const);
export type Action = ReturnType<typeof update>;

export const reducer: Reducer<AudioManagerState, Action> = (state, action) => {
  return action.payload;
};

const CONTEXT = createContext<[AudioManagerState, Dispatch<Action>]>([
  defaultState,
  () => null,
]);

export const useAudioManagerContext = () => {
  const [state, dispatch] = useContext(CONTEXT);

  return [state, dispatch] as const;
};

export const AudioManagerContextProvider = ({
  children,
}: {
  children: any;
}) => {
  const state = useSyncExternalStore(
    audioManagerSingleton.subscribe,
    audioManagerSingleton.getSnapshot
  );
  const [dispatch] = useReducer(reducer, defaultState);
  // audioManagerSingleton.subscribe((payload: AudioManagerState) => {
  //   dispatch({ payload });
  // });
  return (
    <CONTEXT.Provider value={[state, dispatch as any]}>
      {children}
    </CONTEXT.Provider>
  );
};

export default CONTEXT;
