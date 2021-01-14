import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { View, TextInput, Image, SafeAreaView, ScrollView, TouchableOpacity, Linking, Alert, BackHandler } from "react-native";
import { BaseStyle, Images, BaseConfig } from "@config";
import * as Utils from "@utils";
import styles from "./styles";
import { Text, Button } from "@components";
import EStyleSheet from 'react-native-extended-stylesheet';
import Toast from 'react-native-easy-toast'
import { apiActions, actionTypes } from "@actions";
import { openComposer, openInbox  } from 'react-native-email-link'
import CheckBox from '@react-native-community/checkbox';
import RNRestart from 'react-native-restart'; 
import { store, SetPrefrence, GetPrefrence } from "@store";

const onLogin = data => {
  return {
    type: actionTypes.LOGIN,
    data
  };
};

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      errMsg: Utils.translate("messages.login-failed-msg"),
      email: BaseConfig.debugging ? "bognarvojislav791@gmail.com" : '',
      password: BaseConfig.debugging ? "123456" : '',
      agree :false,
      success: {
        email: true,
        password: true
      },

    };
    this.ToastRef = null;

  }
   onLogin()  {
    const { navigation } = this.props;
    let {email, password, success, agree} = this.state;
    if(!agree){
      this.ToastRef.show(Utils.translate("auth.invalid-agree"));
      return;
    }else if(!Utils.EMAIL_VALIDATE.test(String(email).toLowerCase())) {
      this.setState({ success: {  ...success, email: false} });
      this.ToastRef.show(Utils.translate("Account.invalid-email"));
      return;
    } else if(password == ""){
      this.setState({ success: {  ...success, email: false} });
      this.ToastRef.show(Utils.translate("Account.invalid-password"));
      return;
    }

    if(this.mounted){
      this.setState({
        loading:true
      }, ()=>{
        apiActions.login(this.state)
          .then(response=>  {
            const data = {
              success: true,
              onboarding: true,
              data: {},
            };
  
            data.data = response.data;
            data.data.user.password = password;
            this.props.dispatch(onLogin(data))
            setTimeout(() => {
              try {
                return RNRestart.Restart();
              } catch (err) {
              }
            }, 500);
            // return this.props.navigation.navigate("Loading");
          })
          .catch(err =>{
            console.log(err);
          })
          .finally(
            () => this.setState({ loading: false })
          )
  
      })
    }
  }

  componentDidMount(){
    this.mounted = true;
    // BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount(){
    this.mounted = false;
    // BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  // onBackPress = () => {
  //   Alert.alert(
  //     'Confirm exit',
  //     'Do you want to exit App?',
  //     [
  //       {text: 'CANCEL', style: 'cancel'},
  //       {text: 'OK', onPress: () => {
  //         BackHandler.exitApp()
  //        }
  //      }
  //     ]
  //  );
  //   return true;
  // }

  onSingUp(){
    return this.props.navigation.navigate("SignUp");
  }

  onSupport(){
    Linking.openURL(`mailto:info@boldo.ca`)
  }

  onForget(){
    Linking.openURL(`mailto:info@boldo.ca?subject=Forgot Password`)
  }

  onTerms(){
    Linking.openURL(`http://54.163.177.131/terms`)
  }

  render() {
    const { email, password, loading, success, errMsg, agree } = this.state;
    return (
      <SafeAreaView
        style={BaseStyle.safeAreaView}
        forceInset={{ top: "always" }}
      >
        <ScrollView >
          <View style={styles.logo}>
            <Image resizeMode={"contain"} style={{ width: 300, height: 140 }} source={Images.logo} />
          </View>
          <View style={styles.contain}>
            <Text title3 blackColor style={styles.signEmail}> {Utils.translate("Account.email")} </Text>
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
              placeholder={Utils.translate("Account.email")}
              placeholderTextColor={
                success.email
                  ? EStyleSheet.value('$grayColor')
                  : EStyleSheet.value('$errorColor')
              }
              keyboardType={'email-address'}
              value={email}
              selectionColor={EStyleSheet.value('$primaryColor')}
            />
            <Text title3 blackColor style={styles.signPassword}> {Utils.translate("Account.password")} </Text>
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
            <View style={{alignItems:'flex-end', marginTop:10, width:'100%'}}>
              <TouchableOpacity onPress={() => {this.onForget();}}>
                <Text> {Utils.translate("auth.forget-password")}</Text>
              </TouchableOpacity>
            </View>
            <View style={{alignItems: "center", display:'flex', flexDirection: "column", justifyContent:'center'}}>
              <View style={{flexDirection: "row"}}>
                <CheckBox
                  value={agree}
                  onValueChange={agree => this.setState({ agree })}
                  style={{alignSelf: "center",}}
                  tintColors={{true:EStyleSheet.value('$primaryColor'), false:EStyleSheet.value('$primaryColor')}}
                />
                <Text style={{margin:8, fontSize:15}}> {Utils.translate("auth.have-read")}</Text>
              </View>
              <TouchableOpacity onPress={() => {this.onTerms();}}>
                  <Text style={{color:EStyleSheet.value("$primaryColor"), textDecorationLine: 'underline', fontSize:15}}>{Utils.translate("auth.terms")}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ width: "100%", marginTop: 30}}>
              <Button
                full
                loading={loading}
                onPress={() => {
                  if(!loading)
                    this.onLogin();
                }}
              >
                {Utils.translate("auth.sign-in")}
              </Button>
            </View>
            <View style={{ width: "100%", marginTop: 10}}>
              <Button
                outline
                onPress={() => {
                  if(!loading)
                    this.onSingUp();
                }}
              >
                {Utils.translate("auth.sign-up")}
              </Button>
            </View>
          </View>
          <TouchableOpacity onPress={() => {this.onSupport();}} style={{marginTop:10}}>
            <View style={{  flex: 1, 
                alignItems: 'center',
                justifyContent: 'center'}}>
              <Text title3 blackColor> {Utils.translate("auth.support")} </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <Toast
          ref={ref => this.ToastRef = ref}
          position='top'
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          style={{ backgroundColor: EStyleSheet.value('$errorColor') }}
          textStyle={{ color: EStyleSheet.value('$whiteColor'), fontWeight: "bold" }}
        />
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(null, mapDispatchToProps)(SignIn);
