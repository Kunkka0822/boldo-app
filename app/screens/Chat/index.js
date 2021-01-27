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
            photo: '',
        };
        this.room = props.route.params.room;
        this.page = 0;
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
            this.page = 0;
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

    sendChat(msg) {
        if (this.room.active != 1) {
            this.showToast("You can't chat with this user.");
            return;
        }
        msg[0].user = { _id: this.state.user.id, name: this.state.user.fname, avatar: this.state.user.photo };
        if (this.state.photo != '') {
            msg[0].image = this.state.photo;
        }
        const model = {
            room_id: this.room.id,
            user_id: this.state.user.id,
            receive_id: this.room?.user?.id,
            message: msg[0]
        }
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, msg[0]),
        }))
        apiActions.sendMessage(model)
            .then(response => {
            })
            .catch(err => {
                this.showToast("You can't chat with this user.");
                this.room.active = 0;
            })
        this.setState({ photo: '' });
    }

    readAll() {
        const model = {
            room_id: this.room.id,
            user_id: this.state.user.id,
        }
        console.log(model);
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
        this.page++;
        const model = {
            room_id: this.room.id,
            page: this.page
        }
        console.log("page", this.page);
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
                console.log("here4");
                console.log(response);
                this.uploadChatImages(response.base64);
            }
        });
    }

    renderActions() {
        return (
            <TouchableOpacity onPress={() => { this.selectImage() }}>
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
            this.state.photo == '' ? <></> :
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: EStyleSheet.value('$textColor') }}>
                    <TouchableOpacity onPress={() => { this.removePhoto() }}>
                        <Icon name="times" size={20} color={EStyleSheet.value('$whiteColor')} />
                    </TouchableOpacity>
                    <Image style={{ width: '80%', height: 200, resizeMode: 'contain', marginBottom: 10 }} source={{ uri: this.state.photo }}></Image>
                </View>
        );
    }


    removePhoto() {
        const model = {
            photo: this.state.photo
        }
        apiActions.removePhoto(model)
            .then(response => {
                console.log("response");
            })
            .catch(err => {
                console.log("error");
            })
        this.setState({ photo: '' });
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

    uploadChatImages(image) {
        const model = {
            photo: image,
        }
        apiActions.uploadChatImages(model)
            .then(response => {
                this.setState({ photo: response.data });
            })
            .catch(err => {
            })
    }

    render() {
        let { loading, messages, user } = this.state;
        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView, { backgroundColor: EStyleSheet.value('$contentColor') }]}
                forceInset={{ top: "always" }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: Platform.OS == 'ios' ?30:20, backgroundColor: EStyleSheet.value('$primaryColor') }}>
                    <TouchableOpacity onPress={() => { this.onClose() }}>
                        <Icon name="arrow-left" size={20} color={EStyleSheet.value("$whiteColor")}></Icon>
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
                    user={{ _id: user.id, avatar: user.photo }}
                    messages={messages}
                    onSend={msg => this.sendChat(msg)}
                    // renderLoading={this.renderLoading.bind(this)}
                    // listViewProps={{ onEndReached: this.onLoadEarlier.bind(this), onEndReachedThreshold: 1 }}
                    onLongPress={(context, message) => { this.onLongPress(context, message) }}
                    renderActions={this.renderActions.bind(this)}
                    renderFooter={this.renderFooter.bind(this)}
                    alwaysShowSend={true}
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