import { combineReducers } from "redux";
import audioReducer from "reducers/audio";

export default combineReducers({
  audio: audioReducer,
});
