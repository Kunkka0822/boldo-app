import React, { Component } from "react";
import {
    Platform, PermissionsAndroid, View, TouchableOpacity,
    TextInput, SafeAreaView, ScrollView, Image
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { BaseStyle, BaseConfig, Images, } from "@config";
import { Icon, Button, Text } from "@components";
import styles from "./styles";
import * as Utils from "@utils";
import AlertPro from "react-native-alert-pro";
import { apiActions, actionTypes } from "@actions";
import EStyleSheet from 'react-native-extended-stylesheet';
import { Appearance } from 'react-native-appearance'
import Textarea from 'react-native-textarea';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Tags from "react-native-tags";
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import IconFeather from 'react-native-vector-icons/Feather';
import { store, SetPrefrence, GetPrefrence } from "@store";
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import style from "../../reducers/style";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import RNRestart from 'react-native-restart';
import { EventRegister } from 'react-native-event-listeners'
import { connect } from "react-redux";

const toastConfig = {
    success: () => { },
    error: ({ text1 }) => (
        <View
            style={{
                paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center',
                height: 50, width: '80%', backgroundColor: EStyleSheet.value('$errorColor'), borderRadius: 25
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
            user: { ...store.getState().auth?.login?.data?.user },
            type_items: [].concat(store.getState().type.types),
            style_items: [].concat(store.getState().style.styles),
        };
    }

    componentDidMount() {
        this.listener = EventRegister.addEventListener('notification', (data) => {
            if (data == "new-message") {
                console.log("new message received");
            }
        })

        console.log("asdf", this.state.user);
    }

    componentWillUnmount() {
        EventRegister.removeEventListener(this.listener)
    }

    onClose() {
        return this.props.navigation.goBack();
    }

    onSignOut() {
        let id = this.state.user.id;
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
    }

    setUser = (key, value) => {
        let user = this.state.user;
        user[key] = value;
        this.setState({ user: user });
    }

    choosePhoto() {
        let options = {
            title: Utils.translate("auth.select-image"),
            includeBase64: true,
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
                let source = { uri: 'data:image/jpeg;base64,' + response.base64 };
                this.setUser('photo', source.uri);
            }
        });
    }

    hasPermission() {
        let types = this.state.user.typeOfProfessional;
        let styles = this.state.user.styleOfCooking;
        let hasPermission = false;
        let type_items = this.state.type_items;

        types.forEach(id => {
            const result = type_items[0].children.filter(item => item.id == id && item.style == 1);
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

    onUpdateProfile() {
        const { navigation } = this.props;
        let { user } = this.state;
        if (user.fname == "") {
            Toast.show({ text1: Utils.translate("Account.invalid-name"), type: 'error' });
            return;
        } else if (!Utils.EMAIL_VALIDATE.test(String(user.email).toLowerCase())) {
            Toast.show({ text1: Utils.translate("Account.invalid-email"), type: 'error' });
            return;
        }

        if (user.role == 1) {
            if (user.bio == "") {
                Toast.show({text1: Utils.translate("Account.invalid-bio"), type:'error'});
                return;
            } else if (user.references == "") {
                Toast.show({text1: Utils.translate("Account.invalid-references"), type:'error'});
                return;
            } else if (user.liquorServingCertification == "") {
                Toast.show({text1: Utils.translate("Account.invalid-liquorservingcertification"), type:'error'});
                return;
            }  else if (user.typeOfProfessional.length == 0) {
                Toast.show({text1: Utils.translate("Account.invalid-typeofprofessional"), type:'error'});
                return;
            } else if (user.styleOfCooking.length == 0 && this.hasPermission()) {
                Toast.show({text1: Utils.translate("Account.invalid-styleofcooking"), type:'error'});
                return;
            } else if (user.location == "") {
                Toast.show({text1: Utils.translate("Account.invalid-location"), type:'error'});
                return;
            } else if (user.histories.length == 0) {
                Toast.show({text1: Utils.translate("Account.invalid-histories"), type:'error'});
                return;
            }
        }
        for (let i = 0; i < user.histories.length; i++) {
            let history = user.histories[i];
            if (history.company == "") {
                Toast.show({text1: Utils.translate("Account.invalid-company"), type:'error'});
                return;
            } else if (history.title == "") {
                Toast.show({text1: Utils.translate("Account.invalid-title"), type:'error'});
                return;
            } else if (history.years == "") {
                Toast.show({text1: Utils.translate("Account.invalid-years"), type:'error'});
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

    render() {
        let { loading, user, type_items, style_items } = this.state;
        return (
            <SafeAreaView
                style={[BaseStyle.safeAreaView, { paddingHorizontal: 10, }]}
                forceInset={{ top: "always" }}
            >
                <View style={{ flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center", marginTop: 20, paddingHorizontal: 20 }}>
                    <TouchableOpacity onPress={() => { this.onClose() }}>
                        <Image source={Images.back} style={{ width: 20, height: 20, resizeMode: 'cover' }} ></Image>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => { this.setUser('role', true) }}>
                            <Text style={user.role ? styles.activeTab : styles.deActiveTab}>  {Utils.translate("auth.professional")}  </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.setUser('role', false) }}>
                            <Text style={user.role ? styles.deActiveTab : styles.activeTab}>  {Utils.translate("auth.customer")}  </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { this.onSignOut() }}>
                            <Image style={{ width: 20, height: 20 }} source={Images.quit} ></Image>
                        </TouchableOpacity>
                    </View>
                </View>
                <KeyboardAwareScrollView style={{ paddingHorizontal: 20, marginBottom: 30 }} keyboardShouldPersistTaps='handled'>
                    <View style={{ flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center", marginVertical: 10 }}>
                        <TouchableOpacity onPress={() => this.choosePhoto()} style={{ flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
                            <Image source={{ uri: user.photo }} style={styles.blog_user_img} />
                            <Text blackColor style={{ marginTop: 5 }}>  {Utils.translate("auth.upload-photo")}  </Text>
                        </TouchableOpacity>
                    </View>
                    <Text name style={styles.formText}> {Utils.translate("Account.fname")} </Text>
                    <TextInput
                        style={[BaseStyle.textInput]}
                        onChangeText={fname => this.setUser('fname', fname)}
                        autoCorrect={false}
                        placeholder={Utils.translate("Account.fname-placeholder")}
                        placeholderTextColor={EStyleSheet.value('$placeColor')}
                        value={user.fname}
                        selectionColor={EStyleSheet.value('$primaryColor')}
                    />
                    <Text name style={styles.formText}> {Utils.translate("Account.lname")} </Text>
                    <TextInput
                        style={[BaseStyle.textInput]}
                        onChangeText={lname => this.setUser('lname', lname)}
                        autoCorrect={false}
                        placeholder={Utils.translate("Account.lname-placeholder")}
                        placeholderTextColor={EStyleSheet.value('$placeColor')}
                        value={user.lname}
                        selectionColor={EStyleSheet.value('$primaryColor')}
                    />

                    <Text name style={styles.formText}> {Utils.translate("Account.email")} </Text>
                    <TextInput
                        style={[BaseStyle.textInput]}
                        onChangeText={email => this.setUser('email', email)}
                        autoCorrect={false}
                        editable={false}
                        placeholder={Utils.translate("Account.email-placeholder")}
                        placeholderTextColor={EStyleSheet.value('$placeColor')}
                        keyboardType={'email-address'}
                        value={user.email}
                        selectionColor={EStyleSheet.value('$primaryColor')}
                    />

                    {user.role == 1 && <>
                        <Text name style={styles.formText}> {Utils.translate("Account.bio")} </Text>
                        <Textarea
                            containerStyle={styles.textareaContainer}
                            style={styles.textarea}
                            onChangeText={bio => this.setUser('bio', bio)}
                            defaultValue={user.bio}
                            placeholder={Utils.translate("Account.bio-placeholder")}
                            placeholderTextColor={EStyleSheet.value('$placeColor')}
                            underlineColorAndroid={'transparent'}
                        />

                        <Text name style={styles.formText}> {Utils.translate("Account.references")} </Text>
                        <TextInput
                            style={[BaseStyle.textInput]}
                            onChangeText={references => this.setUser('references', references)}
                            autoCorrect={false}
                            placeholder={Utils.translate("Account.references-placeholder")}
                            placeholderTextColor={EStyleSheet.value('$placeColor')}
                            value={user.references}
                            selectionColor={EStyleSheet.value('$primaryColor')}
                        />
                        <Text name style={styles.formText}> {Utils.translate("Account.liquor-serving-certification")} </Text>
                        <View style={{ ...(Platform.OS !== 'android' && { zIndex: 10 }) }}>
                            <DropDownPicker
                                items={[
                                    { label: 'Yes', value: 'yes' },
                                    { label: 'No', value: 'no' },
                                ]}
                                defaultValue={user.liquorServingCertification}
                                containerStyle={{ height: 46 }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                labelStyle={{
                                    fontSize: 15,
                                    textAlign: 'left',
                                    color: EStyleSheet.value('$textColor')
                                }}
                                onChangeItem={item => this.setUser('liquorServingCertification', item.value)}
                            />
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text name style={styles.formTextWorkHistory}> {Utils.translate("Account.work-history")} </Text>
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
                                    placeholderTextColor={EStyleSheet.value('$placeColor')}
                                    value={item.company}
                                    selectionColor={EStyleSheet.value('$primaryColor')}
                                />
                                <TextInput
                                    style={[BaseStyle.textInput, { width: '30%', marginHorizontal: '5%' }]}
                                    onChangeText={title => this.setHistory(key, 'title', title)}
                                    autoCorrect={false}
                                    placeholder={Utils.translate("Account.title-placeholder")}
                                    placeholderTextColor={EStyleSheet.value('$placeColor')}
                                    value={item.title}
                                    selectionColor={EStyleSheet.value('$primaryColor')}
                                />
                                <TextInput
                                    style={[BaseStyle.textInput, { width: '20%' }]}
                                    onChangeText={years => this.setHistory(key, 'years', years)}
                                    autoCorrect={false}
                                    placeholder={Utils.translate("Account.years-placeholder")}
                                    placeholderTextColor={EStyleSheet.value('$placeColor')}
                                    keyboardType='numeric'
                                    value={item.years}
                                    selectionColor={EStyleSheet.value('$primaryColor')}
                                />
                            </View>))}

                        <Text name style={styles.formText}> {Utils.translate("Account.typeOfProfessional")} </Text>
                        <View style={styles.locationForm}>
                            <SectionedMultiSelect
                                items={type_items}
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
                                styles={{ container: { marginVertical: Platform.OS !== 'android' ? 150 : 50, paddingTop: 20 }, selectedSubItemText: { color: EStyleSheet.value('$primaryColor') } }}
                            />
                        </View>

                        {this.hasPermission() && <>
                            <Text name style={styles.formText}> {Utils.translate("Account.style-of-cooking")} </Text>
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
                                    styles={{ container: { marginVertical: Platform.OS !== 'android' ? 150 : 50, paddingTop: 20 }, selectedSubItemText: { color: EStyleSheet.value('$primaryColor') } }}
                                />
                            </View>
                        </>}
                        <Text name style={styles.formText} > {Utils.translate("Account.location")} </Text>
                        <View style={styles.locationForm} >
                            <GooglePlacesAutocomplete
                                placeholder={Utils.translate("Account.location-placeholder")}
                                fetchDetails={true}
                                onPress={(data, detail) => {
                                    this.setUser('location', data.description);
                                    this.setUser('geolocation', detail.geometry.location);
                                }}
                                query={{
                                    key: 'AIzaSyCjCZM8TG6uH8QnEYgEB31aTFzDKQhMF2k',
                                    language: 'en',
                                }}
                                ref={ref => this.LocationRef = ref}
                            />
                        </View>
                        <Text name style={styles.formText}> {Utils.translate("Account.postal-code")} </Text>
                        <TextInput
                            style={[BaseStyle.textInput]}
                            onChangeText={postalCode => this.setUser('postalCode', postalCode)}
                            placeholder={Utils.translate("Account.postal-code-placeholder")}
                            multiline={false}
                            placeholderTextColor={EStyleSheet.value('$placeColor')}
                            value={user.postalCode}
                            selectionColor={EStyleSheet.value('$primaryColor')}
                        />
                    </>}
                    <View style={{ width: "100%", marginTop: 10, }}>
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
                <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
            </SafeAreaView>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        dispatch
    };
};

export default connect(null, mapDispatchToProps)(Setting);