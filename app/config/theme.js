
import EStyleSheet from 'react-native-extended-stylesheet';
/**
 * Common basic style defines
 */
export const BaseStyle = EStyleSheet.create({
  textInput: {
    height: 46,
    color: '$textColor',
    padding: 8,
    fontSize: 15,
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
    backgroundColor: '$contentColor'
  }
});
