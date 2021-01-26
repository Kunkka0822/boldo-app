import React, { Component } from "react"
import { View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl, Dimensions, } from "react-native";
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
import { EventRegister } from 'react-native-event-listeners'
import Modal from 'react-native-modal';
import MessageToast, { BaseToast } from 'react-native-toast-message';
import { connect } from "react-redux";
import Toast from 'react-native-toast-message';
import Textarea from 'react-native-textarea';

const onNotification = data => {
    return {
        type: actionTypes.PREF_NOTIFICATIONS,
        data
    };
};
const { width: screenWidth } = Dimensions.get('window')

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

class Recipes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            search: '',
            user: props.auth?.login?.data?.user,
            recipes: [],
            filteredRecipes: [],
            _carousel: '',
            showDetails: false,
            selectedRecipe: {},
        };
        this.focusRecipes = this.props.navigation.addListener('focus', this.getRecipes.bind(this));
        this.focusNotification = this.props.navigation.addListener('focus', this.manageBadge.bind(this));
    }

    componentDidMount() {
        this.listener = EventRegister.addEventListener('notification', (data) => {
            let type = data._data.type;
            if (type == "new-message") {

            } else if (type == "new-recipe") {
                this.getRecipes();
            }
        })
        this.getRecipes();
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
        if (notificationDatas.recipes > 0) {
            notificationDatas.recipes = 0;
            this.props.dispatch(onNotification(notificationDatas));
        }
    }

    getRecipes() {
        this.setState({
            loading: true
        }, () => {
            apiActions.getRecipes()
                .then(response => {
                    this.setState({
                        recipes: response.data,
                        filteredRecipes: response.data
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

    onItemPress = (item) => {
        this.setState({
            showDetails: true,
            selectedRecipe: item,
        })
        let id = this.state.user.id;
        if (item.user_id != id) {
            const model = {
                user_id: id,
                recipe_id: item.id
            }
            apiActions.viewRecipe(model)
                .then(response => {
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

    updateSearch = (search) => {
        let filteredRecipes = this.state.recipes.filter(x => String(x.title.toLowerCase()).includes(search.toLowerCase()) ||
            String(x.content.toLowerCase()).includes(content.toLowerCase()));
        this.setState({
            filteredRecipes: filteredRecipes,
            search
        });
    }

    _renderItem({ item, index }, parallaxProps) {
        return (
            <TouchableOpacity onPress={this.onItemPress.bind(this, item)} style={styles.item}>
                <ParallaxImage
                    source={{ uri: item.photo }}
                    containerStyle={styles.imageContainer}
                    style={styles.image}
                    parallaxFactor={0.3}
                    {...parallaxProps}
                />
                <View style={styles.overlay} />
                <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                </Text>
            </TouchableOpacity>
        );
    }

    gotoAccount() {
        return this.props.navigation.navigate("Profile");
    }

    onUploadRecipe() {
        return this.props.navigation.navigate("NewRecipe");
    }

    onClosePress() {
        this.setState({
            showDetails: false,
        })
    }


    render() {
        let { loading, search, user, recipes, filteredRecipes, _carousel, showDetails, selectedRecipe } = this.state;

        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView, { paddingHorizontal: 10, paddingTop: 20 }]}
                forceInset={{ top: "always" }}
            >
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { this.gotoAccount() }}>
                        <Image style={styles.avatar} source={{ uri: user?.photo }} ></Image>
                    </TouchableOpacity>
                    <Searchbar style={{ flex: 1, marginHorizontal: 10, }}
                        selectionColor={EStyleSheet.value("$primaryColor")}
                        placeholder="Search" onChangeText={this.updateSearch} value={search} />
                </View>

                <View style={{ marginTop: 10 }}>
                    <Carousel
                        sliderWidth={screenWidth}
                        sliderHeight={screenWidth - 150}
                        itemWidth={screenWidth - 200}
                        data={filteredRecipes}
                        renderItem={this._renderItem.bind(this)}
                        hasParallaxImages={true}
                    />
                </View>
                <Text style={{ marginTop: 30, marginBottom: 10, fontSize: 25 }}>  {Utils.translate("recipes.most-recent-recipes")}</Text>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={this.getRecipes.bind(this)}
                    />
                } style={{ paddingHorizontal: 10, marginBottom: 40 }}>
                    <FlatList
                        data={filteredRecipes}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            return (
                                <View>
                                    <TouchableOpacity onPress={this.onItemPress.bind(this, item)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={{ uri: item.photo }} style={{ width: 80, height: 60, borderRadius: 4, marginVertical: 5 }}></Image>
                                        <View style={{ marginLeft: 10, flex: 1 }}>
                                            <Text style={{ color: EStyleSheet.value('$textColor'), fontSize: 15, fontWeight: 'bold' }}> {item.title}</Text>
                                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <Icon name={(item.count && item.count > 0) ? 'eye' : 'eye-slash'} size={14} style={{ marginTop: 2, marginLeft: 2 }} color={EStyleSheet.value("$primaryColor")}></Icon>
                                                <Text style={{ color: EStyleSheet.value("$primaryColor") }}> {(item.count && item.count > 0) ? item.count : ''} </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                    />
                </ScrollView>
                {user.role == 1 && <TouchableOpacity
                    style={{ alignItems: 'flex-end', width: 40, position: 'absolute', right: 10, bottom: 40 }}
                    onPress={() => { this.onUploadRecipe() }}
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

                <Modal isVisible={showDetails} >
                    <View style={{ backgroundColor: EStyleSheet.value('$whiteColor'), borderRadius: 15 }}>
                        <View style={{ paddingHorizontal: 20, marginTop: 20, flexDirection: 'row' }}>
                            <View style={{flex:1, flexDirection:'row'}} >
                                <Image style={styles.avatar} source={{ uri: selectedRecipe?.user?.photo }} ></Image>
                                <Text style={{marginLeft:20, fontSize: 16, marginTop: 10, textAlign: 'center', fontWeight:'bold' }}>{selectedRecipe?.user?.fname + selectedRecipe?.user?.lname?selectedRecipe?.user?.lname:''}</Text>
                            </View>
                            <TouchableOpacity onPress={() => { this.onClosePress() }} >
                                <Icon name='times' size={20} color={EStyleSheet.value("$primaryColor")}></Icon>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '100%', height: '90%' }}>
                            <Text style={{ fontSize: 20, marginTop: 10, textAlign: 'center', fontWeight: 'bold' }}>{selectedRecipe.title}</Text>
                            <ScrollView style={{ borderRadius: 10, marginVertical: 10, width: '100%' }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, marginTop: 10, textAlign: 'center' }}>{selectedRecipe.content}</Text>
                                    <Text style={{ fontSize: 16, marginTop: 10, textAlign: 'center' }}>{selectedRecipe.content}</Text>
                                    <Image style={{ width: Dimensions.get('window').width - 60, height: Dimensions.get('window').width - 100, marginTop: 10, borderRadius: 10 }}
                                        source={{ uri: selectedRecipe.photo }} />
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

            </SafeAreaView>);
    }
}

const mapStateToProps = (state) => (state);
const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Recipes);