import { combineReducers } from "redux";
import AuthReducer from "./auth";
import TypeReducer from "./type";
import StyleReducer from "./style";
import Notification from "./notification";

export default combineReducers({
  auth: AuthReducer,
  type: TypeReducer,
  style: StyleReducer,
  notification: Notification
});
