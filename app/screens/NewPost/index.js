import React, { Component } from "react"
import { View, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform } from "react-native";
import { BaseStyle, Images, BaseConfig } from "@config";
import { Button, Icon, Image as ImageComponent, Text } from "@components";
import * as Utils from "@utils";
import EStyleSheet from 'react-native-extended-stylesheet';
import { apiActions } from "@actions";
import { store } from "@store";
import styles from "./styles";
import { Searchbar } from 'react-native-paper';
import IconBadge from 'react-native-icon-badge';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-easy-toast'
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Textarea from 'react-native-textarea';
import { EventRegister } from 'react-native-event-listeners'

export default class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      photo: Images.image,
      photo64: '',
      content: '',
      width: 0,
      height: 0,
    };
    this.ToastRef = null;
    this.requirePermission();
  }

 
  componentDidMount() {
    this.listener = EventRegister.addEventListener('notification', (data) => {
        console.log('data', data);
        if(data == "new-message"){
            console.log("new message received");
        }
    })
}

componentWillUnmount() {
    EventRegister.removeEventListener(this.listener)
}

async requirePermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ])
      if (granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
      }
    } catch (err) {
      console.log('PERMISSION ERROR', err)
    }
  }
}


  onClose() {
    this.props.navigation.goBack();
  }


  renderFileData() {
    if (this.state.photo64) {
      return <Image source={{ uri: this.state.photo64 }}
        style={styles.post} />
    } else {
      return <Image source={Images.no_image} style={styles.post} />
    }
  }

  onCamera() {
    let options = {
      includeBase64:true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        console.log("camera");
        this.setState({
          photo64: 'data:image/jpeg;base64,' + response.base64
        });
      }
    });
  }

  onImage() {
    let options = {
      title: Utils.translate("auth.select-image"), 
      cameraType: 'front',
      mediaType: 'photo' ,
      includeBase64:true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        this.setState({
          photo64: 'data:image/jpeg;base64,' + response.base64
        });
        console.log(response);
      }
    });
   
  }

  onPost() {
    if (this.state.photo64 == '') {
      this.ToastRef.show(Utils.translate("post.invalid-photo"));
      return;
    }else if(this.state.content == ""){
      this.ToastRef.show(Utils.translate("post.invalid-content"));
      return;
    }
    if (store.getState().auth?.login?.success) {
      let id = store.getState().auth?.login?.data.user.id;

      const model = {
        photo64: this.state.photo64,
        content: this.state.content,
        id: id,
      }

      this.setState({
        loading: true
      }, () => {
        apiActions.uploadPost(model)
          .then(response => {
            this.onClose();
          })
          .catch(err => {
          })
          .finally(
            () => this.setState({ loading: false })
          )
      })
    }
  }

  render() {
    let { loading, content, photo, photo64 } = this.state;

    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView, { marginTop: 10, }]}
        forceInset={{ top: "always" }}
      >
        <Spinner
          visible={this.state.loading}
          textContent={'Posting...'}
          textStyle={{ color: EStyleSheet.value("$primaryColor") }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
          <TouchableOpacity onPress={() => { this.onClose() }}>
            <Image style={styles.close} source={Images.close} ></Image>
          </TouchableOpacity>
          <Text title3 blackColor style={{ flex: 1, marginLeft: 20 }}> {Utils.translate("post.share-post")} </Text>
          <TouchableOpacity onPress={() => { this.onPost() }}>
            <Image style={styles.arrow} source={Images.arrow} ></Image>
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView style={{
          backgroundColor: EStyleSheet.value("$contentColor"),
          paddingHorizontal: 10, display: 'flex', flexDirection: 'column', alignContent: 'center'
        }} keyboardShouldPersistTaps='always'>
          <View style={{ justifyContent: 'center', alignContent: 'center', flex: 1 }} >
            {this.renderFileData()}
            <Textarea
              containerStyle={styles.textareaContainer}
              style={styles.textarea}
              onChangeText={content => this.setState({ content })}
              defaultValue={content}
              placeholder={Utils.translate("post.invalid-content")}
              underlineColorAndroid={'transparent'}
            />
          </View>
          <View>
            <TouchableOpacity onPress={() => { this.onCamera() }}
              style={{ flexDirection: 'row', alignItems: 'center', margin: 15 }}>
              <Image style={styles.camera} source={Images.small_camera} ></Image>
              <Text title3 blackColor style={{ flex: 1, marginLeft: 20 }}> {Utils.translate("post.camera")} </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { this.onImage() }}
              style={{ flexDirection: 'row', alignItems: 'center', margin: 15 }}>
              <Image style={styles.gallery} source={Images.image} ></Image>
              <Text title3 blackColor style={{ flex: 1, marginLeft: 20 }}> {Utils.translate("post.gallery")} </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>);
  }
}