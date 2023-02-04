import * as React from "react";
import { useContext, createContext, useSyncExternalStore } from "react";
import { audioManagerSingleton } from "./audioManager";
import type { AudioManagerState } from "./types";
import { defaultState } from "./state";

const CONTEXT = createContext<AudioManagerState>(defaultState);

export const useAudioManagerContext = () => {
  const state = useContext(CONTEXT);
  return state;
};

export const AudioManagerContextProvider = ({
  children,
}: {
  children: any;
}) => {
  const state = useSyncExternalStore(
    audioManagerSingleton.subscribe,
    audioManagerSingleton.getSnapshot,
    audioManagerSingleton.getSnapshot
  );
  return <CONTEXT.Provider value={state}>{children}</CONTEXT.Provider>;
};

export default CONTEXT;
