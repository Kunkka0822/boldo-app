
import EStyleSheet from 'react-native-extended-stylesheet';
/**
 * Common basic style defines
 */
export const BaseStyle = EStyleSheet.create({
  tabBar: {
    shadowColor: '$whiteColor',
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    backgroundColor: '$whiteColor'
  },
  textInput: {
    height: 46,
    color: '$blackColor',
    padding: 8,
    width: "100%",
    justifyContent: "center",
    borderRadius: 5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle:'solid',
    borderColor:'$inputBoderColor'
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: '$lightField'
  }
});
