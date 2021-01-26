import { combineReducers } from "redux";
import AuthReducer from "./auth";
import TypeReducer from "./type";
import StyleReducer from "./style";
import Notification from "./notification";
import Toast from "./toast";

export default combineReducers({
  auth: AuthReducer,
  type: TypeReducer,
  style: StyleReducer,
  notification: Notification,
  toast: Toast
});
