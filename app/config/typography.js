import EStyleSheet from "react-native-extended-stylesheet";

export const FontFamily = {

};

export const FontWeight = {
  thin: "100",
  ultraLight: "200",
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  heavy: "800",
  black: "900"
};

export const Typography = EStyleSheet.create({
  common: {
    fontSize: 15,
    fontWeight: FontWeight.medium,
    fontFamily: FontFamily.default
  },
  name: {
    fontSize: 15,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.default
  },
  button: {
    fontSize: 17,
    fontWeight: FontWeight.bold,
    fontFamily: FontFamily.default
  },
});
