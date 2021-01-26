import React, { Component } from "react"
import { View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl } from "react-native";
import { BaseStyle, Images, BaseConfig, firebaseSvc } from "@config";
import { Button, Icon, Text } from "@components";
import * as Utils from "@utils";
import EStyleSheet from 'react-native-extended-stylesheet';
import { apiActions } from "@actions";
import { store } from "@store";
import styles from "./styles";
import { GiftedChat } from 'react-native-gifted-chat';
import Spinner from 'react-native-loading-spinner-overlay';
import { EventRegister } from 'react-native-event-listeners'
import MessageToast, { BaseToast } from 'react-native-toast-message';

import { connect } from "react-redux";
import Toast from 'react-native-toast-message';
import Textarea from 'react-native-textarea';

const onNotification = data => {
    return {
        type: actionTypes.PREF_NOTIFICATIONS,
        data
    };
};

const toastConfig = {
    success: ({ text1 }) => (
        <View
            style={{
                paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center', marginTop: 80,
                height: 50, width: '80%', backgroundColor: EStyleSheet.value('$successColor'), borderRadius: 25
            }}>
            <Text style={{ textAlign: 'center', color: EStyleSheet.value('$blackColor'), fontSize: 16, fontWeight: 'bold', }}>{text1}</Text>
        </View>
    ),
    error: ({ text1 }) => (
        <View
            style={{
                paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center',
                height: 50, width: '80%', backgroundColor: EStyleSheet.value('$errorColor'), borderRadius: 25, marginTop: 80,
            }}>
            <Text style={{ textAlign: 'center', color: EStyleSheet.value('$whiteColor'), fontSize: 16, fontWeight: 'bold' }}>{text1}</Text>
        </View>
    ),
    info: () => { },
};

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
        this.room = props.navigation.state.params.room;
    }

    componentWillMount() {
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
    }

    onClose() {
       
    }
    
  
    render() {
        let {loading, messages} = this.state;
        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView, { backgroundColor: EStyleSheet.value('$contentColor') }]}
                forceInset={{ top: "always" }}
            >
                
            </SafeAreaView>);
    }
}

const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);