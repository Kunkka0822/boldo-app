import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { SafeAreaProvider } from 'react-native-safe-area-context';
// import AnimatedTabBar, { TabsConfigsType } from 'curved-bottom-navigation-bar'
import AnimatedTabBar, { TabsConfigsType } from '../custom_module/curved-bottom-navigation-bar-custom';
import { connect } from "react-redux";
import { Badge } from 'react-native-paper';
import { Image, View, ImageBackground, Text } from 'react-native';
import { Images } from "@config";
import EStyleSheet from 'react-native-extended-stylesheet';
import { store } from "@store";

/* Stack Screen */
import Home from "@screens/Home";
import PostList from "@screens/PostList";
import Recipes from "@screens/Recipes";
import Address from "@screens/Address";
import Profile from "@screens/Profile";
import Setting from "@screens/Setting";
import BlockLists from "@screens/BlockLists";
import Chat from "@screens/Chat";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const renderIcon = (props) => {
  const { notification, key, image } = props;
  return (
    <View style={{alignItems: 'center' }}>
      {notification?.notifications?.[key] > 0 && <Badge style={{ position: 'absolute', top: 4, right: 4, zIndex: 10 }}>{notification?.notifications?.[image]}</Badge>}
      <Image source={image} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
    </View>
  )
}

const mapStateToProps = (state) => (state)
const IconComponent = connect(mapStateToProps, null)(renderIcon);

const tabs = {
  Home: {
    icon: ({ progress }) => <IconComponent image={Images.home} key={"home"} />
  },
  PostList: {
    icon: ({ progress }) => <IconComponent image={Images.post} key={"posts"} />
  },
  Recipes: {
    icon: ({ progress }) => <IconComponent image={Images.chef} key={"recipes"} />
  },
  Address: {
    icon: ({ progress }) => <IconComponent image={Images.chat} key={"chats"} />
  },
  Profile: {
    icon: ({ progress }) => <IconComponent image={Images.profile} key={"profile"} />
  },
}
const labels = ["Home", "Posts", "Recipes", "Chats", "Profile"]

const TabNavigator = () => {
  const user = store.getState().auth?.login?.data?.user;
  return (
    <Tab.Navigator
      tabBar={props => (
        <AnimatedTabBar labels={labels} barHeight={40} holeHeight={30} dotSize={40} barColor={EStyleSheet.value('$primaryColor')} dotColor={EStyleSheet.value('$primaryColor')} tabs={tabs} {...props} />
      )}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="PostList" component={PostList} />
      <Tab.Screen name="Recipes" component={Recipes} />
      <Tab.Screen name="Address" component={Address} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  )
}


export default function Navigation() {
  return (
    <SafeAreaProvider>
      <NavigationContainer >
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}>
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="BlockLists" component={BlockLists} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

