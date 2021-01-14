import React, { Component } from "react"
import { View, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl } from "react-native";
import { BaseStyle, Images, BaseConfig } from "@config";
import { Button, Icon, Text } from "@components";
import * as Utils from "@utils";
import EStyleSheet from 'react-native-extended-stylesheet';
import { apiActions } from "@actions";
import { store } from "@store";
import styles from "./styles";
import { Searchbar, TextInput } from 'react-native-paper';
import IconBadge from 'react-native-icon-badge';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import { EventRegister } from 'react-native-event-listeners'
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
const items = store.getState().type.types;
const style_items = store.getState().style.styles;
const role = store.getState().auth?.login?.data?.user?.role;
const user = store.getState().auth?.login?.data?.user;
export default class Pending extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            search: '',
            BadgeCount: 0,
            pendings: [],
            filteredPending: [],
            showDialog: false,
        };
        this.props.navigation.addListener('willFocus', this.getPendings.bind(this));
        // this.props.navigation.addListener('willFocus',this.getBadge.bind(this));
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
        this.mounted = true;
    }
    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener)
    }

    updateSearch = (search) => {
        let filteredData = this.state.pendings.filter(x => String(x.user_pending.fname.toLowerCase()).includes(search.toLowerCase()) ||
            String(x.user_pending.lname.toLowerCase()).includes(search.toLowerCase()));
        this.setState({
            filteredPending: filteredData,
            search
        });
    };

    getPendings() {
        if (store.getState().auth?.login?.success) {
            let id = store.getState().auth?.login?.data.user.id;
            const model = {
                id: id,
            }

            this.setState({
                loading: true
            }, () => {
                apiActions.getPendings(model)
                    .then(response => {
                        this.setState({
                            pendings: response.pendings,
                            filteredPending: response.pendings
                        })
                    })
                    .catch(err => {
                        console.log('err');
                    })
                    .finally(
                        () => this.setState({ loading: false })
                    )
            })
        }
    }

    getBadge() {
        if (store.getState().auth?.login?.success) {
            let id = store.getState().auth?.login?.data.user.id;
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

    gotoAccount() {
        return this.props.navigation.navigate("Account");
    }

    onPending = (item) => {
        const model = {
            id: item.id,
        }
        this.setState({
            loading: true
        }, () => {
            apiActions.removePending(model)
                .then(response => {
                    this.getPendings();
                })
                .catch(err => {
                })
                .finally(
                    () => this.setState({ loading: false })
                )
        })
    }

    gotoReceives() {
        return this.props.navigation.navigate("Receives");
    }

    render() {
        let { loading, search, BadgeCount, pendings, filteredPending, showDialog } = this.state;
        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView, { paddingHorizontal: 10, paddingTop: 20 }]}
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
                        </TouchableOpacity>} */}
                </View>
                <ScrollView style={{ marginTop: 30, backgroundColor: EStyleSheet.value('$contentColor') }} refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={this.getPendings.bind(this)}
                    />
                }>
                    {filteredPending.length > 0 && <FlatList
                        data={filteredPending}
                        numColumns={2}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            return (
                                <View style={styles.chef} >
                                    <Image style={styles.chefAvatar} source={{ uri: item.user_pending.photo }}></Image>
                                    <Text title3 blackColor styles={{ marginTop: 10 }}> {item.user_pending.fname + " " + item.user_pending.lname} </Text>
                                    <Text style={{ flex: 1 }} caption1 blackColor> {item.user_pending.typeOfProfessional.join(" | ")} </Text>
                                    <Button style={{
                                        height: 35, width: '100%',
                                        marginTop: 20, borderRadius: 8,
                                        backgroundColor: EStyleSheet.value('$primaryColor')
                                    }}
                                        styleText={{ color: EStyleSheet.value('$whiteColor') }}
                                        onPress={() => {
                                            this.onPending(item);
                                        }}
                                    >
                                        {Utils.translate("connect.cancel")}
                                    </Button>
                                </View>
                            );
                        }}
                    />}
                    {filteredPending.length == 0 &&
                        <Text title3 blackColor styles={{ marginTop: 10 }}> There are no connections waiting for approval </Text>
                    }
                </ScrollView>
                <View>
                    <Dialog.Container visible={showDialog}>
                        <Dialog.Title>Pending delete</Dialog.Title>
                        <Dialog.Description>
                            Do you want to delete this pending? You can connect again.
                    </Dialog.Description>
                        <Dialog.Button label="Cancel" />
                        <Dialog.Button label="Delete" />
                    </Dialog.Container>
                </View>
                <MessageToast config={toastConfig} ref={ref => this.MessageToastRef = ref} />
            </SafeAreaView>
        );
    }
}