import React, { Component } from "react"
import { View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl, ActivityIndicator , Platform} from "react-native";
import { BaseStyle, Images, BaseConfig, firebaseSvc } from "@config";
import { Button, Icon, Text } from "@components";
import * as Utils from "@utils";
import EStyleSheet from 'react-native-extended-stylesheet';
import { apiActions } from "@actions";
import { store } from "@store";
import styles from "./styles";
import { GiftedChat, Composer } from 'react-native-gifted-chat';
import Spinner from 'react-native-loading-spinner-overlay';
import { EventRegister } from 'react-native-event-listeners'
import MessageToast, { BaseToast } from 'react-native-toast-message';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { connect } from "react-redux";
import Textarea from 'react-native-textarea';

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

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            messages: [],
            user: props.auth?.login?.data?.user,
            tempPhoto: '',
            backPossible : true,
            text : '',
        };
        this.room = props.route.params.room;
        this.focusChat = this.props.navigation.addListener('focus', this.onLoadEarlier.bind(this));
        this.focusRead = this.props.navigation.addListener('focus', this.readAll.bind(this));
    }

    componentDidMount() {
        this.listener = EventRegister.addEventListener('notification', (data) => {
            let type = data._data.type;
            if (type == "new-message") {
                let room_id = data._data.room;
                let chat_id = data._data.chat;
                if (room_id == this.room.id) {
                    this.getOneChat(chat_id);
                }
            }
        })
    }

    componentWillUnmount() {
        try {
            EventRegister.removeEventListener(this.listener)
            this.focusChat?.remove();
            this.focusRead?.remove();
        } catch (error) {

        }
    }

    showToast(text1) {
        let toastData = {
            text1: text1,
            text2: null,
            type: 'error',
        }
        this.props.dispatch(onToast(toastData));
    }

    onClose() {
        this.props.navigation.goBack();
    }

    sendChat(params) {
        if (this.room.active != 1) {
            this.showToast("You can't chat with this user.");
            return;
        }
        

        let msg = {};
        msg.image64 = false;
        msg.user = params.user;
        msg.text = params.text;
        msg._id = Math.round(Math.random() * new Date().getTime() * Math.random()) ;
        msg.createdAt =new Date();
        if (this.state.tempPhoto != '') {
            msg.image = this.state.tempPhoto;
            msg.image64 = true;
        }else{

        }
        const model = {
            room_id: this.room.id,
            user_id: this.state.user.id,
            receive_id: this.room?.user?.id,
            message: msg
        }
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, msg),
        }))
      
        this.setState({
            backPossible: false
        }, () => {
            apiActions.sendMessage(model)
            .then(response => {

            })
            .catch(err => {
                this.showToast("You can't chat with this user.");
                this.room.active = 0;
            })
            .finally(
                () => this.setState({ backPossible: true })
            )
        })
       
        this.setState({tempPhoto: '', text:""});
    }

    readAll() {
        const model = {
            room_id: this.room.id,
            user_id: this.state.user.id,
        }
        apiActions.readAll(model)
            .then(response => {
            })
            .catch(err => {
            })
    }

    onLoadEarlier() {
        if (this.loading) {
            return;
        }
        const model = {
            room_id: this.room.id,
        }
        this.setState({
            loading: true
        }, () => {
            apiActions.getMessage(model)
                .then(response => {
                    if (response.data?.length > 0) {
                        this.setState(previousState => ({
                            messages: GiftedChat.append(response.data, previousState.messages),
                        }))
                    } else {

                    }
                })
                .catch(err => {
                    this.showToast("You can't chat with this user.");
                })
                .finally(
                    () => this.setState({ loading: false })
                )
        })
    }

    renderLoading() {
        return (<ActivityIndicator
            size="large"
        />);
    }

    selectImage() {
        let options = {
            title: Utils.translate("auth.select-image"),
            mediaType: 'photo',
            includeBase64: true,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log("here1");
            } else if (response.error) {
                console.log("here2");
            } else if (response.customButton) {
                console.log("here3");
            } else {
                this.setState({tempPhoto:'data:image/jpeg;base64,' + response.base64});
            }
        });
    }

    renderActions() {
        return (
            <TouchableOpacity onPress={() => { this.selectImage() }} style={{alignItems:'center', justifyContent:'center', height:'100%'}}>
                <Icon name="image" style={{ marginLeft: 10 }} size={30} color={EStyleSheet.value("$primaryColor")}></Icon>
            </TouchableOpacity>
        );
    }

    onLongPress(context, message) {
        if (message.text && this.state.user.id == message.user._id) {
            let options = [
                "Delete",
                "Cancel",
            ];
            const cancelButtonIndex = options.length - 1;
            context.actionSheet().showActionSheetWithOptions({
                options,
                cancelButtonIndex,
            },
                (buttonIndex) => {
                    switch (buttonIndex) {
                        case 0:
                            this.deleteChat(message.chat_id)
                            break;
                        case 1:
                            break;
                    }
                });
        }
    }

    onImageChange = ({ nativeEvent }) => {
        const { linkUri } = nativeEvent;
        this.setAttachState({ attach: linkUri, type: 1 });
    }

    deleteChat(chat_id) {
        const model = {
            id: chat_id,
        }
        apiActions.deleteMessage(model)
            .then(response => {
                this.setState(previousState => ({
                    messages: previousState.messages.filter(message => message.chat_id !== chat_id)
                }))
            })
            .catch(err => {
                this.showToast("You can't chat with this user.");
            })
    }

    renderFooter() {
        return (
            this.state.tempPhoto == '' ? <></> :
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: EStyleSheet.value('$textColor') }}>
                    <TouchableOpacity onPress={() => { this.removePhoto() }}>
                        <Icon name="times" size={20} color={EStyleSheet.value('$whiteColor')} />
                    </TouchableOpacity>
                    <Image style={{ width: '80%', height: 200, resizeMode: 'contain', marginBottom: 10 }} source={{ uri: this.state.tempPhoto }}></Image>
                </View>
        );
    }

    renderSend(param) {
        return (
            <TouchableOpacity style={{alignItems:'center', justifyContent:'center', height:'100%', marginRight:5}} onPress={() => { this.sendChat(param) }}>
               <Text style={{color:EStyleSheet.value('$primaryColor'), fontWeight:'bold', fontSize:15}}>Send</Text>
            </TouchableOpacity>
        );
    }


    removePhoto() {
        this.setState({ tempPhoto: '' });
    }

    getOneChat(chat_id) {
        const model = {
            id: chat_id,
        }
        apiActions.getOneMessage(model)
            .then(response => {
                this.setState(previousState => ({
                    messages: GiftedChat.append(previousState.messages, response.data),
                }))
            })
            .catch(err => {
            })
    }

    render() {
        let { loading, messages, user, backPossible, text } = this.state;
        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView, { backgroundColor: EStyleSheet.value('$contentColor') }]}
                forceInset={{ top: "always" }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: Platform.OS == 'ios' ?30:20, backgroundColor: EStyleSheet.value('$primaryColor') }}>
                    <TouchableOpacity onPress={() => { if(backPossible) this.onClose() }}>
                        <Icon name="arrow-left" size={20} color={ backPossible?EStyleSheet.value("$whiteColor") : EStyleSheet.value("$grayColor")}></Icon>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', marginLeft: 20 }}>
                        <Text style={{ color: EStyleSheet.value('$whiteColor'), fontSize: 16, fontWeight: 'bold', }}>
                            {this.room?.user?.fname} {this.room?.user?.role == 1 && this.room?.user.lname}
                        </Text>
                        <Text style={{ color: EStyleSheet.value('$whiteColor'), fontSize: 12, fontWeight: 'bold', marginTop: 5 }}>
                            {this.room?.user?.location}
                        </Text>
                    </View>
                </View>
                {loading && <ActivityIndicator size="large" {...styles.loading} />}
                <GiftedChat
                    user={{ _id: user.id, avatar: user.photo, name:user.fname}}
                    messages={messages}
                    // renderLoading={this.renderLoading.bind(this)}
                    // listViewProps={{ onEndReached: this.onLoadEarlier.bind(this), onEndReachedThreshold: 1 }}
                    onLongPress={(context, message) => { this.onLongPress(context, message) }}
                    renderActions={this.renderActions.bind(this)}
                    renderFooter={this.renderFooter.bind(this)}
                    alwaysShowSend={true}
                    renderSend={this.renderSend.bind(this)}
                    text={text}
                    onInputTextChanged={text => {this.setState({text})}}
                    // onSend={msg => this.sendChat(msg)}
                   // renderComposer={(props) => <Composer {...props} textInputProps={this.onImageChange.bind(this)} />}
                />
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