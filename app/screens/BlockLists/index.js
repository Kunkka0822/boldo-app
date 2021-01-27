import React, { Component, useReducer } from "react"
import { View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl, Dimensions } from "react-native";
import { BaseStyle, Images, BaseConfig } from "@config";
import { Button, Icon, Text } from "@components";
import * as Utils from "@utils";
import EStyleSheet from 'react-native-extended-stylesheet';
import { apiActions } from "@actions";
import { store } from "@store";
import styles from "./styles";
import { Searchbar } from 'react-native-paper';
import IconBadge from 'react-native-icon-badge';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import { EventRegister } from 'react-native-event-listeners'
import Textarea from 'react-native-textarea';
import { connect } from "react-redux";

class BlockLists extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            rooms: [],
            user: props.auth?.login?.data?.user,
        };
        this.focusBlockLists = this.props.navigation.addListener('focus', this.getBlocks.bind(this));
    }

    componentDidMount() {
        this.listener = EventRegister.addEventListener('notification', (data) => {
            if (data == "new-message") {
            }
        })
        this.getBlocks();
    }

    componentWillUnmount() {
        try {
            EventRegister.removeEventListener(this.listener)
            this.focusBlockLists?.remove();
        } catch (error) {

        }
    }

    onClose() {
        this.props.navigation.goBack();
    }

    onRemove = (item, index) => {
        const model = {
            user_id: this.state.user.id,
            room_id : item.id
        }
        this.setState({
            loading: true
        }, () => {
            apiActions.removeBlock(model)
                .then(response => {
                    let rooms = this.state.rooms;
                    rooms.splice(index, 1);
                    this.setState({ rooms: rooms });
                })
                .catch(err => {
                })
                .finally(
                    () => this.setState({ loading: false })
                )
        })
    }


    getBlocks() {
        const model = {
            user_id: this.state.user.id,
        }
        this.setState({
            loading: true
        }, () => {
            apiActions.getBlocks(model)
                .then(response => {
                    this.setState({rooms: response.data });
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(
                    () => this.setState({ loading: false })
                )
        })
    }

    onChat(room) {
        return this.props.navigation.navigate("Chat", { room });
    }

    render() {
        let { loading, rooms, user} = this.state;
        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView]}
                forceInset={{ top: "always" }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom:10, paddingHorizontal:10, paddingTop:20}}>
                    <TouchableOpacity onPress={() => { this.onClose() }}>
                        <Image source={Images.back} style={{ width: 20, height: 20, resizeMode: 'cover' }} ></Image>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, flex: 1, textAlign: 'center' }} > {"Blocked User Lists"} </Text>
                </View>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={this.getBlocks.bind(this)}
                    />
                }>
                    {rooms.length > 0 ?
                        <FlatList
                        data={rooms}
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
                                    <TouchableOpacity onPress={() => { this.onRemove(item, index) }} >
                                        <Icon name="handshake" size={20} color={EStyleSheet.value("$primaryColor")}></Icon>
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

export default connect(mapStateToProps, mapDispatchToProps)(BlockLists);