import React, { Component } from "react"
import {View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl, Dimensions, } from "react-native";
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
import { EventRegister } from 'react-native-event-listeners'
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
const { width: screenWidth } = Dimensions.get('window')
const role = store.getState().auth?.login?.data?.user?.role;
const user = store.getState().auth?.login?.data?.user;

export default class Recipes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            search: '',
            BadgeCount:0,
            recipes:[],
            filteredRecipes:[],
            _carousel : '',
            showImage : false,
            selectedRecipe : {},
        };
        this.props.navigation.addListener('willFocus',this.getRecipes.bind(this));
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


    onUploadRecipe(){
        return this.props.navigation.navigate("NewRecipe");
    }

    onDot(item){
        console.log(item);
    }

    updateSearch = (search) => {
        let filteredData = this.state.recipes.filter(x => String(x.title.toLowerCase()).includes(search.toLowerCase()));
        this.setState({ 
            filteredRecipes : filteredData,
            search
         });
    };

    onItemPress = (item)=>{
        this.setState({
            showImage:true,
            selectedRecipe : item,
        })
        let id = store.getState().auth?.login?.data.user.id;
        if(item.user_id != id){
            const model={
                user_id : id,
                recipe_id:item.id
            }
            apiActions.viewRecipe(model)
            .then(response=>  {
                console.log(response.data);
            })
            .catch(err =>{
                console.log(err);
            })
        }
    }

    onClosePress = ()=>{
        this.setState({
            showImage:false,
          })
    }

    getRecipes(){
        if (store.getState().auth?.login?.success) {
            let id = user.id;
            const model={
                id : id,
            }

            this.setState({
                loading:true
              }, ()=>{
                apiActions.getRecipes(model)
                  .then(response=>  {
                      this.setState({
                        recipes:response.data,
                        filteredRecipes:response.data
                      })
                  })
                  .catch(err =>{
                    console.log(err);
                  })
                  .finally(
                    () => this.setState({ loading: false })
                  )
              })
        }
    }

    getBadge(){
        if (store.getState().auth?.login?.success) {
            let id = user.id;
            const model={
                id : id,
            }

            this.setState({
                loading:true
              }, ()=>{
                apiActions.getBadge(model)
                  .then(response=>  {
                      this.setState({
                       BadgeCount:response.badge,
                    })
                  })
                  .catch(err =>{
                    console.log(err);
                  })
                  .finally(
                    () => this.setState({ loading: false })
                  )
              })
        }

    }

    _renderItem ({item, index}, parallaxProps) {
        return (
            <TouchableOpacity onPress={this.onItemPress.bind(this, item)} style={styles.item}>
                <ParallaxImage
                    source={{ uri: item.photo }}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    parallaxFactor={0.4}
                    {...parallaxProps}
                />
                <View style={styles.overlay} />
                <Text title3 bold style={styles.title} numberOfLines={2}>
                    { item.title }
                </Text>
            </TouchableOpacity>
        );
    }
    gotoAccount(){
        return this.props.navigation.navigate("Account");
    }

    gotoReceives(){
        return this.props.navigation.navigate("Receives");
    }
    
    render() {
        let { loading, search, posts, filteredPost, _carousel, recipes, filteredRecipes, isPro, showImage, selectedRecipe} = this.state;
        
        return (
        <SafeAreaView
        style={[BaseStyle.safeAreaView, {paddingHorizontal:10, paddingTop:20}]}
        forceInset={{ top: "always" }}
        >
            <View style={{flexDirection: 'row',  paddingHorizontal:10, alignItems: 'center'}}>
                <TouchableOpacity onPress={() => {this.gotoAccount()}}>
                    <Image style={styles.avatar} source={{uri:store.getState().auth?.login?.data?.user?.photo}} ></Image>
                </TouchableOpacity>
                <Searchbar style={{flex:1, marginHorizontal:10,}} 
                selectionColor={EStyleSheet.value("$primaryColor")}
                placeholder="Search" onChangeText={this.updateSearch} value={search}/>
                {/* {role == 1 && 
                <TouchableOpacity onPress={() => {this.gotoReceives()}}>
                    <IconBadge
                        MainElement={
                            <Image style={styles.bell}  source={Images.bell} ></Image>
                        }
                        BadgeElement={
                            <Text overline style={{
                                color: EStyleSheet.value("$whiteColor")
                            }}>
                                {this.state.BadgeCount}
                            </Text>
                        }
                        IconBadgeStyle={{
                            width:20,
                            height:20,
                            backgroundColor: EStyleSheet.value("$primaryColor")
                        }}
                        Hidden={this.state.BadgeCount==0}
                    />
                </TouchableOpacity>} */}
            </View>
            <View >
                <Text title3 bold blackColor style={{marginTop:20, marginBottom:20}}> {Utils.translate("recipes.recipes")} </Text>
                <Carousel
                    sliderWidth={screenWidth}
                    sliderHeight={screenWidth-150}
                    itemWidth={screenWidth - 200}
                    data={filteredRecipes}
                    renderItem={this._renderItem.bind(this)}
                    hasParallaxImages={true}
                />
            </View>
            <Text title3 style={{marginTop:30, marginBottom:10}}>  {Utils.translate("recipes.most-recent-recipes")}</Text>
            <ScrollView refreshControl={
                    <RefreshControl
                    refreshing={loading}
                    onRefresh={this.componentDidMount.bind(this)}
                    />
                } style={{paddingHorizontal:10}}>
                <FlatList
                    data={filteredRecipes}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => {
                        return (
                            <View>
                                <TouchableOpacity onPress={this.onItemPress.bind(this, item)} style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                    <Image source={{uri : item.photo}} style={{width:80, height:60, borderRadius:4, marginVertical:5}}></Image>
                                    <View style={{marginLeft:10, flex:1}}>
                                        <Text captain bold> {item.title}</Text>
                                        <View style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                            <Image source={(item.reviews && item.reviews.length>0)?Images.eye:Images.no_eye} style={{width:16, height:16}}></Image>
                                            <Text captain bold style={{color:EStyleSheet.value("$primaryColor")}}> {(item.reviews&&item.reviews.length>0)?item.reviews.length:''} </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                />
            </ScrollView>
            <Modal isVisible={showImage} >
                <View style={{flex: 1, alignItems:'flex-end', marginVertical:30, width:'100%',}}>
                    <TouchableOpacity style={{marginTop:40}} onPress={this.onClosePress.bind(this)}>
                        <Image source={Images.close_white} style={{width:16, height:16}}></Image>
                    </TouchableOpacity>
                    <ScrollView style={{padding:10, marginTop:10, backgroundColor:EStyleSheet.value('$whiteColor'),  borderRadius:10}}>
                        <Text bold style={{fontSize:20, marginTop:20}}>{selectedRecipe.title}</Text>
                        <Text style={{fontSize:16, marginTop:20}}>{selectedRecipe.content}</Text>
                        <Image style={{width:Dimensions.get('window').width-60, height:Dimensions.get('window').width-100, marginTop:10, borderRadius:10}}
                            source={{uri:selectedRecipe.photo}}/>
                    </ScrollView>
                </View>
            </Modal>
            
            {role == 1
                &&
                <TouchableOpacity style={{paddingHorizontal:20}}
                    onPress={this.onUploadRecipe.bind(this)}>
                    <View style={{
                        marginBottom:10,
                        height:50,
                        borderRadius:8,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor:EStyleSheet.value("$primaryColor")
                        }}>
                        <Text title3 whiteColor>{Utils.translate("recipes.upload-recipe")}</Text>
                    </View>
                </TouchableOpacity>
            }
            <MessageToast config={toastConfig} ref={ref => this.MessageToastRef = ref} />
        </SafeAreaView>);
    }
}

