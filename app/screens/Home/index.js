import React, { Component } from "react"
import { View, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl, Dimensions, TouchableOpacityComponent } from "react-native";
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
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Textarea from 'react-native-textarea';
import { Picker } from '@react-native-picker/picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Tags from "react-native-tags";
import { connect } from "react-redux";
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import { store, SetPrefrence, GetPrefrence } from "@store";
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import RNRestart from 'react-native-restart';
import Slider from '@react-native-community/slider';
import GetLocation from 'react-native-get-location'
import { getDistance, getPreciseDistance } from 'geolib';
import Modal from 'react-native-modal';

const onToast = data => {
  return {
    type: actionTypes.PREF_TOAST,
    data
  };
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: props.auth?.login?.data?.user,
      type_items: [].concat(props.type?.types),
      style_items: [].concat(props.style?.styles),

      pros: [],
      filteredPros: [],

      typeOfProfessional: [],
      styleOfCooking: [],
      location: "",
      distance: 0,
      current: {},
      selectedUser: null,
      showModal: false,
    };
    this.focusPros = this.props.navigation.addListener('focus', this.getPros.bind(this));
    this.focuLocation = this.props.navigation.addListener('focus', this.getLocation.bind(this));

  }

  componentDidMount() {
    let styles = this.state.style_items;
    styles[0].children.push({ id: 100000, name: 'All' });
    this.setState({ style_items: styles });
    this.getPros();
    this.getLocation();
    this.listener = EventRegister.addEventListener('notification', (data) => {
      let type = data._data.type;
      if (type == "new-message") {
      } else if (type == "new-pros") {
      }
    })
  }

  componentWillUnmount() {
    try {
      EventRegister.removeEventListener(this.listener)
      this.focusPros?.remove();
      this.focuLocation?.remove();
    } catch (error) {

    }
  }


  showToast(text1) {
    let toastData = {
      text1: text1,
      text2: null,
      type: 'error',
    }
    this.props.dispatch(onToast(toastData));
  }


  getLocation() {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        this.setState({ current: { lat: location.latitude, lng: location.longitude }, location: "current" });
      })
      .catch(error => {
        console.log('error---->', error);
      })
  }

  getPros() {
    this.setState({
      loading: true
    }, () => {
      apiActions.getPros()
        .then(response => {
          this.setState({
            pros: response.data,
            filteredPros: response.data,
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

  hasPermission() {
    let types = this.state.typeOfProfessional;
    let styles = this.state.styleOfCooking;
    let hasPermission = false;

    types.forEach(id => {
      const result = this.state.type_items[0].children.filter(item => item.id == id && item.style == 1);
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

  filteredPros() {
    let typeOfProfessional = this.state.typeOfProfessional;
    let stylesOfCooking = this.state.styleOfCooking;
    let location = this.state.location;
    let distance = this.state.distance;
    let current = this.state.current;
    let i = 0;
    let count = this.state.pros.length;
    let filteredPros = [];


    let style_items = this.state.style_items;

    for (i = 0; i < count; i++) {
      let chef = this.state.pros[i];
      let bFilter = false;
      if (typeOfProfessional.length > 0) {
        let types = chef.typeOfProfessional;
        bFilter = typeOfProfessional.some(elem => types.indexOf(elem) > -1);
      } else {
        bFilter = true;
      }

      if (bFilter == true) {
        if (stylesOfCooking.length > 0) {
          bFilter = false;
          let styles = chef.styleOfCooking;
          bFilter = stylesOfCooking.some(elem => styles.indexOf(elem) > -1);
          const arrayFilterNameOfAll = style_items[0].children.filter(elem => elem.name == "All");
          if (arrayFilterNameOfAll.length > 0 && !bFilter) {
            let idOfAll = arrayFilterNameOfAll[0].id;
            bFilter = stylesOfCooking.includes(idOfAll)
          }
        }

        if (bFilter) {
          if (distance != 0 && location != "") {
            bFilter = false;
            let geoLocation = chef.geolocation;
            let curLatitude = current.lat
            let curLongitude = current.lng
            let lat = geoLocation.lat
            let lng = geoLocation.lng

            let start = { latitude: curLatitude, longitude: curLongitude }
            let end = { latitude: lat, longitude: lng }
            let distance2Pro = getDistance(start, end);
            if (distance2Pro <= distance * 1000) {
              bFilter = true;
            }
          } else {

          }
        }
      }

      if (bFilter == true) {
        filteredPros.push(chef);
      }
    }

    return filteredPros;
  }

  onChat(item) {
    let id = this.state.user.id;
    const model = {
      user_id: id,
      connect_id: item.id
    }

    this.setState({
      loading: true
    }, () => {
      apiActions.makeChatRoom(model)
        .then(response => {
          let room = response.data;
          if (room.active == 0) {
            this.showToast("You can't make this chat.");
            return;
          }
          return this.props.navigation.navigate("Chat", { room });
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
    let { loading, user, type_items, style_items, styleOfCooking, typeOfProfessional, distance, selectedUser, showModal } = this.state;
    return (
      <SafeAreaView
        style={[BaseStyle.safeAreaView]}
        forceInset={{ top: "always" }}
      >
        <KeyboardAwareScrollView style={{ paddingHorizontal: 20, marginVertical: 45 }} keyboardShouldPersistTaps='handled'
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={this.getPros.bind(this)}
            />}>
          <Text style={{ fontSize: 16, textAlign: 'center' }}> {"What type of Professional are you looking for?"}</Text>
          <View style={{ marginTop: 10, borderWidth: 1, borderRadius: 5, borderStyle: 'solid', borderColor: '$inputBoderColor' }}>
            <SectionedMultiSelect
              items={type_items}
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
          <Text style={{ fontSize: 16, marginTop: 20, color: EStyleSheet.value('$textColor') }} > {"Your Location"} </Text>
          <View style={styles.locationForm} >
            <GooglePlacesAutocomplete
              placeholder={"Your Location"}
              fetchDetails={true}
              onPress={(data, detail) => {
                this.setState({ location: data.description, current: detail.geometry.location });
              }}
              query={{
                key: 'AIzaSyCjCZM8TG6uH8QnEYgEB31aTFzDKQhMF2k',
                language: 'en',
              }}
            />
          </View>
          <View style={{ width: '100%' }}>
            <View style={{ flexDirection: "row" }}>
              <Text title3 blackColor style={{ fontSize: 16, marginTop: 20, flex: 1 }} >
                {"Maximum Distance"}
              </Text>
              <Text title3 blackColor style={{ fontSize: 16, marginTop: 20 }} >
                {distance} {"km"}
              </Text>
            </View>
            <Slider
              style={{ marginTop: 10 }}
              minimumValue={0}
              maximumValue={100}
              step={1}
              onValueChange={distance => this.setState({ distance })}
              minimumTrackTintColor={EStyleSheet.value('$primaryColor')}
              maximumTrackTintColor="#ddd"
            />
          </View>
          {this.filteredPros().length > 0 ?
            <FlatList
              style={{ marginTop: 10 }}
              data={this.filteredPros()}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return (
                  <View style={styles.chef} >
                    <TouchableOpacity onPress={() => {
                      this.setState({ selectedUser: item, showModal: true });
                    }}>
                      <Image style={styles.chefAvatar} source={{ uri: item.photo }}></Image>
                    </TouchableOpacity>
                    <Text style={{ marginTop: 10, textAlign: 'center', fontSize: 16, color: EStyleSheet.value('$textColor') }}> {item.fname + " " + item.lname} </Text>
                    <Text style={{ textAlign: 'center', fontSize: 13, color: EStyleSheet.value('$textColor') }}> {item.typeOfProfessionalNames.join(" | ")} </Text>
                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 13, color: EStyleSheet.value('$textColor') }}> {item.location} </Text>
                    <Button style={{ height: 40, width: '100%', marginTop: 10, borderRadius: 8 }}
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
            <View style={{ alignItems: 'center', justifyContent: 'center' }}><Text style={{ marginTop: 50, fontSize: 25, color: EStyleSheet.value('$blackColor') }}> There are no professionals</Text></View>
          }
        </KeyboardAwareScrollView>
        <Modal isVisible={showModal}>
          <View style={{ backgroundColor: EStyleSheet.value("$contentColor"), borderRadius: 15, height:'70%'}}>
            <ScrollView >
              <View style={{alignItems:'center'}}>
              <Image style={{ width: 80, height: 80, borderRadius: 80, marginTop: 40 }} source={{ uri: selectedUser?.photo }}></Image>
              <View style={{ alignItems: 'center' }}>
                <Text styles={{ marginTop: 10 }}> {selectedUser?.lname + " " + selectedUser?.fname} </Text>
                <Text> {selectedUser?.typeOfProfessionalNames?.length > 0 && selectedUser?.typeOfProfessionalNames.join(" | ")} </Text>
                <Text style={{ textAlign: 'center', paddingHorizontal: 20 }}> {selectedUser?.bio} </Text>
                <Text style={{ textAlign: 'center', paddingHorizontal: 20 }}> {selectedUser?.location} </Text>
              </View>
              <View style={{ alignItems: 'center', flex:1}}>
                {
                  selectedUser?.histories.map((item, index) => {
                    return (<View>
                      <Text style={{ textAlign: 'center', paddingHorizontal: 20, marginTop: 20, fontWeight: 'bold', fontSize: 16 }}>Working Histories</Text>
                      <View style={{ borderWidth: 1, borderColor: EStyleSheet.value('$inputBoderColor') }}>
                        <Text style={{ textAlign: 'center', paddingHorizontal: 20, fontSize: 14, color: EStyleSheet.value('$blackColor') }}>Company: {item.company}</Text>
                        <Text style={{ textAlign: 'center', paddingHorizontal: 20, fontSize: 14, color: EStyleSheet.value('$blackColor') }}>Title: {item.title}</Text>
                        <Text style={{ textAlign: 'center', paddingHorizontal: 20, fontSize: 14, color: EStyleSheet.value('$blackColor') }}>Years: {item.years}</Text>
                      </View>
                    </View>)
                  })
                }
              </View>
              <Button onPress={() => { this.setState({ showModal: false }) }} style={{ height: 40, marginHorizontal: 80, marginBottom: 20, marginTop: 20 }} >
                {Utils.translate('messages.close')}</Button>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => (state);
const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);