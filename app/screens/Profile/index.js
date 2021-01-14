import React, { Component } from "react"
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
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
const { width: screenWidth } = Dimensions.get('window')

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            search:'',
            activePost:true,
            isPro : true,
            posts:[],
            users:[],
            filteredPosts : [],
            filteredUsers : [],
        };
        this.props.navigation.addListener('willFocus',this.getUserInfo.bind(this));

    }
    componentDidMount() {
        if(store.getState().auth?.login?.data?.user?.role != 1) {
           this.setState({ 
                activePost : false,
                isPro: false
            });
        }
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
    onSetting(){
        return this.props.navigation.navigate("Setting");
    }
    updateSearch = (search) => {
        let filteredData = this.state.users.filter(x => String(x.user_pending.name.toLowerCase()).includes(search.toLowerCase()));
        this.setState({ 
            filteredUsers : filteredData,
            search
         });
    };

    onRemove = (id) =>{
        const model={
            id : id,
        }

        this.setState({
            loading:true
        }, ()=>{
            apiActions.removePending(model)
                .then(response=>  {
                    this.getUserInfo();
                })
                .catch(err =>{
                    console.log('err');
                    console.log(err);
                })
                .finally(
                () => this.setState({ loading: false })
            )
        })
    }

    getUserInfo(){
        if (store.getState().auth?.login?.success) {
            let id = store.getState().auth?.login?.data.user.id;
            const model={
                id : id,
            }

            this.setState({
                loading:true
            }, ()=>{
                apiActions.getUserInfo(model)
                    .then(response=>  {
                        this.setState({
                            posts:response.posts,
                            users:response.users,
                            filteredPosts:response.posts,
                            filteredUsers:response.users,
                        })
                    })
                    .catch(err =>{
                        console.log('err');
                        console.log(err);
                    })
                    .finally(
                        () => this.setState({ loading: false })
                )
            })
        }
    }
    
    render() {
        let { loading, search, activePost, isPro, filteredPosts, filteredUsers} = this.state;
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
                    <Searchbar style={{flex:1, marginHorizontal:10, height:40}} 
                    selectionColor={EStyleSheet.value("$primaryColor")}
                    placeholder="Search" onChangeText={this.updateSearch} value={search}/>
                    <TouchableOpacity onPress={() => {this.onSetting()}}>
                        <Image style={styles.setting} source={Images.setting} ></Image>
                    </TouchableOpacity>
                </View>

                <View style={{alignItems:'center', marginTop:40}}>
                    <Image style={styles.avatar} source={{uri:store.getState().auth?.login?.data?.user?.photo}} ></Image>
                    <Text title1 bold>{store.getState().auth?.login?.data?.user?.name}</Text>
                    <Text caption style={{textAlign:'center', paddingHorizontal:20}}>{store.getState().auth?.login?.data?.user?.bio}</Text>
                </View>

                <View style={{marginTop:30, justifyContent:'center', display:'flex', flexDirection:'row'}}>
                    <TouchableOpacity onPress={() => {this.setState({activePost:true})}}>
                        <Text title3 bold style={activePost?styles.activeTab:styles.deActiveTab}>  {Utils.translate("Account.posts")}  </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {this.setState({activePost:false})}}>
                        <Text title3 bold style={activePost?styles.deActiveTab:styles.activeTab}>  {Utils.translate("Account.connections")}  </Text>
                    </TouchableOpacity>
                </View>
                <View style={{borderTopWidth:2, borderColor:EStyleSheet.value('$accountBorderColor'), width:'100%', paddingTop:20}}>
                    { activePost&&
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
                        }}
                        />
                    }
                    { !activePost&&
                        <FlatList
                            data={filteredUsers}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({item}) => {
                            return (
                                <View style={{ padding:3, display:'flex', flexDirection:'row', alignItems:'center'}}>
                                    <Image style={{width:40, height:40, borderRadius:40}} source={{uri:item.user.photo}}></Image>
                                    <View style={{marginLeft:10, flex:1}}>
                                        <Text title3 bold blackColor styles={{marginTop:10}}> {item.user.name} </Text>
                                        <Text caption blackColor> {item.user.typeOfProfessional.join(" | ")} </Text>
                                    </View>
                                    <Button onPress={this.onRemove.bind(this, item.id)} style={{backgroundColor:EStyleSheet.value('$pendingColor'), height:40}} 
                                        styleText = {{color:EStyleSheet.value('$primaryColor'), fontWeight:'bold'}}>{Utils.translate('Account.remove')}</Button>
                                </View>
                            );
                        }}
                        />
                    }
                </View>
            </SafeAreaView>
        )
    }
}