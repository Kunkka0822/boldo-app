import { Typography, FontWeight } from "@config";
import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  default: {
    height: 56,
    borderRadius: 8,
    backgroundColor: '$primaryColor',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20
  },
  textDefault: {
    ...Typography.headline,
    color: '$whiteColor',
    fontWeight: FontWeight.semibold
  },
  outline: {
    backgroundColor: '$transparent',
    borderWidth: 1,
    borderColor: '$primaryColor'
  },
  textOuline: {
    color: '$primaryColor'
  },
  full: {
    width: "100%",
    alignSelf: "auto"
  },
  round: {
    borderRadius: 28
  },
});
