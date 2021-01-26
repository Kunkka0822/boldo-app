import { createSwitchNavigator, createAppContainer } from "react-navigation";
import Main from "./main";
import Main1 from "./main1";
import Auth from "./auth";
import Loading from "@screens/Loading";
import Onboard from "@screens/Onboard";

const AppNavigator = createSwitchNavigator(
  {
    Loading: Loading,
    Onboard: Onboard,
    Auth: Auth,
    Main: Main,
    Main1: Main1,
  },
  {
    initialRouteName: "Loading"
  }
);
module.exports = createAppContainer(AppNavigator);
