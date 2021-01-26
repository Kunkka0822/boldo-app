import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import { SafeAreaProvider } from 'react-native-safe-area-context';
// import AnimatedTabBar, { TabsConfigsType } from 'curved-bottom-navigation-bar'
import AnimatedTabBar, { TabsConfigsType } from '../custom_module/curved-bottom-navigation-bar-custom';
import { connect } from "react-redux";
import { Badge } from 'react-native-paper';
import { Image, View, ImageBackground } from 'react-native';
import { Images } from "@config";
import EStyleSheet from 'react-native-extended-stylesheet';
import { store } from "@store";

/* Stack Screen */
import PostList from "@screens/PostList";
import Recipes from "@screens/Recipes";
import Address from "@screens/Address";
import Profile from "@screens/Profile";
import Setting from "@screens/Setting";
import NewPost from "@screens/NewPost";
import NewRecipe from "@screens/NewRecipe";
import BlockLists from "@screens/BlockLists";
import Chat from "@screens/Chat";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const renderIcon = (props) => {
  const { notification, name, image} = props;
  return (
    <View style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
      {notification?.notifications?.[image] > 0 && <Badge style={{ position: 'absolute', top: 4, right: 4, zIndex: 10 }}>{notification?.notifications?.[image]}</Badge>}
      <Image source={name} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
    </View>
  )
}

const mapStateToProps = (state) => (state)
const IconComponent = connect(mapStateToProps, null)(renderIcon);

const tabs = {
  PostList: {
    icon: ({ progress }) => <IconComponent name={Images.post} image={"posts"}/>
  },
  Recipes: {
    icon: ({ progress }) => <IconComponent name={Images.chef} image={"recipes"}/>
  },
  Address: {
    icon: ({ progress }) => <IconComponent name={Images.chat} image={"chats"}/>
  },
  Profile: {
    icon: ({ progress }) => <Image source={Images.profile} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
  },
}

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => (
        <AnimatedTabBar barHeight={40} holeHeight={30} dotSize={40} barColor={EStyleSheet.value('$primaryColor')} dotColor={EStyleSheet.value('$primaryColor')} tabs={tabs} {...props} />
      )}
    >
      <Tab.Screen name="PostList" component={PostList}/>
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
            headerShown: false,
          }}>
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="NewPost" component={NewPost} />
          <Stack.Screen name="NewRecipe" component={NewRecipe} />
          <Stack.Screen name="BlockLists" component={BlockLists} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

