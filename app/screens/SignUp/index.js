import React, { Component } from "react";
import {
  Platform, PermissionsAndroid, View, TouchableOpacity,
  TextInput, SafeAreaView, ScrollView, Image
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { BaseStyle, BaseConfig, Images, } from "@config";
import { Icon, Button, Text } from "@components";
import styles from "./styles";
import * as Utils from "@utils";
import AlertPro from "react-native-alert-pro";
import { apiActions, actionTypes } from "@actions";
import EStyleSheet from 'react-native-extended-stylesheet';
import { Appearance } from 'react-native-appearance'
import Textarea from 'react-native-textarea';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Tags from "react-native-tags";
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import IconFeather from 'react-native-vector-icons/Feather';
import { store, SetPrefrence, GetPrefrence } from "@store";
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import style from "../../reducers/style";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

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
  info: () => { },
};

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      password: "",
      email: "",
      bio: "",
      references: "",
      styleOfCooking: [],
      liquorServingCertification: 'yes',
      company: "",
      title: "",
      years: "",
      location: "",
      geolocation: {},
      postalCode: "",
      loading: false,
      avatar: Images.camera,
      photo64: '',
      professional: true,
      histories: [{ company: "", title: "", years: "", success: { company: true, title: true, years: true } }],
      typeOfProfessional: [],

      type_items: [].concat(store.getState().type.types),
      style_items: [].concat(store.getState().style.styles),
      success: {
        fname: true,
        lname: true,
        email: true,
        bio: true,
        references: true,
        styleOfCooking: true,
        liquorServingCertification: true,
        company: true,
        title: true,
        years: true,
        location: true,
        postalCode: true,
        typeOfProfessional: true,
        password: true,
        cPassword: true,
      }
    };
    this.requirePermission();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
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
      }
    }
  }

  onClose() {
    return this.props.navigation.goBack();
  }

  choosePhoto() {
    let options = {
      title: Utils.translate("auth.select-image"),
      cameraType: 'front',
      mediaType: 'photo',
      includeBase64: true,
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
        let source = { uri: 'data:image/jpeg;base64,' + response.base64 };
        this.setState({ avatar: response, photo64: source.uri });
      }
    });
  }

  moreHistory() {
    let histories = this.state.histories;
    let temp = { company: "", title: "", years: "", success: { company: true, title: true, years: true } }
    histories.push(temp);
    this.setState({ histories: histories });
  }

  minusHistory() {
    let histories = this.state.histories;
    histories.splice(histories.length - 1, 1);
    this.setState({ histories: histories });
  }

  hasPermission() {
    let types = this.state.typeOfProfessional;
    let styles = this.state.styleOfCooking;
    let hasPermission = false;

    let type_items = this.state.type_items;

    types.forEach(id => {
      const result = type_items[0].children.filter(item => item.id == id && item.style == 1);
      if (result.length > 0) {
        hasPermission = true;
        return;
      }
    });

    if (!hasPermission) {
      if (styles.length > 0) {
        styles = [];
        this.setState({ styleOfCooking: styles });
      }
    }
    return hasPermission;
  }

  setHistory = (index, item, key, value) => {
    let histories = this.state.histories;
    let history = histories[index];

    if (key.includes(".")) {
      let keys = key.split(".");
      history[keys[0]][keys[1]] = value;
    } else {
      history[key] = value;
    }

    histories[index] = history
    this.setState({ histories: histories });
  }

  onSignUp() {
    const { navigation } = this.props;
    let { loading, fname, lname, password, cPassword, email, success, professional, photo64, bio, references, styleOfCooking,
      liquorServingCertification, location, postalCode, typeOfProfessional, histories, geolocation, type_items, style_items } = this.state;
    if (fname == "") {
      this.setState({ success: { ...success, fname: false } });
      Toast.show({ text1: Utils.translate("Account.invalid-name"), type: 'error' },);
      return;
    } else if (!Utils.EMAIL_VALIDATE.test(String(email).toLowerCase())) {
      this.setState({ success: { ...success, email: false } });
      Toast.show({ text1: Utils.translate("Account.invalid-email"), type: 'error' },);
      return;
    }
    if (professional) {
      if (bio == "") {
        this.setState({ success: { ...success, bio: false } });
        Toast.show({ text1: Utils.translate("Account.invalid-bio"), type: 'error' },);
        return;
      } else if (references == "") {
        this.setState({ success: { ...success, references: false } });
        Toast.show({ text1: Utils.translate("Account.invalid-references"), type: 'error' },);
        return;
      } else if (liquorServingCertification == "") {
        this.setState({ success: { ...success, liquorServingCertification: false } });
        Toast.show({ text1: Utils.translate("Account.invalid-liquorservingcertification"), type: 'error' },);
        return;
      } else if (typeOfProfessional.length == 0) {
        this.setState({ success: { ...success, location: false } });
        Toast.show({ text1: Utils.translate("Account.invalid-typeofprofessional"), type: 'error' },);
        return;
      } else if (styleOfCooking.length == 0 && this.hasPermission()) {
        this.setState({ success: { ...success, styleOfCooking: false } });
        Toast.show({ text1: Utils.translate("Account.invalid-styleofcooking"), type: 'error' },);
        return;
      } else if (location == "") {
        this.setState({ success: { ...success, location: false } });
        Toast.show({ text1: Utils.translate("Account.invalid-location"), type: 'error' },);
        return;
      } else if (postalCode == "") {
        this.setState({ success: { ...success, location: false } });
        Toast.show({ text1: Utils.translate("Account.invalid-postal-code"), type: 'error' },);
        return;
      }

      for (let i = 0; i < histories.length; i++) {
        let history = histories[i];
        if (history.company == "") {
          this.setHistory(i, history, "success.company", false);
          Toast.show({ text1: Utils.translate("Account.invalid-company"), type: 'error' },);
          return;
        } else if (history.title == "") {
          this.setHistory(i, history, "success.title", false);
          Toast.show({ text1: Utils.translate("Account.invalid-title"), type: 'error' },);
          return;
        } else if (history.years == "") {
          this.setHistory(i, history, "success.years", false);
          Toast.show({ text1: Utils.translate("Account.invalid-years"), type: 'error' },);
          return;
        }
      }
    }

    if (password == "") {
      this.setState({ success: { ...success, password: false } });
      Toast.show({ text1: Utils.translate("Account.invalid-password"), type: 'error' },);
      return;
    } else if (cPassword == "") {
      this.setState({ success: { ...success, cPassword: false } });
      Toast.show({ text1: Utils.translate("Account.invalid-cpassword"), type: 'error' },);
      return;
    } else if (cPassword != password) {
      this.setState({ success: { ...success, cPassword: false } });
      Toast.show({ text1: Utils.translate("Account.notsame-cpassword"), type: 'error' },);
      return;
    }

    let model = {
      fname: fname,
      lname: lname,
      email: email,
      bio: bio,
      references: references,
      styleOfCooking: styleOfCooking,
      liquorServingCertification: liquorServingCertification,
      location: location,
      postalCode: postalCode,
      geolocation: geolocation,
      typeOfProfessional: typeOfProfessional,
      password: password,
      professional: professional,
      photo64: photo64,
      histories: histories,
    }

    this.setState(
      {
        success: {
          name: true,
          email: true,
          bio: true,
          references: true,
          styleOfCooking: true,
          liquorServingCertification: true,
          company: true,
          title: true,
          years: true,
          location: true,
          postalCode: true,
          typeOfProfessional: true,
          password: true,
          cPassword: true,
        },
        loading: true,
      },
      () => {
        apiActions.registration(model)
          .then(async response => {
            if (response.data == "exists") {
              Toast.show({ text1: Utils.translate("messages.register-exist-email-msg"), type: 'error' });
            } else {
              navigation.navigate("SignIn");
            }
          })
          .catch(err => {
            Toast.show({ text1: Utils.translate("messages.register-failed"), type: 'error' });
          })
          .finally(
            () => this.setState({ loading: false })
          )
      }
    );
  }

  render() {
    const { navigation } = this.props;
    let { loading, fname, lname, password, cPassword, email, success, professional, avatar, bio, references, styleOfCooking,
      liquorServingCertification, location, postalCode, typeOfProfessional, histories, geolocation, type_items, style_items } = this.state;

    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView]}
        forceInset={{ top: "always" }}
      >
        <View style={{ flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center", marginTop: 30, paddingHorizontal: 20 }}>
          <TouchableOpacity onPress={() => { this.onClose() }}>
            <Image source={Images.back} style={{width:20, height:20, resizeMode:'cover'}} ></Image>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
            <TouchableOpacity onPress={() => { this.setState({ professional: true }) }}>
              <Text style={professional ? styles.activeTab : styles.deActiveTab}>  {Utils.translate("auth.professional")}  </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { this.setState({ professional: false }) }}>
              <Text style={professional ? styles.deActiveTab : styles.activeTab}>  {Utils.translate("auth.customer")}  </Text>
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAwareScrollView style={{ paddingHorizontal: 30, marginBottom: 30 }} keyboardShouldPersistTaps='handled'>
          <View style={{ flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center", marginVertical: 10 }}>
            <TouchableOpacity onPress={() => this.choosePhoto()} style={{ flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
              <Image source={avatar} style={styles.blog_user_img} />
              <Text blackColor style={{ marginTop: 5 }}>  {Utils.translate("auth.upload-photo")}  </Text>
            </TouchableOpacity>
          </View>

          <Text name style={styles.formText}> {Utils.translate("Account.fname")} </Text>
          <TextInput
            style={[BaseStyle.textInput]}
            onChangeText={fname => this.setState({ fname })}
            onFocus={() => {
              this.setState({
                success: {
                  ...success,
                  fname: true
                }
              });
            }}
            autoCorrect={false}
            placeholder={Utils.translate("Account.fname-placeholder")}
            placeholderTextColor={
              success.fname
                ? EStyleSheet.value('$placeColor')
                : EStyleSheet.value('$errorColor')
            }
            value={fname}
            selectionColor={EStyleSheet.value('$primaryColor')}
          />

          <Text name style={styles.formText}> {Utils.translate("Account.lname")} </Text>
          <TextInput
            style={[BaseStyle.textInput]}
            onChangeText={lname => this.setState({ lname })}
            onFocus={() => {
              this.setState({
                success: {
                  ...success,
                  lname: true
                }
              });
            }}
            autoCorrect={false}
            placeholder={Utils.translate("Account.lname-placeholder")}
            placeholderTextColor={
              success.lname
                ? EStyleSheet.value('$placeColor')
                : EStyleSheet.value('$errorColor')
            }
            value={lname}
            selectionColor={EStyleSheet.value('$primaryColor')}
          />

          <Text name style={styles.formText}> {Utils.translate("Account.email")} </Text>
          <TextInput
            style={[BaseStyle.textInput]}
            onChangeText={email => this.setState({ email })}
            onFocus={() => {
              this.setState({
                success: {
                  ...success,
                  email: true
                }
              });
            }}
            autoCorrect={false}
            placeholder={Utils.translate("Account.email-placeholder")}
            placeholderTextColor={
              success.email
                ? EStyleSheet.value('$placeColor')
                : EStyleSheet.value('$errorColor')
            }
            keyboardType={'email-address'}
            value={email}
            selectionColor={EStyleSheet.value('$primaryColor')}
          />
          {professional && <>
            <Text name style={styles.formText}> {Utils.translate("Account.bio")} </Text>
            <Textarea
              containerStyle={styles.textareaContainer}
              style={styles.textarea}
              onChangeText={bio => this.setState({ bio })}
              defaultValue={bio}
              onFocus={() => {
                this.setState({
                  success: {
                    ...success,
                    bio: true
                  }
                });
              }}
              placeholder={Utils.translate("Account.bio-placeholder")}
              placeholderTextColor={
                success.bio
                  ? EStyleSheet.value('$placeColor')
                  : EStyleSheet.value('$errorColor')
              }
              selectionColor={EStyleSheet.value('$primaryColor')}
              underlineColorAndroid={'transparent'}
              multiline={true}
            />
            <Text name style={styles.formText}> {Utils.translate("Account.references")} </Text>
            <TextInput
              style={[BaseStyle.textInput]}
              onChangeText={references => this.setState({ references })}
              onFocus={() => {
                this.setState({
                  success: {
                    ...success,
                    references: true
                  }
                });
              }}
              autoCorrect={false}
              placeholder={Utils.translate("Account.references-placeholder")}
              placeholderTextColor={
                success.references
                  ? EStyleSheet.value('$placeColor')
                  : EStyleSheet.value('$errorColor')
              }
              value={references}
              selectionColor={EStyleSheet.value('$primaryColor')}
            />
            <Text name style={styles.formText}> {Utils.translate("Account.liquor-serving-certification")} </Text>
            <View style={{ ...(Platform.OS !== 'android' && { zIndex: 10 }) }}>
              <DropDownPicker
                items={[
                  { label: 'Yes', value: 'yes' },
                  { label: 'No', value: 'no' },
                ]}
                defaultValue={liquorServingCertification}
                containerStyle={{ height: 46 }}
                itemStyle={{ justifyContent: 'flex-start' }}
                labelStyle={{
                  fontSize: 15,
                  textAlign: 'left',
                  color: EStyleSheet.value('$textColor')
                }}
                onChangeItem={item => this.setState({
                  liquorServingCertification: item.value
                })}
              />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text name style={styles.formTextWorkHistory}> {Utils.translate("Account.work-history")} </Text>
              {histories.length > 1 &&
                <TouchableOpacity style={{ marginLeft: 10, marginRight: 10 }} onPress={() => {
                  this.minusHistory();
                }}>
                  <Icon name={'minus'}></Icon>
                </TouchableOpacity>}

              <TouchableOpacity onPress={() => {
                this.moreHistory();
              }}>
                <Icon name={'plus'}></Icon>
              </TouchableOpacity>
            </View>
            {histories.map((item, key) => (
              <View style={styles.workHistory} key={key}>
                <TextInput
                  style={[BaseStyle.textInput, { width: '40%' }]}
                  onChangeText={company => this.setHistory(key, item, 'company', company)}
                  onFocus={() => this.setHistory(key, item, 'success.company', true)}
                  autoCorrect={false}
                  placeholder={Utils.translate("Account.company-placeholder")}
                  placeholderTextColor={
                    item.success.company
                      ? EStyleSheet.value('$placeColor')
                      : EStyleSheet.value('$errorColor')
                  }
                  value={item.company}
                  selectionColor={EStyleSheet.value('$primaryColor')}
                />
                <TextInput
                  style={[BaseStyle.textInput, { width: '30%', marginHorizontal: '5%' }]}
                  onChangeText={title => this.setHistory(key, item, 'title', title)}
                  onFocus={() => this.setHistory(key, item, 'success.title', true)}

                  autoCorrect={false}
                  placeholder={Utils.translate("Account.title-placeholder")}
                  placeholderTextColor={
                    item.success.title
                      ? EStyleSheet.value('$placeColor')
                      : EStyleSheet.value('$errorColor')
                  }
                  value={item.title}
                  selectionColor={EStyleSheet.value('$primaryColor')}
                />
                <TextInput
                  style={[BaseStyle.textInput, { width: '20%' }]}
                  onChangeText={years => this.setHistory(key, item, 'years', years)}
                  onFocus={() => this.setHistory(key, item, 'success.years', true)}
                  autoCorrect={false}
                  placeholder={Utils.translate("Account.years-placeholder")}
                  placeholderTextColor={
                    item.success.years
                      ? EStyleSheet.value('$placeColor')
                      : EStyleSheet.value('$errorColor')
                  }
                  keyboardType='numeric'
                  value={item.years}
                  selectionColor={EStyleSheet.value('$primaryColor')}
                />
              </View>
            ))}
            <Text name style={styles.formText}> {Utils.translate("Account.typeOfProfessional")} </Text>
            <View style={styles.locationForm}>
              <SectionedMultiSelect
                items={type_items}
                IconRenderer={IconMaterial}
                searchPlaceholderText="Search types"
                uniqueKey="id"
                subKey="children"
                selectText="Choose your types"
                showDropDowns={false}
                readOnlyHeadings={true}
                onSelectedItemsChange={types => this.setState({ typeOfProfessional: types })}
                selectedItems={typeOfProfessional}
                colors={{
                  primary: EStyleSheet.value('$primaryColor'),
                  subText: EStyleSheet.value('$blackColor'),
                  success: EStyleSheet.value('$primaryColor')
                }}
                hideSearch={true}
                styles={{ container: { marginVertical: Platform.OS !== 'android' ? 150 : 50, paddingTop: 20 }, selectedSubItemText: { color: EStyleSheet.value('$primaryColor') } }}
              />
            </View>
            {this.hasPermission() && <>
              <Text name style={styles.formText}> {Utils.translate("Account.style-of-cooking")} </Text>
              <View style={styles.locationForm}>
                <SectionedMultiSelect
                  items={style_items}
                  IconRenderer={IconMaterial}
                  searchPlaceholderText="Search types"
                  uniqueKey="id"
                  subKey="children"
                  selectText="Choose your styles"
                  showDropDowns={false}
                  readOnlyHeadings={true}
                  onSelectedItemsChange={styles => this.setState({ styleOfCooking: styles })}
                  selectedItems={styleOfCooking}
                  colors={{
                    primary: EStyleSheet.value('$primaryColor'),
                    subText: EStyleSheet.value('$blackColor'),
                    success: EStyleSheet.value('$primaryColor')
                  }}
                  hideSearch={true}
                  styles={{
                    container: { marginVertical: Platform.OS !== 'android' ? 150 : 50, paddingTop: 20 },
                    selectedSubItemText: { color: EStyleSheet.value('$primaryColor') }
                  }}
                />
              </View>
            </>}

            <Text name style={styles.formText} > {Utils.translate("Account.location")} </Text>
            <View style={styles.locationForm} >
              <GooglePlacesAutocomplete
                placeholder={Utils.translate("Account.location-placeholder")}
                fetchDetails={true}
                onPress={(data, detail) => {
                  this.setState({ location: data.description, geolocation: detail.geometry.location });
                }}
                query={{
                  key: 'AIzaSyCjCZM8TG6uH8QnEYgEB31aTFzDKQhMF2k',
                  language: 'en',
                }}
              />
            </View>
            <Text name style={styles.formText}> {Utils.translate("Account.postal-code")} </Text>
            <TextInput
              style={[BaseStyle.textInput]}
              onChangeText={postalCode => this.setState({ postalCode })}
              onFocus={() => {
                this.setState({
                  success: {
                    ...success,
                    postalCode: true
                  }
                });
              }}
              placeholder={Utils.translate("Account.postal-code-placeholder")}
              multiline={false}
              placeholderTextColor={
                success.postalCode
                  ? EStyleSheet.value('$placeColor')
                  : EStyleSheet.value('$errorColor')
              }
              value={postalCode}
              selectionColor={EStyleSheet.value('$primaryColor')}
            />
          </>}

          <Text name style={styles.formText}> {Utils.translate("Account.password")} </Text>
          <TextInput
            style={[BaseStyle.textInput]}
            onChangeText={password => this.setState({ password })}
            onFocus={() => {
              this.setState({
                success: {
                  ...success,
                  password: true
                }
              });
            }}
            placeholder={Utils.translate("Account.password-placeholder")}
            secureTextEntry={true}
            multiline={false}
            placeholderTextColor={
              success.password
                ? EStyleSheet.value('$placeColor')
                : EStyleSheet.value('$errorColor')
            }
            value={password}
            selectionColor={EStyleSheet.value('$primaryColor')}
          />
          <Text name style={styles.formText}> {Utils.translate("Account.c-password")} </Text>
          <TextInput
            style={[BaseStyle.textInput]}
            onChangeText={cPassword => this.setState({ cPassword })}
            onFocus={() => {
              this.setState({
                success: {
                  ...success,
                  cPassword: true
                }
              });
            }}
            placeholder={Utils.translate("Account.c-password-placeholder")}
            secureTextEntry={true}
            multiline={false}
            placeholderTextColor={
              success.cPassword
                ? EStyleSheet.value('$placeColor')
                : EStyleSheet.value('$errorColor')
            }
            value={cPassword}
            selectionColor={EStyleSheet.value('$primaryColor')}
          />
          <View style={{ width: "100%", marginTop: 10, }}>
            <Button
              full
              loading={loading}
              onPress={() => {
                if (!loading)
                  this.onSignUp();
              }}
            >
              {Utils.translate("auth.sign-up")}
            </Button>
          </View>
        </KeyboardAwareScrollView>
        <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
      </SafeAreaView>
    );
  }
}