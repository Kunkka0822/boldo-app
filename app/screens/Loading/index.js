import React, { Component } from "react";
import EStyleSheet from 'react-native-extended-stylesheet';
import styles from "./styles";
import { store } from "@store";
import RNRestart from 'react-native-restart';
import * as Progress from 'react-native-progress';
import { ActivityIndicator, View, Image, Platform } from "react-native";
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

const onNotification = data => {
  return {
    type: actionTypes.PREF_NOTIFICATIONS,
    data
  };
};

const onToast = data => {
  return {
    type: actionTypes.PREF_TOAST,
    data
  };
};


class Loading extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.mounted = true;
    this.getTypeAndStyles();
  }

  componentWillUnmount() {
    // if (this.removeOnNotificationOpened) {
    //   this.removeOnNotificationOpened()
    // }
    // if (this.removeOnNotification) {
    //   this.removeOnNotification()
    // }

    // if (this.removeonTokenRefresh) {
    //   this.removeonTokenRefresh()
    // }
  }

  getTypeAndStyles() {
    apiActions.getTypeAndStyles()
      .then(response => {
        let types = response.types;
        let styles = response.styles;

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

  getInfomation() {
    if (this.mounted) {
      const model = {
        email: store.getState().auth?.login?.data.user.email,
        password: store.getState().auth?.login?.data.user.password
      }
      apiActions.login(model)
        .then(response => {
          this.getDeviceToken();
        })
        .catch(err => {
          return this.props.navigation.navigate("Auth");
        })
        .finally(err => {
        })
    }
  }

  onTokenRefreshListener = () => {
    this.removeonTokenRefresh = messages.onTokenRefresh(token => {

    })
  }

  onNotificationListener = () => {
    this.removeOnNotification = notifications.onNotification(notification => {
      let notificationDatas = this.props.notification?.notifications;
      if (notificationDatas == undefined) {
        notificationDatas = {
          chats: 0,
          posts: 0,
          recipes: 0,
        }
      }

      let type = notification._data.type;
      if (type == "new-message") {
        notificationDatas.chats++;
        let text1 = notification._title;
        let text2 = notification._body;
        let toastData = {
          text1: text1,
          text2: text2,
          type: 'success',
        }
        this.props.dispatch(onToast(toastData));
      } else if (type == "new-post") {
        notificationDatas.posts++;
      } else if (type == "new-recipe") {
        notificationDatas.recipes++;
      } else if (type == 'changed-type') {
        return RNRestart.Restart();
      }

      this.props.dispatch(onNotification(notificationDatas));
      this.emitSignal(notification);
    })
  }

  onNotificationOpenedListener = () => {
    this.removeOnNotificationOpened = notifications.onNotificationOpened(
      notification => {

      }
    )
  }

  emitSignal(notification) {
    EventRegister.emit('notification', notification);
  }

  hasPermission = async () => {
    return await notifications.hasPermission()
  }

  requestPermission = async () => {
    return await notifications.requestPermission()
  }

  async getDeviceToken() {
    const { auth } = this.props;
    const token = await notifications.getToken();
    if (token != null && token != '') {
      if (Platform.OS == 'ios') {
        let permission = this.hasPermission();
        this.requestPermission();
      }
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
              return this.props.navigation.navigate(auth.login?.data?.user?.role == 1 ? "Main" : "Main1");
            })
            .catch(err => {
              console.log('err', err);
            })
            .finally(
              () => this.setState({ loading: false })
            )
        })
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
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Loading);