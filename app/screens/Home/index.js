import React, { Component } from "react"
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
import MessageToast, { BaseToast } from 'react-native-toast-message';
import Slider from '@react-native-community/slider';
import GetLocation from 'react-native-get-location'
import {getDistance, getPreciseDistance} from 'geolib';

const { width: screenWidth } = Dimensions.get('window')
const items = store.getState().type.types;
const style_items = store.getState().style.styles;
const role = store.getState().auth?.login?.data?.user?.role;
const user = store.getState().auth?.login?.data?.user;

const toastConfig = {
  success: ({ text1, text2, ...props }) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#69C779' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
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


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      typeOfProfessional: [],
      styleOfCooking: [],
      chefs: [],
      location: "",
      distance : 0,
      current:{},
    };
    this.props.navigation.addListener('willFocus', this.getPros.bind(this));
    this.props.navigation.addListener('willFocus', this.getLocation.bind(this));
    this.MessageToastRef = null;
  }

  componentDidMount() {
    this.listener = EventRegister.addEventListener('notification', (data) => {
      let type = data._data.type;

      if (type == "new-message") {
        this.MessageToastRef.show({
          text1: data._title,
          text2: data._body
        });
      }
    })
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
    EventRegister.removeEventListener(this.listener)

  }

  getPros() {
    if (store.getState().auth?.login?.success) {
      let id = user.id;
      const model = {
        id: id,
      }
      this.setState({
        loading: true
      }, () => {
        apiActions.getPros(model)
          .then(response => {
            this.setState({
              chefs: response.data,
            }, () => {
            })
          })
          .catch(err => {
            console.log('err---->', err);
          })
          .finally(
            () => this.setState({ loading: false })
          )
      })
    }
  }

  getLocation(){
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
    .then(location => {
      console.log(location);

      this.setState({current:location});
    })
    .catch(error => {
      console.log('error---->', error);
    })
  }

  filterChefs() {
    let typeOfProfessional = this.state.typeOfProfessional;
    let stylesOfCooking = this.state.styleOfCooking;
    let location = this.state.location;
    let distance = this.state.distance;
    let current = this.state.current;
    let i = 0;
    let count = this.state.chefs.length;
    let filteredChefs = [];

    for (i = 0; i < count; i++) {
      let chef = this.state.chefs[i];
      let bFilter = false;
      if (typeOfProfessional.length > 0) {
        let types = chef.typeOfProfessional;
        bFilter = typeOfProfessional.some(elem => types.indexOf(elem) > -1);
      } else {
        bFilter = true;
      }

     if(bFilter == true){
      if (stylesOfCooking.length > 0) {
        bFilter = false;
        let styles = chef.styleOfCooking;
        bFilter = stylesOfCooking.some(elem => styles.indexOf(elem) > -1);
      }

      if(bFilter){
        if (location != "") {
          bFilter = false;
          bFilter = chef.location.toLowerCase().includes(location.toLowerCase())
        }
      }

      if(bFilter){
        if(distance != 0){
          bFilter = false;
          let geoLocation = chef.geolocation;
          let curLatitude = current.latitude
          let curLongitude = current.longitude
          let lat = geoLocation.lat
          let lng = geoLocation.lng
  
          let start = {latitude:curLatitude, longitude:curLongitude}
          let end = {latitude:lat, longitude:lng}
          let distance2Pro = getDistance(start, end);
          console.log(distance2Pro);
          if(distance2Pro <= distance*1000){
            bFilter = true;
          }
        }
      }
     }

      if (bFilter == true) {
        filteredChefs.push(chef);
      }
    }

    return filteredChefs;
  }

  hasPermission() {
    let types = this.state.typeOfProfessional;
    let styles = this.state.styleOfCooking;
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
        this.setState({ styleOfCooking: styles });
      }
    }
    return hasPermission;
  }

  gotoAccount() {
    return this.props.navigation.navigate("Account");
  }

  onConnect(item) {
    if (store.getState().auth?.login?.success) {
      let id = store.getState().auth?.login?.data.user.id;
      const model = {
        id: id,
        user_id: item.id
      }
      this.setState({
        loading: true
      }, () => {
        apiActions.sendConnect(model)
          .then(response => {
            this.getPros();
          })
          .catch(err => {
          })
          .finally(
            () => this.setState({ loading: false })
          )
      })
    }
  }

  onChat(item){
    let id = store.getState().auth?.login?.data.user.id;
    const model = {
      id: id,
      oposit_id: item.id
    }
    this.setState({
      loading: true
    }, () => {
      apiActions.makeChatRoom(model)
        .then(response => {
          let item = response.data;
          return this.props.navigation.navigate("Chat", { item });
        })
        .catch(err => {
          console.log(err);
        })
        .finally(
          () => this.setState({ loading: false })
        )
    })
  }

  render() {
    let { loading, styleOfCooking, typeOfProfessional, location, distance } = this.state;
    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView, { backgroundColor: "#fff" }]}
        forceInset={{ top: "always" }}
      >
        <ScrollView style={{ paddingHorizontal: 20, marginTop: 30 }} keyboardShouldPersistTaps='always'
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={this.getPros.bind(this)}
            />}>
          <Text style={{ fontSize: 16 }}> {"What type of Professional are you looking for?"}</Text>
          <View style={{ marginTop: 10, borderWidth: 1, borderRadius: 5, borderStyle: 'solid', borderColor: '$inputBoderColor', }}>
            <SectionedMultiSelect
              items={items}
              IconRenderer={IconMaterial}
              searchPlaceholderText=""
              uniqueKey="id"
              subKey="children"
              selectText="Your Types"
              showDropDowns={false}
              readOnlyHeadings={true}
              onSelectedItemsChange={types => this.setState({ typeOfProfessional: types })}
              selectedItems={typeOfProfessional}
              colors={{
                primary: EStyleSheet.value('$primaryColor'),
                subText: EStyleSheet.value('$blackColor'),
                success: EStyleSheet.value('$primaryColor')
              }}
              showChips={false}
              hideSearch={true}
              styles={{
                container: { marginVertical: Platform.OS !== 'android' ? 150 : 50, paddingTop: 20 },
                selectedItem: { textColor: EStyleSheet.value('$primaryColor') }, selectedSubItemText: { color: EStyleSheet.value('$primaryColor') }
              }}
            />
          </View>
          {this.hasPermission() && <>
            <Text style={{ fontSize: 16, marginTop: 20 }}> {"What style of cooking are you looking for?"}</Text>
            <View style={{ marginTop: 10, borderWidth: 1, borderRadius: 5, borderStyle: 'solid', borderColor: '$inputBoderColor', }}>
              <SectionedMultiSelect
                items={style_items}
                IconRenderer={IconMaterial}
                searchPlaceholderText=""
                uniqueKey="id"
                subKey="children"
                selectText="Your Styles"
                showDropDowns={false}
                readOnlyHeadings={true}
                onSelectedItemsChange={styles => this.setState({ styleOfCooking: styles })}
                selectedItems={styleOfCooking}
                colors={{
                  primary: EStyleSheet.value('$primaryColor'),
                  subText: EStyleSheet.value('$blackColor'),
                  success: EStyleSheet.value('$primaryColor')
                }}
                showChips={false}
                hideSearch={true}
                styles={{
                  container: { marginVertical: Platform.OS !== 'android' ? 150 : 50, paddingTop: 20 },
                  selectedItem: { textColor: EStyleSheet.value('$primaryColor') }, selectedSubItemText: { color: EStyleSheet.value('$primaryColor') }
                }}
              />
            </View>
          </>}

          <Text title3 blackColor style={{ fontSize: 16, marginTop: 20 }} > {Utils.translate("Account.location")} </Text>
          {/* <View style={{ marginTop: 10, borderWidth: 1, borderRadius: 5, borderStyle: 'solid', borderColor: '$inputBoderColor', }} >
            <GooglePlacesAutocomplete
              placeholder={Utils.translate("Account.location-placeholder")}
              onPress={(data, details = null) => {
                this.setState({ location: data.description });
              }}
              query={{
                key: 'AIzaSyDMrIaIY6QY_kiOz0VSZkN36HBd4cnfkH8',
                language: 'en',
              }}
            />
          </View> */}
          <TextInput
            style={[BaseStyle.textInput]}
            onChangeText={location => this.setState({ location })}
            placeholder={Utils.translate("Account.location-placeholder")}
            multiline={false}
            placeholderTextColor={EStyleSheet.value('$grayColor')}
            value={location}
            selectionColor={EStyleSheet.value('$primaryColor')}
          />
          <View style={{width: '100%'}}>
            <View style={{flexDirection:"row"}}>
              <Text title3 blackColor style={{ fontSize: 16, marginTop: 20, flex:1 }} >
                {"Maximum Distance"}
              </Text>
              <Text title3 blackColor style={{ fontSize: 16, marginTop: 20 }} >
                {distance} {"km"}
              </Text>
            </View>
            <Slider
              style={{marginTop:10}}
              minimumValue={0}
              maximumValue={100}
              step={1}
              onValueChange={distance=>this.setState({distance})}
              minimumTrackTintColor={EStyleSheet.value('$primaryColor')}
              maximumTrackTintColor="#ddd"
            />
          </View>
          {this.filterChefs().length > 0 ?
            <FlatList
              style={{ marginTop: 10 }}
              data={this.filterChefs()}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return (
                  <View style={styles.chef} >
                    <Image style={styles.chefAvatar} source={{ uri: item.photo }}></Image>
                    <Text title3 blackColor styles={{ marginTop: 10 }}> {item.fname + " " + item.lname} </Text>
                    <Text caption1 blackColor> {item.typeOfProfessionalNames.join(" | ")} </Text>
                    <Text style={{ flex: 1, textAlign: 'center' }} caption1 blackColor> {item.location} </Text>
                    <Button style={{ height: 35, width: '100%', marginTop: 10, borderRadius: 8 }}
                      onPress={() => {
                        if (!loading)
                          this.onChat(item);
                      }}
                    >
                      {"Chat"}
                    </Button>
                  </View>
                );
              }}
            /> :
            <View style={{ alignItems: 'center', justifyContent: 'center' }}><Text title1 style={{ marginTop: 50, color: EStyleSheet.value('$blackColor') }}> There are no professionals</Text></View>
          }
        </ScrollView>
        <MessageToast config={toastConfig} ref={ref => this.MessageToastRef = ref} />
      </SafeAreaView>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(null, mapDispatchToProps)(Home);