import { Responsive, BaseColor } from "@config";
import { getStatusBarHeight } from "react-native-status-bar-height";
import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10000,
    elevation: 10000
  },
  alertBGContainer: {
    paddingHorizontal: Responsive.widthPercentageToDP("8%"),
    paddingTop:
      Responsive.heightPercentageToDP("3%") + getStatusBarHeight(true),
    paddingBottom: Responsive.heightPercentageToDP("3%"),
  },
  alertMainContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageStyle: {
    marginRight: Responsive.widthPercentageToDP("5%"),
    aspectRatio: 1,
  },
  alertTitleStyle: {
    fontSize: Responsive.convertFontScale("18"),
    fontWeight: "900",
    color: '$whiteColor',
    marginVertical: Responsive.heightPercentageToDP("0.5%"),
  },
  alertMessageStyle: {
    fontSize: Responsive.convertFontScale("15"),
    fontWeight: "500",
    color: '$whiteColor',
    marginVertical: Responsive.heightPercentageToDP("0.5%"),
  },
  alertButtonStyle: {
    width: Responsive.widthPercentageToDP("18%"),
    height: Responsive.heightPercentageToDP("4%"),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '$whiteColor',
    borderRadius: Responsive.heightPercentageToDP("2%"),
    marginHorizontal: Responsive.widthPercentageToDP("2%"),
  },
  alertButtonContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: Responsive.heightPercentageToDP("1%"),
  },
  alertButtonTextStyle: {
    fontSize: Responsive.convertFontScale(12),
    fontWeight: "500",
    color: '$blackColor',
  },
});
