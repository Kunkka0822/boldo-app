import React, { Component } from "react";
import EStyleSheet from 'react-native-extended-stylesheet';
import styles from "./styles";
import { store } from "@store";
import RNRestart from 'react-native-restart';
import * as Progress from 'react-native-progress';
import { ActivityIndicator, View, Image } from "react-native";
import { Images } from "@config";
import { apiActions, actionTypes } from "@actions";
import { connect } from "react-redux";
import { notifications } from "react-native-firebase-push-notifications"
import { EventRegister } from 'react-native-event-listeners'

const onTypes = data => {
  return {
    type: actionTypes.PREF_TYPES,
    data
  };
};  ///to save types of professional

const onStyles = data => {
  return {
    type: actionTypes.PREF_STYLES,
    data
  };
}; ///to save styles of professional

class Loading extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getTypeAndStyles();
  }

  componentWillUnmount() {
  }

  getTypeAndStyles() {
    apiActions.getTypeAndStyles()
      .then(response => {
        let types = response.types;
        let styles = response.styles;
        let allStyle = { id: 100000, name: "All" }
        styles.push(allStyle);
        let type_items = [
          {
            name: 'Type of Professional',
            id: 0,
            children: [
            ],
          }
        ];
        type_items[0].children = types;

        let style_items = [
          {
            name: 'Styles of Cooking',
            id: 0,
            children: [
            ],
          }
        ];
        style_items[0].children = styles;

        this.props.dispatch(onTypes(type_items));
        this.props.dispatch(onStyles(style_items));

        setTimeout(() => {
          try {
            if (store.getState().auth?.login?.success) {
              this.getInfomation();
            } else {
              return this.props.navigation.navigate("Onboard");
            }
          } catch (err) {
            return RNRestart.Restart();
          }
        }, 500);
      })
      .catch(err => {
        return RNRestart.Restart();
      })
      .finally(err => {
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ alignItems: "center" }}>
          <Image
            resizeMode={'contain'}
            source={Images.logo}
            style={styles.logo}
          />
        </View>
        <ActivityIndicator
          size="large"
          {...styles.loading}
        />
      </View>
    );
  }
}


const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(null, mapDispatchToProps)(Loading);