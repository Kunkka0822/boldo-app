import { Image, View, Platform} from 'react-native';
import React, { useEffect } from 'react';
import { Button } from 'react-native-elements';
import Onboarding from '../../custom_module/react-native-onboarding-swiper-custom';
import { Images} from "@config";
import styles from "./styles";
import EStyleSheet from 'react-native-extended-stylesheet';

const skip = (navigation) => {
  try {
    return navigation.navigate("SignIn");

  } catch (err) {
  }
}

const done = (navigation) => {
  return navigation.navigate("SignIn");
}

const Square = ({ isLight, selected }) => {
  let backgroundColor;
  let width;
  backgroundColor = selected ? EStyleSheet.value('$primaryColor') : 'rgba(0, 0, 0, 0.3)';
  width = selected ? 40 : 30;
  return (
    <View
      style={{
        width: width,
        height: 8,
        marginHorizontal: 3,
        backgroundColor,
        borderRadius: 4,
      }}
    />
  );
};
const backgroundColor = isLight => (isLight ? 'blue' : 'lightblue');
const color = isLight => backgroundColor(!isLight);
const Done = ({ isLight, ...props }) => (
  <Button
    title={'Done'}
    buttonStyle={{
      backgroundColor: EStyleSheet.value('$primaryColor'),
    }}
    containerViewStyle={{
      marginVertical: 10,
      width: 70,
      backgroundColor: backgroundColor(isLight),
    }}
    titleStyle={{ color: EStyleSheet.value('$whiteColor') }}
    {...props}
  />
);

const Skip = ({ isLight, skipLabel, ...props }) => (
  <Button
    title={'Skip'}
    buttonStyle={{
      backgroundColor: EStyleSheet.value('$transparent'),
      height: Platform.OS == 'ios' ? 40 : 20,
    }}
    titleStyle={{ color: EStyleSheet.value('$blackColor') }}
    {...props}
  >
  </Button>
);

const Next = ({ isLight, ...props }) => (
  <Button
    title={'Next'}
    buttonStyle={{
      backgroundColor: EStyleSheet.value('$primaryColor'),
    }}
    containerViewStyle={{
      marginVertical: 10,
      width: 70,
      backgroundColor: backgroundColor(isLight),
    }}
    titleStyle={{ color: EStyleSheet.value('$whiteColor') }}
    {...props}
  />
);

const Onboard = ({ navigation }) => {
  return <Onboarding
    DotComponent={Square}
    NextButtonComponent={Next}
    SkipButtonComponent={Skip}
    DoneButtonComponent={Done}
    bottomBarHeight={150}
    onDone={() => done(navigation)}
    onSkip={() => skip(navigation)}
    pages={[
      {
        backgroundColor: EStyleSheet.value('$contentColor'),
        image: <Image source={Images.onboading1} style={{height:200, resizeMode:'contain'}}/>,
        title: 'Hospitality Services On Demand',
        subtitle: `Choose from a wide selection of hospitality professionals.\nYou connect with and deal directly with the professionals themselves.`,
        titleStyles: { color: EStyleSheet.value('$blackColor'), fontWeight: 'bold', fontSize: 20 },
        subTitleStyles: { fontSize: 17, color:EStyleSheet.value('$textColor')}
      },
      {
        backgroundColor: EStyleSheet.value('$contentColor'),
        image: <Image source={Images.onboading2_1} style={{height:200, resizeMode:'contain'}} />,
        title: 'Leading Talent',
        subtitle: `Consumers can connect with local chefs, caterers, bartenders and other hospitality professionals who have signed up on Boldo for services they need.`,
        titleStyles: { color: EStyleSheet.value('$blackColor'), fontWeight: 'bold', fontSize: 20 },
        subTitleStyles: { fontSize: 17, color:EStyleSheet.value('$textColor')}
      },
    ]}
  />
};
export default Onboard;