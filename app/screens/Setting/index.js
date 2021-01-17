import React, { Component} from "react"
import { View, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl, Dimensions } from "react-native";
import { BaseStyle, Images, BaseConfig } from "@config";
import { Button, Icon, Text } from "@components";
import * as Utils from "@utils";
import EStyleSheet from 'react-native-extended-stylesheet';
import { apiActions, actionTypes } from "@actions";
import styles from "./styles";
import { Searchbar } from 'react-native-paper';
import IconBadge from 'react-native-icon-badge';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import Spinner from 'react-native-loading-spinner-overlay';
import Dialog from "react-native-dialog";
import { EventRegister } from 'react-native-event-listeners'
const { width: screenWidth } = Dimensions.get('window')
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Textarea from 'react-native-textarea';
import { Picker } from '@react-native-picker/picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Tags from "react-native-tags";
import Toast from 'react-native-easy-toast'
import { connect } from "react-redux";
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { store, SetPrefrence, GetPrefrence } from "@store";
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RNRestart from 'react-native-restart'; 

const items = store.getState().type.types;
const style_items = store.getState().style.styles;

const role = store.getState().auth?.login?.data?.user?.role;

const onLogin = data => {
    return {
        type: actionTypes.LOGIN,
        data
    };
};

class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            user: {},
        };
        this.props.navigation.addListener('willFocus', this.getUserInfo.bind(this));
        this.ToastRef = null;
        this.LocationRef = null;
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
    onClose() {
        this.props.navigation.goBack();
    }

    onSignOut() {
        let id = store.getState().auth?.login?.data.user.id;
       
        const model = {
            id: id,
        }
        this.setState({
            loading: true
        }, () => {
            apiActions.signOut(model)
                .then(response => {
                    const data = {
                        success: false,
                        onboarding: false,
                        data: {},
                    };
                    this.props.dispatch(onLogin(data))

                    setTimeout(() => {
                        try {
                          return RNRestart.Restart();
                        } catch (err) {
                        }
                      }, 500);
                })
                .catch(err => {
                    console.log('err');
                })
                .finally(
                    () => this.setState({ loading: false })
                )
        })
        // return this.props.navigation.navigate("Loading");
    }

    getUserInfo() {
        if (store.getState().auth?.login?.success) {
            let id = store.getState().auth?.login?.data.user.id;
            const model = {
                id: id,
            }

            this.setState({
                loading: true
            }, () => {
                apiActions.getUserProfile(model)
                    .then(response => {
                        this.setState({
                            user: response.data,
                        }, ()=>{
                            if(this.state.user?.role == 1)
                                this.LocationRef?.setAddressText(this.state.user.location);
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

    choosePhoto() {
        let options = {
            title: Utils.translate("auth.select-image"),
            cameraType: 'front',
            mediaType: 'photo',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                alert(response.customButton);
            } else {
                let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setUser('photo', source.uri);
            }
        });
    }

    setUser = (key, value) => {
        let user = this.state.user;
        user[key] = value;

        this.setState({ user: user });
    }

    moreHistory() {

        let histories = this.state.user.histories;
        let temp = { company: "", title: "", years: "", success: { company: true, title: true, years: true } }
        histories.push(temp);
        this.setUser('histories', histories);
    }

    minusHistory() {
        let histories = this.state.user.histories;
        histories.splice(histories.length - 1, 1);
        this.setUser('histories', histories);
    }

    setHistory = (index, key, value) => {
        let histories = this.state.user.histories;
        let history = histories[index];
        if (key.includes(".")) {
            let keys = key.split(".");
            history[keys[0]][keys[1]] = value;
        } else {
            history[key] = value;
        }

        histories[index] = history;
        this.setUser('histories', histories);
    }

    onUpdateProfile() {
        const { navigation } = this.props;
        let { user } = this.state;
        if (user.fname == "") {
            this.ToastRef.show(Utils.translate("Account.invalid-name"));
            return;
        } else if (user.lname == "") {
            this.setState({ success: { ...success, lname: false } });
            this.ToastRef.show(Utils.translate("Account.invalid-name"));
            return;
        } else if (!Utils.EMAIL_VALIDATE.test(String(user.email).toLowerCase())) {
            this.ToastRef.show(Utils.translate("Account.invalid-email"));
            return;
        } 
        if (user.role == 1) {
            if (user.bio == "") {
                this.ToastRef.show(Utils.translate("Account.invalid-bio"));
                return;
            } else if (user.references == "") {
                this.ToastRef.show(Utils.translate("Account.invalid-references"));
                return;
            } else if (user.liquorServingCertification == "") {
                this.ToastRef.show(Utils.translate("Account.invalid-liquorservingcertification"));
                return;
            }  else if (user.typeOfProfessional.length == 0) {
                this.ToastRef.show(Utils.translate("Account.invalid-typeofprofessional"));
                return;
            } else if (user.styleOfCooking.length == 0 && this.hasPermission()) {
                this.setState({ success: {  ...success, styleOfCooking: false} });
                this.ToastRef.show(Utils.translate("Account.invalid-styleofcooking"));
                return;
            } else if (user.location == "") {
                this.ToastRef.show(Utils.translate("Account.invalid-location"));
                return;
            } else if (user.histories.length == 0) {
                this.ToastRef.show(Utils.translate("Account.invalid-histories"));
                return;
            }
        }
        for (let i = 0; i < user.histories.length; i++) {
            let history = user.histories[i];
            if (history.company == "") {
                this.ToastRef.show(Utils.translate("Account.invalid-company"));
                return;
            } else if (history.title == "") {
                this.ToastRef.show(Utils.translate("Account.invalid-title"));
                return;
            } else if (history.years == "") {
                this.ToastRef.show(Utils.translate("Account.invalid-years"));
                return;
            }
        }

        this.setState(
            { loading: true, },
            () => {
                apiActions.updateProfile(this.state.user)
                    .then(async response => {
                        this.onSignOut();
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(
                        () => this.setState({ loading: false })
                    )
            }
        );
    }

    hasPermission() {
        let types = this.state.user.typeOfProfessional;
        let styles = this.state.user.styleOfCooking;
        let hasPermission = false;
        types.forEach(id => {
            const result = items[0].children.filter(item => item.id == id && (item.name == "Chef" || item.name == "Caterer"));
            if (result.length > 0) {
                hasPermission = true;
                return;
            }
        });

        if (!hasPermission) {
            if (styles.length > 0) {
                styles = [];
                this.setUser('styleOfCooking', styles);
            }
        }
        return hasPermission;
    }


    render() {
        let { loading, user } = this.state;
        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView, { backgroundColor: "#fff" }]}
                forceInset={{ top: "always" }}
            >
                <View style={{ flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center", marginTop: 30, paddingHorizontal: 20 }}>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { this.onClose() }}>
                            <Image source={Images.back} ></Image>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: "center" }}>
                        <TouchableOpacity onPress={() => this.setUser('role', true)}>
                            <Text style={user.role ? styles.activeTab : styles.deActiveTab}>  {Utils.translate("auth.professional")}  </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setUser('role', false)}>
                            <Text style={user.role ? styles.deActiveTab : styles.activeTab}>  {Utils.translate("auth.customer")}  </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { this.onSignOut() }}>
                            <Image style={{ width: 20, height: 20 }} source={Images.quit} ></Image>
                        </TouchableOpacity>
                    </View>
                </View>

                <KeyboardAwareScrollView style={{ paddingHorizontal: 30, marginBottom: 30 }} keyboardShouldPersistTaps='always'>
                    <View style={{ flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center", marginVertical: 10 }}>
                        <TouchableOpacity onPress={() => this.choosePhoto()}>
                            <Image source={{ uri: user.photo }} style={styles.blog_user_img} />
                        </TouchableOpacity>
                    </View>
                    <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.fname")} </Text>
                    <TextInput
                        style={[BaseStyle.textInput]}
                        onChangeText={fname => this.setUser('fname', fname)}
                        autoCorrect={false}
                        placeholder={Utils.translate("Account.fname-placeholder")}
                        placeholderTextColor={EStyleSheet.value('$grayColor')}
                        value={user.fname}
                        selectionColor={EStyleSheet.value('$primaryColor')}
                    />
                    <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.lname")} </Text>
                    <TextInput
                        style={[BaseStyle.textInput]}
                        onChangeText={fname => this.setUser('lname', lname)}
                        autoCorrect={false}
                        placeholder={Utils.translate("Account.lname-placeholder")}
                        placeholderTextColor={EStyleSheet.value('$grayColor')}
                        value={user.lname}
                        selectionColor={EStyleSheet.value('$primaryColor')}
                    />
                    <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.email")} </Text>
                    <TextInput
                        style={[BaseStyle.textInput]}
                        onChangeText={email => this.setUser('email', email)}
                        autoCorrect={false}
                        editable={false}
                        placeholder={Utils.translate("Account.email-placeholder")}
                        placeholderTextColor={EStyleSheet.value('$grayColor')}
                        keyboardType={'email-address'}
                        value={user.email}
                        selectionColor={EStyleSheet.value('$primaryColor')}
                    />

                    {user.role == 1 && <>
                        <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.bio")} </Text>
                        <Textarea
                            containerStyle={styles.textareaContainer}
                            style={styles.textarea}
                            onChangeText={bio => this.setUser('bio', bio)}
                            defaultValue={user.bio}
                            placeholder={Utils.translate("Account.bio-placeholder")}
                            placeholderTextColor={EStyleSheet.value('$grayColor')}
                            underlineColorAndroid={'transparent'}
                        />
                        <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.references")} </Text>
                        <TextInput
                            style={[BaseStyle.textInput]}
                            onChangeText={references => this.setUser('references', references)}
                            autoCorrect={false}
                            placeholder={Utils.translate("Account.references-placeholder")}
                            placeholderTextColor={EStyleSheet.value('$grayColor')}
                            value={user.references}
                            selectionColor={EStyleSheet.value('$primaryColor')}
                        />
                        <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.liquor-serving-certification")} </Text>
                        <View style={{ ...(Platform.OS !== 'android' && { zIndex: 10 }) }}>
                            <DropDownPicker
                                items={[
                                    { label: 'Yes', value: 'yes' },
                                    { label: 'No', value: 'no' },
                                ]}
                                defaultValue={user.liquorServingCertification}
                                containerStyle={{ height: 50 }}
                                style={{ backgroundColor: '#fafafa' }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                dropDownStyle={{ backgroundColor: '#fafafa' }}
                                onChangeItem={item => this.setUser('liquorServingCertification', item.value)}
                            />
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text title3 blackColor style={styles.formTextWorkHistory}> {Utils.translate("Account.work-history")} </Text>
                            {user.histories.length > 1 &&
                                <TouchableOpacity style={{ marginLeft: 10, marginRight: 10 }} onPress={() => { this.minusHistory(); }}>
                                    <Icon name={'minus'}></Icon>
                                </TouchableOpacity>}

                            <TouchableOpacity onPress={() => { this.moreHistory(); }}>
                                <Icon name={'plus'}></Icon>
                            </TouchableOpacity>
                        </View>
                        {user.histories.map((item, key) => (
                            <View style={styles.workHistory} key={key}>
                                <TextInput
                                    style={[BaseStyle.textInput, { width: '40%' }]}
                                    onChangeText={company => this.setHistory(key, 'company', company)}
                                    autoCorrect={false}
                                    placeholder={Utils.translate("Account.company-placeholder")}
                                    placeholderTextColor={EStyleSheet.value('$grayColor')}
                                    value={item.company}
                                    selectionColor={EStyleSheet.value('$primaryColor')}
                                />
                                <TextInput
                                    style={[BaseStyle.textInput, { width: '30%', marginHorizontal: '5%' }]}
                                    onChangeText={title => this.setHistory(key, 'title', title)}
                                    autoCorrect={false}
                                    placeholder={Utils.translate("Account.title-placeholder")}
                                    placeholderTextColor={EStyleSheet.value('$grayColor')}
                                    value={item.title}
                                    selectionColor={EStyleSheet.value('$primaryColor')}
                                />
                                <TextInput
                                    style={[BaseStyle.textInput, { width: '20%' }]}
                                    onChangeText={years => this.setHistory(key, 'years', years)}
                                    autoCorrect={false}
                                    placeholder={Utils.translate("Account.years-placeholder")}
                                    placeholderTextColor={EStyleSheet.value('$grayColor')}
                                    keyboardType='numeric'
                                    value={item.years}
                                    selectionColor={EStyleSheet.value('$primaryColor')}
                                />
                            </View>))}

                        <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.typeOfProfessional")} </Text>
                        <View style={styles.locationForm}>
                            <SectionedMultiSelect
                                items={items}
                                IconRenderer={IconMaterial}
                                searchPlaceholderText="Search types"
                                uniqueKey="id"
                                subKey="children"
                                selectText="Choose your types"
                                showDropDowns={false}
                                readOnlyHeadings={true}
                                onSelectedItemsChange={types => this.setUser('typeOfProfessional', types)}
                                selectedItems={user.typeOfProfessional}
                                colors={{
                                    primary: EStyleSheet.value('$primaryColor'),
                                    subText: EStyleSheet.value('$blackColor'),
                                    success: EStyleSheet.value('$primaryColor')
                                }}
                                hideSearch={true}
                                styles={{ container: { marginVertical: Platform.OS !== 'android' ? 150 : 50, paddingTop: 20 }, selectedSubItemText :{color:EStyleSheet.value('$primaryColor')}}}
                            />
                        </View>
                        {this.hasPermission() && <>
                            <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.style-of-cooking")} </Text>
                            <View style={styles.locationForm}>
                                <SectionedMultiSelect
                                    items={style_items}
                                    IconRenderer={IconMaterial}
                                    searchPlaceholderText="Search types"
                                    uniqueKey="id"
                                    subKey="children"
                                    selectText="Choose your styles"
                                    showDropDowns={false}
                                    readOnlyHeadings={true}
                                    onSelectedItemsChange={styles => this.setUser('styleOfCooking', styles)}
                                    selectedItems={user.styleOfCooking}
                                    colors={{
                                        primary: EStyleSheet.value('$primaryColor'),
                                        subText: EStyleSheet.value('$blackColor'),
                                        success: EStyleSheet.value('$primaryColor')
                                    }}
                                    hideSearch={true}
                                    styles={{ container: { marginVertical: Platform.OS !== 'android' ? 150 : 50, paddingTop: 20 } , selectedSubItemText :{color:EStyleSheet.value('$primaryColor')}}}
                                />
                            </View>
                        </>}
                        <Text title3 blackColor style={styles.formText} > {Utils.translate("Account.location")} </Text>
                        <View style={styles.locationForm} >
                            <GooglePlacesAutocomplete
                                placeholder={Utils.translate("Account.location-placeholder")}
                                onPress={(data, details = null) => {
                                    this.setUser('location', data.description);
                                }}
                                query={{
                                    key: 'AIzaSyDMrIaIY6QY_kiOz0VSZkN36HBd4cnfkH8',
                                    language: 'en',
                                }}
                                ref={ref => this.LocationRef = ref}
                            />
                        </View>
                        <Text title3 blackColor style={styles.formText}> {Utils.translate("Account.postal-code")} </Text>
                        <TextInput
                            style={[BaseStyle.textInput]}
                            onChangeText={postalCode => this.setUser('postalCode', postalCode)}
                            placeholder={Utils.translate("Account.postal-code-placeholder")}
                            multiline={false}
                            placeholderTextColor={EStyleSheet.value('$grayColor')}
                            value={user.postalCode}
                            selectionColor={EStyleSheet.value('$primaryColor')}
                        />
                    </>}
                    <View style={{ width: "100%", marginTop: 30 }}>
                        <Button
                            full
                            loading={loading}
                            onPress={() => {
                                if (!loading)
                                    this.onUpdateProfile();
                            }}
                        >
                            {Utils.translate("Account.update-profile")}
                        </Button>
                    </View>
                </KeyboardAwareScrollView>
                <Toast
                    ref={ref => this.ToastRef = ref}
                    position='top'
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    style={{ backgroundColor: EStyleSheet.value('$errorColor'), width: '80%', height: 50, justifyContent: 'center', alignItems: 'center' }}
                    textStyle={{ color: EStyleSheet.value('$whiteColor'), fontWeight: "bold", fontSize: 20 }}
                />
            </SafeAreaView>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};

export default connect(null, mapDispatchToProps)(Setting);
