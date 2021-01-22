import React, { Component } from "react";
import {Platform, PermissionsAndroid, View, TouchableOpacity, 
  TextInput, SafeAreaView, ScrollView, Image} from "react-native";
import {Picker} from '@react-native-picker/picker';
import { BaseStyle, BaseConfig, Images,} from "@config";
import { Icon, Button, Text} from "@components";
import styles from "./styles";
import * as Utils from "@utils";
import AlertPro from "react-native-alert-pro";
import { apiActions, actionTypes} from "@actions";
import Toast from 'react-native-easy-toast'
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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';


export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      password: "",
      email: "",
      bio:"",
      references:"",
      styleOfCooking:[],
      liquorServingCertification:'yes',
      company : "",
      title:"",
      years:"",
      location:"",
      geolocation:{},
      postalCode:"",
      loading: false,
      avatar : Images.camera,
      photo64 : '',
      professional:true,
      histories : [{company:"", title:"", years:"", success:{company:true, title:true, years:true}}],
      typeOfProfessional : [],

      items : store.getState().type.types,
      style_items : store.getState().style.styles,
      success: {
        fname: true,
        lname: true,
        email: true,
        bio:true,
        references:true,
        styleOfCooking:true,
        liquorServingCertification:true,
        company : true,
        title:true,
        years:true,
        location:true,
        postalCode:true,
        typeOfProfessional:true,
        password: true,
        cPassword: true,
      }
    };
    this.AlertPro = null;
    this.ToastRef = null;
    this.requirePermission();
  }

  componentDidMount(){
    let items = store.getState().type.types;
    let style_items = store.getState().style.styles;
    this.setState({items:items, style_items:style_items});
  }

  componentWillUnmount(){

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

  onClose(){
    this.props.navigation.goBack();
  }

  choosePhoto(){
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
        let source = { uri: 'data:image/jpeg;base64,' + response.base64};
        this.setState({avatar:response, photo64:source.uri});
      }
    });
  }

  moreHistory(){
    let histories = this.state.histories;
    let temp = {company:"", title:"", years:"", success:{company:true, title:true, years:true}}
    histories.push(temp);
    this.setState({histories:histories});
  }

  minusHistory(){
    let histories = this.state.histories;
    histories.splice(histories.length-1, 1);
    this.setState({histories:histories});
  }

  hasPermission(){
    let types = this.state.typeOfProfessional;
    let styles = this.state.styleOfCooking;
    let hasPermission = false;

    let items = this.state.items;
    let style_items = this.state.items;

    types.forEach(id => {
      const result = items[0].children.filter(item => item.id == id && (item.name == "Chef" || item.name == "Caterer") );
      if(result.length > 0){
        hasPermission = true;
        console.log(result);
        return;
      }
    });

    if(!hasPermission){
      if(styles.length > 0){
        styles = [];
        this.setState({styleOfCooking:styles});
      }
    }

    return hasPermission;
  }

  setHistory = (index, item, key, value) => {
    let histories = this.state.histories;
    let history = histories[index];

    if(key.includes(".")){
      let keys = key.split(".");
      history[keys[0]][keys[1]] = value;
    }else{
      history[key] = value;
    }

    histories[index] = history
    this.setState({histories:histories});
  }

  onSignUp() {
    const { navigation } = this.props;
    let { loading, fname, lname, password, cPassword, email, success, professional, avatar, bio, references, styleOfCooking,
     liquorServingCertification, location, postalCode, typeOfProfessional, histories, geolocation, items, style_items} = this.state;
    if(fname == ""){
      this.setState({ success: {  ...success, fname: false} });
      this.ToastRef.show(Utils.translate("Account.invalid-name"));
      return;
    } else if (!Utils.EMAIL_VALIDATE.test(String(email).toLowerCase())) {
      this.setState({ success: {  ...success, email: false} });
      this.ToastRef.show(Utils.translate("Account.invalid-email"));
      return;
    }
    if(professional){
      if (bio == "") {
        this.setState({ success: {  ...success, bio: false} });
        this.ToastRef.show(Utils.translate("Account.invalid-bio"));
        return;
      }else  if (references == "") {
        this.setState({ success: {  ...success, references: false} });
        this.ToastRef.show(Utils.translate("Account.invalid-references"));
        return;
      }  else if (liquorServingCertification == "") {
        this.setState({ success: {  ...success, liquorServingCertification: false} });
        this.ToastRef.show(Utils.translate("Account.invalid-liquorservingcertification"));
        return;
      } else if (typeOfProfessional.length == 0) {
        this.setState({ success: {  ...success, location: false} });
        this.ToastRef.show(Utils.translate("Account.invalid-typeofprofessional"));
        return;
      } else if (styleOfCooking.length == 0 && this.hasPermission()) {
        this.setState({ success: {  ...success, styleOfCooking: false} });
        this.ToastRef.show(Utils.translate("Account.invalid-styleofcooking"));
        return;
      } else if (location == "") {
        this.setState({ success: {  ...success, location: false} });
        this.ToastRef.show(Utils.translate("Account.invalid-location"));
        return;
      } else if (postalCode == "") {
        this.setState({ success: {  ...success, location: false} });
        this.ToastRef.show(Utils.translate("Account.invalid-postal-code"));
        return;
      } 

      for(let i = 0; i < histories.length; i ++){
        let history = histories[i];
        if (history.company == "") {
          this.setHistory(i, history, "success.company", false);
          this.ToastRef.show(Utils.translate("Account.invalid-company"));
          return;
        } else if (history.title == "") {
          this.setHistory(i, history, "success.title", false);
          this.ToastRef.show(Utils.translate("Account.invalid-title"));
          return;
        } else if (history.years == "") {
          this.setHistory(i, history, "success.years", false);
          this.ToastRef.show(Utils.translate("Account.invalid-years"));
          return;
        }
      }
    }

    if (password == "") {
      this.setState({ success: {  ...success, password: false} });
      this.ToastRef.show(Utils.translate("Account.invalid-password"));
      return;
    } else if (cPassword == "") {
      this.setState({ success: {  ...success, cPassword: false} });
      this.ToastRef.show(Utils.translate("Account.invalid-cpassword"));
      return;
    } else if (cPassword != password) {
      this.setState({ success: {  ...success, cPassword: false} });
      this.ToastRef.show(Utils.translate("Account.notsame-cpassword"));
      return;
    } 

    this.setState(
      {
        success: {
          name: true,
          email: true,
          bio:true,
          references:true,
          styleOfCooking:true,
          liquorServingCertification:true,
          company : true,
          title:true,
          years:true,
          location:true,
          postalCode:true,
          typeOfProfessional:true,
          password: true,
          cPassword: true,
        },
        loading: true,
      },
      () => {
        apiActions.registration(this.state)
        .then(async response=>{
          if (response.data == "exists")  { 
            this.ToastRef.show(Utils.translate("messages.register-exist-email-msg"));
          }else{
            navigation.navigate("SignIn");
          }
        })
        .catch(err =>{
          console.log(err);
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
     liquorServingCertification, location, postalCode, typeOfProfessional, histories, geolocation, items, style_items} = this.state;
    
    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView,{ backgroundColor: "#fff"}]}
        forceInset={{ top: "always" }}
      >
        <View style={{ flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center", marginTop:30, paddingHorizontal:20 }}>
          <TouchableOpacity onPress={() => {this.onClose()}}>
            <Image  source={Images.back} ></Image>
          </TouchableOpacity>
          <View style={{flexDirection:'row', flex:1, justifyContent:'center'}}>
            <TouchableOpacity onPress={() => {this.setState({professional:true})}}>
              <Text style={professional?styles.activeTab:styles.deActiveTab}>  {Utils.translate("auth.professional")}  </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {this.setState({professional:false})}}>
              <Text style={professional?styles.deActiveTab:styles.activeTab}>  {Utils.translate("auth.customer")}  </Text>
            </TouchableOpacity>
          </View>
        </View>

        <KeyboardAwareScrollView style={{paddingHorizontal:30, marginBottom:30}} keyboardShouldPersistTaps='handled'>
          <View style={{flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center", marginVertical:10 }}>
            <TouchableOpacity onPress={() => this.choosePhoto()} style={{flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
              <Image source={avatar} style={styles.blog_user_img} />
              <Text blackColor style={{marginTop:5}}>  {Utils.translate("auth.upload-photo")}  </Text>
            </TouchableOpacity>
          </View>

          <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.fname")} </Text>
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
                ? EStyleSheet.value('$grayColor')
                : EStyleSheet.value('$errorColor')
            }
            value={fname}
            selectionColor={EStyleSheet.value('$primaryColor')}
          />

          <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.lname")} </Text>
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
                ? EStyleSheet.value('$grayColor')
                : EStyleSheet.value('$errorColor')
            }
            value={lname}
            selectionColor={EStyleSheet.value('$primaryColor')}
          />

          <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.email")} </Text>
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
                ? EStyleSheet.value('$grayColor')
                : EStyleSheet.value('$errorColor')
            }
            keyboardType={'email-address'}
            value={email}
            selectionColor={EStyleSheet.value('$primaryColor')}
          />
          { professional && <>
            <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.bio")} </Text>
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
                  ? EStyleSheet.value('$grayColor')
                  : EStyleSheet.value('$errorColor')
              }
              underlineColorAndroid={'transparent'}
            />
            <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.references")} </Text>
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
                  ? EStyleSheet.value('$grayColor')
                  : EStyleSheet.value('$errorColor')
              }
              value={references}
              selectionColor={EStyleSheet.value('$primaryColor')}
            />
            <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.liquor-serving-certification")} </Text>
            <View style={{...(Platform.OS !== 'android' && {zIndex: 10 })}}>
              <DropDownPicker
                items={[
                    {label: 'Yes', value: 'yes'},
                    {label: 'No', value: 'no'},
                ]}
                defaultValue={liquorServingCertification}
                containerStyle={{height: 50}}
                style={{backgroundColor: '#fafafa'}}
                itemStyle={{justifyContent: 'flex-start' }}
                dropDownStyle={{backgroundColor: '#fafafa'}}
                onChangeItem={item => this.setState({
                  liquorServingCertification: item.value
                })}
              />
            </View>
            <View style={{flexDirection:"row", alignItems: "center"}}>
              <Text title3 blackColor style={styles.formTextWorkHistory}> {Utils.translate("Account.work-history")} </Text>
              {histories.length>1 && 
                <TouchableOpacity style={{marginLeft:10, marginRight:10}} onPress={() => {
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
            {histories.map((item, key)=>(
              <View style={styles.workHistory} key={key}>
                <TextInput
                  style={[BaseStyle.textInput, {width:'40%'}]}
                  onChangeText={company => this.setHistory(key, item, 'company', company)}
                  onFocus={() => this.setHistory(key, item, 'success.company', true)}
                  autoCorrect={false}
                  placeholder={Utils.translate("Account.company-placeholder")}
                  placeholderTextColor={
                    item.success.company
                      ? EStyleSheet.value('$grayColor')
                      : EStyleSheet.value('$errorColor')
                  }
                  value={item.company}
                  selectionColor={EStyleSheet.value('$primaryColor')}
                />
                <TextInput
                  style={[BaseStyle.textInput, {width:'30%', marginHorizontal:'5%'}]}
                  onChangeText={title => this.setHistory(key, item, 'title', title)}
                  onFocus={() => this.setHistory(key, item, 'success.title', true)}
                 
                  autoCorrect={false}
                  placeholder={Utils.translate("Account.title-placeholder")}
                  placeholderTextColor={
                    item.success.title
                      ? EStyleSheet.value('$grayColor')
                      : EStyleSheet.value('$errorColor')
                  }
                  value={item.title}
                  selectionColor={EStyleSheet.value('$primaryColor')}
                />
                <TextInput
                  style={[BaseStyle.textInput, {width:'20%'}]}
                  onChangeText={years => this.setHistory(key, item, 'years', years)}
                  onFocus={() => this.setHistory(key, item, 'success.years', true)}
                  autoCorrect={false}
                  placeholder={Utils.translate("Account.years-placeholder")}
                  placeholderTextColor={
                    item.success.years
                      ? EStyleSheet.value('$grayColor')
                      : EStyleSheet.value('$errorColor')
                  }
                  keyboardType='numeric'
                  value={item.years}
                  selectionColor={EStyleSheet.value('$primaryColor')}
                />
              </View>
            ))}
            <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.typeOfProfessional")} </Text>
            <View style={styles.locationForm}>
              <SectionedMultiSelect
                items={items}
                IconRenderer={IconMaterial}
                searchPlaceholderText="Search types"
                uniqueKey="id"
                subKey="children"
                selectText="Choose your types"
                showDropDowns={false}
                readOnlyHeadings={true}
                onSelectedItemsChange={types => this.setState({typeOfProfessional: types })}
                selectedItems={typeOfProfessional}
                colors={{primary:EStyleSheet.value('$primaryColor'), 
                subText:EStyleSheet.value('$blackColor'),
                success:EStyleSheet.value('$primaryColor')}}
                hideSearch={true}
                styles={{container :{marginVertical: Platform.OS !== 'android'?150:50, paddingTop:20},  selectedSubItemText :{color:EStyleSheet.value('$primaryColor')}}}
              />
            </View>
            {this.hasPermission() && <>
              <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.style-of-cooking")} </Text>
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
                  onSelectedItemsChange={styles => this.setState({styleOfCooking: styles })}
                  selectedItems={styleOfCooking}
                  colors={{primary:EStyleSheet.value('$primaryColor'), 
                  subText:EStyleSheet.value('$blackColor'),
                  success:EStyleSheet.value('$primaryColor')}}
                  hideSearch={true}
                  styles={{container : {marginVertical: Platform.OS !== 'android'?150:50, paddingTop:20},
                  selectedSubItemText :{color:EStyleSheet.value('$primaryColor')}}}
                />
              </View>
            </>}
           
            <Text title3 blackColor style={styles.formText} > {Utils.translate("Account.location")} </Text>
            <View style={styles.locationForm} >
              <GooglePlacesAutocomplete
                placeholder={Utils.translate("Account.location-placeholder")}
                fetchDetails={true}
                onPress={(data, detail) => {
                  this.setState({location:data.description, geolocation:detail.geometry.location});
                }}
                query={{
                  key: 'AIzaSyCjCZM8TG6uH8QnEYgEB31aTFzDKQhMF2k',
                  language: 'en',
                }}
              />
            </View>
            <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.postal-code")} </Text>
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
                  ? EStyleSheet.value('$grayColor')
                  : EStyleSheet.value('$errorColor')
              }
              value={postalCode}
              selectionColor={EStyleSheet.value('$primaryColor')}
            />
          </>}

          <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.password")} </Text>
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
            placeholder={Utils.translate("Account.password")}
            secureTextEntry={true}
            multiline={false}
            placeholderTextColor={
              success.password
                ? EStyleSheet.value('$grayColor')
                : EStyleSheet.value('$errorColor')
            }
            value={password}
            selectionColor={EStyleSheet.value('$primaryColor')}
          />
          <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.c-password")} </Text>
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
            placeholder={Utils.translate("Account.c-password")}
            secureTextEntry={true}
            multiline={false}
            placeholderTextColor={
              success.cPassword
                ? EStyleSheet.value('$grayColor')
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
                if(!loading)
                  this.onSignUp();
              }}
            >
              {Utils.translate("auth.sign-up")}
            </Button>
          </View>
        </KeyboardAwareScrollView>
        <Toast
          ref={ref => this.ToastRef = ref}
          position='top'
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          style={{ backgroundColor: EStyleSheet.value('$errorColor'), width:'80%', height:50, justifyContent:'center', alignItems:'center'}}
          textStyle={{ color: EStyleSheet.value('$whiteColor'), fontWeight: "bold", fontSize:20 }}
        />
      </SafeAreaView>
    );
  }
}