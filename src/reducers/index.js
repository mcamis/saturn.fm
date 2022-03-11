import { combineReducers } from "redux";
import audioReducer from "./audio";

export default combineReducers({
  audio: audioReducer,
});
