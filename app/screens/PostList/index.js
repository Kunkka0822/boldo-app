import React, { Component } from "react"
import { View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl } from "react-native";
import { BaseStyle, Images, BaseConfig } from "@config";
import { Button, Icon, Text } from "@components";
import * as Utils from "@utils";
import EStyleSheet from 'react-native-extended-stylesheet';
import { apiActions, actionTypes } from "@actions";
import { store } from "@store";
import styles from "./styles";
import { Searchbar, TextInput } from 'react-native-paper';
import IconBadge from 'react-native-icon-badge';
import { notifications } from "react-native-firebase-push-notifications"
import { EventRegister } from 'react-native-event-listeners'
import OptionsMenu from "react-native-option-menu";
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
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

class PostList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            posts: [],
            filteredPosts: [],
            user: props.auth?.login?.data?.user,
            search: '',
            selectedUser: null,
            reportItem: null,
            showReport: false,
            reportReason: '',
            errorReason: true,
            showModal: false,
        };
        this.focusPosts = this.props.navigation.addListener('focus', this.getPosts.bind(this));
        this.focusNotification = this.props.navigation.addListener('focus', this.manageBadge.bind(this));
    }

    componentDidMount() {
        this.getPosts();
        this.listener = EventRegister.addEventListener('notification', (data) => {
            let type = data._data.type;
            if (type == "new-message") {

            } else if (type == "new-post") {
                this.manageBadge();
                this.getPosts();
            }
        })
    }

    componentWillUnmount() {
        try {
            EventRegister.removeEventListener(this.listener)
            this.focusRecipes?.remove();
            this.focusNotification?.remove();
        } catch (error) {

        }
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
        if (notificationDatas.posts > 0) {
            notificationDatas.posts = 0;
            this.props.dispatch(onNotification(notificationDatas));
        }
    }

    getPosts() {
        this.setState({
            loading: true
        }, () => {
            apiActions.getPosts()
                .then(response => {
                    this.setState({
                        posts: response.data,
                        filteredPosts: response.data
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

    updateSearch = (search) => {
        this.setState({ search });
        let filteredPosts = this.state.filteredPosts;
        let posts = this.state.posts;
        if (search == "") {
            this.setState({ filteredPosts: posts });
        } else {
            filteredPosts = posts.filter(post => post.content.toLowerCase().includes(search.toLowerCase()) ||
                post.user.lname.toLowerCase().includes(search.toLowerCase()) ||
                post.user.fname.toLowerCase().includes(search.toLowerCase()));
            this.setState({ filteredPosts: filteredPosts });
        }
    };

    onPlus() {
        return this.props.navigation.navigate("NewPost");
    }

    gotoAccount() {
        return this.props.navigation.navigate("Profile");
    }

    onProfile = (user) => {
        this.setState({
            selectedUser: user,
            showModal: true,

        })
    }

    onReport = (item) => {
        let showReport = this.state.showReport;
        this.setState({
            reportItem: item,
            showReport: !showReport,
        })
    }

    onDelete = (item) => {
        let id = item.id;
        let model = {
            id: id,
        }
        this.setState({
            loading: true
        }, () => {
            apiActions.deletePost(model)
                .then(response => {
                    this.getPosts();
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(
                    () => this.setState({ loading: false })
                )
        })
    }

    onChat = (item) => {
        let id = this.state.user.id;
        const model = {
            user_id: id,
            connect_id: item.id
        }

        this.setState({
            loading: true
        }, () => {
            apiActions.makeChatRoom(model)
                .then(response => {
                    let room = response.data;
                    if (room.active == 0) {
                        Toast.show({ text1: "You can't make this chat.", type: 'error' },);
                        return;
                    }
                    return this.props.navigation.navigate("Chat", { room });
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(
                    () => this.setState({ loading: false })
                )
        })
    }

    closeReport() {
        let showReport = this.state.showReport;
        this.setState({
            showReport: !showReport,
        })
    }

    sendReport() {
        let showReport = this.state.showReport;

        if (this.state.reportReason == "") {
            this.setState({
                errorReason: false,
            })
            return;
        }
        this.setState({
            showReport: !showReport,
            errorReason: true,
        })
        Toast.show({ text1: "We will reivew this post soon.\nThanks for your reporting.", type: 'success' },);

        let user_id = this.state.user.id;
        const model = {
            id: this.state.reportItem.id,
            user_id: user_id,
            reason: this.state.reportReason
        }
        this.setState({
        }, () => {
            apiActions.sendReport(model)
                .then(response => {
                })
                .catch(err => {

                })
                .finally(
                    () => this.setState({ loading: false })
                )
        })
    }

    render() {
        let { loading, user, filteredPosts, search, selectedUser, reportItem, showReport, reportReason, errorReason, showModal } = this.state;
        const dotIcon = (<Icon name="ellipsis-v" size={20} color={EStyleSheet.value('$primaryColor')} />)

        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView, { paddingHorizontal: 10, paddingTop: 20, }]}
                forceInset={{ top: "always" }}
            >
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { this.gotoAccount() }}>
                        <Image style={styles.avatar} source={{ uri: user?.photo }} ></Image>
                    </TouchableOpacity>
                    <Searchbar style={{ flex: 1, marginHorizontal: 10 }}
                        selectionColor={EStyleSheet.value("$primaryColor")}
                        placeholder="Search" onChangeText={this.updateSearch} value={search} />
                </View>
                <ScrollView keyboardShouldPersistTaps='handled' style={{ marginTop: 20, marginBottom: 45, borderRadius: 5, backgroundColor: EStyleSheet.value('$contentColor') }}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={this.getPosts.bind(this)}
                        />} >

                    {filteredPosts.length > 0 ? <FlatList
                        data={filteredPosts}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.post}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image style={styles.avatar} source={{ uri: item.user.photo }}></Image>
                                        <View style={{ marginLeft: 20, flex: 1, }}>
                                            <Text style={{ color: EStyleSheet.value('$textColor'), fontSize: 15, fontWeight: 'bold' }}> {item.user.fname + " " + item.user.lname} </Text>
                                            <Text style={{ color: EStyleSheet.value('$textColor') }}> {item.user?.typeOfProfessionalNames?.length > 0 && item.user.typeOfProfessionalNames.join(" | ")} </Text>
                                        </View>
                                        {item.user.id != user.id ?
                                            <OptionsMenu
                                                customButton={dotIcon}
                                                destructiveIndex={1}
                                                options={user.role == 0 ? ["Profile", "Chat", "Report", "Close"] : ["Profile", "Report", "Close"]}
                                                actions={user.role == 0 ? [this.onProfile.bind(this, item.user), this.onChat.bind(this, item.user), this.onReport.bind(this, item)] :
                                                    [this.onProfile.bind(this, item.user), this.onReport.bind(this, item)]} />
                                            : <OptionsMenu
                                                customButton={dotIcon}
                                                destructiveIndex={1}
                                                options={["Delete", "Close"]}
                                                actions={[this.onDelete.bind(this, item)]} />
                                        }
                                    </View>
                                    <Image style={{ width: '100%', marginTop: 10, height: 250, borderRadius: 8 }} source={{ uri: item.photo }}></Image>
                                    <Text style={{ color: EStyleSheet.value('$textColor'), marginTop: 10 }}>{item.content}</Text>
                                </View>
                            );
                        }}
                    >

                    </FlatList> :
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Text name style={{ marginTop: 50, color: EStyleSheet.value('$blackColor'), fontSize: 25 }}> There are no posts</Text>
                        </View>
                    }
                </ScrollView>
                {user.role == 1 && <TouchableOpacity
                    style={{ alignItems: 'flex-end', width: 40, position: 'absolute', right: 10, bottom: 40 }}
                    onPress={() => { this.onPlus() }}
                >
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
                </TouchableOpacity>}
                <Modal isVisible={showReport} >
                    <View style={{ backgroundColor: EStyleSheet.value('$contentColor'), paddingHorizontal: 20, borderRadius: 15 }} >
                        <Text style={{ fontWeight: 'bold', fontSize: 25, marginTop: 20, textAlign: 'center' }}> Thanks for your reporting</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}> We will review this post soon.</Text>
                        <Textarea
                            containerStyle={styles.textareaContainer}
                            style={styles.textarea}
                            onChangeText={reportReason => this.setState({ reportReason })}
                            defaultValue={reportReason}
                            placeholder={"Please input your reason."}
                            placeholderTextColor={
                                errorReason
                                    ? EStyleSheet.value('$placeColor')
                                    : EStyleSheet.value('$errorColor')
                            }
                            selectionColor={EStyleSheet.value('$primaryColor')}
                            underlineColorAndroid={'transparent'}
                            multiline={true}
                        />
                        <View style={{ flexDirection: 'column' }}>
                            <Button onPress={() => { this.sendReport() }} style={{ height: 50, marginBottom: 10, marginTop: 20 }} >
                                {Utils.translate('messages.report')}</Button>
                            <Button outline onPress={() => { this.closeReport() }} style={{ height: 50, marginBottom: 20 }} >
                                {Utils.translate('messages.cancel')}</Button>
                        </View>
                    </View>
                </Modal>
                <Modal isVisible={showModal}>
                    <View style={{ backgroundColor: EStyleSheet.value("$contentColor"), alignItems: 'center', borderRadius: 15 }}>
                        <Image style={{ width: 80, height: 80, borderRadius: 80, marginTop: 40 }} source={{ uri: selectedUser?.photo }}></Image>
                        <View style={{ alignItems: 'center' }}>
                            <Text styles={{ marginTop: 10 }}> {selectedUser?.lname + " " + selectedUser?.fname} </Text>
                            <Text > {selectedUser?.typeOfProfessionalNames.length > 0 && selectedUser?.typeOfProfessionalNames.join(" | ")} </Text>
                            <Text style={{ textAlign: 'center', paddingHorizontal: 20 }}> {selectedUser?.bio} </Text>
                            <Text style={{ textAlign: 'center', paddingHorizontal: 20 }}> {selectedUser?.location} </Text>
                        </View>
                        <Button onPress={() => { this.setState({ showModal: false }) }} style={{ height: 40, marginHorizontal: 80, marginBottom: 20, marginTop: 20 }} >
                            {Utils.translate('messages.close')}</Button>
                    </View>
                </Modal>
                <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
            </SafeAreaView>);
    }
}

const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostList);