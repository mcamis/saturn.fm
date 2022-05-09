import React, { useContext, createContext, useSyncExternalStore } from "react";
import {
  audioManagerSingleton,
  AudioManagerState,
  defaultState,
} from "../utilities/audioManager";

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
    audioManagerSingleton.getSnapshot
  );
  return <CONTEXT.Provider value={state}>{children}</CONTEXT.Provider>;
};

export default CONTEXT;
