import { combineReducers } from "redux";
import AuthReducer from "./auth";
import TypeReducer from "./type";
import StyleReducer from "./style";

export default combineReducers({
  auth: AuthReducer,
  type: TypeReducer,
  style: StyleReducer
});
