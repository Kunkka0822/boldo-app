import React, { Component } from "react"
import { View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl, Dimensions } from "react-native";
import { BaseStyle, Images, BaseConfig, firebaseSvc } from "@config";
import { Button, Icon, Text } from "@components";
import * as Utils from "@utils";
import EStyleSheet from 'react-native-extended-stylesheet';
import { apiActions, actionTypes } from "@actions";
import { store } from "@store";
import styles from "./styles";
import { Searchbar } from 'react-native-paper';
import IconBadge from 'react-native-icon-badge';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import { EventRegister } from 'react-native-event-listeners'
import { connect } from "react-redux";
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import MessageToast, { BaseToast } from 'react-native-toast-message';
import Toast from 'react-native-toast-message';
import Textarea from 'react-native-textarea';
import { Badge } from 'react-native-paper';

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

const onNotification = data => {
    return {
        type: actionTypes.PREF_NOTIFICATIONS,
        data
    };
};

class Address extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            user: props.auth?.login?.data?.user,
            contacts: [],
            filteredContacts: [],
        };

        this.focusContacts = this.props.navigation.addListener('focus', this.getContacts.bind(this));
        this.focusNotification = this.props.navigation.addListener('focus', this.manageBadge.bind(this));
    }

    componentDidMount() {
        this.listener = EventRegister.addEventListener('notification', (data) => {
            let type = data._data.type;
            if (type == "new-message") {
                let text = data._data.text;
                let name = data._data.name;
                Toast.show({ text1: name, text2:text, type: 'chat' },);
                this.getContacts();
            } else if (type == "new-recipe") {
            }
        })
        this.getContacts();
    }

    componentWillUnmount() {
        try {
            EventRegister.removeEventListener(this.listener)
            this.focusContacts?.remove();
            this.focusNotification?.remove();
        } catch (error) {

        }
    }

    getContacts() {
        let id = this.state.user.id;
        const model = {
            id: id,
        }
        this.setState({
            loading: true
        }, () => {
            apiActions.getContacts(model)
                .then(response => {
                    this.setState({
                        contacts: response.data,
                        filteredContacts: response.data,
                    })
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(
                    () => this.setState({ loading: false })
                )
        })
    }

    manageBadge() {
        let notificationDatas = this.props.notification.notifications;
        if (notificationDatas == undefined) {
            notificationDatas = {
                chats: 0,
                posts: 0,
                recipes: 0,
            }
        }
        if (notificationDatas.chats > 0) {
            notificationDatas.chats = 0;
            this.props.dispatch(onNotification(notificationDatas));
        }
    }

    onChat(room) {
        return this.props.navigation.navigate("Chat", { room });
    }

    onBlocks() {
        return this.props.navigation.navigate("BlockLists");
    }

    onBlock(item, index) {
        const model = {
            room_id: item.id,
            user_id: this.state.user.id,
        }

        this.setState({
            loading: true
        }, () => {
            apiActions.setBlock(model)
                .then(response => {
                    let filteredContacts = this.state.filteredContacts;
                    filteredContacts.splice(index, 1);
                    this.setState({
                        filteredContacts: filteredContacts
                    })
                })
                .catch(err => {
                    console.log('err');
                    console.log(err);
                })
                .finally(
                    () => this.setState({ loading: false })
                )
        })
    }


    render() {
        let { loading, user, contacts, filteredContacts } = this.state;
        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView, { paddingHorizontal: 10, paddingTop: 20 }]}
                forceInset={{ top: "always" }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, flex: 1, textAlign: 'center', color: EStyleSheet.value('$textColor') }} > {"Chats"} </Text>
                    <TouchableOpacity onPress={() => { this.onBlocks() }}>
                        <Icon name="lock" size={20} color={EStyleSheet.value("$primaryColor")}></Icon>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ width: '100%', paddingTop: 10 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={this.getContacts.bind(this)}
                        />
                    }>
                    {filteredContacts.length > 0 ?
                        <FlatList
                            data={filteredContacts}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity
                                        onPress={this.onChat.bind(this, item)}
                                        style={{
                                            padding: 8, display: 'flex',
                                            flexDirection: 'row', alignItems: 'center',
                                            borderRadius: 5,
                                            borderWidth: 2,
                                            marginTop: 5,
                                            borderColor: EStyleSheet.value("$inputBoderColor"),
                                            justifyContent: 'center'
                                        }}>
                                        <Image style={{ width: 40, height: 40, borderRadius: 40 }} source={{ uri: item?.user?.photo }}></Image>
                                        <View style={{ marginLeft: 10, flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                                            <Text style={{ fontWeight: 'bold', flex: 1 }}> {user?.role == 1 ? item?.user?.fname : (item?.user?.fname + " " + item?.user?.lname)} </Text>
                                            {item.badge > 0 && <Badge style={{ marginRight: 30 }}>{item.badge}</Badge>}
                                        </View>
                                        <TouchableOpacity onPress={() => { this.onBlock(item, index) }} >
                                            <Icon name="handshake-slash" size={20} color={EStyleSheet.value("$primaryColor")}></Icon>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                );
                            }} />
                        : <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ marginTop: 50, fontSize: 20, color: EStyleSheet.value('$textColor') }}> There are no contacts</Text>
                        </View>}
                </ScrollView>
                <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
            </SafeAreaView>
        )
    }
}
const mapStateToProps = (state) => (state);

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Address);