import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "$contentColor"
  },
  logo: {
    width: 240,
    height: 240
  },
  loading: {
    color: "$primaryColor"
  }
});
