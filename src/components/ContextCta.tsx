import * as React from "react";
import { audioManagerSingleton } from "../audioManager";

export const ContextCTA = () => {
  return (
    <div className="start-context">
      <button type="button" onClick={() => audioManagerSingleton.init()}>
        Click to Start
      </button>
    </div>
  );
};
