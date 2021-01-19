import React, { Component } from "react"
import { View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl } from "react-native";
import { BaseStyle, Images, BaseConfig } from "@config";
import { Button, Icon, Text } from "@components";
import * as Utils from "@utils";
import EStyleSheet from 'react-native-extended-stylesheet';
import { apiActions } from "@actions";
import { store } from "@store";
import Toast from 'react-native-easy-toast'
import styles from "./styles";
import { Searchbar, TextInput } from 'react-native-paper';
import IconBadge from 'react-native-icon-badge';
import { notifications } from "react-native-firebase-push-notifications"
import { EventRegister } from 'react-native-event-listeners'
import OptionsMenu from "react-native-option-menu";
import Modal from 'react-native-modal';
import MessageToast, { BaseToast } from 'react-native-toast-message';
const toastConfig = {
    success: ({ text1, text2, ...props }) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: '#69C779'}}
            contentContainerStyle={{ paddingHorizontal: 15}}
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
export default class PostList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            search: '',
            BadgeCount: 0,
            posts: [],
            isPro: true,
            selectedUser: null,
            showModal: false,
            reportItem: null,
            showReport: false,
            filteredPost: [],
            reportReason: ''
        };
        this.ToastRef = null;
        this.MessageToastRef = null;
        this.props.navigation.addListener('willFocus', this.getPosts.bind(this));
    }

    componentDidMount() {
        this.listener = EventRegister.addEventListener('notification', (data) => {
            let type = data._data.type;

            if (type == "new-message") {
                this.MessageToastRef.show({
                    text1: data._title,
                    text2: data._body,
                    position: 'bottom',
                    bottomOffset: 10,
                });
            }
        })
        this.getPosts();
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener)
    }


    getPosts() {
        if (store.getState().auth?.login?.success) {
            let id = store.getState().auth?.login?.data.user.id;
            const model = {
                id: id,
            }
            this.setState({
                loading: true
            }, () => {
                apiActions.getPosts(model)
                    .then(response => {
                        this.setState({
                            posts: response.data,
                            filteredPost: response.data
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
    }

    updateSearch = (search) => {
        this.setState({search});
        let filteredPost = this.state.filteredPost;
        let posts = this.state.posts;
        if(search == ""){
            this.setState({filteredPost:posts});
        }else{
            filteredPost = posts.filter(post => post.content.toLowerCase().includes(search.toLowerCase()) || 
                post.user.lname.toLowerCase().includes(search.toLowerCase()) ||
                post.user.fname.toLowerCase().includes(search.toLowerCase()));
            this.setState({filteredPost:filteredPost});
        }
    };

    setVisible = () => {
        let showModal = this.state.showModal;
        this.setState({
            showModal: !showModal,
        })
    }

    onProfile = (user) => {
        this.setState({
            selectedUser: user,
        })
        this.setVisible();
    }

    onReport = (item) => {
        let showReport = this.state.showReport;
        this.setState({
            reportItem: item,
            showReport: !showReport,
        })
    }

    closeReport = () => {
        let showReport = this.state.showReport;
        this.setState({
            showReport: !showReport,
        })
    }

    sendReport = async () => {
        let showReport = this.state.showReport;
        this.setState({
            showReport: !showReport,
        })
        this.ToastRef.show("We will reivew this post soon. Thanks for your reporting.");
        let token = await this.getToken();

        if (store.getState().auth?.login?.success) {
            let id = store.getState().auth?.login?.data.user.id;
            const model = {
                id: id,
                token: token,
                reason: this.state.reportReason
            }
            this.setState({
            }, () => {
                apiActions.sendReport(model)
                    .then(response => {
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

    getBadge() {
        if (store.getState().auth?.login?.success) {
            let id = user.id;
            const model = {
                id: id,
            }

            this.setState({
                loading: true
            }, () => {
                apiActions.getBadge(model)
                    .then(response => {
                        this.setState({
                            BadgeCount: response.badge,
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
    }


    onChat = (item) => {
        let id = user.id;
        const model = {
            id: id,
            oposit_id: item.id
        }
        this.setState({
            loading: true
        }, () => {
            apiActions.makeChatRoom(model)
                .then(response => {
                    let item = response.data;
                    return this.props.navigation.navigate("Chat", { item });
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(
                    () => this.setState({ loading: false })
                )
        })
    }

    onPlus() {
        return this.props.navigation.navigate("NewPost");
    }

    gotoAccount() {
        return this.props.navigation.navigate("Account");
    }

    render() {
        let { loading, search, posts, filteredPost, isPro, showModal, selectedUser, showReport, reportReason } = this.state;
        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView, { paddingHorizontal: 10, paddingTop: 20, }]}
                forceInset={{ top: "always" }}
            >
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { this.gotoAccount() }}>
                        <Image style={styles.avatar} source={{ uri: store.getState().auth?.login?.data?.user?.photo }} ></Image>
                    </TouchableOpacity>
                    <Searchbar style={{ flex: 1, marginHorizontal: 10 }}
                        selectionColor={EStyleSheet.value("$primaryColor")}
                        placeholder="Search" onChangeText={this.updateSearch} value={search} />

                    {/* {role == 1 &&
                        <TouchableOpacity onPress={() => { this.gotoReceives() }}>
                            <IconBadge
                                MainElement={
                                    <Image style={styles.bell} source={Images.bell} ></Image>
                                }
                                BadgeElement={
                                    <Text overline style={{
                                        color: EStyleSheet.value("$whiteColor")
                                    }}>
                                        {this.state.BadgeCount}
                                    </Text>
                                }
                                IconBadgeStyle={{
                                    width: 20,
                                    height: 20,
                                    backgroundColor: EStyleSheet.value("$primaryColor")
                                }}
                                Hidden={this.state.BadgeCount == 0}
                            />
                        </TouchableOpacity>
                    } */}
                </View>

                <ScrollView style={{ marginTop: 30, borderRadius: 5, backgroundColor: EStyleSheet.value('$contentColor') }}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={this.getPosts.bind(this)}
                        />} >
                    {filteredPost.length > 0 ? <FlatList
                        data={filteredPost}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.post}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image style={styles.avatar} source={{ uri: item.user.photo }}></Image>
                                        <View style={{ marginLeft: 20, flex: 1, }}>
                                            <Text title3 blackColor> {item.user.fname + " " + item.user.lname} </Text>
                                            <Text caption1 blackColor> {item.user.typeOfProfessional.join(" | ")} </Text>
                                        </View>
                                        {item.user.id != user.id &&
                                            <OptionsMenu
                                                button={Images.threedot}
                                                buttonStyle={{ width: 16, height: 16, resizeMode: "contain" }}
                                                destructiveIndex={1}
                                                options={user.role == 0 ? ["Profile", "Chat", "Report", "Close"] : ["Profile", "Report", "Close"]}
                                                actions={user.role == 0 ? [this.onProfile.bind(this, item.user), this.onChat.bind(this, item.user), this.onReport.bind(this, item)] :
                                                    [this.onProfile.bind(this, item.user), this.onReport.bind(this, item)]} />}
                                    </View>
                                    <Image style={{ width: '100%', marginTop: 10, height: 250, borderRadius: 8 }} source={{ uri: item.photo }}></Image>
                                    <Text title3 style={{ marginTop: 10 }}>{item.content}</Text>
                                </View>
                            );
                        }}
                    />
                        : <View style={{ alignItems: 'center', justifyContent: 'center' }}><Text title1 style={{ marginTop: 50, color: EStyleSheet.value('$blackColor') }}> There are no posts</Text></View>
                    }

                </ScrollView>

                { role == 1 &&
                    <TouchableOpacity
                        style={{ alignItems: 'flex-end', width: 40, position: 'absolute', right: 10, bottom: 0 }}
                        onPress={() => { this.onPlus() }}>
                        <View style={{
                            width: 40,
                            height: 40,
                            borderRadius: 40,
                            marginBottom: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: EStyleSheet.value("$primaryColor")
                        }}>
                            <Icon name="plus" color={EStyleSheet.value("$whiteColor")}></Icon>
                        </View>
                    </TouchableOpacity>
                }

                <Modal isVisible={showModal}>
                    <View style={{ backgroundColor: EStyleSheet.value("$contentColor"), alignItems: 'center' }}>
                        <Image style={{ width: 80, height: 80, borderRadius: 80, marginTop: 40 }} source={{ uri: selectedUser ? selectedUser.photo : "" }}></Image>
                        <View style={{ alignItems: 'center' }}>
                            <Text title3 bold blackColor styles={{ marginTop: 10 }}> {selectedUser ? selectedUser.lname + " " + selectedUser.fname : ""} </Text>
                            <Text caption blackColor> {selectedUser ? selectedUser.typeOfProfessional.join(" | ") : ""} </Text>
                            <Text caption blackColor style={{ textAlign: 'center', paddingHorizontal: 20 }}> {selectedUser ? selectedUser.bio : ""} </Text>
                            <Text caption blackColor style={{ textAlign: 'center', paddingHorizontal: 20 }}> {selectedUser ? selectedUser.location : ""} </Text>
                        </View>
                        <Button onPress={this.setVisible} style={{ height: 40, marginHorizontal: 80, marginBottom: 20, marginTop: 20 }} >
                            {Utils.translate('messages.close')}</Button>
                    </View>
                </Modal>
                <Modal isVisible={showReport} style={{ borderRadius: 5, alignItems: 'center' }}>
                    <View style={{ backgroundColor: EStyleSheet.value('$whiteColor'), padding: 30, width: '100%' }}>
                        <Text title3 bold blackColor styles={{ marginTop: 10 }}> Thanks for your reporting.</Text>
                        <Text title3 blackColor styles={{ marginTop: 10 }}> We will review this post.</Text>
                        <TextInput
                            style={{ width: '100%', marginTop: 20 }}
                            onChangeText={reportReason => this.setState({ reportReason })}
                            autoCorrect={false}
                            placeholderTextColor={EStyleSheet.value('$grayColor')}
                            value={reportReason}
                            selectionColor={EStyleSheet.value('$primaryColor')}
                        />
                        <View style={{ flexDirection: 'column' }}>
                            <Button onPress={this.sendReport} style={{ height: 40, marginBottom: 20, marginTop: 20 }} >
                                {Utils.translate('messages.report')}</Button>
                            <Button onPress={this.closeReport} style={{ height: 40, marginBottom: 20 }} >
                                {Utils.translate('messages.cancel')}</Button>
                        </View>
                    </View>
                </Modal>
                <Toast
                    ref={ref => this.ToastRef = ref}
                    position='top'
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={1}
                    style={{ backgroundColor: EStyleSheet.value('$success'), width: '80%', height: 50, justifyContent: 'center', alignItems: 'center' }}
                    textStyle={{ color: EStyleSheet.value('$whiteColor'), fontWeight: "bold", fontSize: 15 }}
                />
                <MessageToast config={toastConfig} ref={ref => this.MessageToastRef = ref} />
            </SafeAreaView>);
    }
}