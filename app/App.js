/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component} from "react";
import { store, persistor} from "@store";
import { StatusBar, LogBox } from "react-native";
import { BaseColor} from "@config";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as Utils from "@utils";
import { AppearanceProvider, useColorScheme} from 'react-native-appearance'
import EStyleSheet from 'react-native-extended-stylesheet';
import Navigaion from "./navigation";
import {CustomPushAlert} from "@components";


LogBox.ignoreAllLogs(true)
const PREF_THEME = 'theme';
class App extends Component {
  constructor(props) {
    super(props);
    Utils.setI18nConfig();
  }
  async componentDidMount() {
    StatusBar.setBackgroundColor(EStyleSheet.value('$primaryColor'), true);
  }
  componentWillUnmount() {
  }
  render() {
    return (
      <AppearanceProvider key={Math.random()} >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor} >
            <Navigaion theme={this.props.colorScheme} />
            <CustomPushAlert/>
          </PersistGate>
        </Provider>
      </AppearanceProvider>
    );
  }
}

const index = () => {
  const colorScheme = useColorScheme();
  EStyleSheet.clearCache();
  EStyleSheet.build({...BaseColor});
  return <App colorScheme={colorScheme} />
}

export default index;
