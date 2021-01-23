import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Main from "./main";
import Loading from "@screens/Loading";
import Onboard from "@screens/Onboard";
import SignIn from "@screens/SignIn";
import SignUp from "@screens/SignUp";

const AppNavigator = createSwitchNavigator(
  {
    Loading: Loading,
    Onboard: Onboard,
    SignIn: SignIn,
    SignUp: SignUp,
    Main: Main,
  },
  {
    initialRouteName: "Loading"
  }
);
module.exports = createAppContainer(AppNavigator);
