import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { BaseStyle } from "@config";
import { Icon } from "@components";
import * as Utils from "@utils";
import { Image} from 'react-native';
import { Images } from "@config";
import { store, SetPrefrence, GetPrefrence } from "@store";
import EStyleSheet from 'react-native-extended-stylesheet';

/* Stack Screen */

import Home from "@screens/Home";
import Connection from "@screens/Connection";
import PostList from "@screens/PostList";
import Pending from "@screens/Pending";
import Recipes from "@screens/Recipes";

import Onboard from "@screens/Onboard";
import SignIn from "@screens/SignIn";
import SignUp from "@screens/SignUp";
import NewPost from "@screens/NewPost";
import NewRecipe from "@screens/NewRecipe";
import Account from "@screens/Account";
import Blockeds from "@screens/Blockeds";
import Setting from "@screens/Setting";
import Profile from "@screens/Profile";
import Chat from "@screens/Chat";
import Address from "@screens/Address";

const getTabBarOptions = (theme) => {
  if (theme == 'dark')
    return {
      tabBarOptions: {
        showIcon: true,
        showLabel: true,
        activeTintColor: EStyleSheet.value('$primaryColor'),
        inactiveTintColor: EStyleSheet.value('$whiteColor'),
        style: {
          backgroundColor: EStyleSheet.value('$lightField')
        },
        labelStyle: {
          fontSize: 12
        },
      }
    }
  else return null;
}
// Tab bar navigation
const routeConfigs = {
  Home: {
    screen: Home,
    navigationOptions: ({ theme }) => ({
      title: '',
      ...getTabBarOptions(theme),
      tabBarIcon: ({ focused, tintColor }) => {
        if(focused)
          return <Image source={Images.home_on} />
        return <Image source={Images.home} />
      }
    })
  },
  // Pending: {
  //   screen: Pending,
  //   navigationOptions: ({ theme }) => ({
  //     title: '',
  //     ...getTabBarOptions(theme),
  //     tabBarIcon: ({ focused, tintColor }) => {
  //     if(focused)
  //       return <Image source={Images.clock_on} />
  //     return <Image source={Images.clock} />
  //     }
  //   })
  // },
  Posts: {
    screen: PostList,
    navigationOptions: ({ theme }) => ({
      title: '',
      ...getTabBarOptions(theme),
      tabBarIcon: ({ focused, tintColor }) => {
        if(focused)
          return <Image source={Images.link_on} />
        return <Image source={Images.link} />
      }
    })
  },
  Recipes: {
    screen: Recipes,
    navigationOptions: ({ theme }) => ({
      title: '',
      ...getTabBarOptions(theme),
      tabBarIcon: ({ focused, tintColor }) => {
      if(focused)
        return <Image source={Images.hatchef_on} />
      return <Image source={Images.hatchef} />
      }
    })
  },
  Address: {
    screen: Address,
    navigationOptions: ({ theme }) => ({
      title: '',
      ...getTabBarOptions(theme),
      tabBarIcon: ({ focused, tintColor }) => {
      if(focused)
        return <Image source={Images.chat_on} />
      return <Image source={Images.chat} />
      }
    })
  },
};

const routeConfigsPro = {
  Posts: {
    screen: PostList,
    navigationOptions: ({ theme }) => ({
      title: '',
      ...getTabBarOptions(theme),
      tabBarIcon: ({ focused, tintColor }) => {
        if(focused)
          return <Image source={Images.home_on} />
        return <Image source={Images.home} />
      }
    })
  },
  // Connection: {
  //   screen: Connection,
  //   navigationOptions: ({ theme }) => ({
  //     title: '',
  //     ...getTabBarOptions(theme),
  //     tabBarIcon: ({ focused, tintColor }) => {
  //     if(focused)
  //       return <Image source={Images.link_on} />
  //     return <Image source={Images.link} />
  //     }
  //   })
  // },
  Recipes: {
    screen: Recipes,
    navigationOptions: ({ theme }) => ({
      title: '',
      ...getTabBarOptions(theme),
      tabBarIcon: ({ focused, tintColor }) => {
      if(focused)
        return <Image source={Images.hatchef_on} />
      return <Image source={Images.hatchef} />
      }
    })
  },
  Address: {
    screen: Address,
    navigationOptions: ({ theme }) => ({
      title: '',
      ...getTabBarOptions(theme),
      tabBarIcon: ({ focused, tintColor }) => {
      if(focused)
        return <Image source={Images.chat_on} />
      return <Image source={Images.chat} />
      }
    })
  },
 
};

// Define bottom navigator as a screen in stack
const role = store.getState().auth?.login?.data?.user?.role;
const defaultRouteConf = role == 1 ? routeConfigsPro : routeConfigs;
const bottomTabNavigatorConfig = {
  initialRouteName: role == 1 ?"Posts" : "Home",
  tabBarOptions: {
    showIcon: true,
    showLabel: true,
    activeTintColor: EStyleSheet.value('$primaryColor'),
    inactiveTintColor: EStyleSheet.value('$grayColor'),
    style: BaseStyle.tabBar,
    labelStyle: {
      fontSize: 5
    },
  }
};

const BottomTabNavigator = createBottomTabNavigator(defaultRouteConf, bottomTabNavigatorConfig);

// Main Stack View App
const StackNavigator = createStackNavigator(
  {
    BottomTabNavigator: {
      screen: BottomTabNavigator
    },
  },
  {
    headerMode: "none",
    initialRouteName: "BottomTabNavigator"
  }
);

// Define Root Stack support Modal Screen
const RootStack = createStackNavigator(
  {
    StackNavigator: {
      screen: StackNavigator
    },
    Onboard: {
      screen: Onboard
    },
    SignIn: {
      screen: SignIn
    },
    SignUp: {
      screen: SignUp
    },
    NewPost: {
      screen: NewPost
    },
    NewRecipe:{
      screen: NewRecipe
    },
    Account:{
      screen: Account
    },
    Blockeds:{
      screen: Blockeds
    },
    Setting:{
      screen: Setting
    },
    Profile:{
      screen: Profile
    },
    Chat:{
      screen: Chat
    },
  },
  {
    mode: "modal",
    headerMode: "none",
    initialRouteName: "StackNavigator",
    transitionConfig: screen => {
      return handleCustomTransition(screen);
    },
    transparentCard: true
  }
);

export default RootStack;
