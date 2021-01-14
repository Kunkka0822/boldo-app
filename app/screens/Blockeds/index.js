import React, { Component, useReducer } from "react"
import {View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl, Dimensions} from "react-native";
import { BaseStyle, Images, BaseConfig } from "@config";
import { Button, Icon, Text} from "@components";
import * as Utils from "@utils";
import EStyleSheet from 'react-native-extended-stylesheet';
import { apiActions} from "@actions";
import { store} from "@store";
import styles from "./styles";
import { Searchbar } from 'react-native-paper';
import IconBadge from 'react-native-icon-badge';
import Carousel,  { ParallaxImage } from 'react-native-snap-carousel';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import { EventRegister } from 'react-native-event-listeners'

const { width: screenWidth } = Dimensions.get('window')
const role = store.getState().auth?.login?.data?.user?.role;
const user = store.getState().auth?.login?.data?.user;

export default class Blockeds extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            users: [],
        };
        this.props.navigation.addListener('willFocus',this.getBlocks.bind(this));

    }
   
    componentDidMount() {
        this.listener = EventRegister.addEventListener('notification', (data) => {
            console.log('data', data);
            if(data == "new-message"){
                console.log("new message received");
            }
        })
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener)
    }
    onClose(){
        this.props.navigation.goBack();
    }

    onRemove = (id, index) =>{
        const model={
            id : id,
            role:role
        }
        this.setState({
            loading:true
        }, ()=>{
            apiActions.removeBlock(model)
                .then(response=>  {
                    let users = this.state.users;
                    users.splice(index, 1);
                    this.setState({users:users});
                })
                .catch(err =>{
                })
                .finally(
                () => this.setState({ loading: false })
            )
        })
    }

  
    getBlocks(){
        const model={
            id : user.id,
        }

        this.setState({
            loading:true
        }, ()=>{
            apiActions.getBlocks(model)
                .then(response=>  {
                    this.setState({users:response.data});
                })
                .catch(err =>{
                })
                .finally(
                () => this.setState({ loading: false })
            )
        })
    }
    
    
    render() {
        let { loading, users} = this.state;
        return (
            <SafeAreaView
            style={[BaseStyle.safeAreaView, {paddingHorizontal:10, paddingTop:20}]}
            forceInset={{ top: "always" }}
            >
                <Spinner
                    visible={this.state.loading}
                    textContent={'loading...'}
                    textStyle={{color: EStyleSheet.value("$primaryColor")}}
                />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => {this.onClose()}}>
                        <Image  source={Images.back} ></Image>
                    </TouchableOpacity>
                    <Text title3 blackColor style={{ fontSize: 16, flex:1, textAlign:'center'}} > {"Blocked User Lists"} </Text>
                </View>
                <ScrollView refreshControl={
                    <RefreshControl
                    refreshing={loading}
                    onRefresh={this.componentDidMount.bind(this)}
                    />
                }>
                     <FlatList
                        data={users}
                        style={{marginTop:20}}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => {
                            return (
                                <View style={{ 
                                    padding:3, display:'flex', 
                                    flexDirection:'row', alignItems:'center', 
                                    marginVertical:10,
                                    borderBottomWidth:2,
                                    borderColor:EStyleSheet.value('$bottomColor')
                                    }}>
                                    <Image style={{width:40, height:40, borderRadius:40}} source={{uri:item.user.photo}}></Image>
                                    <View style={{marginLeft:10, flex:1}}>
                                        <Text title3 blackColor styles={{marginTop:10}}> {role == 1 ? item.user.fname:item.user.fname + " " + item.user.lname} </Text>
                                    </View>
                                    <Button onPress={this.onRemove.bind(this, item.id, index)} style={{backgroundColor:EStyleSheet.value('$pendingColor'), height:40, marginHorizontal:3}} 
                                        styleText = {{color:EStyleSheet.value('$primaryColor'), fontWeight:'bold'}}>{"Remove"}</Button>
                                </View>
                            );
                        }}
                    />

                </ScrollView>
            </SafeAreaView>
        )
    }
}