import React, { Component } from "react"
import { View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl, Dimensions, Platform} from "react-native";
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
import Textarea from 'react-native-textarea';
import { Badge } from 'react-native-paper';

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
                style={[BaseStyle.safeAreaVie]}
                forceInset={{ top: "always" }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center',  paddingHorizontal:10, paddingTop:20}}>
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