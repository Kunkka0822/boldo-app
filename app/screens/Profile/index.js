import React, { Component } from "react"
import { View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl, Dimensions } from "react-native";
import { BaseStyle, Images, BaseConfig } from "@config";
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-toast-message';

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

const { width: screenWidth } = Dimensions.get('window')

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            search: '',
            posts: [],
            filteredPosts: [],
            user: props.auth?.login?.data?.user,

        };
        this.focusUserInfo = this.props.navigation.addListener('focus', this.getUserInfo.bind(this));
    }

    componentDidMount() {
        this.getUserInfo();
        this.listener = EventRegister.addEventListener('notification', (data) => {
            let type = data._data.type;
            if (type == "new-message") {
                let text = data._data.text;
                let name = data._data.name;
                Toast.show({ text1: name, text2:text, type: 'chat' },);
            } else if (type == "new-post") {

            }
        })
    }

    componentWillUnmount() {
        try {
            EventRegister.removeEventListener(this.listener)
            this.focusUserInfo?.remove();
        } catch (error) {

        }
    }

    getUserInfo() {
        let id = this.state.user?.id;
        const model = {
            id: id,
        }
        this.setState({
            loading: true
        }, () => {
            apiActions.getUserPosts(model)
                .then(response => {
                    this.setState({
                        posts: response.data,
                        filteredPosts: response.data,
                    })
                })
                .catch(err => {
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
            filteredPosts = posts.filter(post => post.content.toLowerCase().includes(search.toLowerCase()));
            this.setState({ filteredPosts: filteredPosts });
        }
    };

    onSetting() {
        return this.props.navigation.navigate("Setting");
    }

    render() {
        let { loading, search, user, filteredPosts } = this.state;
        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView, { paddingHorizontal: 10, paddingTop: 20 }]}
                forceInset={{ top: "always" }}
            >
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' }} >
                    <Searchbar style={{ flex: 1, marginHorizontal: 10 }}
                        selectionColor={EStyleSheet.value("$primaryColor")}
                        placeholder="Search" onChangeText={this.updateSearch} value={search} />
                    <TouchableOpacity onPress={() => { this.onSetting() }}>
                        <Image style={styles.setting} source={Images.setting} ></Image>
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Image style={styles.avatar} source={{ uri: user?.photo }} ></Image>
                    <Text name bold style={{ marginTop: 5 }}>{user?.fname + " " + (user?.lname == null ? "" : user?.lname)}</Text>
                    <Text common style={{ textAlign: 'center' }}>{user?.bio}</Text>
                </View>
                <ScrollView style={{ marginTop:10, marginBottom:45, borderTopWidth: 2, borderColor: EStyleSheet.value('$accountBorderColor'), width: '100%',}}>
                    <FlatList
                        data={filteredPosts}
                        numColumns={3}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => {
                            return (
                                <View style={{ padding:3}}>
                                    <Image style={{width:(screenWidth-38)/3, height:(screenWidth-38)/3, resizeMode:'cover'}} source={{uri:item.photo}}></Image>
                                </View>
                            );
                        }}>
                    </FlatList>
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);