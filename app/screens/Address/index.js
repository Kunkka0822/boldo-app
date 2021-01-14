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
const { width: screenWidth } = Dimensions.get('window')
const role = store.getState().auth?.login?.data?.user?.role;
const user = store.getState().auth?.login?.data?.user;

class Address extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            contacts: [],
            filteredContacts: [],
        };

        this.props.navigation.addListener('willFocus', this.getContacts.bind(this));
        this.MessageToastRef = null;
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
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener)
    }

    onBlocks() {
        return this.props.navigation.navigate("Blockeds");
    }

    getContacts() {
        if (store.getState().auth?.login?.success) {
            let id = user.id;
            const model = {
                id: id,
            }

            this.setState({
                loading: true
            }, () => {
                apiActions.getContacts(model)
                    .then(response => {
                        console.log(response.data);
                        this.setState({
                            contacts: response.data,
                            filteredContacts: response.data,
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
    }

    onChat = (item) =>{
        return this.props.navigation.navigate("Chat", {item});
    }

    onBlock(item, index){
        const model = {
            role: role,
            id : item.chatroom.id
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
        let { loading, filteredContacts } = this.state;
        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView, { paddingHorizontal: 10, paddingTop: 20 }]}
                forceInset={{ top: "always" }}
            >
                <Spinner
                    visible={this.state.loading}
                    textContent={'loading...'}
                    textStyle={{color: EStyleSheet.value("$primaryColor")}}
                />

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text title3 blackColor style={{ fontSize: 16, flex:1, textAlign:'center'}} > {"Contacted User Lists"} </Text>
                    <TouchableOpacity onPress={() => { this.onBlocks() }}>
                        <Image style={styles.setting} source={Images.setting} ></Image>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ width:'100%', paddingTop:10}}>
                    {filteredContacts.length>0?<FlatList
                        data={filteredContacts}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => {
                        return (
                            <TouchableOpacity
                            onPress={this.onChat.bind(this, item)}
                            style={{ 
                                padding:8, display:'flex', 
                                flexDirection:'row', alignItems:'center',
                                borderRadius:5,
                                borderWidth:2,
                                marginTop:5,
                                borderColor:EStyleSheet.value("$contentColor")
                                
                                }}>
                                <Image style={{width:40, height:40, borderRadius:40}} source={{uri:item.user.photo}}></Image>
                                <View style={{marginLeft:10, flex:1}}>
                                    <Text title3 blackColor styles={{marginTop:10}}> {role == 1?item.user.fname: (item.user.fname+ " " + item.user.lname)} </Text>
                                </View>
                                <Button onPress={() => {this.onBlock(item, index)}} style={{backgroundColor:EStyleSheet.value('$pendingColor'), height:40}} 
                                    styleText = {{color:EStyleSheet.value('$primaryColor'), fontWeight:'bold'}}>{"Block"}</Button>
                            </TouchableOpacity>
                        ); }} />
                    :<View style={{ alignItems: 'center', justifyContent: 'center' }}><Text title1 style={{ marginTop: 50, color: EStyleSheet.value('$blackColor') }}> There are no contacts</Text></View>
                }</ScrollView>
                <MessageToast config={toastConfig} ref={ref => this.MessageToastRef = ref} />
            </SafeAreaView>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};

export default connect(null, mapDispatchToProps)(Address);