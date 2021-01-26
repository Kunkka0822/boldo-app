import React, { Component } from "react"
import { View, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, PermissionsAndroid, TextInput } from "react-native";
import { BaseStyle, Images, BaseConfig } from "@config";
import { Button, Icon, Image as ImageComponent, Text } from "@components";
import * as Utils from "@utils";
import EStyleSheet from 'react-native-extended-stylesheet';
import { apiActions } from "@actions";
import { store } from "@store";
import styles from "./styles";
import { Searchbar } from 'react-native-paper';
import IconBadge from 'react-native-icon-badge';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Textarea from 'react-native-textarea';
import { EventRegister } from 'react-native-event-listeners'
import ImageRotate from 'react-native-image-rotate';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';
import Toast from 'react-native-toast-message';
import ImgToBase64 from 'react-native-image-base64';

const toastConfig = {
  success: () => { },
  error: ({ text1 }) => (
    <View
      style={{
        paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center',
        height: 50, width: '80%', backgroundColor: EStyleSheet.value('$errorColor'), borderRadius: 25
      }}>
      <Text style={{ textAlign: 'center', color: EStyleSheet.value('$whiteColor'), fontSize: 16, fontWeight: 'bold' }}>{text1}</Text>
    </View>
  ),
  chat: ({ text1, text2 }) => (
    <View
      style={{
        paddingHorizontal: 20, justifyContent: 'center', marginTop: 50,
        height: 50, width: '80%', backgroundColor: EStyleSheet.value('$successColor'), borderRadius: 5,
        flexDirection: 'column'
      }}>
      <Text style={{ color: EStyleSheet.value('$blackColor'), fontSize: 14, fontWeight: 'bold', }}>{text1}</Text>
      <Text style={{ color: EStyleSheet.value('$blackColor'), fontSize: 12 }}>{text2}</Text>
    </View>
  ),
};
export default class NewRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      photo: '',
      photo64: '',
      width: '',
      height: '',
      content: '',
      title: "",
      user: { ...store.getState().auth?.login?.data?.user },
    };
    this.requirePermission();
  }

  componentDidMount() {
    this.listener = EventRegister.addEventListener('notification', (data) => {
      if (data == "new-message") {
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
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
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

  rotateImage(degree) {
    ImageResizer.createResizedImage('data:image/jpeg;base64,' + this.state.photo, this.state.width, this.state.height, "JPEG", 100, degree)
      .then(response => {
        ImgToBase64.getBase64String(response.uri)
        .then(base64String => {
          let base64 = 'data:image/jpeg;base64,' + base64String
          this.setState({ photo:  base64String})
        })
        .catch(err => console.log(err));
      })
      .catch(err => {
        console.log(err);
      })
  }

  renderFileData() {
    if (this.state.photo != "") {
      return <View style={{ width: '100%' }}>
        <Image source={{ uri: 'data:image/jpeg;base64,' + this.state.photo }}
          style={styles.post} />
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
          <TouchableOpacity onPress={() => { if (!this.state.loading) this.rotateImage(-90) }}>
            <Icon name="undo" size={20} color={EStyleSheet.value("$primaryColor")}></Icon>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { if (!this.state.loading) this.rotateImage(90) }}>
            <Icon name="undo" size={20} color={EStyleSheet.value("$primaryColor")} style={{ marginLeft: 10, transform: [{ scaleX: -1 }] }}></Icon>
          </TouchableOpacity>
        </View>
      </View>
    } else {
      return <Icon name="image" size={200} color={EStyleSheet.value("$primaryColor")}></Icon>
    }
  }

  onCamera() {
    let options = {
      includeBase64: true,
    };
    launchCamera(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        this.setState({
          photo: response.base64,
          width: response.width,
          height: response.height,
        });
      }
    });
  }

  onImage() {
    let options = {
      title: Utils.translate("auth.select-image"),
      mediaType: 'photo',
      includeBase64: true,
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
          photo: response.base64,
          width: response.width,
          height: response.height,
        });
      }
    });
  }

  onPost() {
    if (this.state.photo == '') {
      Toast.show({ text1: Utils.translate("post.invalid-photo"), type: 'error' },);
      return;
    } else if (this.state.title == "") {
      Toast.show({ text1: Utils.translate("post.invalid-title"), type: 'error' },);
      return;
    } else if (this.state.content == "") {
      Toast.show({ text1: Utils.translate("post.invalid-content"), type: 'error' },);
      return;
    }

    let id = this.state.user.id;
    const model = {
      photo: this.state.photo,
      content: this.state.content,
      title: this.state.title,
      id: id,
    }

    this.setState({
      loading: true
    }, () => {
      apiActions.uploadRecipe(model)
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

  render() {
    let { loading, content, title, photo, photo64 } = this.state;

    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView]}
        forceInset={{ top: "always" }}
      >
        <Spinner
          visible={loading}
          textContent={'Uploading...'}
          textStyle={{ color: EStyleSheet.value("$primaryColor") }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10 }}>
          <TouchableOpacity onPress={() => { if (!loading) this.onClose() }}>
            <Image style={styles.close} source={Images.back} ></Image>
          </TouchableOpacity>
          <Text blackColor style={{ flex: 1, marginLeft: 20, fontSize: 20, textAlign: 'center' }}> {Utils.translate("recipes.upload-recipe")} </Text>
          <TouchableOpacity onPress={() => { this.onPost() }}>
            <Image style={styles.arrow} source={Images.check} ></Image>
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView style={{ backgroundColor: EStyleSheet.value('$scrollColor'), flex: 1, paddingHorizontal: 10, alignContent: 'center' }} keyboardShouldPersistTaps='handled'>
          <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} >
            {this.renderFileData()}
            <TextInput
              style={styles.title}
              onChangeText={title => this.setState({ title })}
              autoCorrect={false}
              placeholder={Utils.translate("recipes.title")}
              placeholderTextColor={EStyleSheet.value('$grayColor')}
              value={title}
              selectionColor={EStyleSheet.value('$primaryColor')}
            />
            <Textarea
              containerStyle={styles.textareaContainer}
              style={styles.textarea}
              onChangeText={content => this.setState({ content })}
              defaultValue={content}
              placeholder={Utils.translate("post.invalid-content")}
              underlineColorAndroid={'transparent'}
              selectionColor={EStyleSheet.value('$primaryColor')}
            />
          </View>
        </KeyboardAwareScrollView>
        <View style={styles.selection}>
          <TouchableOpacity onPress={() => { this.onCamera() }}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 15, justifyContent: 'center', borderBottomColor: EStyleSheet.value('$inputBoderColor'), borderBottomWidth: 1 }}>
            <Icon name="camera" size={30} color={EStyleSheet.value("$primaryColor")}></Icon>
            <Text name style={{ flex: 1, marginLeft: 20 }}> {Utils.translate("post.camera")} </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.onImage() }}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 15, justifyContent: 'center' }}>
            <Icon name="image" size={30} color={EStyleSheet.value("$primaryColor")}></Icon>
            <Text name style={{ flex: 1, marginLeft: 20 }}> {Utils.translate("post.gallery")} </Text>
          </TouchableOpacity>
        </View>
        <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
      </SafeAreaView>);
  }
}