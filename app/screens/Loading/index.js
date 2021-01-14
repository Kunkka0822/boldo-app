import React, { Component } from "react";
import { ActivityIndicator, View, Image, Alert, BackHandler } from "react-native";
import { Images } from "@config";
import styles from "./styles";
import { store, SetPrefrence, GetPrefrence } from "@store";
import * as Utils from "@utils";
import { apiActions, actionTypes } from "@actions";
import { connect } from "react-redux";
import RNRestart from 'react-native-restart';
import { notifications } from "react-native-firebase-push-notifications"
import { EventRegister } from 'react-native-event-listeners'

const onTypes = data => {
  return {
    type: actionTypes.PREF_TYPES,
    data
  };
};

const onStyles = data => {
  return {
    type: actionTypes.PREF_STYLES,
    data
  };
};

class Loading extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.mounted = true;
    this.getFrontDatas();
  }

  componentWillUnmount() {
    this.mounted = false;
  }


  getFrontDatas() {
    apiActions.getFrontDatas()
      .then(response => {
        let items = [
          {
            name: 'Type of Professional',
            id: 0,
            children: [
            ],
          }
        ]

        items[0].children = response.types;

        let items_style = [
          {
            name: 'Styles of Cooking',
            id: 0,
            children: [
            ],
          }
        ]
        if (response.types.length > 0 && response.styles.length > 0) {
          items[0].children = response.types;
          this.props.dispatch(onTypes(items))
          items_style[0].children = response.styles;
          this.props.dispatch(onStyles(items_style))

          setTimeout(() => {
            try {
              if (!store.getState().auth?.login?.onboarding) {
                return this.props.navigation.navigate("Onboard");
              }
              if (store.getState().auth?.login?.success) {
                this.getInfomation();
              } else {
                return RNRestart.Restart();
              }
            } catch (err) {
              return RNRestart.Restart();
            }
          }, 500);
        } else {
          return RNRestart.Restart();
        }
      })
      .catch(err => {
      })
      .finally(err => {
      })
  }

  getInfomation() {
    if (this.mounted) {
      const model = {
        email: store.getState().auth?.login?.data.user.email,
        password: store.getState().auth?.login?.data.user.password
      }
      apiActions.login(model)
        .then(response => {
          if (response.data.user.device_token == null || response.data.user.device_token == "") {
            this.getDeviceToken();
          } else {
            this.onNotificationListener();
            this.onNotificationOpenedListener();
            return this.props.navigation.navigate(store.getState().auth?.login?.data.user.role == 1 ? "Posts" : "Home");
          }
        })
        .catch(err => {
          return this.props.navigation.navigate("SingIn");
        })
        .finally(err => {
          return this.props.navigation.navigate("SingIn")
        })
    }
  }

  onTokenRefreshListener = () => {
    this.removeonTokenRefresh = messages.onTokenRefresh(token => {
    })
  }

  hasPermission = async () => {
    return await notifications.hasPermission()
  }

  requestPermission = async () => {
    return await notifications.requestPermission()
  }

  onNotificationListener = () => {
    this.removeOnNotification = notifications.onNotification(notification => {
      let type = notification._data.type;
      this.emitSignal(notification);
    })
  }


  onNotificationOpenedListener = () => {
    this.removeOnNotificationOpened = notifications.onNotificationOpened(
      notification => {
        // console.log("onNotificationOpened", notification)
        // this.emitSignal();
      }
    )
  }

  emitSignal(notification) {
    EventRegister.emit('notification', notification);
  }

  async getDeviceToken() {
    const token = await notifications.getToken();
    if (token != null && token != '') {
      this.onNotificationListener();
      this.onNotificationOpenedListener();
      if (store.getState().auth?.login?.success) {
        let id = store.getState().auth?.login?.data.user.id;
        const model = {
          id: id,
          token: token
        }
        this.setState({
          loading: true
        }, () => {
          apiActions.updateToken(model)
            .then(response => {
              return this.props.navigation.navigate(store.getState().auth?.login?.data.user.role == 1 ? "Posts" : "Home");
            })
            .catch(err => {
              console.log(err);
            })
            .finally(
              () => this.setState({ loading: false })
            )
        })
      } else {
        return this.props.navigation.navigate("SingIn")
      }

    } else {
      return RNRestart.Restart();
    }
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
          style={{
            position: "absolute",
            top: 350,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center"
          }}
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