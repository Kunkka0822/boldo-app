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
import Toast from 'react-native-easy-toast'
import { EventRegister } from 'react-native-event-listeners'
import MessageToast, { BaseToast } from 'react-native-toast-message';
const toastConfig = {
    success: ({ text1, text2, ...props }) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: '#69C779' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 15,
                fontWeight: 'bold'
            }}
            text2Style={{
                fontSize: 15,
                color: EStyleSheet.value('$blackColor')
            }}
            text1={text1}
            text2={text2}
        />
    )
};
const role = store.getState().auth?.login?.data?.user?.role;
const user = store.getState().auth?.login?.data?.user;

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            messages: []
        };
        this.room_info = props.navigation.state.params.item;
        this.room = this.room_info.chatroom.room;
        this.ToastRef = null;
        this.MessageToastRef = null;
    }
    componentWillMount() {

    }
    componentDidMount() {
        firebaseSvc.refOn(this.room, message => {
            this.setState(previousState => ({
                messages: GiftedChat.append(previousState.messages, message),
            })
            )
        });

        this.listener = EventRegister.addEventListener('notification', (data) => {
            let type = data._data.type;
            let from_room = data._data.room;
            if (type == "new-message" && from_room != this.room) {
                this.MessageToastRef.show({
                    text1: data._title,
                    text2: data._body,
                    position: 'top',
                    bottomOffset: 10,
                });
            }
        })
        
    }
    componentWillUnmount() {
        firebaseSvc.refOff();
        EventRegister.removeEventListener(this.listener)
    }
    onClose() {
        this.props.navigation.goBack();
    }
    get user() {
        return {
            name: user?.fname + " " + user?.lname,
            email: user?.email,
            avatar: user?.photo,
            id: user?.id,
            _id: user?.id,
        };
    }
    sendChat(msg) {
        let bSend = false;
        if (role == 1) {
            if (this.room_info.chatroom.state1 == 1) {
                bSend = true;
            }
        } else {
            if (this.room_info.chatroom.state2 == 1) {
                bSend = true;
            }
        }
        if (bSend) {
            let user_id = this.room_info.user.id;
            const model = {
                user_id: user_id,
                id: user.id,
                message: msg[0].text,
                room: this.room
            }

            apiActions.sendMessage(model)
                .then(response => {
                    console.log("sent : ", response.success);
                })
                .catch(err => {
                    console.log(err);
                })

            firebaseSvc.send(msg, this.room, false);
        } else {
            this.ToastRef.show("You can chat with this user. ");
        }
    }
    render() {
        let { loading, messages } = this.state;
        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView, { backgroundColor: EStyleSheet.value('$contentColor') }]}
                forceInset={{ top: "always" }}
            >
                <Spinner
                    visible={this.state.loading}
                    textContent={'loading...'}
                    textStyle={{ color: EStyleSheet.value("$primaryColor") }}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: EStyleSheet.value("$primaryColor"), padding: 20 }}>
                    <TouchableOpacity onPress={() => { this.onClose() }}>
                        <Image source={Images.back} ></Image>
                    </TouchableOpacity>
                    <Text bold title3 style={{ color: EStyleSheet.value("$whiteColor"), marginLeft: 20 }}>Messages</Text>
                </View>

                <GiftedChat
                    messages={messages}
                    onSend={msg => this.sendChat(msg)}
                    user={this.user}
                />
                <Toast
                    ref={ref => this.ToastRef = ref}
                    position='top'
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    style={{ backgroundColor: EStyleSheet.value('$errorColor'), width: '80%', height: 50, justifyContent: 'center', alignItems: 'center' }}
                    textStyle={{ color: EStyleSheet.value('$whiteColor'), fontWeight: "bold", fontSize: 20 }}
                />
                <MessageToast config={toastConfig} ref={ref => this.MessageToastRef = ref} />
            </SafeAreaView>);
    }
}