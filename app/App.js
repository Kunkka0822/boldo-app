/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component, useState, useEffect } from "react";
import { store, persistor, SetPrefrence, GetPrefrence } from "@store";
import { StatusBar, LogBox } from "react-native";
import { BaseColor, DarkColor } from "@config";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as RNLocalize from "react-native-localize";
import * as Utils from "@utils";
import { AppearanceProvider, useColorScheme, Appearance } from 'react-native-appearance'
import EStyleSheet from 'react-native-extended-stylesheet';

LogBox.ignoreAllLogs(true)
// console.disableYellowBox = true;
// LogBox.ignoreAllLogs(false);
const PREF_THEME = 'theme';
class App extends Component {
  constructor(props) {
    super(props);
    Utils.setI18nConfig();
  }
  async componentDidMount() {
    StatusBar.setBackgroundColor(EStyleSheet.value('$primaryColor'), true);
    // RNLocalize.addEventListener("change", this.handleLocalizationChange);
  }
  componentWillUnmount() {
    // RNLocalize.removeEventListener("change", this.handleLocalizationChange);
  }
  // handleLocalizationChange = () => {
  //   Utils.setI18nConfig();
  //   this.forceUpdate();
  // };

  render() {
    const App = require("./navigation");
    return (
      <AppearanceProvider key={Math.random()} >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor} >
            <App theme={this.props.colorScheme} />
          </PersistGate>
        </Provider>
      </AppearanceProvider>
    );
  }
}

let subscription = null;
const index = () => {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTheme() {
      const theme = await GetPrefrence(PREF_THEME, 'light');
      Appearance.set({ colorScheme: theme });
      setLoading(false);
    }
    getTheme();
  }, []);
  subscription && subscription.remove();


  subscription = Appearance.addChangeListener(async ({ colorScheme }) => {
    await SetPrefrence(PREF_THEME, colorScheme);
  });
  EStyleSheet.clearCache();
  EStyleSheet.build({ ...BaseColor, ...(colorScheme == 'dark' && DarkColor) });
  return !loading && <App colorScheme={colorScheme} />
}

export default index;
