import EStyleSheet from 'react-native-extended-stylesheet';

export default EStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "$whiteColor"
  },
  logo: {
    width: 240,
    height: 240
  },
  loading: {
    color: "$blackColor"
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },

  chefAvatar: {
    width: 80,
    height: 80,
    borderRadius: 80,
    marginTop: 10
  },

  chef:{
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin:'1%',
    backgroundColor:'$whiteColor',
    padding:10,
    width:'48%',
    alignItems: 'center',
    borderRadius:5
},

});
