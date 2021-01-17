import React, { Component } from "react"
import { View, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, RefreshControl } from "react-native";
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
import { EventRegister } from 'react-native-event-listeners'

export default class NewRecipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      search: '',
      BadgeCount: 2,
      photo: Images.image,
      photo64: '',
      width: 0,
      height: 0,
      title: '',
      content: '',
      success: {
        title: true,
        content: true,
      },
      isPro: true,
    };
    this.ToastRef = null;
  }

  componentDidMount() {
    if (store.getState().auth?.login?.data?.user?.role != 1) {
      this.setState({
        isPro: false
      });
    }

    this.listener = EventRegister.addEventListener('notification', (data) => {
      console.log('data', data);
      if (data == "new-message") {
        console.log("new message received");
      }
    })
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener)
  }

  onClose() {
    this.props.navigation.goBack();
  }

  onRecipe() {
    if (this.state.title == '') {
      this.ToastRef.show(Utils.translate("post.invalid-title"));
      return;
    } else if (this.state.photo64 == '') {
      this.ToastRef.show(Utils.translate("post.invalid-photo"));
      return;
    } else if (this.state.content == '') {
      this.ToastRef.show(Utils.translate("post.invalid-content"));
      return;
    }
    if (store.getState().auth?.login?.success) {
      let id = store.getState().auth?.login?.data.user.id;

      const model = {
        title: this.state.title,
        content: this.state.content,
        photo64: this.state.photo64,
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
            console.log(err);
          })
          .finally(
            () => this.setState({ loading: false })
          )
      })
    }
  }

  onCamera() {
    let options = {
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
          photo64: 'data:image/jpeg;base64,' + response.data
        });
      }
    });
  }

  onImage() {
    let options = {
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
          photo64: 'data:image/jpeg;base64,' + response.data
        });
      }
    });
  }

  renderFileData() {
    if (this.state.photo64) {
      return <Image source={{ uri: this.state.photo64 }}
        style={styles.recipe} />

    } else {
      return <></>
    }
  }

  render() {
    let { loading, search, newPost, photo, photo64, title, content, success, isPro } = this.state;

    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView, { paddingTop: 20 }]}
        forceInset={{ top: "always" }}
      >
        <Spinner
          visible={this.state.loading}
          textContent={'Uploading...'}
          textStyle={{ color: EStyleSheet.value("$primaryColor") }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
          <TouchableOpacity onPress={() => { this.onClose() }}>
            <Image style={styles.close} source={Images.close} ></Image>
          </TouchableOpacity>
          <Text title3 blackColor style={{ flex: 1, marginLeft: 20 }}> {Utils.translate("recipes.upload-recipe")} </Text>
          <TouchableOpacity onPress={() => { this.onRecipe() }}>
            <Image style={styles.arrow} source={Images.arrow} ></Image>
          </TouchableOpacity>
        </View>
        <ScrollView style={{
          marginTop: 30,
          backgroundColor: EStyleSheet.value('$contentColor'),
        }} refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={this.componentDidMount.bind(this)}
          />
        }>

          <View style={{ padding: 15, display: 'flex', flexDirection: 'column', }}>
            <TextInput
              style={styles.title}
              onChangeText={title => this.setState({ title })}
              onFocus={() => {
                this.setState({
                  success: {
                    ...success,
                    title: true
                  }
                });
              }}
              autoCorrect={false}
              placeholder={Utils.translate("recipes.title")}
              placeholderTextColor={
                success.title
                  ? EStyleSheet.value('$grayColor')
                  : EStyleSheet.value('$errorColor')
              }
              value={title}
              selectionColor={EStyleSheet.value('$primaryColor')}
            />
            <TextInput
              style={styles.content}
              onChangeText={content => this.setState({ content })}
              onFocus={() => {
                this.setState({
                  success: {
                    ...success,
                    content: true
                  }
                });
              }}
              multiline={true}
              autoCorrect={false}
              placeholder={Utils.translate("recipes.content")}
              placeholderTextColor={
                success.content
                  ? EStyleSheet.value('$grayColor')
                  : EStyleSheet.value('$errorColor')
              }
              value={content}
              selectionColor={EStyleSheet.value('$primaryColor')}
            />
          </View>
          <View style={{
            backgroundColor: EStyleSheet.value("$contentColor"),
            height: 300,
            paddingHorizontal: '4%',
            alignItems: 'center',
            marginBottom: 10
          }}>
            {this.renderFileData()}
          </View>
        </ScrollView>
        <View style={{ marginBottom: 50 }}>
          <TouchableOpacity onPress={() => { this.onCamera() }} style={{ flexDirection: 'row', alignItems: 'center', margin: 15 }}>
            <Image style={styles.camera} source={Images.small_camera} ></Image>
            <Text title3 blackColor style={{ flex: 1, marginLeft: 20 }}> {Utils.translate("post.camera")} </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { this.onImage() }} style={{ flexDirection: 'row', alignItems: 'center', margin: 15 }}>
            <Image style={styles.gallery} source={Images.image} ></Image>
            <Text title3 blackColor style={{ flex: 1, marginLeft: 20 }}> {Utils.translate("post.gallery")} </Text>
          </TouchableOpacity>
        </View>
        <Toast
          ref={ref => this.ToastRef = ref}
          position='top'
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          style={{ backgroundColor: EStyleSheet.value('$kashmir') }}
          textStyle={{ color: EStyleSheet.value('$whiteColor'), fontWeight: "bold" }}
        />
      </SafeAreaView>);
  }
}